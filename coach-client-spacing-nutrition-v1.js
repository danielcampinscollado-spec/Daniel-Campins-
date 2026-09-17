/* DCC — compacta encabezado de cliente y alimentación */
(function(){
'use strict';
const BUILD='20260917-client-spacing-nutrition-v4-clean-guidance';
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
    #coach-main.dcc-ca .dcc-n2-card.dcc-n2-card-with-status .dcc-n2-plan{grid-template-columns:1fr!important;padding-right:72px!important}
    #coach-main.dcc-ca .dcc-n2-card.dcc-n2-card-with-status .dcc-n2-ico{display:none!important}
    #coach-main.dcc-ca .dcc-n2-card .dcc-n2-status.dcc-n2-status-in-card{
      position:absolute!important;top:13px!important;right:13px!important;z-index:2!important;margin:0!important
    }

    #coach-main.dcc-ca .dcc-nutrition-create-footer.dcc-creation-progress{
      margin:5px 0 13px!important;padding:0!important;border:0!important;border-radius:0!important;
      background:transparent!important;background-image:none!important;box-shadow:none!important;color:#17191d!important
    }
    #coach-main.dcc-ca .dcc-creation-progress .dcc-progress-head{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:12px!important;margin-bottom:5px!important}
    #coach-main.dcc-ca .dcc-creation-progress .dcc-progress-head b{margin:0!important;color:#17191d!important;font-size:14px!important;line-height:1.2!important}
    #coach-main.dcc-ca .dcc-creation-progress .dcc-progress-count{flex:0 0 auto!important;padding:5px 9px!important;border:1px solid rgba(183,123,19,.28)!important;border-radius:999px!important;background:#fffaf0!important;color:#8a6117!important;font-size:10px!important;font-weight:900!important}
    #coach-main.dcc-ca .dcc-creation-progress p{margin:0!important;color:#747c87!important;font-size:10px!important;line-height:1.45!important}
    #coach-main.dcc-ca .dcc-creation-progress .dcc-progress-line{height:3px!important;margin-top:9px!important;overflow:hidden!important;border-radius:999px!important;background:rgba(183,123,19,.12)!important}
    #coach-main.dcc-ca .dcc-creation-progress .dcc-progress-line span{display:block!important;height:100%!important;border-radius:999px!important;background:linear-gradient(90deg,#e6b84c,#d69a28)!important}

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
function cleanCreationGuidance(){
  const main=document.querySelector('#coach-main.dcc-ca');
  const footer=main?.querySelector('.dcc-nutrition-create-footer');
  const meals=main?.querySelector('.dcc-diet-meals');
  if(!footer||!meals)return;
  if(footer.querySelector('.dcc-nutrition-create-actions,.dcc-nutrition-create-next,.dcc-nutrition-create-save')){
    footer.classList.remove('dcc-creation-progress');
    return;
  }
  const text=(footer.textContent||'').toLowerCase();
  if(!/completa el día|rellena todas las comidas/.test(text))return;
  const rows=[...main.querySelectorAll('.dcc-diet-meal')].filter(r=>getComputedStyle(r).display!=='none');
  if(!rows.length)return;
  const done=rows.filter(r=>{const t=(r.textContent||'').toLowerCase();const m=t.match(/(\d+)\s+alimentos?/);return m&&Number(m[1])>0}).length;
  const total=rows.length;
  const type=window.__dccDietType==='rest'?'descanso':'entrenamiento';
  const sig=type+':'+done+':'+total;
  footer.classList.add('dcc-creation-progress');
  if(footer.dataset.cleanSig!==sig){
    footer.dataset.cleanSig=sig;
    footer.innerHTML=`<div class="dcc-progress-head"><b>Completa el día de ${type}</b><span class="dcc-progress-count">${done} de ${total}</span></div><p>Entra en cada comida y añade sus alimentos. Cuando completes todas, podrás continuar con el plan.</p><div class="dcc-progress-line"><span style="width:${total?Math.round(done/total*100):0}%"></span></div>`;
  }
  if(footer.nextElementSibling!==meals)meals.parentNode.insertBefore(footer,meals);
}
let queued=false;function refresh(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;css();compactNutrition();cleanCreationGuidance()})}
refresh();new MutationObserver(refresh).observe(document.documentElement,{childList:true,subtree:true});window.addEventListener('pageshow',refresh);
})();