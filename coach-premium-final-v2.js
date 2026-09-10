/* DCC legacy bridge — fuerza cualquier HTML antiguo del panel hacia el dashboard actual */
(function(){
  'use strict';

  const BUILD='20260910-1918-legacy-bridge';
  window.__dccLegacyCoachBridge=BUILD;

  function isCoachDashboardVisible(){
    const main=document.getElementById('coach-main');
    if(!main) return false;
    const text=(main.textContent||'').toUpperCase();
    return window.currentScreen==='dashboard' ||
      text.includes('CADA CLIENTE ES UN PROCESO') ||
      text.includes('RESUMEN GENERAL') ||
      text.includes('PANEL DE ENTRENADOR') ||
      text.includes('BUENOS DÍAS') ||
      text.includes('BUENAS TARDES') ||
      text.includes('BUENAS NOCHES');
  }

  function forceDashboard(){
    document.getElementById('dcc-coach-final-v2-css')?.remove();
    if(!isCoachDashboardVisible()) return;
    if(typeof window.showCoach==='function'){
      try{ window.showCoach('dashboard'); }catch(e){ console.error('DCC legacy bridge dashboard:',e); }
    }
  }

  function loadPanelState(){
    const existing=[...document.scripts].find(s=>/coach-panel-state-v10\.js(?:\?|$)/.test(s.src||''));
    if(existing) return;
    const patch=document.createElement('script');
    patch.src='./coach-panel-state-v10.js?v=20260910-1918';
    patch.async=false;
    patch.dataset.dccPanelState=BUILD;
    patch.onerror=()=>console.error('DCC legacy bridge: no se pudo cargar coach-panel-state-v10.js');
    (document.head||document.documentElement).appendChild(patch);
  }

  function loadCurrentCoach(){
    document.getElementById('dcc-coach-final-v2-css')?.remove();
    loadPanelState();

    const current=[...document.scripts].find(s=>/coach-premium-v8\.js(?:\?|$)/.test(s.src||''));
    if(current){
      setTimeout(forceDashboard,60);
      setTimeout(forceDashboard,220);
      return;
    }

    const s=document.createElement('script');
    s.src='./coach-premium-v8.js?v=20260910-1817';
    s.async=false;
    s.dataset.dccLegacyBridge=BUILD;
    s.onload=()=>{
      loadPanelState();
      setTimeout(forceDashboard,20);
      setTimeout(forceDashboard,120);
      setTimeout(forceDashboard,400);
    };
    s.onerror=()=>console.error('DCC legacy bridge: no se pudo cargar coach-premium-v8.js');
    (document.head||document.documentElement).appendChild(s);
  }

  loadCurrentCoach();
  setTimeout(loadCurrentCoach,500);
  window.addEventListener('load',()=>setTimeout(loadCurrentCoach,80),{once:true});
  window.addEventListener('pageshow',()=>{
    setTimeout(loadCurrentCoach,30);
    setTimeout(forceDashboard,180);
  });
})();
