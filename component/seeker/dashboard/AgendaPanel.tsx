interface AgendaItem {
  id: string;
  month: string;
  day: string;
  title: string;
  description: string;
}

const AGENDA: AgendaItem[] = [
  {
    id: "a1",
    month: "SEP",
    day: "12",
    title: "Batas Pendaftaran Peserta",
    description: "Challenge AI Monitoring Jaringan — Batas terakhir registrasi tim",
  },
  {
    id: "a2",
    month: "SEP",
    day: "20",
    title: "Sesi Pitching Final",
    description: "Platform Manajemen Energi — Presentasi 5 finalis ke dewan juri",
  },
  {
    id: "a3",
    month: "SEP",
    day: "28",
    title: "Pengumuman Pemenang",
    description: "Solusi Logistik Last-Mile — Penetapan dan pengumuman pemenang resmi",
  },
  {
    id: "a4",
    month: "OKT",
    day: "05",
    title: "Peluncuran Challenge Baru",
    description: "Digitalisasi NLP — Jadwal publikasi challenge ke platform",
  },
];

export default function AgendaPanel() {
  return (
    <div>
      {/* Panel header */}
      <div className="mb-4">
        <h2 className="text-white font-bold" style={{ fontSize: "20px" }}>
          Agenda Terdekat
        </h2>
      </div>

      {/* List */}
      <div
        className="rounded-[18px]"
        style={{ background: "#171717", border: "1px solid #373737", padding: "14px 18px" }}
      >
        {AGENDA.map((item, i) => {
          const isLast = i === AGENDA.length - 1;
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
                className="flex flex-col items-center justify-center rounded-xl"
                style={{
                  width: "54px",
                  height: "54px",
                  background: "#373737",
                }}
              >
                <span
                  className="font-semibold leading-none"
                  style={{ fontSize: "11px", color: "#737373" }}
                >
                  {item.month}
                </span>
                <span
                  className="font-bold leading-none mt-0.5 text-white"
                  style={{ fontSize: "22px" }}
                >
                  {item.day}
                </span>
              </div>

              {/* Event info */}
              <div className="min-w-0">
                <p className="text-white font-semibold truncate" style={{ fontSize: "15px" }}>
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
    </div>
  );
}