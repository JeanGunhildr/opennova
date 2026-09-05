"use client";

import Link from "next/link";
import { ArrowLeft, Users, Sparkles } from "lucide-react";
import {
  SeekerLifecycleStage,
  SeekerChallengeSummary,
} from "@/lib/data/seekerChallengeState";

interface ManageChallengeHeaderProps {
  challenge: SeekerChallengeSummary;
  stage: SeekerLifecycleStage;
}

export default function ManageChallengeHeader({
  challenge,
  stage,
}: ManageChallengeHeaderProps) {
  // Status tag config based on stage
  const getStatusConfig = () => {
    switch (stage) {
      case "CHALLENGE_DIBUKA":
        return {
          label: "Challenge Dibuka",
          bg: "bg-[rgba(34,132,65,0.2)]",
          border: "border-[rgba(57,217,111,0.25)]",
          text: "text-[#39D96F]",
        };
      case "PENJURIAN_AHLI":
        return {
          label: "Penjurian Ahli",
          bg: "bg-[rgba(227,0,0,0.1)]",
          border: "border-[rgba(227,0,0,0.3)]",
          text: "text-[#E30000]",
        };
      case "PITCHING_FINAL":
        return {
          label: "Pitching Final",
          bg: "bg-[rgba(227,0,0,0.1)]",
          border: "border-[rgba(227,0,0,0.3)]",
          text: "text-[#E30000]",
        };
      case "PENGUMUMAN_PEMENANG":
        return {
          label: "Pengumuman Pemenang",
          bg: "bg-[rgba(57,217,111,0.1)]",
          border: "border-[rgba(57,217,111,0.3)]",
          text: "text-[#39D96F]",
        };
    }
  };

  const status = getStatusConfig();

  return (
    <div className="flex flex-col gap-4">
      {/* ── Utility Header: Back Button ───────────────────────── */}
      <div className="flex items-center justify-between">
        <Link
          href="/seeker/challenges"
          className="h-[30px] px-3 rounded-full border border-[#393939] text-white text-[11px] font-medium flex items-center gap-1.5 hover:bg-[#1F1F1F] transition-colors"
        >
          <ArrowLeft size={13} />
          <span>Kembali</span>
        </Link>
      </div>

      {/* ── Summary Block: Cover + Meta + Solvers Badge ──────── */}
      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_auto] gap-5 items-start">
        {/* Left column: Cover thumbnail and Title/Tags */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 min-w-0">
          {/* Cover Thumbnail */}
          <div className="w-[126px] h-[74px] rounded-[12px] overflow-hidden border border-[#393939] shrink-0 shadow-[0_1px_3px_rgba(0,0,0,0.35)] bg-[#232323]">
            <img
              src={challenge.coverImage}
              alt={challenge.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Metadata */}
          <div className="flex flex-col gap-2 min-w-0">
            {/* Tags Row */}
            <div className="flex items-center flex-wrap gap-2">
              {/* Status Pill */}
              <span
                className={`h-[26px] px-2.5 rounded-full text-[10px] font-semibold border flex items-center gap-1.5 ${status.bg} ${status.border} ${status.text}`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {status.label}
              </span>

              {/* Category Pill */}
              <span className="h-[26px] px-2.5 rounded-full bg-[#2A2829] border border-[#393939] text-[#A4A4A4] text-[10px] font-medium flex items-center">
                {challenge.category}
              </span>

              {/* Special Collaboration */}
              {challenge.isSpecialCollaboration && (
                <span className="h-[26px] px-2.5 rounded-full bg-[#2A2829] border border-[#393939] text-[#A4A4A4] text-[10px] font-medium flex items-center gap-1">
                  <Sparkles size={11} className="text-[#F0B90B]" />
                  Kolaborasi Spesial
                </span>
              )}
            </div>

            {/* Challenge Title */}
            <h1 className="text-[19px] font-bold text-white leading-snug max-w-[720px] line-clamp-2">
              {challenge.title}
            </h1>
          </div>
        </div>

        {/* Right column: Joined Solvers Badge */}
        <div className="h-[38px] px-3.5 rounded-full border border-[#393939] bg-[#191919] text-white text-[13px] font-medium flex items-center gap-2 shrink-0 self-start md:self-center shadow-sm">
          <Users size={14} className="text-[#A4A4A4]" />
          <span>{challenge.solverCount} Solver Bergabung</span>
        </div>
      </div>
    </div>
  );
}
