"use client";

import { useState } from "react";

const TABS = ["Challenge Spesial", "Terbaru", "Deadline Terdekat", "BUMN", "Perusahaan Swasta", "UMKM"] as const;
const FILTER_CHIPS = ["Semua Sektor", "Teknologi", "Lingkungan", "Manufaktur", "Kesehatan", "Energi", "Agrikultur"] as const;

export default function JelajahFilters() {
  const [activeTab, setActiveTab] = useState<string>(TABS[0]);
  const [activeFilter, setActiveFilter] = useState<string>(FILTER_CHIPS[0]);

  return (
    <div className="mt-6">
      {/* Category tabs */}
      <div className="border-b border-[#D9DCDD] overflow-x-auto">
        <div className="flex gap-0 min-w-max">
          {TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={[
                  "relative h-[52px] px-5 text-[14px] whitespace-nowrap transition-colors flex-shrink-0",
                  isActive
                    ? "text-gray-900 font-semibold"
                    : "text-gray-600 font-medium hover:text-gray-900",
                ].join(" ")}
              >
                {tab}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary-500 rounded-t-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2.5 mt-5">
        {FILTER_CHIPS.map((chip) => {
          const isActive = activeFilter === chip;
          return (
            <button
              key={chip}
              type="button"
              onClick={() => setActiveFilter(chip)}
              className={[
                "h-[38px] px-4 rounded-full text-[13px] font-medium border transition-colors",
                isActive
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-800 border-[#E2E3E5] hover:border-gray-400",
              ].join(" ")}
            >
              {chip}
            </button>
          );
        })}
      </div>
    </div>
  );
}