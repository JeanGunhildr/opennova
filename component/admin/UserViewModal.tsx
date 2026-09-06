"use client";

import { X, Building2, User, Mail, Phone, Calendar, Globe, FileText, Trophy, ShieldCheck } from "lucide-react";
import type { SeekerRow, SolverRow } from "@/lib/data/admin";
import { formatDateID } from "@/lib/data/admin";

export type ViewTargetUser =
  | (SeekerRow & { type: "seeker" })
  | (SolverRow & { type: "solver" });

interface UserViewModalProps {
  user: ViewTargetUser | null;
  onClose: () => void;
}

export default function UserViewModal({ user, onClose }: UserViewModalProps) {
  if (!user) return null;

  const isSeeker = user.type === "seeker";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white border border-gray-200 rounded-[20px] max-w-[540px] w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-amber-400 font-bold shrink-0">
              {isSeeker ? <Building2 size={20} /> : <User size={20} />}
            </div>
            <div>
              <h2 className="text-[17px] font-bold leading-tight">
                {isSeeker ? user.orgName : user.fullName}
              </h2>
              <span className="text-[12px] text-gray-300 inline-flex items-center gap-1 mt-0.5">
                <ShieldCheck size={13} className="text-emerald-400" />
                {isSeeker ? "Detail Profil Seeker" : "Detail Profil Solver"}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Tutup"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-[13.5px]">
          {isSeeker ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3.5 rounded-[12px] border border-gray-100">
                  <span className="text-gray-400 text-[11px] font-semibold uppercase tracking-wide block mb-1">
                    Nama Perusahaan / Organisasi
                  </span>
                  <span className="font-semibold text-gray-900 block">{user.orgName}</span>
                </div>

                <div className="bg-gray-50 p-3.5 rounded-[12px] border border-gray-100">
                  <span className="text-gray-400 text-[11px] font-semibold uppercase tracking-wide block mb-1 flex items-center gap-1">
                    <Mail size={12} /> Email (Auth)
                  </span>
                  <span className="font-medium text-gray-900 block break-all">{user.email}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3.5 rounded-[12px] border border-gray-100">
                  <span className="text-gray-400 text-[11px] font-semibold uppercase tracking-wide block mb-1">
                    Jenis Organisasi
                  </span>
                  <span className="font-medium text-gray-800 block">{user.orgType || "Perusahaan Swasta"}</span>
                </div>

                <div className="bg-gray-50 p-3.5 rounded-[12px] border border-gray-100">
                  <span className="text-gray-400 text-[11px] font-semibold uppercase tracking-wide block mb-1">
                    Kontak Person (Perwakilan)
                  </span>
                  <span className="font-medium text-gray-800 block">{user.contactPerson}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3.5 rounded-[12px] border border-gray-100">
                  <span className="text-gray-400 text-[11px] font-semibold uppercase tracking-wide block mb-1 flex items-center gap-1">
                    <Phone size={12} /> Telepon / HP
                  </span>
                  <span className="font-medium text-gray-800 block">{user.phone || "—"}</span>
                </div>

                <div className="bg-gray-50 p-3.5 rounded-[12px] border border-gray-100">
                  <span className="text-gray-400 text-[11px] font-semibold uppercase tracking-wide block mb-1 flex items-center gap-1">
                    <Globe size={12} /> Website / Domain
                  </span>
                  <span className="font-medium text-gray-800 block truncate">{user.website || "—"}</span>
                </div>
              </div>

              {user.companyDescription && (
                <div className="bg-gray-50 p-3.5 rounded-[12px] border border-gray-100">
                  <span className="text-gray-400 text-[11px] font-semibold uppercase tracking-wide block mb-1 flex items-center gap-1">
                    <FileText size={12} /> Deskripsi Perusahaan
                  </span>
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed">{user.companyDescription}</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                <div className="bg-amber-50/60 p-3.5 rounded-[12px] border border-amber-100 flex items-center justify-between">
                  <span className="text-amber-900 text-[12px] font-semibold flex items-center gap-1.5">
                    <Trophy size={14} className="text-amber-600" />
                    Challenge Dibuat
                  </span>
                  <span className="text-lg font-black text-amber-700">{user.challengesCreated}</span>
                </div>

                <div className="bg-gray-50 p-3.5 rounded-[12px] border border-gray-100 flex items-center justify-between text-[12px]">
                  <span className="text-gray-500 font-medium flex items-center gap-1">
                    <Calendar size={13} />
                    Terdaftar
                  </span>
                  <span className="text-gray-700 font-semibold">
                    {user.createdAt ? formatDateID(user.createdAt) : "—"}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3.5 rounded-[12px] border border-gray-100">
                  <span className="text-gray-400 text-[11px] font-semibold uppercase tracking-wide block mb-1">
                    Nama Lengkap
                  </span>
                  <span className="font-semibold text-gray-900 block">{user.fullName}</span>
                </div>

                <div className="bg-gray-50 p-3.5 rounded-[12px] border border-gray-100">
                  <span className="text-gray-400 text-[11px] font-semibold uppercase tracking-wide block mb-1 flex items-center gap-1">
                    <Mail size={12} /> Email (Auth)
                  </span>
                  <span className="font-medium text-gray-900 block break-all">{user.email}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3.5 rounded-[12px] border border-gray-100">
                  <span className="text-gray-400 text-[11px] font-semibold uppercase tracking-wide block mb-1 flex items-center gap-1">
                    <Phone size={12} /> No. WhatsApp / HP
                  </span>
                  <span className="font-medium text-gray-800 block">{user.whatsapp || "—"}</span>
                </div>

                <div className="bg-gray-50 p-3.5 rounded-[12px] border border-gray-100">
                  <span className="text-gray-400 text-[11px] font-semibold uppercase tracking-wide block mb-1">
                    Institusi / Alamat
                  </span>
                  <span className="font-medium text-gray-800 block">
                    {user.institution && user.institution !== "—"
                      ? user.institution
                      : user.address && user.address !== "—"
                      ? user.address
                      : "—"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                <div className="bg-emerald-50/60 p-3.5 rounded-[12px] border border-emerald-100 flex items-center justify-between">
                  <span className="text-emerald-900 text-[12px] font-semibold flex items-center gap-1.5">
                    <Trophy size={14} className="text-emerald-600" />
                    Challenge Diikuti
                  </span>
                  <span className="text-lg font-black text-emerald-700">{user.challengesJoined}</span>
                </div>

                <div className="bg-gray-50 p-3.5 rounded-[12px] border border-gray-100 flex items-center justify-between text-[12px]">
                  <span className="text-gray-500 font-medium flex items-center gap-1">
                    <Calendar size={13} />
                    Terdaftar
                  </span>
                  <span className="text-gray-700 font-semibold">
                    {user.createdAt ? formatDateID(user.createdAt) : "—"}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="h-10 px-6 rounded-full bg-gray-900 hover:bg-gray-800 text-white text-[13px] font-semibold transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
