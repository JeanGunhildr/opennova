"use client";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";

interface CreateChallengeHeaderProps {
  onDiscard: () => void;
  onPublish: () => void;
  isSubmitting?: boolean;
}

export default function CreateChallengeHeader({ onDiscard, onPublish, isSubmitting = false }: CreateChallengeHeaderProps) {
  return (
    <div className="mb-[22px] mx-4">
      {/* Back */}
      <Link href="/seeker/challenges"
        className="inline-flex items-center gap-1.5 rounded-full text-[12px] font-medium transition-colors mb-4"
        style={{ height: "34px", padding: "0 12px", background: "transparent", border: "1px solid #373737", color: "#BDBDBD" }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = "#5C5C5C")}
        onMouseLeave={e => (e.currentTarget.style.borderColor = "#373737")}>
        <ArrowLeft size={14} strokeWidth={2} />
        Kembali ke Daftar Challenge
      </Link>

      {/* Title row */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div>
          <h1 className="font-bold text-white leading-[1.1]" style={{ fontSize: "34px", letterSpacing: "-0.025em" }}>
            Buat Challenge Baru
          </h1>
          <p className="mt-1" style={{ fontSize: "12px", color: "#737373", lineHeight: "1.45" }}>
            Lengkapi seluruh 7 bagian dan selesaikan pembayaran untuk mempublikasikan challenge Anda.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-[10px] flex-shrink-0">
          <button type="button" onClick={onDiscard}
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-full text-[13px] font-semibold transition-colors disabled:opacity-50"
            style={{ height: "44px", padding: "0 18px", background: "transparent", border: "1px solid #5C5C5C", color: "#F7F7F7" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#3B1313"; (e.currentTarget as HTMLElement).style.borderColor = "#E30000"; (e.currentTarget as HTMLElement).style.color = "#FF7A7A"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.borderColor = "#5C5C5C"; (e.currentTarget as HTMLElement).style.color = "#F7F7F7"; }}>
            Hapus Data
          </button>
          <button type="button" onClick={onPublish}
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 rounded-full text-white text-[13px] font-semibold bg-[#E30000] hover:bg-[#CC0000] transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_4px_14px_rgba(227,0,0,0.3)]"
            style={{ height: "44px", padding: "0 18px" }}>
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Mempublikasikan...</span>
              </>
            ) : (
              <span>Publikasikan Challenge</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}