import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, X, Sun, CloudRain, ShieldCheck, Thermometer, Briefcase, Car, Activity } from 'lucide-react';
import GlassCard from '../Common/GlassCard';

export default function AIDailyBriefingModal() {
  const { showBriefingModal, setShowBriefingModal, activeCity } = useApp();

  if (!showBriefingModal || !activeCity) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#05070A]/85 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="w-full max-w-xl glass-card rounded-3xl p-6 sm:p-8 border border-purple-500/40 glow-violet relative animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-white">AI Executive Weather Briefing</h3>
              <p className="text-xs text-purple-300 font-mono-telemetry">{activeCity.name} • {new Date().toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}</p>
            </div>
          </div>

          <button
            onClick={() => setShowBriefingModal(false)}
            className="p-2 rounded-xl glass-card text-slate-400 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Executive Summary */}
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/20 text-xs sm:text-sm text-purple-100 leading-relaxed">
            <p className="font-semibold text-purple-300 mb-1 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-400" /> Executive Overview
            </p>
            {activeCity.briefing}
          </div>

          {/* 3 Pillar Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Outfit */}
            <div className="p-3.5 rounded-2xl glass-card border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                <Thermometer className="w-4 h-4" /> Outfit Advice
              </div>
              <div className="text-xs text-slate-300 font-medium">
                {activeCity.tempC > 22 ? 'Light breathable linen & UV sunglasses.' : 'Layered thermal jacket & water-resistant boots.'}
              </div>
            </div>

            {/* Travel */}
            <div className="p-3.5 rounded-2xl glass-card border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-sky-400">
                <Car className="w-4 h-4" /> Commute Risk
              </div>
              <div className="text-xs text-slate-300 font-medium">
                {activeCity.hourly?.[0]?.pop > 40 ? 'Moderate rain delay expected on highway.' : 'Optimal driving conditions with full visibility.'}
              </div>
            </div>

            {/* Outdoor Activity */}
            <div className="p-3.5 rounded-2xl glass-card border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                <Activity className="w-4 h-4" /> Activity Score
              </div>
              <div className="text-xs text-slate-300 font-medium">
                {activeCity.aqi < 50 ? '9/10 - Ideal for outdoor running & sports.' : '6/10 - Sensitive groups take precautions.'}
              </div>
            </div>
          </div>
        </div>

        {/* Footer button */}
        <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={() => setShowBriefingModal(false)}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-bold text-xs shadow-md"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}
