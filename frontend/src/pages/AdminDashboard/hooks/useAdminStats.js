import { useState, useEffect } from "react";
import { cargarTotalAcuerdos } from "../services/adminService";

export function useAdminStats(contract, conciliadoresLength) {
  const [totalAcuerdos, setTotalAcuerdos] = useState(0);

  useEffect(() => {
    if (!contract) return;
    cargarTotalAcuerdos(contract)
      .then((total) => setTotalAcuerdos(total))
      .catch(() => {});
  }, [contract]);

  return { totalAcuerdos, conciliadoresLength };
}
