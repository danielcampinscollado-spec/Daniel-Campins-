/* DCC — navegación activa + protección de cambios sin guardar del entrenador */
(function(){
  'use strict';
  const BUILD='20260914-coach-edit-safety-v2';
  if(window.__dccCoachEditSafety===BUILD)return;
  window.__dccCoachEditSafety=BUILD;

  let dirty=false;
  let dirtyKind='';
  let navObserver=null;
  let lastScreen='';

  const norm=v=>String(v||'').replace(/\s+/g,' ').trim().toLowerCase();

  function coachVisible(){
    const coach=document.getElementById('coach');
    if(!coach)return false;
    try{return getComputedStyle(coach).display!=='none'}catch(_){return true}
  }

  function screenIndex(){
    const s=String(window.currentScreen||'').toLowerCase();
    if(s==='dashboard'||s==='panel'||s==='home')return 0;
    if(s==='clients'||s==='client'||s==='routines'||s==='diets')return 1;
    if(s==='calendar')return 2;
    if(s==='checkin'||s==='check-in')return 3;
    if(s==='messages')return 4;
    if(document.querySelector('#coach-main.dcc-ca'))return 1;
    if(document.querySelector('#coach-main.dcc-p9-dashboard'))return 0;
    if(document.querySelector('#coach-main.dcc-cal-v11,#coach-main .dcc-cal'))return 2;
    return -1;
  }

  function syncNav(){
    if(!coachVisible())return;
    const nav=document.getElementById('coach-nav');
    if(!nav)return;
    const buttons=[...nav.querySelectorAll('button')];
    if(buttons.length<5)return;
    const idx=screenIndex();
    if(idx<0)return;
    buttons.forEach((b,i)=>{
      const should=i===idx;
      if(b.classList.contains('active')!==should)b.classList.toggle('active',should);
      if(should){if(b.getAttribute('aria-current')!=='page')b.setAttribute('aria-current','page')}
      else if(b.hasAttribute('aria-current'))b.removeAttribute('aria-current');
    });
  }

  function editKind(){
    const main=document.getElementById('coach-main');
    if(!main||!main.classList.contains('dcc-ca'))return '';
    if(window.__dccTrainingEdit||main.querySelector('.dcc-tr-actions,.dcc-tr-field input,.dcc-tr-remove,.dcc-tr-add'))return 'rutina';
    if(main.querySelector('.dcc-n2-editorbar,.dcc-n2 input,.dcc-n2 textarea,.dcc-diet-body input,.dcc-diet-body textarea'))return 'dieta';
    return '';
  }

  function mutationControl(el){
    if(!el?.closest)return false;
    return !!el.closest('input,textarea,select,[contenteditable="true"],.dcc-tr-remove,.dcc-tr-add,.dcc-diet-add-food,.dcc-diet-add-meal,.dcc-diet-add-option,.dcc-diet-icon-btn,.dcc-diet-option-delete,.dcc-n2-btn');
  }

  function markDirty(kind){
    const k=kind||editKind();if(!k)return;
    dirty=true;dirtyKind=k;document.documentElement.dataset.dccUnsavedCoachEdit=k;
  }
  function clearDirty(){dirty=false;dirtyKind='';delete document.documentElement.dataset.dccUnsavedCoachEdit}
  function warningText(){return `Tienes cambios sin guardar en la ${dirtyKind||'edición'}. Si sales ahora, perderás esos cambios. ¿Salir sin guardar?`}

  function leavingEditArea(target){
    if(!dirty)return false;
    if(target?.closest?.('#coach-nav button'))return true;
    const text=norm(target?.closest?.('button,a')?.textContent||target?.textContent);
    if(['clientes','panel','calendario','check-in','checkin','mensajes','resumen','alimentación','entrenamiento','progreso'].includes(text))return true;
    return !!target?.closest?.('.dcc-ca-back');
  }

  function isSaveOrCancel(target){
    const text=norm(target?.closest?.('button,a')?.textContent||target?.textContent);
    return text.includes('guardar cambios')||text==='guardar'||text.includes('guardar dieta')||text.includes('guardar rutina')||text==='cancelar';
  }

  document.addEventListener('input',()=>{if(editKind())markDirty(editKind())},true);
  document.addEventListener('change',()=>{if(editKind())markDirty(editKind())},true);
  document.addEventListener('click',e=>{
    const kind=editKind();
    if(dirty&&leavingEditArea(e.target)){
      if(!window.confirm(warningText())){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();syncNav();return}
      clearDirty();
    }else if(kind&&isSaveOrCancel(e.target)){
      setTimeout(()=>{if(!editKind()||norm(e.target?.textContent).includes('cancelar'))clearDirty()},500);
    }else if(kind&&mutationControl(e.target))markDirty(kind);
    requestAnimationFrame(syncNav);
    setTimeout(syncNav,100);
  },true);

  window.addEventListener('beforeunload',e=>{if(!dirty)return;e.preventDefault();e.returnValue=''});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)syncNav()});

  function observe(){
    if(navObserver||!document.body)return;
    navObserver=new MutationObserver(()=>{
      const screen=String(window.currentScreen||'');
      if(screen!==lastScreen){lastScreen=screen;syncNav()}
      else if(document.getElementById('coach-nav')&&!document.querySelector('#coach-nav button.active'))syncNav();
      if(dirty&&!editKind()&&coachVisible())clearDirty();
    });
    /* Solo cambios estructurales. Observar class/style aquí provocaba un bucle visual al sincronizar .active. */
    navObserver.observe(document.body,{childList:true,subtree:true});
  }

  function boot(){observe();syncNav();setTimeout(syncNav,80);setTimeout(syncNav,400)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  window.addEventListener('load',boot,{once:true});
  window.addEventListener('pageshow',boot);
})();
