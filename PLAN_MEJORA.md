# Plan de Mejora — Sistema PGN Conciliación Laboral Blockchain

> Ley 2220 de 2022 · Hardhat + React 19 + Ethers.js v6

---

## Diagnóstico general

Se identificaron 6 categorías de problemas que impiden que el sistema sea probado de forma real y coherente con la lógica del smart contract.

---

## Problema 1 — Datos quemados (hardcoded)

| # | Problema | Archivo | Línea |
|---|---|---|---|
| 1.1 | `CONTRACT_ADDRESS` fijo en el código | `frontend/PGNPortal.jsx` | 17 |
| 1.2 | `defaultConciliacion` con nombres y montos ficticios siempre cargados | `frontend/PGNPortal.jsx` | 166 |
| 1.3 | Montos de derechos laborales fijos (no por caso) | `frontend/EmpleadorDashboard.jsx` | 10–16 |
| 1.4 | `"Dra. Liliana Soto Vargas"` como conciliador fijo | `frontend/PGNPortal.jsx` | 174 |
| 1.5 | Índices de cuentas Hardhat fijos (#0–#3) | `frontend/LoginScreen.jsx` | 3–24 |

**Causa raíz:** el frontend no lee el archivo `deployment.json` que genera `setup.js`.

**Solución — sin base de datos:**
- `setup.js` ya genera `deployment.json` con la dirección del contrato y las wallets reales.
- El frontend debe consumir ese archivo al arrancar para obtener `contractAddress` y las direcciones de cada rol.
- Los metadatos de cada caso (hechos, nombres, cargos, correos, montos COP) se persisten en `localStorage` indexados por `hashActa`.
- El estado blockchain de cada acuerdo se lee siempre en vivo con `getAcuerdo()`.

---

## Problema 2 — Desincronización setup.js vs. frontend

`setup.js` registra la **cuenta #4** como conciliador PGN.
`PGNPortal.jsx` (en `handleLogin`) registra automáticamente la **cuenta #1**.
Son dos direcciones distintas — las llamadas a `validarActa()` fallarán porque el conciliador asignado en `crearAcuerdo` no coincide con quien intenta validar.

**Fix:**
- El login del Admin **no debe auto-registrar** ningún conciliador.
- La lista de conciliadores autorizados se gestiona exclusivamente desde el dashboard del Admin.
- `crearAcuerdo` debe usar la dirección del conciliador registrada en el acta (leída de `localStorage`), no un índice fijo.

---

## Problema 3 — Aislamiento de usuarios (bug de lógica grave)

**Situación actual:** toda la lista de conciliaciones vive en estado React compartido en el navegador. Si el Empleador crea una conciliación y luego el Trabajador hace login, ve todas las conciliaciones (incluyendo las de otros empleadores). El botón "Retirar Fondos" aparece para cualquier conciliación en estado `validado`, aunque el trabajador logueado no sea el beneficiario.

> El contrato sí protege esto — `retirarFondos` verifica `msg.sender == a.trabajador`. La transacción fallará con error. Pero la UI es engañosa y el usuario no entenderá qué ocurrió.

**Fix:**
- Al hacer login, cargar solo las conciliaciones donde la wallet activa aparece como `empleador` o `trabajador`.
- Filtrar escuchando los eventos `AcuerdoCreado(hashActa, empleador, trabajador, conciliador)` del contrato.
- Leer el estado de cada acuerdo con `getAcuerdo()` para reconciliar blockchain + `localStorage`.
- En `TrabajadorDashboard`: mostrar el botón "Retirar Fondos" **únicamente** si `bcAddress === acuerdo.trabajador`.

---

## Problema 4 — Panel Admin PGN no existe

El Admin actualmente solo tiene la función de auto-registro en `handleLogin`. No tiene dashboard propio.

**Lo que debe poder hacer el Admin:**
- Ver la lista de conciliadores autorizados (activos y revocados)
- Registrar un nuevo conciliador ingresando su dirección wallet — llama `registrarConciliador(addr)`
- Revocar un conciliador existente — llama `revocarConciliador(addr)`
- Ver estadísticas: N conciliadores activos, N acuerdos totales en cadena

**Fuente de datos:** los eventos `ConciliadorRegistrado` y `ConciliadorRevocado` del contrato (no hay BD, todo está en cadena).

El contrato ya tiene toda la lógica necesaria — solo falta el componente `AdminDashboard.jsx`.

---

## Problema 5 — Flujo del contrato vs. flujo de la UI

El flujo correcto según el smart contract es:

```
Admin PGN      → registrarConciliador(walletAddr)
Conciliador    → crea y llena el acta en la UI (datos, hechos, montos)
                 → guarda metadata en localStorage con key = hashActa
Empleador      → lee el acta → llama crearAcuerdo() depositando ETH
Conciliador    → llama validarActa() con la wallet que fue asignada en crearAcuerdo
Trabajador     → llama retirarFondos() con su propia wallet
```

**Desalineaciones actuales:**

| # | Problema |
|---|---|
| 5.1 | `NuevaConciliacionModal` está disponible en `EmpleadorDashboard` — el empleador **no** crea actas, eso es rol del Conciliador |
| 5.2 | `crearAcuerdo` usa `getSigner(1)` como conciliador fijo — debe leer la wallet del conciliador desde el metadata del acta |
| 5.3 | `crearAcuerdo` usa `getSigner(3)` como trabajador fijo — debe leer la wallet real del trabajador desde el acta |
| 5.4 | La UI no valida si el conciliador asignado está autorizado antes de llamar el contrato |

---

## Problema 6 — Persistencia de metadatos

El smart contract almacena datos on-chain (direcciones, monto ETH, estados). Los metadatos de texto (nombres, CC, hechos, cargo, correos, montos COP) no pueden ir al contrato por costo de gas y privacidad.

**Arquitectura propuesta — sin backend ni BD:**

```
Blockchain (Hardhat)              localStorage (browser)
────────────────────              ──────────────────────
hashActa                          id PGN, fecha, hora
empleador (address)      ←──→     nombre trabajador, CC, cargo
trabajador (address)              nombre empleador, NIT
conciliador (address)             hechos del caso
monto ETH                         montos COP por concepto
depositado                        correos de las partes
validadoPorConciliador            conciliadorNombre, wallet
pagado                            lugarFirma, modalidadPago
suspendidoJudicialmente
```

Al iniciar sesión: se lee `localStorage` para obtener los hashes conocidos → se consulta `getAcuerdo(hash)` en cadena → se reconcilia el estado → se filtra por wallet activa.

---

## Plan de implementación

### Sprint 1 — Infraestructura base *(desbloquea todo lo demás)*

| Tarea | Descripción |
|---|---|
| 1.1 | Crear directorio `frontend/src/constants/` y ajustar `setup.js` para que escriba `deployment.json` allí correctamente |
| 1.2 | Crear `frontend/src/hooks/useDeployment.js` — lee `deployment.json` y expone `contractAddress` + wallets por rol |
| 1.3 | Eliminar `CONTRACT_ADDRESS` hardcodeado en `PGNPortal.jsx` — reemplazar por el hook |
| 1.4 | Eliminar `defaultConciliacion` — iniciar con lista vacía |
| 1.5 | Actualizar `LoginScreen.jsx` para mostrar las wallets reales leídas de `deployment.json` en lugar de "Cuenta Hardhat #N" |

### Sprint 2 — Persistencia en localStorage

| Tarea | Descripción |
|---|---|
| 2.1 | Crear `frontend/src/services/conciliacionStorage.js` — CRUD sobre `localStorage` indexado por `hashActa` |
| 2.2 | Al crear un acta (Conciliador): guardar metadata completa en `localStorage` |
| 2.3 | Al hacer login: leer `localStorage` + consultar `getAcuerdo()` para cada hash conocido → reconstruir estado |
| 2.4 | Filtrar conciliaciones por wallet activa (solo las que corresponden al usuario logueado) |

### Sprint 3 — Dashboard Admin PGN

| Tarea | Descripción |
|---|---|
| 3.1 | Crear `frontend/AdminDashboard.jsx` con encabezado institucional y color diferenciado (morado/índigo) |
| 3.2 | Sección "Conciliadores autorizados": leer eventos `ConciliadorRegistrado` / `ConciliadorRevocado` para construir la lista |
| 3.3 | Formulario de alta: campo de dirección wallet + botón "Autorizar" → llama `registrarConciliador(addr)` |
| 3.4 | Botón "Revocar" por conciliador activo → llama `revocarConciliador(addr)` |
| 3.5 | Panel de stats: N conciliadores activos, N acuerdos totales en cadena |
| 3.6 | Routing `userRole === 0` → `<AdminDashboard />` en `PGNPortal.jsx` |

### Sprint 4 — Corrección de flujo y lógica

| Tarea | Descripción |
|---|---|
| 4.1 | Eliminar `NuevaConciliacionModal` del `EmpleadorDashboard` — crear actas es rol exclusivo del Conciliador |
| 4.2 | En el portal del Conciliador: al crear acta, guardar `conciliadorWallet` (la dirección activa) en el metadata |
| 4.3 | Corregir `handleFirmarEnBlockchain`: leer `conciliadorAddr` desde el metadata del acta, no `getSigner(1)` |
| 4.4 | Corregir `handleFirmarEnBlockchain`: leer `trabajadorAddr` desde el metadata del acta, no `getSigner(3)` |
| 4.5 | Antes de llamar `crearAcuerdo`, consultar `conciliadoresAutorizados(conciliadorAddr)` y mostrar error claro si no está autorizado |
| 4.6 | En `TrabajadorDashboard`: mostrar botón "Retirar Fondos" solo si `bcAddress === acuerdo.trabajador` |
| 4.7 | En `handleLogin`: eliminar el auto-registro del conciliador |

### Sprint 5 — Conciliador Dashboard mejorado

| Tarea | Descripción |
|---|---|
| 5.1 | El Conciliador solo puede crear actas si su wallet está en la lista de autorizados (verificar antes de mostrar el formulario) |
| 5.2 | El formulario de nueva conciliación debe incluir campo para ingresar la wallet del trabajador y la del empleador (no depender de índices fijos) |
| 5.3 | Panel de validación: listar acuerdos donde `a.conciliador == bcAddress` y `!a.validadoPorConciliador` → botón "Validar Acta" |

---

## Lo que NO requiere cambios

- **Smart contract** (`ConciliacionLaboral.sol`): la lógica es correcta y cubre todos los casos. No requiere modificaciones.
- **`setup.js`**: hace el deploy y el registro del primer conciliador correctamente. Solo necesita que el frontend consuma su output.
- **Diseño visual** de `TrabajadorDashboard` y `EmpleadorDashboard`: estructura y estilos son válidos, solo necesitan datos reales.
- **Hardhat**: configuración y red local no requieren cambios.

---

## Resumen de prioridades

```
Sprint 1 (infraestructura)  →  prerequisito de todo
Sprint 2 (localStorage)     →  prerequisito de Sprint 4 y 5
Sprint 3 (Admin Dashboard)  →  independiente, puede ir en paralelo con Sprint 2
Sprint 4 (fixes de lógica)  →  depende de Sprints 1 y 2
Sprint 5 (Conciliador)      →  depende de Sprints 1, 2 y 3
```

---

## Arquitectura final objetivo

```
login
  ├── userRole 0 → AdminDashboard      (gestión de conciliadores)
  ├── userRole 1 → PGNPortal           (crea actas, valida)
  ├── userRole 2 → EmpleadorDashboard  (lee acta, deposita ETH)
  └── userRole 3 → TrabajadorDashboard (retira fondos propios)

datos
  ├── blockchain      → estados, montos ETH, direcciones (fuente de verdad)
  ├── localStorage    → metadatos de texto por hashActa
  └── deployment.json → contractAddress + wallets por rol (generado por setup.js)
```
