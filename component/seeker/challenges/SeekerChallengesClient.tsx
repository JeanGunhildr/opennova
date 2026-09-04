"use client";

import { useState } from "react";
import ChallengeTabs, { type TabId } from "./ChallengeTabs";
import SeekerChallengeGrid from "./SeekerChallengeGrid";
import type { SeekerChallenge } from "./SeekerChallengeCard";

interface SeekerChallengesClientProps {
  challenges: SeekerChallenge[];
}

const ACTIVE_LIFECYCLES = new Set(["open", "expert", "pitching"]);
const COMPLETED_LIFECYCLES = new Set(["winner"]);

export default function SeekerChallengesClient({
  challenges,
}: SeekerChallengesClientProps) {
  const [activeTab, setActiveTab] = useState<TabId>("all");

  const activeCount = challenges.filter((c) =>
    ACTIVE_LIFECYCLES.has(c.lifecycle)
  ).length;

  const completedCount = challenges.filter((c) =>
    COMPLETED_LIFECYCLES.has(c.lifecycle)
  ).length;

  return (
    <>
      <ChallengeTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        counts={{
          all: challenges.length,
          active: activeCount,
          completed: completedCount,
        }}
      />
      <SeekerChallengeGrid activeTab={activeTab} challenges={challenges} />
    </>
  );
}
