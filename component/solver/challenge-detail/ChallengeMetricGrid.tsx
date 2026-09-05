"use client";

import { Award, Clock, Users, Activity } from "lucide-react";
import type { ResolvedChallengeUI } from "@/lib/data/challengeState";

interface ChallengeMetricGridProps {
  reward: string;
  deadline: string;
  participantCount: number;
  resolved: ResolvedChallengeUI;
}

export default function ChallengeMetricGrid({
  reward,
  deadline,
  participantCount,
  resolved,
}: ChallengeMetricGridProps) {
  const getStatusLabel = () => {
    if (resolved.challengeEnded) return "Selesai";
    if (resolved.registrationClosed) return "Ditutup";
    return "Aktif";
  };

  const METRICS = [
    {
      label: "Hadiah",
      value: reward,
      icon: Award,
      isReward: true,
    },
    {
      label: "Deadline",
      value: deadline,
      icon: Clock,
      isReward: false,
    },
    {
      label: "Peserta",
      value: `${participantCount} Inovator`,
      icon: Users,
      isReward: false,
    },
    {
      label: "Status Challenge",
      value: getStatusLabel(),
      icon: Activity,
      isReward: false,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 mt-3.5">
      {METRICS.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className="h-[58px] bg-white border border-[#E5E7EB] rounded-[12px] p-[9px_12px] flex flex-col justify-center gap-[3px] shadow-[0_1px_3px_rgba(17,24,39,0.04)]"
          >
            <div className="flex items-center gap-1.5 text-gray-500">
              <Icon size={13} strokeWidth={1.8} className="text-gray-500 flex-shrink-0" />
              <span className="text-[10px] font-medium text-gray-500 leading-tight truncate">
                {item.label}
              </span>
            </div>
            <span
              className={`text-[13px] font-bold leading-snug truncate ${
                item.isReward ? "text-[#E30000]" : "text-gray-800"
              }`}
            >
              {item.value}
            </span>
          </div>
        );
      })}
    </div>
  );
}
