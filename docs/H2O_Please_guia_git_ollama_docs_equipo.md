# Guía de uso e instalación — git-ollama-docs en H2O Please

## Objetivo
Esta guía explica cómo usar la herramienta de documentación automática de commits con **Ollama + phi3** en el proyecto **H2O Please**.


## Para qué sirve
Cada vez que haces un `git commit -m "..."`, el hook `post-commit` puede:

1. Leer la información del commit
2. Preguntar si quieres documentarlo
3. Usar **Ollama** con el modelo **phi3**
4. Generar o actualizar el archivo:

```bash
 docs/DOCUMENTACION.html
```

Esto sirve como apoyo para:
- memoria técnica
- bitácora del proyecto
- seguimiento del desarrollo
- documentación visual del trabajo realizado

---

## Estado actual en H2O Please
La herramienta ya se ha:
- instalado en local
- probado en una rama de pruebas
- verificado con commits reales
- ajustado para evitar bucles con commits documentales

### Validado
- genera `docs/DOCUMENTACION.html`
- pregunta si quieres documentar el commit
- evita documentar commits cuyo único archivo es `docs/DOCUMENTACION.html`
- funciona con **Ollama + phi3** en macOS

---

## Requisitos
Antes de instalarla, cada persona que quiera usarla debe tener en su equipo:

- `git`
- `curl`
- `python3`
- `ollama`
- modelo `phi3` descargado
- Ollama funcionando en `localhost:11434`

### Comprobación rápida
```bash
git --version
curl --version
python3 --version
ollama --version
curl http://localhost:11434/api/tags
ollama list
```

Si `phi3` no aparece en `ollama list`, hay que descargarlo:

```bash
ollama pull phi3
```

---

## Instalación recomendada para el equipo
### Recomendación general
**No hace falta que todo el equipo lo instale desde el principio.**

La opción más segura es:
- que lo use primero una sola persona
- o que lo instale quien realmente vaya a encargarse de documentación técnica

---

## Instalación manual segura
### 1) Clonar la herramienta fuera del repo del proyecto
```bash
cd ~
git clone https://github.com/ikeermelero/Project_Doc_Aut.git
```

### 2) Entrar en el repo del proyecto
```bash
cd /ruta/a/H2O-please
```

### 3) Comprobar si ya existe un hook `post-commit`
```bash
ls -la .git/hooks | grep post-commit
```

### 4) Si ya existe, hacer copia de seguridad
```bash
cp .git/hooks/post-commit .git/hooks/post-commit.bak
```

### 5) Copiar el hook correcto
```bash
cp ~/Project_Doc_Aut/files/with_IA/post-commit .git/hooks/post-commit
chmod +x .git/hooks/post-commit
```

### 6) Verificar que quedó instalado
```bash
ls -l .git/hooks/post-commit
bash -n .git/hooks/post-commit
```

---

## Cómo usarlo correctamente
### Flujo normal
1. Trabaja en tu rama feature
2. Haz tus cambios
3. Ejecuta:

```bash
git add .
git commit -m "feat: descripción del cambio"
```

4. El hook mostrará un mensaje parecido a:

```bash
¿Deseas documentar este commit en docs/DOCUMENTACION.html?
[s] Sí, generar documentación   [n] No, salir
```

5. Responde:
- `s` si quieres documentar ese commit
- `n` si no quieres documentarlo

---

## Cuándo responder `s`
Responde **`s`** cuando el commit sea relevante, por ejemplo:

- nueva funcionalidad
- cambio importante de interfaz
- integración con API
- mejora de estructura
- cambios útiles para la memoria técnica

Ejemplos:
- `feat: add hydration progress bar`
- `feat: add weather API service`
- `feat: save daily water entries in localStorage`

---

## Cuándo responder `n`
Responde **`n`** cuando el commit:

- sea muy pequeño o irrelevante
- sea una prueba temporal
- solo toque documentación menor
- sea el commit del propio `docs/DOCUMENTACION.html`

---

## Regla importante para evitar bucles
El hook ya está ajustado para **ignorar automáticamente** commits cuyo único archivo sea:

```bash
docs/DOCUMENTACION.html
```

Así se evita entrar en un bucle de “documentar la documentación”.

Aun así, la recomendación del equipo es:
- si estás haciendo un commit solo de documentación generada, no fuerces nada
- deja que el hook lo omita

---

## Cómo probar que funciona
### Prueba mínima
```bash
mkdir -p docs
echo "Prueba de hook" > docs/prueba-hook.txt
git add docs/prueba-hook.txt
git commit -m "test: verify auto documentation hook"
```

Si responde correctamente:
- te preguntará si quieres documentarlo
- si respondes `s`, generará `docs/DOCUMENTACION.html`

### Comprobar resultado
```bash
git status
ls -la docs
```

---

## Buenas prácticas para el equipo
- Usarlo solo en ramas feature o ramas de prueba
- No convertirlo en requisito obligatorio para todo el equipo
- No perder tiempo afinándolo si el MVP principal aún no está listo
- Usarlo como **apoyo documental**, no como parte central del proyecto
- Revisar siempre el HTML generado antes de enseñarlo o subirlo

---

## Limitaciones conocidas
- El contenido generado por el modelo puede no ser perfecto
- A veces puede describir el cambio de forma demasiado genérica o algo inventada
- Debe revisarse antes de considerarlo documentación final seria
- Es una ayuda, no sustituye a una memoria técnica bien redactada

---

## Cómo desinstalarlo
Si alguien quiere quitarlo de su entorno local:

```bash
rm .git/hooks/post-commit
```

Si había backup previo:

```bash
cp .git/hooks/post-commit.bak .git/hooks/post-commit
chmod +x .git/hooks/post-commit
```

---

## Recomendación para H2O Please
### Recomendación actual
- Mantener esta herramienta como **opcional**
- Usarla primero por la persona que administra el repo o la documentación
- No exigirla todavía a todos los compañeros

### Uso recomendado en el proyecto
- documentar solo commits importantes
- usar el HTML generado como apoyo para la memoria
- seguir priorizando el desarrollo del MVP de la app

---

## Resumen rápido
### Sí
- sirve como apoyo documental
- puede sumar valor ante el profesor
- ya se ha probado con éxito

### No
- no forma parte de la app
- no debe bloquear el MVP
- no hace falta que todos la instalen ya

---

## Nota final para el equipo
Esta herramienta se ha probado como **extra recomendable**, no como requisito obligatorio del proyecto.

Se puede usar para mejorar la documentación del desarrollo, pero siempre con criterio y sin distraer al equipo del objetivo principal: **terminar correctamente H2O Please**.
