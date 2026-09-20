/* DCC — entrenamiento cliente estable v3
   Una sola capa para la portada de entrenamiento.
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

  const MUSCLE_ASSETS={
    pectoral:'assets/muscles/pecho.png',pecho:'assets/muscles/pecho.png',
    espalda:'assets/muscles/espalda.png',dorsal:'assets/muscles/espalda.png',dorsales:'assets/muscles/espalda.png',
    hombro:'assets/muscles/hombros.png',hombros:'assets/muscles/hombros.png',deltoide:'assets/muscles/hombros.png',deltoides:'assets/muscles/hombros.png',
    biceps:'assets/muscles/biceps.png',triceps:'assets/muscles/triceps.png',
    cuadriceps:'assets/muscles/cuadriceps.png',
    femoral:'assets/muscles/isquios.png',femorales:'assets/muscles/isquios.png',isquios:'assets/muscles/isquios.png',isquiotibiales:'assets/muscles/isquios.png',
    gluteo:'assets/muscles/gluteos.png',gluteos:'assets/muscles/gluteos.png',
    gemelo:'assets/muscles/gemelos.png',gemelos:'assets/muscles/gemelos.png',pantorrilla:'assets/muscles/gemelos.png',pantorrillas:'assets/muscles/gemelos.png',
    core:'assets/muscles/core.png',abdomen:'assets/muscles/core.png',abdominales:'assets/muscles/core.png',
    lumbar:'assets/muscles/lumbar-cuello.png',lumbares:'assets/muscles/lumbar-cuello.png',trapecio:'assets/muscles/lumbar-cuello.png'
  };

  function muscleAsset(value){
    const n=norm(value);
    if(!n)return '';
    for(const [key,path] of Object.entries(MUSCLE_ASSETS))if(n.includes(key))return path;
    return '';
  }

  function dayMuscles(day){
    const raw=Array.isArray(day?.muscleGroups)&&day.muscleGroups.length?day.muscleGroups:String(day?.muscle||'').split(/[·+,&/]/);
    const out=[];
    raw.map(x=>String(x||'').trim()).filter(Boolean).forEach(name=>{
      const path=muscleAsset(name);
      if(path&&!out.some(x=>x.path===path))out.push({name,path});
    });
    if(!out.length&&day?.muscle){const path=muscleAsset(day.muscle);if(path)out.push({name:day.muscle,path});}
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

    const dayButtons=routine.slice(0,7).map((x,i)=>`<button type="button" class="dct3-day ${i===dayIndex?'active':''}" data-day="${i}"><span>DÍA</span><b>${i+1}</b></button>`).join('');
    const visuals=muscles.map(x=>`<div class="dct3-muscle-wrap"><div class="dct3-muscle"><img src="./${esc(x.path)}" alt="${esc(x.name)}"></div><span>${esc(x.name)}</span></div>`).join('');
    const rows=exercises.map(ex=>{
      const muscle=exerciseMuscle(ex,day);
      const img=muscleAsset(muscle);
      const meta=[ex?.sets?`${esc(ex.sets)} series`:'',ex?.reps?`${esc(ex.reps)} repeticiones`:''].filter(Boolean).join(' · ');
      return `<div class="dct3-exercise">${img?`<div class="dct3-ex-img"><img src="./${esc(img)}" alt=""></div>`:''}<div><strong>${esc(ex?.name||'Ejercicio')}</strong>${muscle?`<small>${esc(String(muscle).toUpperCase())}</small>`:''}${meta?`<span>${meta}</span>`:''}</div></div>`;
    }).join('');

    let tip='La técnica correcta siempre está por encima de mover más peso.';
    try{if(typeof getTodayCoachTip==='function')tip=getTodayCoachTip(id)||tip;}catch(_){}

    main.innerHTML=`
      <style id="dcc-training-stable-v3-style">
        #client-main .dcc-training-stable-v3{
          max-width:820px;
          margin:0 auto;
          padding:3px 0 112px;
          color:#17191d
        }

        #client-main .dct3-eyebrow{
          margin:0 0 14px;
          color:#a66d0d;
          font-size:11px;
          line-height:1;
          font-weight:850;
          letter-spacing:3.4px;
          text-transform:uppercase
        }

        #client-main .dct3-days{
          display:flex;
          gap:7px;
          overflow-x:auto;
          margin:0 0 14px;
          padding:1px 1px 3px;
          scrollbar-width:none
        }
        #client-main .dct3-days::-webkit-scrollbar{display:none}
        #client-main .dct3-day{
          flex:0 0 82px;
          width:82px;
          height:70px;
          border:1px solid rgba(183,123,19,.26);
          border-radius:17px;
          background:linear-gradient(145deg,#fffefa,#f8f0e3);
          color:#777f89;
          box-shadow:0 5px 14px rgba(78,58,28,.04),inset 0 1px 0 rgba(255,255,255,.95);
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          gap:5px;
          position:relative;
          z-index:2;
          pointer-events:auto;
          touch-action:manipulation
        }
        #client-main .dct3-day span{
          font-size:8px;
          line-height:1;
          font-weight:850;
          letter-spacing:1.45px
        }
        #client-main .dct3-day b{
          color:inherit!important;
          font-size:21px;
          line-height:1;
          font-weight:650
        }
        #client-main .dct3-day.active{
          border-color:#d6a33c;
          background:
            radial-gradient(circle at 50% 0,rgba(226,173,57,.17),transparent 62%),
            linear-gradient(145deg,#1b1913 0%,#11110f 100%);
          color:#f0c75d;
          box-shadow:0 7px 17px rgba(67,49,18,.12),inset 0 1px 0 rgba(255,255,255,.045)
        }
        #client-main .dct3-day.active b{color:#f0c75d!important}

        #client-main .dct3-card{
          position:relative;
          margin-bottom:12px;
          border:1px solid rgba(183,123,19,.24);
          border-radius:21px;
          background:linear-gradient(145deg,#fffefa 0%,#fbf5eb 100%)!important;
          box-shadow:0 10px 24px rgba(78,58,28,.065),inset 0 1px 0 rgba(255,255,255,.96)!important;
          overflow:hidden
        }

        #client-main .dct3-muscles{
          min-height:146px;
          padding:18px 20px;
          display:grid;
          grid-template-columns:minmax(0,1fr) minmax(190px,.9fr);
          gap:18px;
          align-items:center
        }
        #client-main .dct3-label{
          margin-bottom:8px;
          color:#b77b13;
          font-size:9.5px;
          line-height:1.1;
          font-weight:850;
          letter-spacing:2.6px;
          text-transform:uppercase
        }
        #client-main .dct3-title{
          margin:0;
          color:#17191d!important;
          font-size:25px;
          line-height:1.08;
          font-weight:700;
          letter-spacing:-.55px
        }
        #client-main .dct3-region{
          display:flex;
          align-items:center;
          gap:10px;
          margin-top:14px;
          color:#7d828a;
          font-size:8px;
          line-height:1;
          font-weight:750;
          letter-spacing:2px
        }
        #client-main .dct3-region::before{
          content:"";
          width:38px;
          height:2px;
          border-radius:999px;
          background:linear-gradient(90deg,#d7a73e,#b77b13)
        }
        #client-main .dct3-visuals{
          display:flex;
          justify-content:flex-end;
          align-items:flex-start;
          gap:8px
        }
        #client-main .dct3-muscle-wrap{
          width:88px;
          text-align:center
        }
        #client-main .dct3-muscle{
          width:88px;
          height:100px;
          border:1px solid rgba(194,135,20,.48);
          border-radius:16px;
          overflow:hidden;
          background:
            radial-gradient(circle at 50% 10%,rgba(225,174,65,.12),transparent 40%),
            linear-gradient(145deg,#17191c,#0d0f12);
          box-shadow:0 7px 16px rgba(49,37,18,.12),inset 0 1px 0 rgba(255,255,255,.03)
        }
        #client-main .dct3-muscle img{
          width:100%;
          height:100%;
          object-fit:cover;
          display:block;
          filter:sepia(.18) saturate(.92) hue-rotate(350deg) contrast(1.07) brightness(.94)
        }
        #client-main .dct3-muscle-wrap>span{
          display:block;
          margin-top:6px;
          color:#a66d0d;
          font-size:7.5px;
          line-height:1;
          font-weight:850;
          letter-spacing:1.25px;
          text-transform:uppercase;
          white-space:nowrap;
          overflow:hidden;
          text-overflow:ellipsis
        }

        #client-main .dct3-tip{
          min-height:82px;
          padding:13px 17px;
          display:grid;
          grid-template-columns:48px minmax(0,1fr);
          gap:14px;
          align-items:center
        }
        #client-main .dct3-tip-icon{
          width:46px;
          height:46px;
          display:grid;
          place-items:center;
          border:1px solid rgba(183,123,19,.31);
          border-radius:14px;
          color:#b77b13;
          background:#fffaf0
        }
        #client-main .dct3-tip-icon svg{
          width:24px;
          height:24px;
          stroke:currentColor
        }
        #client-main .dct3-tip p{
          margin:0;
          color:#68707c!important;
          font-size:12px;
          line-height:1.42;
          font-weight:450
        }

        #client-main .dct3-routine{
          position:relative;
          isolation:isolate;
          overflow:hidden;
          padding:17px 18px;
          border:1px solid rgba(183,123,19,.28)!important;
          border-radius:21px;
          background:linear-gradient(145deg,#fffefa 0%,#fbf5eb 100%)!important;
          box-shadow:0 11px 26px rgba(78,58,28,.07),inset 0 1px 0 rgba(255,255,255,.96)!important
        }
        #client-main .dct3-routine::before{
          content:"";
          position:absolute;
          z-index:0;
          top:0;
          right:0;
          width:54%;
          height:178px;
          pointer-events:none;
          background-image:url("./assets/training-premium-plate.jpg");
          background-repeat:no-repeat;
          background-position:58% center;
          background-size:cover;
          opacity:.96;
          -webkit-mask-image:linear-gradient(90deg,transparent 0%,rgba(0,0,0,.20) 14%,rgba(0,0,0,.76) 45%,#000 72%,#000 100%);
          mask-image:linear-gradient(90deg,transparent 0%,rgba(0,0,0,.20) 14%,rgba(0,0,0,.76) 45%,#000 72%,#000 100%)
        }
        #client-main .dct3-routine::after{
          content:"";
          position:absolute;
          z-index:1;
          top:0;
          left:0;
          right:0;
          height:178px;
          pointer-events:none;
          background:
            radial-gradient(circle at 58% 18%,rgba(240,197,103,.16),transparent 30%),
            linear-gradient(90deg,
              rgba(255,253,248,1) 0%,
              rgba(255,253,248,.99) 37%,
              rgba(255,253,248,.84) 52%,
              rgba(255,253,248,.34) 68%,
              rgba(255,253,248,.03) 100%)
        }
        #client-main .dct3-routine>*{
          position:relative;
          z-index:2
        }
        #client-main .dct3-routine h3{
          margin:0;
          max-width:53%;
          color:#17191d!important;
          font-size:21px;
          line-height:1.08;
          font-weight:700;
          letter-spacing:-.45px
        }
        #client-main .dct3-meta{
          margin-top:6px;
          color:#707782!important;
          font-size:10.5px
        }
        #client-main .dct3-actions{
          display:grid;
          grid-template-columns:minmax(0,1.55fr) minmax(116px,.88fr);
          gap:9px;
          max-width:520px;
          margin-top:19px;
          position:relative;
          z-index:5
        }
        #client-main .dct3-start,
        #client-main .dct3-view{
          min-height:46px;
          padding:0 14px;
          border-radius:14px;
          font-size:12px;
          line-height:1;
          font-weight:850;
          position:relative;
          z-index:6;
          pointer-events:auto!important;
          touch-action:manipulation!important;
          -webkit-tap-highlight-color:transparent
        }
        #client-main .dct3-start{
          border:1px solid #d6a33c!important;
          background:linear-gradient(135deg,#ffe895 0%,#f2ca5b 50%,#dfa52f 100%)!important;
          color:#17140d!important;
          box-shadow:0 7px 17px rgba(185,126,18,.15),inset 0 1px 0 rgba(255,255,255,.72)!important
        }
        #client-main .dct3-view{
          border:1px solid rgba(255,255,255,.12)!important;
          background:linear-gradient(145deg,#191d24,#0e1116)!important;
          color:#f4f2ec!important;
          box-shadow:0 7px 16px rgba(25,23,19,.13)!important
        }

        #client-main .dct3-list{
          display:none;
          margin-top:16px;
          gap:7px;
          padding-top:12px;
          border-top:1px solid rgba(177,119,18,.13)
        }
        #client-main .dct3-routine.open .dct3-list{display:grid}
        #client-main .dct3-exercise{
          min-height:68px;
          padding:8px 9px;
          display:grid;
          grid-template-columns:50px minmax(0,1fr);
          gap:10px;
          align-items:center;
          border:1px solid rgba(177,119,18,.17);
          border-radius:14px;
          background:rgba(255,253,248,.88)!important
        }
        #client-main .dct3-exercise:not(:has(.dct3-ex-img)){grid-template-columns:1fr}
        #client-main .dct3-ex-img{
          width:50px;
          height:50px;
          border:1px solid rgba(183,123,19,.18);
          border-radius:11px;
          overflow:hidden;
          background:#fff7e8
        }
        #client-main .dct3-ex-img img{
          width:100%;
          height:100%;
          object-fit:cover;
          filter:sepia(.16) saturate(.92) hue-rotate(350deg)
        }
        #client-main .dct3-exercise strong{
          display:block;
          color:#17191d!important;
          font-size:12.5px
        }
        #client-main .dct3-exercise small{
          display:block;
          margin-top:4px;
          color:#b77b13!important;
          font-size:7.7px;
          font-weight:800;
          letter-spacing:1px
        }
        #client-main .dct3-exercise span{
          display:block;
          margin-top:4px;
          color:#777f89!important;
          font-size:9.3px
        }
        #client-main .dct3-empty{
          padding:18px;
          border:1px solid rgba(177,119,18,.18);
          border-radius:16px;
          background:#fffaf1;
          color:#777f89;
          text-align:center
        }

        @media(max-width:520px){
          #client-main .dcc-training-stable-v3{padding-bottom:108px}
          #client-main .dct3-eyebrow{margin-bottom:13px}
          #client-main .dct3-day{
            flex-basis:78px;
            width:78px;
            height:68px
          }
          #client-main .dct3-muscles{
            min-height:138px;
            grid-template-columns:minmax(0,1fr) 178px;
            gap:12px;
            padding:16px 17px
          }
          #client-main .dct3-title{font-size:23px}
          #client-main .dct3-muscle-wrap{width:82px}
          #client-main .dct3-muscle{width:82px;height:94px}
          #client-main .dct3-routine::before,
          #client-main .dct3-routine::after{height:170px}
        }

        @media(max-width:390px){
          #client-main .dct3-day{
            flex-basis:72px;
            width:72px;
            height:64px;
            border-radius:15px
          }
          #client-main .dct3-muscles{
            min-height:130px;
            grid-template-columns:minmax(0,1fr) 154px;
            padding:14px 14px;
            gap:10px
          }
          #client-main .dct3-title{font-size:20px}
          #client-main .dct3-region{margin-top:11px;font-size:7px;letter-spacing:1.5px}
          #client-main .dct3-region::before{width:28px}
          #client-main .dct3-muscle-wrap{width:72px}
          #client-main .dct3-muscle{width:72px;height:84px;border-radius:14px}
          #client-main .dct3-muscle-wrap>span{font-size:6.7px;letter-spacing:.9px}
          #client-main .dct3-tip{
            min-height:76px;
            grid-template-columns:43px minmax(0,1fr);
            gap:11px;
            padding:12px 14px
          }
          #client-main .dct3-tip-icon{width:42px;height:42px}
          #client-main .dct3-tip p{font-size:11px}
          #client-main .dct3-routine{
            padding:15px 14px
          }
          #client-main .dct3-routine::before{
            width:58%;
            background-position:56% center
          }
          #client-main .dct3-routine h3{
            max-width:58%;
            font-size:19px
          }
          #client-main .dct3-actions{
            grid-template-columns:minmax(0,1.45fr) minmax(105px,.86fr);
            gap:8px;
            margin-top:17px
          }
          #client-main .dct3-start,
          #client-main .dct3-view{
            min-height:44px;
            padding:0 11px;
            font-size:10.8px
          }
        }
      </style>
      <div class="dcc-training-stable-v3">
        <div class="dct3-eyebrow">ENTRENAMIENTO</div>
        <div class="dct3-days">${dayButtons}</div>
        ${day?`
          <section class="dct3-card dct3-muscles"><div><div class="dct3-label">MÚSCULOS DE HOY</div><h2 class="dct3-title">${esc(title)}</h2><div class="dct3-region">${esc(region)}</div></div><div class="dct3-visuals">${visuals}</div></section>
          <section class="dct3-card dct3-tip"><div class="dct3-tip-icon"><svg viewBox="0 0 24 24" fill="none" stroke-width="1.7"><path d="M9 18h6"/><path d="M10 21h4"/><path d="M8.2 14.4A6 6 0 1 1 15.8 14.4c-.8.7-1.3 1.5-1.4 2.6h-4.8c-.1-1.1-.6-1.9-1.4-2.6Z"/></svg></div><div><div class="dct3-label" style="margin-bottom:5px">CONSEJO DE HOY</div><p>${esc(tip)}</p></div></section>
          ${exercises.length?`<section class="dct3-routine"><div class="dct3-label">EJERCICIOS</div><h3>${esc(title)}</h3><div class="dct3-meta">${exercises.length} ${exercises.length===1?'ejercicio':'ejercicios'}</div><div class="dct3-actions"><button type="button" class="dct3-start" data-day="${dayIndex}">▶&nbsp; Empezar entrenamiento</button><button type="button" class="dct3-view" aria-expanded="false">Ver ejercicios</button></div><div class="dct3-list">${rows}</div></section>`:'<div class="dct3-empty">Este día todavía no tiene ejercicios.</div>'}
        `:'<div class="dct3-empty">Todavía no tienes una rutina programada.</div>'}
      </div>`;

    main.querySelectorAll('.dct3-day').forEach(btn=>btn.addEventListener('click',e=>{e.preventDefault();window.trainingDayTab=Number(btn.dataset.day)||0;window.showClient('training');}));
    const view=main.querySelector('.dct3-view');
    if(view)view.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();const card=view.closest('.dct3-routine');const open=card?.classList.toggle('open');view.setAttribute('aria-expanded',String(!!open));view.textContent=open?'Ocultar ejercicios':'Ver ejercicios';});
    const start=main.querySelector('.dct3-start');
    if(start)start.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();callNativeStart(Number(start.dataset.day));});
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
