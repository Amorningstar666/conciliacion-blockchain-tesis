import { sumETH } from "../../../utils/format";
import { STATS_CONFIG } from "../constants/constants";

export function StatsCards({ enCustodia, listosCobrar, cobrados }) {
  const stats = [
    { ...STATS_CONFIG[0], arr: enCustodia },
    { ...STATS_CONFIG[1], arr: listosCobrar },
    { ...STATS_CONFIG[2], arr: cobrados },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map((s) => (
        <div key={s.label} className={`border-2 ${s.border} rounded-xl p-5`}>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{s.label}</p>
          <p className={`text-2xl font-black mt-1 ${s.text}`}>{sumETH(s.arr)} ETH</p>
          <p className="text-xs text-gray-400 mt-0.5">{s.arr.length} acuerdo{s.arr.length !== 1 ? "s" : ""}</p>
        </div>
      ))}
    </div>
  );
}
