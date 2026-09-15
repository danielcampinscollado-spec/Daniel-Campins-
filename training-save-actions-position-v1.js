/* DCC — coloca Cancelar / Guardar cambios justo debajo del editor de ejercicios */
(function(){
'use strict';
const BUILD='20260915-training-save-actions-position-v1';
if(window.__dccTrainingSaveActionsPosition===BUILD)return;window.__dccTrainingSaveActionsPosition=BUILD;
let raf=0;
const norm=s=>String(s||'').replace(/\s+/g,' ').trim().toLowerCase();
function apply(){
  if(!window.__dccTrainingEdit)return;
  const root=document.getElementById('coach-main');if(!root)return;
  const buttons=[...root.querySelectorAll('button')];
  const cancel=buttons.find(b=>norm(b.textContent)==='cancelar');
  const save=buttons.find(b=>norm(b.textContent)==='guardar cambios');
  const days=root.querySelector('.dcc-tr-days');
  if(!cancel||!save||!days)return;
  let actions=null;
  if(cancel.parentElement===save.parentElement)actions=cancel.parentElement;
  else{
    const cp=cancel.parentElement,sp=save.parentElement;
    if(cp?.parentElement&&cp.parentElement===sp?.parentElement)actions=cp.parentElement;
  }
  if(!actions||actions===root||actions.contains(days)||days.contains(actions))return;
  actions.dataset.dccTrainingSaveActions='1';
  actions.style.setProperty('display','grid','important');
  actions.style.setProperty('grid-template-columns','1fr 1fr','important');
  actions.style.setProperty('gap','10px','important');
  actions.style.setProperty('margin','10px 0 18px','important');
  actions.style.setProperty('padding','0','important');
  actions.style.setProperty('min-height','0','important');
  actions.style.setProperty('height','auto','important');
  if(days.nextElementSibling!==actions)days.insertAdjacentElement('afterend',actions);
}
function schedule(){if(raf)return;raf=requestAnimationFrame(()=>{raf=0;apply()})}
const style=document.createElement('style');style.textContent=`#coach-main [data-dcc-training-save-actions="1"] button{margin:0!important;min-height:48px!important} @media(max-width:420px){#coach-main [data-dcc-training-save-actions="1"]{gap:8px!important}}`;document.head.appendChild(style);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
new MutationObserver(schedule).observe(document.getElementById('coach-main')||document.body,{childList:true,subtree:true});
})();