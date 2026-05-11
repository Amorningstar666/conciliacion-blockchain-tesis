import { ConciliacionPendienteCard } from "./ConciliacionPendienteCard";

export function PanelPendientesAceptar({ pendientes, onAceptar }) {
  if (pendientes.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <h2 className="font-bold text-gray-700 text-sm uppercase tracking-wide">
          Acuerdos Pendientes de tu Firma
        </h2>
        <span className="bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
          {pendientes.length}
        </span>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-3 text-xs text-amber-800">
        <strong>¿Qué significa esto?</strong> El conciliador preparó estos acuerdos para ti.
        Al aceptar, confirmas las condiciones y el empleador podrá depositar los fondos en custodia.
      </div>

      <div className="space-y-3">
        {pendientes.map((c) => (
          <ConciliacionPendienteCard key={c.id} conciliacion={c} onAceptar={onAceptar} />
        ))}
      </div>
    </div>
  );
}
