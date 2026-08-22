import React from 'react';
import { getAQIMeta } from '../../utils/formatters';

export default function AQIGauge({ aqi = 28 }) {
  const meta = getAQIMeta(aqi);
  const percentage = Math.min(Math.max((aqi / 250) * 100, 5), 100);

  return (
    <div className="flex flex-col h-full justify-between">
      <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
        <span>AIR QUALITY INDEX</span>
        <span className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold ${meta.badgeBg}`}>
          {meta.status}
        </span>
      </div>

      <div className="my-3 relative flex flex-col items-center justify-center">
        {/* Semi circular track */}
        <div className="w-full bg-slate-800/80 h-3 rounded-full overflow-hidden p-0.5 relative">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${percentage}%`,
              backgroundColor: meta.color,
              boxShadow: `0 0 12px ${meta.color}`
            }}
          />
        </div>

        <div className="flex w-full justify-between text-[10px] text-slate-500 mt-1 font-mono-telemetry">
          <span>0 (Good)</span>
          <span>100 (Mod)</span>
          <span>200+ (Hazard)</span>
        </div>

        <div className="text-3xl font-extrabold text-white mt-2 font-mono-telemetry tracking-tight">
          {aqi} <span className="text-xs font-normal text-slate-400 font-sans">AQI</span>
        </div>
      </div>

      <p className="text-xs text-slate-400 leading-snug line-clamp-2">
        {meta.desc}
      </p>
    </div>
  );
}
