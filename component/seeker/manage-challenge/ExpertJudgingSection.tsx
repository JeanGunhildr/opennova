"use client";

import { useState } from "react";
import type { SeekerLifecycleStage } from "./ManageChallengeClient";
import type { ManageChallengeData, ManageChallengeEntry } from "@/lib/actions/seeker-manage";
import type { CriterionDefinition } from "./ScoreDropdown";
import SubmissionRow, { type SubmissionRowData } from "./SubmissionRow";
import StageLockOverlay from "./StageLockOverlay";

function formatDateRange(timelines: ManageChallengeData["timelines"], title: string): string {
  const t = timelines.find((tl) => tl.title === title);
  if (!t) return "";
  const parts: string[] = [];
  if (t.startDate) parts.push(new Date(t.startDate).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }));
  if (t.endDate) parts.push(new Date(t.endDate).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }));
  return parts.length > 0 ? `(${parts.join(" - ")})` : "";
}

function buildSubmissionRowData(entry: ManageChallengeEntry, criteriaIds: string[]): SubmissionRowData {
  const initials = entry.solverName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "??";

  const allCriteriaScored = criteriaIds.length > 0 &&
    criteriaIds.every((id) => entry.scores[id] !== undefined);

  return {
    id: entry.id,
    solverName: entry.solverName,
    avatar: initials,
    registrationType: entry.participationType === "team" ? "Tim" : "Individu",
    driveUrl: entry.driveUrl,
    isRated: allCriteriaScored,
    scores: entry.scores,
  };
}

interface ExpertJudgingSectionProps {
  data: ManageChallengeData;
  stage: SeekerLifecycleStage;
}

export default function ExpertJudgingSection({ data, stage }: ExpertJudgingSectionProps) {
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  const handleToggleRow = (id: string) => {
    setExpandedRowId((prev) => (prev === id ? null : id));
  };

  const isLocked = stage === "PITCHING_FINAL" || stage === "PENGUMUMAN_PEMENANG";
  const dateRange = formatDateRange(data.timelines, "Penjurian Ahli");

  const criteria: CriterionDefinition[] = data.expertCriteria.map((c) => ({
    id: c.id,
    name: c.name,
    description: c.description,
  }));

  const criteriaIds = criteria.map((c) => c.id);
  const submissions = data.expertEntries.map((e) => buildSubmissionRowData(e, criteriaIds));

  return (
    <section className="flex flex-col gap-4">
      {/* ── Standardized Header ───────────────────────────────── */}
      <div className="flex justify-between items-start gap-4">
        <div className="flex flex-col">
          <h3 className="text-base font-bold text-white leading-snug">
            Penjurian Ahli{" "}
            {dateRange && (
              <span className="text-[#A4A4A4] font-normal text-xs sm:text-sm">
                {dateRange}
              </span>
            )}
          </h3>
          <p className="text-xs text-[#737373] mt-1 max-w-[680px] leading-relaxed">
            Evaluasi dokumen dan materi inovasi secara mendalam berdasarkan kriteria penilaian yang telah ditentukan.
          </p>
        </div>

        {/* Badge Pill */}
        <div className="h-[32px] px-3.5 rounded-full border border-[#E30000] text-white text-xs font-medium flex items-center shrink-0 bg-[rgba(227,0,0,0.06)] shadow-sm">
          Submission Masuk: {submissions.length}
        </div>
      </div>

      {/* ── Submissions Container ─────────────────────────────── */}
      <div className="relative rounded-[12px] overflow-hidden">
        <div
          className={`flex flex-col gap-2.5 transition-all ${
            isLocked ? "opacity-20 pointer-events-none select-none blur-[1px]" : "opacity-100"
          }`}
        >
          {submissions.length === 0 ? (
            <div className="w-full h-[64px] bg-[#191919] border border-[#393939] rounded-[11px] px-4 flex items-center gap-2.5 text-[#737373] text-xs font-medium">
              Belum ada submission yang masuk untuk tahap ini.
            </div>
          ) : (
            submissions.map((sub) => (
              <SubmissionRow
                key={sub.id}
                submission={sub}
                challengeId={data.id}
                criteria={criteria}
                stage={stage}
                sectionType="expert"
                isExpanded={expandedRowId === sub.id}
                onToggleExpand={() => handleToggleRow(sub.id)}
              />
            ))
          )}
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
