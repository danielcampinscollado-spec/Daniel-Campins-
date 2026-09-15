/* DCC — acciones compactas de rutina inmediatamente tras el último día configurado */
(function(){
'use strict';
const BUILD='20260916-training-home-actions-v2-tight';
if(window.__dccTrainingHomeActions===BUILD)return;window.__dccTrainingHomeActions=BUILD;
let raf=0;
const norm=s=>String(s||'').replace(/\s+/g,' ').trim().toLowerCase();
function commonBox(a,b){
  if(!a||!b)return null;
  if(a.parentElement===b.parentElement)return a.parentElement;
  let p=a.parentElement;for(let i=0;p&&i<4;i++,p=p.parentElement){if(p.contains(b))return p}return null;
}
function apply(){
  const root=document.getElementById('coach-main');if(!root)return;
  if(window.__dccTrainingEdit){delete root.dataset.dccRoutineHomeMode;return}
  root.dataset.dccRoutineHomeMode='1';
  const buttons=[...root.querySelectorAll('button')];
  const edit=buttons.find(b=>norm(b.textContent).includes('editar rutina'));
  const create=buttons.find(b=>norm(b.textContent).includes('crear nueva rutina'));
  const actions=commonBox(edit,create),days=root.querySelector('.dcc-tr-days');
  if(!edit||!create||!actions||!days||actions===root||actions.contains(days))return;
  actions.dataset.dccRoutineHomeActions='1';
  actions.style.setProperty('display','grid','important');
  actions.style.setProperty('grid-template-columns','1fr 1fr','important');
  actions.style.setProperty('gap','8px','important');
  actions.style.setProperty('margin','8px 0 12px','important');
  actions.style.setProperty('padding','0','important');
  actions.style.setProperty('min-height','0','important');
  actions.style.setProperty('height','auto','important');
  actions.style.setProperty('position','relative','important');
  actions.style.setProperty('inset','auto','important');
  if(days.nextElementSibling!==actions)days.insertAdjacentElement('afterend',actions);
}
function schedule(){if(raf)return;raf=requestAnimationFrame(()=>{raf=0;apply()})}
const s=document.createElement('style');s.id='dcc-training-home-actions-css';s.textContent=`
#coach-main[data-dcc-routine-home-mode="1"] .dcc-tr-days{padding-bottom:0!important;margin-bottom:0!important}
#coach-main [data-dcc-routine-home-actions="1"] button{min-height:48px!important;height:48px!important;margin:0!important;padding:6px 9px!important;border-radius:14px!important;font-size:13px!important;line-height:1.05!important;font-weight:850!important;box-shadow:0 4px 12px rgba(96,68,20,.07)!important}
#coach-main [data-dcc-routine-home-actions="1"] button:active{transform:scale(.98)!important;filter:brightness(.94)!important}
@media(max-width:390px){#coach-main [data-dcc-routine-home-actions="1"]{gap:7px!important}#coach-main [data-dcc-routine-home-actions="1"] button{font-size:12.5px!important;padding:6px!important}}
`;document.head.appendChild(s);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
new MutationObserver(schedule).observe(document.getElementById('coach-main')||document.body,{childList:true,subtree:true});
})();