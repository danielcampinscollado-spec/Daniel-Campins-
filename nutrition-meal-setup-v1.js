/* DCC — creación de plan de alimentación en una sola pantalla */
(function(){
'use strict';

const BUILD='20260917-nutrition-meal-setup-v18-native-delegated';
if(window.__dccNutritionMealSetup===BUILD)return;
window.__dccNutritionMealSetup=BUILD;

const MEALS=['Desayuno','Merienda mañana','Comida','Merienda tarde','Pre-entreno','Post-entreno','Cena','Post-cena'];
let selected=[];
let currentId=null;
let currentType='training';
let busy=false;

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clone=v=>JSON.parse(JSON.stringify(v??null));
const getData=()=>{try{return typeof data!=='undefined'?data:(window.data||null)}catch(_){return window.data||null}};
const getSupabase=()=>{try{return typeof supabaseClient!=='undefined'?supabaseClient:(window.supabaseClient||null)}catch(_){return window.supabaseClient||null}};

function bridgeGlobals(){
  const appData=getData(),db=getSupabase();
  if(appData)window.data=appData;
  if(db)window.supabaseClient=db;
  return{appData:window.data||appData,db:window.supabaseClient||db};
}
function pane(){const w=document.querySelector('#coach-main .dcc-ca-wrap');return w?w.lastElementChild:null}
function meal(name){return{name,options:[{name:'Opción 1',foods:[]}]}}
function normalizeMealName(name){const n=String(name||'').trim().toLowerCase().replace(/[-–—]/g,' ').replace(/\s+/g,' ');if(n==='media mañana')return'merienda mañana';if(n==='media tarde')return'merienda tarde';return n}
function isTrainingMeal(name){return name==='Pre-entreno'||name==='Post-entreno'}
function icon(name){
  if(isTrainingMeal(name))return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 9v6"/><path d="M7 7v10"/><path d="M17 7v10"/><path d="M20 9v6"/><path d="M7 12h10"/><path d="M4 12H2"/><path d="M22 12h-2"/></svg>';
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M7 3v7"/><path d="M4.5 3v5.5A2.5 2.5 0 0 0 7 11a2.5 2.5 0 0 0 2.5-2.5V3"/><path d="M7 11v10"/><path d="M16 3v18"/><path d="M16 3c3 1.5 3 5 0 7"/></svg>';
}

function injectCss(){
  document.querySelectorAll('style[id^="dcc-nutrition-meal-setup-"]').forEach(x=>x.remove());
  const s=document.createElement('style');
  s.id='dcc-nutrition-meal-setup-v18-css';
  s.textContent=`
#coach-main .dcc-meal-builder{display:grid;gap:12px;margin-top:8px;padding-bottom:12px}
#coach-main .dcc-meal-builder-head{padding:17px 18px;border:1px solid rgba(183,123,19,.22);border-radius:21px;background:linear-gradient(145deg,#fffefa,#f8f0e3)}
#coach-main .dcc-meal-builder h2{margin:0;color:#17191d;font-size:21px;letter-spacing:-.45px}
#coach-main .dcc-meal-builder p{margin:6px 0 0;color:#747c87;font-size:12px;line-height:1.45}
#coach-main .dcc-meal-builder-note{margin-top:12px;padding:10px 12px;border:1px solid rgba(183,123,19,.17);border-radius:14px;background:rgba(245,234,210,.48);color:#746957;font-size:10px;line-height:1.4}
#coach-main .dcc-meal-builder-card{padding:14px;border:1px solid rgba(183,123,19,.2);border-radius:20px;background:rgba(255,253,248,.86)}
#coach-main .dcc-meal-builder-card h3{margin:0 0 4px;color:#7f5816;font-size:14px}
#coach-main .dcc-meal-builder-card>small{display:block;margin-bottom:10px;color:#858b93;font-size:9px;line-height:1.35}
#coach-main .dcc-meal-list,#coach-main .dcc-meal-order-list{display:grid;gap:6px}
#coach-main .dcc-meal-pick{position:relative;display:block;cursor:pointer;-webkit-tap-highlight-color:transparent;touch-action:manipulation}
#coach-main .dcc-meal-pick input{position:absolute;opacity:0;width:1px;height:1px;pointer-events:none}
#coach-main .dcc-meal-pick-ui{min-height:48px;display:grid;grid-template-columns:34px 1fr 32px;align-items:center;gap:9px;padding:7px 8px;border:1px solid rgba(183,123,19,.17);border-radius:14px;background:#fffdf8;color:#17191d}
#coach-main .dcc-meal-pick-ico{width:32px;height:32px;display:grid;place-items:center;border-radius:50%;background:#f8ecd2;color:#9d711e}
#coach-main .dcc-meal-pick.training .dcc-meal-pick-ico{background:#e8f2fa;color:#4c7898}
#coach-main .dcc-meal-pick-ico svg,#coach-main .dcc-meal-order-ico svg{width:18px;height:18px}
#coach-main .dcc-meal-pick-name{font-size:12px;font-weight:850}
#coach-main .dcc-meal-pick-plus{width:28px;height:28px;display:grid;place-items:center;border:1px solid rgba(132,103,52,.28);border-radius:50%;font-size:18px;font-weight:700;color:#17191d}
#coach-main .dcc-meal-pick input:checked+.dcc-meal-pick-ui{background:linear-gradient(135deg,#f5d577,#e5b444);border-color:#d8a333}
#coach-main .dcc-meal-pick input:checked+.dcc-meal-pick-ui .dcc-meal-pick-plus{font-size:0;background:#9d711e;color:#fff}
#coach-main .dcc-meal-pick input:checked+.dcc-meal-pick-ui .dcc-meal-pick-plus:after{content:'✓';font-size:13px}
#coach-main .dcc-meal-order-empty{min-height:86px;display:grid;place-items:center;padding:16px;border:1px dashed rgba(183,123,19,.28);border-radius:14px;color:#8a8f96;font-size:10px;text-align:center;line-height:1.45}
#coach-main .dcc-meal-order-row{display:grid;grid-template-columns:30px 34px 1fr auto;align-items:center;gap:8px;min-height:50px;padding:7px 8px;border:1px solid rgba(183,123,19,.18);border-radius:14px;background:#fffdf8}
#coach-main .dcc-meal-order-num{width:28px;height:28px;display:grid;place-items:center;border-radius:50%;background:linear-gradient(135deg,#f5d577,#dda73e);color:#17120a;font-size:11px;font-weight:900}
#coach-main .dcc-meal-order-ico{width:32px;height:32px;display:grid;place-items:center;border-radius:50%;background:#f8ecd2;color:#9d711e}
#coach-main .dcc-meal-order-row.training .dcc-meal-order-ico{background:#e8f2fa;color:#4c7898}
#coach-main .dcc-meal-order-name{font-size:12px;font-weight:850;color:#17191d}
#coach-main .dcc-meal-order-actions{display:flex;align-items:center;gap:4px}
#coach-main .dcc-meal-order-btn{width:29px;height:29px;border:1px solid rgba(183,123,19,.2);border-radius:9px;background:#fff;color:#765217;font-size:14px;font-weight:900}
#coach-main .dcc-meal-order-btn.remove{color:#b44b50;border-color:rgba(180,75,80,.2)}
#coach-main .dcc-meal-order-btn:disabled{opacity:.25}
#coach-main .dcc-meal-create{width:100%;min-height:52px;border:1px solid #e3b34f;border-radius:16px;background:linear-gradient(135deg,#f5d577,#dda73e);color:#17110a;font-size:14px;font-weight:900;box-shadow:0 10px 24px rgba(190,133,31,.14)}
#coach-main .dcc-meal-create:disabled{opacity:.45;box-shadow:none}
#coach-main .dcc-meal-add-btn{width:100%;min-height:46px;padding:8px 10px;border:1px solid rgba(183,123,19,.18);border-radius:13px;background:#fffdf8;color:#17191d;font-size:11px;font-weight:850;text-align:left}
#coach-main .dcc-meal-cancel{width:100%;min-height:48px;border:1px solid rgba(183,123,19,.22);border-radius:14px;background:#fffdf8;color:#5f6268;font-weight:900}
@media(min-width:760px){#coach-main .dcc-meal-builder-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;align-items:start}}
@media(max-width:759px){#coach-main .dcc-meal-builder-grid{display:grid;gap:12px}}
`;
  document.head.appendChild(s);
}

function availableMarkup(){
  return MEALS.map(name=>`<label class="dcc-meal-pick ${isTrainingMeal(name)?'training':''}"><input type="checkbox" class="dcc-meal-pick-input" value="${esc(name)}" ${selected.includes(name)?'checked':''}><span class="dcc-meal-pick-ui"><span class="dcc-meal-pick-ico">${icon(name)}</span><span class="dcc-meal-pick-name">${esc(name)}</span><span class="dcc-meal-pick-plus">＋</span></span></label>`).join('');
}
function orderMarkup(){
  if(!selected.length)return '<div class="dcc-meal-order-empty">Aquí aparecerán las comidas en el orden en que las vayas seleccionando.</div>';
  return selected.map((name,i)=>`<div class="dcc-meal-order-row ${isTrainingMeal(name)?'training':''}"><span class="dcc-meal-order-num">${i+1}</span><span class="dcc-meal-order-ico">${icon(name)}</span><span class="dcc-meal-order-name">${esc(name)}</span><span class="dcc-meal-order-actions"><button type="button" class="dcc-meal-order-btn" data-dcc-meal-move="-1" data-index="${i}" ${i===0?'disabled':''}>↑</button><button type="button" class="dcc-meal-order-btn" data-dcc-meal-move="1" data-index="${i}" ${i===selected.length-1?'disabled':''}>↓</button><button type="button" class="dcc-meal-order-btn remove" data-dcc-meal-remove="${esc(name)}">−</button></span></div>`).join('');
}
function syncBuilder(){
  const p=pane();if(!p)return;
  const order=p.querySelector('.dcc-meal-order-list');if(order)order.innerHTML=orderMarkup();
  p.querySelectorAll('.dcc-meal-pick-input').forEach(input=>{input.checked=selected.includes(input.value)});
  const create=p.querySelector('.dcc-meal-create');if(create)create.disabled=!selected.length||busy;
}
function renderBuilder(){
  bridgeGlobals();injectCss();const p=pane();if(!p)return false;
  p.innerHTML=`<div class="dcc-meal-builder"><div class="dcc-meal-builder-head"><h2>Crear plan de alimentación</h2><p>Añade las comidas que tendrá el plan. Se colocarán automáticamente en el orden en que las selecciones.</p><div class="dcc-meal-builder-note">El orden de selección será el orden que verá el cliente. Si te equivocas, puedes mover o quitar una comida antes de crear el plan.</div></div><div class="dcc-meal-builder-grid"><div class="dcc-meal-builder-card"><h3>Comidas disponibles</h3><small>Pulsa una comida para añadirla al plan.</small><div class="dcc-meal-list">${availableMarkup()}</div></div><div class="dcc-meal-builder-card"><h3>Orden del plan</h3><small>Se actualiza automáticamente con cada selección.</small><div class="dcc-meal-order-list">${orderMarkup()}</div></div></div><button type="button" class="dcc-meal-create" ${selected.length?'':'disabled'}>Crear plan de alimentación</button></div>`;
  return true;
}
function toggleMeal(name,checked){if(!MEALS.includes(name)||busy)return;if(checked&&!selected.includes(name))selected.push(name);if(!checked)selected=selected.filter(x=>x!==name);syncBuilder()}
function moveMeal(index,delta){const to=index+delta;if(to<0||to>=selected.length||busy)return;const next=[...selected],[item]=next.splice(index,1);next.splice(to,0,item);selected=next;syncBuilder()}
function removeMeal(name){if(busy)return;selected=selected.filter(x=>x!==name);syncBuilder()}

function installDelegates(){
  if(window.__dccMealSetupDelegatesV18)return;
  window.__dccMealSetupDelegatesV18=true;
  document.addEventListener('change',event=>{
    const input=event.target&&event.target.closest?event.target.closest('.dcc-meal-pick-input'):null;
    if(!input||!input.closest('#coach-main .dcc-meal-builder'))return;
    toggleMeal(input.value,input.checked);
  },true);
  document.addEventListener('click',event=>{
    const target=event.target&&event.target.closest?event.target:null;if(!target)return;
    const root=target.closest('#coach-main .dcc-meal-builder');if(!root)return;
    const move=target.closest('[data-dcc-meal-move]');
    if(move){event.preventDefault();moveMeal(Number(move.dataset.index),Number(move.dataset.dccMealMove));return}
    const remove=target.closest('[data-dcc-meal-remove]');
    if(remove){event.preventDefault();removeMeal(remove.dataset.dccMealRemove||'');return}
    const add=target.closest('[data-dcc-meal-add]');
    if(add){event.preventDefault();addPreset(add.dataset.dccMealAdd||'');return}
    if(target.closest('.dcc-meal-create')){event.preventDefault();createPlan();return}
    if(target.closest('.dcc-meal-cancel')){event.preventDefault();if(typeof window.dccClientAdmin==='function')window.dccClientAdmin(currentId,'food')}
  },true);
}

function remainingMeals(id,type){bridgeGlobals();const current=window.data?.diets?.[id]?.[type]?.meals||[],used=new Set(current.map(x=>normalizeMealName(x?.name)));return MEALS.filter(name=>!used.has(normalizeMealName(name)))}
function renderAddMealPicker(id,type){
  bridgeGlobals();currentId=id;currentType=type;injectCss();const p=pane();if(!p)return false;const available=remainingMeals(id,type);
  p.innerHTML=`<div class="dcc-meal-builder"><div class="dcc-meal-builder-head"><h2>Añadir comida</h2><p>Elige la comida que quieres añadir al final del plan actual.</p></div><div class="dcc-meal-builder-card"><div class="dcc-meal-list">${available.length?available.map(name=>`<button type="button" class="dcc-meal-add-btn" data-dcc-meal-add="${esc(name)}">＋ ${esc(name)}</button>`).join(''):'<div class="dcc-meal-order-empty">Ya están añadidas todas las comidas disponibles.</div>'}</div></div><button type="button" class="dcc-meal-cancel">Volver</button></div>`;
  return true;
}

async function persistBoth(id,plan){
  const{db}=bridgeGlobals();if(!db)throw new Error('Sin conexión con Supabase');
  const serverPlan={training:clone(plan?.training)||{calories:'',protein:'',meals:[]},rest:clone(plan?.rest)||{calories:'',protein:'',meals:[]}};
  const{data:ok,error}=await db.rpc('dcc_save_diet_plan',{p_client_id:String(id),p_training:serverPlan.training,p_rest:serverPlan.rest});
  if(error)throw error;if(ok!==true)throw new Error('El servidor no confirmó el guardado de la dieta');return serverPlan;
}
async function persistType(id,type,day){
  bridgeGlobals();const current=clone(window.data?.diets?.[id])||{},next={training:clone(current.training)||{calories:'',protein:'',meals:[]},rest:clone(current.rest)||{calories:'',protein:'',meals:[]}};
  next[type]=clone(day)||{calories:'',protein:'',meals:[]};return persistBoth(id,next);
}
async function createPlan(){
  bridgeGlobals();if(busy||!currentId||!selected.length)return;busy=true;syncBuilder();
  const id=currentId,names=[...selected],make=()=>names.map(meal),next={training:{calories:'',protein:'',meals:make()},rest:{calories:'',protein:'',meals:make()}};
  try{
    const saved=await persistBoth(id,next);saved.__dccPlanInitialized=true;
    window.data=window.data||{};window.data.diets=window.data.diets||{};window.data.diets[id]=clone(saved);
    if(typeof window.saveData==='function')window.saveData();
    try{localStorage.setItem('dcc:diet-meal-template:v8:'+id,JSON.stringify(names))}catch(_){}
    if(typeof window.dccNutritionV2Edit==='function')await window.dccNutritionV2Edit(id);else if(typeof window.dccClientAdmin==='function')window.dccClientAdmin(id,'food');
    if(typeof window.toast==='function')window.toast('Plan de alimentación creado');
  }catch(error){console.error('DCC meal setup:',error);alert('No se pudo guardar la estructura de la dieta. No se ha aplicado ningún cambio.');busy=false;syncBuilder();return}
  busy=false;
}
async function addPreset(name){
  bridgeGlobals();const id=currentId,type=currentType,current=window.data?.diets?.[id]?.[type];if(busy||!current||!MEALS.includes(name))return;
  const nextDay=clone(current)||{calories:'',protein:'',meals:[]};nextDay.meals=Array.isArray(nextDay.meals)?nextDay.meals:[];
  if(nextDay.meals.some(m=>normalizeMealName(m?.name)===normalizeMealName(name)))return;nextDay.meals.push(meal(name));busy=true;
  try{
    const saved=await persistType(id,type,nextDay);saved.__dccPlanInitialized=true;window.data.diets[id]=clone(saved);
    if(typeof window.saveData==='function')window.saveData();if(typeof window.dccClientAdmin==='function')window.dccClientAdmin(id,'food');if(typeof window.toast==='function')window.toast(name+' añadida');
  }catch(error){console.error('DCC add preset meal:',error);alert('No se pudo guardar la nueva comida. No se ha aplicado ningún cambio.')}finally{busy=false}
}

function startSetup(id){bridgeGlobals();currentId=id;currentType='training';selected=[];return renderBuilder()}
window.dccNutritionMealSetupStart=startSetup;
window.dccNutritionMealAddStart=(id,type)=>renderAddMealPicker(id,type||window.__dccDietType||'training');
window.dccMealSetupToggle=name=>toggleMeal(name,!selected.includes(name));
window.dccMealSetupRemove=removeMeal;
window.dccMealSetupOrder=()=>false;
window.dccMealSetupMove=moveMeal;
window.dccMealSetupReview=()=>false;
window.dccMealSetupBackToMeals=renderBuilder;
window.dccMealSetupBackToOrder=renderBuilder;
window.dccMealSetupBackToCount=renderBuilder;
window.dccMealSetupCount=()=>false;
window.dccMealSetupCreate=createPlan;
window.dccMealAddPreset=addPreset;
window.dccDietAddMeal=(id,type)=>Promise.resolve(renderAddMealPicker(id,type||window.__dccDietType||'training'));
installDelegates();bridgeGlobals();injectCss();
})();