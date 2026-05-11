import { useState, useEffect } from "react";
import { getAcuerdosByConciliador } from "../../../services/indexer";

export function usePendientesValidacion(address, provider) {
  const [pendientesValidacion, setPendientesValidacion] = useState([]);

  useEffect(() => {
    if (!address || !provider) return;
    getAcuerdosByConciliador(address, provider)
      .then((lista) =>
        setPendientesValidacion(lista.filter((a) => a.depositado && !a.validadoPorConciliador))
      )
      .catch(() => setPendientesValidacion([]));
  }, [address, provider]);

  return { pendientesValidacion };
}
