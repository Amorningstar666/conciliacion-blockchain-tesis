import React, { createContext, useContext, useCallback } from "react";
import { useBlockchain } from "../hooks/useBlockchain";
import { useConciliaciones } from "../hooks/useConciliaciones";
import { blockchainService } from "../services/blockchain";
import { getAcuerdoByHash } from "../services/indexer";
import { getConciliacionesByWallet } from "../services/conciliacionStorage";

const BlockchainContext = createContext(null);

export function BlockchainProvider({ children }) {
  const blockchain = useBlockchain();
  const conciliacionesState = useConciliaciones();

  // accountData: { address, privateKey, role, idx }
  const handleLogin = useCallback(async (accountData) => {
    const result = await blockchain.login(accountData);
    if (result) {
      // Cargar conciliaciones del localStorage filtradas por wallet
      conciliacionesState.loadForAddress(result.address, result.role);

      // Reconciliar estado blockchain en segundo plano
      const lista = getConciliacionesByWallet(result.address);
      if (lista.length > 0) {
        Promise.all(
          lista.filter((c) => c.hashActa).map(async (c) => {
            try {
              const acuerdo = await getAcuerdoByHash(c.hashActa, blockchainService.provider);
              if (acuerdo?.bcState) {
                conciliacionesState.updateConciliacion(c.id, { bcState: acuerdo.bcState });
              }
            } catch {}
          })
        );
      }
    }
    return result;
  }, [blockchain, conciliacionesState]);

  const handleFirmarEnBlockchain = useCallback(async (conciliacionId) => {
    const conc =
      conciliacionesState.conciliaciones.find((c) => c.id === conciliacionId) ||
      conciliacionesState.activeConciliacion;
    const cond = conc.condiciones || {};
    const monto = conc.montoETH || "0.1";
    const conciliadorAddress = cond.conciliadorAddress || "";
    console.log('conciliadorAddress ==>', conciliadorAddress);
    const trabajadorAddress = conc.trabajador?.wallet || "";

    const wallets = { trabajadorAddress, conciliadorAddress };
    const result = await blockchain.firmarEnBlockchain(conciliacionId, cond, monto, wallets);
    if (result) {
      conciliacionesState.updateConciliacion(conciliacionId, {
        bcState: "depositado",
        txHash: result.txHash,
        hashActa: result.hashActa,
        step: 4,
        estado: "listo",
      });
    }
    return result;
  }, [blockchain, conciliacionesState]);

  // hashActa: bytes32 hex string del acuerdo
  const handleValidarActa = useCallback(async (hashActa) => {
    const effectiveHash = hashActa || conciliacionesState.activeConciliacion?.hashActa;
    const txHash = await blockchain.validarActa(effectiveHash);
    if (txHash) {
      const matching = conciliacionesState.conciliaciones.find((c) => c.hashActa === effectiveHash);
      if (matching) conciliacionesState.updateConciliacion(matching.id, { bcState: "validado" });
      else conciliacionesState.updateActiva({ bcState: "validado" });
    }
    return txHash;
  }, [blockchain, conciliacionesState]);

  // hashActa: bytes32 hex string del acuerdo
  const handleRetirarFondos = useCallback(async (hashActa) => {
    const effectiveHash = hashActa || conciliacionesState.activeConciliacion?.hashActa;
    const txHash = await blockchain.retirarFondos(effectiveHash);
    if (txHash) {
      const matching = conciliacionesState.conciliaciones.find((c) => c.hashActa === effectiveHash);
      if (matching) conciliacionesState.updateConciliacion(matching.id, { bcState: "pagado" });
    }
    return txHash;
  }, [blockchain, conciliacionesState]);

  const handleLogout = useCallback(() => {
    blockchain.logout();
    conciliacionesState.loadForAddress(null);
  }, [blockchain, conciliacionesState]);

  const handleNuevaConciliacion = useCallback((nuevaConciliacion) => {
    conciliacionesState.addConciliacion(nuevaConciliacion);
  }, [conciliacionesState]);

  const value = {
    // Blockchain state
    connected: blockchain.connected,
    role: blockchain.role,
    address: blockchain.address,
    txLog: blockchain.txLog,
    loading: blockchain.loading,
    setRole: blockchain.setRole,

    // Acceso directo al servicio
    get provider() { return blockchainService.provider; },
    get signer() { return blockchainService.signer; },
    get contract() { return blockchainService.contract; },

    // Conciliaciones state
    conciliaciones: conciliacionesState.conciliaciones,
    activeConciliacion: conciliacionesState.activeConciliacion,
    activeConciliacionId: conciliacionesState.activeConciliacionId,
    setActiveConciliacionId: conciliacionesState.setActiveConciliacionId,
    updateActiva: conciliacionesState.updateActiva,
    stats: conciliacionesState.stats,

    // Actions
    login: handleLogin,
    logout: handleLogout,
    firmarEnBlockchain: handleFirmarEnBlockchain,
    validarActa: handleValidarActa,
    retirarFondos: handleRetirarFondos,
    crearNuevaConciliacion: handleNuevaConciliacion,
  };

  return (
    <BlockchainContext.Provider value={value}>
      {children}
    </BlockchainContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(BlockchainContext);
  if (!ctx) throw new Error("useApp must be used within BlockchainProvider");
  return ctx;
}
