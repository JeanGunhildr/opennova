export default function CompanyProfileHeader() {
  return (
    <div className="flex flex-col gap-1 mb-6">
      <div className="inline-flex items-center gap-2 mb-1">
        <div
          className="w-6 h-6 rounded-full flex-shrink-0"
          style={{ background: "#FFFFFF", border: "6px solid #5C5C5C" }}
        />
        <span className="text-[14px] font-semibold text-white">Profil Perusahaan</span>
      </div>
      <h1
        className="font-bold text-white leading-[1.1]"
        style={{ fontSize: "40px", letterSpacing: "-0.025em" }}
      >
        Profil Perusahaan
      </h1>
      <p className="text-[15px] leading-[1.5] max-w-[800px]" style={{ color: "#A4A4A4" }}>
        Kelola informasi resmi perusahaan atau organisasi yang digunakan pada challenge dan komunikasi OpenNova.
      </p>
    </div>
  );
}