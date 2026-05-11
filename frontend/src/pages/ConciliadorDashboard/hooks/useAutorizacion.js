import { useState, useEffect } from "react";

export function useAutorizacion(contract, address) {
  const [autorizado, setAutorizado] = useState(true);

  useEffect(() => {
    if (!contract || !address) return;
    contract
      .conciliadoresAutorizados(address)
      .then((resultado) => setAutorizado(resultado))
      .catch(() => {});
  }, [contract, address]);

  return { autorizado };
}
