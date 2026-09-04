"use client";
import { AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";

interface PublishChallengeModalProps {
  mode: "guidance" | "confirmation";
  missingItems?: string[];
  isSubmitting?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function PublishChallengeModal({ mode, missingItems = [], isSubmitting = false, onClose, onConfirm }: PublishChallengeModalProps) {
  const isGuidance = mode === "guidance";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.58)", backdropFilter: "blur(4px)" }}
      onClick={e => { if (e.target === e.currentTarget && !isSubmitting) onClose(); }}>
      <div className="flex flex-col items-center text-center"
        style={{ width: "460px", maxWidth: "calc(100vw - 32px)", background: "#1F1F1F", border: "1px solid #373737", borderRadius: "18px", padding: "28px", boxShadow: "0 20px 60px rgba(0,0,0,0.45)" }}>
        {/* Icon */}
        <div className="flex items-center justify-center rounded-full"
          style={{ width: "54px", height: "54px",
            background: isGuidance ? "#393713" : "#143520",
            border: `1px solid ${isGuidance ? "rgba(216,200,58,0.3)" : "rgba(84,214,122,0.25)"}` }}>
          {isGuidance
            ? <AlertTriangle size={24} strokeWidth={1.8} style={{ color: "#D8C83A" }} />
            : <CheckCircle2 size={24} strokeWidth={1.8} style={{ color: "#54D67A" }} />}
        </div>

        {/* Title */}
        <h2 className="mt-[18px] font-bold text-white" style={{ fontSize: "21px" }}>
          {isGuidance ? "Challenge Belum Siap Dipublikasikan" : "Publikasikan Challenge?"}
        </h2>

        {/* Body */}
        {isGuidance ? (
          <>
            <p className="mt-2" style={{ fontSize: "13px", lineHeight: "1.55", color: "#A4A4A4" }}>
              Lengkapi seluruh bagian yang diperlukan sebelum mempublikasikan challenge.
            </p>
            {missingItems.length > 0 && (
              <div className="w-full mt-4 text-left rounded-[10px] p-3" style={{ background: "#171717", border: "1px solid #373737" }}>
                {missingItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 py-1">
                    <span className="rounded-full flex-shrink-0" style={{ width: "6px", height: "6px", background: "#E30000" }} />
                    <p style={{ fontSize: "12px", color: "#BDBDBD" }}>{item}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <p className="mt-2" style={{ fontSize: "13px", lineHeight: "1.55", color: "#A4A4A4", maxWidth: "380px" }}>
            Challenge akan dipublikasikan dan dapat dilihat oleh Solver. Pastikan seluruh informasi dan dokumen sudah benar.
          </p>
        )}

        {/* Actions */}
        <div className="grid gap-[10px] mt-6 w-full" style={{ gridTemplateColumns: isGuidance ? "1fr" : "1fr 1fr" }}>
          {!isGuidance && (
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-full text-white text-[14px] font-semibold transition-colors disabled:opacity-50"
              style={{ height: "44px", background: "#232323", border: "1px solid #5C5C5C" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#373737")}
              onMouseLeave={e => (e.currentTarget.style.background = "#232323")}
            >
              Batal
            </button>
          )}
          <button
            onClick={isGuidance ? onClose : onConfirm}
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 rounded-full text-white text-[14px] font-semibold bg-[#E30000] hover:bg-[#CC0000] transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_4px_14px_rgba(227,0,0,0.3)]"
            style={{ height: "44px" }}
          >
            {isGuidance ? (
              "Lengkapi Data"
            ) : isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Mempublikasikan...</span>
              </>
            ) : (
              "Publikasikan"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}