import { initWeatherCardIntegration } from "./weatherCardIntegration.js";

function initIndexWeatherDemo() {
  // En esta pagina la card no vive en el HTML. Se monta desde la feature para
  // simular una integracion tipo import desde un archivo propio.
  const weatherMountTarget =
    document.querySelector(".header-top") ?? document.querySelector(".app-layout");

  if (!weatherMountTarget) {
    return;
  }

  // La demo reutiliza el mismo integrador del dashboard para evitar ramas de logica.
  initWeatherCardIntegration({
    mountTarget: weatherMountTarget,
    mountPosition: "afterend",
    cardClassName: "dashboard-weather-card",
    contextLabel: "index de prueba",
  });
}

initIndexWeatherDemo();
