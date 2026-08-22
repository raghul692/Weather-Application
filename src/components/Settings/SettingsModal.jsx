import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sliders, X, Thermometer, Wind, Gauge, Palette, Volume2, RotateCcw, ShieldCheck } from 'lucide-react';
import GlassCard from '../Common/GlassCard';

export default function SettingsModal() {
  const {
    showSettingsModal,
    setShowSettingsModal,
    tempUnit,
    setTempUnit,
    speedUnit,
    setSpeedUnit,
    pressureUnit,
    setPressureUnit,
    themeAccent,
    setThemeAccent,
    soundEnabled,
    setSoundEnabled,
    resetOnboarding
  } = useApp();

  if (!showSettingsModal) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#05070A]/85 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="w-full max-w-xl glass-card rounded-3xl p-6 sm:p-8 border border-sky-500/30 glow-cyan relative animate-fadeIn max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-white">Application Settings</h3>
              <p className="text-xs text-slate-400">Customize telemetry metrics & UI behavior</p>
            </div>
          </div>

          <button
            onClick={() => setShowSettingsModal(false)}
            className="p-2 rounded-xl glass-card text-slate-400 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="space-y-5 text-xs sm:text-sm">
          {/* Temperature Unit */}
          <div className="p-4 rounded-2xl glass-card border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Thermometer className="w-5 h-5 text-sky-400" />
              <div>
                <div className="font-bold text-white">Temperature Unit</div>
                <div className="text-xs text-slate-400">Scale for display</div>
              </div>
            </div>
            <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-700">
              <button
                onClick={() => setTempUnit('C')}
                className={`px-3 py-1.5 rounded-lg font-bold text-xs ${tempUnit === 'C' ? 'bg-sky-500 text-white shadow' : 'text-slate-400'}`}
              >
                °C
              </button>
              <button
                onClick={() => setTempUnit('F')}
                className={`px-3 py-1.5 rounded-lg font-bold text-xs ${tempUnit === 'F' ? 'bg-sky-500 text-white shadow' : 'text-slate-400'}`}
              >
                °F
              </button>
            </div>
          </div>

          {/* Wind Speed Unit */}
          <div className="p-4 rounded-2xl glass-card border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Wind className="w-5 h-5 text-indigo-400" />
              <div>
                <div className="font-bold text-white">Wind Speed Unit</div>
                <div className="text-xs text-slate-400">Velocity scale</div>
              </div>
            </div>
            <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-700">
              <button
                onClick={() => setSpeedUnit('kmh')}
                className={`px-3 py-1.5 rounded-lg font-bold text-xs ${speedUnit === 'kmh' ? 'bg-indigo-500 text-white shadow' : 'text-slate-400'}`}
              >
                km/h
              </button>
              <button
                onClick={() => setSpeedUnit('mph')}
                className={`px-3 py-1.5 rounded-lg font-bold text-xs ${speedUnit === 'mph' ? 'bg-indigo-500 text-white shadow' : 'text-slate-400'}`}
              >
                mph
              </button>
            </div>
          </div>

          {/* Theme Accent */}
          <div className="p-4 rounded-2xl glass-card border-white/10 space-y-3">
            <div className="flex items-center gap-3">
              <Palette className="w-5 h-5 text-purple-400" />
              <div className="font-bold text-white">Visual Glow Palette</div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setThemeAccent('cyan')}
                className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 ${
                  themeAccent === 'cyan' ? 'border-sky-400 bg-sky-500/20 text-sky-400' : 'border-white/10 text-slate-400'
                }`}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-sky-400" /> Cyan
              </button>
              <button
                onClick={() => setThemeAccent('violet')}
                className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 ${
                  themeAccent === 'violet' ? 'border-purple-400 bg-purple-500/20 text-purple-400' : 'border-white/10 text-slate-400'
                }`}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-purple-400" /> Violet
              </button>
              <button
                onClick={() => setThemeAccent('amber')}
                className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 ${
                  themeAccent === 'amber' ? 'border-amber-400 bg-amber-500/20 text-amber-400' : 'border-white/10 text-slate-400'
                }`}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Ember
              </button>
            </div>
          </div>

          {/* Sound FX Toggle */}
          <div className="p-4 rounded-2xl glass-card border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Volume2 className="w-5 h-5 text-emerald-400" />
              <div>
                <div className="font-bold text-white">Audio Micro-Interactions</div>
                <div className="text-xs text-slate-400">Web Audio API sound cues</div>
              </div>
            </div>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs border ${
                soundEnabled ? 'bg-emerald-500/20 border-emerald-400 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              {soundEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Reset Wizard */}
          <div className="pt-2">
            <button
              onClick={() => {
                setShowSettingsModal(false);
                resetOnboarding();
              }}
              className="w-full p-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 hover:bg-red-500/20 text-xs font-bold flex items-center justify-center gap-2 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Relaunch Onboarding Setup Wizard</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
