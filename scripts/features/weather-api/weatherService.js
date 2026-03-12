import { fetchWeatherForecast, getUserLocation } from "./weatherApiClient.js";

// Convierte la respuesta cruda de la API en un objeto limpio y estable para la UI.
// Aqui se centraliza la estructura del "snapshot" que consumen las paginas.
function mapWeatherSnapshot(weatherData, location) {
  const temperatureCelsius = weatherData.main?.temp;

  if (typeof temperatureCelsius !== "number") {
    throw new Error("La API no devolvio una temperatura valida.");
  }

  return {
    temperatureCelsius,
    weatherDescription: weatherData.weather?.[0]?.description ?? "Clima actual",
    city: weatherData.name ?? "Ubicacion actual",
    latitude: location.latitude,
    longitude: location.longitude,
    fetchedAt: new Date().toISOString(),
  };
}

// Orquesta la obtencion completa del clima local:
// primero coordenadas del usuario y despues consulta a OpenWeather.
async function getLocalWeatherSnapshot() {
  const location = await getUserLocation();
  const weatherData = await fetchWeatherForecast(location);

  return mapWeatherSnapshot(weatherData, location);
}

export {
  mapWeatherSnapshot,
  getLocalWeatherSnapshot,
};
