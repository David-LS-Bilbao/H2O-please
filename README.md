# H2O Please

H2O Please es una aplicacion web frontend para registrar el consumo diario de agua y consultar el progreso de hidratacion del usuario. Esta version final funciona solo en cliente, usa HTML, CSS y JavaScript vanilla, persiste los datos en `localStorage` y añade una tarjeta de clima integrada en el dashboard.

## Estado del proyecto

La aplicacion esta cerrada como frontend estatico:

- acceso con login y registro local
- dashboard con vistas `HOY`, `HISTORIAL` y `YO`
- gestion del consumo diario de agua
- perfil de usuario con recalculo del objetivo diario
- modo oscuro con toggle en dashboard
- tarjeta de clima reutilizable en dashboard
- preview independiente de la weather card

No hay backend, base de datos, build, `npm` ni pipeline de test automatizado en el estado actual del repositorio.

## Funcionalidades incluidas

- Registro local de usuario con `username` y `password`
- Inicio de sesion local con validacion de credenciales
- Autologin si ya existe una sesion activa
- Dashboard con contador, progreso y objetivo diario
- Alta manual de agua consumida desde el formulario principal
- Proteccion basica frente a clicks repetidos en el boton de beber
- Historial diario de tomas con borrado individual
- Reinicio automatico del consumo al cambiar de dia
- Vista de perfil con edad, peso y recalculo del objetivo diario
- Vuelta automatica a la vista `HOY` despues de guardar el perfil
- Cierre de sesion desde la vista `YO`
- Modo oscuro en dashboard
- Tarjeta de clima con geolocalizacion y cache local
- Fallback meteorologico cuando no hay API key de OpenWeather
- Vista `weather-preview.html` para revisar la card de clima de forma aislada

## Tecnologias

- HTML5
- CSS3
- JavaScript vanilla con modulos ES
- `localStorage`
- Geolocation API del navegador
- Fetch API
- OpenWeather API
- Open-Meteo API
- BigDataCloud Reverse Geocoding API

## Estructura real del proyecto

```text
H2O-please/
├─ assets/
│  ├─ fonts/
│  └─ images/
├─ docs/
│  ├─ DOCUMENTACION.html
│  ├─ Estructure.md
│  ├─ Feature_api_clima.md
│  ├─ GitHub_guia_flujo.md
│  ├─ H2O_Please_guia_git_ollama_docs_equipo.md
│  └─ resumen_integracion_h2o_please_v2.md
├─ scripts/
│  ├─ config/
│  │  ├─ weatherRuntimeConfig.example.js
│  │  └─ weatherRuntimeConfig.local.js
│  ├─ core/
│  │  ├─ App.js
│  │  ├─ DOMManager.js
│  │  ├─ Navigation.js
│  │  ├─ Views.js
│  │  ├─ storage.js
│  │  └─ utils.js
│  ├─ features/
│  │  └─ weather-api/
│  │     ├─ README_API.md
│  │     ├─ index.js
│  │     ├─ weatherApiClient.js
│  │     ├─ weatherCache.js
│  │     ├─ weatherConfig.js
│  │     ├─ weatherDomManager.js
│  │     └─ weatherService.js
│  ├─ models/
│  │  └─ UserConsumption.js
│  ├─ pages/
│  │  ├─ dashboardWeatherIntegration.js
│  │  ├─ weatherCardIntegration.js
│  │  └─ weatherPreviewPage.js
│  ├─ services/
│  │  └─ authService.js
│  ├─ darkmode.js
│  ├─ dashboard.js
│  └─ index.js
├─ styles/
│  ├─ styles.css
│  └─ weather-preview.css
├─ dashboard.html
├─ index.html
├─ weather-preview.html
└─ README.md
```

## Como ejecutar el proyecto en local

El proyecto no necesita instalacion de dependencias. Basta con servir los archivos estaticos desde un servidor local.

```bash
git clone https://github.com/David-LS-Bilbao/H2O-please.git
cd H2O-please
python3 -m http.server 5500
```

Despues abre en el navegador:

- `http://localhost:5500/` para login y registro
- `http://localhost:5500/dashboard.html` si ya existe un usuario activo
- `http://localhost:5500/weather-preview.html` para revisar la weather card por separado

Nota: la geolocalizacion del clima requiere un contexto seguro o `localhost`. Para desarrollo local, `http://localhost:5500` es valido.

## Flujo de uso

1. Abre `index.html`.
2. Usa la pestana `Iniciar sesion` o `Crear cuenta`.
3. Al autenticarse, la aplicacion redirige a `dashboard.html`.
4. En `HOY` puedes:
   - consultar el objetivo diario
   - ver el total consumido
   - revisar la tarjeta de clima
   - anadir una nueva toma de agua
5. En `HISTORIAL` puedes revisar las tomas del dia y borrar entradas.
6. En `YO` puedes editar edad y peso, guardar cambios y cerrar sesion.

## Persistencia en localStorage

La aplicacion guarda todo el estado en `localStorage`.

### Claves principales

| Clave | Uso |
| --- | --- |
| `currentUser` | Usuario con sesion activa |
| `userConsumption:<username>` | Estado persistido del usuario |
| `H2O_PLEASE_WEATHER_API_KEY` | API key opcional de OpenWeather |
| `localWeatherSnapshot` | Ultimo snapshot meteorologico valido |

### Estado de usuario guardado

La entrada `userConsumption:<username>` contiene la informacion funcional del usuario, por ejemplo:

- `username`
- `password`
- `lastTimeConsumed`
- `lastTimeConsumedUnix`
- `nextAlarm`
- `waterConsumed`
- `consumptionTarget`
- `history`
- `lastDate`
- `age`
- `weight`

## Clima: como funciona en esta version

La feature meteorologica vive en `scripts/features/weather-api/` y se monta desde:

- `scripts/pages/dashboardWeatherIntegration.js` para `dashboard.html`
- `scripts/pages/weatherPreviewPage.js` para `weather-preview.html`

### Flujo real

1. Se monta la weather card en el contenedor correspondiente.
2. Si existe un snapshot local previo, se pinta primero para no dejar la vista vacia.
3. La app intenta obtener la ubicacion del usuario.
4. Si hay API key de OpenWeather, usa OpenWeather como proveedor principal.
5. Si no hay API key, o el proveedor principal no aplica, usa Open-Meteo.
6. Intenta resolver una ubicacion legible con BigDataCloud.
7. Guarda el ultimo snapshot valido en `localStorage`.
8. Si falla el refresco por red o proveedor y habia cache previa, reutiliza ese dato guardado.

### Configuracion recomendada

La app puede funcionar sin API key gracias al fallback con Open-Meteo. Si quieres usar OpenWeather, la forma mas simple es guardar la key en `localStorage`:

```js
localStorage.setItem("H2O_PLEASE_WEATHER_API_KEY", "tu-api-key");
```

El repositorio tambien incluye estos ficheros de apoyo:

```text
scripts/config/weatherRuntimeConfig.example.js
scripts/config/weatherRuntimeConfig.local.js
```

La plantilla esperada es:

```js
window.H2O_PLEASE_WEATHER_API_KEY = "tu-api-key";
```

## Limitaciones reales

- Es una aplicacion frontend pura; no hay backend ni persistencia remota.
- Los datos de usuario y password quedan en `localStorage`, asi que no es un sistema de autenticacion seguro para produccion.
- No hay tests automatizados, lint ni build en el repositorio actual.
- La geolocalizacion y las llamadas al clima dependen del navegador, la red y los permisos del usuario.
- La preview del clima y el dashboard sirven para validacion manual, no para pruebas automatizadas.

## Documentacion adicional

El repositorio incluye documentacion tecnica complementaria en `docs/`:

- `docs/Feature_api_clima.md`
- `docs/GitHub_guia_flujo.md`
- `docs/resumen_integracion_h2o_please_v2.md`
- `docs/DOCUMENTACION.html`

La documentacion especifica de la feature meteorologica esta en:

- `scripts/features/weather-api/README_API.md`

## Equipo

Proyecto desarrollado e integrado por el equipo de H2O Please.
