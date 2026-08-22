# 🌩️ Aether Atmospheric Intelligence Platform

**Aether Weather** is a production-grade, ultra-responsive atmospheric intelligence web application built with **React 19**, **Vite**, **Tailwind CSS v4**, and **Open-Meteo REST API**. 

Designed under the **"Atmospheric Sophistication"** design system, Aether provides real-time atmospheric telemetry, interactive SVG telemetry curves, simulated Doppler radar visualization, side-by-side multi-city comparison matrix, severe weather alert bulletins, and an interactive AI Atmospheric Co-Pilot.

---

## 🌟 Key Features

### 1. 🚀 Guided Onboarding Wizard
- Multi-step interactive setup (`Welcome`, `Location Selection`, `Telemetry & Units`, `Visual/Audio FX`).
- Dynamic state persistence using `localStorage`.

### 2. 📊 High-Craft Telemetry Dashboard
- **Hero Weather Display**: Live temperature, feels-like metrics, weather condition icons, local time & timezone offset.
- **8-Card Telemetry Grid**: Real-time **Air Quality Index (AQI)** meter, **Wind Vector Compass** with surface station data, **Solar Arc Telemetry** (Sunrise/Sunset cycle), **UV Index Gauge**, **Humidity & Dew Point**, **Surface Barometric Pressure**, **Visibility**, and **Precipitation Probability**.

### 3. 📈 Interactive Forecast Analysis
- **24-Hour Hourly Forecast**: Interactive SVG line chart with real-time cursor hover tooltips, temperature curve, and precipitation probability overlays.
- **10-Day Extended Forecast**: Spotlight detail view featuring high/low temperature range meters and condition badges.

### 4. 🛰️ Dynamic Doppler Radar Canvas
- **HTML5 Canvas Radar Visualizer**: Animated Doppler radar sweep overlay with customizable reflectivity bands.
- **Layer Controls**: Toggle between *Reflectivity dBZ*, *Thermal Heatmaps*, *Stream Vectors*, and *AQI Particle views*.
- **Time Scrubbing**: Scours historical telemetry from `-45 min` to `+45 min` forecast projections.

### 5. 🗺️ Multi-Location & Comparison Matrix
- **Saved Cities Management**: Add, remove, and pin favorite global cities (Tokyo, New York, London, Paris, Sydney).
- **Side-by-Side Comparison**: Synchronized telemetry grid for side-by-side metric analysis across multiple cities.

### 6. 🤖 Contextual AI Co-Pilot & Daily Briefing
- **AI Chat Drawer**: Real-time atmospheric AI assistant analyzing active station telemetry to answer queries regarding outfit choices, rain probability, umbrella necessity, outdoor safety, and travel risks.
- **AI Daily Briefing Modal**: Executive weather brief summary providing morning, afternoon, and evening forecasts.

### 7. 🚨 Weather Alerts & Bulletins
- Active severe weather indicators, severity tags (Emergency, Warning, Advisory), impact details, and emergency precautions.

---

## 🛠️ Technology Stack

- **Frontend Core**: React 19, Vite
- **Styling & Aesthetics**: Tailwind CSS v4, Custom Glassmorphism Utilities, JetBrains Mono & Inter typography
- **Iconography**: Lucide React
- **API Integration**: Open-Meteo REST API (Live surface station telemetry) with robust synthetic fallback engines
- **Audio Engine**: Web Audio API UI sound feedback (`soundService.js`)

---

## 📂 Project Architecture

```
Weather_Aplication/
├── src/
│   ├── components/
│   │   ├── AIAssistant/
│   │   │   ├── AIChatDrawer.jsx
│   │   │   └── AIDailyBriefingModal.jsx
│   │   ├── Alerts/
│   │   │   ├── AlertDetailModal.jsx
│   │   │   └── WeatherAlertsList.jsx
│   │   ├── Common/
│   │   │   └── WeatherCanvasBackground.jsx
│   │   ├── Dashboard/
│   │   │   ├── HeroWeatherCard.jsx
│   │   │   ├── HourlyCarousel.jsx
│   │   │   ├── TelemetryGrid.jsx
│   │   │   └── TenDayForecast.jsx
│   │   ├── Forecast/
│   │   │   ├── ExtendedHourlyChart.jsx
│   │   │   └── TenDayDetailView.jsx
│   │   ├── Locations/
│   │   │   ├── CompareCitiesMatrix.jsx
│   │   │   ├── LocationSearch.jsx
│   │   │   └── SavedLocationsGrid.jsx
│   │   ├── Map/
│   │   │   └── RadarMapCanvas.jsx
│   │   ├── Navigation/
│   │   │   ├── HeaderNav.jsx
│   │   │   └── TabNavigation.jsx
│   │   ├── Onboarding/
│   │   │   └── OnboardingModal.jsx
│   │   └── Settings/
│   │       └── SettingsModal.jsx
│   ├── context/
│   │   └── AppContext.jsx
│   ├── data/
│   │   └── mockLocations.js
│   ├── services/
│   │   ├── aiAssistantService.js
│   │   ├── soundService.js
│   │   └── weatherService.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

---

## 🚦 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
# Clone repository or navigate to directory
cd Weather_Aplication

# Install dependencies
npm install

# Start local development server
npm run dev
```

### Production Build
```bash
# Generate optimized production bundle
npm run build

# Preview production build
npm run preview
```

---

## 🎨 Design System: "Atmospheric Sophistication"

- **Base Colors**: Midnight Slate `#05070A`, Deep Navy `#0B0F17`
- **Accent Palettes**:
  - **Electric Cyan**: `#38BDF8` (Telemetry & Temperature)
  - **Aurora Violet**: `#A855F7` (Solar & Atmospheric Pressure)
  - **Solar Ember**: `#F59E0B` (UV Index & Weather Warnings)
- **Glassmorphism**: Backdrop blur `24px`, 1px subtle white borders (`border-white/10`)
- **Typography**: Inter (UI Base) & JetBrains Mono (Telemetry Numbers & Timestamps)

---

## 📄 License
Created under the MIT License for Aether Atmospheric Intelligence Systems.
