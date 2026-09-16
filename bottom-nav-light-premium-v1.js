/* DCC — barra inferior del entrenador. Única fuente visual móvil. */
(function(){
'use strict';
const BUILD='20260916-coach-nav-v26-white-surface';
if(window.__dccBottomNavLightPremium===BUILD)return;
window.__dccBottomNavLightPremium=BUILD;
const STYLE_ID='dcc-bottom-nav-light-premium-v1';
let s=document.getElementById(STYLE_ID);
if(!s){s=document.createElement('style');s.id=STYLE_ID;(document.head||document.documentElement).appendChild(s)}
s.textContent=`
@media(max-width:900px){
 body #coach#coach > .side{position:fixed!important;left:18px!important;right:18px!important;bottom:12px!important;top:auto!important;width:auto!important;height:76px!important;min-height:76px!important;margin:0!important;padding:5px!important;border:1.5px solid rgba(214,160,48,.78)!important;border-radius:38px!important;background:#fffdf9!important;background-image:none!important;background-color:#fffdf9!important;box-shadow:0 12px 30px rgba(103,76,29,.13),inset 0 1px 0 rgba(255,255,255,.98)!important;overflow:hidden!important;z-index:9999!important;box-sizing:border-box!important;transform:none!important;transition:none!important;animation:none!important}
 body #coach#coach > .side>h2,body #coach#coach > .side>.out{display:none!important}
 body #coach#coach #coach-nav#coach-nav{position:relative!important;isolation:isolate!important;inset:auto!important;display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;align-items:stretch!important;gap:2px!important;width:100%!important;height:100%!important;min-height:0!important;margin:0!important;padding:0!important;border:0!important;border-radius:33px!important;background:#fffdf9!important;background-image:none!important;background-color:#fffdf9!important;box-shadow:none!important;overflow:hidden!important;box-sizing:border-box!important;transform:none!important;transition:none!important;animation:none!important}
 /* Superficie visual blanca propia de la barra. Queda detrás de los botones y elimina la capa oscura heredada. */
 body #coach#coach #coach-nav#coach-nav::before{display:block!important;content:''!important;position:absolute!important;inset:0!important;z-index:0!important;border-radius:33px!important;background:#fffdf9!important;background-image:none!important;box-shadow:none!important;pointer-events:none!important}
 body #coach#coach #coach-nav#coach-nav::after,body #coach#coach #coach-nav#coach-nav button::before,body #coach#coach #coach-nav#coach-nav button::after{display:none!important;content:none!important}
 body #coach#coach #coach-nav#coach-nav button,body #coach#coach #coach-nav#coach-nav button:not(.active){position:relative!important;z-index:1!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;width:100%!important;height:100%!important;min-width:0!important;min-height:0!important;margin:0!important;padding:7px 3px!important;gap:4px!important;border:1px solid transparent!important;border-radius:31px!important;outline:0!important;background:transparent!important;background-image:none!important;background-color:transparent!important;color:#5f6268!important;-webkit-text-fill-color:#5f6268!important;box-shadow:none!important;text-shadow:none!important;filter:none!important;transform:none!important;transition:none!important;animation:none!important;box-sizing:border-box!important}
 body #coach#coach #coach-nav#coach-nav button svg{display:block!important;width:24px!important;height:24px!important;flex:0 0 24px!important;color:#5f6268!important;stroke:currentColor!important;filter:none!important}
 body #coach#coach #coach-nav#coach-nav button span{display:block!important;margin:0!important;color:#5f6268!important;-webkit-text-fill-color:#5f6268!important;font-size:11px!important;line-height:1!important;font-weight:600!important;white-space:nowrap!important;text-shadow:none!important}
 body #coach#coach #coach-nav#coach-nav button.active{border:1.5px solid rgba(205,146,27,.78)!important;background:linear-gradient(145deg,#ffe994 0%,#f6cf61 46%,#e2a72f 100%)!important;background-color:#f2c24e!important;color:#17140d!important;-webkit-text-fill-color:#17140d!important;box-shadow:0 5px 14px rgba(185,126,18,.20),inset 0 1px 0 rgba(255,255,255,.92),inset 0 0 0 2px rgba(255,244,190,.36)!important}
 body #coach#coach #coach-nav#coach-nav button.active svg{color:#17140d!important;stroke:currentColor!important;filter:none!important}
 body #coach#coach #coach-nav#coach-nav button.active span{color:#17140d!important;-webkit-text-fill-color:#17140d!important;font-weight:800!important}
}
`;
})();