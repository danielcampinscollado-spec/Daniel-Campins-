/* DCC — un plan alimenticio puede ser válido con entrenamiento, descanso o ambos */
(function(){
'use strict';
const BUILD='20260915-nutrition-single-day-valid-v1';
if(window.__dccNutritionSingleDayValid===BUILD)return;
window.__dccNutritionSingleDayValid=BUILD;
let queued=false;

function clientId(){return String(window.selectedClient||window.__dccClientAdminId||window.currentClientId||'')}
function counts(id){const p=window.data?.diets?.[id]||{};return{training:Array.isArray(p?.training?.meals)?p.training.meals.length:0,rest:Array.isArray(p?.rest?.meals)?p.rest.meals.length:0}}
function norm(v){return String(v||'').replace(/\s+/g,' ').trim().toLowerCase()}
function exactText(root,from,to){
  const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const nodes=[];
  while(w.nextNode())nodes.push(w.currentNode);
  nodes.forEach(n=>{if(norm(n.nodeValue)===norm(from))n.nodeValue=to});
}
function apply(){
  const root=document.querySelector('#coach-main.dcc-ca');if(!root)return;
  const id=clientId();if(!id)return;
  const c=counts(id),hasAny=c.training>0||c.rest>0;if(!hasAny)return;

  // El segundo tipo de día es opcional. Solo se avisa al guardar; no convierte el plan en incompleto.
  exactText(root,'Plan sin terminar','Activo');
  exactText(root,'Continuar dieta actual','Editar plan');
  exactText(root,'Continúa donde lo dejaste y termina el plan','Modifica comidas, opciones y cantidades');

  root.querySelectorAll('.dcc-n2-status').forEach(el=>{el.textContent='Activo';el.classList.remove('off')});

  root.querySelectorAll('.dcc-v5-plan-item').forEach(item=>{
    if(norm(item).includes('alimentación sin terminar'))item.remove();
  });
  root.querySelectorAll('.dcc-v5-plan').forEach(box=>{
    if(!box.querySelector('.dcc-v5-plan-item'))box.remove();
  });
}
function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;apply()})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true,characterData:true});
document.addEventListener('click',()=>setTimeout(schedule,0),true);
window.addEventListener('pageshow',schedule);
})();