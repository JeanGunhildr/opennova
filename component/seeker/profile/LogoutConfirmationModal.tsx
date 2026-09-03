"use client";

import { LogOut } from "lucide-react";
import { useEffect, useRef } from "react";

interface LogoutConfirmationModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

export default function LogoutConfirmationModal({ onClose, onConfirm }: LogoutConfirmationModalProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  // Focus "Batal" on mount; close on Escape
  useEffect(() => {
    cancelRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-modal-title"
    >
      <div
        className="w-full text-center"
        style={{
          maxWidth: "420px",
          background: "#1F1F1F",
          border: "1px solid #373737",
          borderRadius: "18px",
          padding: "28px",
          boxShadow: "0 18px 60px rgba(0,0,0,0.45)",
        }}
      >
        {/* Warning icon */}
        <div
          className="flex items-center justify-center rounded-full mx-auto"
          style={{
            width: "56px",
            height: "56px",
            background: "#3B1313",
            border: "1px solid rgba(227,0,0,0.24)",
          }}
        >
          <LogOut size={26} strokeWidth={1.8} style={{ color: "#E30000" }} />
        </div>

        {/* Title */}
        <h2
          id="logout-modal-title"
          className="mt-[18px] font-bold text-white leading-[1.25]"
          style={{ fontSize: "22px" }}
        >
          Keluar Akun?
        </h2>

        {/* Description */}
        <p
          className="text-[14px] leading-[1.55] mx-auto mt-2"
          style={{ color: "#A4A4A4", maxWidth: "340px" }}
        >
          Anda akan keluar dari akun perusahaan dan kembali ke halaman masuk. Pastikan Anda ingin melanjutkan.
        </p>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-[10px] mt-6">
          <button
            ref={cancelRef}
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-full text-[14px] font-semibold text-white transition-colors"
            style={{ height: "44px", background: "#232323", border: "1px solid #5C5C5C" }}
            onMouseEnter={e => (e.currentTarget.style.background = "#373737")}
            onMouseLeave={e => (e.currentTarget.style.background = "#232323")}
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex items-center justify-center rounded-full text-[14px] font-semibold text-white bg-[#E30000] hover:bg-[#CC0000] active:bg-[#B30000] transition-colors"
            style={{ height: "44px" }}
          >
            Keluar Akun
          </button>
        </div>
      </div>
    </div>
  );
}