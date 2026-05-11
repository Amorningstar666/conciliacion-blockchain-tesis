import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../constants/contract";

export async function detectRole(address, provider) {
  try {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

    const admin = await contract.administrador();
    if (address.toLowerCase() === admin.toLowerCase()) return "admin";

    const autoridadJudicial = await contract.autoridadJudicial();
    if (address.toLowerCase() === autoridadJudicial.toLowerCase()) return "autoridad";

    const esConciliador = await contract.conciliadoresAutorizados(address);
    if (esConciliador) return "conciliador";
  } catch {
    // Si el nodo no está disponible o el contrato no está desplegado
  }

  // Cualquier cuenta no reconocida puede elegir rol (empleador o trabajador)
  return "sin_rol";
}
