"use client";

import { useState } from "react";
import type { ManageChallengeData } from "@/lib/actions/seeker-manage";
import ManageChallengeHeader from "./ManageChallengeHeader";
import AssessmentSubmenu from "./AssessmentSubmenu";
import ChallengeSettingsTab from "./ChallengeSettingsTab";
import DiscussionTab from "./discussion/DiscussionTab";

// Map challenge DB status → internal lifecycle stage
export type SeekerLifecycleStage =
  | "PENJURIAN_AHLI"
  | "PITCHING_FINAL"
  | "PENGUMUMAN_PEMENANG";

function mapStatusToStage(status: string): SeekerLifecycleStage {
  switch (status) {
    case "judging":
      return "PENJURIAN_AHLI";
    case "final_pitch":
      return "PITCHING_FINAL";
    case "completed":
      return "PENGUMUMAN_PEMENANG";
    default:
      // ongoing & others default to expert judging view
      return "PENJURIAN_AHLI";
  }
}

interface ManageChallengeClientProps {
  data: ManageChallengeData;
}

export default function ManageChallengeClient({ data }: ManageChallengeClientProps) {
  const defaultStage = mapStatusToStage(data.status);
  const [activeStage, setActiveStage] = useState<SeekerLifecycleStage>(defaultStage);
  const [primaryTab, setPrimaryTab] = useState<"assessment" | "discussion" | "settings">(
    "assessment"
  );

  return (
    <div className="w-full min-h-screen bg-[#171717] text-white">
      <div className="w-full max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-7 pt-5 pb-16">
        {/* Developer Testing Bar: Lifecycle Switcher (3 stages only) */}
        <div className="flex items-center justify-between gap-3 bg-[#191919] border border-[#303030] rounded-full px-3.5 py-1.5 mb-5 text-xs text-[#A4A4A4]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#E30000] animate-pulse" />
            <span className="font-semibold text-white">Preview Tahapan Lifecycle:</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {(
              [
                ["PENJURIAN_AHLI", "1. Penjurian Ahli"],
                ["PITCHING_FINAL", "2. Pitching Final"],
                ["PENGUMUMAN_PEMENANG", "3. Pemenang"],
              ] as const
            ).map(([stageKey, label]) => {
              const isSelected = activeStage === stageKey;
              return (
                <button
                  key={stageKey}
                  type="button"
                  onClick={() => setActiveStage(stageKey)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors whitespace-nowrap ${
                    isSelected
                      ? "bg-[#E30000] text-white font-bold"
                      : "bg-[#2A2829] text-[#A4A4A4] hover:text-white"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Summary Header ────────────────────────────────────── */}
        <ManageChallengeHeader data={data} stage={activeStage} />

        {/* ── Primary 3-Tab Navigation Bar ─────────────────────── */}
        <div className="h-[48px] border-b border-[#393939] flex items-stretch gap-7 sm:gap-8 mt-6">
          <button
            type="button"
            onClick={() => setPrimaryTab("assessment")}
            className={`h-[48px] inline-flex items-center text-[13px] whitespace-nowrap transition-colors relative ${
              primaryTab === "assessment"
                ? "text-white font-semibold after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-[2px] after:bg-[#E30000]"
                : "text-[#737373] hover:text-[#A4A4A4]"
            }`}
          >
            Penilaian &amp; Pemenang
          </button>

          <button
            type="button"
            onClick={() => setPrimaryTab("discussion")}
            className={`h-[48px] inline-flex items-center text-[13px] whitespace-nowrap transition-colors relative ${
              primaryTab === "discussion"
                ? "text-white font-semibold after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-[2px] after:bg-[#E30000]"
                : "text-[#737373] hover:text-[#A4A4A4]"
            }`}
          >
            Ruang Diskusi
          </button>

          <button
            type="button"
            onClick={() => setPrimaryTab("settings")}
            className={`h-[48px] inline-flex items-center text-[13px] whitespace-nowrap transition-colors relative ${
              primaryTab === "settings"
                ? "text-white font-semibold after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-[2px] after:bg-[#E30000]"
                : "text-[#737373] hover:text-[#A4A4A4]"
            }`}
          >
            Pengaturan Challenge
          </button>
        </div>

        {/* ── Tab Content Area ─────────────────────────────────── */}
        {primaryTab === "assessment" && (
          <AssessmentSubmenu data={data} stage={activeStage} />
        )}

        {primaryTab === "discussion" && (
          <DiscussionTab
            challengeId={data.id}
            companyName={data.companyName ?? "Penyelenggara"}
          />
        )}

        {primaryTab === "settings" && (
          <ChallengeSettingsTab challengeId={data.id} data={data} />
        )}
      </div>
    </div>
  );
}
