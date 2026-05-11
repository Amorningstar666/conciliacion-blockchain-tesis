import React, { useState } from "react";
import { LockIcon, EditIcon, AlertIcon, ChevronIcon, TrashIcon } from "../icons";

export default function FilaDerecho({
  derecho,
  monto,
  onMontoChange,
  clasificacion,
  onClasificacionChange,
  formula,
  esPersonalizado,
  onEliminar,
}) {
  const [showFormula, setShowFormula] = useState(false);
  const tipoEfectivo = clasificacion || derecho.tipo;
  const esCierto = tipoEfectivo === "cierto";

  // Para derechos ciertos: mostrar monto fijo (o input si es personalizado/reclasificado)
  const montoFijo = esCierto && derecho.tipo === "cierto" && !esPersonalizado;

  return (
    <>
      <tr className={esCierto ? "bg-blue-50" : "bg-white"}>
        {/* Ícono tipo */}
        <td className="px-4 py-3 text-center w-10">
          {esCierto ? (
            <span title="Derecho cierto e indiscutible — irrenunciable">
              <LockIcon size={15} className="text-blue-700 mx-auto" />
            </span>
          ) : (
            <span title="Derecho incierto o discutible — negociable">
              <EditIcon size={15} className="text-gray-400 mx-auto" />
            </span>
          )}
        </td>

        {/* Concepto y base legal */}
        <td className="px-4 py-3">
          <p className="text-sm font-medium text-gray-800">{derecho.concepto}</p>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <p className="text-xs text-gray-400">{derecho.base}</p>
            {formula && (
              <button
                onClick={() => setShowFormula((v) => !v)}
                className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-0.5 underline underline-offset-2"
              >
                Ver cálculo
                <ChevronIcon open={showFormula} size={11} />
              </button>
            )}
          </div>
        </td>

        {/* Selector de clasificación */}
        <td className="px-4 py-3 text-center">
          <select
            value={tipoEfectivo}
            onChange={(e) =>
              onClasificacionChange && onClasificacionChange(derecho.id, e.target.value)
            }
            className={`text-xs font-semibold rounded-md border px-2.5 py-1 cursor-pointer
              focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors
              ${esCierto
                ? "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200"
                : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
              }`}
          >
            <option value="cierto">🔒 Cierto</option>
            <option value="incierto">✏️ Incierto</option>
          </select>
        </td>

        {/* Valor */}
        <td className="px-4 py-3 text-right">
          {montoFijo ? (
            <span className="text-sm font-semibold text-blue-900">
              $ {derecho.monto?.toLocaleString("es-CO") ?? "0"}
            </span>
          ) : (
            <div className="flex items-center justify-end">
              <span className="text-xs text-gray-400 mr-1">$</span>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={monto || ""}
                onChange={(e) => onMontoChange(derecho.id, e.target.value)}
                className="w-28 text-right text-sm border border-gray-300 rounded px-2 py-1
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}
        </td>

        {/* Alerta / eliminar */}
        <td className="px-4 py-3 w-10 text-center">
          {esPersonalizado ? (
            <button
              onClick={() => onEliminar && onEliminar(derecho.id)}
              title="Eliminar concepto"
              className="text-red-400 hover:text-red-600 mx-auto block transition-colors"
            >
              <TrashIcon size={14} />
            </button>
          ) : (
            esCierto && derecho.nota && (
              <span title={derecho.nota}>
                <AlertIcon size={14} className="text-red-400 mx-auto" />
              </span>
            )
          )}
        </td>
      </tr>

      {/* Fila de fórmula expandible */}
      {showFormula && formula && (
        <tr className="bg-amber-50 border-t border-amber-100">
          <td />
          <td colSpan={4} className="px-4 py-3">
            <div className="bg-white border border-amber-200 rounded-lg p-3 text-xs space-y-2 shadow-sm">
              <div>
                <span className="font-bold text-amber-800">Fórmula: </span>
                <code className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-mono">
                  {formula.formula}
                </code>
              </div>
              <div>
                <span className="font-bold text-amber-800">Variables: </span>
                <span className="text-amber-700">{formula.variables}</span>
              </div>
              <div>
                <span className="font-bold text-amber-800">Cálculo: </span>
                <span className="text-amber-700">{formula.calculo}</span>
              </div>
              <div className="border-t border-amber-100 pt-2 text-gray-500 italic leading-relaxed">
                {formula.articulo}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
