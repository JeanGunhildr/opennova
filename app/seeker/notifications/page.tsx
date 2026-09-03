"use client";

import { useState } from "react";
import NotificationsHeader from "@/component/seeker/notifications/NotificationsHeader";
import NotificationList from "@/component/seeker/notifications/NotificationList";
import NotificationEmptyState from "@/component/seeker/notifications/NotificationEmptyState";
import type { Notification } from "@/component/seeker/notifications/NotificationItem";

const INITIAL: Notification[] = [
  {
    id: "n1",
    type: "challenge",
    title: "Challenge Anda memasuki tahap Penjurian Ahli",
    description: "Challenge \"AI Monitoring Jaringan Fiber Optik\" kini dalam tahap seleksi oleh panel ahli. Hasil penilaian akan tersedia dalam 5 hari kerja.",
    timestamp: "2 jam lalu",
    read: false,
    actionLabel: "Lihat Detail",
  },
  {
    id: "n2",
    type: "submission",
    title: "3 submission baru diterima",
    description: "Challenge \"Platform Manajemen Energi Smart Grid\" menerima 3 submission dalam 24 jam terakhir. Total kini mencapai 41 peserta.",
    timestamp: "5 jam lalu",
    read: false,
    actionLabel: "Lihat Submission",
  },
  {
    id: "n3",
    type: "timeline",
    title: "Batas pendaftaran peserta dalam 3 hari",
    description: "Challenge \"AI Monitoring Jaringan Fiber Optik\" akan menutup pendaftaran pada 12 September 2026. Segera pastikan materi challenge sudah final.",
    timestamp: "1 hari lalu",
    read: false,
  },
  {
    id: "n4",
    type: "challenge",
    title: "Pemenang Challenge berhasil ditetapkan",
    description: "Proses penetapan pemenang Challenge \"Inovasi Fintech UMKM\" selesai. Tim \"NovaPay\" dinyatakan sebagai pemenang. Sertifikat akan diterbitkan segera.",
    timestamp: "2 hari lalu",
    read: true,
    actionLabel: "Lihat Pengumuman",
  },
  {
    id: "n5",
    type: "system",
    title: "Berkas otorisasi sertifikat berhasil disimpan",
    description: "Data tanda tangan dan informasi penandatangan Anda telah diperbarui dan akan digunakan pada sertifikat challenge berikutnya.",
    timestamp: "4 hari lalu",
    read: true,
  },
  {
    id: "n6",
    type: "submission",
    title: "Submission melewati batas waktu otomatis ditutup",
    description: "Challenge \"Solusi Logistik Last-Mile\" telah melewati tanggal batas akhir. Semua submission yang masuk sebelum tenggat tetap valid untuk dinilai.",
    timestamp: "6 hari lalu",
    read: true,
  },
];

export default function SeekerNotificationsPage() {
  const [items, setItems] = useState<Notification[]>(INITIAL);
  const hasUnread = items.some(n => !n.read);

  function markAllRead() {
    setItems(prev => prev.map(n => ({ ...n, read: true })));
  }

  return (
    <div className="min-h-screen pt-14 lg:pt-0" style={{ background: "#171717" }}>
      <div className="w-full max-w-[1160px] mx-auto px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 py-8 lg:py-8 xl:py-10">
        <NotificationsHeader hasUnread={hasUnread} onMarkAllRead={markAllRead} />
        <div className="mt-6">
          {items.length === 0 ? (
            <NotificationEmptyState />
          ) : (
            <NotificationList items={items} />
          )}
        </div>
      </div>
    </div>
  );
}