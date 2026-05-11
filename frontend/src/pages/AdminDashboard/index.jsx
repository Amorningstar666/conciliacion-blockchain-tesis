import React, { useEffect } from "react";
import { useApp } from "../../context/BlockchainContext";
import { AdminHeader } from "./components/AdminHeader";
import { StatsAdmin } from "./components/StatsAdmin";
import { FormRegistrar } from "./components/FormRegistrar";
import { ListaConciliadores } from "./components/ListaConciliadores";
import { useConciliadores } from "./hooks/useConciliadores";
import { useAdminStats } from "./hooks/useAdminStats";

export default function AdminDashboard() {
  const { contract, address, logout } = useApp();
  const { conciliadores, loading, msg, cargar, registrar, revocar } = useConciliadores(contract);
  const { totalAcuerdos } = useAdminStats(contract, conciliadores.length);

  useEffect(() => {
    if (contract) cargar();
  }, [contract, cargar]);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader address={address} onLogout={logout} />
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <h2 className="text-xl font-bold text-blue-900">Panel de Administración PGN</h2>
        <StatsAdmin conciliadoresLength={conciliadores.length} totalAcuerdos={totalAcuerdos} />
        <FormRegistrar onRegistrar={registrar} loading={loading} msg={msg} />
        <ListaConciliadores conciliadores={conciliadores} loading={loading} onRevocar={revocar} />
      </div>
    </div>
  );
}
