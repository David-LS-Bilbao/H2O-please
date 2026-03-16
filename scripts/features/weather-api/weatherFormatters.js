function formatTemperature(temperatureCelsius) {
  return `${temperatureCelsius.toFixed(1)} °C`;
}

function resolveFormatConfig(localeOrOptions) {
  if (typeof localeOrOptions === "string" || localeOrOptions === undefined) {
    return {
      locale: localeOrOptions ?? "es-ES",
      timeZone: null,
      useUtc: false,
    };
  }

  return {
    locale: localeOrOptions.locale ?? "es-ES",
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
    return "UTC";
  }

  return undefined;
}

function formatWeatherDate(date, localeOrOptions = "es-ES") {
  const { locale, timeZone, useUtc } = resolveFormatConfig(localeOrOptions);

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: resolveIntlTimeZone({ timeZone, useUtc }),
  }).format(date);
}

function formatWeatherTime(date, localeOrOptions = "es-ES") {
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
