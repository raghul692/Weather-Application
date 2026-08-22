import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Search, Settings, Volume2, VolumeX, Compass, MapPin, RefreshCw } from 'lucide-react';
import LocationSearch from '../Locations/LocationSearch';

export default function HeaderNav() {
  const {
    activeCity,
    tempUnit,
    setTempUnit,
    soundEnabled,
    setSoundEnabled,
    setShowBriefingModal,
    setShowSettingsModal,
    isLoadingWeather,
    setActiveCity
  } = useApp();

  const [showSearchModal, setShowSearchModal] = useState(false);

  // Keyboard shortcut (⌘K or Ctrl+K) to toggle search modal
  useEffect(() => {
    const handleGlobalKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearchModal(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#05070A]/80 border-b border-white/10 px-4 lg:px-8 py-3.5 flex items-center justify-between transition-all">
      {/* Brand Logo */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-600 p-0.5 glow-cyan flex items-center justify-center cursor-pointer" onClick={() => setActiveCity(activeCity)}>
          <div className="w-full h-full bg-[#0A0E17] rounded-[10px] flex items-center justify-center">
            <Compass className="w-5 h-5 text-sky-400 animate-spin-slow" />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
              AETHER <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">v2.4 PRO</span>
            </h1>
          </div>
          <p className="text-[11px] text-slate-400 hidden sm:block">Atmospheric Telemetry & AI Intelligence</p>
        </div>
      </div>

      {/* Global Location Search bar (Quick trigger) */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <div
          onClick={() => setShowSearchModal(true)}
          className="w-full glass-input px-3.5 py-2 rounded-xl flex items-center gap-2.5 text-slate-400 cursor-pointer hover:border-sky-500/40 text-sm transition-all"
        >
          <Search className="w-4 h-4 text-sky-400" />
          <span className="flex-1 text-slate-300 truncate">
            Search city, country or state...
          </span>
          <kbd className="hidden lg:inline-block px-2 py-0.5 text-[10px] font-mono bg-slate-800 text-slate-400 rounded border border-slate-700">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Active City Pill */}
        <div
          onClick={() => setShowSearchModal(true)}
          className="px-3 py-1.5 rounded-xl glass-card border-white/10 flex items-center gap-2 text-xs font-semibold text-white cursor-pointer hover:border-sky-500/40"
        >
          <MapPin className="w-3.5 h-3.5 text-sky-400" />
          <span className="max-w-[100px] truncate">{activeCity?.name}</span>
          {isLoadingWeather && <RefreshCw className="w-3 h-3 text-sky-400 animate-spin" />}
        </div>

        {/* AI Briefing Button */}
        <button
          onClick={() => setShowBriefingModal(true)}
          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-purple-500/20 transition-all active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
          <span className="hidden sm:inline">AI Briefing</span>
        </button>

        {/* Unit Toggle */}
        <button
          onClick={() => setTempUnit(tempUnit === 'C' ? 'F' : 'C')}
          className="px-2.5 py-1.5 rounded-xl glass-card text-xs font-mono font-bold text-sky-400 hover:text-white border-white/10 transition-all"
          title="Toggle Temperature Unit"
        >
          °{tempUnit}
        </button>

        {/* Sound Toggle */}
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-2 rounded-xl glass-card text-slate-400 hover:text-white border-white/10 transition-all"
          title={soundEnabled ? 'Mute Audio FX' : 'Enable Audio FX'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-sky-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
        </button>

        {/* Settings Button */}
        <button
          onClick={() => setShowSettingsModal(true)}
          className="p-2 rounded-xl glass-card text-slate-400 hover:text-white border-white/10 transition-all"
          title="Open Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Location Search Modal Overlay */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center pt-20 px-4" onClick={() => setShowSearchModal(false)}>
          <div className="w-full max-w-xl glass-card p-6 rounded-2xl border border-sky-500/30 glow-cyan" onClick={e => e.stopPropagation()}>
            <LocationSearch onClose={() => setShowSearchModal(false)} />
          </div>
        </div>
      )}
    </header>
  );
}
