import React from 'react';
import { getWindDirectionLabel, formatSpeed } from '../../utils/formatters';

export default function WindDial({ speedKmH = 14, direction = 135, unit = 'kmh' }) {
  const cardinal = getWindDirectionLabel(direction);

  return (
    <div className="flex flex-col h-full justify-between">
      <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
        <span>WIND VECTOR</span>
        <span className="text-sky-400 font-mono-telemetry font-semibold text-xs">
          {cardinal} ({direction}°)
        </span>
      </div>

      <div className="my-2 flex items-center justify-center gap-4">
        {/* Compass Dial */}
        <div className="relative w-16 h-16 rounded-full border border-slate-700 bg-slate-900/60 flex items-center justify-center">
          <span className="absolute top-0.5 text-[9px] font-bold text-slate-400">N</span>
          <span className="absolute right-1 text-[9px] font-bold text-slate-500">E</span>
          <span className="absolute bottom-0.5 text-[9px] font-bold text-slate-500">S</span>
          <span className="absolute left-1 text-[9px] font-bold text-slate-500">W</span>

          {/* Rotating Arrow */}
          <div
            className="w-full h-full absolute flex items-center justify-center transition-transform duration-700"
            style={{ transform: `rotate(${direction}deg)` }}
          >
            <div className="w-1.5 h-7 bg-gradient-to-t from-sky-500 to-sky-300 rounded-full glow-cyan" />
          </div>
        </div>

        <div className="flex flex-col">
          <div className="text-2xl font-bold text-white font-mono-telemetry">
            {formatSpeed(speedKmH, unit)}
          </div>
          <span className="text-[11px] text-slate-400">
            {speedKmH > 25 ? 'Breezy & Gusty' : 'Gentle Breeze'}
          </span>
        </div>
      </div>

      <div className="text-[11px] text-slate-400">
        Wind telemetry updated from surface stations.
      </div>
    </div>
  );
}
