/* DCC — navegación entrenador: única capa visual. Sin repintados JS ni observers. */
(function(){
'use strict';
const BUILD='20260916-coach-nav-v23-single-source';
if(window.__dccBottomNavLightPremium===BUILD)return;
window.__dccBottomNavLightPremium=BUILD;
const STYLE_ID='dcc-bottom-nav-light-premium-v1';
let s=document.getElementById(STYLE_ID);
if(!s){s=document.createElement('style');s.id=STYLE_ID;(document.head||document.documentElement).appendChild(s)}
s.textContent=`
@media(max-width:900px){
  body #coach#coach > .side{box-sizing:border-box!important;left:10px!important;right:10px!important;bottom:10px!important;top:auto!important;width:auto!important;height:72px!important;min-height:72px!important;padding:5px!important;margin:0!important;overflow:hidden!important;border-radius:30px!important;transition:none!important;animation:none!important;transform:none!important}
  body #coach#coach #coach-nav#coach-nav{box-sizing:border-box!important;width:100%!important;height:100%!important;display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:0!important;padding:0!important;margin:0!important;overflow:hidden!important;border-radius:25px!important;transition:none!important;animation:none!important;transform:none!important}
  body #coach#coach #coach-nav#coach-nav button{box-sizing:border-box!important;width:100%!important;height:100%!important;min-width:0!important;min-height:0!important;margin:0!important;padding:6px 2px!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:3px!important;border-radius:23px!important;transform:none!important;transition:none!important;animation:none!important;overflow:hidden!important;text-shadow:none!important;filter:none!important}
  body #coach#coach #coach-nav#coach-nav button svg{display:block!important;width:23px!important;height:23px!important;flex:0 0 23px!important}
  body #coach#coach #coach-nav#coach-nav button span{display:block!important;margin:0!important;font-size:10px!important;line-height:1.05!important;white-space:nowrap!important}
  body #coach#coach #coach-nav#coach-nav button::before,body #coach#coach #coach-nav#coach-nav button::after{display:none!important;content:none!important}

  html.dcc-theme-light-premium body #coach#coach > .side,
  html.dcc-theme-light-premium body #coach#coach #coach-nav#coach-nav{background:#fffdf9!important;background-image:none!important;background-color:#fffdf9!important}
  html.dcc-theme-light-premium body #coach#coach > .side{border:1px solid rgba(205,151,43,.55)!important;box-shadow:0 10px 28px rgba(83,61,25,.12),inset 0 1px 0 rgba(255,255,255,.98)!important}
  html.dcc-theme-light-premium body #coach#coach #coach-nav#coach-nav{border:0!important;box-shadow:none!important}
  html.dcc-theme-light-premium body #coach#coach #coach-nav#coach-nav button:not(.active){background:transparent!important;color:#5f6268!important;border:1px solid transparent!important;box-shadow:none!important}
  html.dcc-theme-light-premium body #coach#coach #coach-nav#coach-nav button:not(.active) svg,
  html.dcc-theme-light-premium body #coach#coach #coach-nav#coach-nav button:not(.active) span{color:#5f6268!important;stroke:currentColor!important;font-weight:500!important}
  html.dcc-theme-light-premium body #coach#coach #coach-nav#coach-nav button.active{background:linear-gradient(145deg,#ffe89b 0%,#f5cb5b 48%,#dfa42d 100%)!important;color:#17140d!important;border:1px solid rgba(207,148,29,.72)!important;box-shadow:0 5px 15px rgba(191,130,18,.22),inset 0 1px 0 rgba(255,255,255,.88)!important}
  html.dcc-theme-light-premium body #coach#coach #coach-nav#coach-nav button.active svg,
  html.dcc-theme-light-premium body #coach#coach #coach-nav#coach-nav button.active span{color:#17140d!important;stroke:currentColor!important;font-weight:750!important}

  html:not(.dcc-theme-light-premium) body #coach#coach > .side{background:linear-gradient(145deg,#27241e 0%,#151512 58%,#211f19 100%)!important;border:1px solid rgba(224,171,62,.72)!important;box-shadow:0 12px 34px rgba(0,0,0,.34),inset 0 1px 0 rgba(255,226,151,.08)!important}
  html:not(.dcc-theme-light-premium) body #coach#coach #coach-nav#coach-nav{background:transparent!important;border:0!important;box-shadow:none!important}
  html:not(.dcc-theme-light-premium) body #coach#coach #coach-nav#coach-nav button:not(.active){background:transparent!important;color:#d9aa4a!important;border:1px solid transparent!important;box-shadow:none!important}
  html:not(.dcc-theme-light-premium) body #coach#coach #coach-nav#coach-nav button:not(.active) svg,
  html:not(.dcc-theme-light-premium) body #coach#coach #coach-nav#coach-nav button:not(.active) span{color:#d9aa4a!important;stroke:currentColor!important}
  html:not(.dcc-theme-light-premium) body #coach#coach #coach-nav#coach-nav button.active{background:linear-gradient(145deg,#ffe79a 0%,#f4c857 55%,#e9ad35 100%)!important;color:#17140d!important;border:1px solid rgba(239,190,80,.72)!important;box-shadow:0 4px 14px rgba(0,0,0,.26),inset 0 1px 0 rgba(255,255,255,.72)!important}
  html:not(.dcc-theme-light-premium) body #coach#coach #coach-nav#coach-nav button.active svg,
  html:not(.dcc-theme-light-premium) body #coach#coach #coach-nav#coach-nav button.active span{color:#17140d!important;stroke:currentColor!important}
}
`;
})();