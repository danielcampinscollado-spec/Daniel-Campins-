/* DCC — autoridad del selector de comidas y creación de estructura alimenticia */
(function(){
  'use strict';
  const BUILD='20260917-nutrition-meal-setup-v5-authority';
  if(window.__dccNutritionMealSetup===BUILD)return;
  window.__dccNutritionMealSetup=BUILD;

  const MEALS=['Desayuno','Media mañana','Comida','Media tarde','Cena','Pre-entreno','Post-entreno','Post-cena'];
  let chosenCount=0;
  let selected=[];
  let currentId=null;
  let currentType='training';

  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function injectCss(){
    if(document.getElementById('dcc-nutrition-meal-setup-v3-css'))return;
    const s=document.createElement('style');
    s.id='dcc-nutrition-meal-setup-v3-css';
    s.textContent=`
      #coach-main .dcc-meal-setup{display:grid;gap:13px;margin-top:8px}
      #coach-main .dcc-meal-setup-card{padding:16px;border:1px solid rgba(224,173,76,.42);border-radius:20px;background:linear-gradient(145deg,#10161a,#090d10)}
      #coach-main .dcc-meal-setup h2{margin:0;color:#f4f2ed;font-size:21px}
      #coach-main .dcc-meal-setup p{margin:6px 0 0;color:#939ca7;font-size:11px;line-height:1.45}
      #coach-main .dcc-meal-counts{display:grid;grid-template-columns:repeat(4,1fr);gap:7px;margin-top:13px}
      #coach-main .dcc-meal-count{height:46px;border:1px solid #343e47;border-radius:14px;background:#0a0f13;color:#f2f0eb;font-weight:850}
      #coach-main .dcc-meal-count.active{border-color:#efc965;background:linear-gradient(135deg,#f5d475,#dca83f);color:#17120a}
      #coach-main .dcc-meal-options{display:grid;gap:8px;margin-top:13px}
      #coach-main .dcc-meal-option{width:100%;display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:10px;min-height:54px;padding:10px 12px;border:1px solid #323c45;border-radius:16px;background:#0a0f13;color:#f4f1eb;text-align:left}
      #coach-main .dcc-meal-option .tick{width:29px;height:29px;display:grid;place-items:center;border:1px solid #45505a;border-radius:50%;color:#7d8791;font-weight:900}
      #coach-main .dcc-meal-option.selected{border-color:#d9aa4a;background:rgba(217,170,74,.08)}
      #coach-main .dcc-meal-option.selected .tick{border-color:#e9c766;background:#e9c766;color:#17120a}
      #coach-main .dcc-meal-option b{font-size:13px}
      #coach-main .dcc-meal-option small{display:block;margin-top:2px;color:#8d96a1;font-size:9px}
      #coach-main .dcc-meal-next{width:100%;min-height:50px;border:1px solid #f1cf71;border-radius:15px;background:linear-gradient(135deg,#f5d577,#dda73e);color:#17110a;font-weight:900}
      #coach-main .dcc-meal-next:disabled{opacity:.45}
      #coach-main .dcc-meal-cancel{width:100%;min-height:44px;border:1px solid #38434d;border-radius:14px;background:#0a0f13;color:#ddd;font-weight:800}
      html.dcc-theme-light-premium body #coach-main .dcc-meal-setup-card,
      html.dcc-theme-light-premium body #coach-main .dcc-meal-option{background:linear-gradient(145deg,#fffefa,#f8f0e3)!important;color:#17191d!important;border-color:rgba(183,123,19,.24)!important}
      html.dcc-theme-light-premium body #coach-main .dcc-meal-setup h2{color:#17191d!important}
      html.dcc-theme-light-premium body #coach-main .dcc-meal-setup p,
      html.dcc-theme-light-premium body #coach-main .dcc-meal-option small{color:#747c87!important}
      html.dcc-theme-light-premium body #coach-main .dcc-meal-count,
      html.dcc-theme-light-premium body #coach-main .dcc-meal-cancel{background:#fffdf8!important;color:#17191d!important;border-color:rgba(183,123,19,.24)!important}
      html.dcc-theme-light-premium body #coach-main .dcc-meal-count.active{background:linear-gradient(135deg,#f5d577,#dda73e)!important;color:#17110a!important}
    `;
    document.head.appendChild(s);
  }

  function pane(){const wrap=document.querySelector('#coach-main .dcc-ca-wrap');return wrap?wrap.lastElementChild:null}
  function meal(name){return {name,options:[{name:'Opción 1',foods:[]}]}}
  function templateKey(id){return 'dcc:diet-meal-template:v3:'+id}
  function saveTemplate(id,names){try{localStorage.setItem(templateKey(id),JSON.stringify(names))}catch(_){}}
  function hasExistingPlan(id){const p=window.data?.diets?.[id];return ['training','rest'].some(t=>Array.isArray(p?.[t]?.meals)&&p[t].meals.length>0)}

  async function persistBoth(id,plan){
    if(!window.supabaseClient)throw new Error('Sin conexión con Supabase');
    const now=new Date().toISOString();
    const rows=['training','rest'].map(t=>({client_id:String(id),diet_type:t,calories:plan[t]?.calories||'',protein:plan[t]?.protein||'',meals:Array.isArray(plan[t]?.meals)?plan[t].meals:[],updated_at:now}));
    const {error}=await window.supabaseClient.from('client_diets').upsert(rows,{onConflict:'client_id,diet_type'});
    if(error)throw error;
    const {data:ok,error:rpcError}=await window.supabaseClient.rpc('dcc_save_diet_plan',{p_client_id:String(id),p_training:plan.training||{},p_rest:plan.rest||{}});
    if(rpcError)throw rpcError;
    if(ok!==true)throw new Error('El servidor no confirmó el guardado de la dieta');
  }

  async function persistNewStructure(id,next){
    if(!window.supabaseClient)throw new Error('Sin conexión con Supabase');
    if(hasExistingPlan(id)){
      const historyId='diet-'+Date.now()+'-'+Math.random().toString(36).slice(2,9);
      const {data:ok,error}=await window.supabaseClient.rpc('dcc_transition_diet_plan',{p_client_id:String(id),p_new_plan:next,p_archive_label:'Plan anterior · antes de crear desde cero',p_history_id:historyId});
      if(error)throw error;
      if(ok!==true)throw new Error('El servidor no confirmó el cambio de dieta');
    }else{
      await persistBoth(id,next);
    }
    window.data=window.data||{};window.data.diets=window.data.diets||{};window.data.diets[id]=next;
    if(typeof window.saveData==='function')window.saveData();
  }

  async function persistType(id,type){
    const d=window.data?.diets?.[id]?.[type];
    if(!d||!window.supabaseClient)throw new Error('No existe la dieta a guardar');
    const {error}=await window.supabaseClient.from('client_diets').upsert({client_id:String(id),diet_type:type,calories:d.calories||'',protein:d.protein||'',meals:Array.isArray(d.meals)?d.meals:[],updated_at:new Date().toISOString()},{onConflict:'client_id,diet_type'});
    if(error)throw error;
    if(typeof window.saveData==='function')window.saveData();
  }

  function renderStep1(id){
    currentId=id;chosenCount=0;selected=[];injectCss();
    const p=pane();if(!p)return;
    p.innerHTML=`<div class="dcc-meal-setup"><div class="dcc-meal-setup-card"><h2>¿Cuántas comidas quieres al día?</h2><p>Elige primero el número. Después selecciona exactamente qué comidas tendrá la dieta.</p><div class="dcc-meal-counts">${[1,2,3,4,5,6,7,8].map(n=>`<button type="button" class="dcc-meal-count" onclick="dccMealSetupCount(${n})">${n}</button>`).join('')}</div></div></div>`;
  }

  function renderStep2(){
    const p=pane();if(!p)return;
    p.innerHTML=`<div class="dcc-meal-setup"><div class="dcc-meal-setup-card"><h2>Elige ${chosenCount} ${chosenCount===1?'comida':'comidas'}</h2><p>Se crearán tanto en día de entrenamiento como en día de descanso.</p><div class="dcc-meal-options">${MEALS.map(name=>`<button type="button" class="dcc-meal-option ${selected.includes(name)?'selected':''}" onclick="dccMealSetupToggle('${name.replace(/'/g,"\\'")}')"><span class="tick">${selected.includes(name)?'✓':''}</span><span><b>${esc(name)}</b><small>${selected.includes(name)?'Seleccionada':'Toca para seleccionar'}</small></span><span>›</span></button>`).join('')}</div></div><button type="button" class="dcc-meal-next" ${selected.length===chosenCount?'':'disabled'} onclick="dccMealSetupCreate()">Crear estructura de dieta</button></div>`;
  }

  function normalizeMealName(name){
    const n=String(name||'').trim().toLowerCase().replace(/[-–—]/g,' ').replace(/\s+/g,' ');
    if(n==='merienda de mañana')return 'media mañana';
    if(n==='merienda de tarde')return 'media tarde';
    return n;
  }

  function remainingMeals(id,type){
    const current=window.data?.diets?.[id]?.[type]?.meals||[];
    const used=new Set(current.map(x=>normalizeMealName(x?.name)));
    return MEALS.filter(name=>!used.has(normalizeMealName(name)));
  }

  function renderAddMealPicker(id,type){
    currentId=id;currentType=type;window.__dccDietEditing=true;injectCss();
    const p=pane();if(!p)return;
    const available=remainingMeals(id,type);
    p.innerHTML=`<div class="dcc-meal-setup"><div class="dcc-meal-setup-card"><h2>¿Qué comida quieres añadir?</h2><p>Elige una de las comidas disponibles.</p><div class="dcc-meal-options">${available.length?available.map(name=>`<button type="button" class="dcc-meal-option" onclick="dccMealAddPreset('${name.replace(/'/g,"\\'")}')"><span class="tick">＋</span><span><b>${esc(name)}</b><small>Añadir a este día</small></span><span>›</span></button>`).join(''):'<div class="dcc-diet-empty">Ya están añadidos todos los tipos de comida disponibles.</div>'}</div></div><button type="button" class="dcc-meal-cancel" onclick="dccClientAdmin('${id}','food')">Volver sin añadir</button></div>`;
  }

  window.dccMealSetupCount=function(n){chosenCount=n;selected=[];renderStep2()};
  window.dccMealSetupToggle=function(name){if(selected.includes(name))selected=selected.filter(x=>x!==name);else if(selected.length<chosenCount)selected.push(name);renderStep2()};

  window.dccMealSetupCreate=async function(){
    if(!currentId||selected.length!==chosenCount)return;
    const id=currentId,names=[...selected];
    const make=()=>names.map(meal);
    const next={training:{calories:'',protein:'',meals:make()},rest:{calories:'',protein:'',meals:make()}};
    try{
      await persistNewStructure(id,next);
      saveTemplate(id,names);
      window.__dccDietEditing=true;
      if(typeof window.dccNutritionV2Edit==='function')window.dccNutritionV2Edit(id);
      else if(typeof window.dccClientAdmin==='function')window.dccClientAdmin(id,'food');
      if(typeof window.toast==='function')window.toast('Estructura de dieta guardada');
    }catch(error){
      console.error('DCC meal setup:',error);
      alert('No se pudo guardar la estructura de la dieta. No se ha aplicado ningún cambio.');
    }
  };

  window.dccMealAddPreset=async function(name){
    const id=currentId,type=currentType;
    const d=window.data?.diets?.[id]?.[type];
    if(!d||!MEALS.includes(name))return;
    d.meals=Array.isArray(d.meals)?d.meals:[];
    if(!d.meals.some(m=>normalizeMealName(m?.name)===normalizeMealName(name)))d.meals.push(meal(name));
    try{
      await persistType(id,type);
      window.__dccDietEditing=true;
      if(typeof window.dccClientAdmin==='function')window.dccClientAdmin(id,'food');
      if(typeof window.toast==='function')window.toast(name+' añadida');
    }catch(error){
      console.error('DCC add preset meal:',error);
      alert('No se pudo guardar la nueva comida.');
    }
  };

  function install(){
    const blank=window.dccNutritionV2Blank;
    if(typeof blank==='function'&&!blank.__dccMealSetupV5){
      const wrapped=function(id){renderStep1(id);return Promise.resolve()};
      wrapped.__dccMealSetupV5=true;wrapped.__base=blank;window.dccNutritionV2Blank=wrapped;
    }
    const add=window.dccDietAddMeal;
    if(typeof add==='function'&&!add.__dccPresetMealV5){
      const wrappedAdd=function(id,type){renderAddMealPicker(id,type||window.__dccDietType||'training');return Promise.resolve()};
      wrappedAdd.__dccPresetMealV5=true;wrappedAdd.__base=add;window.dccDietAddMeal=wrappedAdd;
    }
    return typeof window.dccNutritionV2Blank==='function'&&typeof window.dccDietAddMeal==='function';
  }

  injectCss();
  let tries=0;
  const timer=setInterval(()=>{tries++;install();if(tries>80)clearInterval(timer)},75);
  install();
  window.addEventListener('pageshow',install);
  document.addEventListener('dcc:feature-ready',e=>{if(e?.detail?.feature==='diet')setTimeout(install,0)});
})();