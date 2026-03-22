const LOCAL_WEATHER_STORAGE_KEY = "localWeatherSnapshot";

function canUseLocalStorage() {
  return (
    typeof globalThis.localStorage?.getItem === "function" &&
    typeof globalThis.localStorage?.setItem === "function" &&
    typeof globalThis.localStorage?.removeItem === "function"
  );
}

// Persistimos el snapshot ya normalizado para poder reutilizarlo sin volver a
// transformar respuestas crudas de proveedores externos.
function saveLocalWeatherSnapshot(snapshot) {
  if (!canUseLocalStorage()) {
    return;
  }

  localStorage.setItem(LOCAL_WEATHER_STORAGE_KEY, JSON.stringify(snapshot));
}

// Si el cache esta corrupto, devolvemos null y dejamos que la feature vuelva a
// pedir datos en vez de romper el render del dashboard.
function getStoredLocalWeatherSnapshot() {
  if (!canUseLocalStorage()) {
    return null;
  }

  const storedSnapshot = localStorage.getItem(LOCAL_WEATHER_STORAGE_KEY);

  if (!storedSnapshot) {
    return null;
  }

  try {
    return JSON.parse(storedSnapshot);
  } catch (error) {
    console.error("No se pudo leer el cache local del clima.", error);
    return null;
  }
}

export {
  LOCAL_WEATHER_STORAGE_KEY,
  getStoredLocalWeatherSnapshot,
  saveLocalWeatherSnapshot,
};
