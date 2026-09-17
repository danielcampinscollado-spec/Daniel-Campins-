/* DCC — asistente premium para configurar comidas y su orden */
(function(){
  'use strict';

  const BUILD='20260917-nutrition-meal-setup-v9-server-first';
  if(window.__dccNutritionMealSetup===BUILD)return;
  window.__dccNutritionMealSetup=BUILD;

  const MEALS=['Desayuno','Merienda mañana','Comida','Merienda tarde','Cena','Pre-entreno','Post-entreno','Post-cena'];
  let chosenCount=0,selected=[],currentId=null,currentType='training';
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const clone=v=>JSON.parse(JSON.stringify(v??null));

  function injectCss(){
    if(document.getElementById('dcc-nutrition-meal-setup-v9-css'))return;
    const s=document.createElement('style');
    s.id='dcc-nutrition-meal-setup-v9-css';
    s.textContent=`
      #coach-main .dcc-meal-setup{display:grid;gap:12px;margin-top:8px;padding-bottom:8px}
      #coach-main .dcc-meal-progress{display:flex;align-items:center;gap:7px;margin:0 2px 2px}
      #coach-main .dcc-meal-progress span{height:4px;flex:1;border-radius:999px;background:rgba(183,123,19,.15)}
      #coach-main .dcc-meal-progress span.on{background:linear-gradient(90deg,#e5b64c,#f3cf72)}
      #coach-main .dcc-meal-step-label{margin:0 2px;color:#8a8173;font-size:10px;font-weight:850;letter-spacing:.08em;text-transform:uppercase}
      #coach-main .dcc-meal-setup-card{padding:18px;border:1px solid rgba(183,123,19,.24);border-radius:22px;background:linear-gradient(145deg,#fffefa,#f8f0e3);box-shadow:0 14px 34px rgba(88,61,17,.07)}
      #coach-main .dcc-meal-setup h2{margin:0;color:#17191d;font-size:21px;letter-spacing:-.45px}
      #coach-main .dcc-meal-setup p{margin:7px 0 0;color:#747c87;font-size:12px;line-height:1.45}
      #coach-main .dcc-meal-counts{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:16px}
      #coach-main .dcc-meal-count{height:50px;border:1px solid rgba(183,123,19,.24);border-radius:15px;background:#fffdf8;color:#17191d;font-size:16px;font-weight:900;box-shadow:0 4px 12px rgba(88,61,17,.04)}
      #coach-main .dcc-meal-count.active{border-color:#e0ad4c;background:linear-gradient(135deg,#f7dc86,#e5ae40);color:#17110a;box-shadow:0 8px 20px rgba(190,133,31,.16)}
      #coach-main .dcc-meal-options{display:grid;gap:8px;margin-top:15px}
      #coach-main .dcc-meal-option{width:100%;display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:11px;min-height:57px;padding:10px 12px;border:1px solid rgba(183,123,19,.22);border-radius:17px;background:#fffdf8;color:#17191d;text-align:left}
      #coach-main .dcc-meal-option .tick{width:31px;height:31px;display:grid;place-items:center;border:1px solid rgba(121,111,96,.35);border-radius:50%;color:#8a8173;font-size:13px;font-weight:900}
      #coach-main .dcc-meal-option.selected{border-color:#d8a43d;background:linear-gradient(145deg,#fffaf0,#f8ecd7);box-shadow:0 6px 18px rgba(185,128,26,.08)}
      #coach-main .dcc-meal-option.selected .tick{border-color:#e0ad4c;background:linear-gradient(135deg,#f5d577,#dda73e);color:#17120a}
      #coach-main .dcc-meal-option b{font-size:14px}#coach-main .dcc-meal-option small{display:block;margin-top:3px;color:#7c8490;font-size:10px}
      #coach-main .dcc-meal-selected-count{display:inline-flex;margin-top:13px;padding:7px 10px;border-radius:999px;background:#f5ead2;color:#956b18;font-size:10px;font-weight:850}
      #coach-main .dcc-meal-order{display:grid;gap:8px;margin-top:15px}
      #coach-main .dcc-meal-order-row{display:grid;grid-template-columns:34px 1fr auto;align-items:center;gap:10px;min-height:58px;padding:9px 10px;border:1px solid rgba(183,123,19,.22);border-radius:17px;background:#fffdf8}
      #coach-main .dcc-meal-order-num{width:32px;height:32px;display:grid;place-items:center;border-radius:50%;background:#f5ead2;color:#956b18;font-size:12px;font-weight:900}
      #coach-main .dcc-meal-order-row b{color:#17191d;font-size:14px}
      #coach-main .dcc-meal-order-actions{display:flex;gap:6px}
      #coach-main .dcc-meal-move{width:36px;height:36px;border:1px solid rgba(183,123,19,.25);border-radius:11px;background:#fff;color:#7f5a18;font-size:17px;font-weight:900}
      #coach-main .dcc-meal-move:disabled{opacity:.25}
      #coach-main .dcc-meal-actions{display:grid;grid-template-columns:.8fr 1.35fr;gap:8px}
      #coach-main .dcc-meal-next,#coach-main .dcc-meal-back,#coach-main .dcc-meal-cancel{width:100%;min-height:50px;border-radius:15px;font-weight:900}
      #coach-main .dcc-meal-next{border:1px solid #e3b34f;background:linear-gradient(135deg,#f5d577,#dda73e);color:#17110a;box-shadow:0 10px 24px rgba(190,133,31,.14)}
      #coach-main .dcc-meal-next:disabled{opacity:.42;box-shadow:none}
      #coach-main .dcc-meal-back,#coach-main .dcc-meal-cancel{border:1px solid rgba(183,123,19,.22);background:#fffdf8;color:#5f6268}
      #coach-main .dcc-meal-hint{padding:12px 13px;border:1px solid rgba(183,123,19,.18);border-radius:15px;background:rgba(245,234,210,.5);color:#776c5d;font-size:10px;line-height:1.45}
      @media(max-width:520px){#coach-main .dcc-meal-setup-card{padding:16px}#coach-main .dcc-meal-setup h2{font-size:20px}#coach-main .dcc-meal-counts{gap:7px}#coach-main .dcc-meal-count{height:48px}}
    `;
    document.head.appendChild(s);
  }

  function pane(){const w=document.querySelector('#coach-main .dcc-ca-wrap');return w?w.lastElementChild:null}
  function meal(name){return{name,options:[{name:'Opción 1',foods:[]}]}}
  function normalizeMealName(name){const n=String(name||'').trim().toLowerCase().replace(/[-–—]/g,' ').replace(/\s+/g,' ');if(n==='media mañana')return'merienda mañana';if(n==='media tarde')return'merienda tarde';return n}
  function remainingMeals(id,type){const current=window.data?.diets?.[id]?.[type]?.meals||[],used=new Set(current.map(x=>normalizeMealName(x?.name)));return MEALS.filter(name=>!used.has(normalizeMealName(name)))}
  function progress(step){return `<div class="dcc-meal-step-label">Paso ${step} de 3</div><div class="dcc-meal-progress"><span class="on"></span><span class="${step>=2?'on':''}"></span><span class="${step>=3?'on':''}"></span></div>`}

  async function persistBoth(id,plan){
    if(!window.supabaseClient)throw new Error('Sin conexión con Supabase');
    const now=new Date().toISOString();
    const rows=['training','rest'].map(t=>({client_id:String(id),diet_type:t,calories:plan[t]?.calories||'',protein:plan[t]?.protein||'',meals:Array.isArray(plan[t]?.meals)?plan[t].meals:[],updated_at:now}));
    const{error}=await window.supabaseClient.from('client_diets').upsert(rows,{onConflict:'client_id,diet_type'});
    if(error)throw error;
    try{
      const{data:ok,error:rpcError}=await window.supabaseClient.rpc('dcc_save_diet_plan',{p_client_id:String(id),p_training:plan.training||{},p_rest:plan.rest||{}});
      if(rpcError)console.warn('DCC diet RPC mirror:',rpcError);
      else if(ok!==true)console.warn('DCC diet RPC mirror did not confirm true');
    }catch(error){console.warn('DCC diet RPC mirror:',error)}
    return true;
  }

  async function persistType(id,type,day){
    if(!window.supabaseClient)throw new Error('Sin conexión con Supabase');
    const row={client_id:String(id),diet_type:type,calories:day?.calories||'',protein:day?.protein||'',meals:Array.isArray(day?.meals)?day.meals:[],updated_at:new Date().toISOString()};
    const{error}=await window.supabaseClient.from('client_diets').upsert(row,{onConflict:'client_id,diet_type'});
    if(error)throw error;
    return true;
  }

  function renderStep1(id){
    currentId=id;chosenCount=0;selected=[];injectCss();const p=pane();if(!p)return false;
    p.innerHTML=`<div class="dcc-meal-setup">${progress(1)}<div class="dcc-meal-setup-card"><h2>Configura las comidas</h2><p>¿Cuántas comidas quieres que tenga el plan cada día?</p><div class="dcc-meal-counts">${[1,2,3,4,5,6,7,8].map(n=>`<button type="button" class="dcc-meal-count" onclick="dccMealSetupCount(${n})">${n}</button>`).join('')}</div></div><div class="dcc-meal-hint">Después podrás elegir cuáles son y colocarlas en el orden exacto en el que las verá el cliente.</div></div>`;
    return true;
  }

  function renderStep2(){
    const p=pane();if(!p)return;
    p.innerHTML=`<div class="dcc-meal-setup">${progress(2)}<div class="dcc-meal-setup-card"><h2>Elige ${chosenCount} ${chosenCount===1?'comida':'comidas'}</h2><p>Selecciona los momentos de comida que quieres incluir.</p><span class="dcc-meal-selected-count">${selected.length} de ${chosenCount} seleccionadas</span><div class="dcc-meal-options">${MEALS.map(name=>`<button type="button" class="dcc-meal-option ${selected.includes(name)?'selected':''}" onclick="dccMealSetupToggle('${name.replace(/'/g,"\\'")}')"><span class="tick">${selected.includes(name)?'✓':'＋'}</span><span><b>${esc(name)}</b><small>${selected.includes(name)?'Seleccionada':'Toca para seleccionar'}</small></span><span>›</span></button>`).join('')}</div></div><div class="dcc-meal-actions"><button type="button" class="dcc-meal-back" onclick="dccMealSetupBackToCount()">Atrás</button><button type="button" class="dcc-meal-next" ${selected.length===chosenCount?'':'disabled'} onclick="dccMealSetupOrder()">Elegir orden</button></div></div>`;
  }

  function renderStep3(){
    const p=pane();if(!p)return;
    p.innerHTML=`<div class="dcc-meal-setup">${progress(3)}<div class="dcc-meal-setup-card"><h2>Orden de las comidas</h2><p>Este será el orden que verá el cliente. Usa las flechas para colocarlas como quieras.</p><div class="dcc-meal-order">${selected.map((name,i)=>`<div class="dcc-meal-order-row"><span class="dcc-meal-order-num">${i+1}</span><b>${esc(name)}</b><span class="dcc-meal-order-actions"><button type="button" class="dcc-meal-move" ${i===0?'disabled':''} onclick="dccMealSetupMove(${i},-1)" aria-label="Subir ${esc(name)}">↑</button><button type="button" class="dcc-meal-move" ${i===selected.length-1?'disabled':''} onclick="dccMealSetupMove(${i},1)" aria-label="Bajar ${esc(name)}">↓</button></span></div>`).join('')}</div></div><div class="dcc-meal-actions"><button type="button" class="dcc-meal-back" onclick="dccMealSetupBackToMeals()">Atrás</button><button type="button" class="dcc-meal-next" onclick="dccMealSetupCreate()">Crear plan</button></div></div>`;
  }

  function renderAddMealPicker(id,type){
    currentId=id;currentType=type;injectCss();const p=pane();if(!p)return false;const available=remainingMeals(id,type);
    p.innerHTML=`<div class="dcc-meal-setup"><div class="dcc-meal-setup-card"><h2>Añadir un momento de comida</h2><p>Elige el tipo de comida. No tendrás que escribir el nombre manualmente.</p><div class="dcc-meal-options">${available.length?available.map(name=>`<button type="button" class="dcc-meal-option" onclick="dccMealAddPreset('${name.replace(/'/g,"\\'")}')"><span class="tick">＋</span><span><b>${esc(name)}</b><small>Se añadirá al final de este día</small></span><span>›</span></button>`).join(''):'<div class="dcc-meal-hint">Ya están añadidos todos los tipos de comida disponibles.</div>'}</div></div><button type="button" class="dcc-meal-cancel" onclick="dccClientAdmin('${id}','food')">Volver</button></div>`;
    return true;
  }

  window.dccNutritionMealSetupStart=renderStep1;
  window.dccNutritionMealAddStart=(id,type)=>renderAddMealPicker(id,type||window.__dccDietType||'training');
  window.dccMealSetupCount=function(n){chosenCount=n;selected=[];renderStep2()};
  window.dccMealSetupToggle=function(name){if(selected.includes(name))selected=selected.filter(x=>x!==name);else if(selected.length<chosenCount)selected.push(name);renderStep2()};
  window.dccMealSetupBackToCount=function(){renderStep1(currentId)};
  window.dccMealSetupOrder=function(){if(selected.length===chosenCount)renderStep3()};
  window.dccMealSetupBackToMeals=function(){renderStep2()};
  window.dccMealSetupMove=function(index,delta){const to=index+delta;if(to<0||to>=selected.length)return;const next=[...selected],[item]=next.splice(index,1);next.splice(to,0,item);selected=next;renderStep3()};

  window.dccMealSetupCreate=async function(){
    if(!currentId||selected.length!==chosenCount)return;
    const id=currentId,names=[...selected];
    const make=()=>names.map(meal);
    const next={training:{calories:'',protein:'',meals:make()},rest:{calories:'',protein:'',meals:make()}};
    try{
      await persistBoth(id,next);
      window.data=window.data||{};
      window.data.diets=window.data.diets||{};
      window.data.diets[id]=clone(next);
      if(typeof window.saveData==='function')window.saveData();
      try{localStorage.setItem('dcc:diet-meal-template:v4:'+id,JSON.stringify(names))}catch(_){}
      if(typeof window.dccNutritionV2Edit==='function')window.dccNutritionV2Edit(id);else if(typeof window.dccClientAdmin==='function')window.dccClientAdmin(id,'food');
      if(typeof window.toast==='function')window.toast('Plan de alimentación creado');
    }catch(error){
      console.error('DCC meal setup:',error);
      alert('No se pudo guardar la estructura de la dieta. No se ha aplicado ningún cambio.');
    }
  };

  window.dccMealAddPreset=async function(name){
    const id=currentId,type=currentType,current=window.data?.diets?.[id]?.[type];
    if(!current||!MEALS.includes(name))return;
    const nextDay=clone(current)||{calories:'',protein:'',meals:[]};
    nextDay.meals=Array.isArray(nextDay.meals)?nextDay.meals:[];
    if(nextDay.meals.some(m=>normalizeMealName(m?.name)===normalizeMealName(name)))return;
    nextDay.meals.push(meal(name));
    try{
      await persistType(id,type,nextDay);
      window.data.diets[id][type]=clone(nextDay);
      if(typeof window.saveData==='function')window.saveData();
      if(typeof window.dccClientAdmin==='function')window.dccClientAdmin(id,'food');
      if(typeof window.toast==='function')window.toast(name+' añadida');
    }catch(error){
      console.error('DCC add preset meal:',error);
      alert('No se pudo guardar la nueva comida. No se ha aplicado ningún cambio.');
    }
  };

  // Este módulo ya no envuelve ni sustituye dccNutritionV2New/dccNutritionV2Blank.
  // nutrition-plan-premium-v2.js es la única autoridad del flujo superior de Alimentación.
  window.dccDietAddMeal=function(id,type){
    return Promise.resolve(renderAddMealPicker(id,type||window.__dccDietType||'training'));
  };

  injectCss();
})();
