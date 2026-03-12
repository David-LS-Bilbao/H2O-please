# Flujo correcto para pasar una rama a `dev`

Esta guía explica cómo debe trabajar el equipo cuando una rama de funcionalidad esté terminada y queramos unirla correctamente a la rama `dev`.

---

## Objetivo

Evitar errores, conflictos y merges desordenados.

La idea es simple:
- cada persona trabaja en su propia rama,
- cuando termina una funcionalidad, la sube a GitHub,
- crea un **Pull Request (PR)** hacia `dev`,
- se revisa,
- y entonces se hace el merge.

---

## Regla principal

**Hacemos merge a `dev` mediante Pull Request.**

No se debe trabajar directamente sobre `dev` para desarrollar funcionalidades.

---

## Pasos correctos cuando una rama está lista

### 1. Guardar los cambios y hacer commit en tu rama

```bash
git add .
git commit -m "feat: add progress bar component"
```

Usa un mensaje claro y corto.

Ejemplos:
- `feat: add water history section`
- `feat: connect weather api`
- `fix: correct progress calculation`
- `docs: update project workflow`

---

### 2. Subir tu rama a GitHub

```bash
git push origin nombre-de-tu-rama
```

Ejemplo:

```bash
git push origin feat/progress-bar
```

Importante:
- `push` **solo sube la rama** al remoto.
- `push` **no la une a `dev`**.

---

### 3. Actualizar tu rama con `dev` antes del Pull Request

Antes de abrir el PR, conviene traer los últimos cambios de `dev` para detectar conflictos cuanto antes.

```bash
git checkout dev
git pull origin dev
git checkout feat/progress-bar
git pull origin dev --rebase
```

Si hiciste rebase, normalmente tendrás que volver a subir la rama así:

```bash
git push origin feat/progress-bar --force-with-lease
```

> Usar `--force-with-lease` es más seguro que `--force`.

---

### 4. Crear el Pull Request en GitHub

En la web de GitHub:

- abre el repositorio,
- entra en la rama que has subido,
- pulsa **Compare & pull request**,
- revisa que esté así:

- **base:** `dev`
- **compare:** `tu-rama`

Ejemplo:
- **base:** `dev`
- **compare:** `feat/progress-bar`

---

### 5. Rellenar bien el Pull Request

El PR debe ser fácil de revisar.

### Título recomendado

Usa un título claro:
- `feat: add progress bar`
- `feat: add localStorage support`
- `fix: solve hydration total bug`

### Descripción recomendada

Puedes usar este formato:

```md
## Qué hace este PR
- Añade la barra de progreso
- Muestra el porcentaje diario
- Actualiza el dashboard

## Qué archivos toca
- index.html
- css/styles.css
- js/ui/renderDashboard.js

## Cómo probarlo
1. Abrir la app
2. Añadir agua
3. Verificar que sube la barra de progreso

## Notas
- No incluye integración con localStorage todavía
```

---

### 6. Revisar antes de hacer merge

Antes de unir la rama a `dev`, comprobad:

- que funciona,
- que no rompe otras partes del proyecto,
- que el PR solo incluye esa funcionalidad,
- que no hay archivos innecesarios.

Si podéis, que al menos otro compañero lo revise antes del merge.

---

### 7. Hacer merge a `dev`

Si todo está bien:

- pulsa **Merge pull request**,
- luego **Confirm merge**.

Con eso, la funcionalidad ya pasa a `dev`.

---

### 8. Borrar la rama si ya no se va a usar

Después del merge, si la rama ya terminó su trabajo, se puede borrar.

En GitHub:
- botón **Delete branch**

En local:

```bash
git branch -d feat/progress-bar
```

Y si quieres limpiar referencias remotas:

```bash
git fetch --prune
```

---

## Flujo resumido

```bash
git add .
git commit -m "feat: add progress bar"
git push origin feat/progress-bar

git checkout dev
git pull origin dev
git checkout feat/progress-bar
git pull origin dev --rebase
git push origin feat/progress-bar --force-with-lease
```

Después:
- abrir PR en GitHub,
- revisar,
- merge a `dev`.

---

## Qué NO hacer

### No hacer esto:
- trabajar directamente en `dev`
- hacer cambios grandes sin commits intermedios
- abrir un PR con varias funcionalidades mezcladas
- hacer merge a `main` antes de tiempo
- pensar que `git push` ya une la rama

---

## Checklist antes de abrir un Pull Request

- [ ] Estoy en mi rama, no en `dev`
- [ ] He hecho `git add` y `git commit`
- [ ] He subido la rama con `git push`
- [ ] He actualizado mi rama con `dev`
- [ ] La funcionalidad funciona
- [ ] El PR va hacia `dev`
- [ ] El título del PR es claro
- [ ] He explicado qué hace y cómo probarlo

---

## Checklist antes de hacer merge

- [ ] El PR corresponde a una sola funcionalidad
- [ ] No hay conflictos sin resolver
- [ ] Otro compañero lo ha revisado si es posible
- [ ] No rompe otras partes del proyecto
- [ ] La base del PR es `dev`

---

## Errores típicos

### 1. “Ya hice push, así que ya está en dev”
No.

`git push` solo sube tu rama a GitHub.

Para pasarla a `dev` hace falta:
- abrir Pull Request,
- revisarlo,
- hacer merge.

---

### 2. Crear la rama desde `main` en vez de `dev`
Problema:
- luego faltan cambios,
- el PR sale raro,
- aparecen diferencias que no tocan.

Solución:
- crear siempre las ramas desde `dev`.

---

### 3. No actualizar tu rama con `dev`
Problema:
- conflictos al final,
- merge difícil,
- pérdida de tiempo.

Solución:
- antes del PR, traer `dev` con rebase.

---

### 4. Un PR demasiado grande
Problema:
- difícil de revisar,
- más riesgo de errores,
- más conflictos.

Solución:
- una rama = una funcionalidad.

---

## Recomendación para el equipo H2O Please

Flujo recomendado:

1. `main` queda como rama estable
2. `dev` se usa como rama de integración
3. cada persona trabaja en su rama feature
4. cada feature hace PR a `dev`
5. cuando `dev` esté estable y probado, entonces se pasa a `main`

---

## Ejemplo real

Supongamos que la rama es:

```bash
feat/progress-bar
```

Flujo:

```bash
git checkout feat/progress-bar
git add .
git commit -m "feat: add progress bar"
git push origin feat/progress-bar

git checkout dev
git pull origin dev
git checkout feat/progress-bar
git pull origin dev --rebase
git push origin feat/progress-bar --force-with-lease
```

Luego en GitHub:
- PR de `feat/progress-bar` hacia `dev`
- revisión
- merge
- borrar rama

---

## Nombre sugerido para este archivo en el repo

Puedes subirlo como:

- `docs/flujo-rama-a-dev.md`
- o `docs/github-pull-request-guide.md`

---

## Resumen final

Cuando una rama esté lista:

1. commit
2. push
3. actualizar con `dev`
4. abrir PR hacia `dev`
5. revisar
6. merge
7. borrar rama

Ese es el flujo correcto para trabajar en equipo sin liaros.
