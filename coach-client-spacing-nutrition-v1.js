/* DCC — compacta encabezado de cliente y alimentación */
(function(){
'use strict';
const BUILD='20260915-client-spacing-nutrition-v3-compact-status';
if(window.__dccClientSpacingNutrition===BUILD)return;window.__dccClientSpacingNutrition=BUILD;
function css(){
  let s=document.getElementById('dcc-client-spacing-nutrition-v1-css');
  if(!s){s=document.createElement('style');s.id='dcc-client-spacing-nutrition-v1-css';(document.head||document.documentElement).appendChild(s)}
  s.textContent=`
    #coach-main.dcc-ca .dcc-ca-back{margin-top:2px!important}
    #coach-main.dcc-ca .dcc-ca-profilebar{margin-top:1px!important;margin-bottom:4px!important;align-items:center!important}
    #coach-main.dcc-ca .dcc-ca-profilecopy h1{margin-bottom:0!important}
    #coach-main.dcc-ca .dcc-ca-profilegoal{margin-top:1px!important}
    #coach-main.dcc-ca .dcc-profile-delete-near-header{align-self:center!important;margin:0!important}
    #coach-main.dcc-ca .dcc-ca-tabs{margin-top:6px!important;margin-bottom:9px!important}

    #coach-main.dcc-ca .dcc-n2{gap:8px!important;margin-top:3px!important}
    #coach-main.dcc-ca .dcc-n2-head.dcc-n2-status-only{display:none!important}
    #coach-main.dcc-ca .dcc-n2-card.dcc-n2-card-with-status{position:relative!important}
    #coach-main.dcc-ca .dcc-n2-card.dcc-n2-card-with-status .dcc-n2-plan{padding-right:72px!important}
    #coach-main.dcc-ca .dcc-n2-card .dcc-n2-status.dcc-n2-status-in-card{
      position:absolute!important;top:13px!important;right:13px!important;z-index:2!important;margin:0!important
    }
    @media(max-width:390px){
      #coach-main.dcc-ca .dcc-ca-back{margin-top:0!important}
      #coach-main.dcc-ca .dcc-ca-profilebar{margin-top:0!important;margin-bottom:3px!important}
      #coach-main.dcc-ca .dcc-ca-tabs{margin-top:5px!important}
      #coach-main.dcc-ca .dcc-profile-delete-near-header{margin:0!important;padding:9px 10px!important}
      #coach-main.dcc-ca .dcc-n2-card.dcc-n2-card-with-status .dcc-n2-plan{padding-right:66px!important}
    }
  `;
}
function compactNutrition(){
  document.querySelectorAll('#coach-main.dcc-ca .dcc-n2-head').forEach(head=>{
    const h=head.querySelector('h2');
    if(h&&h.textContent.trim().toLowerCase()==='plan de alimentación')h.remove();
    const status=head.querySelector('.dcc-n2-status');
    const card=head.nextElementSibling?.classList?.contains('dcc-n2-card')?head.nextElementSibling:null;
    if(status&&card){
      status.classList.add('dcc-n2-status-in-card');
      card.classList.add('dcc-n2-card-with-status');
      card.appendChild(status);
    }
    if(!head.textContent.trim()&&!head.children.length)head.remove();
    else head.classList.add('dcc-n2-status-only');
  });
}
let queued=false;function refresh(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;css();compactNutrition()})}
refresh();new MutationObserver(refresh).observe(document.documentElement,{childList:true,subtree:true});window.addEventListener('pageshow',refresh);
})();