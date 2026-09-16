/* DCC — migración puntual de notas locales antiguas. Sin observadores persistentes. */
(function(){
'use strict';
const BUILD='20260916-followup-legacy-preserve-v2-once';
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
/* Es una compatibilidad de migración: basta ejecutarla una vez por sesión. */
preserve();
})();
