"use client";

import { Download } from "lucide-react";

export interface CopyrightOption {
  id: string;
  title: string;
  description: string;
  downloadEnabled: boolean;
}

interface CopyrightOptionCardProps {
  option: CopyrightOption;
  selected: boolean;
  onSelect: (id: string) => void;
}

export default function CopyrightOptionCard({ option, selected, onSelect }: CopyrightOptionCardProps) {
  const { id, title, description, downloadEnabled } = option;
  const isDownloadActive = selected && downloadEnabled;

  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className="text-left flex flex-col gap-3 rounded-[18px] p-[14px_18px_18px] transition-all duration-200 hover:-translate-y-[1px]"
      style={{
        minHeight: "184px",
        background: selected
          ? "linear-gradient(135deg, #191919 0%, #171717 100%)"
          : "#171717",
        border: selected ? "2px solid #E30000" : "1px solid #373737",
        boxShadow: selected
          ? "0 0 0 1px rgba(227,0,0,0.18)"
          : "0 1px 3px rgba(0,0,0,0.32)",
      }}
    >
      {/* Header row: radio + download */}
      <div className="flex items-center justify-between gap-3">
        {/* Radio indicator */}
        <div
          className="w-[22px] h-[22px] rounded-full flex items-center justify-center flex-shrink-0"
          style={{
            border: selected ? "2px solid #E30000" : "2px solid #5C5C5C",
            background: "transparent",
          }}
        >
          {selected && (
            <span
              className="w-[10px] h-[10px] rounded-full"
              style={{ background: "#E30000" }}
            />
          )}
        </div>

        {/* Download button */}
        <span
          className="inline-flex items-center gap-1.5 h-[30px] px-3 rounded-full text-[12px] font-semibold transition-colors"
          style={
            isDownloadActive
              ? { background: "#FFFFFF", color: "#171717" }
              : { background: "#373737", color: "#5C5C5C", opacity: 0.7, cursor: "not-allowed" }
          }
          onClick={e => {
            if (!isDownloadActive) e.stopPropagation();
          }}
        >
          <Download size={11} strokeWidth={2.2} />
          Download
        </span>
      </div>

      {/* Content */}
      <div>
        <p className="text-white font-bold leading-[1.3]" style={{ fontSize: "17px" }}>
          {title}
        </p>
        <p className="mt-2 text-[14px] leading-[1.6]" style={{ color: "#A4A4A4", maxWidth: "310px" }}>
          {description}
        </p>
      </div>
    </button>
  );
}