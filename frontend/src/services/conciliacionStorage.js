const STORAGE_KEY = "pgn_conciliaciones_v1";

export function getAllConciliaciones() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveConciliacion(conciliacion) {
  const all = getAllConciliaciones();
  const idx = all.findIndex((c) => c.id === conciliacion.id);
  if (idx >= 0) all[idx] = { ...all[idx], ...conciliacion };
  else all.push(conciliacion);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function updateConciliacionStorage(id, updates) {
  const all = getAllConciliaciones();
  const updated = all.map((c) => (c.id === id ? { ...c, ...updates } : c));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function getConciliacionesByWallet(address) {
  if (!address) return [];
  const all = getAllConciliaciones();
  const addr = address.toLowerCase();
  return all.filter(
    (c) =>
      (c.empleador?.wallet || "").toLowerCase() === addr ||
      (c.trabajador?.wallet || "").toLowerCase() === addr ||
      (c.condiciones?.conciliadorAddress || "").toLowerCase() === addr
  );
}

export function getConciliacionByHashActa(hashActa) {
  const all = getAllConciliaciones();
  return all.find((c) => c.hashActa === hashActa) || null;
}
