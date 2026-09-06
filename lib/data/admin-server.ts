import { createClient } from "@/lib/supabase/server";
import type {
  ActiveChallengeRow,
  ActiveChallengeStatus,
} from "./admin";

export interface AdminChallengeDetail {
  id: string;
  name: string;
  description: string | null;
  thumbnailPath: string | null;
  copyrightAgreementPath: string | null;
  prizePool: number;
  creationFee: number;
  totalPayment: number;
  deadline: string | null;
  status: ActiveChallengeStatus;
  rawStatus: string;
  createdAt: string;
  expertWeight: number;
  pitchWeight: number;
  seekerId: string;
  seekerName: string;
  seekerCompanyName: string | null;
  seekerRepresentative: string | null;
  seekerEmail: string | null;
  categoryName: string;
  objectives: string[];
  requirements: string[];
  criteria: { id: string; name: string; description: string | null; stage: string }[];
  timelines: { id: string; title: string; startDate: string | null; endDate: string | null }[];
}

/**
 * Map DB challenge status to UI label for Admin dashboard.
 * Fallback to raw status if unmapped, so no challenge is ever hidden.
 */
export function mapChallengeStatus(status: string): ActiveChallengeStatus {
  if (!status) return "Menunggu Persetujuan";

  switch (status.toLowerCase()) {
    case "pending":
      return "Menunggu Persetujuan";

    case "open":
    case "active":
    case "ongoing":
    case "published":
      return "Challenge Dibuka";

    case "expert_judging":
    case "judging":
      return "Penjurian Ahli";

    case "final_pitch":
      return "Pitching Final";

    case "completed":
      return "Selesai";

    case "rejected":
      return "Ditolak";

    default:
      return status as ActiveChallengeStatus;
  }
}

/**
 * Fetch ALL challenges from Supabase DB for Admin dashboard without status filtering.
 */
export async function getAdminChallenges(): Promise<ActiveChallengeRow[]> {
  try {
    const supabase = await createClient();

    // Query challenges with category relation and seeker profile
    const { data, error } = await supabase
      .from("challenges")
      .select(`
        id,
        name,
        prize_pool,
        status,
        created_at,
        seeker_id,
        categories (
          name
        ),
        seeker_profiles (
          company_name,
          profiles (
            full_name
          )
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("getAdminChallenges error:", {
        message: error?.message,
        details: error?.details,
        hint: error?.hint,
        code: error?.code,
      });
      return [];
    }

    console.log("Admin challenges count from DB:", data?.length ?? 0);

    return (data ?? []).map((ch: any) => {
      const categoryName = Array.isArray(ch.categories)
        ? ch.categories[0]?.name
        : (ch.categories as any)?.name ?? "Umum";

      const seekerProf = Array.isArray(ch.seeker_profiles)
        ? ch.seeker_profiles[0]
        : (ch.seeker_profiles as any);

      const seekerName =
        seekerProf?.company_name ||
        seekerProf?.profiles?.full_name ||
        "Seeker tidak diketahui";

      return {
        id: ch.id,
        name: ch.name || "Challenge Tanpa Nama",
        seekerName,
        category: categoryName,
        rewardAmount: Number(ch.prize_pool ?? 0),
        publishedAt: ch.created_at || new Date().toISOString(),
        status: mapChallengeStatus(ch.status || "pending"),
        rawStatus: ch.status || "pending",
      };
    });
  } catch (err: any) {
    console.error("getAdminChallenges unhandled exception:", err);
    return [];
  }
}

/**
 * Fetch detailed info for a single challenge by ID for Admin detail view.
 */
export async function getAdminChallengeById(
  challengeId: string
): Promise<AdminChallengeDetail | null> {
  try {
    const supabase = await createClient();

    const { data: ch, error } = await supabase
      .from("challenges")
      .select(`
        id,
        name,
        description,
        thumbnail_path,
        copyright_agreement_path,
        prize_pool,
        creation_fee,
        total_payment,
        deadline,
        status,
        created_at,
        expert_weight,
        pitch_weight,
        seeker_id,
        categories (
          name
        ),
        seeker_profiles (
          company_name,
          representative_name,
          profiles (
            full_name,
            phone
          )
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
          name,
          description,
          stage
        ),
        challenge_timelines (
          id,
          title,
          start_date,
          end_date
        )
      `)
      .eq("id", challengeId)
      .maybeSingle();

    if (error || !ch) {
      console.error("getAdminChallengeById error:", {
        challengeId,
        message: error?.message,
        details: error?.details,
        hint: error?.hint,
        code: error?.code,
      });
      return null;
    }

    const categoryName = Array.isArray(ch.categories)
      ? ch.categories[0]?.name
      : (ch.categories as any)?.name ?? "Umum";

    const seekerProf = Array.isArray(ch.seeker_profiles)
      ? ch.seeker_profiles[0]
      : (ch.seeker_profiles as any);

    const seekerName =
      seekerProf?.company_name ||
      seekerProf?.profiles?.full_name ||
      "Seeker tidak diketahui";

    const objectives = (ch.challenge_objectives ?? []).map(
      (o: any) => o.content as string
    );
    const requirements = (ch.challenge_requirements ?? []).map(
      (r: any) => r.content as string
    );

    const criteria = (ch.judging_criteria ?? []).map((c: any) => ({
      id: c.id,
      name: c.name,
      description: c.description,
      stage: c.stage || "expert_judging",
    }));

    const timelines = (ch.challenge_timelines ?? []).map((t: any) => ({
      id: t.id,
      title: t.title,
      startDate: t.start_date,
      endDate: t.end_date,
    }));

    return {
      id: ch.id,
      name: ch.name || "Challenge Tanpa Nama",
      description: ch.description ?? null,
      thumbnailPath: ch.thumbnail_path ?? null,
      copyrightAgreementPath: ch.copyright_agreement_path ?? null,
      prizePool: Number(ch.prize_pool ?? 0),
      creationFee: Number(ch.creation_fee ?? 0),
      totalPayment: Number(ch.total_payment ?? 0),
      deadline: ch.deadline ?? null,
      status: mapChallengeStatus(ch.status || "pending"),
      rawStatus: ch.status || "pending",
      createdAt: ch.created_at || new Date().toISOString(),
      expertWeight: Number(ch.expert_weight ?? 60),
      pitchWeight: Number(ch.pitch_weight ?? 40),
      seekerId: ch.seeker_id,
      seekerName,
      seekerCompanyName: seekerProf?.company_name ?? null,
      seekerRepresentative: seekerProf?.representative_name ?? null,
      seekerEmail: seekerProf?.profiles?.phone ?? null,
      categoryName,
      objectives,
      requirements,
      criteria,
      timelines,
    };
  } catch (err: any) {
    console.error("getAdminChallengeById exception:", err);
    return null;
  }
}

// Backward compatibility alias for any component importing getAdminActiveChallenges
export const getAdminActiveChallenges = getAdminChallenges;