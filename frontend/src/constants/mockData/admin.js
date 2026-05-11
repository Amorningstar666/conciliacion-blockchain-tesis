// Mock data para AdminDashboard
export const MOCK_CONCILIADORES_LIST = [
  {
    nombre: "Dra. María Fernanda Ospina Vargas",
    cedula: "52.847.631",
    wallet: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    tarjetaProfesional: "TP-124.567",
    email: "mfospina@pgn.gov.co",
    estado: "activo",
    fechaRegistro: "2024-01-10",
    totalActas: 142,
  },
  {
    nombre: "Dr. Carlos Enrique Ramírez Soto",
    cedula: "13.456.789",
    wallet: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    tarjetaProfesional: "TP-234.890",
    email: "cramírez@pgn.gov.co",
    estado: "activo",
    fechaRegistro: "2024-01-15",
    totalActas: 98,
  },
  {
    nombre: "Dra. Patricia González Moreno",
    cedula: "42.123.456",
    wallet: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
    tarjetaProfesional: "TP-345.012",
    email: "pgonzalez@pgn.gov.co",
    estado: "activo",
    fechaRegistro: "2024-02-01",
    totalActas: 67,
  },
  {
    nombre: "Dr. Francisco Javier López Díaz",
    cedula: "18.234.567",
    wallet: "0x1CBd3B2770909D4e10f157aAFF97245EC7735967",
    tarjetaProfesional: "TP-456.123",
    email: "flopez@pgn.gov.co",
    estado: "inactivo",
    fechaRegistro: "2023-12-20",
    totalActas: 34,
  },
];

export const MOCK_ADMIN_STATS = {
  totalConciliadores: 4,
  conciliadoresActivos: 3,
  totalActas: 341,
  actasEnBorrador: 12,
  actasEnProceso: 28,
  actasFinalizadas: 301,
  montoTotalDenunciado: 850000000,
  montoTotalConciliado: 750000000,
  tasaExito: 88.2,
};

export const MOCK_CONCILIADORES_STATS = [
  {
    nombre: "Dra. María Fernanda Ospina Vargas",
    acuerdos: 142,
    enProceso: 5,
    efectividad: 94.5,
    montoPromedio: 2500000,
  },
  {
    nombre: "Dr. Carlos Enrique Ramírez Soto",
    acuerdos: 98,
    enProceso: 3,
    efectividad: 89.2,
    montoPromedio: 1800000,
  },
  {
    nombre: "Dra. Patricia González Moreno",
    acuerdos: 67,
    enProceso: 8,
    efectividad: 82.1,
    montoPromedio: 1500000,
  },
  {
    nombre: "Dr. Francisco Javier López Díaz",
    acuerdos: 34,
    enProceso: 0,
    efectividad: 100,
    montoPromedio: 2000000,
  },
];
