// Normaliza la descripcion del clima para comparar textos sin depender de mayusculas.
function normalizeWeatherDescription(description = "") {
  return description.toLowerCase().trim();
}

// Clasifica el momento actual en dia o noche para ajustar fondo e iconografia.
function getWeatherTimePeriod(date = new Date()) {
  const hours = date.getHours();

  if (hours >= 7 && hours < 20) {
    return "day";
  }

  return "night";
}

// Devuelve el icono semantico que mejor representa la descripcion meteorologica.
// Si no encuentra un caso especifico, usa sol o luna segun la hora.
function getWeatherStatusIcon(description, date = new Date()) {
  const normalizedDescription = normalizeWeatherDescription(description);

  if (
    normalizedDescription.includes("tormenta") ||
    normalizedDescription.includes("trueno") ||
    normalizedDescription.includes("electrica")
  ) {
    return "storm";
  }

  if (
    normalizedDescription.includes("lluv") ||
    normalizedDescription.includes("chubasco") ||
    normalizedDescription.includes("aguacero")
  ) {
    return "rain";
  }

  if (
    normalizedDescription.includes("nieve") ||
    normalizedDescription.includes("granizo")
  ) {
    return "snow";
  }

  if (
    normalizedDescription.includes("niebla") ||
    normalizedDescription.includes("bruma") ||
    normalizedDescription.includes("neblina") ||
    normalizedDescription.includes("calima") ||
    normalizedDescription.includes("humo")
  ) {
    return "mist";
  }

  if (
    normalizedDescription.includes("nube") ||
    normalizedDescription.includes("nub") ||
    normalizedDescription.includes("cubierto")
  ) {
    return "cloud";
  }

  return getWeatherTimePeriod(date) === "day" ? "sun" : "moon";
}

export {
  getWeatherStatusIcon,
  getWeatherTimePeriod,
};
