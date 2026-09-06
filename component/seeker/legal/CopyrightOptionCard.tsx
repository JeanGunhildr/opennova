"use client";

import { Download } from "lucide-react";

export interface CopyrightOption {
  id: "transfer-penuh" | "lisensi-non-eksklusif" | "kolaborasi-lanjutan" | string;
  title: string;
  description: string;
  downloadUrl: string;
  fileName: string;
}

interface CopyrightOptionCardProps {
  option: CopyrightOption;
  selected: boolean;
  onSelect: (id: string) => void;
}

export default function CopyrightOptionCard({ option, selected, onSelect }: CopyrightOptionCardProps) {
  const { id, title, description, downloadUrl, fileName } = option;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(id);
        }
      }}
      className="text-left flex flex-col justify-between rounded-[18px] p-[16px_18px_18px] transition-all duration-200 hover:-translate-y-[1px] cursor-pointer select-none"
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
      <div className="flex items-center justify-between gap-3 mb-3.5">
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

        {/* Download Control (Gated by Selection) */}
        {selected ? (
          /* Active Download Button for Selected Card */
          <a
            href={downloadUrl}
            download={fileName}
            onClick={(e) => e.stopPropagation()} // Prevents toggling the card's radio/active selection
            className="inline-flex items-center gap-1.5 h-[30px] px-3 rounded-full text-[11px] md:text-[12px] font-semibold transition-colors duration-200 select-none cursor-pointer bg-white text-black hover:bg-gray-200 shadow-sm"
          >
            <Download size={13} strokeWidth={2.2} />
            <span>Download</span>
          </a>
        ) : (
          /* Disabled / Muted Button for Unselected Cards */
          <button
            type="button"
            disabled
            tabIndex={-1}
            className="inline-flex items-center gap-1.5 h-[30px] px-3 rounded-full text-[11px] md:text-[12px] font-semibold select-none cursor-not-allowed bg-[#2A2829]/60 border border-[#393939] text-[#555555] pointer-events-none opacity-60"
          >
            <Download size={13} strokeWidth={2.2} className="text-[#555555]" />
            <span>Download</span>
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-start">
        <p className="text-white font-bold leading-[1.3]" style={{ fontSize: "17px" }}>
          {title}
        </p>
        <p className="mt-2 text-[14px] leading-[1.6]" style={{ color: "#A4A4A4", maxWidth: "310px" }}>
          {description}
        </p>
      </div>
    </div>
  );
}