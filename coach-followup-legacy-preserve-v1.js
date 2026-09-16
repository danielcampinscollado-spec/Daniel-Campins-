/* DCC — conserva notas locales antiguas hasta migrarlas a Supabase */
(function(){
'use strict';
const BUILD='20260916-followup-legacy-preserve-v1';
if(window.__dccFollowupLegacyPreserve===BUILD)return;
window.__dccFollowupLegacyPreserve=BUILD;
function dataRef(){try{return typeof data!=='undefined'?data:(window.data||{})}catch(_){return window.data||{}}}
function preserve(){
  const clients=dataRef().clients||[];
  clients.forEach(cl=>{
    if(Array.isArray(cl?.coachNotes)&&cl.coachNotes.length&&Array.isArray(cl.coach_notes)&&cl.coach_notes.length===0){
      try{delete cl.coach_notes}catch(_){cl.coach_notes=undefined}
    }
  });
}
preserve();
document.addEventListener('dcc:coach-screen',preserve);
document.addEventListener('dcc:support-ready',preserve);
window.addEventListener('pageshow',preserve);
})();
