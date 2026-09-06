"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// ============================================================
// TYPES
// ============================================================

export interface SeekerDiscussionReply {
  id: string;
  authorName: string;
  authorRole: "Seeker" | "Solver";
  isOfficial: boolean;
  timestamp: string;
  content: string;
}

export interface SeekerDiscussionThread {
  id: string;
  authorName: string;
  authorRole: "Seeker" | "Solver";
  timestamp: string;
  content: string;
  replies: SeekerDiscussionReply[];
}

function formatTimestamp(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }) + ", " + d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB";
  } catch {
    return iso;
  }
}

// ============================================================
// GET SEEKER DISCUSSIONS (2-level: thread + replies)
// ============================================================

export async function getSeekerDiscussionsAction(
  challengeId: string
): Promise<SeekerDiscussionThread[]> {
  try {
    const supabase = await createClient();

    // Fetch ALL messages for this challenge (top-level + replies)
    const { data: rows, error } = await supabase
      .from("challenge_discussions")
      .select("id, user_id, content, created_at, parent_message_id")
      .eq("challenge_id", challengeId)
      .order("created_at", { ascending: true });

    if (error || !rows || rows.length === 0) return [];

    // Fetch profiles for all unique user_ids
    const userIds = [...new Set(rows.map((r: any) => r.user_id))];

    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, role")
      .in("id", userIds);

    const profileMap = new Map(
      (profiles ?? []).map((p: any) => [p.id, p])
    );

    // Separate top-level (parent_message_id IS NULL) from replies
    const topLevel = rows.filter((r: any) => !r.parent_message_id);
    const repliesMap = new Map<string, any[]>();

    for (const row of rows) {
      const r = row as any;
      if (r.parent_message_id) {
        if (!repliesMap.has(r.parent_message_id)) {
          repliesMap.set(r.parent_message_id, []);
        }
        repliesMap.get(r.parent_message_id)!.push(r);
      }
    }

    const buildThread = (row: any): SeekerDiscussionThread => {
      const profile = profileMap.get(row.user_id);
      const role = (profile?.role ?? "solver").toLowerCase();
      const isSeeker = role === "seeker";

      const replies: SeekerDiscussionReply[] = (
        repliesMap.get(row.id) ?? []
      ).map((r: any) => {
        const rProfile = profileMap.get(r.user_id);
        const rRole = (rProfile?.role ?? "solver").toLowerCase();
        const rIsSeeker = rRole === "seeker";
        return {
          id: r.id,
          authorName: rProfile?.full_name || "Pengguna",
          authorRole: rIsSeeker ? "Seeker" : "Solver",
          isOfficial: rIsSeeker,
          timestamp: formatTimestamp(r.created_at),
          content: r.content,
        };
      });

      return {
        id: row.id,
        authorName: profile?.full_name || "Pengguna",
        authorRole: isSeeker ? "Seeker" : "Solver",
        timestamp: formatTimestamp(row.created_at),
        content: row.content,
        replies,
      };
    };

    return topLevel.map(buildThread);
  } catch (err) {
    console.error("getSeekerDiscussionsAction error:", err);
    return [];
  }
}

// ============================================================
// POST ANNOUNCEMENT (Seeker top-level post)
// ============================================================

export async function postSeekerAnnouncementAction(
  challengeId: string,
  content: string
): Promise<{ success: boolean; thread?: SeekerDiscussionThread; error?: string }> {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Sesi berakhir." };

    const trimmed = content.trim();
    if (!trimmed) return { success: false, error: "Pesan tidak boleh kosong." };

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, role")
      .eq("id", user.id)
      .maybeSingle();

    const { data: inserted, error } = await supabase
      .from("challenge_discussions")
      .insert({
        challenge_id: challengeId,
        user_id: user.id,
        content: trimmed,
        parent_message_id: null,
      })
      .select("id, created_at")
      .single();

    if (error || !inserted) {
      return { success: false, error: "Gagal menyimpan pesan." };
    }

    revalidatePath(`/seeker/challenges/${challengeId}`);

    const thread: SeekerDiscussionThread = {
      id: inserted.id,
      authorName: profile?.full_name || "Pengguna",
      authorRole: "Seeker",
      timestamp: formatTimestamp(inserted.created_at),
      content: trimmed,
      replies: [],
    };

    return { success: true, thread };
  } catch (err: any) {
    return { success: false, error: err?.message || "Terjadi kesalahan." };
  }
}

// ============================================================
// POST SEEKER REPLY (Seeker reply to a solver thread)
// ============================================================

export async function postSeekerReplyAction(
  challengeId: string,
  parentMessageId: string,
  content: string
): Promise<{ success: boolean; reply?: SeekerDiscussionReply; error?: string }> {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Sesi berakhir." };

    const trimmed = content.trim();
    if (!trimmed) return { success: false, error: "Balasan tidak boleh kosong." };

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, role")
      .eq("id", user.id)
      .maybeSingle();

    const { data: inserted, error } = await supabase
      .from("challenge_discussions")
      .insert({
        challenge_id: challengeId,
        user_id: user.id,
        content: trimmed,
        parent_message_id: parentMessageId,
      })
      .select("id, created_at")
      .single();

    if (error || !inserted) {
      return { success: false, error: "Gagal menyimpan balasan." };
    }

    revalidatePath(`/seeker/challenges/${challengeId}`);

    const reply: SeekerDiscussionReply = {
      id: inserted.id,
      authorName: profile?.full_name || "Pengguna",
      authorRole: "Seeker",
      isOfficial: true,
      timestamp: formatTimestamp(inserted.created_at),
      content: trimmed,
    };

    return { success: true, reply };
  } catch (err: any) {
    return { success: false, error: err?.message || "Terjadi kesalahan." };
  }
}
