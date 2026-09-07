import { redirect } from "next/navigation";

import {
  Users,
  Building2,
  Trophy,
  Wallet,
  Landmark,
} from "lucide-react";

import AdminPageHeader from "@/component/admin/AdminPageHeader";
import StatCard from "@/component/admin/StatCard";
import ActiveChallengesTable from "@/component/admin/ActiveChallengesTable";

import { formatRupiah } from "@/lib/data/admin";

import {
  getAdminChallenges,
  getAdminDashboardSummary,
} from "@/lib/data/admin-server";

import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // ────────────────────────────────────────────────────────
  // Authentication
  // ────────────────────────────────────────────────────────

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Belum login
  if (!user) {
    redirect("/admin/login");
  }

  // ────────────────────────────────────────────────────────
  // Authorization
  // ────────────────────────────────────────────────────────

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  // Profile tidak ditemukan / error
  if (profileError || !profile) {
    redirect("/");
  }

  // Bukan admin
  if (profile.role !== "admin") {
    redirect("/");
  }

  // ────────────────────────────────────────────────────────
  // Fetch dashboard data
  // ────────────────────────────────────────────────────────

  const [challenges, summary] = await Promise.all([
    getAdminChallenges(),
    getAdminDashboardSummary(),
  ]);

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

      {/* Challenge table */}
      <div className="flex flex-col gap-6">
        <ActiveChallengesTable challenges={challenges} />
      </div>
    </div>
  );
}