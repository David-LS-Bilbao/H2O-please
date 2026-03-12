import { WEATHER_API_BASE_URL, getWeatherApiKey } from "./weatherConfig.js";

// Construye la URL final para consultar el tiempo actual en OpenWeather.
// La key se obtiene desde el modulo de configuracion para no duplicar logica.
function buildWeatherForecastUrl({ latitude, longitude, units = "metric", lang = "es" }) {
  const url = new URL(WEATHER_API_BASE_URL);

  url.searchParams.set("lat", latitude);
  url.searchParams.set("lon", longitude);
  url.searchParams.set("appid", getWeatherApiKey());
  url.searchParams.set("units", units);
  url.searchParams.set("lang", lang);

  return url.toString();
}

// Ejecuta la peticion HTTP a la API del tiempo y devuelve el JSON crudo.
// Aqui no se transforma el dato: esa responsabilidad queda en weatherService.js.
async function fetchWeatherForecast(options) {
  const requestUrl = buildWeatherForecastUrl(options);
  const response = await fetch(requestUrl);

  if (!response.ok) {
    throw new Error("No se pudo obtener la informacion del clima.");
  }

  return response.json();
}

// Envuelve la geolocalizacion del navegador en una Promise para poder usar async/await.
// Devuelve solo las coordenadas que necesita la API del clima.
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
