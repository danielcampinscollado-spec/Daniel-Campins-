/* DCC — barra inferior entrenador: pill premium estable en móvil */
(function(){
'use strict';
const BUILD='20260915-coach-bottom-nav-fix-v1';
if(window.__dccCoachBottomNavFix===BUILD)return;
window.__dccCoachBottomNavFix=BUILD;

function install(){
  let s=document.getElementById('dcc-coach-bottom-nav-fix-v1');
  if(!s){s=document.createElement('style');s.id='dcc-coach-bottom-nav-fix-v1';document.head.appendChild(s)}
  s.textContent=`
  @media(max-width:900px){
    body #coach .side{
      position:fixed!important;
      left:14px!important;right:14px!important;bottom:10px!important;top:auto!important;
      width:auto!important;height:72px!important;min-height:72px!important;
      margin:0!important;padding:5px!important;
      border:1px solid rgba(226,174,64,.78)!important;
      border-radius:28px!important;
      background:linear-gradient(145deg,#1a1a17 0%,#0d0e0e 55%,#181712 100%)!important;
      box-shadow:0 12px 32px rgba(0,0,0,.38),0 0 0 1px rgba(226,174,64,.12),inset 0 1px 0 rgba(255,220,132,.10)!important;
      overflow:hidden!important;z-index:9999!important;
      box-sizing:border-box!important;
    }
    body #coach .side>h2,body #coach .side>.out{display:none!important}
    body #coach #coach-nav,
    body #coach .side #coach-nav.nav{
      position:relative!important;
      width:100%!important;height:100%!important;min-height:0!important;
      margin:0!important;padding:0!important;
      border:1px solid rgba(232,185,79,.46)!important;
      border-radius:23px!important;
      background:linear-gradient(145deg,#1b1b18 0%,#10110f 55%,#1c1a15 100%)!important;
      box-shadow:inset 0 1px 0 rgba(255,226,151,.08)!important;
      overflow:hidden!important;
      box-sizing:border-box!important;
    }
    body #coach #coach-nav button{
      height:100%!important;min-height:0!important;margin:0!important;padding:5px 2px!important;
      border:1px solid transparent!important;border-radius:20px!important;
      background:transparent!important;color:#e7b84f!important;box-shadow:none!important;
      transform:none!important;box-sizing:border-box!important;
    }
    body #coach #coach-nav button svg{color:#e7b84f!important;stroke:currentColor!important;filter:none!important}
    body #coach #coach-nav button span{color:#e7c36b!important}
    body #coach #coach-nav button.active{
      background:linear-gradient(145deg,#ffe59a 0%,#efbd4d 58%,#d99d2d 100%)!important;
      border-color:#f5d478!important;color:#18130a!important;
      box-shadow:0 0 0 1px rgba(255,220,126,.30),0 0 18px rgba(226,169,54,.34),inset 0 1px 0 rgba(255,255,255,.56)!important;
    }
    body #coach #coach-nav button.active svg,
    body #coach #coach-nav button.active span{color:#18130a!important;stroke:currentColor!important}
    body #coach #coach-nav::before,body #coach #coach-nav::after{border-radius:23px!important}
  }
  `;
}

/* Se instala al final del ciclo para ganar a las capas visuales antiguas. */
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(install,0),{once:true});
else setTimeout(install,0);
window.addEventListener('load',install,{once:true});
})();
