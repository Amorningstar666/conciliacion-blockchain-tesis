import { deployment } from "../../../constants/contract";

const STORAGE_KEY = "pgn_conciliadores_v1";

function leerDelStorage() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function guardarEnStorage(lista) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
}

function inicializarDesdeSetup() {
  const actual = leerDelStorage();
  const conciliadoresSetup = (deployment.roles?.conciliadores || []).map((c) => ({
    address: c.address,
    autorizado: true,
    nombre: c.nombre,
  }));
  // Agrega los del setup que no estén ya en localStorage
  const nuevos = conciliadoresSetup.filter(
    (s) => !actual.find((a) => a.address.toLowerCase() === s.address.toLowerCase())
  );
  if (nuevos.length > 0) guardarEnStorage([...actual, ...nuevos]);
}

export async function cargarConciliadores(_contract) {
  inicializarDesdeSetup();
  return leerDelStorage();
}

export async function registrarConciliador(contract, address, nombre = "", cargo = "") {
  // 1. Guarda en localStorage inmediatamente (persiste aunque falle blockchain)
  const actual = leerDelStorage();
  const yaExiste = actual.find((c) => c.address.toLowerCase() === address.toLowerCase());
  if (!yaExiste) {
    guardarEnStorage([...actual, { address, autorizado: true, nombre, cargo }]);
  }
  // 2. Envía tx blockchain (si falla, el dato ya quedó en localStorage)
  const tx = await contract.registrarConciliador(address);
  await tx.wait();
}

export async function revocarConciliador(contract, address) {
  // 1. Elimina del localStorage inmediatamente
  const actual = leerDelStorage();
  guardarEnStorage(actual.filter((c) => c.address.toLowerCase() !== address.toLowerCase()));
  // 2. Envía tx blockchain
  const tx = await contract.revocarConciliador(address);
  await tx.wait();
}

export function getConciliadorByAddress(address) {
  if (!address) return null;
  const lista = leerDelStorage();
  return lista.find((c) => c.address.toLowerCase() === address.toLowerCase()) || null;
}

export async function cargarTotalAcuerdos(contract) {
  const eventos = await contract.queryFilter(contract.filters.AcuerdoCreado());
  return eventos.length;
}
