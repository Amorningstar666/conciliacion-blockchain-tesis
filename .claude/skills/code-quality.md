# Code Quality Skill

**Propósito:** Validar y mantener la calidad del código ANTES de cualquier desarrollo. Se ejecuta como pre-check para asegurar que todo nuevo código cumple con los estándares del proyecto.

**Ejecución:** Manual con `/code-quality` o automáticamente antes de escribir código.

---

## Lo que valida

### 1. Límite de 300 líneas por archivo
- **Qué:** Ningún archivo debe superar 300 líneas
- **Cómo arreglo:** 
  - Si un componente es muy grande → extrae sub-componentes
  - Si un hook es complejo → mueve integraciones a services
  - Si un service es largo → extrae helpers a utils
- **Acción:** Refactorizo automáticamente dividiendo en archivos menores

### 2. Arquitectura correcta (estructura OBLIGATORIA)
Cada página/funcionalidad debe tener esta carpeta:
```
src/pages/NombrePagina/
├── components/      (solo presentación, max 300L)
├── hooks/          (lógica React + estado, max 300L)
├── services/       (integraciones blockchain/storage, max 300L)
├── utils/          (funciones puras, max 300L)
├── constants/      (valores fijos, max 100L)
└── index.jsx       (entrada, 50-100L)
```

- **Qué:** Cada archivo está en la carpeta correcta
- **Acción:** Si encuentro archivos fuera de estructura, los muevo

### 3. Imports centralizados y correctos
- ✅ `blockchain.js` SOLO en services/ (NUNCA en componentes)
- ✅ `storage` functions SOLO en services/
- ✅ Context (BlockchainContext) SOLO cuando es auth/wallet
- ✅ Sin imports repetidos entre archivos

- **Acción:** Corrijo imports, agrupo en services si falta

### 4. Responsabilidades claras (sin mezclar capas)
| Capa | ✅ SÍ | ❌ NO |
|------|-------|-------|
| **components/** | JSX, props, callbacks, estilos | blockchain, estado React, lógica |
| **hooks/** | useState, useEffect, llamar services | JSX, blockchain directo |
| **services/** | blockchain.js, Web3, storage | estado React, manejo de errores UI |
| **utils/** | funciones puras (input→output) | React, blockchain, side effects |
| **constants/** | valores fijos, enumeraciones | derivados de blockchain, imports complejos |

- **Acción:** Refactorizo para mover código a su capa correcta

---

## Mi workflow

1. **ANTES de cualquier desarrollo:**
   ```
   Tú: "Crea el componente ActaCard"
   Yo: /code-quality → valido que el path existe, carpetas OK, imports centralizados
        → Luego creo el componente
   ```

2. **Si encuentro problemas:**
   - Problemas auto-fixables (imports, estructura) → Los corrijo inmediatamente
   - Refactorización necesaria → Propongo solución + ejecuto
   - Decisiones arquitectónicas → Pregunto antes de cambiar

3. **Output:**
   - Si todo OK: "✅ Estructura validada, listo para desarrollar"
   - Si hay cambios: "🔧 Arreglé X cosas: [lista]"
   - Si hay bloqueadores: "⚠️ Necesito tu OK para: [cambio importante]"

---

## Checklist: Lo que siempre verifico

- [ ] Archivo ≤ 300 líneas
- [ ] Estructura de carpetas correcta
- [ ] `components/` = presentación pura (sin lógica)
- [ ] `hooks/` = state + lógica (sin JSX)
- [ ] `services/` = blockchain/storage (sin React)
- [ ] `utils/` = funciones puras (sin side effects)
- [ ] `constants/` = valores fijos (sin imports complejos)
- [ ] blockchain.js SOLO en services/
- [ ] Storage SOLO en services/
- [ ] Nombres descriptivos (useValidar, validarActa, etc)
- [ ] Sin imports repetidos
- [ ] Imports organizados (React, luego local)

---

## Referencias

- [CLAUDE.md](../../../CLAUDE.md) — Guía de desarrollo completa
- [AGENTS.md](../../../AGENTS.md) — Especificación técnica
- [src/services/blockchain.js](../../../src/services/blockchain.js) — Centralizado
- [src/context/BlockchainContext.jsx](../../../src/context/BlockchainContext.jsx) — Contexto global
