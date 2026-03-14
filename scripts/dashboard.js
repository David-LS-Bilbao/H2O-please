import App from "./core/App.js";
import { initDashboardWeatherIntegration } from "./pages/dashboardWeatherIntegration.js";

document.addEventListener("DOMContentLoaded", () => {
  const app = new App();
  app.init();

  if (app.user) {
    initDashboardWeatherIntegration();
  }
});
