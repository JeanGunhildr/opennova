// ChallengeTabs.tsx — Styled per JSONC spec
// Scrollable tab bar, primary-red bottom indicator, 13px font weight 600
"use client";

import { useState } from "react";

const TABS = [
  "Deskripsi",
  "Ketentuan",
  "Kriteria Penilaian",
  "Linimasa",
  "Diskusi (24)",
] as const;

type Tab = (typeof TABS)[number];

interface ChallengeTabsProps {
  onTabChange?: (tab: Tab) => void;
}

export default function ChallengeTabs({ onTabChange }: ChallengeTabsProps) {
  const [active, setActive] = useState<Tab>("Deskripsi");

  function handleClick(tab: Tab) {
    setActive(tab);
    onTabChange?.(tab);
  }

  return (
    <div className="border-b border-gray-200 overflow-x-auto">
      <div className="flex items-stretch min-w-max gap-[30px]">
        {TABS.map((tab) => {
          const isActive = active === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => handleClick(tab)}
              className={[
                "relative inline-flex items-center h-[52px] text-[13px] font-semibold whitespace-nowrap transition-colors flex-shrink-0",
                isActive ? "text-gray-800" : "text-gray-400 hover:text-gray-700",
              ].join(" ")}
            >
              {tab}
              {isActive && (
                <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-primary-500 rounded-t-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}