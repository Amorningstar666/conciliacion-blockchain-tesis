import React, { useState } from "react";
import { useApp } from "../../context/BlockchainContext";
import Header from "../../components/layout/Header";
import BlockchainBar from "../../components/layout/BlockchainBar";
import Stepper from "../../components/ui/Stepper";
import ModalCrearActa from "../../modals/ModalCrearActa";
import NuevaConciliacionModal from "../../modals/NuevaConciliacionModal";
import { PdfIcon, MailIcon, BlockchainIcon } from "../../components/icons";

import { useAutorizacion } from "./hooks/useAutorizacion";
import { usePendientesValidacion } from "./hooks/usePendientesValidacion";
import { useDatosActa } from "./hooks/useDatosActa";
import { useConceptosExtra } from "./hooks/useConceptosExtra";
import { OPEN_SECTIONS_DEFAULT } from "./constants/dashboardConstants";
import { SidebarConciliaciones } from "./components/SidebarConciliaciones";
import { NotificacionActa } from "./components/NotificacionActa";
import { HeaderActa } from "./components/HeaderActa";
import { SeccionPartes } from "./components/SeccionPartes";
import { SeccionHechos } from "./components/SeccionHechos";
import { SeccionAcuerdos } from "./components/SeccionAcuerdos";
import { SeccionPago } from "./components/SeccionPago";
import { ConfirmacionBlockchain } from "./components/ConfirmacionBlockchain";

export default function ConciliadorDashboard() {
  const {
    connected, role, address, txLog, loading, provider, contract,
    conciliaciones, activeConciliacion, activeConciliacionId,
    setActiveConciliacionId, updateActiva, logout,
    firmarEnBlockchain, validarActa, retirarFondos, crearNuevaConciliacion, stats,
  } = useApp();

  const [showNuevaConciliacion, setShowNuevaConciliacion] = useState(false);
  const [showCrearActa, setShowCrearActa] = useState(false);
  const [actaNotificacion, setActaNotificacion] = useState(null);
  const [openSections, setOpenSections] = useState(OPEN_SECTIONS_DEFAULT);

  const { autorizado } = useAutorizacion(contract, address);
  const { pendientesValidacion } = usePendientesValidacion(address, provider);

  const currentStep = activeConciliacion?.step || 1;
  const condicionesPago = activeConciliacion?.condiciones || {};
  const montos = activeConciliacion?.montos || {};
  const montoETH = activeConciliacion?.montoETH || "0.1";
  const bcStatus = activeConciliacion?.bcState || null;
  const bcTxHash = activeConciliacion?.txHash || "";
  const actaEstado = activeConciliacion?.actaEstado || null;
  const clasificaciones = activeConciliacion?.clasificaciones || {};
  const conceptosExtra = activeConciliacion?.conceptosExtra || [];

  const { acta, todosDerechos, totalCiertos, totalInciertos, badgeEstadoActa } = useDatosActa(
    activeConciliacion, conceptosExtra, clasificaciones, montos, currentStep, address
  );

  const { nuevoConcepto, setNuevoConcepto, showAgregarConcepto, setShowAgregarConcepto, handleAgregarConcepto, handleEliminarConcepto } =
    useConceptosExtra(conceptosExtra, updateActiva);

  const handleSelectConciliacion = (id) => {
    setActiveConciliacionId(id);
    setOpenSections(OPEN_SECTIONS_DEFAULT);
    setActaNotificacion(null);
  };

  const handleCrearActa = () => {
    setShowCrearActa(false);
    updateActiva({ actaEstado: "enviada", step: 2, estado: "trabajador" });
    setActaNotificacion({
      radicado: acta.radicado,
      trabajador: acta.trabajador,
      empleador: acta.empleador,
      correoTrabajador: acta.correoTrabajador,
      correoEmpleador: acta.correoEmpleador,
    });
  };

  return (
    <>
      <NuevaConciliacionModal
        visible={showNuevaConciliacion}
        onClose={() => setShowNuevaConciliacion(false)}
        onCrear={crearNuevaConciliacion}
      />
      <ModalCrearActa
        visible={showCrearActa}
        onClose={() => setShowCrearActa(false)}
        onConfirm={handleCrearActa}
        acta={acta}
        condicionesPago={condicionesPago}
        totalCiertos={totalCiertos}
        totalInciertos={totalInciertos}
      />

      <div className="min-h-screen bg-gray-50 font-sans">
        <Header />
        <BlockchainBar connected={connected} role={role} address={address} txLog={txLog} loading={loading} />
        <Stepper currentStep={currentStep} onStepClick={(step) => updateActiva({ step })} />

        <NotificacionActa actaNotificacion={actaNotificacion} onClose={() => setActaNotificacion(null)} />

        <main className="max-w-screen-xl mx-auto px-6 py-6 flex gap-6">
          <SidebarConciliaciones
            conciliaciones={conciliaciones}
            activeConciliacionId={activeConciliacionId}
            onSelect={handleSelectConciliacion}
            onNuevaConciliacion={() => setShowNuevaConciliacion(true)}
            autorizado={autorizado}
            pendientesValidacion={pendientesValidacion}
            stats={stats}
            role={role}
            address={address}
            logout={logout}
            loading={loading}
            validarActa={validarActa}
          />

          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <HeaderActa acta={acta} badgeEstadoActa={badgeEstadoActa} actaEstado={actaEstado} />

              <div className="px-8 py-6 space-y-6">
                {!activeConciliacion && (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <p className="text-4xl mb-4">⚖️</p>
                    <p className="text-gray-600 font-semibold text-lg mb-1">Sin conciliación activa</p>
                    <p className="text-gray-400 text-sm mb-6">
                      Selecciona un caso del panel izquierdo o crea una nueva conciliación para comenzar.
                    </p>
                    <button
                      onClick={() => setShowNuevaConciliacion(true)}
                      disabled={!autorizado}
                      className="px-5 py-2 bg-blue-900 text-white rounded-lg text-sm font-semibold hover:bg-blue-800 transition-colors disabled:opacity-40"
                    >
                      + Nueva conciliación
                    </button>
                  </div>
                )}
                {activeConciliacion && (
                  <>
                    <SeccionPartes
                      activeConciliacion={activeConciliacion}
                      openSections={openSections}
                      onToggle={(key) => setOpenSections((p) => ({ ...p, [key]: !p[key] }))}
                      onTrabajadorChange={(campo, valor) => updateActiva({ trabajador: { ...activeConciliacion?.trabajador, [campo]: valor } })}
                      onEmpleadorChange={(campo, valor) => updateActiva({ empleador: { ...activeConciliacion?.empleador, [campo]: valor } })}
                    />
                    <SeccionHechos
                      activeConciliacion={activeConciliacion}
                      openSections={openSections}
                      onToggle={(key) => setOpenSections((p) => ({ ...p, [key]: !p[key] }))}
                      onHechosChange={(valor) => updateActiva({ hechos: valor })}
                      onPretensionesChange={(valor) => updateActiva({ pretensiones: valor })}
                    />
                    <SeccionAcuerdos
                      todosDerechos={todosDerechos}
                      montos={montos}
                      clasificaciones={clasificaciones}
                      conceptosExtra={conceptosExtra}
                      totalCiertos={totalCiertos}
                      totalInciertos={totalInciertos}
                      openSections={openSections}
                      onToggle={(key) => setOpenSections((p) => ({ ...p, [key]: !p[key] }))}
                      onMontoChange={(id, val) => updateActiva({ montos: { ...montos, [id]: val } })}
                      onClasificacionChange={(id, tipo) => updateActiva({ clasificaciones: { ...clasificaciones, [id]: tipo } })}
                      nuevoConcepto={nuevoConcepto}
                      setNuevoConcepto={setNuevoConcepto}
                      showAgregarConcepto={showAgregarConcepto}
                      setShowAgregarConcepto={setShowAgregarConcepto}
                      onAgregarConcepto={handleAgregarConcepto}
                      onEliminarConcepto={handleEliminarConcepto}
                    />
                    <SeccionPago
                      condicionesPago={condicionesPago}
                      onCondicionChange={(campo, valor) => updateActiva({ condiciones: { ...condicionesPago, [campo]: valor } })}
                      montoETH={montoETH}
                      onMontoETHChange={(v) => updateActiva({ montoETH: v })}
                      acta={acta}
                      totalCiertos={totalCiertos}
                      totalInciertos={totalInciertos}
                      openSections={openSections}
                      onToggle={(key) => setOpenSections((p) => ({ ...p, [key]: !p[key] }))}
                    />

                    <div className="border border-gray-200 rounded-lg p-5 bg-gray-50">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                        V. Fórmula de Arreglo y Efecto Jurídico
                      </p>
                      <textarea
                        rows={3}
                        value={activeConciliacion?.formulaArreglo ?? "Las partes manifiestan su acuerdo libre, informado y voluntario sobre los montos especificados, los cuales serán pagados en los plazos convenidos. El presente acuerdo presta mérito ejecutivo y hace tránsito a cosa juzgada (Art. 66 Ley 2220/2022). El registro en la red blockchain garantizará la inmutabilidad e integridad del acta."}
                        onChange={(e) => updateActiva({ formulaArreglo: e.target.value })}
                        className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed bg-white resize-y"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2" />
                      <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
                          <PdfIcon size={15} /> Ver PDF
                        </button>
                        {currentStep === 1 && !actaEstado && (
                          <button
                            onClick={() => setShowCrearActa(true)}
                            className="flex items-center gap-2 px-5 py-2 text-sm bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors font-semibold shadow-sm"
                          >
                            <MailIcon size={15} /> Crear Acta
                          </button>
                        )}
                        {currentStep >= 1 && actaEstado === "enviada" && currentStep < 3 && (
                          <span className="flex items-center gap-2 px-4 py-2 text-sm bg-amber-50 border border-amber-300 text-amber-800 rounded-lg font-semibold">
                            <MailIcon size={14} /> Enviada · En espera de firma
                          </span>
                        )}
                        {currentStep >= 3 && currentStep < 4 && (
                          <button
                            onClick={() => firmarEnBlockchain(activeConciliacion.id)}
                            disabled={loading || !connected}
                            className="flex items-center gap-2 px-5 py-2 text-sm bg-emerald-700 text-white rounded-lg hover:bg-emerald-600 transition-colors font-semibold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <BlockchainIcon size={15} />
                            {loading ? "Enviando TX…" : "Firmar en Red Hardhat"}
                          </button>
                        )}
                      </div>
                    </div>

                    {currentStep === 4 && (
                      <ConfirmacionBlockchain
                        bcStatus={bcStatus}
                        bcTxHash={bcTxHash}
                        activeConciliacion={activeConciliacion}
                        validarActa={validarActa}
                        retirarFondos={retirarFondos}
                        loading={loading}
                      />
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
