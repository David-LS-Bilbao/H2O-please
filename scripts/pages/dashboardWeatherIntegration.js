import { initWeatherCardIntegration } from "./weatherCardIntegration.js";

export function initDashboardWeatherIntegration() {
  const weatherMountTarget = document.querySelector("#weather-output");

  return initWeatherCardIntegration({
    mountTarget: weatherMountTarget,
    contextLabel: "dashboard",
    clearMountTarget: true,
  });
}
