import React from "react";
import { ChevronIcon } from "../icons";

export default function SeccionColapsable({ titulo, open, onToggle, children, icono }) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-blue-900">{icono}</span>
          <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">{titulo}</span>
        </div>
        <ChevronIcon open={open} />
      </button>
      {open && (
        <div className="px-5 py-4 bg-white">
          {children}
        </div>
      )}
    </div>
  );
}
