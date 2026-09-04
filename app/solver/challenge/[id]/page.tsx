// app/solver/challenge/[id]/page.tsx
// Next.js dynamic route — params: Promise<{ id: string }>

import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ChallengeDetailClient from "@/component/dashboard/challenge-detail/ChallengeDetailClient";
import type { HeroStatus } from "@/component/dashboard/challenge-detail/ChallengeHero";
import type { ChallengeActionState, CaptainTeamOption } from "@/component/dashboard/challenge-detail/ChallengeActionWidget";

export const dynamic = "force-dynamic";

export default async function ChallengeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Default participation state
  let userParticipationState: ChallengeActionState = "ACTIVE_NOT_JOINED";
  let userTeamName = "";
  let captainTeams: CaptainTeamOption[] = [];
  let existingSubmissionUrl = "";

  const supabase = await createClient();

  // ── Fetch Challenge detail from Supabase DB ──────────────
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
      ),
      challenge_entries (
        id
      )
    `)
    .eq("id", id)
    .maybeSingle();

  if (dbError) {
    console.error("Error fetching challenge detail from DB:", dbError);
  }

  // Challenge not found in DB → 404
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

  const companyName = seekerObj?.company_name || "Penyelenggara Challenge";

  const initials = companyName
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

  const participantCount = Array.isArray(dbCh.challenge_entries)
    ? dbCh.challenge_entries.length
    : 0;

  // Hero status badge — derived from deadline or challenge status
  let heroStatus: HeroStatus;
  const now = new Date();
  if (deadlineObj && deadlineObj > now) {
    const diffMs = deadlineObj.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    heroStatus = {
      label: diffDays <= 7 ? `${diffDays} hari lagi` : formattedDeadline,
      style: "deadline",
    };
  } else if (
    (dbCh.status || "").toLowerCase() === "published" ||
    (dbCh.status || "").toLowerCase() === "active" ||
    (dbCh.status || "").toLowerCase() === "ongoing"
  ) {
    heroStatus = { label: "Dibuka", style: "success" };
  } else {
    heroStatus = { label: formattedDeadline, style: "deadline" };
  }

  const objectives = dbCh.challenge_objectives || [];
  const requirements = dbCh.challenge_requirements || [];
  const criteria = dbCh.judging_criteria || [];
  const timelines = dbCh.challenge_timelines || [];

  // ── Fetch User Auth & participation state ─────────────────
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      // 1. Fetch user's captain teams
      const { data: myCaptainTeamsData } = await supabase
        .from("teams")
        .select(`
          id,
          name,
          team_members (id)
        `)
        .eq("captain_id", user.id)
        .eq("is_active", true);

      if (myCaptainTeamsData) {
        captainTeams = myCaptainTeamsData.map((t: any) => ({
          id: t.id,
          name: t.name,
          memberCount: Array.isArray(t.team_members) ? t.team_members.length : 1,
        }));
      }

      // 2. Fetch individual challenge entry
      const { data: indEntry } = await supabase
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
        .maybeSingle();

      if (indEntry) {
        userParticipationState = "ACTIVE_JOINED_INDIVIDUAL";
        const subDriveUrl = Array.isArray(indEntry.submissions)
          ? indEntry.submissions[0]?.drive_url
          : (indEntry.submissions as any)?.drive_url;
        existingSubmissionUrl = subDriveUrl || "";
      } else {
        // Cek pendaftaran tim
        const { data: myMemberships } = await supabase
          .from("team_members")
          .select("team_id")
          .eq("user_id", user.id)
          .eq("status", "active");

        const userTeamIds = (myMemberships || []).map((m: any) => m.team_id);

        if (userTeamIds.length > 0) {
          const { data: teamEntry } = await supabase
            .from("challenge_entries")
            .select(`
              id,
              status,
              team_id,
              team_name_snapshot,
              teams (captain_id),
              submissions (
                drive_url
              )
            `)
            .eq("challenge_id", id)
            .in("team_id", userTeamIds)
            .maybeSingle();

          if (teamEntry) {
            userTeamName = teamEntry.team_name_snapshot || "Tim Anda";
            const subDriveUrl = Array.isArray(teamEntry.submissions)
              ? teamEntry.submissions[0]?.drive_url
              : (teamEntry.submissions as any)?.drive_url;
            existingSubmissionUrl = subDriveUrl || "";

            const captainId = (teamEntry.teams as any)?.captain_id;

            if (captainId === user.id) {
              userParticipationState = "ACTIVE_JOINED_TEAM_LEADER";
            } else {
              userParticipationState = "ACTIVE_JOINED_TEAM_MEMBER";
            }
          }
        }
      }
    }
  } catch (err) {
    console.error("Error fetching user participation state:", err);
  }

  return (
    <ChallengeDetailClient
      id={id}
      category={categoryName}
      title={dbCh.name}
      company={companyName}
      companyInitials={initials}
      companyAbout={seekerObj?.company_description || ""}
      companyIndustry={seekerObj?.company_type || categoryName}
      companyWebsite={seekerObj?.website || ""}
      reward={formattedReward}
      deadline={formattedDeadline}
      participantCount={participantCount}
      status={dbCh.status || "published"}
      description={dbCh.description || "Deskripsi tantangan belum tersedia."}
      heroStatus={heroStatus}
      thumbnailPath={dbCh.thumbnail_path}
      objectives={objectives}
      requirements={requirements}
      criteria={criteria}
      timelines={timelines}
      expertWeight={Number(dbCh.expert_weight) || 50}
      pitchWeight={Number(dbCh.pitch_weight) || 50}
      verified={Boolean(seekerObj?.legal_document_path)}
      jenisPerusahaan={seekerObj?.company_type || null}
      deskripsiPerusahaan={seekerObj?.company_description || null}
      alamatDomain={seekerObj?.website || null}
      userParticipationState={userParticipationState}
      userTeamName={userTeamName}
      captainTeams={captainTeams}
      existingSubmissionUrl={existingSubmissionUrl}
    />
  );
}