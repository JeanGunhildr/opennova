"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface InviteCodeButtonProps {
  code: string;
}

export default function InviteCodeButton({ code }: InviteCodeButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // Silent fallback for unsupported environments
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={copied ? "Tersalin!" : `Salin kode: ${code}`}
      className={[
        "inline-flex items-center gap-2 h-[42px] px-3.5 rounded-full border text-[13px] font-medium transition-all select-none",
        copied
          ? "bg-[#E5F3E8] border-[#379B49] text-[#379B49]"
          : "bg-white border-gray-300 text-gray-900 hover:bg-gray-50 hover:border-gray-400 hover:-translate-y-px active:scale-[0.98]",
      ].join(" ")}
    >
      <span className="font-mono tracking-widest text-[12px]">{code}</span>
      {copied ? (
        <>
          <Check size={14} strokeWidth={2.2} />
          <span className="text-[12px] font-semibold">Tersalin</span>
        </>
      ) : (
        <Copy size={14} strokeWidth={1.8} />
      )}
    </button>
  );
}