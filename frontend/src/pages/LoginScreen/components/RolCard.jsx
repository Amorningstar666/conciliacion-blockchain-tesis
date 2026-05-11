function shortAddr(addr) {
  if (!addr || addr.length < 12) return addr;
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export function RolCard({ rol, onSelect, connecting }) {
  return (
    <button
      onClick={onSelect}
      disabled={connecting}
      className={`bg-white rounded-2xl p-6 text-left border-2 ${rol.border} ${rol.hover}
        transition-all duration-200 shadow-xl hover:shadow-2xl hover:-translate-y-1
        disabled:opacity-60 disabled:cursor-wait disabled:transform-none focus:outline-none`}
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-4xl">{rol.icon}</span>
          <span className={`text-xs px-2.5 py-1 rounded-full font-mono font-semibold ${rol.badge}`}>
            {shortAddr(rol.address)}
          </span>
        </div>
        <div>
          <h3 className="font-bold text-gray-800 text-base mb-1">{rol.title}</h3>
          <p className="text-sm text-gray-500 leading-snug">{rol.desc}</p>
        </div>
      </div>
    </button>
  );
}
