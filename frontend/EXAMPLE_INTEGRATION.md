# Ejemplo de Integración: Datos Mock ↔ Real

## Caso: ConciliadorDashboard

### Antes (Sin el sistema)
```javascript
// ❌ Hardcodeado o importado sin control
import { MOCK_CONCILIACIONES } from '../mock/mockData';

export default function ConciliadorDashboard() {
  // Siempre usa mock
  const conciliaciones = MOCK_CONCILIACIONES;
  return <div>{/* ... */}</div>;
}
```

### Después (Con el sistema)

#### 1. **Componente simple que acepta props**

```javascript
// src/pages/ConciliadorDashboard/index.jsx
import { useDataSource } from '../../hooks/useDataSource';
import { SidebarConciliaciones } from './components/SidebarConciliaciones';

export default function ConciliadorDashboard({ conciliacionesRealData }) {
  const { isMock, mockData } = useDataSource();
  
  // Datos finales: reales si existen, sino mock
  const conciliaciones = conciliacionesRealData || 
    (isMock ? mockData.conciliador.conciliaciones : []);
  
  return (
    <main>
      <SidebarConciliaciones
        conciliaciones={conciliaciones}
        /* ... otros props ... */
      />
    </main>
  );
}
```

#### 2. **Hook que respeta la fuente**

```javascript
// src/pages/ConciliadorDashboard/hooks/useConciliaciones.js
import { useEffect, useState } from 'react';
import { useDataSource } from '../../../hooks/useDataSource';

export function useConciliaciones() {
  const { isMock, mockData } = useDataSource();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isMock) {
      // Datos mock (instantáneo)
      setData(mockData.conciliador.conciliaciones);
      setLoading(false);
    } else {
      // Datos reales (desde API)
      setLoading(true);
      fetch('/api/conciliaciones')
        .then(r => r.json())
        .then(data => {
          setData(data);
          setError(null);
        })
        .catch(err => {
          setError(err.message);
          console.error('Error cargando conciliaciones:', err);
        })
        .finally(() => setLoading(false));
    }
  }, [isMock]); // Re-ejecutar al cambiar fuente

  return { data, loading, error };
}

// Uso en componente:
// const { data: conciliaciones, loading } = useConciliaciones();
```

#### 3. **Service ágnostico (no cambia)**

```javascript
// src/pages/ConciliadorDashboard/services/conciliacionService.js
// Este archivo NO necesita cambiar entre mock y real
// La lógica está en el hook

export async function crearConciliacion(datos) {
  const response = await fetch('/api/conciliaciones', {
    method: 'POST',
    body: JSON.stringify(datos),
  });
  return response.json();
}

export async function actualizarConciliacion(id, datos) {
  const response = await fetch(`/api/conciliaciones/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(datos),
  });
  return response.json();
}
```

#### 4. **Componente hoja que usa el hook**

```javascript
// src/pages/ConciliadorDashboard/components/SidebarConciliaciones.jsx
import { useDataSource } from '../../../hooks/useDataSource';

export function SidebarConciliaciones({ 
  conciliaciones, 
  activeConciliacionId, 
  onSelect 
}) {
  const { isMock } = useDataSource();

  return (
    <aside className="w-64">
      <div className="mb-4 p-3 bg-blue-50 rounded text-sm">
        Fuente: <strong>{isMock ? '📊 Mock' : '🗄️ Real'}</strong>
      </div>
      
      <div className="space-y-2">
        {conciliaciones?.map(c => (
          <div 
            key={c.id}
            onClick={() => onSelect(c.id)}
            className={`p-3 cursor-pointer rounded ${
              activeConciliacionId === c.id 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <div className="font-semibold text-sm">{c.id}</div>
            <div className="text-xs text-gray-600">
              {c.trabajador.nombre}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
```

## Caso: AdminDashboard

### Implementación

```javascript
// src/pages/AdminDashboard/index.jsx
import { useDataSource } from '../../hooks/useDataSource';
import { useAdminData } from './hooks/useAdminData';
import { StatsAdmin } from './components/StatsAdmin';
import { ListaConciliadores } from './components/ListaConciliadores';

export default function AdminDashboard() {
  const { isMock, mockData } = useDataSource();
  const { stats, conciliadores, loading } = useAdminData();

  // Datos finales
  const statsFinales = stats || 
    (isMock ? mockData.admin.stats : null);
  const conciliadoresFinales = conciliadores || 
    (isMock ? mockData.admin.conciliadores : []);

  return (
    <div>
      <StatsAdmin stats={statsFinales} loading={loading} />
      <ListaConciliadores 
        conciliadores={conciliadoresFinales}
        loading={loading}
      />
    </div>
  );
}
```

```javascript
// src/pages/AdminDashboard/hooks/useAdminData.js
import { useEffect, useState } from 'react';
import { useDataSource } from '../../../hooks/useDataSource';

export function useAdminData() {
  const { isMock, mockData } = useDataSource();
  const [stats, setStats] = useState(null);
  const [conciliadores, setConciliadores] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isMock) {
      setStats(mockData.admin.stats);
      setConciliadores(mockData.admin.conciliadores);
    } else {
      setLoading(true);
      Promise.all([
        fetch('/api/admin/stats').then(r => r.json()),
        fetch('/api/admin/conciliadores').then(r => r.json()),
      ])
        .then(([statsData, conciliadoresData]) => {
          setStats(statsData);
          setConciliadores(conciliadoresData);
        })
        .finally(() => setLoading(false));
    }
  }, [isMock]);

  return { stats, conciliadores, loading };
}
```

## Caso: TrabajadorDashboard

```javascript
// src/pages/TrabajadorDashboard/index.jsx
import { useDataSource } from '../../hooks/useDataSource';
import { useTrabajadorData } from './hooks/useTrabajadorData';

export default function TrabajadorDashboard({ userAddress }) {
  const { isMock, mockData } = useDataSource();
  const { profile, conciliaciones, stats, loading } = useTrabajadorData(userAddress);

  const profileFinal = profile || 
    (isMock ? mockData.trabajador.profile : null);
  const conciliacionesFinal = conciliaciones || 
    (isMock ? mockData.trabajador.conciliaciones : []);

  return (
    <div className="space-y-6">
      <div className="text-sm font-semibold">
        Modo: {isMock ? '📊 Mock' : '🗄️ Real'}
      </div>
      
      {profileFinal && (
        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-lg font-bold">{profileFinal.nombre}</h2>
          <p className="text-gray-600">{profileFinal.cargo}</p>
        </div>
      )}
      
      <div className="space-y-4">
        {conciliacionesFinal?.map(c => (
          <div key={c.id} className="bg-gray-50 p-4 rounded">
            <div className="font-semibold">{c.id}</div>
            <div className="text-sm text-gray-600">{c.empleador}</div>
            <div className="mt-2 text-sm">
              <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded">
                {c.estado}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Transición a Datos Reales

### Paso 1: Crear API endpoints
```javascript
// backend/routes/api.js
app.get('/api/conciliaciones', async (req, res) => {
  const data = await db.query('SELECT * FROM conciliaciones');
  res.json(data);
});

app.get('/api/admin/stats', async (req, res) => {
  const data = await db.query('SELECT COUNT(*), SUM(monto) FROM actas');
  res.json(data);
});
```

### Paso 2: Cambiar fuente en UI (sin tocar código)
```
BlockchainBar → Click DataSourceToggle → localStorage actualizado
  ↓
Todos los componentes que usan useDataSource() se re-renderean automáticamente
  ↓
Datos reales cargados desde API
```

### Paso 3: Verificar en consola
```javascript
DataSourceConfig.getDataSource() // "real"
// Revisar Network tab en DevTools → ver /api/... requests
```

## Checklist: Implementación en una página

- [ ] Crear hook `use[NombrePagina]Data()` que respeta `isMock`
- [ ] Componentes aceptan `data` como prop o usan el hook
- [ ] `useDataSource()` usado para acceder a `mockData.section`
- [ ] Toggle funciona: cambiar mock/real re-renderea
- [ ] API endpoints creados (para "real")
- [ ] Tests pasen con mock y con datos reales
- [ ] localStorage limpio en staging/prod

## Ventajas

✅ **Sin cambios de código**: Same componentes funcionan con mock y real  
✅ **Testing fácil**: Cambiar fuente con un click  
✅ **Gradual**: Implementar real endpoint por endpoint  
✅ **Fallback**: Si API cae, switch a mock automáticamente  
✅ **Debugging**: Inspeccionar datos mock desde consola  

¡Listo para pasar a datos reales! 🚀
