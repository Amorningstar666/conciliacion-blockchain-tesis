const hre = require("hardhat");

async function main() {
  // Obtenemos las cuentas (Signers)
  const [adminPGN, autoridadJudicial] = await hre.ethers.getSigners();

  console.log("--------------------------------------------------");
  console.log("Iniciando despliegue PGN - Ley 2220");
  console.log("Admin (Cuenta #0):", adminPGN.address);
  console.log("--------------------------------------------------");

  // Obtenemos la fábrica del contrato
  const Conciliacion = await hre.ethers.getContractFactory("ConciliacionLaboralColombia");

  // DESPLIEGUE:
  // Pasamos 'autoridadJudicial.address' como el único argumento que pide tu constructor.
  // Mantenemos el gasLimit alto para asegurar que pase la lógica compleja de los structs.
  const conciliacion = await Conciliacion.deploy(
    autoridadJudicial.address, 
    { gasLimit: 3000000 }
  );

  await conciliacion.waitForDeployment();

  const direccionContrato = await conciliacion.getAddress();

  console.log("✅ CONTRATO DESPLEGADO CON ÉXITO");
  console.log(`Dirección: ${direccionContrato}`);
  console.log(`Autoridad Judicial asignada: ${autoridadJudicial.address}`);
  console.log("--------------------------------------------------");
}

main().catch((error) => {
  console.error("❌ Error en el despliegue:");
  console.error(error);
  process.exitCode = 1;
});