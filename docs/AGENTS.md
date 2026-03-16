# AGENTS.md — H2O Please

## Proyecto
H2O Please es un proyecto estudiantil frontend de 4 personas:
- Luis: base visual principal y funcionalidades ya integradas en su rama
- Marcos: funcionalidades adicionales
- Jon: funcionalidades adicionales
- David: integración de API del clima mediante weather card

Stack:
- HTML
- CSS
- JavaScript vanilla
- Consumo de API externa (clima)

## Objetivo principal
Unificar el trabajo de todas las ramas en una sola aplicación funcional, manteniendo como referencia visual y estructural la rama de Luis.

## Prioridades
1. Mantener funcional la aplicación
2. Respetar el diseño y estilo de Luis
3. Integrar funcionalidades del resto con el mínimo cambio posible
4. Evitar refactors globales durante la fase de merge
5. Documentar cada paso importante

## Fuente de verdad visual
La rama de Luis es la referencia para:
- layout general
- estructura visual
- navegación
- estilos base
- look & feel de la app

No rediseñar la aplicación para adaptar Luis al resto.
Hay que adaptar el resto a la base de Luis.

## Restricciones duras
- No rehacer el diseño global
- No introducir refactors grandes sin permiso explícito
- No mover carpetas en fase de integración inicial
- No mezclar integración funcional con limpieza estructural
- No tocar archivos no relacionados si no es necesario
- No reintroducir `scripts/main.js`
- `scripts/dashboard.js` debe seguir siendo el entry point del dashboard
- Cambiar lo mínimo posible
- Mantener commits pequeños y reversibles

## Forma de trabajo esperada
Antes de aplicar cambios:
1. Analizar el estado actual
2. Identificar archivos afectados
3. Explicar el plan mínimo
4. Ejecutar solo la tarea pedida
5. Validar
6. Documentar lo realizado

## Política de cambios
Preferir:
- overrides CSS específicos
- ajustes locales
- fixes pequeños
- merges por fases
- resolución manual conservadora de conflictos

Evitar:
- rediseños
- renombrados masivos
- refactor de arquitectura en mitad de un merge
- borrar código potencialmente útil sin justificarlo

## Política Git
- No hacer `push --force`
- No reescribir historia
- No borrar ramas sin pedirlo
- Trabajar sobre ramas de prueba antes de llegar a `dev`
- Un merge cada vez
- Un bloque de validación tras cada merge
- Un commit por objetivo claro

## Orden de integración
1. Actualizar rama de Luis
2. Crear rama de integración desde Luis
3. Integrar ramas una a una
4. Validar funcionamiento y diseño tras cada merge
5. Cuando todo esté estable, hacer limpieza estructural
6. Después documentar
7. Finalmente merge a `dev`

## Regla de diagnóstico
Si hay un fallo:
- primero identificar si viene de HTML, CSS o JS
- luego aplicar el fix mínimo
- no probar cambios aleatorios
- no mezclar varias hipótesis en un mismo paso

## Regla de salida de cada tarea
Siempre devolver:
1. Objetivo
2. Archivos revisados
3. Cambios propuestos o aplicados
4. Riesgos
5. Validación realizada
6. Siguiente paso recomendado

## Checklist funcional mínima tras cada merge
- La app abre sin errores graves
- La navegación sigue funcionando
- El dashboard se ve correcto
- No hay errores importantes en consola
- No se rompe el layout base de Luis
- La lógica previa integrada sigue viva
- La weather card, si aplica, no rompe el diseño
- Responsive básico no destruido

## Checklist antes de pasar a refactor/limpieza
- Todas las vistas cargan
- Los scripts de entrada están claros
- No hay duplicados críticos rompiendo ejecución
- Los merges relevantes están cerrados
- El equipo ya tiene una base funcional estable

## Fase de limpieza estructural
Solo empezar cuando la rama de integración esté estable.
En esa fase sí se podrá:
- reorganizar carpetas
- separar utilidades
- limpiar nombres
- eliminar duplicados
- mejorar consistencia

Pero siempre con cambios graduales y documentados.

## Fase de documentación
Una vez estable:
- documentar ramas integradas
- decisiones tomadas
- conflictos resueltos
- estructura final
- checklist de entrega