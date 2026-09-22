/* DCC coach premium compatibility — sin cargar autoridades antiguas del entrenador. */
(function(){
'use strict';
const BUILD='20260922-coach-loader-clean-v19';
if(window.__dccCoachPremiumLoader===BUILD)return;
window.__dccCoachPremiumLoader=BUILD;
})();

/*
 * El antiguo "fast client entry" se retiró.
 * La entrada del cliente, la asociación de la cuenta autenticada,
 * la carga de datos y la primera pintura de Inicio pertenecen ahora
 * exclusivamente a openApp() en index.html.
 *
 * Mantener aquí otro wrapper de window.openApp provocaba una carrera:
 * mostraba el shell del cliente antes de resolver el perfil real y podía
 * dejar #client-main vacío hasta cambiar de pestaña.
 */