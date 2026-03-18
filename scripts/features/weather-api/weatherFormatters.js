const DEFAULT_WEATHER_LOCALE = "es-ES";
const TEMPERATURE_DECIMAL_DIGITS = 1;
const UTC_TIME_ZONE = "UTC";

function formatTemperature(temperatureCelsius) {
  return `${temperatureCelsius.toFixed(TEMPERATURE_DECIMAL_DIGITS)} °C`;
}

function resolveFormatConfig(localeOrOptions) {
  if (typeof localeOrOptions === "string" || localeOrOptions === undefined) {
    return {
      locale: localeOrOptions ?? DEFAULT_WEATHER_LOCALE,
      timeZone: null,
      useUtc: false,
    };
  }

  return {
    locale: localeOrOptions.locale ?? DEFAULT_WEATHER_LOCALE,
    timeZone:
      typeof localeOrOptions.timeZone === "string"
        ? localeOrOptions.timeZone
        : null,
    useUtc: localeOrOptions.useUtc === true,
  };
}

function resolveIntlTimeZone({ timeZone, useUtc }) {
  if (typeof timeZone === "string" && timeZone.trim() !== "") {
    return timeZone;
  }

  if (useUtc) {
    return UTC_TIME_ZONE;
  }

  return undefined;
}

function formatWeatherDate(date, localeOrOptions = DEFAULT_WEATHER_LOCALE) {
  const { locale, timeZone, useUtc } = resolveFormatConfig(localeOrOptions);

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: resolveIntlTimeZone({ timeZone, useUtc }),
  }).format(date);
}

function formatWeatherTime(date, localeOrOptions = DEFAULT_WEATHER_LOCALE) {
  const { locale, timeZone, useUtc } = resolveFormatConfig(localeOrOptions);

  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: resolveIntlTimeZone({ timeZone, useUtc }),
  }).format(date);
}

export {
  formatTemperature,
  formatWeatherDate,
  formatWeatherTime,
};
