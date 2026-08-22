import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatTemp } from '../../utils/formatters';
import { Sun, CloudSun, Cloud, CloudRain, Snowflake, Zap, CloudFog, Moon, CloudMoon, Droplets } from 'lucide-react';
import GlassCard from '../Common/GlassCard';

export default function HourlyCarousel() {
  const { activeCity, tempUnit } = useApp();

  if (!activeCity || !activeCity.hourly) return null;

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Sun': return <Sun className="w-6 h-6 text-amber-400" />;
      case 'CloudSun': return <CloudSun className="w-6 h-6 text-sky-300" />;
      case 'CloudRain': return <CloudRain className="w-6 h-6 text-sky-400" />;
      case 'Snowflake': return <Snowflake className="w-6 h-6 text-blue-200" />;
      case 'Zap': return <Zap className="w-6 h-6 text-purple-400" />;
      case 'CloudFog': return <CloudFog className="w-6 h-6 text-slate-400" />;
      case 'Moon': return <Moon className="w-6 h-6 text-indigo-300" />;
      case 'CloudMoon': return <CloudMoon className="w-6 h-6 text-slate-300" />;
      default: return <Cloud className="w-6 h-6 text-slate-300" />;
    }
  };

  return (
    <GlassCard className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-white tracking-wide uppercase flex items-center gap-2">
          <span>24-Hour Hourly Forecast</span>
        </h3>
        <span className="text-xs text-slate-400 font-mono-telemetry">Scroll →</span>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
        {activeCity.hourly.map((h, idx) => (
          <div
            key={idx}
            className={`min-w-[100px] p-3.5 rounded-2xl glass-card-interactive flex flex-col items-center justify-between space-y-3 transition-all border ${
              idx === 0 ? 'border-sky-400 bg-sky-500/10' : 'border-white/5'
            }`}
          >
            <span className="text-xs font-mono-telemetry text-slate-400">{h.time}</span>
            <div className="my-1">{getIcon(h.icon)}</div>
            <div className="text-lg font-bold text-white font-mono-telemetry">
              {formatTemp(h.tempC, tempUnit)}
            </div>
            {h.pop > 0 && (
              <div className="flex items-center gap-1 text-[10px] text-sky-400 font-bold font-mono-telemetry">
                <Droplets className="w-3 h-3" />
                <span>{h.pop}%</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
