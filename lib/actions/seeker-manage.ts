"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// ============================================================
// TYPES
// ============================================================

type ManageChallengeEntry = {
  id: string;
  solverName: string;
  teamName: string | null;
  participationType: "individual" | "team";
  driveUrl: string | null;
  entryStatus: string;
  isWinner: boolean;
  email?: string;
  scores: Record<string, number>;
};

export interface ManageChallengeCriterion {
  id: string;
  name: string;
  description: string | null;
  stage: "expert_judging" | "final_pitch";
}

export interface ManageChallengeTimeline {
  id: string;
  title: string;
  startDate: string | null;
  endDate: string | null;
}

export interface ManageChallengeData {
  id: string;
  name: string;
  description: string | null;
  thumbnailPath: string | null;
  prizePool: number;
  deadline: string;
  status: string;
  expertWeight: number;
  pitchWeight: number;
  participantCount: number;
  categoryName: string | null;
  companyName: string | null;
  objectives: string[];
  requirements: string[];
  timelines: ManageChallengeTimeline[];
  expertCriteria: ManageChallengeCriterion[];
  pitchingCriteria: ManageChallengeCriterion[];
  // Submissions per stage
  expertEntries: ManageChallengeEntry[];
  pitchingEntries: ManageChallengeEntry[];
  winnerEntries: ManageChallengeEntry[];
}

// Helper: Verify seeker owns the challenge associated with an entry
async function verifySeekerEntryOwnership(
  supabase: any,
  entryId: string,
  userId: string,
): Promise<{ valid: boolean; challengeId?: string }> {
  const { data, error } = await supabase
    .from("challenge_entries")
    .select(
      `
      id,
      challenge_id,
      challenges!inner (
        id,
        seeker_id
      )
    `,
    )
    .eq("id", entryId)
    .eq("challenges.seeker_id", userId)
    .maybeSingle();

  if (error || !data) {
    return { valid: false };
  }
  return { valid: true, challengeId: data.challenge_id };
}

// Helper for revalidating all challenge-related manage routes
function triggerRevalidateManagePaths(challengeId: string) {
  revalidatePath(`/seeker/challenges/${challengeId}`);
  revalidatePath(`/seeker/challenges/${challengeId}/manage`);
  revalidatePath("/seeker/challenges");
  revalidatePath("/seeker");
}

// ============================================================
// GET MANAGE CHALLENGE DATA
// ============================================================

export async function getManageChallengeDataAction(
  challengeId: string,
): Promise<{ data: ManageChallengeData | null; error: string | null }> {
  try {
    const supabase = await createClient();

    // ── 1. Auth check ──────────────────────────────────────────
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { data: null, error: "Sesi berakhir. Silakan login kembali." };
    }

    // ── 2. Challenge base data ───────────────────────────────
    const { data: ch, error: chErr } = await supabase
      .from("challenges")
      .select(
        `
        id,
        name,
        description,
        thumbnail_path,
        prize_pool,
        deadline,
        status,
        expert_weight,
        pitch_weight,
        seeker_id,
        categories ( name ),
        seeker_profiles ( company_name )
      `,
      )
      .eq("id", challengeId)
      .eq("seeker_id", user.id)
      .maybeSingle();

    if (chErr) {
      console.error(
        "Error fetching challenge in getManageChallengeDataAction:",
        {
          challengeId,
          message: chErr.message,
          code: chErr.code,
          details: chErr.details,
          hint: chErr.hint,
        },
      );
      return {
        data: null,
        error: `Gagal mengambil data challenge: ${chErr.message}`,
      };
    }

    if (!ch) {
      return {
        data: null,
        error: "Challenge tidak ditemukan atau Anda tidak memiliki akses.",
      };
    }

    // ── 3. Exact Participant Count ───────────────────────────
    const { count: exactParticipantCount, error: countErr } = await supabase
      .from("challenge_entries")
      .select("id", { count: "exact", head: true })
      .eq("challenge_id", challengeId);

    if (countErr) {
      console.error("Error fetching exact participant count:", {
        challengeId,
        message: countErr.message,
        code: countErr.code,
        details: countErr.details,
        hint: countErr.hint,
      });
    }

    const participantCount = exactParticipantCount ?? 0;

    const categoryName = Array.isArray(ch.categories)
      ? ((ch.categories[0] as any)?.name ?? null)
      : ((ch.categories as any)?.name ?? null);

    const companyName = Array.isArray(ch.seeker_profiles)
      ? ((ch.seeker_profiles[0] as any)?.company_name ?? null)
      : ((ch.seeker_profiles as any)?.company_name ?? null);

    // ── 4. Objectives ────────────────────────────────────────
    const { data: objRows } = await supabase
      .from("challenge_objectives")
      .select("content")
      .eq("challenge_id", challengeId)
      .order("id");

    const objectives = (objRows ?? []).map((r: any) => r.content as string);

    // ── 5. Requirements ──────────────────────────────────────
    const { data: reqRows } = await supabase
      .from("challenge_requirements")
      .select("content")
      .eq("challenge_id", challengeId)
      .order("id");

    const requirements = (reqRows ?? []).map((r: any) => r.content as string);

    // ── 6. Timelines ─────────────────────────────────────────
    const { data: timelineRows } = await supabase
      .from("challenge_timelines")
      .select("id, title, start_date, end_date")
      .eq("challenge_id", challengeId)
      .order("sort_order", { ascending: true })
      .order("id", { ascending: true });

    const timelines: ManageChallengeTimeline[] = (timelineRows ?? []).map(
      (t: any) => ({
        id: t.id,
        title: t.title,
        startDate: t.start_date,
        endDate: t.end_date,
      }),
    );

    // ── 7. Judging Criteria ──────────────────────────────────
    const { data: criteriaRows } = await supabase
      .from("judging_criteria")
      .select("id, name, description, stage")
      .eq("challenge_id", challengeId);

    const expertCriteria: ManageChallengeCriterion[] = (criteriaRows ?? [])
      .filter((c: any) => c.stage === "expert_judging")
      .map((c: any) => ({
        id: c.id,
        name: c.name,
        description: c.description,
        stage: "expert_judging",
      }));

    const pitchingCriteria: ManageChallengeCriterion[] = (criteriaRows ?? [])
      .filter((c: any) => c.stage === "final_pitch")
      .map((c: any) => ({
        id: c.id,
        name: c.name,
        description: c.description,
        stage: "final_pitch",
      }));

    // ── 8. Entries with Submissions & Profiles ──────────────
    // ── 8. Entries ───────────────────────────────────────────

    const { data: entryRows, error: entryErr } = await supabase
      .from("challenge_entries")
      .select(
        `
    id,
    challenge_id,
    participation_type,
    solver_id,
    team_id,
    team_name_snapshot,
    status,
    is_winner,
    joined_at
  `,
      )
      .eq("challenge_id", challengeId);

    if (entryErr) {
      console.error("❌ ERROR FETCHING challenge_entries:", {
        challengeId,
        message: entryErr.message,
        code: entryErr.code,
        details: entryErr.details,
        hint: entryErr.hint,
      });

      return {
        data: null,
        error: `Gagal mengambil peserta challenge: ${entryErr.message}`,
      };
    }

    console.log("✅ challenge_entries:", {
      challengeId,
      count: entryRows?.length ?? 0,
      entries: entryRows,
    });

    // ── 8A. Fetch submissions separately ─────────────────────

    const entryIds = (entryRows ?? []).map((e: any) => e.id);

    let submissionRows: any[] = [];

    if (entryIds.length > 0) {
      const { data, error: submissionErr } = await supabase
        .from("submissions")
        .select(
          `
      id,
      entry_id,
      drive_url,
      submitted_at
    `,
        )
        .in("entry_id", entryIds)
        .order("submitted_at", { ascending: false });

      if (submissionErr) {
        console.error("❌ ERROR FETCHING submissions:", {
          challengeId,
          message: submissionErr.message,
          code: submissionErr.code,
          details: submissionErr.details,
          hint: submissionErr.hint,
        });

        return {
          data: null,
          error: `Gagal mengambil submission: ${submissionErr.message}`,
        };
      }

      submissionRows = data ?? [];
    }

    console.log("✅ submissions:", {
      challengeId,
      count: submissionRows.length,
      submissions: submissionRows,
    });

    // ── 8B. Group latest submission by entry ─────────────────

    const latestSubmissionMap = new Map<string, any>();

    for (const submission of submissionRows) {
      if (!submission?.entry_id) continue;

      // Karena query sudah ORDER BY submitted_at DESC,
      // submission pertama adalah submission terbaru.
      if (!latestSubmissionMap.has(submission.entry_id)) {
        latestSubmissionMap.set(submission.entry_id, submission);
      }
    }

    // ── 8C. Resolve individual profiles ─────────────────────

    const solverIds = [
      ...new Set(
        (entryRows ?? []).map((e: any) => e.solver_id).filter(Boolean),
      ),
    ];

    const profileNameMap = new Map<
      string,
      {
        fullName: string;
        email?: string;
      }
    >();

    if (solverIds.length > 0) {
      const { data: profileRows, error: profileErr } = await supabase
        .from("profiles")
        .select("id, full_name, phone")
        .in("id", solverIds);

      if (profileErr) {
        console.error("❌ ERROR FETCHING profiles:", profileErr);
      }

      for (const p of profileRows ?? []) {
        profileNameMap.set(p.id, {
          fullName: p.full_name,
          email: p.phone ?? undefined,
        });
      }
    }

    // ── 8D. Resolve teams ────────────────────────────────────

    const teamIds = [
      ...new Set((entryRows ?? []).map((e: any) => e.team_id).filter(Boolean)),
    ];

    const teamMap = new Map<
      string,
      {
        name: string;
        captainId?: string;
      }
    >();

    const captainIds: string[] = [];

    if (teamIds.length > 0) {
      const { data: teamRows, error: teamErr } = await supabase
        .from("teams")
        .select("id, name, captain_id")
        .in("id", teamIds);

      if (teamErr) {
        console.error("❌ ERROR FETCHING teams:", teamErr);
      }

      for (const t of teamRows ?? []) {
        teamMap.set(t.id, {
          name: t.name,
          captainId: t.captain_id,
        });

        if (t.captain_id) {
          captainIds.push(t.captain_id);
        }
      }
    }

    // ── 8E. Resolve team captain profiles ────────────────────

    if (captainIds.length > 0) {
      const { data: captainProfiles, error: captainErr } = await supabase
        .from("profiles")
        .select("id, full_name, phone")
        .in("id", captainIds);

      if (captainErr) {
        console.error("❌ ERROR FETCHING captain profiles:", captainErr);
      }

      for (const p of captainProfiles ?? []) {
        profileNameMap.set(p.id, {
          fullName: p.full_name,
          email: p.phone ?? undefined,
        });
      }
    }

    // ── 8F. Fetch criterion scores ───────────────────────────

    let scoresMap: Record<string, Record<string, number>> = {};

    if (entryIds.length > 0) {
      const { data: scoreRows, error: scoreErr } = await supabase
        .from("criterion_scores")
        .select("entry_id, criterion_id, score")
        .in("entry_id", entryIds);

      if (scoreErr) {
        console.error("❌ ERROR FETCHING criterion_scores:", scoreErr);
      }

      for (const row of scoreRows ?? []) {
        const r = row as any;

        if (!scoresMap[r.entry_id]) {
          scoresMap[r.entry_id] = {};
        }

        scoresMap[r.entry_id][r.criterion_id] = Number(r.score);
      }
    }

    // ── 8G. Build entry representation ───────────────────────

    const buildEntry = (e: any): ManageChallengeEntry => {
      const latestSub = latestSubmissionMap.get(e.id);

      let solverName = "Solver";
      let email: string | undefined = undefined;

      const isTeam = e.participation_type === "team" || Boolean(e.team_id);

      if (isTeam) {
        const teamObj = e.team_id ? teamMap.get(e.team_id) : undefined;

        const teamName = e.team_name_snapshot || teamObj?.name || "Tim";

        solverName = teamName;

        if (teamObj?.captainId) {
          const captainProfile = profileNameMap.get(teamObj.captainId);

          email = captainProfile?.email;
        }
      } else if (e.solver_id) {
        const profile = profileNameMap.get(e.solver_id);

        solverName = profile?.fullName || "Solver";

        email = profile?.email;
      }

      return {
        id: e.id,
        solverName,
        teamName: isTeam
          ? e.team_name_snapshot || teamMap.get(e.team_id)?.name || null
          : null,
        participationType: e.participation_type,
        driveUrl: latestSub?.drive_url ?? null,
        entryStatus: e.status,
        isWinner: Boolean(e.is_winner),
        email,
        scores: scoresMap[e.id] ?? {},
      };
    };

    // ── 8H. Build all entries ────────────────────────────────

    const allEntries = (entryRows ?? []).map(buildEntry);

    console.log("✅ allEntries:", {
      challengeId,
      count: allEntries.length,
      entries: allEntries.map((entry) => ({
        id: entry.id,
        solverName: entry.solverName,
        participationType: entry.participationType,
        status: entry.entryStatus,
        isWinner: entry.isWinner,
        driveUrl: entry.driveUrl,
      })),
    });

    // ── 8I. Stage filtering ──────────────────────────────────

    const expertEntries = allEntries.filter(
      (entry) =>
        entry.driveUrl !== null &&
        entry.driveUrl.trim() !== "" &&
        entry.entryStatus !== "eliminated",
    );

    const pitchingEntries = allEntries.filter(
      (entry) => entry.entryStatus === "finalist" || entry.isWinner,
    );

    const winnerEntries = allEntries.filter((entry) => entry.isWinner);

    console.log("📊 STAGE COUNTS:", {
      challengeId,
      allEntries: allEntries.length,
      expertEntries: expertEntries.length,
      pitchingEntries: pitchingEntries.length,
      winnerEntries: winnerEntries.length,
    });

    return {
      data: {
        id: ch.id,
        name: ch.name,
        description: ch.description,
        thumbnailPath: ch.thumbnail_path,
        prizePool: ch.prize_pool,
        deadline: ch.deadline,
        status: ch.status,
        expertWeight: ch.expert_weight ?? 60,
        pitchWeight: ch.pitch_weight ?? 40,
        participantCount,
        categoryName,
        companyName,
        objectives,
        requirements,
        timelines,
        expertCriteria,
        pitchingCriteria,
        expertEntries,
        pitchingEntries,
        winnerEntries,
      },
      error: null,
    };
  } catch (err: any) {
    console.error("getManageChallengeDataAction unhandled error:", err);
    return { data: null, error: err?.message || "Terjadi kesalahan server." };
  }
}

// ============================================================
// SAVE CRITERION SCORE (upsert — always editable with security check)
// ============================================================

export async function saveCriterionScoreAction(
  entryId: string,
  criterionId: string,
  score: number,
  challengeId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Sesi berakhir." };

    // Server-side security check: verify entry belongs to challenge owned by seeker
    const ownership = await verifySeekerEntryOwnership(
      supabase,
      entryId,
      user.id,
    );
    if (!ownership.valid) {
      return {
        success: false,
        error:
          "Akses ditolak: Anda tidak memiliki hak untuk menilai peserta ini.",
      };
    }

    const { error } = await supabase
      .from("criterion_scores")
      .upsert(
        { entry_id: entryId, criterion_id: criterionId, score },
        { onConflict: "entry_id,criterion_id" },
      );

    if (error) {
      console.error("saveCriterionScoreAction error:", error);
      return { success: false, error: error.message };
    }

    triggerRevalidateManagePaths(ownership.challengeId || challengeId);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Gagal menyimpan nilai." };
  }
}

// ============================================================
// SAVE BATCH SCORES FOR AN ENTRY (with security check)
// ============================================================

export async function saveBatchScoresAction(
  entryId: string,
  scores: Record<string, number>,
  challengeId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Sesi berakhir." };

    // Server-side security check: verify entry belongs to challenge owned by seeker
    const ownership = await verifySeekerEntryOwnership(
      supabase,
      entryId,
      user.id,
    );
    if (!ownership.valid) {
      return {
        success: false,
        error:
          "Akses ditolak: Anda tidak memiliki hak untuk menilai peserta ini.",
      };
    }

    const upsertRows = Object.entries(scores).map(([criterionId, score]) => ({
      entry_id: entryId,
      criterion_id: criterionId,
      score,
    }));

    if (upsertRows.length === 0) return { success: true };

    const { error } = await supabase
      .from("criterion_scores")
      .upsert(upsertRows, { onConflict: "entry_id,criterion_id" });

    if (error) {
      console.error("saveBatchScoresAction error:", error);
      return { success: false, error: error.message };
    }

    triggerRevalidateManagePaths(ownership.challengeId || challengeId);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Gagal menyimpan nilai." };
  }
}

// ============================================================
// UPDATE CHALLENGE SETTINGS
// ============================================================

export async function updateChallengeSettingsAction(
  challengeId: string,
  data: {
    description: string;
    objectives: string[];
    requirements: string[];
    expertCriteria: { id?: string; name: string; description: string }[];
    pitchingCriteria: { id?: string; name: string; description: string }[];
    expertWeight: number;
    pitchWeight: number;
  },
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Sesi berakhir." };

    // ── Verify ownership ────────────────────────────────
    const { data: ch } = await supabase
      .from("challenges")
      .select("id")
      .eq("id", challengeId)
      .eq("seeker_id", user.id)
      .maybeSingle();

    if (!ch)
      return {
        success: false,
        error: "Challenge tidak ditemukan atau akses ditolak.",
      };

    // ── Update challenge base ────────────────────────────
    const { error: chErr } = await supabase
      .from("challenges")
      .update({
        description: data.description,
        expert_weight: data.expertWeight,
        pitch_weight: data.pitchWeight,
      })
      .eq("id", challengeId);

    if (chErr) return { success: false, error: chErr.message };

    // ── Replace objectives ───────────────────────────────
    await supabase
      .from("challenge_objectives")
      .delete()
      .eq("challenge_id", challengeId);

    const objToInsert = data.objectives
      .filter((o) => o.trim())
      .map((content) => ({ challenge_id: challengeId, content }));

    if (objToInsert.length > 0) {
      await supabase.from("challenge_objectives").insert(objToInsert);
    }

    // ── Replace requirements ─────────────────────────────
    await supabase
      .from("challenge_requirements")
      .delete()
      .eq("challenge_id", challengeId);

    const reqToInsert = data.requirements
      .filter((r) => r.trim())
      .map((content) => ({ challenge_id: challengeId, content }));

    if (reqToInsert.length > 0) {
      await supabase.from("challenge_requirements").insert(reqToInsert);
    }

    // ── Replace judging criteria ─────────────────────────
    await supabase
      .from("judging_criteria")
      .delete()
      .eq("challenge_id", challengeId);

    const criteriaToInsert = [
      ...data.expertCriteria
        .filter((c) => c.name.trim())
        .map((c) => ({
          challenge_id: challengeId,
          stage: "expert_judging",
          name: c.name,
          description: c.description || null,
        })),
      ...data.pitchingCriteria
        .filter((c) => c.name.trim())
        .map((c) => ({
          challenge_id: challengeId,
          stage: "final_pitch",
          name: c.name,
          description: c.description || null,
        })),
    ];

    if (criteriaToInsert.length > 0) {
      await supabase.from("judging_criteria").insert(criteriaToInsert);
    }

    triggerRevalidateManagePaths(challengeId);

    return { success: true };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "Gagal menyimpan perubahan.",
    };
  }
}
