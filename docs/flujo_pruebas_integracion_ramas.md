# Flujo para actualizar ramas y hacer pruebas de integración antes de mergear a `dev`

## Objetivo
Tener el repositorio local actualizado con todas las ramas remotas y poder hacer pruebas de unión en ramas temporales antes de mergear a `dev`.

---

## 1. Comprobar que el repo está limpio
```bash
git status
```

Estado ideal:
```bash
nothing to commit, working tree clean
```

Si hay cambios sin guardar:
- haz commit
- o usa stash

```bash
git stash push -u -m "wip before branch sync"
```

---

## 2. Traer toda la información nueva de GitHub
```bash
git fetch origin --prune
```

### Qué hace
- actualiza referencias remotas
- trae ramas nuevas
- limpia referencias de ramas borradas en remoto

---

## 3. Ver qué ramas remotas existen
```bash
git branch -r
```

Opcional, para ver locales + remotas:
```bash
git branch -a
```

---

## 4. Actualizar ramas locales importantes

### Actualizar `dev`
```bash
git checkout dev
git pull --rebase origin dev
```

### Actualizar tu rama feature
```bash
git checkout feat/weather-api-call
git pull --rebase origin feat/weather-api-call
```

---

## 5. Crear una rama local de una rama remota si no la tienes
Ejemplo con la rama `marcos`:

```bash
git checkout -b marcos origin/marcos
```

Ejemplo general:
```bash
git checkout -b nombre-local origin/nombre-rama-remota
```

---

## 6. Hacer pruebas de integración sin tocar `dev`
No pruebes uniones directamente en:
- `dev`
- ni en tu rama `feat` principal

Hazlo en ramas temporales `test/...`.

### Ejemplo: probar tu rama con `marcos`
```bash
git checkout feat/weather-api-call
git checkout -b test/integracion-marcos
git merge origin/marcos
```

### Ejemplo: probar con `feat/restructure`
```bash
git checkout feat/weather-api-call
git checkout -b test/integracion-restructure
git merge origin/feat/restructure
```

### Ejemplo: probar con `feat/progress-bar`
```bash
git checkout feat/weather-api-call
git checkout -b test/integracion-progress-bar
git merge origin/feat/progress-bar
```

---

## 7. Qué comprobar en cada prueba
- conflictos en `index.html`
- compatibilidad visual del dashboard
- si la card de clima encaja en la estructura
- si el CSS pisa otros bloques
- si el JS sigue funcionando
- si el botón `+ BEBER` sigue operativo
- si aparecen errores en consola

---

## 8. Si una prueba sale mal
### Abortar merge
```bash
git merge --abort
```

### O borrar la rama de prueba y empezar de nuevo
```bash
git checkout feat/weather-api-call
git branch -D test/integracion-marcos
```

---

## 9. Si una prueba sale bien
Guardar el experimento:

```bash
git add .
git commit -m "test: integrate weather card into dashboard"
```

> Recomendación: no mergear estas ramas de prueba a `dev` sin revisar bien qué cambios son realmente reutilizables.

---

## 10. Orden recomendado de pruebas
1. `origin/marcos`
2. `origin/feat/restructure`
3. `origin/feat/progress-bar`

---

## 11. Flujo resumen
```bash
git status
git fetch origin --prune

git checkout dev
git pull --rebase origin dev

git checkout feat/weather-api-call
git pull --rebase origin feat/weather-api-call

git checkout -b test/integracion-marcos
git merge origin/marcos
```

---

## Checklist
- [ ] repo limpio
- [ ] `git fetch origin --prune` ejecutado
- [ ] `dev` actualizada
- [ ] tu `feat` actualizada
- [ ] ramas remotas visibles
- [ ] pruebas hechas en ramas `test/...`

---

## Errores típicos
### 1. Hacer pruebas en `dev`
Problema: ensucias la rama compartida.

### 2. Probar encima de tu `feat` real
Problema: mezclas experimentos con trabajo estable.

### 3. Hacer merge de varias ramas a la vez
Problema: luego no sabes qué rompió qué.

### 4. No hacer `fetch`
Problema: pruebas con ramas desactualizadas.

---

## Recomendación final
Usa las ramas `test/...` como laboratorio.  
Cuando termines una prueba, decide:
- qué ideas te sirven
- qué cambios llevarás a tu rama real
- y qué no debe entrar en `dev`
