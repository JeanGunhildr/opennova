import { Users, Building2, Trophy, Wallet, Landmark } from "lucide-react";
import AdminPageHeader from "@/component/admin/AdminPageHeader";
import StatCard from "@/component/admin/StatCard";
import ActiveChallengesTable from "@/component/admin/ActiveChallengesTable";
import CompletedChallengesTable from "@/component/admin/CompletedChallengesTable";
import { formatRupiah, getDashboardSummary } from "@/lib/data/admin";

export default function AdminDashboardPage() {
  const summary = getDashboardSummary();

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto">
      <AdminPageHeader
        title="Dashboard Admin"
        description="Ringkasan performa platform OpenNova secara keseluruhan."
      />

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 mb-8">
        <StatCard
          label="Total Solver"
          value={summary.totalSolver.toLocaleString("id-ID")}
          icon={Users}
          hint="Terdaftar di platform"
        />
        <StatCard
          label="Total Seeker"
          value={summary.totalSeeker.toLocaleString("id-ID")}
          icon={Building2}
          hint="Perusahaan & organisasi"
        />
        <StatCard
          label="Total Challenge Aktif"
          value={summary.totalActiveChallenge.toLocaleString("id-ID")}
          icon={Trophy}
          hint="Sedang berjalan"
        />
        <StatCard
          label="Pendapatan Platform"
          value={formatRupiah(summary.platformRevenue)}
          icon={Wallet}
          hint="Biaya layanan 10% per challenge"
          tone="brand"
        />
        <StatCard
          label="Dana Escrow Tertahan"
          value={formatRupiah(summary.escrowHeld)}
          icon={Landmark}
          hint="Hadiah challenge yang masih aktif"
        />
      </div>

      {/* Tables */}
      <div className="flex flex-col gap-6">
        <ActiveChallengesTable />
        <CompletedChallengesTable />
      </div>
    </div>
  );
}
