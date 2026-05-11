import React from "react";
import { BlockchainIcon, CalendarIcon, CreditCardIcon } from "../../../components/icons";
import SeccionColapsable from "../../../components/ui/SeccionColapsable";

export function SeccionPago({
  condicionesPago,
  onCondicionChange,
  montoETH,
  onMontoETHChange,
  acta,
  totalCiertos,
  totalInciertos,
  openSections,
  onToggle,
}) {
  return (
    <SeccionColapsable
      titulo="IV. Condiciones de Pago y Firma del Acta"
      open={openSections.pago}
      onToggle={() => onToggle("pago")}
      icono={<CreditCardIcon size={16} />}
    >
      <div className="mb-5 bg-blue-900 rounded-lg px-4 py-3 flex items-center gap-3">
        <BlockchainIcon size={18} className="text-blue-300 flex-shrink-0" />
        <div>
          <p className="text-xs font-bold text-white">Variables registradas en el Smart Contract</p>
          <p className="text-xs text-blue-300 mt-0.5">
            Los campos de esta sección se codificarán en el hash del acta y quedarán
            inmutables en la red Hardhat como condición ejecutable del acuerdo.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 border-b border-gray-100 pb-1">
            Fechas del Acuerdo
          </p>
          <div className="mb-4">
            <label className="block text-xs text-gray-500 mb-1 font-medium">
              Fecha de firma del Acta
            </label>
            <div className="relative">
              <input
                type="date"
                value={condicionesPago.fechaFirma || ""}
                onChange={(e) => onCondicionChange("fechaFirma", e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
              />
              <CalendarIcon size={14} className="absolute right-2.5 top-2.5 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs text-gray-500 mb-1 font-medium">
              Fecha límite de pago del acuerdo
              <span className="ml-1.5 text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-semibold">→ Smart Contract</span>
            </label>
            <div className="relative">
              <input
                type="date"
                value={condicionesPago.fechaPago || ""}
                onChange={(e) => onCondicionChange("fechaPago", e.target.value)}
                className="w-full text-sm border-2 border-blue-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50 pr-8"
              />
              <CalendarIcon size={14} className="absolute right-2.5 top-2.5 text-blue-400 pointer-events-none" />
            </div>
            <p className="text-xs text-blue-600 mt-1">
              El empleador debe cumplir antes de esta fecha. El Smart Contract lo registra como{" "}
              <span className="font-mono">paymentDeadline</span>.
            </p>
          </div>
          <div className="mb-3">
            <label className="block text-xs text-gray-500 mb-1 font-medium">Lugar de firma</label>
            <input
              type="text"
              value={condicionesPago.lugarFirma || ""}
              onChange={(e) => onCondicionChange("lugarFirma", e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 border-b border-gray-100 pb-1">
            Modalidad de Pago
            <span className="ml-1.5 normal-case text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-semibold">→ Smart Contract</span>
          </p>
          <div className="mb-4">
            <label className="block text-xs text-gray-500 mb-2 font-medium">Forma de pago acordada</label>
            <div className="flex flex-col gap-2">
              {[
                { val: "unico", label: "Pago único", sub: "Todo el valor en una sola fecha" },
                { val: "cuotas", label: "Pago en cuotas", sub: "Dividido en cuotas periódicas" },
              ].map((op) => (
                <label
                  key={op.val}
                  className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all
                    ${condicionesPago.modalidad === op.val
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"}`}
                >
                  <input
                    type="radio"
                    name="modalidad"
                    value={op.val}
                    checked={condicionesPago.modalidad === op.val}
                    onChange={() => onCondicionChange("modalidad", op.val)}
                    className="mt-0.5 accent-blue-700"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{op.label}</p>
                    <p className="text-xs text-gray-500">{op.sub}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {condicionesPago.modalidad === "cuotas" && (
            <div className="mb-4">
              <label className="block text-xs text-gray-500 mb-1 font-medium">
                Número de cuotas
              </label>
              <input
                type="number"
                min="2"
                max="36"
                value={condicionesPago.numeroCuotas || ""}
                onChange={(e) => onCondicionChange("numeroCuotas", e.target.value)}
                className="w-full text-sm border-2 border-blue-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
              />
              <p className="text-xs text-blue-600 mt-1">
                Registrado como <span className="font-mono">installments</span> en el contrato.
              </p>
            </div>
          )}

          <div className="mt-4 border border-dashed border-blue-300 rounded-lg p-3 bg-blue-50">
            <p className="text-xs font-bold text-blue-800 mb-2 flex items-center gap-1.5">
              <BlockchainIcon size={13} /> Parámetros del Smart Contract
            </p>
            <div className="space-y-1 font-mono text-xs text-blue-700 mb-3">
              <p><span className="text-blue-400">hashActa:</span> keccak256("{acta.radicado}")</p>
              <p><span className="text-blue-400">paymentDeadline:</span> "{condicionesPago.fechaPago}"</p>
              <p><span className="text-blue-400">modalidad:</span> "{condicionesPago.modalidad}"</p>
              {condicionesPago.modalidad === "cuotas" && (
                <p><span className="text-blue-400">installments:</span> {condicionesPago.numeroCuotas}</p>
              )}
              <p><span className="text-blue-400">lugar:</span> "{condicionesPago.lugarFirma}"</p>
              <p><span className="text-blue-400">totalAcuerdo:</span> {(totalCiertos + totalInciertos).toLocaleString("es-CO")} COP</p>
            </div>
            <div className="border-t border-blue-200 pt-2">
              <label className="block text-xs text-blue-700 font-semibold mb-1">
                Monto a depositar en la red (ETH — demo Hardhat)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={montoETH}
                  onChange={(e) => onMontoETHChange(e.target.value)}
                  className="w-32 text-sm border-2 border-blue-300 rounded px-2 py-1 font-mono bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-xs text-blue-600 font-mono">ETH</span>
                <span className="text-xs text-gray-400">
                  (representa {(totalCiertos + totalInciertos).toLocaleString("es-CO")} COP)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SeccionColapsable>
  );
}
