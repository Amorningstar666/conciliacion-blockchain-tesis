import React from "react";
import { LockIcon, XIcon, MailIcon, BlockchainIcon, AlertIcon } from "../icons";

export default function ModalVistaPrevia({ visible, onClose, onConfirm, derechos, montos, acta, condicionesPago, totalCiertos, totalInciertos }) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-screen overflow-y-auto">

        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-blue-900 rounded-t-xl">
          <div>
            <h3 className="text-white font-bold text-lg">Vista Previa del Acta</h3>
            <p className="text-blue-200 text-xs mt-0.5">Verifique los datos antes de enviar a las partes</p>
          </div>
          <button onClick={onClose} className="text-blue-200 hover:text-white transition-colors">
            <XIcon size={22} />
          </button>
        </div>

        <div className="px-6 py-5">
          <div className="text-center border-b border-gray-200 pb-4 mb-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
              Procuraduría General de la Nación — Centro de Conciliación
            </p>
            <h2 className="text-base font-bold text-gray-800">ACTA DE CONCILIACIÓN LABORAL</h2>
            <p className="text-xs text-gray-500 mt-1">Radicado: {acta.radicado} — {acta.fecha}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-5">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Trabajador (Convocante)</p>
              <p className="text-sm font-semibold text-gray-800">{acta.trabajador}</p>
              <p className="text-xs text-gray-500">CC: {acta.ccTrabajador}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Empleador (Convocado)</p>
              <p className="text-sm font-semibold text-gray-800">{acta.empleador}</p>
              <p className="text-xs text-gray-500">NIT: {acta.nitEmpleador}</p>
            </div>
          </div>

          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Resumen de Acuerdos</p>
          <table className="w-full text-sm mb-5">
            <tbody>
              {derechos.filter(d => d.tipo === "cierto").map(d => (
                <tr key={d.id} className="border-b border-gray-100">
                  <td className="py-2 text-gray-700 flex items-center gap-1.5">
                    <LockIcon size={12} className="text-blue-600" /> {d.concepto}
                  </td>
                  <td className="py-2 text-right font-medium text-blue-900">
                    $ {d.monto.toLocaleString("es-CO")}
                  </td>
                </tr>
              ))}
              {derechos.filter(d => d.tipo === "incierto" && montos[d.id]).map(d => (
                <tr key={d.id} className="border-b border-gray-100">
                  <td className="py-2 text-gray-700">{d.concepto}</td>
                  <td className="py-2 text-right font-medium text-gray-800">
                    $ {parseFloat(montos[d.id]).toLocaleString("es-CO")}
                  </td>
                </tr>
              ))}
              <tr className="bg-blue-50">
                <td className="py-2.5 px-2 font-bold text-blue-900">TOTAL ACUERDO</td>
                <td className="py-2.5 px-2 text-right font-bold text-blue-900 text-base">
                  $ {(totalCiertos + totalInciertos).toLocaleString("es-CO")}
                </td>
              </tr>
            </tbody>
          </table>

          {condicionesPago && (
            <div className="mb-5">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Condiciones de Pago y Firma</p>
              <div className="border border-blue-200 rounded-lg overflow-hidden">
                <div className="bg-blue-900 px-3 py-2 flex items-center gap-2">
                  <BlockchainIcon size={13} className="text-blue-300" />
                  <p className="text-xs text-white font-semibold">Parámetros que se registran en el Smart Contract</p>
                </div>
                <div className="grid grid-cols-2 gap-0 divide-x divide-gray-100 bg-white">
                  <div className="px-4 py-3 space-y-2">
                    <div>
                      <p className="text-xs text-gray-400">Fecha de firma del Acta</p>
                      <p className="text-sm font-semibold text-gray-800">{condicionesPago.fechaFirma}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Fecha límite de pago</p>
                      <p className="text-sm font-bold text-blue-900">{condicionesPago.fechaPago}</p>
                    </div>
                  </div>
                  <div className="px-4 py-3 space-y-2">
                    <div>
                      <p className="text-xs text-gray-400">Modalidad</p>
                      <p className="text-sm font-semibold text-gray-800 capitalize">{condicionesPago.modalidad}</p>
                    </div>
                    {condicionesPago.modalidad === "cuotas" && (
                      <div>
                        <p className="text-xs text-gray-400">Número de cuotas</p>
                        <p className="text-sm font-semibold text-gray-800">{condicionesPago.numeroCuotas}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-gray-400">Lugar de firma</p>
                      <p className="text-sm font-semibold text-gray-800">{condicionesPago.lugarFirma}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-50 px-4 py-2 border-t border-blue-100 font-mono text-xs text-blue-700">
                  correoTrabajador: "{acta.correoTrabajador}" · correoEmpleador: "{acta.correoEmpleador}"
                </div>
              </div>
            </div>
          )}

          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-5 flex gap-3">
            <AlertIcon size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-red-700">
              <strong>Advertencia legal:</strong> Los derechos ciertos e indiscutibles marcados con 🔒
              no pueden transarse por un valor inferior al determinado. Cualquier acuerdo en contrario
              es nulo de pleno derecho (Art. 53 Const. Pol. — Art. 14 CST).
            </p>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Revisar acta
            </button>
            <button
              onClick={onConfirm}
              className="px-5 py-2 text-sm bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors flex items-center gap-2 font-semibold"
            >
              <MailIcon size={15} /> Enviar a correos de las partes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
