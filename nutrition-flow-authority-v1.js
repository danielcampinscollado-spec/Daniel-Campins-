/* DCC — autoridad UX del flujo de alimentación: continuar borrador y eliminar duplicado redundante */
(function(){
  'use strict';
  const BUILD='20260914-nutrition-flow-authority-v1';
  if(window.__dccNutritionFlowAuthority===BUILD)return;
  window.__dccNutritionFlowAuthority=BUILD;

  let queued=false;

  function selectedClientId(){
    return window.selectedClient||window.currentClientId||null;
  }

  function dietCounts(id){
    const p=window.data?.diets?.[id]||null;
    return {
      training:Array.isArray(p?.training?.meals)?p.training.meals.length:0,
      rest:Array.isArray(p?.rest?.meals)?p.rest.meals.length:0
    };
  }

  function normalizeText(el){
    return String(el?.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();
  }

  function apply(){
    const root=document.querySelector('#coach-main.dcc-ca .dcc-n2');
    if(!root)return;
    const actions=root.querySelector('.dcc-n2-actions');
    if(!actions)return;

    const buttons=[...actions.querySelectorAll('button')];

    // Duplicar y renovar usando el actual resolvían el mismo caso de uso. Dejamos una sola ruta clara.
    buttons.forEach(btn=>{
      if(normalizeText(btn).includes('duplicar plan actual'))btn.remove();
    });

    const id=selectedClientId();
    if(!id)return;
    const counts=dietCounts(id);
    const hasAny=counts.training>0||counts.rest>0;
    const incomplete=hasAny&&(counts.training===0||counts.rest===0);
    if(!incomplete)return;

    const edit=[...actions.querySelectorAll('button')].find(btn=>normalizeText(btn).includes('editar plan actual'));
    if(!edit)return;

    const label=edit.querySelector('span:nth-child(2)');
    if(label){
      label.childNodes.forEach(node=>{if(node.nodeType===Node.TEXT_NODE)node.textContent='Continuar dieta actual'});
      const small=label.querySelector('small');
      if(small)small.textContent='Continúa donde lo dejaste y termina el plan';
    }
    edit.classList.add('primary');
    actions.prepend(edit);
  }

  function schedule(){
    if(queued)return;
    queued=true;
    requestAnimationFrame(()=>{queued=false;apply()});
  }

  function start(){
    apply();
    if(document.body&&!document.body.__dccNutritionFlowAuthorityObserver){
      document.body.__dccNutritionFlowAuthorityObserver=true;
      new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});
    }
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
  window.addEventListener('pageshow',schedule);
  document.addEventListener('click',e=>{
    const text=normalizeText(e.target?.closest?.('button')||e.target);
    if(text.includes('alimentación')||text.includes('crear')||text.includes('editar')||text.includes('continuar'))setTimeout(schedule,0);
  },true);
})();
