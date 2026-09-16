/* DCC — autoridad visual final de la barra inferior. Sin observers, sin repintados. */
(function(){
'use strict';
const BUILD='20260916-bottom-nav-white-v9-final-authority';
if(window.__dccBottomNavLightPremium===BUILD)return;
window.__dccBottomNavLightPremium=BUILD;
let s=document.getElementById('dcc-bottom-nav-light-premium-v1');
if(!s){s=document.createElement('style');s.id='dcc-bottom-nav-light-premium-v1';(document.head||document.documentElement).appendChild(s)}
s.textContent=`
@media(max-width:900px){
  /* La combinación #coach[id="coach"] aumenta la especificidad para ganar a los temas legacy aunque carguen después. */
  html.dcc-theme-light-premium body #coach[id="coach"] .side,
  html.dcc-theme-light-premium body #client[id="client"] .side,
  body #coach[id="coach"] .side,body #client[id="client"] .side{
    position:fixed!important;left:16px!important;right:16px!important;bottom:10px!important;top:auto!important;
    width:auto!important;height:66px!important;min-height:66px!important;margin:0!important;padding:5px!important;
    border:1px solid rgba(201,151,47,.34)!important;border-radius:27px!important;
    background:#fffdf9!important;background-image:none!important;background-color:#fffdf9!important;
    box-shadow:0 10px 28px rgba(83,61,25,.12),inset 0 1px 0 #fff!important;
    overflow:hidden!important;z-index:9999!important;box-sizing:border-box!important;
    transition:none!important;animation:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;
  }
  html.dcc-theme-light-premium body #coach[id="coach"] .side>h2,
  html.dcc-theme-light-premium body #client[id="client"] .side>h2,
  html.dcc-theme-light-premium body #coach[id="coach"] .side>.out,
  html.dcc-theme-light-premium body #client[id="client"] .side>.out,
  body #coach[id="coach"] .side>h2,body #client[id="client"] .side>h2,
  body #coach[id="coach"] .side>.out,body #client[id="client"] .side>.out{display:none!important}

  html.dcc-theme-light-premium body #coach[id="coach"] .side #coach-nav,
  html.dcc-theme-light-premium body #client[id="client"] .side #client-nav,
  body #coach[id="coach"] .side #coach-nav,body #client[id="client"] .side #client-nav{
    position:relative!important;inset:auto!important;width:100%!important;height:100%!important;min-height:0!important;
    margin:0!important;padding:0!important;display:flex!important;align-items:stretch!important;gap:3px!important;
    border:0!important;border-radius:22px!important;background:#fffdf9!important;background-image:none!important;background-color:#fffdf9!important;
    box-shadow:none!important;overflow:hidden!important;box-sizing:border-box!important;
    transition:none!important;animation:none!important;
  }

  html.dcc-theme-light-premium body #coach[id="coach"] .side #coach-nav button,
  html.dcc-theme-light-premium body #client[id="client"] .side #client-nav button,
  body #coach[id="coach"] .side #coach-nav button,body #client[id="client"] .side #client-nav button{
    position:relative!important;display:flex!important;flex:1 1 0!important;flex-direction:column!important;
    align-items:center!important;justify-content:center!important;width:auto!important;height:100%!important;min-width:0!important;min-height:0!important;
    margin:0!important;padding:4px 2px!important;border:1px solid transparent!important;border-radius:20px!important;outline:0!important;
    background:transparent!important;background-image:none!important;background-color:transparent!important;color:#5e5547!important;
    box-shadow:none!important;text-shadow:none!important;transform:none!important;animation:none!important;transition:none!important;box-sizing:border-box!important;
  }
  html.dcc-theme-light-premium body #coach[id="coach"] .side #coach-nav button.active,
  html.dcc-theme-light-premium body #client[id="client"] .side #client-nav button.active,
  body #coach[id="coach"] .side #coach-nav button.active,body #client[id="client"] .side #client-nav button.active{
    border-color:rgba(209,151,35,.52)!important;
    background:linear-gradient(145deg,#ffe79a 0%,#f4c857 55%,#e9ad35 100%)!important;background-color:#f3c553!important;
    color:#17140d!important;box-shadow:0 4px 12px rgba(197,137,25,.18),inset 0 1px 0 rgba(255,255,255,.75)!important;
    transform:none!important;outline:0!important;
  }

  html.dcc-theme-light-premium body #coach[id="coach"] .side #coach-nav::before,
  html.dcc-theme-light-premium body #coach[id="coach"] .side #coach-nav::after,
  html.dcc-theme-light-premium body #client[id="client"] .side #client-nav::before,
  html.dcc-theme-light-premium body #client[id="client"] .side #client-nav::after,
  html.dcc-theme-light-premium body #coach[id="coach"] .side #coach-nav button::before,
  html.dcc-theme-light-premium body #coach[id="coach"] .side #coach-nav button::after,
  html.dcc-theme-light-premium body #client[id="client"] .side #client-nav button::before,
  html.dcc-theme-light-premium body #client[id="client"] .side #client-nav button::after{
    display:none!important;content:none!important;
  }

  html.dcc-theme-light-premium body #coach[id="coach"] .side #coach-nav button svg,
  html.dcc-theme-light-premium body #client[id="client"] .side #client-nav button svg,
  body #coach[id="coach"] .side #coach-nav button svg,body #client[id="client"] .side #client-nav button svg{
    width:21px!important;height:21px!important;color:#5e5547!important;stroke:currentColor!important;filter:none!important;
    transition:none!important;animation:none!important;
  }
  html.dcc-theme-light-premium body #coach[id="coach"] .side #coach-nav button.active svg,
  html.dcc-theme-light-premium body #client[id="client"] .side #client-nav button.active svg,
  body #coach[id="coach"] .side #coach-nav button.active svg,body #client[id="client"] .side #client-nav button.active svg{color:#17140d!important}

  html.dcc-theme-light-premium body #coach[id="coach"] .side #coach-nav button span,
  html.dcc-theme-light-premium body #client[id="client"] .side #client-nav button span,
  body #coach[id="coach"] .side #coach-nav button span,body #client[id="client"] .side #client-nav button span{
    color:#5e5547!important;font-size:8px!important;line-height:1!important;font-weight:700!important;margin-top:2px!important;
    text-shadow:none!important;transition:none!important;animation:none!important;
  }
  html.dcc-theme-light-premium body #coach[id="coach"] .side #coach-nav button.active span,
  html.dcc-theme-light-premium body #client[id="client"] .side #client-nav button.active span,
  body #coach[id="coach"] .side #coach-nav button.active span,body #client[id="client"] .side #client-nav button.active span{color:#17140d!important;font-weight:800!important}
}
`;
})();
