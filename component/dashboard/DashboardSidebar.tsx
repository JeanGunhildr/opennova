"use client";

import { useState } from "react";
import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  Briefcase,
  Trophy,
  Bell,
  ChevronRight,
  Menu,
  X,
  Users
} from "lucide-react";
import { OpenNovaLogo } from "@/component/landing/Logo";
import { BsPeople } from "react-icons/bs";

interface NavItem {
  label: string;
  href: string;
  Icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
  badge?: number;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Jelajah",    href: "/solver",              Icon: Compass   },
  { label: "Ruang Kerja",href: "/solver/workspace",    Icon: Briefcase },
  { label: "Tim Anda",   href: "/solver/team",         Icon: Users    },
  { label: "Perolehan",  href: "/solver/earnings",     Icon: Trophy    },
  { label: "Notifikasi", href: "/solver/notifications",Icon: Bell, badge: 3 },
];

const MOCK_USER = {
  name: "Irfan Maulana",
  email: "irfan@example.com",
  initials: "IM",
};

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full py-8 px-5">
      {/* Brand */}
      <div className="flex items-center justify-between mb-12">
        <OpenNovaLogo />
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            aria-label="Tutup menu"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1" aria-label="Navigasi dashboard">
        <p className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider pl-4 mb-2.5">
          Menu
        </p>
        <ul className="space-y-1">
          {NAV_ITEMS.map(({ label, href, Icon, badge }) => {
            const isActive =
              href === "/solver"
                ? pathname === "/solver"
                : pathname.startsWith(href);

            return (
              <li key={href}>
                <Link
                  href={href}
                  className={[
                    "flex items-center gap-3.5 h-[46px] px-3.5 rounded-[9px] text-[15px] font-medium transition-colors",
                    isActive
                      ? "bg-secondary-100 text-primary-500"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                  ].join(" ")}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon
                    size={20}
                    className={isActive ? "text-primary-500" : "text-gray-500"}
                    strokeWidth={1.8}
                  />
                  <span className="flex-1">{label}</span>
                  {badge && !isActive && (
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary-500 text-white text-[11px] font-bold leading-none">
                      {badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Profile block */}
      <div className="mt-6 flex items-center gap-3 border border-gray-300 rounded-[10px] p-2.5 bg-white">
        <div className="flex-shrink-0 w-11 h-11 rounded-full bg-primary-500 flex items-center justify-center text-white text-[13px] font-bold select-none">
          {MOCK_USER.initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold text-gray-900 truncate leading-tight">
            {MOCK_USER.name}
          </p>
          <p className="text-[12px] text-gray-500 truncate leading-tight mt-0.5">
            {MOCK_USER.email}
          </p>
        </div>
        <ChevronRight size={18} className="text-gray-400 flex-shrink-0" strokeWidth={1.8} />
      </div>
    </div>
  );
}

export default function DashboardSidebar() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      {/* ── Desktop sidebar ─────────────────────────────── */}
      <aside
        className="hidden lg:flex flex-col w-[290px] flex-shrink-0 bg-white border-r border-[#E6E6E6] sticky top-0 h-screen overflow-y-auto"
        aria-label="Sidebar navigasi"
      >
        <SidebarContent />
      </aside>

      {/* ── Mobile top bar ──────────────────────────────── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-white border-b border-[#E6E6E6] flex items-center px-4 gap-3">
        <button
          onClick={() => setDrawerOpen(true)}
          className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="Buka menu"
        >
          <Menu size={20} />
        </button>
        <OpenNovaLogo />
      </div>

      {/* ── Mobile drawer overlay ───────────────────────── */}
      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
          {/* Drawer panel */}
          <div className="relative w-[290px] bg-white h-full overflow-y-auto shadow-xl">
            <SidebarContent onClose={() => setDrawerOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}