import {
  OPEN_METEO_API_BASE_URL,
  REVERSE_GEOCODE_API_BASE_URL,
  WEATHER_API_BASE_URL,
  getWeatherApiKey,
  hasWeatherApiKey,
} from "./weatherConfig.js";

const GEOLOCATION_ERROR_MESSAGES = {
  1: "Permite la ubicacion en el navegador para ver tu clima local.",
  2: "No se pudo determinar tu ubicacion en este momento.",
  3: "La ubicacion tardo demasiado en responder.",
};

function buildWeatherForecastUrl(options) {
  if (hasWeatherApiKey()) {
    return buildOpenWeatherForecastUrl(options);
  }

  return buildOpenMeteoForecastUrl(options);
}

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
  url.searchParams.set("current", "temperature_2m,weather_code,is_day");
  url.searchParams.set("temperature_unit", temperatureUnit);
  url.searchParams.set("timezone", "auto");
  url.searchParams.set("forecast_days", "1");

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

  return "es";
}

function normalizeLocationLanguage(language) {
  const normalizedLanguage =
    typeof language === "string" ? language.trim() : getPreferredLocationLanguage();

  if (normalizedLanguage === "") {
    return "es";
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

async function fetchJson(requestUrl, defaultMessage) {
  const response = await fetch(requestUrl);

  if (!response.ok) {
    let errorDetail = "";

    try {
      const errorPayload = await response.json();
      errorDetail =
        errorPayload?.message ??
        errorPayload?.reason ??
        errorPayload?.error ??
        "";
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

async function fetchLocationDetails(options) {
  const data = await fetchJson(
    buildReverseGeocodeUrl(options),
    "No se pudo resolver la ciudad desde las coordenadas."
  );

  return mapLocationDetails(data);
}

function getGeolocationErrorMessage(error) {
  if (typeof globalThis.isSecureContext === "boolean" && !globalThis.isSecureContext) {
    return "La ubicacion solo funciona en un contexto seguro. Abre la app en http://localhost:5500 o por HTTPS.";
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
    return "La ubicacion solo funciona en un contexto seguro. Abre la app en http://localhost:5500 o por HTTPS.";
  }

  return "No se pudo obtener la ubicacion del usuario.";
}

function getUserLocation(options = {}) {
  const geolocationOptions = {
    enableHighAccuracy: true,
    timeout: 15000,
    maximumAge: 0,
    ...options,
  };

  return new Promise((resolve, reject) => {
    if (typeof globalThis.isSecureContext === "boolean" && !globalThis.isSecureContext) {
      reject(
        new Error(
          "La ubicacion solo funciona en un contexto seguro. Abre la app en http://localhost:5500 o por HTTPS."
        )
      );
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
  buildWeatherForecastUrl,
  fetchLocationDetails,
  fetchWeatherForecast,
  getUserLocation,
};
