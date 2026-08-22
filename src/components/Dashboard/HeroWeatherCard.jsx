import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatTemp } from '../../utils/formatters';
import { Sun, CloudSun, Cloud, CloudRain, Snowflake, Zap, CloudFog, Wind, Sparkles, MapPin, AlertTriangle, Heart } from 'lucide-react';
import GlassCard from '../Common/GlassCard';

export default function HeroWeatherCard() {
  const { activeCity, tempUnit, toggleFavorite, setShowBriefingModal, openAlertModal } = useApp();

  if (!activeCity) return null;

  const renderWeatherIcon = (code) => {
    switch (code) {
      case 'sunny':
        return <Sun className="w-20 h-20 text-amber-400 animate-spin-slow glow-amber" />;
      case 'partly_cloudy':
        return <CloudSun className="w-20 h-20 text-sky-300 animate-float" />;
      case 'rain':
        return <CloudRain className="w-20 h-20 text-sky-400 animate-bounce-slow" />;
      case 'snow':
        return <Snowflake className="w-20 h-20 text-blue-200 animate-pulse" />;
      case 'thunderstorm':
        return <Zap className="w-20 h-20 text-purple-400 animate-pulse glow-violet" />;
      case 'fog':
        return <CloudFog className="w-20 h-20 text-slate-300 animate-pulse" />;
      default:
        return <Cloud className="w-20 h-20 text-slate-300 animate-float" />;
    }
  };

  return (
    <GlassCard glow className="w-full">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Left Telemetry Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> {activeCity.region}, {activeCity.country}
            </span>
            <button
              onClick={() => toggleFavorite(activeCity.id)}
              className="p-1.5 rounded-full glass-card hover:bg-white/10 text-rose-400 transition-all"
              title="Toggle Favorite"
            >
              <Heart className={`w-4 h-4 ${activeCity.isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
            </button>
          </div>

          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              {activeCity.name}
            </h2>
            <p className="text-sm text-slate-400 mt-1 font-mono-telemetry">
              Local Time: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {activeCity.timezone}
            </p>
          </div>

          <div className="flex items-baseline gap-4">
            <div className="text-6xl sm:text-7xl font-extrabold text-white tracking-tighter font-mono-telemetry">
              {formatTemp(activeCity.tempC, tempUnit)}
            </div>
            <div className="space-y-1">
              <div className="text-base font-semibold text-sky-300">
                {activeCity.condition}
              </div>
              <div className="text-xs text-slate-400 font-mono-telemetry">
                Feels like {formatTemp(activeCity.feelsLikeC, tempUnit)} • High {formatTemp(activeCity.highC, tempUnit)} / Low {formatTemp(activeCity.lowC, tempUnit)}
              </div>
            </div>
          </div>
        </div>

        {/* Right Animated Weather Visual & AI Quick Banner */}
        <div className="flex flex-col items-end justify-between w-full lg:w-auto space-y-4">
          <div className="p-4 rounded-3xl bg-slate-900/60 border border-white/5 flex items-center justify-center">
            {renderWeatherIcon(activeCity.conditionCode)}
          </div>

          {/* Active Severe Alert Badge if present */}
          {activeCity.alert && (
            <button
              onClick={() => openAlertModal(activeCity.alert)}
              className="w-full lg:w-auto px-4 py-2 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-bold flex items-center gap-2 animate-pulse hover:bg-red-500/30 transition-all"
            >
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span>ACTIVE WARNING: {activeCity.alert.title}</span>
            </button>
          )}

          {/* AI Briefing Quick Trigger */}
          <div
            onClick={() => setShowBriefingModal(true)}
            className="w-full lg:max-w-md p-3.5 rounded-2xl bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-purple-500/30 text-xs text-purple-200 flex items-center gap-3 cursor-pointer hover:border-purple-400 transition-all"
          >
            <Sparkles className="w-5 h-5 text-amber-300 shrink-0 animate-pulse" />
            <p className="line-clamp-2 text-slate-200">
              <span className="font-bold text-purple-300">AI Daily Briefing:</span> {activeCity.briefing}
            </p>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
