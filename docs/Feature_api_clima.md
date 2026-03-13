# Feature API clima

## 1. Objetivo de la feat

Esta feat deja preparada la capa de consumo del clima para reutilizarla despues
en `dev` y `main`, sin acoplarla todavia a una pantalla definitiva.

Su responsabilidad es:
- leer la API key desde una configuracion local
- obtener la ubicacion del usuario
- consultar un proveedor del clima
- guardar y recuperar cache local
- exponer utilidades para pintar una card de clima
- centralizar el render del DOM en un DomManager reutilizable

No intenta cerrar todavia la UI final del dashboard.

---

## 2. Alcance actual

### Incluido
- Configuracion local opcional para la API key.
- Servicio de geolocalizacion del navegador.
- Cliente HTTP para OpenWeather con fallback automatico a Open-Meteo.
- Cache local en `localStorage`.
- Formateadores de temperatura, fecha y hora.
- Capa visual para decidir icono y estado dia/noche.
- DomManager compartido para renderizar la card sin duplicar codigo.
- Pantalla de preview para validar la feature aislada.
- Integracion de ejemplo en `index.html`.
- Rediseño de la card con jerarquia visual mejorada y estilo glassmorphism.

### No incluido todavia
- Integracion final en `dashboard.html`.
- Gestion de secretos para produccion real.
- Estilos compartidos definitivos de la app.

---

## 3. Estructura de archivos

```text
H2O-please/
├─ .gitignore
├─ index.html
├─ weather-preview.html
├─ docs/
│  └─ Feature_api_clima.md
├─ scripts/
│  ├─ config/
│  │  ├─ weatherRuntimeConfig.example.js
│  │  └─ weatherRuntimeConfig.local.js   # local, ignorado por Git
│  ├─ features/
│  │  └─ weather-api/
│  │     ├─ README.md
│  │     ├─ dom/
│  │     │  └─ weatherDomManager.js
│  │     ├─ index.js
│  │     ├─ weatherApiClient.js
│  │     ├─ weatherCache.js
│  │     ├─ weatherConfig.js
│  │     ├─ weatherFormatters.js
│  │     ├─ weatherPreviewPage.js
│  │     ├─ weatherService.js
│  │     └─ weatherVisuals.js
│  └─ pages/
│     └─ indexWeatherDemo.js
└─ styles/
   ├─ styles.css
   └─ weather-preview.css
```

---

## 4. Punto unico de configuracion

La key real no debe viajar en Git.
Ahora es opcional: si no existe, la feature usa el fallback automatico.

Para eso se usa:
- `scripts/config/weatherRuntimeConfig.example.js` como plantilla trackeada
- `scripts/config/weatherRuntimeConfig.local.js` como archivo local ignorado

Contenido esperado del archivo local:

```js
window.H2O_PLEASE_WEATHER_API_KEY = "tu-api-key";
```

Este archivo se carga antes de cualquier modulo que consuma el clima.

Ejemplo:

```html
<script src="scripts/config/weatherRuntimeConfig.local.js"></script>
<script type="module" src="scripts/pages/indexWeatherDemo.js"></script>
```

---

## 5. API publica de la feature

La entrada publica de la feat es:

```text
scripts/features/weather-api/index.js
```

Funciones disponibles:
- `getLocalWeatherSnapshot()`
- `getStoredLocalWeatherSnapshot()`
- `saveLocalWeatherSnapshot(snapshot)`
- `clearStoredLocalWeatherSnapshot()`
- `formatTemperature(value)`
- `formatWeatherDate(date)`
- `formatWeatherTime(date)`
- `getWeatherStatusIcon(description, date)`
- `getWeatherTimePeriod(date)`
- `createWeatherDomManager(root)`

Idea clave:
- la pagina importa desde `index.js`
- la pagina crea el DomManager
- la feature se encarga de datos, cache, utilidades y render compartido

---

## 6. Flujo de funcionamiento

1. La pagina carga `weatherRuntimeConfig.local.js`.
2. El script de la pagina importa la feature desde `scripts/features/weather-api/index.js`.
3. La pagina crea `createWeatherDomManager()` para reutilizar el pintado.
4. La pagina intenta leer un snapshot previo desde `localStorage`.
5. Si existe cache, el DomManager lo pinta primero para evitar pantalla vacia.
6. El DomManager arranca el reloj local.
7. La feature pide la ubicacion del usuario.
8. La feature consulta OpenWeather si hay key y, si no, usa Open-Meteo.
9. La feature calcula iconografia y periodo visual dia/noche.
10. La pagina pinta el resultado a traves del DomManager y guarda el snapshot actualizado.

---

## 7. Archivos clave y responsabilidad

### `scripts/features/weather-api/weatherConfig.js`
Lee la configuracion de la API key desde `window` o `localStorage`.

### `scripts/features/weather-api/weatherApiClient.js`
Construye la URL y hace la peticion HTTP al proveedor activo del clima.

### `scripts/features/weather-api/weatherService.js`
Compone la llamada completa y devuelve un snapshot util para la UI.

### `scripts/features/weather-api/weatherCache.js`
Gestiona la persistencia local del snapshot del clima.

### `scripts/features/weather-api/weatherFormatters.js`
Formatea temperatura, fecha y hora para la interfaz.

### `scripts/features/weather-api/weatherVisuals.js`
Resuelve el icono meteorologico y el modo visual dia/noche para la card.

### `scripts/features/weather-api/dom/weatherDomManager.js`
Centraliza el acceso al DOM, el reloj local y el render de la card del clima.

### `scripts/features/weather-api/weatherPreviewPage.js`
Usa la feature en una pantalla dedicada de preview y delega el render en el DomManager.

### `scripts/pages/indexWeatherDemo.js`
Ejemplo de integracion en una pagina real del proyecto usando el mismo DomManager.

---

## 8. Como probar la feat en local

Desde la raiz del proyecto:

```bash
cd /Users/david_mac/Desktop/PROG/H2O-please
python3 -m http.server 5500
```

Rutas utiles:
- `http://localhost:5500/weather-preview.html`
- `http://localhost:5500/`

Que deberia ocurrir:
- el navegador pedira permiso de ubicacion
- se mostrara ciudad, clima, temperatura, fecha y hora local
- la condicion aparecera en una pildora con icono
- la card cambiara ligeramente segun franja horaria
- el snapshot se guardara en `localStorage`
- si no hay key local, seguira funcionando con el fallback automatico

---

## 9. Como integrarlo despues en dashboard

Cuando llegue el momento de llevarlo a `dashboard.html`, el patron recomendado es:

1. cargar `scripts/config/weatherRuntimeConfig.local.js`
2. crear la card en `dashboard.html`
3. crear un script de pagina especifico, por ejemplo `scripts/pages/dashboardWeather.js`
4. importar desde `scripts/features/weather-api/index.js`
5. reutilizar el flujo de cache, reloj local y refresco de API

La referencia actual para hacerlo es:
- `weather-preview.html`
- `scripts/features/weather-api/dom/weatherDomManager.js`
- `scripts/features/weather-api/weatherPreviewPage.js`
- `index.html`
- `scripts/pages/indexWeatherDemo.js`
- `scripts/features/weather-api/weatherVisuals.js`

---

## 10. Que debe ir al commit

Debe entrar en Git:
- `.gitignore`
- `docs/Feature_api_clima.md`
- `scripts/config/weatherRuntimeConfig.example.js`
- `scripts/features/weather-api/`
- `scripts/pages/indexWeatherDemo.js`
- `styles/weather-preview.css`
- `weather-preview.html`
- cambios de `index.html`
- cambios de `scripts/main.js`
- cambios de `styles/styles.css`

No debe entrar en Git:
- `scripts/config/weatherRuntimeConfig.local.js`

---

## 11. Resumen operativo

Esta feat ya deja preparado:
- el consumo de la API del clima
- la configuracion local de la key
- la capa visual para iconos y modo dia/noche
- una preview funcional
- una integracion de ejemplo en el index de prueba
- una card redisenada y lista para reutilizar en el dashboard final

Con esto, el siguiente paso natural sera mover la card al dashboard final sin
duplicar logica y sin volver a tocar la capa de consumo.
