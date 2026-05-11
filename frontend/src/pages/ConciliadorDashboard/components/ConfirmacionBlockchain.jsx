import React from "react";
import { CheckIcon } from "../../../components/icons";

export function ConfirmacionBlockchain({
  bcStatus,
  bcTxHash,
  activeConciliacion,
  validarActa,
  retirarFondos,
  loading,
}) {
  return (
    <div className="mt-4 space-y-3">
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
            <CheckIcon size={16} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-emerald-800">
              {bcStatus === "pagado"
                ? "Fondos transferidos al Trabajador ✓"
                : bcStatus === "validado"
                ? "Acta validada por PGN — lista para cobro ✓"
                : "Acta registrada — fondos en custodia del contrato"}
            </p>
            {bcTxHash && (
              <p className="text-xs text-emerald-600 mt-1 font-mono truncate">
                TX: {bcTxHash} · Red: Hardhat Local
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
        <p className="text-xs font-bold text-blue-800 uppercase tracking-wide mb-3">
          Siguientes acciones en el contrato
        </p>
        <div className="flex flex-wrap gap-2">
          {bcStatus !== "validado" && bcStatus !== "pagado" && (
            <button
              onClick={() => validarActa(activeConciliacion?.hashActa)}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 text-xs bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors font-semibold disabled:opacity-50"
            >
              <CheckIcon size={13} /> {loading ? "Procesando…" : "Validar Acta (Conciliador ⚖️)"}
            </button>
          )}
          {bcStatus === "validado" && (
            <button
              onClick={() => retirarFondos()}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 text-xs bg-emerald-700 text-white rounded-lg hover:bg-emerald-600 transition-colors font-semibold disabled:opacity-50"
            >
              <CheckIcon size={13} /> {loading ? "Procesando…" : "Retirar Fondos (Trabajador 👷)"}
            </button>
          )}
          {bcStatus === "pagado" && (
            <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
              <CheckIcon size={13} className="text-emerald-600" /> Proceso completado — caso cerrado
            </span>
          )}
        </div>
        <p className="text-xs text-blue-600 mt-1">
          Cambia el rol en la barra superior para ejecutar cada acción con la cuenta correcta.
        </p>
      </div>
    </div>
  );
}
