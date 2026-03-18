const WEATHER_HOUR_FORMAT_LOCALE = "en-GB";
const WEATHER_DAY_START_HOUR = 7;
const WEATHER_NIGHT_START_HOUR = 20;

function normalizeWeatherDescription(description = "") {
  return description.toLowerCase().trim();
}

function getWeatherHours(date = new Date(), options = {}) {
  if (typeof options.timeZone === "string" && options.timeZone.trim() !== "") {
    const formattedHour = new Intl.DateTimeFormat(WEATHER_HOUR_FORMAT_LOCALE, {
      hour: "2-digit",
      hourCycle: "h23",
      timeZone: options.timeZone,
    }).format(date);

    return Number.parseInt(formattedHour, 10);
  }

  if (options.useUtc) {
    return date.getUTCHours();
  }

  return date.getHours();
}

function getWeatherTimePeriod(date = new Date(), options = {}) {
  const hours = getWeatherHours(date, options);

  if (hours >= WEATHER_DAY_START_HOUR && hours < WEATHER_NIGHT_START_HOUR) {
    return "day";
  }

  return "night";
}

function getWeatherStatusIcon(description, date = new Date(), options = {}) {
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

  return getWeatherTimePeriod(date, options) === "day" ? "sun" : "moon";
}

export {
  getWeatherStatusIcon,
  getWeatherTimePeriod,
};
