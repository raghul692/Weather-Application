import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatTemp } from '../../utils/formatters';
import { SlidersHorizontal, Check, Plus, ArrowRightLeft } from 'lucide-react';
import GlassCard from '../Common/GlassCard';

export default function CompareCitiesMatrix() {
  const { savedLocations, tempUnit } = useApp();
  const [selectedIds, setSelectedIds] = useState([savedLocations[0]?.id, savedLocations[1]?.id]);

  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 1) {
        setSelectedIds(selectedIds.filter(item => item !== id));
      }
    } else {
      if (selectedIds.length < 3) {
        setSelectedIds([...selectedIds, id]);
      } else {
        setSelectedIds([selectedIds[1], selectedIds[2], id]);
      }
    }
  };

  const comparedCities = savedLocations.filter(loc => selectedIds.includes(loc.id));

  return (
    <div className="space-y-6">
      <GlassCard glow className="w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 uppercase tracking-wider">
              <ArrowRightLeft className="w-4 h-4" /> Multi-City Telemetry Matrix
            </div>
            <h2 className="text-2xl font-bold text-white mt-1">
              Side-by-Side City Comparison
            </h2>
          </div>

          {/* Quick toggle chips */}
          <div className="flex items-center gap-2 flex-wrap">
            {savedLocations.map((loc) => {
              const isSel = selectedIds.includes(loc.id);
              return (
                <button
                  key={loc.id}
                  onClick={() => toggleSelect(loc.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isSel ? 'bg-sky-500 text-white shadow' : 'bg-slate-900/80 border border-slate-700 text-slate-400'
                  }`}
                >
                  {isSel && <Check className="w-3.5 h-3.5" />}
                  <span>{loc.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </GlassCard>

      {/* Matrix Table */}
      <GlassCard className="w-full p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-slate-900/60">
                <th className="p-4 font-bold text-slate-400 uppercase tracking-wider">Telemetry Metric</th>
                {comparedCities.map(c => (
                  <th key={c.id} className="p-4 font-extrabold text-white text-base">
                    <div>{c.name}</div>
                    <div className="text-[11px] font-normal text-slate-400 font-mono-telemetry">{c.country}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr>
                <td className="p-4 font-semibold text-slate-300">Temperature</td>
                {comparedCities.map(c => (
                  <td key={c.id} className="p-4 font-mono-telemetry text-base font-bold text-sky-400">
                    {formatTemp(c.tempC, tempUnit)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-300">Condition</td>
                {comparedCities.map(c => (
                  <td key={c.id} className="p-4 text-white font-medium">
                    {c.condition}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-300">Air Quality Index (AQI)</td>
                {comparedCities.map(c => (
                  <td key={c.id} className="p-4 font-mono-telemetry font-bold text-emerald-400">
                    {c.aqi}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-300">Humidity</td>
                {comparedCities.map(c => (
                  <td key={c.id} className="p-4 font-mono-telemetry text-white">
                    {c.humidity}%
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-300">Wind Velocity</td>
                {comparedCities.map(c => (
                  <td key={c.id} className="p-4 font-mono-telemetry text-indigo-300">
                    {c.windKmH} km/h {c.windDirection}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-300">Surface Pressure</td>
                {comparedCities.map(c => (
                  <td key={c.id} className="p-4 font-mono-telemetry text-slate-300">
                    {c.pressureHpa} hPa
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-300">UV Index</td>
                {comparedCities.map(c => (
                  <td key={c.id} className="p-4 font-mono-telemetry font-bold text-amber-400">
                    {c.uvIndex}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
