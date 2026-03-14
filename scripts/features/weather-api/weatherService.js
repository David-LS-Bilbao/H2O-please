import {
  fetchLocationDetails,
  fetchWeatherForecast,
  getUserLocation,
} from "./weatherApiClient.js";

function getFallbackCityLabel(location) {
  if (typeof location?.city === "string" && location.city.trim() !== "") {
    return location.city.trim();
  }

  return "Ubicacion actual";
}

function getResolvedLocationLabel(location, apiCityName) {
  const fallbackCityLabel = getFallbackCityLabel(location);

  if (fallbackCityLabel !== "Ubicacion actual") {
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
    weatherDescription: weatherData.weather?.[0]?.description ?? "Clima actual",
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
  switch (weatherCode) {
    case 0:
      return "Cielo despejado";
    case 1:
      return "Mayormente despejado";
    case 2:
      return "Parcialmente nublado";
    case 3:
      return "Cubierto";
    case 45:
    case 48:
      return "Niebla";
    case 51:
    case 53:
    case 55:
      return "Llovizna";
    case 61:
    case 63:
    case 65:
      return "Lluvia";
    case 71:
    case 73:
    case 75:
      return "Nieve";
    case 80:
    case 81:
    case 82:
      return "Chubascos";
    case 95:
      return "Tormenta";
    default:
      return "Clima actual";
  }
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
