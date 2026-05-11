import { useMemo } from "react";
import { DERECHOS } from "../../../constants/derechos";
import { calcularTotalCiertos, calcularTotalInciertos } from "../utils/actaCalculators";
import { getConciliadorByAddress } from "../../AdminDashboard/services/adminService";

export function useDatosActa(activeConciliacion, conceptosExtra, clasificaciones, montos, currentStep, userAddress) {
  const acta = useMemo(() => {
    const infoConciliador = getConciliadorByAddress(userAddress);
    return {
      radicado: activeConciliacion?.id || "—",
      fecha: activeConciliacion?.fecha || "—",
      conciliador: infoConciliador?.nombre || activeConciliacion?.condiciones?.conciliadoraNombre || activeConciliacion?.condiciones?.conciliadorAddress || "—",
      conciliadorCargo: infoConciliador?.cargo || activeConciliacion?.condiciones?.conciliadoraCargo || "Conciliadora Extrajudicial",
      conciliadorEntidad: activeConciliacion?.condiciones?.conciliadoraEntidad || "Procuraduría General de la Nación",
      conciliadorEmail: activeConciliacion?.condiciones?.conciliadoraEmail || "",
      trabajador: activeConciliacion?.trabajador?.nombre || "—",
      ccTrabajador: activeConciliacion?.trabajador?.cc || "—",
      correoTrabajador: activeConciliacion?.trabajador?.correo || "—",
      empleador: activeConciliacion?.empleador?.nombre || "—",
      nitEmpleador: activeConciliacion?.empleador?.nit || "—",
      correoEmpleador: activeConciliacion?.empleador?.correo || "—",
      cargo: activeConciliacion?.trabajador?.cargo || "—",
      fechaIngreso: activeConciliacion?.trabajador?.fechaIngreso || "—",
      fechaRetiro: activeConciliacion?.trabajador?.fechaRetiro || "—",
    };
  }, [activeConciliacion, userAddress]);

  const todosDerechos = useMemo(() => [...DERECHOS, ...conceptosExtra], [conceptosExtra]);

  const totalCiertos = useMemo(
    () => calcularTotalCiertos(todosDerechos, clasificaciones, montos),
    [todosDerechos, clasificaciones, montos]
  );

  const totalInciertos = useMemo(
    () => calcularTotalInciertos(todosDerechos, clasificaciones, montos),
    [todosDerechos, clasificaciones, montos]
  );

  const badgeEstadoActa = currentStep >= 4 ? "listo" : currentStep === 3 ? "aprobado" : currentStep === 2 ? "trabajador" : "borrador";

  return { acta, todosDerechos, totalCiertos, totalInciertos, badgeEstadoActa };
}
