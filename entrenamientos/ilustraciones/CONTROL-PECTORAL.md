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

## Aprobadas explícitamente por el usuario (10 imágenes aportadas)
Estas imágenes quedan registradas como aprobadas visualmente. Solo se asignan a un ID canónico cuando existe correspondencia exacta con `ejercicios.json`.

- [x] `press-banca-barra` — APROBADO — imagen aportada: Press de banca plano con barra (#1)
- [x] `press-inclinado-barra` — APROBADO — imagen aportada: Press inclinado con barra (#2)
- [x] `press-inclinado-mancuernas` — APROBADO — imagen aportada: Press inclinado con mancuernas (#3)
- [x] `press-pecho-maquina` — APROBADO — imagen aportada: Press de pecho en máquina (#5)
- [x] `aperturas-pec-deck` — APROBADO — imagen aportada: Aperturas en máquina Pec Deck (#8)
- [x] `cruces-polea-alta` — APROBADO — imagen aportada: Cruce de poleas con poleas superiores (#11)
- [x] `flexiones` — APROBADO — imagen aportada: Flexiones de pecho (#12)

## Imágenes aprobadas visualmente pero NO pertenecen a los 18 IDs canónicos actuales
Se conservan como material aprobado, pero no cuentan para completar el 18/18 hasta que el catálogo canónico incluya esos ejercicios o se decida sustituir un ID.
- Press declinado con barra (#4)
- Aperturas inclinadas con mancuernas (#6)
- Fondos en paralelas (#9)

## Checklist canónico 18/18
- [x] `press-banca-barra` — APROBADO
- [ ] `press-banca-mancuernas` — PENDIENTE
- [x] `press-inclinado-barra` — APROBADO
- [x] `press-inclinado-mancuernas` — APROBADO
- [x] `press-pecho-maquina` — APROBADO
- [ ] `press-inclinado-maquina` — PENDIENTE
- [ ] `press-convergente-maquina` — PENDIENTE
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
7/18 IDs canónicos APROBADOS.
11/18 PENDIENTES.
3 imágenes adicionales aprobadas visualmente fuera del catálogo canónico actual.

## Criterios de aprobación
- Ejercicio y equipo exactos.
- Biomecánica reconocible y correcta.
- Pectoral resaltado en dorado.
- Estética premium negra/dorada consistente.
- Asset individual limpio y apto para la app.
