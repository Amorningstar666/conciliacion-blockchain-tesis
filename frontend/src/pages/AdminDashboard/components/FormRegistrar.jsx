import { useState } from "react";

const EMPTY = { direccion: "", nombre: "", cargo: "" };

export function FormRegistrar({ onRegistrar, loading, msg }) {
  const [form, setForm] = useState(EMPTY);

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleRegistrar = () => {
    onRegistrar(form.direccion, form.nombre, form.cargo);
    setForm(EMPTY);
  };

  const incompleto = !form.direccion || !form.nombre || !form.cargo;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
        🤝 Registrar conciliador autorizado
      </h3>
      <div className="space-y-2">
        <input
          type="text"
          placeholder="0x... dirección Ethereum del conciliador"
          value={form.direccion}
          onChange={set("direccion")}
          className="w-full font-mono text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Nombre completo"
            value={form.nombre}
            onChange={set("nombre")}
            className="flex-1 text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Cargo"
            value={form.cargo}
            onChange={set("cargo")}
            className="flex-1 text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <button
          onClick={handleRegistrar}
          disabled={loading || incompleto}
          className="w-full px-5 py-2 bg-blue-900 text-white rounded-lg text-sm font-semibold hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "..." : "Registrar"}
        </button>
      </div>
      {msg && (
        <p className={`mt-2 text-sm font-medium ${msg.tipo === "ok" ? "text-green-600" : "text-red-500"}`}>
          {msg.tipo === "ok" ? "✅" : "❌"} {msg.texto}
        </p>
      )}
    </div>
  );
}
