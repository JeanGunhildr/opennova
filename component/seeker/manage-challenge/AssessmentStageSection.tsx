"use client";

import { useState } from "react";
import {
  Trophy,
  AlertCircle,
  ExternalLink,
  Copy,
  Check,
  ChevronDown,
} from "lucide-react";
import {
  SeekerLifecycleStage,
  EXPERT_CRITERIA,
  PITCHING_CRITERIA,
  ExpertSubmission,
  PitchingSubmission,
  WinnerData,
} from "@/lib/data/seekerChallengeState";
import SubmissionRow from "./SubmissionRow";
import ScoreDropdown from "./ScoreDropdown";

interface AssessmentStageSectionProps {
  stage: SeekerLifecycleStage;
  activeSection: "expert" | "pitching" | "winner";
  expertSubmissions: ExpertSubmission[];
  pitchingSubmissions: PitchingSubmission[];
  winnerData: WinnerData;
  onUpdateExpertScores: (id: string, scores: Record<string, number>) => void;
  onUpdatePitchingScores: (id: string, scores: Record<string, number>) => void;
}

export default function AssessmentStageSection({
  stage,
  activeSection,
  expertSubmissions,
  pitchingSubmissions,
  winnerData,
  onUpdateExpertScores,
  onUpdatePitchingScores,
}: AssessmentStageSectionProps) {
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [isWinnerExpertOpen, setIsWinnerExpertOpen] = useState(false);
  const [isWinnerPitchingOpen, setIsWinnerPitchingOpen] = useState(false);
  const [copiedWinnerEmail, setCopiedWinnerEmail] = useState(false);

  const handleToggleRow = (id: string) => {
    setExpandedRowId((prev) => (prev === id ? null : id));
  };

  const handleCopyWinnerEmail = () => {
    if (!winnerData.email) return;
    navigator.clipboard.writeText(winnerData.email);
    setCopiedWinnerEmail(true);
    setTimeout(() => setCopiedWinnerEmail(false), 2000);
  };

  // ─────────────────────────────────────────────────────────
  // SECTION 1: PENJURIAN AHLI
  // ─────────────────────────────────────────────────────────
  if (activeSection === "expert") {
    const isLockedOverlay = stage === "PITCHING_FINAL" || stage === "PENGUMUMAN_PEMENANG";

    return (
      <div className="flex flex-col gap-3.5 relative">
        {/* Section Header Info */}
        <div className="flex flex-col gap-1 pb-1">
          <div className="flex items-center justify-between">
            <h4 className="text-[15px] font-bold text-white">
              Penjurian Ahli <span className="text-[#A4A4A4] font-normal text-xs">(60% Bobot)</span>
            </h4>
            <span className="text-xs font-semibold text-white">
              Batas Waktu: 24 Nov 2026
            </span>
          </div>
          <p className="text-[11px] leading-relaxed text-[#737373]">
            Evaluasi seluruh dokumen inovasi yang terkumpul berdasarkan Kelayakan Teknis, Inovasi, dan Dampak.
          </p>
        </div>

        {/* Locked Notice Banner if passed stage */}
        {isLockedOverlay && (
          <div className="bg-[rgba(23,23,23,0.85)] border border-[#393939] rounded-[10px] p-3 flex items-center gap-2.5 text-xs text-[#A4A4A4]">
            <AlertCircle size={15} className="text-[#E30000] shrink-0" />
            <span>
              Tahap Penjurian Ahli telah selesai dan dikunci. Data penilaian ditampilkan dalam mode read-only.
            </span>
          </div>
        )}

        {/* Submissions List */}
        <div className="flex flex-col gap-2.5">
          {expertSubmissions.map((sub) => (
            <SubmissionRow
              key={sub.id}
              submission={sub}
              criteria={EXPERT_CRITERIA}
              stage={stage}
              sectionType="expert"
              onSaveScores={onUpdateExpertScores}
              isExpanded={expandedRowId === sub.id}
              onToggleExpand={() => handleToggleRow(sub.id)}
            />
          ))}
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────
  // SECTION 2: PITCHING FINAL
  // ─────────────────────────────────────────────────────────
  if (activeSection === "pitching") {
    // Stage A & B: Pitching has no data yet
    const isEmpty = stage === "CHALLENGE_DIBUKA" || stage === "PENJURIAN_AHLI";

    if (isEmpty) {
      return (
        <div className="h-[60px] bg-[#191919] border border-[#393939] rounded-[10px] px-4 flex items-center text-[#737373] text-xs font-medium">
          Belum ada data
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-3.5">
        {/* Section Header Info */}
        <div className="flex flex-col gap-1 pb-1">
          <div className="flex items-center justify-between">
            <h4 className="text-[15px] font-bold text-white">
              Pitching Final <span className="text-[#A4A4A4] font-normal text-xs">(40% Bobot)</span>
            </h4>
            <span className="text-xs font-semibold text-white">
              Batas Waktu: 05 Des 2026
            </span>
          </div>
          <p className="text-[11px] leading-relaxed text-[#737373]">
            Sesi presentasi langsung bersama para finalis terpilih. Nilai kesiapan implementasi dan kejelasan model bisnis.
          </p>
        </div>

        {/* Submissions List */}
        <div className="flex flex-col gap-2.5">
          {pitchingSubmissions.map((sub) => (
            <SubmissionRow
              key={sub.id}
              submission={sub}
              criteria={PITCHING_CRITERIA}
              stage={stage}
              sectionType="pitching"
              onSaveScores={onUpdatePitchingScores}
              isExpanded={expandedRowId === sub.id}
              onToggleExpand={() => handleToggleRow(sub.id)}
            />
          ))}
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────
  // SECTION 3: PEMENANG CHALLENGE
  // ─────────────────────────────────────────────────────────
  if (activeSection === "winner") {
    // Stage A, B, C: Winner not determined yet
    if (stage !== "PENGUMUMAN_PEMENANG") {
      return (
        <div className="h-[60px] bg-[#191919] border border-[#393939] rounded-[10px] px-4 flex items-center text-[#737373] text-xs font-medium">
          Belum ada data
        </div>
      );
    }

    // Stage D: Exactly ONE Winner Card
    return (
      <div className="flex flex-col gap-4">
        {/* Winner Celebration Banner */}
        <div className="h-[42px] bg-[rgba(240,185,11,0.08)] border border-[rgba(240,185,11,0.38)] rounded-[10px] px-3.5 flex items-center gap-2.5 text-[#E8D16A] text-xs font-medium">
          <Trophy size={16} className="text-[#F0B90B] shrink-0" />
          <span>
            Pemenang resmi telah ditentukan melalui akumulasi nilai Penjurian Ahli (60%) dan Pitching Final (40%).
          </span>
        </div>

        {/* Single Winner Card */}
        <div className="w-full bg-[#2A2829] border border-[#A4A4A4] rounded-[11px] p-[10px_14px] min-h-[62px] flex flex-col md:grid md:grid-cols-[38px_minmax(180px,1fr)_auto] gap-3 items-center">
          {/* Avatar & Gold Cue */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative">
              <div className="w-[38px] h-[38px] rounded-full bg-[#393939] border border-[#5A5A5A] text-white flex items-center justify-center text-xs font-bold">
                {winnerData.avatar}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#171717] flex items-center justify-center">
                <Trophy size={10} className="text-[#F0B90B]" />
              </div>
            </div>

            <div className="md:hidden flex flex-col min-w-0">
              <span className="text-[13px] font-bold text-white truncate">
                {winnerData.solverName}
              </span>
              <span className="text-[10px] text-[#737373]">
                {winnerData.registrationType}
              </span>
            </div>
          </div>

          {/* Desktop Identity */}
          <div className="hidden md:flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-bold text-white truncate">
                {winnerData.solverName}
              </span>
              <span className="text-[10px] font-semibold text-[#F0B90B] bg-[rgba(240,185,11,0.12)] px-2 py-0.5 rounded-full border border-[rgba(240,185,11,0.3)]">
                Pemenang Utama
              </span>
            </div>
            <span className="text-[10px] text-[#737373]">
              {winnerData.registrationType}
            </span>
          </div>

          {/* Action Controls */}
          <div className="flex items-center flex-wrap md:flex-nowrap justify-start md:justify-end gap-2.5 w-full md:w-auto">
            {/* Email copy */}
            <button
              type="button"
              onClick={handleCopyWinnerEmail}
              className="h-[32px] px-3 rounded-full bg-[#1F1F1F] border border-[#4A4A4A] text-white text-[11px] font-medium flex items-center gap-1.5 hover:border-gray-400 transition-colors"
            >
              {copiedWinnerEmail ? (
                <>
                  <Check size={12} className="text-[#39D96F]" />
                  <span className="text-[#39D96F]">Tersalin!</span>
                </>
              ) : (
                <>
                  <span className="truncate max-w-[140px] sm:max-w-[180px]">
                    {winnerData.email}
                  </span>
                  <Copy size={11} className="text-[#A4A4A4]" />
                </>
              )}
            </button>

            {/* Drive Link */}
            <a
              href={winnerData.driveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="h-[32px] px-3 rounded-full bg-[#1F1F1F] border border-[#4A4A4A] text-white text-[11px] font-medium hover:bg-[#323131] flex items-center gap-1.5 transition-colors"
            >
              <span>Buka link submission</span>
              <ExternalLink size={12} className="text-[#A4A4A4]" />
            </a>

            {/* Final Score Badge */}
            <div className="h-[34px] px-3.5 rounded-full bg-white text-[#111111] text-[12px] font-bold flex items-center gap-1 shadow-sm">
              <span className="text-[10px] text-gray-500 font-semibold uppercase">Nilai Akhir:</span>
              <span className="text-sm font-extrabold text-[#111111]">{winnerData.finalScore}</span>
            </div>
          </div>
        </div>

        {/* Detailed Breakdown Panels for Winner */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
          {/* Expert Review Summary */}
          <div className="bg-[#191919] border border-[#393939] rounded-[11px] p-3.5 flex flex-col gap-2">
            <div className="flex items-center justify-between pb-1.5 border-b border-[#303030]">
              <span className="text-xs font-bold text-white">Nilai Penjurian Ahli</span>
              <button
                type="button"
                onClick={() => setIsWinnerExpertOpen((prev) => !prev)}
                className="text-[11px] text-[#A4A4A4] hover:text-white flex items-center gap-1"
              >
                <span>{isWinnerExpertOpen ? "Tutup" : "Lihat Rincian"}</span>
                <ChevronDown size={12} className={`transition-transform ${isWinnerExpertOpen ? "rotate-180" : ""}`} />
              </button>
            </div>
            {isWinnerExpertOpen && (
              <ScoreDropdown
                criteria={EXPERT_CRITERIA}
                initialScores={winnerData.expertScores}
                readOnly
              />
            )}
          </div>

          {/* Pitching Final Summary */}
          <div className="bg-[#191919] border border-[#393939] rounded-[11px] p-3.5 flex flex-col gap-2">
            <div className="flex items-center justify-between pb-1.5 border-b border-[#303030]">
              <span className="text-xs font-bold text-white">Nilai Pitching Final</span>
              <button
                type="button"
                onClick={() => setIsWinnerPitchingOpen((prev) => !prev)}
                className="text-[11px] text-[#A4A4A4] hover:text-white flex items-center gap-1"
              >
                <span>{isWinnerPitchingOpen ? "Tutup" : "Lihat Rincian"}</span>
                <ChevronDown size={12} className={`transition-transform ${isWinnerPitchingOpen ? "rotate-180" : ""}`} />
              </button>
            </div>
            {isWinnerPitchingOpen && (
              <ScoreDropdown
                criteria={PITCHING_CRITERIA}
                initialScores={winnerData.pitchingScores}
                readOnly
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
