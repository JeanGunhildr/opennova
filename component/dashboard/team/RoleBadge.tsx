import type { TeamRole } from "@/lib/data/team";

interface RoleBadgeProps {
  role: TeamRole;
}

export default function RoleBadge({ role }: RoleBadgeProps) {
  const isLeader = role === "leader";
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 h-[34px] px-3 rounded-full text-[13px] font-medium whitespace-nowrap flex-shrink-0",
        isLeader ? "bg-[#E5F3E8] text-[#379B49]" : "bg-gray-100 text-gray-800",
      ].join(" ")}
    >
      <span
        className={[
          "w-1.5 h-1.5 rounded-full flex-shrink-0",
          isLeader ? "bg-[#379B49]" : "bg-gray-600",
        ].join(" ")}
        aria-hidden="true"
      />
      {isLeader ? "Ketua Tim" : "Anggota Tim"}
    </span>
  );
}