// ─────────────────────────────────────────────────────────────────────────────
// DATOS MOCK — Solo para pruebas. No importar en producción.
// Para cargar en localStorage: seedMockData() desde la consola del navegador.
// ─────────────────────────────────────────────────────────────────────────────

// Las wallets se derivan de los mismos índices configurados en ROLES_FIJOS.
// Para cambiar qué cuenta Hardhat usa cada rol, edita:
//   src/pages/LoginScreen/constants/roles.js  ← pkIdx de cada rol
import { ethers } from "ethers";
import { HARDHAT_PRIVATE_KEYS } from "../services/hardhatAccounts";
import { ROLES_FIJOS } from "../pages/LoginScreen/constants/roles";

function addrFromRole(roleName) {
  const rol = ROLES_FIJOS.find((r) => r.role === roleName);
  if (!rol) return "";
  return new ethers.Wallet(HARDHAT_PRIVATE_KEYS[rol.pkIdx]).address;
}

const ADDR_CONCILIADOR = addrFromRole("conciliador");
const ADDR_TRABAJADOR  = addrFromRole("trabajador");
const ADDR_EMPLEADOR   = addrFromRole("empleador");

export const MOCK_CONCILIADORA = {
  nombre: "Dra. María Fernanda Ospina Vargas",
  cedula: "52.847.631",
  cargo: "Conciliadora Extrajudicial en Derecho Laboral",
  tarjetaProfesional: "TP-124.567",
  email: "mfospina@pgn.gov.co",
  telefono: "+57 (1) 587-8750 ext. 4521",
  entidad: "Procuraduría General de la Nación",
  centro: "Centro de Conciliación Laboral — Regional Bogotá",
  wallet: ADDR_CONCILIADOR,
};

export const MOCK_CONCILIACIONES = [
  {
    id: "PGN-LAB-2024-0142",
    fecha: "15 de enero de 2024",
    hora: "09:30",
    estado: "borrador",
    step: 1,
    bcState: null,
    txHash: "",
    hashActa: "0xabc123",
    montoETH: "0.1",
    actaEstado: null,
    clasificaciones: {},
    conceptosExtra: [],
    montos: {},
    trabajador: {
      nombre: "Carlos Alberto Mejía Ríos",
      cc: "1.073.245.891",
      cargo: "Maestro de Obra",
      fechaIngreso: "2021-01-15",
      fechaRetiro: "2024-01-10",
      salario: 2500000,
      correo: "carlos.mejia@correo.com",
      telefono: "+57 311 456 7890",
      wallet: ADDR_TRABAJADOR,
    },
    empleador: {
      nombre: "Construcciones Andina S.A.S.",
      nit: "900.234.567-8",
      representante: "Santiago Morales Duque",
      cc_representante: "79.456.123",
      cargo_representante: "Gerente General",
      direccion: "Av. El Dorado 85-42, Bogotá",
      correo: "construccionesandina@empresa.com.co",
      telefono: "+57 (1) 423-9000",
      wallet: ADDR_EMPLEADOR,
    },
    hechos: "El señor Carlos Alberto Mejía Ríos laboró para Construcciones Andina S.A.S. desde el 15 de enero de 2021 hasta el 10 de enero de 2024, desempeñando el cargo de Maestro de Obra, con un salario mensual de $2.500.000. La terminación del contrato se realizó de manera unilateral por parte del empleador, sin que mediara justa causa comprobada.",
    condiciones: {
      conciliadorAddress: ADDR_CONCILIADOR,
      conciliadoraNombre: "Dra. María Fernanda Ospina Vargas",
      conciliadoraCargo: "Conciliadora Extrajudicial en Derecho Laboral",
      conciliadoraEntidad: "Procuraduría General de la Nación",
      conciliadoraEmail: "mfospina@pgn.gov.co",
      fechaFirma: "2024-01-15",
      fechaPago: "2024-02-15",
      lugarFirma: "Bogotá, D.C.",
      modalidad: "unico",
      numeroCuotas: "1",
    },
  },
  {
    id: "PGN-LAB-2024-0138",
    fecha: "10 de enero de 2024",
    hora: "14:00",
    estado: "trabajador",
    step: 2,
    bcState: null,
    txHash: "",
    hashActa: "0xdef456",
    montoETH: "0.15",
    actaEstado: "enviada",
    clasificaciones: { 6: "cierto" },
    conceptosExtra: [],
    montos: { 6: "3500000", 7: "480000" },
    trabajador: {
      nombre: "Luz Marina Bernal Correa",
      cc: "52.146.789",
      cargo: "Auxiliar Contable",
      fechaIngreso: "2020-03-01",
      fechaRetiro: "2023-12-15",
      salario: 1800000,
      correo: "lmbernal@correo.com",
      telefono: "+57 315 678 9012",
      wallet: ADDR_TRABAJADOR,
    },
    empleador: {
      nombre: "Distribuidora Mercantil del Norte Ltda.",
      nit: "800.567.234-1",
      representante: "Pedro Enrique Villamizar",
      cc_representante: "13.785.432",
      cargo_representante: "Gerente Comercial",
      direccion: "Calle 72 # 11-45, Bogotá",
      correo: "mercantilnorte@empresa.com.co",
      telefono: "+57 (1) 317-4500",
      wallet: ADDR_EMPLEADOR,
    },
    hechos: "La señora Luz Marina Bernal Correa laboró para Distribuidora Mercantil del Norte Ltda. desde el 1 de marzo de 2020 hasta el 15 de diciembre de 2023, desempeñando el cargo de Auxiliar Contable. La empresa procedió a dar por terminado el contrato de trabajo sin justa causa documentada.",
    condiciones: {
      conciliadorAddress: ADDR_CONCILIADOR,
      conciliadoraNombre: "Dra. María Fernanda Ospina Vargas",
      conciliadoraCargo: "Conciliadora Extrajudicial en Derecho Laboral",
      conciliadoraEntidad: "Procuraduría General de la Nación",
      conciliadoraEmail: "mfospina@pgn.gov.co",
      fechaFirma: "2024-01-10",
      fechaPago: "2024-02-29",
      lugarFirma: "Bogotá, D.C.",
      modalidad: "cuotas",
      numeroCuotas: "3",
    },
  },
];

// Fórmulas de cálculo por derecho (ids 1–8 coinciden con constants/derechos.js)
export const MOCK_DERECHOS_FORMULAS = {
  1: {
    formula: "Salario mensual × meses adeudados",
    variables: "Salario = $2.500.000 | Meses adeudados = 1",
    calculo: "$2.500.000 × 1 = $2.500.000",
    articulo: "Art. 127 CST — Constituyen salario no sólo la remuneración fija u ordinaria, sino todo lo que recibe el trabajador en dinero o en especie como contraprestación directa del servicio.",
  },
  2: {
    formula: "(Salario mensual × días trabajados) ÷ 360",
    variables: "Salario = $2.500.000 | Días laborados 2023 = 360 (año completo)",
    calculo: "($2.500.000 × 360) ÷ 360 = $2.500.000 ÷ 12 meses proporcional ≈ $875.000 (última vigencia parcial)",
    articulo: "Art. 249 CST — Todo empleador obligado a pagar cesantías equivalentes a un mes de salario por cada año de servicios y proporcionalmente por fracciones.",
  },
  3: {
    formula: "Saldo cesantías acumuladas × 12% anual",
    variables: "Cesantías vigencia 2023 = $875.000 | Tasa anual = 12%",
    calculo: "$875.000 × 12% = $105.000",
    articulo: "Ley 52 de 1975 — El empleador pagará al trabajador intereses del 12% anual sobre el saldo de las cesantías acumuladas al 31 de diciembre de cada año.",
  },
  4: {
    formula: "(Salario mensual ÷ 2) por semestre laborado",
    variables: "Salario = $2.500.000 | Semestres completos = 1 + fracción proporcional",
    calculo: "($2.500.000 ÷ 2) × proporcional 180 días = $1.250.000",
    articulo: "Art. 306 CST — El empleador pagará a cada empleado, a título de prima de servicios, un mes de salario por semestre de trabajo o proporcionalmente al tiempo laborado.",
  },
  5: {
    formula: "(Salario mensual ÷ 2) × (días laborados ÷ 360)",
    variables: "Salario = $2.500.000 | Días totales = 1.080 (3 años) | Vacaciones no disfrutadas",
    calculo: "($2.500.000 ÷ 2) × (1.080 ÷ 360) = $1.250.000 × 3 años × proporcional = $625.000",
    articulo: "Art. 186 CST — Los trabajadores que hubieren prestado sus servicios durante un año tienen derecho a quince días hábiles consecutivos de vacaciones remuneradas.",
  },
  6: {
    formula: "30 días (año 1) + 20 días × años adicionales — base salario mensual",
    variables: "Años de servicio = 3 | Salario diario = $2.500.000 ÷ 30 = $83.333 | Sin justa causa comprobada",
    calculo: "(30 + 20 × 2) × $83.333 = 70 días × $83.333 = $5.833.333 · Conciliado en $3.500.000",
    articulo: "Art. 64 CST — En todo contrato de trabajo va envuelta la condición resolutoria por incumplimiento con indemnización de perjuicios a cargo de la parte responsable.",
  },
  7: {
    formula: "Horas extras × valor hora ordinaria × recargo legal",
    variables: "Valor hora = $2.500.000 ÷ 240h = $10.416 | Recargo diurno = 25% | Nocturno = 75%",
    calculo: "Sujeto a verificación del registro de asistencia — estimación según horas reportadas por el trabajador",
    articulo: "Art. 168 CST — El trabajo suplementario o de horas extras es remunerado con el recargo que señale el Gobierno Nacional sobre el valor del trabajo ordinario.",
  },
  8: {
    formula: "Estimación discrecional con acreditación del daño",
    variables: "Requiere soporte probatorio de afectación psicológica, social o económica",
    calculo: "Valor de libre negociación entre las partes — no calculable mecánicamente.",
    articulo: "C.C. Art. 2341 — El que ha cometido un delito o culpa, que ha inferido daño a otro, es obligado a la indemnización, sin perjuicio de la pena principal que la ley imponga.",
  },
};

// Semilla de localStorage para pruebas — llamar desde consola: seedMockData()
export function seedMockData() {
  const KEY = "pgn_conciliaciones_v1";
  localStorage.setItem(KEY, JSON.stringify(MOCK_CONCILIACIONES));
  console.log(
    `%c[Mock] ${MOCK_CONCILIACIONES.length} conciliaciones cargadas. Inicia sesión con:`,
    "color: #16a34a; font-weight: bold",
  );
  console.table([
    { rol: "Conciliadora", wallet: ADDR_CONCILIADOR },
    { rol: "Trabajador",   wallet: ADDR_TRABAJADOR },
    { rol: "Empleador",    wallet: ADDR_EMPLEADOR },
  ]);
}

// Exponer al window para uso desde consola de navegador
if (typeof window !== "undefined") {
  window.seedMockData = seedMockData;
}
