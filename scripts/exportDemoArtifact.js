// Exporta ABI + bytecode del contrato compilado para la demo de GitHub Pages,
// donde la UI despliega el contrato en una blockchain que corre en el navegador.
// Uso: npx hardhat compile && node scripts/exportDemoArtifact.js
const fs = require("fs");
const path = require("path");

const origen = path.join(
  __dirname,
  "../artifacts/contracts/ConciliacionLaboral.sol/ConciliacionLaboralColombia.json"
);
const destino = path.join(
  __dirname,
  "../frontend/src/services/demo/ConciliacionLaboral.artifact.json"
);

const { contractName, abi, bytecode } = JSON.parse(fs.readFileSync(origen, "utf8"));
fs.mkdirSync(path.dirname(destino), { recursive: true });
fs.writeFileSync(destino, JSON.stringify({ contractName, abi, bytecode }, null, 2) + "\n");
console.log(`✅ Artefacto demo exportado: ${path.relative(process.cwd(), destino)}`);
