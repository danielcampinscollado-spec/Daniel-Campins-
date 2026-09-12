/* DCC legacy bridge — fuerza cualquier HTML antiguo del panel hacia el dashboard actual */
(function(){
  'use strict';

  const BUILD='20260912-0946-clients-fix';
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

  function loadCoachUI(){
    const existing=[...document.scripts].find(s=>/coach-ui-v11\.js(?:\?|$)/.test(s.src||''));
    if(existing) return;
    const ui=document.createElement('script');
    ui.src='./coach-ui-v11.js?v=20260910-1932';
    ui.async=false;
    ui.dataset.dccCoachUi=BUILD;
    ui.onerror=()=>console.error('DCC legacy bridge: no se pudo cargar coach-ui-v11.js');
    (document.head||document.documentElement).appendChild(ui);
  }

  function loadDashboardFix(){
    const existing=[...document.scripts].find(s=>/coach-dashboard-light-fix\.js(?:\?|$)/.test(s.src||''));
    if(existing) return;
    const fix=document.createElement('script');
    fix.src='./coach-dashboard-light-fix.js?v=20260912-0941';
    fix.async=false;
    fix.dataset.dccDashboardLightFix=BUILD;
    fix.onerror=()=>console.error('DCC legacy bridge: no se pudo cargar coach-dashboard-light-fix.js');
    (document.head||document.documentElement).appendChild(fix);
  }

  function loadClientsFix(){
    const existing=[...document.scripts].find(s=>/coach-clients-light-fix-v1\.js(?:\?|$)/.test(s.src||''));
    if(existing) return;
    const fix=document.createElement('script');
    fix.src='./coach-clients-light-fix-v1.js?v=20260912-0946';
    fix.async=false;
    fix.dataset.dccClientsLightFix=BUILD;
    fix.onerror=()=>console.error('DCC legacy bridge: no se pudo cargar coach-clients-light-fix-v1.js');
    (document.head||document.documentElement).appendChild(fix);
  }

  function loadCurrentCoach(){
    document.getElementById('dcc-coach-final-v2-css')?.remove();
    loadPanelState();
    loadDashboardFix();
    loadClientsFix();

    const current=[...document.scripts].find(s=>/coach-premium-v8\.js(?:\?|$)/.test(s.src||''));
    if(current){
      loadCoachUI();
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
      loadCoachUI();
      loadDashboardFix();
      loadClientsFix();
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
