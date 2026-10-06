/* DCC — alternativas automáticas de ejercicio durante la sesión.
   No modifica la rutina persistida: solo window.activeWorkout.
*/
(function(){
'use strict';
const BUILD='20261006-auto-alternatives-v1';
if(window.__dccWorkoutAlternatives===BUILD)return;
window.__dccWorkoutAlternatives=BUILD;

let libraryPromise=null;
const norm=v=>String(v||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
const notify=m=>{try{window.toast?.(m)}catch(_){}};

function equipmentClass(v){
  const s=norm(v);
  if(s.includes('maquina'))return'machine';
  if(s.includes('polea'))return'cable';
  if(s.includes('mancuerna'))return'dumbbell';
  if(s.includes('multipower')||s.includes('smith'))return'smith';
  if(s.includes('barra'))return'barbell';
  if(s.includes('peso corporal')||s.includes('corporal'))return'body';
  if(s.includes('banda')||s.includes('elast'))return'band';
  return s||'other';
}
function rankEquipment(cls){
  return ({body:0,dumbbell:1,barbell:2,band:3,smith:4,cable:5,machine:7,other:6})[cls]??6;
}
async function library(){
  if(libraryPromise)return libraryPromise;
  libraryPromise=fetch('/entrenamientos/ejercicios.json',{cache:'no-store'})
    .then(r=>{if(!r.ok)throw new Error('Biblioteca no disponible');return r.json()})
    .then(j=>Array.isArray(j?.ejercicios)?j.ejercicios:[])
    .catch(e=>{console.error('DCC alternativas:',e);return[]});
  return libraryPromise;
}
function pristine(workout,exercise){
  if(Array.isArray(workout?.sets)&&workout.sets.length)return false;
  if(workout?.restUntil&&workout.restUntil>Date.now())return false;
  if(exercise?.restPause){
    const s=workout?.restPauseState?.[String(workout.currentExercise)];
    if((Number(s?.seriesCompleted)||0)>0||(Number(s?.block)||0)>0)return false;
  }
  if(exercise?.supersetId){
    const members=(workout.exercises||[]).map((ex,index)=>({ex,index})).filter(x=>x.ex?.supersetId===exercise.supersetId);
    const first=Math.min(...members.map(x=>x.index));
    if(workout.currentExercise!==first)return false;
    const s=workout?.supersetState?.[exercise.supersetId];
    if((Number(s?.round)||1)>1||Object.keys(s?.entries||{}).length)return false;
  }
  return true;
}
function chooseCandidate(items,source,exercise,workout){
  const tried=new Set((exercise?.dccAlternativeTried||[]).map(String));
  const used=new Set((workout?.exercises||[]).map(x=>String(x?.libraryId||x?.id||'')));
  const sourceClass=equipmentClass(source?.equipo);
  const group=norm(source?.grupo),pattern=norm(source?.patron);
  const base=items
    .filter(x=>x&&String(x.id)!==String(source.id))
    .filter(x=>norm(x.grupo)===group)
    .filter(x=>equipmentClass(x.equipo)!==sourceClass)
    .filter(x=>!tried.has(String(x.id))&&!used.has(String(x.id)));
  let candidates=base.filter(x=>norm(x.patron)===pattern);
  if(!candidates.length&&group==='cuadriceps'&&(pattern==='prensa'||pattern==='extension_rodilla')){
    candidates=base.filter(x=>norm(x.patron)==='sentadilla');
  }
  return candidates
    .sort((a,b)=>rankEquipment(equipmentClass(a.equipo))-rankEquipment(equipmentClass(b.equipo))||String(a.nombre||'').localeCompare(String(b.nombre||''),'es'))[0]||null;
}
window.dccUseAutomaticAlternative=async function(){
  const workout=window.activeWorkout;
  const idx=Number(workout?.currentExercise)||0;
  const exercise=workout?.exercises?.[idx];
  if(!workout||!exercise)return;
  if(!pristine(workout,exercise)){
    notify('La alternativa solo puede cambiarse antes de empezar este ejercicio');
    return;
  }
  const items=await library();
  const originalId=String(exercise.dccAlternativeOriginalLibraryId||exercise.libraryId||exercise.id||'');
  const source=items.find(x=>String(x?.id||'')===originalId);
  if(!source){
    notify('Este ejercicio no tiene alternativa automática configurada');
    return;
  }
  const candidate=chooseCandidate(items,source,exercise,workout);
  if(!candidate){
    notify('No hay otra alternativa equivalente disponible');
    return;
  }
  const tried=[...(exercise.dccAlternativeTried||[]),String(candidate.id)];
  const replacement={
    ...exercise,
    id:String(candidate.id),
    libraryId:String(candidate.id),
    name:String(candidate.nombre||exercise.name||'Ejercicio'),
    muscle:String(candidate.grupo||exercise.muscle||''),
    dccAlternativeOf:String(exercise.dccAlternativeOf||source.nombre||exercise.name||'Ejercicio'),
    dccAlternativeOriginalLibraryId:originalId,
    dccAlternativeTried:tried,
    dccAlternativeReason:'equipment_unavailable'
  };
  delete replacement.videoUrl;delete replacement.video_url;delete replacement.video;
  workout.exercises[idx]=replacement;
  window.renderWorkoutSession?.();
  notify('Alternativa automática: '+replacement.name);
};
})();