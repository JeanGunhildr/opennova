import { createClient } from "@/lib/supabase/server";
import type {
  ActiveChallengeRow,
  ActiveChallengeStatus,
  SeekerRow,
  SolverRow,
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

    case "taken_down":
    case "takedown":
      return "Takedown";

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

/**
 * Fetch dynamic list of all Seekers from Supabase DB for Admin.
 */
export async function getAdminSeekers(): Promise<SeekerRow[]> {
  try {
    const supabase = await createClient();

    // 1. Fetch profiles with role = 'seeker' along with seeker_profiles
    const { data: seekerProfilesData, error: profilesError } = await supabase
      .from("profiles")
      .select(`
        id,
        full_name,
        phone,
        created_at,
        seeker_profiles (
          company_name,
          representative_name,
          company_type,
          company_description,
          website,
          legal_document_path
        )
      `)
      .eq("role", "seeker")
      .order("created_at", { ascending: false });

    if (profilesError) {
      console.error("getAdminSeekers query error:", profilesError);
      return [];
    }

    // 2. Fetch challenge counts grouped by seeker_id
    const { data: challengesData, error: chErr } = await supabase
      .from("challenges")
      .select("seeker_id");

    const challengeCountMap = new Map<string, number>();
    if (!chErr && challengesData) {
      challengesData.forEach((ch: any) => {
        if (ch.seeker_id) {
          challengeCountMap.set(
            ch.seeker_id,
            (challengeCountMap.get(ch.seeker_id) || 0) + 1
          );
        }
      });
    }

    // 3. Fetch Auth Users for email mapping
    let emailMap = new Map<string, string>();
    try {
      const { data: authUsersData } = await supabase.auth.admin.listUsers();
      if (authUsersData?.users) {
        authUsersData.users.forEach((u) => {
          if (u.id && u.email) emailMap.set(u.id, u.email);
        });
      }
    } catch (e) {
      console.log("auth.admin.listUsers not available or failed:", e);
    }

    return (seekerProfilesData ?? []).map((p: any) => {
      const seekerExtra = Array.isArray(p.seeker_profiles)
        ? p.seeker_profiles[0]
        : p.seeker_profiles;

      const orgName =
        seekerExtra?.company_name || p.full_name || "Perusahaan / Organisasi";
      const contactPerson =
        seekerExtra?.representative_name || p.full_name || "Kontak Person";
      const orgType = seekerExtra?.company_type || "Perusahaan Swasta";
      const website = seekerExtra?.website || "";
      const officeAddress = website || seekerExtra?.company_description || "—";
      const email =
        emailMap.get(p.id) ||
        `${(p.full_name || "seeker")
          .toLowerCase()
          .replace(/[^a-z0-9]/g, ".")}@opennova.id`;

      return {
        id: p.id,
        orgName,
        email,
        orgType,
        contactPerson,
        officeAddress,
        phone: p.phone || "—",
        companyDescription: seekerExtra?.company_description || null,
        website: seekerExtra?.website || null,
        legalDocumentPath: seekerExtra?.legal_document_path || null,
        challengesCreated: challengeCountMap.get(p.id) || 0,
        createdAt: p.created_at || new Date().toISOString(),
      };
    });
  } catch (err) {
    console.error("getAdminSeekers exception:", err);
    return [];
  }
}

/**
 * Fetch dynamic list of all Solvers from Supabase DB for Admin.
 */
/**
 * Fetch dynamic list of all Solvers from Supabase DB for Admin.
 */
export async function getAdminSolvers(): Promise<SolverRow[]> {
  try {
    const supabase = await createClient();

    // 1. Fetch all solver profiles
    const { data: solverProfilesData, error: profilesError } =
      await supabase
        .from("profiles")
        .select(`
          id,
          full_name,
          phone,
          created_at,
          solver_profiles (
            bio,
            institution
          )
        `)
        .eq("role", "solver")
        .order("created_at", { ascending: false });

    if (profilesError) {
      console.error("getAdminSolvers profiles error:", {
        message: profilesError.message,
        code: profilesError.code,
        details: profilesError.details,
        hint: profilesError.hint,
      });

      return [];
    }

    // 2. Fetch direct challenge entries
    const {
      data: directEntries,
      error: directEntriesError,
    } = await supabase
      .from("challenge_entries")
      .select("solver_id, challenge_id")
      .not("solver_id", "is", null);

    if (directEntriesError) {
      console.error("Admin direct entries error:", {
        message: directEntriesError.message,
        code: directEntriesError.code,
        details: directEntriesError.details,
        hint: directEntriesError.hint,
      });
    }

    // 3. Fetch team challenge entries
    const {
      data: memberEntries,
      error: memberEntriesError,
    } = await supabase
      .from("challenge_entry_members")
      .select(`
        user_id,
        challenge_entries (
          challenge_id
        )
      `);

    if (memberEntriesError) {
      console.error("Admin member entries error:", {
        message: memberEntriesError.message,
        code: memberEntriesError.code,
        details: memberEntriesError.details,
        hint: memberEntriesError.hint,
      });
    }

    // 4. Build unique challenge count per solver
    const joinedChallengeMap = new Map<string, Set<string>>();

    // Direct solver
    (directEntries ?? []).forEach((entry: any) => {
      if (!entry.solver_id || !entry.challenge_id) return;

      if (!joinedChallengeMap.has(entry.solver_id)) {
        joinedChallengeMap.set(entry.solver_id, new Set());
      }

      joinedChallengeMap.get(entry.solver_id)!.add(entry.challenge_id);
    });

    // Team member solver
    (memberEntries ?? []).forEach((entry: any) => {
      const userId = entry.user_id;
      const challengeId =
        entry.challenge_entries?.challenge_id;

      if (!userId || !challengeId) return;

      if (!joinedChallengeMap.has(userId)) {
        joinedChallengeMap.set(userId, new Set());
      }

      joinedChallengeMap.get(userId)!.add(challengeId);
    });

    console.log(
      "Admin direct entries:",
      directEntries?.length ?? 0,
    );

    console.log(
      "Admin team member entries:",
      memberEntries?.length ?? 0,
    );

    console.log(
      "Admin solver challenge map:",
      Array.from(joinedChallengeMap.entries()).map(
        ([solverId, challenges]) => ({
          solverId,
          challengeCount: challenges.size,
          challengeIds: Array.from(challenges),
        }),
      ),
    );

    // 5. Fetch Auth Users for email mapping
    const emailMap = new Map<string, string>();

    try {
      const { data: authUsersData } =
        await supabase.auth.admin.listUsers();

      if (authUsersData?.users) {
        authUsersData.users.forEach((u) => {
          if (u.id && u.email) {
            emailMap.set(u.id, u.email);
          }
        });
      }
    } catch (e) {
      console.log(
        "auth.admin.listUsers not available or failed:",
        e,
      );
    }

    // 6. Map final solver data
    return (solverProfilesData ?? []).map((p: any) => {
      const solverExtra = Array.isArray(p.solver_profiles)
        ? p.solver_profiles[0]
        : p.solver_profiles;

      const challengeSet = joinedChallengeMap.get(p.id);

      return {
        id: p.id,
        fullName: p.full_name || "Solver",
        email:
          emailMap.get(p.id) ||
          `${(p.full_name || "solver")
            .toLowerCase()
            .replace(/[^a-z0-9]/g, ".")}@opennova.id`,
        whatsapp: p.phone || "—",
        address: solverExtra?.institution || "—",
        bio: solverExtra?.bio || null,
        institution: solverExtra?.institution || null,
        birthday: p.birthday || null,
        challengesJoined: challengeSet
          ? challengeSet.size
          : 0,
        createdAt: p.created_at || new Date().toISOString(),
      };
    });
  } catch (err) {
    console.error("getAdminSolvers exception:", err);
    return [];
  }
}