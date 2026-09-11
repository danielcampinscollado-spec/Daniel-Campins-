/* DCC — Hotfix robusto acciones entrenamiento cliente v2 */
(function(){
  'use strict';
  if(window.__dccTrainingActionsHotfixV2) return;
  window.__dccTrainingActionsHotfixV2 = true;

  const CSS_ID='dcc-training-actions-hotfix-v2-css';
  function installCss(){
    if(document.getElementById(CSS_ID)) return;
    const s=document.createElement('style');
    s.id=CSS_ID;
    s.textContent=`
      #client-main .dct-routine-actions{position:relative!important;z-index:50!important;pointer-events:auto!important}
      #client-main .dct-start,#client-main .dct-view-exercises{position:relative!important;z-index:51!important;pointer-events:auto!important;touch-action:manipulation!important;-webkit-tap-highlight-color:rgba(217,170,74,.15)!important}
      #client-main .dct-routine-card{isolation:isolate!important}
    `;
    document.head.appendChild(s);
  }

  function selectedDayIndex(){
    const n=Number(window.trainingDayTab);
    return Number.isFinite(n)&&n>=0?n:0;
  }

  function nativeStart(index){
    if(typeof window.startWorkout==='function'){
      window.startWorkout(index);
      return true;
    }
    try{
      const fn=(0,eval)('(typeof startWorkout === "function") ? startWorkout : null');
      if(typeof fn==='function'){
        fn(index);
        return true;
      }
    }catch(e){console.error('DCC startWorkout eval error',e)}
    return false;
  }

  function toggle(view){
    const card=view.closest('.dct-routine-card');
    if(!card) return false;
    const open=!card.classList.contains('open');
    card.classList.toggle('open',open);
    view.setAttribute('aria-expanded',String(open));
    const label=view.querySelector('.dct-view-label');
    if(label) label.textContent=open?'Ocultar ejercicios':'Ver ejercicios';
    return true;
  }

  function bind(root=document){
    installCss();
    root.querySelectorAll?.('.dct-view-exercises').forEach(btn=>{
      if(btn.dataset.dccBoundV2) return;
      btn.dataset.dccBoundV2='1';
      btn.removeAttribute('onclick');
      const run=e=>{e.preventDefault();e.stopPropagation();toggle(btn)};
      btn.addEventListener('click',run,false);
      btn.addEventListener('touchend',run,{passive:false});
    });
    root.querySelectorAll?.('.dct-start').forEach(btn=>{
      if(btn.dataset.dccBoundV2) return;
      btn.dataset.dccBoundV2='1';
      btn.removeAttribute('onclick');
      const run=e=>{
        e.preventDefault();e.stopPropagation();
        const ok=nativeStart(selectedDayIndex());
        if(!ok && typeof window.toast==='function') window.toast('No se pudo iniciar el entrenamiento');
      };
      btn.addEventListener('click',run,false);
      btn.addEventListener('touchend',run,{passive:false});
    });
  }

  bind();
  const observer=new MutationObserver(muts=>{
    for(const m of muts){for(const n of m.addedNodes){if(n&&n.nodeType===1) bind(n)}}
  });
  observer.observe(document.documentElement,{childList:true,subtree:true});
  document.addEventListener('DOMContentLoaded',()=>bind(),{once:true});
})();
