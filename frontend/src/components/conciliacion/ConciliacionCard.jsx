import React from "react";
import { EstadoBadge, BcBadge } from "../ui/StatusBadge";
import { ClockIcon } from "../icons";

export function ConciliadorCard({ item, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-lg border transition-all duration-150 mb-3
        ${selected
          ? "border-blue-900 bg-blue-50 shadow-sm"
          : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm"
        }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-xs font-mono text-gray-500">{item.id}</span>
        <EstadoBadge estado={item.estado} />
      </div>
      <p className="text-sm font-semibold text-gray-800 leading-tight">
        {typeof item.trabajador === "object" ? item.trabajador.nombre : item.trabajador}
      </p>
      <p className="text-xs text-gray-500 mt-0.5">
        vs. {typeof item.empleador === "object" ? item.empleador.nombre : item.empleador}
      </p>
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
        <span className="flex items-center gap-1 text-xs text-gray-400">
          <ClockIcon /> {item.hora}
        </span>
        <span className="text-sm font-semibold text-blue-900">{item.monto}</span>
      </div>
    </button>
  );
}

export function EmpleadorCard({ c, selected, onClick }) {
  const trab = typeof c.trabajador === "object" ? c.trabajador.nombre : c.trabajador;
  const empl = typeof c.empleador === "object" ? c.empleador.nombre : c.empleador;
  const bcColors = {
    depositado: "border-l-yellow-400",
    validado: "border-l-blue-400",
    pagado: "border-l-green-400",
  };
  const borderColor = c.bcState ? (bcColors[c.bcState] || "border-l-gray-300") : "border-l-gray-200";

  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3.5 rounded-xl border-2 border-l-4 transition-all duration-150 mb-2.5
        ${selected
          ? "border-amber-400 bg-amber-50 shadow-md"
          : `border-gray-200 ${borderColor} bg-white hover:border-amber-300 hover:shadow-sm`
        }`}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-mono text-gray-400">{c.id}</span>
        {c.bcState && <BcBadge bcState={c.bcState} />}
      </div>
      <p className="text-sm font-semibold text-gray-800 leading-tight">{trab || "—"}</p>
      <p className="text-xs text-gray-500">vs. {empl || "—"}</p>
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
        <span className="text-xs text-gray-400">{c.fecha}</span>
        <span className="text-sm font-bold text-amber-700 font-mono">{c.montoETH} ETH</span>
      </div>
    </button>
  );
}
