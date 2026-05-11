import React from "react";
import { PdfIcon } from "../../../components/icons";
import SeccionColapsable from "../../../components/ui/SeccionColapsable";

const PRETENSIONES_DEFAULT = "El trabajador solicita el pago de todos los conceptos laborales derivados de la terminación del contrato, incluyendo salarios insolutos, prestaciones sociales y la indemnización correspondiente por despido sin justa causa, de acuerdo con el artículo 64 del CST.";

export function SeccionHechos({ activeConciliacion, openSections, onToggle, onHechosChange, onPretensionesChange }) {
  return (
    <SeccionColapsable
      titulo="II. Hechos y Antecedentes"
      open={openSections.hechos}
      onToggle={() => onToggle("hechos")}
      icono={<PdfIcon size={16} />}
    >
      <div className="space-y-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1 font-medium">
            Descripción de la relación laboral y causa de la solicitud
          </label>
          <textarea
            rows={4}
            value={activeConciliacion?.hechos || ""}
            onChange={(e) => onHechosChange(e.target.value)}
            className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed resize-y"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1 font-medium">
            Pretensiones del convocante
          </label>
          <textarea
            rows={3}
            value={activeConciliacion?.pretensiones ?? PRETENSIONES_DEFAULT}
            onChange={(e) => onPretensionesChange(e.target.value)}
            className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed resize-y"
          />
        </div>
      </div>
    </SeccionColapsable>
  );
}
