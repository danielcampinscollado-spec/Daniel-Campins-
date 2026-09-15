/* DCC — autoridad UX del flujo de alimentación: un plan puede tener uno o dos tipos de día */
(function(){
  'use strict';
  const BUILD='20260915-nutrition-flow-authority-v2-single-day-valid';
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

  function replaceText(root,from,to){
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    const nodes=[];
    while(walker.nextNode())nodes.push(walker.currentNode);
    nodes.forEach(node=>{
      if(String(node.nodeValue||'').trim().toLowerCase()===from.toLowerCase())node.nodeValue=to;
    });
  }

  function apply(){
    const root=document.querySelector('#coach-main.dcc-ca .dcc-n2');
    if(!root)return;
    const actions=root.querySelector('.dcc-n2-actions');

    if(actions){
      [...actions.querySelectorAll('button')].forEach(btn=>{
        if(normalizeText(btn).includes('duplicar plan actual'))btn.remove();
      });
    }

    const id=selectedClientId();
    if(!id)return;
    const counts=dietCounts(id);
    const hasAny=counts.training>0||counts.rest>0;

    // Un plan con solo entrenamiento o solo descanso es perfectamente válido.
    // La ausencia del segundo tipo de día se avisa al guardar, pero nunca marca el plan como incompleto.
    if(hasAny){
      const status=root.querySelector('.dcc-n2-status');
      if(status){status.textContent='Activo';status.classList.remove('off')}
      replaceText(root,'Plan sin terminar','Activo');

      if(actions){
        const edit=[...actions.querySelectorAll('button')].find(btn=>{
          const t=normalizeText(btn);
          return t.includes('continuar dieta actual')||t.includes('editar plan actual')||t.includes('editar plan');
        });
        if(edit){
          const label=edit.querySelector('span:nth-child(2)');
          if(label){
            [...label.childNodes].forEach(node=>{
              if(node.nodeType===Node.TEXT_NODE&&String(node.nodeValue||'').trim())node.nodeValue='Editar plan';
            });
            const small=label.querySelector('small');
            if(small)small.textContent='Modifica comidas, opciones y cantidades';
          }
        }
      }
    }
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
      new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true,characterData:true});
    }
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
  window.addEventListener('pageshow',schedule);
  document.addEventListener('click',e=>{
    const text=normalizeText(e.target?.closest?.('button')||e.target);
    if(text.includes('alimentación')||text.includes('crear')||text.includes('editar')||text.includes('guardar'))setTimeout(schedule,0);
  },true);
})();