import { useState, useEffect, useCallback } from "react";
import { getConciliacionesByWallet, updateConciliacionStorage } from "../../../services/conciliacionStorage";

export function usePendientesTrabajador(address) {
  const [pendientes, setPendientes] = useState([]);

  const cargar = useCallback(() => {
    if (!address) return;
    const todos = getConciliacionesByWallet(address);
    const addr = address.toLowerCase();
    setPendientes(
      todos.filter(
        (c) =>
          c.estado === "trabajador" &&
          (c.trabajador?.wallet || "").toLowerCase() === addr
      )
    );
  }, [address]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const aceptarConciliacion = useCallback(
    (id) => {
      updateConciliacionStorage(id, { estado: "empleador", step: 3 });
      cargar();
    },
    [cargar]
  );

  return { pendientes, aceptarConciliacion };
}
