/* DCC — integración visual músculos entrenamiento activo, estable */
(function(){'use strict';if(window.__dccWorkoutMuscleVisualFixV16)return;window.__dccWorkoutMuscleVisualFixV16=true;
const norm=v=>String(v||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();
function primary(name){const n=norm(name);if(/press banca|press inclinado|press declinado|apertura|cruce|pec deck|pullover|flexion/.test(n))return'Pectoral';if(/elevacion lateral|elevaciones laterales|elevacion frontal|press militar|press hombro|pajaro|face pull/.test(n))return'Hombro';if(/triceps|extension de triceps|extension triceps|patada/.test(n))return'Tríceps';if(/curl|biceps/.test(n))return'Bíceps';if(/remo|jalon|dominada|dorsal/.test(n))return'Espalda';if(/sentadilla|prensa|cuadriceps/.test(n))return'Cuádriceps';if(/femoral|isquio|peso muerto rumano/.test(n))return'Femoral';if(/hip thrust|gluteo|abduccion/.test(n))return'Glúteo';if(/gemelo|pantorrilla/.test(n))return'Gemelo';if(/abdominal|core|plancha|crunch/.test(n))return'Core';return''}
function pretty(m){const n=norm(m);if(/pecho|pectoral/.test(n))return'Pectoral';if(/hombro|deltoid/.test(n))return'Hombros';if(/tricep/.test(n))return'Tríceps';if(/bicep/.test(n))return'Bíceps';if(/espalda|dorsal/.test(n))return'Dorsal';if(/trapec/.test(n))return'Trapecio';if(/antebrazo/.test(n))return'Antebrazos';if(/cuadr/.test(n))return'Cuádriceps';if(/femoral|isquio/.test(n))return'Femoral';if(/glute/.test(n))return'Glúteos';if(/gemelo|pantorrilla/.test(n))return'Gemelos';if(/core|abdomen/.test(n))return'Core';if(/lumbar/.test(n))return'Lumbar';return String(m||'').trim()}
const ACTIVE_GOLD_ATLAS='./assets/muscles/anatomy-male-final.svg?v=20260921-approved-atlas1';
const ACTIVE_GOLD_POS={
  dorsal:[1,0],espalda:[1,0],
  hombro:[2,0],hombros:[2,0],deltoide:[2,0],deltoides:[2,0],
  trapecio:[0,1],trapecios:[0,1],lumbar:[0,1],lumbares:[0,1],
  biceps:[1,1],
  antebrazo:[0,2],antebrazos:[0,2],
  core:[1,2],abdomen:[1,2],abdominales:[1,2],
  cuadriceps:[2,2],
  femoral:[0,3],femorales:[0,3],isquio:[0,3],isquios:[0,3],isquiotibiales:[0,3],
  gluteo:[1,3],gluteos:[1,3],
  gemelo:[2,3],gemelos:[2,3],pantorrilla:[2,3],pantorrillas:[2,3]
};
function visualFor(m){
  const n=norm(m);
  if(/pecho|pectoral/.test(n))return{kind:'image',src:'./assets/muscles/pectoral-reference-premium.webp?v=20260921-approved-only1'};
  if(/tricep/.test(n))return{kind:'image',src:'./assets/muscles/triceps-reference-premium.webp?v=20260921-approved-only1'};
  for(const [key,pos] of Object.entries(ACTIVE_GOLD_POS)){
    if(n.includes(key)){
      const scale=2;
      const cellW=98*scale;
      const cellH=52.5*scale;
      const viewW=92;
      const viewH=102;
      const cropX=(cellW-viewW)/2;
      const cropY=(cellH-viewH)/2;
      return{kind:'sprite',x:-(pos[0]*cellW+cropX),y:-(pos[1]*cellH+cropY)};
    }
  }
  return null;
}

function libraryMuscle(ex){const list=Array.isArray(window.exerciseLibraryFull)?window.exerciseLibraryFull:[];const id=String(ex?.libraryId??ex?.id??ex?.exerciseId??ex?.exercise_id??'');if(id){const hit=list.find(x=>String(x?.id??'')===id);if(hit?.muscle)return hit.muscle;}const name=norm(ex?.name??ex?.exercise??ex?.title??'');if(name){const hit=list.find(x=>norm(x?.name)===name);if(hit?.muscle)return hit.muscle;}return''}
function exerciseMuscle(ex){return pretty(libraryMuscle(ex)||ex?.muscle||primary(ex?.name||ex?.exercise||ex?.title||''))}
const style=document.createElement('style');style.id='dcc-workout-muscle-visual-fix-v8';style.textContent=`
html.dcc-theme-light-premium body.dcc-workout-mode #client-main .dwa3-top{grid-template-columns:minmax(0,1fr) 100px!important;gap:8px 10px!important;padding:11px 12px!important;background:linear-gradient(145deg,#fffdf8,#f7efe2)!important;border:1px solid rgba(181,126,29,.35)!important;border-radius:22px!important;box-shadow:0 12px 28px rgba(93,67,24,.08)!important}
html.dcc-theme-light-premium body.dcc-workout-mode #client-main .dwa3-media{width:96px!important;height:106px!important;align-self:center!important;justify-self:center!important;border:1px solid rgba(181,126,29,.24)!important;border-radius:14px!important;overflow:hidden!important;padding:0!important;background:#fffaf1!important;box-shadow:none!important;display:grid!important;place-items:center!important}
html.dcc-theme-light-premium body.dcc-workout-mode #client-main .dwa3-media img{display:none!important;object-fit:contain!important;object-position:center center!important;background:#151411!important;border:0!important;border-radius:12px!important;transform:none!important;image-rendering:auto!important}
html.dcc-theme-light-premium body.dcc-workout-mode #client-main .dwa3-media img.dcc-muscle-approved{display:block!important;width:84px!important;height:98px!important;padding:0!important;filter:none!important}
html.dcc-theme-light-premium body.dcc-workout-mode #client-main .dcc-active-approved-sprite{display:none!important;width:92px!important;height:102px!important;background-image:url('${ACTIVE_GOLD_ATLAS}')!important;background-repeat:no-repeat!important;background-size:588px 420px!important;border-radius:12px!important;mix-blend-mode:multiply!important;filter:none!important;transform:none!important}
html.dcc-theme-light-premium body.dcc-workout-mode #client-main .dwa3-media.is-sprite{height:106px!important;background:#fffaf1!important}
html.dcc-theme-light-premium body.dcc-workout-mode #client-main .dwa3-media.is-sprite .dcc-active-approved-sprite{display:block!important}
html.dcc-theme-light-premium body.dcc-workout-mode #client-main .dwa3-top .dwa3-title{color:#17191d!important;text-shadow:none!important}
html.dcc-theme-light-premium body.dcc-workout-mode #client-main .dwa3-top .dwa3-kicker span{color:#a56f12!important}
html.dcc-theme-light-premium body.dcc-workout-mode #client-main .dwa3-top .dwa3-kicker small{color:#6f6a60!important}
html.dcc-theme-light-premium body.dcc-workout-mode #client-main .dwa3-top .dwa3-back{background:#fffaf0!important;color:#b77912!important;border-color:rgba(181,126,29,.36)!important;box-shadow:0 4px 12px rgba(93,67,24,.06)!important}
html.dcc-theme-light-premium body.dcc-workout-mode #client-main .dwa3-top .dwa3-badge{background:#fffaf0!important;color:#55514a!important;border-color:rgba(181,126,29,.20)!important}
html.dcc-theme-light-premium body.dcc-workout-mode #client-main .dwa3-top .dwa3-badge.gold{background:#f8edcf!important;color:#9c6710!important;border-color:rgba(181,126,29,.48)!important}
html.dcc-theme-light-premium body.dcc-workout-mode #client-main .dwa3-top .dwa3-tech,html.dcc-theme-light-premium body.dcc-workout-mode #client-main .dwa3-top .dwa3-elapsed{background:#fffaf0!important;border-color:rgba(181,126,29,.42)!important;box-shadow:0 4px 12px rgba(93,67,24,.05)!important}
html.dcc-theme-light-premium body.dcc-workout-mode #client-main .dwa3-top .dwa3-tech{color:#26231f!important}
html.dcc-theme-light-premium body.dcc-workout-mode #client-main .dwa3-top .dwa3-tech svg{color:#b77912!important}
html.dcc-theme-light-premium body.dcc-workout-mode #client-main .dwa3-top .dwa3-elapsed{color:#b77912!important}
html.dcc-theme-light-premium body.dcc-workout-mode #client-main .dwa3-top .dwa3-elapsed-icon{background:#f5e8c9!important}
html.dcc-theme-light-premium body.dcc-workout-mode #client-main .dwa3-top .dwa3-elapsed strong{color:#17191d!important}
body.dcc-workout-mode #client-main .dwa3-history.first{min-height:60px!important;padding:8px 12px!important;grid-template-columns:32px minmax(0,1fr)!important;gap:9px!important}
`;document.head.appendChild(style);
function getData(){try{return data||{}}catch(_){return window.data||{}}}function getClient(){try{return currentClientId||null}catch(_){return window.currentClientId||null}}
function fix(){
  const root=document.querySelector('#client-main');
  if(!root)return;
  const workout=window.activeWorkout;
  const ex=workout?.exercises?.[Number(workout?.currentExercise)||0];
  if(!ex)return;

  const m=exerciseMuscle(ex);
  if(!m)return;

  root.querySelectorAll('.dwa3-badge.gold').forEach(el=>{
    if(el.textContent!==m)el.textContent=m;
  });

  const box=root.querySelector('.dwa3-media');
  const media=box?.querySelector('img');
  if(!box||!media)return;

  let sprite=box.querySelector('.dcc-active-approved-sprite');
  if(!sprite){
    sprite=document.createElement('span');
    sprite.className='dcc-active-approved-sprite';
    box.appendChild(sprite);
  }

  const visual=visualFor(m);
  box.classList.remove('is-sprite');
  media.classList.remove('dcc-muscle-approved');
  media.style.display='none';
  sprite.style.display='none';

  if(!visual)return;

  if(visual.kind==='image'){
    if(media.getAttribute('src')!==visual.src)media.src=visual.src;
    media.alt=m;
    media.classList.add('dcc-muscle-approved');
    media.style.display='block';
  }else{
    box.classList.add('is-sprite');
    sprite.style.backgroundPosition=visual.x+'px '+visual.y+'px';
    sprite.setAttribute('role','img');
    sprite.setAttribute('aria-label',m);
    sprite.style.display='block';
  }
}
let queued=false;function queue(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;fix()})}
const main=document.getElementById('client-main');if(main)new MutationObserver(queue).observe(main,{childList:true,subtree:true});document.addEventListener('click',()=>setTimeout(queue,0),true);window.addEventListener('dcc:themechange',queue);queue();})();