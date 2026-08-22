import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatTemp } from '../../utils/formatters';
import { Calendar, Sun, CloudSun, Cloud, CloudRain, Snowflake, Zap, CloudFog, Droplets, Wind, Eye } from 'lucide-react';
import GlassCard from '../Common/GlassCard';

export default function TenDayDetailView() {
  const { activeCity, tempUnit, speedUnit } = useApp();
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  if (!activeCity || !activeCity.tenDay) return null;

  const tenDay = activeCity.tenDay;
  const selectedDay = tenDay[selectedDayIndex] || tenDay[0];

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Sun': return <Sun className="w-8 h-8 text-amber-400" />;
      case 'CloudSun': return <CloudSun className="w-8 h-8 text-sky-300" />;
      case 'CloudRain': return <CloudRain className="w-8 h-8 text-sky-400" />;
      case 'Snowflake': return <Snowflake className="w-8 h-8 text-blue-200" />;
      case 'Zap': return <Zap className="w-8 h-8 text-purple-400" />;
      case 'CloudFog': return <CloudFog className="w-8 h-8 text-slate-400" />;
      default: return <Cloud className="w-8 h-8 text-slate-300" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Selected Day Spotlight Card */}
      <GlassCard glow className="w-full">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-3xl bg-slate-900/80 border border-slate-700">
              {getIcon(selectedDay.icon)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-bold font-mono-telemetry">
                  {selectedDay.date}
                </span>
                <span className="text-xs text-slate-400 uppercase font-semibold">10-Day Deep Analysis</span>
              </div>
              <h2 className="text-3xl font-extrabold text-white mt-1">
                {selectedDay.day} Outlook
              </h2>
              <p className="text-sm text-sky-300 font-medium">
                {selectedDay.condition}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full md:w-auto">
            <div className="p-3 rounded-2xl bg-slate-900/60 border border-white/5 text-center">
              <div className="text-[11px] text-slate-400">High Temp</div>
              <div className="text-xl font-bold text-white font-mono-telemetry mt-0.5">
                {formatTemp(selectedDay.highC, tempUnit)}
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/60 border border-white/5 text-center">
              <div className="text-[11px] text-slate-400">Low Temp</div>
              <div className="text-xl font-bold text-slate-300 font-mono-telemetry mt-0.5">
                {formatTemp(selectedDay.lowC, tempUnit)}
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/60 border border-white/5 text-center">
              <div className="text-[11px] text-slate-400">Precipitation</div>
              <div className="text-xl font-bold text-sky-400 font-mono-telemetry mt-0.5 flex items-center justify-center gap-1">
                <Droplets className="w-4 h-4" /> {selectedDay.pop}%
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/60 border border-white/5 text-center">
              <div className="text-[11px] text-slate-400">Wind Speed</div>
              <div className="text-xl font-bold text-indigo-300 font-mono-telemetry mt-0.5 flex items-center justify-center gap-1">
                <Wind className="w-4 h-4" /> {selectedDay.windKmH || 18} km/h
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* 10-Day List Grid */}
      <div className="space-y-3">
        {tenDay.map((d, i) => (
          <GlassCard
            key={i}
            onClick={() => setSelectedDayIndex(i)}
            className={`cursor-pointer transition-all ${
              selectedDayIndex === i ? 'border-sky-400 bg-sky-500/15 glow-cyan' : 'border-white/5'
            }`}
          >
            <div className="flex items-center justify-between text-sm gap-4">
              <div className="w-28 font-bold text-white flex flex-col">
                <span>{d.day}</span>
                <span className="text-[11px] text-slate-400 font-mono-telemetry">{d.date}</span>
              </div>

              <div className="flex items-center gap-3 flex-1">
                {getIcon(d.icon)}
                <span className="text-slate-300 font-medium truncate">{d.condition}</span>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-1 text-xs text-sky-400 font-mono-telemetry font-bold">
                  <Droplets className="w-3.5 h-3.5" />
                  <span>{d.pop}%</span>
                </div>
                <div className="text-right font-mono-telemetry">
                  <span className="text-white font-bold">{formatTemp(d.highC, tempUnit)}</span>
                  <span className="text-slate-500 mx-1">/</span>
                  <span className="text-slate-400">{formatTemp(d.lowC, tempUnit)}</span>
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
