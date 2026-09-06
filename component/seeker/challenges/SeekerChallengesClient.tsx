"use client";

import { useState } from "react";
import ChallengeTabs, { type TabId } from "./ChallengeTabs";
import SeekerChallengeGrid from "./SeekerChallengeGrid";
import type { SeekerChallenge } from "./SeekerChallengeCard";

interface SeekerChallengesClientProps {
  challenges: SeekerChallenge[];
}

export default function SeekerChallengesClient({
  challenges,
}: SeekerChallengesClientProps) {
  const [activeTab, setActiveTab] = useState<TabId>("all");

  const pendingCount = challenges.filter((c) => c.canonicalTab === "pending").length;
  const activeCount = challenges.filter((c) => c.canonicalTab === "active").length;
  const completedCount = challenges.filter((c) => c.canonicalTab === "completed").length;

  return (
    <>
      <ChallengeTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        counts={{
          all: challenges.length,
          pending: pendingCount,
          active: activeCount,
          completed: completedCount,
        }}
      />
      <SeekerChallengeGrid activeTab={activeTab} challenges={challenges} />
    </>
  );
}
