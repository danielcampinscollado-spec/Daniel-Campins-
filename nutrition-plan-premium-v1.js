/* DCC — flujo guiado y seguro de creación de alimentación. */
(function(){
'use strict';
const BUILD='20260917-nutrition-visual-audit-v8-safe-create-flow';
if(window.__dccNutritionVisualOnly===BUILD)return;
window.__dccNutritionVisualOnly=BUILD;
const STYLE_ID='dcc-coach-client-visual-hotfix-v1';
const TEMPLATE_PREFIX='dcc:diet-meal-template:v8:';
let observer=null,scheduled=false,finishing=false,restBuilder=null;

function getData(){try{return typeof data!=='undefined'?data:(window.data||null)}catch(_){return window.data||null}}
function getDb(){try{return typeof supabaseClient!=='undefined'?supabaseClient:(window.supabaseClient||null)}catch(_){return window.supabaseClient||null}}
function clone(v){return JSON.parse(JSON.stringify(v??null))}
function norm(v){return String(v||'').trim().toLowerCase().replace(/[-–—]/g,' ').replace(/\s+/g,' ')}
function optionsOf(m){if(Array.isArray(m?.options)&&m.options.length)return m.options;if(Array.isArray(m?.foods))return[{foods:m.foods}];return[]}
function foodCount(meals){return(Array.isArray(meals)?meals:[]).reduce((n,m)=>n+optionsOf(m).reduce((s,o)=>s+(Array.isArray(o?.foods)?o.foods.length:0),0),0)}
function selectedClientId(){return window.__dccClientAdminId||window.selectedClient||window.selectedClientId||null}
function dayMeals(id,type){const a=getData()?.diets?.[id]?.[type]?.meals;return Array.isArray(a)?a:[]}
function mealNames(id,type){return dayMeals(id,type).map(m=>m?.name).filter(Boolean)}
function sameNames(a,b){if(a.length!==b.length)return false;return a.every((x,i)=>norm(x?.name)===norm(b[i]?.name))}
function isFinalized(id){return dayMeals(id,'training').some(m=>m?.__dccPlanFinalized===true)}
function creationNames(id){
  if(!id||isFinalized(id))return[];
  try{const x=JSON.parse(localStorage.getItem(TEMPLATE_PREFIX+id)||'[]');if(Array.isArray(x)&&x.length)return x.filter(Boolean)}catch(_){}
  const tr=dayMeals(id,'training'),re=dayMeals(id,'rest');
  if(!tr.length)return[];
  if(tr.some(m=>m?.__dccCreating===true))return tr.map(m=>m?.name).filter(Boolean);
  const tf=foodCount(tr),rf=foodCount(re);
  if(tf>0&&rf===0)return tr.map(m=>m?.name).filter(Boolean);
  if(tf===0&&rf===0&&(!re.length||sameNames(tr,re)))return tr.map(m=>m?.name).filter(Boolean);
  return[];
}
function dayComplete(id,type,names){const ms=dayMeals(id,type);if(!ms.length||!names.length)return false;const wanted=new Set(names.map(norm)),relevant=ms.filter(m=>wanted.has(norm(m?.name)));return relevant.length===names.length&&relevant.every(m=>optionsOf(m).some(o=>Array.isArray(o?.foods)&&o.foods.length>0))}
function meal(name){return{name,options:[{name:'Opción 1',foods:[]}]}}
function currentNotes(id){const d=getData()?.diets?.[id]||{};return String(d?.training?.notes??d?.rest?.notes??'')}
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}

function installCss(){
 const old=document.getElementById(STYLE_ID);if(old)old.remove();const s=document.createElement('style');s.id=STYLE_ID;s.textContent=`
html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-ca-back{margin-bottom:0!important}html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-ca-profilebar{margin:8px 2px 6px!important}html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-ca-tabs{margin:8px 0 10px!important}
#coach-main .dcc-nutrition-create-footer{margin-top:12px;padding:15px;border:1px solid rgba(183,123,19,.28);border-radius:18px;background:linear-gradient(145deg,#fffefa,#f8f0e3);color:#17191d}#coach-main .dcc-nutrition-create-footer b{display:block;font-size:14px;color:#17191d}#coach-main .dcc-nutrition-create-footer p{margin:5px 0 12px;color:#747c87;font-size:10px;line-height:1.45}#coach-main .dcc-nutrition-create-actions{display:grid;grid-template-columns:1fr 1.15fr;gap:8px}#coach-main .dcc-nutrition-create-next,#coach-main .dcc-nutrition-create-save{min-height:50px;border-radius:14px;font-size:11px;font-weight:900}#coach-main .dcc-nutrition-create-next{border:1px solid #e3b34f;background:linear-gradient(135deg,#f5d577,#dda73e);color:#17110a}#coach-main .dcc-nutrition-create-save{border:1px solid #d39c2d;background:#fffdf8;color:#765217}
#coach-main .dcc-nutrition-notes{margin-top:12px;padding:12px;border:1px solid rgba(183,123,19,.18);border-radius:14px;background:#fffdf8}#coach-main .dcc-nutrition-notes summary{cursor:pointer;list-style:none;font-size:12px;font-weight:900;color:#17191d}#coach-main .dcc-nutrition-notes summary::-webkit-details-marker{display:none}#coach-main .dcc-nutrition-notes small{display:block;margin:6px 0 8px;color:#858b93;font-size:9px;line-height:1.4}#coach-main .dcc-nutrition-notes textarea{width:100%;min-height:92px;padding:11px 12px;border:1px solid rgba(183,123,19,.24);border-radius:13px;background:#fff;color:#17191d;font:inherit;font-size:11px;line-height:1.45;resize:vertical;outline:none}
#coach-main .dcc-rest-builder{display:grid;gap:12px;margin-top:10px}#coach-main .dcc-rest-head,#coach-main .dcc-rest-card{padding:15px;border:1px solid rgba(183,123,19,.22);border-radius:18px;background:#fffdf8}#coach-main .dcc-rest-head h2{margin:0;font-size:19px;color:#17191d}#coach-main .dcc-rest-head p{margin:6px 0 0;color:#747c87;font-size:10px;line-height:1.45}#coach-main .dcc-rest-list,#coach-main .dcc-rest-order{display:grid;gap:6px}#coach-main .dcc-rest-pick{width:100%;min-height:48px;display:grid;grid-template-columns:1fr 32px;align-items:center;padding:8px 11px;border:1px solid rgba(183,123,19,.18);border-radius:13px;background:#fff;color:#17191d;text-align:left;font-weight:850}#coach-main .dcc-rest-pick.added{opacity:.42}#coach-main .dcc-rest-pick span:last-child{font-size:20px;text-align:center}#coach-main .dcc-rest-row{display:grid;grid-template-columns:28px 1fr 32px;align-items:center;gap:8px;min-height:46px;padding:7px 8px;border:1px solid rgba(183,123,19,.18);border-radius:13px;background:#fff}#coach-main .dcc-rest-num{width:27px;height:27px;display:grid;place-items:center;border-radius:50%;background:linear-gradient(135deg,#f5d577,#dda73e);font-size:10px;font-weight:900}#coach-main .dcc-rest-remove{width:30px;height:30px;border:1px solid rgba(180,75,80,.2);border-radius:9px;background:#fff;color:#b44b50;font-weight:900}#coach-main .dcc-rest-empty{padding:18px;border:1px dashed rgba(183,123,19,.28);border-radius:13px;color:#8a8f96;font-size:10px;text-align:center}#coach-main .dcc-rest-create{width:100%;min-height:52px;border:1px solid #e3b34f;border-radius:15px;background:linear-gradient(135deg,#f5d577,#dda73e);color:#17110a;font-weight:900}#coach-main .dcc-rest-create:disabled{opacity:.42}
@media(max-width:520px){#coach-main .dcc-nutrition-create-actions{grid-template-columns:1fr}}
`;(document.head||document.documentElement).appendChild(s)
}

function hookClientAdmin(){const fn=window.dccClientAdmin;if(typeof fn!=='function'||fn.__dccCreationTracked)return;const wrapped=function(id){window.__dccClientAdminId=id;return fn.apply(this,arguments)};Object.keys(fn).forEach(k=>{try{wrapped[k]=fn[k]}catch(_){}});wrapped.__dccCreationTracked=true;wrapped.__dccOriginal=fn;window.dccClientAdmin=wrapped}
function hookMealSetupCreate(){
 const fn=window.dccMealSetupCreate;if(typeof fn!=='function'||fn.__dccSafeCreate)return;
 const wrapped=async function(){
   const id=selectedClientId(),app=getData(),db=getDb(),before=clone(app?.diets?.[id])||{};
   const existingFoods=foodCount(before?.training?.meals)+foodCount(before?.rest?.meals);
   if(existingFoods>0&&!creationNames(id).length){
     alert('Este cliente ya tiene una alimentación creada. Para protegerla, ábrela desde Editar plan.');
     if(typeof window.dccNutritionV2Edit==='function')return window.dccNutritionV2Edit(id);
     return false;
   }
   const result=await fn.apply(this,arguments);
   if(!id||!app?.diets?.[id]||!db)return result;
   const plan=clone(app.diets[id]),tr=clone(plan.training)||{calories:'',protein:'',meals:[]};
   if(Array.isArray(tr.meals)&&tr.meals.length){tr.meals[0].__dccCreating=true;delete tr.meals[0].__dccPlanFinalized}
   const rest={calories:'',protein:'',meals:[],notes:''};
   try{
     const{data:ok,error}=await db.rpc('dcc_save_diet_plan',{p_client_id:String(id),p_training:tr,p_rest:rest});
     if(error)throw error;if(ok!==true)throw new Error('Guardado no confirmado');
     app.diets[id]={training:tr,rest,__dccPlanInitialized:true};window.data=app;if(typeof window.saveData==='function')window.saveData();
     window.__dccDietEditing=true;window.__dccDietType='training';window.__dccDietOpenMeal=null;
     if(typeof window.dccClientAdmin==='function')window.dccClientAdmin(id,'food');
   }catch(e){console.error('DCC safe initial structure:',e);alert('No se pudo preparar la estructura de la dieta de forma segura.')}
   return result;
 };
 wrapped.__dccSafeCreate=true;wrapped.__dccOriginal=fn;window.dccMealSetupCreate=wrapped;
}

function notesMarkup(id){return `<details class="dcc-nutrition-notes"><summary>Notas para el cliente</summary><small>Opcional. Puedes indicar suplementación, agua diaria, si los alimentos se pesan en crudo o cocinados, horarios u otras pautas.</small><textarea id="dcc-nutrition-plan-notes" placeholder="Ej.: Beber 2,5 L de agua al día. Pesar arroz, pasta y carne en crudo…">${esc(currentNotes(id))}</textarea></details>`}
function readNotes(){return String(document.getElementById('dcc-nutrition-plan-notes')?.value||'').trim()}

function applyCreationFlow(){
 hookClientAdmin();hookMealSetupCreate();
 const id=selectedClientId(),names=creationNames(id),main=document.getElementById('coach-main');
 if(!id||!names.length||!main||restBuilder)return;
 const mealsBox=main.querySelector('.dcc-diet-meals');if(!mealsBox)return;
 const type=window.__dccDietType==='rest'?'rest':'training';
 const trainingDone=dayComplete(id,'training',names),restMeals=dayMeals(id,'rest'),restNames=mealNames(id,'rest');
 if(type==='rest'&&(!restMeals.length||(foodCount(restMeals)===0&&sameNames(dayMeals(id,'training'),restMeals)))){openRestBuilder(id,names,currentNotes(id));return}
 const allowed=new Set((type==='rest'?restNames:names).map(norm));
 main.querySelectorAll('.dcc-diet-meal').forEach(row=>{const n=row.querySelector('.dcc-diet-name')?.textContent||'';row.style.display=allowed.has(norm(n))?'':'none'});
 const addMeal=main.querySelector('.dcc-diet-add-meal');if(addMeal)addMeal.style.display='none';
 const back=[...main.querySelectorAll('.dcc-tr-cancel')].find(b=>/volver al plan/i.test(b.textContent||''));if(back)back.style.display='none';
 const restDone=restNames.length?dayComplete(id,'rest',restNames):false,sig=type+':'+(trainingDone?'1':'0')+':'+(restDone?'1':'0');
 let footer=main.querySelector('.dcc-nutrition-create-footer');if(footer?.dataset.flowSig===sig)return;if(footer)footer.remove();
 footer=document.createElement('section');footer.className='dcc-nutrition-create-footer';footer.dataset.flowSig=sig;
 if(type==='training'){
   if(trainingDone){
     footer.innerHTML=`<b>¿Quieres crear también una dieta para los días de descanso?</b><p>Es opcional. Puedes guardar ahora solo el día de entrenamiento o configurar una alimentación diferente para los días en que el cliente no entrena.</p>${notesMarkup(id)}<div class="dcc-nutrition-create-actions"><button type="button" class="dcc-nutrition-create-save">Guardar solo día de entrenamiento</button><button type="button" class="dcc-nutrition-create-next">Configurar día de descanso →</button></div>`;
     footer.querySelector('.dcc-nutrition-create-save').addEventListener('click',()=>finishCreation(id,names,false,readNotes()));
     footer.querySelector('.dcc-nutrition-create-next').addEventListener('click',()=>openRestBuilder(id,names,readNotes()));
   }else footer.innerHTML=`<b>Completa el día de entrenamiento</b><p>Cuando todas las comidas tengan alimentos, podrás guardar esta dieta o crear de forma opcional una dieta distinta para los días de descanso.</p>`;
 }else{
   footer.innerHTML=`<b>${restDone?'Dieta de descanso completada':'Completa el día de descanso'}</b><p>${restDone?'Revisa las notas y guarda el plan completo.':'Rellena todas las comidas elegidas para el día de descanso.'}</p>${restDone?notesMarkup(id):''}${restDone?'<button type="button" class="dcc-nutrition-create-next" style="width:100%">Guardar plan de alimentación</button>':''}`;
   footer.querySelector('.dcc-nutrition-create-next')?.addEventListener('click',()=>finishCreation(id,names,true,readNotes()));
 }
 mealsBox.insertAdjacentElement('afterend',footer)
}

function openRestBuilder(id,trainingNames,notes){const main=document.getElementById('coach-main'),wrap=main?.querySelector('.dcc-ca-wrap');if(!wrap)return;restBuilder={id,trainingNames:[...trainingNames],selected:[],notes:String(notes||'')};window.__dccDietType='rest';const pane=wrap.lastElementChild;if(pane)renderRestBuilder(pane)}
function renderRestBuilder(pane){if(!restBuilder)return;const all=['Desayuno','Merienda mañana','Comida','Merienda tarde','Cena','Post-cena'],sel=restBuilder.selected;pane.innerHTML=`<div class="dcc-rest-builder"><div class="dcc-rest-head"><h2>Configurar día de descanso</h2><p>Elige de nuevo las comidas desde cero y en el orden que quieras. Pre-entreno y Post-entreno no aparecen porque este día no hay entrenamiento.</p></div><div class="dcc-rest-card"><b style="display:block;margin-bottom:8px">Comidas disponibles</b><div class="dcc-rest-list">${all.map(n=>`<button type="button" class="dcc-rest-pick ${sel.includes(n)?'added':''}" data-rest-add="${esc(n)}" ${sel.includes(n)?'disabled':''}><span>${esc(n)}</span><span>＋</span></button>`).join('')}</div></div><div class="dcc-rest-card"><b style="display:block;margin-bottom:8px">Orden del día de descanso</b><div class="dcc-rest-order">${sel.length?sel.map((n,i)=>`<div class="dcc-rest-row"><span class="dcc-rest-num">${i+1}</span><b>${esc(n)}</b><button type="button" class="dcc-rest-remove" data-rest-remove="${esc(n)}">−</button></div>`).join(''):'<div class="dcc-rest-empty">Aquí aparecerán las comidas en el orden en que las añadas.</div>'}</div></div><button type="button" class="dcc-rest-create" ${sel.length?'':'disabled'}>Crear estructura del día de descanso</button></div>`;pane.querySelectorAll('[data-rest-add]').forEach(b=>b.addEventListener('click',()=>{restBuilder.selected.push(b.dataset.restAdd);renderRestBuilder(pane)}));pane.querySelectorAll('[data-rest-remove]').forEach(b=>b.addEventListener('click',()=>{restBuilder.selected=restBuilder.selected.filter(x=>x!==b.dataset.restRemove);renderRestBuilder(pane)}));pane.querySelector('.dcc-rest-create')?.addEventListener('click',createRestStructure)}
async function createRestStructure(){if(!restBuilder?.selected.length)return;const{id,selected,notes}=restBuilder,app=getData(),db=getDb();if(!app?.diets?.[id]||!db)return;const current=clone(app.diets[id]),training=clone(current.training)||{calories:'',protein:'',meals:[]},rest={calories:'',protein:'',meals:selected.map(meal),notes};training.notes=notes;try{const{data:ok,error}=await db.rpc('dcc_save_diet_plan',{p_client_id:String(id),p_training:training,p_rest:rest});if(error)throw error;if(ok!==true)throw new Error('Guardado no confirmado');app.diets[id]={training,rest,__dccPlanInitialized:true};window.data=app;if(typeof window.saveData==='function')window.saveData();restBuilder=null;window.__dccDietType='rest';window.__dccDietOpenMeal=null;if(typeof window.dccClientAdmin==='function')window.dccClientAdmin(id,'food')}catch(e){console.error('DCC rest structure:',e);alert('No se pudo crear la estructura del día de descanso.')}}
async function finishCreation(id,names,withRest,notes){if(finishing||!dayComplete(id,'training',names))return;const app=getData(),db=getDb();if(!app?.diets?.[id]||!db){alert('No se pudo guardar el plan.');return}finishing=true;try{const current=clone(app.diets[id])||{},allowed=new Set(names.map(norm));const training={...(clone(current.training)||{}),meals:dayMeals(id,'training').filter(m=>allowed.has(norm(m?.name))),notes:String(notes||'')};if(training.meals.length){delete training.meals[0].__dccCreating;training.meals[0].__dccPlanFinalized=true}let rest={calories:'',protein:'',meals:[],notes:String(notes||'')};if(withRest){const rn=mealNames(id,'rest');if(!rn.length||!dayComplete(id,'rest',rn))throw new Error('Día de descanso incompleto');rest={...(clone(current.rest)||{}),notes:String(notes||'')}}const{data:ok,error}=await db.rpc('dcc_save_diet_plan',{p_client_id:String(id),p_training:training,p_rest:rest});if(error)throw error;if(ok!==true)throw new Error('Guardado no confirmado');app.diets[id]={training,rest,__dccPlanInitialized:true};window.data=app;if(typeof window.saveData==='function')window.saveData();try{localStorage.removeItem(TEMPLATE_PREFIX+id)}catch(_){}window.__dccDietEditing=false;window.__dccDietType='training';window.__dccDietOpenMeal=null;finishing=false;if(typeof window.toast==='function')window.toast('Plan de alimentación guardado');if(typeof window.dccNutritionV2Home==='function')await window.dccNutritionV2Home(id);else if(typeof window.dccClientAdmin==='function')window.dccClientAdmin(id,'food')}catch(e){console.error('DCC nutrition finish:',e);finishing=false;alert('No se pudo guardar el plan de alimentación.');applyCreationFlow()}}
function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;hookClientAdmin();hookMealSetupCreate();applyCreationFlow()})}
function refresh(){requestAnimationFrame(()=>{installCss();hookClientAdmin();hookMealSetupCreate();applyCreationFlow()})}
installCss();hookClientAdmin();hookMealSetupCreate();applyCreationFlow();document.addEventListener('dcc:coach-screen',e=>{if(e.detail?.screen){restBuilder=null;refresh()}});observer=new MutationObserver(schedule);observer.observe(document.documentElement,{childList:true,subtree:true});
})();