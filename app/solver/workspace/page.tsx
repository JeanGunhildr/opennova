"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Briefcase, CheckCircle2, Award, BellRing } from "lucide-react";
import { workspaceChallenges } from "@/lib/data/dashboard";
import WorkspaceChallengeCard from "@/component/dashboard/WorkspaceChallengeCard";

type TabId = "in-progress" | "completed";

// ── Status summary cards ───────────────────────────────────
function WorkspaceStatusCard({
  iconBg,
  iconColor,
  IconComponent,
  value,
  label,
}: {
  iconBg: string;
  iconColor: string;
  IconComponent: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
  value: string;
  label: string;
}) {
  return (
    <div className="bg-white border border-[#E5E7E9] rounded-[16px] px-4 h-[80px] flex items-center gap-3.5 shadow-[0_1px_4px_rgba(0,0,0,0.035)]">
      <div
        className={`flex-shrink-0 w-[50px] h-[50px] rounded-full flex items-center justify-center ${iconBg}`}
      >
        <IconComponent size={22} className={iconColor} strokeWidth={1.8} />
      </div>
      <div className="min-w-0">
        <p className="text-[24px] lg:text-[26px] font-bold text-gray-900 leading-[1.1] tracking-tight">{value}</p>
        <p className="text-[15px] text-gray-600 mt-1 leading-[1.35]">{label}</p>
      </div>
    </div>
  );
}

// ── Empty state ────────────────────────────────────────────
function WorkspaceEmptyState() {
  return (
    <div className="bg-white border border-[#E5E7E9] rounded-[16px] flex flex-col items-center justify-center py-16 px-8 text-center shadow-[0_1px_4px_rgba(0,0,0,0.035)]">
      <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <BellRing size={24} className="text-gray-400" strokeWidth={1.5} />
      </div>
      <p className="text-[17px] font-semibold text-gray-900 mb-1.5">Tidak ada challenge</p>
      <p className="text-[14px] text-gray-500 leading-[1.5] max-w-[320px] mb-6">
        Belum ada challenge yang berada di tahap ini. Temukan peluang baru dan mulai berpartisipasi.
      </p>
      <Link
        href="/solver"
        className="inline-flex items-center gap-2.5 h-[46px] px-5 bg-primary-500 hover:bg-primary-600 text-white text-[14px] font-semibold rounded-full transition-colors shadow-[0_5px_14px_rgba(0,0,0,0.14)]"
      >
        <Plus size={17} strokeWidth={2.2} />
        Cari Challenge Baru
      </Link>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────
export default function WorkspacePage() {
  const [activeTab, setActiveTab] = useState<TabId>("in-progress");

  const inProgressCount = workspaceChallenges.filter(c => !c.completed).length;
  const completedCount = workspaceChallenges.filter(c => c.completed).length;

  const TABS: { id: TabId; label: string; count: number }[] = [
    { id: "in-progress", label: "Sedang Berlangsung", count: inProgressCount },
    { id: "completed",   label: "Selesai",            count: completedCount },
  ];

  const filtered = workspaceChallenges.filter(c => 
    activeTab === "in-progress" ? !c.completed : c.completed
  );

  const totalPotentialReward = workspaceChallenges.reduce((sum, c) => {
    const num = parseInt(c.reward.replace(/\D/g, ""), 10);
    return sum + (isNaN(num) ? 0 : num);
  }, 0);
  
  const potentialLabel =
    totalPotentialReward >= 1_000_000_000
      ? `Rp ${(totalPotentialReward / 1_000_000_000).toFixed(0)}M`
      : `Rp ${Math.round(totalPotentialReward / 1_000_000)}jt`;

  return (
    <div className="flex flex-col w-full max-w-[1160px] mx-auto gap-6 px-4 sm:px-5 md:px-6 lg:px-7 xl:px-8 2xl:px-10 py-6 mb-16">
      {/* ── Header ────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-1">
        <div className="flex flex-col gap-1 max-w-[640px]">
          <h1 className="text-[36px] md:text-[40px] font-bold text-gray-900 tracking-[-0.025em] leading-[1.1]">
            Ruang kerja anda
          </h1>
          <p className="text-[17px] md:text-[18px] text-gray-600 leading-[1.35]">
            Pantau seluruh challenge yang sedang anda kerjakan, dari tahap awal hingga hasil penilaian akhir.
          </p>
        </div>
        <div className="flex items-center justify-start sm:justify-end">
          <Link
            href="/solver"
            className="inline-flex items-center justify-center gap-2.5 h-[50px] px-[22px] bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white text-[16px] font-semibold rounded-full transition-colors shadow-[0_6px_16px_rgba(0,0,0,0.14)]"
          >
            <Plus size={20} strokeWidth={2.2} />
            Cari Challenge Baru
          </Link>
        </div>
      </div>

      {/* ── Status summary cards ───────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-3.5 md:gap-4 lg:gap-5 w-full">
        <WorkspaceStatusCard
          iconBg="bg-primary-100"
          iconColor="text-primary-500"
          IconComponent={Briefcase}
          value={String(inProgressCount)}
          label="Challenge sedang dikerjakan"
        />
        <WorkspaceStatusCard
          iconBg="bg-[#FFF2D6]"
          iconColor="text-[#C88A00]"
          IconComponent={CheckCircle2}
          value={String(completedCount)}
          label="Challenge telah berakhir"
        />
        <WorkspaceStatusCard
          iconBg="bg-[#E4F4E6]"
          iconColor="text-[#1F9D45]"
          IconComponent={Award}
          value={potentialLabel}
          label="Total potensi perolehan hadiah"
        />
      </div>

      {/* ── Tabs ──────────────────────────────────────── */}
      <div className="flex flex-col w-full mt-4">
        <div className="flex items-stretch gap-8 lg:gap-9 border-b border-gray-200 h-[52px] overflow-x-auto overflow-y-hidden scrollbar-hidden">
          {TABS.map(({ id, label, count }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className={[
                  "relative inline-flex items-center gap-2 h-[52px] px-2.5 whitespace-nowrap text-[18px] leading-none transition-colors",
                  isActive ? "text-gray-900 font-semibold" : "text-gray-600 font-medium hover:text-gray-800",
                ].join(" ")}
              >
                {label}
                <span
                  className={[
                    "inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 rounded-full text-[13px] font-semibold leading-none",
                    isActive
                      ? "bg-primary-100 text-primary-500"
                      : "bg-gray-100 text-gray-600",
                  ].join(" ")}
                >
                  {count}
                </span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary-500" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Challenge grid ─────────────────────────────── */}
      {filtered.length === 0 ? (
        <WorkspaceEmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-4 lg:gap-[18px] w-full">
          {filtered.map((challenge) => (
            <WorkspaceChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </div>
      )}
    </div>
  );
}