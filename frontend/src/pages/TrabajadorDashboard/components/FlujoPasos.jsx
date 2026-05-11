import { FLUJO_PASOS } from "../constants/constants";

export function FlujoPasos() {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
      <p className="text-xs font-bold text-blue-800 mb-2 uppercase tracking-wide">¿Cómo funciona?</p>
      {FLUJO_PASOS.map((paso) => (
        <div key={paso.numero} className="flex items-center gap-2 text-xs text-blue-700 mt-1">
          <span className="bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded font-semibold">{paso.numero}. {paso.estado}</span>
          <span>→ {paso.desc}</span>
        </div>
      ))}
    </div>
  );
}
