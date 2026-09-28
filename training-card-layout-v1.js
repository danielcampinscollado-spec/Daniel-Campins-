/* DCC — restaura tarjeta aprobada de ejercicios y añade arrastre. */
(function(){
'use strict';
const BUILD='20260925-training-card-approved-v9-actions-right';
if(window.__dccTrainingCardApproved===BUILD)return;window.__dccTrainingCardApproved=BUILD;
const root=()=>document.getElementById('coach-main');
const rid=()=>String(window.selectedClient||'');
const routine=()=>{const r=window.data?.routines?.[rid()];return Array.isArray(r)?r:Array.isArray(r?.routine)?r.routine:[]};
function css(){if(document.getElementById('dcc-training-card-layout-css'))document.getElementById('dcc-training-card-layout-css').remove();const s=document.createElement('style');s.id='dcc-training-card-layout-css';s.textContent=`
#coach-main .dcc-exercise-card{display:block!important;position:relative!important;width:100%!important;height:auto!important;min-height:0!important;margin:0!important;padding:7px 9px!important;box-sizing:border-box!important;border-radius:11px!important;overflow:visible!important}
#coach-main .dcc-exercise-card img,#coach-main .dcc-exercise-card .exercise-image,#coach-main .dcc-exercise-card .dcc-exercise-image,#coach-main .dcc-method-badge{display:none!important}
#coach-main .dcc-exercise-card>.dcc-approved-head{display:grid!important;grid-template-columns:minmax(0,1fr) auto!important;align-items:start!important;gap:8px!important;margin:0 0 5px!important;width:100%!important}
#coach-main .dcc-approved-info{display:block!important;min-width:0!important;width:auto!important}\n#coach-main .dcc-approved-actions{display:flex!important;align-items:center!important;justify-content:flex-end!important;gap:3px!important;width:auto!important;min-width:65px!important}
#coach-main .dcc-approved-name{font-size:15px!important;line-height:1.15!important;font-weight:850!important;white-space:normal!important;word-break:normal!important;overflow-wrap:break-word!important}
#coach-main .dcc-approved-muscle{margin-top:2px!important;font-size:10px!important;color:#7b828c!important}
#coach-main .dcc-approved-fields{display:grid!important;grid-template-columns:104px minmax(0,1fr)!important;gap:6px!important;margin:0!important;width:100%!important}
#coach-main .dcc-approved-fields label{font-size:10px!important;font-weight:800!important;color:#747b85!important}
#coach-main .dcc-approved-fields input{box-sizing:border-box!important;width:100%!important;min-height:36px!important;margin-top:2px!important;padding:5px 9px!important;border:1px solid rgba(183,123,19,.26)!important;border-radius:11px!important;background:#fffefa!important;color:#17191d!important;font-size:12px!important}
#coach-main .dcc-approved-video{display:grid!important;grid-template-columns:minmax(0,1fr) 84px!important;gap:5px!important;margin-top:6px!important;width:100%!important}
#coach-main .dcc-approved-video input{box-sizing:border-box!important;width:100%!important;min-width:0!important;height:36px!important;border:1px solid rgba(183,123,19,.24)!important;border-radius:10px!important;background:#fffdf9!important;padding:0 10px!important;color:#171717!important;font-size:10px!important}
#coach-main .dcc-approved-video button{height:36px!important;border:1px solid #d9aa4a!important;border-radius:9px!important;background:linear-gradient(135deg,#f3cf69,#d9a63d)!important;color:#17120a!important;font-size:10px!important;font-weight:900!important}
#coach-main .dcc-approved-delete{width:32px!important;height:30px!important;min-width:32px!important;padding:0!important;border-radius:9px!important;border:1px solid rgba(190,48,55,.34)!important;color:#b92f38!important;background:rgba(190,48,55,.025)!important;display:grid!important;place-items:center!important}
#coach-main .dcc-approved-delete svg{width:15px;height:15px}
#coach-main .dcc-drag-handle{width:30px!important;height:30px!important;padding:0!important;border:0!important;background:transparent!important;color:#737b86!important;font-size:20px!important;display:grid!important;place-items:center!important;cursor:grab!important;touch-action:none!important}
#coach-main .dcc-exercise-card.dcc-dragging{opacity:.58!important}
`;document.head.appendChild(s)}
function dayIndex(card){const d=card.closest('.dcc-tr-day');return d?[...root().querySelectorAll('.dcc-tr-days>.dcc-tr-day')].indexOf(d):-1}
function reorder(card,target){const di=dayIndex(card);if(di<0)return;const parent=card.parentElement;const cards=[...parent.querySelectorAll(':scope>.dcc-exercise-card')];const from=cards.indexOf(card),to=cards.indexOf(target);if(from<0||to<0||from===to)return;const d=routine()[di];if(!d?.exercises)return;const [ex]=d.exercises.splice(from,1);d.exercises.splice(to,0,ex);window.dccMarkTrainingDraftDirty?.(rid());try{window.saveData?.()}catch(_){};parent.insertBefore(card,to>from?target.nextSibling:target)}
function rebuild(card){
 if(card.dataset.dccApproved==='1')return;card.dataset.dccApproved='1';
 const nameNode=[...card.querySelectorAll('div')].find(el=>el.children.length===0&&(el.textContent||'').trim()&&!(el.classList.contains('muted')));
 const muted=card.querySelector('.muted'); const name=(nameNode?.textContent||'Ejercicio').trim(), muscle=(muted?.textContent||'').trim();
 const labels=[...card.querySelectorAll('label')];const series=labels.find(l=>/^Series(?:\s+de\s+superserie)?$/i.test((l.childNodes[0]?.textContent||'').trim()))?.querySelector('input');const reps=labels.find(l=>/^Repeticiones$/i.test((l.childNodes[0]?.textContent||'').trim()))?.querySelector('input');
 const url=card.querySelector('input[type="url"]');const oldDelete=[...card.querySelectorAll('button')].find(b=>(b.getAttribute('onclick')||'').includes('removeTrainingExercise'));const oldVideo=[...card.querySelectorAll('button')].find(b=>(b.textContent||'').includes('Ver vídeo'));
 if(!series||!reps)return;
 const seriesInput=series.cloneNode(true),repsInput=reps.cloneNode(true),urlInput=url?url.cloneNode(true):document.createElement('input');
 if(!url)urlInput.type='url';urlInput.placeholder='Enlace del vídeo (opcional)';
 const head=document.createElement('div');head.className='dcc-approved-head';head.innerHTML='<div class="dcc-approved-info"><div class="dcc-approved-name"></div><div class="dcc-approved-muscle"></div></div>';
 head.querySelector('.dcc-approved-name').textContent=name;head.querySelector('.dcc-approved-muscle').textContent=muscle;
 const del=oldDelete?oldDelete.cloneNode(true):document.createElement('button');del.classList.add('dcc-approved-delete');if(!oldDelete)del.type='button';const actions=document.createElement('div');actions.className='dcc-approved-actions';actions.appendChild(del);const drag=document.createElement('button');drag.type='button';drag.className='dcc-drag-handle';drag.setAttribute('aria-label','Arrastrar para reordenar');drag.title='Arrastrar para reordenar';drag.textContent='⠿';actions.appendChild(drag);head.appendChild(actions);
 const fields=document.createElement('div');fields.className='dcc-approved-fields';const l1=document.createElement('label');l1.append('Series',seriesInput);const l2=document.createElement('label');l2.append('Repeticiones',repsInput);fields.append(l1,l2);
 const video=document.createElement('div');video.className='dcc-approved-video';const vb=oldVideo?oldVideo.cloneNode(true):document.createElement('button');if(!oldVideo){vb.type='button';vb.textContent='Ver vídeo'}video.append(urlInput,vb);
 card.replaceChildren(head,fields,video);
 const sync=(clone,orig)=>clone.addEventListener('input',()=>{orig.value=clone.value;orig.dispatchEvent(new Event('input',{bubbles:true}))});sync(seriesInput,series);sync(repsInput,reps);if(url)sync(urlInput,url);
 if(oldDelete)del.addEventListener('click',e=>{e.preventDefault();oldDelete.click()});if(oldVideo)vb.addEventListener('click',e=>{e.preventDefault();oldVideo.click()});
 const h=drag;let active=false;h.addEventListener('pointerdown',e=>{active=true;card.classList.add('dcc-dragging');h.setPointerCapture?.(e.pointerId);e.preventDefault()});h.addEventListener('pointermove',e=>{if(!active)return;const t=document.elementFromPoint(e.clientX,e.clientY)?.closest?.('.dcc-exercise-card');if(t&&t!==card&&t.parentElement===card.parentElement)reorder(card,t)});const end=()=>{active=false;card.classList.remove('dcc-dragging')};h.addEventListener('pointerup',end);h.addEventListener('pointercancel',end);
}
function markNativeCards(){const rt=root();if(!rt)return;rt.querySelectorAll('.card').forEach(card=>{if(card.classList.contains('dcc-exercise-card'))return;const hasSeries=[...card.querySelectorAll('label')].some(l=>/^Series(?:\s+de\s+superserie)?$/i.test((l.childNodes[0]?.textContent||'').trim()));const hasReps=[...card.querySelectorAll('label')].some(l=>/^Repeticiones$/i.test((l.childNodes[0]?.textContent||'').trim()));const hasDelete=[...card.querySelectorAll('button')].some(b=>(b.getAttribute('onclick')||'').includes('removeTrainingExercise'));if(hasSeries&&hasReps&&hasDelete)card.classList.add('dcc-exercise-card')})}
function apply(){css();markNativeCards();root()?.querySelectorAll('.dcc-exercise-card').forEach(rebuild)}
let raf=0;function schedule(){if(raf)return;raf=requestAnimationFrame(()=>{raf=0;apply()})}
function start(){apply();new MutationObserver(schedule).observe(root()||document.body,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();