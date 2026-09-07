"use client";

import { useState } from "react";
import {
  Trophy,
  ExternalLink,
  ChevronDown,
  Inbox,
  Medal,
  Award,
} from "lucide-react";
import type { SeekerLifecycleStage } from "./ManageChallengeClient";
import type { ManageChallengeData, ManageChallengeEntry } from "@/lib/actions/seeker-manage";
import type { CriterionDefinition } from "./ScoreDropdown";
import ScoreDropdown from "./ScoreDropdown";

interface WinnerAnnouncementSectionProps {
  data: ManageChallengeData;
  stage: SeekerLifecycleStage;
}

const RANK_CONFIGS: Record<number, { title: string; badgeStyle: string; icon: any }> = {
  1: {
    title: "Juara 1",
    badgeStyle: "text-[#F0B90B] bg-[rgba(240,185,11,0.12)] border-[rgba(240,185,11,0.3)]",
    icon: <Trophy size={14} className="text-[#F0B90B]" />,
  },
  2: {
    title: "Juara 2",
    badgeStyle: "text-[#94A3B8] bg-[rgba(148,163,184,0.12)] border-[rgba(148,163,184,0.3)]",
    icon: <Medal size={14} className="text-[#94A3B8]" />,
  },
  3: {
    title: "Juara 3",
    badgeStyle: "text-[#D97706] bg-[rgba(217,119,6,0.12)] border-[rgba(217,119,6,0.3)]",
    icon: <Award size={14} className="text-[#D97706]" />,
  },
};

function WinnerRow({
  entry,
  data,
  expertCriteria,
  pitchingCriteria,
}: {
  entry: ManageChallengeEntry;
  data: ManageChallengeData;
  expertCriteria: CriterionDefinition[];
  pitchingCriteria: CriterionDefinition[];
}) {
  const [isExpertOpen, setIsExpertOpen] = useState(false);
  const [isPitchOpen, setIsPitchOpen] = useState(false);

  const rank = entry.winnerRank ?? 1;
  const config = RANK_CONFIGS[rank] || RANK_CONFIGS[1];

  const initials = entry.solverName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "??";

  return (
    <div className="flex flex-col gap-2.5 bg-[#2A2829] border border-[#444] rounded-[11px] p-3 shadow-md">
      <div className="w-full flex flex-col md:grid md:grid-cols-[38px_minmax(180px,1fr)_auto] gap-3 items-center">
        {/* Avatar */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative shrink-0">
            <div className="w-[38px] h-[38px] rounded-full bg-[#393939] border border-[#5A5A5A] text-white flex items-center justify-center text-xs font-bold">
              {initials}
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#171717] flex items-center justify-center">
              {config.icon}
            </div>
          </div>

          <div className="md:hidden flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white truncate">{entry.solverName}</span>
              <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full border ${config.badgeStyle}`}>
                {config.title}
              </span>
            </div>
            <span className="text-[10px] text-[#737373]">
              {entry.participationType === "team" ? "Tim" : "Individu"}
            </span>
          </div>
        </div>

        {/* Name & Rank */}
        <div className="hidden md:flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white truncate">{entry.solverName}</span>
            <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full border ${config.badgeStyle}`}>
              {config.title}
            </span>
          </div>
          <span className="text-[10px] text-[#737373]">
            {entry.participationType === "team" ? "Tim" : "Individu"}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          {entry.driveUrl && (
            <a
              href={entry.driveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="h-[32px] px-3 rounded-full bg-[#1F1F1F] border border-[#4A4A4A] text-white text-[11px] font-medium hover:bg-[#323131] flex items-center gap-1.5 transition-colors"
            >
              <span>Link submission</span>
              <ExternalLink size={12} className="text-[#A4A4A4]" />
            </a>
          )}
        </div>
      </div>

      {/* Accordion scores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1">
        {expertCriteria.length > 0 && (
          <div className="bg-[#191919] border border-[#393939] rounded-[9px] p-2.5 flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-white">
                Penjurian Ahli ({data.expertWeight}%)
              </span>
              <button
                type="button"
                onClick={() => setIsExpertOpen((p) => !p)}
                className="text-[10px] text-[#A4A4A4] hover:text-white flex items-center gap-1"
              >
                <span>{isExpertOpen ? "Tutup" : "Lihat Nilai"}</span>
                <ChevronDown size={11} className={isExpertOpen ? "rotate-180" : ""} />
              </button>
            </div>
            {isExpertOpen && (
              <ScoreDropdown
                entryId={entry.id}
                challengeId={data.id}
                criteria={expertCriteria}
                initialScores={entry.scores}
                readOnly
              />
            )}
          </div>
        )}

        {pitchingCriteria.length > 0 && (
          <div className="bg-[#191919] border border-[#393939] rounded-[9px] p-2.5 flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-white">
                Pitching Final ({data.pitchWeight}%)
              </span>
              <button
                type="button"
                onClick={() => setIsPitchOpen((p) => !p)}
                className="text-[10px] text-[#A4A4A4] hover:text-white flex items-center gap-1"
              >
                <span>{isPitchOpen ? "Tutup" : "Lihat Nilai"}</span>
                <ChevronDown size={11} className={isPitchOpen ? "rotate-180" : ""} />
              </button>
            </div>
            {isPitchOpen && (
              <ScoreDropdown
                entryId={entry.id}
                challengeId={data.id}
                criteria={pitchingCriteria}
                initialScores={entry.scores}
                readOnly
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function WinnerAnnouncementSection({
  data,
  stage,
}: WinnerAnnouncementSectionProps) {
  const isWinnerRevealed = stage === "PENGUMUMAN_PEMENANG" || data.status === "completed";
  const winners = data.winnerEntries ?? [];

  const expertCriteria: CriterionDefinition[] = data.expertCriteria.map((c) => ({
    id: c.id,
    name: c.name,
    description: c.description,
  }));

  const pitchingCriteria: CriterionDefinition[] = data.pitchingCriteria.map((c) => ({
    id: c.id,
    name: c.name,
    description: c.description,
  }));

  return (
    <section className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex justify-between items-start gap-4">
        <div className="flex flex-col">
          <h3 className="text-base font-bold text-white flex items-center gap-2 leading-snug">
            <span>Pemenang Challenge</span>
            <span className="text-[#F0B90B] text-lg">🏆</span>
          </h3>
          <p className="text-xs text-[#737373] mt-1 max-w-[680px] leading-relaxed">
            Pemenang challenge resmi diumumkan di bawah ini berdasarkan kalkulasi nilai akhir (Penjurian Ahli + Pitching Final).
          </p>
        </div>

        <div className="h-[32px] px-3.5 rounded-full border border-[#E30000] text-white text-xs font-medium flex items-center shrink-0 bg-[rgba(227,0,0,0.06)] shadow-sm">
          {isWinnerRevealed && winners.length > 0 ? `Pemenang: ${winners.length}` : "Pemenang: 0"}
        </div>
      </div>

      {/* Content */}
      {!isWinnerRevealed || winners.length === 0 ? (
        <div className="w-full h-[64px] bg-[#191919] border border-[#393939] rounded-[11px] px-4 flex items-center gap-2.5 text-[#737373] text-xs font-medium">
          <Inbox size={17} className="text-[#737373]" />
          <span>Belum ada data pemenang untuk challenge ini.</span>
        </div>
      ) : (
        <div className="flex flex-col gap-3.5 animate-in fade-in duration-200">
          {winners.map((w) => (
            <WinnerRow
              key={w.id}
              entry={w}
              data={data}
              expertCriteria={expertCriteria}
              pitchingCriteria={pitchingCriteria}
            />
          ))}
        </div>
      )}
    </section>
  );
}
