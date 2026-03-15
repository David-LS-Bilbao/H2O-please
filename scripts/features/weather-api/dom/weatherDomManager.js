import {
  formatTemperature,
  formatWeatherDate,
  formatWeatherTime,
} from "../weatherFormatters.js";
import {
  getWeatherStatusIcon,
  getWeatherTimePeriod,
} from "../weatherVisuals.js";

const WEATHER_CARD_SELECTORS = {
  card: ".weather-card",
  city: "#weather-city",
  status: "#weather-status",
  temperature: "#weather-temperature",
  date: "#weather-date",
  time: "#weather-time",
};

const WEATHER_CARD_MARKUP = `
  <section class="weather-card dashboard-weather-card" aria-live="polite">
    <div class="weather-card__top weather-card__header">
      <div class="weather-card__heading">
        <h2 id="weather-city">Ubicacion actual</h2>
      </div>
      <p id="weather-status" class="weather-card__status">Cargando clima...</p>
    </div>
    <div class="weather-card__main weather-card__content">
      <div class="weather-card__temperature-block">
        <p
          id="weather-temperature"
          class="weather-card__temperature"
          aria-label="Temperatura actual"
        >
          -- °C
        </p>
      </div>
      <div class="weather-card__meta weather-card__datetime">
        <div class="weather-card__meta-row">
          <p
            id="weather-date"
            class="weather-card__meta-item"
            aria-label="Fecha local"
          >
            --/--/----
          </p>
        </div>
        <div class="weather-card__meta-row">
          <p
            id="weather-time"
            class="weather-card__meta-item"
            aria-label="Hora local"
          >
            --:--:--
          </p>
        </div>
      </div>
    </div>
  </section>
`;

export function mountWeatherCard(targetElement, position = "afterbegin") {
  if (!targetElement) {
    return null;
  }

  const existingCard = targetElement.querySelector(WEATHER_CARD_SELECTORS.card);

  if (existingCard) {
    return existingCard;
  }

  targetElement.insertAdjacentHTML(position, WEATHER_CARD_MARKUP.trim());
  return targetElement.querySelector(WEATHER_CARD_SELECTORS.card);
}

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

export function hasWeatherCardElements(elements) {
  return Object.values(elements).every(Boolean);
}

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

    elements.status.textContent =
      typeof message === "string" && message.trim() !== ""
        ? `Ultimo dato guardado. ${message.trim()}`
        : "Ultimo dato guardado. No se pudo actualizar el clima.";
  }

  function renderWeatherError(message) {
    if (!hasWeatherCardElements(elements)) {
      return;
    }

    currentWeatherDescription = "";
    elements.status.textContent = message;
    elements.status.dataset.icon = "error";
    elements.temperature.textContent = "-- °C";
    elements.date.textContent = "--/--/----";
    elements.time.textContent = "--:--:--";
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
