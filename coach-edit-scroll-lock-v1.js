/* DCC — mantiene la posición mientras se crea/edita dieta o rutina */
(function(){
  'use strict';
  const BUILD='20260914-coach-edit-scroll-lock-v1';
  if(window.__dccCoachEditScrollLock===BUILD)return;
  window.__dccCoachEditScrollLock=BUILD;

  let savedWindowY=0;
  let savedMainY=0;
  let preserveUntil=0;
  let restoring=false;
  let raf=0;

  const norm=v=>String(v||'').replace(/\s+/g,' ').trim().toLowerCase();

  function main(){return document.getElementById('coach-main')}

  function inDietEdit(){
    const m=main();
    if(!m)return false;
    return !!m.querySelector('.dcc-n2-editorbar,.dcc-diet-meals,.dcc-diet-body,.dcc-diet-add-meal,.dcc-diet-add-food') ||
      /diet|dieta|nutrition|aliment/.test(String(window.currentScreen||'').toLowerCase());
  }

  function inTrainingEdit(){
    const m=main();
    if(!m)return false;
    const screen=String(window.currentScreen||'').toLowerCase();
    return !!window.__dccTrainingEdit ||
      !!m.querySelector('.dcc-tr-actions,.dcc-tr-editrow,.dcc-tr-add,.dcc-tr-remove') ||
      /createroutine|editroutine|routine|rutina/.test(screen);
  }

  function editContext(){return inDietEdit()||inTrainingEdit()}

  function isLeavingControl(target){
    const el=target?.closest?.('button,a')||target;
    const t=norm(el?.textContent);
    if(el?.closest?.('#coach-nav,.dcc-ca-tabs,.dcc-ca-back'))return true;
    return t==='cancelar'||t.includes('guardar cambios')||t.includes('guardar rutina')||t.includes('guardar dieta')||
      t==='resumen'||t==='alimentación'||t==='entrenamiento'||t==='progreso'||t==='clientes'||t==='panel'||
      t==='calendario'||t==='check-in'||t==='mensajes';
  }

  function remember(ms=1400){
    const scroller=document.scrollingElement||document.documentElement;
    savedWindowY=Math.max(0,window.scrollY||scroller.scrollTop||0);
    const m=main();
    savedMainY=m?Math.max(0,m.scrollTop||0):0;
    preserveUntil=Date.now()+ms;
  }

  function restore(){
    if(restoring||Date.now()>preserveUntil)return;
    restoring=true;
    try{
      const scroller=document.scrollingElement||document.documentElement;
      const max=Math.max(0,scroller.scrollHeight-window.innerHeight);
      const y=Math.min(savedWindowY,max);
      if(Math.abs((window.scrollY||scroller.scrollTop||0)-y)>2)window.scrollTo(0,y);
      const m=main();
      if(m&&savedMainY>0&&Math.abs(m.scrollTop-savedMainY)>2)m.scrollTop=savedMainY;
    }finally{restoring=false}
  }

  function scheduleRestore(){
    if(Date.now()>preserveUntil)return;
    cancelAnimationFrame(raf);
    raf=requestAnimationFrame(()=>{
      restore();
      setTimeout(restore,25);
      setTimeout(restore,80);
      setTimeout(restore,180);
      setTimeout(restore,360);
      setTimeout(restore,700);
    });
  }

  document.addEventListener('pointerdown',e=>{
    if(!editContext()||isLeavingControl(e.target))return;
    const hit=e.target?.closest?.('button,input,textarea,select,[contenteditable="true"],.dcc-diet-meal,.dcc-tr-day');
    if(hit)remember();
  },true);

  document.addEventListener('click',e=>{
    if(!editContext()||isLeavingControl(e.target))return;
    const hit=e.target?.closest?.('button,.dcc-diet-meal,.dcc-tr-day');
    if(hit){remember();scheduleRestore()}
  },true);

  document.addEventListener('input',e=>{
    if(editContext()&&e.target?.closest?.('#coach-main'))remember(700);
  },true);
  document.addEventListener('change',e=>{
    if(editContext()&&e.target?.closest?.('#coach-main')){remember(900);scheduleRestore()}
  },true);

  function observe(){
    if(!document.body||document.body.__dccEditScrollObserver)return;
    document.body.__dccEditScrollObserver=true;
    new MutationObserver(()=>{
      if(Date.now()<=preserveUntil)scheduleRestore();
    }).observe(document.body,{childList:true,subtree:true});
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',observe,{once:true});
  else observe();
})();
