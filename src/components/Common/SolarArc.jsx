import React from 'react';
import { Sun, Sunset } from 'lucide-react';

export default function SolarArc({ sunrise = '06:00 AM', sunset = '06:30 PM', progress = 65 }) {
  return (
    <div className="flex flex-col h-full justify-between">
      <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
        <span>SOLAR ARC TELEMETRY</span>
        <span className="text-amber-400 flex items-center gap-1 text-[11px]">
          <Sun className="w-3.5 h-3.5" /> Sun Cycle
        </span>
      </div>

      <div className="my-2 relative flex flex-col items-center">
        <svg className="w-full h-16" viewBox="0 0 200 80">
          {/* Arc Background */}
          <path
            d="M 10 70 A 90 90 0 0 1 190 70"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="4"
            strokeDasharray="4 4"
          />
          {/* Active Solar Arc */}
          <path
            d="M 10 70 A 90 90 0 0 1 190 70"
            fill="none"
            stroke="url(#sunGradient)"
            strokeWidth="4"
            strokeDasharray="300"
            strokeDashoffset={300 - (300 * progress) / 100}
          />
          <defs>
            <linearGradient id="sunGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="50%" stopColor="#F97316" />
              <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>
          </defs>
        </svg>

        <div className="flex justify-between w-full text-xs text-slate-300 font-mono-telemetry mt-1">
          <div className="flex items-center gap-1">
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            <span>{sunrise}</span>
          </div>
          <div className="flex items-center gap-1">
            <Sunset className="w-3.5 h-3.5 text-orange-400" />
            <span>{sunset}</span>
          </div>
        </div>
      </div>

      <div className="text-[11px] text-slate-400 text-center">
        Solar position approx. <span className="text-amber-400 font-semibold">{progress}%</span> complete of daylight hours.
      </div>
    </div>
  );
}
