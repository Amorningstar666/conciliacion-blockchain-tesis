import { EmpleadorCard } from "../../../components/conciliacion/ConciliacionCard";

export function SidebarCasos({ conciliaciones, activaId, onSelectCaso }) {
  return (
    <aside className="w-72 flex-shrink-0">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Mis casos</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {conciliaciones.length} conciliación{conciliaciones.length !== 1 ? "es" : ""}
          </p>
        </div>
        <div className="p-3 max-h-[60vh] overflow-y-auto">
          {conciliaciones.length === 0 ? (
            <div className="text-center py-8 text-gray-400 px-2">
              <p className="text-3xl mb-2">📂</p>
              <p className="text-xs font-medium text-gray-500">No hay actas asignadas aún</p>
              <p className="text-xs mt-1 leading-snug">El conciliador PGN debe crear el acta con tu wallet para que aparezca aquí.</p>
            </div>
          ) : (
            conciliaciones.map((c) => (
              <EmpleadorCard
                key={c.id}
                c={c}
                selected={c.id === activaId}
                onClick={() => onSelectCaso(c.id)}
              />
            ))
          )}
        </div>
      </div>
    </aside>
  );
}
