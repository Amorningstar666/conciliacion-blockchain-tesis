import { AcuerdoCard } from "./AcuerdoCard";

export function ListaAcuerdos({ acuerdos, loading, onRetirarFondos }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-bold text-gray-700 text-sm uppercase tracking-wide">
          Mis Acuerdos en la Blockchain
        </h2>
        <span className="text-xs text-gray-400">{acuerdos.length} registrado{acuerdos.length !== 1 ? "s" : ""}</span>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400 text-sm">
          Cargando acuerdos desde el contrato…
        </div>
      ) : acuerdos.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
          <p className="text-4xl mb-3">📋</p>
          <p className="text-gray-500 font-medium">No tienes acuerdos en la blockchain todavía.</p>
          <p className="text-xs text-gray-400 mt-1">
            El empleador debe crear el acuerdo y depositar los fondos primero.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {acuerdos.map((acuerdo) => (
            <AcuerdoCard
              key={acuerdo.hashActa}
              acuerdo={acuerdo}
              onRetirarFondos={onRetirarFondos}
              loading={loading}
            />
          ))}
        </div>
      )}
    </div>
  );
}
