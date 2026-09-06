"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

async function verifyAdminAuth() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { supabase, user: null, error: "Silakan login terlebih dahulu." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || profile.role !== "admin") {
    return {
      supabase,
      user: null,
      error: "Akses ditolak: Hanya Admin yang dapat melakukan tindakan ini.",
    };
  }

  return { supabase, user, error: null };
}

export interface UpdateUserData {
  // Common fields (profiles table)
  fullName?: string;
  phone?: string;
  birthday?: string;

  // Seeker specific fields (seeker_profiles table)
  companyName?: string;
  representativeName?: string;
  companyType?: string;
  companyDescription?: string;
  website?: string;

  // Solver specific fields (solver_profiles table)
  bio?: string;
  institution?: string;
}

/**
 * Server Action for Admin to update Seeker or Solver profile.
 */
export async function updateAdminUserAction(
  targetUserId: string,
  targetRole: "seeker" | "solver",
  data: UpdateUserData
): Promise<{ success: boolean; error?: string }> {
  try {
    const { supabase, error: authError } = await verifyAdminAuth();
    if (authError || !supabase) {
      return { success: false, error: authError || "Autentikasi gagal." };
    }

    if (!targetUserId) {
      return { success: false, error: "ID pengguna tidak valid." };
    }

    // 1. Verify target user profile exists
    const { data: targetProfile, error: profileFetchErr } = await supabase
      .from("profiles")
      .select("id, role")
      .eq("id", targetUserId)
      .maybeSingle();

    if (profileFetchErr || !targetProfile) {
      return { success: false, error: "Pengguna tidak ditemukan." };
    }

    // 2. Update common profiles table fields
    const profileUpdates: Record<string, any> = {};
    if (data.fullName !== undefined) profileUpdates.full_name = data.fullName.trim();
    if (data.phone !== undefined) profileUpdates.phone = data.phone.trim();
    if (data.birthday !== undefined) profileUpdates.birthday = data.birthday || null;

    if (Object.keys(profileUpdates).length > 0) {
      const { error: profileUpdateErr } = await supabase
        .from("profiles")
        .update(profileUpdates)
        .eq("id", targetUserId);

      if (profileUpdateErr) {
        console.error("profiles update error:", profileUpdateErr);
        return {
          success: false,
          error: `Gagal memperbarui profil utama: ${profileUpdateErr.message}`,
        };
      }
    }

    // 3. Update role-specific table (seeker_profiles vs solver_profiles)
    if (targetRole === "seeker") {
      const seekerUpdates: Record<string, any> = {};
      if (data.companyName !== undefined) seekerUpdates.company_name = data.companyName.trim();
      if (data.representativeName !== undefined) seekerUpdates.representative_name = data.representativeName.trim();
      if (data.companyType !== undefined) seekerUpdates.company_type = data.companyType.trim();
      if (data.companyDescription !== undefined) seekerUpdates.company_description = data.companyDescription.trim();
      if (data.website !== undefined) seekerUpdates.website = data.website.trim();

      if (Object.keys(seekerUpdates).length > 0) {
        // Check if seeker_profile row exists
        const { data: seekerProf } = await supabase
          .from("seeker_profiles")
          .select("user_id")
          .eq("user_id", targetUserId)
          .maybeSingle();

        if (seekerProf) {
          const { error: seekerErr } = await supabase
            .from("seeker_profiles")
            .update(seekerUpdates)
            .eq("user_id", targetUserId);

          if (seekerErr) {
            console.error("seeker_profiles update error:", seekerErr);
            return {
              success: false,
              error: `Gagal memperbarui profil Seeker: ${seekerErr.message}`,
            };
          }
        } else {
          // Insert if missing
          const { error: insertErr } = await supabase.from("seeker_profiles").insert({
            user_id: targetUserId,
            company_name: data.companyName || data.fullName || "Perusahaan",
            representative_name: data.representativeName || data.fullName || "Perwakilan",
            company_type: data.companyType || "Perusahaan Swasta",
            company_description: data.companyDescription || null,
            website: data.website || null,
            legal_document_path: "verified",
          });

          if (insertErr) {
            console.error("seeker_profiles insert error:", insertErr);
            return {
              success: false,
              error: `Gagal membuat profil Seeker: ${insertErr.message}`,
            };
          }
        }
      }
    } else if (targetRole === "solver") {
      const solverUpdates: Record<string, any> = {};
      if (data.bio !== undefined) solverUpdates.bio = data.bio.trim();
      if (data.institution !== undefined) solverUpdates.institution = data.institution.trim();

      if (Object.keys(solverUpdates).length > 0) {
        const { data: solverProf } = await supabase
          .from("solver_profiles")
          .select("user_id")
          .eq("user_id", targetUserId)
          .maybeSingle();

        if (solverProf) {
          const { error: solverErr } = await supabase
            .from("solver_profiles")
            .update(solverUpdates)
            .eq("user_id", targetUserId);

          if (solverErr) {
            console.error("solver_profiles update error:", solverErr);
            return {
              success: false,
              error: `Gagal memperbarui profil Solver: ${solverErr.message}`,
            };
          }
        } else {
          const { error: insertErr } = await supabase.from("solver_profiles").insert({
            user_id: targetUserId,
            bio: data.bio || null,
            institution: data.institution || null,
          });

          if (insertErr) {
            console.error("solver_profiles insert error:", insertErr);
            return {
              success: false,
              error: `Gagal membuat profil Solver: ${insertErr.message}`,
            };
          }
        }
      }
    }

    revalidatePath("/admin/users");

    return { success: true };
  } catch (err: any) {
    console.error("updateAdminUserAction exception:", err);
    return {
      success: false,
      error: err?.message || "Terjadi kesalahan server saat memperbarui pengguna.",
    };
  }
}
