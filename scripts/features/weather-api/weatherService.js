import {
  fetchLocationDetails,
  fetchWeatherForecast,
  getUserLocation,
} from "./weatherApiClient.js";

const DEFAULT_CITY_LABEL = "Ubicacion actual";
const DEFAULT_WEATHER_DESCRIPTION = "Clima actual";
const OPEN_METEO_WEATHER_DESCRIPTIONS = {
  0: "Cielo despejado",
  1: "Mayormente despejado",
  2: "Parcialmente nublado",
  3: "Cubierto",
  45: "Niebla",
  48: "Niebla",
  51: "Llovizna",
  53: "Llovizna",
  55: "Llovizna",
  56: "Llovizna helada",
  57: "Llovizna helada",
  61: "Lluvia",
  63: "Lluvia",
  65: "Lluvia",
  66: "Lluvia helada",
  67: "Lluvia helada",
  71: "Nieve",
  73: "Nieve",
  75: "Nieve",
  77: "Nieve",
  80: "Chubascos",
  81: "Chubascos",
  82: "Chubascos",
  85: "Chubascos de nieve",
  86: "Chubascos de nieve",
  95: "Tormenta",
  96: "Tormenta con granizo",
  99: "Tormenta con granizo",
};

function getFallbackCityLabel(location) {
  if (
    typeof location?.displayName === "string" &&
    location.displayName.trim() !== ""
  ) {
    return location.displayName.trim();
  }

  if (typeof location?.city === "string" && location.city.trim() !== "") {
    return location.city.trim();
  }

  if (typeof location?.country === "string" && location.country.trim() !== "") {
    return location.country.trim();
  }

  return DEFAULT_CITY_LABEL;
}

function getResolvedLocationLabel(location, apiCityName) {
  const fallbackCityLabel = getFallbackCityLabel(location);

  if (fallbackCityLabel !== DEFAULT_CITY_LABEL) {
    return fallbackCityLabel;
  }

  if (typeof apiCityName === "string" && apiCityName.trim() !== "") {
    return apiCityName.trim();
  }

  return fallbackCityLabel;
}

function mapOpenWeatherSnapshot(weatherData, location) {
  const temperatureCelsius = weatherData.main?.temp;

  if (typeof temperatureCelsius !== "number") {
    throw new Error("La API no devolvio una temperatura valida.");
  }

  return {
    temperatureCelsius,
    weatherDescription:
      weatherData.weather?.[0]?.description ?? DEFAULT_WEATHER_DESCRIPTION,
    city: getResolvedLocationLabel(location, weatherData.name),
    latitude: location.latitude,
    longitude: location.longitude,
    timezone: null,
    timezoneOffsetSeconds:
      typeof weatherData.timezone === "number" ? weatherData.timezone : null,
    provider: "openweather",
    fetchedAt: new Date().toISOString(),
  };
}

function getOpenMeteoWeatherDescription(weatherCode) {
  return OPEN_METEO_WEATHER_DESCRIPTIONS[weatherCode] ?? DEFAULT_WEATHER_DESCRIPTION;
}

function mapOpenMeteoSnapshot(weatherData, location) {
  const temperatureCelsius = weatherData.current?.temperature_2m;

  if (typeof temperatureCelsius !== "number") {
    throw new Error("La API no devolvio una temperatura valida.");
  }

  return {
    temperatureCelsius,
    weatherDescription: getOpenMeteoWeatherDescription(
      weatherData.current?.weather_code
    ),
    city: getFallbackCityLabel(location),
    latitude: location.latitude,
    longitude: location.longitude,
    timezone:
      typeof weatherData.timezone === "string" ? weatherData.timezone : null,
    timezoneOffsetSeconds:
      typeof weatherData.utc_offset_seconds === "number"
        ? weatherData.utc_offset_seconds
        : null,
    provider: "open-meteo",
    fetchedAt: new Date().toISOString(),
  };
}

function mapWeatherSnapshot(weatherPayload, location) {
  if (weatherPayload?.provider === "open-meteo") {
    return mapOpenMeteoSnapshot(weatherPayload.data, location);
  }

  return mapOpenWeatherSnapshot(weatherPayload?.data ?? weatherPayload, location);
}

async function getLocalWeatherSnapshot() {
  const location = await getUserLocation();
  const weatherData = await fetchWeatherForecast(location);
  let enrichedLocation = location;

  try {
    const locationDetails = await fetchLocationDetails(location);
    enrichedLocation = {
      ...location,
      ...locationDetails,
    };
  } catch (error) {
    console.warn(
      "No se pudo resolver la ciudad desde las coordenadas. Se usa una etiqueta generica.",
      error
    );
  }

  return mapWeatherSnapshot(weatherData, enrichedLocation);
}

export {
  mapWeatherSnapshot,
  getLocalWeatherSnapshot,
};
