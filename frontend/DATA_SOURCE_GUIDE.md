# Guía: Sistema de Datos Mock ↔ Real

## Descripción General

El sistema permite cambiar entre **datos mock** (para testing/desarrollo) y **datos reales** (base de datos) sin cambiar código.

```
┌─────────────────────────────────────────────┐
│          Componente / Hook                   │
└──────────────────┬──────────────────────────┘
                   │
                   ↓
        ┌─────────────────────┐
        │  useDataSource()     │
        │  (Lee fuente actual) │
        └──────────┬───────────┘
                   │
        ┌──────────┴──────────┐
        ↓                     ↓
    ┌─────────┐         ┌────────┐
    │   MOCK  │         │  REAL  │
    │ (local) │         │ (API)  │
    └─────────┘         └────────┘
```

## Carpetas

### 1. **src/config/**
```
dataSourceConfig.js
  ├─ getDataSource()      → Lee localStorage
  ├─ setDataSource()      → Guarda en localStorage + event
  ├─ toggleDataSource()   → Cambia mock ↔ real
  └─ DATA_SOURCES         → Constantes {MOCK, REAL}
```

### 2. **src/constants/mockData/**
```
├─ index.js              → Exporta todo + MOCK_DATA object
├─ conciliaciones.js     → MOCK_CONCILIADOR_PROFILE, MOCK_CONCILIACIONES_LIST, MOCK_DERECHOS_FORMULAS
├─ admin.js              → MOCK_CONCILIADORES_LIST, MOCK_ADMIN_STATS, MOCK_CONCILIADORES_STATS
├─ trabajador.js         → MOCK_TRABAJADOR_PROFILE, MOCK_TRABAJADOR_CONCILIACIONES, MOCK_TRABAJADOR_STATS
├─ empleador.js          → MOCK_EMPLEADOR_PROFILE, MOCK_EMPLEADOR_CONCILIACIONES, MOCK_EMPLEADOR_STATS
└─ README.md             → Documentación
```

### 3. **src/hooks/**
```
useDataSource.js
  ├─ Mantiene estado de la fuente actual
  ├─ Escucha cambios en localStorage
  └─ Expone: { source, isMock, isReal, mockData }
```

### 4. **src/components/ui/**
```
DataSourceToggle.jsx
  ├─ UI Toggle (📊 Mock / 🗄️ Real)
  ├─ Visualiza fuente actual
  ├─ Botón para cambiar
  └─ Integrado en BlockchainBar
```

## Patrones de Uso

### Patrón 1: Componente que acepta props
```javascript
function MiCard({ data }) {
  const { mockData, isMock } = useDataSource();
  
  const dataFinal = data || (isMock ? mockData.conciliador.conciliaciones : []);
  
  return <div>{dataFinal.map(...)}</div>;
}

// Uso:
// ✅ Con datos reales (BD):
<MiCard data={datosDeBD} />

// ✅ Con datos mock automáticos:
<MiCard />
```

### Patrón 2: Hook personalizado que respeta fuente
```javascript
function useConciliaciones() {
  const { isMock, mockData } = useDataSource();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isMock) {
      // Datos mock (instantáneo)
      setData(mockData.conciliador.conciliaciones);
    } else {
      // Datos reales (async)
      setLoading(true);
      fetch('/api/conciliaciones')
        .then(r => r.json())
        .then(setData)
        .finally(() => setLoading(false));
    }
  }, [isMock]);

  return { data, loading };
}
```

### Patrón 3: Service que delega al hook
```javascript
// services/conciliacionService.js
export async function obtenerConciliaciones() {
  // El hook maneja la lógica mock/real
  // El service es agnóstico
  return fetch('/api/conciliaciones').then(r => r.json());
}

// En componente:
const { isMock, mockData } = useDataSource();
const datos = isMock 
  ? mockData.conciliador.conciliaciones 
  : await obtenerConciliaciones();
```

## Cambio de Fuente

### Opción 1: UI (Click)
1. Localiza el toggle en `BlockchainBar`
2. Haz click: **📊 Mock** ↔ **🗄️ Real**
3. Automático: localStorage actualizado + componentes re-renderean

### Opción 2: Consola
```javascript
// Terminal → F12 → Console
DataSourceConfig.setDataSource('real')
DataSourceConfig.setDataSource('mock')
DataSourceConfig.toggleDataSource()

// Verificar actual
DataSourceConfig.getDataSource() // "mock" o "real"
```

### Opción 3: Programático
```javascript
import { setDataSource, DATA_SOURCES } from '../config/dataSourceConfig';

// Cambiar a real
setDataSource(DATA_SOURCES.REAL);

// Cambiar a mock
setDataSource(DATA_SOURCES.MOCK);
```

## Flujo de Datos

### Con datos mock
```
Usuario          Componente          useDataSource          localStorage
  │                  │                    │                      │
  ├─────────────────→│ render             │                      │
  │                  ├────────────────────→ isMock=true          │
  │                  │                    │← mockData             │
  │                  │← render con mock    │                      │
  └─────────────────←│                    │                      │
```

### Con datos reales
```
Usuario          Componente          useDataSource          API
  │                  │                    │                  │
  ├─────────────────→│ render             │                  │
  │                  ├────────────────────→ isMock=false     │
  │                  │                    ├──────────────────→ fetch
  │                  │                    │← data             │
  │                  │← render con datos   │                  │
  └─────────────────←│                    │                  │
```

## Integración con BD Real

Cuando implementes la BD real:

1. **No toques** `src/config/` ni `src/constants/mockData/`
2. **Crea** `src/services/dataService.js` para APIs reales
3. **Modifica** los hooks para elegir entre mock y service:
   ```javascript
   const { isMock, mockData } = useDataSource();
   const data = isMock 
     ? mockData.section.data 
     : await dataService.fetch();
   ```
4. **Listo**: El toggle seguirá funcionando

## Testing

```javascript
// __tests__/useConciliaciones.test.js
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MiComponente from '../MiComponente';
import { setDataSource, DATA_SOURCES } from '../config/dataSourceConfig';

test('muestra datos mock por defecto', () => {
  setDataSource(DATA_SOURCES.MOCK);
  render(<MiComponente />);
  expect(screen.getByText(/Carlos Alberto Mejía/)).toBeInTheDocument();
});

test('muestra datos reales al cambiar', async () => {
  setDataSource(DATA_SOURCES.REAL);
  render(<MiComponente />);
  // Esperar fetch...
  expect(await screen.findByText(/datos reales/)).toBeInTheDocument();
});
```

## Checklist: Antes de usar datos reales

- [ ] BD implementada y disponible
- [ ] API endpoints creados (`/api/conciliaciones`, etc.)
- [ ] Autenticación funciona
- [ ] Tests pasan con datos reales
- [ ] Toggle muestra status correcto
- [ ] Cambiar entre mock/real no rompe la app
- [ ] localStorage se limpia si es necesario

## Estructura Completa

```
frontend/
├── src/
│   ├── config/
│   │   └── dataSourceConfig.js              ← Central: get/set/toggle
│   ├── constants/
│   │   └── mockData/
│   │       ├── index.js                     ← Exports todo
│   │       ├── conciliaciones.js            ← Datos ConciliadorDashboard
│   │       ├── admin.js                     ← Datos AdminDashboard
│   │       ├── trabajador.js                ← Datos TrabajadorDashboard
│   │       ├── empleador.js                 ← Datos EmpleadorDashboard
│   │       └── README.md
│   ├── hooks/
│   │   └── useDataSource.js                 ← Hook principal
│   └── components/
│       └── ui/
│           └── DataSourceToggle.jsx         ← UI Toggle
├── DATA_SOURCE_GUIDE.md                      ← Este archivo
└── ...
```

## Resumen

| Acción | Dónde | Cómo |
|--------|-------|------|
| **Ver fuente actual** | Consola | `DataSourceConfig.getDataSource()` |
| **Cambiar fuente** | UI | Click en toggle `BlockchainBar` |
| **Cambiar fuente** | Código | `setDataSource(DATA_SOURCES.REAL)` |
| **Usar datos** | Componente | `const { isMock, mockData } = useDataSource()` |
| **Agregar datos** | `mockData/*.js` | Crear export + actualizar `index.js` |

¡Sistema listo para testing con mock y para pasar a datos reales sin cambiar código! 🚀
