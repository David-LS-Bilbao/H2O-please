function formatTemperature(temperatureCelsius) {
  return `${temperatureCelsius.toFixed(1)} °C`;
}

function formatWeatherDate(date, locale = "es-ES") {
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

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
