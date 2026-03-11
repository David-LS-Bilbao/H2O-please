const WEATHER_API_BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const WEATHER_RUNTIME_CONFIG_KEY = "H2O_PLEASE_WEATHER_API_KEY";
const WEATHER_STORAGE_CONFIG_KEY = "H2O_PLEASE_WEATHER_API_KEY";

function getStoredWeatherApiKey() {
  if (!globalThis.localStorage) {
    return null;
  }

  const storedApiKey = globalThis.localStorage.getItem(WEATHER_STORAGE_CONFIG_KEY);

  if (typeof storedApiKey !== "string" || storedApiKey.trim() === "") {
    return null;
  }

  return storedApiKey.trim();
}

function getWeatherApiKey() {
  const runtimeApiKey = globalThis[WEATHER_RUNTIME_CONFIG_KEY];
  const apiKey =
    typeof runtimeApiKey === "string" && runtimeApiKey.trim() !== ""
      ? runtimeApiKey
      : getStoredWeatherApiKey();

  if (typeof apiKey !== "string" || apiKey.trim() === "") {
    throw new Error(
      "Falta la API key del clima. Define window.H2O_PLEASE_WEATHER_API_KEY o guardala en localStorage."
    );
  }

  return apiKey.trim();
}

export {
  WEATHER_API_BASE_URL,
  WEATHER_RUNTIME_CONFIG_KEY,
  WEATHER_STORAGE_CONFIG_KEY,
  getStoredWeatherApiKey,
  getWeatherApiKey,
};
