/* DCC — acciones de rutina compactas, mismo lenguaje que Cancelar / Guardar */
(function(){
'use strict';
const BUILD='20260925-training-home-actions-v5-nutrition-scale';
if(window.__dccTrainingHomeActions===BUILD)return;window.__dccTrainingHomeActions=BUILD;
let raf=0;
const norm=s=>String(s||'').replace(/\s+/g,' ').trim().toLowerCase();
function commonBox(a,b){
  if(!a||!b)return null;
  if(a.parentElement===b.parentElement)return a.parentElement;
  let p=a.parentElement;for(let i=0;p&&i<4;i++,p=p.parentElement){if(p.contains(b))return p}return null;
}
function compactButton(btn){
  if(!btn)return;
  btn.dataset.dccRoutineCompact='1';
  btn.style.setProperty('height','42px','important');
  btn.style.setProperty('min-height','42px','important');
  btn.style.setProperty('max-height','42px','important');
  btn.style.setProperty('padding','7px 12px','important');
  btn.style.setProperty('margin','0','important');
  btn.style.setProperty('border-radius','13px','important');
  btn.style.setProperty('font-size','11px','important');
  btn.style.setProperty('line-height','1.05','important');
  btn.style.setProperty('font-weight','850','important');
  btn.style.setProperty('align-self','start','important');
}
function apply(){
  const root=document.getElementById('coach-main');if(!root)return;
  if(window.__dccTrainingEdit){delete root.dataset.dccRoutineHomeMode;return}
  root.dataset.dccRoutineHomeMode='1';
  const buttons=[...root.querySelectorAll('button')];
  const edit=buttons.find(b=>norm(b.textContent).includes('editar rutina'));
  const create=buttons.find(b=>norm(b.textContent).includes('crear nueva rutina'));
  const actions=commonBox(edit,create),days=root.querySelector('.dcc-tr-days'),history=root.querySelector('[data-dcc-history="1"]');
  if(!edit||!create||!actions||!days||actions===root||actions.contains(days))return;
  compactButton(edit);compactButton(create);
  actions.dataset.dccRoutineHomeActions='1';
  actions.style.setProperty('display','grid','important');
  actions.style.setProperty('grid-template-columns','1fr 1fr','important');
  actions.style.setProperty('align-items','start','important');
  actions.style.setProperty('gap','8px','important');
  actions.style.setProperty('margin','8px 0 12px','important');
  actions.style.setProperty('padding','0','important');
  actions.style.setProperty('min-height','0','important');
  actions.style.setProperty('height','42px','important');
  actions.style.setProperty('max-height','42px','important');
  actions.style.setProperty('position','relative','important');
  actions.style.setProperty('inset','auto','important');
  if(days.nextElementSibling!==actions)days.insertAdjacentElement('afterend',actions);if(history){history.style.setProperty('margin','8px 0 12px','important');if(actions.nextElementSibling!==history)actions.insertAdjacentElement('afterend',history);}
}
function schedule(){if(raf)return;raf=requestAnimationFrame(()=>{raf=0;apply()})}
const s=document.createElement('style');s.id='dcc-training-home-actions-css';s.textContent=`
#coach-main[data-dcc-routine-home-mode="1"] .dcc-tr-days{padding-bottom:0!important;margin-bottom:0!important}
#coach-main [data-dcc-routine-home-actions="1"]{min-height:42px!important;height:42px!important;max-height:42px!important;overflow:visible!important}
#coach-main[data-dcc-routine-home-mode="1"] [data-dcc-history="1"]{width:100%!important;margin:8px 0 12px!important;background:linear-gradient(145deg,#fffefa,#fbf6ec)!important;border:1px solid rgba(183,123,19,.24)!important;border-radius:14px!important;box-shadow:0 8px 20px rgba(83,63,31,.06)!important;color:#17191d!important}
#coach-main[data-dcc-routine-home-mode="1"] [data-dcc-history="1"] .dcc-tr-history-head{min-height:42px!important;padding:9px 13px!important;background:transparent!important;color:#17191d!important}
#coach-main[data-dcc-routine-home-mode="1"] [data-dcc-history="1"] .dcc-tr-history-head small{color:#7b828c!important}
#coach-main[data-dcc-routine-home-mode="1"] [data-dcc-history="1"] .dcc-tr-arrow{color:#a66d0b!important}
#coach-main [data-dcc-routine-compact="1"]{min-height:42px!important;height:42px!important;max-height:42px!important;padding:7px 12px!important;margin:0!important;border-radius:14px!important;font-size:11px!important;line-height:1.05!important}
#coach-main [data-dcc-routine-compact="1"]:active{transform:scale(.98)!important;filter:brightness(.94)!important}
@media(max-width:390px){#coach-main [data-dcc-routine-home-actions="1"]{gap:7px!important}#coach-main [data-dcc-routine-compact="1"]{font-size:10px!important;padding:7px 8px!important}}
`;document.head.appendChild(s);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
new MutationObserver(schedule).observe(document.getElementById('coach-main')||document.body,{childList:true,subtree:true});
})();