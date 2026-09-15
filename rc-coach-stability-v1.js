/* DCC — estabilidad RC reducida: sincroniza datos solo si Panel ya está activo. */
(function(){
'use strict';
const BUILD='20260915-rc-coach-stability-v2-data-only';
if(window.__dccRcCoachStability===BUILD)return;window.__dccRcCoachStability=BUILD;
let running=false;
async function syncDashboard(){if(running||window.currentApp!=='coach'||window.currentScreen!=='dashboard')return;const fn=window.dccSyncClientsFromServer;if(typeof fn!=='function')return;running=true;try{await fn({render:false})}catch(e){console.warn('DCC dashboard data sync:',e)}finally{running=false}}
window.addEventListener('pageshow',syncDashboard);
})();
