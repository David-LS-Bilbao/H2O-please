// Clave unica donde se guarda el ultimo snapshot del clima en localStorage.
const LOCAL_WEATHER_STORAGE_KEY = "localWeatherSnapshot";

// Persiste el ultimo resultado util para poder pintar la UI sin esperar a la API.
function saveLocalWeatherSnapshot(snapshot) {
  localStorage.setItem(LOCAL_WEATHER_STORAGE_KEY, JSON.stringify(snapshot));
}

// Recupera el ultimo snapshot guardado.
// Si el JSON estuviera corrupto, se devuelve null para no romper la interfaz.
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

// Limpia el cache local del clima cuando haga falta reiniciar estado.
function clearStoredLocalWeatherSnapshot() {
  localStorage.removeItem(LOCAL_WEATHER_STORAGE_KEY);
}

export {
  LOCAL_WEATHER_STORAGE_KEY,
  getStoredLocalWeatherSnapshot,
  saveLocalWeatherSnapshot,
  clearStoredLocalWeatherSnapshot,
};
