/* DCC — continuidad del editor: músculos -> ejercicios y posición estable */
(function(){
'use strict';
const BUILD='20260915-coach-editor-flow-v1';
if(window.__dccCoachEditorFlow===BUILD)return;
window.__dccCoachEditorFlow=BUILD;

let lockedY=null, lockUntil=0, cancelled=false, raf=0;
const activeEditor=()=>{
  if(window.__dccTrainingEdit)return true;
  return [...document.querySelectorAll('#coach-main .dcc-ca-tab.active')]
    .some(b=>/Alimentaci[oó]n|Entrenamiento/i.test(b.textContent||''));
};
function lock(y,ms=650){
  if(!Number.isFinite(y)||y<0)return;
  lockedY=y;lockUntil=Date.now()+ms;cancelled=false;
  restore();
  [40,110,220,420,620].forEach(t=>setTimeout(restore,t));
}
function restore(){
  if(cancelled||lockedY===null||Date.now()>lockUntil)return;
  if(Math.abs((window.scrollY||0)-lockedY)>3)window.scrollTo({top:lockedY,left:0,behavior:'auto'});
}
function cancel(){cancelled=true;lockedY=null;lockUntil=0}
window.dccPreserveCoachEditorPosition=(y,ms)=>lock(Number.isFinite(y)?y:(window.scrollY||0),ms||650);

// En los editores, los botones pueden reconstruir el panel. Conservamos el punto visual.
document.addEventListener('pointerdown',e=>{
  const b=e.target?.closest?.('#coach-main button');
  if(!b||!activeEditor())return;
  if(b.closest('.dcc-ca-tabs,.dcc-bottom-nav,.dcc-coach-bottom-nav,[data-dcc-bottom-nav]'))return;
  lock(window.scrollY||0,650);
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
    lock(y,900);
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

// El selector de Día 1 / Día 2 / Día 3 no debe lanzar la pantalla hacia arriba.
function installDayPosition(){
  const base=window.dccTrainingWizardDay;
  if(typeof base!=='function'||base.__dccKeepPosition)return false;
  const wrapped=function(){const y=window.scrollY||0;const r=base.apply(this,arguments);lock(y,800);return r};
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