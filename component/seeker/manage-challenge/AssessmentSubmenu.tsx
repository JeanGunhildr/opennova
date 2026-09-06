"use client";

import type { SeekerLifecycleStage } from "./ManageChallengeClient";
import type { ManageChallengeData } from "@/lib/actions/seeker-manage";
import ExpertJudgingSection from "./ExpertJudgingSection";
import FinalPitchingSection from "./FinalPitchingSection";
import WinnerAnnouncementSection from "./WinnerAnnouncementSection";

interface AssessmentSubmenuProps {
  data: ManageChallengeData;
  stage: SeekerLifecycleStage;
}

export default function AssessmentSubmenu({ data, stage }: AssessmentSubmenuProps) {
return (
  <div className="w-full flex flex-col gap-10 mt-6 pt-2">
    {stage === "PENJURIAN_AHLI" && (
      <ExpertJudgingSection
        data={data}
        stage={stage}
      />
    )}

    {stage === "PITCHING_FINAL" && (
      <FinalPitchingSection
        data={data}
        stage={stage}
      />
    )}

    {stage === "PENGUMUMAN_PEMENANG" && (
      <WinnerAnnouncementSection
        data={data}
        stage={stage}
      />
    )}
  </div>
);
}
