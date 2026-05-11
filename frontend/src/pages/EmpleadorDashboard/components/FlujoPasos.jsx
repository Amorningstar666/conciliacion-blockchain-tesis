import { FLUJO_CONFIG } from "../constants/constants";

function FlowStep({ n, label, active }) {
  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg ${active ? "bg-amber-700 text-white font-bold" : "bg-amber-100 text-amber-800"}`}>
      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0
        ${active ? "bg-white text-amber-800" : "bg-amber-200 text-amber-700"}`}>{n}</span>
      {label}
    </div>
  );
}

export function FlujoPasos() {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
      <p className="text-xs font-bold text-amber-800 mb-2 uppercase tracking-wide">Flujo del proceso</p>
      <div className="flex items-center gap-3 flex-wrap text-xs text-amber-800">
        {FLUJO_CONFIG.map((paso, idx) => (
          <div key={paso.n}>
            <FlowStep n={paso.n} label={paso.label} active={paso.active} />
            {idx < FLUJO_CONFIG.length - 1 && <span className="text-amber-400 mx-2">→</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
