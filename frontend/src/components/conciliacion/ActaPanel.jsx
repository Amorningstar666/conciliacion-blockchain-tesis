import React, { useState } from "react";
import SeccionColapsable from "../ui/SeccionColapsable";
import { BcBadge } from "../ui/StatusBadge";
import Spinner from "../ui/Spinner";
import { DERECHOS_CIERTOS, TOTAL_CIERTOS } from "../../constants/derechos";
import { fmtCOP } from "../../utils/format";

export default function ActaPanel({ conciliacion, onFirmar, loading }) {
  const [open, setOpen] = useState({ partes: true, hechos: false, derechos: false, condiciones: true });
  const toggle = (k) => setOpen((prev) => ({ ...prev, [k]: !prev[k] }));

  if (!conciliacion) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-24 text-center text-gray-400">
        <span className="text-5xl mb-4">📋</span>
        <p className="font-medium text-gray-500">Selecciona una conciliación para ver el acta</p>
        <p className="text-xs mt-1">o crea una nueva con el botón de la barra lateral</p>
      </div>
    );
  }

  const trab = typeof conciliacion.trabajador === "object" ? conciliacion.trabajador : { nombre: conciliacion.trabajador };
  const empl = typeof conciliacion.empleador === "object" ? conciliacion.empleador : { nombre: conciliacion.empleador };
  const cond = conciliacion.condiciones || {};
  const yaFirmado = conciliacion.bcState !== null && conciliacion.bcState !== undefined;

  return (
    <div className="space-y-4">
      {/* Encabezado oficial del acta */}
      <div className="bg-blue-900 rounded-xl p-5 text-white">
        <p className="text-xs text-blue-300 uppercase tracking-widest mb-1">
          Procuraduría General de la Nación — Centro de Conciliación
        </p>
        <h2 className="text-base font-black uppercase tracking-wide">
          Acta de Conciliación Laboral
        </h2>
        <div className="flex items-center gap-4 mt-3 flex-wrap">
          <span className="font-mono text-xs bg-white bg-opacity-10 px-2.5 py-1 rounded-lg">
            {conciliacion.id}
          </span>
          <span className="text-xs text-blue-300">{conciliacion.fecha} · {conciliacion.hora}</span>
          <span className="text-xs text-blue-200">Conciliador: {conciliacion.conciliador}</span>
        </div>
        {yaFirmado && (
          <div className="mt-3">
            <BcBadge bcState={conciliacion.bcState} />
          </div>
        )}
      </div>

      {/* Sección: Partes */}
      <SeccionColapsable titulo="Partes del proceso" open={open.partes} onToggle={() => toggle("partes")} icono="👥">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-xs text-green-600 uppercase font-bold tracking-wide mb-2">👷 Trabajador (Convocante)</p>
            <p className="font-semibold text-gray-800">{trab.nombre || "—"}</p>
            {trab.cc && <p className="text-xs text-gray-500 mt-0.5">CC: {trab.cc}</p>}
            {trab.cargo && <p className="text-xs text-gray-500">Cargo: {trab.cargo}</p>}
            {trab.correo && <p className="text-xs text-gray-400 mt-1 font-mono">{trab.correo}</p>}
            {trab.fechaIngreso && (
              <p className="text-xs text-gray-400">
                Período: {trab.fechaIngreso} → {trab.fechaRetiro || "activo"}
              </p>
            )}
            {trab.wallet && (
              <p className="text-xs font-mono text-green-600 mt-2 bg-green-100 px-2 py-1 rounded truncate">
                {trab.wallet.slice(0, 20)}…
              </p>
            )}
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-xs text-amber-700 uppercase font-bold tracking-wide mb-2">🏢 Empleador (Convocado)</p>
            <p className="font-semibold text-gray-800">{empl.nombre || "—"}</p>
            {empl.nit && <p className="text-xs text-gray-500 mt-0.5">NIT: {empl.nit}</p>}
            {empl.correo && <p className="text-xs text-gray-400 mt-1 font-mono">{empl.correo}</p>}
            {empl.wallet && (
              <p className="text-xs font-mono text-amber-600 mt-2 bg-amber-100 px-2 py-1 rounded truncate">
                {empl.wallet.slice(0, 20)}…
              </p>
            )}
          </div>
        </div>
      </SeccionColapsable>

      {/* Sección: Hechos */}
      <SeccionColapsable titulo="Hechos y antecedentes" open={open.hechos} onToggle={() => toggle("hechos")} icono="📝">
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
          {conciliacion.hechos || "Sin descripción de hechos."}
        </p>
      </SeccionColapsable>

      {/* Sección: Derechos laborales */}
      <SeccionColapsable titulo="Derechos laborales conciliados" open={open.derechos} onToggle={() => toggle("derechos")} icono="⚖️">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3 text-xs text-blue-800">
          🔒 Los derechos ciertos e indiscutibles son <strong>irrenunciables</strong> (Art. 53 Const. — Art. 14 CST).
          No pueden acordarse por un valor inferior al determinado.
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left bg-gray-100">
              <th className="px-3 py-2 text-xs text-gray-500 font-semibold rounded-l-lg">Concepto</th>
              <th className="px-3 py-2 text-xs text-gray-500 font-semibold">Base legal</th>
              <th className="px-3 py-2 text-xs text-gray-500 font-semibold text-right rounded-r-lg">Monto mínimo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {DERECHOS_CIERTOS.map((d) => (
              <tr key={d.concepto} className="bg-white hover:bg-blue-50 transition-colors">
                <td className="px-3 py-2.5 font-medium text-gray-800 text-sm">{d.concepto}</td>
                <td className="px-3 py-2.5 text-xs text-gray-400 font-mono">{d.base}</td>
                <td className="px-3 py-2.5 text-right font-semibold text-blue-900">{fmtCOP(d.monto)}</td>
              </tr>
            ))}
            <tr className="bg-blue-900 text-white">
              <td className="px-3 py-2.5 font-bold rounded-l-lg" colSpan={2}>Total derechos ciertos</td>
              <td className="px-3 py-2.5 text-right font-black text-lg rounded-r-lg">{fmtCOP(TOTAL_CIERTOS)}</td>
            </tr>
          </tbody>
        </table>
      </SeccionColapsable>

      {/* Sección: Condiciones */}
      <SeccionColapsable titulo="Condiciones del acuerdo" open={open.condiciones} onToggle={() => toggle("condiciones")} icono="⛓️">
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            { label: "Lugar de firma", val: cond.lugarFirma || "—" },
            { label: "Fecha límite de pago", val: cond.fechaPago || "—" },
            { label: "Modalidad de pago", val: cond.modalidad === "cuotas" ? `Cuotas (${cond.numeroCuotas})` : "Pago único" },
            { label: "Fecha del acta", val: cond.fechaFirma || conciliacion.fecha || "—" },
          ].map(({ label, val }) => (
            <div key={label} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
              <p className="text-sm font-semibold text-gray-800 mt-0.5">{val}</p>
            </div>
          ))}
        </div>
      </SeccionColapsable>

      {/* Panel de acción blockchain — respeta el flujo: borrador → trabajador → empleador → blockchain */}
      {yaFirmado ? (
        <div className="rounded-xl border-2 border-yellow-300 bg-yellow-50 p-5">
          <p className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Estado en la Blockchain</p>
          <div className="space-y-2">
            <BcBadge bcState={conciliacion.bcState} />
            {conciliacion.txHash && (
              <p className="text-xs font-mono text-gray-400 bg-white px-2 py-1 rounded border border-gray-100 truncate">
                TX: {conciliacion.txHash}
              </p>
            )}
            {conciliacion.bcState === "depositado" && (
              <p className="text-xs text-yellow-700 mt-1">
                Los fondos están en custodia del contrato. El conciliador PGN debe validar el acta.
              </p>
            )}
            {conciliacion.bcState === "validado" && (
              <p className="text-xs text-blue-700 mt-1">
                Acta validada. El trabajador puede retirar los fondos.
              </p>
            )}
            {conciliacion.bcState === "pagado" && (
              <p className="text-xs text-green-700 mt-1">
                Proceso completado. Los fondos fueron transferidos al trabajador.
              </p>
            )}
          </div>
        </div>
      ) : conciliacion.estado === "borrador" ? (
        <div className="rounded-xl border-2 border-gray-200 bg-gray-50 p-5 text-center text-gray-500 text-sm">
          ⏳ El conciliador está preparando el acta. Espera a que sea enviada para tu revisión.
        </div>
      ) : conciliacion.estado === "trabajador" ? (
        <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-5 text-center text-amber-700 text-sm font-semibold">
          ✍️ Esperando que el trabajador acepte el acuerdo antes de poder depositar los fondos.
        </div>
      ) : (
        <div className="rounded-xl border-2 border-blue-300 bg-blue-50 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-1">
                Acción requerida: Depósito en Blockchain
              </p>
              <p className="text-xs text-gray-500 mb-3">
                El trabajador aceptó el acuerdo. Deposita los fondos en el smart contract —
                el conciliador PGN validará el acta y el trabajador podrá retirarlos.
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Monto a depositar:</span>
                <span className="text-xl font-black text-blue-900 font-mono">
                  {conciliacion.montoETH || "0.1"} ETH
                </span>
                <span className="text-xs text-gray-400">(red Hardhat)</span>
              </div>
            </div>
            <button
              onClick={() => onFirmar(conciliacion.id)}
              disabled={loading}
              className="flex-shrink-0 flex items-center gap-2 px-5 py-3 bg-blue-900 text-white text-sm rounded-xl
                hover:bg-blue-800 transition-colors font-bold disabled:opacity-50 shadow-lg hover:shadow-xl"
            >
              {loading ? <><Spinner /> Procesando…</> : <>⛓️ Firmar y Depositar ETH</>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
