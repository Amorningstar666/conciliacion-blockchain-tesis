import React from "react";
import { useApp } from "../../context/BlockchainContext";
import { ROLE_CONFIG } from "../../constants/roles";
import { UserIcon } from "../icons";

export default function Header() {
  const { address, role } = useApp();
  const cfg = ROLE_CONFIG[role] || ROLE_CONFIG.sin_rol;

  return (
    <header className="bg-blue-900 text-white shadow-lg">
      <div className="max-w-screen-xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
            <span className="text-blue-900 font-black text-sm">PGN</span>
          </div>
          <div>
            <p className="text-xs text-blue-200 uppercase tracking-widest leading-tight">
              República de Colombia
            </p>
            <h1 className="text-base font-bold leading-tight">
              Procuraduría General de la Nación
            </h1>
            <p className="text-xs text-blue-300 leading-tight">
              Sistema de Conciliación Laboral — Plataforma Blockchain
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs text-blue-300">{cfg.label}</p>
            <p className="font-mono text-xs text-blue-200">{address ? `${address.slice(0, 14)}…` : "—"}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-blue-700 flex items-center justify-center">
            <UserIcon size={18} />
          </div>
        </div>
      </div>
    </header>
  );
}
