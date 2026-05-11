import React, { useState } from "react";
import { XIcon, MailIcon, CheckIcon, AlertIcon } from "../components/icons";

const ESTADOS_ACTA = {
  null: { label: "Borrador", color: "bg-gray-100 text-gray-600" },
  creada: { label: "Acta Creada", color: "bg-blue-100 text-blue-800" },
  enviada: { label: "Enviada · En espera de firma", color: "bg-amber-100 text-amber-800" },
  firmada: { label: "Firmada por las partes", color: "bg-emerald-100 text-emerald-800" },
};

export function EstadoActaBadge({ estado }) {
  const cfg = ESTADOS_ACTA[estado] || ESTADOS_ACTA[null];
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.color}`}>
      {cfg.label}
    </span>
  );
}

export default function ModalCrearActa({
  visible,
  onClose,
  onConfirm,
  acta,
  condicionesPago,
  totalCiertos,
  totalInciertos,
}) {
  const [fase, setFase] = useState("confirm"); // "confirm" | "enviando" | "listo"

  if (!visible) return null;

  const total = totalCiertos + totalInciertos;

  const handleConfirmar = async () => {
    setFase("enviando");
    await new Promise((r) => setTimeout(r, 1200));
    setFase("listo");
    await new Promise((r) => setTimeout(r, 700));
    onConfirm();
    setFase("confirm");
  };

  const modalidad =
    condicionesPago.modalidad === "cuotas"
      ? `${condicionesPago.numeroCuotas} cuotas`
      : "Pago único";

  const destinatarios = [
    {
      nombre: acta.trabajador,
      correo: acta.correoTrabajador,
      rol: "Convocante — Trabajador",
    },
    {
      nombre: acta.empleador,
      correo: acta.correoEmpleador,
      rol: "Convocado — Empleador",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-blue-900">
          <div>
            <h3 className="text-white font-bold text-base">Crear y Enviar Acta</h3>
            <p className="text-blue-200 text-xs mt-0.5">
              Confirme los datos antes de notificar a las partes
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-blue-200 hover:text-white transition-colors"
            disabled={fase === "enviando"}
          >
            <XIcon size={20} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Resumen */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">
              Resumen del Acta
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Radicado</span>
                <span className="font-mono font-semibold text-gray-800">{acta.radicado}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Fecha</span>
                <span className="text-gray-700">{acta.fecha}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-gray-500">Trabajador</span>
                <span className="font-semibold text-gray-800 text-right max-w-[190px]">
                  {acta.trabajador}
                </span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-gray-500">Empleador</span>
                <span className="font-semibold text-gray-800 text-right max-w-[190px]">
                  {acta.empleador}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between items-center">
                <span className="text-gray-500">Total acuerdo</span>
                <span className="text-lg font-black text-blue-900">
                  $ {total.toLocaleString("es-CO")}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Modalidad de pago</span>
                <span className="font-semibold text-gray-600">{modalidad}</span>
              </div>
            </div>
          </div>

          {/* Destinatarios */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">
              Se notificará por correo a:
            </p>
            <div className="space-y-2">
              {destinatarios.map((d) => (
                <div
                  key={d.correo || d.nombre}
                  className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2.5"
                >
                  <MailIcon size={14} className="text-blue-500 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-gray-800">{d.nombre}</p>
                    <p className="text-xs text-blue-600">{d.correo || "— sin correo registrado —"}</p>
                    <p className="text-xs text-gray-400">{d.rol}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Estado que quedará */}
          <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
            <div className="flex items-start gap-2">
              <AlertIcon size={13} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700 leading-relaxed">
                El acta quedará en estado:
              </p>
            </div>
            <EstadoActaBadge estado="enviada" />
          </div>
        </div>

        {/* Acciones */}
        <div className="px-6 pb-5 pt-2 flex justify-end gap-3 border-t border-gray-100">
          <button
            onClick={onClose}
            disabled={fase === "enviando"}
            className="px-4 py-2 text-sm border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirmar}
            disabled={fase !== "confirm"}
            className="flex items-center gap-2 px-5 py-2 text-sm bg-blue-900 text-white rounded-lg hover:bg-blue-800 font-semibold disabled:opacity-70 transition-all"
          >
            {fase === "listo" ? (
              <><CheckIcon size={15} /> Enviada</>
            ) : fase === "enviando" ? (
              <>
                <svg className="animate-spin" width={15} height={15} viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                Enviando...
              </>
            ) : (
              <><MailIcon size={15} /> Crear y Enviar Acta</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
