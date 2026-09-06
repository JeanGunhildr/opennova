"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import LogoutConfirmationModal from "@/component/seeker/profile/LogoutConfirmationModal";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function SolverAccountActionsCard() {
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();

  async function handleConfirmLogout() {
    setModalOpen(false);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <>
      <div className="rounded-[16px] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 bg-white border border-[#E6E6E6] shadow-xs">
        <div className="flex flex-col gap-0.5">
          <p className="text-[15px] font-semibold text-gray-900">Keluar Akun</p>
          <p className="text-[12px] text-gray-500">
            Akhiri sesi aktif Anda dari dashboard Solver.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="self-start sm:self-auto shrink-0 inline-flex items-center gap-2 rounded-full text-[13px] font-semibold h-10 px-4 border border-gray-300 text-gray-700 hover:border-red-500 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
        >
          <LogOut size={15} strokeWidth={2} />
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
