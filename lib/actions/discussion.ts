"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { formatTimestamp } from "@/lib/utils/formatDate";

export interface DiscussionComment {
  id: string;
  author: string;
  role: string;
  time: string;
  text: string;
  created_at: string;
}

/**
 * Fetch discussions for a specific challenge.
 */
export async function getDiscussionsAction(
  challengeId: string
): Promise<DiscussionComment[]> {
  try {
    const supabase = await createClient();

    // =====================================================
    // 1. AMBIL SEMUA KOMENTAR BERDASARKAN CHALLENGE ID
    // =====================================================

    const {
      data: discussions,
      error: discussionError,
    } = await supabase
      .from("challenge_discussions")
      .select(`
        id,
        content,
        created_at,
        user_id
      `)
      .eq("challenge_id", challengeId)
      .order("created_at", {
        ascending: true,
      });

    console.log(
      "DISCUSSION DARI DATABASE:",
      discussions
    );

    console.log(
      "JUMLAH:",
      discussions?.length
    );

    if (discussionError) {
      console.error(
        "Error fetching discussions:",
        discussionError
      );

      return [];
    }

    // Tidak ada komentar
    if (
      !discussions ||
      discussions.length === 0
    ) {
      return [];
    }

    // =====================================================
    // 2. AMBIL SEMUA USER ID DARI KOMENTAR
    // =====================================================

    const userIds = [
      ...new Set(
        discussions.map(
          (discussion) => discussion.user_id
        )
      ),
    ];

    // =====================================================
    // 3. AMBIL PROFILE BERDASARKAN USER ID
    // =====================================================

    const {
      data: profiles,
      error: profileError,
    } = await supabase
      .from("profiles")
      .select(`
        id,
        full_name,
        role
      `)
      .in("id", userIds);

    if (profileError) {
      console.error(
        "Error fetching profiles:",
        profileError
      );
    }

    // =====================================================
    // 4. BUAT MAP PROFILE
    // =====================================================

    const profileMap = new Map(
      (profiles || []).map((profile) => [
        profile.id,
        profile,
      ])
    );

    // =====================================================
    // 5. GABUNGKAN KOMENTAR + PROFILE
    // =====================================================

    return discussions.map((item) => {
      const profile = profileMap.get(
        item.user_id
      );

      const roleStr =
        profile?.role || "solver";

      const displayRole =
        roleStr.toLowerCase() === "seeker"
          ? "Seeker"
          : "Solver";

      return {
        id: item.id,

        author:
          profile?.full_name ||
          "Pengguna",

        role: displayRole,

        // created_at LANGSUNG dari database
        time: formatTimestamp(
          item.created_at
        ),

        text: item.content,

        // Timestamp asli dari database
        created_at: item.created_at,
      };
    });
  } catch (error) {
    console.error(
      "Error fetching discussions:",
      error
    );

    return [];
  }
}

/**
 * Add a new discussion comment to a challenge.
 */
export async function addDiscussionCommentAction(
  challengeId: string,
  content: string
): Promise<{
  success: boolean;
  comment?: DiscussionComment;
  error?: string;
}> {
  try {
    const supabase = await createClient();

    // =====================================================
    // 1. CEK USER LOGIN
    // =====================================================

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error:
          "Silakan login terlebih dahulu untuk mengirim pesan diskusi.",
      };
    }

    // =====================================================
    // 2. VALIDASI CONTENT
    // =====================================================

    const trimmed = content.trim();

    if (!trimmed) {
      return {
        success: false,
        error:
          "Pesan diskusi tidak boleh kosong.",
      };
    }

    // =====================================================
    // 3. AMBIL PROFILE USER
    // =====================================================

    const {
      data: profile,
      error: profileError,
    } = await supabase
      .from("profiles")
      .select(`
        full_name,
        role
      `)
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      console.error(
        "Error fetching user profile:",
        profileError
      );
    }

    const roleStr =
      profile?.role || "solver";

    const displayRole =
      roleStr.toLowerCase() === "seeker"
        ? "Seeker"
        : "Solver";

    // =====================================================
    // 4. TENTUKAN NAMA USER
    // =====================================================

    const authorName =
      profile?.full_name?.trim() ||
      (
        user.user_metadata
          ?.full_name as string
      )?.trim() ||
      (
        user.user_metadata
          ?.name as string
      )?.trim() ||
      (user.email
        ? user.email.split("@")[0]
        : "Pengguna");

    // =====================================================
    // 5. INSERT KOMENTAR
    // =====================================================

    const {
      data,
      error,
    } = await supabase
      .from("challenge_discussions")
      .insert({
        challenge_id: challengeId,
        user_id: user.id,
        content: trimmed,
      })
      .select(`
        id,
        created_at
      `)
      .single();

    if (error) {
      console.error(
        "Gagal menyimpan diskusi:",
        error
      );

      return {
        success: false,
        error:
          "Gagal menyimpan pesan diskusi ke database.",
      };
    }

    // =====================================================
    // 6. PASTIKAN CREATED_AT DARI DATABASE
    // =====================================================

    if (!data?.created_at) {
      console.error(
        "created_at tidak dikembalikan oleh database."
      );

      return {
        success: false,
        error:
          "Waktu komentar tidak berhasil diperoleh dari database.",
      };
    }

    const createdAtIso = data.created_at;

    // =====================================================
    // 7. BUAT COMMENT UNTUK FRONTEND
    // =====================================================

    const newComment: DiscussionComment = {
      id: data.id,

      author: authorName,

      role: displayRole,

      // Gunakan created_at dari database
      time: formatTimestamp(
        createdAtIso
      ),

      text: trimmed,

      // Simpan timestamp asli
      created_at: createdAtIso,
    };

    // =====================================================
    // 8. REVALIDATE HALAMAN
    // =====================================================

    revalidatePath(
      `/solver/challenge/${challengeId}`
    );

    return {
      success: true,
      comment: newComment,
    };
  } catch (error: any) {
    console.error(
      "Add discussion error:",
      error
    );

    return {
      success: false,
      error:
        error?.message ||
        "Terjadi kesalahan saat menyimpan diskusi.",
    };
  }
}