import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../constants/contract";

function buildContract(provider) {
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
}

function parseAcuerdo(hash, data) {
  const bcState = data[11] ? "pagado" : data[10] ? "validado" : data[9] ? "depositado" : null;
  return {
    hashActa: hash,
    empleador: data[0],
    trabajador: data[1],
    conciliador: data[2],
    monto: ethers.formatEther(data[3]),
    fechaCreacion: new Date(Number(data[4]) * 1000).toLocaleDateString("es-CO"),
    lugarConciliacion: data[5],
    plazoCumplimiento: new Date(Number(data[6]) * 1000).toLocaleDateString("es-CO"),
    modalidadPago: data[7],
    numeroCuotas: Number(data[8]),
    depositado: data[9],
    validadoPorConciliador: data[10],
    pagado: data[11],
    suspendidoJudicialmente: data[12],
    derechosConciliablesVerificados: data[13],
    bcState,
  };
}

export async function getAcuerdosByAddress(address, provider) {
  const contract = buildContract(provider);
  const filter = contract.filters.AcuerdoCreado();
  const eventos = await contract.queryFilter(filter);

  const relevantes = eventos.filter(
    (e) =>
      e.args.empleador.toLowerCase() === address.toLowerCase() ||
      e.args.trabajador.toLowerCase() === address.toLowerCase()
  );

  const acuerdos = await Promise.all(
    relevantes.map(async (e) => {
      try {
        const data = await contract.getAcuerdo(e.args.hashActa);
        return parseAcuerdo(e.args.hashActa, data);
      } catch {
        return null;
      }
    })
  );

  return acuerdos.filter(Boolean);
}

export async function getAcuerdosByConciliador(conciliadorAddress, provider) {
  const contract = buildContract(provider);
  const filter = contract.filters.AcuerdoCreado();
  const eventos = await contract.queryFilter(filter);

  const acuerdos = await Promise.all(
    eventos.map(async (e) => {
      try {
        const data = await contract.getAcuerdo(e.args.hashActa);
        if (data[2].toLowerCase() !== conciliadorAddress.toLowerCase()) return null;
        return parseAcuerdo(e.args.hashActa, data);
      } catch {
        return null;
      }
    })
  );

  return acuerdos.filter(Boolean);
}

export async function getAcuerdoByHash(hashActa, provider) {
  const contract = buildContract(provider);
  try {
    const data = await contract.getAcuerdo(hashActa);
    return parseAcuerdo(hashActa, data);
  } catch {
    return null;
  }
}
