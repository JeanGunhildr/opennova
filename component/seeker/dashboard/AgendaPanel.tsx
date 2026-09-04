import { Calendar } from "lucide-react";

export interface AgendaItem {
  id: string;
  month: string;
  day: string;
  title: string;
  description: string;
}

interface AgendaPanelProps {
  agendas?: AgendaItem[];
}

export default function AgendaPanel({ agendas = [] }: AgendaPanelProps) {
  return (
    <div>
      {/* Panel header */}
      <div className="mb-4">
        <h2 className="text-white font-bold" style={{ fontSize: "20px" }}>
          Agenda Terdekat
        </h2>
      </div>

      {/* Content */}
      {agendas.length === 0 ? (
        <div
          className="rounded-[18px] p-8 text-center flex flex-col items-center justify-center min-h-[260px]"
          style={{ background: "#171717", border: "1px solid #373737" }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
            style={{ background: "#232323", border: "1px solid #373737" }}
          >
            <Calendar size={22} className="text-[#737373]" strokeWidth={1.7} />
          </div>
          <p className="text-white font-semibold text-[15px]">
            Belum Ada Agenda Terdekat
          </p>
          <p
            className="text-[12px] mt-1 max-w-[280px] leading-[1.5]"
            style={{ color: "#737373" }}
          >
            Agenda linimasa penjurian dan pengumuman akan ditampilkan di sini
            saat challenge aktif.
          </p>
        </div>
      ) : (
        <div
          className="rounded-[18px]"
          style={{
            background: "#171717",
            border: "1px solid #373737",
            padding: "14px 18px",
          }}
        >
          {agendas.map((item, i) => {
            const isLast = i === agendas.length - 1;
            return (
              <div
                key={item.id}
                className="grid items-center gap-3 py-[14px]"
                style={{
                  gridTemplateColumns: "58px minmax(0,1fr)",
                  borderBottom: isLast ? "none" : "1px solid #373737",
                  minHeight: "76px",
                }}
              >
                {/* Date block */}
                <div
                  className="flex flex-col items-center justify-center rounded-xl flex-shrink-0"
                  style={{
                    width: "54px",
                    height: "54px",
                    background: "#373737",
                  }}
                >
                  <span
                    className="font-semibold leading-none uppercase tracking-wider"
                    style={{ fontSize: "11px", color: "#A4A4A4" }}
                  >
                    {item.month}
                  </span>
                  <span
                    className="font-bold leading-none mt-1 text-white"
                    style={{ fontSize: "22px" }}
                  >
                    {item.day}
                  </span>
                </div>

                {/* Event info */}
                <div className="min-w-0 pr-1">
                  <p
                    className="text-white font-semibold truncate"
                    style={{ fontSize: "15px" }}
                  >
                    {item.title}
                  </p>
                  <p
                    className="text-[12px] mt-0.5 truncate"
                    style={{ color: "#737373" }}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}