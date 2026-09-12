/* DCC legacy bridge — fuerza cualquier HTML antiguo del panel hacia el dashboard actual */
(function(){
  'use strict';
  const BUILD='20260912-0954-clients-nav';
  window.__dccLegacyCoachBridge=BUILD;
  function isCoachDashboardVisible(){const main=document.getElementById('coach-main');if(!main)return false;const text=(main.textContent||'').toUpperCase();return window.currentScreen==='dashboard'||text.includes('CADA CLIENTE ES UN PROCESO')||text.includes('RESUMEN GENERAL')||text.includes('PANEL DE ENTRENADOR')||text.includes('BUENOS DÍAS')||text.includes('BUENAS TARDES')||text.includes('BUENAS NOCHES')}
  function forceDashboard(){document.getElementById('dcc-coach-final-v2-css')?.remove();if(!isCoachDashboardVisible())return;if(typeof window.showCoach==='function'){try{window.showCoach('dashboard')}catch(e){console.error('DCC legacy bridge dashboard:',e)}}}
  function add(src,key,onload){const base=src.split('?')[0].replace('./','');const existing=[...document.scripts].find(s=>(s.src||'').includes(base));if(existing){onload&&onload();return existing}const x=document.createElement('script');x.src=src;x.async=false;x.dataset[key]=BUILD;x.onload=()=>onload&&onload();x.onerror=()=>console.error('DCC legacy bridge: no se pudo cargar '+base);(document.head||document.documentElement).appendChild(x);return x}
  function loadPanelState(){add('./coach-panel-state-v10.js?v=20260910-1918','dccPanelState')}
  function loadCoachUI(){add('./coach-ui-v11.js?v=20260910-1932','dccCoachUi')}
  function loadDashboardFix(){add('./coach-dashboard-light-fix.js?v=20260912-0941','dccDashboardLightFix')}
  function loadClientsFix(){add('./coach-clients-light-fix-v1.js?v=20260912-0954','dccClientsLightFix')}
  function loadCurrentCoach(){document.getElementById('dcc-coach-final-v2-css')?.remove();loadPanelState();loadDashboardFix();loadClientsFix();const current=[...document.scripts].find(s=>/coach-premium-v8\.js(?:\?|$)/.test(s.src||''));if(current){loadCoachUI();setTimeout(forceDashboard,60);setTimeout(forceDashboard,220);return}add('./coach-premium-v8.js?v=20260910-1817','dccLegacyBridge',()=>{loadPanelState();loadCoachUI();loadDashboardFix();loadClientsFix();setTimeout(forceDashboard,20);setTimeout(forceDashboard,120);setTimeout(forceDashboard,400)})}
  loadCurrentCoach();setTimeout(loadCurrentCoach,500);window.addEventListener('load',()=>setTimeout(loadCurrentCoach,80),{once:true});window.addEventListener('pageshow',()=>{setTimeout(loadCurrentCoach,30);setTimeout(forceDashboard,180)});
})();
