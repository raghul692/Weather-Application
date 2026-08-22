import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatTemp } from '../../utils/formatters';
import { Clock, Droplets, Wind, Thermometer, Info } from 'lucide-react';
import GlassCard from '../Common/GlassCard';

export default function ExtendedHourlyChart() {
  const { activeCity, tempUnit, speedUnit } = useApp();
  const [hoverIndex, setHoverIndex] = useState(0);

  if (!activeCity || !activeCity.hourly) return null;

  const hourly = activeCity.hourly;

  // Compute SVG Points
  const minTemp = Math.min(...hourly.map(h => h.tempC)) - 2;
  const maxTemp = Math.max(...hourly.map(h => h.tempC)) + 2;
  const tempRange = Math.max(maxTemp - minTemp, 1);

  const svgWidth = 800;
  const svgHeight = 220;
  const paddingX = 40;
  const paddingY = 40;

  const points = hourly.map((h, i) => {
    const x = paddingX + (i / (hourly.length - 1)) * (svgWidth - paddingX * 2);
    const y = svgHeight - paddingY - ((h.tempC - minTemp) / tempRange) * (svgHeight - paddingY * 2);
    return { x, y, data: h };
  });

  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${svgHeight - 10} L ${points[0].x} ${svgHeight - 10} Z`;

  const selectedSlot = hourly[hoverIndex] || hourly[0];

  return (
    <div className="space-y-6">
      {/* Header telemetry card */}
      <GlassCard glow className="w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 uppercase tracking-wider">
              <Clock className="w-4 h-4" /> 24-Hour Telemetry Curve
            </div>
            <h2 className="text-2xl font-bold text-white mt-1">
              Hourly Weather Forecast for {activeCity.name}
            </h2>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700 flex items-center gap-4 text-xs font-mono-telemetry">
            <div>
              <span className="text-slate-400">Selected Time:</span>{' '}
              <span className="text-white font-bold">{selectedSlot.time}</span>
            </div>
            <div>
              <span className="text-slate-400">Temp:</span>{' '}
              <span className="text-sky-400 font-bold">{formatTemp(selectedSlot.tempC, tempUnit)}</span>
            </div>
            <div>
              <span className="text-slate-400">Rain:</span>{' '}
              <span className="text-blue-400 font-bold">{selectedSlot.pop}%</span>
            </div>
          </div>
        </div>

        {/* SVG Interactive Temperature Chart */}
        <div className="mt-6 relative w-full overflow-x-auto">
          <svg className="w-full min-w-[700px] h-[240px]" viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
            <defs>
              <linearGradient id="tempArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {[0.2, 0.5, 0.8].map((ratio, idx) => (
              <line
                key={idx}
                x1={paddingX}
                y1={svgHeight * ratio}
                x2={svgWidth - paddingX}
                y2={svgHeight * ratio}
                stroke="rgba(255,255,255,0.06)"
                strokeDasharray="4 4"
              />
            ))}

            {/* Gradient Area Fill */}
            <path d={areaD} fill="url(#tempArea)" />

            {/* Temperature Line */}
            <path d={pathD} fill="none" stroke="#38BDF8" strokeWidth="3.5" strokeLinecap="round" />

            {/* Points & Interactive Hover Circles */}
            {points.map((p, i) => (
              <g key={i} className="cursor-pointer" onMouseEnter={() => setHoverIndex(i)}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={hoverIndex === i ? 7 : 4}
                  fill={hoverIndex === i ? '#FFFFFF' : '#38BDF8'}
                  stroke="#05070A"
                  strokeWidth="2"
                />
                <text
                  x={p.x}
                  y={p.y - 12}
                  textAnchor="middle"
                  fill="#F8FAFC"
                  fontSize="11"
                  fontWeight="bold"
                  fontFamily="JetBrains Mono"
                >
                  {formatTemp(p.data.tempC, tempUnit)}
                </text>
                <text
                  x={p.x}
                  y={svgHeight - 15}
                  textAnchor="middle"
                  fill="#94A3B8"
                  fontSize="10"
                  fontFamily="JetBrains Mono"
                >
                  {p.data.time}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </GlassCard>

      {/* Hourly Detail Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {hourly.map((h, i) => (
          <GlassCard
            key={i}
            onClick={() => setHoverIndex(i)}
            className={`cursor-pointer transition-all ${
              hoverIndex === i ? 'border-sky-400 bg-sky-500/15 glow-cyan' : 'border-white/5'
            }`}
          >
            <div className="text-center space-y-2">
              <span className="text-xs font-mono-telemetry text-slate-400">{h.time}</span>
              <div className="text-base font-bold text-white font-mono-telemetry">
                {formatTemp(h.tempC, tempUnit)}
              </div>
              <div className="text-[11px] text-slate-300 font-medium truncate">{h.condition}</div>
              <div className="flex items-center justify-center gap-1 text-[10px] text-sky-400 font-mono-telemetry font-bold">
                <Droplets className="w-3 h-3" /> {h.pop}%
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
