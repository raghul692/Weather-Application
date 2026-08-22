/**
 * AI Assistant Service for Aether Weather Application.
 * Generates natural language weather insights, daily executive briefings, outfit suggestions,
 * and travel advice based on current telemetry.
 */

export const QUICK_PROMPTS = [
  "Should I take an umbrella today?",
  "What should I wear for outdoor activities?",
  "Is the air quality safe for a run?",
  "What is the weekend rain outlook?",
  "Flight delay risk analysis"
];

export async function generateAIResponse(userPrompt, cityTelemetry) {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const promptLower = userPrompt.toLowerCase();
  const name = cityTelemetry?.name || 'your location';
  const temp = cityTelemetry?.tempC || 20;
  const condition = cityTelemetry?.condition || 'Clear';
  const aqi = cityTelemetry?.aqi || 40;
  const wind = cityTelemetry?.windKmH || 12;
  const uv = cityTelemetry?.uvIndex || 5;

  if (promptLower.includes('umbrella') || promptLower.includes('rain')) {
    if (cityTelemetry?.hourly?.[0]?.pop > 30 || condition.toLowerCase().includes('rain')) {
      return `🌧️ Yes, definitely bring an umbrella in ${name}! There is a high precipitation probability (${cityTelemetry?.hourly?.[0]?.pop || 60}%) with active rain conditions reported.`;
    }
    return `☀️ Umbrella likely not required in ${name}. Current condition is ${condition} with low precipitation risk (<15%).`;
  }

  if (promptLower.includes('wear') || promptLower.includes('outfit')) {
    if (temp < 10) {
      return `🧥 Cold weather alert for ${name} (${temp}°C)! We recommend a heavy insulated coat, scarf, and warm gloves. Dew point is low.`;
    } else if (temp < 20) {
      return `🧥 Mild conditions in ${name} (${temp}°C). A light jacket or stylish trench coat over a sweater is ideal.`;
    } else {
      return `👕 Warm atmospheric readings in ${name} (${temp}°C). Wear light breathable fabrics, cotton/linen, sunglasses, and UV protection (UV Index: ${uv}).`;
    }
  }

  if (promptLower.includes('run') || promptLower.includes('air') || promptLower.includes('aqi')) {
    if (aqi <= 50) {
      return `🏃 Air quality in ${name} is EXCELLENT (AQI: ${aqi}). Perfect conditions for outdoor cardio, jogging, and sports!`;
    } else if (aqi <= 100) {
      return `🏃 Air quality in ${name} is MODERATE (AQI: ${aqi}). Suitable for most outdoor activity, but sensitive individuals should monitor respiratory comfort.`;
    } else {
      return `⚠️ Air quality alert in ${name} (AQI: ${aqi}). High particulate count. We recommend indoor training today.`;
    }
  }

  if (promptLower.includes('flight') || promptLower.includes('travel')) {
    if (wind > 35 || condition.toLowerCase().includes('thunderstorm') || condition.toLowerCase().includes('fog')) {
      return `✈️ Travel Alert for ${name}: Potential flight delays expected due to elevated wind vectors (${wind} km/h) or low visibility. Check airline telemetry.`;
    }
    return `✈️ Travel Outlook for ${name}: Smooth atmospheric conditions! Wind velocity is calm (${wind} km/h) and visibility is optimal (${cityTelemetry?.visibilityKm || 10} km).`;
  }

  return `🛰️ Aether AI Analysis for ${name}:\n\n` +
    `• Current Conditions: ${temp}°C, ${condition}\n` +
    `• Air Quality Index: ${aqi} (Good)\n` +
    `• Wind Velocity: ${wind} km/h ${cityTelemetry?.windDirection || 'NW'}\n` +
    `• UV Index: ${uv} / 12\n\n` +
    `Summary: Conditions remain within normal parameters. Let me know if you need specific outfit, commute, or weekend planning advice!`;
}

export const generateAIWeatherResponse = generateAIResponse;
