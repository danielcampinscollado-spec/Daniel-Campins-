/* DCC — interacción móvil estable del editor de rutina */
(function(){
'use strict';
const BUILD='20260915-training-interaction-fix-v2-compact';
if(window.__dccTrainingInteractionFix===BUILD)return;window.__dccTrainingInteractionFix=BUILD;

function cid(){return String(window.selectedClient??'')}
function routineDays(){const r=window.data?.routines?.[cid()];return Array.isArray(r)?r:Array.isArray(r?.routine)?r.routine:[]}
function muscles(day){const raw=Array.isArray(day?.muscles)?day.muscles:String(day?.muscle||'').split(/[·,]/);return raw.map(x=>String(x||'').trim()).filter(x=>x&&!/^sin grupos/i.test(x))}

document.addEventListener('click',e=>{
  const save=e.target?.closest?.('.dcc-stable-muscle-save');
  if(!save)return;
  const di=Math.max(0,Number(window.__dccTrainingOpen)||0);
  const id=cid();
  setTimeout(()=>{
    const d=routineDays()[di];if(!d||!muscles(d).length)return;
    const open=window.dccOpenExercisePickerV2||window.dccOpenExerciseModal;
    if(typeof open==='function')open(id,di);
  },120);
},true);

const style=document.createElement('style');style.id='dcc-training-interaction-fix-css';style.textContent=`
  #coach-main .dcc-tr-days{padding-bottom:18px!important}
  #coach-main .dcc-tdw button,#coach-main .dcc-tr-inline-trigger,#coach-main [data-dcc-stable-action]{pointer-events:auto!important;touch-action:manipulation!important}
`;(document.head||document.documentElement).appendChild(style);
})();