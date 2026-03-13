import {
  createWeatherDomManager,
  getLocalWeatherSnapshot,
  getStoredLocalWeatherSnapshot,
  mountWeatherCard,
  saveLocalWeatherSnapshot,
} from "../features/weather-api/index.js";

async function syncWeatherCard(weatherDomManager, contextLabel) {
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
        `No se pudo refrescar el clima del ${contextLabel}. Se muestra el ultimo dato guardado.`,
        error
      );
      return;
    }

    weatherDomManager.renderWeatherError(error.message);
    console.error(`No se pudo cargar el clima del ${contextLabel}.`, error);
  }
}

function applyWeatherCardClassName(weatherCard, cardClassName) {
  if (!weatherCard || typeof cardClassName !== "string") {
    return;
  }

  cardClassName
    .split(/\s+/)
    .filter(Boolean)
    .forEach((className) => weatherCard.classList.add(className));
}

export function initWeatherCardIntegration({
  mountTarget,
  mountPosition = "afterbegin",
  cardClassName = "",
  contextLabel = "pagina",
  clearMountTarget = false,
} = {}) {
  if (!mountTarget) {
    return null;
  }

  if (clearMountTarget) {
    // El dashboard parte de un placeholder simple; lo vaciamos antes de montar la card.
    mountTarget.textContent = "";
  }

  const weatherCard = mountWeatherCard(mountTarget, mountPosition);
  applyWeatherCardClassName(weatherCard, cardClassName);

  const weatherDomManager = createWeatherDomManager();

  if (!weatherDomManager.hasRequiredElements) {
    return null;
  }

  // Pintamos primero cache local para evitar parpadeo mientras llega la API.
  const storedSnapshot = getStoredLocalWeatherSnapshot();

  if (storedSnapshot) {
    weatherDomManager.renderWeatherCard(storedSnapshot);
  }

  weatherDomManager.startLocalClock();
  syncWeatherCard(weatherDomManager, contextLabel);

  return weatherDomManager;
}
