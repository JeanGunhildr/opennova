"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface SeekerSelfProfileData {
  companyName: string;
  representativeName: string;
  phone: string;
  companyType: string;
  companyDescription: string;
  website: string;
}

export interface SolverSelfProfileData {
  fullName: string;
  phone: string;
  institution: string;
}

/**
 * Server Action for Seeker to update their own profile.
 */
export async function updateSeekerProfileSelfAction(
  data: SeekerSelfProfileData
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Silakan login terlebih dahulu." };
    }

    // 1. Update profiles table
    const profileUpdates: Record<string, any> = {};
    if (data.representativeName) {
      profileUpdates.full_name = data.representativeName.trim();
    }
    if (data.phone !== undefined) {
      profileUpdates.phone = data.phone.trim();
    }

    if (Object.keys(profileUpdates).length > 0) {
      const { error: profileErr } = await supabase
        .from("profiles")
        .update(profileUpdates)
        .eq("id", user.id);

      if (profileErr) {
        console.error("profiles update error:", profileErr);
        return {
          success: false,
          error: `Gagal memperbarui profil utama: ${profileErr.message}`,
        };
      }
    }

    // 2. Update or insert seeker_profiles table
    const { data: seekerProf } = await supabase
      .from("seeker_profiles")
      .select("user_id, legal_document_path")
      .eq("user_id", user.id)
      .maybeSingle();

    if (seekerProf) {
      const { error: seekerErr } = await supabase
        .from("seeker_profiles")
        .update({
          company_name: data.companyName.trim() || "Perusahaan",
          representative_name: data.representativeName.trim() || "Perwakilan",
          company_type: data.companyType.trim() || "Swasta",
          company_description: data.companyDescription.trim() || null,
          website: data.website.trim() || null,
        })
        .eq("user_id", user.id);

      if (seekerErr) {
        console.error("seeker_profiles update error:", seekerErr);
        return {
          success: false,
          error: `Gagal memperbarui informasi perusahaan: ${seekerErr.message}`,
        };
      }
    } else {
      const { error: insertErr } = await supabase.from("seeker_profiles").insert({
        user_id: user.id,
        company_name: data.companyName.trim() || "Perusahaan",
        representative_name: data.representativeName.trim() || "Perwakilan",
        company_type: data.companyType.trim() || "Swasta",
        company_description: data.companyDescription.trim() || null,
        website: data.website.trim() || null,
        legal_document_path: "not_required",
      });

      if (insertErr) {
        console.error("seeker_profiles insert error:", insertErr);
        return {
          success: false,
          error: `Gagal membuat informasi perusahaan: ${insertErr.message}`,
        };
      }
    }

    revalidatePath("/seeker/profile");
    revalidatePath("/seeker");

    return { success: true };
  } catch (err: any) {
    console.error("updateSeekerProfileSelfAction exception:", err);
    return {
      success: false,
      error: err?.message || "Terjadi kesalahan server saat menyimpan profil.",
    };
  }
}

/**
 * Server Action for Solver to update their own profile.
 */
export async function updateSolverProfileSelfAction(
  data: SolverSelfProfileData
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Silakan login terlebih dahulu." };
    }

    // 1. Update profiles table
    const profileUpdates: Record<string, any> = {};
    if (data.fullName) {
      profileUpdates.full_name = data.fullName.trim();
    }
    if (data.phone !== undefined) {
      profileUpdates.phone = data.phone.trim();
    }

    if (Object.keys(profileUpdates).length > 0) {
      const { error: profileErr } = await supabase
        .from("profiles")
        .update(profileUpdates)
        .eq("id", user.id);

      if (profileErr) {
        console.error("profiles update error:", profileErr);
        return {
          success: false,
          error: `Gagal memperbarui profil utama: ${profileErr.message}`,
        };
      }
    }

    // 2. Upsert solver_profiles table
    const solverData = {
      user_id: user.id,
      institution: data.institution.trim() || null,
    };

    const { error: solverErr } = await supabase
      .from("solver_profiles")
      .upsert(solverData, { onConflict: "user_id" });

    if (solverErr) {
      console.error("solver_profiles upsert error:", solverErr);
      return {
        success: false,
        error: `Gagal memperbarui profil solver: ${solverErr.message}`,
      };
    }

    revalidatePath("/solver/profile");
    revalidatePath("/solver");

    return { success: true };
  } catch (err: any) {
    console.error("updateSolverProfileSelfAction exception:", err);
    return {
      success: false,
      error: err?.message || "Terjadi kesalahan server saat menyimpan profil.",
    };
  }
}
