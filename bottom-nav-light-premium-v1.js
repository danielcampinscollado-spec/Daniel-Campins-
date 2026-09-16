/* DCC — barra inferior blanca/dorada aprobada: autoridad final sin observers */
(function(){
'use strict';
const BUILD='20260916-bottom-nav-white-gold-static-v6-inline-authority';
if(window.__dccBottomNavLightPremium===BUILD)return;
window.__dccBottomNavLightPremium=BUILD;
let s=document.getElementById('dcc-bottom-nav-light-premium-v1');
if(!s){s=document.createElement('style');s.id='dcc-bottom-nav-light-premium-v1';(document.head||document.documentElement).appendChild(s)}
s.textContent=`
@media(max-width:900px){
  html.dcc-theme-light-premium body #coach#coach .side,html.dcc-theme-light-premium body #client#client .side{
    position:fixed!important;left:16px!important;right:16px!important;bottom:10px!important;top:auto!important;
    width:auto!important;height:66px!important;min-height:66px!important;margin:0!important;padding:5px!important;
    border:1px solid rgba(201,151,47,.30)!important;border-radius:27px!important;
    background:#fffdf9!important;background-color:#fffdf9!important;
    box-shadow:0 10px 28px rgba(83,61,25,.12),inset 0 1px 0 #fff!important;
    overflow:hidden!important;z-index:9999!important;box-sizing:border-box!important;
    transform:none!important;animation:none!important;transition:none!important;
  }
  html.dcc-theme-light-premium body #coach#coach .side>h2,html.dcc-theme-light-premium body #client#client .side>h2,
  html.dcc-theme-light-premium body #coach#coach .side>.out,html.dcc-theme-light-premium body #client#client .side>.out{display:none!important}
  html.dcc-theme-light-premium body #coach#coach .side #coach-nav,html.dcc-theme-light-premium body #client#client .side #client-nav{
    position:relative!important;inset:auto!important;width:100%!important;height:100%!important;min-height:0!important;
    margin:0!important;padding:0!important;display:flex!important;align-items:stretch!important;gap:3px!important;
    border:0!important;border-radius:22px!important;background:#fffdf9!important;background-color:#fffdf9!important;
    box-shadow:none!important;overflow:hidden!important;box-sizing:border-box!important;
    transform:none!important;animation:none!important;transition:none!important;
  }
  html.dcc-theme-light-premium body #coach#coach .side #coach-nav button,html.dcc-theme-light-premium body #client#client .side #client-nav button{
    position:relative!important;display:flex!important;flex:1 1 0!important;flex-direction:column!important;
    align-items:center!important;justify-content:center!important;width:auto!important;height:100%!important;min-width:0!important;min-height:0!important;
    margin:0!important;padding:4px 2px!important;border:1px solid transparent!important;border-radius:20px!important;outline:0!important;
    background:transparent!important;background-color:transparent!important;color:#a66d0b!important;box-shadow:none!important;text-shadow:none!important;
    transform:none!important;animation:none!important;transition:none!important;box-sizing:border-box!important;
  }
  html.dcc-theme-light-premium body #coach#coach .side #coach-nav button.active,html.dcc-theme-light-premium body #client#client .side #client-nav button.active{
    border-color:rgba(209,151,35,.52)!important;background:linear-gradient(145deg,#ffe79a 0%,#f4c857 55%,#e9ad35 100%)!important;
    background-color:#f3c553!important;color:#17140d!important;box-shadow:0 4px 12px rgba(197,137,25,.18),inset 0 1px 0 rgba(255,255,255,.75)!important;
  }
  html.dcc-theme-light-premium body #coach#coach .side #coach-nav button::before,html.dcc-theme-light-premium body #client#client .side #client-nav button::before,
  html.dcc-theme-light-premium body #coach#coach .side #coach-nav button::after,html.dcc-theme-light-premium body #client#client .side #client-nav button::after,
  html.dcc-theme-light-premium body #coach#coach .side #coach-nav::before,html.dcc-theme-light-premium body #client#client .side #client-nav::before,
  html.dcc-theme-light-premium body #coach#coach .side #coach-nav::after,html.dcc-theme-light-premium body #client#client .side #client-nav::after{display:none!important;content:none!important}
  html.dcc-theme-light-premium body #coach#coach .side #coach-nav button svg,html.dcc-theme-light-premium body #client#client .side #client-nav button svg{width:21px!important;height:21px!important;color:#a66d0b!important;stroke:currentColor!important;filter:none!important;transform:none!important;animation:none!important;transition:none!important}
  html.dcc-theme-light-premium body #coach#coach .side #coach-nav button.active svg,html.dcc-theme-light-premium body #client#client .side #client-nav button.active svg{color:#17140d!important}
  html.dcc-theme-light-premium body #coach#coach .side #coach-nav button span,html.dcc-theme-light-premium body #client#client .side #client-nav button span{color:#a66d0b!important;font-size:8px!important;line-height:1!important;font-weight:700!important;margin-top:2px!important;text-shadow:none!important;transform:none!important;animation:none!important;transition:none!important}
  html.dcc-theme-light-premium body #coach#coach .side #coach-nav button.active span,html.dcc-theme-light-premium body #client#client .side #client-nav button.active span{color:#17140d!important;font-weight:800!important}
}
`;
function forceWhiteNav(){
  if(!window.matchMedia('(max-width:900px)').matches)return;
  ['coach-nav','client-nav'].forEach(id=>{
    const nav=document.getElementById(id);if(!nav)return;
    nav.style.setProperty('background','#fffdf9','important');
    nav.style.setProperty('background-color','#fffdf9','important');
    nav.style.setProperty('border','0','important');
    nav.style.setProperty('box-shadow','none','important');
    const side=nav.closest('.side');
    if(side){side.style.setProperty('background','#fffdf9','important');side.style.setProperty('background-color','#fffdf9','important')}
  });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',forceWhiteNav,{once:true});else forceWhiteNav();
requestAnimationFrame(forceWhiteNav);
setTimeout(forceWhiteNav,0);
})();