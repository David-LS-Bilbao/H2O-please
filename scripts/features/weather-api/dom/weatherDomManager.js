import {
  formatTemperature,
  formatWeatherDate,
  formatWeatherTime,
} from "../weatherFormatters.js";
import {
  getWeatherStatusIcon,
  getWeatherTimePeriod,
} from "../weatherVisuals.js";

// Selectores unicos de la card para que todas las paginas reutilicen la misma
// estructura HTML y el mismo flujo de render.
const WEATHER_CARD_SELECTORS = {
  card: ".weather-card",
  city: "#weather-city",
  status: "#weather-status",
  temperature: "#weather-temperature",
  date: "#weather-date",
  time: "#weather-time",
};

// Devuelve las referencias del DOM que la feature necesita para pintar la card.
export function getWeatherCardElements(root = document) {
  return {
    card: root.querySelector(WEATHER_CARD_SELECTORS.card),
    city: root.querySelector(WEATHER_CARD_SELECTORS.city),
    status: root.querySelector(WEATHER_CARD_SELECTORS.status),
    temperature: root.querySelector(WEATHER_CARD_SELECTORS.temperature),
    date: root.querySelector(WEATHER_CARD_SELECTORS.date),
    time: root.querySelector(WEATHER_CARD_SELECTORS.time),
  };
}

// Valida que la pagina contiene todos los nodos necesarios antes de renderizar.
export function hasWeatherCardElements(elements) {
  return Object.values(elements).every(Boolean);
}

// Crea un pequeno gestor de DOM para centralizar la logica de pintado de la card
// y evitar duplicarla entre la preview y las futuras pantallas de la aplicacion.
export function createWeatherDomManager(root = document) {
  const elements = getWeatherCardElements(root);
  let currentWeatherDescription = "";
  let localClockTimerId = null;

  function renderLocalDateTime() {
    if (!hasWeatherCardElements(elements)) {
      return;
    }

    const now = new Date();
    elements.card.dataset.period = getWeatherTimePeriod(now);
    elements.date.textContent = formatWeatherDate(now);
    elements.time.textContent = formatWeatherTime(now);

    if (currentWeatherDescription) {
      elements.status.dataset.icon = getWeatherStatusIcon(currentWeatherDescription, now);
    }
  }

  function startLocalClock() {
    if (!hasWeatherCardElements(elements)) {
      return null;
    }

    renderLocalDateTime();

    if (localClockTimerId !== null) {
      window.clearInterval(localClockTimerId);
    }

    localClockTimerId = window.setInterval(renderLocalDateTime, 1000);
    return localClockTimerId;
  }

  function stopLocalClock() {
    if (localClockTimerId === null) {
      return;
    }

    window.clearInterval(localClockTimerId);
    localClockTimerId = null;
  }

  function renderWeatherCard(snapshot) {
    if (!hasWeatherCardElements(elements)) {
      return;
    }

    currentWeatherDescription = snapshot.weatherDescription ?? "";
    elements.city.textContent = snapshot.city ?? "Ubicacion actual";
    elements.status.textContent = snapshot.weatherDescription ?? "Clima actual";
    elements.status.dataset.icon = getWeatherStatusIcon(currentWeatherDescription, new Date());
    elements.temperature.textContent = formatTemperature(snapshot.temperatureCelsius);
  }

  function renderWeatherError(message) {
    if (!hasWeatherCardElements(elements)) {
      return;
    }

    currentWeatherDescription = "";
    elements.status.textContent = message;
    elements.status.dataset.icon = "error";
    elements.temperature.textContent = "-- °C";
  }

  return {
    elements,
    hasRequiredElements: hasWeatherCardElements(elements),
    renderLocalDateTime,
    startLocalClock,
    stopLocalClock,
    renderWeatherCard,
    renderWeatherError,
  };
}
