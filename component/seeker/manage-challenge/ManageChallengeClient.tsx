"use client";

import { useState } from "react";
import {
  SeekerLifecycleStage,
  CURRENT_SEEKER_STAGE,
  MOCK_SEEKER_CHALLENGE_SUMMARY,
} from "@/lib/data/seekerChallengeState";
import ManageChallengeHeader from "./ManageChallengeHeader";
import AssessmentSubmenu from "./AssessmentSubmenu";
import ChallengeSettingsTab from "./ChallengeSettingsTab";
import DiscussionTab from "./discussion/DiscussionTab";

interface ManageChallengeClientProps {
  id: string;
}

export default function ManageChallengeClient({ id }: ManageChallengeClientProps) {
  // Testable lifecycle stage switcher
  const [activeStage, setActiveStage] = useState<SeekerLifecycleStage>(CURRENT_SEEKER_STAGE);

  // Primary tab state: default to "assessment" (Submenu 1)
  const [primaryTab, setPrimaryTab] = useState<"assessment" | "discussion" | "settings">("assessment");

  const challenge = {
    ...MOCK_SEEKER_CHALLENGE_SUMMARY,
    id: id || MOCK_SEEKER_CHALLENGE_SUMMARY.id,
  };

  return (
    <div className="w-full min-h-screen bg-[#171717] text-white">
      {/* Container */}
      <div className="w-full max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-7 pt-5 pb-16">
        {/* Developer Testing Bar: Lifecycle Switcher */}
        <div className="flex items-center justify-between gap-3 bg-[#191919] border border-[#303030] rounded-full px-3.5 py-1.5 mb-5 text-xs text-[#A4A4A4]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#E30000] animate-pulse" />
            <span className="font-semibold text-white">Preview Tahapan Lifecycle:</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {(
              [
                ["CHALLENGE_DIBUKA", "1. Dibuka"],
                ["PENJURIAN_AHLI", "2. Penjurian Ahli"],
                ["PITCHING_FINAL", "3. Pitching Final"],
                ["PENGUMUMAN_PEMENANG", "4. Pemenang"],
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
        <ManageChallengeHeader challenge={challenge} stage={activeStage} />

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
            Penilaian & Pemenang
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
          <AssessmentSubmenu stage={activeStage} />
        )}

        {primaryTab === "discussion" && (
          <DiscussionTab challengeTitle={challenge.title} />
        )}

        {primaryTab === "settings" && (
          <ChallengeSettingsTab challengeTitle={challenge.title} />
        )}
      </div>
    </div>
  );
}
