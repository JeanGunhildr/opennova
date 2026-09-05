import type { ReactNode } from "react";

interface TableCardProps {
  title: string;
  countLabel?: string;
  toolbar?: ReactNode;
  children: ReactNode;
}

export default function TableCard({
  title,
  countLabel,
  toolbar,
  children,
}: TableCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-[16px] shadow-[0_2px_10px_rgba(0,0,0,0.04)] overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 sm:p-5 border-b border-gray-100">
        <div>
          <h2 className="text-[16px] font-bold text-gray-900">{title}</h2>
          {countLabel && (
            <p className="text-[13px] text-gray-400 mt-0.5">{countLabel}</p>
          )}
        </div>
        {toolbar && <div className="flex-shrink-0 w-full sm:w-auto">{toolbar}</div>}
      </div>
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}
