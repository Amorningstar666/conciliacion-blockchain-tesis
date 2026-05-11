export function fmtCOP(n) {
  return "$ " + Number(n).toLocaleString("es-CO");
}

export function sumETH(arr) {
  return arr.reduce((s, c) => s + parseFloat(c.monto || c.montoETH || 0), 0).toFixed(3);
}

export function truncateAddress(addr, start = 10, end = 6) {
  if (!addr) return "";
  return `${addr.slice(0, start)}…${addr.slice(-end)}`;
}
