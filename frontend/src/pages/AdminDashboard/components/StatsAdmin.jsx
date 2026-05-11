export function StatsAdmin({ conciliadoresLength, totalAcuerdos }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Conciliadores activos</p>
        <p className="text-4xl font-black text-blue-900">{conciliadoresLength}</p>
        <p className="text-xs text-gray-400 mt-1">registrados y autorizados en el contrato</p>
      </div>
      <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-5">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Acuerdos en cadena</p>
        <p className="text-4xl font-black text-emerald-700">{totalAcuerdos}</p>
        <p className="text-xs text-gray-400 mt-1">acuerdos creados en la blockchain</p>
      </div>
    </div>
  );
}
