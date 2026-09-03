"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import LogoutConfirmationModal from "./LogoutConfirmationModal";

export default function AccountActionsCard() {
  const [modalOpen, setModalOpen] = useState(false);

  function handleConfirmLogout() {
    setModalOpen(false);
    // In production: call Supabase signOut then redirect
    alert("Sesi telah diakhiri.");
  }

  return (
    <>
      <div
        className="rounded-[16px] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        style={{
          background: "#191919",
          border: "1px solid #373737",
          padding: "18px 20px",
        }}
      >
        <div className="flex flex-col gap-0.5">
          <p className="text-[15px] font-semibold text-white">Keluar Akun</p>
          <p className="text-[12px]" style={{ color: "#737373" }}>
            Akhiri sesi aktif Anda dari dashboard Seeker.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="self-start sm:self-auto flex-shrink-0 inline-flex items-center gap-2 rounded-full text-[13px] font-semibold transition-colors"
          style={{
            height: "40px",
            padding: "0 16px",
            background: "transparent",
            border: "1px solid #5C5C5C",
            color: "#D9D9D9",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = "#3B1313";
            (e.currentTarget as HTMLElement).style.borderColor = "#E30000";
            (e.currentTarget as HTMLElement).style.color = "#FF7070";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.borderColor = "#5C5C5C";
            (e.currentTarget as HTMLElement).style.color = "#D9D9D9";
          }}
        >
          <LogOut size={14} strokeWidth={2} />
          Keluar Akun
        </button>
      </div>

      {modalOpen && (
        <LogoutConfirmationModal
          onClose={() => setModalOpen(false)}
          onConfirm={handleConfirmLogout}
        />
      )}
    </>
  );
}