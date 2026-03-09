# Guía rápida de Git y GitHub para trabajo en equipo

Esta guía está pensada para el proyecto grupal **H2O Please** y para un equipo de estudiantes que empieza a trabajar con GitHub en ramas.

---

## 1. Idea general del flujo de trabajo

### Ramas del proyecto
- `main` → versión estable/final del proyecto.
- `dev` → rama de trabajo común del equipo.
- `feat/...` → ramas individuales para desarrollar tareas concretas.
- `fix/...` → ramas para corregir errores.
- `docs/...` → ramas para documentación.

### Regla principal
**No trabajar directamente en `main` ni en `dev`.**

Cada persona debe crear su propia rama a partir de `dev`, trabajar ahí y luego abrir un **Pull Request (PR)** hacia `dev`.

---

## 2. Configuración inicial (solo la primera vez)

### Ver tu rama actual
```bash
git branch
```

### Ver el estado de los archivos
```bash
git status
```

### Ver el remoto configurado
```bash
git remote -v
```

### Descargar cambios del repositorio remoto
```bash
git fetch origin
```

---

## 3. Cómo empezar una nueva tarea correctamente

### Paso 1: colocarte en `dev`
```bash
git checkout dev
```

### Paso 2: traer la última versión de `dev`
```bash
git pull origin dev
```

### Paso 3: crear una nueva rama para tu tarea
```bash
git checkout -b feat/nombre-de-tu-tarea
```

### Ejemplos
```bash
git checkout -b feat/dashboard-ui
git checkout -b feat/water-model
git checkout -b feat/storage-local
git checkout -b docs/readme-inicial
```

---

## 4. Cómo guardar cambios: `git add` y `git commit`

### Añadir todos los cambios
```bash
git add .
```

### Añadir un archivo concreto
```bash
git add index.html
```

### Crear un commit
```bash
git commit -m "feat: add dashboard layout"
```

### Ejemplos de mensajes de commit
```bash
git commit -m "feat: add WaterEntry class"
git commit -m "fix: correct progress bar calculation"
git commit -m "docs: add project setup guide"
git commit -m "style: improve mobile spacing"
```

### Recomendación
Haz **commits pequeños y claros**. No esperes a tener 40 cambios mezclados.

---

## 5. Cómo subir tu rama a GitHub: `git push`

### Primera vez que subes tu rama
```bash
git push -u origin feat/nombre-de-tu-tarea
```

### Ejemplo
```bash
git push -u origin feat/dashboard-ui
```

### Las siguientes veces
```bash
git push
```

---

## 6. Cómo actualizar tu rama con los últimos cambios de `dev`

Esto es muy importante para evitar conflictos.

### Opción recomendada para estudiantes: `pull --rebase`

### Paso 1: asegúrate de estar en tu rama
```bash
git branch
```

### Paso 2: trae cambios remotos
```bash
git fetch origin
```

### Paso 3: rebase sobre `dev`
```bash
git pull origin dev --rebase
```

### Alternativa más segura si no controláis rebase todavía
```bash
git pull origin dev
```

### Cuándo hacerlo
- Antes de empezar a trabajar
- Antes de hacer push
- Antes de abrir un Pull Request

---

## 7. Flujo completo de trabajo recomendado

```bash
git checkout dev
git pull origin dev
git checkout -b feat/nueva-tarea
# trabajar en archivos...
git add .
git commit -m "feat: add new feature"
git pull origin dev --rebase
git push -u origin feat/nueva-tarea
```

---

## 8. Cómo hacer un Pull Request correctamente

Un **Pull Request (PR)** es la forma correcta de proponer que tu trabajo se fusione con otra rama.

### En vuestro caso
Normalmente haréis PR:
- **desde** `feat/...`
- **hacia** `dev`

### Pasos para hacer un PR en GitHub
1. Sube tu rama con `git push`.
2. Entra en el repositorio en GitHub.
3. GitHub suele mostrar un botón tipo **Compare & pull request**.
4. Pulsa ese botón.
5. Comprueba bien:
   - **base branch** = `dev`
   - **compare branch** = tu rama `feat/...`
6. Escribe un título claro.
7. Añade una descripción breve de los cambios.
8. Si procede, asigna reviewers del equipo.
9. Crea el PR.

### Plantilla simple para descripción del PR
```md
## Qué he hecho
- He añadido ...
- He corregido ...

## Cómo probarlo
- Ir a ...
- Pulsar ...
- Comprobar que ...

## Notas
- Falta revisar ...
- Puede afectar a ...
```

### Buenas prácticas antes de crear el PR
- Tu rama compila / funciona
- No has subido archivos basura
- Has actualizado tu rama con `dev`
- El PR hace una sola cosa concreta
- El título explica bien el cambio

### Ejemplos de títulos de PR
- `feat: add dashboard water progress`
- `fix: correct localStorage save logic`
- `docs: add initial project README`

---

## 9. Cómo revisar y aceptar un Pull Request

### Antes de hacer merge
Revisad:
- Qué archivos cambia
- Si rompe algo existente
- Si el código se entiende
- Si la funcionalidad hace lo que promete
- Si hay conflictos con `dev`

### Si el PR está bien
Se puede hacer **Merge pull request** hacia `dev`.

### Después del merge
La persona que hizo la rama puede borrarla desde GitHub o desde local.

---

## 10. Cómo borrar una rama

### Borrar rama local
```bash
git branch -d feat/nombre-de-tu-tarea
```

### Borrar rama remota
```bash
git push origin --delete feat/nombre-de-tu-tarea
```

---

## 11. Cómo cambiar de rama

### Ver ramas disponibles
```bash
git branch
```

### Ver ramas locales y remotas
```bash
git branch -a
```

### Cambiar a una rama
```bash
git checkout dev
```

### Cambiar a tu rama de trabajo
```bash
git checkout feat/dashboard-ui
```

---

## 12. Cómo resolver el caso más común: “quiero traer cambios nuevos”

### Si estás en tu rama y quieres actualizarte con `dev`
```bash
git pull origin dev --rebase
```

### Si quieres actualizar tu rama `dev`
```bash
git checkout dev
git pull origin dev
```

---

## 13. Qué hacer si Git dice que tienes conflictos

Un conflicto ocurre cuando dos personas han cambiado la misma parte del archivo.

### Pasos básicos
1. Lee qué archivo tiene conflicto.
2. Abre el archivo en VS Code.
3. Verás marcas como estas:
```txt
<<<<<<< HEAD
Tu cambio
=======
Cambio que viene de otra rama
>>>>>>> rama-remota
```
4. Decide qué versión dejar, o combina ambas.
5. Borra esas marcas.
6. Guarda el archivo.
7. Haz:
```bash
git add .
```
8. Si estabas en un merge:
```bash
git commit -m "fix: resolve merge conflict"
```
9. Si estabas en rebase:
```bash
git rebase --continue
```

### Recomendación
Si sois novatos y el conflicto os bloquea, parad y resolvedlo juntos.

---

## 14. Comandos útiles de consulta

### Ver historial de commits
```bash
git log --oneline --graph --all
```

### Ver diferencias antes de commit
```bash
git diff
```

### Ver diferencias de archivos añadidos al staging
```bash
git diff --staged
```

### Ver en qué rama estás
```bash
git branch --show-current
```

---

## 15. Errores típicos y cómo evitarlos

### Error 1: trabajar en `main`
**Solución:** trabajar siempre desde una rama creada desde `dev`.

### Error 2: no hacer `pull` antes de empezar
**Solución:**
```bash
git checkout dev
git pull origin dev
```

### Error 3: mezclar muchos cambios en un commit
**Solución:** commits pequeños y claros.

### Error 4: subir código roto
**Solución:** probar antes de hacer push y antes del PR.

### Error 5: abrir PR hacia `main` por error
**Solución:** revisa siempre:
- base = `dev`
- compare = tu rama

### Error 6: todos tocando el mismo archivo
**Solución:** repartir responsabilidades por archivos y módulos.

---

## 16. Flujo recomendado para vuestro equipo

### Para desarrollar una tarea
```bash
git checkout dev
git pull origin dev
git checkout -b feat/nombre-tarea
# trabajar
git add .
git commit -m "feat: describe cambio"
git pull origin dev --rebase
git push -u origin feat/nombre-tarea
```

### Para integrar cambios
1. Abrir PR desde `feat/...` hacia `dev`
2. Revisar cambios
3. Hacer merge en GitHub
4. Actualizar `dev` local
```bash
git checkout dev
git pull origin dev
```

### Para preparar una entrega estable
Cuando `dev` esté estable y validado, entonces:
- PR desde `dev` hacia `main`

---

## 17. Convención recomendada de nombres de ramas

### Features
```bash
feat/nombre-feature
```
Ejemplos:
```bash
feat/dashboard-ui
feat/water-history
feat/local-storage
```

### Fixes
```bash
fix/nombre-error
```
Ejemplo:
```bash
fix/progress-bar-mobile
```

### Docs
```bash
docs/nombre-doc
```
Ejemplo:
```bash
docs/readme-setup
```

---

## 18. Convención recomendada de commits

```bash
feat: nueva funcionalidad
fix: corrección de error
docs: cambios en documentación
style: cambios visuales o CSS
refactor: reorganización sin cambiar comportamiento
chore: tareas menores de mantenimiento
```

Ejemplos:
```bash
git commit -m "feat: add water intake buttons"
git commit -m "fix: correct daily total calculation"
git commit -m "docs: add team workflow guide"
git commit -m "style: improve dashboard spacing"
```

---

## 19. Checklist antes de hacer push
- [ ] Estoy en mi rama, no en `main` ni `dev`
- [ ] He hecho `git status`
- [ ] He probado mis cambios
- [ ] He hecho commit con mensaje claro
- [ ] He traído cambios recientes de `dev`
- [ ] No hay conflictos pendientes

---

## 20. Checklist antes de crear un Pull Request
- [ ] Mi rama está subida a GitHub
- [ ] El PR apunta a `dev`
- [ ] El cambio hace una sola cosa clara
- [ ] La descripción explica qué se ha hecho
- [ ] He revisado los archivos modificados
- [ ] La app sigue funcionando

---

## 21. Resumen ultra corto

### Crear rama nueva desde `dev`
```bash
git checkout dev
git pull origin dev
git checkout -b feat/nueva-rama
```

### Guardar cambios
```bash
git add .
git commit -m "feat: mi cambio"
```

### Actualizar con `dev`
```bash
git pull origin dev --rebase
```

### Subir rama
```bash
git push -u origin feat/nueva-rama
```

### Hacer PR
- desde tu rama `feat/...`
- hacia `dev`

---

## 22. Recomendación final para H2O Please

Para vuestro equipo de 4:
- `main` = entrega estable
- `dev` = integración del equipo
- cada uno trabaja en su rama
- todo cambio entra por Pull Request
- no mezclar varias tareas en la misma rama

Así evitaréis la mayoría de errores típicos de trabajo en grupo.
