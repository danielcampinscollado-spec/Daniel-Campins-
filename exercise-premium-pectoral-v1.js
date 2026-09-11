/* DCC — reset global de ilustraciones: solo grupos musculares */
(function(){
  'use strict';
  if(window.__dccExerciseImageResetV1)return;
  window.__dccExerciseImageResetV1=true;

  const normalize=v=>String(v||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();

  function muscleImage(muscle){
    try{
      if(typeof window.recognizeMuscleImage==='function'){
        return window.recognizeMuscleImage(muscle)||'';
      }
    }catch(_){}
    const n=normalize(muscle);
    const map={
      'pectoral':'pecho.png',
      'pecho':'pecho.png',
      'dorsal':'espalda.png',
      'espalda':'espalda.png',
      'hombros':'hombros.png',
      'hombro':'hombros.png',
      'biceps':'biceps.png',
      'triceps':'triceps.png',
      'cuadriceps':'cuadriceps.png',
      'femoral':'femoral.png',
      'isquiotibiales':'femoral.png',
      'gluteos':'gluteos.png',
      'gluteo':'gluteos.png',
      'aductores':'aductores.png',
      'gemelos':'gemelos.png',
      'trapecio':'lumbar-cuello.png',
      'antebrazos':'antebrazos.png',
      'lumbar':'lumbar-cuello.png',
      'core':'abdominales.png',
      'abdominales':'abdominales.png'
    };
    return map[n]||'';
  }

  function resolveMuscle(ex){
    if(ex?.muscle)return ex.muscle;
    if(ex?.grupo)return ex.grupo;
    if(ex?.muscleGroup)return ex.muscleGroup;
    const list=Array.isArray(window.exerciseLibraryFull)?window.exerciseLibraryFull:[];
    const id=String(ex?.id||ex?.exerciseId||ex?.exercise_id||'');
    if(id){
      const hit=list.find(x=>String(x?.id||'')===id);
      if(hit?.muscle)return hit.muscle;
    }
    const name=normalize(ex?.name||ex?.nombre||ex?.exerciseName||ex?.exercise);
    if(name){
      const hit=list.find(x=>normalize(x?.name)===name);
      if(hit?.muscle)return hit.muscle;
    }
    return '';
  }

  function cleanExercise(ex){
    if(!ex||typeof ex!=='object')return false;
    const image=muscleImage(resolveMuscle(ex));
    ex.image=image;
    ex.imageStart=image;
    ex.imagePeak=image;
    ex.thumbnail=image;
    ex.preview=image;
    ex.illustration=image;
    ex.ilustracion=image;
    delete ex.dccPremiumApproved;
    return true;
  }

  function cleanLibrary(){
    const list=window.exerciseLibraryFull;
    if(Array.isArray(list))list.forEach(cleanExercise);
  }

  function cleanRoutines(){
    const routines=window.data?.routines;
    if(!routines||typeof routines!=='object')return;
    Object.values(routines).forEach(raw=>{
      const days=Array.isArray(raw)?raw:Array.isArray(raw?.routine)?raw.routine:[];
      days.forEach(day=>(day?.exercises||[]).forEach(cleanExercise));
    });
  }

  function replaceVisibleImages(){
    document.querySelectorAll('img').forEach(img=>{
      const card=img.closest('.exercise,.dct-exercise,.dcc-library-item,.dcc-exercise-card,[data-exercise-id]');
      if(!card)return;
      const text=card.textContent||'';
      const list=Array.isArray(window.exerciseLibraryFull)?window.exerciseLibraryFull:[];
      const hit=list.find(ex=>text.includes(ex?.name||'') && ex?.name);
      if(!hit)return;
      const src=muscleImage(hit.muscle);
      if(src && !img.src.endsWith(src))img.src=src;
    });
  }

  function apply(){
    cleanLibrary();
    cleanRoutines();
    replaceVisibleImages();
    window.dispatchEvent(new CustomEvent('dcc:exercise-images-reset',{detail:{mode:'muscle-groups-only'}}));
  }

  window.addEventListener('dcc:exercise-library-ready',apply);
  window.addEventListener('dcc:exercise-guidance-ready',apply);
  document.addEventListener('DOMContentLoaded',apply);

  const observer=new MutationObserver(()=>replaceVisibleImages());
  observer.observe(document.documentElement,{childList:true,subtree:true});

  apply();
  setTimeout(apply,250);
  setTimeout(apply,1000);
})();
