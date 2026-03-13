import {
  createWeatherDomManager,
  getLocalWeatherSnapshot,
  getStoredLocalWeatherSnapshot,
  mountWeatherCard,
  saveLocalWeatherSnapshot,
} from "../features/weather-api/index.js";

// funcion asincrona que sincroniza la card del clima.
async function syncWeatherCard(weatherDomManager) {
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
    console.error("No se pudo cargar el clima del index de prueba.", error);
  }
}

function initIndexWeatherDemo() {
  // En esta pagina la card no vive en el HTML. Se monta desde la feature para
  // simular una integracion tipo import desde un archivo propio.
  const weatherMountTarget =
    document.querySelector(".header-top") ?? document.querySelector(".app-layout");

  if (!weatherMountTarget) {
    return;
  }

  const weatherCard = mountWeatherCard(weatherMountTarget, "afterend");

  if (weatherCard) {
    weatherCard.classList.add("dashboard-weather-card");
  }

  // Ejemplo real de integracion: la pagina usa el DomManager compartido y deja la
  // logica de render de la card dentro de la propia feature.
  const weatherDomManager = createWeatherDomManager();

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
  syncWeatherCard(weatherDomManager);
}

initIndexWeatherDemo();
