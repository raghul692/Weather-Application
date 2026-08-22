import React, { useEffect } from 'react';
import { useApp } from './context/AppContext';

// Canvas & Navigation
import WeatherCanvasBackground from './components/Common/WeatherCanvasBackground';
import HeaderNav from './components/Navigation/HeaderNav';
import TabNavigation from './components/Navigation/TabNavigation';

// Main Views
import HeroWeatherCard from './components/Dashboard/HeroWeatherCard';
import TelemetryGrid from './components/Dashboard/TelemetryGrid';
import HourlyCarousel from './components/Dashboard/HourlyCarousel';
import TenDayForecast from './components/Dashboard/TenDayForecast';

import ExtendedHourlyChart from './components/Forecast/ExtendedHourlyChart';
import TenDayDetailView from './components/Forecast/TenDayDetailView';
import RadarMapCanvas from './components/Map/RadarMapCanvas';
import SavedLocationsGrid from './components/Locations/SavedLocationsGrid';
import CompareCitiesMatrix from './components/Locations/CompareCitiesMatrix';
import WeatherAlertsList from './components/Alerts/WeatherAlertsList';

// Modals & Drawers
import OnboardingModal from './components/Onboarding/OnboardingModal';
import AIChatDrawer from './components/AIAssistant/AIChatDrawer';
import AIDailyBriefingModal from './components/AIAssistant/AIDailyBriefingModal';
import AlertDetailModal from './components/Alerts/AlertDetailModal';
import SettingsModal from './components/Settings/SettingsModal';

export default function App() {
  const { activeTab, activeCity, isLoading, setShowAiDrawer } = useApp();

  useEffect(() => {
    if (activeTab === 'aiAssistant') {
      setShowAiDrawer(true);
    }
  }, [activeTab, setShowAiDrawer]);

  return (
    <div className="min-h-screen bg-[#05070A] text-slate-100 font-sans relative overflow-x-hidden selection:bg-sky-500 selection:text-white">
      {/* Dynamic Animated Canvas Background */}
      <WeatherCanvasBackground conditionCode={activeCity?.conditionCode || 'sunny'} />

      {/* Main Content Layout Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col min-h-screen">
        {/* Top Header Navigation */}
        <HeaderNav />

        {/* View Selection Tabs */}
        <TabNavigation />

        {/* View Switcher Container */}
        <main className="flex-1 space-y-6 animate-fadeIn pb-12 mt-4">
          {isLoading && (
            <div className="glass-card p-6 text-center text-xs text-sky-400 font-mono-telemetry animate-pulse">
              Syncing live atmospheric telemetry from Open-Meteo...
            </div>
          )}

          {/* 1. DASHBOARD VIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <HeroWeatherCard />
              <TelemetryGrid />
              <HourlyCarousel />
              <TenDayForecast />
            </div>
          )}

          {/* 2. HOURLY FORECAST VIEW */}
          {activeTab === 'hourly' && <ExtendedHourlyChart />}

          {/* 3. 10-DAY OUTLOOK VIEW */}
          {(activeTab === 'tenDay' || activeTab === 'tenday') && <TenDayDetailView />}

          {/* 4. RADAR & DOPPLER MAP VIEW */}
          {activeTab === 'radar' && <RadarMapCanvas />}

          {/* 5. SAVED LOCATIONS VIEW */}
          {activeTab === 'saved' && <SavedLocationsGrid />}

          {/* 6. COMPARE MATRIX VIEW */}
          {activeTab === 'compare' && <CompareCitiesMatrix />}

          {/* 7. WEATHER ALERTS VIEW */}
          {activeTab === 'alerts' && <WeatherAlertsList />}

          {/* 8. AI ASSISTANT BACKDROP VIEW */}
          {activeTab === 'aiAssistant' && (
            <div className="space-y-6">
              <HeroWeatherCard />
              <TelemetryGrid />
            </div>
          )}
        </main>

        {/* Footer info */}
        <footer className="mt-auto py-6 border-t border-white/10 text-center text-xs text-slate-400 font-mono-telemetry">
          <p>Aether Atmospheric Intelligence Platform • High-Craft Weather Design System</p>
        </footer>
      </div>

      {/* Global Modals & Drawers */}
      <OnboardingModal />
      <AIChatDrawer />
      <AIDailyBriefingModal />
      <AlertDetailModal />
      <SettingsModal />
    </div>
  );
}
