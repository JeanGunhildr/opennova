// app/solver/challenge/[id]/page.tsx

// Next.js dynamic route — params: Promise<{ id: string }>

import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import { getDiscussionsAction } from "@/lib/actions/discussion";

import ChallengeDetailClient from "@/component/dashboard/challenge-detail/ChallengeDetailClient";

import type { HeroStatus } from "@/component/dashboard/challenge-detail/ChallengeHero";

import type {
  ChallengeActionState,
  CaptainTeamOption,
} from "@/component/dashboard/challenge-detail/ChallengeActionWidget";

import type { ScoreCriterion } from "@/component/dashboard/challenge-detail/ScorePanel";

export const dynamic = "force-dynamic";

export default async function ChallengeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // ── Default participation state ──────────────────────────

  let userParticipationState: ChallengeActionState = "ACTIVE_NOT_JOINED";

  let userTeamName = "";

  let captainTeams: CaptainTeamOption[] = [];

  let existingSubmissionUrl = "";

  let scoreCriteria: ScoreCriterion[] = [];

  let isFullyJudged = false;

  const supabase = await createClient();

  // ── Fetch Challenge detail from Supabase DB ───────────────

  const { data: dbCh, error: dbError } = await supabase
    .from("challenges")
    .select(`
      id,
      name,
      description,
      thumbnail_path,
      prize_pool,
      deadline,
      status,
      expert_weight,
      pitch_weight,

      categories (
        id,
        name
      ),

      seeker_profiles (
        company_name,
        representative_name,
        company_type,
        company_description,
        website,
        legal_document_path
      ),

      challenge_objectives (
        id,
        content
      ),

      challenge_requirements (
        id,
        content
      ),

      judging_criteria (
        id,
        stage,
        name,
        description
      ),

      challenge_timelines (
        id,
        title,
        start_date,
        end_date
      )

    `)
    .eq("id", id)
    .maybeSingle();

  if (dbError) {
    console.error("Error fetching challenge detail from DB:", dbError);
  }

  // Challenge tidak ditemukan → 404
  if (!dbCh) {
    notFound();
  }

  // ── Map DB data → display values ──────────────────────────

  const categoryName = Array.isArray(dbCh.categories)
    ? dbCh.categories[0]?.name
    : (dbCh.categories as any)?.name || "Umum";

  const seekerObj = Array.isArray(dbCh.seeker_profiles)
    ? dbCh.seeker_profiles[0]
    : (dbCh.seeker_profiles as any);

  const companyName =
    seekerObj?.company_name || "Penyelenggara Challenge";

  const initials =
    companyName
      .split(" ")
      .map((w: string) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "PR";

  const deadlineObj = dbCh.deadline ? new Date(dbCh.deadline) : null;

  const formattedDeadline = deadlineObj
    ? deadlineObj.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Belum ditentukan";

  const prize = Number(dbCh.prize_pool) || 0;

  const formattedReward =
    prize > 0 ? `Rp ${prize.toLocaleString("id-ID")}` : "—";

  // ── Hero status ───────────────────────────────────────────

  let heroStatus: HeroStatus;

  const now = new Date();

  if (deadlineObj && deadlineObj > now) {
    const diffMs = deadlineObj.getTime() - now.getTime();

    const diffDays = Math.ceil(
      diffMs / (1000 * 60 * 60 * 24)
    );

    heroStatus = {
      label:
        diffDays <= 7
          ? `${diffDays} hari lagi`
          : formattedDeadline,
      style: "deadline",
    };
  } else if (
    (dbCh.status || "").toLowerCase() === "published" ||
    (dbCh.status || "").toLowerCase() === "active" ||
    (dbCh.status || "").toLowerCase() === "ongoing"
  ) {
    heroStatus = {
      label: "Dibuka",
      style: "success",
    };
  } else {
    heroStatus = {
      label: formattedDeadline,
      style: "deadline",
    };
  }

  const objectives = dbCh.challenge_objectives || [];

  const requirements = dbCh.challenge_requirements || [];

  const criteria = dbCh.judging_criteria || [];

  const timelines = dbCh.challenge_timelines || [];

const {
  data: participantCountData,
  error: participantCountError,
} = await supabase.rpc("get_challenge_participant_count", {
  _challenge_id: id,
});

const participantCount = Number(participantCountData) || 0;

if (participantCountError) {
  console.error(
    "Error fetching participant count:",
    participantCountError
  );
}

  // ── Fetch User Auth & participation state ────────────────

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      // ── 1. Fetch user's captain teams ─────────────────────

      const { data: myCaptainTeamsData, error: captainTeamsError } =
        await supabase
          .from("teams")
          .select(`
            id,
            name,
            team_members (
              id
            )
          `)
          .eq("captain_id", user.id)
          .eq("is_active", true);

      if (captainTeamsError) {
        console.error(
          "Error fetching captain teams:",
          captainTeamsError
        );
      }

      if (myCaptainTeamsData) {
        captainTeams = myCaptainTeamsData.map((t: any) => ({
          id: t.id,
          name: t.name,
          memberCount: Array.isArray(t.team_members)
            ? t.team_members.length
            : 1,
        }));
      }

      // ── 2. Fetch individual challenge entry ──────────────

      const { data: indEntry, error: indEntryError } =
        await supabase
          .from("challenge_entries")
          .select(`
            id,
            status,
            participation_type,

            submissions (
              drive_url
            )
          `)
          .eq("challenge_id", id)
          .eq("solver_id", user.id)
          .eq("participation_type", "individual")
          .maybeSingle();

      if (indEntryError) {
        console.error(
          "Error fetching individual entry:",
          indEntryError
        );
      }

      if (indEntry) {
        userParticipationState =
          "ACTIVE_JOINED_INDIVIDUAL";

        const subDriveUrl = Array.isArray(
          indEntry.submissions
        )
          ? indEntry.submissions[0]?.drive_url
          : (indEntry.submissions as any)?.drive_url;

        existingSubmissionUrl = subDriveUrl || "";
      } else {
        // ── 3. Fetch team registration from SNAPSHOT ───────
        //
        // Jangan lagi menggunakan team_members untuk menentukan
        // apakah user terdaftar di challenge.
        //
        // team_members = komposisi tim saat ini
        // challenge_entry_members = snapshot peserta challenge

        const { data: myEntryMembership, error: membershipError } =
          await supabase
            .from("challenge_entry_members")
            .select(`
              entry_id,
              role_snapshot,

              challenge_entries!inner (
                id,
                challenge_id,
                status,
                participation_type,
                team_id,
                team_name_snapshot,

                submissions (
                  drive_url
                )
              )
            `)
            .eq("user_id", user.id)
            .eq("challenge_entries.challenge_id", id)
            .eq("challenge_entries.participation_type", "team")
            .maybeSingle();

        if (membershipError) {
          console.error(
            "Error fetching challenge entry membership:",
            membershipError
          );
        }

        if (myEntryMembership) {
          const teamEntry = Array.isArray(
            myEntryMembership.challenge_entries
          )
            ? myEntryMembership.challenge_entries[0]
            : (myEntryMembership.challenge_entries as any);

          if (teamEntry) {
            userTeamName =
              teamEntry.team_name_snapshot || "Tim Anda";

            const subDriveUrl = Array.isArray(
              teamEntry.submissions
            )
              ? teamEntry.submissions[0]?.drive_url
              : (teamEntry.submissions as any)?.drive_url;

            existingSubmissionUrl = subDriveUrl || "";

            // role_snapshot berasal dari snapshot saat
            // pendaftaran challenge.
            //
            // captain → boleh submit
            // member  → hanya terdaftar sebagai anggota

            if (
              myEntryMembership.role_snapshot === "captain"
            ) {
              userParticipationState =
                "ACTIVE_JOINED_TEAM_LEADER";
            } else {
              userParticipationState =
                "ACTIVE_JOINED_TEAM_MEMBER";
            }
          }
        }
      }

      // ── 4. Tentukan entry ID untuk mengambil skor ─────────

      let userEntryId: string | null = null;

      if (
        userParticipationState ===
        "ACTIVE_JOINED_INDIVIDUAL"
      ) {
        const { data: entryRow } = await supabase
          .from("challenge_entries")
          .select("id")
          .eq("challenge_id", id)
          .eq("solver_id", user.id)
          .eq("participation_type", "individual")
          .maybeSingle();

        userEntryId = entryRow?.id ?? null;
      } else if (
        userParticipationState ===
          "ACTIVE_JOINED_TEAM_LEADER" ||
        userParticipationState ===
          "ACTIVE_JOINED_TEAM_MEMBER"
      ) {
        // Cari entry melalui snapshot.
        //
        // Ini lebih aman daripada melihat team_members karena
        // komposisi team_members dapat berubah setelah challenge
        // selesai / setelah team di-unlock.

        const { data: membershipRow } = await supabase
          .from("challenge_entry_members")
          .select(`
            entry_id,
            challenge_entries!inner (
              id,
              challenge_id,
              participation_type
            )
          `)
          .eq("user_id", user.id)
          .eq("challenge_entries.challenge_id", id)
          .eq("challenge_entries.participation_type", "team")
          .maybeSingle();

        userEntryId = membershipRow?.entry_id ?? null;
      }

      // ── 5. Fetch skor ────────────────────────────────────

      if (userEntryId && existingSubmissionUrl) {
        const { data: scores, error: scoresError } =
          await supabase
            .from("criterion_scores")
            .select(`
              id,
              criterion_id,
              score,

              judging_criteria (
                id,
                name,
                stage
              )
            `)
            .eq("entry_id", userEntryId);

        if (scoresError) {
          console.error(
            "Error fetching criterion scores:",
            scoresError
          );
        }

        if (scores && scores.length > 0) {
          scoreCriteria = scores.map((s: any) => {
            const crit = Array.isArray(
              s.judging_criteria
            )
              ? s.judging_criteria[0]
              : s.judging_criteria;

            return {
              id: s.criterion_id,
              name: crit?.name || "Kriteria",
              stage: (crit?.stage ||
                "expert_judging") as
                | "expert_judging"
                | "final_pitch",
              score: Number(s.score),
              maxScore: 100,
            };
          });

          const totalCriteriaCount = Array.isArray(
            dbCh.judging_criteria
          )
            ? dbCh.judging_criteria.length
            : 0;

          isFullyJudged =
            totalCriteriaCount > 0 &&
            scoreCriteria.length >= totalCriteriaCount;
        } else if (existingSubmissionUrl) {
          // Sudah submit tapi belum dinilai.

          const allCriteria: any[] = Array.isArray(
            dbCh.judging_criteria
          )
            ? dbCh.judging_criteria
            : [];

          scoreCriteria = allCriteria.map((c: any) => ({
            id: c.id,
            name: c.name,
            stage: (c.stage ||
              "expert_judging") as
              | "expert_judging"
              | "final_pitch",
            score: null,
            maxScore: 100,
          }));

          isFullyJudged = false;
        }
      }
    }
  } catch (err) {
    console.error(
      "Error fetching user participation state:",
      err
    );
  }

  // ── Discussions ───────────────────────────────────────────

  const discussions = await getDiscussionsAction(id);

  // ── Render ────────────────────────────────────────────────

  return (
    <ChallengeDetailClient
      id={id}
      category={categoryName}
      title={dbCh.name}
      company={companyName}
      companyInitials={initials}
      companyAbout={seekerObj?.company_description || ""}
      companyIndustry={
        seekerObj?.company_type || categoryName
      }
      companyWebsite={seekerObj?.website || ""}
      reward={formattedReward}
      deadline={formattedDeadline}
      participantCount={participantCount}
      status={dbCh.status || "published"}
      description={
        dbCh.description ||
        "Deskripsi tantangan belum tersedia."
      }
      heroStatus={heroStatus}
      thumbnailPath={dbCh.thumbnail_path}
      objectives={objectives}
      requirements={requirements}
      criteria={criteria}
      timelines={timelines}
      discussions={discussions}
      expertWeight={Number(dbCh.expert_weight) || 50}
      pitchWeight={Number(dbCh.pitch_weight) || 50}
      verified={Boolean(
        seekerObj?.legal_document_path
      )}
      jenisPerusahaan={
        seekerObj?.company_type || null
      }
      deskripsiPerusahaan={
        seekerObj?.company_description || null
      }
      alamatDomain={seekerObj?.website || null}
      userParticipationState={
        userParticipationState
      }
      userTeamName={userTeamName}
      captainTeams={captainTeams}
      existingSubmissionUrl={
        existingSubmissionUrl
      }
      scoreCriteria={scoreCriteria}
      isFullyJudged={isFullyJudged}
    />
  );
}