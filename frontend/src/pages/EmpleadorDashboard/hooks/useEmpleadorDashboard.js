import { useState } from "react";

export function useEmpleadorDashboard(conciliaciones) {
  const [activaId, setActivaId] = useState(conciliaciones[0]?.id || null);
  const activa = conciliaciones.find((c) => c.id === activaId) || null;

  return { activaId, setActivaId, activa };
}
