# Weather Forecast + Hydration

## Objetivo

Esta feature se plantea para el siguiente sprint y parte de la base ya creada en
`feat/weather-api-call`.

Su objetivo es usar la previsión meteorológica como fuente única para dos casos
de uso:

- mostrar un modal con la previsión de los próximos 7 días
- calcular una decisión diaria de hidratación basada en la temperatura prevista
  de hoy

La idea principal es separar claramente:

- capa de datos de previsión
- capa visual del modal
- lógica de negocio de hidratación

El modal no debe ser la fuente de verdad. La fuente de verdad debe ser el módulo
de previsión y el dato guardado en `localStorage`.

## Alcance del sprint

Incluido:

- consumo de previsión meteorológica
- normalización de la respuesta de la API
- persistencia en `localStorage`
- cálculo del rango diario `cold | normal | hot`
- reutilización del dato para la lógica de hidratación
- modal de 7 días construido sobre la misma fuente de datos
- documentación de la feature y del flujo

Fuera de alcance:

- backend
- base de datos
- notificaciones
- lógica avanzada por humedad, viento o actividad física
- integración completa en todas las pantallas de la app

## Decisiones de diseño

- La lógica de hidratación no debe usar la temperatura actual del momento.
- La referencia para el día debe ser estable.
- La recomendación inicial es usar la temperatura máxima prevista del día.
- Si más adelante negocio lo prefiere, se puede cambiar a media diaria sin
  romper la arquitectura.
- El valor calculado para el día debe guardarse y reutilizarse durante toda la
  jornada para que la recomendación no cambie constantemente.

## Estructura propuesta

```text
scripts/
├─ features/
│  ├─ weather-forecast/
│  │  ├─ README.md
│  │  ├─ index.js
│  │  ├─ weatherForecastApiClient.js
│  │  ├─ weatherForecastService.js
│  │  ├─ weatherForecastCache.js
│  │  ├─ weatherForecastFormatters.js
│  │  └─ dom/
│  │     └─ weatherForecastModalManager.js
│  └─ hydration/
│     ├─ hydrationWeatherRule.js
│     └─ hydrationCalculator.js
```

## Responsabilidad por módulo

### `weatherForecastApiClient.js`

- construir la URL del endpoint de previsión
- hacer la petición HTTP
- devolver el JSON crudo

### `weatherForecastService.js`

- transformar la respuesta de la API
- producir una estructura estable para la app
- extraer la previsión de hoy
- exponer el dato útil para hidratación

### `weatherForecastCache.js`

- guardar la previsión normalizada
- recuperar la previsión guardada
- invalidar datos antiguos

### `weatherForecastFormatters.js`

- formatear fechas
- formatear temperaturas
- preparar valores de presentación para el modal

### `weatherForecastModalManager.js`

- gestionar el DOM del modal
- pintar la lista de 7 días
- mantener la UI separada de la lógica de datos

### `hydrationWeatherRule.js`

- leer la temperatura prevista de hoy
- clasificar el día como `cold`, `normal` o `hot`
- devolver un valor utilizable por el cálculo de hidratación

### `hydrationCalculator.js`

- usar el rango térmico diario
- aplicar el ajuste correspondiente a la cantidad de agua

## API pública propuesta

La nueva feature de previsión debería exponer al menos:

- `getForecastSnapshot()`
- `getStoredForecastSnapshot()`
- `saveForecastSnapshot(snapshot)`
- `clearStoredForecastSnapshot()`
- `getTodayForecastTemperature()`
- `formatForecastDate(date)`
- `formatForecastTemperature(value)`
- `createWeatherForecastModalManager(root)`

La capa de hidratación debería exponer:

- `getDailyHydrationWeatherRange()`
- `getStoredDailyHydrationDecision()`
- `saveDailyHydrationDecision(decision)`
- `getHydrationAdjustmentByWeatherRange(range)`

## Reglas de negocio iniciales

Primera propuesta de rangos:

- `< 10°C` -> `cold`
- `10°C - 24.9°C` -> `normal`
- `>= 25°C` -> `hot`

Primera propuesta de uso:

- `cold` -> mantener consumo base
- `normal` -> aplicar ajuste medio
- `hot` -> aplicar ajuste alto

Los umbrales pueden cambiar después sin rehacer la capa de previsión.

## Estructura de datos recomendada

### Snapshot de previsión

```js
{
  fetchedAt: "2026-03-11T08:00:00.000Z",
  location: {
    city: "Basauri",
    latitude: 43.23,
    longitude: -2.88
  },
  days: [
    {
      date: "2026-03-11",
      minTemperatureCelsius: 8,
      maxTemperatureCelsius: 19,
      weatherDescription: "cielo claro",
      icon: "sun"
    }
  ]
}
```

### Decisión diaria de hidratación

```js
{
  date: "2026-03-11",
  forecastTemperatureCelsius: 19,
  hydrationRange: "normal",
  calculatedAt: "2026-03-11T08:00:00.000Z"
}
```

## Claves de `localStorage`

Propuesta inicial:

- `weatherForecastSnapshot`
- `dailyHydrationWeatherDecision`

## Flujo funcional

1. La app arranca.
2. Se consulta `localStorage` para ver si ya existe previsión válida del día.
3. Si no existe, se llama a la API de previsión.
4. La respuesta se normaliza y se guarda en `localStorage`.
5. Se obtiene la temperatura de referencia de hoy.
6. `hydrationWeatherRule.js` devuelve `cold`, `normal` o `hot`.
7. La decisión diaria se guarda en `localStorage`.
8. El cálculo de agua reutiliza esa decisión durante el resto del día.
9. El modal de 7 días reutiliza el mismo snapshot de previsión.

## Historias de usuario

- Como usuario, quiero consultar la previsión de los próximos 7 días en un
  modal visual.
- Como sistema, quiero guardar la previsión en `localStorage` para no depender
  de una llamada a la API en cada uso.
- Como sistema, quiero clasificar la temperatura prevista del día en frío,
  normal o calor.
- Como sistema, quiero ajustar la recomendación de agua usando ese rango.

## Tareas técnicas del sprint

1. Confirmar el endpoint de OpenWeather para previsión de 7 días y su
   compatibilidad con la API key actual.
2. Crear la carpeta `scripts/features/weather-forecast/`.
3. Implementar cliente API y servicio de normalización.
4. Diseñar la política de caché e invalidación diaria.
5. Crear `hydrationWeatherRule.js`.
6. Integrar la decisión diaria con `hydrationCalculator.js`.
7. Implementar el modal con `weatherForecastModalManager.js`.
8. Documentar la feature y su diagrama.

## Criterios de aceptación

- la previsión se obtiene correctamente y se guarda en `localStorage`
- el modal muestra 7 días coherentes y legibles
- el sistema devuelve `cold`, `normal` o `hot` para el día actual
- la lógica de hidratación consume esa decisión sin depender del DOM
- el valor diario no cambia de forma arbitraria durante el día

## Riesgos y puntos a validar

- verificar si el endpoint de previsión está disponible con el plan actual de
  OpenWeather
- definir correctamente el cambio de día según la zona horaria local
- evitar duplicar transformaciones entre modal e hidratación
- decidir cuándo caduca el snapshot guardado

## Orden recomendado de implementación

1. capa de datos de previsión
2. caché e invalidación
3. regla de hidratación
4. integración con cálculo de agua
5. modal de 7 días
6. documentación final
