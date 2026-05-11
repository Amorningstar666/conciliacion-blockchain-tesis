import React from "react";
import { BlockchainIcon, AlertIcon, EditIcon, LockIcon, PlusIcon } from "../../../components/icons";
import SeccionColapsable from "../../../components/ui/SeccionColapsable";
import FilaDerecho from "../../../components/conciliacion/FilaDerecho";
import { MOCK_DERECHOS_FORMULAS } from "../../../mock/mockData";

export function SeccionAcuerdos({
  todosDerechos,
  montos,
  clasificaciones,
  conceptosExtra,
  totalCiertos,
  totalInciertos,
  openSections,
  onToggle,
  onMontoChange,
  onClasificacionChange,
  nuevoConcepto,
  setNuevoConcepto,
  showAgregarConcepto,
  setShowAgregarConcepto,
  onAgregarConcepto,
  onEliminarConcepto,
}) {
  return (
    <SeccionColapsable
      titulo="III. Acuerdos Económicos"
      open={openSections.acuerdos}
      onToggle={() => onToggle("acuerdos")}
      icono={<BlockchainIcon size={16} />}
    >
      <div className="flex items-center gap-6 mb-4 text-xs text-gray-500 flex-wrap">
        <span className="flex items-center gap-1.5">
          <LockIcon size={13} className="text-blue-700" />
          <span><strong className="text-blue-800">Derecho Cierto:</strong> irrenunciable — valor no puede reducirse</span>
        </span>
        <span className="flex items-center gap-1.5">
          <EditIcon size={13} className="text-gray-400" />
          <span><strong className="text-gray-600">Derecho Incierto:</strong> conciliable libremente entre las partes</span>
        </span>
        <span className="flex items-center gap-1.5">
          <AlertIcon size={13} className="text-red-400" />
          <span>Alerta legal activa</span>
        </span>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-800 text-white text-xs">
              <th className="px-4 py-3 text-center w-10"></th>
              <th className="px-4 py-3 text-left">Concepto / Base Legal</th>
              <th className="px-4 py-3 text-center w-36">Clasificación</th>
              <th className="px-4 py-3 text-right w-40">Valor (COP)</th>
              <th className="px-4 py-3 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {todosDerechos.map((d) => (
              <FilaDerecho
                key={d.id}
                derecho={d}
                monto={montos[d.id]}
                onMontoChange={onMontoChange}
                clasificacion={clasificaciones[d.id]}
                onClasificacionChange={onClasificacionChange}
                formula={MOCK_DERECHOS_FORMULAS[d.id] || null}
                esPersonalizado={conceptosExtra.some((c) => c.id === d.id)}
                onEliminar={onEliminarConcepto}
              />
            ))}

            {showAgregarConcepto && (
              <tr className="bg-emerald-50 border-t-2 border-emerald-200">
                <td className="px-4 py-3 text-center">
                  <PlusIcon size={14} className="text-emerald-600 mx-auto" />
                </td>
                <td className="px-4 py-3">
                  <input
                    autoFocus
                    placeholder="Nombre del concepto *"
                    value={nuevoConcepto.concepto}
                    onChange={(e) => setNuevoConcepto((p) => ({ ...p, concepto: e.target.value }))}
                    className="w-full text-sm border border-gray-300 rounded px-2 py-1 mb-1 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                  <input
                    placeholder="Base legal (ej: Art. 128 CST)"
                    value={nuevoConcepto.base}
                    onChange={(e) => setNuevoConcepto((p) => ({ ...p, base: e.target.value }))}
                    className="w-full text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-emerald-300"
                  />
                </td>
                <td className="px-4 py-3 text-center">
                  <select
                    value={nuevoConcepto.tipo}
                    onChange={(e) => setNuevoConcepto((p) => ({ ...p, tipo: e.target.value }))}
                    className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  >
                    <option value="cierto">🔒 Cierto</option>
                    <option value="incierto">✏️ Incierto</option>
                  </select>
                </td>
                <td className="px-4 py-3 text-right">
                  {nuevoConcepto.tipo === "cierto" ? (
                    <div className="flex items-center justify-end">
                      <span className="text-xs text-gray-400 mr-1">$</span>
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={nuevoConcepto.monto}
                        onChange={(e) => setNuevoConcepto((p) => ({ ...p, monto: e.target.value }))}
                        className="w-28 text-right text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      />
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400 italic">Ingresar al guardar</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={onAgregarConcepto}
                      disabled={!nuevoConcepto.concepto.trim()}
                      className="text-xs bg-emerald-600 text-white rounded px-2 py-1 hover:bg-emerald-700 disabled:opacity-40 font-semibold"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={() => {
                        setShowAgregarConcepto(false);
                        setNuevoConcepto({ concepto: "", base: "", tipo: "incierto", monto: "" });
                      }}
                      className="text-xs text-gray-500 hover:text-gray-700 rounded px-2 py-1"
                    >
                      Cancelar
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr className="bg-blue-900 text-white">
              <td colSpan={3} className="px-4 py-3 text-sm font-bold uppercase tracking-wide">
                Total Acuerdo de Conciliación
              </td>
              <td className="px-4 py-3 text-right text-base font-black">
                $ {(totalCiertos + totalInciertos).toLocaleString("es-CO")}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {!showAgregarConcepto && (
        <button
          onClick={() => setShowAgregarConcepto(true)}
          className="mt-3 flex items-center gap-1.5 text-xs text-emerald-700 hover:text-emerald-900 border border-emerald-300 hover:border-emerald-500 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors font-semibold"
        >
          <PlusIcon size={13} /> Agregar concepto
        </button>
      )}

      <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2">
        <AlertIcon size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-red-700 leading-relaxed">
          <strong>Aviso — Derechos Irrenunciables (Art. 53 C.P. · Art. 14 CST):</strong> Los
          conceptos clasificados como 🔒 Cierto corresponden a derechos ciertos e indiscutibles.
          Cualquier acuerdo que implique su renuncia parcial o total será nulo de pleno derecho.
        </p>
      </div>
    </SeccionColapsable>
  );
}
