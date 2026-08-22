import { INITIAL_LOCATIONS } from '../data/mockLocations';

const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY || '5be13e3e14df42b59c895406262208';

// WeatherAPI condition text to icon and condition code mapping
function mapConditionToIcon(text = '') {
  const lower = text.toLowerCase();
  if (lower.includes('sunny') || lower.includes('clear')) {
    return { condition: 'Sunny / Clear', conditionCode: 'sunny', icon: 'Sun' };
  }
  if (lower.includes('partly') || lower.includes('patchy')) {
    return { condition: 'Partly Cloudy', conditionCode: 'partly_cloudy', icon: 'CloudSun' };
  }
  if (lower.includes('cloud') || lower.includes('overcast')) {
    return { condition: 'Overcast', conditionCode: 'cloudy', icon: 'Cloud' };
  }
  if (lower.includes('fog') || lower.includes('mist')) {
    return { condition: 'Fog & Mist', conditionCode: 'fog', icon: 'CloudFog' };
  }
  if (lower.includes('drizzle')) {
    return { condition: 'Light Drizzle', conditionCode: 'drizzle', icon: 'CloudDrizzle' };
  }
  if (lower.includes('rain') || lower.includes('shower')) {
    return { condition: text || 'Rain Showers', conditionCode: 'rain', icon: 'CloudRain' };
  }
  if (lower.includes('snow') || lower.includes('sleet') || lower.includes('blizzard')) {
    return { condition: 'Snow Fall', conditionCode: 'snow', icon: 'Snowflake' };
  }
  if (lower.includes('thunder') || lower.includes('storm')) {
    return { condition: 'Severe Thunderstorm', conditionCode: 'thunderstorm', icon: 'Zap' };
  }
  return { condition: text || 'Passing Clouds', conditionCode: 'partly_cloudy', icon: 'CloudSun' };
}

// Convert US-EPA Air Quality Index to AQI score and status label
function parseUSAqi(usEpaIndex, pm25 = 0) {
  if (pm25 > 0) {
    const rawAqi = Math.round(pm25 * 2.1);
    if (rawAqi <= 50) return { aqi: Math.max(10, rawAqi), status: 'Pristine / Good' };
    if (rawAqi <= 100) return { aqi: rawAqi, status: 'Moderate' };
    if (rawAqi <= 150) return { aqi: rawAqi, status: 'Unhealthy for Sensitive Groups' };
    return { aqi: rawAqi, status: 'Unhealthy / Hazardous' };
  }
  switch (usEpaIndex) {
    case 1: return { aqi: 24, status: 'Pristine / Good' };
    case 2: return { aqi: 62, status: 'Moderate' };
    case 3: return { aqi: 110, status: 'Unhealthy for Sensitive Groups' };
    case 4: return { aqi: 165, status: 'Unhealthy' };
    case 5: return { aqi: 220, status: 'Very Unhealthy' };
    case 6: return { aqi: 310, status: 'Hazardous' };
    default: return { aqi: 32, status: 'Pristine / Good' };
  }
}

// Helper for Open-Meteo fallback
function parseWMOCode(code) {
  switch (code) {
    case 0: return { condition: 'Sunny / Clear', conditionCode: 'sunny', icon: 'Sun' };
    case 1:
    case 2: return { condition: 'Partly Cloudy', conditionCode: 'partly_cloudy', icon: 'CloudSun' };
    case 3: return { condition: 'Overcast', conditionCode: 'cloudy', icon: 'Cloud' };
    case 45:
    case 48: return { condition: 'Fog & Mist', conditionCode: 'fog', icon: 'CloudFog' };
    case 51:
    case 53:
    case 55: return { condition: 'Light Drizzle', conditionCode: 'drizzle', icon: 'CloudDrizzle' };
    case 61:
    case 63:
    case 65: return { condition: 'Rain Showers', conditionCode: 'rain', icon: 'CloudRain' };
    case 71:
    case 73:
    case 75:
    case 77: return { condition: 'Snow Fall', conditionCode: 'snow', icon: 'Snowflake' };
    case 80:
    case 81:
    case 82: return { condition: 'Heavy Rain', conditionCode: 'rain', icon: 'CloudRain' };
    case 95:
    case 96:
    case 99: return { condition: 'Severe Thunderstorm', conditionCode: 'thunderstorm', icon: 'Zap' };
    default: return { condition: 'Passing Clouds', conditionCode: 'partly_cloudy', icon: 'CloudSun' };
  }
}

// Fetch live weather telemetry (Primary: WeatherAPI.com, Secondary: Open-Meteo, Fallback: Mock)
export async function fetchCityWeather(cityObj) {
  const { lat, lon, name } = cityObj;
  
  // 1. Try WeatherAPI.com
  if (WEATHER_API_KEY) {
    try {
      const url = `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${lat},${lon}&days=10&aqi=yes&alerts=yes`;
      const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
      if (response.ok) {
        const data = await response.json();
        const current = data.current;
        const forecastDays = data.forecast?.forecastday || [];
        const todayForecast = forecastDays[0] || {};
        const astro = todayForecast.astro || {};
        const condMeta = mapConditionToIcon(current.condition?.text);
        
        // Calculate AQI
        const aqiInfo = parseUSAqi(
          current.air_quality?.['us-epa-index'],
          current.air_quality?.pm2_5
        );
        
        // Parse hourly forecast (next 8 hours)
        const hourlySlots = [];
        if (todayForecast.hour) {
          const currentHourIdx = new Date().getHours();
          const combinedHours = [
            ...(todayForecast.hour || []),
            ...(forecastDays[1]?.hour || [])
          ];
          const sliceHours = combinedHours.slice(currentHourIdx, currentHourIdx + 8);
          
          sliceHours.forEach(h => {
            const dateObj = new Date(h.time);
            const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const hCond = mapConditionToIcon(h.condition?.text);
            hourlySlots.push({
              time: timeStr,
              tempC: Math.round(h.temp_c),
              condition: hCond.condition,
              icon: hCond.icon,
              pop: h.chance_of_rain || 0,
              wind: Math.round(h.wind_kph || 10)
            });
          });
        }

        // Parse 10-day forecast
        const formattedTenDay = forecastDays.map((fd, idx) => {
          const dObj = new Date(fd.date);
          const dayName = idx === 0 ? 'Today' : dObj.toLocaleDateString('en-US', { weekday: 'short' });
          const dateStr = dObj.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
          const dCond = mapConditionToIcon(fd.day?.condition?.text);
          return {
            day: dayName,
            date: dateStr,
            highC: Math.round(fd.day?.maxtemp_c),
            lowC: Math.round(fd.day?.mintemp_c),
            condition: dCond.condition,
            icon: dCond.icon,
            pop: fd.day?.daily_chance_of_rain || 0,
            aqi: Math.round(20 + (idx * 3) % 25)
          };
        });

        return {
          ...cityObj,
          tempC: Math.round(current.temp_c),
          feelsLikeC: Math.round(current.feelslike_c),
          highC: Math.round(todayForecast.day?.maxtemp_c ?? (current.temp_c + 3)),
          lowC: Math.round(todayForecast.day?.mintemp_c ?? (current.temp_c - 4)),
          condition: condMeta.condition,
          conditionCode: condMeta.conditionCode,
          humidity: Math.round(current.humidity),
          windKmH: Math.round(current.wind_kph),
          windDirection: current.wind_degree || 180,
          pressureHpa: Math.round(current.pressure_mb),
          visibilityKm: Math.round(current.vis_km || 10),
          uvIndex: Math.round(current.uv || todayForecast.day?.uv || 5),
          aqi: aqiInfo.aqi,
          aqiStatus: aqiInfo.status,
          dewPointC: Math.round(current.dewpoint_c || (current.temp_c - ((100 - current.humidity) / 5))),
          sunrise: astro.sunrise || '06:00 AM',
          sunset: astro.sunset || '06:30 PM',
          hourly: hourlySlots.length > 0 ? hourlySlots : cityObj.hourly,
          tenDay: formattedTenDay.length > 0 ? formattedTenDay : cityObj.tenDay,
          briefing: `Live WeatherAPI telemetry active for ${name}: ${current.condition?.text} at ${Math.round(current.temp_c)}°C with ${current.wind_kph} km/h wind.`
        };
      }
    } catch (wApiErr) {
      console.warn(`WeatherAPI fetch for ${name} failed, trying Open-Meteo...`, wApiErr);
    }
  }

  // 2. Open-Meteo Fallback
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,weather_code,wind_speed_10m,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max&timezone=auto`;
    const response = await fetch(url, { signal: AbortSignal.timeout(4000) });
    if (!response.ok) throw new Error('Open-Meteo error');
    
    const data = await response.json();
    const current = data.current;
    const daily = data.daily;
    const hourly = data.hourly;
    const wmo = parseWMOCode(current.weather_code);
    
    const formattedHourly = (hourly.time || []).slice(0, 8).map((t, idx) => {
      const dateObj = new Date(t);
      const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const hWmo = parseWMOCode(hourly.weather_code[idx]);
      return {
        time: timeStr,
        tempC: Math.round(hourly.temperature_2m[idx]),
        condition: hWmo.condition,
        icon: hWmo.icon,
        pop: hourly.precipitation_probability[idx] || 0,
        wind: Math.round(hourly.wind_speed_10m[idx] || 10)
      };
    });

    const formattedTenDay = (daily.time || []).map((t, idx) => {
      const dObj = new Date(t);
      const dayName = idx === 0 ? 'Today' : dObj.toLocaleDateString('en-US', { weekday: 'short' });
      const dateStr = dObj.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
      const dWmo = parseWMOCode(daily.weather_code[idx]);
      return {
        day: dayName,
        date: dateStr,
        highC: Math.round(daily.temperature_2m_max[idx]),
        lowC: Math.round(daily.temperature_2m_min[idx]),
        condition: dWmo.condition,
        icon: dWmo.icon,
        pop: daily.precipitation_probability_max[idx] || 0,
        aqi: Math.round(20 + Math.random() * 25)
      };
    });

    return {
      ...cityObj,
      tempC: Math.round(current.temperature_2m),
      feelsLikeC: Math.round(current.apparent_temperature),
      highC: Math.round(daily.temperature_2m_max[0]),
      lowC: Math.round(daily.temperature_2m_min[0]),
      condition: wmo.condition,
      conditionCode: wmo.conditionCode,
      humidity: Math.round(current.relative_humidity_2m),
      windKmH: Math.round(current.wind_speed_10m),
      windDirection: current.wind_direction_10m,
      pressureHpa: Math.round(current.surface_pressure),
      visibilityKm: 10,
      uvIndex: Math.round(daily.uv_index_max[0] || 4),
      aqi: cityObj.aqi || 26,
      aqiStatus: cityObj.aqiStatus || 'Good',
      dewPointC: Math.round(current.temperature_2m - ((100 - current.relative_humidity_2m) / 5)),
      sunrise: daily.sunrise[0] ? new Date(daily.sunrise[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '06:00 AM',
      sunset: daily.sunset[0] ? new Date(daily.sunset[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '06:30 PM',
      hourly: formattedHourly.length > 0 ? formattedHourly : cityObj.hourly,
      tenDay: formattedTenDay.length > 0 ? formattedTenDay : cityObj.tenDay
    };
  } catch (error) {
    console.warn(`All weather APIs failed for ${cityObj.name}, using local fallback.`, error);
    return cityObj;
  }
}

// Search global locations (WeatherAPI search with Geocoding fallback)
export async function searchGlobalLocations(query) {
  if (!query || query.trim().length < 2) return [];

  // 1. Try WeatherAPI search
  if (WEATHER_API_KEY) {
    try {
      const url = `https://api.weatherapi.com/v1/search.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(query)}`;
      const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        const results = await res.json();
        if (Array.isArray(results) && results.length > 0) {
          return results.map(item => ({
            id: `wapi-${item.id}`,
            name: item.name,
            country: item.country || '',
            region: item.region || item.country || '',
            lat: item.lat,
            lon: item.lon,
            timezone: 'UTC',
            tempC: 22,
            feelsLikeC: 21,
            highC: 25,
            lowC: 18,
            condition: 'Partly Cloudy',
            conditionCode: 'partly_cloudy',
            humidity: 55,
            windKmH: 12,
            windDirection: 180,
            pressureHpa: 1013,
            visibilityKm: 10,
            uvIndex: 5,
            aqi: 25,
            aqiStatus: 'Good',
            dewPointC: 11,
            sunrise: '06:15 AM',
            sunset: '06:45 PM',
            isFavorite: false,
            hourly: INITIAL_LOCATIONS[0].hourly,
            tenDay: INITIAL_LOCATIONS[0].tenDay,
            briefing: `Weather metrics retrieved for ${item.name}, ${item.country}.`
          }));
        }
      }
    } catch (wErr) {
      console.warn('WeatherAPI search failed, trying Open-Meteo geocoding...', wErr);
    }
  }

  // 2. Open-Meteo search fallback
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=6&language=en&format=json`;
    const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        return data.results.map((item) => ({
          id: `geo-${item.id}`,
          name: item.name,
          country: item.country || '',
          region: item.admin1 || item.country || '',
          lat: item.latitude,
          lon: item.longitude,
          timezone: item.timezone || 'UTC',
          tempC: 20,
          feelsLikeC: 19,
          highC: 24,
          lowC: 16,
          condition: 'Partly Cloudy',
          conditionCode: 'partly_cloudy',
          humidity: 60,
          windKmH: 15,
          windDirection: 180,
          pressureHpa: 1013,
          visibilityKm: 10,
          uvIndex: 5,
          aqi: 25,
          aqiStatus: 'Good',
          dewPointC: 9,
          sunrise: '06:15 AM',
          sunset: '06:45 PM',
          isFavorite: false,
          hourly: INITIAL_LOCATIONS[0].hourly,
          tenDay: INITIAL_LOCATIONS[0].tenDay,
          briefing: `Weather metrics retrieved for ${item.name}, ${item.country}.`
        }));
      }
    }
  } catch (err) {
    console.warn('Geocoding fallback activated:', err);
  }

  // 3. Local fallback matching INITIAL_LOCATIONS
  const qLower = query.toLowerCase();
  return INITIAL_LOCATIONS.filter(
    loc => loc.name.toLowerCase().includes(qLower) || loc.country.toLowerCase().includes(qLower)
  );
}
