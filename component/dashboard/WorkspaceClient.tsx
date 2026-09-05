"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Briefcase, CheckCircle2, Award, BellRing, AlertTriangle, ShieldAlert } from "lucide-react";
import WorkspaceChallengeCard, { type WorkspaceChallengeItem } from "./WorkspaceChallengeCard";

export interface WorkspaceClientProps {
  activeItems: WorkspaceChallengeItem[];
  completedItems: WorkspaceChallengeItem[];
  activeCount: number;
  completedCount: number;
  totalPotentialReward: number;
  potentialRewardLabel: string;
}

type TabId = "in-progress" | "completed";

// ── Stat Card Component ─────────────────────────────────────
function WorkspaceStatusCard({
  iconBg,
  iconColor,
  IconComponent,
  value,
  label,
  subLabel,
}: {
  iconBg: string;
  iconColor: string;
  IconComponent: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
  value: string;
  label: string;
  subLabel?: string;
}) {
  return (
    <div className="bg-white border border-[#E5E7E9] rounded-[16px] px-4 py-3.5 flex items-center gap-3.5 shadow-[0_1px_4px_rgba(0,0,0,0.035)]">
      <div className={`flex-shrink-0 w-[50px] h-[50px] rounded-full flex items-center justify-center ${iconBg}`}>
        <IconComponent size={22} className={iconColor} strokeWidth={1.8} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-1">
          <p className="text-[24px] lg:text-[26px] font-bold text-gray-900 leading-[1.1] tracking-tight">{value}</p>
          {subLabel && (
            <span className="text-[11px] font-semibold text-primary-600 bg-primary-50 border border-primary-200 px-2 py-0.5 rounded-full">
              {subLabel}
            </span>
          )}
        </div>
        <p className="text-[14px] text-gray-600 mt-1 leading-[1.35]">{label}</p>
      </div>
    </div>
  );
}

// ── Empty State Component ───────────────────────────────────
function WorkspaceEmptyState({ tab }: { tab: TabId }) {
  if (tab === "completed") {
    return (
      <div className="bg-white border border-[#E5E7E9] rounded-[16px] flex flex-col items-center justify-center py-16 px-8 text-center shadow-[0_1px_4px_rgba(0,0,0,0.035)]">
        <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <CheckCircle2 size={24} className="text-gray-400" strokeWidth={1.5} />
        </div>
        <p className="text-[17px] font-semibold text-gray-900 mb-1.5">Belum Ada Challenge Selesai</p>
        <p className="text-[14px] text-gray-500 leading-[1.5] max-w-[340px]">
          Challenge yang telah Anda selesaikan atau telah mengumumkan hasil akan secara otomatis muncul di sini.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E5E7E9] rounded-[16px] flex flex-col items-center justify-center py-16 px-8 text-center shadow-[0_1px_4px_rgba(0,0,0,0.035)]">
      <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <BellRing size={24} className="text-gray-400" strokeWidth={1.5} />
      </div>
      <p className="text-[17px] font-semibold text-gray-900 mb-1.5">Belum Ada Challenge Aktif</p>
      <p className="text-[14px] text-gray-500 leading-[1.5] max-w-[340px] mb-6">
        Temukan tantangan menarik yang sesuai dengan keahlianmu dan mulai berkontribusi.
      </p>
      <Link
        href="/solver"
        className="inline-flex items-center gap-2.5 h-[46px] px-5 bg-primary-500 hover:bg-primary-600 text-white text-[14px] font-semibold rounded-full transition-colors shadow-[0_5px_14px_rgba(0,0,0,0.14)]"
      >
        <Plus size={17} strokeWidth={2.2} />
        Cari Challenge
      </Link>
    </div>
  );
}

// ── Slot Dots Indicator ─────────────────────────────────────
function SlotIndicatorDots({ activeCount }: { activeCount: number }) {
  const maxSlots = 3;
  return (
    <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3.5 py-1.5 shadow-2xs">
      <div className="flex items-center gap-1.5">
        {Array.from({ length: maxSlots }).map((_, i) => (
          <span
            key={i}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              i < activeCount ? "bg-primary-500 shadow-2xs" : "bg-gray-200 border border-gray-300"
            }`}
          />
        ))}
      </div>
      <span className="text-[12px] font-bold text-gray-800 border-l border-gray-200 pl-2">
        {activeCount} / {maxSlots} slot digunakan
      </span>
    </div>
  );
}

// ── Main Workspace Client ───────────────────────────────────
export default function WorkspaceClient({
  activeItems,
  completedItems,
  activeCount,
  completedCount,
  potentialRewardLabel,
}: WorkspaceClientProps) {
  const [activeTab, setActiveTab] = useState<TabId>("in-progress");

  const isFull = activeCount >= 3;

  const TABS: { id: TabId; label: string; count: number }[] = [
    { id: "in-progress", label: "Sedang Berlangsung", count: activeCount },
    { id: "completed", label: "Selesai", count: completedCount },
  ];

  const filtered = activeTab === "in-progress" ? activeItems : completedItems;

  return (
    <div className="flex flex-col w-full max-w-[1160px] mx-auto gap-6 px-4 sm:px-5 md:px-6 lg:px-7 xl:px-8 2xl:px-10 py-6 mb-16">
      {/* ── Header ────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-1">
        <div className="flex flex-col gap-1.5 max-w-[640px]">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-[32px] sm:text-[36px] md:text-[40px] font-bold text-gray-900 tracking-[-0.025em] leading-[1.1]">
              Ruang kerja anda
            </h1>
            <SlotIndicatorDots activeCount={activeCount} />
          </div>
          <p className="text-[16px] sm:text-[17px] text-gray-600 leading-[1.35]">
            Pantau seluruh challenge yang sedang anda kerjakan, dari tahap awal hingga hasil penilaian akhir.
          </p>
        </div>

        <div className="flex items-center justify-start sm:justify-end">
          <Link
            href="/solver"
            className="inline-flex items-center justify-center gap-2.5 h-[48px] px-6 bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white text-[15px] font-semibold rounded-full transition-colors shadow-[0_6px_16px_rgba(0,0,0,0.14)]"
          >
            <Plus size={19} strokeWidth={2.2} />
            Cari Challenge Baru
          </Link>
        </div>
      </div>

      {/* ── Notice Banner if 3/3 Slots Used ────────────────── */}
      {isFull && (
        <div className="bg-[#FFF8E6] border border-[#FBE3B5] rounded-[16px] p-4 flex items-start gap-3.5 text-[13px] text-[#8C6210] shadow-2xs">
          <ShieldAlert size={20} className="text-[#D9822B] flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-bold text-[14px]">Semua Slot Challenge Sedang Digunakan (3/3)</p>
            <p className="text-[12.5px] leading-[1.45] text-[#8C6210]">
              Anda sedang mendaftar 3 challenge aktif secara bersamaan. Slot akan otomatis tersedia kembali setelah salah satu challenge selesai atau tereliminasi.
            </p>
          </div>
        </div>
      )}

      {/* ── Status summary cards ───────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-3.5 md:gap-4 lg:gap-5 w-full">
        <WorkspaceStatusCard
          iconBg="bg-primary-100"
          iconColor="text-primary-500"
          IconComponent={Briefcase}
          value={String(activeCount)}
          label="Challenge sedang dikerjakan"
          subLabel={`${activeCount}/3 slot`}
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
          value={potentialRewardLabel}
          label="Total potensi perolehan hadiah"
        />
      </div>

      {/* ── Tabs ──────────────────────────────────────── */}
      <div className="flex flex-col w-full mt-2">
        <div className="flex items-stretch gap-8 lg:gap-9 border-b border-gray-200 h-[52px] overflow-x-auto overflow-y-hidden scrollbar-hidden">
          {TABS.map(({ id, label, count }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className={[
                  "relative inline-flex items-center gap-2.5 h-[52px] px-1 whitespace-nowrap text-[17px] sm:text-[18px] leading-none transition-colors",
                  isActive ? "text-gray-900 font-semibold" : "text-gray-600 font-medium hover:text-gray-800",
                ].join(" ")}
              >
                {label}
                <span
                  className={[
                    "inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full text-[12.5px] font-semibold leading-none",
                    isActive ? "bg-primary-500 text-white" : "bg-gray-100 text-gray-600",
                  ].join(" ")}
                >
                  {count}
                </span>
                {isActive && <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-primary-500 rounded-t-full" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Challenge Grid ─────────────────────────────── */}
      {filtered.length === 0 ? (
        <WorkspaceEmptyState tab={activeTab} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-4 lg:gap-[18px] w-full">
          {filtered.map((challenge) => (
            <WorkspaceChallengeCard key={challenge.entryId} challenge={challenge} />
          ))}
        </div>
      )}
    </div>
  );
}
