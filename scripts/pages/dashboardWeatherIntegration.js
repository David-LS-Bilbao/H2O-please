import { initWeatherCardIntegration } from "./weatherCardIntegration.js";

export function initDashboardWeatherIntegration() {
  // El dashboard usa su propio slot para no acoplar la feature al markup del index.
  const weatherMountTarget = document.querySelector("#weather-output");

  return initWeatherCardIntegration({
    mountTarget: weatherMountTarget,
    cardClassName: "dashboard-weather-card",
    contextLabel: "dashboard",
    clearMountTarget: true,
  });
}
