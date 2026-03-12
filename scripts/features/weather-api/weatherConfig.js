// URL base del endpoint actual de OpenWeather que usa esta feature.
const WEATHER_API_BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
// Nombre de la variable global que puede inyectar la key en runtime.
const WEATHER_RUNTIME_CONFIG_KEY = "H2O_PLEASE_WEATHER_API_KEY";
// Nombre de la clave opcional para guardar la key en localStorage durante desarrollo.
const WEATHER_STORAGE_CONFIG_KEY = "H2O_PLEASE_WEATHER_API_KEY";

// Lee la key guardada en localStorage si existe.
// Se usa como fallback para no obligar a inyectarla siempre en window.
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

// Resuelve la API key de trabajo con esta prioridad:
// 1. variable global inyectada por un script local
// 2. valor guardado en localStorage
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
