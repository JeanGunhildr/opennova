import SeekerPageHeader from "@/component/seeker/dashboard/SeekerPageHeader";
import DashboardSummaryGrid from "@/component/seeker/dashboard/DashboardSummaryGrid";
import ActiveChallengePanel, {
  type ActiveChallengeItem,
} from "@/component/seeker/dashboard/ActiveChallengePanel";
import AgendaPanel, {
  type AgendaItem,
} from "@/component/seeker/dashboard/AgendaPanel";
import { getCurrentUser } from "@/lib/supabase/user";
import { getCurrentProfile } from "@/lib/supabase/profile";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  getCanonicalTab,
  getParticipantCount,
  buildUpcomingAgendas,
} from "@/lib/utils/seekerChallengeHelper";

export const dynamic = "force-dynamic";

export default async function SeekerDashboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/");
  }

  const profile = await getCurrentProfile();
  if (profile?.role === "solver") {
    redirect("/solver");
  }

  const supabase = await createClient();

  // 1. Ambil seluruh data challenge milik Seeker ini
  const { data: dbChallenges, error } = await supabase
    .from("challenges")
    .select(`
      id,
      name,
      prize_pool,
      status,
      deadline,
      created_at,
      categories (
        name
      ),
      challenge_entries (
        id
      ),
      challenge_timelines (
        id,
        title,
        start_date,
        end_date,
        sort_order
      )
    `)
    .eq("seeker_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching seeker dashboard data:", error);
  }

  const challenges = dbChallenges || [];

  // 2. Hitung challenge aktif & akumulasi total hadiah
  const activeChallenges: ActiveChallengeItem[] = [];
  let totalRewardSum = 0;

  challenges.forEach((ch) => {
    totalRewardSum += Number(ch.prize_pool) || 0;

    const canonicalTab = getCanonicalTab(ch.status || "pending");

    // Hanya masukkan ke Daftar Challenge Aktif jika canonical status-nya "active"
    if (canonicalTab === "active") {
      const categoryName = Array.isArray(ch.categories)
        ? ch.categories[0]?.name
        : (ch.categories as { name: string } | null)?.name || "Umum";

      // Participant count dari challenge_entries length
      const participants = getParticipantCount(ch.challenge_entries);

      activeChallenges.push({
        id: ch.id,
        title: ch.name,
        category: categoryName,
        status: ch.status || "ongoing",
        participants,
      });
    }
  });

  // 3. Format total hadiah
  let rewardLabel = "Rp 0";
  if (totalRewardSum >= 1_000_000_000) {
    rewardLabel = `Rp ${(totalRewardSum / 1_000_000_000)
      .toFixed(1)
      .replace(".0", "")} M`;
  } else if (totalRewardSum >= 1_000_000) {
    rewardLabel = `Rp ${Math.round(totalRewardSum / 1_000_000)} Jt`;
  } else if (totalRewardSum > 0) {
    rewardLabel = `Rp ${totalRewardSum.toLocaleString("id-ID")}`;
  }

  // 4. Ekstrak agenda linimasa terdekat (dinamis dari DB, mengabaikan pending/rejected & tanggal lewat)
  const dynamicAgendas = buildUpcomingAgendas(challenges, 4);

  const agendas: AgendaItem[] = dynamicAgendas.map((a) => ({
    id: a.id,
    month: a.month,
    day: a.day,
    title: a.title,
    description: a.description,
  }));

  const displayName = profile?.full_name ? profile.full_name.split(" ")[0] : "";

  return (
    <div
      className="min-h-screen pt-14 lg:pt-0"
      style={{ background: "#171717" }}
    >
      <div
        className="w-full max-w-[1160px] mx-auto px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 py-8 lg:py-8 xl:py-10"
      >
        {/* Page header */}
        <SeekerPageHeader
          eyebrow={displayName ? `Halo, ${displayName}` : "Ringkasan Hari Ini"}
          title="Dashboard Aktivitas"
          description="Berikut aktivitas, perkembangan terbaru, dan status seluruh challenge yang Anda kelola."
          actionLabel="Lihat Detail Challenge"
          actionHref="/seeker/challenges"
        />

        {/* Summary cards */}
        <DashboardSummaryGrid
          totalCount={challenges.length}
          activeCount={activeChallenges.length}
          totalRewardLabel={rewardLabel}
        />

        {/* 2-column: Active challenges + Agenda */}
        <div
          className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-[18px] mt-7"
        >
          <ActiveChallengePanel challenges={activeChallenges.slice(0, 5)} />
          <AgendaPanel agendas={agendas} />
        </div>
      </div>
    </div>
  );
}
