/* DCC — navegación entrenador: autoridad CSS estática, sin repintados ni observers. */
(function(){
'use strict';
const BUILD='20260916-coach-nav-theme-v20-static-authority';
if(window.__dccBottomNavLightPremium===BUILD)return;
window.__dccBottomNavLightPremium=BUILD;
const STYLE_ID='dcc-bottom-nav-light-premium-v1';
let s=document.getElementById(STYLE_ID);
if(!s){s=document.createElement('style');s.id=STYLE_ID;(document.head||document.documentElement).appendChild(s)}
s.textContent=`
@media(max-width:900px){
  body #coach#coach .side{
    box-sizing:border-box!important;left:10px!important;right:10px!important;bottom:10px!important;top:auto!important;width:auto!important;
    height:68px!important;min-height:68px!important;padding:5px!important;margin:0!important;overflow:hidden!important;border-radius:27px!important;
    transition:none!important;animation:none!important;transform:none!important;
  }
  body #coach#coach #coach-nav#coach-nav{
    box-sizing:border-box!important;width:100%!important;height:100%!important;display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;
    gap:2px!important;padding:0!important;margin:0!important;overflow:hidden!important;border-radius:22px!important;
    transition:none!important;animation:none!important;transform:none!important;
  }
  body #coach#coach #coach-nav#coach-nav button{
    box-sizing:border-box!important;width:100%!important;height:100%!important;min-width:0!important;min-height:0!important;margin:0!important;padding:5px 2px!important;
    display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:2px!important;border-radius:19px!important;
    transform:none!important;transition:none!important;animation:none!important;overflow:hidden!important;
  }
  body #coach#coach #coach-nav#coach-nav button svg{display:block!important;width:22px!important;height:22px!important;flex:0 0 22px!important}
  body #coach#coach #coach-nav#coach-nav button span{display:block!important;margin:0!important;font-size:10px!important;line-height:1.05!important;white-space:nowrap!important}
  body #coach#coach #coach-nav#coach-nav button::before,body #coach#coach #coach-nav#coach-nav button::after{display:none!important;content:none!important}

  /* LIGHT PREMIUM: esta regla supera las capas legacy que todavía declaran el nav negro. */
  html.dcc-theme-light-premium body #coach#coach .side{
    background:#fffdf9!important;background-image:none!important;background-color:#fffdf9!important;
    border:1px solid rgba(201,151,47,.34)!important;box-shadow:0 10px 28px rgba(83,61,25,.12),inset 0 1px 0 #fff!important;
  }
  html.dcc-theme-light-premium body #coach#coach #coach-nav#coach-nav{
    background:#fffdf9!important;background-image:none!important;background-color:#fffdf9!important;border:0!important;box-shadow:none!important;
  }
  html.dcc-theme-light-premium body #coach#coach #coach-nav#coach-nav button:not(.active){
    background:transparent!important;background-image:none!important;color:#69707d!important;border:1px solid transparent!important;box-shadow:none!important;text-shadow:none!important;filter:none!important;
  }
  html.dcc-theme-light-premium body #coach#coach #coach-nav#coach-nav button:not(.active) svg,
  html.dcc-theme-light-premium body #coach#coach #coach-nav#coach-nav button:not(.active) span{color:#69707d!important;stroke:currentColor!important;filter:none!important}
  html.dcc-theme-light-premium body #coach#coach #coach-nav#coach-nav button.active{
    background:linear-gradient(145deg,#ffe79a 0%,#f4c857 55%,#e9ad35 100%)!important;color:#17140d!important;
    border:1px solid rgba(209,151,35,.52)!important;box-shadow:0 4px 12px rgba(197,137,25,.18),inset 0 1px 0 rgba(255,255,255,.78)!important;
  }
  html.dcc-theme-light-premium body #coach#coach #coach-nav#coach-nav button.active svg,
  html.dcc-theme-light-premium body #coach#coach #coach-nav#coach-nav button.active span{color:#17140d!important;stroke:currentColor!important;filter:none!important}

  /* DCC ORIGINAL: se conserva el diseño oscuro ya aprobado. */
  html:not(.dcc-theme-light-premium) body #coach#coach .side{
    background:linear-gradient(145deg,#27241e 0%,#151512 58%,#211f19 100%)!important;background-color:#151512!important;
    border:1px solid rgba(224,171,62,.72)!important;box-shadow:0 12px 34px rgba(0,0,0,.34),inset 0 1px 0 rgba(255,226,151,.08)!important;
  }
  html:not(.dcc-theme-light-premium) body #coach#coach #coach-nav#coach-nav{background:transparent!important;background-image:none!important;border:0!important;box-shadow:none!important}
  html:not(.dcc-theme-light-premium) body #coach#coach #coach-nav#coach-nav button:not(.active){background:transparent!important;color:#d9aa4a!important;border:1px solid transparent!important;box-shadow:none!important;text-shadow:none!important}
  html:not(.dcc-theme-light-premium) body #coach#coach #coach-nav#coach-nav button:not(.active) svg,
  html:not(.dcc-theme-light-premium) body #coach#coach #coach-nav#coach-nav button:not(.active) span{color:#d9aa4a!important;stroke:currentColor!important;filter:none!important}
  html:not(.dcc-theme-light-premium) body #coach#coach #coach-nav#coach-nav button.active{
    background:linear-gradient(145deg,#ffe79a 0%,#f4c857 55%,#e9ad35 100%)!important;color:#17140d!important;
    border:1px solid rgba(239,190,80,.72)!important;box-shadow:0 4px 14px rgba(0,0,0,.26),inset 0 1px 0 rgba(255,255,255,.72)!important;
  }
  html:not(.dcc-theme-light-premium) body #coach#coach #coach-nav#coach-nav button.active svg,
  html:not(.dcc-theme-light-premium) body #coach#coach #coach-nav#coach-nav button.active span{color:#17140d!important;stroke:currentColor!important;filter:none!important}
}
`;
})();
