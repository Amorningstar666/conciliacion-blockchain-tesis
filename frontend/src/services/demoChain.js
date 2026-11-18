// ─────────────────────────────────────────────────────────────────────────────
// Red demo para GitHub Pages
// Levanta una blockchain EVM (Ganache) dentro del navegador, despliega el
// contrato ConciliacionLaboralColombia real y replica `npm run setup`.
// Solo se usa cuando el build tiene VITE_DEMO_MODE=true.
// ─────────────────────────────────────────────────────────────────────────────
import { ethers } from "ethers";
import { HARDHAT_PRIVATE_KEYS } from "./hardhatAccounts";
import { CONTRACT_ADDRESS, deployment } from "../constants/contract";
import artifact from "./demo/ConciliacionLaboral.artifact.json";

const CHAIN_ID = 31337; // mismo chainId que Hardhat
const SALDO_INICIAL = "0x" + ethers.parseEther("10000").toString(16);
const CLAVES_APP = ["pgn_conciliaciones_v1", "pgn_conciliadores_v1"];

let _provider = null;

async function cargarGanache() {
  const mod = await import("ganache");
  return mod.default ?? mod;
}

// La red vive en memoria: al recargar la página empieza vacía,
// así que se limpian los datos locales para que no queden actas huérfanas.
function limpiarDatosLocales() {
  try {
    CLAVES_APP.forEach((k) => localStorage.removeItem(k));
  } catch {
    // almacenamiento bloqueado: la demo funciona igual
  }
}

// Ajusta el nonce del admin para que el contrato quede en la misma
// dirección que registra deployment.json (la que usa toda la UI).
async function alinearDireccionContrato(provider, admin) {
  for (let nonce = 0; nonce < 100; nonce++) {
    const direccion = ethers.getCreateAddress({ from: admin.address, nonce });
    if (direccion.toLowerCase() === CONTRACT_ADDRESS.toLowerCase()) {
      await provider.send("evm_setAccountNonce", [admin.address, ethers.toQuantity(nonce)]);
      return;
    }
  }
  throw new Error("La dirección de deployment.json no corresponde a la cuenta admin de Hardhat.");
}

async function iniciarRed() {
  const Ganache = await cargarGanache();
  const ganacheProvider = Ganache.provider({
    chain: { chainId: CHAIN_ID },
    wallet: {
      accounts: HARDHAT_PRIVATE_KEYS.map((secretKey) => ({ secretKey, balance: SALDO_INICIAL })),
    },
    logging: { quiet: true },
  });

  // cacheTimeout -1: la red mina al instante y el caché de ethers repetiría nonces viejos
  const provider = new ethers.BrowserProvider(ganacheProvider, CHAIN_ID, {
    pollingInterval: 250,
    cacheTimeout: -1,
  });
  const admin = new ethers.Wallet(HARDHAT_PRIVATE_KEYS[deployment.roles.admin.accountIdx], provider);
  const autoridad = deployment.roles.autoridadJudicial.address;

  await alinearDireccionContrato(provider, admin);
  const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, admin);
  const contrato = await factory.deploy(autoridad);
  await contrato.waitForDeployment();

  for (const { address } of deployment.roles.conciliadores || []) {
    const tx = await contrato.registrarConciliador(address);
    await tx.wait();
  }

  limpiarDatosLocales();
  return provider;
}

export function getDemoProvider() {
  if (!_provider) {
    _provider = iniciarRed().catch((err) => {
      _provider = null;
      throw err;
    });
  }
  return _provider;
}
