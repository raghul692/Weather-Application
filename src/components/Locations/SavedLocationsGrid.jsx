import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatTemp } from '../../utils/formatters';
import { MapPin, Trash2, Heart, Plus, Compass } from 'lucide-react';
import GlassCard from '../Common/GlassCard';
import LocationSearch from './LocationSearch';

export default function SavedLocationsGrid() {
  const { savedLocations, activeCity, setActiveCity, removeSavedLocation, toggleFavorite } = useApp();

  return (
    <div className="space-y-6">
      {/* Header with quick search */}
      <GlassCard glow className="w-full">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 uppercase tracking-wider">
              <Compass className="w-4 h-4" /> Global Telemetry Stations
            </div>
            <h2 className="text-2xl font-bold text-white mt-1">
              Saved Weather Locations
            </h2>
          </div>

          <LocationSearch />
        </div>
      </GlassCard>

      {/* Grid of locations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {savedLocations.map((loc) => {
          const isActive = activeCity?.id === loc.id;
          return (
            <GlassCard
              key={loc.id}
              onClick={() => setActiveCity(loc)}
              className={`cursor-pointer transition-all ${
                isActive ? 'border-sky-400 bg-sky-500/15 glow-cyan' : 'border-white/10'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-sky-400" />
                    <span className="text-xs text-slate-400">{loc.country}</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-white mt-1">{loc.name}</h3>
                  <div className="text-xs text-sky-300 mt-0.5">{loc.condition}</div>
                </div>

                <div className="text-right">
                  <div className="text-3xl font-extrabold text-white font-mono-telemetry">
                    {formatTemp(loc.tempC, 'C')}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono-telemetry mt-0.5">
                    H: {loc.highC}° / L: {loc.lowC}°
                  </div>
                </div>
              </div>

              {/* Bottom bar */}
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono-telemetry">AQI: {loc.aqi}</span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(loc.id);
                    }}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-rose-400 transition-all"
                  >
                    <Heart className={`w-4 h-4 ${loc.isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-500'}`} />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSavedLocation(loc.id);
                    }}
                    className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-all"
                    title="Remove Location"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
