// Modo demo: se activa solo en el build de GitHub Pages (VITE_DEMO_MODE=true).
export const IS_DEMO_MODE = import.meta.env.VITE_DEMO_MODE === "true";

export const NETWORK_LABEL = IS_DEMO_MODE
  ? "Red demo en el navegador · chainId 31337"
  : "Hardhat local · localhost:8545";

export const DEMO_AVISO =
  "Demo pública: el contrato real corre en una blockchain dentro de tu navegador. " +
  "Los datos se reinician al recargar la página.";
