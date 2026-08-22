// Temperature formatting
export function formatTemp(tempC, unit = 'C') {
  if (tempC === undefined || tempC === null) return '--°';
  if (unit === 'F') {
    const tempF = Math.round((tempC * 9) / 5 + 32);
    return `${tempF}°F`;
  }
  return `${Math.round(tempC)}°C`;
}

export function formatTempNum(tempC, unit = 'C') {
  if (tempC === undefined || tempC === null) return 0;
  if (unit === 'F') {
    return Math.round((tempC * 9) / 5 + 32);
  }
  return Math.round(tempC);
}

// Speed formatting
export function formatSpeed(speedKmH, unit = 'kmh') {
  if (speedKmH === undefined || speedKmH === null) return '--';
  if (unit === 'mph') {
    const mph = Math.round(speedKmH * 0.621371);
    return `${mph} mph`;
  }
  return `${Math.round(speedKmH)} km/h`;
}

// Pressure formatting
export function formatPressure(pressureHpa, unit = 'hpa') {
  if (!pressureHpa) return '--';
  if (unit === 'inhg') {
    const inhg = (pressureHpa * 0.02953).toFixed(2);
    return `${inhg} inHg`;
  }
  return `${Math.round(pressureHpa)} hPa`;
}

// Wind cardinal direction
export function getWindDirectionLabel(deg) {
  if (deg === undefined || deg === null) return 'N';
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((deg % 360) / 22.5) % 16;
  return directions[index];
}

// AQI Status & Color Code
export function getAQIMeta(aqi) {
  if (aqi <= 50) {
    return { status: 'Pristine / Good', color: '#10B981', desc: 'Air quality is considered satisfactory, and air pollution poses little or no risk.', badgeBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' };
  }
  if (aqi <= 100) {
    return { status: 'Moderate', color: '#F59E0B', desc: 'Air quality is acceptable; however, sensitive individuals may experience minor irritation.', badgeBg: 'bg-amber-500/10 border-amber-500/30 text-amber-400' };
  }
  if (aqi <= 150) {
    return { status: 'Unhealthy for Sensitive Groups', color: '#F97316', desc: 'Members of sensitive groups may experience health effects. General public unlikely to be affected.', badgeBg: 'bg-orange-500/10 border-orange-500/30 text-orange-400' };
  }
  if (aqi <= 200) {
    return { status: 'Unhealthy', color: '#EF4444', desc: 'Everyone may begin to experience health effects; sensitive groups may experience more serious effects.', badgeBg: 'bg-red-500/10 border-red-500/30 text-red-400' };
  }
  return { status: 'Very Unhealthy / Hazardous', color: '#A855F7', desc: 'Health alert: everyone may experience more serious health impacts. Limit outdoor exposure.', badgeBg: 'bg-purple-500/10 border-purple-500/30 text-purple-400' };
}

// UV Index Status & Guidance
export function getUVMeta(uv) {
  if (uv <= 2) return { status: 'Low', desc: 'Minimal sun protection required. Safe to stay outside.', color: '#10B981' };
  if (uv <= 5) return { status: 'Moderate', desc: 'Wear sunglasses & SPF 30+ sunscreen around midday.', color: '#F59E0B' };
  if (uv <= 7) return { status: 'High', desc: 'Protection required. Seek shade during peak afternoon hours.', color: '#F97316' };
  if (uv <= 10) return { status: 'Very High', desc: 'Extra protection mandatory. Avoid direct midday sun.', color: '#EF4444' };
  return { status: 'Extreme', desc: 'Take all precautions. Unprotected skin burns in minutes.', color: '#A855F7' };
}
