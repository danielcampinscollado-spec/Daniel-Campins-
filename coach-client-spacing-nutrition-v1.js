/* DCC — ajuste compacto del encabezado de cliente y alimentación */
(function(){
'use strict';
const BUILD='20260915-client-spacing-nutrition-v1';
if(window.__dccClientSpacingNutrition===BUILD)return;window.__dccClientSpacingNutrition=BUILD;
function css(){
  if(document.getElementById('dcc-client-spacing-nutrition-v1-css'))return;
  const s=document.createElement('style');s.id='dcc-client-spacing-nutrition-v1-css';s.textContent=`
    #coach-main.dcc-ca .dcc-ca-back{margin-top:8px!important}
    #coach-main.dcc-ca .dcc-ca-profilebar{margin-top:9px!important;margin-bottom:10px!important}
    #coach-main.dcc-ca .dcc-ca-profilecopy h1{margin-bottom:0!important}
    #coach-main.dcc-ca .dcc-ca-profilegoal{margin-top:3px!important}
    #coach-main.dcc-ca .dcc-n2-head.dcc-n2-status-only{justify-content:flex-end!important;margin-top:-3px!important;margin-bottom:-2px!important}
    #coach-main.dcc-ca .dcc-n2-head.dcc-n2-status-only .dcc-n2-status{margin-left:auto!important}
    @media(max-width:390px){
      #coach-main.dcc-ca .dcc-ca-back{margin-top:7px!important}
      #coach-main.dcc-ca .dcc-ca-profilebar{margin-top:8px!important}
    }
  `;(document.head||document.documentElement).appendChild(s);
}
function cleanNutritionTitle(){
  document.querySelectorAll('#coach-main.dcc-ca .dcc-n2-head').forEach(head=>{
    const h=head.querySelector('h2');
    if(h&&h.textContent.trim().toLowerCase()==='plan de alimentación'){
      h.remove();head.classList.add('dcc-n2-status-only');
    }
  });
}
let queued=false;function refresh(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;css();cleanNutritionTitle()})}
refresh();new MutationObserver(refresh).observe(document.documentElement,{childList:true,subtree:true});window.addEventListener('pageshow',refresh);
})();