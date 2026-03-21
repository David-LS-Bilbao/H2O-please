# Weather API

Esta carpeta contiene la feature del clima ya simplificada para la version actual de la aplicacion.

No esta pensada como una libreria generica. Esta pensada para resolver un caso concreto:

- obtener el clima local del usuario
- guardarlo en cache
- y pintarlo en una tarjeta reutilizable dentro del dashboard

La estructura se ha reducido para dejar el menor numero de archivos utiles sin perder claridad para un alumno de fullstack.

## Estructura actual

```text
scripts/features/weather-api/
├─ README_API.md
├─ index.js
├─ weatherApiClient.js
├─ weatherCache.js
├─ weatherConfig.js
├─ weatherDomManager.js
└─ weatherService.js
```

## Que hace cada archivo

### `weatherConfig.js`

Se ocupa de la configuracion.

- guarda los nombres de las claves y URLs base
- lee la API key desde `window`
- si no existe en runtime, la busca en `localStorage`

La idea es que la app pueda funcionar en desarrollo sin obligarte a tocar el codigo cada vez que cambias la key.

### `weatherApiClient.js`

Se encarga de hablar con el navegador y con servicios externos.

Responsabilidades:

- pedir la ubicacion del usuario
- construir las URLs de peticion
- llamar a OpenWeather si hay API key
- usar Open-Meteo como fallback si OpenWeather falla o si no hay key
- consultar BigDataCloud para obtener una ciudad legible
- normalizar errores HTTP y de geolocalizacion

Este archivo trabaja con datos externos todavia "crudos".

### `weatherService.js`

Es la capa que transforma los datos externos a un formato util para la UI.

Aqui se decide:

- como traducir codigos de Open-Meteo a texto legible
- como resolver el nombre final de la ciudad
- como dejar un unico formato comun aunque cambie el proveedor

Su salida principal es un `snapshot`.

### `weatherCache.js`

Gestiona el cache local del snapshot.

- guarda el ultimo dato valido en `localStorage`
- recupera ese dato si existe
- evita romper la app si el JSON guardado esta corrupto

### `weatherDomManager.js`

Centraliza todo el render de la tarjeta del clima.

Hace varias cosas relacionadas entre si:

- monta el HTML base de la card
- localiza nodos del DOM
- formatea temperatura, fecha y hora
- decide si el estado visual es de dia o de noche
- calcula el icono textual de estado
- actualiza el reloj local cada segundo
- pinta datos, warnings y errores

En esta version se han integrado aqui las utilidades de formato y visuales para reducir archivos y carpetas.

### `index.js`

Es la fachada publica de la feature.

Desde fuera solo deberian importarse las funciones que la aplicacion necesita de verdad.

## API publica real

La app actual usa esta API publica:

- `getLocalWeatherSnapshot()`
- `getStoredLocalWeatherSnapshot()`
- `saveLocalWeatherSnapshot(snapshot)`
- `mountWeatherCard(targetElement, position)`
- `createWeatherDomManager(root)`

Todo lo demas se considera detalle interno.

## Flujo real paso a paso

Cuando el dashboard o la preview cargan la tarjeta del clima, el flujo es este:

1. La pagina monta la card o reutiliza la que ya existe.
2. Crea un `DomManager` para controlar el render.
3. Intenta leer un snapshot guardado en `localStorage`.
4. Si existe, lo pinta primero para que la UI no arranque vacia.
5. Pide la ubicacion del usuario al navegador.
6. Intenta consultar OpenWeather si hay API key.
7. Si no hay key o OpenWeather falla, usa Open-Meteo.
8. Intenta enriquecer la ubicacion con una ciudad legible mediante reverse geocoding.
9. Convierte la respuesta externa a un snapshot comun.
10. Guarda el snapshot valido en cache.
11. Actualiza la card y el reloj local.

## Que es un snapshot

El snapshot es el objeto limpio que usa la interfaz.

No es la respuesta completa de una API externa. Es una version resumida y consistente con solo lo que la app necesita:

- `temperatureCelsius`
- `weatherDescription`
- `city`
- `latitude`
- `longitude`
- `timezone`
- `timezoneOffsetSeconds`
- `provider`
- `fetchedAt`

Esto hace que el DOM no dependa del formato propio de OpenWeather ni del de Open-Meteo.

## Proveedores usados

### `OpenWeather`

Se intenta primero cuando hay API key disponible.

Ventaja:

- aporta descripcion textual y offset horario

### `Open-Meteo`

Se usa como fallback o como proveedor principal cuando no hay API key.

Ventaja:

- permite que la app de prueba siga funcionando sin configuracion extra

### `BigDataCloud`

Se usa para reverse geocoding.

Su papel no es obtener el clima, sino mejorar la etiqueta visible de ciudad.

## Por que la estructura es ahora mas pequena

Antes la feature separaba mas piezas:

- formateadores
- logica visual
- carpeta `dom`
- script de preview dentro de la propia feature

Para esta aplicacion de prueba eso anadia mas navegacion entre archivos que valor real.

Por eso se simplifico asi:

- `weatherFormatters.js` y `weatherVisuals.js` se integran en `weatherDomManager.js`
- la carpeta `dom/` desaparece
- `weatherPreviewPage.js` sale de la feature y pasa a `scripts/pages/`
- `index.js` expone menos funciones

La idea es mantener una arquitectura entendible, pero sin sobrefragmentar una feature pequena.

## Donde se usa

### Dashboard

El dashboard entra por:

- `scripts/pages/weatherCardIntegration.js`

### Preview aislada

La preview se sirve desde:

- `weather-preview.html`
- `scripts/pages/weatherPreviewPage.js`

Esto deja claro que la preview es una pagina de ejemplo, no parte del nucleo de la feature.

## Configuracion de la API key

La API key de OpenWeather puede definirse en runtime:

```html
<script>
  window.H2O_PLEASE_WEATHER_API_KEY = "tu-api-key";
</script>
```

O guardarse directamente en `localStorage`:

```js
localStorage.setItem("H2O_PLEASE_WEATHER_API_KEY", "tu-api-key");
```

## Idea importante para un alumno

Si estas aprendiendo fullstack, esta carpeta muestra una separacion util:

- una capa obtiene datos
- otra los adapta al dominio de la app
- otra los cachea
- otra los pinta

Eso evita mezclar en una sola funcion:

- geolocalizacion
- peticiones HTTP
- transformacion de datos
- `localStorage`
- escritura directa en el DOM

## Resumen corto

La feature del clima obtiene la ubicacion del usuario, consulta el proveedor disponible, adapta la respuesta a un snapshot comun y deja ese dato listo para pintar en una card reutilizable.
