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
      /* El flujo nativo ya renderiza la sesión. Solo reforzamos si otro módulo la dejó pendiente. */
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

    const dayButtons=routine.slice(0,7).map((x,i)=>`<button type="button" class="dct3-day ${i===dayIndex?'active':''}" data-day="${i}"><span>DÍA</span><b>${i+1}</b></button>`).join('');
    const visuals=muscles.map(x=>`<div class="dct3-muscle"><img src="./${esc(x.path)}" alt="${esc(x.name)}"></div>`).join('');
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
        #client-main .dcc-training-stable-v3{max-width:820px;margin:0 auto;padding:3px 0 112px;color:#f7f5f0}
        #client-main .dct3-eyebrow{margin:0 0 12px;color:#e0ad4c;font-size:11px;font-weight:850;letter-spacing:3px}
        #client-main .dct3-days{display:grid;grid-template-columns:repeat(${Math.max(1,Math.min(routine.length||1,7))},minmax(0,1fr));gap:5px;margin-bottom:12px}
        #client-main .dct3-day{height:54px;border:1px solid rgba(255,255,255,.11);border-radius:14px;background:linear-gradient(145deg,#14181f,#0c1015);color:#858d99;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;position:relative;z-index:2;pointer-events:auto;touch-action:manipulation}
        #client-main .dct3-day span{font-size:7.5px;font-weight:850;letter-spacing:1.2px}#client-main .dct3-day b{font-size:18px}
        #client-main .dct3-day.active{border-color:#e3b447;background:linear-gradient(145deg,#241d10,#15130e);color:#f0c96b}
        #client-main .dct3-card{position:relative;margin-bottom:10px;border:1px solid rgba(217,170,74,.68);border-radius:19px;background:radial-gradient(circle at 100% 0,rgba(217,170,74,.09),transparent 40%),linear-gradient(145deg,#171b21,#0b0f14 72%);box-shadow:0 12px 28px rgba(0,0,0,.23);overflow:hidden}
        #client-main .dct3-muscles{min-height:112px;padding:13px 15px;display:grid;grid-template-columns:minmax(0,1fr) minmax(140px,.9fr);gap:12px;align-items:center}
        #client-main .dct3-label{margin-bottom:7px;color:#e0ad4c;font-size:9px;font-weight:850;letter-spacing:2.4px}#client-main .dct3-title{margin:0;font-size:22px;line-height:1.08}
        #client-main .dct3-visuals{display:flex;justify-content:flex-end;gap:5px}.dct3-muscle{width:50%;max-width:92px;height:86px;border:1px solid rgba(217,170,74,.13);border-radius:13px;overflow:hidden}.dct3-muscle img{width:100%;height:100%;object-fit:contain}
        #client-main .dct3-tip{padding:12px 14px;display:grid;grid-template-columns:38px 1fr;gap:11px;align-items:center}.dct3-tip-icon{width:38px;height:38px;display:grid;place-items:center;border:1px solid rgba(217,170,74,.34);border-radius:11px;color:#f0c96b}.dct3-tip p{margin:0;color:#c1c7d0;font-size:11.5px;line-height:1.42}
        #client-main .dct3-routine{padding:14px;border:1px solid rgba(217,170,74,.76);border-radius:20px;background:linear-gradient(145deg,#15191f,#0a0e13);position:relative;z-index:1}
        #client-main .dct3-routine h3{margin:0;font-size:18px}.dct3-meta{margin-top:4px;color:#929ba6;font-size:10px}
        #client-main .dct3-actions{display:grid;grid-template-columns:minmax(0,1.55fr) minmax(120px,.9fr);gap:8px;margin-top:14px;position:relative;z-index:5}
        #client-main .dct3-start,#client-main .dct3-view{min-height:52px;border-radius:15px;font-weight:850;position:relative;z-index:6;pointer-events:auto!important;touch-action:manipulation!important;-webkit-tap-highlight-color:transparent}
        #client-main .dct3-start{border:1px solid #f4cd69;background:linear-gradient(135deg,#f0c45d,#dfa93d 58%,#f1c960);color:#15110a}.dct3-view{border:1px solid rgba(255,255,255,.14);background:#10151b;color:#e8e8e5}
        #client-main .dct3-list{display:none;margin-top:10px;gap:7px}#client-main .dct3-routine.open .dct3-list{display:grid}
        #client-main .dct3-exercise{min-height:72px;padding:8px 9px;display:grid;grid-template-columns:54px minmax(0,1fr);gap:10px;align-items:center;border:1px solid rgba(255,255,255,.08);border-radius:14px;background:rgba(255,255,255,.025)}
        #client-main .dct3-exercise:not(:has(.dct3-ex-img)){grid-template-columns:1fr}.dct3-ex-img{width:54px;height:54px;border-radius:11px;overflow:hidden}.dct3-ex-img img{width:100%;height:100%;object-fit:contain}.dct3-exercise strong{display:block;font-size:13px}.dct3-exercise small{display:block;margin-top:4px;color:#e0ad4c;font-size:8px;font-weight:800;letter-spacing:1px}.dct3-exercise span{display:block;margin-top:4px;color:#8f98a4;font-size:9.5px}
        #client-main .dct3-empty{padding:18px;border:1px solid rgba(255,255,255,.09);border-radius:16px;color:#929ba6;text-align:center}
        @media(max-width:390px){#client-main .dct3-muscles{min-height:104px;grid-template-columns:minmax(0,1fr) 132px;padding:12px 13px}.dct3-muscle{height:78px}#client-main .dct3-title{font-size:19px}#client-main .dct3-actions{grid-template-columns:minmax(0,1.5fr) minmax(112px,.9fr)}#client-main .dct3-start,#client-main .dct3-view{min-height:49px;font-size:12px}}
      </style>
      <div class="dcc-training-stable-v3">
        <div class="dct3-eyebrow">ENTRENAMIENTO</div>
        <div class="dct3-days">${dayButtons}</div>
        ${day?`
          <section class="dct3-card dct3-muscles"><div><div class="dct3-label">MÚSCULOS DE HOY</div><h2 class="dct3-title">${esc(title)}</h2></div><div class="dct3-visuals">${visuals}</div></section>
          <section class="dct3-card dct3-tip"><div class="dct3-tip-icon">✦</div><div><div class="dct3-label" style="margin-bottom:4px">CONSEJO DE HOY</div><p>${esc(tip)}</p></div></section>
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
      /* CRÍTICO: nunca sobrescribir el DOM de una sesión activa. */
      if(window.activeWorkout)return result;
      try{renderOverview();}catch(error){console.error('DCC training: portada',error);}
    }
    return result;
  };
  window.showClient.__dccTrainingStableV3=true;
  window.showClient.__base=nativeShowClient;
})();
