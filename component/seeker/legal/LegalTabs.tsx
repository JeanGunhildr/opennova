"use client";

export type LegalTab = "copyright" | "certificate";

const TABS: { id: LegalTab; label: string }[] = [
  { id: "copyright",   label: "Kesepakatan Hak Cipta" },
  { id: "certificate", label: "Berkas Sertifikat"      },
];

interface LegalTabsProps {
  active: LegalTab;
  onChange: (id: LegalTab) => void;
}

export default function LegalTabs({ active, onChange }: LegalTabsProps) {
  return (
    <div
      className="flex items-stretch gap-[34px] overflow-x-auto overflow-y-hidden"
      style={{ borderBottom: "1px solid #373737", height: "52px" }}
    >
      {TABS.map(({ id, label }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className="relative inline-flex items-center h-[52px] whitespace-nowrap transition-colors"
            style={{
              fontSize: "16px",
              fontWeight: isActive ? 600 : 500,
              color: isActive ? "#F7F7F7" : "#8C8C8C",
            }}
          >
            {label}
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