/* DCC — mantiene posición únicamente dentro de editores reales; nunca en navegación normal del cliente */
(function(){
  'use strict';
  const BUILD='20260914-coach-edit-scroll-lock-v4';
  if(window.__dccCoachEditScrollLock===BUILD)return;
  window.__dccCoachEditScrollLock=BUILD;

  let savedWindowY=0,savedMainY=0,preserveUntil=0,enteringUntil=0,restoreQueued=false;
  const norm=v=>String(v||'').replace(/\s+/g,' ').trim().toLowerCase();
  const main=()=>document.getElementById('coach-main');

  function inDietEdit(){
    const m=main();
    /* .dcc-diet-meals y .dcc-diet-body también existen en la vista normal.
       No se consideran edición porque provocaban restauraciones de scroll al navegar. */
    return !!m?.querySelector('.dcc-n2-editorbar,[data-diet-editor],.diet-editor,.dcc-n2-save,.dcc-n2-editor');
  }
  function inTrainingEdit(){
    const m=main();
    return !!window.__dccTrainingEdit||!!m?.querySelector('.dcc-tr-actions,.dcc-tr-editrow,[data-training-editor],.training-editor');
  }
  function editContext(){return inDietEdit()||inTrainingEdit()}

  function isEnterEditorControl(target){
    const el=target?.closest?.('button,a')||target,t=norm(el?.textContent);
    return t.includes('continuar dieta')||t.includes('editar plan actual')||t.includes('crear desde cero')||
      t.includes('renovar usando')||t.includes('crear rutina')||t.includes('editar rutina')||t.includes('continuar rutina');
  }
  function editorAnchor(){return main()?.querySelector('.dcc-n2-editorbar,[data-diet-editor],.diet-editor,[data-training-editor],.training-editor,.dcc-tr-actions,.dcc-tr-editrow')||null}
  function focusEditor(){
    if(Date.now()>enteringUntil)return false;
    const anchor=editorAnchor();if(!anchor)return false;
    preserveUntil=0;
    const top=(window.scrollY||document.scrollingElement?.scrollTop||0)+anchor.getBoundingClientRect().top-12;
    window.scrollTo(0,Math.max(0,top));enteringUntil=0;return true;
  }
  function beginEditorEntry(){
    preserveUntil=0;enteringUntil=Date.now()+900;
    requestAnimationFrame(()=>requestAnimationFrame(focusEditor));
    setTimeout(focusEditor,120);setTimeout(focusEditor,350);setTimeout(focusEditor,750);
  }
  function mutationControl(target){
    const el=target?.closest?.('button')||target;if(!el)return false;
    if(el.matches?.('.dcc-diet-add-meal,.dcc-diet-add-food,.dcc-diet-add-option,.dcc-diet-option-delete,.dcc-diet-icon-btn,.dcc-tr-add,.dcc-tr-remove,.dcc-tr-save'))return true;
    const t=norm(el.textContent);return /añadir|agregar|eliminar|borrar|quitar|opción|ejercicio|serie/.test(t);
  }
  function remember(ms=500){
    if(Date.now()<=enteringUntil)return;
    const scroller=document.scrollingElement||document.documentElement;
    savedWindowY=Math.max(0,window.scrollY||scroller.scrollTop||0);
    const m=main();savedMainY=m?Math.max(0,m.scrollTop||0):0;preserveUntil=Date.now()+ms;
  }
  function restoreOnce(){
    if(restoreQueued||Date.now()>preserveUntil||Date.now()<=enteringUntil)return;
    restoreQueued=true;
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      restoreQueued=false;if(Date.now()>preserveUntil)return;
      const scroller=document.scrollingElement||document.documentElement,max=Math.max(0,scroller.scrollHeight-window.innerHeight),y=Math.min(savedWindowY,max);
      if(Math.abs((window.scrollY||scroller.scrollTop||0)-y)>6)window.scrollTo(0,y);
      const m=main();if(m&&savedMainY>0&&Math.abs((m.scrollTop||0)-savedMainY)>6)m.scrollTop=savedMainY;
      preserveUntil=0;
    }));
  }

  document.addEventListener('click',e=>{
    if(e.target?.closest?.('.dcc-ca-tabs,#coach-nav')){preserveUntil=0;enteringUntil=0;return}
    if(isEnterEditorControl(e.target)){beginEditorEntry();return}
    if(!editContext()||!mutationControl(e.target))return;
    remember();
  },true);

  function observe(){
    if(!document.body||document.body.__dccEditScrollObserverV4)return;
    document.body.__dccEditScrollObserverV4=true;
    new MutationObserver(()=>{
      if(Date.now()<=enteringUntil)focusEditor();
      else if(Date.now()<=preserveUntil)restoreOnce();
    }).observe(document.body,{childList:true,subtree:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',observe,{once:true});else observe();
})();
