/* DCC — barra inferior Light Premium aprobada: CSS estático, sin observers ni reescrituras */
(function(){
'use strict';
const BUILD='20260916-bottom-nav-white-gold-static-v3';
if(window.__dccBottomNavLightPremium===BUILD)return;
window.__dccBottomNavLightPremium=BUILD;
let s=document.getElementById('dcc-bottom-nav-light-premium-v1');
if(!s){s=document.createElement('style');s.id='dcc-bottom-nav-light-premium-v1';(document.head||document.documentElement).appendChild(s)}
s.textContent=`
@media(max-width:900px){
  body #coach .side,body #client .side{
    position:fixed!important;left:14px!important;right:14px!important;bottom:10px!important;top:auto!important;
    width:auto!important;height:70px!important;min-height:70px!important;margin:0!important;padding:5px!important;
    border:1px solid rgba(199,151,55,.26)!important;border-radius:27px!important;
    background:rgba(255,252,246,.985)!important;background-color:rgba(255,252,246,.985)!important;
    box-shadow:0 12px 30px rgba(83,61,25,.13),inset 0 1px 0 rgba(255,255,255,.98)!important;
    backdrop-filter:blur(18px)!important;-webkit-backdrop-filter:blur(18px)!important;
    overflow:hidden!important;z-index:9999!important;box-sizing:border-box!important;
    transform:none!important;animation:none!important;transition:none!important;
  }
  body #coach .side>h2,body #client .side>h2,body #coach .side>.out,body #client .side>.out{display:none!important}
  body #coach #coach-nav,body #client #client-nav{
    position:relative!important;inset:auto!important;width:100%!important;height:100%!important;min-height:0!important;
    margin:0!important;padding:0!important;display:flex!important;align-items:stretch!important;gap:3px!important;
    border:0!important;border-radius:22px!important;background:transparent!important;background-color:transparent!important;
    box-shadow:none!important;overflow:hidden!important;box-sizing:border-box!important;
    transform:none!important;animation:none!important;transition:none!important;
  }
  body #coach #coach-nav button,body #client #client-nav button{
    position:relative!important;display:flex!important;flex:1 1 0!important;flex-direction:column!important;
    align-items:center!important;justify-content:center!important;width:auto!important;height:100%!important;min-width:0!important;min-height:0!important;
    margin:0!important;padding:4px 2px!important;border:1px solid transparent!important;border-radius:20px!important;outline:0!important;
    background:transparent!important;background-color:transparent!important;color:#777f8c!important;box-shadow:none!important;text-shadow:none!important;
    transform:none!important;animation:none!important;transition:none!important;box-sizing:border-box!important;
  }
  body #coach #coach-nav button.active,body #client #client-nav button.active{
    border-color:rgba(209,151,35,.58)!important;
    background:linear-gradient(145deg,#ffe79a 0%,#f3c553 55%,#e8aa31 100%)!important;background-color:#f3c553!important;
    color:#17140d!important;box-shadow:0 5px 14px rgba(197,137,25,.20),inset 0 1px 0 rgba(255,255,255,.66)!important;
  }
  body #coach #coach-nav button::before,body #client #client-nav button::before,
  body #coach #coach-nav button::after,body #client #client-nav button::after,
  body #coach #coach-nav::before,body #client #client-nav::before,
  body #coach #coach-nav::after,body #client #client-nav::after{display:none!important;content:none!important}
  body #coach #coach-nav button svg,body #client #client-nav button svg{width:21px!important;height:21px!important;color:#777f8c!important;stroke:currentColor!important;filter:none!important;transform:none!important;animation:none!important;transition:none!important}
  body #coach #coach-nav button.active svg,body #client #client-nav button.active svg{color:#17140d!important}
  body #coach #coach-nav button span,body #client #client-nav button span{color:#777f8c!important;font-size:8px!important;line-height:1!important;font-weight:650!important;margin-top:2px!important;text-shadow:none!important;transform:none!important;animation:none!important;transition:none!important}
  body #coach #coach-nav button.active span,body #client #client-nav button.active span{color:#17140d!important;font-weight:800!important}
}
`;
})();
