"use client";

import Link from "next/link";
import { navLinks } from "@/lib/data/landing";
import { OpenNovaLogo } from "@/component/landing/Logo";
import { useLandingMode } from "@/component/landing/LandingModeContext";
import SeekerFooter from "@/component/landing/SeekerFooter";

const footerColumns = [
  {
    heading: "Platform",
    links: navLinks as ReadonlyArray<{ label: string; href: string }>,
  },
  {
    heading: "Perusahaan",
    links: [
      { label: "Tentang Kami", href: "/about" },
      { label: "Blog",         href: "/blog"  },
      { label: "Karir",        href: "/careers" },
    ],
  },
  {
    heading: "Dukungan",
    links: [
      { label: "Pusat Bantuan",       href: "/help"    },
      { label: "Kebijakan Privasi",   href: "/privacy" },
      { label: "Syarat & Ketentuan",  href: "/terms"   },
    ],
  },
] as const;

export default function Footer() {
  const { isSeeker } = useLandingMode();

  if (isSeeker) {
    return <SeekerFooter />;
  }

  return (
    <footer
      id="kontak"
      className="bg-gray-50 border-t border-gray-200 text-gray-900 transition-colors duration-300"
      aria-label="Footer situs"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-8 lg:px-10 py-14 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              aria-label="OpenNova beranda"
              className="inline-block mb-4 rounded-full"
            >
              <OpenNovaLogo theme={isSeeker ? "dark" : "light"} />
            </Link>
            <p className={`text-sm leading-relaxed max-w-xs transition-colors ${
              isSeeker ? "text-[#A4A4A4]" : "text-gray-500"
            }`}>
              Platform inovasi terbuka yang menghubungkan solver terbaik dengan
              tantangan nyata dari perusahaan-perusahaan terkemuka Indonesia.
            </p>
          </div>

          {/* Link columns */}
          {footerColumns.map((col) => (
            <div key={col.heading}>
              <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-4">
                {col.heading}
              </h3>
              <ul className="space-y-3" role="list">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`text-sm transition-colors duration-150 ${
                        isSeeker
                          ? "text-[#A4A4A4] hover:text-white"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className={`mt-12 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 ${
          isSeeker ? "border-[#262626]" : "border-gray-200"
        }`}>
          <p className="text-xs text-gray-400 order-2 sm:order-1">
            &copy; 2026 OpenNova. Hak cipta dilindungi.
          </p>
          <div className="flex items-center gap-5 order-1 sm:order-2">
            <Link
              href="/privacy"
              className={`text-xs transition-colors ${
                isSeeker ? "text-gray-400 hover:text-gray-200" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              Kebijakan Privasi
            </Link>
            <Link
              href="/terms"
              className={`text-xs transition-colors ${
                isSeeker ? "text-gray-400 hover:text-gray-200" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              Syarat & Ketentuan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
