export function calcularTotalCiertos(todosDerechos, clasificaciones, montos) {
  return todosDerechos
    .filter((d) => (clasificaciones[d.id] || d.tipo) === "cierto")
    .reduce((s, d) => {
      if (!clasificaciones[d.id] && d.tipo === "cierto") return s + (d.monto || 0);
      return s + (parseFloat(montos[d.id]) || d.monto || 0);
    }, 0);
}

export function calcularTotalInciertos(todosDerechos, clasificaciones, montos) {
  return todosDerechos
    .filter((d) => (clasificaciones[d.id] || d.tipo) === "incierto")
    .reduce((s, d) => s + (parseFloat(montos[d.id]) || 0), 0);
}
