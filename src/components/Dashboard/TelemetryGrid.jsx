import React from 'react';
import { useApp } from '../../context/AppContext';
import { getUVMeta, formatPressure, formatTemp } from '../../utils/formatters';
import { Sun, Droplets, Gauge, Eye, CloudRain, Thermometer } from 'lucide-react';
import GlassCard from '../Common/GlassCard';
import AQIGauge from '../Common/AQIGauge';
import WindDial from '../Common/WindDial';
import SolarArc from '../Common/SolarArc';

export default function TelemetryGrid() {
  const { activeCity, tempUnit, speedUnit, pressureUnit } = useApp();

  if (!activeCity) return null;

  const uvMeta = getUVMeta(activeCity.uvIndex);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {/* 1. AQI Gauge */}
      <GlassCard className="h-52">
        <AQIGauge aqi={activeCity.aqi} />
      </GlassCard>

      {/* 2. Wind Vector Dial */}
      <GlassCard className="h-52">
        <WindDial speedKmH={activeCity.windKmH} direction={activeCity.windDirection} unit={speedUnit} />
      </GlassCard>

      {/* 3. Solar Arc */}
      <GlassCard className="h-52">
        <SolarArc sunrise={activeCity.sunrise} sunset={activeCity.sunset} progress={activeCity.solarProgress || 60} />
      </GlassCard>

      {/* 4. UV Index Scale */}
      <GlassCard className="h-52 flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
          <span>UV INDEX</span>
          <span className="text-amber-400 font-bold flex items-center gap-1 text-xs">
            <Sun className="w-3.5 h-3.5" /> {uvMeta.status}
          </span>
        </div>

        <div className="my-2">
          <div className="text-4xl font-extrabold text-white font-mono-telemetry">
            {activeCity.uvIndex} <span className="text-sm font-normal text-slate-400 font-sans">/ 12</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(activeCity.uvIndex / 12) * 100}%`,
                backgroundColor: uvMeta.color
              }}
            />
          </div>
        </div>

        <p className="text-xs text-slate-400 leading-snug">
          {uvMeta.desc}
        </p>
      </GlassCard>

      {/* 5. Humidity & Dew Point */}
      <GlassCard className="h-44 flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
          <span>HUMIDITY & DEW POINT</span>
          <Droplets className="w-4 h-4 text-sky-400" />
        </div>

        <div>
          <div className="text-3xl font-extrabold text-white font-mono-telemetry">
            {activeCity.humidity}%
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Dew Point is <span className="text-sky-300 font-mono-telemetry font-bold">{formatTemp(activeCity.dewPointC, tempUnit)}</span>
          </div>
        </div>

        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div className="h-full bg-sky-400 rounded-full" style={{ width: `${activeCity.humidity}%` }} />
        </div>
      </GlassCard>

      {/* 6. Atmospheric Pressure */}
      <GlassCard className="h-44 flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
          <span>SURFACE PRESSURE</span>
          <Gauge className="w-4 h-4 text-indigo-400" />
        </div>

        <div>
          <div className="text-3xl font-extrabold text-white font-mono-telemetry">
            {formatPressure(activeCity.pressureHpa, pressureUnit)}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            {activeCity.pressureHpa > 1013 ? 'High Pressure System' : 'Low Pressure Trough'}
          </div>
        </div>

        <div className="text-[11px] text-slate-500">
          Steady barometric reading.
        </div>
      </GlassCard>

      {/* 7. Visibility */}
      <GlassCard className="h-44 flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
          <span>VISIBILITY</span>
          <Eye className="w-4 h-4 text-emerald-400" />
        </div>

        <div>
          <div className="text-3xl font-extrabold text-white font-mono-telemetry">
            {activeCity.visibilityKm} <span className="text-sm font-normal text-slate-400 font-sans">km</span>
          </div>
          <div className="text-xs text-slate-400 mt-1">
            {activeCity.visibilityKm >= 10 ? 'Optimal horizon clarity' : 'Reduced atmospheric visibility'}
          </div>
        </div>

        <div className="text-[11px] text-slate-500">
          No fog obstruction reported.
        </div>
      </GlassCard>

      {/* 8. Rain Risk */}
      <GlassCard className="h-44 flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
          <span>PRECIPITATION RISK</span>
          <CloudRain className="w-4 h-4 text-blue-400" />
        </div>

        <div>
          <div className="text-3xl font-extrabold text-white font-mono-telemetry">
            {activeCity.hourly?.[0]?.pop || 10}%
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Next 24 hour peak probability
          </div>
        </div>

        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${activeCity.hourly?.[0]?.pop || 10}%` }} />
        </div>
      </GlassCard>
    </div>
  );
}
