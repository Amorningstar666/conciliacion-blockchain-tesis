import { useState, useCallback } from "react";
import { blockchainService } from "../services/blockchain";

export function useBlockchain() {
  const [connected, setConnected] = useState(false);
  const [role, setRole] = useState(null);       // string: "admin"|"autoridad"|"conciliador"|"empleador"|"trabajador"
  const [address, setAddress] = useState("");
  const [txLog, setTxLog] = useState([]);
  const [loading, setLoading] = useState(false);

  const addLog = useCallback((msg, type = "ok") => {
    setTxLog((prev) => [...prev.slice(-5), { msg, type, t: new Date().toLocaleTimeString("es-CO") }]);
  }, []);

  // accountData: { address, privateKey, role, idx }
  const login = useCallback(async (accountData) => {
    setLoading(true);
    try {
      const { address: addr } = await blockchainService.connectWithPrivateKey(accountData.privateKey);
      setConnected(true);
      setAddress(addr);
      setRole(accountData.role);
      addLog(`Conectado como ${accountData.role} (${addr.slice(0, 10)}…) ✓`);
      setLoading(false);
      return { address: addr, role: accountData.role };
    } catch {
      alert("No se pudo conectar a Hardhat.\n¿Está corriendo 'npx hardhat node'?");
      setLoading(false);
      return null;
    }
  }, [addLog]);

  const logout = useCallback(() => {
    blockchainService.disconnect();
    setConnected(false);
    setRole(null);
    setAddress("");
  }, []);

  const firmarEnBlockchain = useCallback(async (conciliacionId, condiciones, montoETH, wallets) => {
    if (!connected) { addLog("Conecta a Hardhat primero.", "err"); return null; }
    if (role !== "empleador") { addLog("Solo el Empleador puede depositar los fondos.", "warn"); return null; }
    setLoading(true);
    try {
      addLog(`Depositando ${montoETH} ETH en el contrato…`);
      const result = await blockchainService.crearAcuerdo({
        conciliacionId,
        condiciones,
        montoETH,
        trabajadorAddress: wallets?.trabajadorAddress,
        conciliadorAddress: wallets?.conciliadorAddress,
      });
      addLog(`TX: ${result.txHash.slice(0, 16)}…`, "tx");
      addLog("Fondos en custodia del contrato ✓");
      setLoading(false);
      return result;
    } catch (e) {
      addLog("Error: " + (e.reason || e.message), "err");
      setLoading(false);
      return null;
    }
  }, [connected, role, addLog]);

  const validarActa = useCallback(async (hashActa) => {
    if (role !== "conciliador") { addLog("Solo el Conciliador puede validar el acta.", "warn"); return null; }
    setLoading(true);
    try {
      addLog("Validando acta como Conciliador PGN…");
      const { txHash } = await blockchainService.validarActa(hashActa);
      addLog(`TX: ${txHash.slice(0, 16)}…`, "tx");
      addLog("Acta validada legalmente por la PGN ✓");
      setLoading(false);
      return txHash;
    } catch (e) {
      addLog("Error: " + (e.reason || e.message), "err");
      setLoading(false);
      return null;
    }
  }, [role, addLog]);

  const retirarFondos = useCallback(async (hashActa) => {
    if (role !== "trabajador") { addLog("Solo el Trabajador puede retirar fondos.", "warn"); return null; }
    setLoading(true);
    try {
      addLog("Retirando fondos hacia la wallet del Trabajador…");
      const { txHash } = await blockchainService.retirarFondos(hashActa);
      addLog(`TX: ${txHash.slice(0, 16)}…`, "tx");
      addLog("¡Fondos transferidos al Trabajador! ✓");
      setLoading(false);
      return txHash;
    } catch (e) {
      addLog("Error: " + (e.reason || e.message), "err");
      setLoading(false);
      return null;
    }
  }, [role, addLog]);

  return {
    connected, role, address, txLog, loading,
    login, logout,
    firmarEnBlockchain, validarActa, retirarFondos,
    setRole,
  };
}
