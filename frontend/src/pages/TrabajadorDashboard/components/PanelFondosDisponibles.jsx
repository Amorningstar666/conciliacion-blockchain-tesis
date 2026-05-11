import { sumETH } from "../../../utils/format";

export function PanelFondosDisponibles({ listosCobrar, onRetirarFondos, loading }) {
  if (listosCobrar.length === 0) return null;

  const total = sumETH(listosCobrar);

  return (
    <div className="bg-green-50 border-2 border-green-400 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-green-600 text-lg">💰</span>
            <h2 className="font-bold text-green-800 text-sm uppercase tracking-wide">
              Fondos Disponibles para Retirar
            </h2>
          </div>
          <p className="text-xs text-green-600">
            {listosCobrar.length} acuerdo{listosCobrar.length !== 1 ? "s" : ""} validado{listosCobrar.length !== 1 ? "s" : ""} por el conciliador
          </p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-black text-green-700">{total} ETH</p>
          <p className="text-xs text-green-500">Total disponible</p>
        </div>
      </div>

      <div className="space-y-2">
        {listosCobrar.map((acuerdo) => (
          <div
            key={acuerdo.hashActa}
            className="bg-white rounded-lg border border-green-200 p-3 flex items-center justify-between gap-4"
          >
            <div className="flex-1 min-w-0">
              <p className="font-mono text-xs text-gray-400 truncate">
                {acuerdo.hashActa.slice(0, 22)}…
              </p>
              <p className="font-mono text-xs text-gray-500">
                Empleador: {acuerdo.empleador.slice(0, 14)}…
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className="font-bold text-green-700 text-sm">{acuerdo.monto} ETH</span>
              <button
                onClick={() => onRetirarFondos(acuerdo.hashActa)}
                disabled={loading}
                className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors font-bold disabled:opacity-50 shadow hover:shadow-md"
              >
                {loading ? "Procesando…" : "Retirar"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
