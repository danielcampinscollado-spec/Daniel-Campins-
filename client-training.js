/* DCC — Entrenamiento cliente
   Implementación única de la portada Light Premium.
   Conserva la sesión nativa cuando activeWorkout está activo y usa el startWorkout original.
*/
(function(){
  'use strict';
  if(window.__dccTrainingStableV3)return;
  window.__dccTrainingStableV3=true;

  const nativeShowClient=window.showClient;
  const nativeStartWorkout=(typeof window.startWorkout==='function')?window.startWorkout:null;
  if(typeof nativeShowClient!=='function')return;

  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[c]));
  const norm=v=>String(v||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim();
  const appData=()=>{try{return data||{}}catch(_){return window.data||{}}};
  const activeClientId=()=>{try{return currentClientId||null}catch(_){return window.currentClientId||null}};

  const GOLD_MUSCLE_SPRITE='./assets/muscles/anatomy-male-final.svg?v=20260921-client-gold1';
  const GOLD_MUSCLE_POS={
    pectoral:[0,0],pecho:[0,0],
    dorsal:[1,0],dorsales:[1,0],espalda:[1,0],
    hombro:[2,0],hombros:[2,0],deltoide:[2,0],deltoides:[2,0],
    trapecio:[0,1],trapecios:[0,1],lumbar:[0,1],lumbares:[0,1],
    biceps:[1,1],
    triceps:[2,1],
    antebrazo:[0,2],antebrazos:[0,2],
    core:[1,2],abdomen:[1,2],abdominales:[1,2],
    cuadriceps:[2,2],
    femoral:[0,3],femorales:[0,3],isquio:[0,3],isquios:[0,3],isquiotibiales:[0,3],
    gluteo:[1,3],gluteos:[1,3],
    gemelo:[2,3],gemelos:[2,3],pantorrilla:[2,3],pantorrillas:[2,3]
  };

  function goldMuscle(value){
    const n=norm(value);
    if(!n)return null;
    for(const [key,pos] of Object.entries(GOLD_MUSCLE_POS)){
      if(n.includes(key)){
        const x=[0,50,100][pos[0]]??50;
        const y=[0,33.333,66.667,100][pos[1]]??50;
        return {key,pos,x,y};
      }
    }
    return null;
  }

  function exerciseVideo(ex){
    const direct=String(ex?.videoUrl||ex?.video_url||ex?.video||'').trim();
    if(direct)return direct;
    const list=Array.isArray(window.exerciseLibraryFull)?window.exerciseLibraryFull:[];
    const id=String(ex?.id??ex?.exerciseId??ex?.exercise_id??'').trim();
    if(id){
      const hit=list.find(x=>String(x?.id??'')===id);
      const url=String(hit?.videoUrl||hit?.video_url||hit?.video||'').trim();
      if(url)return url;
    }
    const name=norm(ex?.name??ex?.nombre??'');
    if(name){
      const hit=list.find(x=>norm(x?.name)===name);
      const url=String(hit?.videoUrl||hit?.video_url||hit?.video||'').trim();
      if(url)return url;
    }
    return '';
  }

  const MUSCLE_ASSETS={
    pectoral:'assets/muscles/pectoral-reference-premium.webp',pecho:'assets/muscles/pectoral-reference-premium.webp',
    espalda:'assets/muscles/espalda.png',dorsal:'assets/muscles/espalda.png',dorsales:'assets/muscles/espalda.png',
    hombro:'assets/muscles/hombros.png',hombros:'assets/muscles/hombros.png',deltoide:'assets/muscles/hombros.png',deltoides:'assets/muscles/hombros.png',
    biceps:'assets/muscles/biceps.png',triceps:'assets/muscles/triceps-reference-premium.webp',
    cuadriceps:'assets/muscles/cuadriceps.png',
    femoral:'assets/muscles/isquios.png',femorales:'assets/muscles/isquios.png',isquios:'assets/muscles/isquios.png',isquiotibiales:'assets/muscles/isquios.png',
    gluteo:'assets/muscles/gluteos.png',gluteos:'assets/muscles/gluteos.png',
    gemelo:'assets/muscles/gemelos.png',gemelos:'assets/muscles/gemelos.png',pantorrilla:'assets/muscles/gemelos.png',pantorrillas:'assets/muscles/gemelos.png',
    core:'assets/muscles/core.png',abdomen:'assets/muscles/core.png',abdominales:'assets/muscles/core.png',
    lumbar:'assets/muscles/lumbar-cuello.png',lumbares:'assets/muscles/lumbar-cuello.png',trapecio:'assets/muscles/lumbar-cuello.png'
  };

  const OVERVIEW_PREMIUM_ASSETS={
    pectoral:'assets/muscles/pectoral-reference-premium.webp',
    pecho:'assets/muscles/pectoral-reference-premium.webp',
    triceps:'assets/muscles/triceps-reference-premium.webp'
  };

  function overviewMuscleAsset(value){
    const n=norm(value);
    if(!n)return '';
    for(const [key,path] of Object.entries(OVERVIEW_PREMIUM_ASSETS))if(n.includes(key))return path;
    return muscleAsset(value);
  }

  function muscleAsset(value){
    const n=norm(value);
    if(!n)return '';
    for(const [key,path] of Object.entries(MUSCLE_ASSETS))if(n.includes(key))return path;
    return '';
  }

  function dayMuscles(day){
    const raw=Array.isArray(day?.muscleGroups)&&day.muscleGroups.length
      ? day.muscleGroups
      : String(day?.muscle||'').split(/[·+,&/]/);
    const out=[];
    raw.map(x=>String(x||'').trim()).filter(Boolean).forEach(name=>{
      const sprite=goldMuscle(name);
      if(sprite&&!out.some(x=>x.key===sprite.key))out.push({name,key:sprite.key,x:sprite.x,y:sprite.y});
    });
    if(!out.length&&day?.muscle){
      const sprite=goldMuscle(day.muscle);
      if(sprite)out.push({name:day.muscle,key:sprite.key,x:sprite.x,y:sprite.y});
    }
    return out.slice(0,2);
  }

  function muscleRegion(muscles){
    const names=(muscles||[]).map(x=>norm(x?.name)).join(' ');
    if(/cuadriceps|femoral|isquio|glute|gemelo|pantorrilla/.test(names))return 'TREN INFERIOR';
    if(/core|abdomen|lumbar/.test(names))return 'CORE Y ESTABILIDAD';
    return 'TREN SUPERIOR';
  }

  function exerciseMuscle(ex,day){
    if(ex?.muscle)return ex.muscle;
    const list=Array.isArray(window.exerciseLibraryFull)?window.exerciseLibraryFull:[];
    const id=String(ex?.id??ex?.exerciseId??ex?.exercise_id??'');
    if(id){const hit=list.find(x=>String(x?.id??'')===id);if(hit?.muscle)return hit.muscle;}
    const name=norm(ex?.name??ex?.nombre??'');
    if(name){const hit=list.find(x=>norm(x?.name)===name);if(hit?.muscle)return hit.muscle;}
    return day?.muscle||'';
  }

  function callNativeStart(dayIndex){
    const fn=nativeStartWorkout||((typeof window.startWorkout==='function')?window.startWorkout:null);
    if(typeof fn!=='function'){
      console.error('DCC training: startWorkout nativo no disponible');
      try{if(typeof toast==='function')toast('No se pudo iniciar el entrenamiento');else if(typeof window.toast==='function')window.toast('No se pudo iniciar el entrenamiento');}catch(_){}
      return;
    }
    try{
      fn.call(window,Number(dayIndex));
      if(window.activeWorkout){
        requestAnimationFrame(()=>{
          const main=document.getElementById('client-main');
          if(main&&main.querySelector('.dcc-training-stable-v3')){
            try{
              if(typeof window.renderWorkoutSession==='function')window.renderWorkoutSession();
              else if(typeof renderWorkoutSession==='function')renderWorkoutSession();
            }catch(error){console.error('DCC training: render sesión',error);}
          }
        });
      }
    }catch(error){
      console.error('DCC training: error startWorkout',error);
      try{if(typeof window.toast==='function')window.toast('No se pudo iniciar el entrenamiento');}catch(_){}
    }
  }

  function renderOverview(){
    if(window.activeWorkout)return;
    const main=document.getElementById('client-main');
    const id=activeClientId();
    const d=appData();
    if(!main||!id)return;

    const routineRaw=d?.routines?.[id];
    const routine=Array.isArray(routineRaw)?routineRaw:Array.isArray(routineRaw?.routine)?routineRaw.routine:[];
    if(typeof window.trainingDayTab!=='number'||window.trainingDayTab<0||window.trainingDayTab>=routine.length)window.trainingDayTab=0;
    const dayIndex=window.trainingDayTab;
    const day=routine[dayIndex]||null;
    const exercises=Array.isArray(day?.exercises)?day.exercises:[];
    const muscles=dayMuscles(day);
    const title=muscles.length?muscles.map(x=>x.name).join(' · '):(day?.muscle||'Entrenamiento');
    const region=muscleRegion(muscles);
    const access=(typeof window.dccGetTrainingAccessState==='function')
      ? window.dccGetTrainingAccessState(id,dayIndex)
      : {allowed:true,reason:'',code:'ready'};
    const startLabel=access.allowed
      ? '▶&nbsp; Empezar entrenamiento'
      : (
          access.code==='already-completed'
            ? '✓ Completado esta semana'
            : access.code==='week-complete'
              ? '✓ Semana completada'
              : access.code==='today-complete'
                ? 'Disponible mañana'
                : 'Bloqueado'
        );

    const dayButtons=routine.slice(0,7).map((x,i)=>`<button type="button" class="dct3-day ${i===dayIndex?'active':''}" data-day="${i}"><span>DÍA</span><b>${i+1}</b></button>`).join('');
    const visuals=muscles.map(x=>`<div class="dct3-muscle-wrap"><div class="dct3-muscle dct3-muscle-gold" role="img" aria-label="${esc(x.name)}" style="--gold-x:${x.x}%;--gold-y:${x.y}%"></div><span>${esc(x.name)}</span></div>`).join('');
    const rows=exercises.map(ex=>{
      const video=exerciseVideo(ex);
      return `<div class="dct3-exercise"><strong>${esc(ex?.name||'Ejercicio')}</strong>${video?`<button type="button" class="dct3-video" data-video="${esc(video)}">Ver vídeo</button>`:''}</div>`;
    }).join('');

    let tip='La técnica correcta siempre está por encima de mover más peso.';
    try{if(typeof getTodayCoachTip==='function')tip=getTodayCoachTip(id)||tip;}catch(_){}

    main.innerHTML=`
      <style id="dcc-training-stable-v3-style">
        html.dcc-theme-light-premium body #client #client-main .dcc-training-stable-v3{
          max-width:820px!important;
          margin:0 auto!important;
          padding:3px 0 112px!important;
          color:#17191d!important
        }
        html.dcc-theme-light-premium body #client #client-main .dct3-eyebrow{
          margin:0 0 13px!important;
          color:#a66d0d!important;
          font-size:11px!important;
          line-height:1!important;
          font-weight:850!important;
          letter-spacing:3.4px!important;
          text-transform:uppercase!important
        }
        html.dcc-theme-light-premium body #client #client-main .dct3-days{
          display:flex!important;
          gap:6px!important;
          overflow-x:auto!important;
          margin:0 0 14px!important;
          padding:1px 1px 3px!important;
          scrollbar-width:none!important
        }
        html.dcc-theme-light-premium body #client #client-main .dct3-days::-webkit-scrollbar{display:none!important}
        html.dcc-theme-light-premium body #client #client-main .dct3-day{
          flex:0 0 58px!important;
          width:58px!important;
          min-width:58px!important;
          height:56px!important;
          padding:6px 4px!important;
          border:1px solid rgba(183,123,19,.22)!important;
          border-radius:14px!important;
          background:linear-gradient(145deg,#fffefa 0%,#f9f3e9 100%)!important;
          color:#7b818b!important;
          box-shadow:0 4px 12px rgba(78,58,28,.035),inset 0 1px 0 rgba(255,255,255,.98)!important;
          display:flex!important;
          flex-direction:column!important;
          align-items:center!important;
          justify-content:center!important;
          gap:4px!important;
          pointer-events:auto!important;
          touch-action:manipulation!important
        }
        html.dcc-theme-light-premium body #client #client-main .dct3-day span{
          color:#9c7b3d!important;
          font-size:6.8px!important;
          line-height:1!important;
          font-weight:850!important;
          letter-spacing:1.25px!important
        }
        html.dcc-theme-light-premium body #client #client-main .dct3-day b{
          color:#686f79!important;
          font-size:17px!important;
          line-height:1!important;
          font-weight:720!important
        }
        html.dcc-theme-light-premium body #client #client-main .dct3-day.active{
          border-color:rgba(205,148,43,.58)!important;
          background:linear-gradient(145deg,#fff8e5 0%,#f5e1b6 58%,#edc66b 100%)!important;
          color:#5b4215!important;
          box-shadow:0 7px 16px rgba(156,109,25,.12),inset 0 1px 0 rgba(255,255,255,.9)!important
        }
        html.dcc-theme-light-premium body #client #client-main .dct3-day.active span{color:#9f6c0f!important}
        html.dcc-theme-light-premium body #client #client-main .dct3-day.active b{color:#30291e!important}
        html.dcc-theme-light-premium body #client #client-main .dct3-days[data-count="6"] .dct3-day,
        html.dcc-theme-light-premium body #client #client-main .dct3-days[data-count="7"] .dct3-day{
          flex-basis:46px!important;
          width:46px!important;
          min-width:46px!important;
          height:52px!important
        }
        html.dcc-theme-light-premium body #client #client-main .dct3-days[data-count="6"] .dct3-day b,
        html.dcc-theme-light-premium body #client #client-main .dct3-days[data-count="7"] .dct3-day b{
          font-size:15px!important
        }

        html.dcc-theme-light-premium body #client #client-main .dct3-card,
        html.dcc-theme-light-premium body #client #client-main .dct3-routine{
          position:relative!important;
          margin:0 0 12px!important;
          border:1px solid rgba(183,123,19,.24)!important;
          border-radius:21px!important;
          background:linear-gradient(145deg,#fffefa 0%,#fbf5eb 100%)!important;
          box-shadow:0 10px 24px rgba(78,58,28,.065),inset 0 1px 0 rgba(255,255,255,.96)!important
        }

        html.dcc-theme-light-premium body #client #client-main .dct3-muscles{
          min-height:162px!important;
          padding:16px 18px!important;
          display:grid!important;
          grid-template-columns:minmax(0,1fr) 190px!important;
          gap:12px!important;
          align-items:center!important;
          overflow:visible!important
        }
        html.dcc-theme-light-premium body #client #client-main .dct3-label{
          margin-bottom:7px!important;
          color:#b77b13!important;
          font-size:9px!important;
          line-height:1.1!important;
          font-weight:850!important;
          letter-spacing:2.4px!important;
          text-transform:uppercase!important
        }
        html.dcc-theme-light-premium body #client #client-main .dct3-title{
          margin:0!important;
          color:#17191d!important;
          font-size:20px!important;
          line-height:1.08!important;
          font-weight:760!important;
          letter-spacing:-.35px!important;
          white-space:nowrap!important
        }
        html.dcc-theme-light-premium body #client #client-main .dct3-region{
          display:flex!important;
          align-items:center!important;
          gap:9px!important;
          margin-top:12px!important;
          color:#7d828a!important;
          font-size:7px!important;
          line-height:1!important;
          font-weight:750!important;
          letter-spacing:1.45px!important;
          white-space:nowrap!important
        }
        html.dcc-theme-light-premium body #client #client-main .dct3-region::before{
          content:""!important;
          flex:0 0 29px!important;
          width:29px!important;
          height:2px!important;
          border-radius:999px!important;
          background:linear-gradient(90deg,#d7a73e,#b77b13)!important
        }
        html.dcc-theme-light-premium body #client #client-main .dct3-visuals{
          width:190px!important;
          display:flex!important;
          justify-content:flex-end!important;
          align-items:flex-start!important;
          gap:6px!important;
          overflow:visible!important
        }
        html.dcc-theme-light-premium body #client #client-main .dct3-muscle-wrap{
          flex:0 0 92px!important;
          width:92px!important;
          min-width:92px!important;
          text-align:center!important;
          overflow:visible!important
        }
        html.dcc-theme-light-premium body #client #client-main .dct3-muscle{
          position:relative!important;
          width:92px!important;
          height:111px!important;
          border:0!important;
          border-radius:14px!important;
          overflow:hidden!important;
          background:#151514!important;
          box-shadow:none!important
        }
        html.dcc-theme-light-premium body #client #client-main .dct3-muscle.dct3-muscle-gold{
          background-image:url('${GOLD_MUSCLE_SPRITE}')!important;
          background-repeat:no-repeat!important;
          background-size:300% 400%!important;
          background-position:var(--gold-x,50%) var(--gold-y,50%)!important;
          background-color:#151514!important
        }

        /* Un único músculo: imagen mayor, centrada y sin hueco reservado para una segunda. */
        html.dcc-theme-light-premium body #client #client-main .dct3-muscles[data-muscles="1"]{
          grid-template-columns:minmax(0,1fr) 128px!important
        }
        html.dcc-theme-light-premium body #client #client-main .dct3-visuals[data-count="1"]{
          width:128px!important;
          justify-content:center!important
        }
        html.dcc-theme-light-premium body #client #client-main .dct3-visuals[data-count="1"] .dct3-muscle-wrap{
          flex:0 0 110px!important;
          width:110px!important;
          min-width:110px!important
        }
        html.dcc-theme-light-premium body #client #client-main .dct3-visuals[data-count="1"] .dct3-muscle{
          width:110px!important;
          height:126px!important
        }
        html.dcc-theme-light-premium body #client #client-main .dct3-muscles[data-muscles="0"]{
          grid-template-columns:1fr!important
        }
        html.dcc-theme-light-premium body #client #client-main .dct3-visuals[data-count="0"]{
          display:none!important
        }
        html.dcc-theme-light-premium body #client #client-main .dct3-muscle-wrap>span{
          display:block!important;
          visibility:visible!important;
          opacity:1!important;
          height:auto!important;
          margin-top:7px!important;
          color:#a66d0d!important;
          font-size:7.8px!important;
          line-height:1!important;
          font-weight:850!important;
          letter-spacing:1.25px!important;
          text-transform:uppercase!important;
          white-space:nowrap!important;
          overflow:visible!important
        }

        html.dcc-theme-light-premium body #client #client-main .dct3-tip{
          min-height:76px!important;
          padding:12px 14px!important;
          display:grid!important;
          grid-template-columns:42px minmax(0,1fr) 18px!important;
          gap:11px!important;
          align-items:center!important;
          overflow:hidden!important
        }
        html.dcc-theme-light-premium body #client #client-main .dct3-tip-icon{
          width:42px!important;
          height:42px!important;
          display:grid!important;
          place-items:center!important;
          border:1px solid rgba(183,123,19,.31)!important;
          border-radius:14px!important;
          background:#fffaf0!important;
          color:#b77b13!important
        }
        html.dcc-theme-light-premium body #client #client-main .dct3-tip-icon svg{
          width:23px!important;
          height:23px!important;
          stroke:currentColor!important
        }
        html.dcc-theme-light-premium body #client #client-main .dct3-tip p{
          margin:0!important;
          color:#68707c!important;
          font-size:11px!important;
          line-height:1.42!important;
          font-weight:450!important
        }
        html.dcc-theme-light-premium body #client #client-main .dct3-tip-arrow{
          display:block!important;
          color:#b7aa92!important;
          font-size:27px!important;
          line-height:1!important;
          font-weight:300!important;
          text-align:right!important
        }

        html.dcc-theme-light-premium body #client #client-main .dct3-routine{
          isolation:isolate!important;
          overflow:hidden!important;
          min-height:158px!important;
          padding:17px 14px!important
        }
        html.dcc-theme-light-premium body #client #client-main .dct3-plate{
          display:block!important;
          position:absolute!important;
          z-index:0!important;
          top:0!important;
          right:0!important;
          width:48%!important;
          height:100%!important;
          max-width:none!important;
          object-fit:cover!important;
          object-position:58% center!important;
          image-rendering:auto!important;
          border:0!important;
          border-radius:0 21px 21px 0!important;
          filter:none!important;
          pointer-events:none!important;
          -webkit-mask-image:linear-gradient(90deg,transparent 0%,rgba(0,0,0,.55) 12%,#000 32%,#000 100%)!important;
          mask-image:linear-gradient(90deg,transparent 0%,rgba(0,0,0,.55) 12%,#000 32%,#000 100%)!important
        }
        html.dcc-theme-light-premium body #client #client-main .dct3-plate-fade{
          position:absolute!important;
          z-index:1!important;
          inset:0!important;
          pointer-events:none!important;
          background:
            radial-gradient(circle at 67% 12%,rgba(239,194,94,.16),transparent 27%),
            linear-gradient(90deg,
              #fffdf8 0%,
              rgba(255,253,248,1) 42%,
              rgba(255,253,248,.90) 49%,
              rgba(255,253,248,.56) 57%,
              rgba(255,253,248,.18) 65%,
              rgba(255,253,248,.02) 73%,
              rgba(255,253,248,0) 80%)!important
        }
        html.dcc-theme-light-premium body #client #client-main .dct3-routine>*:not(.dct3-plate):not(.dct3-plate-fade){
          position:relative!important;
          z-index:2!important
        }
        html.dcc-theme-light-premium body #client #client-main .dct3-routine h3{
          margin:0!important;
          max-width:55%!important;
          color:#17191d!important;
          font-size:19px!important;
          line-height:1.08!important;
          font-weight:760!important;
          letter-spacing:-.35px!important;
          white-space:nowrap!important
        }
        html.dcc-theme-light-premium body #client #client-main .dct3-meta{
          margin-top:6px!important;
          color:#707782!important;
          font-size:10.5px!important
        }
        html.dcc-theme-light-premium body #client #client-main .dct3-actions{
          display:grid!important;
          grid-template-columns:minmax(0,1.55fr) minmax(108px,.9fr)!important;
          gap:8px!important;
          width:100%!important;
          max-width:520px!important;
          margin-top:18px!important
        }
        html.dcc-theme-light-premium body #client #client-main .dct3-start,
        html.dcc-theme-light-premium body #client #client-main .dct3-view{
          min-height:44px!important;
          padding:0 11px!important;
          border-radius:14px!important;
          font-size:10.8px!important;
          line-height:1!important;
          font-weight:850!important;
          pointer-events:auto!important;
          touch-action:manipulation!important;
          -webkit-tap-highlight-color:transparent!important
        }
        html.dcc-theme-light-premium body #client #client-main .dct3-start{
          border:1px solid #d6a33c!important;
          background:linear-gradient(135deg,#ffe895 0%,#f2ca5b 50%,#dfa52f 100%)!important;
          color:#17140d!important;
          box-shadow:0 7px 17px rgba(185,126,18,.15),inset 0 1px 0 rgba(255,255,255,.72)!important
        }
        html.dcc-theme-light-premium body #client #client-main .dct3-start:disabled{
          border-color:rgba(183,123,19,.20)!important;
          background:linear-gradient(145deg,#fffaf0,#f3eadb)!important;
          color:#8b8376!important;
          box-shadow:none!important;
          opacity:1!important;
          cursor:not-allowed!important
        }
        html.dcc-theme-light-premium body #client #client-main .dct3-view{
          border:1px solid rgba(255,255,255,.12)!important;
          background:linear-gradient(145deg,#191d24,#0e1116)!important;
          color:#f4f2ec!important;
          box-shadow:0 7px 16px rgba(25,23,19,.13)!important
        }

        html.dcc-theme-light-premium body #client #client-main .dct3-list{
          display:none!important;
          margin-top:16px!important;
          gap:7px!important;
          padding-top:12px!important;
          border-top:1px solid rgba(177,119,18,.13)!important
        }
        html.dcc-theme-light-premium body #client #client-main .dct3-routine.open .dct3-list{display:grid!important}
        html.dcc-theme-light-premium body #client #client-main .dct3-exercise{
          min-height:54px!important;
          padding:8px 10px 8px 12px!important;
          display:grid!important;
          grid-template-columns:minmax(0,1fr) auto!important;
          gap:10px!important;
          align-items:center!important;
          border:1px solid rgba(177,119,18,.17)!important;
          border-radius:14px!important;
          background:rgba(255,253,248,.94)!important
        }
        html.dcc-theme-light-premium body #client #client-main .dct3-exercise strong{
          display:block!important;
          color:#17191d!important;
          font-size:12.5px!important;
          line-height:1.25!important
        }
        html.dcc-theme-light-premium body #client #client-main .dct3-video{
          min-width:82px!important;
          height:36px!important;
          padding:0 12px!important;
          border:1px solid rgba(183,123,19,.35)!important;
          border-radius:11px!important;
          background:#fff8e8!important;
          color:#9c6710!important;
          font-size:10px!important;
          font-weight:850!important;
          white-space:nowrap!important;
          box-shadow:none!important
        }
        html.dcc-theme-light-premium body #client #client-main .dct3-empty{
          padding:18px!important;
          border:1px solid rgba(177,119,18,.18)!important;
          border-radius:16px!important;
          background:#fffaf1!important;
          color:#777f89!important;
          text-align:center!important
        }

        @media(max-width:389px){
          html.dcc-theme-light-premium body #client #client-main .dct3-day{
            flex-basis:54px!important;
            width:54px!important;
            min-width:54px!important;
            height:52px!important
          }
          html.dcc-theme-light-premium body #client #client-main .dct3-days[data-count="6"] .dct3-day,
          html.dcc-theme-light-premium body #client #client-main .dct3-days[data-count="7"] .dct3-day{
            flex-basis:44px!important;
            width:44px!important;
            min-width:44px!important;
            height:50px!important
          }
          html.dcc-theme-light-premium body #client #client-main .dct3-muscles{
            grid-template-columns:minmax(0,1fr) 172px!important;
            padding:13px 14px!important;
            gap:9px!important
          }
          html.dcc-theme-light-premium body #client #client-main .dct3-visuals{width:172px!important;gap:6px!important}
          html.dcc-theme-light-premium body #client #client-main .dct3-muscle-wrap{flex-basis:83px!important;width:83px!important;min-width:83px!important}
          html.dcc-theme-light-premium body #client #client-main .dct3-muscle{width:83px!important;height:100px!important}
          html.dcc-theme-light-premium body #client #client-main .dct3-muscles[data-muscles="1"]{grid-template-columns:minmax(0,1fr) 112px!important}
          html.dcc-theme-light-premium body #client #client-main .dct3-visuals[data-count="1"]{width:112px!important}
          html.dcc-theme-light-premium body #client #client-main .dct3-visuals[data-count="1"] .dct3-muscle-wrap{flex-basis:98px!important;width:98px!important;min-width:98px!important}
          html.dcc-theme-light-premium body #client #client-main .dct3-visuals[data-count="1"] .dct3-muscle{width:98px!important;height:116px!important}
          html.dcc-theme-light-premium body #client #client-main .dct3-title{font-size:18px!important}
          html.dcc-theme-light-premium body #client #client-main .dct3-routine h3{font-size:18px!important;max-width:57%!important}
          html.dcc-theme-light-premium body #client #client-main .dct3-actions{
            grid-template-columns:minmax(0,1.45fr) minmax(102px,.86fr)!important
          }
        }

        @media(min-width:420px){
          html.dcc-theme-light-premium body #client #client-main .dct3-muscles{
            min-height:158px!important;
            grid-template-columns:minmax(0,1fr) 198px!important;
            padding:16px 18px!important
          }
          html.dcc-theme-light-premium body #client #client-main .dct3-visuals{width:198px!important;gap:6px!important}
          html.dcc-theme-light-premium body #client #client-main .dct3-muscle-wrap{flex-basis:96px!important;width:96px!important;min-width:96px!important}
          html.dcc-theme-light-premium body #client #client-main .dct3-muscle{width:96px!important;height:114px!important}
          html.dcc-theme-light-premium body #client #client-main .dct3-muscles[data-muscles="1"]{grid-template-columns:minmax(0,1fr) 136px!important}
          html.dcc-theme-light-premium body #client #client-main .dct3-visuals[data-count="1"]{width:136px!important}
          html.dcc-theme-light-premium body #client #client-main .dct3-visuals[data-count="1"] .dct3-muscle-wrap{flex-basis:118px!important;width:118px!important;min-width:118px!important}
          html.dcc-theme-light-premium body #client #client-main .dct3-visuals[data-count="1"] .dct3-muscle{width:118px!important;height:132px!important}
          html.dcc-theme-light-premium body #client #client-main .dct3-title{font-size:20px!important}
        }
      </style>
      <div class="dcc-training-stable-v3">
        <div class="dct3-eyebrow">ENTRENAMIENTO</div>
        <div class="dct3-days" data-count="${Math.min(routine.length,7)}">${dayButtons}</div>
        ${day?`
          <section class="dct3-card dct3-muscles" data-muscles="${muscles.length}"><div><div class="dct3-label">MÚSCULOS DE HOY</div><h2 class="dct3-title">${esc(title)}</h2><div class="dct3-region">${esc(region)}</div></div><div class="dct3-visuals" data-count="${muscles.length}">${visuals}</div></section>
          <section class="dct3-card dct3-tip"><div class="dct3-tip-icon"><svg viewBox="0 0 24 24" fill="none" stroke-width="1.7"><path d="M9 18h6"/><path d="M10 21h4"/><path d="M8.2 14.4A6 6 0 1 1 15.8 14.4c-.8.7-1.3 1.5-1.4 2.6h-4.8c-.1-1.1-.6-1.9-1.4-2.6Z"/></svg></div><div><div class="dct3-label" style="margin-bottom:5px">CONSEJO DE HOY</div><p>${esc(tip)}</p></div><div class="dct3-tip-arrow">›</div></section>
          ${exercises.length?`<section class="dct3-routine"><img class="dct3-plate" src="./assets/training-reference-disk-user.webp?v=20260920-userdisk1" alt="" aria-hidden="true" loading="eager" decoding="async"><div class="dct3-plate-fade" aria-hidden="true"></div><div class="dct3-label">EJERCICIOS</div><h3>Rutina del día</h3><div class="dct3-meta">${exercises.length} ${exercises.length===1?'ejercicio':'ejercicios'}</div><div class="dct3-actions"><button type="button" class="dct3-start" data-day="${dayIndex}" ${access.allowed?'':`disabled aria-disabled="true" title="${esc(access.reason)}"`}>${startLabel}</button><button type="button" class="dct3-view" aria-expanded="false">Ver ejercicios</button></div><div class="dct3-list">${rows}</div></section>`:'<div class="dct3-empty">Este día todavía no tiene ejercicios.</div>'}
        `:'<div class="dct3-empty">Todavía no tienes una rutina programada.</div>'}
      </div>`;

    main.querySelectorAll('.dct3-day').forEach(btn=>btn.addEventListener('click',e=>{e.preventDefault();window.trainingDayTab=Number(btn.dataset.day)||0;window.showClient('training');}));
    const view=main.querySelector('.dct3-view');
    if(view)view.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();const card=view.closest('.dct3-routine');const open=card?.classList.toggle('open');view.setAttribute('aria-expanded',String(!!open));view.textContent=open?'Ocultar ejercicios':'Ver ejercicios';});
    main.querySelectorAll('.dct3-video').forEach(btn=>btn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();const url=btn.dataset.video;if(url)window.open(url,'_blank','noopener');}));
    const start=main.querySelector('.dct3-start');
    if(start&&!start.disabled)start.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();callNativeStart(Number(start.dataset.day));});
  }

  window.dccRenderTrainingOverview=renderOverview;

  window.showClient=function(screen){
    const result=nativeShowClient.apply(this,arguments);
    if(screen==='training'){
      if(window.activeWorkout)return result;
      try{renderOverview();}catch(error){console.error('DCC training: portada',error);}
    }
    return result;
  };
  window.showClient.__dccTrainingStableV3=true;
  window.showClient.__base=nativeShowClient;
})();
