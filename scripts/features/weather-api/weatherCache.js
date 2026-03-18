const LOCAL_WEATHER_STORAGE_KEY = "localWeatherSnapshot";

function canUseLocalStorage() {
  return (
    typeof globalThis.localStorage?.getItem === "function" &&
    typeof globalThis.localStorage?.setItem === "function" &&
    typeof globalThis.localStorage?.removeItem === "function"
  );
}

function saveLocalWeatherSnapshot(snapshot) {
  if (!canUseLocalStorage()) {
    return;
  }

  localStorage.setItem(LOCAL_WEATHER_STORAGE_KEY, JSON.stringify(snapshot));
}

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
