/* DCC — ajuste visual + cierre guiado de creación de alimentación. */
(function(){
'use strict';
const BUILD='20260917-nutrition-visual-audit-v4-guided-create';
if(window.__dccNutritionVisualOnly===BUILD)return;
window.__dccNutritionVisualOnly=BUILD;
const STYLE_ID='dcc-coach-client-visual-hotfix-v1';
const TEMPLATE_PREFIX='dcc:diet-meal-template:v8:';
let observer=null,scheduled=false,finishing=false;

function getData(){try{return typeof data!=='undefined'?data:(window.data||null)}catch(_){return window.data||null}}
function getDb(){try{return typeof supabaseClient!=='undefined'?supabaseClient:(window.supabaseClient||null)}catch(_){return window.supabaseClient||null}}
function clone(v){return JSON.parse(JSON.stringify(v??null))}
function norm(v){return String(v||'').trim().toLowerCase().replace(/[-–—]/g,' ').replace(/\s+/g,' ')}
function getTemplate(id){
  if(!id)return[];
  try{const x=JSON.parse(localStorage.getItem(TEMPLATE_PREFIX+id)||'[]');return Array.isArray(x)?x.filter(Boolean):[]}catch(_){return[]}
}
function optionsOf(meal){
  if(Array.isArray(meal?.options)&&meal.options.length)return meal.options;
  if(Array.isArray(meal?.foods))return[{foods:meal.foods}];
  return[];
}
function dayComplete(id,type,names){
  const app=getData(),meals=app?.diets?.[id]?.[type]?.meals;
  if(!Array.isArray(meals)||!names.length)return false;
  const wanted=new Set(names.map(norm));
  const relevant=meals.filter(m=>wanted.has(norm(m?.name)));
  return relevant.length===names.length&&relevant.every(m=>optionsOf(m).some(o=>Array.isArray(o?.foods)&&o.foods.length>0));
}
function installCss(){
  const previous=document.getElementById(STYLE_ID);if(previous)previous.remove();
  const style=document.createElement('style');style.id=STYLE_ID;style.textContent=`
html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-ca-back{margin-bottom:0!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-ca-profilebar{margin:8px 2px 6px!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-ca-tabs{margin:8px 0 10px!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-n2-card .dcc-n2-plan{grid-template-columns:minmax(0,1fr)!important;gap:0!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-n2-card .dcc-n2-plan>.dcc-n2-ico{display:none!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-light-routine-history-fix{background:linear-gradient(145deg,#fffefa 0%,#f8f0e3 100%)!important;color:#17191d!important;border:1px solid rgba(183,123,19,.27)!important;box-shadow:0 8px 20px rgba(78,58,28,.06),inset 0 1px 0 rgba(255,255,255,.96)!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-light-routine-history-fix *{color:#5f6874!important;text-shadow:none!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-light-routine-history-fix b,html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-light-routine-history-fix strong{color:#17191d!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-light-routine-history-fix button{background:#fff1c8!important;color:#99650b!important;border:1px solid rgba(183,123,19,.26)!important;box-shadow:none!important}
#coach-main .dcc-nutrition-create-footer{margin-top:12px;padding:14px;border:1px solid rgba(183,123,19,.24);border-radius:18px;background:linear-gradient(145deg,#fffefa,#f8f0e3);color:#17191d}
#coach-main .dcc-nutrition-create-footer b{display:block;font-size:14px;color:#17191d}
#coach-main .dcc-nutrition-create-footer p{margin:5px 0 11px;color:#747c87;font-size:10px;line-height:1.45}
#coach-main .dcc-nutrition-create-next{width:100%;min-height:50px;border:1px solid #e3b34f;border-radius:14px;background:linear-gradient(135deg,#f5d577,#dda73e);color:#17110a;font-size:12px;font-weight:900}
#coach-main .dcc-nutrition-create-next:disabled{opacity:.42;box-shadow:none}
#coach-main .dcc-nutrition-create-progress{display:flex;gap:6px;margin-bottom:9px}
#coach-main .dcc-nutrition-create-progress span{flex:1;height:4px;border-radius:999px;background:#e7ded0}
#coach-main .dcc-nutrition-create-progress span.done{background:#d8a333}
`;(document.head||document.documentElement).appendChild(style)
}
function markRoutineHistory(){
  const main=document.getElementById('coach-main');if(!main||!main.classList.contains('dcc-ca'))return;
  [...main.querySelectorAll('button,section,article,div')].forEach(el=>{
    if(el.classList.contains('dcc-ca-wrap'))return;
    const text=String(el.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();
    if(!text.includes('rutina anterior')||text.length>180)return;
    const rect=el.getBoundingClientRect();if(rect.width<180||rect.height<42)return;el.classList.add('dcc-light-routine-history-fix')
  })
}
function selectedClientId(){return window.selectedClient||window.__dccClientAdminId||null}
function applyCreationFlow(){
  const id=selectedClientId(),names=getTemplate(id),main=document.getElementById('coach-main');
  if(!id||!names.length||!main)return;
  const mealsBox=main.querySelector('.dcc-diet-meals');
  if(!mealsBox)return;
  const allowed=new Set(names.map(norm));
  main.querySelectorAll('.dcc-diet-meal').forEach(row=>{
    const name=row.querySelector('.dcc-diet-name')?.textContent||'';
    row.style.display=allowed.has(norm(name))?'':'none';
  });
  const addMeal=main.querySelector('.dcc-diet-add-meal');if(addMeal)addMeal.style.display='none';
  const back=[...main.querySelectorAll('.dcc-tr-cancel')].find(b=>/volver al plan/i.test(b.textContent||''));if(back)back.style.display='none';
  const type=window.__dccDietType==='rest'?'rest':'training';
  const trainingDone=dayComplete(id,'training',names),restDone=dayComplete(id,'rest',names);
  let footer=main.querySelector('.dcc-nutrition-create-footer');if(footer)footer.remove();
  footer=document.createElement('section');footer.className='dcc-nutrition-create-footer';
  if(type==='training'){
    footer.innerHTML=`<div class="dcc-nutrition-create-progress"><span class="done"></span><span></span></div><b>Siguiente paso · Día de descanso</b><p>${trainingDone?'Has completado el día de entrenamiento. Ahora configura la alimentación que seguirá el cliente en sus días de descanso.':'Completa todas las comidas del día de entrenamiento para continuar con el día de descanso.'}</p><button type="button" class="dcc-nutrition-create-next" ${trainingDone?'':'disabled'}>Configurar día de descanso</button>`;
    footer.querySelector('button').addEventListener('click',()=>{
      if(!dayComplete(id,'training',names))return;
      window.__dccDietType='rest';window.__dccDietOpenMeal=null;
      if(typeof window.dccClientAdmin==='function')window.dccClientAdmin(id,'food');
    });
  }else{
    const canFinish=trainingDone&&restDone;
    footer.innerHTML=`<div class="dcc-nutrition-create-progress"><span class="done"></span><span class="${restDone?'done':''}"></span></div><b>Último paso · Guardar plan</b><p>${canFinish?'Día de entrenamiento y día de descanso están completos. Ya puedes guardar el plan de alimentación.':'Completa todas las comidas del día de descanso. Después podrás guardar el plan completo.'}</p><button type="button" class="dcc-nutrition-create-next" ${canFinish?'':'disabled'}>Guardar plan de alimentación</button>`;
    footer.querySelector('button').addEventListener('click',()=>finishCreation(id,names));
  }
  mealsBox.insertAdjacentElement('afterend',footer);
}
async function finishCreation(id,names){
  if(finishing||!dayComplete(id,'training',names)||!dayComplete(id,'rest',names))return;
  const app=getData(),db=getDb();if(!app?.diets?.[id]||!db){alert('No se pudo guardar el plan. No se ha aplicado ningún cambio.');return}
  finishing=true;const button=document.querySelector('.dcc-nutrition-create-next');if(button){button.disabled=true;button.textContent='Guardando…'}
  try{
    const allowed=new Set(names.map(norm)),current=clone(app.diets[id])||{};
    const cleanDay=day=>({...(clone(day)||{}),meals:(Array.isArray(day?.meals)?day.meals:[]).filter(m=>allowed.has(norm(m?.name))) });
    const next={training:cleanDay(current.training),rest:cleanDay(current.rest)};
    const{data:ok,error}=await db.rpc('dcc_save_diet_plan',{p_client_id:String(id),p_training:next.training,p_rest:next.rest});
    if(error)throw error;if(ok!==true)throw new Error('El servidor no confirmó el guardado');
    next.__dccPlanInitialized=true;app.diets[id]=next;window.data=app;
    if(typeof window.saveData==='function')window.saveData();
    localStorage.removeItem(TEMPLATE_PREFIX+id);
    window.__dccDietEditing=false;window.__dccDietType='training';window.__dccDietOpenMeal=null;
    if(typeof window.toast==='function')window.toast('Plan de alimentación guardado');
    if(typeof window.dccNutritionV2Home==='function')await window.dccNutritionV2Home(id);else if(typeof window.dccClientAdmin==='function')window.dccClientAdmin(id,'food');
  }catch(error){console.error('DCC nutrition creation finish:',error);alert('No se pudo guardar el plan de alimentación. No se ha aplicado el cierre del plan.');finishing=false;applyCreationFlow()}
}
function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;markRoutineHistory();applyCreationFlow()})}
function refresh(){requestAnimationFrame(()=>{installCss();markRoutineHistory();applyCreationFlow()})}
installCss();markRoutineHistory();applyCreationFlow();
document.addEventListener('dcc:coach-screen',e=>{if(e.detail?.screen)refresh()});
observer=new MutationObserver(schedule);observer.observe(document.documentElement,{childList:true,subtree:true});
})();