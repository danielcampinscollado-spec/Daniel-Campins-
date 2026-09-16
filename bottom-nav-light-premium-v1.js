/* DCC — barra entrenador: restaura la geometría blanca estable de esta mañana en Light Premium. */
(function(){
'use strict';
const BUILD='20260916-coach-nav-v24-morning-white';
if(window.__dccBottomNavLightPremium===BUILD)return;
window.__dccBottomNavLightPremium=BUILD;
let s=document.getElementById('dcc-bottom-nav-light-premium-v1');
if(!s){s=document.createElement('style');s.id='dcc-bottom-nav-light-premium-v1';(document.head||document.documentElement).appendChild(s)}
s.textContent=`
@media(max-width:900px){
  body #coach#coach > .side{
    position:fixed!important;left:16px!important;right:16px!important;bottom:10px!important;top:auto!important;
    width:auto!important;height:66px!important;min-height:66px!important;margin:0!important;padding:5px!important;
    border-radius:27px!important;overflow:hidden!important;z-index:9999!important;box-sizing:border-box!important;
    transition:none!important;animation:none!important;transform:none!important;
  }
  body #coach#coach > .side>h2,body #coach#coach > .side>.out{display:none!important}
  body #coach#coach #coach-nav#coach-nav{
    position:relative!important;inset:auto!important;width:100%!important;height:100%!important;min-height:0!important;
    margin:0!important;padding:0!important;display:flex!important;align-items:stretch!important;gap:3px!important;
    border-radius:22px!important;overflow:hidden!important;box-sizing:border-box!important;
    transition:none!important;animation:none!important;transform:none!important;
  }
  body #coach#coach #coach-nav#coach-nav button{
    position:relative!important;display:flex!important;flex:1 1 0!important;flex-direction:column!important;
    align-items:center!important;justify-content:center!important;width:auto!important;height:100%!important;min-width:0!important;min-height:0!important;
    margin:0!important;padding:4px 2px!important;border:1px solid transparent!important;border-radius:20px!important;outline:0!important;
    box-shadow:none!important;text-shadow:none!important;transform:none!important;transition:none!important;animation:none!important;box-sizing:border-box!important;
  }
  body #coach#coach #coach-nav#coach-nav::before,body #coach#coach #coach-nav#coach-nav::after,
  body #coach#coach #coach-nav#coach-nav button::before,body #coach#coach #coach-nav#coach-nav button::after{display:none!important;content:none!important}
  body #coach#coach #coach-nav#coach-nav button svg{width:21px!important;height:21px!important;flex:0 0 21px!important;filter:none!important}
  body #coach#coach #coach-nav#coach-nav button span{font-size:8px!important;line-height:1!important;font-weight:700!important;margin-top:2px!important;white-space:nowrap!important;text-shadow:none!important}

  /* LIGHT PREMIUM — aspecto blanco exacto de la versión estable de esta mañana */
  html.dcc-theme-light-premium body #coach#coach > .side{
    border:1px solid rgba(201,151,47,.30)!important;
    background:#fffdf9!important;background-image:none!important;background-color:#fffdf9!important;
    box-shadow:0 10px 28px rgba(83,61,25,.12),inset 0 1px 0 #fff!important;
  }
  html.dcc-theme-light-premium body #coach#coach #coach-nav#coach-nav{
    border:0!important;background:#fffdf9!important;background-image:none!important;background-color:#fffdf9!important;box-shadow:none!important;
  }
  html.dcc-theme-light-premium body #coach#coach #coach-nav#coach-nav button{
    background:transparent!important;background-image:none!important;background-color:transparent!important;color:#5e5547!important;
  }
  html.dcc-theme-light-premium body #coach#coach #coach-nav#coach-nav button svg,
  html.dcc-theme-light-premium body #coach#coach #coach-nav#coach-nav button span{color:#5e5547!important;stroke:currentColor!important}
  html.dcc-theme-light-premium body #coach#coach #coach-nav#coach-nav button.active{
    border-color:rgba(209,151,35,.52)!important;background:linear-gradient(145deg,#ffe79a 0%,#f4c857 55%,#e9ad35 100%)!important;
    background-color:#f3c553!important;color:#17140d!important;box-shadow:0 4px 12px rgba(197,137,25,.18),inset 0 1px 0 rgba(255,255,255,.75)!important;
  }
  html.dcc-theme-light-premium body #coach#coach #coach-nav#coach-nav button.active svg,
  html.dcc-theme-light-premium body #coach#coach #coach-nav#coach-nav button.active span{color:#17140d!important;stroke:currentColor!important;font-weight:800!important}

  /* DARK — se conserva oscuro */
  html:not(.dcc-theme-light-premium) body #coach#coach > .side{
    background:linear-gradient(145deg,#27241e 0%,#151512 58%,#211f19 100%)!important;
    border:1px solid rgba(224,171,62,.72)!important;box-shadow:0 12px 34px rgba(0,0,0,.34),inset 0 1px 0 rgba(255,226,151,.08)!important;
  }
  html:not(.dcc-theme-light-premium) body #coach#coach #coach-nav#coach-nav{background:transparent!important;border:0!important;box-shadow:none!important}
  html:not(.dcc-theme-light-premium) body #coach#coach #coach-nav#coach-nav button{background:transparent!important;color:#d9aa4a!important}
  html:not(.dcc-theme-light-premium) body #coach#coach #coach-nav#coach-nav button svg,
  html:not(.dcc-theme-light-premium) body #coach#coach #coach-nav#coach-nav button span{color:#d9aa4a!important;stroke:currentColor!important}
  html:not(.dcc-theme-light-premium) body #coach#coach #coach-nav#coach-nav button.active{
    background:linear-gradient(145deg,#ffe79a 0%,#f4c857 55%,#e9ad35 100%)!important;color:#17140d!important;
    border:1px solid rgba(239,190,80,.72)!important;box-shadow:0 4px 14px rgba(0,0,0,.26),inset 0 1px 0 rgba(255,255,255,.72)!important;
  }
  html:not(.dcc-theme-light-premium) body #coach#coach #coach-nav#coach-nav button.active svg,
  html:not(.dcc-theme-light-premium) body #coach#coach #coach-nav#coach-nav button.active span{color:#17140d!important;stroke:currentColor!important}
}
`;
})();