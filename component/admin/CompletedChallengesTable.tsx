"use client";

import { useMemo, useState } from "react";
import {
  completedChallenges,
  formatDateID,
  formatRupiah,
  isSpecialCollab,
  platformFee,
} from "@/lib/data/admin";
import TableCard from "./TableCard";
import SearchInput from "./SearchInput";
import { BooleanMark } from "./StatusPill";

export default function CompletedChallengesTable() {
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return completedChallenges;
    return completedChallenges.filter(
      (row) =>
        row.name.toLowerCase().includes(q) ||
        row.seekerName.toLowerCase().includes(q) ||
        row.category.toLowerCase().includes(q)
    );
  }, [query]);

  const totalPlatformIncome = rows.reduce(
    (sum, row) => sum + platformFee(row.rewardAmount),
    0
  );

  return (
    <TableCard
      title="Challenge Selesai"
      countLabel={`${completedChallenges.length} challenge telah selesai \u2014 total pemasukan platform ${formatRupiah(
        totalPlatformIncome
      )}`}
      toolbar={
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Cari nama challenge / seeker..."
          className="sm:w-[280px]"
        />
      }
    >
      <table className="w-full text-left border-collapse min-w-[1040px]">
        <thead>
          <tr className="bg-gray-50 text-[12px] font-semibold uppercase tracking-wide text-gray-500">
            <th className="px-5 py-3 whitespace-nowrap">Nama Challenge</th>
            <th className="px-5 py-3 whitespace-nowrap">Kategori</th>
            <th className="px-5 py-3 whitespace-nowrap">Nominal Hadiah</th>
            <th className="px-5 py-3 whitespace-nowrap text-center">Kolaborasi Spesial</th>
            <th className="px-5 py-3 whitespace-nowrap">Tanggal Selesai</th>
            <th className="px-5 py-3 whitespace-nowrap text-center">Hadiah Diberikan</th>
            <th className="px-5 py-3 whitespace-nowrap text-center">Sertifikat Diberikan</th>
            <th className="px-5 py-3 whitespace-nowrap">Pemasukan Platform (10%)</th>
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
              <td className="px-5 py-4 whitespace-nowrap">{formatDateID(row.completedAt)}</td>
              <td className="px-5 py-4">
                <div className="flex justify-center">
                  <BooleanMark value={row.rewardPaid} />
                </div>
              </td>
              <td className="px-5 py-4">
                <div className="flex justify-center">
                  <BooleanMark value={row.certificateIssued} />
                </div>
              </td>
              <td className="px-5 py-4 whitespace-nowrap font-semibold text-emerald-600">
                {formatRupiah(platformFee(row.rewardAmount))}
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={8} className="px-5 py-10 text-center text-gray-400 text-[14px]">
                Tidak ada challenge yang cocok dengan pencarian.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </TableCard>
  );
}
