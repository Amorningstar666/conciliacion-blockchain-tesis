import React from "react";
import { UserIcon, MailIcon } from "../../../components/icons";
import { EstadoBadge } from "../../../components/ui/StatusBadge";
import { EstadoActaBadge } from "../../../modals/ModalCrearActa";

export function HeaderActa({ acta, badgeEstadoActa, actaEstado }) {
  return (
    <div className="border-b-4 border-blue-900 bg-white px-8 pt-7 pb-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">
            Centro de Conciliación Laboral
          </p>
          <h2 className="text-2xl font-black text-blue-900 mt-1 tracking-tight">
            Acta de Conciliación Laboral
          </h2>
          <p className="text-sm text-gray-500 mt-1">Ley 2220 de 2022 · Código Sustantivo del Trabajo</p>
        </div>
        <div className="text-right">
          <span className="inline-block bg-blue-900 text-white text-xs font-mono px-3 py-1.5 rounded-lg">
            {acta.radicado}
          </span>
          <p className="text-xs text-gray-400 mt-2">{acta.fecha}</p>
          <div className="mt-2 flex flex-col items-end gap-1">
            <EstadoBadge estado={badgeEstadoActa} />
            {actaEstado && <EstadoActaBadge estado={actaEstado} />}
          </div>
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-4 flex items-start gap-3 mt-6 border border-blue-100">
        <div className="w-9 h-9 bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
          <UserIcon size={16} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-blue-600 font-bold uppercase tracking-wide">
            Conciliadora Designada
          </p>
          <p className="text-sm font-bold text-blue-900 mt-0.5">{acta.conciliador}</p>
          <p className="text-xs text-blue-700 mt-0.5">{acta.conciliadorCargo}</p>
          <p className="text-xs text-blue-500">{acta.conciliadorEntidad}</p>
        </div>
        {acta.conciliadorEmail && (
          <div className="text-right flex-shrink-0">
            <p className="text-xs text-blue-400 flex items-center gap-1 justify-end">
              <MailIcon size={11} /> {acta.conciliadorEmail}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
