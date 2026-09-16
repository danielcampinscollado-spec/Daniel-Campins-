/* DCC — barra inferior Light Premium compartida por entrenador y cliente */
(function(){
'use strict';
const BUILD='20260916-bottom-nav-light-premium-v1';
if(window.__dccBottomNavLightPremium===BUILD)return;
window.__dccBottomNavLightPremium=BUILD;

function install(){
  let s=document.getElementById('dcc-bottom-nav-light-premium-v1');
  if(!s){s=document.createElement('style');s.id='dcc-bottom-nav-light-premium-v1';document.head.appendChild(s)}
  s.textContent=`
  @media(max-width:900px){
    body #coach .side,
    body #client .side{
      position:fixed!important;
      left:14px!important;right:14px!important;bottom:10px!important;top:auto!important;
      width:auto!important;height:70px!important;min-height:70px!important;
      margin:0!important;padding:5px!important;
      border:1px solid rgba(199,151,55,.26)!important;
      border-radius:27px!important;
      background:rgba(255,252,246,.96)!important;
      box-shadow:0 12px 30px rgba(83,61,25,.13),inset 0 1px 0 rgba(255,255,255,.95)!important;
      backdrop-filter:blur(18px)!important;-webkit-backdrop-filter:blur(18px)!important;
      overflow:hidden!important;z-index:9999!important;box-sizing:border-box!important;
    }
    body #coach .side>h2,body #client .side>h2,
    body #coach .side>.out,body #client .side>.out{display:none!important}

    body #coach #coach-nav,
    body #client #client-nav,
    body #coach .side #coach-nav.nav,
    body #client .side #client-nav.nav{
      position:relative!important;inset:auto!important;
      width:100%!important;height:100%!important;min-height:0!important;
      margin:0!important;padding:0!important;gap:3px!important;
      border:0!important;border-radius:22px!important;
      background:transparent!important;box-shadow:none!important;
      overflow:hidden!important;box-sizing:border-box!important;
    }

    body #coach #coach-nav button,
    body #client #client-nav button{
      position:relative!important;display:flex!important;flex-direction:column!important;
      align-items:center!important;justify-content:center!important;
      width:100%!important;height:100%!important;min-width:0!important;min-height:0!important;
      margin:0!important;padding:4px 2px!important;
      border:1px solid transparent!important;border-radius:20px!important;
      outline:0!important;background:transparent!important;
      color:#777f8c!important;box-shadow:none!important;transform:none!important;
      box-sizing:border-box!important;
      transition:background .16s ease,color .16s ease,border-color .16s ease,box-shadow .16s ease,transform .10s ease!important;
    }
    body #coach #coach-nav button::before,body #client #client-nav button::before,
    body #coach #coach-nav button::after,body #client #client-nav button::after{
      display:none!important;content:none!important;
    }
    body #coach #coach-nav button svg,
    body #client #client-nav button svg{
      width:21px!important;height:21px!important;min-width:21px!important;min-height:21px!important;
      margin:0 auto!important;color:currentColor!important;stroke:currentColor!important;filter:none!important;
    }
    body #coach #coach-nav button span,
    body #client #client-nav button span{
      display:block!important;width:100%!important;margin-top:2px!important;
      color:currentColor!important;font-size:8px!important;line-height:1!important;font-weight:650!important;
      letter-spacing:-.12px!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;
    }

    body #coach #coach-nav button.active,
    body #client #client-nav button.active{
      border-color:rgba(209,151,35,.58)!important;
      background:linear-gradient(145deg,#ffe79a 0%,#f3c553 55%,#e8aa31 100%)!important;
      color:#17140d!important;
      box-shadow:0 5px 14px rgba(197,137,25,.20),inset 0 1px 0 rgba(255,255,255,.66)!important;
    }
    body #coach #coach-nav button.active svg,
    body #client #client-nav button.active svg,
    body #coach #coach-nav button.active span,
    body #client #client-nav button.active span{
      color:#17140d!important;stroke:currentColor!important;font-weight:800!important;
    }
    body #coach #coach-nav button:active,
    body #client #client-nav button:active{transform:scale(.98)!important}
  }
  `;
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(install,0),{once:true});
else setTimeout(install,0);
window.addEventListener('load',install,{once:true});
})();
