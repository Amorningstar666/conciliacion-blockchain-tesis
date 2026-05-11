const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const signers = await hre.ethers.getSigners();
  const [admin, autoridadJudicial, , , conciliador1] = signers;
  // Cuenta #0: Admin PGN (deployer automático)
  // Cuenta #1: Autoridad Judicial (pasada al constructor)
  // Cuenta #2: Libre → Empleador en demo
  // Cuenta #3: Libre → Trabajador en demo
  // Cuenta #4: Se registrará como Conciliador PGN

  console.log("═══════════════════════════════════════════════");
  console.log("   PGN — Setup Conciliación Laboral Blockchain  ");
  console.log("═══════════════════════════════════════════════");
  console.log(`Admin PGN:          ${admin.address}`);
  console.log(`Autoridad Judicial: ${autoridadJudicial.address}`);
  console.log(`Conciliador demo:   ${conciliador1.address}`);
  console.log("───────────────────────────────────────────────");

  // 1. Deploy
  const Factory = await hre.ethers.getContractFactory("ConciliacionLaboralColombia");
  const contract = await Factory.deploy(autoridadJudicial.address, { gasLimit: 3000000 });
  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();
  console.log(`\n✅ Contrato desplegado: ${contractAddress}`);

  // 2. Registrar conciliador automáticamente
  const tx = await contract.connect(admin).registrarConciliador(conciliador1.address);
  await tx.wait();
  console.log(`✅ Conciliador registrado: ${conciliador1.address} (Cuenta #4)`);

  // 3. Generar deployment.json
  const deploymentInfo = {
    contractAddress,
    network: "hardhat-local",
    deployedAt: new Date().toISOString(),
    roles: {
      admin: { address: admin.address, accountIdx: 0 },
      autoridadJudicial: { address: autoridadJudicial.address, accountIdx: 1 },
      conciliadores: [
        { address: conciliador1.address, accountIdx: 4, nombre: "Conciliador PGN Demo" },
      ],
    },
  };

  const outputPath = path.join(__dirname, "../deployment.json");
  const frontendPath = path.join(__dirname, "../frontend/src/constants/deployment.json");

  fs.writeFileSync(outputPath, JSON.stringify(deploymentInfo, null, 2));
  fs.writeFileSync(frontendPath, JSON.stringify(deploymentInfo, null, 2));

  console.log(`\n✅ deployment.json generado en raíz y frontend/src/constants/`);
  console.log("\n═══════════════════════════════════════════════");
  console.log("  Sistema listo. Roles asignados:");
  console.log(`  #0  Admin PGN            ${admin.address}`);
  console.log(`  #1  Autoridad Judicial   ${autoridadJudicial.address}`);
  console.log(`  #4  Conciliador PGN      ${conciliador1.address}`);
  console.log(`  #2  Libre (Empleador)    ${signers[2].address}`);
  console.log(`  #3  Libre (Trabajador)   ${signers[3].address}`);
  console.log("═══════════════════════════════════════════════\n");
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
