"use server";

import { createClient } from "@/lib/supabase/server";

export interface BalanceTransactionItem {
  id: string;
  amount: number;
  type: string;
  description: string | null;
  reference_id?: string | null;
  created_at: string;
}

export interface SolverBalanceResult {
  balance: number;
  transactions: BalanceTransactionItem[];
  error?: string;
}

/**
 * Fetch the authenticated solver's current balance and recent transactions.
 */
export async function getSolverBalanceAction(): Promise<SolverBalanceResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { balance: 0, transactions: [], error: "Sesi berakhir." };
    }

    // Fetch solver profile balance
    const { data: sp, error: spErr } = await supabase
      .from("solver_profiles")
      .select("balance")
      .eq("user_id", user.id)
      .maybeSingle();

    if (spErr) {
      console.warn("getSolverBalanceAction: error fetching solver_profile:", spErr.message);
    }

    // Fetch transactions
    const { data: txs, error: txErr } = await supabase
      .from("balance_transactions")
      .select("id, amount, type, description, reference_id, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);

    if (txErr) {
      console.warn("getSolverBalanceAction: error fetching balance_transactions:", txErr.message);
    }

    return {
      balance: Number(sp?.balance ?? 0),
      transactions: (txs ?? []).map((t: any) => ({
        id: t.id,
        amount: Number(t.amount ?? 0),
        type: t.type,
        description: t.description,
        reference_id: t.reference_id,
        created_at: t.created_at,
      })),
    };
  } catch (err: any) {
    console.error("getSolverBalanceAction unhandled error:", err);
    return { balance: 0, transactions: [], error: err?.message || "Gagal memuat saldo." };
  }
}

export interface SolverCertificateItem {
  id: string;
  challengeName: string;
  company: string;
  date: string;
  status: string;
  certificateNumber: string | null;
  certificatePath: string | null;
}

/**
 * Fetch certificates and achievements for the authenticated solver.
 */
export async function getSolverCertificatesAction(): Promise<SolverCertificateItem[]> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase
      .from("certificates")
      .select(`
        id,
        certificate_number,
        certificate_path,
        issued_at,
        challenge_entries (
          id,
          winner_rank,
          challenges (
            id,
            name,
            seeker_profiles (
              company_name
            )
          )
        )
      `)
      .eq("user_id", user.id)
      .order("issued_at", { ascending: false });

    if (error) {
      console.warn("getSolverCertificatesAction error:", error.message);
      return [];
    }

    return (data ?? []).map((c: any) => {
      const entry = c.challenge_entries;
      const challenge = entry?.challenges;
      const seekerProfiles = challenge?.seeker_profiles;
      const companyName = Array.isArray(seekerProfiles)
        ? seekerProfiles[0]?.company_name
        : seekerProfiles?.company_name || "Penyelenggara Challenge";

      const rank = entry?.winner_rank;
      const rankLabel =
        rank === 1
          ? "Juara 1 🏆"
          : rank === 2
          ? "Juara 2 🥈"
          : rank === 3
          ? "Juara 3 🥉"
          : "Pemenang";

      const dateStr = c.issued_at
        ? new Date(c.issued_at).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "-";

      return {
        id: c.id,
        challengeName: challenge?.name || "Challenge",
        company: companyName,
        date: dateStr,
        status: rankLabel,
        certificateNumber: c.certificate_number,
        certificatePath: c.certificate_path,
      };
    });
  } catch (err: any) {
    console.error("getSolverCertificatesAction unhandled error:", err);
    return [];
  }
}
