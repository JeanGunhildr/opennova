"use client";

import { useMemo, useState } from "react";
import { FileCheck2 } from "lucide-react";
import { certificateAuthorizations } from "@/lib/data/admin";
import TableCard from "./TableCard";
import SearchInput from "./SearchInput";
import { StatusPill } from "./StatusPill";

export default function AuthorizationFilesTable() {
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return certificateAuthorizations;
    return certificateAuthorizations.filter(
      (row) =>
        row.orgName.toLowerCase().includes(q) ||
        row.picName.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <TableCard
      title="Berkas Otorisasi Sertifikat Seeker"
      countLabel="Data penanggung jawab & tanda tangan untuk melengkapi sertifikat pemenang"
      toolbar={
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Cari nama perusahaan / PIC..."
          className="sm:w-[280px]"
        />
      }
    >
      <table className="w-full text-left border-collapse min-w-[820px]">
        <thead>
          <tr className="bg-gray-50 text-[12px] font-semibold uppercase tracking-wide text-gray-500">
            <th className="px-5 py-3 whitespace-nowrap">Nama Perusahaan / Organisasi</th>
            <th className="px-5 py-3 whitespace-nowrap">Nama Penanggung Jawab</th>
            <th className="px-5 py-3 whitespace-nowrap">Jabatan / Posisi</th>
            <th className="px-5 py-3 whitespace-nowrap">Tanda Tangan / Cap Resmi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((row) => (
            <tr key={row.id} className="text-[14px] text-gray-700 hover:bg-gray-50/60 transition-colors">
              <td className="px-5 py-4 font-semibold text-gray-900 whitespace-nowrap">
                {row.orgName}
              </td>
              <td className="px-5 py-4 whitespace-nowrap">{row.picName}</td>
              <td className="px-5 py-4 whitespace-nowrap">{row.position}</td>
              <td className="px-5 py-4 whitespace-nowrap">
                {row.hasSignature ? (
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary-500 hover:text-primary-600 transition-colors"
                  >
                    <FileCheck2 size={15} strokeWidth={2} />
                    {row.signatureFileName}
                  </button>
                ) : (
                  <StatusPill label="Belum diunggah" tone="red" />
                )}
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={4} className="px-5 py-10 text-center text-gray-400 text-[14px]">
                Tidak ada data yang cocok dengan pencarian.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </TableCard>
  );
}
