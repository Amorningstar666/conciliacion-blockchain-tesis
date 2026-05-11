// ─────────────────────────────────────────────────────────────────────────────
// Data Source Configuration
// Toggle entre datos mock y base de datos real
// Guardado en localStorage como 'app_data_source'
// ─────────────────────────────────────────────────────────────────────────────

export const DATA_SOURCES = {
  MOCK: 'mock',
  REAL: 'real',
};

const STORAGE_KEY = 'app_data_source';

export function getDataSource() {
  if (typeof window === 'undefined') return DATA_SOURCES.MOCK;
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored || DATA_SOURCES.MOCK;
}

export function setDataSource(source) {
  if (typeof window === 'undefined') return;
  if (!Object.values(DATA_SOURCES).includes(source)) {
    console.warn(`[DataSource] Fuente inválida: ${source}. Usando MOCK.`);
    return;
  }
  localStorage.setItem(STORAGE_KEY, source);
  window.dispatchEvent(new CustomEvent('dataSourceChanged', { detail: { source } }));
  console.log(`%c[DataSource] Cambiado a: ${source}`, 'color: #0ea5e9; font-weight: bold;');
}

export function toggleDataSource() {
  const current = getDataSource();
  const next = current === DATA_SOURCES.MOCK ? DATA_SOURCES.REAL : DATA_SOURCES.MOCK;
  setDataSource(next);
  return next;
}

// Exponer globalmente para consola del navegador
if (typeof window !== 'undefined') {
  window.DataSourceConfig = {
    getDataSource,
    setDataSource,
    toggleDataSource,
    DATA_SOURCES,
  };
}
