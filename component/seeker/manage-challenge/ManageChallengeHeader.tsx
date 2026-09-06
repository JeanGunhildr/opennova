"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Users } from "lucide-react";
import type { SeekerLifecycleStage } from "./ManageChallengeClient";
import type { ManageChallengeData } from "@/lib/actions/seeker-manage";
import { getStatusBadge } from "@/lib/utils/seekerChallengeHelper";

interface ManageChallengeHeaderProps {
  data: ManageChallengeData;
  stage: SeekerLifecycleStage;
}

export default function ManageChallengeHeader({
  data,
  stage,
}: ManageChallengeHeaderProps) {
  // Status badge from DB status using canonical helper
  const badge = getStatusBadge(data.status);

  // Stage-specific override label for the lifecycle stage display
  const stageLabel: Record<SeekerLifecycleStage, string> = {
    PENJURIAN_AHLI: "Penjurian Ahli",
    PITCHING_FINAL: "Pitching Final",
    PENGUMUMAN_PEMENANG: "Pengumuman Pemenang",
  };

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
            {data.thumbnailPath ? (
              <Image
                src={data.thumbnailPath}
                alt={data.name}
                width={126}
                height={74}
                className="w-full h-full object-cover"
                unoptimized
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#E30000]/30 to-[#2A2829]" />
            )}
          </div>

          {/* Metadata */}
          <div className="flex flex-col gap-2 min-w-0">
            {/* Tags Row */}
            <div className="flex items-center flex-wrap gap-2">
              {/* Status Pill from DB */}
              <span
                className={`h-[26px] px-2.5 rounded-full text-[10px] font-semibold border flex items-center gap-1.5 ${badge.bg} border-current ${badge.text}`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {badge.label}
              </span>

              {/* Category Pill */}
              {data.categoryName && (
                <span className="h-[26px] px-2.5 rounded-full bg-[#2A2829] border border-[#393939] text-[#A4A4A4] text-[10px] font-medium flex items-center">
                  {data.categoryName}
                </span>
              )}

              {/* Current Stage Indicator */}
              <span className="h-[26px] px-2.5 rounded-full bg-[rgba(227,0,0,0.08)] border border-[rgba(227,0,0,0.3)] text-[#E30000] text-[10px] font-medium flex items-center">
                {stageLabel[stage]}
              </span>
            </div>

            {/* Challenge Title */}
            <h1 className="text-[19px] font-bold text-white leading-snug max-w-[720px] line-clamp-2">
              {data.name}
            </h1>
          </div>
        </div>

        {/* Right column: Joined Solvers Badge */}
        <div className="h-[38px] px-3.5 rounded-full border border-[#393939] bg-[#191919] text-white text-[13px] font-medium flex items-center gap-2 shrink-0 self-start md:self-center shadow-sm">
          <Users size={14} className="text-[#A4A4A4]" />
          <span>{data.participantCount} Solver Bergabung</span>
        </div>
      </div>
    </div>
  );
}
