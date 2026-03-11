import { fetchWeatherForecast, getUserLocation } from "./weatherApiClient.js";

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

async function getLocalWeatherSnapshot() {
  const location = await getUserLocation();
  const weatherData = await fetchWeatherForecast(location);

  return mapWeatherSnapshot(weatherData, location);
}

export {
  mapWeatherSnapshot,
  getLocalWeatherSnapshot,
};
