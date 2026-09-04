"use client";

import { useState, useTransition } from "react";
import { ArrowRight, UserPlus } from "lucide-react";
import InviteCodeInput from "./InviteCodeInput";
import { joinTeamAction } from "@/lib/actions/team";
import TeamAlertModal from "./TeamAlertModal";

interface JoinTeamCardProps {
  teamCount: number; // current number of teams user belongs to
}

export default function JoinTeamCard({ teamCount }: JoinTeamCardProps) {
  const [code, setCode] = useState("");
  const [isPending, startTransition] = useTransition();
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    title: string;
    message: string;
  } | null>(null);

  const isAtLimit = teamCount >= 3;
  const isComplete = code.length === 6 && !isAtLimit && !isPending;

  function handleJoin() {
    if (!isComplete) return;

    const formData = new FormData();
    formData.set("code", code);

    startTransition(async () => {
      const result = await joinTeamAction(formData);

      if (result.success && result.data) {
        setAlert({
          type: "success",
          title: "Berhasil Bergabung! 🎉",
          message: `Anda kini menjadi anggota tim "${result.data.teamName as string}". Selamat berkolaborasi!`,
        });
        setCode("");
      } else {
        setAlert({
          type: "error",
          title: "Gagal Bergabung",
          message: result.error ?? "Terjadi kesalahan. Silakan coba lagi.",
        });
      }
    });
  }

  return (
    <>
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

          {/* Limit info */}
          {isAtLimit ? (
            <div className="mt-4 inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-3.5 py-2 self-start">
              <span className="text-[13px] text-amber-700 font-medium">
                Batas tim tercapai (3/3) — hapus atau keluar dari tim terlebih dahulu
              </span>
            </div>
          ) : (
            <div className="mt-4 inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5 self-start">
              <span className="text-[12px] text-gray-500 font-medium">{teamCount}/3 tim digunakan</span>
            </div>
          )}

          {/* Code input */}
          <div className="mt-4">
            <p className="text-[14px] font-semibold text-gray-600 mb-2.5">Kode Undangan</p>
            <InviteCodeInput
              code={code}
              onChange={setCode}
              disabled={isAtLimit || isPending}
            />
          </div>

          {/* Button */}
          <button
            type="button"
            onClick={handleJoin}
            disabled={!isComplete}
            className={[
              "mt-[18px] self-start inline-flex items-center gap-2 h-11 px-4 rounded-full text-[15px] font-semibold transition-colors",
              isComplete
                ? "bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700"
                : "bg-gray-200 text-gray-400 cursor-not-allowed",
            ].join(" ")}
          >
            {isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-gray-300 border-t-white rounded-full animate-spin" />
                Bergabung...
              </>
            ) : (
              <>
                Gabung Tim
                <ArrowRight size={18} strokeWidth={2} />
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
          onClose={() => setAlert(null)}
        />
      )}
    </>
  );
}