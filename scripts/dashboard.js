import App from "./core/App.js";
import { initDashboardWeatherIntegration } from "./pages/dashboardWeatherIntegration.js";

document.addEventListener("DOMContentLoaded", () => {
  const app = new App();
  const isDashboardReady = app.init();

  // Solo montamos el clima si el dashboard ha arrancado y hay usuario cargado.
  if (isDashboardReady) {
    initDashboardWeatherIntegration();
  }
});
