# Mock Data System

Sistema centralizado de datos mock para toda la aplicación. Permite cambiar entre datos mock y base de datos real mediante un toggle.

## Estructura

```
mockData/
├── index.js              # Exporta todo centralizado
├── conciliaciones.js     # Datos para ConciliadorDashboard
├── admin.js              # Datos para AdminDashboard
├── trabajador.js         # Datos para TrabajadorDashboard
├── empleador.js          # Datos para EmpleadorDashboard
└── README.md            # Este archivo
```

## Uso

### 1. Acceder a los datos en componentes

```javascript
import { useDataSource } from '../../hooks/useDataSource';

function MiComponente() {
  const { isMock, isReal, mockData } = useDataSource();

  if (isMock) {
    // Usar datos mock
    const conciliaciones = mockData.conciliador.conciliaciones;
  } else {
    // Usar datos reales (desde API/blockchain)
  }

  return <div>...</div>;
}
```

#### Desde la consola del navegador
```javascript
// Ver fuente actual
DataSourceConfig.getDataSource()

// Cambiar a mock
DataSourceConfig.setDataSource('mock')

// Cambiar a real
DataSourceConfig.setDataSource('real')

// Toggle
DataSourceConfig.toggleDataSource()
```

## Estructura de Datos por Página

### ConciliadorDashboard (`mockData.conciliador`)
- `profile`: Información del conciliador
- `conciliaciones`: Lista de conciliaciones
- `formulas`: Fórmulas de cálculo de derechos

### AdminDashboard (`mockData.admin`)
- `stats`: Estadísticas generales
- `conciliadores`: Lista de conciliadores
- `estadisticas`: Estadísticas por conciliador

### TrabajadorDashboard (`mockData.trabajador`)
- `profile`: Información del trabajador
- `conciliaciones`: Conciliaciones del trabajador
- `stats`: Estadísticas personales

### EmpleadorDashboard (`mockData.empleador`)
- `profile`: Información del empleador
- `conciliaciones`: Conciliaciones del empleador
- `stats`: Estadísticas personales

## Patrón Recomendado

```javascript
import { useDataSource } from '../../hooks/useDataSource';

function MiComponente({ data }) {
  const { isMock, mockData } = useDataSource();
  
  // Si no hay datos, usar mock
  const dataAMostrar = data || (isMock ? mockData.section.data : null);
  
  if (!dataAMostrar) return <div>Sin datos</div>;
  
  return <div>{/* renderizar dataAMostrar */}</div>;
}
```

## Cómo Agregar Nuevos Datos Mock

1. **Crear el archivo** en `mockData/nuevaPagina.js`
2. **Exportar los datos**:
   ```javascript
   export const MOCK_NUEVA_PAGINA = { ... };
   ```
3. **Actualizar `mockData/index.js`**:
   ```javascript
   export * from './nuevaPagina';
   
   // En MOCK_DATA:
   nueva_pagina: {
     // tus datos
   },
   ```
4. **Acceder** en componentes vía `mockData.nueva_pagina`

## Almacenamiento

- La fuente actual se guarda en `localStorage` como `app_data_source`
- Persiste entre recargas
- Event: `dataSourceChanged` se dispara cuando cambia la fuente

## Notas

- Los datos mock incluyen información realista para testing
- Todos los wallets corresponden a cuentas Hardhat predeterminadas
- Al implementar la BD real, solo necesitas cambiar la lógica de obtención de datos
- El sistema es agnóstico a la fuente real (API REST, blockchain, GraphQL, etc.)
