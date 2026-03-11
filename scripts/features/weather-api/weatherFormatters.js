// Convierte la temperatura numerica al formato mostrado por la UI.
function formatTemperature(temperatureCelsius) {
  return `${temperatureCelsius.toFixed(1)} °C`;
}

// Formatea la fecha para mostrarla en el idioma de la interfaz.
function formatWeatherDate(date, locale = "es-ES") {
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

// Formatea la hora local, incluyendo segundos para que el reloj se vea vivo.
function formatWeatherTime(date, locale = "es-ES") {
  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
}

export {
  formatTemperature,
  formatWeatherDate,
  formatWeatherTime,
};
