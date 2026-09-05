"use client";

import { Trophy, Clock } from "lucide-react";
import type { ResolvedChallengeUI, ChallengeState } from "@/lib/data/challengeState";

interface ChallengeDynamicInfoCardProps {
  state: ChallengeState;
  resolved: ResolvedChallengeUI;
  reward: string;
}

export default function ChallengeDynamicInfoCard({
  state,
  resolved,
  reward,
}: ChallengeDynamicInfoCardProps) {
  if (resolved.dynamicInfoMode === "winner") {
    return (
      <div className="min-h-[64px] rounded-[14px] bg-[#E30000] text-white p-[11px_15px] flex items-center justify-between gap-2.5 shadow-sm">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-[30px] h-[30px] rounded-full bg-white text-[#E30000] font-bold text-[11px] flex items-center justify-center flex-shrink-0 shadow-sm select-none">
            {state.winnerName ? state.winnerName.slice(0, 2).toUpperCase() : "WI"}
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-medium text-white block leading-tight truncate">
              Pemenang Challenge
            </span>
            <span className="text-[12px] font-bold text-white mt-0.5 block leading-tight truncate">
              {state.winnerName || "Tim Inovator"}
            </span>
          </div>
        </div>
        <Trophy size={25} className="text-white flex-shrink-0" strokeWidth={2} />
      </div>
    );
  }

  return (
    <div className="min-h-[64px] rounded-[14px] bg-[#E30000] text-white p-[11px_15px] grid grid-cols-2 gap-2.5 items-center shadow-sm">
      <div>
        <span className="text-[10px] text-white/80 block leading-tight">
          Total hadiah
        </span>
        <span className="text-[16px] font-bold text-white mt-[3px] block leading-tight truncate">
          {reward}
        </span>
      </div>

      <div className="text-right">
        <span className="text-[10px] text-white/80 block leading-tight">
          Berakhir dalam
        </span>
        <div className="flex items-center justify-end gap-1 mt-[3px]">
          <Clock size={13} className="text-white/80 flex-shrink-0" strokeWidth={2} />
          <span className="text-[16px] font-bold text-white leading-tight">
            {resolved.registrationClosed || resolved.challengeEnded
              ? "0 Hari"
              : `${state.remainingDays ?? 48} Hari`}
          </span>
        </div>
      </div>
    </div>
  );
}
