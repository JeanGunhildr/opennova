"use client";

import { useState, useTransition } from "react";
import { Plus, Users } from "lucide-react";
import { createTeamAction } from "@/lib/actions/team";
import TeamAlertModal from "./TeamAlertModal";

interface CreateTeamCardProps {
  teamCount: number; // current number of teams user belongs to
}

export default function CreateTeamCard({ teamCount }: CreateTeamCardProps) {
  const [teamName, setTeamName] = useState("");
  const [isPending, startTransition] = useTransition();
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    title: string;
    message: string;
    detail?: string;
    detailLabel?: string;
  } | null>(null);

  const isAtLimit = teamCount >= 3;
  const isValid = teamName.trim().length >= 3 && !isAtLimit && !isPending;

  function handleSubmit() {
    if (!isValid) return;

    const formData = new FormData();
    formData.set("name", teamName.trim());

    startTransition(async () => {
      const result = await createTeamAction(formData);

      if (result.success && result.data) {
        setAlert({
          type: "success",
          title: "Tim Berhasil Dibuat! 🎉",
          message: `Tim "${result.data.teamName as string}" telah dibuat. Bagikan kode undangan di bawah kepada rekan-rekan Anda.`,
          detail: result.data.joinCode as string,
          detailLabel: "Kode Undangan Tim",
        });
        setTeamName("");
      } else {
        setAlert({
          type: "error",
          title: "Gagal Membuat Tim",
          message: result.error ?? "Terjadi kesalahan. Silakan coba lagi.",
        });
      }
    });
  }

  return (
    <>
      <div
        className="relative rounded-[18px] overflow-hidden flex flex-col p-[22px_24px_26px] min-h-[384px] transition-all hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
        style={{ background: "linear-gradient(110deg, #202020 0%, #161616 45%, #870000 100%)" }}
      >
        {/* Decorative red glow */}
        <div
          aria-hidden="true"
          className="absolute -top-16 -right-16 w-64 h-64 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(200,0,0,0.45) 0%, transparent 70%)",
          }}
        />

        {/* Icon */}
        <div className="relative w-[50px] h-[50px] rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(255,255,255,0.16)" }}>
          <Users size={22} className="text-white" strokeWidth={1.8} />
        </div>

        {/* Content */}
        <div className="relative mt-5 flex flex-col flex-1">
          <h2 className="text-[21px] font-bold text-white leading-tight">Buat Tim Baru</h2>
          <p className="text-[15px] leading-[1.65] mt-1 max-w-[430px]" style={{ color: "#B8B8B8" }}>
            Dirikan tim kamu sebagai{" "}
            <span className="font-semibold text-white">Ketua Tim</span>{" "}
            dan undang rekan-rekan terbaikmu untuk mengerjakan challenge bersama.
          </p>

          {/* Limit info */}
          {isAtLimit ? (
            <div className="mt-4 inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3.5 py-2 self-start">
              <span className="text-[13px] text-white/80 font-medium">
                Batas tim tercapai (3/3) — hapus atau keluar dari tim terlebih dahulu
              </span>
            </div>
          ) : (
            <div className="mt-4 inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1.5 self-start">
              <span className="text-[12px] text-white/70 font-medium">{teamCount}/3 tim digunakan</span>
            </div>
          )}

          {/* Input */}
          <label className="block mt-4">
            <span className="block text-[14px] font-semibold mb-2" style={{ color: "#B8B8B8" }}>
              Nama Tim
            </span>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
              placeholder="Contoh: Inovasi Nusantara"
              maxLength={40}
              disabled={isAtLimit || isPending}
              className="w-full h-[48px] rounded-full px-4 text-[14px] text-white placeholder:text-[#A6A6A6] outline-none transition-all disabled:opacity-50"
              style={{
                background: "rgba(255,255,255,0.10)",
                border: "1px solid rgba(255,255,255,0.30)",
              }}
              onFocus={(e) => { e.target.style.border = "1px solid rgba(255,255,255,0.65)"; }}
              onBlur={(e) => { e.target.style.border = "1px solid rgba(255,255,255,0.30)"; }}
            />
          </label>

          {/* Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isValid}
            className={[
              "mt-[18px] self-start inline-flex items-center gap-2 h-11 px-4 rounded-full text-[15px] font-semibold transition-colors",
              isValid
                ? "bg-white text-gray-900 hover:bg-gray-100 active:bg-gray-200"
                : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-65",
            ].join(" ")}
          >
            {isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-gray-400 border-t-gray-700 rounded-full animate-spin" />
                Membuat...
              </>
            ) : (
              <>
                <Plus size={18} strokeWidth={2.2} />
                Buat Tim
              </>
            )}
          </button>
        </div>
      </div>

      {/* Alert modal */}
      {alert && (
        <TeamAlertModal
          isOpen={true}
          type={alert.type}
          title={alert.title}
          message={alert.message}
          detail={alert.detail}
          detailLabel={alert.detailLabel}
          onClose={() => setAlert(null)}
        />
      )}
    </>
  );
}