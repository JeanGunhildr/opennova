"use client";

import { useState } from "react";
import type { CriterionDefinition } from "@/lib/data/seekerChallengeState";

interface ScoreDropdownProps {
  criteria: CriterionDefinition[];
  initialScores?: Record<string, number>;
  onSave?: (scores: Record<string, number>) => void;
  onClose?: () => void;
  readOnly?: boolean;
}

export default function ScoreDropdown({
  criteria,
  initialScores = {},
  onSave,
  onClose,
  readOnly = false,
}: ScoreDropdownProps) {
  const [scores, setScores] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    criteria.forEach((crit) => {
      if (initialScores[crit.id] !== undefined) {
        init[crit.id] = String(initialScores[crit.id]);
      } else {
        init[crit.id] = "";
      }
    });
    return init;
  });

  const handleInputChange = (critId: string, val: string) => {
    // Only allow digits and max 100
    if (val === "") {
      setScores((prev) => ({ ...prev, [critId]: "" }));
      return;
    }
    const clean = val.replace(/\D/g, "");
    if (clean === "") {
      setScores((prev) => ({ ...prev, [critId]: "" }));
      return;
    }
    const num = parseInt(clean, 10);
    if (num >= 0 && num <= 100) {
      setScores((prev) => ({ ...prev, [critId]: String(num) }));
    }
  };

  // Check validity: all fields must be non-empty and between 0 and 100
  const allFilled = criteria.every((crit) => {
    const val = scores[crit.id];
    return val !== undefined && val.trim() !== "" && !isNaN(Number(val));
  });

  // Calculate dynamic total score
  const totalScore = criteria.reduce((sum, crit) => {
    const val = parseInt(scores[crit.id] || "0", 10);
    return sum + (isNaN(val) ? 0 : val);
  }, 0);

  const handleSave = () => {
    if (!allFilled || !onSave) return;
    const finalScores: Record<string, number> = {};
    criteria.forEach((crit) => {
      finalScores[crit.id] = parseInt(scores[crit.id] || "0", 10);
    });
    onSave(finalScores);
  };

  return (
    <div
      className="w-full bg-[#1F1F1F] border border-[#393939] rounded-[12px] p-3.5 mt-2 shadow-[0_12px_32px_rgba(0,0,0,0.38)] animate-in fade-in zoom-in-95 duration-150"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Criteria Rows */}
      <div className="flex flex-col gap-3">
        {criteria.map((crit) => {
          const val = scores[crit.id] ?? "";
          const isFilled = val !== "";

          return (
            <div
              key={crit.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-[#303030] last:border-b-0"
            >
              <div className="flex flex-col gap-0.5 min-w-0 pr-2">
                <span className="text-xs font-bold text-white leading-tight">
                  {crit.label}
                </span>
                <span className="text-[10px] text-[#737373] leading-normal">
                  {crit.description}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                {readOnly ? (
                  <div className="w-[86px] h-[30px] rounded-full bg-[#2A2829] border border-[#4A4A4A] text-white flex items-center justify-center text-[11px] font-bold">
                    {val || 0}
                  </div>
                ) : (
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="0 - 100"
                    value={val}
                    onChange={(e) => handleInputChange(crit.id, e.target.value)}
                    className={`w-[86px] h-[30px] rounded-full text-center text-[11px] font-medium outline-none transition-all placeholder:text-[#737373] ${
                      isFilled
                        ? "bg-[#2A2829] border border-[#737373] text-white focus:border-[#E30000] focus:ring-1 focus:ring-[#E30000]"
                        : "bg-[#2A2829] border border-[#4A4A4A] text-[#737373] focus:border-[#E30000] focus:ring-1 focus:ring-[#E30000]"
                    }`}
                  />
                )}
                <span className="text-[11px] text-[#737373]">/ 100</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer: Total Score & Save Button */}
      <div className="flex items-center justify-between gap-3 mt-3 pt-2.5 border-t border-[#393939]">
        <div className="h-[32px] px-3 rounded-full border border-[#4A4A4A] text-white text-[11px] font-bold flex items-center gap-1.5 bg-[#2A2829]">
          <span className="text-[#A4A4A4] font-normal text-[10px]">Total Nilai:</span>
          <span className="text-white text-xs">{totalScore}</span>
        </div>

        <div className="flex items-center gap-2">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="h-[32px] px-3 rounded-full border border-[#4A4A4A] text-[#A4A4A4] text-[11px] font-medium hover:bg-[#2A2829] hover:text-white transition-colors"
            >
              Tutup
            </button>
          )}

          {!readOnly && (
            <button
              type="button"
              onClick={handleSave}
              disabled={!allFilled}
              className={`h-[34px] px-4 rounded-full text-[11px] font-bold transition-all flex items-center justify-center ${
                allFilled
                  ? "bg-[#E30000] hover:bg-[#CC0000] text-white cursor-pointer shadow-sm active:scale-[0.98]"
                  : "bg-[#393939] text-[#737373] cursor-not-allowed border border-[#4A4A4A]"
              }`}
            >
              Simpan
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
