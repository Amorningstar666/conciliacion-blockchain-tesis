import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useApp } from "../context/BlockchainContext";

function Field({ label, k, type = "text", placeholder = "", form, set, colSpan }) {
  return (
    <div className={colSpan ? `col-span-${colSpan}` : ""}>
      <label className="block text-xs text-gray-500 mb-1 font-medium">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={form[k]}
        onChange={(e) => set(k, e.target.value)}
        className="w-full text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
      />
    </div>
  );
}

export default function NuevaConciliacionModal({ visible, onClose, onCrear }) {
  const { contract, address: conciliadorAddress } = useApp();
  const hoy = new Date().toISOString().slice(0, 10);
  const en15 = new Date(Date.now() + 15 * 86400000).toISOString().slice(0, 10);

  const [conciliadoresDisponibles, setConciliadoresDisponibles] = useState([]);

  const [form, setForm] = useState({
    trabajadorNombre: "",
    trabajadorCC: "",
    trabajadorCorreo: "",
    cargo: "",
    fechaIngreso: "",
    fechaRetiro: "",
    trabajadorAddress: "",
    empleadorNombre: "",
    empleadorNIT: "",
    empleadorCorreo: "",
    empleadorWallet: "",
    hechos: "",
    conciliadorAddress: "",
    lugarFirma: "Bogotá D.C.",
    fechaPago: en15,
    modalidad: "unico",
    numeroCuotas: "1",
    montoETH: "0.1",
  });

  // Auto-rellenar dirección del conciliador con la wallet conectada
  useEffect(() => {
    if (visible && conciliadorAddress) {
      setForm((prev) => ({ ...prev, conciliadorAddress: conciliadorAddress }));
    }
  }, [visible, conciliadorAddress]);

  useEffect(() => {
    if (!contract || !visible) return;
    async function cargarConciliadores() {
      try {
        const filter = contract.filters.ConciliadorRegistrado();
        const eventos = await contract.queryFilter(filter);
        const activos = await Promise.all(
          eventos.map(async (e) => {
            const addr = e.args.conciliador;
            const autorizado = await contract.conciliadoresAutorizados(addr);
            return autorizado ? addr : null;
          })
        );
        setConciliadoresDisponibles(activos.filter(Boolean));
      } catch {
        setConciliadoresDisponibles([]);
      }
    }
    cargarConciliadores();
  }, [contract, visible]);

  if (!visible) return null;

  const set = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  const canCreate =
    !!form.trabajadorNombre &&
    !!form.empleadorNombre &&
    !!form.trabajadorAddress &&
    !!form.empleadorWallet &&
    !!form.conciliadorAddress &&
    ethers.isAddress(form.trabajadorAddress) &&
    ethers.isAddress(form.empleadorWallet) &&
    ethers.isAddress(form.conciliadorAddress);

  const handleCrear = () => {
    const year = new Date().getFullYear();
    const num = String(Math.floor(Math.random() * 9000) + 1000);
    const id = `PGN-LAB-${year}-${num}`;
    const fechaDisplay = new Date().toLocaleDateString("es-CO", {
      day: "numeric", month: "long", year: "numeric",
    });

    const hashActa = ethers.keccak256(
      ethers.toUtf8Bytes(`${form.trabajadorCC}-${form.empleadorNIT}-${Date.now()}`)
    );

    onCrear({
      id,
      fecha: fechaDisplay,
      hora: new Date().toTimeString().slice(0, 5),
      estado: "borrador",
      step: 1,
      bcState: null,
      txHash: "",
      hashActa,
      montoETH: form.montoETH,
      trabajador: {
        nombre: form.trabajadorNombre,
        cc: form.trabajadorCC,
        correo: form.trabajadorCorreo,
        cargo: form.cargo,
        fechaIngreso: form.fechaIngreso,
        fechaRetiro: form.fechaRetiro,
        wallet: form.trabajadorAddress,
      },
      empleador: {
        nombre: form.empleadorNombre,
        nit: form.empleadorNIT,
        correo: form.empleadorCorreo,
        wallet: form.empleadorWallet,
      },
      hechos: form.hechos,
      montos: {},
      clasificaciones: {},
      conceptosExtra: [],
      actaEstado: null,
      condiciones: {
        conciliadorAddress: form.conciliadorAddress,
        lugarFirma: form.lugarFirma,
        fechaPago: form.fechaPago,
        fechaFirma: hoy,
        modalidad: form.modalidad,
        numeroCuotas: form.numeroCuotas,
      },
    });

    setForm((prev) => ({
      ...prev,
      trabajadorNombre: "",
      trabajadorCC: "",
      trabajadorCorreo: "",
      cargo: "",
      fechaIngreso: "",
      fechaRetiro: "",
      trabajadorAddress: "",
      empleadorNombre: "",
      empleadorNIT: "",
      empleadorCorreo: "",
      empleadorWallet: "",
      hechos: "",
      montoETH: "0.1",
    }));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        <div className="bg-blue-900 rounded-t-2xl px-6 py-4 flex items-center justify-between sticky top-0">
          <div>
            <h2 className="text-white font-bold text-lg">Nueva Conciliación Laboral</h2>
            <p className="text-blue-300 text-xs mt-0.5">Complete los datos del caso para registrarlo en el sistema</p>
          </div>
          <button onClick={onClose} className="text-blue-200 hover:text-white text-2xl font-bold leading-none">×</button>
        </div>

        <div className="p-6 space-y-6">
          {/* Trabajador */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-blue-800 mb-3 border-b border-blue-100 pb-2 flex items-center gap-2">
              👷 Trabajador (Convocante)
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Nombre completo *" k="trabajadorNombre" placeholder="Nombre del trabajador" form={form} set={set} />
              <Field label="Cédula de ciudadanía" k="trabajadorCC" placeholder="12.345.678" form={form} set={set} />
              <Field label="Correo electrónico" k="trabajadorCorreo" type="email" placeholder="correo@ejemplo.com" form={form} set={set} />
              <Field label="Cargo desempeñado" k="cargo" placeholder="Ej: Maestro de Obra" form={form} set={set} />
              <Field label="Fecha de ingreso" k="fechaIngreso" type="date" form={form} set={set} />
              <Field label="Fecha de retiro" k="fechaRetiro" type="date" form={form} set={set} />
              <div className="col-span-2">
                <label className="block text-xs text-gray-500 mb-1 font-medium">
                  Wallet Ethereum del trabajador *
                </label>
                <input
                  type="text"
                  placeholder="0x... dirección de la cuenta del trabajador"
                  value={form.trabajadorAddress}
                  onChange={(e) => set("trabajadorAddress", e.target.value)}
                  className={`w-full font-mono text-sm border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50
                    ${form.trabajadorAddress && !ethers.isAddress(form.trabajadorAddress)
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200"}`}
                />
                {form.trabajadorAddress && !ethers.isAddress(form.trabajadorAddress) && (
                  <p className="text-xs text-red-500 mt-1">Dirección Ethereum inválida</p>
                )}
              </div>
            </div>
          </div>

          {/* Empleador */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-amber-800 mb-3 border-b border-amber-100 pb-2 flex items-center gap-2">
              🏢 Empleador (Convocado)
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Razón social *" k="empleadorNombre" placeholder="Empresa S.A.S." form={form} set={set} />
              <Field label="NIT" k="empleadorNIT" placeholder="900.123.456-7" form={form} set={set} />
              <div className="col-span-2">
                <Field label="Correo electrónico" k="empleadorCorreo" type="email" placeholder="empresa@correo.com" form={form} set={set} colSpan={2} />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-gray-500 mb-1 font-medium">
                  Wallet Ethereum del empleador *
                </label>
                <input
                  type="text"
                  placeholder="0x... dirección de la cuenta del empleador"
                  value={form.empleadorWallet}
                  onChange={(e) => set("empleadorWallet", e.target.value)}
                  className={`w-full font-mono text-sm border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-gray-50
                    ${form.empleadorWallet && !ethers.isAddress(form.empleadorWallet)
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200"}`}
                />
                {form.empleadorWallet && !ethers.isAddress(form.empleadorWallet) && (
                  <p className="text-xs text-red-500 mt-1">Dirección Ethereum inválida</p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  El empleador debe proveer su dirección para que le aparezca el acta al iniciar sesión
                </p>
              </div>
            </div>
          </div>

          {/* Hechos */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-3 border-b pb-2">
              📝 Hechos y Antecedentes
            </p>
            <textarea
              rows={3}
              placeholder="Describa brevemente la relación laboral y la causa de la solicitud de conciliación..."
              value={form.hechos}
              onChange={(e) => set("hechos", e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y bg-gray-50"
            />
          </div>

          {/* Condiciones del smart contract */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-blue-700 mb-3 border-b border-blue-100 pb-2 flex items-center gap-2">
              ⛓️ Condiciones del Smart Contract
            </p>
            <div className="grid grid-cols-2 gap-3">
              {/* Conciliador asignado — auto-rellenado con la wallet conectada */}
              <div className="col-span-2">
                <label className="block text-xs text-gray-500 mb-1 font-medium">
                  Conciliador asignado
                </label>
                {conciliadoresDisponibles.length === 0 ? (
                  <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    No hay conciliadores registrados en el contrato. El Admin PGN debe registrar uno primero.
                  </p>
                ) : (
                  <select
                    value={form.conciliadorAddress}
                    onChange={(e) => set("conciliadorAddress", e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 font-mono"
                  >
                    <option value="">— Seleccionar conciliador —</option>
                    {conciliadoresDisponibles.map((addr) => (
                      <option key={addr} value={addr}>{addr}</option>
                    ))}
                  </select>
                )}
                {form.conciliadorAddress && (
                  <p className="text-xs text-blue-600 mt-1 font-mono bg-blue-50 px-2 py-1 rounded">
                    ⚖️ {form.conciliadorAddress}
                  </p>
                )}
              </div>

              <Field label="Lugar de firma" k="lugarFirma" placeholder="Bogotá D.C." form={form} set={set} />
              <Field label="Fecha límite de pago" k="fechaPago" type="date" form={form} set={set} />

              <div>
                <label className="block text-xs text-gray-500 mb-1 font-medium">Modalidad de pago</label>
                <select
                  value={form.modalidad}
                  onChange={(e) => set("modalidad", e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                >
                  <option value="unico">Pago único</option>
                  <option value="cuotas">Pago en cuotas</option>
                </select>
              </div>

              {form.modalidad === "cuotas" && (
                <Field label="Número de cuotas" k="numeroCuotas" type="number" placeholder="Ej: 3" form={form} set={set} />
              )}

              <div className="col-span-2">
                <label className="block text-xs text-blue-700 mb-1 font-semibold">
                  Monto a depositar (ETH — red Hardhat demo)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={form.montoETH}
                    onChange={(e) => set("montoETH", e.target.value)}
                    className="w-36 text-sm border-2 border-blue-300 rounded-lg px-3 py-1.5 font-mono bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-blue-600 font-mono">ETH</span>
                  <span className="text-xs text-gray-400">(el empleador depositará este valor en el contrato)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3 justify-end pt-2 border-t border-gray-100">
            <button
              onClick={onClose}
              className="px-5 py-2 text-sm border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleCrear}
              disabled={!canCreate}
              className="px-6 py-2 text-sm bg-blue-900 text-white rounded-lg hover:bg-blue-800 font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-md"
            >
              Crear Conciliación
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
