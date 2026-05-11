import React from "react";
import { UserIcon } from "../../../components/icons";
import SeccionColapsable from "../../../components/ui/SeccionColapsable";

export function SeccionPartes({ activeConciliacion, openSections, onToggle, onTrabajadorChange, onEmpleadorChange }) {
  const t = activeConciliacion?.trabajador || {};
  const e = activeConciliacion?.empleador || {};

  return (
    <SeccionColapsable
      titulo="I. Datos de las Partes"
      open={openSections.partes}
      onToggle={() => onToggle("partes")}
      icono={<UserIcon size={16} />}
    >
      <div className="grid grid-cols-2 gap-6">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 border-b border-gray-100 pb-1">
            Convocante — Trabajador
          </p>
          {[
            ["Nombre completo", t.nombre || "", "nombre", "text"],
            ["Cédula de Ciudadanía", t.cc || "", "cc", "text"],
            ["Cargo desempeñado", t.cargo || "", "cargo", "text"],
            ["Fecha de ingreso", t.fechaIngreso || "", "fechaIngreso", "text"],
            ["Fecha de retiro", t.fechaRetiro || "", "fechaRetiro", "text"],
            ["Correo electrónico", t.correo || "", "correo", "email"],
          ].map(([label, val, campo, type]) => (
            <div key={campo} className="mb-2">
              <label className="block text-xs text-gray-400 mb-0.5">{label}</label>
              <input
                type={type}
                value={val}
                onChange={(e) => onTrabajadorChange(campo, e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 border-b border-gray-100 pb-1">
            Convocado — Empleador
          </p>
          {[
            ["Razón social", e.nombre || "", "nombre", "text"],
            ["NIT", e.nit || "", "nit", "text"],
            ["Representante legal", e.representante || "", "representante", "text"],
            ["Dirección", e.direccion || "", "direccion", "text"],
            ["Correo electrónico", e.correo || "", "correo", "email"],
          ].map(([label, val, campo, type]) => (
            <div key={campo} className="mb-2">
              <label className="block text-xs text-gray-400 mb-0.5">{label}</label>
              <input
                type={type}
                value={val}
                onChange={(e) => onEmpleadorChange(campo, e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>
      </div>
    </SeccionColapsable>
  );
}
