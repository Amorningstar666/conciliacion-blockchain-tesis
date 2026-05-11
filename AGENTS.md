# Especificación del Proyecto: Conciliación Laboral Blockchain

## Visión General

Sistema descentralizado de conciliación de conflictos laborales para la Procuraduría General de la Nación (PGN), Colombia. Implementa Ley 2220/2022 y normativas del Código Sustantivo del Trabajo (CST) usando blockchain para transparencia e inmutabilidad.

## Stack Tecnológico

| Capa | Tecnología | Propósito |
|------|-----------|----------|
| Smart Contract | Solidity + Hardhat (puerto 8545) | Lógica de acuerdos, estados, fondos |
| Frontend | React 19 + Vite (puerto 5173) | Interfaz de usuario |
| Estilos | Tailwind CSS | Diseño responsivo |
| Blockchain | Ethers.js v6 | Comunicación con contrato |
| Persistencia | localStorage + blockchain | Metadatos + datos críticos |

## Arquitectura del Sistema

### Smart Contract: `ConciliacionLaboralColombia.sol`

**Funciones Principales:**
- `registrarConciliador(address)` — Registra conciliador autorizado (Admin)
- `revocarConciliador(address)` — Revoca autorización (Admin)
- `crearAcuerdo(bytes32 hashActa, address trabajador)` — Crea acuerdo con depósito ETH (payable, Empleador)
- `validarActa(bytes32 hashActa)` — Valida acta (Conciliador)
- `retirarFondos(bytes32 hashActa)` — Retira fondos (Trabajador)
- `getAcuerdo(bytes32 hashActa)` — Lee estado de acuerdo (todos)

**Estados de Acuerdo:**
```
null → depositado → validado → pagado
```

### Estructura Frontend (src/)

```
src/
├── pages/
│   ├── LoginScreen/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── constants/
│   │   └── index.jsx
│   ├── AdminDashboard/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── utils/
│   │   └── index.jsx
│   ├── ConciliadorDashboard/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── utils/
│   │   └── index.jsx
│   ├── EmpleadorDashboard/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── index.jsx
│   └── TrabajadorDashboard/
│       ├── components/
│       ├── hooks/
│       ├── services/
│       └── index.jsx
├── context/
│   └── BlockchainContext.jsx
├── shared/
│   ├── components/
│   ├── hooks/
│   └── utils/
├── services/
│   ├── blockchain.js
│   └── conciliacionStorage.js
├── constants/
│   ├── contract.js
│   └── deployment.json
└── App.jsx
```

## Roles y Cuentas Hardhat

| Índice | Rol | Función | Autorización |
|--------|-----|---------|-------------|
| 0 | Admin PGN | Registra conciliadores | Deployer del contrato |
| 4 | Conciliador PGN | Crea y valida actas | Registrado en contrato |
| 2 | Empleador | Deposita ETH en garantía | Libre (sin registro) |
| 3 | Trabajador | Retira fondos | Libre (sin registro) |

## Flujo de Conciliación (Golden Path)

1. **Admin registra Conciliador**
   - LoginScreen → AdminDashboard
   - Llama `registrarConciliador(address)` en contrato
   - Se guarda en estado del contrato

2. **Conciliador crea Acta**
   - NuevaConciliacionModal: completa datos (empleador, trabajador, monto)
   - hashActa = keccak256 de datos
   - Se guarda en localStorage con clave `pgn_conciliaciones_v1`
   - Estado bcState = null

3. **Empleador deposita Garantía**
   - LoginScreen → EmpleadorDashboard
   - Ve actas asignadas a su wallet (desde localStorage)
   - Llama `crearAcuerdo(hashActa, trabajadorAddress)` con ETH
   - Estado bcState = depositado

4. **Conciliador Valida**
   - ConciliadorDashboard → panel "Pendientes"
   - Revisa acta, llama `validarActa(hashActa)`
   - Estado bcState = validado

5. **Trabajador Retira Fondos**
   - LoginScreen → TrabajadorDashboard
   - Ve acuerdos de blockchain filtrando su wallet
   - Llama `retirarFondos(hashActa)`
   - Estado bcState = pagado

## Persistencia de Datos

**Blockchain (Fuente de Verdad):**
- Estados de acuerdos (null → depositado → validado → pagado)
- Montos en ETH depositados
- Direcciones de partes y conciliador
- Validaciones e historial

**localStorage (Clave: `pgn_conciliaciones_v1`):**
- Metadatos de texto: razón de conflicto, observaciones, términos
- Indexación por hashActa
- Permite sincronización frontend sin backend

**deployment.json (Generado por setup.js):**
- contractAddress
- Wallets por rol (derivadas de Hardhat accounts)
- Timestamps de despliegue

## Seguridad

✅ Solo conciliadores registrados pueden crear acuerdos  
✅ Validación de autorización antes de transacciones críticas  
✅ Fondos protegidos por smart contract (no se transfieren sin validación)  
✅ Blockchain garantiza inmutabilidad y trazabilidad  
✅ No hay backend centralizado (reducción de superficies de ataque)

## Estructura de Features / Páginas (Obligatoria)

Cada página o funcionalidad major debe ser una carpeta con esta estructura:

```
src/pages/NombrePagina/
├── components/              # Componentes reutilizables de la página
│   └── Componente.jsx       # Max 300 líneas c/u
├── hooks/                   # Lógica de negocio y estado
│   └── useCustomHook.js     # Max 300 líneas c/u
├── services/                # Integraciones externas (blockchain, storage)
│   └── pageService.js       # Max 300 líneas c/u
├── utils/                   # Funciones puras y helpers
│   └── helpers.js           # Max 300 líneas c/u
├── constants/               # Valores fijos
│   └── constants.js         # Max 100 líneas
└── index.jsx                # Exporta el componente principal
```

**Reglas Estrictas:**
- Cada archivo ≤ 300 líneas (máximo absoluto)
- Componentes = presentación pura (sin lógica blockchain)
- Hooks = lógica de negocio, estado y efectos
- Services = interacción blockchain/storage
- Utils = funciones puras (sin efectos secundarios)
- Constants = valores fijos y enumeraciones

## Comandos Esenciales

```bash
# Setup inicial
npm install
npx hardhat compile
npx hardhat node          # Terminal 1
npm run setup             # Terminal 2

# Desarrollo
npm run dev               # Inicia Vite en :5173

# Testing
npx hardhat test
REPORT_GAS=true npx hardhat test
```

## Notas de Desarrollo

- **Smart contract es inmutable** — No modificar `ConciliacionLaboral.sol` sin revisión legal
- **Wallets derivadas de Hardhat PKs** — Setup.js genera deployment.json con direcciones
- **No hay backend** — Datos críticos en blockchain, metadatos en localStorage
- **Contexto es global** — BlockchainContext proporciona provider + signer a toda la app
- **Sincronización estado** — localStorage es caché volátil; blockchain es fuente de verdad

## Referencias Legales

- Ley 2220/2022: Nuevos mecanismos de conciliación en Colombia
- Código Sustantivo del Trabajo (CST): Normativas laborales
- Principios: Equidad, transparencia, protección de partes
