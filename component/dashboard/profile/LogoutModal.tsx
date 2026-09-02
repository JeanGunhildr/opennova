"use client";

import { LogOut } from "lucide-react";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function LogoutModal({ isOpen, onClose, onConfirm }: LogoutModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.42)" }}
    >
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      <div className="relative bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.18)] w-full max-w-[400px] p-6 flex flex-col items-center text-center">
        <div className="w-[68px] h-[68px] rounded-full bg-gray-100 flex items-center justify-center mb-5 flex-shrink-0">
          <LogOut size={30} className="text-gray-700" strokeWidth={1.6} />
        </div>
        <h2 className="text-[20px] font-bold text-gray-900 mb-2 leading-tight">
          Keluar dari Sesi Akun?
        </h2>
        <p className="text-[14px] text-gray-500 leading-[1.55] mb-6 max-w-[300px]">
          Anda harus masuk kembali untuk mengakses ruang kerja dan challenge yang sedang aktif.
        </p>
        <div className="flex items-center gap-3 w-full">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-[42px] rounded-full border border-gray-300 text-gray-700 text-[14px] font-medium hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 h-[42px] rounded-full bg-gray-900 hover:bg-black text-white text-[14px] font-semibold transition-colors"
          >
            Ya, Keluar
          </button>
        </div>
      </div>
    </div>
  );
}