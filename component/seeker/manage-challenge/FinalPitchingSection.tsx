"use client";

import { useState } from "react";
import { Inbox } from "lucide-react";
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

interface FinalPitchingSectionProps {
  data: ManageChallengeData;
  stage: SeekerLifecycleStage;
}

export default function FinalPitchingSection({ data, stage }: FinalPitchingSectionProps) {
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  const handleToggleRow = (id: string) => {
    setExpandedRowId((prev) => (prev === id ? null : id));
  };

  const isEmptyState = stage === "PENJURIAN_AHLI";
  const isLocked = stage === "PENGUMUMAN_PEMENANG";
  const dateRange = formatDateRange(data.timelines, "Pitching Final");

  const criteria: CriterionDefinition[] = data.pitchingCriteria.map((c) => ({
    id: c.id,
    name: c.name,
    description: c.description,
  }));

  const criteriaIds = criteria.map((c) => c.id);
  const submissions = data.pitchingEntries.map((e) => buildSubmissionRowData(e, criteriaIds));

  return (
    <section className="flex flex-col gap-4">
      {/* ── Standardized Header ───────────────────────────────── */}
      <div className="flex justify-between items-start gap-4">
        <div className="flex flex-col">
          <h3 className="text-base font-bold text-white leading-snug">
            Pitching Final{" "}
            {dateRange && (
              <span className="text-[#A4A4A4] font-normal text-xs sm:text-sm">
                {dateRange}
              </span>
            )}
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
          <div
            className={`flex flex-col gap-2.5 transition-all ${
              isLocked ? "opacity-20 pointer-events-none select-none blur-[1px]" : "opacity-100"
            }`}
          >
            {submissions.length === 0 ? (
              <div className="w-full h-[64px] bg-[#191919] border border-[#393939] rounded-[11px] px-4 flex items-center gap-2.5 text-[#737373] text-xs font-medium">
                <Inbox size={17} className="text-[#737373]" />
                <span>Belum ada finalis untuk tahap ini.</span>
              </div>
            ) : (
              submissions.map((sub) => (
                <SubmissionRow
                  key={sub.id}
                  submission={sub}
                  challengeId={data.id}
                  criteria={criteria}
                  stage={stage}
                  sectionType="pitching"
                  isExpanded={expandedRowId === sub.id}
                  onToggleExpand={() => handleToggleRow(sub.id)}
                />
              ))
            )}
          </div>

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
