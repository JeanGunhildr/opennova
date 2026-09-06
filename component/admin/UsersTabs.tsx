"use client";

import { useState } from "react";
import { Building2, Users } from "lucide-react";
import SeekerTable from "./SeekerTable";
import SolverTable from "./SolverTable";
import type { SeekerRow, SolverRow } from "@/lib/data/admin";

type Tab = "seeker" | "solver";

interface UsersTabsProps {
  seekers: SeekerRow[];
  solvers: SolverRow[];
}

export default function UsersTabs({ seekers, solvers }: UsersTabsProps) {
  const [tab, setTab] = useState<Tab>("seeker");

  return (
    <div>
      <div className="inline-flex items-center gap-1 p-1 rounded-full bg-gray-100 mb-6">
        <button
          onClick={() => setTab("seeker")}
          className={[
            "flex items-center gap-2 h-10 px-4 rounded-full text-[14px] font-semibold transition-all cursor-pointer",
            tab === "seeker"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700",
          ].join(" ")}
        >
          <Building2 size={16} strokeWidth={2} />
          Seeker
          <span
            className={[
              "text-[11px] font-bold rounded-full px-2 py-0.5",
              tab === "seeker" ? "bg-[#E30000]/10 text-[#E30000]" : "bg-gray-200 text-gray-500",
            ].join(" ")}
          >
            {seekers.length}
          </span>
        </button>

        <button
          onClick={() => setTab("solver")}
          className={[
            "flex items-center gap-2 h-10 px-4 rounded-full text-[14px] font-semibold transition-all cursor-pointer",
            tab === "solver"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700",
          ].join(" ")}
        >
          <Users size={16} strokeWidth={2} />
          Solver
          <span
            className={[
              "text-[11px] font-bold rounded-full px-2 py-0.5",
              tab === "solver" ? "bg-[#E30000]/10 text-[#E30000]" : "bg-gray-200 text-gray-500",
            ].join(" ")}
          >
            {solvers.length}
          </span>
        </button>
      </div>

      {tab === "seeker" ? (
        <SeekerTable seekers={seekers} />
      ) : (
        <SolverTable solvers={solvers} />
      )}
    </div>
  );
}
