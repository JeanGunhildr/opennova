"use client";

import { useState } from "react";
import { ExternalLink, Copy, Check, ChevronDown } from "lucide-react";
import type { CriterionDefinition } from "@/lib/data/seekerChallengeState";
import ScoreDropdown from "./ScoreDropdown";

export interface SubmissionRowData {
  id: string;
  solverName: string;
  avatar: string;
  registrationType: "Individu" | "Tim";
  driveUrl: string;
  email?: string;
  status?: "notRated" | "rated";
  isAssessed?: boolean;
  scores: Record<string, number>;
}

interface SubmissionRowProps {
  submission: SubmissionRowData;
  criteria: CriterionDefinition[];
  stage: "CHALLENGE_DIBUKA" | "PENJURIAN_AHLI" | "PITCHING_FINAL" | "PENGUMUMAN_PEMENANG";
  sectionType: "expert" | "pitching" | "winner";
  onSaveScores: (id: string, scores: Record<string, number>) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export default function SubmissionRow({
  submission,
  criteria,
  stage,
  sectionType,
  onSaveScores,
  isExpanded,
  onToggleExpand,
}: SubmissionRowProps) {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!submission.email) return;
    navigator.clipboard.writeText(submission.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  // Determine scoring trigger mode: editable | disabled | readOnly
  let triggerMode: "editable" | "disabled" | "readOnly" = "editable";
  if (stage === "CHALLENGE_DIBUKA") {
    triggerMode = "disabled";
  } else if (stage === "PENJURIAN_AHLI") {
    triggerMode = sectionType === "expert" ? "editable" : "disabled";
  } else if (stage === "PITCHING_FINAL") {
    triggerMode = sectionType === "pitching" ? "editable" : "disabled";
  } else if (stage === "PENGUMUMAN_PEMENANG") {
    triggerMode = "readOnly";
  }

  // Determine row style when locked/dimmed
  const isDimmed =
    (stage === "PITCHING_FINAL" && sectionType === "expert") ||
    (stage === "CHALLENGE_DIBUKA" && sectionType === "expert");

  const isWinnerCard = sectionType === "winner";

  return (
    <div className="flex flex-col">
      <div
        className={`w-full min-h-[58px] rounded-[11px] p-[9px_12px] flex flex-col md:grid md:grid-cols-[38px_minmax(180px,1fr)_auto] gap-2.5 items-center transition-colors ${
          isWinnerCard
            ? "bg-[#2A2829] border border-[#A4A4A4] shadow-sm"
            : "bg-[#191919] border border-[#393939] hover:border-[#4A4A4A]"
        } ${isDimmed ? "opacity-65" : "opacity-100"}`}
      >
        {/* 1. Identity: Avatar */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div
            className={`w-[38px] h-[38px] rounded-full border flex items-center justify-center text-xs font-bold shrink-0 ${
              isWinnerCard
                ? "bg-[#393939] border-[#5A5A5A] text-[#F0B90B]"
                : "bg-[#2A2829] border-[#505050] text-white"
            }`}
          >
            {submission.avatar}
          </div>

          {/* Mobile view only name */}
          <div className="md:hidden flex flex-col min-w-0">
            <span className="text-[13px] font-bold text-white truncate">
              {submission.solverName}
            </span>
            <span className="text-[10px] text-[#737373]">
              {submission.registrationType}
            </span>
          </div>
        </div>

        {/* 2. Identity: Name & Registration Type (Desktop) */}
        <div className="hidden md:flex flex-col min-w-0">
          <span className="text-[13px] font-bold text-white truncate">
            {submission.solverName}
          </span>
          <span className="text-[10px] text-[#737373]">
            {submission.registrationType}
          </span>
        </div>

        {/* 3. Action Controls (Right Aligned) */}
        <div className="flex items-center flex-wrap md:flex-nowrap justify-start md:justify-end gap-2 w-full md:w-auto">
          {/* Email control (for pitching / winner) */}
          {submission.email && (
            <button
              type="button"
              onClick={handleCopyEmail}
              title="Klik untuk menyalin email"
              className="h-[32px] px-3 rounded-full bg-[#2A2829] border border-[#4A4A4A] text-white text-[11px] font-medium flex items-center gap-1.5 hover:border-gray-400 transition-colors"
            >
              {copiedEmail ? (
                <>
                  <Check size={12} className="text-[#39D96F]" />
                  <span className="text-[#39D96F]">Tersalin!</span>
                </>
              ) : (
                <>
                  <span className="truncate max-w-[130px] sm:max-w-[170px]">
                    {submission.email}
                  </span>
                  <Copy size={11} className="text-[#A4A4A4] shrink-0" />
                </>
              )}
            </button>
          )}

          {/* Drive link button */}
          <a
            href={submission.driveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="h-[32px] px-3 rounded-full bg-[#2A2829] border border-[#4A4A4A] text-white text-[11px] font-medium hover:bg-[#323131] flex items-center gap-1.5 transition-colors shrink-0"
          >
            <span>{sectionType === "pitching" ? "Link submission" : "Buka link submission"}</span>
            <ExternalLink size={12} className="text-[#A4A4A4]" />
          </a>

          {/* Status Pill (Penjurian Ahli) */}
          {sectionType === "expert" && stage !== "CHALLENGE_DIBUKA" && (
            <span
              className={`h-[32px] px-3 rounded-full text-[11px] font-semibold inline-flex items-center shrink-0 ${
                submission.status === "rated"
                  ? "bg-[rgba(57,217,111,0.1)] border border-[rgba(57,217,111,0.26)] text-[#39D96F]"
                  : "bg-[rgba(216,200,58,0.1)] border border-[rgba(216,200,58,0.3)] text-[#D8C83A]"
              }`}
            >
              {submission.status === "rated" ? "Sudah dinilai" : "Belum dinilai"}
            </span>
          )}

          {/* Assessment Indicator (Pitching Final) */}
          {sectionType === "pitching" && stage !== "CHALLENGE_DIBUKA" && (
            <span
              className={`w-[28px] h-[28px] rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                submission.isAssessed
                  ? "bg-[rgba(57,217,111,0.08)] border border-[rgba(57,217,111,0.25)] text-[#39D96F]"
                  : "bg-[rgba(216,200,58,0.08)] border border-[rgba(216,200,58,0.32)] text-[#D8C83A]"
              }`}
            >
              {submission.isAssessed ? "✓" : "✕"}
            </span>
          )}

          {/* Score Trigger Button */}
          {triggerMode === "disabled" && (
            <button
              type="button"
              disabled
              className="h-[32px] min-w-[76px] px-3.5 rounded-full bg-[#393939] text-[#737373] border border-[#4A4A4A] text-xs font-semibold flex items-center justify-center gap-1 cursor-not-allowed shrink-0"
            >
              <span>Nilai</span>
              <ChevronDown size={12} />
            </button>
          )}

          {triggerMode === "readOnly" && (
            <button
              type="button"
              onClick={onToggleExpand}
              className={`h-[32px] min-w-[76px] px-3.5 rounded-full text-xs font-semibold flex items-center justify-center gap-1 transition-colors shrink-0 shadow-sm ${
                isExpanded
                  ? "bg-white text-black hover:bg-gray-100"
                  : "bg-[#2A2829] border border-[#4A4A4A] text-white hover:bg-[#323131]"
              }`}
            >
              <span>Nilai</span>
              <ChevronDown
                size={12}
                className={`transition-transform duration-150 ${isExpanded ? "rotate-180" : ""}`}
              />
            </button>
          )}

          {triggerMode === "editable" && (
            <button
              type="button"
              onClick={onToggleExpand}
              className={`h-[32px] min-w-[76px] px-3.5 rounded-full text-xs font-semibold flex items-center justify-center gap-1 transition-all shrink-0 shadow-sm active:scale-[0.98] ${
                isExpanded
                  ? "bg-white text-black hover:bg-gray-200"
                  : "bg-white text-[#111111] hover:bg-gray-200"
              }`}
            >
              <span>Nilai</span>
              <ChevronDown
                size={12}
                className={`transition-transform duration-150 ${isExpanded ? "rotate-180" : ""}`}
              />
            </button>
          )}
        </div>
      </div>

      {/* Expanded Scoring Dropdown */}
      {isExpanded && triggerMode !== "disabled" && (
        <ScoreDropdown
          criteria={criteria}
          initialScores={submission.scores}
          onSave={(scores) => {
            onSaveScores(submission.id, scores);
            onToggleExpand();
          }}
          onClose={onToggleExpand}
          readOnly={triggerMode === "readOnly"}
        />
      )}
    </div>
  );
}
