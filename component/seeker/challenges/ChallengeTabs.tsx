"use client";

export type TabId = "all" | "active" | "completed";

interface Tab {
  id: TabId;
  label: string;
  count: number;
}

interface ChallengeTabsProps {
  activeTab: TabId;
  onTabChange: (id: TabId) => void;
  counts?: {
    all: number;
    active: number;
    completed: number;
  };
}

export default function ChallengeTabs({
  activeTab,
  onTabChange,
  counts,
}: ChallengeTabsProps) {
  const tabs: Tab[] = [
    { id: "all",       label: "Semua Challenge", count: counts?.all ?? 0 },
    { id: "active",    label: "Aktif",           count: counts?.active ?? 0 },
    { id: "completed", label: "Selesai",         count: counts?.completed ?? 0 },
  ];

  return (
    <div
      className="flex items-stretch gap-[34px] overflow-x-auto overflow-y-hidden mt-7"
      style={{ borderBottom: "1px solid #373737", height: "52px" }}
    >
      {tabs.map(({ id, label, count }) => {
        const isActive = activeTab === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onTabChange(id)}
            className="relative inline-flex items-center gap-2 h-[52px] whitespace-nowrap transition-colors"
            style={{
              fontSize: "16px",
              fontWeight: isActive ? 600 : 500,
              color: isActive ? "#F7F7F7" : "#737373",
            }}
          >
            {label}

            {/* Count badge */}
            <span
              className="inline-flex items-center justify-center rounded-full text-[11px] font-bold leading-none"
              style={{
                minWidth: "20px",
                height: "20px",
                padding: "0 6px",
                background: isActive ? "rgba(227,0,0,0.18)" : "#373737",
                color: isActive ? "#FF6B6B" : "#737373",
              }}
            >
              {count}
            </span>

            {/* Active underline */}
            {isActive && (
              <span
                className="absolute left-0 right-0 rounded-full"
                style={{ bottom: "0", height: "2px", background: "#E30000" }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}