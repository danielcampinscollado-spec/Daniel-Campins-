/* DCC — compatibilidad de navegación: el estilo Light Premium vive en bottom-nav-light-premium-v1.js */
(function(){
'use strict';
const BUILD='20260916-coach-bottom-nav-compat-v5-no-observer';
if(window.__dccCoachBottomNavFix===BUILD)return;
window.__dccCoachBottomNavFix=BUILD;
/* Sin MutationObserver ni estilos inline: evita el bucle de repintado/vibración. */
})();
