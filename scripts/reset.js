const fs = require("fs");
const path = require("path");

// Elimina deployment.json de raíz y frontend para forzar un re-deploy limpio
const files = [
  path.join(__dirname, "../deployment.json"),
  path.join(__dirname, "../frontend/src/constants/deployment.json"),
];

files.forEach((f) => {
  if (fs.existsSync(f)) {
    fs.unlinkSync(f);
    console.log(`🗑️  Eliminado: ${f}`);
  } else {
    console.log(`ℹ️  No existe: ${f}`);
  }
});

console.log("\n✅ Reset completo. Ejecuta 'npm run setup' para re-deployar.\n");
