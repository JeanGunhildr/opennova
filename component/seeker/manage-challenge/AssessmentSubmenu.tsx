"use client";

import { useState } from "react";
import {
  SeekerLifecycleStage,
  MOCK_EXPERT_SUBMISSIONS,
  MOCK_PITCHING_SUBMISSIONS,
  MOCK_WINNER_DATA,
  ExpertSubmission,
  PitchingSubmission,
} from "@/lib/data/seekerChallengeState";
import ExpertJudgingSection from "./ExpertJudgingSection";
import FinalPitchingSection from "./FinalPitchingSection";
import WinnerAnnouncementSection from "./WinnerAnnouncementSection";

interface AssessmentSubmenuProps {
  stage: SeekerLifecycleStage;
}

export default function AssessmentSubmenu({ stage }: AssessmentSubmenuProps) {
  // Submissions state allowing real-time grading updates in session
  const [expertSubs, setExpertSubs] = useState<ExpertSubmission[]>(MOCK_EXPERT_SUBMISSIONS);
  const [pitchingSubs, setPitchingSubs] = useState<PitchingSubmission[]>(MOCK_PITCHING_SUBMISSIONS);

  const handleUpdateExpertScores = (id: string, scores: Record<string, number>) => {
    setExpertSubs((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, scores, status: "rated" as const } : item
      )
    );
  };

  const handleUpdatePitchingScores = (id: string, scores: Record<string, number>) => {
    setPitchingSubs((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, scores, isAssessed: true } : item
      )
    );
  };

  return (
    <div className="w-full flex flex-col gap-10 mt-6 pt-2">
      {/* ── SECTION 1 (Top): Penjurian Ahli ─────────────────────── */}
      <ExpertJudgingSection
        stage={stage}
        submissions={expertSubs}
        onUpdateScores={handleUpdateExpertScores}
      />

      {/* ── Divider ─────────────────────────────────────────────── */}
      <div className="h-px bg-[#2E2E2E] my-1" />

      {/* ── SECTION 2 (Middle): Pitching Final ───────────────────── */}
      <FinalPitchingSection
        stage={stage}
        submissions={pitchingSubs}
        onUpdateScores={handleUpdatePitchingScores}
      />

      {/* ── Divider ─────────────────────────────────────────────── */}
      <div className="h-px bg-[#2E2E2E] my-1" />

      {/* ── SECTION 3 (Bottom): Pemenang Challenge ───────────────── */}
      <WinnerAnnouncementSection
        stage={stage}
        winnerData={MOCK_WINNER_DATA}
      />
    </div>
  );
}
