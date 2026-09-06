"use client";

import { useState, useTransition } from "react";
import { CheckCircle2 } from "lucide-react";
import { saveBatchScoresAction } from "@/lib/actions/seeker-manage";

export interface CriterionDefinition {
  id: string;
  name: string;
  description: string | null;
}

interface ScoreDropdownProps {
  entryId: string;
  challengeId: string;
  criteria: CriterionDefinition[];
  initialScores?: Record<string, number>;
  onClose?: () => void;
  /** If true: read-only display, no save button */
  readOnly?: boolean;
  /** Called after successful save with new scores */
  onSaved?: (scores: Record<string, number>) => void;
}

export default function ScoreDropdown({
  entryId,
  challengeId,
  criteria,
  initialScores = {},
  onClose,
  readOnly = false,
  onSaved,
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

  const [savedSuccessfully, setSavedSuccessfully] = useState(
    // Pre-mark as saved if all criteria already have scores
    criteria.length > 0 &&
      criteria.every((c) => initialScores[c.id] !== undefined)
  );
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleInputChange = (critId: string, val: string) => {
    setSavedSuccessfully(false);
    setSaveError(null);
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

  const allFilled = criteria.every((crit) => {
    const val = scores[crit.id];
    return val !== undefined && val.trim() !== "" && !isNaN(Number(val));
  });

  const totalScore = criteria.reduce((sum, crit) => {
    const val = parseInt(scores[crit.id] || "0", 10);
    return sum + (isNaN(val) ? 0 : val);
  }, 0);

  const handleSave = () => {
    if (!allFilled) return;
    setSaveError(null);

    const finalScores: Record<string, number> = {};
    criteria.forEach((crit) => {
      finalScores[crit.id] = parseInt(scores[crit.id] || "0", 10);
    });

    startTransition(async () => {
      const result = await saveBatchScoresAction(entryId, finalScores, challengeId);
      if (result.success) {
        setSavedSuccessfully(true);
        onSaved?.(finalScores);
      } else {
        setSaveError(result.error ?? "Gagal menyimpan nilai.");
      }
    });
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
                  {crit.name}
                </span>
                {crit.description && (
                  <span className="text-[10px] text-[#737373] leading-normal">
                    {crit.description}
                  </span>
                )}
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

      {/* Save Error */}
      {saveError && (
        <p className="text-[10px] text-[#E30000] mt-2">{saveError}</p>
      )}

      {/* Footer */}
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
            <>
              {savedSuccessfully ? (
                <div className="h-[34px] px-4 rounded-full bg-[rgba(57,217,111,0.1)] border border-[rgba(57,217,111,0.3)] text-[#39D96F] text-[11px] font-bold flex items-center gap-1.5">
                  <CheckCircle2 size={13} />
                  <span>Sudah dinilai</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!allFilled || isPending}
                  className={`h-[34px] px-4 rounded-full text-[11px] font-bold transition-all flex items-center justify-center ${
                    allFilled && !isPending
                      ? "bg-[#E30000] hover:bg-[#CC0000] text-white cursor-pointer shadow-sm active:scale-[0.98]"
                      : "bg-[#393939] text-[#737373] cursor-not-allowed border border-[#4A4A4A]"
                  }`}
                >
                  {isPending ? "Menyimpan..." : "Simpan"}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
