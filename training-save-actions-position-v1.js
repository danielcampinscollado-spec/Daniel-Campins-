/* DCC — coloca Cancelar / Guardar cambios inmediatamente tras el día que se está editando */
(function(){
'use strict';
const BUILD='20260915-training-save-actions-position-v2-active-day';
if(window.__dccTrainingSaveActionsPosition===BUILD)return;window.__dccTrainingSaveActionsPosition=BUILD;
let raf=0;
const norm=s=>String(s||'').replace(/\s+/g,' ').trim().toLowerCase();
function actionBox(root){
  const buttons=[...root.querySelectorAll('button')];
  const cancel=buttons.find(b=>norm(b.textContent)==='cancelar');
  const save=buttons.find(b=>norm(b.textContent)==='guardar cambios');
  if(!cancel||!save)return null;
  if(cancel.parentElement===save.parentElement)return cancel.parentElement;
  const cp=cancel.parentElement,sp=save.parentElement;
  return cp?.parentElement&&cp.parentElement===sp?.parentElement?cp.parentElement:null;
}
function activeDay(root){
  const days=[...root.querySelectorAll('.dcc-tr-days>.dcc-tr-day')];
  if(!days.length)return null;
  const open=days.find(d=>d.querySelector('.dcc-training-day-rest')&&d.querySelector('.dcc-tr-exercises'));
  if(open)return open;
  const idx=Math.max(0,Number(window.__dccTrainingOpen)||0);
  return days[idx]||days[0];
}
function apply(){
  if(!window.__dccTrainingEdit)return;
  const root=document.getElementById('coach-main');if(!root)return;
  const actions=actionBox(root),day=activeDay(root);if(!actions||!day)return;
  if(actions===root||actions.contains(day)||day.contains(actions))return;
  actions.dataset.dccTrainingSaveActions='1';
  actions.style.setProperty('display','grid','important');
  actions.style.setProperty('grid-template-columns','1fr 1fr','important');
  actions.style.setProperty('gap','10px','important');
  actions.style.setProperty('margin','10px 0 18px','important');
  actions.style.setProperty('padding','0','important');
  actions.style.setProperty('min-height','0','important');
  actions.style.setProperty('height','auto','important');
  if(day.nextElementSibling!==actions)day.insertAdjacentElement('afterend',actions);
}
function toast(){
  document.getElementById('dcc-training-saved-toast')?.remove();
  const t=document.createElement('div');t.id='dcc-training-saved-toast';t.textContent='✓ Rutina guardada';document.body.appendChild(t);
  requestAnimationFrame(()=>t.classList.add('show'));setTimeout(()=>{t.classList.remove('show');setTimeout(()=>t.remove(),220)},1250);
}
document.addEventListener('pointerdown',e=>{
  const b=e.target?.closest?.('#coach-main button');if(!b||norm(b.textContent)!=='guardar cambios'||!window.__dccTrainingEdit)return;
  b.classList.add('dcc-save-pressed');setTimeout(()=>b.classList.remove('dcc-save-pressed'),260);
},true);
document.addEventListener('click',e=>{
  const b=e.target?.closest?.('#coach-main button');if(!b||norm(b.textContent)!=='guardar cambios'||!window.__dccTrainingEdit)return;
  toast();
},true);
function schedule(){if(raf)return;raf=requestAnimationFrame(()=>{raf=0;apply()})}
const style=document.createElement('style');style.textContent=`
#coach-main [data-dcc-training-save-actions="1"] button{margin:0!important;min-height:48px!important;transition:transform .12s ease,filter .12s ease,box-shadow .12s ease!important}
#coach-main [data-dcc-training-save-actions="1"] button:active,#coach-main [data-dcc-training-save-actions="1"] button.dcc-save-pressed{transform:scale(.965)!important;filter:brightness(.9)!important;box-shadow:inset 0 2px 7px rgba(0,0,0,.18)!important}
#dcc-training-saved-toast{position:fixed;z-index:2147483647;left:50%;top:max(82px,calc(env(safe-area-inset-top) + 58px));transform:translate(-50%,-8px) scale(.96);opacity:0;padding:11px 18px;border-radius:999px;background:#201d17;color:#f4c75a;border:1px solid rgba(238,188,70,.72);font:800 13px/1.1 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;box-shadow:0 8px 28px rgba(0,0,0,.22);transition:.2s ease;pointer-events:none}#dcc-training-saved-toast.show{opacity:1;transform:translate(-50%,0) scale(1)}
@media(max-width:420px){#coach-main [data-dcc-training-save-actions="1"]{gap:8px!important}}
`;document.head.appendChild(style);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
new MutationObserver(schedule).observe(document.getElementById('coach-main')||document.body,{childList:true,subtree:true});
})();