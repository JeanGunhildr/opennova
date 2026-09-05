"use client";

import Link from "next/link";
import { Clock, BadgeCheck, User, Users } from "lucide-react";

export interface WorkspaceChallengeItem {
  id: string; // challenge_id
  entryId: string; // challenge_entries.id
  title: string;
  description?: string;
  category: string;
  company: string;
  companyInitials: string;
  verified: boolean;
  reward: string;
  prizePool: number;
  deadline: string;
  rawDeadline?: string | null;
  formattedDeadline: string;
  isOverdue: boolean;
  challengeStatus: "pending" | "rejected" | "ongoing" | "judging" | "final_pitch" | "completed";
  entryStatus: "registered" | "submitted" | "finalist" | "winner" | "eliminated";
  participationType: "individual" | "team";
  teamName?: string;
  hasSubmission: boolean;
  submissionDriveUrl?: string;
  thumbnailPath?: string | null;
  isActiveSlot: boolean;
  bgFrom: string;
  bgVia: string;
  bgTo: string;
}

interface WorkspaceChallengeCardProps {
  challenge: WorkspaceChallengeItem;
}

function SubmissionStatusBadge({ challenge }: { challenge: WorkspaceChallengeItem }) {
  const { challengeStatus, entryStatus, hasSubmission } = challenge;

  if (entryStatus === "eliminated") {
    return (
      <span className="h-[26px] px-2.5 bg-black/75 backdrop-blur-xs text-gray-200 text-[11px] font-medium rounded-full inline-flex items-center justify-center border border-white/10">
        Tereliminasi
      </span>
    );
  }

  if (challengeStatus === "completed" && entryStatus === "winner") {
    return (
      <span className="h-[26px] px-2.5 bg-[#168A39] text-white text-[11px] font-semibold rounded-full inline-flex items-center justify-center shadow-xs">
        🏆 Pemenang
      </span>
    );
  }

  if (challengeStatus === "completed") {
    return (
      <span className="h-[26px] px-2.5 bg-black/75 backdrop-blur-xs text-gray-200 text-[11px] font-medium rounded-full inline-flex items-center justify-center border border-white/10">
        Selesai
      </span>
    );
  }

  if (challengeStatus === "final_pitch") {
    return (
      <span className="h-[26px] px-2.5 bg-purple-600 text-white text-[11px] font-semibold rounded-full inline-flex items-center justify-center shadow-xs">
        Pitching Final
      </span>
    );
  }

  if (challengeStatus === "judging") {
    return (
      <span className="h-[26px] px-2.5 bg-[#D9822B] text-white text-[11px] font-semibold rounded-full inline-flex items-center justify-center shadow-xs">
        Penjurian Ahli
      </span>
    );
  }

  if (hasSubmission || entryStatus === "submitted") {
    return (
      <span className="h-[26px] px-2.5 bg-[#168A39] text-white text-[11px] font-semibold rounded-full inline-flex items-center justify-center shadow-xs">
        ✓ Submission Terkirim
      </span>
    );
  }

  return (
    <span className="h-[26px] px-2.5 bg-primary-600 text-white text-[11px] font-semibold rounded-full inline-flex items-center justify-center shadow-xs">
      Terdaftar
    </span>
  );
}

export default function WorkspaceChallengeCard({ challenge }: WorkspaceChallengeCardProps) {
  const {
    id,
    category,
    company,
    companyInitials,
    verified,
    title,
    description,
    reward,
    formattedDeadline,
    isOverdue,
    participationType,
    teamName,
    thumbnailPath,
    bgFrom,
    bgVia,
    bgTo,
  } = challenge;

  return (
    <Link href={`/solver/challenge/${id}`} className="block group">
      <article className="bg-white border border-[#E1E3E5] rounded-[16px] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] group-hover:border-gray-300 h-full">
        {/* Image / Thumbnail header */}
        <div
          className="relative h-[140px] w-full overflow-hidden bg-gray-900 p-2.5 flex flex-col justify-between"
          style={{
            background: thumbnailPath
              ? undefined
              : `linear-gradient(135deg, ${bgFrom || "#1a2f4a"} 0%, ${bgVia || "#0d1a2b"} 50%, ${bgTo || "#0a1520"} 100%)`,
          }}
        >
          {thumbnailPath ? (
            <img
              src={thumbnailPath}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 pointer-events-none"
            />
          ) : null}

          {/* Overlay gradient for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/40 pointer-events-none" />

          {/* Header Top Row: Category badge & Submission Status Badge */}
          <div className="relative z-10 flex items-center justify-between gap-2">
            <span className="bg-black/75 backdrop-blur-xs text-white text-[12px] font-medium rounded-full px-2.5 py-1.5 leading-none">
              {category}
            </span>
            <SubmissionStatusBadge challenge={challenge} />
          </div>

          {/* Header Bottom Row: Participation Badge (Individu / Tim) */}
          <div className="relative z-10 flex items-center">
            {participationType === "team" ? (
              <span className="inline-flex items-center gap-1.5 text-white text-[11px] font-semibold bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-full border border-white/20">
                <Users size={12} />
                Tim: {teamName || "Tim Anda"}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-white text-[11px] font-semibold bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-full border border-white/20">
                <User size={12} />
                Individu
              </span>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="px-4 pt-3.5 flex-1 flex flex-col justify-between">
          <div>
            {/* Company row */}
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-[28px] h-[28px] rounded-full bg-gray-100 flex items-center justify-center text-[11px] font-semibold text-gray-700 flex-shrink-0 select-none border border-gray-200">
                {companyInitials}
              </div>
              <span className="text-[13px] font-semibold text-gray-700 truncate">{company}</span>
              {verified && (
                <BadgeCheck size={15} className="text-gray-800 flex-shrink-0" strokeWidth={1.8} />
              )}
            </div>

            {/* Title */}
            <h3 className="text-[16px] font-bold text-gray-900 leading-[1.35] line-clamp-2 min-h-[44px] group-hover:text-primary-500 transition-colors">
              {title}
            </h3>

            {/* Description Excerpt */}
            {description && (
              <p className="text-[13px] text-gray-500 line-clamp-2 mt-2 leading-[1.45]">
                {description}
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="mt-4 pt-3.5 border-t border-[#E7E8EA] flex items-center justify-between gap-3 mb-3">
            <div>
              <p className="text-[11px] text-gray-500 leading-tight">Total Hadiah</p>
              <p className="text-[15px] font-bold text-primary-500 leading-tight tracking-tight mt-0.5">
                {reward}
              </p>
            </div>
            <div
              className={[
                "flex items-center gap-1.5 border rounded-full px-3 py-1.5 text-[12px] font-semibold flex-shrink-0",
                isOverdue
                  ? "border-primary-300 bg-primary-50 text-primary-600"
                  : "border-[#8B8D90] text-gray-700",
              ].join(" ")}
            >
              <Clock size={13} strokeWidth={1.8} className={isOverdue ? "text-primary-500" : "text-gray-600"} />
              {formattedDeadline}
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
