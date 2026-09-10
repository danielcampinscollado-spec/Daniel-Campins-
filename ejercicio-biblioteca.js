/* DCC — Biblioteca propia premium de ejercicios */
(function(){
  const realFetch=window.fetch.bind(window);
  window.fetch=function(input,init){
    const url=String(input||'');
    if(url.includes('exercise-dataset.com/exercises.json')){
      return Promise.resolve(new Response(JSON.stringify({exercises:[]}),{status:200,headers:{'Content-Type':'application/json'}}));
    }
    return realFetch(input,init);
  };

  document.write('<script src="./entrenamientos/runtime-compat.js"><\/script>');
  window.fetch=realFetch;

  if(!document.getElementById('dcc-client-metrics-stable')){
    const style=document.createElement('style');
    style.id='dcc-client-metrics-stable';
    style.textContent=`
      html body #coach-main.dcc-ca .dcc-ca-metrics{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:10px!important;align-items:stretch!important}
      html body #coach-main.dcc-ca .dcc-ca-metrics .dcc-ca-metric{position:relative!important;min-height:126px!important;height:auto!important;padding:15px 14px 11px 58px!important;overflow:hidden!important;border:1px solid #2b343d!important;border-radius:20px!important;background:radial-gradient(circle at 82% 8%,rgba(242,200,95,.08),transparent 34%),linear-gradient(145deg,#11171d,#080c0f)!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.025)!important}
      html body #coach-main.dcc-ca .dcc-ca-metrics .dcc-ca-metric::before{content:'';position:absolute;left:12px;top:13px;width:34px;height:34px;border-radius:11px;border:1px solid rgba(242,200,95,.32);background-color:rgba(242,200,95,.10);background-repeat:no-repeat;background-position:center;background-size:19px 19px}
      html body #coach-main.dcc-ca .dcc-ca-metrics .dcc-ca-metric:nth-child(1)::before{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23f2c85f' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M8 8.5V6a4 4 0 0 1 8 0v2.5'/%3E%3Cpath d='M7 8.5h10l2.3 11.5H4.7L7 8.5Z'/%3E%3C/svg%3E")!important}
      html body #coach-main.dcc-ca .dcc-ca-metrics .dcc-ca-metric:nth-child(2)::before{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23f2c85f' stroke-width='1.8' stroke-linecap='round'%3E%3Ccircle cx='7.5' cy='7.5' r='2.5'/%3E%3Ccircle cx='16.5' cy='16.5' r='2.5'/%3E%3Cpath d='M18 5 6 19'/%3E%3C/svg%3E")!important}
      html body #coach-main.dcc-ca .dcc-ca-metrics .dcc-ca-metric:nth-child(3)::before{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23f2c85f' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3.5' y='5.5' width='17' height='15' rx='2.5'/%3E%3Cpath d='M8 3.5v4M16 3.5v4M3.5 10h17'/%3E%3C/svg%3E")!important}
      html body #coach-main.dcc-ca .dcc-ca-metrics .dcc-ca-metric small{display:block!important;color:#9ca5af!important;font-size:10px!important}
      html body #coach-main.dcc-ca .dcc-ca-metrics .dcc-ca-metric b{display:block!important;margin-top:4px!important;color:#f7f5f0!important;font-size:20px!important;line-height:1.05!important}
      html body #coach-main.dcc-ca .dcc-ca-metrics .dcc-ca-metric .dcc-ca-trend{display:block!important;min-height:24px!important;margin-top:7px!important;color:#9aa4af!important;font-size:9px!important;line-height:1.35!important}
      html body #coach-main.dcc-ca .dcc-ca-metrics .dcc-ca-metric .dcc-ca-trend.good{color:#55d9a0!important}
      html body #coach-main.dcc-ca .dcc-ca-metrics .dcc-ca-metric .dcc-ca-trend.bad{color:#ff656d!important}
      @media(max-width:650px){
        html body #coach-main.dcc-ca .dcc-ca-metrics{gap:7px!important}
        html body #coach-main.dcc-ca .dcc-ca-metrics .dcc-ca-metric{min-height:118px!important;padding:12px 9px 9px 10px!important}
        html body #coach-main.dcc-ca .dcc-ca-metrics .dcc-ca-metric::before{position:static!important;display:block!important;width:28px!important;height:28px!important;margin-bottom:7px!important;border-radius:9px!important;background-size:16px 16px!important}
        html body #coach-main.dcc-ca .dcc-ca-metrics .dcc-ca-metric b{font-size:16px!important}
        html body #coach-main.dcc-ca .dcc-ca-metrics .dcc-ca-metric .dcc-ca-trend{font-size:8px!important;min-height:22px!important}
      }
    `;
    document.head.appendChild(style);
  }

  const legacyReady=window.exerciseLibraryReady;
  const illustrated=new Set([
    'press-banca-barra','jalon-pecho-ancho','remo-sentado-polea-neutro','extension-triceps-cuerda','press-hombro-maquina','prensa-45','extension-cuadriceps','hip-thrust-maquina','press-banca-mancuernas','press-inclinado-barra','press-inclinado-mancuernas','press-pecho-maquina','press-inclinado-maquina','press-convergente-maquina','aperturas-pec-deck','cruces-polea-media','cruces-polea-alta','cruces-polea-baja','flexiones','press-declinado-maquina','press-pecho-iso-lateral','press-inclinado-iso-lateral','press-banca-multipower','press-inclinado-multipower','aperturas-polea-banco','extension-triceps-barra','extension-triceps-unilateral','extension-triceps-sobre-cabeza','fondos-maquina-asistida','press-triceps-maquina','press-cerrado-barra','extension-triceps-tumbado-ez','fondos-maquina','extension-triceps-maquina','extension-triceps-polea-agarre-inverso','extension-triceps-sobre-cabeza-unilateral'
  ]);
  const mapMuscle=group=>group==='Espalda'?'Dorsal':group;
  const mapExercise=ex=>{
    const image=illustrated.has(ex.id)&&ex.ilustracion?`./entrenamientos/${ex.ilustracion}`:'';
    return{id:ex.id,name:ex.nombre||ex.id,muscle:mapMuscle(ex.grupo||''),secondaryMuscles:[],equipment:ex.equipo||'',image,imageStart:image,imagePeak:image,videoOptional:'',aliases:[],description:'',instructions:[],tips:[],difficulty:'',category:ex.patron||'',variationGroup:'',isUnilateral:/unilateral/i.test(ex.id+' '+(ex.nombre||'')),isBodyweight:ex.equipo==='Peso corporal',source:'DCC'};
  };

  window.exerciseLibraryReady=Promise.resolve(legacyReady)
    .catch(()=>[])
    .then(()=>realFetch('./entrenamientos/ejercicios.json',{cache:'no-store'}))
    .then(r=>{if(!r.ok)throw new Error('No se pudo cargar la biblioteca DCC: HTTP '+r.status);return r.json()})
    .then(payload=>{const records=Array.isArray(payload?.ejercicios)?payload.ejercicios:[];if(!Array.isArray(window.exerciseLibraryFull))window.exerciseLibraryFull=[];window.exerciseLibraryFull.length=0;records.forEach(ex=>window.exerciseLibraryFull.push(mapExercise(ex)));window.dispatchEvent(new CustomEvent('dcc:exercise-library-ready',{detail:{count:window.exerciseLibraryFull.length}}));return window.exerciseLibraryFull})
    .catch(error=>{console.error('DCC — error cargando biblioteca propia:',error);if(Array.isArray(window.exerciseLibraryFull))window.exerciseLibraryFull.length=0;return[]});

  const inlineEditor=document.createElement('script');
  inlineEditor.src='./training-inline-fix.js?v=20260908-3';
  inlineEditor.async=true;
  document.head.appendChild(inlineEditor);

  const progress=document.createElement('script');
  progress.src='./progress-premium-v5.js?v=20260908-9';
  progress.async=true;
  document.head.appendChild(progress);

  /* Progreso cliente: un único renderer. No cargar capas v7/v8/v9 encima. */
  const clientProgress=document.createElement('script');
  clientProgress.async=false;
  clientProgress.src='./client-progress-premium-v6.js?v=20260910-5';
  document.head.appendChild(clientProgress);

  /* Inicio cliente: encabezado, tareas y efectos premium dorados. */
  const clientHomePremium=document.createElement('script');
  clientHomePremium.async=false;
  clientHomePremium.src='./client-home-premium-v4.js?v=20260910-2';
  document.head.appendChild(clientHomePremium);

  /* Sincronización de métricas entre Inicio, Check-in y Progreso. */
  const clientMetricsSync=document.createElement('script');
  clientMetricsSync.async=false;
  clientMetricsSync.src='./client-metrics-sync-v10.js?v=20260910-1';
  document.head.appendChild(clientMetricsSync);

  /* Alimentación cliente: acabado premium compacto y coherente con Inicio/Progreso/Check-in. */
  const clientNutrition=document.createElement('script');
  clientNutrition.async=false;
  clientNutrition.src='./client-nutrition-premium-v2.js?v=20260910-1';
  document.head.appendChild(clientNutrition);

  const unify=document.createElement('script');
  unify.src='./progress-metrics-unify.js?v=20260908-2';
  unify.async=true;
  document.head.appendChild(unify);

  const checkins=document.createElement('script');
  checkins.src='./checkin-premium.js?v=20260908-2';
  checkins.async=true;
  document.head.appendChild(checkins);

  const messages=document.createElement('script');
  messages.src='./messages-premium.js?v=20260908-2';
  messages.async=true;
  document.head.appendChild(messages);

  const messageSync=document.createElement('script');
  messageSync.src='./messages-sync-fix.js?v=20260908-1';
  messageSync.async=true;
  document.head.appendChild(messageSync);

  /* Entrada estable en Mensajes: no saltar automáticamente al final. */
  const messagePositionFix=document.createElement('script');
  messagePositionFix.src='./messages-position-stable-v4.js?v=20260910-1';
  messagePositionFix.async=true;
  document.head.appendChild(messagePositionFix);

  const finalShell=document.createElement('script');
  finalShell.src='./coach-premium-final-v2.js?v=20260908-1';
  finalShell.async=true;
  document.head.appendChild(finalShell);

  const premiumNav=document.createElement('script');
  premiumNav.src='./nav-premium-global.js?v=20260908-1';
  premiumNav.async=true;
  document.head.appendChild(premiumNav);

  const premiumCoachTheme=document.createElement('script');
  premiumCoachTheme.src='./coach-theme-premium-global.js?v=20260908-3';
  premiumCoachTheme.async=true;
  document.head.appendChild(premiumCoachTheme);

  const clientsSearchFix=document.createElement('script');
  clientsSearchFix.src='./clients-search-final-fix.js?v=20260908-1';
  clientsSearchFix.async=true;
  document.head.appendChild(clientsSearchFix);

  /* La pantalla premium del entrenamiento activo se carga al final,
     después de que el resto de renderizadores hayan terminado. */
  window.addEventListener('load',()=>{
    try{if(typeof data!=='undefined')window.data=data;}catch(_){ }
    if(document.querySelector('script[data-dcc-workout-premium]'))return;
    const workoutPremium=document.createElement('script');
    workoutPremium.src='./workout-session-premium-v3.js?v=20260910-1';
    workoutPremium.dataset.dccWorkoutPremium='1';
    document.body.appendChild(workoutPremium);
  },{once:true});

  /* Evitar perder un entrenamiento por tocar otra pestaña sin querer. */
  if(!window.__dccWorkoutNavGuardInstalled){
    window.__dccWorkoutNavGuardInstalled=true;

    document.addEventListener('click',event=>{
      const button=event.target.closest('#client-nav button');
      if(!button || !window.activeWorkout)return;

      const action=button.getAttribute('onclick') || '';
      const label=(button.textContent || '').trim();
      const staysInTraining=/showClient\s*\(\s*["']training["']\s*\)/i.test(action) || /entrenamiento/i.test(label);
      if(staysInTraining)return;

      const leave=window.confirm(
        'Tienes un entrenamiento en curso. Si sales ahora se perderá el entrenamiento y las series registradas. ¿Quieres salir?'
      );

      if(!leave){
        event.preventDefault();
        event.stopImmediatePropagation();
        return;
      }

      clearInterval(window.restTimerInterval);
      clearInterval(window.dccWorkoutElapsedInterval);
      window.restTimerInterval=null;
      window.dccWorkoutElapsedInterval=null;
      window.activeWorkout=null;
      document.body.classList.remove('dcc-workout-mode');
    },true);

    window.addEventListener('beforeunload',event=>{
      if(!window.activeWorkout)return;
      event.preventDefault();
      event.returnValue='';
    });
  }

  /* Al cambiar de pestaña principal, empezar siempre en el encabezado.
     No afecta a botones internos de rutina/selección de ejercicios. */
  if(!window.__dccTopOnMainTabInstalled){
    window.__dccTopOnMainTabInstalled=true;
    document.addEventListener('click',event=>{
      const button=event.target.closest('#coach-nav button,#client-nav button');
      if(!button)return;
      requestAnimationFrame(()=>requestAnimationFrame(()=>{
        window.scrollTo({top:0,left:0,behavior:'auto'});
        document.documentElement.scrollTop=0;
        document.body.scrollTop=0;
      }));
    },true);
  }
})();