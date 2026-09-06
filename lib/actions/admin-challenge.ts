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

/**
 * Approve a pending challenge. Updates challenges.status from 'pending' -> 'ongoing'.
 */
export async function approveChallengeAction(challengeId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const { supabase, error: authError } = await verifyAdminAuth();
    if (authError || !supabase) {
      return { success: false, error: authError || "Autentikasi gagal." };
    }

    // Verify challenge exists and is currently pending
    const { data: ch, error: chErr } = await supabase
      .from("challenges")
      .select("id, status")
      .eq("id", challengeId)
      .maybeSingle();

    if (chErr || !ch) {
      return { success: false, error: "Challenge tidak ditemukan." };
    }

    if (ch.status !== "pending") {
      return {
        success: false,
        error: `Challenge ini berstatus '${ch.status}' dan tidak dapat disetujui lagi.`,
      };
    }

    // Update status to DB enum 'ongoing'
    const { error: updateErr } = await supabase
      .from("challenges")
      .update({ status: "ongoing" })
      .eq("id", challengeId);

    if (updateErr) {
      console.error("approveChallengeAction update error:", {
        message: updateErr.message,
        details: updateErr.details,
        hint: updateErr.hint,
        code: updateErr.code,
      });
      return {
        success: false,
        error: `Gagal menyetujui challenge: ${updateErr.message}`,
      };
    }

    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/challenges");
    revalidatePath(`/admin/challenges/${challengeId}`);
    revalidatePath("/seeker/challenges");
    revalidatePath("/solver");

    return { success: true };
  } catch (err: any) {
    console.error("approveChallengeAction unhandled error:", err);
    return {
      success: false,
      error: err?.message || "Terjadi kesalahan server saat menyetujui challenge.",
    };
  }
}

/**
 * Reject a pending challenge. Updates challenges.status from 'pending' -> 'rejected'.
 */
export async function rejectChallengeAction(challengeId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const { supabase, error: authError } = await verifyAdminAuth();
    if (authError || !supabase) {
      return { success: false, error: authError || "Autentikasi gagal." };
    }

    // Verify challenge exists and is currently pending
    const { data: ch, error: chErr } = await supabase
      .from("challenges")
      .select("id, status")
      .eq("id", challengeId)
      .maybeSingle();

    if (chErr || !ch) {
      return { success: false, error: "Challenge tidak ditemukan." };
    }

    if (ch.status !== "pending") {
      return {
        success: false,
        error: `Challenge ini berstatus '${ch.status}' dan tidak dapat ditolak.`,
      };
    }

    // Update status to DB enum 'rejected'
    const { error: updateErr } = await supabase
      .from("challenges")
      .update({ status: "rejected" })
      .eq("id", challengeId);

    if (updateErr) {
      console.error("rejectChallengeAction update error:", {
        message: updateErr.message,
        details: updateErr.details,
        hint: updateErr.hint,
        code: updateErr.code,
      });
      return {
        success: false,
        error: `Gagal menolak challenge: ${updateErr.message}`,
      };
    }

    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/challenges");
    revalidatePath(`/admin/challenges/${challengeId}`);
    revalidatePath("/seeker/challenges");
    revalidatePath("/solver");

    return { success: true };
  } catch (err: any) {
    console.error("rejectChallengeAction unhandled error:", err);
    return {
      success: false,
      error: err?.message || "Terjadi kesalahan server saat menolak challenge.",
    };
  }
}

/**
 * Takedown an active challenge. Updates challenges.status -> 'taken_down'.
 */
export async function takeDownChallengeAction(challengeId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const { supabase, error: authError } = await verifyAdminAuth();
    if (authError || !supabase) {
      return { success: false, error: authError || "Autentikasi gagal." };
    }

    // Verify challenge exists and is eligible for takedown
    const { data: ch, error: chErr } = await supabase
      .from("challenges")
      .select("id, status")
      .eq("id", challengeId)
      .maybeSingle();

    if (chErr || !ch) {
      return { success: false, error: "Challenge tidak ditemukan." };
    }

    const uneligibleStatuses = ["pending", "rejected", "completed", "taken_down"];
    if (uneligibleStatuses.includes(ch.status)) {
      return {
        success: false,
        error: `Challenge dengan status '${ch.status}' tidak dapat di-takedown.`,
      };
    }

    // Update status to DB enum 'taken_down'
    const { error: updateErr } = await supabase
      .from("challenges")
      .update({ status: "taken_down" })
      .eq("id", challengeId);

    if (updateErr) {
      console.error("takeDownChallengeAction update error:", {
        message: updateErr.message,
        details: updateErr.details,
        hint: updateErr.hint,
        code: updateErr.code,
      });
      return {
        success: false,
        error: `Gagal men-takedown challenge: ${updateErr.message}`,
      };
    }

    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/challenges");
    revalidatePath(`/admin/challenges/${challengeId}`);
    revalidatePath("/seeker/challenges");
    revalidatePath("/solver");
    revalidatePath(`/solver/challenge/${challengeId}`);

    return { success: true };
  } catch (err: any) {
    console.error("takeDownChallengeAction unhandled error:", err);
    return {
      success: false,
      error:
        err?.message ||
        "Terjadi kesalahan server saat men-takedown challenge.",
    };
  }
}
