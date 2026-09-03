import type { ReactNode } from "react";
import SeekerSidebar from "@/component/seeker/SeekerSidebar";

export default function SeekerLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen" style={{ background: "#171717" }}>
      <SeekerSidebar />
      <main className="flex-1 min-w-0 overflow-auto">
        {children}
      </main>
    </div>
  );
}