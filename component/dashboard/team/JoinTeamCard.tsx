"use client";

import { useState } from "react";
import { ArrowRight, UserPlus } from "lucide-react";
import InviteCodeInput from "./InviteCodeInput";

export default function JoinTeamCard() {
  const [code, setCode] = useState("");
  const isComplete = code.length === 6;

  return (
    <div className="bg-white border border-gray-200 rounded-[18px] flex flex-col p-[22px_24px_26px] min-h-[384px] shadow-[0_1px_4px_rgba(0,0,0,0.035)] transition-all hover:-translate-y-px hover:border-gray-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
      {/* Icon */}
      <div className="w-[50px] h-[50px] rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
        <UserPlus size={22} className="text-white" strokeWidth={1.8} />
      </div>

      {/* Content */}
      <div className="mt-5 flex flex-col flex-1">
        <h2 className="text-[21px] font-bold text-gray-900 leading-tight">
          Gabung dengan Kode Tim
        </h2>
        <p className="text-[15px] text-gray-600 leading-[1.65] mt-1 max-w-[460px]">
          Masukkan kode undangan tim dan bergabunglah sebagai{" "}
          <span className="font-semibold text-gray-900">Anggota Tim</span>{" "}
          untuk berkolaborasi dalam mengerjakan challenge.
        </p>

        {/* Code input */}
        <div className="mt-5">
          <p className="text-[14px] font-semibold text-gray-600 mb-2.5">Kode Undangan</p>
          <InviteCodeInput code={code} onChange={setCode} />
        </div>

        {/* Button */}
        <button
          type="button"
          disabled={!isComplete}
          className={[
            "mt-[18px] self-start inline-flex items-center gap-2 h-11 px-4 rounded-full text-[15px] font-semibold transition-colors",
            isComplete
              ? "bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700"
              : "bg-gray-200 text-gray-400 cursor-not-allowed",
          ].join(" ")}
        >
          Gabung Tim
          <ArrowRight size={18} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}