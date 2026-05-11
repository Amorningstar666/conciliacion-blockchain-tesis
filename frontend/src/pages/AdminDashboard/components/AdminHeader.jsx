export function AdminHeader({ address, onLogout }) {
  return (
    <header className="bg-blue-900 text-white px-6 py-4 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
          <span className="text-blue-900 font-black text-sm">PGN</span>
        </div>
        <div>
          <p className="font-bold text-sm">Admin PGN — Conciliación Laboral</p>
          <p className="font-mono text-xs text-blue-300">{address}</p>
        </div>
      </div>
      <button
        onClick={onLogout}
        className="text-xs text-blue-300 hover:text-white border border-blue-700 hover:border-blue-400 px-3 py-1.5 rounded-lg transition-colors"
      >
        Cerrar sesión
      </button>
    </header>
  );
}
