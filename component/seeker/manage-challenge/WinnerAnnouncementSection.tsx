"use client";

import { useState } from "react";
import {
  Trophy,
  Copy,
  Check,
  ExternalLink,
  ChevronDown,
  Inbox,
} from "lucide-react";
import {
  SeekerLifecycleStage,
  WinnerData,
  EXPERT_CRITERIA,
  PITCHING_CRITERIA,
} from "@/lib/data/seekerChallengeState";
import ScoreDropdown from "./ScoreDropdown";

interface WinnerAnnouncementSectionProps {
  stage: SeekerLifecycleStage;
  winnerData: WinnerData;
}

export default function WinnerAnnouncementSection({
  stage,
  winnerData,
}: WinnerAnnouncementSectionProps) {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isExpertDropdownOpen, setIsExpertDropdownOpen] = useState(false);
  const [isPitchingDropdownOpen, setIsPitchingDropdownOpen] = useState(false);

  const handleCopyEmail = () => {
    if (!winnerData.email) return;
    navigator.clipboard.writeText(winnerData.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const isWinnerRevealed = stage === "PENGUMUMAN_PEMENANG";

  return (
    <section className="flex flex-col gap-4">
      {/* ── Standardized Header ───────────────────────────────── */}
      <div className="flex justify-between items-start gap-4">
        <div className="flex flex-col">
          <h3 className="text-base font-bold text-white flex items-center gap-2 leading-snug">
            <span>Pemenang Challenge</span>
            <span className="text-[#F0B90B] text-lg">🏆</span>
          </h3>
          <p className="text-xs text-[#737373] mt-1 max-w-[680px] leading-relaxed">
            Pemenang challenge akan ditampilkan disini setelah seluruh tahap penilaian selesai. Hadiah beserta sertifikat penghargaan otomatis terkirim ke Solver setelah tahap Pengumuman Pemenang.
          </p>
        </div>

        {/* Badge Pill */}
        <div className="h-[32px] px-3.5 rounded-full border border-[#E30000] text-white text-xs font-medium flex items-center shrink-0 bg-[rgba(227,0,0,0.06)] shadow-sm">
          {isWinnerRevealed ? "Pemenang: 1" : "Pemenang: 0"}
        </div>
      </div>

      {/* ── Content: Empty State vs Single Winner Card ─────────── */}
      {!isWinnerRevealed ? (
        <div className="w-full h-[64px] bg-[#191919] border border-[#393939] rounded-[11px] px-4 flex items-center gap-2.5 text-[#737373] text-xs font-medium">
          <Inbox size={17} className="text-[#737373]" />
          <span>Belum ada data pemenang untuk challenge ini.</span>
        </div>
      ) : (
        <div className="flex flex-col gap-3.5 animate-in fade-in duration-200">
          {/* Winner Row Card */}
          <div className="w-full bg-[#2A2829] border border-[#A4A4A4] rounded-[11px] p-3 min-h-[62px] flex flex-col md:grid md:grid-cols-[38px_minmax(180px,1fr)_auto] gap-3 items-center shadow-lg">
            {/* Left: Avatar with Gold Badge */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative shrink-0">
                <div className="w-[38px] h-[38px] rounded-full bg-[#393939] border border-[#5A5A5A] text-white flex items-center justify-center text-xs font-bold">
                  {winnerData.avatar}
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#171717] flex items-center justify-center">
                  <Trophy size={10} className="text-[#F0B90B]" />
                </div>
              </div>

              {/* Mobile View Identity */}
              <div className="md:hidden flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white truncate">
                    {winnerData.solverName}
                  </span>
                  <span className="text-[9px] font-semibold text-[#F0B90B] bg-[rgba(240,185,11,0.12)] px-1.5 py-0.5 rounded-full border border-[rgba(240,185,11,0.3)]">
                    Pemenang Utama
                  </span>
                </div>
                <span className="text-[10px] text-[#737373]">
                  {winnerData.registrationType}
                </span>
              </div>
            </div>

            {/* Desktop View Identity */}
            <div className="hidden md:flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white truncate">
                  {winnerData.solverName}
                </span>
                <span className="text-[9px] font-semibold text-[#F0B90B] bg-[rgba(240,185,11,0.12)] px-2 py-0.5 rounded-full border border-[rgba(240,185,11,0.3)]">
                  Pemenang Utama
                </span>
              </div>
              <span className="text-[10px] text-[#737373]">
                {winnerData.registrationType}
              </span>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center flex-wrap md:flex-nowrap justify-start md:justify-end gap-2 w-full md:w-auto">
              {/* Copy Email Pill */}
              <button
                type="button"
                onClick={handleCopyEmail}
                title="Klik untuk menyalin email"
                className="h-[32px] px-3 rounded-full bg-[#1F1F1F] border border-[#4A4A4A] text-white text-[11px] font-medium flex items-center gap-1.5 hover:border-gray-400 transition-colors"
              >
                {copiedEmail ? (
                  <>
                    <Check size={12} className="text-[#39D96F]" />
                    <span className="text-[#39D96F]">Tersalin!</span>
                  </>
                ) : (
                  <>
                    <span className="truncate max-w-[130px] sm:max-w-[170px]">
                      {winnerData.email}
                    </span>
                    <Copy size={11} className="text-[#A4A4A4] shrink-0" />
                  </>
                )}
              </button>

              {/* Link Submission Button */}
              <a
                href={winnerData.driveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="h-[32px] px-3 rounded-full bg-[#1F1F1F] border border-[#4A4A4A] text-white text-[11px] font-medium hover:bg-[#323131] flex items-center gap-1.5 transition-colors"
              >
                <span>Link submission</span>
                <ExternalLink size={12} className="text-[#A4A4A4]" />
              </a>

              {/* Final Score Badge */}
              <div className="h-[32px] px-3.5 rounded-full bg-white text-[#111111] text-xs font-bold flex items-center gap-1.5 shadow-sm shrink-0">
                <span className="text-[10px] text-gray-500 font-semibold uppercase">
                  Nilai Akhir:
                </span>
                <span className="text-sm font-extrabold text-[#111111]">
                  {winnerData.finalScore}
                </span>
              </div>
            </div>
          </div>

          {/* Breakdown panels for Winner */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
            {/* Penjurian Ahli Breakdown */}
            <div className="bg-[#191919] border border-[#393939] rounded-[11px] p-3.5 flex flex-col gap-2">
              <div className="flex items-center justify-between pb-1.5 border-b border-[#303030]">
                <span className="text-xs font-bold text-white">
                  Rincian Penjurian Ahli (60%)
                </span>
                <button
                  type="button"
                  onClick={() => setIsExpertDropdownOpen((prev) => !prev)}
                  className="text-[11px] text-[#A4A4A4] hover:text-white flex items-center gap-1"
                >
                  <span>{isExpertDropdownOpen ? "Tutup" : "Lihat Nilai"}</span>
                  <ChevronDown
                    size={12}
                    className={`transition-transform duration-150 ${
                      isExpertDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>
              {isExpertDropdownOpen && (
                <ScoreDropdown
                  criteria={EXPERT_CRITERIA}
                  initialScores={winnerData.expertScores}
                  readOnly
                />
              )}
            </div>

            {/* Pitching Final Breakdown */}
            <div className="bg-[#191919] border border-[#393939] rounded-[11px] p-3.5 flex flex-col gap-2">
              <div className="flex items-center justify-between pb-1.5 border-b border-[#303030]">
                <span className="text-xs font-bold text-white">
                  Rincian Pitching Final (40%)
                </span>
                <button
                  type="button"
                  onClick={() => setIsPitchingDropdownOpen((prev) => !prev)}
                  className="text-[11px] text-[#A4A4A4] hover:text-white flex items-center gap-1"
                >
                  <span>{isPitchingDropdownOpen ? "Tutup" : "Lihat Nilai"}</span>
                  <ChevronDown
                    size={12}
                    className={`transition-transform duration-150 ${
                      isPitchingDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>
              {isPitchingDropdownOpen && (
                <ScoreDropdown
                  criteria={PITCHING_CRITERIA}
                  initialScores={winnerData.pitchingScores}
                  readOnly
                />
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
