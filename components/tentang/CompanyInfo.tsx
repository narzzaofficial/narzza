import { TEAMS } from "@/constants/about";
const CompanyInfo = () => {
  return (
    <section className="glass-panel rounded-2xl p-6 ring-1 ring-white/5">
      <div className="mb-5">
        <h2 className="text-2xl font-bold text-slate-50">Profil Perusahaan</h2>
        <p className="mt-1 text-sm text-slate-400">
          Informasi lengkap tentang Narzza Media Digital
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TEAMS.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-slate-700/60 bg-slate-900/40 p-4 transition hover:border-slate-500/60 hover:bg-slate-800/60"
          >
            <div className="mb-2 flex items-center gap-2">
              <item.icon className="text-xl" style={{ color: item.color }} />
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {item.label}
              </p>
            </div>
            <p className="text-base font-semibold text-slate-50">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CompanyInfo;
