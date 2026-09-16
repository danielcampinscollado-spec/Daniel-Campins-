/* DCC — barra inferior entrenador Light Premium. Autoridad final tras las capas legacy. */
(function(){
'use strict';
const BUILD='20260916-bottom-nav-white-v14-late-authority';
if(window.__dccBottomNavLightPremium===BUILD)return;
window.__dccBottomNavLightPremium=BUILD;

function installFinalNav(){
  document.getElementById('dcc-bottom-nav-light-premium-v1')?.remove();
  const s=document.createElement('style');
  s.id='dcc-bottom-nav-light-premium-v1';
  s.textContent=`
@media(max-width:900px){
  body #coach#coach .side{
    background:#fffdf9!important;background-image:none!important;background-color:#fffdf9!important;
    border:1px solid rgba(201,151,47,.34)!important;border-radius:27px!important;
    box-shadow:0 10px 28px rgba(83,61,25,.12),inset 0 1px 0 #fff!important;
    overflow:hidden!important;padding:5px!important;transition:none!important;animation:none!important;
  }
  body #coach#coach #coach-nav#coach-nav{
    background:#fffdf9!important;background-image:none!important;background-color:#fffdf9!important;
    border:0!important;border-radius:22px!important;box-shadow:none!important;overflow:hidden!important;
    transition:none!important;animation:none!important;
  }
  body #coach#coach #coach-nav#coach-nav button,
  body #coach#coach #coach-nav#coach-nav button:not(.active){
    background:transparent!important;background-image:none!important;background-color:transparent!important;
    color:#69707d!important;border:1px solid transparent!important;box-shadow:none!important;text-shadow:none!important;
    transition:none!important;animation:none!important;transform:none!important;filter:none!important;
  }
  body #coach#coach #coach-nav#coach-nav button:not(.active) svg,
  body #coach#coach #coach-nav#coach-nav button:not(.active) span{
    color:#69707d!important;stroke:currentColor!important;filter:none!important;
  }
  body #coach#coach #coach-nav#coach-nav button.active{
    background:linear-gradient(145deg,#ffe79a 0%,#f4c857 55%,#e9ad35 100%)!important;
    background-color:#f3c553!important;color:#17140d!important;
    border:1px solid rgba(209,151,35,.52)!important;
    box-shadow:0 4px 12px rgba(197,137,25,.18),inset 0 1px 0 rgba(255,255,255,.78)!important;
  }
  body #coach#coach #coach-nav#coach-nav button.active svg,
  body #coach#coach #coach-nav#coach-nav button.active span{
    color:#17140d!important;stroke:currentColor!important;filter:none!important;
  }
  body #coach#coach #coach-nav#coach-nav button::before,
  body #coach#coach #coach-nav#coach-nav button::after{display:none!important;content:none!important}
}
`;
  (document.body||document.head||document.documentElement).appendChild(s);

  const side=document.querySelector('#coach .side');
  const nav=document.getElementById('coach-nav');
  if(side){
    side.style.setProperty('background','#fffdf9','important');
    side.style.setProperty('background-image','none','important');
    side.style.setProperty('background-color','#fffdf9','important');
  }
  if(nav){
    nav.style.setProperty('background','#fffdf9','important');
    nav.style.setProperty('background-image','none','important');
    nav.style.setProperty('background-color','#fffdf9','important');
    nav.style.setProperty('border','0','important');
    nav.style.setProperty('box-shadow','none','important');
  }
}

/* Este archivo se carga antes que dcc-theme-system y coach-theme-premium-global.
   La autoridad visual se instala al final del parseo, cuando esas capas ya existen. */
if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',installFinalNav,{once:true});
}else{
  installFinalNav();
}
window.addEventListener('pageshow',installFinalNav);
})();
