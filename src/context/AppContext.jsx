import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_LOCATIONS } from '../data/mockLocations';
import { fetchCityWeather } from '../services/weatherService';
import { generateAIWeatherResponse } from '../services/aiAssistantService';
import { soundFx } from '../services/soundService';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Load saved state from LocalStorage or defaults
  const [locations, setLocations] = useState(() => {
    const saved = localStorage.getItem('aether_locations');
    return saved ? JSON.parse(saved) : INITIAL_LOCATIONS;
  });

  const [activeCity, setActiveCityState] = useState(() => {
    const savedId = localStorage.getItem('aether_active_id');
    const match = locations.find(l => l.id === savedId);
    return match || locations[0] || INITIAL_LOCATIONS[0];
  });

  const [tempUnit, setTempUnit] = useState(() => localStorage.getItem('aether_temp_unit') || 'C');
  const [speedUnit, setSpeedUnit] = useState(() => localStorage.getItem('aether_speed_unit') || 'kmh');
  const [pressureUnit, setPressureUnit] = useState(() => localStorage.getItem('aether_pressure_unit') || 'hpa');
  const [themeAccent, setThemeAccent] = useState(() => localStorage.getItem('aether_theme_accent') || 'cyan');
  const [soundEnabled, setSoundEnabled] = useState(() => localStorage.getItem('aether_sound_enabled') !== 'false');

  const [onboardingCompleted, setOnboardingCompleted] = useState(() => {
    return localStorage.getItem('aether_onboarding_completed') === 'true';
  });

  const [showOnboarding, setShowOnboarding] = useState(!onboardingCompleted);
  const [activeTab, setActiveTabState] = useState('dashboard');
  const [showBriefingModal, setShowBriefingModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showAiDrawer, setShowAiDrawer] = useState(false);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);

  // AI Assistant Chat History
  const [aiMessages, setAiMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: `Hello! I am your Aether Atmospheric AI Assistant. I am monitoring live telemetry for ${activeCity?.name}. How can I assist your schedule today?`,
      time: 'Just now'
    }
  ]);

  // Persist primary settings
  useEffect(() => {
    localStorage.setItem('aether_locations', JSON.stringify(locations));
  }, [locations]);

  useEffect(() => {
    if (activeCity) localStorage.setItem('aether_active_id', activeCity.id);
  }, [activeCity]);

  useEffect(() => {
    localStorage.setItem('aether_temp_unit', tempUnit);
  }, [tempUnit]);

  useEffect(() => {
    localStorage.setItem('aether_speed_unit', speedUnit);
  }, [speedUnit]);

  useEffect(() => {
    localStorage.setItem('aether_pressure_unit', pressureUnit);
  }, [pressureUnit]);

  useEffect(() => {
    localStorage.setItem('aether_theme_accent', themeAccent);
  }, [themeAccent]);

  useEffect(() => {
    localStorage.setItem('aether_sound_enabled', String(soundEnabled));
    soundFx.toggle(soundEnabled);
  }, [soundEnabled]);

  // Fetch live weather on city change
  const setActiveCity = async (cityObj) => {
    soundFx.playClick();
    setActiveCityState(cityObj);
    setIsLoadingWeather(true);
    const updated = await fetchCityWeather(cityObj);
    setActiveCityState(updated);
    setIsLoadingWeather(false);
  };

  const setActiveTab = (tabName) => {
    soundFx.playClick();
    setActiveTabState(tabName);
  };

  const toggleFavorite = (cityId) => {
    soundFx.playClick();
    setLocations(prev =>
      prev.map(loc => loc.id === cityId ? { ...loc, isFavorite: !loc.isFavorite } : loc)
    );
  };

  const addCity = async (newCity) => {
    soundFx.playNotification();
    const existing = locations.find(l => l.id === newCity.id || l.name.toLowerCase() === newCity.name.toLowerCase());
    if (existing) {
      setActiveCity(existing);
      return;
    }
    const fullData = await fetchCityWeather(newCity);
    const updatedList = [fullData, ...locations];
    setLocations(updatedList);
    setActiveCity(fullData);
  };

  const removeCity = (cityId) => {
    soundFx.playClick();
    if (locations.length <= 1) return;
    const filtered = locations.filter(l => l.id !== cityId);
    setLocations(filtered);
    if (activeCity?.id === cityId) {
      setActiveCity(filtered[0]);
    }
  };

  const completeOnboarding = () => {
    soundFx.playNotification();
    localStorage.setItem('aether_onboarding_completed', 'true');
    setOnboardingCompleted(true);
    setShowOnboarding(false);
  };

  const restartOnboarding = () => {
    soundFx.playClick();
    setShowOnboarding(true);
  };

  const openAlertModal = (alertObj) => {
    soundFx.playNotification();
    setSelectedAlert(alertObj);
    setShowAlertModal(true);
  };

  const closeAlertModal = () => {
    setShowAlertModal(false);
    setSelectedAlert(null);
  };

  return (
    <AppContext.Provider
      value={{
        locations,
        savedLocations: locations, // Alias
        activeCity,
        setActiveCity,
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
        onboardingCompleted,
        showOnboarding,
        setShowOnboarding,
        completeOnboarding,
        restartOnboarding,
        resetOnboarding: restartOnboarding, // Alias
        activeTab,
        setActiveTab,
        showBriefingModal,
        setShowBriefingModal,
        showAlertModal,
        setShowAlertModal,
        selectedAlert,
        activeAlertModal: selectedAlert, // Alias
        openAlertModal,
        closeAlertModal,
        showSettingsModal,
        setShowSettingsModal,
        showAiDrawer,
        setShowAiDrawer,
        toggleFavorite,
        addCity,
        addSavedLocation: addCity, // Alias
        removeCity,
        removeSavedLocation: removeCity, // Alias
        aiMessages,
        isLoadingWeather,
        isLoading: isLoadingWeather
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
