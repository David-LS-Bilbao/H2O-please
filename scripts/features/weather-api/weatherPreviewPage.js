import {
  formatTemperature,
  formatWeatherDate,
  formatWeatherTime,
  getLocalWeatherSnapshot,
  getStoredLocalWeatherSnapshot,
  getWeatherStatusIcon,
  getWeatherTimePeriod,
  saveLocalWeatherSnapshot,
} from "./index.js";

// Referencias a los nodos de la card para evitar repetir querySelector en cada render.
const weatherCardElements = {
  card: document.querySelector(".weather-card"),
  city: document.querySelector("#weather-city"),
  status: document.querySelector("#weather-status"),
  temperature: document.querySelector("#weather-temperature"),
  date: document.querySelector("#weather-date"),
  time: document.querySelector("#weather-time"),
};

// Se guarda la descripcion actual para recalcular el icono cuando cambie el periodo dia/noche.
let currentWeatherDescription = "";

// Valida que la pagina donde corre este script tiene todos los nodos necesarios.
function hasWeatherCardElements() {
  return Object.values(weatherCardElements).every(Boolean);
}

// Actualiza fecha, hora y tema visual de la card usando el momento actual del navegador.
function renderLocalDateTime() {
  const now = new Date();
  weatherCardElements.card.dataset.period = getWeatherTimePeriod(now);
  weatherCardElements.date.textContent = formatWeatherDate(now);
  weatherCardElements.time.textContent = formatWeatherTime(now);

  if (currentWeatherDescription) {
    weatherCardElements.status.dataset.icon = getWeatherStatusIcon(currentWeatherDescription, now);
  }
}

// Arranca el reloj local de la card y refresca la UI cada segundo.
function startLocalClock() {
  renderLocalDateTime();
  window.setInterval(renderLocalDateTime, 1000);
}

// Pinta los datos principales del clima en la card.
function renderWeatherCard(snapshot) {
  currentWeatherDescription = snapshot.weatherDescription ?? "";
  weatherCardElements.city.textContent = snapshot.city ?? "Ubicacion actual";
  weatherCardElements.status.textContent = snapshot.weatherDescription ?? "Clima actual";
  weatherCardElements.status.dataset.icon = getWeatherStatusIcon(currentWeatherDescription, new Date());
  weatherCardElements.temperature.textContent = formatTemperature(snapshot.temperatureCelsius);
}

// Estado de error simple para no dejar la card vacia si falla la API o la ubicacion.
function renderWeatherError(message) {
  currentWeatherDescription = "";
  weatherCardElements.status.textContent = message;
  weatherCardElements.status.dataset.icon = "error";
  weatherCardElements.temperature.textContent = "-- °C";
}

// Sincroniza la card con el dato mas reciente y actualiza el cache local.
async function syncWeatherCard() {
  try {
    const snapshot = await getLocalWeatherSnapshot();
    saveLocalWeatherSnapshot(snapshot);
    renderWeatherCard(snapshot);
  } catch (error) {
    renderWeatherError(error.message);
    console.error("No se pudo cargar la vista previa del clima.", error);
  }
}

// Flujo de arranque de la pagina preview:
// 1. valida nodos
// 2. intenta pintar cache
// 3. inicia reloj
// 4. refresca con API
function initWeatherPreviewPage() {
  if (!hasWeatherCardElements()) {
    return;
  }

  const storedSnapshot = getStoredLocalWeatherSnapshot();

  if (storedSnapshot) {
    renderWeatherCard(storedSnapshot);
  }

  startLocalClock();
  syncWeatherCard();
}

initWeatherPreviewPage();
