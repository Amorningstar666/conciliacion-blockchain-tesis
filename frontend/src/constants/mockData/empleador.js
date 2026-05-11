// Mock data para EmpleadorDashboard
export const MOCK_EMPLEADOR_PROFILE = {
  nombre: "Construcciones Andina S.A.S.",
  nit: "900.234.567-8",
  representante: "Santiago Morales Duque",
  cc_representante: "79.456.123",
  cargo_representante: "Gerente General",
  direccion: "Av. El Dorado 85-42, Bogotá",
  email: "construccionesandina@empresa.com.co",
  telefono: "+57 (1) 423-9000",
  wallet: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
};

export const MOCK_EMPLEADOR_CONCILIACIONES = [
  {
    id: "PGN-LAB-2024-0142",
    trabajador: "Carlos Alberto Mejía Ríos",
    cargo_trabajador: "Maestro de Obra",
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
    id: "PGN-LAB-2024-0155",
    trabajador: "Luz Marina Bernal Correa",
    cargo_trabajador: "Auxiliar Contable",
    estado: "en_proceso",
    step: 2,
    fechaCreacion: "2024-01-18",
    montoOferecido: 0,
    montoSolicitado: 3200000,
    documento: null,
  },
  {
    id: "PGN-LAB-2024-0138",
    trabajador: "Juan Pablo García López",
    cargo_trabajador: "Técnico Sistemas",
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
];

export const MOCK_EMPLEADOR_STATS = {
  totalDenuncias: 3,
  conciliacionesExitosas: 1,
  enProceso: 2,
  montoTotalDenunciado: 13200000,
  montoTotalConciliado: 3980000,
  tasaExito: 33.3,
};
