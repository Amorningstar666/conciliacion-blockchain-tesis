export const STATS_CONFIG = [
  { label: "Total comprometido", icon: "💼", border: "border-amber-400 bg-amber-50", text: "text-amber-700" },
  { label: "En custodia", icon: "🔒", border: "border-yellow-400 bg-yellow-50", text: "text-yellow-700" },
  { label: "Acta validada", icon: "✅", border: "border-blue-400 bg-blue-50", text: "text-blue-700" },
  { label: "Fondos liberados", icon: "💸", border: "border-green-400 bg-green-50", text: "text-green-700" },
];

export const FLUJO_CONFIG = [
  { n: 1, label: "El conciliador crea el acta", active: false },
  { n: 2, label: "Tú firmas y depositas ETH", active: true },
  { n: 3, label: "El conciliador valida el acta", active: false },
  { n: 4, label: "El trabajador retira los fondos", active: false },
];
