export function ConciliacionPendienteCard({ conciliacion, onAceptar }) {
  const { id, empleador, trabajador, hechos, condiciones, montoETH, fecha } = conciliacion;

  return (
    <div className="bg-white rounded-xl border-2 border-amber-300 shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full">
              ✍️ Pendiente de tu firma
            </span>
            <span className="font-mono text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
              {id}
            </span>
          </div>

          <p className="font-semibold text-gray-800 text-sm">
            {empleador?.nombre || "Empleador desconocido"}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            Conciliador: {condiciones?.conciliadoraNombre || condiciones?.conciliadorAddress?.slice(0, 14) + "…"}
          </p>

          {hechos && (
            <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">
              {hechos}
            </p>
          )}

          <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
            <span>📅 {fecha || condiciones?.fechaFirma || "—"}</span>
            <span>📍 {condiciones?.lugarFirma || "—"}</span>
            <span>
              💳 Modalidad:{" "}
              {condiciones?.modalidad === "cuotas"
                ? `${condiciones.numeroCuotas} cuota(s)`
                : "Pago único"}
            </span>
          </div>
        </div>

        <div className="text-right flex-shrink-0 flex flex-col items-end gap-3">
          <div>
            <p className="text-2xl font-black text-blue-900">{montoETH} ETH</p>
            <p className="text-xs text-gray-400">Monto acordado</p>
          </div>
          <button
            onClick={() => onAceptar(conciliacion.id)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white text-sm rounded-lg hover:bg-amber-600 transition-colors font-bold shadow-md hover:shadow-lg"
          >
            ✅ Aceptar Acuerdo
          </button>
        </div>
      </div>
    </div>
  );
}
