"use client";

import { useMemo, useState } from "react";
import { solvers } from "@/lib/data/admin";
import TableCard from "./TableCard";
import SearchInput from "./SearchInput";

export default function SolverTable() {
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return solvers;
    return solvers.filter(
      (row) =>
        row.fullName.toLowerCase().includes(q) ||
        row.email.toLowerCase().includes(q) ||
        row.address.toLowerCase().includes(q)
    );
  }, [query]);

  return (
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
            <th className="px-5 py-3 whitespace-nowrap">Alamat</th>
            <th className="px-5 py-3 whitespace-nowrap text-center">Challenge Diikuti</th>
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
              <td className="px-5 py-4 max-w-[240px]">{row.address}</td>
              <td className="px-5 py-4 text-center font-semibold text-gray-900">
                {row.challengesJoined}
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={5} className="px-5 py-10 text-center text-gray-400 text-[14px]">
                Tidak ada solver yang cocok dengan pencarian.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </TableCard>
  );
}
