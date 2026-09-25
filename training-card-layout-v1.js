/* DCC — tarjetas compactas del editor de rutina + reordenación táctil */
(function(){
'use strict';
const BUILD='20260925-training-card-layout-v3-structure';
if(window.__dccTrainingCardLayout===BUILD)return;window.__dccTrainingCardLayout=BUILD;
const root=()=>document.getElementById('coach-main');
const id=()=>String(window.selectedClient||'');
const days=()=>{const r=window.data?.routines?.[id()];return Array.isArray(r)?r:Array.isArray(r?.routine)?r.routine:[]};
function css(){if(document.getElementById('dcc-training-card-layout-css'))return;const s=document.createElement('style');s.id='dcc-training-card-layout-css';s.textContent=`
#coach-main .dcc-exercise-card{position:relative!important;display:block!important;min-height:0!important;height:auto!important;padding:11px 12px!important;margin:0 0 9px!important;border:1px solid rgba(183,123,19,.22)!important;border-radius:16px!important;background:linear-gradient(145deg,#fffefa,#fbf6ec)!important;box-shadow:0 7px 18px rgba(83,63,31,.055)!important}
#coach-main .dcc-exercise-card>div:first-child{display:grid!important;grid-template-columns:minmax(0,1fr) 34px 36px!important;align-items:center!important;gap:6px!important;margin:0 0 8px!important}
#coach-main .dcc-exercise-card>div:first-child>div:first-child{min-width:0!important}
#coach-main .dcc-exercise-card>div:first-child>div:first-child>div:first-child{font-size:17px!important;line-height:1.15!important;font-weight:850!important}
#coach-main .dcc-exercise-card>div:first-child .muted{margin-top:3px!important;font-size:10px!important;color:#7b828c!important}
#coach-main .dcc-exercise-card>div:nth-child(2){display:grid!important;grid-template-columns:1fr 1fr!important;gap:8px!important;margin:0!important}
#coach-main .dcc-exercise-card>div:nth-child(2) label{font-size:10px!important;font-weight:800!important;color:#4f5660!important}
#coach-main .dcc-exercise-card input{box-sizing:border-box!important;width:100%!important;min-height:39px!important;margin-top:4px!important;padding:8px 10px!important;border:1px solid rgba(183,123,19,.26)!important;border-radius:11px!important;background:#fffefa!important;color:#17191d!important;font-size:12px!important}
#coach-main .dcc-exercise-card>div:nth-child(3){display:grid!important;grid-template-columns:minmax(0,1fr) 88px!important;gap:7px!important;margin-top:9px!important}
#coach-main .dcc-exercise-card input[type=url]{min-height:39px!important;margin:0!important;font-size:10px!important}
#coach-main .dcc-exercise-card [data-dcc-video]{min-height:39px!important;border:1px solid #d9aa4a!important;border-radius:11px!important;background:linear-gradient(135deg,#f6d36e,#dda73a)!important;color:#17120a!important;font-size:10px!important;font-weight:900!important}
#coach-main .dcc-exercise-card [data-dcc-delete]{width:36px!important;height:36px!important;min-width:36px!important;margin:0!important}
#coach-main .dcc-method-badge{display:none!important}
#coach-main .dcc-exercise-card img,#coach-main .dcc-exercise-card .exercise-image,#coach-main .dcc-exercise-card .dcc-exercise-image{display:none!important}
#coach-main .dcc-exercise-card>div:empty{display:none!important}
#coach-main .dcc-exercise-card [style*="height"]{min-height:0!important}
#coach-main .dcc-drag-handle{width:34px;height:36px;display:grid;place-items:center;border:0;background:transparent;color:#737b86;font-size:21px;line-height:1;cursor:grab;touch-action:none;user-select:none;-webkit-user-select:none}

#coach-main .dcc-exercise-card{display:grid!important;grid-template-columns:1fr!important;grid-auto-rows:auto!important;align-items:stretch!important;gap:8px!important;overflow:hidden!important}
#coach-main .dcc-exercise-card>*{grid-column:1/-1!important;position:static!important;float:none!important;transform:none!important;max-width:100%!important;box-sizing:border-box!important}
#coach-main .dcc-exercise-card>div:first-child{width:100%!important;display:grid!important;grid-template-columns:minmax(0,1fr) 34px 36px!important;align-items:center!important;gap:6px!important;min-height:38px!important}
#coach-main .dcc-exercise-card>div:first-child>div:first-child{width:auto!important;max-width:none!important;min-width:0!important;display:block!important;position:static!important}
#coach-main .dcc-exercise-card>div:first-child>div:first-child>div:first-child{width:auto!important;max-width:100%!important;white-space:normal!important;word-break:normal!important;overflow-wrap:break-word!important;text-align:left!important}
#coach-main .dcc-exercise-card>div:nth-child(2),#coach-main .dcc-exercise-card>div:nth-child(3){width:100%!important;position:static!important}
#coach-main .dcc-exercise-card.dcc-dragging{opacity:.58;transform:scale(.99);box-shadow:0 12px 30px rgba(83,63,31,.15)!important}
`;document.head.appendChild(s)}
function dayIndexFor(card){const day=card.closest('.dcc-tr-day');if(!day)return -1;return [...root().querySelectorAll('.dcc-tr-days>.dcc-tr-day')].indexOf(day)}
function cardsInDay(card){const day=card.closest('.dcc-tr-day');return day?[...day.querySelectorAll('.dcc-exercise-card')].filter(x=>x.offsetParent!==null):[]}
function reorder(card,target){const di=dayIndexFor(card);if(di<0)return;const list=cardsInDay(card),from=list.indexOf(card),to=list.indexOf(target);if(from<0||to<0||from===to)return;const d=days()[di];if(!d||!Array.isArray(d.exercises))return;const [ex]=d.exercises.splice(from,1);d.exercises.splice(to,0,ex);window.dccMarkTrainingDraftDirty?.(id());try{window.saveData?.()}catch(_){};target.parentNode.insertBefore(card,to>from?target.nextSibling:target)}
function bind(card){if(card.dataset.dccCompactBound)return;card.dataset.dccCompactBound='1';card.querySelectorAll('img').forEach(img=>img.remove());[...card.children].forEach(el=>{if(el.children.length===0&&!el.textContent.trim()&&!el.matches('input,button'))el.remove()});const head=card.firstElementChild;if(!head)return;const del=[...card.querySelectorAll('button')].find(b=>b.dataset.dccDelete==='1'||(b.getAttribute('onclick')||'').includes('removeTrainingExercise'));if(del&&!del.dataset.dccDelete)del.dataset.dccDelete='1';let h=document.createElement('button');h.type='button';h.className='dcc-drag-handle';h.innerHTML='⠿';h.setAttribute('aria-label','Arrastrar para reordenar');h.setAttribute('title','Arrastrar para reordenar');if(del)head.insertBefore(h,del);else head.appendChild(h);
let active=false;
h.addEventListener('pointerdown',e=>{active=true;card.classList.add('dcc-dragging');h.setPointerCapture?.(e.pointerId);e.preventDefault()});
h.addEventListener('pointermove',e=>{if(!active)return;const under=document.elementFromPoint(e.clientX,e.clientY)?.closest?.('.dcc-exercise-card');if(under&&under!==card&&under.closest('.dcc-tr-day')===card.closest('.dcc-tr-day'))reorder(card,under);e.preventDefault()});
const end=()=>{active=false;card.classList.remove('dcc-dragging')};h.addEventListener('pointerup',end);h.addEventListener('pointercancel',end);
const url=card.querySelector('input[type=url]');if(url)url.placeholder='Enlace del vídeo (opcional)';
const vb=[...card.querySelectorAll('button')].find(b=>(b.textContent||'').includes('Ver vídeo'));if(vb)vb.dataset.dccVideo='1';
}
function apply(){css();root()?.querySelectorAll('.dcc-exercise-card').forEach(bind)}
let raf=0;function schedule(){if(raf)return;raf=requestAnimationFrame(()=>{raf=0;apply()})}
function start(){apply();new MutationObserver(schedule).observe(root()||document.body,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();