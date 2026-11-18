import React from "react";
import { IS_DEMO_MODE, DEMO_AVISO } from "../../constants/network";

export default function DemoBanner() {
  if (!IS_DEMO_MODE) return null;
  return (
    <div className="bg-amber-100 text-amber-900 text-xs text-center px-4 py-2 border-b border-amber-300">
      {DEMO_AVISO}
    </div>
  );
}
