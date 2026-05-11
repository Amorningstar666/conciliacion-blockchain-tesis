import React from "react";

const BC_CONFIG = {
  depositado: { text: "En custodia del contrato", cls: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  validado: { text: "Acta validada por PGN", cls: "bg-blue-100 text-blue-800 border-blue-200 animate-pulse" },
  pagado: { text: "Fondos liberados al trabajador", cls: "bg-green-100 text-green-800 border-green-200" },
};

const ESTADO_CONFIG = {
  listo: { bg: "bg-emerald-100", text: "text-emerald-800", dot: "bg-emerald-500", label: "Listo para Hardhat" },
  trabajador: { bg: "bg-amber-100", text: "text-amber-800", dot: "bg-amber-500", label: "Esp. Trabajador" },
  empleador: { bg: "bg-orange-100", text: "text-orange-800", dot: "bg-orange-500", label: "Esp. Empleador" },
  borrador: { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400", label: "Borrador" },
  aprobado: { bg: "bg-blue-100", text: "text-blue-800", dot: "bg-blue-500", label: "Aprobado" },
};

export function BcBadge({ bcState }) {
  const c = BC_CONFIG[bcState] || { text: "Sin registro en blockchain", cls: "bg-gray-100 text-gray-500 border-gray-200" };
  return (
    <span className={`inline-block text-xs px-2.5 py-1 rounded-full font-semibold border ${c.cls}`}>
      {c.text}
    </span>
  );
}

export function TrabajadorBcBadge({ bcState }) {
  const cfg = {
    depositado: { text: "En custodia del contrato", cls: "bg-yellow-100 text-yellow-800 border-yellow-200" },
    validado: { text: "✅ Listo para cobrar", cls: "bg-green-100 text-green-800 border-green-200 animate-pulse" },
    pagado: { text: "💰 Cobrado", cls: "bg-blue-100 text-blue-800 border-blue-200" },
  };
  const c = cfg[bcState] || { text: "Sin registro", cls: "bg-gray-100 text-gray-600 border-gray-200" };
  return (
    <span className={`inline-block text-xs px-2.5 py-1 rounded-full font-semibold border ${c.cls}`}>
      {c.text}
    </span>
  );
}

export function EstadoBadge({ estado }) {
  const c = ESTADO_CONFIG[estado] || ESTADO_CONFIG.borrador;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}
