// Exporta todos los datos mock de la aplicación
export * from './conciliaciones';
export * from './admin';
export * from './trabajador';
export * from './empleador';

// Re-exportar constantes centralizadas
import { MOCK_CONCILIACIONES_LIST } from './conciliaciones';
import { MOCK_CONCILIADOR_PROFILE } from './conciliaciones';
import { MOCK_DERECHOS_FORMULAS } from './conciliaciones';
import { MOCK_ADMIN_STATS } from './admin';
import { MOCK_CONCILIADORES_LIST } from './admin';
import { MOCK_CONCILIADORES_STATS } from './admin';
import { MOCK_TRABAJADOR_PROFILE } from './trabajador';
import { MOCK_TRABAJADOR_CONCILIACIONES } from './trabajador';
import { MOCK_TRABAJADOR_STATS } from './trabajador';
import { MOCK_EMPLEADOR_PROFILE } from './empleador';
import { MOCK_EMPLEADOR_CONCILIACIONES } from './empleador';
import { MOCK_EMPLEADOR_STATS } from './empleador';

// Agrupar por página para acceso fácil
export const MOCK_DATA = {
  conciliador: {
    profile: MOCK_CONCILIADOR_PROFILE,
    conciliaciones: MOCK_CONCILIACIONES_LIST,
    formulas: MOCK_DERECHOS_FORMULAS,
  },
  admin: {
    stats: MOCK_ADMIN_STATS,
    conciliadores: MOCK_CONCILIADORES_LIST,
    estadisticas: MOCK_CONCILIADORES_STATS,
  },
  trabajador: {
    profile: MOCK_TRABAJADOR_PROFILE,
    conciliaciones: MOCK_TRABAJADOR_CONCILIACIONES,
    stats: MOCK_TRABAJADOR_STATS,
  },
  empleador: {
    profile: MOCK_EMPLEADOR_PROFILE,
    conciliaciones: MOCK_EMPLEADOR_CONCILIACIONES,
    stats: MOCK_EMPLEADOR_STATS,
  },
};
