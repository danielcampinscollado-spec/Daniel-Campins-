/* DCC — consistencia de datos de clientes. Sin observers globales y sin navegación. */
(function(){
'use strict';
const BUILD='20260915-coach-client-consistency-v2-data-only';
if(window.__dccCoachClientFinalConsistency===BUILD)return;window.__dccCoachClientFinalConsistency=BUILD;
let running=false,last=0;
async function sync(force=false){if(running||window.__dccSecureRole!=='coach')return;const now=Date.now();if(!force&&now-last<3000)return;const fn=window.dccCriticalSyncClients||window.dccSyncClientsFromServer;if(typeof fn!=='function')return;running=true;try{await fn(false);last=Date.now()}catch(e){console.warn('DCC client consistency sync:',e)}finally{running=false}}
document.addEventListener('visibilitychange',()=>{if(!document.hidden)sync(false)});
window.addEventListener('pageshow',()=>sync(false));
})();
