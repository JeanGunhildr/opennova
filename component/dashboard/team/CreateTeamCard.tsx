"use client";

import { useState } from "react";
import { Plus, Users } from "lucide-react";

export default function CreateTeamCard() {
  const [teamName, setTeamName] = useState("");
  const isValid = teamName.trim().length >= 3;

  return (
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

        {/* Input */}
        <label className="block mt-5">
          <span className="block text-[14px] font-semibold mb-2" style={{ color: "#B8B8B8" }}>
            Nama Tim
          </span>
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="Contoh: Inovasi Nusantara"
            maxLength={40}
            className="w-full h-[48px] rounded-full px-4 text-[14px] text-white placeholder:text-[#A6A6A6] outline-none transition-all"
            style={{
              background: "rgba(255,255,255,0.10)",
              border: "1px solid rgba(255,255,255,0.30)",
            }}
            onFocus={(e) => {
              e.target.style.border = "1px solid rgba(255,255,255,0.65)";
            }}
            onBlur={(e) => {
              e.target.style.border = "1px solid rgba(255,255,255,0.30)";
            }}
          />
        </label>

        {/* Button */}
        <button
          type="button"
          disabled={!isValid}
          className={[
            "mt-[18px] self-start inline-flex items-center gap-2 h-11 px-4 rounded-full text-[15px] font-semibold transition-colors",
            isValid
              ? "bg-white text-gray-900 hover:bg-gray-100 active:bg-gray-200"
              : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-65",
          ].join(" ")}
        >
          <Plus size={18} strokeWidth={2.2} />
          Buat Tim
        </button>
      </div>
    </div>
  );
}