# CONTROL MAESTRO — PECTORAL

Fuente canónica: `entrenamientos/ejercicios.json`
Objetivo: 18/18 ilustraciones individuales validadas antes de integrarlas en la app.

## Estados
- PENDIENTE: todavía no existe una imagen aprobada y bloqueada.
- EN_REVISION: generada, pendiente de aprobación explícita.
- APROBADO: validada; no volver a generar salvo petición expresa.
- RECHAZADO: no cuenta y debe regenerarse.

## Regla operativa
1. Seleccionar únicamente el primer ID PENDIENTE.
2. Generar UNA sola imagen para ese ID.
3. No usar el número visual como identificador: siempre usar el ID exacto.
4. No avanzar el estado hasta validación.
5. Un ID APROBADO queda bloqueado contra repeticiones.
6. No crear mosaicos, catálogos ni varias ilustraciones en una misma imagen.
7. Antes de integrar en la app deben estar los 18 IDs en APROBADO.
8. Para ejercicios en máquina, priorizar estética/arquitectura tipo Hammer Strength cuando corresponda.

## Aprobadas explícitamente por el usuario
- [x] `press-banca-barra` — APROBADO
- [x] `press-banca-mancuernas` — APROBADO
- [x] `press-inclinado-barra` — APROBADO
- [x] `press-inclinado-mancuernas` — APROBADO
- [x] `press-pecho-maquina` — APROBADO
- [x] `press-inclinado-maquina` — APROBADO — versión Hammer Strength
- [x] `press-convergente-maquina` — APROBADO — estilo Hammer Strength
- [x] `aperturas-pec-deck` — APROBADO
- [x] `cruces-polea-alta` — APROBADO
- [x] `flexiones` — APROBADO

## Imágenes aprobadas visualmente pero NO pertenecen a los 18 IDs canónicos actuales
- Press declinado con barra
- Aperturas inclinadas con mancuernas
- Fondos en paralelas

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
