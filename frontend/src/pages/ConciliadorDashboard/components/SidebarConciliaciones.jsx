import React from "react";
import { ConciliadorCard } from "../../../components/conciliacion/ConciliacionCard";
import { ROLE_CONFIG } from "../../../constants/roles";

export function SidebarConciliaciones({
  conciliaciones,
  activeConciliacionId,
  onSelect,
  onNuevaConciliacion,
  autorizado,
  pendientesValidacion,
  stats,
  role,
  address,
  logout,
  loading,
  validarActa,
}) {
  return (
    <aside className="w-72 flex-shrink-0">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Conciliaciones</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {conciliaciones.length} caso{conciliaciones.length !== 1 ? "s" : ""} registrado{conciliaciones.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={onNuevaConciliacion}
            disabled={!autorizado}
            className="text-xs bg-blue-900 text-white px-2.5 py-1.5 rounded-lg hover:bg-blue-800 transition-colors font-semibold flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
            title={autorizado ? "Nueva conciliación" : "No autorizado por el Admin PGN"}
          >
            + Nueva
          </button>
        </div>
        <div className="p-3 max-h-96 overflow-y-auto">
          {conciliaciones.map((item) => (
            <ConciliadorCard
              key={item.id}
              item={item}
              selected={activeConciliacionId === item.id}
              onClick={() => onSelect(item.id)}
            />
          ))}
        </div>
        <div className="border-t border-gray-100 px-4 py-3 grid grid-cols-3 gap-2 bg-gray-50">
          <div className="text-center">
            <p className="text-lg font-bold text-blue-900">{conciliaciones.length}</p>
            <p className="text-xs text-gray-400 leading-tight">Total</p>
          </div>
          <div className="text-center border-x border-gray-200">
            <p className="text-lg font-bold text-emerald-600">{stats.conRegistro.length}</p>
            <p className="text-xs text-gray-400 leading-tight">En cadena</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-amber-500">{stats.pendientes.length}</p>
            <p className="text-xs text-gray-400 leading-tight">Pendiente</p>
          </div>
        </div>
      </div>

      {!autorizado && (
        <div className="mt-3 bg-red-900 border border-red-700 rounded-xl p-3">
          <p className="text-xs text-red-300 font-bold">⚠️ No autorizado</p>
          <p className="text-xs text-red-400 mt-1">
            Tu wallet no está registrada como conciliador activo. El Admin PGN debe autorizarte antes de poder crear o validar actas.
          </p>
        </div>
      )}

      {pendientesValidacion.length > 0 && (
        <div className="mt-3 bg-white rounded-xl border border-yellow-300 shadow-sm overflow-hidden">
          <div className="px-4 py-2.5 bg-yellow-50 border-b border-yellow-200">
            <p className="text-xs font-bold text-yellow-800 uppercase tracking-wide">
              ⏳ Pendientes de validación
              <span className="ml-1.5 bg-yellow-200 text-yellow-900 px-1.5 py-0.5 rounded-full font-mono">
                {pendientesValidacion.length}
              </span>
            </p>
          </div>
          <div className="p-2 space-y-2">
            {pendientesValidacion.map((a) => (
              <div key={a.hashActa} className="bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
                <p className="font-mono text-xs text-gray-500 truncate">{a.hashActa.slice(0, 18)}…</p>
                <p className="text-xs text-gray-600 mt-0.5">{a.monto} ETH en custodia</p>
                <button
                  onClick={() => validarActa(a.hashActa)}
                  disabled={loading}
                  className="mt-1.5 w-full text-xs bg-blue-900 text-white rounded-md py-1 hover:bg-blue-800 disabled:opacity-50 transition-colors font-semibold"
                >
                  {loading ? "Validando…" : "✅ Validar Acta"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-3 bg-gray-800 rounded-xl p-3">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
          <span className="text-xs text-gray-300 font-semibold">
            {ROLE_CONFIG[role]?.icon} {ROLE_CONFIG[role]?.label}
          </span>
        </div>
        <p className="text-xs font-mono text-green-400 truncate">{address.slice(0, 14)}…</p>
        <div className="flex gap-1 mt-2">
          <button
            onClick={logout}
            className="text-xs px-2 py-0.5 rounded bg-red-900 text-red-300 hover:bg-red-800 transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </aside>
  );
}
