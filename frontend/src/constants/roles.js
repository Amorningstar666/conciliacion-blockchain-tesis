// Metadatos de presentación por rol. Las cuentas ya no están hardcodeadas aquí:
// se detectan dinámicamente consultando el contrato en roleDetector.js.
export const ROLE_CONFIG = {
  admin: {
    label: "Admin PGN",
    icon: "🏛️",
    shortDesc: "Registra y revoca conciliadores",
    border: "border-purple-400",
    hover: "hover:bg-purple-50",
    badge: "bg-purple-100 text-purple-800",
  },
  autoridad: {
    label: "Autoridad Judicial",
    icon: "⚖️",
    shortDesc: "Suspende acuerdos judicialmente",
    border: "border-indigo-400",
    hover: "hover:bg-indigo-50",
    badge: "bg-indigo-100 text-indigo-800",
  },
  conciliador: {
    label: "Conciliador PGN",
    icon: "🤝",
    shortDesc: "Valida actas en la blockchain",
    border: "border-blue-400",
    hover: "hover:bg-blue-50",
    badge: "bg-blue-100 text-blue-800",
  },
  empleador: {
    label: "Empleador",
    icon: "🏢",
    shortDesc: "Crea acuerdos y deposita fondos",
    border: "border-amber-400",
    hover: "hover:bg-amber-50",
    badge: "bg-amber-100 text-amber-800",
  },
  trabajador: {
    label: "Trabajador",
    icon: "👷",
    shortDesc: "Retira fondos cuando el acta está validada",
    border: "border-teal-400",
    hover: "hover:bg-teal-50",
    badge: "bg-teal-100 text-teal-800",
  },
  sin_rol: {
    label: "Sin rol asignado",
    icon: "👤",
    shortDesc: "Elige Empleador o Trabajador para continuar",
    border: "border-gray-300",
    hover: "hover:bg-gray-50",
    badge: "bg-gray-100 text-gray-600",
  },
};
