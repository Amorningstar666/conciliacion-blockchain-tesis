import React from "react";
import { useApp } from "../../context/BlockchainContext";
import ActaPanel from "../../components/conciliacion/ActaPanel";
import TransactionLog from "../../components/ui/TransactionLog";
import { EmpleadorHeader } from "./components/EmpleadorHeader";
import { StatsCards } from "./components/StatsCards";
import { FlujoPasos } from "./components/FlujoPasos";
import { SidebarCasos } from "./components/SidebarCasos";
import { useEmpleadorDashboard } from "./hooks/useEmpleadorDashboard";

export default function EmpleadorDashboard() {
  const { address, conciliaciones, firmarEnBlockchain, logout, loading, txLog, stats } = useApp();
  const { activaId, setActivaId, activa } = useEmpleadorDashboard(conciliaciones);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <EmpleadorHeader address={address} onLogout={logout} />
      <main className="max-w-screen-xl mx-auto px-6 py-6 space-y-6">
        <StatsCards stats={stats} />
        <FlujoPasos />
        <div className="flex gap-6 items-start">
          <SidebarCasos conciliaciones={conciliaciones} activaId={activaId} onSelectCaso={setActivaId} />
          <div className="flex-1 min-w-0">
            <ActaPanel conciliacion={activa} onFirmar={firmarEnBlockchain} loading={loading} />
          </div>
        </div>
        <TransactionLog txLog={txLog} />
      </main>
    </div>
  );
}
