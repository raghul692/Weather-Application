import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatTemp } from '../../utils/formatters';
import { Sun, CloudSun, Cloud, CloudRain, Snowflake, Zap, CloudFog, Droplets } from 'lucide-react';
import GlassCard from '../Common/GlassCard';

export default function TenDayForecast() {
  const { activeCity, tempUnit } = useApp();

  if (!activeCity || !activeCity.tenDay) return null;

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Sun': return <Sun className="w-5 h-5 text-amber-400" />;
      case 'CloudSun': return <CloudSun className="w-5 h-5 text-sky-300" />;
      case 'CloudRain': return <CloudRain className="w-5 h-5 text-sky-400" />;
      case 'Snowflake': return <Snowflake className="w-5 h-5 text-blue-200" />;
      case 'Zap': return <Zap className="w-5 h-5 text-purple-400" />;
      case 'CloudFog': return <CloudFog className="w-5 h-5 text-slate-400" />;
      default: return <Cloud className="w-5 h-5 text-slate-300" />;
    }
  };

  // Find overall min and max for range bars
  const minAll = Math.min(...activeCity.tenDay.map(d => d.lowC));
  const maxAll = Math.max(...activeCity.tenDay.map(d => d.highC));
  const rangeSpan = Math.max(maxAll - minAll, 1);

  return (
    <GlassCard className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-white tracking-wide uppercase">
          10-Day Extended Forecast
        </h3>
        <span className="text-xs text-slate-400 font-mono-telemetry">Min/Max Range</span>
      </div>

      <div className="space-y-3">
        {activeCity.tenDay.map((d, idx) => {
          const leftPercent = ((d.lowC - minAll) / rangeSpan) * 100;
          const widthPercent = Math.max(((d.highC - d.lowC) / rangeSpan) * 100, 8);

          return (
            <div
              key={idx}
              className="p-3 rounded-2xl glass-card-interactive flex items-center justify-between text-xs border border-white/5 gap-3"
            >
              {/* Day & Date */}
              <div className="w-24 font-bold text-slate-200 flex flex-col">
                <span className="text-sm text-white">{d.day}</span>
                <span className="text-[10px] text-slate-400 font-mono-telemetry">{d.date}</span>
              </div>

              {/* Weather Icon & Condition */}
              <div className="flex items-center gap-2.5 w-36">
                {getIcon(d.icon)}
                <span className="text-slate-300 truncate">{d.condition}</span>
              </div>

              {/* Rain Pop */}
              <div className="w-12 text-right">
                {d.pop > 0 ? (
                  <span className="text-[10px] text-sky-400 font-bold font-mono-telemetry flex items-center justify-end gap-0.5">
                    <Droplets className="w-3 h-3" /> {d.pop}%
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-500 font-mono-telemetry">0%</span>
                )}
              </div>

              {/* Low Temp */}
              <div className="w-10 text-right font-mono-telemetry text-slate-400">
                {formatTemp(d.lowC, tempUnit)}
              </div>

              {/* Range Bar */}
              <div className="flex-1 h-2 bg-slate-800 rounded-full relative overflow-hidden hidden sm:block mx-2">
                <div
                  className="absolute h-full rounded-full bg-gradient-to-r from-sky-400 via-indigo-400 to-amber-400"
                  style={{
                    left: `${leftPercent}%`,
                    width: `${widthPercent}%`
                  }}
                />
              </div>

              {/* High Temp */}
              <div className="w-10 text-left font-mono-telemetry font-bold text-white">
                {formatTemp(d.highC, tempUnit)}
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
