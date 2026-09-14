/* DCC — navegación activa + protección de cambios sin guardar del entrenador */
(function(){
  'use strict';
  const BUILD='20260914-coach-edit-safety-v1';
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
      b.classList.toggle('active',i===idx);
      if(i===idx)b.setAttribute('aria-current','page');
      else b.removeAttribute('aria-current');
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
    const k=kind||editKind();
    if(!k)return;
    dirty=true;dirtyKind=k;
    document.documentElement.dataset.dccUnsavedCoachEdit=k;
  }

  function clearDirty(){
    dirty=false;dirtyKind='';
    delete document.documentElement.dataset.dccUnsavedCoachEdit;
  }

  function warningText(){
    return `Tienes cambios sin guardar en la ${dirtyKind||'edición'}. Si sales ahora, perderás esos cambios. ¿Salir sin guardar?`;
  }

  function leavingEditArea(target){
    if(!dirty)return false;
    const nav=target?.closest?.('#coach-nav button');
    if(nav)return true;
    const text=norm(target?.closest?.('button,a')?.textContent||target?.textContent);
    if(['clientes','panel','calendario','check-in','checkin','mensajes','resumen','alimentación','entrenamiento','progreso'].includes(text))return true;
    if(target?.closest?.('.dcc-ca-back'))return true;
    return false;
  }

  function isSaveOrCancel(target){
    const text=norm(target?.closest?.('button,a')?.textContent||target?.textContent);
    return text.includes('guardar cambios')||text==='guardar'||text.includes('guardar dieta')||text.includes('guardar rutina')||text==='cancelar';
  }

  document.addEventListener('input',e=>{if(editKind())markDirty(editKind())},true);
  document.addEventListener('change',e=>{if(editKind())markDirty(editKind())},true);

  document.addEventListener('click',e=>{
    syncNav();
    const kind=editKind();

    if(dirty&&leavingEditArea(e.target)){
      if(!window.confirm(warningText())){
        e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
        return;
      }
      clearDirty();
      return;
    }

    if(kind&&isSaveOrCancel(e.target)){
      setTimeout(()=>{
        const stillEditing=!!editKind();
        if(!stillEditing||norm(e.target?.textContent).includes('cancelar'))clearDirty();
      },500);
      return;
    }

    if(kind&&mutationControl(e.target))markDirty(kind);
    setTimeout(syncNav,0);
    setTimeout(syncNav,80);
  },true);

  window.addEventListener('beforeunload',e=>{
    if(!dirty)return;
    e.preventDefault();
    e.returnValue='';
  });

  document.addEventListener('visibilitychange',()=>{
    if(!document.hidden){syncNav()}
  });

  function observe(){
    if(navObserver||!document.body)return;
    navObserver=new MutationObserver(()=>{
      const screen=String(window.currentScreen||'');
      if(screen!==lastScreen){lastScreen=screen;syncNav()}
      else if(document.getElementById('coach-nav')&&!document.querySelector('#coach-nav button.active'))syncNav();
      if(dirty&&!editKind()&&coachVisible())clearDirty();
    });
    navObserver.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class','style']});
  }

  function boot(){observe();syncNav();setTimeout(syncNav,50);setTimeout(syncNav,250);setTimeout(syncNav,900)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  window.addEventListener('load',boot,{once:true});
  window.addEventListener('pageshow',boot);
})();