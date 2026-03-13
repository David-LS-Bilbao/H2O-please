import {
  createWeatherDomManager,
  getLocalWeatherSnapshot,
  getStoredLocalWeatherSnapshot,
  saveLocalWeatherSnapshot,
} from "./index.js";

// La preview reutiliza el DomManager de la feature para que el ejemplo y las
// integraciones reales compartan exactamente la misma logica de render.
const weatherDomManager = createWeatherDomManager();

// Sincroniza la card con el dato mas reciente y actualiza el cache local.
async function syncWeatherCard() {
  try {
    const snapshot = await getLocalWeatherSnapshot();
    saveLocalWeatherSnapshot(snapshot);
    weatherDomManager.renderWeatherCard(snapshot);
  } catch (error) {
    const storedSnapshot = getStoredLocalWeatherSnapshot();

    if (storedSnapshot) {
      weatherDomManager.renderWeatherCard(storedSnapshot);
      weatherDomManager.renderWeatherRefreshWarning(error.message);
      console.warn(
        "No se pudo refrescar la vista previa del clima. Se muestra el ultimo dato guardado.",
        error
      );
      return;
    }

    weatherDomManager.renderWeatherError(error.message);
    console.error("No se pudo cargar la vista previa del clima.", error);
  }
}

// Flujo de arranque de la pagina preview:
// 1. valida nodos
// 2. intenta pintar cache
// 3. inicia reloj
// 4. refresca con API
function initWeatherPreviewPage() {
  if (!weatherDomManager.hasRequiredElements) {
    return;
  }

  const storedSnapshot = getStoredLocalWeatherSnapshot();

  if (storedSnapshot) {
    weatherDomManager.renderWeatherCard(storedSnapshot);
  }

  weatherDomManager.startLocalClock();
  syncWeatherCard();
}

initWeatherPreviewPage();
