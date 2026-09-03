import SeekerPageHeader from "@/component/seeker/dashboard/SeekerPageHeader";
import DashboardSummaryGrid from "@/component/seeker/dashboard/DashboardSummaryGrid";
import ActiveChallengePanel from "@/component/seeker/dashboard/ActiveChallengePanel";
import AgendaPanel from "@/component/seeker/dashboard/AgendaPanel";

export default function SeekerDashboardPage() {
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
          eyebrow="Ringkasan Hari Ini"
          title="Dashboard Aktivitas"
          description="Berikut aktivitas, perkembangan terbaru, dan status seluruh challenge yang Anda kelola."
          actionLabel="Lihat Detail Challenge"
          actionHref="/seeker/challenges"
        />

        {/* Summary cards */}
        <DashboardSummaryGrid />

        {/* 2-column: Active challenges + Agenda */}
        <div
          className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-[18px] mt-7"
        >
          <ActiveChallengePanel />
          <AgendaPanel />
        </div>
      </div>
    </div>
  );
}