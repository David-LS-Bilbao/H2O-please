const DEFAULT_WEATHER_LOCALE = "es-ES";
const WEATHER_HOUR_FORMAT_LOCALE = "en-GB";
const TEMPERATURE_DECIMAL_DIGITS = 1;
const UTC_TIME_ZONE = "UTC";
const LOCAL_CLOCK_INTERVAL_MS = 1000;
const WEATHER_DAY_START_HOUR = 7;
const WEATHER_NIGHT_START_HOUR = 20;

// La feature se ha dejado plana a proposito: el render, el formateo y las
// heuristicas visuales viven juntos para reducir archivos en esta app de prueba.
const WEATHER_CARD_SELECTORS = {
  card: ".weather-card",
  city: "#weather-city",
  status: "#weather-status",
  temperature: "#weather-temperature",
  date: "#weather-date",
  time: "#weather-time",
};

const WEATHER_CARD_TEXT = {
  defaultCity: "Ubicacion actual",
  loadingStatus: "Cargando clima...",
  defaultStatus: "Clima actual",
  defaultTemperature: "-- °C",
  defaultDate: "--/--/----",
  defaultTime: "--:--:--",
  stalePrefix: "Ultimo dato guardado.",
  staleFallbackMessage: "No se pudo actualizar el clima.",
};

const WEATHER_CARD_MARKUP = `
  <section class="weather-card dashboard-weather-card" aria-live="polite">
    <div class="weather-card__top weather-card__header">
      <div class="weather-card__heading">
        <h2 id="weather-city">${WEATHER_CARD_TEXT.defaultCity}</h2>
      </div>
      <p id="weather-status" class="weather-card__status">${WEATHER_CARD_TEXT.loadingStatus}</p>
    </div>
    <div class="weather-card__main weather-card__content">
      <div class="weather-card__temperature-block">
        <p
          id="weather-temperature"
          class="weather-card__temperature"
          aria-label="Temperatura actual"
        >
          ${WEATHER_CARD_TEXT.defaultTemperature}
        </p>
      </div>
      <div class="weather-card__meta weather-card__datetime">
        <div class="weather-card__meta-row">
          <p
            id="weather-date"
            class="weather-card__meta-item"
            aria-label="Fecha local"
          >
            ${WEATHER_CARD_TEXT.defaultDate}
          </p>
        </div>
        <div class="weather-card__meta-row">
          <p
            id="weather-time"
            class="weather-card__meta-item"
            aria-label="Hora local"
          >
            ${WEATHER_CARD_TEXT.defaultTime}
          </p>
        </div>
      </div>
    </div>
  </section>
`;

function formatTemperature(temperatureCelsius) {
  return `${temperatureCelsius.toFixed(TEMPERATURE_DECIMAL_DIGITS)} °C`;
}

function resolveFormatConfig(localeOrOptions) {
  if (typeof localeOrOptions === "string" || localeOrOptions === undefined) {
    return {
      locale: localeOrOptions ?? DEFAULT_WEATHER_LOCALE,
      timeZone: null,
      useUtc: false,
    };
  }

  return {
    locale: localeOrOptions.locale ?? DEFAULT_WEATHER_LOCALE,
    timeZone:
      typeof localeOrOptions.timeZone === "string"
        ? localeOrOptions.timeZone
        : null,
    useUtc: localeOrOptions.useUtc === true,
  };
}

function resolveIntlTimeZone({ timeZone, useUtc }) {
  if (typeof timeZone === "string" && timeZone.trim() !== "") {
    return timeZone;
  }

  if (useUtc) {
    return UTC_TIME_ZONE;
  }

  return undefined;
}

function formatWeatherDate(date, localeOrOptions = DEFAULT_WEATHER_LOCALE) {
  const { locale, timeZone, useUtc } = resolveFormatConfig(localeOrOptions);

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: resolveIntlTimeZone({ timeZone, useUtc }),
  }).format(date);
}

function formatWeatherTime(date, localeOrOptions = DEFAULT_WEATHER_LOCALE) {
  const { locale, timeZone, useUtc } = resolveFormatConfig(localeOrOptions);

  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: resolveIntlTimeZone({ timeZone, useUtc }),
  }).format(date);
}

function normalizeWeatherDescription(description = "") {
  return description.toLowerCase().trim();
}

function getWeatherHours(date = new Date(), options = {}) {
  if (typeof options.timeZone === "string" && options.timeZone.trim() !== "") {
    const formattedHour = new Intl.DateTimeFormat(WEATHER_HOUR_FORMAT_LOCALE, {
      hour: "2-digit",
      hourCycle: "h23",
      timeZone: options.timeZone,
    }).format(date);

    return Number.parseInt(formattedHour, 10);
  }

  if (options.useUtc) {
    return date.getUTCHours();
  }

  return date.getHours();
}

function getWeatherTimePeriod(date = new Date(), options = {}) {
  const hours = getWeatherHours(date, options);

  if (hours >= WEATHER_DAY_START_HOUR && hours < WEATHER_NIGHT_START_HOUR) {
    return "day";
  }

  return "night";
}

function getWeatherStatusIcon(description, date = new Date(), options = {}) {
  const normalizedDescription = normalizeWeatherDescription(description);

  if (
    normalizedDescription.includes("tormenta") ||
    normalizedDescription.includes("trueno") ||
    normalizedDescription.includes("electrica")
  ) {
    return "storm";
  }

  if (
    normalizedDescription.includes("lluv") ||
    normalizedDescription.includes("chubasco") ||
    normalizedDescription.includes("aguacero")
  ) {
    return "rain";
  }

  if (
    normalizedDescription.includes("nieve") ||
    normalizedDescription.includes("granizo")
  ) {
    return "snow";
  }

  if (
    normalizedDescription.includes("niebla") ||
    normalizedDescription.includes("bruma") ||
    normalizedDescription.includes("neblina") ||
    normalizedDescription.includes("calima") ||
    normalizedDescription.includes("humo")
  ) {
    return "mist";
  }

  if (
    normalizedDescription.includes("nube") ||
    normalizedDescription.includes("nub") ||
    normalizedDescription.includes("cubierto")
  ) {
    return "cloud";
  }

  return getWeatherTimePeriod(date, options) === "day" ? "sun" : "moon";
}

function getWeatherCardElements(root = document) {
  return {
    card: root.querySelector(WEATHER_CARD_SELECTORS.card),
    city: root.querySelector(WEATHER_CARD_SELECTORS.city),
    status: root.querySelector(WEATHER_CARD_SELECTORS.status),
    temperature: root.querySelector(WEATHER_CARD_SELECTORS.temperature),
    date: root.querySelector(WEATHER_CARD_SELECTORS.date),
    time: root.querySelector(WEATHER_CARD_SELECTORS.time),
  };
}

function hasWeatherCardElements(elements) {
  return Object.values(elements).every(Boolean);
}

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

// Dashboard y preview comparten este gestor para que ambos rendericen la card
// exactamente igual y la logica de UI no se duplique.
export function createWeatherDomManager(root = document) {
  const elements = getWeatherCardElements(root);
  const hasRequiredElements = hasWeatherCardElements(elements);
  let currentWeatherDescription = "";
  let currentTimeZone = null;
  let currentTimeZoneOffsetSeconds = null;
  let localClockTimerId = null;

  // Si la API devuelve timezone real la usamos. Si solo devuelve offset, se
  // recrea la hora local desplazando la fecha base y formateando en UTC.
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

  // La fecha y la hora se recalculan a partir del contexto de la ciudad, no de
  // la hora local del navegador cuando el proveedor aporta timezone u offset.
  function renderLocalDateTime() {
    if (!hasRequiredElements) {
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
    if (!hasRequiredElements) {
      return null;
    }

    renderLocalDateTime();

    if (localClockTimerId !== null) {
      window.clearInterval(localClockTimerId);
    }

    localClockTimerId = window.setInterval(
      renderLocalDateTime,
      LOCAL_CLOCK_INTERVAL_MS
    );
    return localClockTimerId;
  }

  function renderWeatherCard(snapshot) {
    if (!hasRequiredElements || typeof snapshot?.temperatureCelsius !== "number") {
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
    elements.city.textContent = snapshot.city ?? WEATHER_CARD_TEXT.defaultCity;
    elements.status.textContent =
      snapshot.weatherDescription ?? WEATHER_CARD_TEXT.defaultStatus;
    elements.temperature.textContent = formatTemperature(snapshot.temperatureCelsius);
    renderLocalDateTime();
  }

  // Este mensaje se usa cuando hay cache valido pero el refresco contra la API
  // falla; asi diferenciamos "dato antiguo" de "error sin datos".
  function renderWeatherRefreshWarning(message) {
    if (!hasRequiredElements) {
      return;
    }

    elements.status.textContent =
      typeof message === "string" && message.trim() !== ""
        ? `${WEATHER_CARD_TEXT.stalePrefix} ${message.trim()}`
        : `${WEATHER_CARD_TEXT.stalePrefix} ${WEATHER_CARD_TEXT.staleFallbackMessage}`;
  }

  function renderWeatherError(message) {
    if (!hasRequiredElements) {
      return;
    }

    currentWeatherDescription = "";
    currentTimeZone = null;
    currentTimeZoneOffsetSeconds = null;
    elements.status.textContent =
      typeof message === "string" && message.trim() !== ""
        ? message.trim()
        : WEATHER_CARD_TEXT.staleFallbackMessage;
    elements.status.dataset.icon = "error";
    elements.temperature.textContent = WEATHER_CARD_TEXT.defaultTemperature;
    elements.date.textContent = WEATHER_CARD_TEXT.defaultDate;
    elements.time.textContent = WEATHER_CARD_TEXT.defaultTime;
  }

  return {
    elements,
    hasRequiredElements,
    startLocalClock,
    renderWeatherCard,
    renderWeatherRefreshWarning,
    renderWeatherError,
  };
}
