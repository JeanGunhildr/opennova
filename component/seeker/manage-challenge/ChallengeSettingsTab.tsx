"use client";

import type { ManageChallengeData } from "@/lib/actions/seeker-manage";
import ChallengeSettingsForm from "./settings/ChallengeSettingsForm";

interface ChallengeSettingsTabProps {
  challengeId: string;
  data: ManageChallengeData;
}

export default function ChallengeSettingsTab({
  challengeId,
  data,
}: ChallengeSettingsTabProps) {
  return <ChallengeSettingsForm challengeId={challengeId} data={data} />;
}
