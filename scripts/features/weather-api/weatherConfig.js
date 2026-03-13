// URL base del endpoint actual de OpenWeather que usa esta feature.
const WEATHER_API_BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
// Endpoint sin API key para usar como fallback automatico.
const OPEN_METEO_API_BASE_URL = "https://api.open-meteo.com/v1/forecast";
// Endpoint de reverse geocoding pensado para uso cliente y sin API key local.
const REVERSE_GEOCODE_API_BASE_URL =
  "https://api.bigdatacloud.net/data/reverse-geocode-client";
// Nombre de la variable global que puede inyectar la key en runtime.
const WEATHER_RUNTIME_CONFIG_KEY = "H2O_PLEASE_WEATHER_API_KEY";
// Nombre de la clave opcional para guardar la key en localStorage durante desarrollo.
const WEATHER_STORAGE_CONFIG_KEY = "H2O_PLEASE_WEATHER_API_KEY";

// Lee la key guardada en localStorage si existe.
// Se usa como fallback para no obligar a inyectarla siempre en window.
function getStoredWeatherApiKey() {
  if (
    !globalThis.localStorage ||
    typeof globalThis.localStorage.getItem !== "function"
  ) {
    return null;
  }

  const storedApiKey = globalThis.localStorage.getItem(WEATHER_STORAGE_CONFIG_KEY);

  if (typeof storedApiKey !== "string" || storedApiKey.trim() === "") {
    return null;
  }

  return storedApiKey.trim();
}

// Devuelve la key si existe, sin forzar error para que la feature pueda usar
// un proveedor alternativo cuando no hay configuracion local todavia.
function getOptionalWeatherApiKey() {
  const runtimeApiKey = globalThis[WEATHER_RUNTIME_CONFIG_KEY];
  const apiKey =
    typeof runtimeApiKey === "string" && runtimeApiKey.trim() !== ""
      ? runtimeApiKey
      : getStoredWeatherApiKey();

  if (typeof apiKey !== "string" || apiKey.trim() === "") {
    return null;
  }

  return apiKey.trim();
}

function hasWeatherApiKey() {
  return getOptionalWeatherApiKey() !== null;
}

// Resuelve la API key de trabajo con esta prioridad:
// 1. variable global inyectada por un script local
// 2. valor guardado en localStorage
function getWeatherApiKey() {
  const apiKey = getOptionalWeatherApiKey();

  if (typeof apiKey !== "string" || apiKey.trim() === "") {
    throw new Error(
      "Falta la API key del clima. Define window.H2O_PLEASE_WEATHER_API_KEY o guardala en localStorage."
    );
  }

  return apiKey.trim();
}

export {
  OPEN_METEO_API_BASE_URL,
  REVERSE_GEOCODE_API_BASE_URL,
  WEATHER_API_BASE_URL,
  WEATHER_RUNTIME_CONFIG_KEY,
  WEATHER_STORAGE_CONFIG_KEY,
  getStoredWeatherApiKey,
  getOptionalWeatherApiKey,
  hasWeatherApiKey,
  getWeatherApiKey,
};
