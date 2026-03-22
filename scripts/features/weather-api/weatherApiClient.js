import {
  OPEN_METEO_API_BASE_URL,
  REVERSE_GEOCODE_API_BASE_URL,
  WEATHER_API_BASE_URL,
  getWeatherApiKey,
  hasWeatherApiKey,
} from "./weatherConfig.js";

const DEFAULT_LOCATION_LANGUAGE = "es";
const OPEN_METEO_CURRENT_FIELDS = "temperature_2m,weather_code,is_day";
const OPEN_METEO_DAILY_FIELDS = "temperature_2m_max";
const OPEN_METEO_FORECAST_DAYS = "1";
const GEOLOCATION_SECURE_CONTEXT_MESSAGE =
  "La ubicacion solo funciona en un contexto seguro. Abre la app en http://localhost:5500 o por HTTPS.";
const DEFAULT_GEOLOCATION_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 15000,
  maximumAge: 0,
};

const GEOLOCATION_ERROR_MESSAGES = {
  1: "Permite la ubicacion en el navegador para ver tu clima local.",
  2: "No se pudo determinar tu ubicacion en este momento.",
  3: "La ubicacion tardo demasiado en responder.",
};

function buildOpenWeatherForecastUrl({
  latitude,
  longitude,
  units = "metric",
  lang = "es",
}) {
  const url = new URL(WEATHER_API_BASE_URL);

  url.searchParams.set("lat", latitude);
  url.searchParams.set("lon", longitude);
  url.searchParams.set("appid", getWeatherApiKey());
  url.searchParams.set("units", units);
  url.searchParams.set("lang", lang);

  return url.toString();
}

function buildOpenMeteoForecastUrl({
  latitude,
  longitude,
  temperatureUnit = "celsius",
}) {
  const url = new URL(OPEN_METEO_API_BASE_URL);

  url.searchParams.set("latitude", latitude);
  url.searchParams.set("longitude", longitude);
  url.searchParams.set("current", OPEN_METEO_CURRENT_FIELDS);
  url.searchParams.set("daily", OPEN_METEO_DAILY_FIELDS);
  url.searchParams.set("temperature_unit", temperatureUnit);
  url.searchParams.set("timezone", "auto");
  url.searchParams.set("forecast_days", OPEN_METEO_FORECAST_DAYS);

  return url.toString();
}

function getPreferredLocationLanguage() {
  const documentLanguage =
    typeof globalThis.document?.documentElement?.lang === "string"
      ? globalThis.document.documentElement.lang.trim()
      : "";

  if (documentLanguage !== "") {
    return documentLanguage;
  }

  if (
    typeof globalThis.navigator?.language === "string" &&
    globalThis.navigator.language.trim() !== ""
  ) {
    return globalThis.navigator.language.trim();
  }

  return DEFAULT_LOCATION_LANGUAGE;
}

function normalizeLocationLanguage(language) {
  const normalizedLanguage =
    typeof language === "string" ? language.trim() : getPreferredLocationLanguage();

  if (normalizedLanguage === "") {
    return DEFAULT_LOCATION_LANGUAGE;
  }

  return normalizedLanguage.split("-")[0];
}

function buildReverseGeocodeUrl({ latitude, longitude, language }) {
  const url = new URL(REVERSE_GEOCODE_API_BASE_URL);

  url.searchParams.set("latitude", latitude);
  url.searchParams.set("longitude", longitude);
  url.searchParams.set(
    "localityLanguage",
    normalizeLocationLanguage(language ?? getPreferredLocationLanguage())
  );

  return url.toString();
}

function getFirstNonEmptyLocationValue(candidates = []) {
  return candidates.find(
    (value) => typeof value === "string" && value.trim() !== ""
  )?.trim() ?? null;
}

function buildLocationDisplayName(primaryLocation, countryName) {
  if (!primaryLocation) {
    return countryName ?? null;
  }

  if (!countryName || primaryLocation.toLowerCase() === countryName.toLowerCase()) {
    return primaryLocation;
  }

  return `${primaryLocation}, ${countryName}`;
}

function extractErrorDetail(errorPayload) {
  return errorPayload?.message ?? errorPayload?.reason ?? errorPayload?.error ?? "";
}

// La UI solo trabaja con mensajes simples; aqui traducimos respuestas HTTP
// fallidas a errores legibles para el resto de la feature.
async function fetchJson(requestUrl, defaultMessage) {
  const response = await fetch(requestUrl);

  if (!response.ok) {
    let errorDetail = "";

    try {
      const errorPayload = await response.json();
      errorDetail = extractErrorDetail(errorPayload);
    } catch {
      errorDetail = "";
    }

    const normalizedDetail =
      typeof errorDetail === "string" ? errorDetail.trim() : "";

    throw new Error(
      normalizedDetail !== "" ? `${defaultMessage} ${normalizedDetail}` : defaultMessage
    );
  }

  return response.json();
}

// La app intenta OpenWeather solo cuando hay API key. Si falla, el flujo no se
// rompe: cae automaticamente a Open-Meteo para mantener la card operativa.
async function fetchWeatherForecast(options) {
  if (hasWeatherApiKey()) {
    try {
      const data = await fetchJson(
        buildOpenWeatherForecastUrl(options),
        "No se pudo obtener la informacion del clima desde OpenWeather."
      );

      return {
        provider: "openweather",
        data,
      };
    } catch (error) {
      console.warn(
        "OpenWeather no respondio correctamente. Se usa Open-Meteo como fallback.",
        error
      );
    }
  }

  const data = await fetchJson(
    buildOpenMeteoForecastUrl(options),
    "No se pudo obtener la informacion del clima."
  );

  return {
    provider: "open-meteo",
    data,
  };
}

function mapDailyTemperatureForecast(weatherData) {
  const forecastMaxTemperatureCelsius = weatherData?.daily?.temperature_2m_max?.[0];

  if (typeof forecastMaxTemperatureCelsius !== "number") {
    throw new Error("La API no devolvio una maxima diaria valida.");
  }

  return {
    forecastMaxTemperatureCelsius,
  };
}

// La maxima diaria se resuelve desde Open-Meteo porque no requiere API key y
// evita cambiar el proveedor principal del clima actual.
async function fetchDailyTemperatureForecast(options) {
  const data = await fetchJson(
    buildOpenMeteoForecastUrl(options),
    "No se pudo obtener la maxima diaria prevista."
  );

  return mapDailyTemperatureForecast(data);
}

function mapLocationDetails(locationData) {
  const informativeLocation = Array.isArray(locationData?.localityInfo?.informative)
    ? getFirstNonEmptyLocationValue(
        locationData.localityInfo.informative.map((item) => item?.name)
      )
    : null;

  const cityCandidates = [
    locationData?.locality,
    locationData?.city,
    informativeLocation,
    locationData?.principalSubdivision,
    locationData?.countryName,
  ];

  const city = getFirstNonEmptyLocationValue(cityCandidates);
  const country = getFirstNonEmptyLocationValue([locationData?.countryName]);

  return {
    city,
    country,
    displayName: buildLocationDisplayName(city, country),
  };
}

// El reverse geocoding solo mejora la etiqueta visible de ciudad; el clima
// puede mostrarse igualmente aunque este paso falle.
async function fetchLocationDetails(options) {
  const data = await fetchJson(
    buildReverseGeocodeUrl(options),
    "No se pudo resolver la ciudad desde las coordenadas."
  );

  return mapLocationDetails(data);
}

function getGeolocationErrorMessage(error) {
  if (typeof globalThis.isSecureContext === "boolean" && !globalThis.isSecureContext) {
    return GEOLOCATION_SECURE_CONTEXT_MESSAGE;
  }

  const friendlyMessage = GEOLOCATION_ERROR_MESSAGES[error?.code];

  if (typeof friendlyMessage === "string") {
    return friendlyMessage;
  }

  const rawMessage =
    typeof error?.message === "string" && error.message.trim() !== ""
      ? error.message.trim().toLowerCase()
      : "";

  if (
    rawMessage.includes("secure") ||
    rawMessage.includes("https") ||
    rawMessage.includes("localhost") ||
    rawMessage.includes("context")
  ) {
    return GEOLOCATION_SECURE_CONTEXT_MESSAGE;
  }

  return "No se pudo obtener la ubicacion del usuario.";
}

// Encapsulamos aqui toda la logica del navegador relacionada con permisos,
// secure context y errores de geolocalizacion para no repartirla por la UI.
function getUserLocation(options = {}) {
  const geolocationOptions = {
    ...DEFAULT_GEOLOCATION_OPTIONS,
    ...options,
  };

  return new Promise((resolve, reject) => {
    if (typeof globalThis.isSecureContext === "boolean" && !globalThis.isSecureContext) {
      reject(new Error(GEOLOCATION_SECURE_CONTEXT_MESSAGE));
      return;
    }

    if (!navigator.geolocation) {
      reject(new Error("La geolocalizacion no esta disponible."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject(new Error(getGeolocationErrorMessage(error)));
      },
      geolocationOptions
    );
  });
}

export {
  fetchDailyTemperatureForecast,
  fetchLocationDetails,
  fetchWeatherForecast,
  getUserLocation,
};
