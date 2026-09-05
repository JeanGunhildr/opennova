"use client";

import { useState } from "react";
import {
  SeekerLifecycleStage,
  EXPERT_CRITERIA,
  ExpertSubmission,
} from "@/lib/data/seekerChallengeState";
import SubmissionRow from "./SubmissionRow";
import StageLockOverlay from "./StageLockOverlay";

interface ExpertJudgingSectionProps {
  stage: SeekerLifecycleStage;
  submissions: ExpertSubmission[];
  onUpdateScores: (id: string, scores: Record<string, number>) => void;
}

export default function ExpertJudgingSection({
  stage,
  submissions,
  onUpdateScores,
}: ExpertJudgingSectionProps) {
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  const handleToggleRow = (id: string) => {
    setExpandedRowId((prev) => (prev === id ? null : id));
  };

  const isLocked = stage === "PITCHING_FINAL" || stage === "PENGUMUMAN_PEMENANG";

  return (
    <section className="flex flex-col gap-4">
      {/* ── Standardized Header ───────────────────────────────── */}
      <div className="flex justify-between items-start gap-4">
        <div className="flex flex-col">
          <h3 className="text-base font-bold text-white leading-snug">
            Penjurian Ahli{" "}
            <span className="text-[#A4A4A4] font-normal text-xs sm:text-sm">
              (29 Agu 2026 - 30 Sep 2026)
            </span>
          </h3>
          <p className="text-xs text-[#737373] mt-1 max-w-[680px] leading-relaxed">
            Evaluasi dokumen dan materi inovasi secara mendalam berdasarkan Kelayakan Teknis, Inovasi, dan Dampak Solusi.
          </p>
        </div>

        {/* Badge Pill */}
        <div className="h-[32px] px-3.5 rounded-full border border-[#E30000] text-white text-xs font-medium flex items-center shrink-0 bg-[rgba(227,0,0,0.06)] shadow-sm">
          Submission Masuk: {submissions.length}
        </div>
      </div>

      {/* ── Submissions Container ─────────────────────────────── */}
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
              criteria={EXPERT_CRITERIA}
              stage={stage}
              sectionType="expert"
              onSaveScores={onUpdateScores}
              isExpanded={expandedRowId === sub.id}
              onToggleExpand={() => handleToggleRow(sub.id)}
            />
          ))}
        </div>

        {/* Lock Overlay when finished */}
        {isLocked && (
          <StageLockOverlay
            title="Penilaian Tahap Penjurian Ahli Telah Selesai!"
            description="Proses penilaian telah dilanjutkan ke tahap Pitching Final. Submission yang lolos sebagai finalis kini tersedia pada tahap berikutnya sesuai linimasa Challenge."
          />
        )}
      </div>
    </section>
  );
}
