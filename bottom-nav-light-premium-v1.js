/* DCC — barra inferior Light Premium: autoridad CSS directa sobre el nav real. Sin observers ni repintados. */
(function(){
'use strict';
const BUILD='20260916-bottom-nav-white-v12-root-authority';
if(window.__dccBottomNavLightPremium===BUILD)return;
window.__dccBottomNavLightPremium=BUILD;
let s=document.getElementById('dcc-bottom-nav-light-premium-v1');
if(!s){s=document.createElement('style');s.id='dcc-bottom-nav-light-premium-v1';(document.head||document.documentElement).appendChild(s)}
s.textContent=`
@media(max-width:900px){
  html body .side:has(#coach-nav),html body .side:has(#client-nav){
    background:#fffdf9!important;background-image:none!important;background-color:#fffdf9!important;
    border:1px solid rgba(201,151,47,.34)!important;border-radius:27px!important;
    box-shadow:0 10px 28px rgba(83,61,25,.12),inset 0 1px 0 #fff!important;
    overflow:hidden!important;padding:5px!important;transition:none!important;animation:none!important;
  }
  html body #coach-nav,html body #client-nav{
    background:#fffdf9!important;background-image:none!important;background-color:#fffdf9!important;
    border:1px solid rgba(201,151,47,.20)!important;border-radius:22px!important;
    box-shadow:none!important;overflow:hidden!important;gap:3px!important;
    transition:none!important;animation:none!important;
  }
  html body #coach-nav button,html body #client-nav button{
    background:transparent!important;background-image:none!important;background-color:transparent!important;
    color:#69707d!important;border:1px solid transparent!important;box-shadow:none!important;text-shadow:none!important;
    transition:none!important;animation:none!important;transform:none!important;
  }
  html body #coach-nav button:not(.active),html body #client-nav button:not(.active){
    background:transparent!important;background-image:none!important;background-color:transparent!important;
    color:#69707d!important;border-color:transparent!important;box-shadow:none!important;
  }
  html body #coach-nav button:not(.active) svg,html body #client-nav button:not(.active) svg,
  html body #coach-nav button:not(.active) span,html body #client-nav button:not(.active) span{
    color:#69707d!important;stroke:currentColor!important;filter:none!important;
  }
  html body #coach-nav button.active,html body #client-nav button.active{
    background:linear-gradient(145deg,#ffe79a 0%,#f4c857 55%,#e9ad35 100%)!important;
    background-color:#f3c553!important;color:#17140d!important;
    border:1px solid rgba(209,151,35,.52)!important;
    box-shadow:0 4px 12px rgba(197,137,25,.18),inset 0 1px 0 rgba(255,255,255,.75)!important;
  }
  html body #coach-nav button.active svg,html body #client-nav button.active svg,
  html body #coach-nav button.active span,html body #client-nav button.active span{
    color:#17140d!important;stroke:currentColor!important;filter:none!important;
  }
  html body #coach-nav button::before,html body #coach-nav button::after,
  html body #client-nav button::before,html body #client-nav button::after{display:none!important;content:none!important}
}
`;
})();
