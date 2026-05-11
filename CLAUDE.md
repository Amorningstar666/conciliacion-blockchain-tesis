# CLAUDE.md - Guía de Desarrollo

**Especificación técnica completa:** Ver [AGENTS.md](./AGENTS.md)

Esta guía cubre **estructura de código y convenciones de desarrollo**.

---

## Estructura de Carpetas: Obligatoria

Cada **página o funcionalidad major** es una **carpeta con esta estructura exacta:**

```
src/pages/NombrePagina/
├── components/              # Componentes de presentación pura
│   ├── ComponenteA.jsx      # Max 300 líneas
│   └── ComponenteB.jsx
├── hooks/                   # Lógica de negocio y estado
│   ├── useCustomLogic.js    # Max 300 líneas
│   └── useFetch.js
├── services/                # Integraciones blockchain/storage
│   └── pageService.js       # Max 300 líneas
├── utils/                   # Helpers y funciones puras
│   └── validators.js        # Max 300 líneas
├── constants/               # Valores fijos
│   └── constants.js         # Max 100 líneas
└── index.jsx                # Punto de entrada (50-100 líneas)
```

**Ejemplo Real:**
```
src/pages/ConciliadorDashboard/
├── components/
│   ├── PanelCrearActa.jsx
│   ├── PanelValidarPendientes.jsx
│   └── ActaCard.jsx
├── hooks/
│   ├── useConciliaciones.js
│   └── useValidarActa.js
├── services/
│   └── conciliadorService.js
├── utils/
│   ├── actaValidators.js
│   └── formatters.js
├── constants/
│   └── dashboardConstants.js
└── index.jsx
```

---

## Capas de Responsabilidad

| Capa | Qué Va | Dónde | Máximo |
|------|--------|-------|--------|
| **Presentación** | JSX, eventos UI, estilos | `components/*.jsx` | 300 L |
| **Lógica** | Estado React, efectos, validaciones | `hooks/*.js` | 300 L |
| **Integración** | blockchain.js, storage, Web3 | `services/*.js` | 300 L |
| **Utilidad** | Funciones puras, helpers | `utils/*.js` | 300 L |
| **Configuración** | Constantes hardcodeadas | `constants/*.js` | 100 L |

---

## Patrones por Capa

### 1. Componentes (components/*.jsx)
- ✅ Reciben datos por props
- ✅ Emiten eventos por callbacks
- ✅ Usan hooks para estado
- ✅ Styling local (Tailwind, CSS modules)
- ❌ NO importan blockchain.js directo
- ❌ NO tienen lógica de negocio

```javascript
// ✅ CORRECTO
export default function ActaCard({ acta, onValidar, isLoading }) {
  return (
    <div className="border p-4">
      <h3>{acta.empleador}</h3>
      <button onClick={onValidar} disabled={isLoading}>
        {isLoading ? 'Validando...' : 'Validar'}
      </button>
    </div>
  );
}
```

### 2. Hooks (hooks/*.js)
- ✅ Manejan estado (useState)
- ✅ Llaman a services
- ✅ Exportan funciones y estado
- ✅ Usan useEffect para sincronización
- ❌ NO devuelven JSX
- ❌ NO importan blockchain.js directo

```javascript
// ✅ CORRECTO
export function useValidarActa() {
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState(null);

  const validar = async (hashActa) => {
    setValidating(true);
    try {
      await validarActaEnBlockchain(hashActa); // service
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setValidating(false);
    }
  };

  return { validar, validating, error };
}
```

### 3. Services (services/*.js)
- ✅ Importan blockchain.js
- ✅ Exponen funciones async simples
- ✅ Manejan errores de Web3
- ✅ Interactúan con contrato y storage
- ❌ NO manejan estado React
- ❌ NO importan hooks

```javascript
// ✅ CORRECTO
import { blockchain } from '../../../services/blockchain';

export async function validarActaEnBlockchain(hashActa) {
  const { signer, contract } = blockchain;
  if (!signer) throw new Error('No conectado');
  
  const tx = await contract.connect(signer).validarActa(hashActa);
  return tx.wait();
}
```

### 4. Utilidades (utils/*.js)
- ✅ Funciones puras (input → output)
- ✅ Sin estado
- ✅ Sin side effects
- ✅ Fácil de testear
- ❌ NO importan React
- ❌ NO importan blockchain.js

```javascript
// ✅ CORRECTO
export function validarMonto(monto) {
  if (!monto || typeof monto !== 'number') return false;
  return monto > 0 && monto < 1000000;
}

export function formatearActa(acta) {
  return {
    id: acta.hashActa.slice(0, 8),
    monto: `${acta.monto} ETH`,
  };
}
```

### 5. Constantes (constants/*.js)
- ✅ Valores fijos e inmutables
- ✅ Enumeraciones
- ✅ Mensajes de UI
- ✅ Configuración NO sensible
- ❌ NO valores derivados de blockchain
- ❌ NO imports complejos

```javascript
// ✅ CORRECTO
export const ESTADOS = {
  PENDIENTE: null,
  DEPOSITADO: 'depositado',
  VALIDADO: 'validado',
};

export const MENSAJES = {
  ERROR: 'Error al procesar. Intenta de nuevo.',
  EXITO: 'Operación completada.',
};
```

---

## Regla de Oro: 300 Líneas Máximo

**Un archivo se acerca a 300 líneas → Refactoriza inmediatamente.**

Estrategia:
- Componente grande → Extrae sub-componentes
- Hook complejo → Extrae integraciones a services
- Service largo → Extrae helpers a utils
- Utils grueso → Divide por dominio

```bash
# Ver todos los archivos y sus líneas
find src -name '*.jsx' -o -name '*.js' | xargs wc -l | sort -n

# Identificar qué refactorizar (> 300)
find src -name '*.jsx' -o -name '*.js' | xargs wc -l | awk '$1 > 300'
```

---

## Imports Centralizados (Evita Repetición)

### Blockchain (Una sola entrada: services/blockchain.js)
```javascript
// ✅ En services/ solamente
import { blockchain } from '../../../services/blockchain';
const { contract, signer, provider } = blockchain;

// ❌ NO en componentes o hooks
import blockchain from '...'; // ❌ PROHIBIDO
```

### Contexto (Solo cuando sea necesario: auth, wallet)
```javascript
// ✅ En componentes si necesitas userRole/userAddress
import { useContext } from 'react';
import { BlockchainContext } from '../../../context/BlockchainContext';

const { userRole, userAddress } = useContext(BlockchainContext);

// ❌ NO para lógica de negocio
// Usa hooks + services en su lugar
```

### Storage (Centralizado en services)
```javascript
// ✅ En services/
import { getConciliaciones } from '../../../services/conciliacionStorage';

// ❌ NO en componentes
// Usa hooks que usan services
```

---

## Flujo de Datos (Arquitectura)

```
Usuario interactúa con Componente
           ↓
       usa Hook
           ↓
     Hook llama Service
           ↓
   Service usa blockchain.js
           ↓
  blockchain.js → contrato/storage
           ↓
       respuesta
```

**Nunca saltarse capas.**

---

## Checklist: Antes de Commit

- [ ] Cada archivo ≤ 300 líneas
- [ ] Cada página/feature es una carpeta completa
- [ ] `components/` = presentación pura
- [ ] `hooks/` = lógica con React state
- [ ] `services/` = integraciones externas
- [ ] `utils/` = funciones puras
- [ ] `constants/` = valores fijos
- [ ] Sin `blockchain.js` en componentes
- [ ] Sin JSX en hooks
- [ ] Sin state en utils
- [ ] Imports organizados (React, local)
- [ ] Nombres descriptivos (useValidar, validarActa, etc.)

---

## Comandos Rápidos

```bash
npm run dev             # Inicia Vite
npx hardhat test        # Tests contrato
npm run setup           # Redeploy + init

# Diagnosticar tamaño de archivos
wc -l src/**/*.{jsx,js} | sort -n
```

---

## Referencias

- **Especificación técnica completa:** [AGENTS.md](./AGENTS.md) ← Leer primero
- **Smart contract:** [contracts/ConciliacionLaboral.sol](./contracts/ConciliacionLaboral.sol)
- **Blockchain centralizado:** [src/services/blockchain.js](./src/services/blockchain.js)
- **Contexto global:** [src/context/BlockchainContext.jsx](./src/context/BlockchainContext.jsx)

---

**Versión:** 1.0  
**Última actualización:** 2026-04-19
