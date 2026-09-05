"use client";

import { Lock } from "lucide-react";

interface StageLockOverlayProps {
  title: string;
  description: string;
}

export default function StageLockOverlay({
  title,
  description,
}: StageLockOverlayProps) {
  return (
    <div
      className="absolute inset-0 bg-[#171717]/85 backdrop-blur-[1px] flex flex-col items-center justify-center p-6 text-center z-10 animate-in fade-in duration-200"
    >
      {/* Red Lock Icon Badge */}
      <div className="w-10 h-10 rounded-[10px] border border-[#E30000]/60 text-[#E30000] flex items-center justify-center mb-2.5 bg-[#E30000]/10 shadow-[0_0_15px_rgba(227,0,0,0.15)]">
        <Lock size={18} strokeWidth={2.2} />
      </div>

      {/* Title */}
      <h4 className="text-sm font-bold text-white mb-1.5">{title}</h4>

      {/* Description */}
      <p className="text-xs text-[#A4A4A4] max-w-[540px] leading-relaxed">
        {description}
      </p>
    </div>
  );
}
