# CONTROL MAESTRO — PECTORAL

Fuente canónica: `entrenamientos/ejercicios.json`
Objetivo: 18/18 ilustraciones individuales validadas antes de integrarlas en la app.

## Estados
- PENDIENTE: todavía no existe una imagen aprobada y bloqueada.
- EN_REVISION: generada, pendiente de aprobación explícita.
- APROBADO: validada; no volver a generar salvo petición expresa.
- RECHAZADO: no cuenta y debe regenerarse.

## BLOQUEO DURO — NO GENERAR
Los siguientes IDs están APROBADOS y quedan prohibidos para nuevas generaciones salvo petición expresa del usuario:
- `press-banca-barra`
- `press-banca-mancuernas`
- `press-inclinado-barra`
- `press-inclinado-mancuernas`
- `press-pecho-maquina`
- `press-inclinado-maquina`
- `press-convergente-maquina`
- `aperturas-pec-deck`
- `cruces-polea-alta`
- `flexiones`

También están aprobadas visualmente y NO deben repetirse aunque no pertenezcan al catálogo canónico actual:
- Press declinado con barra
- Aperturas inclinadas con mancuernas
- Fondos en paralelas

## COLA ÚNICA AUTORIZADA — EN ESTE ORDEN
Solo se puede generar el primer elemento PENDIENTE de esta cola:
1. `cruces-polea-media`
2. `cruces-polea-baja`
3. `press-declinado-maquina`
4. `press-pecho-iso-lateral`
5. `press-inclinado-iso-lateral`
6. `press-banca-multipower`
7. `press-inclinado-multipower`
8. `aperturas-polea-banco`

## Regla operativa obligatoria
1. Leer este archivo antes de cada generación.
2. Generar únicamente el primer ID PENDIENTE de la cola autorizada.
3. Generar UNA sola imagen para ese ID.
4. No usar números visuales como identificador; usar siempre el ID exacto.
5. No avanzar hasta que el usuario apruebe explícitamente la imagen.
6. Tras aprobación, cambiar ese ID a APROBADO y eliminarlo de la cola antes de generar el siguiente.
7. No crear mosaicos, trípticos, catálogos ni varias ilustraciones en una misma imagen.
8. Si el generador devuelve otro ejercicio distinto del ID solicitado, la salida se descarta automáticamente y NO modifica el estado.
9. Para ejercicios en máquina, priorizar estética/arquitectura tipo Hammer Strength cuando corresponda.

## Checklist canónico 18/18
- [x] `press-banca-barra` — APROBADO
- [x] `press-banca-mancuernas` — APROBADO
- [x] `press-inclinado-barra` — APROBADO
- [x] `press-inclinado-mancuernas` — APROBADO
- [x] `press-pecho-maquina` — APROBADO
- [x] `press-inclinado-maquina` — APROBADO
- [x] `press-convergente-maquina` — APROBADO
- [x] `aperturas-pec-deck` — APROBADO
- [ ] `cruces-polea-media` — PENDIENTE
- [x] `cruces-polea-alta` — APROBADO
- [ ] `cruces-polea-baja` — PENDIENTE
- [x] `flexiones` — APROBADO
- [ ] `press-declinado-maquina` — PENDIENTE
- [ ] `press-pecho-iso-lateral` — PENDIENTE
- [ ] `press-inclinado-iso-lateral` — PENDIENTE
- [ ] `press-banca-multipower` — PENDIENTE
- [ ] `press-inclinado-multipower` — PENDIENTE
- [ ] `aperturas-polea-banco` — PENDIENTE

## Progreso
10/18 IDs canónicos APROBADOS.
8/18 PENDIENTES.
3 imágenes adicionales aprobadas visualmente fuera del catálogo canónico actual.

## Criterios de aprobación
- Ejercicio y equipo exactos.
- Biomecánica reconocible y correcta.
- Pectoral resaltado en dorado.
- Estética premium negra/dorada consistente.
- Asset individual limpio y apto para la app.
