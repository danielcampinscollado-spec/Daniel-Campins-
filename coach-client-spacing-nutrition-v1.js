/* DCC — ajuste visible del encabezado de cliente y alimentación */
(function(){
'use strict';
const BUILD='20260915-client-spacing-nutrition-v2';
if(window.__dccClientSpacingNutrition===BUILD)return;window.__dccClientSpacingNutrition=BUILD;
function css(){
  let s=document.getElementById('dcc-client-spacing-nutrition-v1-css');
  if(!s){s=document.createElement('style');s.id='dcc-client-spacing-nutrition-v1-css';(document.head||document.documentElement).appendChild(s)}
  s.textContent=`
    #coach-main.dcc-ca .dcc-ca-back{position:relative!important;top:12px!important;margin-bottom:12px!important}
    #coach-main.dcc-ca .dcc-ca-profilebar{position:relative!important;top:8px!important;margin-top:10px!important;margin-bottom:18px!important}
    #coach-main.dcc-ca .dcc-ca-profilecopy h1{margin:0!important;line-height:1.05!important}
    #coach-main.dcc-ca .dcc-ca-profilegoal{margin-top:5px!important}
    #coach-main.dcc-ca .dcc-n2-head>h2{display:none!important}
    #coach-main.dcc-ca .dcc-n2-head{justify-content:flex-end!important;margin-top:-2px!important;margin-bottom:-2px!important;min-height:32px!important}
    #coach-main.dcc-ca .dcc-n2-head .dcc-n2-status{margin-left:auto!important}
    @media(max-width:390px){
      #coach-main.dcc-ca .dcc-ca-back{top:10px!important;margin-bottom:10px!important}
      #coach-main.dcc-ca .dcc-ca-profilebar{top:7px!important;margin-bottom:17px!important}
    }
  `;
}
function cleanNutritionTitle(){
  document.querySelectorAll('.dcc-n2-head').forEach(head=>{
    const h=[...head.querySelectorAll('h1,h2,h3')].find(x=>/plan\s+de\s+alimentaci[oó]n/i.test((x.textContent||'').trim()));
    if(h){h.style.setProperty('display','none','important');head.classList.add('dcc-n2-status-only')}
  });
}
let queued=false;function refresh(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;css();cleanNutritionTitle()})}
refresh();new MutationObserver(refresh).observe(document.documentElement,{childList:true,subtree:true,characterData:true});window.addEventListener('pageshow',refresh);window.addEventListener('load',refresh);
})();