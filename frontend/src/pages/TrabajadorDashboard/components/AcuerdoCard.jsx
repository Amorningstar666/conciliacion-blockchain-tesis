import { TrabajadorBcBadge } from "../../../components/ui/StatusBadge";

export function AcuerdoCard({ acuerdo, onRetirarFondos, loading }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded truncate max-w-[180px]">
              {acuerdo.hashActa.slice(0, 18)}…
            </span>
            <TrabajadorBcBadge bcState={acuerdo.bcState} />
          </div>
          <p className="font-mono text-xs text-gray-500">Empleador: {acuerdo.empleador.slice(0, 14)}…</p>
          <p className="font-mono text-xs text-gray-500">Conciliador: {acuerdo.conciliador.slice(0, 14)}…</p>
          <p className="text-xs text-gray-400 mt-1">{acuerdo.fechaCreacion} · {acuerdo.lugarConciliacion}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-2xl font-black text-blue-900">{acuerdo.monto} ETH</p>
          <p className="text-xs text-gray-400 mb-3">Red Hardhat local</p>
          {acuerdo.bcState === "validado" && (
            <button
              onClick={() => onRetirarFondos(acuerdo.hashActa)}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors font-bold disabled:opacity-50 shadow-lg hover:shadow-xl"
            >
              💰 {loading ? "Procesando…" : "Retirar Fondos"}
            </button>
          )}
          {acuerdo.bcState === "pagado" && (
            <span className="text-xs text-blue-600 font-semibold">Transferido a tu wallet ✓</span>
          )}
          {acuerdo.bcState === "depositado" && (
            <span className="text-xs text-yellow-600">Esperando validación del conciliador</span>
          )}
        </div>
      </div>
    </div>
  );
}
