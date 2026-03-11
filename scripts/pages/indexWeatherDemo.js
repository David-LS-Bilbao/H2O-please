import {
  formatTemperature,
  formatWeatherDate,
  formatWeatherTime,
  getLocalWeatherSnapshot,
  getStoredLocalWeatherSnapshot,
  getWeatherStatusIcon,
  getWeatherTimePeriod,
  saveLocalWeatherSnapshot,
} from "../features/weather-api/index.js";

const weatherCardElements = {
  card: document.querySelector(".weather-card"),
  city: document.querySelector("#weather-city"),
  status: document.querySelector("#weather-status"),
  temperature: document.querySelector("#weather-temperature"),
  date: document.querySelector("#weather-date"),
  time: document.querySelector("#weather-time"),
};

let currentWeatherDescription = "";

function hasWeatherCardElements() {
  return Object.values(weatherCardElements).every(Boolean);
}

function renderLocalDateTime() {
  const now = new Date();
  weatherCardElements.card.dataset.period = getWeatherTimePeriod(now);
  weatherCardElements.date.textContent = formatWeatherDate(now);
  weatherCardElements.time.textContent = formatWeatherTime(now);

  if (currentWeatherDescription) {
    weatherCardElements.status.dataset.icon = getWeatherStatusIcon(currentWeatherDescription, now);
  }
}

function startLocalClock() {
  renderLocalDateTime();
  window.setInterval(renderLocalDateTime, 1000);
}

function renderWeatherCard(snapshot) {
  currentWeatherDescription = snapshot.weatherDescription ?? "";
  weatherCardElements.city.textContent = snapshot.city ?? "Ubicacion actual";
  weatherCardElements.status.textContent = snapshot.weatherDescription ?? "Clima actual";
  weatherCardElements.status.dataset.icon = getWeatherStatusIcon(currentWeatherDescription, new Date());
  weatherCardElements.temperature.textContent = formatTemperature(snapshot.temperatureCelsius);
}

function renderWeatherError(message) {
  currentWeatherDescription = "";
  weatherCardElements.status.textContent = message;
  weatherCardElements.status.dataset.icon = "error";
  weatherCardElements.temperature.textContent = "-- °C";
}

async function syncWeatherCard() {
  try {
    const snapshot = await getLocalWeatherSnapshot();
    saveLocalWeatherSnapshot(snapshot);
    renderWeatherCard(snapshot);
  } catch (error) {
    renderWeatherError(error.message);
    console.error("No se pudo cargar el clima del index de prueba.", error);
  }
}

function initIndexWeatherDemo() {
  if (!hasWeatherCardElements()) {
    return;
  }

  // Ejemplo de integracion: la pagina solo importa la feature, lee cache y pinta la card.
  const storedSnapshot = getStoredLocalWeatherSnapshot();

  if (storedSnapshot) {
    renderWeatherCard(storedSnapshot);
  }

  startLocalClock();
  syncWeatherCard();
}

initIndexWeatherDemo();
