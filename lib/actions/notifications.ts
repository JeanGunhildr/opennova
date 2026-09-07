// lib/actions/notifications.ts
// Server actions for notification management.
// Reads: uses authenticated user session.
// Writes: insertNotification() uses service role and should only be called
//         server-side from other server actions (not exposed to client directly).

"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

// ============================================================
// TYPES
// ============================================================

export interface AppNotification {
  id: string;
  type: string;
  title: string;
  body: string;
  isRead: boolean;
  actionUrl: string | null;
  challengeId: string | null;
  createdAt: string;
}

// ============================================================
// READ — GET NOTIFICATIONS FOR CURRENT USER
// ============================================================

export async function getUserNotificationsAction(): Promise<{
  data: AppNotification[];
  error: string | null;
}> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { data: [], error: "Sesi berakhir. Silakan login kembali." };
    }

    const { data, error } = await supabase
      .from("notifications")
      .select("id, type, title, message, is_read, challenge_id, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      console.error("getUserNotificationsAction error:", error);
      return { data: [], error: error.message };
    }

    const mapped: AppNotification[] = (data ?? []).map((n: any) => ({
      id: n.id,
      type: n.type,
      title: n.title,
      body: n.message || n.body || "",
      isRead: Boolean(n.is_read),
      actionUrl: n.challenge_id ? `/solver/challenge/${n.challenge_id}` : null,
      challengeId: n.challenge_id ?? null,
      createdAt: n.created_at,
    }));

    return { data: mapped, error: null };
  } catch (err: any) {
    return { data: [], error: err?.message || "Gagal mengambil notifikasi." };
  }
}

// ============================================================
// UPDATE — MARK SINGLE NOTIFICATION AS READ
// ============================================================

export async function markNotificationReadAction(
  notificationId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Sesi berakhir." };

    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId)
      .eq("user_id", user.id); // RLS guard: only own notifications

    if (error) return { success: false, error: error.message };

    revalidatePath("/solver/notifications");
    revalidatePath("/seeker/notifications");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Gagal memperbarui notifikasi." };
  }
}

// ============================================================
// UPDATE — MARK ALL NOTIFICATIONS AS READ
// ============================================================

export async function markAllNotificationsReadAction(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Sesi berakhir." };

    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", user.id)
      .eq("is_read", false);

    if (error) return { success: false, error: error.message };

    revalidatePath("/solver/notifications");
    revalidatePath("/seeker/notifications");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Gagal memperbarui notifikasi." };
  }
}

// ============================================================
// INTERNAL HELPER — INSERT NOTIFICATION (SERVER-SIDE ONLY)
// Called from seeker-manage.ts and challenge-phase.ts.
// Uses the authenticated client; the calling server action must
// pass the same supabase instance so security context is preserved.
// ============================================================

/**
 * Insert a single notification for a user.
 * This is an internal server-side helper — not a public Server Action.
 * Pass the supabase client from the calling server action.
 */
export async function insertNotification(
  supabase: any,
  params: {
    userId: string;
    type: string;
    title: string;
    body: string;
    actionUrl?: string;
    challengeId?: string;
  },
): Promise<void> {
  const { error } = await supabase.from("notifications").insert({
    user_id: params.userId,
    type: params.type,
    title: params.title,
    message: params.body,
    challenge_id: params.challengeId ?? null,
    is_read: false,
  });

  if (error) {
    // Log but don't throw — notifications are non-critical
    console.error("insertNotification error:", error);
  }
}

/**
 * Insert notifications for multiple users at once.
 * Batch version for phase transitions affecting many users.
 */
export async function insertBatchNotifications(
  supabase: any,
  notifications: Array<{
    userId: string;
    type: string;
    title: string;
    body: string;
    actionUrl?: string;
    challengeId?: string;
  }>,
): Promise<void> {
  if (notifications.length === 0) return;

  const rows = notifications.map((n) => ({
    user_id: n.userId,
    type: n.type,
    title: n.title,
    message: n.body,
    challenge_id: n.challengeId ?? null,
    is_read: false,
  }));

  const { error } = await supabase.from("notifications").insert(rows);

  if (error) {
    console.error("insertBatchNotifications error:", error);
  }
}
