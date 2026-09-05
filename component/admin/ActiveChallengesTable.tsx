"use client";

import { useMemo, useState } from "react";
import {
  activeChallenges,
  formatDateID,
  formatRupiah,
  isSpecialCollab,
} from "@/lib/data/admin";
import TableCard from "./TableCard";
import SearchInput from "./SearchInput";
import { StatusPill, BooleanMark, activeChallengeStatusTone } from "./StatusPill";

export default function ActiveChallengesTable() {
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return activeChallenges;
    return activeChallenges.filter(
      (row) =>
        row.name.toLowerCase().includes(q) ||
        row.seekerName.toLowerCase().includes(q) ||
        row.category.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <TableCard
      title="Challenge Aktif"
      countLabel={`${activeChallenges.length} challenge sedang berjalan`}
      toolbar={
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Cari nama challenge / seeker..."
          className="sm:w-[280px]"
        />
      }
    >
      <table className="w-full text-left border-collapse min-w-[880px]">
        <thead>
          <tr className="bg-gray-50 text-[12px] font-semibold uppercase tracking-wide text-gray-500">
            <th className="px-5 py-3 whitespace-nowrap">Nama Challenge</th>
            <th className="px-5 py-3 whitespace-nowrap">Kategori</th>
            <th className="px-5 py-3 whitespace-nowrap">Nominal Hadiah</th>
            <th className="px-5 py-3 whitespace-nowrap text-center">Kolaborasi Spesial</th>
            <th className="px-5 py-3 whitespace-nowrap">Tanggal Dipublikasikan</th>
            <th className="px-5 py-3 whitespace-nowrap">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((row) => (
            <tr key={row.id} className="text-[14px] text-gray-700 hover:bg-gray-50/60 transition-colors">
              <td className="px-5 py-4 max-w-[280px]">
                <p className="font-semibold text-gray-900 leading-snug">{row.name}</p>
                <p className="text-[12.5px] text-gray-400 mt-0.5">{row.seekerName}</p>
              </td>
              <td className="px-5 py-4 whitespace-nowrap">{row.category}</td>
              <td className="px-5 py-4 whitespace-nowrap font-semibold text-gray-900">
                {formatRupiah(row.rewardAmount)}
              </td>
              <td className="px-5 py-4">
                <div className="flex justify-center">
                  <BooleanMark value={isSpecialCollab(row.rewardAmount)} />
                </div>
              </td>
              <td className="px-5 py-4 whitespace-nowrap">{formatDateID(row.publishedAt)}</td>
              <td className="px-5 py-4 whitespace-nowrap">
                <StatusPill label={row.status} tone={activeChallengeStatusTone(row.status)} />
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={6} className="px-5 py-10 text-center text-gray-400 text-[14px]">
                Tidak ada challenge yang cocok dengan pencarian.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </TableCard>
  );
}
