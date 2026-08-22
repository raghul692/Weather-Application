import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Compass, Sparkles, MapPin, Thermometer, Sliders, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import { INITIAL_LOCATIONS } from '../../data/mockLocations';

export default function OnboardingModal() {
  const {
    showOnboarding,
    completeOnboarding,
    tempUnit,
    setTempUnit,
    speedUnit,
    setSpeedUnit,
    themeAccent,
    setThemeAccent,
    soundEnabled,
    setSoundEnabled,
    setActiveCity
  } = useApp();

  const [step, setStep] = useState(1);
  const [selectedCity, setSelectedCity] = useState(INITIAL_LOCATIONS[0]);

  if (!showOnboarding) return null;

  const handleFinish = () => {
    setActiveCity(selectedCity);
    completeOnboarding();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#05070A]/90 backdrop-blur-2xl flex items-center justify-center p-4">
      <div className="w-full max-w-2xl glass-card rounded-3xl p-6 sm:p-10 border border-sky-500/30 glow-cyan relative overflow-hidden">
        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <Compass className="w-6 h-6 text-sky-400 animate-spin-slow" />
            <span className="text-sm font-bold tracking-wider text-slate-300 uppercase">
              Aether Setup Wizard
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4].map(s => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all duration-300 ${
                  s === step ? 'w-8 bg-sky-400 glow-cyan' : s < step ? 'w-2 bg-sky-600' : 'w-2 bg-slate-800'
                }`}
              />
            ))}
          </div>
        </div>

        {/* STEP 1: WELCOME */}
        {step === 1 && (
          <div className="flex flex-col items-center text-center space-y-6 animate-fadeIn">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-600 p-1 glow-cyan shadow-2xl">
              <div className="w-full h-full bg-[#070B14] rounded-[22px] flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-sky-400 animate-pulse" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Welcome to Aether Atmospheric Intelligence
              </h2>
              <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-lg leading-relaxed">
                Experience ultra-precise atmospheric telemetry, 24-hour granular hourly forecasting, dynamic AI daily briefings, and high-contrast glassmorphic weather visual design.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full text-left my-4">
              <div className="p-3.5 rounded-2xl glass-card-interactive border-white/5">
                <div className="text-sky-400 font-bold text-xs">Live Telemetry</div>
                <div className="text-[11px] text-slate-400 mt-1">Real-time AQI, UV, Wind vectors, & Dew point.</div>
              </div>
              <div className="p-3.5 rounded-2xl glass-card-interactive border-white/5">
                <div className="text-purple-400 font-bold text-xs">AI Daily Briefing</div>
                <div className="text-[11px] text-slate-400 mt-1">Contextual outfit & travel recommendations.</div>
              </div>
              <div className="p-3.5 rounded-2xl glass-card-interactive border-white/5">
                <div className="text-amber-400 font-bold text-xs">Radar & Compare</div>
                <div className="text-[11px] text-slate-400 mt-1">Simulated radar map & city comparison matrix.</div>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25 transition-all"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: LOCATION SELECT */}
        {step === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-2xl font-bold text-white">Select Primary Location</h2>
              <p className="text-sm text-slate-400 mt-1">
                Choose your default starting city for live weather monitoring.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-60 overflow-y-auto pr-1">
              {INITIAL_LOCATIONS.map(loc => {
                const isSelected = selectedCity.id === loc.id;
                return (
                  <div
                    key={loc.id}
                    onClick={() => setSelectedCity(loc)}
                    className={`p-3.5 rounded-2xl cursor-pointer transition-all border ${
                      isSelected
                        ? 'bg-sky-500/20 border-sky-400 glow-cyan text-white'
                        : 'glass-card-interactive border-white/10 text-slate-300 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <MapPin className={`w-4 h-4 ${isSelected ? 'text-sky-400' : 'text-slate-500'}`} />
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-sky-400" />}
                    </div>
                    <div className="mt-2 font-bold text-sm">{loc.name}</div>
                    <div className="text-[11px] text-slate-400">{loc.country}</div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-white/10">
              <button
                onClick={() => setStep(1)}
                className="px-5 py-2.5 rounded-xl glass-card text-xs font-semibold text-slate-300 hover:text-white"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: TELEMETRY PREFERENCES */}
        {step === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-2xl font-bold text-white">Telemetry & Units</h2>
              <p className="text-sm text-slate-400 mt-1">
                Configure your preferred units of measurement.
              </p>
            </div>

            <div className="space-y-4">
              {/* Temperature Unit */}
              <div className="p-4 rounded-2xl glass-card border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Thermometer className="w-5 h-5 text-sky-400" />
                  <div>
                    <div className="text-sm font-bold text-white">Temperature Unit</div>
                    <div className="text-xs text-slate-400">Celsius (°C) or Fahrenheit (°F)</div>
                  </div>
                </div>
                <div className="flex bg-slate-900/80 p-1 rounded-xl border border-slate-700">
                  <button
                    onClick={() => setTempUnit('C')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold ${tempUnit === 'C' ? 'bg-sky-500 text-white shadow' : 'text-slate-400'}`}
                  >
                    °C
                  </button>
                  <button
                    onClick={() => setTempUnit('F')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold ${tempUnit === 'F' ? 'bg-sky-500 text-white shadow' : 'text-slate-400'}`}
                  >
                    °F
                  </button>
                </div>
              </div>

              {/* Speed Unit */}
              <div className="p-4 rounded-2xl glass-card border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Sliders className="w-5 h-5 text-indigo-400" />
                  <div>
                    <div className="text-sm font-bold text-white">Wind Speed Unit</div>
                    <div className="text-xs text-slate-400">Kilometers/hour or Miles/hour</div>
                  </div>
                </div>
                <div className="flex bg-slate-900/80 p-1 rounded-xl border border-slate-700">
                  <button
                    onClick={() => setSpeedUnit('kmh')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold ${speedUnit === 'kmh' ? 'bg-indigo-500 text-white shadow' : 'text-slate-400'}`}
                  >
                    km/h
                  </button>
                  <button
                    onClick={() => setSpeedUnit('mph')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold ${speedUnit === 'mph' ? 'bg-indigo-500 text-white shadow' : 'text-slate-400'}`}
                  >
                    mph
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-white/10">
              <button
                onClick={() => setStep(2)}
                className="px-5 py-2.5 rounded-xl glass-card text-xs font-semibold text-slate-300 hover:text-white"
              >
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: SOUND & FINISH */}
        {step === 4 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-2xl font-bold text-white">Visual & Audio FX</h2>
              <p className="text-sm text-slate-400 mt-1">
                Finalize theme accents and sound effects.
              </p>
            </div>

            <div className="space-y-4">
              {/* Theme Accents */}
              <div className="p-4 rounded-2xl glass-card border-white/10 space-y-3">
                <div className="text-sm font-bold text-white">Theme Accent Palette</div>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setThemeAccent('cyan')}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 ${
                      themeAccent === 'cyan' ? 'border-sky-400 bg-sky-500/20 text-sky-400 glow-cyan' : 'border-white/10 text-slate-400'
                    }`}
                  >
                    <div className="w-3 h-3 rounded-full bg-sky-400" />
                    <span>Electric Cyan</span>
                  </button>
                  <button
                    onClick={() => setThemeAccent('violet')}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 ${
                      themeAccent === 'violet' ? 'border-purple-400 bg-purple-500/20 text-purple-400 glow-violet' : 'border-white/10 text-slate-400'
                    }`}
                  >
                    <div className="w-3 h-3 rounded-full bg-purple-400" />
                    <span>Aurora Violet</span>
                  </button>
                  <button
                    onClick={() => setThemeAccent('amber')}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 ${
                      themeAccent === 'amber' ? 'border-amber-400 bg-amber-500/20 text-amber-400 glow-amber' : 'border-white/10 text-slate-400'
                    }`}
                  >
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <span>Solar Ember</span>
                  </button>
                </div>
              </div>

              {/* Sound FX Toggle */}
              <div className="p-4 rounded-2xl glass-card border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-white">UI Sound Feedback</div>
                  <div className="text-xs text-slate-400">Micro audio cues on interaction</div>
                </div>
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                    soundEnabled ? 'bg-emerald-500/20 border-emerald-400 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  {soundEnabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-white/10">
              <button
                onClick={() => setStep(3)}
                className="px-5 py-2.5 rounded-xl glass-card text-xs font-semibold text-slate-300 hover:text-white"
              >
                Back
              </button>
              <button
                onClick={handleFinish}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 hover:from-sky-400 hover:to-purple-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-sky-500/30 glow-cyan"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Launch Dashboard</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
