/* DCC — autoridad estática final de la barra inferior Light Premium. Sin observers ni repintados JS. */
(function(){
'use strict';
const BUILD='20260916-bottom-nav-white-v11-static-authority';
if(window.__dccBottomNavLightPremium===BUILD)return;
window.__dccBottomNavLightPremium=BUILD;

let s=document.getElementById('dcc-bottom-nav-light-premium-v1');
if(!s){s=document.createElement('style');s.id='dcc-bottom-nav-light-premium-v1';(document.head||document.documentElement).appendChild(s)}
s.textContent=`
@media(max-width:900px){
  body #coach .side,body #client .side{
    position:fixed!important;left:16px!important;right:16px!important;bottom:10px!important;top:auto!important;
    width:auto!important;height:66px!important;min-height:66px!important;padding:5px!important;border-radius:27px!important;
    z-index:9999!important;overflow:hidden!important;
    background:#fffdf9!important;background-image:none!important;background-color:#fffdf9!important;
    border:1px solid rgba(201,151,47,.34)!important;
    box-shadow:0 10px 28px rgba(83,61,25,.12),inset 0 1px 0 #fff!important;
    transition:none!important;animation:none!important;
  }
  body #coach .side>h2,body #client .side>h2,body #coach .side>.out,body #client .side>.out{display:none!important}
  body #coach #coach-nav,body #client #client-nav{
    width:100%!important;height:100%!important;margin:0!important;padding:0!important;
    display:flex!important;gap:3px!important;overflow:hidden!important;border-radius:22px!important;
    background:#fffdf9!important;background-image:none!important;background-color:#fffdf9!important;
    border:0!important;box-shadow:none!important;transition:none!important;animation:none!important;
  }
  body #coach #coach-nav button,body #client #client-nav button{
    display:flex!important;flex:1 1 0!important;min-width:0!important;height:100%!important;margin:0!important;
    flex-direction:column!important;align-items:center!important;justify-content:center!important;padding:4px 2px!important;
    border:1px solid transparent!important;border-radius:20px!important;
    background:transparent!important;background-image:none!important;background-color:transparent!important;
    color:#5e5547!important;box-shadow:none!important;text-shadow:none!important;
    transition:none!important;animation:none!important;transform:none!important;
  }
  body #coach #coach-nav button:not(.active),body #client #client-nav button:not(.active){
    background:transparent!important;background-image:none!important;background-color:transparent!important;
    border-color:transparent!important;color:#5e5547!important;box-shadow:none!important;
  }
  body #coach #coach-nav button.active,body #client #client-nav button.active{
    background:linear-gradient(145deg,#ffe79a 0%,#f4c857 55%,#e9ad35 100%)!important;
    background-color:#f3c553!important;border:1px solid rgba(209,151,35,.52)!important;color:#17140d!important;
    box-shadow:0 4px 12px rgba(197,137,25,.18),inset 0 1px 0 rgba(255,255,255,.75)!important;
  }
  body #coach #coach-nav button::before,body #coach #coach-nav button::after,
  body #client #client-nav button::before,body #client #client-nav button::after{display:none!important;content:none!important}
  body #coach #coach-nav button svg,body #client #client-nav button svg{
    width:21px!important;height:21px!important;color:#5e5547!important;stroke:currentColor!important;filter:none!important;
  }
  body #coach #coach-nav button span,body #client #client-nav button span{
    color:#5e5547!important;font-size:8px!important;line-height:1!important;font-weight:700!important;margin-top:2px!important;
  }
  body #coach #coach-nav button.active svg,body #client #client-nav button.active svg,
  body #coach #coach-nav button.active span,body #client #client-nav button.active span{color:#17140d!important}
}
`;
})();
