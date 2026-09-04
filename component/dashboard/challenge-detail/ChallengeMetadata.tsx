// ChallengeMetadata.tsx — 4 stat cards displaying reward, deadline, participant count, and DB status

import { Trophy, Clock, Users, Activity } from "lucide-react";

export interface ChallengeMetadataProps {
  reward: string;
  deadline: string;
  participantCount: number;
  status: string;
}

/** Helper to format DB status code into friendly Indonesian label & badge color */
function getStatusBadgeStyle(status: string): { label: string; bg: string; text: string; dot: string } {
  const s = (status || "").toLowerCase().trim();

  if (s === "pending" || s === "draft") {
    return {
      label: "Menunggu Persetujuan",
      bg: "bg-[#FFF9E8]",
      text: "text-[#A96F00]",
      dot: "bg-[#A96F00]",
    };
  }
  if (s === "published" || s === "ongoing" || s === "active" || s === "dibuka" || s === "challenge dibuka") {
    return {
      label: "Dibuka",
      bg: "bg-[#E4F4E6]",
      text: "text-[#168A39]",
      dot: "bg-[#168A39]",
    };
  }
  if (s === "evaluation" || s === "screening" || s === "screening awal" || s === "penjurian") {
    return {
      label: "Screening Awal",
      bg: "bg-[#EBF5FF]",
      text: "text-[#1D63ED]",
      dot: "bg-[#1D63ED]",
    };
  }
  if (s === "completed" || s === "selesai") {
    return {
      label: "Selesai",
      bg: "bg-[#E4F4E6]",
      text: "text-[#168A39]",
      dot: "bg-[#168A39]",
    };
  }
  if (s === "rejected" || s === "ditolak") {
    return {
      label: "Ditolak",
      bg: "bg-red-50",
      text: "text-red-600",
      dot: "bg-red-600",
    };
  }
  if (s === "closed" || s === "ditutup") {
    return {
      label: "Ditutup",
      bg: "bg-gray-100",
      text: "text-gray-600",
      dot: "bg-gray-500",
    };
  }

  // Fallback if status is already human readable
  return {
    label: status.replace(/^challenge\s+/i, ""),
    bg: "bg-[#E4F4E6]",
    text: "text-[#168A39]",
    dot: "bg-[#168A39]",
  };
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
    <div className="bg-white border border-gray-200 rounded-[14px] px-3.5 py-2.5 flex flex-col justify-center gap-1 min-h-[58px] shadow-[0_1px_4px_rgba(0,0,0,0.035)]">
      <p className="text-[11px] text-gray-500 flex items-center gap-1.5 leading-none">
        <Icon size={12} strokeWidth={1.8} />
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
  const statusInfo = getStatusBadgeStyle(status);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[10px]">
      <MetaCard
        label="Total Hadiah"
        value={reward}
        valueClassName="text-[14px] font-bold text-primary-500"
        icon={Trophy}
      />
      <MetaCard
        label="Deadline"
        value={deadline}
        icon={Clock}
      />
      <MetaCard
        label="Peserta"
        value={`${participantCount} Solver`}
        icon={Users}
      />
      <div className="bg-white border border-gray-200 rounded-[14px] px-3.5 py-2.5 flex flex-col justify-center gap-1 min-h-[58px] shadow-[0_1px_4px_rgba(0,0,0,0.035)]">
        <p className="text-[11px] text-gray-500 flex items-center gap-1.5 leading-none">
          <Activity size={12} strokeWidth={1.8} />
          Status
        </p>
        <span
          className={`inline-flex items-center self-start gap-1.5 h-[22px] px-2.5 rounded-full text-[12px] font-semibold ${statusInfo.bg} ${statusInfo.text}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
          {statusInfo.label}
        </span>
      </div>
    </div>
  );
}