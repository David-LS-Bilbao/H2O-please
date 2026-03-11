const LOCAL_WEATHER_STORAGE_KEY = "localWeatherSnapshot";

function saveLocalWeatherSnapshot(snapshot) {
  localStorage.setItem(LOCAL_WEATHER_STORAGE_KEY, JSON.stringify(snapshot));
}

function getStoredLocalWeatherSnapshot() {
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

function clearStoredLocalWeatherSnapshot() {
  localStorage.removeItem(LOCAL_WEATHER_STORAGE_KEY);
}

export {
  LOCAL_WEATHER_STORAGE_KEY,
  getStoredLocalWeatherSnapshot,
  saveLocalWeatherSnapshot,
  clearStoredLocalWeatherSnapshot,
};
