# Conciliación Laboral Blockchain - PGN

[![Pruebas del contrato](https://github.com/Amorningstar666/conciliacion-blockchain-tesis/actions/workflows/tests.yml/badge.svg)](https://github.com/Amorningstar666/conciliacion-blockchain-tesis/actions/workflows/tests.yml)

Sistema de conciliación laboral basado en blockchain para la Procuraduría General de la Nación (PGN), Colombia. Implementa la Ley 2220/2022 y normativas del Código Sustantivo del Trabajo (CST).

**▶ Demo en línea:** https://amorningstar666.github.io/conciliacion-blockchain-tesis/

La demo ejecuta el contrato real dentro del navegador (red EVM en memoria con las mismas cuentas de Hardhat), así que no requiere instalar nada. Los datos se reinician al recargar la página.

## 📋 Descripción

Este proyecto proporciona una plataforma descentralizada para la conciliación de conflictos laborales en Colombia, utilizando blockchain para garantizar transparencia, inmutabilidad e igualdad entre las partes. El sistema está diseñado para gestionar actas de conciliación, depósitos en garantía y el flujo completo de resolución de disputas laborales.

## 🛠️ Stack Tecnológico

- **Smart Contract:** Solidity + Hardhat (red local puerto 8545)
- **Frontend:** React 19 + Vite (puerto 5173)
- **Estilos:** Tailwind CSS
- **Blockchain Library:** Ethers.js v6
- **Base de datos local:** localStorage (sin backend)

## 📁 Estructura del Proyecto

```
conciliacion-blockchain/
├── contracts/
│   └── ConciliacionLaboral.sol          # Smart contract principal
├── scripts/
│   └── deploy.js                         # Script de despliegue
│   └── setup.js                          # Inicializa roles y deployment.json
├── test/
│   └── [tests del contrato]
├── src/
│   ├── pages/
│   │   ├── LoginScreen.jsx               # Login con 4 roles
│   │   ├── AdminDashboard.jsx            # Gestión de conciliadores
│   │   ├── ConciliadorDashboard.jsx      # Panel de conciliadores
│   │   ├── EmpleadorDashboard.jsx        # Panel de empleadores
│   │   └── TrabajadorDashboard.jsx       # Panel de trabajadores
│   ├── context/
│   │   └── BlockchainContext.jsx         # Contexto global de blockchain
│   ├── hooks/
│   │   └── useConciliaciones.js          # Hook para gestionar conciliaciones
│   ├── services/
│   │   ├── blockchain.js                 # Interacción con smart contract
│   │   └── conciliacionStorage.js        # CRUD de localStorage
│   ├── modals/
│   │   └── NuevaConciliacionModal.jsx    # Modal para crear actas
│   ├── constants/
│   │   ├── contract.js                   # ABI y address del contrato
│   │   └── deployment.json               # Config generada por setup.js
│   └── App.jsx
├── hardhat.config.js
├── package.json
└── README.md
```

## 🚀 Requisitos

- Node.js >= 16
- npm o yarn
- Navegador moderno compatible con MetaMask o wallet compatible

## 📦 Instalación

1. **Clonar el repositorio**
```bash
git clone <url-repositorio>
cd conciliacion-blockchain
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Compilar smart contract**
```bash
npx hardhat compile
```

4. **Iniciar la red local**
```bash
npx hardhat node
```

5. **Desplegar contrato e inicializar sistema** (en otra terminal)
```bash
npm run setup
```

6. **Iniciar frontend**
```bash
npm run dev
```

El sistema estará disponible en `http://localhost:5173`

## 💻 Uso

### Cuentas Hardhat Predefinidas

El sistema utiliza 4 cuentas Hardhat en roles específicos:

| Índice | Rol | Dirección | Función |
|--------|-----|-----------|---------|
| 0 | Admin PGN | Cuenta #0 | Administrador del contrato, registra conciliadores |
| 4 | Conciliador PGN | Cuenta #4 | Crea y valida actas de conciliación |
| 2 | Empleador | Cuenta #2 | Deposita ETH en garantía y firma acuerdos |
| 3 | Trabajador | Cuenta #3 | Retira fondos del acuerdo |

### Flujo de Operación

1. **Administrador registra conciliador** → Accede a AdminDashboard, registra conciliador mediante `registrarConciliador`

2. **Conciliador crea acta** → Crea acta en NuevaConciliacionModal con datos de empleador y trabajador, se guarda localmente

3. **Empleador deposita garantía** → Inicia sesión, visualiza actas asignadas a su wallet, deposita ETH llamando `crearAcuerdo`

4. **Conciliador valida** → Valida el acta completada mediante `validarActa` desde panel "Pendientes"

5. **Trabajador retira fondos** → Inicia sesión y retira fondos mediante `retirarFondos`

## 📊 Arquitectura

### Smart Contract - `ConciliacionLaboralColombia.sol`

**Funciones Principales:**
- `registrarConciliador(address)` → Registra un conciliador autorizado
- `revocarConciliador(address)` → Revoca autorización de conciliador
- `crearAcuerdo(bytes32 hashActa, address trabajador)` → Crea acuerdo con depósito en ETH (payable)
- `validarActa(bytes32 hashActa)` → Valida acta por conciliador
- `retirarFondos(bytes32 hashActa)` → Permite al trabajador retirar fondos
- `getAcuerdo(bytes32 hashActa)` → Lee datos del acuerdo

**Estados de Acuerdo:**
- `null` → Acta creada localmente, sin depósito
- `depositado` → Empleador depositó ETH
- `validado` → Conciliador validó el acta
- `pagado` → Trabajador retiró fondos

### Persistencia de Datos

**Blockchain (fuente de verdad):**
- Estados y transiciones de acuerdos
- Montos en ETH depositados
- Direcciones autorizadas
- Historial de validaciones

**localStorage (clave: `pgn_conciliaciones_v1`):**
- Metadatos de texto de actas
- Información adicional indexada por `hashActa`

**deployment.json (generado):**
- Dirección del contrato desplegado
- Wallets predeterminadas por rol

## 🔒 Seguridad

- ✅ Solo conciliadores registrados pueden crear acuerdos
- ✅ Validación de autorización antes de transacciones
- ✅ Fondos en garantía protegidos por smart contract
- ✅ Blockchain proporciona inmutabilidad y trazabilidad

## 📜 Marco Legal

Proyecto desarrollado conforme a:
- **Ley 2220/2022** - Nuevos mecanismos de conciliación
- **Código Sustantivo del Trabajo (CST)** - Normativas laborales colombianas
- Principios de equidad y transparencia en disputas laborales

## 🧪 Testing

```bash
# Ejecutar tests del smart contract
npx hardhat test

# Ejecutar con reporte de gas
REPORT_GAS=true npx hardhat test
```

## 📚 Comandos Disponibles

```bash
# Desarrollo
npm run dev                 # Inicia servidor Vite en puerto 5173

# Blockchain
npx hardhat compile        # Compila el smart contract
npx hardhat test          # Ejecuta tests
npx hardhat node          # Inicia red local en puerto 8545
npx hardhat run scripts/deploy.js   # Despliegue manual

# Inicialización
npm run setup             # Despliega contrato e inicializa sistema
```

## 👥 Contribución

Este es un proyecto académico y demostrativo. Para cambios:
1. No modificar la lógica del smart contract sin revisión legal
2. Mantener la estructura de roles establecida
3. Preservar el flujo de conciliación diseñado
4. Documentar cambios en conflicto con el marco legal

## 📝 Notas de Desarrollo

- La lógica es correcta
- El frontend utiliza wallets derivadas de PKs predefinidas
- Estado sincronizado entre localStorage y blockchain
- Sin dependencias de backend externo
- Testnet local configurable en `hardhat.config.js`

## 📞 Contacto

Para preguntas sobre el proyecto:
- Email: angelycarvajal.abg@gmail.com
- Marco legal: Procuraduría General de la Nación (PGN), Colombia

---

**Versión:** 1.0  
**Estado:** Producción (red local)  
**Última actualización:** 2026
