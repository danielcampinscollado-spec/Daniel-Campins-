# Revisión de preservación del CLIENTE

## Regresión de entrenamiento activo confirmada con captura

El usuario confirmó Inicio y Alimentación con solo día de entrenamiento.
La captura IMG_3718 muestra el render antiguo de `index.html` (Consejo de hoy,
con consejo nutricional y botón Guardar serie), en lugar de la sesión premium.
La referencia aprobada cargaba `exercise-guidance-v1.js` y
`workout-session-premium-v3.js` desde el grupo training del bootstrap compartido.
El bootstrap posterior retiró esas cargas y dejó de cargar grupos para CLIENTE.
Los dos módulos conservan exactamente el contenido de la referencia aprobada.

Se restituyen sus dos etiquetas script antes de `client-training.js`, después
de superseries, sin restaurar módulos del editor del entrenador ni modificar
el contenido o CSS de la sesión aprobada. La capa Light existente de
`training-actions-hotfix-v2.js` conserva sus reglas para `.dwa3`.

Prueba aislada ejecutando el renderer original con un jalón: renderiza
CONSEJOS DEL EJERCICIO, consejo de espalda, serie actual y temporizador;
no genera Consejo de hoy ni modifica las series. Las cuatro pruebas de sesión
siguen pasando. Falta validación visual en Safari y recorrido real de series,
descansos, superseries, rest-pause y finalización. El PDF de dieta y día de
descanso siguen pendientes de confirmación explícita.

Referencia aprobada: `016dc3e8feee5d3a51fd7a7eb4b55b599ecc5d44`.
Backup verificado: `backup/cliente-final-2026-09-22`, idéntico a esa referencia.
Base de esta corrección: `a67894c32af791b45edffc2bb4e3309df2d4c76c`.

El CLIENTE está aprobado. No rediseñar, simplificar ni reconstruir sus pantallas.
El trabajo del ENTRENADOR continúa por separado. Esta rama no restaura archivos
completos de la referencia encima de los cambios posteriores.

## Error reproducido y corrección

El guard de autenticación ocultaba los paneles y limpiaba el identificador y el
rol, pero conservaba `currentApp`, `currentScreen`, `selectedClient`, el chat
seleccionado y el entrenamiento activo con sus intervalos. Se reprodujo en una
prueba aislada del guard con un evento `SIGNED_OUT`, en ambos sentidos entre roles.
Esto demuestra estado residual; no demuestra por sí solo una apertura indebida
en producción ni resuelve todas las posibles carreras asíncronas de autenticación.

Se amplía la limpieza en `showLogin` del guard existente. No se añade otro wrapper,
loader ni CSS. Se descarta el entrenamiento en curso en memoria al terminar la
sesión, sin finalizarlo ni escribir/eliminar historiales en el servidor.
Una entrada autenticada válida conserva el entrenamiento activo.

## Verificación realizada

`node --test tests/client-session-isolation.test.cjs`: antes del cambio fallan
las dos pruebas de aislamiento entre roles; después pasan las cuatro pruebas.
Se comprueba además el rechazo de un acceso al entrenador con rol cliente y que
una entrada válida al mismo rol no borre el entrenamiento en curso.

`node --check auth-session-guard-v2.js` y `git diff --check`: correctos.
Pruebas con sesión y DOM simulados; no equivalen a login real, RLS, Realtime ni
pruebas integrales con cuentas cliente/entrenador.

Comparación byte a byte contra la referencia: sin diferencias en
`client-home-authority-final-v1.js`, `client-light-stable-v1.js`,
`client-training.js`, `training-superset-v1.js`, `workout-muscle-visual-fix-v1.js`,
`workout-session-premium-v3.js`, `client-food-light-premium-v1.js`,
`client-diet-print-premium-v1.js`, `client-checkin-schedule-v4.js`,
`messages-chat-premium-v2.js` y `client-checkin-messages-premium-v1.js`.
El HTML compartido y sus estilos/cargas sí tienen diferencias anteriores a esta
rama. Por ello la igualdad de estos módulos no demuestra igualdad visual final.

## Hallazgos pendientes, sin cambios especulativos

- `index.html` conserva dos scripts de entrenamiento precedidos por comentarios
  que dicen que están retirados. No se han eliminado: la referencia los carga.
- El sistema global de tema se carga desde `training-actions-hotfix-v2.js`, aunque
  su inclusión directa fue retirada de `index.html`. No confundir el comentario
  con una retirada efectiva ni eliminarlo sin comprobar sus dependencias.
- En el navegador de producción aparecen avisos de carga fallida de
  `dcc-theme-premium-polish-v3.js`, `coach-navigation-authority-v1.js` y
  `coach-render-stability-v1.js`; esos archivos no existen en la base revisada.
  También aparecen errores de sincronización de check-ins antes de iniciar sesión.
  No se atribuye a estos avisos un fallo funcional sin reproducirlo autenticado.
- El bootstrap compartido todavía carga módulos de entrenador antes de conocer
  el rol. Revisar su impacto real y coordinar cualquier cambio con el trabajo
  paralelo de ENTRENADOR; no restaurar el bootstrap antiguo en bloque.
- Tokens declarados del CLIENTE aprobado: fondo `#f5efe4`, superficie `#fffdf8`,
  superficie secundaria `#fbf5eb`, texto `#17191d`, secundario `#707782`,
  dorado `#a66d0d`, dorado secundario `#d9aa4a`, borde
  `rgba(183,123,19,.22)`, radio `21px`, sombra
  `0 8px 22px rgba(78,58,28,.055),inset 0 1px 0 rgba(255,255,255,.96)`.
  Son declaraciones de `client-light-stable-v1.js`, no una afirmación de los
  estilos computados finales de cada componente.

## Puerta funcional pendiente

El navegador llegó a la pantalla de acceso seguro. No hay sesión autenticada
disponible para ejecutar el recorrido completo.

| Área | Pendiente de comprobar con cuenta de prueba |
| --- | --- |
| Inicio | Primera entrada sin cambiar pestaña, refrescar ni segundo render |
| Alimentación | Días entrenamiento/descanso, opciones, alimentos a evitar y PDF |
| Entrenamiento | Días, bloqueos, músculos e ilustraciones aprobadas |
| Sesión activa | Series, cambio de ejercicio, superseries, rest-pause, vídeo, temporizador y finalización |
| Progreso | Sesión finalizada, historial y métricas |
| Check-in | Apertura, configuración, envío, historial y sincronización |
| Mensajes | Historial, envío, recepción y sincronización |
| Apariencia | Ausencia de Black en pantallas, modales, loaders y navegación |
| Cambio de cuenta | Login real CLIENTE → logout → ENTRENADOR y recorrido inverso |

No declarar CLIENTE estable ni desplegar esta corrección como validada
funcionalmente mientras falte este recorrido. Para revertir, revertir únicamente
el commit de esta rama; no resetear `main` ni el trabajo paralelo del entrenador.
