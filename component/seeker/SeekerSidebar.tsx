"use client";
import { createClient } from "@/lib/supabase/client";
import { LogOut } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Trophy,
  FileText,
  Bell,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import Image from "next/image";

interface NavItem {
  label: string;
  href: string;
  Icon: React.ComponentType<{
    size?: number;
    className?: string;
    strokeWidth?: number;
  }>;
  badge?: number;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/seeker", Icon: LayoutDashboard },
  { label: "Challenge Anda", href: "/seeker/challenges", Icon: Trophy },
  { label: "Legal & Dokumen", href: "/seeker/legal", Icon: FileText },
  { label: "Notifikasi", href: "/seeker/notifications", Icon: Bell, badge: 4 },
];

interface SeekerSidebarProps {
  companyName: string;
  fullName: string;
  email: string;
  initials: string;
}

function SidebarContent({
  companyName,
  fullName,
  email,
  initials,
  onClose,
}: SeekerSidebarProps & { onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) { console.error("Logout error:", error); return; }
    router.push("/");
    router.refresh();
  };

  return (
    <div className="flex flex-col h-full py-6 px-[26px]">
      {/* Brand */}
      <div className="flex items-center justify-between">
        <Link href="/seeker" className="flex items-center gap-2.5">
          <Image src="/icon.svg" alt="OpenNova" width={32} height={32} className="w-8 h-8 object-contain shrink-0" priority />
          <span className="text-base font-bold tracking-tight text-white">opennova</span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-1 rounded-lg text-gray-500 hover:bg-white/10">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Brand divider */}
      <div className="my-5 h-px" style={{ background: "#373737" }} />

      {/* Greeting */}
      <div className="pb-6" style={{ borderBottom: "1px solid #373737" }}>
        <p className="font-medium text-white leading-[1.1]" style={{ fontSize: "26px" }}>
          Selamat Datang Kembali!
        </p>
        <p className="mt-1.5 text-[13px]" style={{ color: "#A4A4A4" }}>
          {companyName}
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 mt-5" aria-label="Navigasi Seeker">
        <p className="text-[13px] font-semibold uppercase tracking-wider mb-3 pl-1" style={{ color: "#737373" }}>
          Menu
        </p>
        <ul className="space-y-1">
          {NAV_ITEMS.map(({ label, href, Icon, badge }) => {
            const isActive = href === "/seeker" ? pathname === "/seeker" : pathname.startsWith(href);
            return (
              <li key={href} className="relative">
                <Link
                  href={href}
                  className={["flex items-center gap-3 h-[44px] px-[14px] rounded-[9px] text-[16px] font-medium transition-all", isActive ? "text-white" : "hover:text-white"].join(" ")}
                  style={isActive ? { background: "linear-gradient(90deg, #303030 0%, #651717 100%)", border: "1px solid #5C5C5C", color: "#F7F7F7" } : { color: "#A4A4A4" }}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon size={18} className={isActive ? "text-white" : "text-[#737373]"} strokeWidth={1.8} />
                  <span className="flex-1">{label}</span>
                  {badge && (
                    <span className="flex items-center justify-center rounded-full text-[11px] font-bold leading-none"
                      style={{ minWidth: "20px", height: "20px", background: "#FFFFFF", color: "#171717", padding: "0 4px" }}>
                      {badge}
                    </span>
                  )}
                </Link>
                {isActive && (
                  <span className="absolute right-0 top-[8px] bottom-[8px] w-[4px] rounded-full" style={{ background: "#E30000" }} />
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Profile widget */}
      <div className="mt-auto rounded-[10px] p-3 flex flex-col gap-3" style={{ background: "#232323", border: "1px solid #373737" }}>
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-[14px] font-medium flex-shrink-0 select-none"
            style={{ background: "#373737", border: "1px solid #5C5C5C" }}>
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-semibold text-white truncate leading-tight">{fullName}</p>
            <p className="text-[12px] truncate leading-tight" style={{ color: "#737373" }}>{email}</p>
          </div>
          <ChevronRight size={16} style={{ color: "#5C5C5C" }} strokeWidth={1.8} className="flex-shrink-0" />
        </div>
        <Link href="/seeker/profile"
          className="w-full h-10 rounded-full text-white text-[14px] font-semibold bg-[#E30000] hover:bg-[#CC0000] transition-colors inline-flex items-center justify-center">
          Lihat Profil
        </Link>
      </div>
    </div>
  );
}

export default function SeekerSidebar({ companyName, fullName, email, initials }: SeekerSidebarProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:flex flex-col flex-shrink-0 sticky top-0 h-screen overflow-y-auto"
        style={{ width: "290px", minWidth: "290px", background: "#171717", borderRight: "1px solid #373737" }}
        aria-label="Sidebar navigasi Seeker">
        <SidebarContent companyName={companyName} fullName={fullName} email={email} initials={initials} />
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 flex items-center px-4 gap-3"
        style={{ background: "#171717", borderBottom: "1px solid #373737" }}>
        <button onClick={() => setDrawerOpen(true)} className="p-2 rounded-lg text-gray-400 hover:bg-white/10 transition-colors" aria-label="Buka menu">
          <Menu size={20} />
        </button>
        <Link href="/seeker" className="flex items-center gap-2">
          <Image src="/icon.svg" alt="OpenNova" width={28} height={28} className="w-7 h-7 object-contain shrink-0" priority />
          <span className="text-base font-bold tracking-tight text-white">opennova</span>
        </Link>
      </div>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setDrawerOpen(false)} aria-hidden="true" />
          <div className="relative w-[290px] h-full overflow-y-auto" style={{ background: "#171717" }}>
            <SidebarContent companyName={companyName} fullName={fullName} email={email} initials={initials} onClose={() => setDrawerOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
