import { sumETH } from "../../../utils/format";
import { STATS_CONFIG } from "../constants/constants";

export function StatsCards({ stats }) {
  const statValues = [
    { ...STATS_CONFIG[0], arr: stats.conRegistro },
    { ...STATS_CONFIG[1], arr: stats.enCustodia },
    { ...STATS_CONFIG[2], arr: stats.validados },
    { ...STATS_CONFIG[3], arr: stats.liberados },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {statValues.map((s) => (
        <div key={s.label} className={`border-2 ${s.border} rounded-xl p-4`}>
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{s.label}</p>
            <span className="text-lg">{s.icon}</span>
          </div>
          <p className={`text-2xl font-black ${s.text} font-mono`}>{sumETH(s.arr)} ETH</p>
          <p className="text-xs text-gray-400 mt-0.5">{s.arr.length} acuerdo{s.arr.length !== 1 ? "s" : ""}</p>
        </div>
      ))}
    </div>
  );
}
