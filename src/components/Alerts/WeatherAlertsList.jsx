import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, AlertTriangle, Info, Bell, MapPin, ChevronRight } from 'lucide-react';
import GlassCard from '../Common/GlassCard';

export default function WeatherAlertsList() {
  const { savedLocations, openAlertModal } = useApp();

  // Gather all active alerts
  const alertsList = savedLocations
    .filter(loc => loc.alert)
    .map(loc => ({ ...loc.alert, locationName: loc.name, country: loc.country }));

  return (
    <div className="space-y-6">
      <GlassCard glow className="w-full">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-red-400 uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4" /> Meteorological Telemetry Center
            </div>
            <h2 className="text-2xl font-bold text-white mt-1">
              Active Severe Weather Bulletins
            </h2>
          </div>
          <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold border border-red-500/30">
            {alertsList.length} Active Bulletins
          </span>
        </div>
      </GlassCard>

      {alertsList.length === 0 ? (
        <GlassCard className="text-center py-12">
          <Bell className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No Severe Weather Alerts Active</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            All atmospheric telemetry systems report normal operational thresholds across monitored locations.
          </p>
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {alertsList.map((alert, idx) => (
            <GlassCard
              key={idx}
              onClick={() => openAlertModal(alert)}
              className="cursor-pointer border-red-500/30 hover:border-red-400 bg-red-950/10 hover:bg-red-950/20 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-2xl bg-red-500/20 text-red-400 border border-red-500/30 shrink-0">
                    <AlertTriangle className="w-5 h-5 animate-pulse" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 text-[10px] font-bold uppercase tracking-wider">
                        {alert.severity} SEVERITY
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {alert.locationName}, {alert.country}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white mt-1">
                      {alert.title}
                    </h3>
                    <p className="text-xs text-slate-300 line-clamp-2 mt-1">
                      {alert.description}
                    </p>
                  </div>
                </div>

                <ChevronRight className="w-5 h-5 text-slate-500 shrink-0 self-center" />
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
