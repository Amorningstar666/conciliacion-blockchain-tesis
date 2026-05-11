import { useState, useEffect } from "react";
import { getAcuerdosByAddress } from "../../../services/indexer";

export function useAcuerdosTrabajador(address, provider) {
  const [acuerdos, setAcuerdos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!address || !provider) return;

    setLoading(true);
    getAcuerdosByAddress(address, provider)
      .then((lista) => setAcuerdos(lista.filter((a) => a.trabajador.toLowerCase() === address.toLowerCase())))
      .catch(() => setAcuerdos([]))
      .finally(() => setLoading(false));
  }, [address, provider]);

  const enCustodia = acuerdos.filter((c) => c.bcState === "depositado");
  const listosCobrar = acuerdos.filter((c) => c.bcState === "validado");
  const cobrados = acuerdos.filter((c) => c.bcState === "pagado");

  return { acuerdos, loading, enCustodia, listosCobrar, cobrados };
}
