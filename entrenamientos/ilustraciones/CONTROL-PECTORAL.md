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

## Checklist 18/18
- [ ] `press-banca-barra` — PENDIENTE
- [ ] `press-banca-mancuernas` — PENDIENTE
- [ ] `press-inclinado-barra` — PENDIENTE
- [ ] `press-inclinado-mancuernas` — PENDIENTE
- [ ] `press-pecho-maquina` — PENDIENTE
- [ ] `press-inclinado-maquina` — PENDIENTE
- [ ] `press-convergente-maquina` — PENDIENTE
- [ ] `aperturas-pec-deck` — PENDIENTE
- [ ] `cruces-polea-media` — PENDIENTE
- [ ] `cruces-polea-alta` — PENDIENTE
- [ ] `cruces-polea-baja` — PENDIENTE
- [ ] `flexiones` — PENDIENTE
- [ ] `press-declinado-maquina` — PENDIENTE
- [ ] `press-pecho-iso-lateral` — PENDIENTE
- [ ] `press-inclinado-iso-lateral` — PENDIENTE
- [ ] `press-banca-multipower` — PENDIENTE
- [ ] `press-inclinado-multipower` — PENDIENTE
- [ ] `aperturas-polea-banco` — PENDIENTE

## Criterios de aprobación
- Ejercicio y equipo exactos.
- Biomecánica reconocible y correcta.
- Pectoral resaltado en dorado.
- Estética premium negra/dorada consistente.
- Asset individual limpio, sin mini-anatomías, rótulos ni paneles informativos dentro de la imagen final de la app.
