/* DCC — asistente premium para configurar comidas y su orden */
(function(){
'use strict';

const BUILD='20260917-nutrition-meal-setup-v14-mobile-pointer';
if(window.__dccNutritionMealSetup===BUILD)return;
window.__dccNutritionMealSetup=BUILD;

const GROUPS=[
  {key:'main',title:'Comidas principales',subtitle:'Las comidas base del día, más completas.',icon:'food',meals:['Desayuno','Comida','Cena']},
  {key:'snacks',title:'Meriendas',subtitle:'Opciones más ligeras para mantener la energía.',icon:'food',meals:['Merienda mañana','Merienda tarde','Post-cena']},
  {key:'training',title:'En torno al entrenamiento',subtitle:'Comidas específicas alrededor del entrenamiento.',icon:'training',meals:['Pre-entreno','Post-entreno']}
];
const MEALS=GROUPS.flatMap(g=>g.meals);
let selected=[];
let currentId=null;
let currentType='training';
let busy=false;
let lastActivationAt=0;
let lastActivationKey='';

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clone=v=>JSON.parse(JSON.stringify(v??null));
const getData=()=>{try{return typeof data!=='undefined'?data:(window.data||null)}catch(_){return window.data||null}};
const getSupabase=()=>{try{return typeof supabaseClient!=='undefined'?supabaseClient:(window.supabaseClient||null)}catch(_){return window.supabaseClient||null}};

function bridgeGlobals(){
  const appData=getData();
  const db=getSupabase();
  if(appData)window.data=appData;
  if(db)window.supabaseClient=db;
  return{appData:window.data||appData,db:window.supabaseClient||db};
}

function appIcon(type){
  if(type==='training')return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 9v6"/><path d="M7 7v10"/><path d="M17 7v10"/><path d="M20 9v6"/><path d="M7 12h10"/><path d="M4 12H2"/><path d="M22 12h-2"/></svg>';
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M7 3v7"/><path d="M4.5 3v5.5A2.5 2.5 0 0 0 7 11a2.5 2.5 0 0 0 2.5-2.5V3"/><path d="M7 11v10"/><path d="M16 3v18"/><path d="M16 3c3 1.5 3 5 0 7"/></svg>';
}

function injectCss(){
  ['dcc-nutrition-meal-setup-v9-css','dcc-nutrition-meal-setup-v12-css','dcc-nutrition-meal-setup-v13-css'].forEach(id=>document.getElementById(id)?.remove());
  if(document.getElementById('dcc-nutrition-meal-setup-v14-css'))return;
  const s=document.createElement('style');
  s.id='dcc-nutrition-meal-setup-v14-css';
  s.textContent=`
#coach-main .dcc-meal-setup{display:grid;gap:12px;margin-top:8px;padding-bottom:8px}
#coach-main .dcc-meal-progress{display:flex;align-items:center;gap:7px;margin:0 2px 2px}
#coach-main .dcc-meal-progress span{height:4px;flex:1;border-radius:999px;background:rgba(183,123,19,.14)}
#coach-main .dcc-meal-progress span.on{background:linear-gradient(90deg,#e5b64c,#f3cf72)}
#coach-main .dcc-meal-step-label{margin:0 2px;color:#746c60;font-size:10px;font-weight:900;letter-spacing:.12em;text-transform:uppercase}
#coach-main .dcc-meal-setup-card{padding:18px;border:1px solid rgba(183,123,19,.24);border-radius:22px;background:linear-gradient(145deg,#fffefa,#f8f0e3);box-shadow:0 14px 34px rgba(88,61,17,.07)}
#coach-main .dcc-meal-setup h2{margin:0;color:#17191d;font-size:21px;letter-spacing:-.45px}
#coach-main .dcc-meal-setup p{margin:7px 0 0;color:#747c87;font-size:12px;line-height:1.45}
#coach-main .dcc-meal-groups{display:grid;gap:11px;margin-top:16px}
#coach-main .dcc-meal-group{padding:12px;border:1px solid rgba(183,123,19,.19);border-radius:18px;background:rgba(255,253,248,.78)}
#coach-main .dcc-meal-group-head{display:grid;grid-template-columns:38px 1fr;align-items:center;gap:10px;margin-bottom:10px}
#coach-main .dcc-meal-group-ico{width:38px;height:38px;display:grid;place-items:center;border-radius:50%;background:#f8ecd2;color:#9d711e}
#coach-main .dcc-meal-group-ico svg{width:20px;height:20px;display:block}
#coach-main .dcc-meal-group.training .dcc-meal-group-ico{background:#e8f2fa;color:#4c7898}
#coach-main .dcc-meal-group-head b{display:block;color:#1b1d20;font-size:13px}
#coach-main .dcc-meal-group-head small{display:block;margin-top:2px;color:#7a818a;font-size:9px;line-height:1.35}
#coach-main .dcc-meal-group-options{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px}
#coach-main .dcc-meal-group.training .dcc-meal-group-options{grid-template-columns:repeat(2,minmax(0,1fr))}
#coach-main .dcc-meal-select{min-height:48px;padding:8px;border:1px solid rgba(183,123,19,.2);border-radius:14px;background:#fffdf8;color:#17191d;font-size:11px;font-weight:850;line-height:1.2;touch-action:manipulation;-webkit-tap-highlight-color:transparent;user-select:none;-webkit-user-select:none}
#coach-main .dcc-meal-select.selected{border-color:#dfaa3d;background:linear-gradient(135deg,#f8dda0,#f3c758);box-shadow:0 7px 16px rgba(185,128,26,.11)}
#coach-main .dcc-meal-select .check{display:inline-grid;place-items:center;width:17px;height:17px;margin-right:5px;border:1px solid rgba(132,103,52,.35);border-radius:50%;font-size:10px;vertical-align:-1px}
#coach-main .dcc-meal-select.selected .check{background:#8f6416;color:#fff;border-color:#8f6416}
#coach-main .dcc-meal-selected-count{display:inline-flex;margin-top:12px;padding:7px 10px;border-radius:999px;background:#f5ead2;color:#956b18;font-size:10px;font-weight:850}
#coach-main .dcc-meal-order{display:grid;gap:8px;margin-top:15px}
#coach-main .dcc-meal-order-row{display:grid;grid-template-columns:34px 1fr auto;align-items:center;gap:10px;min-height:58px;padding:9px 10px;border:1px solid rgba(183,123,19,.22);border-radius:17px;background:#fffdf8}
#coach-main .dcc-meal-order-row.training{border-color:rgba(95,157,201,.28);background:#f4f9fd}
#coach-main .dcc-meal-order-num{width:32px;height:32px;display:grid;place-items:center;border-radius:50%;background:linear-gradient(135deg,#f5d577,#dda73e);color:#17120a;font-size:12px;font-weight:900}
#coach-main .dcc-meal-order-name b{display:block;color:#17191d;font-size:13px}
#coach-main .dcc-meal-order-name small{display:block;margin-top:2px;color:#7d8590;font-size:9px}
#coach-main .dcc-meal-training-chip{display:inline-flex;margin-left:5px;padding:2px 5px;border-radius:999px;background:#dfeefa;color:#376d98;font-size:7px;font-weight:900;letter-spacing:.04em;text-transform:uppercase}
#coach-main .dcc-meal-order-actions{display:flex;gap:6px}
#coach-main .dcc-meal-move{width:36px;height:36px;border:1px solid rgba(183,123,19,.25);border-radius:11px;background:#fff;color:#7f5a18;font-size:17px;font-weight:900;touch-action:manipulation}
#coach-main .dcc-meal-move:disabled{opacity:.25}
#coach-main .dcc-meal-summary{display:grid;gap:0;margin-top:15px;border:1px solid rgba(183,123,19,.2);border-radius:17px;background:#fffdf8;overflow:hidden}
#coach-main .dcc-meal-summary-row{display:grid;grid-template-columns:32px 1fr;align-items:center;gap:10px;padding:11px 12px;border-bottom:1px solid rgba(183,123,19,.12)}
#coach-main .dcc-meal-summary-row:last-child{border-bottom:0}
#coach-main .dcc-meal-summary-row b{font-size:12px;color:#17191d}
#coach-main .dcc-meal-actions{display:grid;grid-template-columns:.8fr 1.35fr;gap:8px}
#coach-main .dcc-meal-next,#coach-main .dcc-meal-back,#coach-main .dcc-meal-cancel{width:100%;min-height:50px;border-radius:15px;font-weight:900;touch-action:manipulation}
#coach-main .dcc-meal-next{border:1px solid #e3b34f;background:linear-gradient(135deg,#f5d577,#dda73e);color:#17110a;box-shadow:0 10px 24px rgba(190,133,31,.14)}
#coach-main .dcc-meal-next:disabled{opacity:.42;box-shadow:none}
#coach-main .dcc-meal-back,#coach-main .dcc-meal-cancel{border:1px solid rgba(183,123,19,.22);background:#fffdf8;color:#5f6268}
#coach-main .dcc-meal-hint{padding:12px 13px;border:1px solid rgba(183,123,19,.18);border-radius:15px;background:rgba(245,234,210,.52);color:#776c5d;font-size:10px;line-height:1.45}
@media(max-width:520px){#coach-main .dcc-meal-setup-card{padding:16px}#coach-main .dcc-meal-setup h2{font-size:20px}#coach-main .dcc-meal-group-options{gap:6px}#coach-main .dcc-meal-select{padding:7px 5px;font-size:10px}}
`;
  document.head.appendChild(s);
}

function pane(){const w=document.querySelector('#coach-main .dcc-ca-wrap');return w?w.lastElementChild:null}
function meal(name){return{name,options:[{name:'Opción 1',foods:[]}]}}
function normalizeMealName(name){
  const n=String(name||'').trim().toLowerCase().replace(/[-–—]/g,' ').replace(/\s+/g,' ');
  if(n==='media mañana')return'merienda mañana';
  if(n==='media tarde')return'merienda tarde';
  return n;
}
function isTrainingMeal(name){return name==='Pre-entreno'||name==='Post-entreno'}
function mealHelp(name){
  if(name==='Pre-entreno')return'Energía antes de entrenar';
  if(name==='Post-entreno')return'Recuperación tras entrenar';
  if(name==='Post-cena')return'Opcional antes de dormir';
  if(name==='Merienda mañana'||name==='Merienda tarde')return'Merienda del día';
  return'Comida principal';
}
function progress(step){return `<div class="dcc-meal-step-label">Paso ${step} de 3</div><div class="dcc-meal-progress"><span class="on"></span><span class="${step>=2?'on':''}"></span><span class="${step>=3?'on':''}"></span></div>`}

function groupMarkup(group,available){
  const names=group.meals.filter(name=>!available||available.includes(name));
  if(!names.length)return'';
  return `<div class="dcc-meal-group ${group.key}"><div class="dcc-meal-group-head"><span class="dcc-meal-group-ico">${appIcon(group.icon)}</span><span><b>${esc(group.title)}</b><small>${esc(group.subtitle)}</small></span></div><div class="dcc-meal-group-options">${names.map(name=>`<button type="button" class="dcc-meal-select ${selected.includes(name)?'selected':''}" data-dcc-meal-action="toggle" data-meal="${esc(name)}"><span class="check">${selected.includes(name)?'✓':'＋'}</span>${esc(name)}</button>`).join('')}</div></div>`;
}

function syncStep1(){
  const p=pane();if(!p)return;
  p.querySelectorAll('.dcc-meal-select[data-meal]').forEach(btn=>{
    const on=selected.includes(btn.dataset.meal||'');
    btn.classList.toggle('selected',on);
    const check=btn.querySelector('.check');if(check)check.textContent=on?'✓':'＋';
  });
  const count=p.querySelector('.dcc-meal-selected-count');
  if(count)count.textContent=`${selected.length} ${selected.length===1?'comida seleccionada':'comidas seleccionadas'}`;
  const next=p.querySelector('[data-dcc-meal-action="order"]');
  if(next)next.disabled=!selected.length;
}

function renderStep1(){
  bridgeGlobals();injectCss();
  const p=pane();if(!p)return false;
  p.innerHTML=`<div class="dcc-meal-setup">${progress(1)}<div class="dcc-meal-setup-card"><h2>Selecciona las comidas</h2><p>Elige las comidas que quieres incluir en el plan del cliente. No hace falta usar todas.</p><div class="dcc-meal-groups">${GROUPS.map(g=>groupMarkup(g)).join('')}</div><span class="dcc-meal-selected-count">${selected.length} ${selected.length===1?'comida seleccionada':'comidas seleccionadas'}</span></div><div class="dcc-meal-hint">Las comidas principales son la base del día. Las meriendas son opciones intermedias. Pre-entreno y Post-entreno se colocan en el siguiente paso según el horario del cliente.</div><button type="button" class="dcc-meal-next" ${selected.length?'':'disabled'} data-dcc-meal-action="order">Elegir orden →</button></div>`;
  return true;
}

function renderStep2(){
  const p=pane();if(!p)return false;
  p.innerHTML=`<div class="dcc-meal-setup">${progress(2)}<div class="dcc-meal-setup-card"><h2>Ordena las comidas</h2><p>Este será el orden en el que el cliente verá sus comidas. Coloca Pre-entreno y Post-entreno donde correspondan según su horario.</p><div class="dcc-meal-order">${selected.map((name,i)=>`<div class="dcc-meal-order-row ${isTrainingMeal(name)?'training':''}"><span class="dcc-meal-order-num">${i+1}</span><span class="dcc-meal-order-name"><b>${esc(name)}${isTrainingMeal(name)?'<span class="dcc-meal-training-chip">Entrenamiento</span>':''}</b><small>${esc(mealHelp(name))}</small></span><span class="dcc-meal-order-actions"><button type="button" class="dcc-meal-move" ${i===0?'disabled':''} data-dcc-meal-action="move" data-index="${i}" data-delta="-1">↑</button><button type="button" class="dcc-meal-move" ${i===selected.length-1?'disabled':''} data-dcc-meal-action="move" data-index="${i}" data-delta="1">↓</button></span></div>`).join('')}</div></div><div class="dcc-meal-hint">Puedes mover cualquier comida. El número de la izquierda es el orden final que verá el cliente.</div><div class="dcc-meal-actions"><button type="button" class="dcc-meal-back" data-dcc-meal-action="back-select">Atrás</button><button type="button" class="dcc-meal-next" data-dcc-meal-action="review">Revisar plan →</button></div></div>`;
  return true;
}

function renderStep3(){
  const p=pane();if(!p)return false;
  p.innerHTML=`<div class="dcc-meal-setup">${progress(3)}<div class="dcc-meal-setup-card"><h2>Resumen del plan</h2><p>Revisa el orden antes de crear el plan de alimentación.</p><div class="dcc-meal-summary">${selected.map((name,i)=>`<div class="dcc-meal-summary-row"><span class="dcc-meal-order-num">${i+1}</span><b>${esc(name)}${isTrainingMeal(name)?'<span class="dcc-meal-training-chip">Entrenamiento</span>':''}</b></div>`).join('')}</div></div><div class="dcc-meal-hint">Una vez creado el plan podrás añadir alimentos, cantidades y opciones dentro de cada comida.</div><div class="dcc-meal-actions"><button type="button" class="dcc-meal-back" data-dcc-meal-action="back-order">Atrás</button><button type="button" class="dcc-meal-next" data-dcc-meal-action="create">Crear plan de alimentación ✓</button></div></div>`;
  return true;
}

function remainingMeals(id,type){
  bridgeGlobals();
  const current=window.data?.diets?.[id]?.[type]?.meals||[];
  const used=new Set(current.map(x=>normalizeMealName(x?.name)));
  return MEALS.filter(name=>!used.has(normalizeMealName(name)));
}

function renderAddMealPicker(id,type){
  bridgeGlobals();currentId=id;currentType=type;selected=[];injectCss();
  const p=pane();if(!p)return false;
  const available=remainingMeals(id,type);
  const groups=GROUPS.map(g=>{
    const names=g.meals.filter(name=>available.includes(name));
    if(!names.length)return'';
    return `<div class="dcc-meal-group ${g.key}"><div class="dcc-meal-group-head"><span class="dcc-meal-group-ico">${appIcon(g.icon)}</span><span><b>${esc(g.title)}</b><small>${esc(g.subtitle)}</small></span></div><div class="dcc-meal-group-options">${names.map(name=>`<button type="button" class="dcc-meal-select" data-dcc-meal-action="add-preset" data-meal="${esc(name)}"><span class="check">＋</span>${esc(name)}</button>`).join('')}</div></div>`;
  }).join('');
  p.innerHTML=`<div class="dcc-meal-setup"><div class="dcc-meal-setup-card"><h2>Añadir un momento de comida</h2><p>Elige el tipo de comida que quieres añadir.</p><div class="dcc-meal-groups">${groups||'<div class="dcc-meal-hint">Ya están añadidos todos los tipos de comida disponibles.</div>'}</div></div><button type="button" class="dcc-meal-cancel" data-dcc-meal-action="cancel-add">Volver</button></div>`;
  return true;
}

async function persistBoth(id,plan){
  const{db}=bridgeGlobals();
  if(!db)throw new Error('Sin conexión con Supabase');
  const serverPlan={
    training:clone(plan?.training)||{calories:'',protein:'',meals:[]},
    rest:clone(plan?.rest)||{calories:'',protein:'',meals:[]}
  };
  const{data:ok,error}=await db.rpc('dcc_save_diet_plan',{p_client_id:String(id),p_training:serverPlan.training,p_rest:serverPlan.rest});
  if(error)throw error;
  if(ok!==true)throw new Error('El servidor no confirmó el guardado de la dieta');
  return serverPlan;
}

async function persistType(id,type,day){
  bridgeGlobals();
  const current=clone(window.data?.diets?.[id])||{};
  const next={training:clone(current.training)||{calories:'',protein:'',meals:[]},rest:clone(current.rest)||{calories:'',protein:'',meals:[]}};
  next[type]=clone(day)||{calories:'',protein:'',meals:[]};
  return persistBoth(id,next);
}

function toggleMeal(name){
  if(!MEALS.includes(name))return;
  selected=selected.includes(name)?selected.filter(x=>x!==name):[...selected,name];
  syncStep1();
}

function moveMeal(index,delta){
  const to=index+delta;
  if(to<0||to>=selected.length)return;
  const next=[...selected],[item]=next.splice(index,1);
  next.splice(to,0,item);selected=next;renderStep2();
}

async function createPlan(){
  bridgeGlobals();
  if(busy||!currentId||!selected.length)return;
  busy=true;
  const id=currentId,names=[...selected],make=()=>names.map(meal);
  const next={training:{calories:'',protein:'',meals:make()},rest:{calories:'',protein:'',meals:make()}};
  try{
    const saved=await persistBoth(id,next);
    saved.__dccPlanInitialized=true;
    window.data=window.data||{};window.data.diets=window.data.diets||{};window.data.diets[id]=clone(saved);
    if(typeof window.saveData==='function')window.saveData();
    try{localStorage.setItem('dcc:diet-meal-template:v7:'+id,JSON.stringify(names))}catch(_){}
    if(typeof window.dccNutritionV2Edit==='function')await window.dccNutritionV2Edit(id);
    else if(typeof window.dccClientAdmin==='function')window.dccClientAdmin(id,'food');
    if(typeof window.toast==='function')window.toast('Plan de alimentación creado');
  }catch(error){
    console.error('DCC meal setup:',error);
    alert('No se pudo guardar la estructura de la dieta. No se ha aplicado ningún cambio.');
  }finally{busy=false}
}

async function addPreset(name){
  bridgeGlobals();
  const id=currentId,type=currentType,current=window.data?.diets?.[id]?.[type];
  if(busy||!current||!MEALS.includes(name))return;
  const nextDay=clone(current)||{calories:'',protein:'',meals:[]};
  nextDay.meals=Array.isArray(nextDay.meals)?nextDay.meals:[];
  if(nextDay.meals.some(m=>normalizeMealName(m?.name)===normalizeMealName(name)))return;
  nextDay.meals.push(meal(name));busy=true;
  try{
    const saved=await persistType(id,type,nextDay);
    saved.__dccPlanInitialized=true;
    window.data.diets[id]=clone(saved);
    if(typeof window.saveData==='function')window.saveData();
    if(typeof window.dccClientAdmin==='function')window.dccClientAdmin(id,'food');
    if(typeof window.toast==='function')window.toast(name+' añadida');
  }catch(error){
    console.error('DCC add preset meal:',error);
    alert('No se pudo guardar la nueva comida. No se ha aplicado ningún cambio.');
  }finally{busy=false}
}

function actionTarget(e){
  const node=e.target&&e.target.nodeType===1?e.target:e.target?.parentElement;
  return node?.closest?.('[data-dcc-meal-action]')||null;
}

function activate(e){
  const btn=actionTarget(e);
  if(!btn||!btn.closest('.dcc-meal-setup'))return;
  if(e.type==='pointerup'&&typeof e.button==='number'&&e.button!==0)return;
  const action=btn.dataset.dccMealAction||'';
  const key=[action,btn.dataset.meal||'',btn.dataset.index||'',btn.dataset.delta||''].join('|');
  const now=Date.now();
  if(key===lastActivationKey&&now-lastActivationAt<500)return;
  lastActivationKey=key;lastActivationAt=now;
  if(e.cancelable)e.preventDefault();
  e.stopPropagation();
  if(action==='toggle')return toggleMeal(btn.dataset.meal||'');
  if(action==='order')return selected.length&&renderStep2();
  if(action==='move')return moveMeal(Number(btn.dataset.index),Number(btn.dataset.delta));
  if(action==='review')return selected.length&&renderStep3();
  if(action==='back-select')return renderStep1();
  if(action==='back-order')return renderStep2();
  if(action==='create')return createPlan();
  if(action==='add-preset')return addPreset(btn.dataset.meal||'');
  if(action==='cancel-add'&&typeof window.dccClientAdmin==='function')return window.dccClientAdmin(currentId,'food');
}

const old=window.__dccMealSetupActivationHandler;
if(old){
  window.removeEventListener('pointerup',old,true);
  window.removeEventListener('click',old,true);
  window.removeEventListener('touchend',old,true);
}
if(window.__dccMealSetupDelegatedHandler)document.removeEventListener('click',window.__dccMealSetupDelegatedHandler,true);
window.__dccMealSetupActivationHandler=activate;
window.addEventListener('pointerup',activate,true);
window.addEventListener('click',activate,true);
if(!('PointerEvent' in window))window.addEventListener('touchend',activate,{capture:true,passive:false});

function startSetup(id){
  bridgeGlobals();currentId=id;currentType='training';selected=[];
  return renderStep1();
}

window.dccNutritionMealSetupStart=startSetup;
window.dccNutritionMealAddStart=(id,type)=>renderAddMealPicker(id,type||window.__dccDietType||'training');
window.dccMealSetupToggle=toggleMeal;
window.dccMealSetupOrder=()=>selected.length&&renderStep2();
window.dccMealSetupMove=moveMeal;
window.dccMealSetupReview=()=>selected.length&&renderStep3();
window.dccMealSetupBackToMeals=renderStep1;
window.dccMealSetupBackToOrder=renderStep2;
window.dccMealSetupBackToCount=renderStep1;
window.dccMealSetupCount=()=>false;
window.dccMealSetupCreate=createPlan;
window.dccMealAddPreset=addPreset;
window.dccDietAddMeal=(id,type)=>Promise.resolve(renderAddMealPicker(id,type||window.__dccDietType||'training'));

bridgeGlobals();injectCss();
})();