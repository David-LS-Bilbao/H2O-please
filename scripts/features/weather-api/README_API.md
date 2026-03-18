# Weather API feature

Esta carpeta contiene una feature completa pero pequena para obtener, transformar y mostrar el clima actual del usuario.

La idea no es solo "pedir una API". La feature esta separada en modulos para que un alumno pueda entender mejor que hace cada parte:

- una parte lee configuracion
- otra habla con APIs externas
- otra transforma datos crudos en un formato util para la app
- otra pinta la tarjeta en pantalla
- otra guarda el ultimo resultado en `localStorage`

## Que resuelve esta feature

Esta feature se encarga de:

1. pedir la ubicacion del usuario al navegador
2. consultar el clima actual con esa ubicacion
3. intentar resolver un nombre de ciudad legible
4. convertir la respuesta de la API en un objeto sencillo para la app
5. guardar ese resultado en cache local si hace falta
6. mostrar la informacion en una card reutilizable

## Idea principal de arquitectura

La feature esta dividida por responsabilidad.

Eso significa que cada archivo intenta hacer una sola cosa bien:

- `weatherConfig.js`
  Lee la API key desde `window` o desde `localStorage`.

- `weatherApiClient.js`
  Construye URLs, llama a las APIs externas y encapsula la geolocalizacion del navegador.

- `weatherService.js`
  Toma respuestas crudas de la API y las convierte en un snapshot sencillo y consistente para el resto de la app.

- `weatherCache.js`
  Guarda y recupera el ultimo clima desde `localStorage`.

- `weatherFormatters.js`
  Formatea temperatura, fecha y hora.

- `weatherVisuals.js`
  Decide el icono y si la UI debe mostrarse como dia o noche.

- `dom/weatherDomManager.js`
  Centraliza el render de la card en el DOM.

- `index.js`
  Hace de fachada publica. Reexporta lo importante para que desde fuera no haya que importar cada modulo por separado.

- `weatherPreviewPage.js`
  Es una pagina de prueba para ver esta feature en funcionamiento sin tocar la pantalla principal.

## Flujo completo paso a paso

Si quieres entender la feature de principio a fin, este es el recorrido normal:

1. La pagina llama a `getLocalWeatherSnapshot()`.
2. `weatherApiClient.js` pide la ubicacion del usuario con `navigator.geolocation`.
3. Con latitud y longitud, se consulta el proveedor del clima.
4. Si existe API key, se intenta primero con OpenWeather.
5. Si OpenWeather falla, se hace fallback a Open-Meteo.
6. Despues se intenta resolver una ciudad legible con reverse geocoding.
7. `weatherService.js` transforma todo eso en un objeto comun.
8. `weatherDomManager.js` usa ese objeto para pintar la card.
9. Opcionalmente, el snapshot se guarda en `localStorage` para reutilizarlo si la proxima carga falla.

## Que es un snapshot en esta feature

Un "snapshot" es el objeto ya listo para usar por la app.

No contiene la respuesta completa de la API. Contiene solo lo que de verdad necesita la interfaz:

- temperatura en grados Celsius
- descripcion del clima
- nombre de ciudad o etiqueta visible
- latitud y longitud
- zona horaria u offset
- proveedor que devolvio el dato
- fecha de obtencion

En otras palabras: el snapshot es la version "limpia" y util del dato.

## Proveedores y fallback

La feature trabaja con dos servicios:

- `OpenWeather`
  Se usa cuando existe API key.

- `Open-Meteo`
  Se usa como fallback si OpenWeather falla, o como proveedor principal si no hay API key.

Esto hace que la feature sea mas comoda para una app de prueba:

- si hay key, se aprovecha OpenWeather
- si no hay key, la feature no se rompe
- si un proveedor falla, todavia hay una alternativa

## API publica mas importante

Desde fuera del feature, lo normal es trabajar con lo que exporta `index.js`.

Las funciones mas utiles son:

- `getLocalWeatherSnapshot()`
  Devuelve el clima actual del usuario ya transformado a un formato util para la app.

- `getStoredLocalWeatherSnapshot()`
  Lee el ultimo snapshot guardado en `localStorage`.

- `saveLocalWeatherSnapshot(snapshot)`
  Guarda un snapshot en cache local.

- `createWeatherDomManager(root)`
  Devuelve un gestor de DOM para pintar y actualizar la card del clima.

- `formatTemperature(value)`
- `formatWeatherDate(date)`
- `formatWeatherTime(date)`
- `getWeatherStatusIcon(description, date)`
- `getWeatherTimePeriod(date)`

Estas utilidades se separan para que la UI no tenga que rehacer logica cada vez.

## Configuracion de la API key

Si quieres usar OpenWeather, la key se puede definir en runtime:

```html
<script>
  window.H2O_PLEASE_WEATHER_API_KEY = "tu-api-key";
</script>
```

Tambien puede guardarse en `localStorage` durante desarrollo:

```js
localStorage.setItem("H2O_PLEASE_WEATHER_API_KEY", "tu-api-key");
```

En este proyecto se recomienda usar:

- `scripts/config/weatherRuntimeConfig.example.js`
  Archivo de ejemplo trackeado por Git.

- `scripts/config/weatherRuntimeConfig.local.js`
  Archivo local ignorado por Git, pensado para guardar la key real.

Si una pantalla necesita la feature del clima, debe cargar antes:

```html
<script src="scripts/config/weatherRuntimeConfig.local.js"></script>
```

## Como se pinta la card

La tarjeta no se pinta directamente desde la pagina.

La pagina delega esa responsabilidad al `DomManager`.

Eso ayuda a que:

- la logica de render este en un solo sitio
- la preview y una integracion real compartan el mismo comportamiento
- la UI sea mas facil de mantener

El `DomManager` puede:

- localizar los nodos de la tarjeta
- renderizar el snapshot
- mostrar errores
- actualizar la fecha y la hora local cada segundo

## Preview local

Para probar esta feature de forma aislada, abre:

```text
/weather-preview.html
```

Esa vista monta la card y usa esta misma feature para cargar datos reales.

Tambien hay una integracion de ejemplo en la raiz del proyecto, para ver como se conectaria con una pagina normal.

## Que deberia entender un alumno al leer esta carpeta

Si estas aprendiendo fullstack, esta feature es un buen ejemplo de varias ideas importantes:

- una API externa no deberia mezclarse directamente con el DOM
- la respuesta cruda de una API suele necesitar transformacion antes de usarse
- el cache local puede mejorar la experiencia cuando una peticion falla
- una fachada como `index.js` simplifica las importaciones desde fuera
- separar por responsabilidad hace que el codigo sea mas legible

## Limites actuales de la feature

Esta carpeta esta pensada para una aplicacion de prueba y una integracion futura sencilla.

Por eso:

- no intenta resolver todos los casos de negocio posibles
- no tiene una pantalla final de dashboard cerrada
- prioriza claridad y reutilizacion por encima de una arquitectura mas compleja

## Resumen corto

Si tuvieras que explicarla en una sola frase:

> `weather-api` obtiene el clima del usuario, lo transforma a un formato simple y lo deja listo para renderizar en una card reutilizable.
