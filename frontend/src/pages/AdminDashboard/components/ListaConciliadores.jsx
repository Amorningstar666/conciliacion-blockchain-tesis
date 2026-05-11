export function ListaConciliadores({ conciliadores, loading, onRevocar }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
        👥 Conciliadores autorizados
        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-mono">
          {conciliadores.length}
        </span>
      </h3>
      {conciliadores.length === 0 ? (
        <p className="text-sm text-gray-400 italic">No hay conciliadores registrados en el contrato.</p>
      ) : (
        <ul className="space-y-2">
          {conciliadores.map((c) => (
            <li
              key={c.address}
              className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-4 py-3"
            >
              <div className="flex items-center gap-2">
                <span className="text-green-600 text-sm">✅</span>
                <div>
                  {c.nombre && (
                    <p className="text-sm font-semibold text-green-900">{c.nombre}</p>
                  )}
                  {c.cargo && (
                    <p className="text-xs text-green-700">{c.cargo}</p>
                  )}
                  <span className="font-mono text-xs text-green-600">{c.address}</span>
                </div>
              </div>
              <button
                onClick={() => onRevocar(c.address)}
                disabled={loading}
                className="text-xs text-red-600 hover:text-red-800 font-semibold border border-red-200 hover:border-red-400 px-3 py-1 rounded-lg transition-colors disabled:opacity-50"
              >
                Revocar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
