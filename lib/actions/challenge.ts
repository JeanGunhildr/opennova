"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// ============================================================
// TYPES
// ============================================================

export interface CreateChallengeResult {
success: boolean;
challengeId?: string;
error?: string;
}

export interface JoinChallengeResult {
success: boolean;
entryId?: string;
error?: string;
}

// ============================================================
// STORAGE
// ============================================================

/**

* Upload file ke Supabase Storage.
* Mengembalikan public URL atau storage path.
  */
  async function uploadToStorage(
  supabase: Awaited<ReturnType<typeof createClient>>,
  file: File,
  folder: string
  ): Promise<string | null> {
  if (!file || !(file instanceof File) || file.size === 0) {
  return null;
  }

const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");

const uniqueName = `${folder}/${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 7)}-${cleanName}`;

const arrayBuffer = await file.arrayBuffer();
const buffer = Buffer.from(arrayBuffer);

const { data, error } = await supabase.storage
.from("challenges")
.upload(uniqueName, buffer, {
contentType: file.type || "application/octet-stream",
upsert: true,
});

if (error) {
console.error(`[Upload Error] Folder: ${folder}`, error);

 
// Jika upload gagal, tetap simpan path sebagai fallback.
return uniqueName;
 

}

const { data: publicUrlData } = supabase.storage
.from("challenges")
.getPublicUrl(data.path);

return publicUrlData?.publicUrl || data.path;
}

// ============================================================
// CREATE CHALLENGE
// ============================================================

export async function createChallengeAction(
formData: FormData
): Promise<CreateChallengeResult> {
try {
const supabase = await createClient();

 
// --------------------------------------------------------
// 1. AUTH
// --------------------------------------------------------

const {
  data: { user },
  error: authError,
} = await supabase.auth.getUser();

if (authError || !user) {
  return {
    success: false,
    error: "Sesi telah berakhir. Silakan login kembali.",
  };
}

// --------------------------------------------------------
// 2. PASTIKAN SEEKER PROFILE ADA
// --------------------------------------------------------

const { data: seekerProfile } = await supabase
  .from("seeker_profiles")
  .select("user_id")
  .eq("user_id", user.id)
  .maybeSingle();

if (!seekerProfile) {
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();

  const { error: insertSeekerError } = await supabase
    .from("seeker_profiles")
    .insert({
      user_id: user.id,
      company_name: profile?.full_name || "Perusahaan",
      representative_name: profile?.full_name || "Perwakilan",
      legal_document_path: "verified",
    });

  if (insertSeekerError) {
    console.error(
      "Gagal membuat seeker_profile:",
      insertSeekerError
    );

    return {
      success: false,
      error:
        "Profil Seeker tidak ditemukan. Pastikan Anda terdaftar sebagai Seeker.",
    };
  }
}

// --------------------------------------------------------
// 3. UPLOAD BERKAS
// --------------------------------------------------------

const thumbnailFile = formData.get("thumbnail") as File | null;
const copyrightFile = formData.get(
  "copyright_agreement"
) as File | null;

let thumbnailPath: string | null = null;
let copyrightPath: string | null = null;

if (thumbnailFile && thumbnailFile.size > 0) {
  thumbnailPath = await uploadToStorage(
    supabase,
    thumbnailFile,
    "thumbnails"
  );
}

if (copyrightFile && copyrightFile.size > 0) {
  copyrightPath = await uploadToStorage(
    supabase,
    copyrightFile,
    "copyright-agreements"
  );
}

// --------------------------------------------------------
// 4. DATA UTAMA CHALLENGE
// --------------------------------------------------------

const name = (formData.get("name") as string)?.trim();

const categoryId =
  (formData.get("category_id") as string)?.trim() || null;

const description =
  (formData.get("description") as string)?.trim() || null;

const prizePool = Number(formData.get("prize_pool")) || 0;

const creationFee = Math.floor(prizePool * 0.1);

const totalPayment = prizePool + creationFee;

const expertWeight =
  Number(formData.get("expert_weight")) || 50;

const pitchWeight =
  Number(formData.get("pitch_weight")) || 50;

const openEnd = formData.get("open_end") as string;

const deadline = openEnd
  ? new Date(openEnd).toISOString()
  : new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    ).toISOString();

if (!name) {
  return {
    success: false,
    error: "Judul challenge wajib diisi.",
  };
}

// --------------------------------------------------------
// VALIDASI TANGGAL MULAI
// --------------------------------------------------------

const openStartRaw = formData.get(
  "open_start"
) as string | null;

if (openStartRaw) {
  const openStartDate = new Date(openStartRaw);

  const todayMidnight = new Date();
  todayMidnight.setHours(0, 0, 0, 0);

  if (openStartDate < todayMidnight) {
    return {
      success: false,
      error:
        "Tanggal mulai challenge tidak boleh sebelum hari ini.",
    };
  }
}

// --------------------------------------------------------
// 5. INSERT CHALLENGE
// --------------------------------------------------------
//
// challenge_status kamu:
// pending | rejected | ongoing | judging | final_pitch | completed
//
// Jadi JANGAN menggunakan "draft".
//

const { data: challenge, error: challengeError } =
  await supabase
    .from("challenges")
    .insert({
      seeker_id: user.id,
      category_id: categoryId,
      name,
      description,
      thumbnail_path: thumbnailPath,
      copyright_agreement_path: copyrightPath,
      prize_pool: prizePool,
      creation_fee: creationFee,
      total_payment: totalPayment,
      deadline,
      status: "pending",
      expert_weight: expertWeight,
      pitch_weight: pitchWeight,
    })
    .select("id")
    .single();

if (challengeError || !challenge) {
  console.error(
    "Gagal membuat challenge:",
    challengeError
  );

  return {
    success: false,
    error: `Gagal menyimpan challenge: ${
      challengeError?.message || "Terjadi kesalahan"
    }`,
  };
}

const challengeId = challenge.id;

// --------------------------------------------------------
// 6. OBJECTIVES
// --------------------------------------------------------

const rawObjectives = formData.getAll(
  "objectives"
) as string[];

const objectivesToInsert = rawObjectives
  .map((text) => text.trim())
  .filter(Boolean)
  .map((content) => ({
    challenge_id: challengeId,
    content,
  }));

if (objectivesToInsert.length > 0) {
  const { error: objError } = await supabase
    .from("challenge_objectives")
    .insert(objectivesToInsert);

  if (objError) {
    console.error(
      "Gagal simpan objectives:",
      objError
    );
  }
}

// --------------------------------------------------------
// 7. REQUIREMENTS
// --------------------------------------------------------

const rawRequirements = formData.getAll(
  "requirements"
) as string[];

const requirementsToInsert = rawRequirements
  .map((text) => text.trim())
  .filter(Boolean)
  .map((content) => ({
    challenge_id: challengeId,
    content,
  }));

if (requirementsToInsert.length > 0) {
  const { error: reqError } = await supabase
    .from("challenge_requirements")
    .insert(requirementsToInsert);

  if (reqError) {
    console.error(
      "Gagal simpan requirements:",
      reqError
    );
  }
}

// --------------------------------------------------------
// 8. JUDGING CRITERIA
// --------------------------------------------------------

const expertTitles = formData.getAll(
  "expert_criteria"
) as string[];

const expertDescs = formData.getAll(
  "expert_criteria_description"
) as string[];

const pitchTitles = formData.getAll(
  "pitch_criteria"
) as string[];

const pitchDescs = formData.getAll(
  "pitch_criteria_description"
) as string[];

const criteriaToInsert = [
  ...expertTitles.map((title, i) => ({
    challenge_id: challengeId,
    stage: "expert_judging",
    name: title.trim(),
    description: expertDescs[i]?.trim() || null,
  })),

  ...pitchTitles.map((title, i) => ({
    challenge_id: challengeId,
    stage: "final_pitch",
    name: title.trim(),
    description: pitchDescs[i]?.trim() || null,
  })),
].filter((criterion) => criterion.name.length > 0);

if (criteriaToInsert.length > 0) {
  const { error: critError } = await supabase
    .from("judging_criteria")
    .insert(criteriaToInsert);

  if (critError) {
    console.error(
      "Gagal simpan criteria:",
      critError
    );
  }
}

// --------------------------------------------------------
// 9. TIMELINE
// --------------------------------------------------------

const openStart =
  (formData.get("open_start") as string) || null;

const expertStart =
  (formData.get("expert_start") as string) || null;

const expertEnd =
  (formData.get("expert_end") as string) || null;

const pitchStart =
  (formData.get("pitch_start") as string) || null;

const pitchEnd =
  (formData.get("pitch_end") as string) || null;

const announcement =
  (formData.get("announcement") as string) || null;

const timelinesToInsert = [
  {
    challenge_id: challengeId,
    title: "Challenge Dibuka",
    start_date: openStart,
    end_date: openEnd || null,
  },
  {
    challenge_id: challengeId,
    title: "Penjurian Ahli",
    start_date: expertStart,
    end_date: expertEnd,
  },
  {
    challenge_id: challengeId,
    title: "Pitching Final",
    start_date: pitchStart,
    end_date: pitchEnd,
  },
  {
    challenge_id: challengeId,
    title: "Pengumuman Pemenang",
    start_date: announcement,
    end_date: null,
  },
];

const { error: timeError } = await supabase
  .from("challenge_timelines")
  .insert(timelinesToInsert);

if (timeError) {
  console.error(
    "Gagal simpan timelines:",
    timeError
  );
}

// --------------------------------------------------------
// 10. SIMULASI PEMBAYARAN
// --------------------------------------------------------

const { error: payError } = await supabase
  .from("challenge_payments")
  .insert({
    challenge_id: challengeId,
    amount: totalPayment,
    proof_path: "simulated_virtual_account",
    status: "pending",
  });

if (payError) {
  console.error(
    "Gagal simpan payment:",
    payError
  );
}

// --------------------------------------------------------
// REVALIDATE
// --------------------------------------------------------

revalidatePath("/seeker/challenges");
revalidatePath("/seeker");
revalidatePath("/solver");

return {
  success: true,
  challengeId,
};
 

} catch (error: unknown) {
console.error(
"Unhandled error in createChallengeAction:",
error
);

 
return {
  success: false,
  error:
    error instanceof Error
      ? error.message
      : "Terjadi kesalahan pada server.",
};
 

}
}

// ============================================================
// JOIN CHALLENGE
// ============================================================

/**

* Solver mendaftar challenge secara individual atau tim.
*
* LOGIC TEAM:
* 1. Hanya captain yang mendaftarkan tim.
* 2. Semua anggota saat ini diambil dari team_members.
* 3. Semua anggota di-snapshot ke challenge_entry_members.
* 4. Team dikunci.
*
* Setelah snapshot dibuat, perubahan team_members tidak akan
* mengubah history challenge.
  */
  export async function joinChallengeAction(
  challengeId: string,
  participationType: "individual" | "team",
  teamId?: string
  ): Promise<JoinChallengeResult> {
  try {
  const supabase = await createClient();

  // --------------------------------------------------------
  // 1. AUTH
  // --------------------------------------------------------

  const {
  data: { user },
  error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
  return {
  success: false,
  error:
  "Sesi telah berakhir. Silakan login kembali.",
  };
  }

  // --------------------------------------------------------
  // 2. ROLE CHECK
  // --------------------------------------------------------

  const { data: profile } = await supabase
  .from("profiles")
  .select("role")
  .eq("id", user.id)
  .maybeSingle();

  if (!profile || profile.role !== "solver") {
  return {
  success: false,
  error:
  "Hanya Solver yang dapat mendaftar ke challenge.",
  };
  }

  // --------------------------------------------------------
  // 3. CHALLENGE CHECK
  // --------------------------------------------------------

  const { data: challenge } = await supabase
  .from("challenges")
  .select("id, status")
  .eq("id", challengeId)
  .maybeSingle();

  if (!challenge) {
  return {
  success: false,
  error: "Challenge tidak ditemukan.",
  };
  }

  if (challenge.status !== "ongoing") {
  return {
  success: false,
  error:
  "Challenge ini tidak sedang dibuka untuk pendaftaran.",
  };
  }

  // ========================================================
  // INDIVIDUAL
  // ========================================================

  if (participationType === "individual") {
  // ------------------------------------------------------
  // Cek duplicate
  // ------------------------------------------------------

  const { data: existing } = await supabase
  .from("challenge_entries")
  .select("id")
  .eq("challenge_id", challengeId)
  .eq("solver_id", user.id)
  .maybeSingle();

  if (existing) {
  return {
  success: false,
  error:
  "Anda sudah terdaftar di challenge ini.",
  };
  }

  // ------------------------------------------------------
  // Insert entry
  // ------------------------------------------------------

  const { data: entry, error: entryError } =
  await supabase
  .from("challenge_entries")
  .insert({
  challenge_id: challengeId,
  participation_type: "individual",
  solver_id: user.id,
  team_id: null,
  team_name_snapshot: null,
  status: "registered",
  })
  .select("id")
  .single();

  if (entryError || !entry) {
  console.error(
  "Gagal insert challenge_entry (individu):",
  entryError
  );

   
   return {
     success: false,
     error: "Gagal mendaftar challenge.",
   };
   

  }

  // ------------------------------------------------------
  // Snapshot individual
  // ------------------------------------------------------

  const { error: snapshotError } = await supabase
  .from("challenge_entry_members")
  .insert({
  entry_id: entry.id,
  user_id: user.id,
  role_snapshot: "individual",
  });

  if (snapshotError) {
  console.error(
  "Gagal snapshot peserta individu:",
  snapshotError
  );

   
   // Rollback entry jika snapshot gagal.
   await supabase
     .from("challenge_entries")
     .delete()
     .eq("id", entry.id);

   return {
     success: false,
     error:
       "Gagal menyimpan data peserta challenge.",
   };
   

  }

  revalidatePath(
  `/solver/challenge/${challengeId}`
  );

  revalidatePath("/solver/workspace");

  return {
  success: true,
  entryId: entry.id,
  };
  }

  // ========================================================
  // TEAM
  // ========================================================

  if (!teamId) {
  return {
  success: false,
  error:
  "Tim wajib dipilih untuk partisipasi tim.",
  };
  }

  // --------------------------------------------------------
  // Ambil data team
  // --------------------------------------------------------

  const { data: team, error: teamError } =
  await supabase
  .from("teams")
  .select(
  "id, name, captain_id, is_active, is_locked"
  )
  .eq("id", teamId)
  .maybeSingle();

  if (teamError || !team) {
  console.error(
  "Gagal mengambil data team:",
  teamError
  );

  return {
  success: false,
  error: "Tim tidak ditemukan.",
  };
  }

  if (!team.is_active) {
  return {
  success: false,
  error:
  "Tim tidak aktif. Hubungi ketua tim Anda.",
  };
  }

  // --------------------------------------------------------
  // Team yang sudah lock tidak boleh join challenge baru
  // --------------------------------------------------------

  if (team.is_locked) {
  return {
  success: false,
  error:
  "Tim ini sudah terkunci karena sedang mengikuti challenge.",
  };
  }

  // --------------------------------------------------------
  // HANYA CAPTAIN YANG MENDAFTARKAN TEAM
  // --------------------------------------------------------

  if (team.captain_id !== user.id) {
  return {
  success: false,
  error:
  "Hanya ketua tim yang dapat mendaftarkan tim ke challenge.",
  };
  }

  // --------------------------------------------------------
  // Cek duplicate team entry
  // --------------------------------------------------------

  const { data: existingTeamEntry } =
  await supabase
  .from("challenge_entries")
  .select("id")
  .eq("challenge_id", challengeId)
  .eq("team_id", teamId)
  .maybeSingle();

  if (existingTeamEntry) {
  return {
  success: false,
  error:
  "Tim Anda sudah terdaftar di challenge ini.",
  };
  }

  // --------------------------------------------------------
  // Ambil semua anggota team SAAT INI
  // --------------------------------------------------------
  //
  // team_members adalah kondisi team sekarang.
  // Data ini akan disalin ke challenge_entry_members
  // sebagai snapshot.
  //

  const { data: members, error: membersError } =
  await supabase
  .from("team_members")
  .select("user_id")
  .eq("team_id", teamId);

  if (membersError) {
  console.error(
  "Gagal mengambil anggota tim:",
  membersError
  );

  return {
  success: false,
  error: "Gagal mengambil anggota tim.",
  };
  }

  // --------------------------------------------------------
  // Pastikan captain juga masuk snapshot
  // --------------------------------------------------------
  //
  // Kita tidak bergantung pada apakah captain memiliki
  // row di team_members atau tidak.
  //

  const memberIds = new Set(
  (members ?? []).map((member) => member.user_id)
  );

  memberIds.add(team.captain_id);

  const membersToInsert = Array.from(memberIds).map(
  (userId) => ({
  entry_id: "",
  user_id: userId,
  role_snapshot:
  userId === team.captain_id
  ? "captain"
  : "member",
  })
  );

  // --------------------------------------------------------
  // Insert challenge_entry
  // --------------------------------------------------------

  const { data: entry, error: entryError } =
  await supabase
  .from("challenge_entries")
  .insert({
  challenge_id: challengeId,
  participation_type: "team",
  solver_id: null,
  team_id: teamId,
  team_name_snapshot: team.name,
  status: "registered",
  })
  .select("id")
  .single();

  if (entryError || !entry) {
  console.error(
  "Gagal insert challenge_entry (tim):",
  entryError
  );

  return {
  success: false,
  error:
  "Gagal mendaftarkan tim ke challenge.",
  };
  }

  // --------------------------------------------------------
  // Isi entry_id snapshot
  // --------------------------------------------------------

  const snapshotRows = membersToInsert.map(
  (member) => ({
  ...member,
  entry_id: entry.id,
  })
  );

  // --------------------------------------------------------
  // Insert snapshot
  // --------------------------------------------------------

  if (snapshotRows.length === 0) {
  console.error(
  "Tidak ada anggota yang dapat disimpan sebagai snapshot."
  );

  // Rollback entry
  await supabase
  .from("challenge_entries")
  .delete()
  .eq("id", entry.id);

  return {
  success: false,
  error:
  "Tim tidak memiliki anggota yang dapat didaftarkan.",
  };
  }

  const { error: snapshotError } =
  await supabase
  .from("challenge_entry_members")
  .insert(snapshotRows);

  if (snapshotError) {
  console.error(
  "Gagal simpan snapshot anggota tim:",
  snapshotError
  );

  // Rollback entry jika snapshot gagal.
  await supabase
  .from("challenge_entries")
  .delete()
  .eq("id", entry.id);

  return {
  success: false,
  error:
  "Gagal menyimpan snapshot anggota tim.",
  };
  }

  // --------------------------------------------------------
  // LOCK TEAM
  // --------------------------------------------------------

  const { error: lockError } = await supabase
  .from("teams")
  .update({ is_locked: true })
  .eq("id", teamId)
  .eq("captain_id", user.id);

  if (lockError) {
  console.error(
  "Gagal mengunci team:",
  lockError
  );

  // Rollback snapshot
  await supabase
  .from("challenge_entry_members")
  .delete()
  .eq("entry_id", entry.id);

  // Rollback entry
  await supabase
  .from("challenge_entries")
  .delete()
  .eq("id", entry.id);

  return {
  success: false,
  error:
  "Gagal mengunci tim. Pendaftaran dibatalkan.",
  };
  }

  // --------------------------------------------------------
  // REVALIDATE
  // --------------------------------------------------------

  revalidatePath(
  `/solver/challenge/${challengeId}`
  );

  revalidatePath("/solver/workspace");

  revalidatePath("/solver/team");

  return {
  success: true,
  entryId: entry.id,
  };
  } catch (error) {
  console.error(
  "Unhandled error in joinChallengeAction:",
  error
  );

  return {
  success: false,
  error: "Terjadi kesalahan pada server.",
  };
  }
  }

// ============================================================
// CANCEL JOIN
// ============================================================

/**

* Membatalkan pendaftaran:
*
* Individual:
* user tersebut dapat membatalkan entry miliknya.
*
* Team:
* HANYA captain yang dapat membatalkan.
*
* Jika team dibatalkan:
* submissions
*  
     ↓
   
* challenge_entry_members
*  
     ↓
   
* challenge_entries
*  
     ↓
   
* teams.is_locked = false
  */
  export async function cancelJoinChallengeAction(
  challengeId: string
  ): Promise<{ success: boolean; error?: string }> {
  try {
  const supabase = await createClient();

 
// --------------------------------------------------------
 

 
// AUTH
// --------------------------------------------------------

const {
  data: { user },
  error: authError,
} = await supabase.auth.getUser();

if (authError || !user) {
  return {
    success: false,
    error: "Kamu harus login terlebih dahulu.",
  };
}

// --------------------------------------------------------
// INDIVIDUAL ENTRY
// --------------------------------------------------------

const { data: individualEntry } =
  await supabase
    .from("challenge_entries")
    .select(
      "id, participation_type, team_id, solver_id"
    )
    .eq("challenge_id", challengeId)
    .eq("solver_id", user.id)
    .maybeSingle();

// Kalau punya entry individual, gunakan itu.
let entry = individualEntry;

// --------------------------------------------------------
// TEAM ENTRY
// --------------------------------------------------------

if (!entry) {
  // Hanya cari team yang captain-nya adalah user.
  const { data: teams } = await supabase
    .from("teams")
    .select("id")
    .eq("captain_id", user.id);

  const teamIds = (teams ?? []).map(
    (team) => team.id
  );

  if (teamIds.length > 0) {
    const { data: teamEntry } =
      await supabase
        .from("challenge_entries")
        .select(
          "id, participation_type, team_id, solver_id"
        )
        .eq("challenge_id", challengeId)
        .in("team_id", teamIds)
        .maybeSingle();

    entry = teamEntry;
  }
}

if (!entry) {
  return {
    success: false,
    error:
      "Kamu belum terdaftar pada challenge ini.",
  };
}

// --------------------------------------------------------
// 1. HAPUS SUBMISSION
// --------------------------------------------------------

const { error: submissionError } =
  await supabase
    .from("submissions")
    .delete()
    .eq("entry_id", entry.id);

if (submissionError) {
  console.error(
    "Gagal menghapus submission:",
    submissionError
  );

  return {
    success: false,
    error: "Gagal membatalkan submission.",
  };
}

// --------------------------------------------------------
// 2. HAPUS SNAPSHOT
// --------------------------------------------------------

const { error: memberSnapshotError } =
  await supabase
    .from("challenge_entry_members")
    .delete()
    .eq("entry_id", entry.id);

if (memberSnapshotError) {
  console.error(
    "Gagal menghapus challenge_entry_members:",
    memberSnapshotError
  );

  return {
    success: false,
    error:
      "Gagal menghapus data anggota challenge.",
  };
}

// --------------------------------------------------------
// 3. HAPUS ENTRY
// --------------------------------------------------------

const { error: entryDeleteError } =
  await supabase
    .from("challenge_entries")
    .delete()
    .eq("id", entry.id);

if (entryDeleteError) {
  console.error(
    "Gagal menghapus challenge_entry:",
    entryDeleteError
  );

  return {
    success: false,
    error:
      "Gagal membatalkan pendaftaran challenge.",
  };
}

// --------------------------------------------------------
// 4. UNLOCK TEAM
// --------------------------------------------------------

if (entry.team_id) {
  const { error: teamUpdateError } =
    await supabase
      .from("teams")
      .update({ is_locked: false })
      .eq("id", entry.team_id)
      .eq("captain_id", user.id);

  if (teamUpdateError) {
    console.error(
      "Gagal unlock team:",
      teamUpdateError
    );

    return {
      success: false,
      error:
        "Pendaftaran dibatalkan, tetapi tim gagal dibuka kembali.",
    };
  }
}

// --------------------------------------------------------
// REVALIDATE
// --------------------------------------------------------

revalidatePath(
  `/solver/challenge/${challengeId}`
);

revalidatePath("/solver/workspace");

revalidatePath("/solver/team");

return {
  success: true,
};
 

} catch (error) {
console.error(
"Unhandled error in cancelJoinChallengeAction:",
error
);

 
return {
  success: false,
  error: "Terjadi kesalahan pada server.",
};
 

}
}

// ============================================================
// SUBMIT CHALLENGE
// ============================================================

/**

* Submit Google Drive URL.
*
* Individual:
* user harus memiliki individual challenge_entry.
*
* Team:
* user HARUS merupakan captain dari team.
*
* Member biasa tidak dapat submit walaupun dia merupakan
* bagian dari challenge_entry_members.
  */
  export async function submitChallengeDriveUrlAction(
  challengeId: string,
  submissionUrl: string
  ): Promise<{ success: boolean; error?: string }> {
  try {
  const supabase = await createClient();

  // --------------------------------------------------------
  // AUTH
  // --------------------------------------------------------

  const {
  data: { user },
  error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
  return {
  success: false,
  error:
  "Sesi telah berakhir. Silakan login kembali.",
  };
  }

  // --------------------------------------------------------
  // VALIDASI URL
  // --------------------------------------------------------

  const cleanUrl = submissionUrl.trim();

  if (
  !cleanUrl ||
  (!cleanUrl.startsWith("http://") &&
  !cleanUrl.startsWith("https://"))
  ) {
  return {
  success: false,
  error:
  "Tautan tidak valid. Pastikan diawali dengan http:// atau https://",
  };
  }

  // ========================================================
  // INDIVIDUAL
  // ========================================================

  const { data: indEntry } = await supabase
  .from("challenge_entries")
  .select("id, status")
  .eq("challenge_id", challengeId)
  .eq("solver_id", user.id)
  .eq("participation_type", "individual")
  .maybeSingle();

  if (indEntry) {
  // ------------------------------------------------------
  // Cari submission lama
  // ------------------------------------------------------

  const { data: existingSub, error: existingSubError } =
  await supabase
  .from("submissions")
  .select("id")
  .eq("entry_id", indEntry.id)
  .maybeSingle();

  if (existingSubError) {
  console.error(
  "Gagal mengecek submission:",
  existingSubError
  );

   
   return {
     success: false,
     error:
       "Gagal mengecek data submission.",
   };
   

  }

  // ------------------------------------------------------
  // UPDATE / INSERT
  // ------------------------------------------------------

  if (existingSub) {
  const { error: updateError } =
  await supabase
  .from("submissions")
  .update({
  drive_url: cleanUrl,
  submitted_at:
  new Date().toISOString(),
  })
  .eq("id", existingSub.id);

   
   if (updateError) {
     console.error(
       "Gagal update submission:",
       updateError
     );

     return {
       success: false,
       error:
         "Gagal memperbarui submission.",
     };
   }
   

  } else {
  const { error: insertError } =
  await supabase
  .from("submissions")
  .insert({
  entry_id: indEntry.id,
  drive_url: cleanUrl,
  });

   
   if (insertError) {
     console.error(
       "Gagal insert submission:",
       insertError
     );

     return {
       success: false,
       error:
         "Gagal menyimpan submission.",
     };
   }
   

  }

  // ------------------------------------------------------
  // Update status
  // ------------------------------------------------------

  const { error: statusError } =
  await supabase
  .from("challenge_entries")
  .update({ status: "submitted" })
  .eq("id", indEntry.id);

  if (statusError) {
  console.error(
  "Gagal update status challenge entry:",
  statusError
  );

   
   return {
     success: false,
     error:
       "Submission tersimpan, tetapi status gagal diperbarui.",
   };
   

  }

  revalidatePath(
  `/solver/challenge/${challengeId}`
  );

  revalidatePath("/solver/workspace");

  return {
  success: true,
  };
  }

  // ========================================================
  // TEAM
  // ========================================================

  // Cari team yang user menjadi captain.
  const { data: captainedTeams } =
  await supabase
  .from("teams")
  .select("id, captain_id")
  .eq("captain_id", user.id);

  const teamIds = (captainedTeams ?? []).map(
  (team) => team.id
  );

  if (teamIds.length === 0) {
  return {
  success: false,
  error:
  "Anda tidak terdaftar sebagai peserta individu atau ketua tim pada challenge ini.",
  };
  }

  // --------------------------------------------------------
  // Cari entry team
  // --------------------------------------------------------

  const { data: teamEntry, error: teamEntryError } =
  await supabase
  .from("challenge_entries")
  .select("id, status, team_id")
  .eq("challenge_id", challengeId)
  .eq("participation_type", "team")
  .in("team_id", teamIds)
  .maybeSingle();

  if (teamEntryError) {
  console.error(
  "Gagal mencari team entry:",
  teamEntryError
  );

  return {
  success: false,
  error:
  "Gagal mencari pendaftaran tim.",
  };
  }

  if (!teamEntry) {
  return {
  success: false,
  error:
  "Anda tidak terdaftar sebagai ketua tim pada challenge ini.",
  };
  }

  // --------------------------------------------------------
  // DOUBLE CHECK CAPTAIN
  // --------------------------------------------------------

  const teamId = teamEntry.team_id;

  if (!teamId) {
  return {
  success: false,
  error:
  "Data tim pada pendaftaran tidak valid.",
  };
  }

  const { data: team } = await supabase
  .from("teams")
  .select("id, captain_id")
  .eq("id", teamId)
  .maybeSingle();

  if (!team || team.captain_id !== user.id) {
  return {
  success: false,
  error:
  "Hanya ketua tim yang dapat melakukan submission.",
  };
  }

  // --------------------------------------------------------
  // Cari submission lama
  // --------------------------------------------------------

  const { data: existingSub, error: existingSubError } =
  await supabase
  .from("submissions")
  .select("id")
  .eq("entry_id", teamEntry.id)
  .maybeSingle();

  if (existingSubError) {
  console.error(
  "Gagal mengecek submission team:",
  existingSubError
  );

  return {
  success: false,
  error:
  "Gagal mengecek data submission tim.",
  };
  }

  // --------------------------------------------------------
  // UPDATE / INSERT
  // --------------------------------------------------------

  if (existingSub) {
  const { error: updateError } =
  await supabase
  .from("submissions")
  .update({
  drive_url: cleanUrl,
  submitted_at:
  new Date().toISOString(),
  })
  .eq("id", existingSub.id);

  if (updateError) {
  console.error(
  "Gagal update submission team:",
  updateError
  );

   return {
     success: false,
     error:
       "Gagal memperbarui submission tim.",
   };

  }
  } else {
  const { error: insertError } =
  await supabase
  .from("submissions")
  .insert({
  entry_id: teamEntry.id,
  drive_url: cleanUrl,
  });

  if (insertError) {
  console.error(
  "Gagal insert submission team:",
  insertError
  );

   return {
     success: false,
     error:
       "Gagal menyimpan submission tim.",
   };

  }
  }

  // --------------------------------------------------------
  // Update status entry
  // --------------------------------------------------------

  const { error: statusError } =
  await supabase
  .from("challenge_entries")
  .update({ status: "submitted" })
  .eq("id", teamEntry.id);

  if (statusError) {
  console.error(
  "Gagal update status team entry:",
  statusError
  );

  return {
  success: false,
  error:
  "Submission tersimpan, tetapi status gagal diperbarui.",
  };
  }

  // --------------------------------------------------------
  // REVALIDATE
  // --------------------------------------------------------

  revalidatePath(
  `/solver/challenge/${challengeId}`
  );

  revalidatePath("/solver/workspace");

  return {
  success: true,
  };
  } catch (error) {
  console.error(
  "Unhandled error in submitChallengeDriveUrlAction:",
  error
  );

  return {
  success: false,
  error: "Terjadi kesalahan pada server.",
  };
  }
  }
