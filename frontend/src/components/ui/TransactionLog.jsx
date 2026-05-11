import React from "react";

const TYPE_COLORS = {
  err: "text-red-400",
  tx: "text-blue-300",
  warn: "text-yellow-400",
  ok: "text-green-400",
};

export default function TransactionLog({ txLog }) {
  if (!txLog || txLog.length === 0) return null;
  return (
    <div className="bg-gray-900 rounded-xl p-4">
      <p className="text-xs font-semibold text-gray-400 uppercase mb-2 tracking-wide">Log de Transacciones</p>
      <div className="space-y-1">
        {txLog.map((e, i) => (
          <p key={i} className={`text-xs font-mono ${TYPE_COLORS[e.type] || TYPE_COLORS.ok}`}>
            [{e.t}] {e.msg}
          </p>
        ))}
      </div>
    </div>
  );
}
