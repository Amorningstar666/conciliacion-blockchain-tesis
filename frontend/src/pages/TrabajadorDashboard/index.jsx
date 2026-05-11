import React from "react";
import { useApp } from "../../context/BlockchainContext";
import TransactionLog from "../../components/ui/TransactionLog";
import { TrabajadorHeader } from "./components/TrabajadorHeader";
import { StatsCards } from "./components/StatsCards";
import { FlujoPasos } from "./components/FlujoPasos";
import { ListaAcuerdos } from "./components/ListaAcuerdos";
import { PanelPendientesAceptar } from "./components/PanelPendientesAceptar";
import { PanelFondosDisponibles } from "./components/PanelFondosDisponibles";
import { useAcuerdosTrabajador } from "./hooks/useAcuerdosTrabajador";
import { usePendientesTrabajador } from "./hooks/usePendientesTrabajador";

export default function TrabajadorDashboard() {
  const { address, provider, retirarFondos, logout, loading, txLog } = useApp();
  const { acuerdos, loading: loadingBc, enCustodia, listosCobrar, cobrados } = useAcuerdosTrabajador(address, provider);
  const { pendientes, aceptarConciliacion } = usePendientesTrabajador(address);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <TrabajadorHeader address={address} onLogout={logout} />

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        <StatsCards enCustodia={enCustodia} listosCobrar={listosCobrar} cobrados={cobrados} />

        {pendientes.length > 0 && (
          <PanelPendientesAceptar pendientes={pendientes} onAceptar={aceptarConciliacion} />
        )}

        {listosCobrar.length > 0 && (
          <PanelFondosDisponibles
            listosCobrar={listosCobrar}
            onRetirarFondos={retirarFondos}
            loading={loading}
          />
        )}

        <FlujoPasos />
        <ListaAcuerdos acuerdos={acuerdos} loading={loadingBc} onRetirarFondos={retirarFondos} />
        <TransactionLog txLog={txLog} />
      </main>
    </div>
  );
}
