/* DCC — bootstrap de datos del entrenador. Nunca decide navegación. */
(function(){
'use strict';
const BUILD='20260926-coach-dashboard-bootstrap-v3-hydrated-panel';
if(window.__dccCoachDashboardBootstrap===BUILD)return;window.__dccCoachDashboardBootstrap=BUILD;
let running=false,done=false;
async function sync(){if(running||done||window.__dccSecureRole!=='coach')return;const fn=window.dccCriticalSyncClients||window.dccSyncClientsFromServer;if(typeof fn!=='function')return;running=true;try{const r=await fn(false);if(r!==false){done=true;const coachVisible=document.getElementById('coach')?.style.display!=='none',main=document.getElementById('coach-main');if(window.__dccSecureRole==='coach'&&coachVisible&&main?.classList.contains('dcc-p9-dashboard')&&typeof window.showCoach==='function')window.showCoach('dashboard')}}catch(e){console.warn('DCC coach bootstrap sync:',e)}finally{running=false}}
[0,250,800].forEach(ms=>setTimeout(sync,ms));
window.addEventListener('pageshow',()=>{if(!done)sync()});
})();
