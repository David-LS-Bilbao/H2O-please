import {
  createWeatherDomManager,
  getLocalWeatherSnapshot,
  getStoredLocalWeatherSnapshot,
  saveLocalWeatherSnapshot,
} from "../features/weather-api/index.js";

// Ejemplo real de integracion: la pagina usa el DomManager compartido y deja la
// logica de render de la card dentro de la propia feature.
const weatherDomManager = createWeatherDomManager();

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
        "No se pudo refrescar el clima del index de prueba. Se muestra el ultimo dato guardado.",
        error
      );
      return;
    }

    weatherDomManager.renderWeatherError(error.message);
    console.warn("No se pudo cargar el clima del index de prueba.", error);
  }
}

function initIndexWeatherDemo() {
  if (!weatherDomManager.hasRequiredElements) {
    return;
  }

  // Ejemplo de integracion: la pagina solo importa la feature, crea el DomManager,
  // lee cache y deja el resto del render en la capa compartida.
  const storedSnapshot = getStoredLocalWeatherSnapshot();

  if (storedSnapshot) {
    weatherDomManager.renderWeatherCard(storedSnapshot);
  }

  weatherDomManager.startLocalClock();
  syncWeatherCard();
}

initIndexWeatherDemo();
