import {
  createWeatherDomManager,
  getLocalWeatherSnapshot,
  getStoredLocalWeatherSnapshot,
  mountWeatherCard,
  saveLocalWeatherSnapshot,
} from "../features/weather-api/index.js";

// Solo reutilizamos el cache cuando el problema es de red o proveedor. Si
// falla la geolocalizacion, preferimos mostrar el error real al usuario.
function shouldUseStoredSnapshotFallback(error) {
  const normalizedMessage =
    typeof error?.message === "string" ? error.message.toLowerCase() : "";

  return !(
    normalizedMessage.includes("ubicacion") ||
    normalizedMessage.includes("geolocalizacion") ||
    normalizedMessage.includes("localhost") ||
    normalizedMessage.includes("https") ||
    normalizedMessage.includes("secure") ||
    normalizedMessage.includes("contexto seguro")
  );
}

// La integracion del dashboard sigue un arranque optimista:
// pinta cache primero y luego intenta refrescar sin bloquear la vista.
async function syncWeatherCard(weatherDomManager, contextLabel) {
  try {
    const snapshot = await getLocalWeatherSnapshot();
    saveLocalWeatherSnapshot(snapshot);
    weatherDomManager.renderWeatherCard(snapshot);
  } catch (error) {
    const storedSnapshot = getStoredLocalWeatherSnapshot();

    if (storedSnapshot && shouldUseStoredSnapshotFallback(error)) {
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

export function initWeatherCardIntegration({
  mountTarget,
  mountPosition = "afterbegin",
  contextLabel = "pagina",
  clearMountTarget = false,
} = {}) {
  if (!mountTarget) {
    return null;
  }

  if (clearMountTarget) {
    mountTarget.textContent = "";
  }

  const weatherCard = mountWeatherCard(mountTarget, mountPosition);

  if (!weatherCard) {
    return null;
  }

  const weatherDomManager = createWeatherDomManager(mountTarget);

  if (!weatherDomManager.hasRequiredElements) {
    return null;
  }

  const storedSnapshot = getStoredLocalWeatherSnapshot();

  if (storedSnapshot) {
    weatherDomManager.renderWeatherCard(storedSnapshot);
  }

  weatherDomManager.startLocalClock();
  syncWeatherCard(weatherDomManager, contextLabel);

  return weatherDomManager;
}
