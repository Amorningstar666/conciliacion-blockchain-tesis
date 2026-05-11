import { useState, useCallback, useMemo } from "react";
import {
  saveConciliacion,
  updateConciliacionStorage,
  getConciliacionesByWallet,
} from "../services/conciliacionStorage";
import { MOCK_CONCILIACIONES } from "../mock/mockData";

export function useConciliaciones() {
  const [conciliaciones, setConciliaciones] = useState([]);
  const [activeConciliacionId, setActiveConciliacionId] = useState(null);

  const activeConciliacion = useMemo(
    () => conciliaciones.find((c) => c.id === activeConciliacionId) || conciliaciones[0] || null,
    [conciliaciones, activeConciliacionId]
  );

  const loadForAddress = useCallback((address, role) => {
    if (!address) {
      setConciliaciones([]);
      setActiveConciliacionId(null);
      return;
    }
    let stored = getConciliacionesByWallet(address);
    if (stored.length === 0 && role === "conciliador") {
      localStorage.setItem("pgn_conciliaciones_v1", JSON.stringify(MOCK_CONCILIACIONES));
      stored = getConciliacionesByWallet(address);
    }
    setConciliaciones(stored);
    setActiveConciliacionId(stored.length > 0 ? stored[0].id : null);
  }, []);

  const updateConciliacion = useCallback((id, updates) => {
    setConciliaciones((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
    updateConciliacionStorage(id, updates);
  }, []);

  const updateActiva = useCallback(
    (updates) => {
      const targetId = activeConciliacionId || conciliaciones[0]?.id;
      if (targetId) updateConciliacion(targetId, updates);
    },
    [activeConciliacionId, conciliaciones, updateConciliacion]
  );

  const addConciliacion = useCallback((nuevaConciliacion) => {
    saveConciliacion(nuevaConciliacion);
    setConciliaciones((prev) => [...prev, nuevaConciliacion]);
    setActiveConciliacionId(nuevaConciliacion.id);
  }, []);

  const updateWallets = useCallback((tAddr, eAddr) => {
    setConciliaciones((prev) =>
      prev.map((c) => ({
        ...c,
        trabajador: { ...c.trabajador, wallet: tAddr },
        empleador: { ...c.empleador, wallet: eAddr },
      }))
    );
  }, []);

  const stats = useMemo(() => {
    const conRegistro = conciliaciones.filter((c) => c.bcState !== null && c.bcState !== undefined);
    const enCustodia = conciliaciones.filter((c) => c.bcState === "depositado");
    const validados = conciliaciones.filter((c) => c.bcState === "validado");
    const liberados = conciliaciones.filter((c) => c.bcState === "pagado");
    const pendientes = conciliaciones.filter((c) => !c.bcState);
    return { conRegistro, enCustodia, validados, liberados, pendientes };
  }, [conciliaciones]);

  return {
    conciliaciones,
    activeConciliacion,
    activeConciliacionId,
    setActiveConciliacionId,
    updateConciliacion,
    updateActiva,
    addConciliacion,
    updateWallets,
    loadForAddress,
    stats,
  };
}
