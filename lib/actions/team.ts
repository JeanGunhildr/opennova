"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// ── Return types ──────────────────────────────────────────────
export interface TeamActionResult {
  success: boolean;
  error?: string;
  data?: Record<string, unknown>;
}

export interface TeamMember {
  user_id: string;
  full_name: string;
  is_captain: boolean;
  joined_at: string;
}

export interface MyTeam {
  id: string;
  name: string;
  join_code: string;
  is_active: boolean;
  is_locked: boolean;
  created_at: string;
  captain_id: string;
  role: "leader" | "member";
  member_count: number;
}

// ── Helpers ───────────────────────────────────────────────────

/** Generate a random 6-character alphanumeric code (uppercase). */
function generateJoinCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // ambiguous chars removed
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Count how many active teams the user is currently part of.
 * Uses team_members as single source of truth (captain rows are also inserted there).
 */
async function countUserTeams(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string
): Promise<number> {
  const { count } = await supabase
    .from("team_members")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("status", "active");

  return count ?? 0;
}

/**
 * Ensures that the user has a row in solver_profiles.
 * If missing for existing/old accounts, auto-creates one.
 */
async function ensureSolverProfile(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string
): Promise<boolean> {
  const { data: solverProfile } = await supabase
    .from("solver_profiles")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (solverProfile) {
    return true;
  }

  // Check profiles table
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  if (profile && profile.role && profile.role !== "solver") {
    return false; // User is registered as another role (e.g. seeker)
  }

  // Insert missing solver_profile record
  const { error: insertError } = await supabase.from("solver_profiles").insert({
    user_id: userId,
    bio: null,
    institution: null,
  });

  if (insertError) {
    console.error("Gagal auto-create solver_profile:", insertError);
    return false;
  }

  return true;
}

// ── Actions ───────────────────────────────────────────────────

/**
 * Create a new team.
 * Validates: user must be a solver, must have < 3 active teams.
 */
export async function createTeamAction(
  formData: FormData
): Promise<TeamActionResult> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: "Sesi telah berakhir. Silakan login kembali." };
    }

    // Pastikan user adalah solver (auto-create jika akun lama belum ada di solver_profiles)
    const isSolver = await ensureSolverProfile(supabase, user.id);
    if (!isSolver) {
      return { success: false, error: "Akun Anda tidak terdaftar sebagai Solver." };
    }

    // Cek batas 3 tim
    const teamCount = await countUserTeams(supabase, user.id);
    if (teamCount >= 3) {
      return {
        success: false,
        error:
          "Anda sudah bergabung di 3 tim (batas maksimal). Hapus atau keluar dari tim yang ada terlebih dahulu.",
      };
    }

    const name = (formData.get("name") as string)?.trim();
    if (!name || name.length < 3) {
      return { success: false, error: "Nama tim minimal 3 karakter." };
    }

    // Generate unique join code
    let joinCode = generateJoinCode();
    let codeExists = true;
    let attempts = 0;
    while (codeExists && attempts < 10) {
      const { data: existing } = await supabase
        .from("teams")
        .select("id")
        .eq("join_code", joinCode)
        .maybeSingle();
      if (!existing) {
        codeExists = false;
      } else {
        joinCode = generateJoinCode();
        attempts++;
      }
    }

    // Insert team
    const { data: team, error: teamError } = await supabase
      .from("teams")
      .insert({
        captain_id: user.id,
        name,
        join_code: joinCode,
        is_active: true,
      })
      .select("id, name, join_code")
      .single();

    if (teamError || !team) {
      console.error("Gagal membuat tim:", teamError);
      return { success: false, error: "Gagal membuat tim. Silakan coba lagi." };
    }

    // Tambahkan captain sebagai member pertama
    const { error: memberError } = await supabase.from("team_members").insert({
      team_id: team.id,
      user_id: user.id,
      status: "active",
    });

    if (memberError) {
      console.error("Gagal menambahkan captain sebagai member:", memberError);
    }

    revalidatePath("/solver/team");

    return {
      success: true,
      data: { teamId: team.id, teamName: team.name, joinCode: team.join_code },
    };
  } catch (error) {
    console.error("Unhandled error in createTeamAction:", error);
    return { success: false, error: "Terjadi kesalahan pada server." };
  }
}

/**
 * Join a team using a join code.
 * Validates: code must exist, team must be active & not locked,
 * member count < 4, user must have < 3 active teams.
 */
export async function joinTeamAction(
  formData: FormData
): Promise<TeamActionResult> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: "Sesi telah berakhir. Silakan login kembali." };
    }

    // Pastikan user adalah solver (auto-create jika akun lama belum ada di solver_profiles)
    const isSolver = await ensureSolverProfile(supabase, user.id);
    if (!isSolver) {
      return { success: false, error: "Akun Anda tidak terdaftar sebagai Solver." };
    }

    const code = (formData.get("code") as string)?.trim().toUpperCase();
    if (!code || code.length !== 6) {
      return { success: false, error: "Kode tim tidak valid." };
    }

    // Temukan tim
    const { data: team } = await supabase
      .from("teams")
      .select("id, name, is_active, is_locked, captain_id")
      .eq("join_code", code)
      .maybeSingle();

    if (!team) {
      return { success: false, error: "Kode tim tidak ditemukan. Pastikan kode sudah benar." };
    }

    if (!team.is_active) {
      return { success: false, error: "Tim ini sudah tidak aktif dan tidak bisa diikuti." };
    }

    if (team.is_locked) {
      return {
        success: false,
        error:
          "Tim ini sudah terkunci karena sedang mengikuti challenge. Anggota baru tidak bisa bergabung.",
      };
    }

    // Cek apakah user sudah di tim ini
    const { data: existingMember } = await supabase
      .from("team_members")
      .select("id, status")
      .eq("team_id", team.id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (existingMember && existingMember.status === "active") {
      return { success: false, error: "Anda sudah menjadi anggota tim ini." };
    }

    // Cek jumlah anggota aktif (maks 4)
    const { count: memberCount } = await supabase
      .from("team_members")
      .select("id", { count: "exact", head: true })
      .eq("team_id", team.id)
      .eq("status", "active");

    if ((memberCount ?? 0) >= 4) {
      return { success: false, error: "Tim ini sudah penuh (maks 4 anggota)." };
    }

    // Cek batas 3 tim per user
    const userTeamCount = await countUserTeams(supabase, user.id);
    if (userTeamCount >= 3) {
      return {
        success: false,
        error:
          "Anda sudah bergabung di 3 tim (batas maksimal). Hapus atau keluar dari tim yang ada terlebih dahulu.",
      };
    }

    // Bergabung
    if (existingMember) {
      await supabase
        .from("team_members")
        .update({ status: "active", joined_at: new Date().toISOString() })
        .eq("id", existingMember.id);
    } else {
      const { error: insertError } = await supabase.from("team_members").insert({
        team_id: team.id,
        user_id: user.id,
        status: "active",
      });

      if (insertError) {
        console.error("Gagal bergabung tim:", insertError);
        return { success: false, error: "Gagal bergabung tim. Silakan coba lagi." };
      }
    }

    revalidatePath("/solver/team");

    return {
      success: true,
      data: { teamName: team.name },
    };
  } catch (error) {
    console.error("Unhandled error in joinTeamAction:", error);
    return { success: false, error: "Terjadi kesalahan pada server." };
  }
}

/**
 * Leave a team (for non-captain members).
 * Team must not be locked.
 */
export async function leaveTeamAction(
  formData: FormData
): Promise<TeamActionResult> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: "Sesi telah berakhir. Silakan login kembali." };
    }

    const teamId = (formData.get("team_id") as string)?.trim();
    if (!teamId) {
      return { success: false, error: "Tim tidak ditemukan." };
    }

    const { data: team } = await supabase
      .from("teams")
      .select("id, name, is_locked, captain_id")
      .eq("id", teamId)
      .maybeSingle();

    if (!team) {
      return { success: false, error: "Tim tidak ditemukan." };
    }

    if (team.captain_id === user.id) {
      return {
        success: false,
        error:
          "Sebagai ketua, Anda tidak bisa keluar. Gunakan tombol Hapus Tim untuk membubarkan tim.",
      };
    }

    if (team.is_locked) {
      return {
        success: false,
        error:
          "Tim ini sedang terkunci karena mengikuti challenge. Anda tidak bisa keluar saat ini.",
      };
    }

    const { error: leaveError } = await supabase
      .from("team_members")
      .update({ status: "left" })
      .eq("team_id", teamId)
      .eq("user_id", user.id)
      .eq("status", "active");

    if (leaveError) {
      console.error("Gagal keluar dari tim:", leaveError);
      return { success: false, error: "Gagal keluar dari tim. Silakan coba lagi." };
    }

    revalidatePath("/solver/team");

    return { success: true, data: { teamName: team.name } };
  } catch (error) {
    console.error("Unhandled error in leaveTeamAction:", error);
    return { success: false, error: "Terjadi kesalahan pada server." };
  }
}

/**
 * Deactivate (soft-delete) a team. Only the captain can do this.
 * Team must not be locked.
 */
export async function deactivateTeamAction(
  formData: FormData
): Promise<TeamActionResult> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: "Sesi telah berakhir. Silakan login kembali." };
    }

    const teamId = (formData.get("team_id") as string)?.trim();
    if (!teamId) {
      return { success: false, error: "Tim tidak ditemukan." };
    }

    const { data: team } = await supabase
      .from("teams")
      .select("id, name, is_locked, captain_id, is_active")
      .eq("id", teamId)
      .eq("captain_id", user.id)
      .maybeSingle();

    if (!team) {
      return {
        success: false,
        error: "Tim tidak ditemukan atau Anda bukan ketua tim ini.",
      };
    }

    if (team.is_locked) {
      return {
        success: false,
        error:
          "Tim ini sedang terkunci karena mengikuti challenge. Tim tidak bisa dibubarkan saat ini.",
      };
    }

    const { error: deactivateError } = await supabase
      .from("teams")
      .update({ is_active: false })
      .eq("id", teamId);

    if (deactivateError) {
      console.error("Gagal menonaktifkan tim:", deactivateError);
      return { success: false, error: "Gagal membubarkan tim. Silakan coba lagi." };
    }

    revalidatePath("/solver/team");

    return { success: true, data: { teamName: team.name } };
  } catch (error) {
    console.error("Unhandled error in deactivateTeamAction:", error);
    return { success: false, error: "Terjadi kesalahan pada server." };
  }
}

/**
 * Lock or unlock a team (Fixation). Only the captain can do this.
 */
export async function toggleTeamLockAction(
  formData: FormData
): Promise<TeamActionResult> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: "Sesi telah berakhir. Silakan login kembali." };
    }

    const teamId = (formData.get("team_id") as string)?.trim();
    if (!teamId) {
      return { success: false, error: "Tim tidak ditemukan." };
    }

    const { data: team } = await supabase
      .from("teams")
      .select("id, name, is_locked, captain_id")
      .eq("id", teamId)
      .eq("captain_id", user.id)
      .maybeSingle();

    if (!team) {
      return {
        success: false,
        error: "Tim tidak ditemukan atau Anda bukan ketua tim ini.",
      };
    }

    const newLockedState = !team.is_locked;

    const { error: updateError } = await supabase
      .from("teams")
      .update({ is_locked: newLockedState })
      .eq("id", teamId);

    if (updateError) {
      console.error("Gagal mengubah status fiksasi tim:", updateError);
      return { success: false, error: "Gagal mengubah fiksasi tim. Silakan coba lagi." };
    }

    revalidatePath("/solver/team");

    return {
      success: true,
      data: { teamName: team.name, isLocked: newLockedState },
    };
  } catch (error) {
    console.error("Unhandled error in toggleTeamLockAction:", error);
    return { success: false, error: "Terjadi kesalahan pada server." };
  }
}

/**
 * Fetch all active teams the current user belongs to.
 */
export async function getMyTeamsAction(): Promise<{
  success: boolean;
  teams?: MyTeam[];
  error?: string;
  totalCount?: number;
}> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: "Sesi telah berakhir." };
    }

    const { data: memberships, error: memberError } = await supabase
      .from("team_members")
      .select(
        `
        team_id,
        joined_at,
        status,
        teams (
          id,
          name,
          join_code,
          is_active,
          is_locked,
          created_at,
          captain_id
        )
      `
      )
      .eq("user_id", user.id)
      .eq("status", "active");

    if (memberError) {
      console.error("Gagal mengambil data tim:", memberError);
      return { success: false, error: "Gagal mengambil daftar tim." };
    }

    if (!memberships) {
      return { success: true, teams: [], totalCount: 0 };
    }

    const teams: MyTeam[] = [];

    for (const m of memberships) {
      const raw = m.teams as unknown;
      const teamRaw = (Array.isArray(raw) ? raw[0] : raw) as {
        id: string;
        name: string;
        join_code: string;
        is_active: boolean;
        is_locked: boolean;
        created_at: string;
        captain_id: string;
      } | null;

      if (!teamRaw || !teamRaw.is_active) continue;

      const { count: memberCount } = await supabase
        .from("team_members")
        .select("id", { count: "exact", head: true })
        .eq("team_id", teamRaw.id)
        .eq("status", "active");

      teams.push({
        id: teamRaw.id,
        name: teamRaw.name,
        join_code: teamRaw.join_code,
        is_active: teamRaw.is_active,
        is_locked: teamRaw.is_locked ?? false,
        created_at: teamRaw.created_at,
        captain_id: teamRaw.captain_id,
        role: teamRaw.captain_id === user.id ? "leader" : "member",
        member_count: memberCount ?? 0,
      });
    }

    return { success: true, teams, totalCount: teams.length };
  } catch (error) {
    console.error("Unhandled error in getMyTeamsAction:", error);
    return { success: false, error: "Terjadi kesalahan pada server." };
  }
}

/**
 * Fetch all active members of a specific team.
 */
export async function getTeamMembersAction(teamId: string): Promise<{
  success: boolean;
  members?: TeamMember[];
  error?: string;
}> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: "Sesi telah berakhir." };
    }

    // Verifikasi user adalah anggota tim ini
    const { data: membership } = await supabase
      .from("team_members")
      .select("id")
      .eq("team_id", teamId)
      .eq("user_id", user.id)
      .eq("status", "active")
      .maybeSingle();

    if (!membership) {
      return { success: false, error: "Anda tidak memiliki akses ke tim ini." };
    }

    const { data: team } = await supabase
      .from("teams")
      .select("captain_id")
      .eq("id", teamId)
      .maybeSingle();

    const { data: members, error: membersError } = await supabase
      .from("team_members")
      .select(
        `
        user_id,
        joined_at,
        solver_profiles (
          profiles (
            full_name
          )
        )
      `
      )
      .eq("team_id", teamId)
      .eq("status", "active");

    if (membersError) {
      console.error("Gagal mengambil anggota tim:", membersError);
      return { success: false, error: "Gagal mengambil daftar anggota." };
    }

    const result: TeamMember[] = (members ?? []).map((m) => {
      const spRaw = m.solver_profiles as unknown;
      const spObj = (Array.isArray(spRaw) ? spRaw[0] : spRaw) as {
        profiles: { full_name: string } | { full_name: string }[] | null;
      } | null;

      const pRaw = spObj?.profiles as unknown;
      const pObj = (Array.isArray(pRaw) ? pRaw[0] : pRaw) as { full_name: string } | null;

      return {
        user_id: m.user_id,
        full_name: pObj?.full_name ?? "Pengguna",
        is_captain: m.user_id === team?.captain_id,
        joined_at: m.joined_at,
      };
    });

    // Apabila ketua belum ada di team_members (misal data tim lama), ambil profil ketua & tambahkan
    const hasCaptain = result.some((m) => m.is_captain);
    if (!hasCaptain && team?.captain_id) {
      const { data: captainProfile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", team.captain_id)
        .maybeSingle();

      result.unshift({
        user_id: team.captain_id,
        full_name: captainProfile?.full_name ?? "Ketua Tim",
        is_captain: true,
        joined_at: new Date(0).toISOString(),
      });
    }

    result.sort((a, b) => {
      if (a.is_captain) return -1;
      if (b.is_captain) return 1;
      return new Date(a.joined_at).getTime() - new Date(b.joined_at).getTime();
    });

    return { success: true, members: result };
  } catch (error) {
    console.error("Unhandled error in getTeamMembersAction:", error);
    return { success: false, error: "Terjadi kesalahan pada server." };
  }
}
