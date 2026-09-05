"use client";

import { useMemo, useState } from "react";
import { seekers } from "@/lib/data/admin";
import TableCard from "./TableCard";
import SearchInput from "./SearchInput";

export default function SeekerTable() {
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return seekers;
    return seekers.filter(
      (row) =>
        row.orgName.toLowerCase().includes(q) ||
        row.email.toLowerCase().includes(q) ||
        row.orgType.toLowerCase().includes(q) ||
        row.contactPerson.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <TableCard
      title="Daftar Seeker"
      countLabel={`${seekers.length} perusahaan / organisasi terdaftar`}
      toolbar={
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Cari nama perusahaan / email..."
          className="sm:w-[280px]"
        />
      }
    >
      <table className="w-full text-left border-collapse min-w-[960px]">
        <thead>
          <tr className="bg-gray-50 text-[12px] font-semibold uppercase tracking-wide text-gray-500">
            <th className="px-5 py-3 whitespace-nowrap">Nama Perusahaan / Organisasi</th>
            <th className="px-5 py-3 whitespace-nowrap">Email</th>
            <th className="px-5 py-3 whitespace-nowrap">Jenis</th>
            <th className="px-5 py-3 whitespace-nowrap">Kontak Person</th>
            <th className="px-5 py-3 whitespace-nowrap">Alamat Kantor</th>
            <th className="px-5 py-3 whitespace-nowrap text-center">Challenge Dibuat</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((row) => (
            <tr key={row.id} className="text-[14px] text-gray-700 hover:bg-gray-50/60 transition-colors">
              <td className="px-5 py-4 font-semibold text-gray-900 whitespace-nowrap">
                {row.orgName}
              </td>
              <td className="px-5 py-4 whitespace-nowrap">{row.email}</td>
              <td className="px-5 py-4 whitespace-nowrap">{row.orgType}</td>
              <td className="px-5 py-4 whitespace-nowrap">{row.contactPerson}</td>
              <td className="px-5 py-4 max-w-[260px]">{row.officeAddress}</td>
              <td className="px-5 py-4 text-center font-semibold text-gray-900">
                {row.challengesCreated}
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={6} className="px-5 py-10 text-center text-gray-400 text-[14px]">
                Tidak ada seeker yang cocok dengan pencarian.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </TableCard>
  );
}
