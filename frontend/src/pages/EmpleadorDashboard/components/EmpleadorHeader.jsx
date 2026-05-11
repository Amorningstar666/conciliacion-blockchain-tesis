export function EmpleadorHeader({ address, onLogout }) {
  return (
    <header className="bg-amber-800 text-white shadow-lg">
      <div className="max-w-screen-xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center flex-shrink-0">
            <span className="text-amber-800 font-black text-xs">PGN</span>
          </div>
          <div>
            <p className="text-xs text-amber-300 uppercase tracking-wide">Panel del Empleador 🏢</p>
            <h1 className="font-bold text-lg leading-tight">Mis Conciliaciones Laborales</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs text-amber-300">Wallet activa</p>
            <p className="font-mono text-xs text-green-300">{address.slice(0, 10)}…{address.slice(-6)}</p>
          </div>
          <button
            onClick={onLogout}
            className="text-xs bg-amber-700 hover:bg-amber-600 px-3 py-1.5 rounded transition-colors border border-amber-600"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </header>
  );
}
