// API publica minima de la feature: solo exportamos lo que usan el dashboard y
// la preview, y dejamos el resto de modulos como detalle interno.
export {
  getStoredLocalWeatherSnapshot,
  saveLocalWeatherSnapshot,
} from "./weatherCache.js";

export { getLocalWeatherSnapshot } from "./weatherService.js";

export {
  mountWeatherCard,
  createWeatherDomManager,
} from "./weatherDomManager.js";
