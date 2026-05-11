export const DERECHOS = [
  {
    id: 1,
    tipo: "cierto",
    concepto: "Salarios Adeudados",
    base: "Art. 127 CST",
    monto: 2500000,
    nota: "Derecho cierto e indiscutible. No puede conciliarse por valor inferior al adeudado.",
  },
  {
    id: 2,
    tipo: "cierto",
    concepto: "Cesantías",
    base: "Art. 249 CST",
    monto: 875000,
    nota: "Auxilio de cesantías irrenunciable. Calculado sobre último salario base.",
  },
  {
    id: 3,
    tipo: "cierto",
    concepto: "Intereses sobre Cesantías",
    base: "Ley 52/75",
    monto: 105000,
    nota: "El 12% anual sobre las cesantías. Irrenunciable.",
  },
  {
    id: 4,
    tipo: "cierto",
    concepto: "Prima de Servicios",
    base: "Art. 306 CST",
    monto: 1250000,
    nota: "Derecho cierto e irrenunciable. Equivale a 30 días por semestre.",
  },
  {
    id: 5,
    tipo: "cierto",
    concepto: "Vacaciones Compensadas",
    base: "Art. 186 CST",
    monto: 625000,
    nota: "Derecho adquirido proporcional al tiempo laborado.",
  },
  {
    id: 6,
    tipo: "incierto",
    concepto: "Indemnización por Despido Sin Justa Causa",
    base: "Art. 64 CST",
    monto: null,
    nota: "Discutible según la causal de terminación alegada por las partes.",
  },
  {
    id: 7,
    tipo: "incierto",
    concepto: "Horas Extra y Recargos",
    base: "Art. 168 CST",
    monto: null,
    nota: "Sujeto a verificación de registro de asistencia y liquidación.",
  },
  {
    id: 8,
    tipo: "incierto",
    concepto: "Daño Moral",
    base: "C.C. Art. 2341",
    monto: null,
    nota: "Estimación libre de las partes. Debe acreditarse el daño.",
  },
];

export const DERECHOS_CIERTOS = DERECHOS.filter((d) => d.tipo === "cierto");
export const TOTAL_CIERTOS = DERECHOS_CIERTOS.reduce((s, d) => s + d.monto, 0);
