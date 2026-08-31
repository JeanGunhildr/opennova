// ChallengeMetadata.tsx — Styled per JSONC spec
// 4-col white cards on lg, 2-col on sm/md, 1-col on base

import { Trophy, Clock, Users, Activity } from "lucide-react";

export interface ChallengeMetadataProps {
  reward: string;
  deadline: string;
  participantCount: number;
  status: string;
}

function MetaCard({
  label,
  value,
  valueClassName = "text-[14px] font-semibold text-gray-800",
  icon: Icon,
}: {
  label: string;
  value: string;
  valueClassName?: string;
  icon: typeof Trophy;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-[14px] px-3 py-2.5 flex flex-col justify-center gap-1 min-h-[58px] shadow-[0_1px_4px_rgba(0,0,0,0.035)]">
      <p className="text-[11px] text-gray-500 flex items-center gap-1.5 leading-none">
        <Icon size={11} strokeWidth={1.8} />
        {label}
      </p>
      <p className={valueClassName}>{value}</p>
    </div>
  );
}

export default function ChallengeMetadata({
  reward,
  deadline,
  participantCount,
  status,
}: ChallengeMetadataProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[10px]">
      <MetaCard
        label="Total Hadiah"
        value={reward}
        valueClassName="text-[14px] font-semibold text-primary-500"
        icon={Trophy}
      />
      <MetaCard
        label="Deadline"
        value={deadline}
        icon={Clock}
      />
      <MetaCard
        label="Peserta"
        value={`${participantCount} peserta`}
        icon={Users}
      />
      <div className="bg-white border border-gray-200 rounded-[14px] px-3 py-2.5 flex flex-col justify-center gap-1 min-h-[58px] shadow-[0_1px_4px_rgba(0,0,0,0.035)]">
        <p className="text-[11px] text-gray-500 flex items-center gap-1.5 leading-none">
          <Activity size={11} strokeWidth={1.8} />
          Status Challenge
        </p>
        <span className="inline-flex items-center self-start gap-1.5 h-[22px] px-2.5 rounded-full bg-[#E4F4E6] text-[#168A39] text-[12px] font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#168A39]" />
          {status}
        </span>
      </div>
    </div>
  );
}