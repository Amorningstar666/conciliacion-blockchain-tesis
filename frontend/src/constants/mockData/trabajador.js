// Mock data para TrabajadorDashboard
export const MOCK_TRABAJADOR_PROFILE = {
  nombre: "Carlos Alberto Mejía Ríos",
  cc: "1.073.245.891",
  cargo: "Maestro de Obra",
  salario: 2500000,
  email: "carlos.mejia@correo.com",
  telefono: "+57 311 456 7890",
  wallet: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
};

export const MOCK_TRABAJADOR_CONCILIACIONES = [
  {
    id: "PGN-LAB-2024-0142",
    empleador: "Construcciones Andina S.A.S.",
    estado: "en_firma",
    step: 3,
    fechaCreacion: "2024-01-15",
    montoOferecido: 4680000,
    montoSolicitado: 5800000,
    documento: {
      url: "/docs/acta-PGN-LAB-2024-0142.pdf",
      fechaGeneracion: "2024-01-15",
    },
  },
  {
    id: "PGN-LAB-2024-0138",
    empleador: "Distribuidora Mercantil del Norte Ltda.",
    estado: "completada",
    step: 4,
    fechaCreacion: "2024-01-10",
    montoOferecido: 3980000,
    montoSolicitado: 4200000,
    documento: {
      url: "/docs/acta-PGN-LAB-2024-0138.pdf",
      fechaGeneracion: "2024-01-10",
      fechaFirma: "2024-01-12",
    },
  },
  {
    id: "PGN-LAB-2024-0130",
    empleador: "Servicios Integrales S.A.",
    estado: "completada",
    step: 4,
    fechaCreacion: "2023-12-28",
    montoOferecido: 2500000,
    montoSolicitado: 3100000,
    documento: {
      url: "/docs/acta-PGN-LAB-2024-0130.pdf",
      fechaGeneracion: "2023-12-28",
      fechaFirma: "2023-12-31",
    },
  },
];

export const MOCK_TRABAJADOR_STATS = {
  totalDenuncias: 3,
  conciliacionesExitosas: 2,
  enProceso: 1,
  montoTotalDenunciado: 13100000,
  montoTotalConciliado: 11160000,
  tasaExito: 66.7,
};
