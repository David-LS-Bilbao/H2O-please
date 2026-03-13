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
  let currentTimeZone = null;
  let currentTimeZoneOffsetSeconds = null;
  let localClockTimerId = null;

  function getLocalDateTimeContext(baseDate = new Date()) {
    if (typeof currentTimeZone === "string" && currentTimeZone.trim() !== "") {
      return {
        date: baseDate,
        timeZone: currentTimeZone,
      };
    }

    if (typeof currentTimeZoneOffsetSeconds === "number") {
      return {
        date: new Date(baseDate.getTime() + currentTimeZoneOffsetSeconds * 1000),
        useUtc: true,
      };
    }

    return {
      date: baseDate,
    };
  }

  function renderLocalDateTime() {
    if (!hasWeatherCardElements(elements)) {
      return;
    }

    const dateTimeContext = getLocalDateTimeContext();
    elements.card.dataset.period = getWeatherTimePeriod(
      dateTimeContext.date,
      dateTimeContext
    );
    elements.date.textContent = formatWeatherDate(
      dateTimeContext.date,
      dateTimeContext
    );
    elements.time.textContent = formatWeatherTime(
      dateTimeContext.date,
      dateTimeContext
    );

    if (currentWeatherDescription) {
      elements.status.dataset.icon = getWeatherStatusIcon(
        currentWeatherDescription,
        dateTimeContext.date,
        dateTimeContext
      );
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
    currentTimeZone =
      typeof snapshot.timezone === "string" && snapshot.timezone.trim() !== ""
        ? snapshot.timezone
        : null;
    currentTimeZoneOffsetSeconds =
      typeof snapshot.timezoneOffsetSeconds === "number"
        ? snapshot.timezoneOffsetSeconds
        : null;
    elements.city.textContent = snapshot.city ?? "Ubicacion actual";
    elements.status.textContent = snapshot.weatherDescription ?? "Clima actual";
    elements.temperature.textContent = formatTemperature(snapshot.temperatureCelsius);
    renderLocalDateTime();
  }

  function renderWeatherRefreshWarning(message) {
    if (!hasWeatherCardElements(elements)) {
      return;
    }

    const warningMessage =
      typeof message === "string" && message.trim() !== ""
        ? `Ultimo dato guardado. ${message.trim()}`
        : "Ultimo dato guardado. No se pudo actualizar el clima.";

    elements.status.textContent = warningMessage;
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
    renderWeatherRefreshWarning,
    renderWeatherError,
  };
}
