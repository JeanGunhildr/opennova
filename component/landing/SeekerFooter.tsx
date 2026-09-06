"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";

export default function SeekerFooter() {
  return (
    <footer
      id="kontak"
      aria-label="Footer Seeker"
      className="bg-[#141414] border-t border-[#262626] mt-24 py-12 px-6 text-white transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-12">
          {/* Brand Column (spans 2 cols on lg) */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              aria-label="OpenNova Beranda"
              className="inline-flex items-center gap-2.5 mb-4 rounded-full focus-visible:ring-2 focus-visible:ring-[#E30000]"
            >
              <Image
                src="/icon.svg"
                alt="OpenNova"
                width={32}
                height={32}
                className="object-contain shrink-0"
              />
              <span className="font-semibold text-[18px] tracking-tight text-white select-none leading-none">
                opennova
              </span>
            </Link>
            <p className="text-sm text-[#A4A4A4] leading-relaxed max-w-sm">
              Platform open innovation terdepan yang mempertemukan korporasi, BUMN, dan
              institusi dengan ribuan talenta inovator, periset, dan solver terbaik Indonesia.
            </p>
          </div>

          {/* Navigation Column 1: Solusi Seeker */}
          <div>
            <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-4">
              Solusi Seeker
            </h3>
            <ul className="space-y-2.5 text-sm text-[#A4A4A4]">
              <li>
                <Link
                  href="/seeker/challenges/new"
                  className="hover:text-white transition-colors"
                >
                  Buat Challenge
                </Link>
              </li>
              <li>
                <Link
                  href="/seeker/challenges"
                  className="hover:text-white transition-colors"
                >
                  Kelola Portfolio Challenge
                </Link>
              </li>
              <li>
                <Link
                  href="#kolaborasi"
                  className="hover:text-white transition-colors"
                >
                  Skema Escrow & Pendanaan
                </Link>
              </li>
              <li>
                <Link
                  href="#insentif"
                  className="hover:text-white transition-colors"
                >
                  Perlindungan HAKI
                </Link>
              </li>
            </ul>
          </div>

          {/* Navigation Column 2: Kategori Inovasi */}
          <div>
            <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-4">
              Kategori Inovasi
            </h3>
            <ul className="space-y-2.5 text-sm text-[#A4A4A4]">
              <li>
                <Link href="#challenge" className="hover:text-white transition-colors">
                  Artificial Intelligence & IoT
                </Link>
              </li>
              <li>
                <Link href="#challenge" className="hover:text-white transition-colors">
                  Clean Energy & Sustainability
                </Link>
              </li>
              <li>
                <Link href="#challenge" className="hover:text-white transition-colors">
                  Biomedis & Health Tech
                </Link>
              </li>
              <li>
                <Link href="#challenge" className="hover:text-white transition-colors">
                  Agri-Tech & Ketahanan Pangan
                </Link>
              </li>
            </ul>
          </div>

          {/* Navigation Column 3: Dukungan & Legal */}
          <div>
            <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-4">
              Dukungan & Legal
            </h3>
            <ul className="space-y-2.5 text-sm text-[#A4A4A4]">
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Syarat & Ketentuan
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-white transition-colors">
                  Pusat Bantuan Seeker
                </Link>
              </li>
              <li className="pt-2">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Mail size={13} className="text-[#E30000]" />
                  <span>enterprise@opennova.id</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="pt-8 border-t border-[#262626] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>&copy; 2026 OpenNova. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="text-[#A4A4A4]">Platform Terverifikasi ISO/IEC 27001</span>
            <span className="w-1 h-1 rounded-full bg-gray-600" />
            <span className="text-[#A4A4A4]">Escrow Terproteksi</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
