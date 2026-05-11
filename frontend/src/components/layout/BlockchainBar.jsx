import React from "react";
import { ROLE_CONFIG } from "../../constants/roles";
import TransactionLog from "../ui/TransactionLog";

export default function BlockchainBar({ connected, role, address, txLog, loading }) {
  const cfg = ROLE_CONFIG[role];
 
  return (
    <div className="bg-gray-950 text-white px-6 py-3 space-y-2">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${connected ? "bg-green-400 animate-pulse" : "bg-red-500"}`} />
          <span className="text-xs font-mono text-gray-300">
            {connected ? "Hardhat local · localhost:8545" : "Sin conexión a Hardhat"}
          </span>
        </div>

        {connected && cfg && (
          <>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Rol:</span>
              <span className={`text-xs px-2.5 py-1 rounded font-medium bg-blue-600 text-white`}>
                {cfg.icon} {cfg.label}
              </span>
            </div>

            {address && (
              <span className="ml-auto text-xs font-mono text-green-400 bg-gray-800 px-2 py-1 rounded">
                {address.slice(0, 8)}…{address.slice(-6)}
              </span>
            )}
          </>
        )}
      </div>

      {txLog.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {txLog.slice(-3).map((e, i) => (
            <span key={i} className={`text-xs font-mono ${
              e.type === "err" ? "text-red-400" :
              e.type === "tx" ? "text-blue-300" :
              e.type === "warn" ? "text-yellow-400" :
              "text-green-400"
            }`}>
              [{e.t}] {e.msg}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
