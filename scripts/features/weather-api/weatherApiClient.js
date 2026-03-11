import { WEATHER_API_BASE_URL, getWeatherApiKey } from "./weatherConfig.js";

function buildWeatherForecastUrl({ latitude, longitude, units = "metric", lang = "es" }) {
  const url = new URL(WEATHER_API_BASE_URL);

  url.searchParams.set("lat", latitude);
  url.searchParams.set("lon", longitude);
  url.searchParams.set("appid", getWeatherApiKey());
  url.searchParams.set("units", units);
  url.searchParams.set("lang", lang);

  return url.toString();
}

async function fetchWeatherForecast(options) {
  const requestUrl = buildWeatherForecastUrl(options);
  const response = await fetch(requestUrl);

  if (!response.ok) {
    throw new Error("No se pudo obtener la informacion del clima.");
  }

  return response.json();
}

function getUserLocation(options = {}) {
  const geolocationOptions = {
    enableHighAccuracy: false,
    timeout: 10000,
    maximumAge: 0,
    ...options,
  };

  return new Promise((resolve, reject) => {
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
      () => {
        reject(new Error("No se pudo obtener la ubicacion del usuario."));
      },
      geolocationOptions
    );
  });
}

export {
  buildWeatherForecastUrl,
  fetchWeatherForecast,
  getUserLocation,
};
