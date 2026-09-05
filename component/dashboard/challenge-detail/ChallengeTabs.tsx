"use client";

import { useState } from "react";

interface ChallengeTabsProps {
  discussionCount?: number;
  onTabChange?: (tab: string) => void;
}

export default function ChallengeTabs({
  discussionCount = 0,
  onTabChange,
}: ChallengeTabsProps) {
  const [active, setActive] = useState("Deskripsi");

  const tabs = [
    { id: "Deskripsi", label: "Deskripsi" },
    { id: "Ketentuan", label: "Ketentuan" },
    { id: "Kriteria Penilaian", label: "Kriteria Penilaian" },
    { id: "Linimasa", label: "Linimasa" },
    { id: "Diskusi", label: `Diskusi (${discussionCount})` },
  ];

  function handleClick(id: string, label: string) {
    setActive(id);
    onTabChange?.(label);
  }

  return (
    <div className="border-b border-gray-200 overflow-x-auto">
      <div className="flex items-stretch min-w-max gap-[30px]">
        {tabs.map((tab) => {
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleClick(tab.id, tab.label)}
              className={[
                "relative inline-flex items-center h-[52px] text-[13px] font-semibold whitespace-nowrap transition-colors flex-shrink-0 cursor-pointer",
                isActive ? "text-gray-800" : "text-gray-400 hover:text-gray-700",
              ].join(" ")}
            >
              {tab.label}
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