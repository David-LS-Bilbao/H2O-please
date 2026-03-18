# H2O Please

H2O Please es una aplicacion web frontend para registrar el consumo diario de agua y consultar el progreso de hidratacion del usuario. El proyecto funciona enteramente en cliente con HTML, CSS y JavaScript vanilla, guarda el estado en `localStorage` y actualmente incorpora una integracion de clima local con tarjeta reutilizable.

## Descripcion del proyecto

La aplicacion ofrece un flujo simple de acceso con registro e inicio de sesion local, una pantalla de dashboard con seguimiento de consumo diario, historial de tomas, edicion de perfil, modo oscuro y una tarjeta de clima integrada. El repositorio refleja un proyecto estudiantil en fase de integracion de ramas, con documentacion tecnica adicional dentro de `docs/` y una feature de clima ya simplificada para el caso real de esta app.

## Objetivo

El objetivo actual del proyecto es unificar en una sola base funcional las aportaciones del equipo, manteniendo la aplicacion operativa y respetando la estructura visual ya consolidada. A nivel de producto, la aplicacion busca ayudar a registrar la hidratacion diaria de forma sencilla y mostrar informacion contextual util, como el objetivo diario y el clima local.

## Funcionalidades reales

- Registro de usuario en cliente con `username` y `password`.
- Inicio de sesion local con persistencia del usuario activo.
- Redireccion automatica al dashboard cuando ya existe sesion activa.
- Dashboard con progreso diario de hidratacion.
- Alta manual de agua consumida desde el formulario principal.
- Historial diario de movimientos de agua.
- Reinicio automatico del progreso cuando cambia el dia.
- Perfil de usuario con edad, peso y recalculo del objetivo diario.
- Cierre de sesion desde la vista de perfil.
- Modo oscuro con toggle en el dashboard.
- Integracion de tarjeta de clima en el dashboard.
- Vista previa independiente de la tarjeta de clima en `weather-preview.html`.
- Cache local del ultimo dato meteorologico disponible.
- Fallback meteorologico entre proveedores segun configuracion disponible.
- Login y dashboard con estilos unificados en `styles/styles.css`.

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

## Estructura real de carpetas

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
│  │  └─ weatherRuntimeConfig.example.js
│  ├─ core/
│  │  ├─ App.js
│  │  ├─ DOMManager.js
│  │  └─ storage.js
│  ├─ darkmode.js
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

## Instalacion local

El proyecto no usa gestor de paquetes ni proceso de build en el estado actual del repositorio. Para ejecutarlo en local basta con servir los archivos estaticos desde un servidor local.

```bash
git clone https://github.com/David-LS-Bilbao/H2O-please.git
cd H2O-please
python3 -m http.server 5500
```

Despues abre en el navegador:

- `http://localhost:5500/` para login y registro
- `http://localhost:5500/dashboard.html` si ya existe un usuario activo en `localStorage`
- `http://localhost:5500/weather-preview.html` para revisar la tarjeta del clima de forma aislada

Nota importante: la geolocalizacion del clima requiere un contexto seguro. En desarrollo, `http://localhost:5500` es valido.

## Uso basico

1. Entra en `index.html`.
2. Registra un usuario nuevo o inicia sesion con uno existente.
3. La aplicacion guarda el usuario activo y te lleva al dashboard.
4. En `dashboard.html` puedes:
   - anadir agua consumida
   - revisar el historial del dia
   - editar edad y peso en la vista `YO`
   - cambiar entre modo claro y oscuro
   - ver la tarjeta del clima en el bloque `API DEL TIEMPO`
5. Para revisar solo la feature del clima, abre `weather-preview.html`.

## localStorage

La aplicacion depende de `localStorage` para persistir estado de usuario y clima.

### Claves usadas actualmente

| Clave | Uso real |
| --- | --- |
| `currentUser` | Nombre del usuario con sesion activa |
| `userConsumption:<username>` | Estado completo del usuario |
| `H2O_PLEASE_WEATHER_API_KEY` | API key opcional para clima |
| `localWeatherSnapshot` | Cache del ultimo snapshot meteorologico |

### Datos del usuario

Cada usuario persistido bajo `userConsumption:<username>` guarda, segun el codigo actual:

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

## Integracion con API del clima

La capa de clima vive en `scripts/features/weather-api/` y expone una API publica minima desde `scripts/features/weather-api/index.js`.

### Flujo real

1. La pagina crea o monta la card con `weatherCardIntegration.js`.
2. La feature intenta recuperar un snapshot meteorologico guardado.
3. Solicita geolocalizacion al navegador.
4. Si existe API key, usa OpenWeather.
5. Si no existe API key, o si OpenWeather falla, usa Open-Meteo como fallback.
6. Resuelve la ubicacion legible mediante BigDataCloud.
7. Renderiza ciudad, descripcion, temperatura, fecha y hora local con un `DomManager` compartido.
8. Guarda el ultimo snapshot valido en `localStorage`.

La documentacion especifica de esta feature esta en `scripts/features/weather-api/README_API.md`.

### Configuracion disponible

El repositorio incluye la plantilla:

```text
scripts/config/weatherRuntimeConfig.example.js
```

Su contenido esperado es:

```js
window.H2O_PLEASE_WEATHER_API_KEY = "tu-api-key";
```

Ademas, el propio proyecto permite guardar la clave directamente en `localStorage`:

```js
localStorage.setItem("H2O_PLEASE_WEATHER_API_KEY", "tu-api-key");
```

### Puntos de uso actuales

- `dashboard.html` mediante `scripts/dashboard.js` y `scripts/pages/dashboardWeatherIntegration.js`
- `weather-preview.html` mediante `scripts/pages/weatherPreviewPage.js`

## Estado actual

- Aplicacion frontend funcional sin backend.
- Login y registro locales operativos con layout visual ya unificado.
- Dashboard operativo con progreso diario, historial, perfil y modo oscuro.
- Integracion de clima activa en dashboard y preview aislada.
- Feature de clima simplificada a una estructura corta y centrada en el caso de uso real de la app.
- Documentacion tecnica adicional disponible en `docs/`.
- Estructura aun en fase de integracion y limpieza progresiva.
- No hay scripts de `npm`, pruebas automatizadas ni pipeline de build definidos en el repositorio actual.

## Mejoras futuras

Estas mejoras se desprenden del estado real del repo y de la documentacion incluida:

- completar la limpieza estructural cuando la integracion de ramas este estable
- actualizar la documentacion secundaria de `docs/` para que refleje tambien la estructura nueva de `weather-api`
- unificar mas logica de render entre dashboard y `DOMManager`
- reforzar la gestion de configuracion del clima para entornos de despliegue
- anadir pruebas automatizadas y comandos de desarrollo hoy ausentes
- seguir consolidando la documentacion tecnica y funcional del proyecto

## Documentacion adicional

El repositorio incluye documentacion complementaria en `docs/`, por ejemplo:

- `Feature_api_clima.md` para la feature meteorologica
- `GitHub_guia_flujo.md` para el flujo de trabajo con ramas y PR
- `resumen_integracion_h2o_please_v2.md` para decisiones de integracion
- `DOCUMENTACION.html` como bitacora HTML generada

## Autores / equipo

Segun la documentacion interna del proyecto:

- Luis: base visual principal y funcionalidades ya integradas en su rama
- Marcos: funcionalidades adicionales
- Jon: funcionalidades adicionales
- David: integracion de la API del clima mediante weather card
