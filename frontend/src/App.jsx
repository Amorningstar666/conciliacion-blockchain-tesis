import React from "react";
import { BlockchainProvider, useApp } from "./context/BlockchainContext";
import LoginScreen from "./pages/LoginScreen";
import ConciliadorDashboard from "./pages/ConciliadorDashboard";
import EmpleadorDashboard from "./pages/EmpleadorDashboard";
import TrabajadorDashboard from "./pages/TrabajadorDashboard";
import AdminDashboard from "./pages/AdminDashboard";

function AppRouter() {
  const { role, login, loading } = useApp();

  if (!role) {
    return <LoginScreen onLogin={login} connecting={loading} />;
  }
  if (role === "empleador") return <EmpleadorDashboard />;
  if (role === "trabajador") return <TrabajadorDashboard />;
  if (role === "admin") return <AdminDashboard />;
  if (role === "conciliador") return <ConciliadorDashboard />;
  if (role === "autoridad") return <ConciliadorDashboard />;
  return null;
}

export default function App() {
  return (
    <BlockchainProvider>
      <AppRouter />
    </BlockchainProvider>
  );
}
