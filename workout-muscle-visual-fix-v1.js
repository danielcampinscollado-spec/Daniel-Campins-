/* DCC — sincronización muscular acotada. Sin MutationObserver global. */
(function(){
  'use strict';
  if(window.__dccWorkoutMuscleVisualFixV9)return;
  window.__dccWorkoutMuscleVisualFixV9=true;

  const norm=v=>String(v||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();
  function primary(name){const n=norm(name);if(/press banca|press inclinado|press declinado|apertura|cruce|pec deck|pullover|flexion/.test(n))return'Pectoral';if(/elevacion lateral|elevaciones laterales|elevacion frontal|press militar|press hombro|pajaro|face pull/.test(n))return'Hombro';if(/triceps|extension de triceps|extension triceps|patada/.test(n))return'Tríceps';if(/curl|biceps/.test(n))return'Bíceps';if(/remo|jalon|dominada|dorsal/.test(n))return'Espalda';if(/sentadilla|prensa|cuadriceps/.test(n))return'Cuádriceps';if(/femoral|isquio|peso muerto rumano/.test(n))return'Femoral';if(/hip thrust|gluteo|abduccion/.test(n))return'Glúteo';if(/gemelo|pantorrilla/.test(n))return'Gemelo';if(/abdominal|core|plancha|crunch/.test(n))return'Core';return''}
  function pretty(m){const n=norm(m);if(/pecho|pectoral/.test(n))return'Pectoral';if(/hombro|deltoid/.test(n))return'Hombro';if(/tricep/.test(n))return'Tríceps';if(/bicep/.test(n))return'Bíceps';if(/espalda|dorsal/.test(n))return'Espalda';if(/cuadr/.test(n))return'Cuádriceps';if(/femoral|isquio/.test(n))return'Femoral';if(/glute/.test(n))return'Glúteo';if(/gemelo|pantorrilla/.test(n))return'Gemelo';if(/core|abdomen/.test(n))return'Core';return String(m||'').trim()}
  function imgFor(m){const n=norm(m);if(n==='pectoral')return'./assets/muscles/pecho.png';if(n==='hombro')return'./assets/muscles/hombros.png';if(n==='triceps')return'./assets/muscles/triceps.png';if(n==='biceps')return'./assets/muscles/biceps.png';if(n==='espalda')return'./assets/muscles/espalda.png';if(n==='cuadriceps')return'./assets/muscles/cuadriceps.png';if(n==='femoral')return'./assets/muscles/isquios.png';if(n==='gluteo')return'./assets/muscles/gluteos.png';if(n==='gemelo')return'./assets/muscles/gemelos.png';if(n==='core')return'./assets/muscles/core.png';return''}

  document.getElementById('dcc-workout-muscle-visual-fix-v8')?.remove();
  const style=document.createElement('style');style.id='dcc-workout-muscle-visual-fix-v9';style.textContent=`
    #client-main .dct3-visuals{display:flex!important;gap:4px!important;align-items:center!important;justify-content:flex-end!important}
    #client-main .dct3-muscle{width:44px!important;max-width:44px!important;height:59px!important;flex:0 0 44px!important;border:0!important;border-radius:12px!important;overflow:hidden!important;background:transparent!important;box-shadow:none!important;padding:0!important}
    #client-main .dct3-muscle img{width:100%!important;height:100%!important;display:block!important;object-fit:cover!important;object-position:center 24%!important;border-radius:12px!important;border:1px solid rgba(181,126,29,.28)!important;background:#0d1115!important}
    #client-main .dct3-muscles[data-muscles="3"]{grid-template-columns:minmax(0,1fr) 142px!important;gap:8px!important}
    #client-main .dct3-muscles[data-muscles="3"] .dct3-title{font-size:17px!important;line-height:1.16!important}
    html[data-dcc-theme="dark"] #client-main .dct3-routine{min-height:138px!important;padding:14px!important;border-radius:22px!important;overflow:hidden!important;background-image:linear-gradient(90deg,#171b21 0%,#11151a 31%,rgba(17,21,26,.97) 43%,rgba(17,21,26,.80) 52%,rgba(17,21,26,.38) 62%,rgba(8,10,13,.05) 74%),url('./assets/next-workout-plate.jpg')!important;background-size:100% 100%,auto 150%!important;background-position:center,right center!important;background-repeat:no-repeat!important;border-color:rgba(217,170,74,.68)!important}
    html.dcc-theme-light-premium body.dcc-workout-mode #client-main .dwa3-top{grid-template-columns:minmax(0,1fr) 112px!important;gap:8px 10px!important}
    html.dcc-theme-light-premium body.dcc-workout-mode #client-main .dwa3-media{width:108px!important;height:100px!important;border:0!important;border-radius:15px!important;overflow:hidden!important;padding:0!important;background:transparent!important;box-shadow:none!important;display:grid!important;place-items:center!important}
    html.dcc-theme-light-premium body.dcc-workout-mode #client-main .dwa3-media img{width:100%!important;height:100%!important;display:block!important;object-fit:contain!important;object-position:center!important;border:1px solid rgba(181,126,29,.24)!important;border-radius:15px!important;background:#0d1115!important;padding:0!important}
    body.dcc-workout-mode #client-main .dwa3-history.first{min-height:60px!important;padding:8px 12px!important;grid-template-columns:32px minmax(0,1fr)!important;gap:9px!important}
    @media(max-width:390px){#client-main .dct3-muscles[data-muscles="3"]{grid-template-columns:minmax(0,1fr) 128px!important}#client-main .dct3-muscle{width:40px!important;max-width:40px!important;height:54px!important;flex-basis:40px!important}}
  `;document.head.appendChild(style);

  function getData(){try{return data||{}}catch(_){return window.data||{}}}
  function getClient(){try{return currentClientId||null}catch(_){return window.currentClientId||null}}
  function overviewMuscles(){
    const id=getClient(),d=getData();const rr=d?.routines?.[id],routine=Array.isArray(rr)?rr:Array.isArray(rr?.routine)?rr.routine:[];const day=routine[Number(window.trainingDayTab)||0];if(!day)return[];
    const out=[];const add=v=>{const p=pretty(v);if(p&&imgFor(p)&&!out.includes(p))out.push(p)};
    if(Array.isArray(day.muscleGroups))day.muscleGroups.forEach(add);String(day.muscle||'').split(/[·+,&/]/).forEach(add);(Array.isArray(day.exercises)?day.exercises:[]).forEach(ex=>add(ex?.muscle||ex?.group||ex?.grupo||primary(ex?.name||ex?.nombre||'')));
    return out.slice(0,4);
  }
  function fixOverview(root){
    const section=root.querySelector('.dcc-training-stable-v3 .dct3-muscles');if(!section)return;
    const ms=overviewMuscles();if(!ms.length)return;const label=ms.join(' · ');
    section.dataset.muscles=String(ms.length);
    const title=section.querySelector('.dct3-title');if(title&&title.textContent!==label)title.textContent=label;
    const routineTitle=root.querySelector('.dcc-training-stable-v3 .dct3-routine h3');if(routineTitle&&routineTitle.textContent!==label)routineTitle.textContent=label;
    const visuals=section.querySelector('.dct3-visuals');if(visuals){const key=ms.join('|');if(visuals.dataset.dccMuscles!==key){visuals.dataset.dccMuscles=key;visuals.innerHTML=ms.map(m=>`<div class="dct3-muscle"><img src="${imgFor(m)}" alt="${m}"></div>`).join('')}}
  }
  function fixWorkout(root){
    const workout=window.activeWorkout;const ex=workout?.exercises?.[Number(workout?.currentExercise)||0];if(!ex)return;
    const m=primary(ex.name||ex.exercise||ex.title||'')||pretty(ex.muscle||'');
    root.querySelectorAll('.dwa3-badge.gold').forEach(el=>{if(m&&el.textContent!==m)el.textContent=m});
    const media=root.querySelector('.dwa3-media img');const src=imgFor(m);if(media&&src&&media.getAttribute('src')!==src){media.src=src;media.alt=m}
  }
  function fix(){const root=document.getElementById('client-main');if(!root)return;fixOverview(root);fixWorkout(root)}
  let queued=false;function queue(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;fix()})}

  window.addEventListener('dcc:screen-rendered',queue);
  window.addEventListener('dcc:themechange',queue);
  window.addEventListener('dcc:exercise-library-ready',queue);
  document.addEventListener('click',()=>setTimeout(queue,0),true);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',queue,{once:true});else queue();
})();
