/* DCC — biblioteca local de ejercicios + complementos visuales cliente */
(function(){
  'use strict';
  const BUILD='20260914-exercise-library-v4';
  if(window.__dccExerciseLibrary===BUILD)return;
  window.__dccExerciseLibrary=BUILD;

  const realFetch=window.fetch.bind(window);
  const legacyReady=window.exerciseLibraryReady;
  const illustrated=new Set([
    'press-banca-barra','jalon-pecho-ancho','remo-sentado-polea-neutro','extension-triceps-cuerda','press-hombro-maquina','prensa-45','extension-cuadriceps','hip-thrust-maquina','press-banca-mancuernas','press-inclinado-barra','press-inclinado-mancuernas','press-pecho-maquina','press-inclinado-maquina','press-convergente-maquina','aperturas-pec-deck','cruces-polea-media','cruces-polea-alta','cruces-polea-baja','flexiones','press-declinado-maquina','press-pecho-iso-lateral','press-inclinado-iso-lateral','press-banca-multipower','press-inclinado-multipower','aperturas-polea-banco','extension-triceps-barra','extension-triceps-unilateral','extension-triceps-sobre-cabeza','fondos-maquina-asistida','press-triceps-maquina','press-cerrado-barra','extension-triceps-tumbado-ez','fondos-maquina','extension-triceps-maquina','extension-triceps-polea-agarre-inverso','extension-triceps-sobre-cabeza-unilateral'
  ]);

  function mapExercise(ex){
    const image=illustrated.has(ex.id)&&ex.ilustracion?`./entrenamientos/${ex.ilustracion}`:'';
    return {
      id:ex.id,name:ex.nombre||ex.id,muscle:ex.grupo==='Espalda'?'Dorsal':(ex.grupo||''),secondaryMuscles:[],
      equipment:ex.equipo||'',image,imageStart:image,imagePeak:image,videoOptional:'',aliases:[],description:'',instructions:[],tips:[],
      difficulty:'',category:ex.patron||'',variationGroup:'',isUnilateral:/unilateral/i.test((ex.id||'')+' '+(ex.nombre||'')),
      isBodyweight:/peso corporal/i.test(ex.equipo||''),source:'DCC'
    };
  }

  window.exerciseLibraryReady=Promise.resolve(legacyReady)
    .catch(()=>[])
    .then(()=>realFetch('./entrenamientos/ejercicios.json',{cache:'no-store'}))
    .then(response=>{if(!response.ok)throw new Error('No se pudo cargar la biblioteca DCC: HTTP '+response.status);return response.json()})
    .then(payload=>{
      const records=Array.isArray(payload?.ejercicios)?payload.ejercicios:[];
      const target=Array.isArray(window.exerciseLibraryFull)?window.exerciseLibraryFull:[];
      target.length=0;
      records.forEach(ex=>target.push(mapExercise(ex)));
      window.exerciseLibraryFull=target;
      window.dispatchEvent(new CustomEvent('dcc:exercise-library-ready',{detail:{count:target.length}}));
      return target;
    })
    .catch(error=>{console.error('DCC — error cargando biblioteca propia:',error);window.exerciseLibraryFull=[];return[]});

  function loadOnce(src,key){
    const base=src.split('?')[0].replace('./','');
    if([...document.scripts].some(s=>(s.src||'').includes(base)))return;
    const script=document.createElement('script');
    script.src=src;script.async=false;script.dataset[key]='1';
    script.onerror=()=>console.error('DCC: no se pudo cargar '+base);
    (document.head||document.documentElement).appendChild(script);
  }

  /* Complementos visuales aún vigentes. La lógica de negocio vive en sus autoridades específicas. */
  loadOnce('./training-inline-fix.js?v=20260914-ui-v3','dccTrainingInline');
  loadOnce('./training-days-compact-v3.js?v=20260910-1','dccTrainingDaysCompact');
  loadOnce('./training-routine-plate-v1.js?v=20260910-1','dccTrainingRoutinePlate');
  loadOnce('./progress-premium-v5.js?v=20260908-9','dccCoachProgressPremium');
  loadOnce('./client-progress-premium-v6.js?v=20260910-5','dccClientProgressPremium');
  loadOnce('./client-home-premium-v4.js?v=20260910-2','dccClientHomePremium');
  loadOnce('./client-metrics-sync-v10.js?v=20260914-history-v1','dccClientMetricsSync');
  loadOnce('./client-nutrition-premium-v2.js?v=20260910-1','dccClientNutritionPremium');
  loadOnce('./progress-metrics-unify.js?v=20260908-2','dccProgressMetricsUnify');
  loadOnce('./checkin-premium.js?v=20260908-2','dccCoachCheckinPremium');
  loadOnce('./nav-premium-global.js?v=20260908-1','dccPremiumNav');
  loadOnce('./clients-search-final-fix.js?v=20260914-static-v1','dccClientsSearch');
  loadOnce('./workout-session-premium-v3.js?v=20260910-3','dccWorkoutSessionPremium');
})();
