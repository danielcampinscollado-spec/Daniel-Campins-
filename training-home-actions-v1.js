/* DCC — acciones compactas de rutina pegadas al último día configurado */
(function(){
'use strict';
const BUILD='20260915-training-home-actions-v1';
if(window.__dccTrainingHomeActions===BUILD)return;window.__dccTrainingHomeActions=BUILD;
let raf=0;
const norm=s=>String(s||'').replace(/\s+/g,' ').trim().toLowerCase();
function commonBox(a,b){
  if(!a||!b)return null;
  if(a.parentElement===b.parentElement)return a.parentElement;
  let p=a.parentElement;for(let i=0;p&&i<4;i++,p=p.parentElement){if(p.contains(b))return p}return null;
}
function apply(){
  if(window.__dccTrainingEdit)return;
  const root=document.getElementById('coach-main');if(!root)return;
  const buttons=[...root.querySelectorAll('button')];
  const edit=buttons.find(b=>norm(b.textContent).includes('editar rutina'));
  const create=buttons.find(b=>norm(b.textContent).includes('crear nueva rutina'));
  const actions=commonBox(edit,create),days=root.querySelector('.dcc-tr-days');
  if(!edit||!create||!actions||!days||actions===root||actions.contains(days))return;
  actions.dataset.dccRoutineHomeActions='1';
  actions.style.setProperty('display','grid','important');
  actions.style.setProperty('grid-template-columns','1fr 1fr','important');
  actions.style.setProperty('gap','10px','important');
  actions.style.setProperty('margin','12px 0 16px','important');
  actions.style.setProperty('padding','0','important');
  actions.style.setProperty('min-height','0','important');
  actions.style.setProperty('height','auto','important');
  actions.style.setProperty('position','relative','important');
  actions.style.setProperty('inset','auto','important');
  if(days.nextElementSibling!==actions)days.insertAdjacentElement('afterend',actions);
}
function schedule(){if(raf)return;raf=requestAnimationFrame(()=>{raf=0;apply()})}
const s=document.createElement('style');s.id='dcc-training-home-actions-css';s.textContent=`
#coach-main [data-dcc-routine-home-actions="1"] button{min-height:54px!important;height:54px!important;margin:0!important;padding:8px 10px!important;border-radius:15px!important;font-size:14px!important;line-height:1.1!important;font-weight:850!important;box-shadow:0 5px 14px rgba(96,68,20,.08)!important}
#coach-main [data-dcc-routine-home-actions="1"] button:active{transform:scale(.97)!important;filter:brightness(.92)!important}
@media(max-width:390px){#coach-main [data-dcc-routine-home-actions="1"]{gap:8px!important}#coach-main [data-dcc-routine-home-actions="1"] button{font-size:13px!important;padding:7px!important}}
`;document.head.appendChild(s);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
new MutationObserver(schedule).observe(document.getElementById('coach-main')||document.body,{childList:true,subtree:true});
})();