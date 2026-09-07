"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import {
  selectTopFinalists,
  enrichEntriesWithScores,
  rankFinalists,
  type CriterionRow,
} from "@/lib/services/scoring";
import { insertBatchNotifications } from "@/lib/actions/notifications";

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHED_KEY ||
    "";
  return createSupabaseClient(url, key);
}

// ============================================================
// TYPES
// ============================================================

export type ManageChallengeEntry = {
  id: string;
  solverName: string;
  teamName: string | null;
  participationType: "individual" | "team";
  driveUrl: string | null;
  entryStatus: string;
  isWinner: boolean;
  isFinalist: boolean;
  winnerRank: number | null;
  submittedAt: string | null;
  solverUserId: string | null;
  teamId: string | null;
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
    is_finalist,
    winner_rank,
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
        isFinalist: Boolean(e.is_finalist || e.status === "finalist"),
        winnerRank: e.winner_rank ?? null,
        submittedAt: latestSub?.submitted_at ?? null,
        solverUserId: e.solver_id ?? null,
        teamId: e.team_id ?? null,
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
        isFinalist: entry.isFinalist,
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
      (entry) => entry.isFinalist || entry.entryStatus === "finalist" || entry.isWinner,
    );

    const winnerEntries = allEntries
      .filter((entry) => entry.isWinner)
      .sort((a, b) => (a.winnerRank ?? 99) - (b.winnerRank ?? 99));

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

    // Backend Security: Only finalists can receive Final Pitch scores
    const criterionIds = Object.keys(scores);
    if (criterionIds.length > 0) {
      const { data: pitchCriteria } = await supabase
        .from("judging_criteria")
        .select("id")
        .in("id", criterionIds)
        .eq("stage", "final_pitch");

      if (pitchCriteria && pitchCriteria.length > 0) {
        const { data: entryObj } = await supabase
          .from("challenge_entries")
          .select("is_finalist, status, is_winner")
          .eq("id", entryId)
          .maybeSingle();

        const isFinalist = Boolean(
          entryObj?.is_finalist ||
            entryObj?.status === "finalist" ||
            entryObj?.is_winner
        );
        if (!isFinalist) {
          return {
            success: false,
            error:
              "Akses ditolak: Hanya peserta terpilih sebagai Finalis yang dapat dinilai pada tahap Pitching Final.",
          };
        }
      }
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

// ============================================================
// PHASE TRANSITION: MOVE TO JUDGING (ongoing -> judging)
// ============================================================

export async function moveChallengeToJudgingAction(
  challengeId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Sesi berakhir." };

    const { data: ch } = await supabase
      .from("challenges")
      .select("id, name, status")
      .eq("id", challengeId)
      .eq("seeker_id", user.id)
      .maybeSingle();

    if (!ch) return { success: false, error: "Challenge tidak ditemukan atau akses ditolak." };

    const adminSupabase = getAdminClient();

    // Update challenge status to judging
    const { error: updateErr } = await adminSupabase
      .from("challenges")
      .update({ status: "judging" })
      .eq("id", challengeId);

    if (updateErr) {
      console.error("moveChallengeToJudgingAction update error:", updateErr);
      return { success: false, error: updateErr.message };
    }

    // Find entries without submissions and auto-eliminate
    const { data: entries } = await adminSupabase
      .from("challenge_entries")
      .select("id, solver_id")
      .eq("challenge_id", challengeId);

    const entryIds = (entries ?? []).map((e: any) => e.id);
    let subEntryIds = new Set<string>();

    if (entryIds.length > 0) {
      const { data: subRows } = await adminSupabase
        .from("submissions")
        .select("entry_id")
        .in("entry_id", entryIds);

      (subRows ?? []).forEach((s: any) => subEntryIds.add(s.entry_id));
    }

    const noSubEntryIds: string[] = [];
    const notifyUsers: string[] = [];

    for (const e of entries ?? []) {
      if (!subEntryIds.has(e.id)) {
        noSubEntryIds.push(e.id);
      }
      if (e.solver_id) notifyUsers.push(e.solver_id);
    }

    if (noSubEntryIds.length > 0) {
      await adminSupabase
        .from("challenge_entries")
        .update({ status: "eliminated" })
        .in("id", noSubEntryIds);
    }

    // Send notification to participants
    const notifications = notifyUsers.map((uid) => ({
      userId: uid,
      type: "challenge",
      title: "Penjurian Ahli Dimulai",
      body: `Challenge "${ch.name}" kini memasuki tahap Penjurian Ahli. Dewan juri sedang menilai submission yang masuk.`,
      actionUrl: `/solver/challenge/${challengeId}`,
      challengeId,
    }));
    await insertBatchNotifications(supabase, notifications);

    triggerRevalidateManagePaths(challengeId);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Gagal mengubah fase ke Penjurian Ahli." };
  }
}

// ============================================================
// PHASE TRANSITION: SELECT FINALISTS (judging -> final_pitch)
// ============================================================

export async function selectFinalistsAction(
  challengeId: string,
): Promise<{ success: boolean; error?: string; finalistCount?: number }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Sesi berakhir." };

    const { data: ch } = await supabase
      .from("challenges")
      .select("id, name, expert_weight, pitch_weight")
      .eq("id", challengeId)
      .eq("seeker_id", user.id)
      .maybeSingle();

    if (!ch) return { success: false, error: "Challenge tidak ditemukan atau akses ditolak." };

    const adminSupabase = getAdminClient();

    // Fetch criteria for stage expert_judging
    const { data: criteriaRows } = await adminSupabase
      .from("judging_criteria")
      .select("id, stage")
      .eq("challenge_id", challengeId);

    const criteria: CriterionRow[] = (criteriaRows ?? []).map((c: any) => ({
      id: c.id,
      stage: c.stage,
    }));

    // Fetch ALL entries for this challenge (no status filter).
    // This makes the action idempotent — it can be re-run to fix any
    // incorrectly-eliminated entries or recover from a partial previous run.
    const { data: entries, error: entriesErr } = await adminSupabase
      .from("challenge_entries")
      .select("id, solver_id, team_id, status")
      .eq("challenge_id", challengeId);

    console.log("🔍 selectFinalistsAction entries:", {
      challengeId,
      count: entries?.length ?? 0,
      statuses: entries?.map((e: any) => e.status),
      err: entriesErr?.message,
    });

    if (!entries || entries.length === 0) {
      return { success: false, error: "Tidak ada peserta terdaftar pada challenge ini." };
    }

    const entryIds = entries.map((e: any) => e.id);

    // Fetch submissions separately (for submittedAt tie-breaking only)
    const { data: subRows } = await adminSupabase
      .from("submissions")
      .select("entry_id, drive_url, submitted_at")
      .in("entry_id", entryIds)
      .order("submitted_at", { ascending: false });

    const latestSubMap = new Map<string, any>();
    for (const sub of subRows ?? []) {
      if (!latestSubMap.has(sub.entry_id)) {
        latestSubMap.set(sub.entry_id, sub);
      }
    }

    // Fetch scores
    const { data: scoreRows } = await adminSupabase
      .from("criterion_scores")
      .select("entry_id, criterion_id, score")
      .in("entry_id", entryIds);

    const scoresMap = new Map<string, Array<{ criterion_id: string; score: number }>>();
    for (const r of scoreRows ?? []) {
      const entryId = (r as any).entry_id;
      if (!scoresMap.has(entryId)) scoresMap.set(entryId, []);
      scoresMap.get(entryId)!.push({ criterion_id: (r as any).criterion_id, score: Number((r as any).score) });
    }

    // All non-eliminated entries are candidates — no drive_url gate here.
    // (Seeker manually triggers this, so they decide who qualifies.)
    const rawEntries = entries.map((e: any) => {
      const latestSub = latestSubMap.get(e.id);
      return {
        entryId: e.id,
        solverUserId: e.solver_id ?? null,
        teamId: e.team_id ?? null,
        submittedAt: latestSub?.submitted_at ?? null,
        scores: scoresMap.get(e.id) ?? [],
      };
    });

    const enriched = enrichEntriesWithScores(
      rawEntries,
      criteria,
      Number(ch.expert_weight) || 50,
      Number(ch.pitch_weight) || 50,
    );

    const topFinalists = selectTopFinalists(enriched, 3);
    const finalistEntryIds = new Set(topFinalists.map((f) => f.entryId));

    // Update DB: Set top 3 as finalists
    const now = new Date().toISOString();
    for (const f of topFinalists) {
      const { error: updErr } = await adminSupabase
        .from("challenge_entries")
        .update({
          is_finalist: true,
          finalist_selected_at: now,
          status: "finalist",
        })
        .eq("id", f.entryId);

      if (updErr) {
        console.error("Error updating finalist entry:", f.entryId, updErr);
      }
    }

    // Set other entries as eliminated
    const nonFinalistIds = entryIds.filter((id) => !finalistEntryIds.has(id));
    if (nonFinalistIds.length > 0) {
      await adminSupabase
        .from("challenge_entries")
        .update({ status: "eliminated" })
        .in("id", nonFinalistIds);
    }

    // Update challenge status to final_pitch
    const { error: chUpdErr } = await adminSupabase
      .from("challenges")
      .update({ status: "final_pitch" })
      .eq("id", challengeId);

    if (chUpdErr) {
      console.error("Error updating challenge status to final_pitch:", chUpdErr);
    }

    // Send notifications
    const notifications: Array<{
      userId: string;
      type: string;
      title: string;
      body: string;
      actionUrl?: string;
      challengeId?: string;
    }> = [];

    for (const e of entries) {
      const isFinalist = finalistEntryIds.has(e.id);
      let recipientUserIds: string[] = [];

      if (e.team_id) {
        const { data: members } = await adminSupabase
          .from("team_members")
          .select("user_id")
          .eq("team_id", e.team_id)
          .eq("status", "active");
        recipientUserIds = (members ?? []).map((m: any) => m.user_id);
      } else if (e.solver_id) {
        recipientUserIds = [e.solver_id];
      }

      for (const userId of recipientUserIds) {
        if (isFinalist) {
          notifications.push({
            userId,
            type: "challenge",
            title: "🎉 Selamat! Kamu Masuk Top 3 Finalist!",
            body: e.team_id
              ? `Tim Anda pada challenge "${ch.name}" berhasil terpilih sebagai Top 3 Finalist. Bersiaplah untuk tahap Pitching Final!`
              : `Solusimu pada challenge "${ch.name}" berhasil terpilih sebagai Top 3 Finalist. Bersiaplah untuk tahap Pitching Final!`,
            actionUrl: `/solver/challenge/${challengeId}`,
            challengeId,
          });
        } else {
          notifications.push({
            userId,
            type: "challenge",
            title: "Hasil Seleksi Penjurian Ahli",
            body: e.team_id
              ? `Terima kasih atas partisipasi tim Anda pada challenge "${ch.name}". Tim Anda belum lolos ke tahap Final Pitch kali ini.`
              : `Terima kasih atas partisipasimu pada challenge "${ch.name}". Kamu belum lolos ke tahap Final Pitch kali ini.`,
            actionUrl: `/solver/challenge/${challengeId}`,
            challengeId,
          });
        }
      }
    }
    await insertBatchNotifications(supabase, notifications);

    triggerRevalidateManagePaths(challengeId);
    return { success: true, finalistCount: topFinalists.length };
  } catch (err: any) {
    return { success: false, error: err?.message || "Gagal memilih finalis." };
  }
}

// ============================================================
// PHASE TRANSITION: ANNOUNCE WINNER (final_pitch -> completed)
// ============================================================

export async function announceWinnerAction(
  challengeId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Sesi berakhir." };

    const { data: ch } = await supabase
      .from("challenges")
      .select("id, name, prize_pool, expert_weight, pitch_weight")
      .eq("id", challengeId)
      .eq("seeker_id", user.id)
      .maybeSingle();

    if (!ch) return { success: false, error: "Challenge tidak ditemukan atau akses ditolak." };

    const adminSupabase = getAdminClient();

    // Fetch criteria
    const { data: criteriaRows } = await adminSupabase
      .from("judging_criteria")
      .select("id, stage")
      .eq("challenge_id", challengeId);

    const criteria: CriterionRow[] = (criteriaRows ?? []).map((c: any) => ({
      id: c.id,
      stage: c.stage,
    }));

    // Fetch finalist entries
    const { data: entries } = await adminSupabase
      .from("challenge_entries")
      .select("id, solver_id, team_id, is_finalist, status")
      .eq("challenge_id", challengeId)
      .or("is_finalist.eq.true,status.eq.finalist");

    if (!entries || entries.length === 0) {
      return { success: false, error: "Tidak ada finalis untuk ditentukan sebagai pemenang." };
    }

    const entryIds = entries.map((e: any) => e.id);

    // Fetch submissions separately
    const { data: subRows } = await adminSupabase
      .from("submissions")
      .select("entry_id, drive_url, submitted_at")
      .in("entry_id", entryIds)
      .order("submitted_at", { ascending: false });

    const latestSubMap = new Map<string, any>();
    for (const sub of subRows ?? []) {
      if (!latestSubMap.has(sub.entry_id)) {
        latestSubMap.set(sub.entry_id, sub);
      }
    }

    const { data: scoreRows } = await adminSupabase
      .from("criterion_scores")
      .select("entry_id, criterion_id, score")
      .in("entry_id", entryIds);

    const scoresMap = new Map<string, Array<{ criterion_id: string; score: number }>>();
    for (const r of scoreRows ?? []) {
      const entryId = (r as any).entry_id;
      if (!scoresMap.has(entryId)) scoresMap.set(entryId, []);
      scoresMap.get(entryId)!.push({ criterion_id: (r as any).criterion_id, score: Number((r as any).score) });
    }

    const rawEntries = entries.map((e: any) => {
      const latestSub = latestSubMap.get(e.id);
      return {
        entryId: e.id,
        solverUserId: e.solver_id ?? null,
        teamId: e.team_id ?? null,
        submittedAt: latestSub?.submitted_at ?? null,
        scores: scoresMap.get(e.id) ?? [],
      };
    });

    const enriched = enrichEntriesWithScores(
      rawEntries,
      criteria,
      Number(ch.expert_weight) || 50,
      Number(ch.pitch_weight) || 50,
    );

    const ranked = rankFinalists(enriched);
    const prizePool = Number(ch.prize_pool) || 0;

    // Distribute prize pool dynamically based on number of finalists:
    // If only 1 finalist/winner: Rank 1 gets 100% of the prize pool
    // If 2 finalists: Rank 1 gets 70%, Rank 2 gets 30%
    // If 3+ finalists: Rank 1 gets 60%, Rank 2 gets 25%, Rank 3 gets 15%
    let prizeDistribution: Record<number, number> = {};
    if (ranked.length === 1) {
      prizeDistribution = { 1: prizePool };
    } else if (ranked.length === 2) {
      prizeDistribution = {
        1: Math.round(prizePool * 0.7),
        2: Math.round(prizePool * 0.3),
      };
    } else {
      prizeDistribution = {
        1: Math.round(prizePool * 0.6),
        2: Math.round(prizePool * 0.25),
        3: Math.round(prizePool * 0.15),
      };
    }

    for (const r of ranked) {
      const isRank1 = r.rank === 1;
      await adminSupabase
        .from("challenge_entries")
        .update({
          is_winner: isRank1,
          winner_rank: r.rank,
          status: isRank1 ? "winner" : "finalist",
        })
        .eq("id", r.entryId);

      let recipientUserId: string | null = r.solverUserId;
      if (!recipientUserId && r.teamId) {
        const { data: team } = await adminSupabase
          .from("teams")
          .select("captain_id")
          .eq("id", r.teamId)
          .maybeSingle();
        recipientUserId = team?.captain_id ?? null;
      }

      const prizeAmount = prizeDistribution[r.rank] ?? 0;

      // Insert prize award (actual columns: entry_id, recipient_user_id, amount, note)
      await adminSupabase.from("prize_awards").upsert(
        {
          entry_id: r.entryId,
          recipient_user_id: recipientUserId,
          amount: prizeAmount,
          note: `Juara ${r.rank}`,
        },
        { onConflict: "entry_id" },
      );

      // Insert certificate (actual columns: entry_id, user_id, certificate_number)
      if (recipientUserId) {
        await adminSupabase.from("certificates").upsert(
          {
            entry_id: r.entryId,
            user_id: recipientUserId,
            certificate_number: `CERT-${challengeId.slice(0, 8).toUpperCase()}-${r.rank}`,
          },
          { onConflict: "entry_id" },
        );
      }

      // Credit prize balance for winners (Top 3)
      // Individual: credited to solverUserId
      // Team: credited to team's captain_id ONLY
      if (recipientUserId && prizeAmount > 0) {
        const { data: sp } = await adminSupabase
          .from("solver_profiles")
          .select("balance")
          .eq("user_id", recipientUserId)
          .maybeSingle();

        const currentBalance = Number(sp?.balance ?? 0);
        const newBalance = currentBalance + prizeAmount;

        const { error: spErr } = await adminSupabase
          .from("solver_profiles")
          .update({ balance: newBalance })
          .eq("user_id", recipientUserId);

        if (spErr) {
          console.error("announceWinnerAction: error updating solver balance:", spErr);
        }

        // Record in balance_transactions
        const { error: txErr } = await adminSupabase
          .from("balance_transactions")
          .insert({
            user_id: recipientUserId,
            amount: prizeAmount,
            type: "prize",
            description: `Hadiah Juara ${r.rank} - ${ch.name}`,
            reference_id: challengeId,
          });

        if (txErr) {
          console.error("announceWinnerAction: error inserting balance_transaction:", txErr);
        }
      }
    }

    // Update challenge status to completed
    await adminSupabase
      .from("challenges")
      .update({ status: "completed" })
      .eq("id", challengeId);

    // Send notifications to all participants
    const { data: allEntries } = await adminSupabase
      .from("challenge_entries")
      .select("id, solver_id, team_id, team_name_snapshot, winner_rank, is_winner, status")
      .eq("challenge_id", challengeId);

    const notifications: Array<{
      userId: string;
      type: string;
      title: string;
      body: string;
      actionUrl?: string;
      challengeId?: string;
    }> = [];

    for (const e of allEntries ?? []) {
      const rankObj = ranked.find((r) => r.entryId === e.id);
      const isWinner = Boolean(rankObj && rankObj.rank <= 3);
      const prizeAmount = rankObj ? (prizeDistribution[rankObj.rank] ?? 0) : 0;
      const rankLabel = rankObj?.rank === 1 ? "Juara 1 🏆" : rankObj?.rank === 2 ? "Juara 2 🥈" : "Juara 3 🥉";

      if (e.team_id) {
        // Fetch team captain and active members
        const { data: team } = await adminSupabase
          .from("teams")
          .select("captain_id")
          .eq("id", e.team_id)
          .maybeSingle();
        const captainId = team?.captain_id;

        const { data: members } = await adminSupabase
          .from("team_members")
          .select("user_id")
          .eq("team_id", e.team_id)
          .eq("status", "active");

        const teamName = e.team_name_snapshot || "Tim";

        for (const member of members ?? []) {
          const isCaptain = member.user_id === captainId;
          if (isWinner && rankObj) {
            if (isCaptain) {
              notifications.push({
                userId: member.user_id,
                type: "earnings",
                title: `🏆 ${rankLabel} Challenge — Tim ${teamName}!`,
                body: `Selamat! Tim "${teamName}" berhasil meraih ${rankLabel} pada challenge "${ch.name}". Hadiah senilai Rp ${prizeAmount.toLocaleString("id-ID")} telah ditambahkan ke saldo Anda sebagai perwakilan ketua tim!`,
                actionUrl: `/solver/earnings`,
                challengeId,
              });
            } else {
              notifications.push({
                userId: member.user_id,
                type: "earnings",
                title: `🏆 ${rankLabel} Challenge — Tim ${teamName}!`,
                body: `Selamat! Tim "${teamName}" berhasil meraih ${rankLabel} pada challenge "${ch.name}". Uang pembinaan sebesar Rp ${prizeAmount.toLocaleString("id-ID")} diserahkan melalui perwakilan ketua tim.`,
                actionUrl: `/solver/challenge/${challengeId}`,
                challengeId,
              });
            }
          } else {
            notifications.push({
              userId: member.user_id,
              type: "challenge",
              title: "Pengumuman Pemenang Challenge",
              body: `Pemenang resmi challenge "${ch.name}" telah diumumkan. Terima kasih atas partisipasi tim "${teamName}"!`,
              actionUrl: `/solver/challenge/${challengeId}`,
              challengeId,
            });
          }
        }
      } else if (e.solver_id) {
        if (isWinner && rankObj) {
          notifications.push({
            userId: e.solver_id,
            type: "earnings",
            title: `🏆 ${rankLabel} Challenge!`,
            body: `Selamat! Solusi Anda meraih ${rankLabel} pada challenge "${ch.name}". Hadiah senilai Rp ${prizeAmount.toLocaleString("id-ID")} telah ditambahkan ke saldo akun Anda!`,
            actionUrl: `/solver/earnings`,
            challengeId,
          });
        } else {
          notifications.push({
            userId: e.solver_id,
            type: "challenge",
            title: "Pengumuman Pemenang Challenge",
            body: `Pemenang resmi challenge "${ch.name}" telah diumumkan. Terima kasih atas partisipasimu!`,
            actionUrl: `/solver/challenge/${challengeId}`,
            challengeId,
          });
        }
      }
    }
    await insertBatchNotifications(supabase, notifications);

    triggerRevalidateManagePaths(challengeId);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Gagal mengumumkan pemenang." };
  }
}

function fEntryId(id: string): string {
  return id;
}

