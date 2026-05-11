export const STATS_CONFIG = [
  { label: "En custodia", key: "enCustodia", border: "border-yellow-400 bg-yellow-50", text: "text-yellow-700" },
  { label: "Listo para cobrar", key: "listosCobrar", border: "border-green-400 bg-green-50", text: "text-green-700" },
  { label: "Cobrado", key: "cobrados", border: "border-blue-400 bg-blue-50", text: "text-blue-700" },
];

export const FLUJO_PASOS = [
  { numero: "1", estado: "En custodia", desc: "El empleador depositó los fondos en el contrato" },
  { numero: "2", estado: "Validado", desc: "El conciliador PGN firmó el acta. Ya puedes retirar." },
  { numero: "3", estado: "Cobrado", desc: "Los fondos fueron transferidos a tu wallet" },
];
