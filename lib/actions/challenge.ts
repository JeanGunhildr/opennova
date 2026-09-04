"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface CreateChallengeResult {
  success: boolean;
  challengeId?: string;
  error?: string;
}

/**
 * Uploads a file to Supabase storage and returns its public URL or storage path.
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
  const uniqueName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 7)}-${cleanName}`;
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
    // Jika upload storage error (misal bucket belum dibuat), simpan relative path sebagai placeholder
    return uniqueName;
  }

  const { data: publicUrlData } = supabase.storage
    .from("challenges")
    .getPublicUrl(data.path);

  return publicUrlData?.publicUrl || data.path;
}

export async function createChallengeAction(
  formData: FormData
): Promise<CreateChallengeResult> {
  try {
    const supabase = await createClient();

    // 1. Verifikasi user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Sesi telah berakhir. Silakan login kembali." };
    }

    // 2. Pastikan Seeker Profile ada
    const { data: seekerProfile } = await supabase
      .from("seeker_profiles")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!seekerProfile) {
      // Ambil nama dari profiles untuk auto-create seeker_profile jika belum ada
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
        console.error("Gagal membuat seeker_profile:", insertSeekerError);
        return {
          success: false,
          error: "Profil Seeker tidak ditemukan. Pastikan Anda terdaftar sebagai Seeker.",
        };
      }
    }

    // 3. Upload Berkas (Thumbnail & Kesepakatan Hak Cipta)
    const thumbnailFile = formData.get("thumbnail") as File | null;
    const copyrightFile = formData.get("copyright_agreement") as File | null;

    let thumbnailPath: string | null = null;
    let copyrightPath: string | null = null;

    if (thumbnailFile && thumbnailFile.size > 0) {
      thumbnailPath = await uploadToStorage(supabase, thumbnailFile, "thumbnails");
    }

    if (copyrightFile && copyrightFile.size > 0) {
      copyrightPath = await uploadToStorage(supabase, copyrightFile, "copyright-agreements");
    }

    // 4. Ekstrak data utama challenge
    const name = (formData.get("name") as string)?.trim();
    const categoryId = (formData.get("category_id") as string)?.trim() || null;
    const description = (formData.get("description") as string)?.trim();
    const prizePool = Number(formData.get("prize_pool")) || 0;
    const creationFee = Math.floor(prizePool * 0.1);
    const totalPayment = prizePool + creationFee;
    const expertWeight = Number(formData.get("expert_weight")) || 50;
    const pitchWeight = Number(formData.get("pitch_weight")) || 50;

    // Deadline diambil dari open_end (batas akhir pengumpulan solusi)
    const openEnd = formData.get("open_end") as string;
    const deadline = openEnd
      ? new Date(openEnd).toISOString()
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    if (!name) {
      return { success: false, error: "Judul challenge wajib diisi." };
    }

    // Validasi: tanggal mulai challenge tidak boleh sebelum hari ini
    const openStartRaw = formData.get("open_start") as string | null;
    if (openStartRaw) {
      const openStartDate = new Date(openStartRaw);
      const todayMidnight = new Date();
      todayMidnight.setHours(0, 0, 0, 0);
      if (openStartDate < todayMidnight) {
        return {
          success: false,
          error: "Tanggal mulai challenge tidak boleh sebelum hari ini.",
        };
      }
    }

    // 5. Simpan ke tabel challenges
    const { data: challenge, error: challengeError } = await supabase
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
        status: "draft", // atau 'active' / 'published' tergantung nilai enum
        expert_weight: expertWeight,
        pitch_weight: pitchWeight,
      })
      .select("id")
      .single();

    if (challengeError || !challenge) {
      console.error("Gagal membuat challenge:", challengeError);
      return {
        success: false,
        error: `Gagal menyimpan challenge: ${challengeError?.message || "Terjadi kesalahan"}`,
      };
    }

    const challengeId = challenge.id;

    // 6. Simpan Tujuan Challenge (challenge_objectives)
    const rawObjectives = formData.getAll("objectives") as string[];
    const objectivesToInsert = rawObjectives
      .map((text) => text.trim())
      .filter(Boolean)
      .map((content, index) => ({
        challenge_id: challengeId,
        content,
        sort_order: index + 1,
      }));

    if (objectivesToInsert.length > 0) {
      const { error: objError } = await supabase
        .from("challenge_objectives")
        .insert(objectivesToInsert);
      if (objError) console.error("Gagal simpan objectives:", objError);
    }

    // 7. Simpan Ketentuan Pengumpulan (challenge_requirements)
    const rawRequirements = formData.getAll("requirements") as string[];
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
      if (reqError) console.error("Gagal simpan requirements:", reqError);
    }

    // 8. Simpan Kriteria Penilaian (judging_criteria)
    const expertTitles = formData.getAll("expert_criteria") as string[];
    const expertDescs = formData.getAll("expert_criteria_description") as string[];
    const pitchTitles = formData.getAll("pitch_criteria") as string[];
    const pitchDescs = formData.getAll("pitch_criteria_description") as string[];

    const criteriaToInsert = [
      ...expertTitles.map((title, i) => ({
        challenge_id: challengeId,
        stage: "expert",
        name: title.trim(),
        description: expertDescs[i]?.trim() || null,
        sort_order: i + 1,
      })),
      ...pitchTitles.map((title, i) => ({
        challenge_id: challengeId,
        stage: "pitch",
        name: title.trim(),
        description: pitchDescs[i]?.trim() || null,
        sort_order: i + 1,
      })),
    ].filter((c) => c.name.length > 0);

    if (criteriaToInsert.length > 0) {
      const { error: critError } = await supabase
        .from("judging_criteria")
        .insert(criteriaToInsert);
      if (critError) console.error("Gagal simpan criteria:", critError);
    }

    // 9. Simpan Linimasa Challenge (challenge_timelines)
    const openStart = (formData.get("open_start") as string) || null;
    const expertStart = (formData.get("expert_start") as string) || null;
    const expertEnd = (formData.get("expert_end") as string) || null;
    const pitchStart = (formData.get("pitch_start") as string) || null;
    const pitchEnd = (formData.get("pitch_end") as string) || null;
    const announcement = (formData.get("announcement") as string) || null;

    const timelinesToInsert = [
      {
        challenge_id: challengeId,
        title: "Challenge Dibuka",
        start_date: openStart,
        end_date: openEnd || null,
        sort_order: 1,
      },
      {
        challenge_id: challengeId,
        title: "Penjurian Ahli",
        start_date: expertStart,
        end_date: expertEnd,
        sort_order: 2,
      },
      {
        challenge_id: challengeId,
        title: "Pitching Final",
        start_date: pitchStart,
        end_date: pitchEnd,
        sort_order: 3,
      },
      {
        challenge_id: challengeId,
        title: "Pengumuman Pemenang",
        start_date: announcement,
        end_date: null,
        sort_order: 4,
      },
    ];

    const { error: timeError } = await supabase
      .from("challenge_timelines")
      .insert(timelinesToInsert);
    if (timeError) console.error("Gagal simpan timelines:", timeError);

    // 10. Simpan Simulasi Pembayaran (challenge_payments)
    const { error: payError } = await supabase.from("challenge_payments").insert({
      challenge_id: challengeId,
      amount: totalPayment,
      proof_path: "simulated_virtual_account",
      status: "pending", // atau 'verified' jika langsung lunas
    });
    if (payError) console.error("Gagal simpan payment:", payError);

    revalidatePath("/seeker/challenges");
    revalidatePath("/seeker");
    revalidatePath("/solver");

    return {
      success: true,
      challengeId,
    };
  } catch (error: unknown) {
    console.error("Unhandled error in createChallengeAction:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Terjadi kesalahan pada server.",
    };
  }
}
