/* DCC — mantiene la posición solo cuando una edición real vuelve a renderizar */
(function(){
  'use strict';
  const BUILD='20260914-coach-edit-scroll-lock-v3';
  if(window.__dccCoachEditScrollLock===BUILD)return;
  window.__dccCoachEditScrollLock=BUILD;

  let savedWindowY=0;
  let savedMainY=0;
  let preserveUntil=0;
  let enteringUntil=0;
  let restoreQueued=false;

  const norm=v=>String(v||'').replace(/\s+/g,' ').trim().toLowerCase();
  const main=()=>document.getElementById('coach-main');

  function inDietEdit(){
    const m=main();
    return !!m?.querySelector('.dcc-n2-editorbar,.dcc-diet-meals,.dcc-diet-body,.dcc-diet-add-meal,.dcc-diet-add-food');
  }

  function inTrainingEdit(){
    const m=main();
    return !!window.__dccTrainingEdit||!!m?.querySelector('.dcc-tr-actions,.dcc-tr-editrow,.dcc-tr-add,.dcc-tr-remove,[data-training-editor],.training-editor');
  }

  function editContext(){return inDietEdit()||inTrainingEdit()}

  function isEnterEditorControl(target){
    const el=target?.closest?.('button,a')||target;
    const t=norm(el?.textContent);
    return t.includes('continuar dieta')||t.includes('editar plan actual')||t.includes('crear desde cero')||
      t.includes('renovar usando')||t.includes('crear rutina')||t.includes('editar rutina')||t.includes('continuar rutina');
  }

  function editorAnchor(){
    const m=main();
    return m?.querySelector('.dcc-n2-editorbar,[data-training-editor],.training-editor,.dcc-tr-actions,.dcc-tr-editrow,.dcc-tr-add')||null;
  }

  function focusEditor(){
    if(Date.now()>enteringUntil)return false;
    const anchor=editorAnchor();
    if(!anchor)return false;
    preserveUntil=0;
    const top=(window.scrollY||document.scrollingElement?.scrollTop||0)+anchor.getBoundingClientRect().top-12;
    window.scrollTo(0,Math.max(0,top));
    enteringUntil=0;
    return true;
  }

  function beginEditorEntry(){
    preserveUntil=0;
    enteringUntil=Date.now()+1400;
    requestAnimationFrame(()=>requestAnimationFrame(focusEditor));
    setTimeout(focusEditor,120);
    setTimeout(focusEditor,320);
    setTimeout(focusEditor,700);
    setTimeout(focusEditor,1200);
  }

  function mutationControl(target){
    const el=target?.closest?.('button,.dcc-diet-meal,.dcc-tr-day')||target;
    if(!el)return false;
    if(el.matches?.('.dcc-diet-add-meal,.dcc-diet-add-food,.dcc-diet-add-option,.dcc-diet-option-delete,.dcc-diet-icon-btn,.dcc-tr-add,.dcc-tr-remove,.dcc-tr-day-head,.dcc-tr-save'))return true;
    const t=norm(el.textContent);
    return /añadir|agregar|eliminar|borrar|quitar|opción|ejercicio|serie/.test(t);
  }

  function remember(ms=650){
    if(Date.now()<=enteringUntil)return;
    const scroller=document.scrollingElement||document.documentElement;
    savedWindowY=Math.max(0,window.scrollY||scroller.scrollTop||0);
    const m=main();
    savedMainY=m?Math.max(0,m.scrollTop||0):0;
    preserveUntil=Date.now()+ms;
  }

  function restoreOnce(){
    if(restoreQueued||Date.now()>preserveUntil||Date.now()<=enteringUntil)return;
    restoreQueued=true;
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      restoreQueued=false;
      if(Date.now()>preserveUntil)return;
      const scroller=document.scrollingElement||document.documentElement;
      const max=Math.max(0,scroller.scrollHeight-window.innerHeight);
      const y=Math.min(savedWindowY,max);
      if(Math.abs((window.scrollY||scroller.scrollTop||0)-y)>3)window.scrollTo(0,y);
      const m=main();
      if(m&&savedMainY>0&&Math.abs((m.scrollTop||0)-savedMainY)>3)m.scrollTop=savedMainY;
      preserveUntil=0;
    }));
  }

  document.addEventListener('click',e=>{
    if(isEnterEditorControl(e.target)){beginEditorEntry();return;}
    if(!editContext()||!mutationControl(e.target))return;
    remember();
  },true);

  function observe(){
    if(!document.body||document.body.__dccEditScrollObserverV3)return;
    document.body.__dccEditScrollObserverV3=true;
    new MutationObserver(()=>{
      if(Date.now()<=enteringUntil)focusEditor();
      else if(Date.now()<=preserveUntil)restoreOnce();
    }).observe(document.body,{childList:true,subtree:true});
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',observe,{once:true});
  else observe();
})();
