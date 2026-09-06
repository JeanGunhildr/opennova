import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/user";
import { getCurrentProfile } from "@/lib/supabase/profile";
import { createClient } from "@/lib/supabase/server";
import WorkspaceClient from "@/component/dashboard/WorkspaceClient";
import type { WorkspaceChallengeItem } from "@/component/dashboard/WorkspaceChallengeCard";

export const dynamic = "force-dynamic";

export default async function WorkspacePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/");
  }

  const profile = await getCurrentProfile();

  if (profile?.role === "seeker") {
    redirect("/seeker");
  }

  const supabase = await createClient();

  // ── 1. Query entries joined via challenge_entry_members ──────
  const { data: memberRows, error: memberErr } = await supabase
    .from("challenge_entry_members")
    .select(`
      entry_id,
      user_id,
      role_snapshot,
      joined_at,
      challenge_entries!inner (
        id,
        challenge_id,
        participation_type,
        solver_id,
        team_id,
        team_name_snapshot,
        status,
        is_winner,
        joined_at,
        challenges!inner (
          id,
          seeker_id,
          category_id,
          name,
          description,
          thumbnail_path,
          prize_pool,
          deadline,
          status,
          created_at,
          expert_weight,
          pitch_weight,
          categories (
            id,
            name
          ),
          seeker_profiles (
            company_name,
            company_type,
            legal_document_path
          )
        ),
        submissions (
          id,
          drive_url,
          submitted_at
        )
      )
    `)
    .eq("user_id", user.id);

  if (memberErr) {
    console.error("Error fetching member workspace entries:", memberErr);
  }

  // ── 2. Query direct challenge_entries by solver_id ────────────
  const { data: directRows, error: directErr } = await supabase
    .from("challenge_entries")
    .select(`
      id,
      challenge_id,
      participation_type,
      solver_id,
      team_id,
      team_name_snapshot,
      status,
      is_winner,
      joined_at,
      challenges!inner (
        id,
        seeker_id,
        category_id,
        name,
        description,
        thumbnail_path,
        prize_pool,
        deadline,
        status,
        created_at,
        expert_weight,
        pitch_weight,
        categories (
          id,
          name
        ),
        seeker_profiles (
          company_name,
          company_type,
          legal_document_path
        )
      ),
      submissions (
        id,
        drive_url,
        submitted_at
      )
    `)
    .eq("solver_id", user.id);

  if (directErr) {
    console.error("Error fetching direct workspace entries:", directErr);
  }

  // ── 3. Combine and deduplicate entries ────────────────────────
  const itemsMap = new Map<string, WorkspaceChallengeItem>();

  const GRADIENTS = [
    { bgFrom: "#1a2035", bgVia: "#1e3358", bgTo: "#0d1524" },
    { bgFrom: "#0d2818", bgVia: "#184d30", bgTo: "#0a1f12" },
    { bgFrom: "#1c1008", bgVia: "#2d1a06", bgTo: "#3d2206" },
    { bgFrom: "#0a1a2e", bgVia: "#0d2540", bgTo: "#071624" },
    { bgFrom: "#1a1a0a", bgVia: "#2e2e12", bgTo: "#1a1a08" },
    { bgFrom: "#0f1a10", bgVia: "#1a2e1c", bgTo: "#0c150d" },
  ];

  const processEntryRow = (entry: any) => {
    if (!entry) return;
    const entryId = entry.id;
    if (itemsMap.has(entryId)) return;

    const ch = Array.isArray(entry.challenges) ? entry.challenges[0] : entry.challenges;
    if (!ch || !ch.id) return;

    const categoryName = Array.isArray(ch?.categories)
      ? ch.categories[0]?.name
      : ch?.categories?.name || "Umum";

    const seekerObj = Array.isArray(ch?.seeker_profiles)
      ? ch.seeker_profiles[0]
      : ch?.seeker_profiles;

    const companyName = seekerObj?.company_name || "Perusahaan Seeker";
    const initials =
      companyName
        .split(" ")
        .map((w: string) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() || "PR";

    const verified = Boolean(seekerObj?.legal_document_path);

    const prizePool = Number(ch?.prize_pool) || 0;
    const reward = `Rp ${prizePool.toLocaleString("id-ID")}`;

    const rawDeadline = ch.deadline;
    let formattedDeadline = "Belum ditentukan";
    let isOverdue = false;

    if (rawDeadline) {
      const deadlineDate = new Date(rawDeadline);
      const now = new Date();
      const diffMs = deadlineDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

      if (diffMs < 0) {
        formattedDeadline = "Submission ditutup";
        isOverdue = true;
      } else if (diffDays === 0) {
        formattedDeadline = "Berakhir hari ini";
        isOverdue = true;
      } else if (diffDays === 1) {
        formattedDeadline = "1 hari lagi";
        isOverdue = true;
      } else if (diffDays <= 7) {
        formattedDeadline = `${diffDays} hari lagi`;
        isOverdue = true;
      } else if (diffDays <= 30) {
        formattedDeadline = `${diffDays} hari lagi`;
        isOverdue = false;
      } else {
        formattedDeadline = deadlineDate.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
        isOverdue = false;
      }
    }

    const submissions = Array.isArray(entry.submissions) ? entry.submissions : [];
    const hasSubmission = submissions.length > 0;
    const submissionDriveUrl = submissions[0]?.drive_url || "";

    const challengeStatus = (ch?.status || "ongoing").toLowerCase() as any;
    const entryStatus = (entry.status || "registered").toLowerCase() as any;

    // ACTIVE SLOT DEFINITION:
    // challenge.status != 'completed' AND entry.status != 'eliminated'
    const isActiveSlot = challengeStatus !== "completed" && entryStatus !== "eliminated";

    const gradient = GRADIENTS[itemsMap.size % GRADIENTS.length];

    itemsMap.set(entryId, {
      id: ch.id,
      entryId,
      title: ch.name || "Tantangan Tanpa Judul",
      description: ch.description || "",
      category: categoryName,
      company: companyName,
      companyInitials: initials,
      verified,
      reward,
      prizePool,
      deadline: rawDeadline,
      rawDeadline,
      formattedDeadline,
      isOverdue,
      challengeStatus,
      entryStatus,
      participationType: entry.participation_type || "individual",
      teamName: entry.team_name_snapshot || "",
      hasSubmission,
      submissionDriveUrl,
      thumbnailPath: ch.thumbnail_path,
      isActiveSlot,
      bgFrom: gradient.bgFrom,
      bgVia: gradient.bgVia,
      bgTo: gradient.bgTo,
    });
  };

  (memberRows ?? []).forEach((row: any) => {
    const entry = Array.isArray(row.challenge_entries)
      ? row.challenge_entries[0]
      : row.challenge_entries;
    processEntryRow(entry);
  });

  (directRows ?? []).forEach((entry: any) => {
    processEntryRow(entry);
  });

  // ── 4. Process summary statistics ─────────────────────────────
  const allWorkspaceItems = Array.from(itemsMap.values());
  const activeItems = allWorkspaceItems.filter((item) => item.isActiveSlot);
  const completedItems = allWorkspaceItems.filter((item) => !item.isActiveSlot);

  const activeCount = activeItems.length;
  const completedCount = completedItems.length;

  const totalPotentialReward = activeItems.reduce((sum, item) => sum + item.prizePool, 0);

  const formatPotentialLabel = (amount: number): string => {
    if (!amount || amount === 0) return "Rp 0";
    if (amount >= 1_000_000_000) {
      const bill = amount / 1_000_000_000;
      return `Rp ${bill % 1 === 0 ? bill.toFixed(0) : bill.toFixed(1)}M`;
    }
    if (amount >= 1_000_000) {
      const mill = amount / 1_000_000;
      return `Rp ${mill % 1 === 0 ? mill.toFixed(0) : mill.toFixed(0)}jt`;
    }
    return `Rp ${amount.toLocaleString("id-ID")}`;
  };

  const potentialRewardLabel = formatPotentialLabel(totalPotentialReward);

  return (
    <WorkspaceClient
      activeItems={activeItems}
      completedItems={completedItems}
      activeCount={activeCount}
      completedCount={completedCount}
      totalPotentialReward={totalPotentialReward}
      potentialRewardLabel={potentialRewardLabel}
    />
  );
}
