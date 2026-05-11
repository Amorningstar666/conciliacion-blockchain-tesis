import React from "react";
import { CheckIcon, XIcon } from "../../../components/icons";

export function NotificacionActa({ actaNotificacion, onClose }) {
  if (!actaNotificacion) return null;

  return (
    <div className="max-w-screen-xl mx-auto px-6 mt-4">
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-start gap-3">
        <div className="w-7 h-7 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
          <CheckIcon size={14} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-emerald-800">
            Acta {actaNotificacion.radicado} creada y enviada exitosamente
          </p>
          <p className="text-xs text-emerald-700 mt-1">
            Se notificó a:&nbsp;
            <strong>{actaNotificacion.trabajador}</strong> ({actaNotificacion.correoTrabajador || "sin correo"})
            &nbsp;y&nbsp;
            <strong>{actaNotificacion.empleador}</strong> ({actaNotificacion.correoEmpleador || "sin correo"})
          </p>
          <p className="text-xs text-emerald-600 mt-0.5">
            Las partes deben revisar y aceptar los términos para continuar.
          </p>
        </div>
        <button
          onClick={onClose}
          className="ml-auto text-emerald-400 hover:text-emerald-600 flex-shrink-0"
        >
          <XIcon size={16} />
        </button>
      </div>
    </div>
  );
}
