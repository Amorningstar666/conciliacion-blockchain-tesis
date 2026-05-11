import { CONTRACT_ADDRESS } from "../../../constants/contract";

function shortAddr(addr) {
  if (!addr || addr.length < 12) return addr;
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export function LoginHeader() {
  return (
    <div className="text-center mb-12">
      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-5 shadow-2xl ring-4 ring-white ring-opacity-20">
        <span className="text-blue-900 font-black text-xl tracking-tight">PGN</span>
      </div>
      <p className="text-blue-300 text-xs uppercase tracking-widest mb-2">República de Colombia</p>
      <h1 className="text-3xl font-black text-white leading-tight">
        Procuraduría General de la Nación
      </h1>
      <p className="text-blue-300 mt-2 text-sm">
        Sistema de Conciliación Laboral Blockchain · Ley 2220 de 2022
      </p>
      <div className="mt-5 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-xl px-5 py-3 inline-block">
        <p className="text-blue-200 text-sm font-medium">
          Selecciona tu rol para ingresar al sistema
        </p>
        <p className="text-blue-400 text-xs mt-1">
          Asegúrate de tener corriendo:{" "}
          <span className="font-mono bg-blue-900 px-1.5 py-0.5 rounded">npx hardhat node</span>
        </p>
      </div>

      <div className="mt-10 text-center space-y-1">
        <p className="text-blue-600 text-xs font-mono">Red: Hardhat Local · localhost:8545</p>
        <p className="text-blue-700 text-xs font-mono">Contrato: {shortAddr(CONTRACT_ADDRESS)}</p>
      </div>
    </div>
  );
}
