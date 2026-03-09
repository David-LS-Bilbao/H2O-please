# H2O Please — Guía de estructura y plan de trabajo

## 1. Resumen del proyecto
**H2O Please** es una aplicación web para registrar el consumo de agua diario.

### Objetivo del MVP
Crear una app sencilla donde el usuario pueda:
- registrar vasos o mililitros de agua,
- ver cuánto lleva consumido hoy,
- comprobar su progreso respecto a un objetivo diario,
- guardar los datos en `localStorage`,
- y consultar un historial simple sin recargar la página.

---

## 2. Tecnologías base
- **HTML5**
- **CSS3**
- **JavaScript Vanilla (módulos ES)**
- **localStorage**
- Git + GitHub para trabajo en equipo

> De momento no usamos framework para no complicar el proyecto.

---

## 3. Estructura de carpetas recomendada

```text
H2O_Please/
├─ index.html
├─ README.md
├─ .gitignore
├─ assets/
│  ├─ icons/
│  ├─ images/
│  └─ screenshots/
├─ css/
│  ├─ reset.css
│  ├─ variables.css
│  └─ styles.css
├─ js/
│  ├─ main.js
│  ├─ data/
│  │  └─ challenges.js
│  ├─ models/
│  │  ├─ WaterEntry.js
│  │  └─ User.js
│  ├─ services/
│  │  ├─ storageService.js
│  │  └─ apiService.js
│  ├─ ui/
│  │  ├─ renderDashboard.js
│  │  ├─ renderHistory.js
│  │  └─ renderStats.js
│  ├─ utils/
│  │  ├─ helpers.js
│  │  └─ validators.js
│  └─ controllers/
│     └─ appController.js
├─ docs/
│  ├─ memoria-tecnica.md
│  ├─ tareas-equipo.md
│  └─ decisiones.md
└─ .vscode/
   └─ settings.json
```

---

## 4. Qué va en cada carpeta

### Raíz del proyecto
#### `index.html`
Archivo principal de la app.
Aquí vive la estructura base de la interfaz.

#### `README.md`
Documento público del proyecto.
Debe explicar:
- qué es la app,
- cómo se ejecuta,
- tecnologías usadas,
- cómo se usa,
- y quién participa.

#### `.gitignore`
Sirve para evitar subir archivos innecesarios al repositorio.

---

### `assets/`
Carpeta para recursos visuales.

#### `assets/icons/`
Iconos de la aplicación.

#### `assets/images/`
Imágenes generales del proyecto.

#### `assets/screenshots/`
Capturas para README, memoria o entrega final.

---

### `css/`
Todo el estilo visual del proyecto.

#### `css/reset.css`
Reinicia estilos por defecto del navegador para evitar diferencias raras.

#### `css/variables.css`
Variables CSS del proyecto:
- colores,
- tipografías,
- espaciados,
- tamaños base.

#### `css/styles.css`
Estilos principales:
- layout,
- componentes,
- botones,
- tarjetas,
- responsive.

---

### `js/`
Toda la lógica JavaScript.

#### `js/main.js`
Punto de entrada de la app.
Inicializa eventos y arranca la aplicación.

---

### `js/data/`
Datos estáticos del proyecto.

#### `js/data/challenges.js`
Opcional.
Aquí se podrían guardar retos o mensajes tipo:
- “Bebe 2 litros hoy”
- “Has completado tu objetivo”

> Si no se usa al principio, puede quedar vacío o no crearse todavía.

---

### `js/models/`
Aquí va la parte de **Programación Orientada a Objetos (POO)**.

#### `js/models/WaterEntry.js`
Clase para representar un registro de agua.
Ejemplo:
- cantidad (`amount`)
- fecha (`date`)
- métodos útiles como hora formateada

#### `js/models/User.js`
Clase para representar el usuario o configuración principal.
Ejemplo:
- nombre
- objetivo diario
- cálculo de progreso

---

### `js/services/`
Servicios que gestionan datos externos o persistencia.

#### `js/services/storageService.js`
Encargado de guardar y leer datos de `localStorage`.

Ejemplos:
- guardar registros,
- recuperar registros,
- borrar historial,
- guardar preferencias.

#### `js/services/apiService.js`
Preparado para futuras APIs externas.

Ejemplo de uso futuro:
- API del clima para recomendar beber más agua según la temperatura.

> Si no usáis API al principio, se puede dejar preparado para más adelante.

---

### `js/ui/`
Funciones que pintan la interfaz.

#### `js/ui/renderDashboard.js`
Renderiza el panel principal:
- total consumido hoy,
- objetivo,
- porcentaje,
- barra de progreso.

#### `js/ui/renderHistory.js`
Renderiza la lista o tabla del historial de registros.

#### `js/ui/renderStats.js`
Renderiza estadísticas o visualizaciones.
Por ejemplo:
- total diario,
- promedio,
- gráfico simple.

---

### `js/utils/`
Funciones auxiliares reutilizables.

#### `js/utils/helpers.js`
Funciones pequeñas como:
- formatear fechas,
- sumar cantidades,
- filtrar registros de hoy.

#### `js/utils/validators.js`
Validaciones simples:
- cantidad válida,
- campos no vacíos,
- límites razonables.

---

### `js/controllers/`
Coordina la app.

#### `js/controllers/appController.js`
Une todo:
- escucha eventos,
- llama a modelos,
- usa servicios,
- actualiza UI.

Es el archivo que conecta la lógica con la interfaz.

---

### `docs/`
Documentación interna del proyecto.

#### `docs/memoria-tecnica.md`
Base para la memoria técnica de la entrega.
Debe incluir:
- arquitectura,
- flujo de datos,
- decisiones técnicas,
- dificultades,
- conclusiones.

#### `docs/tareas-equipo.md`
Documento para registrar reparto de trabajo.
Muy útil para demostrar colaboración y reparto equilibrado.

#### `docs/decisiones.md`
Registro corto de decisiones del equipo.
Ejemplos:
- por qué usamos Vanilla JS,
- por qué usamos localStorage,
- por qué aplazamos ciertas features.

---

### `.vscode/`
Configuración local opcional de VS Code.

#### `.vscode/settings.json`
Sirve para unificar algunas opciones del editor.
Por ejemplo:
- formato,
- tabulación,
- final de línea.

> No es imprescindible, pero puede ayudar a trabajar más ordenados.

---

## 5. MVP funcional recomendado

### Funcionalidades mínimas
1. Registrar agua con botones rápidos:
   - `+250 ml`
   - `+500 ml`
2. Mostrar el total de agua consumida hoy.
3. Mostrar un objetivo diario (por ejemplo `2000 ml`).
4. Calcular y mostrar el porcentaje de progreso.
5. Guardar registros en `localStorage`.
6. Ver historial del día.
7. Actualizar la pantalla sin recargar la página.

---

## 6. Reparto de trabajo para 4 estudiantes

La idea es **repartir por bloques**, no por archivos sueltos.
Así evitamos que todos toquen lo mismo a la vez.

### Persona 1 — HTML/CSS
Responsable de la base visual.

**Tareas:**
- crear `index.html`
- estructura del dashboard
- botones de registro
- estilos base
- responsive inicial
- barra de progreso visual

**Archivos principales:**
- `index.html`
- `css/reset.css`
- `css/variables.css`
- `css/styles.css`

---

### Persona 2 — Modelos y cálculos
Responsable de la parte POO.

**Tareas:**
- crear clase `WaterEntry`
- crear clase `User`
- cálculos de total diario
- cálculo de porcentaje
- funciones auxiliares de fechas y sumas

**Archivos principales:**
- `js/models/WaterEntry.js`
- `js/models/User.js`
- `js/utils/helpers.js`

---

### Persona 3 — Persistencia y controlador
Responsable de la gestión de datos.

**Tareas:**
- guardar datos en `localStorage`
- leer datos guardados
- borrar registros si se necesita
- conectar eventos con lógica
- coordinar la app principal

**Archivos principales:**
- `js/services/storageService.js`
- `js/controllers/appController.js`
- `js/main.js`

---

### Persona 4 — Render + documentación
Responsable de mostrar datos y dejar bien presentada la entrega.

**Tareas:**
- render del historial
- render de estadísticas
- README inicial y final
- memoria técnica
- reparto de tareas documentado
- capturas para el repo

**Archivos principales:**
- `js/ui/renderDashboard.js`
- `js/ui/renderHistory.js`
- `js/ui/renderStats.js`
- `README.md`
- `docs/memoria-tecnica.md`
- `docs/tareas-equipo.md`
- `docs/decisiones.md`

---

## 7. Programa de actuación para empezar

## Fase 1 — Preparación del repo
### Objetivo
Dejar una base ordenada antes de programar.

### Tareas
1. Crear la estructura de carpetas.
2. Subir un primer commit base a `dev`.
3. Añadir `README.md` inicial con nombre del proyecto.
4. Confirmar que todos los miembros tienen acceso al repo.
5. Crear una rama por persona desde `dev`.

---

## Fase 2 — Construcción del MVP
### Objetivo
Conseguir una primera versión funcional cuanto antes.

### Tareas
1. Montar el layout en HTML/CSS.
2. Crear clases `WaterEntry` y `User`.
3. Implementar el guardado en `localStorage`.
4. Conectar botones para añadir agua.
5. Mostrar total diario y progreso.
6. Renderizar historial.

---

## Fase 3 — Integración
### Objetivo
Unir todas las piezas.

### Tareas
1. Integrar HTML + lógica JS.
2. Probar que los datos persisten al recargar.
3. Revisar que el historial se actualiza sin refrescar.
4. Comprobar responsive.
5. Resolver bugs.

---

## Fase 4 — Mejora y entrega
### Objetivo
Pulir el proyecto y preparar la documentación.

### Tareas
1. Mejorar estilos.
2. Añadir visualización de datos simple.
3. Preparar README definitivo.
4. Redactar memoria técnica.
5. Hacer capturas.
6. Revisar ortografía y consistencia del código.

---

## 8. Flujo Git recomendado

### Regla principal
**Nadie trabaja directamente sobre `main`.**

### Flujo recomendado
1. Partir siempre desde `dev`.
2. Crear una rama personal o por tarea.
3. Hacer commits pequeños.
4. Subir la rama al remoto.
5. Abrir Pull Request hacia `dev`.
6. Cuando `dev` esté estable, pasar a `main`.

### Comandos base
```bash
git checkout dev
git pull origin dev
git checkout -b feat/nombre-tarea
```

Ejemplos de ramas:
```bash
git checkout -b feat/ui-dashboard
git checkout -b feat/models-water-entry
git checkout -b feat/storage-local
git checkout -b docs/readme-base
```

Para subir cambios:
```bash
git add .
git commit -m "feat: add dashboard layout"
git pull origin dev --rebase
git push origin feat/ui-dashboard
```

---

## 9. Reglas simples para trabajar en equipo

### Regla 1
Una sola persona toca la estructura principal de `index.html` al principio.

### Regla 2
No meter toda la lógica en `main.js`.
Separar por carpetas.

### Regla 3
Cada uno trabaja en su bloque.

### Regla 4
Antes de hacer `push`, actualizar la rama con `dev`.

### Regla 5
Si algo está roto, se arregla antes de seguir metiendo features.

---

## 10. Checklist de arranque
- [ ] Repo creado con ramas `main` y `dev`
- [ ] Todos tienen acceso
- [ ] Estructura de carpetas creada
- [ ] README inicial subido
- [ ] Cada miembro tiene su rama
- [ ] Reparto de tareas definido
- [ ] MVP decidido
- [ ] Primer objetivo de integración claro

---

## 11. Errores típicos y cómo evitarlos

### 1. Todos editan el mismo archivo
**Problema:** conflictos de merge.

**Solución:** repartir responsabilidades por bloques.

### 2. Todo acaba en `main.js`
**Problema:** archivo enorme y difícil de mantener.

**Solución:** separar en `models`, `services`, `ui`, `controllers`.

### 3. Mal uso de localStorage
**Problema:** guardar objetos sin convertir a JSON.

**Solución:** usar `JSON.stringify()` y `JSON.parse()`.

### 4. Querer hacer demasiadas cosas al principio
**Problema:** no llegar a entregar.

**Solución:** primero MVP, luego extras.

### 5. No documentar el trabajo
**Problema:** luego cuesta justificar el reparto y las decisiones.

**Solución:** actualizar `docs/tareas-equipo.md` y `docs/decisiones.md` durante el proceso.

---

## 12. Extras para destacar (solo si el MVP ya funciona)
- modo oscuro / claro,
- gráfico simple de consumo,
- racha de días cumpliendo objetivo,
- exportación CSV,
- consejo de hidratación,
- integración con API del clima.

---

## 13. Recomendación final
Primero hay que conseguir una app **simple, funcional y clara**.

El orden correcto es:
1. estructura,
2. registro de agua,
3. progreso diario,
4. localStorage,
5. historial,
6. documentación,
7. mejoras opcionales.

No intentéis hacer todo a la vez.

---

## 14. Próximos pasos inmediatos
1. Crear esta estructura en la rama `dev`.
2. Repartir los 4 bloques entre el equipo.
3. Subir un primer commit base.
4. Empezar por el MVP, no por extras.

