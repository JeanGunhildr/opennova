"use client";

import ChallengeSettingsForm from "./settings/ChallengeSettingsForm";

interface ChallengeSettingsTabProps {
  challengeTitle: string;
}

export default function ChallengeSettingsTab({
  challengeTitle,
}: ChallengeSettingsTabProps) {
  return <ChallengeSettingsForm challengeTitle={challengeTitle} />;
}
