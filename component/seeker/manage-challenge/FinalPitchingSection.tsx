"use client";

import { useState } from "react";
import { Inbox } from "lucide-react";
import {
  SeekerLifecycleStage,
  PITCHING_CRITERIA,
  PitchingSubmission,
} from "@/lib/data/seekerChallengeState";
import SubmissionRow from "./SubmissionRow";
import StageLockOverlay from "./StageLockOverlay";

interface FinalPitchingSectionProps {
  stage: SeekerLifecycleStage;
  submissions: PitchingSubmission[];
  onUpdateScores: (id: string, scores: Record<string, number>) => void;
}

export default function FinalPitchingSection({
  stage,
  submissions,
  onUpdateScores,
}: FinalPitchingSectionProps) {
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  const handleToggleRow = (id: string) => {
    setExpandedRowId((prev) => (prev === id ? null : id));
  };

  // Conditions
  const isEmptyState = stage === "CHALLENGE_DIBUKA" || stage === "PENJURIAN_AHLI";
  const isLocked = stage === "PENGUMUMAN_PEMENANG";

  return (
    <section className="flex flex-col gap-4">
      {/* ── Standardized Header ───────────────────────────────── */}
      <div className="flex justify-between items-start gap-4">
        <div className="flex flex-col">
          <h3 className="text-base font-bold text-white leading-snug">
            Pitching Final{" "}
            <span className="text-[#A4A4A4] font-normal text-xs sm:text-sm">
              (01 Okt 2026 - 15 Okt 2026)
            </span>
          </h3>
          <p className="text-xs text-[#737373] mt-1 max-w-[680px] leading-relaxed">
            Sesi presentasi langsung para finalis. Evaluasi kesiapan implementasi, kelayakan biaya, serta kejelasan model solusi.
          </p>
        </div>

        {/* Badge Pill */}
        <div className="h-[32px] px-3.5 rounded-full border border-[#E30000] text-white text-xs font-medium flex items-center shrink-0 bg-[rgba(227,0,0,0.06)] shadow-sm">
          {isEmptyState ? "Finalis: 0" : `Finalis: ${submissions.length}`}
        </div>
      </div>

      {/* ── Submissions Container or Empty State ───────────────── */}
      {isEmptyState ? (
        <div className="w-full h-[64px] bg-[#191919] border border-[#393939] rounded-[11px] px-4 flex items-center gap-2.5 text-[#737373] text-xs font-medium">
          <Inbox size={17} className="text-[#737373]" />
          <span>Belum ada data finalis untuk tahap Pitching Final.</span>
        </div>
      ) : (
        <div className="relative rounded-[12px] overflow-hidden">
          {/* Content behind (dimmed if locked) */}
          <div
            className={`flex flex-col gap-2.5 transition-all ${
              isLocked
                ? "opacity-20 pointer-events-none select-none blur-[1px]"
                : "opacity-100"
            }`}
          >
            {submissions.map((sub) => (
              <SubmissionRow
                key={sub.id}
                submission={sub}
                criteria={PITCHING_CRITERIA}
                stage={stage}
                sectionType="pitching"
                onSaveScores={onUpdateScores}
                isExpanded={expandedRowId === sub.id}
                onToggleExpand={() => handleToggleRow(sub.id)}
              />
            ))}
          </div>

          {/* Lock Overlay when finished */}
          {isLocked && (
            <StageLockOverlay
              title="Penilaian Tahap Pitching Final Telah Selesai!"
              description="Seluruh tahapan seleksi telah rampung dan pemenang resmi telah ditentukan pada tahap Pengumuman Pemenang."
            />
          )}
        </div>
      )}
    </section>
  );
}
