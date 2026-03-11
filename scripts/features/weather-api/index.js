// Punto de entrada publico de la feature.
// Reexporta toda la API para que las paginas importen desde un unico lugar.
export {
  WEATHER_API_BASE_URL,
  WEATHER_RUNTIME_CONFIG_KEY,
  WEATHER_STORAGE_CONFIG_KEY,
  getStoredWeatherApiKey,
  getWeatherApiKey,
} from "./weatherConfig.js";
export {
  buildWeatherForecastUrl,
  fetchWeatherForecast,
  getUserLocation,
} from "./weatherApiClient.js";
export {
  LOCAL_WEATHER_STORAGE_KEY,
  getStoredLocalWeatherSnapshot,
  saveLocalWeatherSnapshot,
  clearStoredLocalWeatherSnapshot,
} from "./weatherCache.js";
export {
  formatTemperature,
  formatWeatherDate,
  formatWeatherTime,
} from "./weatherFormatters.js";
export {
  mapWeatherSnapshot,
  getLocalWeatherSnapshot,
} from "./weatherService.js";
export {
  getWeatherStatusIcon,
  getWeatherTimePeriod,
} from "./weatherVisuals.js";
export {
  getWeatherCardElements,
  hasWeatherCardElements,
  createWeatherDomManager,
} from "./dom/weatherDomManager.js";
