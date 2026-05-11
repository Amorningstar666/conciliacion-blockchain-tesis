import { useState } from "react";

export function useConceptosExtra(conceptosExtra, updateActiva) {
  const [nuevoConcepto, setNuevoConcepto] = useState({ concepto: "", base: "", tipo: "incierto", monto: "" });
  const [showAgregarConcepto, setShowAgregarConcepto] = useState(false);

  const handleAgregarConcepto = () => {
    if (!nuevoConcepto.concepto.trim()) return;
    const nuevo = {
      id: `custom_${Date.now()}`,
      concepto: nuevoConcepto.concepto.trim(),
      base: nuevoConcepto.base.trim() || "Acuerdo entre partes",
      tipo: nuevoConcepto.tipo,
      monto: nuevoConcepto.tipo === "cierto" ? (parseFloat(nuevoConcepto.monto) || 0) : null,
      nota: "",
    };
    updateActiva({ conceptosExtra: [...conceptosExtra, nuevo] });
    setNuevoConcepto({ concepto: "", base: "", tipo: "incierto", monto: "" });
    setShowAgregarConcepto(false);
  };

  const handleEliminarConcepto = (id) =>
    updateActiva({ conceptosExtra: conceptosExtra.filter((c) => c.id !== id) });

  return {
    nuevoConcepto,
    setNuevoConcepto,
    showAgregarConcepto,
    setShowAgregarConcepto,
    handleAgregarConcepto,
    handleEliminarConcepto,
  };
}
