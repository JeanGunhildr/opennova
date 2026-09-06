"use client";

import { useState, useEffect } from "react";
import { X, Loader2, Save, Building2, User, Lock, AlertCircle } from "lucide-react";
import type { ViewTargetUser } from "./UserViewModal";
import { updateAdminUserAction } from "@/lib/actions/admin-user";

interface UserEditModalProps {
  user: ViewTargetUser | null;
  onClose: () => void;
  onSuccess: (msg: string) => void;
}

export default function UserEditModal({
  user,
  onClose,
  onSuccess,
}: UserEditModalProps) {
  const [isPending, setIsPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form states for Seeker
  const [companyName, setCompanyName] = useState("");
  const [companyType, setCompanyType] = useState("");
  const [representativeName, setRepresentativeName] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");

  // Form states for Solver
  const [fullName, setFullName] = useState("");
  const [institution, setInstitution] = useState("");

  useEffect(() => {
    if (user) {
      setErrorMessage(null);
      if (user.type === "seeker") {
        setCompanyName(user.orgName || "");
        setCompanyType(user.orgType || "Perusahaan Swasta");
        setRepresentativeName(user.contactPerson || "");
        setPhone(user.phone && user.phone !== "—" ? user.phone : "");
        setWebsite(user.website || "");
        setCompanyDescription(user.companyDescription || "");
      } else {
        setFullName(user.fullName || "");
        setPhone(user.whatsapp && user.whatsapp !== "—" ? user.whatsapp : "");
        const inst =
          user.institution && user.institution !== "—"
            ? user.institution
            : user.address && user.address !== "—"
            ? user.address
            : "";
        setInstitution(inst);
      }
    }
  }, [user]);

  if (!user) return null;

  const isSeeker = user.type === "seeker";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isPending) return;

    setIsPending(true);
    setErrorMessage(null);

    try {
      let payload;
      if (isSeeker) {
        payload = {
          companyName,
          companyType,
          representativeName,
          phone,
          website,
          companyDescription,
        };
      } else {
        payload = {
          fullName,
          phone,
          institution,
        };
      }

      const res = await updateAdminUserAction(user.id, user.type, payload);

      if (res.success) {
        onSuccess(
          isSeeker
            ? `Profil Seeker "${companyName || user.orgName}" berhasil diperbarui!`
            : `Profil Solver "${fullName || user.fullName}" berhasil diperbarui!`
        );
        onClose();
      } else {
        setErrorMessage(res.error || "Gagal memperbarui pengguna.");
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "Terjadi kesalahan server.");
    } finally {
      setIsPending(false);
    }
  };

  const inputCls =
    "w-full h-10 px-3.5 rounded-[10px] border border-gray-300 bg-white text-[13.5px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#E30000] focus:ring-2 focus:ring-[#E30000]/15 transition-all";

  const labelCls = "block text-[12px] font-bold text-gray-700 uppercase tracking-wider mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white border border-gray-200 rounded-[20px] max-w-[540px] w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#E30000]/20 border border-[#E30000]/40 flex items-center justify-center text-white font-bold shrink-0">
              {isSeeker ? <Building2 size={20} /> : <User size={20} />}
            </div>
            <div>
              <h2 className="text-[17px] font-bold leading-tight">
                Edit {isSeeker ? "Profil Seeker" : "Profil Solver"}
              </h2>
              <span className="text-[12px] text-gray-300">
                Ubah informasi akun pengguna
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50"
            title="Batal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 overflow-y-auto space-y-4">
            {/* Error Banner Alert */}
            {errorMessage && (
              <div className="p-3.5 rounded-[12px] bg-red-50 border border-red-200 text-red-700 text-[13px] font-medium flex items-center gap-2.5">
                <AlertCircle size={16} className="shrink-0 text-red-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Read-Only Information Box */}
            <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-[12px] grid grid-cols-1 sm:grid-cols-2 gap-3 text-[12px]">
              <div>
                <span className="text-gray-400 font-semibold block uppercase text-[10px]">Email (Auth)</span>
                <span className="font-semibold text-gray-800 flex items-center gap-1 mt-0.5">
                  <Lock size={12} className="text-gray-400" />
                  {user.email}
                </span>
              </div>
              <div>
                <span className="text-gray-400 font-semibold block uppercase text-[10px]">Role Pengguna</span>
                <span className="font-bold text-gray-900 uppercase tracking-wider mt-0.5 block">
                  {user.type}
                </span>
              </div>
            </div>

            {isSeeker ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Nama Perusahaan / Organisasi</label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      required
                      placeholder="PT Nama Perusahaan"
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label className={labelCls}>Jenis Organisasi</label>
                    <select
                      value={companyType}
                      onChange={(e) => setCompanyType(e.target.value)}
                      className={inputCls}
                    >
                      <option value="Perusahaan Swasta">Perusahaan Swasta</option>
                      <option value="BUMN">BUMN / BUMD</option>
                      <option value="Instansi Pemerintah">Instansi Pemerintah</option>
                      <option value="Lembaga Non-Profit">Lembaga Non-Profit</option>
                      <option value="Startup">Startup</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Kontak Person (Perwakilan)</label>
                    <input
                      type="text"
                      value={representativeName}
                      onChange={(e) => setRepresentativeName(e.target.value)}
                      required
                      placeholder="Nama Lengkap Perwakilan"
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label className={labelCls}>No. Telepon / WhatsApp</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="081234567890"
                      className={inputCls}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Website / Domain</label>
                  <input
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://company.co.id"
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className={labelCls}>Deskripsi Perusahaan</label>
                  <textarea
                    value={companyDescription}
                    onChange={(e) => setCompanyDescription(e.target.value)}
                    rows={3}
                    placeholder="Deskripsi singkat profil perusahaan..."
                    className="w-full p-3 rounded-[10px] border border-gray-300 bg-white text-[13.5px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#E30000] focus:ring-2 focus:ring-[#E30000]/15 transition-all resize-none"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Nama Lengkap</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      placeholder="Nama Lengkap Solver"
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label className={labelCls}>No. WhatsApp / HP</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="081234567890"
                      className={inputCls}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Institusi / Alamat</label>
                  <input
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="Universitas / Perusahaan / Kota"
                    className={inputCls}
                  />
                </div>
              </>
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="h-10 px-4 rounded-full border border-gray-300 text-gray-700 text-[13px] font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 cursor-pointer"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="h-10 px-6 rounded-full bg-[#E30000] hover:bg-[#C10000] text-white text-[13px] font-semibold flex items-center gap-2 transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
            >
              {isPending ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  <Save size={15} />
                  <span>Simpan Perubahan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
