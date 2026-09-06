export default function SolverProfileHeader() {
  return (
    <div className="flex flex-col gap-1 mb-6">
      <div className="inline-flex items-center gap-2 mb-1">
        <div
          className="w-3 h-3 rounded-full bg-primary-500"
        />
        <span className="text-[14px] font-semibold text-gray-700">Profil Solver</span>
      </div>
      <h1
        className="font-bold text-gray-900 leading-[1.1]"
        style={{ fontSize: "36px", letterSpacing: "-0.025em" }}
      >
        Profil Solver Anda
      </h1>
      <p className="text-[14px] leading-[1.5] max-w-[800px] text-gray-600">
        Kelola informasi data diri, kontak, dan institusi Anda yang digunakan pada keikutsertaan challenge OpenNova.
      </p>
    </div>
  );
}
