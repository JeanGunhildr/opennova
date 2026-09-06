"use client";

import { useMemo, useState } from "react";
import { Eye, Edit, Check } from "lucide-react";
import type { SolverRow } from "@/lib/data/admin";
import TableCard from "./TableCard";
import SearchInput from "./SearchInput";
import UserViewModal from "./UserViewModal";
import UserEditModal from "./UserEditModal";
import type { ViewTargetUser } from "./UserViewModal";

interface SolverTableProps {
  solvers: SolverRow[];
}

export default function SolverTable({ solvers }: SolverTableProps) {
  const [query, setQuery] = useState("");
  const [viewUser, setViewUser] = useState<ViewTargetUser | null>(null);
  const [editUser, setEditUser] = useState<ViewTargetUser | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return solvers;
    return solvers.filter(
      (row) =>
        row.fullName.toLowerCase().includes(q) ||
        row.email.toLowerCase().includes(q) ||
        row.address.toLowerCase().includes(q) ||
        (row.institution && row.institution.toLowerCase().includes(q))
    );
  }, [solvers, query]);

  return (
    <>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-[12px] shadow-lg bg-[#168A39] text-white text-xs font-semibold flex items-center gap-2.5 transition-all">
          <Check size={16} strokeWidth={2.5} />
          <span>{toastMessage}</span>
        </div>
      )}

      <TableCard
        title="Daftar Solver"
        countLabel={`${solvers.length} individu / anggota tim terdaftar`}
        toolbar={
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Cari nama / email solver..."
            className="sm:w-[280px]"
          />
        }
      >
        <table className="w-full text-left border-collapse min-w-[880px]">
          <thead>
            <tr className="bg-gray-50 text-[12px] font-semibold uppercase tracking-wide text-gray-500">
              <th className="px-5 py-3 whitespace-nowrap">Nama Lengkap</th>
              <th className="px-5 py-3 whitespace-nowrap">Email</th>
              <th className="px-5 py-3 whitespace-nowrap">No. WhatsApp / HP</th>
              <th className="px-5 py-3 whitespace-nowrap">Institusi / Alamat</th>
              <th className="px-5 py-3 whitespace-nowrap text-center">Challenge Diikuti</th>
              <th className="px-5 py-3 whitespace-nowrap text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((row) => (
              <tr key={row.id} className="text-[14px] text-gray-700 hover:bg-gray-50/60 transition-colors">
                <td className="px-5 py-4 font-semibold text-gray-900 whitespace-nowrap">
                  {row.fullName}
                </td>
                <td className="px-5 py-4 whitespace-nowrap">{row.email}</td>
                <td className="px-5 py-4 whitespace-nowrap">{row.whatsapp}</td>
                <td className="px-5 py-4 max-w-[240px] truncate">{row.address}</td>
                <td className="px-5 py-4 text-center font-semibold text-gray-900">
                  {row.challengesJoined}
                </td>
                <td className="px-5 py-4 whitespace-nowrap">
                  <div className="flex items-center justify-center gap-1.5">
                    {/* Action 1: View */}
                    <button
                      type="button"
                      onClick={() => setViewUser({ ...row, type: "solver" })}
                      className="h-8 px-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 text-[12px] font-medium inline-flex items-center gap-1 transition-colors cursor-pointer"
                      title="Lihat Profil Solver"
                    >
                      <Eye size={14} />
                      <span>Lihat</span>
                    </button>

                    {/* Action 2: Edit */}
                    <button
                      type="button"
                      onClick={() => setEditUser({ ...row, type: "solver" })}
                      className="h-8 px-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 text-[12px] font-medium inline-flex items-center gap-1 transition-colors cursor-pointer"
                      title="Edit Profil Solver"
                    >
                      <Edit size={14} />
                      <span>Edit</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-gray-400 text-[14px]">
                  Tidak ada solver yang cocok dengan pencarian.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </TableCard>

      {/* View Modal */}
      <UserViewModal user={viewUser} onClose={() => setViewUser(null)} />

      {/* Edit Modal */}
      <UserEditModal
        user={editUser}
        onClose={() => setEditUser(null)}
        onSuccess={(msg) => showToast(msg)}
      />
    </>
  );
}
