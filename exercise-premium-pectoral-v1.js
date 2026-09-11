/* DCC — imágenes de ejercicios estables: SOLO grupos musculares */
(function(){
  'use strict';
  if(window.__dccExerciseImageResetStableV2)return;
  window.__dccExerciseImageResetStableV2=true;

  const norm=v=>String(v||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim();
  const MAP={
    pectoral:'assets/muscles/pecho.png',pecho:'assets/muscles/pecho.png',
    espalda:'assets/muscles/espalda.png',dorsal:'assets/muscles/espalda.png',dorsales:'assets/muscles/espalda.png',
    hombro:'assets/muscles/hombros.png',hombros:'assets/muscles/hombros.png',deltoide:'assets/muscles/hombros.png',deltoides:'assets/muscles/hombros.png',
    biceps:'assets/muscles/biceps.png',triceps:'assets/muscles/triceps.png',
    cuadriceps:'assets/muscles/cuadriceps.png',
    femoral:'assets/muscles/isquios.png',femorales:'assets/muscles/isquios.png',isquio:'assets/muscles/isquios.png',isquios:'assets/muscles/isquios.png',isquiotibiales:'assets/muscles/isquios.png',
    gluteo:'assets/muscles/gluteos.png',gluteos:'assets/muscles/gluteos.png',
    gemelo:'assets/muscles/gemelos.png',gemelos:'assets/muscles/gemelos.png',pantorrilla:'assets/muscles/gemelos.png',pantorrillas:'assets/muscles/gemelos.png',
    core:'assets/muscles/core.png',abdomen:'assets/muscles/core.png',abdominal:'assets/muscles/core.png',abdominales:'assets/muscles/core.png',
    lumbar:'assets/muscles/lumbar-cuello.png',lumbares:'assets/muscles/lumbar-cuello.png',trapecio:'assets/muscles/lumbar-cuello.png',cuello:'assets/muscles/lumbar-cuello.png'
  };

  function muscleImage(value){
    const n=norm(value);
    if(!n)return '';
    for(const [key,path] of Object.entries(MAP))if(n.includes(key))return path;
    return '';
  }
  window.dccMuscleImage=muscleImage;

  function library(){return Array.isArray(window.exerciseLibraryFull)?window.exerciseLibraryFull:[];}

  function resolveMuscle(ex){
    for(const key of ['muscle','grupo','muscleGroup','group'])if(ex?.[key])return ex[key];
    const list=library();
    const id=String(ex?.id??ex?.exerciseId??ex?.exercise_id??'').trim();
    if(id){const hit=list.find(x=>String(x?.id??'')===id);if(hit?.muscle)return hit.muscle;}
    const name=norm(ex?.name??ex?.nombre??ex?.exerciseName??ex?.exercise);
    if(name){const hit=list.find(x=>norm(x?.name)===name);if(hit?.muscle)return hit.muscle;}
    return '';
  }

  function clean(ex){
    if(!ex||typeof ex!=='object')return;
    const image=muscleImage(resolveMuscle(ex));
    ex.image=image;
    ex.imageStart=image;
    ex.imagePeak=image;
    ex.thumbnail=image;
    ex.preview=image;
    ex.illustration=image;
    ex.ilustracion=image;
    delete ex.dccPremiumApproved;
  }

  function apply(){
    library().forEach(clean);
    const routines=(()=>{try{return data?.routines}catch(_){return window.data?.routines}})();
    if(routines&&typeof routines==='object')Object.values(routines).forEach(raw=>{
      const days=Array.isArray(raw)?raw:Array.isArray(raw?.routine)?raw.routine:[];
      days.forEach(day=>(Array.isArray(day?.exercises)?day.exercises:[]).forEach(ex=>{
        if(!ex.muscle&&day?.muscle)ex.muscle=day.muscle;
        clean(ex);
      }));
    });
    if(window.activeWorkout?.exercises)window.activeWorkout.exercises.forEach(clean);
    window.dispatchEvent(new CustomEvent('dcc:exercise-images-reset',{detail:{mode:'muscle-groups-only'}}));
  }

  window.addEventListener('dcc:exercise-library-ready',apply);
  document.addEventListener('DOMContentLoaded',apply);
  apply();
  setTimeout(apply,300);
  setTimeout(apply,1200);
})();
