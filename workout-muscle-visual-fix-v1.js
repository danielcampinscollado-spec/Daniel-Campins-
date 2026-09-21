/* DCC — integración visual músculos entrenamiento activo, estable */
(function(){'use strict';if(window.__dccWorkoutMuscleVisualFixV19)return;window.__dccWorkoutMuscleVisualFixV19=true;
const norm=v=>String(v||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();
function primary(name){const n=norm(name);if(/press banca|press inclinado|press declinado|apertura|cruce|pec deck|pullover|flexion/.test(n))return'Pectoral';if(/elevacion lateral|elevaciones laterales|elevacion frontal|press militar|press hombro|pajaro|face pull/.test(n))return'Hombro';if(/triceps|extension de triceps|extension triceps|patada/.test(n))return'Tríceps';if(/curl|biceps/.test(n))return'Bíceps';if(/remo|jalon|dominada|dorsal/.test(n))return'Espalda';if(/sentadilla|prensa|cuadriceps/.test(n))return'Cuádriceps';if(/femoral|isquio|peso muerto rumano/.test(n))return'Femoral';if(/hip thrust|gluteo|abduccion/.test(n))return'Glúteo';if(/gemelo|pantorrilla/.test(n))return'Gemelo';if(/abdominal|core|plancha|crunch/.test(n))return'Core';return''}
function pretty(m){const n=norm(m);if(/pecho|pectoral/.test(n))return'Pectoral';if(/hombro|deltoid/.test(n))return'Hombros';if(/tricep/.test(n))return'Tríceps';if(/bicep/.test(n))return'Bíceps';if(/espalda|dorsal/.test(n))return'Dorsal';if(/trapec/.test(n))return'Trapecio';if(/antebrazo/.test(n))return'Antebrazos';if(/cuadr/.test(n))return'Cuádriceps';if(/femoral|isquio/.test(n))return'Femoral';if(/glute/.test(n))return'Glúteos';if(/gemelo|pantorrilla/.test(n))return'Gemelos';if(/core|abdomen/.test(n))return'Core';if(/lumbar/.test(n))return'Lumbar';return String(m||'').trim()}
const ACTIVE_APPROVED_ASSETS={
  pectoral:'./assets/muscles/client-pectoral-premium.svg?v=20260921-pierna-completa1',
  pecho:'./assets/muscles/client-pectoral-premium.svg?v=20260921-pierna-completa1',
  triceps:'./assets/muscles/client-triceps-premium.svg?v=20260921-pierna-completa1',
  dorsal:'./assets/muscles/client-dorsal-premium.svg?v=20260921-pierna-completa1',
  espalda:'./assets/muscles/client-dorsal-premium.svg?v=20260921-pierna-completa1',
  hombro:'./assets/muscles/client-hombros-premium.svg?v=20260921-pierna-completa1',
  hombros:'./assets/muscles/client-hombros-premium.svg?v=20260921-pierna-completa1',
  deltoide:'./assets/muscles/client-hombros-premium.svg?v=20260921-pierna-completa1',
  trapecio:'./assets/muscles/client-trapecio-premium.svg?v=20260921-pierna-completa1',
  lumbar:'./assets/muscles/client-trapecio-premium.svg?v=20260921-pierna-completa1',
  biceps:'./assets/muscles/client-biceps-premium.svg?v=20260921-pierna-completa1',
  antebrazo:'./assets/muscles/client-antebrazos-premium.svg?v=20260921-pierna-completa1',
  antebrazos:'./assets/muscles/client-antebrazos-premium.svg?v=20260921-pierna-completa1',
  'pierna completa':'./assets/muscles/client-pierna-completa-premium.webp?v=20260921-pierna-completa1',
  pierna:'./assets/muscles/client-pierna-completa-premium.webp?v=20260921-pierna-completa1',
  piernas:'./assets/muscles/client-pierna-completa-premium.webp?v=20260921-pierna-completa1',
  'tren inferior':'./assets/muscles/client-pierna-completa-premium.webp?v=20260921-pierna-completa1',
  core:'./assets/muscles/client-core-premium.svg?v=20260921-pierna-completa1',
  abdomen:'./assets/muscles/client-core-premium.svg?v=20260921-pierna-completa1',
  cuadriceps:'./assets/muscles/client-cuadriceps-premium.svg?v=20260921-pierna-completa1',
  femoral:'./assets/muscles/client-femoral-premium.svg?v=20260921-pierna-completa1',
  isquio:'./assets/muscles/client-femoral-premium.svg?v=20260921-pierna-completa1',
  isquiotibiales:'./assets/muscles/client-femoral-premium.svg?v=20260921-pierna-completa1',
  gluteo:'./assets/muscles/client-gluteos-premium.svg?v=20260921-pierna-completa1',
  gluteos:'./assets/muscles/client-gluteos-premium.svg?v=20260921-pierna-completa1',
  gemelo:'./assets/muscles/client-gemelos-premium.svg?v=20260921-pierna-completa1',
  gemelos:'./assets/muscles/client-gemelos-premium.svg?v=20260921-pierna-completa1',
  pantorrilla:'./assets/muscles/client-gemelos-premium.svg?v=20260921-pierna-completa1'
};
function visualFor(m){
  const n=norm(m);
  if(!n)return null;
  for(const [key,src] of Object.entries(ACTIVE_APPROVED_ASSETS)){
    if(n.includes(key))return {src,artwork:true};
  }
  return null;
}

function libraryMuscle(ex){const list=Array.isArray(window.exerciseLibraryFull)?window.exerciseLibraryFull:[];const id=String(ex?.libraryId??ex?.id??ex?.exerciseId??ex?.exercise_id??'');if(id){const hit=list.find(x=>String(x?.id??'')===id);if(hit?.muscle)return hit.muscle;}const name=norm(ex?.name??ex?.exercise??ex?.title??'');if(name){const hit=list.find(x=>norm(x?.name)===name);if(hit?.muscle)return hit.muscle;}return''}
function exerciseMuscle(ex){return pretty(libraryMuscle(ex)||ex?.muscle||primary(ex?.name||ex?.exercise||ex?.title||''))}
const style=document.createElement('style');style.id='dcc-workout-muscle-visual-fix-v8';style.textContent=`
html.dcc-theme-light-premium body.dcc-workout-mode #client-main .dwa3-top{grid-template-columns:minmax(0,1fr) 100px!important;gap:8px 10px!important;padding:11px 12px!important;background:linear-gradient(145deg,#fffdf8,#f7efe2)!important;border:1px solid rgba(181,126,29,.35)!important;border-radius:22px!important;box-shadow:0 12px 28px rgba(93,67,24,.08)!important}
html.dcc-theme-light-premium body.dcc-workout-mode #client-main .dwa3-media{width:96px!important;height:64px!important;align-self:center!important;justify-self:center!important;border:1px solid rgba(181,126,29,.22)!important;border-radius:14px!important;overflow:hidden!important;padding:0!important;background:#fff7e8!important;box-shadow:inset 0 0 0 1px rgba(255,255,255,.42)!important;display:grid!important;place-items:center!important}
html.dcc-theme-light-premium body.dcc-workout-mode #client-main .dwa3-media img{display:block!important;width:100%!important;height:100%!important;object-position:center center!important;background:#fff7e8!important;border:0!important;border-radius:13px!important;filter:none!important;transform:none!important;image-rendering:auto!important}
html.dcc-theme-light-premium body.dcc-workout-mode #client-main .dwa3-media img.dcc-muscle-artwork{object-fit:contain!important;object-position:center center!important}
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

  media.classList.remove('dcc-muscle-reference','dcc-muscle-artwork');

  const visual=visualFor(m);
  if(!visual){
    media.style.visibility='hidden';
    return;
  }

  if(media.getAttribute('src')!==visual.src)media.src=visual.src;
  media.style.visibility='visible';
  media.alt=m;
  media.classList.add('dcc-muscle-artwork');
}
let queued=false;function queue(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;fix()})}
const main=document.getElementById('client-main');if(main)new MutationObserver(queue).observe(main,{childList:true,subtree:true});document.addEventListener('click',()=>setTimeout(queue,0),true);window.addEventListener('dcc:themechange',queue);queue();})();