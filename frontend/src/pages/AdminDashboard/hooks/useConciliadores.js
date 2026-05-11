import { useState, useCallback } from "react";
import { ethers } from "ethers";
import { cargarConciliadores, registrarConciliador, revocarConciliador } from "../services/adminService";

export function useConciliadores(contract) {
  const [conciliadores, setConciliadores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const cargar = useCallback(async () => {
    try {
      const lista = await cargarConciliadores(contract);
      setConciliadores(lista);
    } catch (e) {
      setMsg({ tipo: "error", texto: "Error cargando conciliadores: " + e.message });
    }
  }, [contract]);

  const registrar = async (nuevaDireccion, nombre, cargo) => {
    if (!ethers.isAddress(nuevaDireccion)) {
      setMsg({ tipo: "error", texto: "Dirección Ethereum inválida" });
      return;
    }
    setLoading(true);
    setMsg(null);
    try {
      await registrarConciliador(contract, nuevaDireccion, nombre, cargo);
      setConciliadores((prev) => [...prev, { address: nuevaDireccion, autorizado: true, nombre, cargo }]);
      setMsg({ tipo: "ok", texto: "Conciliador registrado correctamente" });
    } catch (e) {
      setMsg({ tipo: "error", texto: e.reason || e.message });
    } finally {
      setLoading(false);
    }
  };

  const revocar = async (addr) => {
    if (!window.confirm(`¿Revocar al conciliador ${addr.slice(0, 14)}...?`)) return;
    setLoading(true);
    setMsg(null);
    try {
      await revocarConciliador(contract, addr);
      setConciliadores((prev) => prev.filter((c) => c.address !== addr));
      setMsg({ tipo: "ok", texto: "Conciliador revocado" });
    } catch (e) {
      setMsg({ tipo: "error", texto: e.reason || e.message });
    } finally {
      setLoading(false);
    }
  };

  return { conciliadores, loading, msg, cargar, registrar, revocar };
}
