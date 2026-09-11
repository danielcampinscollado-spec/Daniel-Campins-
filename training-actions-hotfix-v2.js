/* DCC — puente de runtime estable + refinamientos de entrenamiento.
   No sobrescribe navegación ni aplica estilos a Inicio cliente.
*/
(function(){
  'use strict';
  if(window.__dccStableRuntimeBridgeV9)return;
  window.__dccStableRuntimeBridgeV9=true;

  function bridgeAccessor(name,getter,setter){
    try{
      const descriptor=Object.getOwnPropertyDescriptor(window,name);
      if(descriptor&&descriptor.configurable===false)return;
      Object.defineProperty(window,name,{configurable:true,enumerable:true,get:getter,set:setter||function(){}});
    }catch(error){console.warn('DCC runtime bridge:',name,error);}
  }

  try{if(typeof data!=='undefined')bridgeAccessor('data',()=>data,value=>{data=value;});}catch(error){console.warn('DCC runtime bridge data:',error);}
  try{if(typeof currentClientId!=='undefined')bridgeAccessor('currentClientId',()=>currentClientId,value=>{currentClientId=value;});}catch(error){console.warn('DCC runtime bridge client:',error);}
  try{if(typeof supabaseClient!=='undefined'&&supabaseClient)bridgeAccessor('supabaseClient',()=>supabaseClient);}catch(error){console.warn('DCC runtime bridge supabase:',error);}

  const norm=value=>String(value||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();

  function primaryMuscle(name,current){
    const n=norm(name);
    if(/press banca|press inclinado|press declinado|press pecho|apertura|cruce|pec deck|pullover|flexion/.test(n))return 'Pectoral';
    if(/elevacion lateral|elevaciones laterales|elevacion frontal|press militar|press hombro|pajaro|face pull/.test(n))return 'Hombro';
    if(/triceps|extension de triceps|extension triceps|patada/.test(n))return 'Tríceps';
    if(/curl|biceps/.test(n))return 'Bíceps';
    if(/remo|jalon|dominada|dorsal/.test(n))return 'Espalda';
    if(/sentadilla|prensa|extension de cuadriceps|extension cuadriceps|cuadriceps/.test(n))return 'Cuádriceps';
    if(/femoral|isquio|peso muerto rumano/.test(n))return 'Femoral';
    if(/hip thrust|gluteo|abduccion/.test(n))return 'Glúteo';
    if(/gemelo|pantorrilla/.test(n))return 'Gemelo';
    if(/abdominal|core|plancha|crunch/.test(n))return 'Core';
    const first=String(current||'').split(/[·,+/&]/)[0].trim();
    const f=norm(first);
    if(f==='pecho'||f==='pectoral')return 'Pectoral';
    if(f==='hombros'||f==='hombro'||f==='deltoides'||f==='deltoide')return 'Hombro';
    if(f==='triceps')return 'Tríceps';
    if(f==='biceps')return 'Bíceps';
    if(f==='espalda'||f==='dorsal'||f==='dorsales')return 'Espalda';
    if(f==='cuadriceps')return 'Cuádriceps';
    if(f==='femoral'||f==='isquios'||f==='isquiotibiales')return 'Femoral';
    if(f==='gluteo'||f==='gluteos')return 'Glúteo';
    if(f==='gemelo'||f==='gemelos')return 'Gemelo';
    return first||'';
  }

  function muscleImage(muscle){
    const m=norm(muscle);
    if(m==='pectoral')return './assets/muscles/pecho.png';
    if(m==='hombro')return './assets/muscles/hombros.png';
    if(m==='triceps')return './assets/muscles/triceps.png';
    if(m==='biceps')return './assets/muscles/biceps.png';
    if(m==='espalda')return './assets/muscles/espalda.png';
    if(m==='cuadriceps')return './assets/muscles/cuadriceps.png';
    if(m==='femoral')return './assets/muscles/isquios.png';
    if(m==='gluteo')return './assets/muscles/gluteos.png';
    if(m==='gemelo')return './assets/muscles/gemelos.png';
    if(m==='core')return './assets/muscles/core.png';
    return '';
  }

  function installTrainingRefinements(){
    if(document.getElementById('dcc-client-training-refinements-v9'))return;
    ['dcc-client-refinements-20260911','dcc-client-refinements-20260911-v3','dcc-client-refinements-20260911-v4','dcc-client-refinements-20260911-v5','dcc-client-refinements-20260911-v6','dcc-client-refinements-20260911-v7','dcc-client-training-refinements-v8'].forEach(id=>document.getElementById(id)?.remove());
    const style=document.createElement('style');
    style.id='dcc-client-training-refinements-v9';
    style.textContent=`
      #client-main .dct3-days{grid-template-columns:repeat(7,minmax(0,1fr))!important;gap:4px!important;margin-bottom:11px!important}
      #client-main .dct3-day{height:44px!important;min-height:44px!important;padding:0 1px!important;border-radius:11px!important;gap:2px!important}
      #client-main .dct3-day span{font-size:6px!important;line-height:1!important;letter-spacing:.8px!important}
      #client-main .dct3-day b{font-size:14px!important;line-height:1!important}
      #client-main .dct3-actions{display:flex!important;align-items:center!important;justify-content:flex-start!important;flex-wrap:wrap!important;gap:8px!important;margin-top:12px!important}
      #client-main .dct3-start,#client-main .dct3-view{width:auto!important;min-width:0!important;min-height:39px!important;height:39px!important;padding:0 14px!important;border-radius:12px!important;font-size:10.5px!important;line-height:1!important;font-weight:700!important;box-shadow:none!important}
      #client-main .dct3-start{border:1px solid rgba(240,201,107,.82)!important;background:linear-gradient(145deg,rgba(217,170,74,.12),rgba(12,15,19,.98))!important;color:#f1c861!important}
      #client-main .dct3-view{border:1px solid rgba(255,255,255,.13)!important;background:linear-gradient(145deg,#12171d,#0a0e13)!important;color:#c3c9d1!important}
      #client-main .dcc-active-exercise-advice,#client-main .dcc-exercise-client-advice{display:none!important}

      /* ================= ENTRENAMIENTO ACTIVO — LIGHT PREMIUM ================= */
      html.dcc-theme-light-premium body.dcc-workout-mode #client-main{background:#f5efe4!important}
      html.dcc-theme-light-premium #client-main .dwa3{color:#17191d!important;padding-bottom:118px!important}
      html.dcc-theme-light-premium #client-main .dwa3-top{
        padding:14px!important;border:1px solid rgba(198,139,32,.42)!important;border-radius:22px!important;
        background:linear-gradient(145deg,#fffefa,#fbf6ec)!important;
        box-shadow:0 14px 34px rgba(83,63,31,.10),inset 0 1px 0 #fff!important
      }
      html.dcc-theme-light-premium #client-main .dwa3-media{
        background:linear-gradient(145deg,#f8efe0,#eee3d3)!important;border-color:rgba(187,126,20,.42)!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.7)!important
      }
      html.dcc-theme-light-premium #client-main .dwa3-back{
        background:#fffaf0!important;color:#27231d!important;border-color:rgba(166,126,59,.25)!important;box-shadow:0 5px 14px rgba(83,63,31,.06)!important
      }
      html.dcc-theme-light-premium #client-main .dwa3-kicker span{color:#a66d0b!important}
      html.dcc-theme-light-premium #client-main .dwa3-kicker small{color:#6b7380!important}
      html.dcc-theme-light-premium #client-main .dwa3-title{color:#17191d!important;text-shadow:none!important}
      html.dcc-theme-light-premium #client-main .dwa3-badge{
        background:#fffaf0!important;color:#5f6875!important;border-color:rgba(166,126,59,.22)!important
      }
      html.dcc-theme-light-premium #client-main .dwa3-badge.gold{
        background:#fff1c8!important;color:#8f5f0c!important;border-color:rgba(187,126,20,.42)!important
      }
      html.dcc-theme-light-premium #client-main .dwa3-tech,
      html.dcc-theme-light-premium #client-main .dwa3-elapsed{
        background:#fffaf0!important;border-color:rgba(187,126,20,.40)!important;box-shadow:none!important
      }
      html.dcc-theme-light-premium #client-main .dwa3-tech{color:#17191d!important}
      html.dcc-theme-light-premium #client-main .dwa3-tech svg{color:#a66d0b!important}
      html.dcc-theme-light-premium #client-main .dwa3-elapsed{color:#a66d0b!important}
      html.dcc-theme-light-premium #client-main .dwa3-elapsed-icon{background:#fbf0da!important}
      html.dcc-theme-light-premium #client-main .dwa3-elapsed strong{color:#17191d!important}

      html.dcc-theme-light-premium #client-main .dwa3-card{
        background:linear-gradient(145deg,#fffefa,#fbf6ec)!important;color:#17191d!important;
        border-color:rgba(198,139,32,.34)!important;
        box-shadow:0 11px 28px rgba(83,63,31,.08),inset 0 1px 0 #fff!important
      }
      html.dcc-theme-light-premium #client-main .dwa3-history-icon{
        background:#fbf0da!important;color:#a66d0b!important;border-color:rgba(187,126,20,.30)!important
      }
      html.dcc-theme-light-premium #client-main .dwa3-history span,
      html.dcc-theme-light-premium #client-main .dwa3-section-title,
      html.dcc-theme-light-premium #client-main .dwa3-tip-toggle .head{color:#a66d0b!important}
      html.dcc-theme-light-premium #client-main .dwa3-history strong{color:#17191d!important}
      html.dcc-theme-light-premium #client-main .dwa3-history-divider{background:rgba(89,70,36,.13)!important}
      html.dcc-theme-light-premium #client-main .dwa3-tip-toggle{color:#a66d0b!important}
      html.dcc-theme-light-premium #client-main .dwa3-tip-chevron{border-color:#a66d0b!important}
      html.dcc-theme-light-premium #client-main .dwa3-tip-body{color:#555e6a!important}
      html.dcc-theme-light-premium #client-main .dwa3-current-head small{color:#6b7380!important}

      html.dcc-theme-light-premium #client-main .dwa3-step{
        background:linear-gradient(145deg,#fffdf8,#f4eadb)!important;color:#707986!important;border-color:rgba(166,126,59,.20)!important;box-shadow:none!important
      }
      html.dcc-theme-light-premium #client-main .dwa3-step.done{
        background:#fff4d7!important;color:#99670e!important;border-color:rgba(187,126,20,.35)!important
      }
      html.dcc-theme-light-premium #client-main .dwa3-step.active{
        background:linear-gradient(145deg,#ffeaa6,#e8b13f)!important;color:#1c160b!important;border-color:#d6a13a!important;
        box-shadow:0 6px 16px rgba(186,127,21,.18)!important
      }
      html.dcc-theme-light-premium #client-main .dwa3-fields label>b{color:#2a2d31!important}
      html.dcc-theme-light-premium #client-main .dwa3-input{
        background:#fffefa!important;border-color:rgba(117,105,86,.30)!important;box-shadow:inset 0 1px 0 #fff!important
      }
      html.dcc-theme-light-premium #client-main .dwa3-input:focus-within{border-color:#c89125!important;box-shadow:0 0 0 3px rgba(198,145,37,.10)!important}
      html.dcc-theme-light-premium #client-main .dwa3-input input{color:#17191d!important}
      html.dcc-theme-light-premium #client-main .dwa3-input input::placeholder{color:#727b86!important}
      html.dcc-theme-light-premium #client-main .dwa3-input span{color:#6c7480!important;background:#f3eadb!important;height:100%;display:grid;place-items:center;padding:0 12px!important}
      html.dcc-theme-light-premium #client-main .dwa3-fields label>small{color:#6b7380!important}
      html.dcc-theme-light-premium #client-main .dwa3-today span{background:#fff3d2!important;color:#5f6875!important}
      html.dcc-theme-light-premium #client-main .dwa3-today b{color:#95630d!important}
      html.dcc-theme-light-premium #client-main .dwa3-rest-note{background:#fff6df!important;color:#8f6416!important;border-color:rgba(187,126,20,.22)!important}
      html.dcc-theme-light-premium #client-main .dwa3-rest-icon{background:#fbf0da!important;color:#a66d0b!important;border-color:rgba(187,126,20,.30)!important}
      html.dcc-theme-light-premium #client-main .dwa3-rest span{color:#a66d0b!important}
      html.dcc-theme-light-premium #client-main .dwa3-rest strong{color:#8f5f0c!important}
      html.dcc-theme-light-premium #client-main .dwa3-rest small{color:#6b7380!important}
      html.dcc-theme-light-premium #client-main .dwa3-rest button,
      html.dcc-theme-light-premium #client-main .dwa3-exit{background:#fffaf0!important;color:#3d4248!important;border-color:rgba(166,126,59,.24)!important;box-shadow:none!important}
      html.dcc-theme-light-premium #client-main .dwa3-primary{
        background:linear-gradient(135deg,#f8d97f,#e3ac39 64%,#f2c75e)!important;color:#171109!important;border-color:#e2ad3e!important;
        box-shadow:0 10px 22px rgba(186,127,21,.18),inset 0 1px 0 rgba(255,255,255,.52)!important
      }
      html.dcc-theme-light-premium body.dcc-workout-mode .dcc-theme-trigger{display:none!important}

      @media(max-width:390px){
        #client-main .dct3-days{gap:3px!important}
        #client-main .dct3-day{height:41px!important;min-height:41px!important;border-radius:10px!important}
        #client-main .dct3-day span{font-size:5.5px!important;letter-spacing:.65px!important}
        #client-main .dct3-day b{font-size:13px!important}
        #client-main .dct3-start,#client-main .dct3-view{height:37px!important;min-height:37px!important;padding:0 12px!important;font-size:10px!important}
        html.dcc-theme-light-premium #client-main .dwa3-top{padding:12px!important;border-radius:19px!important}
      }
    `;
    document.head.appendChild(style);
  }

  let queued=false;
  function syncWorkoutAdvice(){
    try{
      const workout=window.activeWorkout;if(!workout)return;
      const exercise=workout.exercises?.[Number(workout.currentExercise)||0];
      const body=document.querySelector('#client-main .dwa3-tip .dwa3-tip-body');
      const adviceFn=window.dccExerciseAdvice;
      if(exercise&&body&&typeof adviceFn==='function'){
        const advice=String(adviceFn(exercise)||'').trim();
        if(advice&&body.textContent!==advice)body.textContent=advice;
      }
    }catch(error){console.warn('DCC advice sync:',error);}
  }

  function refineTraining(){
    try{
      document.querySelectorAll('#client-main .dct3-title,#client-main .dct3-routine h3').forEach(el=>{
        const next=(el.textContent||'').replace(/\bPecho\b/gi,'Pectoral');
        if(next!==el.textContent)el.textContent=next;
      });
      document.querySelectorAll('#client-main .dct3-exercise').forEach(row=>{
        const name=row.querySelector('strong')?.textContent||'';
        const label=row.querySelector('small');if(!label)return;
        const primary=primaryMuscle(name,label.textContent);if(primary)label.textContent=primary.toUpperCase();
        const img=row.querySelector('.dct3-ex-img img');const src=muscleImage(primary);if(img&&src&&img.getAttribute('src')!==src)img.setAttribute('src',src);
      });
    }catch(error){console.warn('DCC training refinement:',error);}
  }

  function schedule(){
    if(queued)return;queued=true;
    requestAnimationFrame(()=>{queued=false;syncWorkoutAdvice();refineTraining();});
  }

  function loadThemeSystem(){
    if(window.__dccThemeSystemV1||window.__dccThemeSystemV2||document.querySelector('script[data-dcc-theme-system="v1"]'))return;
    const script=document.createElement('script');
    script.src='./dcc-theme-system-v1.js';
    script.async=false;
    script.dataset.dccThemeSystem='v1';
    script.onload=loadPremiumPolish;
    script.onerror=()=>console.warn('DCC theme system: no se pudo cargar');
    document.head.appendChild(script);
  }

  function loadPremiumPolish(){
    if(window.__dccThemePremiumPolishV6||document.querySelector('script[data-dcc-theme-polish="v3"]'))return;
    const script=document.createElement('script');
    script.src='./dcc-theme-premium-polish-v3.js';
    script.async=false;
    script.dataset.dccThemePolish='v3';
    script.onerror=()=>console.warn('DCC premium polish: no se pudo cargar');
    document.head.appendChild(script);
  }

  installTrainingRefinements();
  loadThemeSystem();
  setTimeout(loadPremiumPolish,0);
  const main=document.getElementById('client-main');
  if(main&&!main.__dccClientTrainingRefinementsObserverV9){
    const observer=new MutationObserver(schedule);observer.observe(main,{childList:true,subtree:true});main.__dccClientTrainingRefinementsObserverV9=observer;
  }
  window.addEventListener('dcc:exercise-library-ready',schedule);
  document.addEventListener('DOMContentLoaded',()=>{installTrainingRefinements();loadThemeSystem();loadPremiumPolish();schedule();});
  schedule();

  window.__dccRuntimeBridgeReady=true;
  try{window.dispatchEvent(new CustomEvent('dcc:runtime-bridge-ready'));}catch(_){}
})();