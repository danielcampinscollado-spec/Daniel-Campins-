/* DCC — continuidad del editor: músculos -> ejercicios y posición estable */
(function(){
'use strict';
const BUILD='20260915-coach-editor-flow-v2-stable-position';
if(window.__dccCoachEditorFlow===BUILD)return;
window.__dccCoachEditorFlow=BUILD;

let lockedY=null, lockUntil=0, cancelled=false, raf=0;
const activeEditor=()=>{
  if(window.__dccTrainingEdit)return true;
  return [...document.querySelectorAll('#coach-main .dcc-ca-tab.active')]
    .some(b=>/Alimentaci[oó]n|Entrenamiento/i.test(b.textContent||''));
};
function lock(y,ms=1700){
  if(!Number.isFinite(y)||y<0)return;
  lockedY=y;lockUntil=Date.now()+ms;cancelled=false;
  restore();
  [20,50,100,180,300,480,700,950,1250,1600].forEach(t=>setTimeout(restore,t));
}
function restore(){
  if(cancelled||lockedY===null||Date.now()>lockUntil)return;
  const current=window.scrollY||0;
  if(Math.abs(current-lockedY)>2)window.scrollTo({top:lockedY,left:0,behavior:'auto'});
}
function cancel(){cancelled=true;lockedY=null;lockUntil=0}
window.dccPreserveCoachEditorPosition=(y,ms)=>lock(Number.isFinite(y)?y:(window.scrollY||0),ms||1700);

// Cualquier acción dentro de los editores puede reconstruir el panel: mantenemos exactamente el punto visual.
document.addEventListener('pointerdown',e=>{
  const control=e.target?.closest?.('#coach-main button,#coach-main input,#coach-main select,#coach-main textarea');
  if(!control||!activeEditor())return;
  if(control.closest('.dcc-ca-tabs,.dcc-bottom-nav,.dcc-coach-bottom-nav,[data-dcc-bottom-nav]'))return;
  lock(window.scrollY||0,1700);
},true);
document.addEventListener('touchmove',cancel,{passive:true});
document.addEventListener('wheel',cancel,{passive:true});
new MutationObserver(()=>{
  if(lockedY===null||cancelled||Date.now()>lockUntil)return;
  if(raf)return;raf=requestAnimationFrame(()=>{raf=0;restore()});
}).observe(document.documentElement,{childList:true,subtree:true});

function installMuscleContinuation(){
  const base=window.dccSaveRoutineMuscles;
  if(typeof base!=='function'||base.__dccContinueToExercises)return false;
  const wrapped=function(id,di){
    const y=window.scrollY||0;
    const result=base.apply(this,arguments);
    try{window.dccMarkTrainingDraftDirty?.();window.saveData?.()}catch(err){console.error(err)}
    lock(y,1800);
    const open=()=>{
      const fn=window.dccOpenExercisePickerV2||window.dccOpenExerciseModal;
      if(typeof fn==='function')fn(String(id),Number(di)||0);
    };
    requestAnimationFrame(()=>requestAnimationFrame(open));
    return result;
  };
  wrapped.__dccContinueToExercises=true;wrapped.__base=base;
  window.dccSaveRoutineMuscles=wrapped;
  return true;
}
function installDayPosition(){
  const base=window.dccTrainingWizardDay;
  if(typeof base!=='function'||base.__dccKeepPosition)return false;
  const wrapped=function(){const y=window.scrollY||0;const r=base.apply(this,arguments);lock(y,1800);return r};
  wrapped.__dccKeepPosition=true;wrapped.__base=base;window.dccTrainingWizardDay=wrapped;return true;
}
let tries=0;
const timer=setInterval(()=>{
  tries++;
  const a=installMuscleContinuation(),b=installDayPosition();
  if((a||window.dccSaveRoutineMuscles?.__dccContinueToExercises)&&(b||window.dccTrainingWizardDay?.__dccKeepPosition))clearInterval(timer);
  if(tries>160)clearInterval(timer);
},50);
installMuscleContinuation();installDayPosition();
})();