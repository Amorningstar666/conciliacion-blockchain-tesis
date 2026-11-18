import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../constants/contract";
import { IS_DEMO_MODE } from "../constants/network";
import { getDemoProvider } from "./demoChain";

let _provider = null;
let _signer = null;
let _contract = null;

// En la demo de GitHub Pages la red se prepara apenas carga la app.
if (IS_DEMO_MODE) getDemoProvider().catch((e) => console.error("[Demo] Error iniciando la red:", e));

export const blockchainService = {
  async connectWithPrivateKey(privateKey) {
    _provider = IS_DEMO_MODE
      ? await getDemoProvider()
      : new ethers.JsonRpcProvider("http://127.0.0.1:8545");
    await _provider.getBlockNumber();
    _signer = new ethers.Wallet(privateKey, _provider);
    const address = await _signer.getAddress();
    _contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, _signer);
    return { address };
  },

  disconnect() {
    _provider = null;
    _signer = null;
    _contract = null;
  },

  get provider() { return _provider; },
  get signer() { return _signer; },
  get contract() { return _contract; },

  async registrarConciliador(conciliadorAddr) {
    const tx = await _contract.registrarConciliador(conciliadorAddr);
    await tx.wait();
    return { txHash: tx.hash };
  },

  async revocarConciliador(conciliadorAddr) {
    const tx = await _contract.revocarConciliador(conciliadorAddr);
    await tx.wait();
    return { txHash: tx.hash };
  },

  async crearAcuerdo({ conciliacionId, condiciones, montoETH, trabajadorAddress, conciliadorAddress }) {
    const trabajador = ethers.getAddress(trabajadorAddress.toLowerCase());
    const conciliador = conciliadorAddress ? ethers.getAddress(conciliadorAddress.toLowerCase()) : conciliadorAddress;

    if (conciliador) {
      const autorizado = await _contract.conciliadoresAutorizados(conciliador);
      if (!autorizado) {
        throw new Error("El conciliador asignado no está autorizado en el contrato PGN.");
      }
    }

    const hashActa = ethers.keccak256(
      ethers.toUtf8Bytes(`${conciliacionId}-${Date.now()}`)
    );
    const diasPlazo = Math.max(
      1,
      Math.ceil((new Date(condiciones.fechaPago).getTime() - Date.now()) / 86400000)
    );
    const cuotas = parseInt(condiciones.numeroCuotas) || 1;

    const tx = await _contract.crearAcuerdo(
      hashActa,
      trabajador,
      conciliador,
      condiciones.lugarFirma,
      diasPlazo,
      condiciones.modalidad,
      cuotas,
      { value: ethers.parseEther(montoETH) }
    );
    await tx.wait();
    return { txHash: tx.hash, hashActa };
  },

  async validarActa(hashActa) {
    const tx = await _contract.validarActa(hashActa);
    await tx.wait();
    return { txHash: tx.hash };
  },

  async retirarFondos(hashActa) {
    const tx = await _contract.retirarFondos(hashActa);
    await tx.wait();
    return { txHash: tx.hash };
  },

  get isConnected() {
    return _provider !== null;
  },
};
