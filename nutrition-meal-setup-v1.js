/* DCC — asistente inicial de comidas para crear dieta desde cero */
(function(){
  'use strict';
  if(window.__dccNutritionMealSetupV1)return;
  window.__dccNutritionMealSetupV1=true;

  const MEALS=['Desayuno','Merienda de mañana','Comida','Pre entreno','Post entreno','Merienda de tarde','Cena','Post cena'];
  let chosenCount=0;
  let selected=[];
  let currentId=null;
  let baseBlank=null;

  function injectCss(){
    if(document.getElementById('dcc-nutrition-meal-setup-v1-css'))return;
    const s=document.createElement('style');
    s.id='dcc-nutrition-meal-setup-v1-css';
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
      #coach-main .dcc-meal-option small{color:#8d96a1;font-size:9px}
      #coach-main .dcc-meal-next{width:100%;min-height:50px;border:1px solid #f1cf71;border-radius:15px;background:linear-gradient(135deg,#f5d577,#dda73e);color:#17110a;font-weight:900}
      #coach-main .dcc-meal-next:disabled{opacity:.45}
      html.dcc-theme-light-premium body #coach-main .dcc-meal-setup-card,
      html.dcc-theme-light-premium body #coach-main .dcc-meal-option{background:linear-gradient(145deg,#fffefa,#f8f0e3)!important;color:#17191d!important;border-color:rgba(183,123,19,.24)!important}
      html.dcc-theme-light-premium body #coach-main .dcc-meal-setup h2{color:#17191d!important}
      html.dcc-theme-light-premium body #coach-main .dcc-meal-setup p,
      html.dcc-theme-light-premium body #coach-main .dcc-meal-option small{color:#747c87!important}
      html.dcc-theme-light-premium body #coach-main .dcc-meal-count{background:#fffdf8!important;color:#17191d!important;border-color:rgba(183,123,19,.24)!important}
      html.dcc-theme-light-premium body #coach-main .dcc-meal-count.active{background:linear-gradient(135deg,#f5d577,#dda73e)!important;color:#17110a!important}
    `;
    document.head.appendChild(s);
  }

  function pane(){
    const wrap=document.querySelector('#coach-main .dcc-ca-wrap');
    return wrap?wrap.lastElementChild:null;
  }

  function renderStep1(id){
    currentId=id;chosenCount=0;selected=[];injectCss();
    const p=pane();if(!p)return;
    p.innerHTML=`<div class="dcc-meal-setup"><div class="dcc-meal-setup-card"><h2>¿Cuántas comidas quieres al día?</h2><p>Elige primero el número de comidas. Después selecciona cuáles serán.</p><div class="dcc-meal-counts">${[1,2,3,4,5,6,7,8].map(n=>`<button type="button" class="dcc-meal-count" onclick="dccMealSetupCount(${n})">${n}</button>`).join('')}</div></div></div>`;
  }

  function renderStep2(){
    const p=pane();if(!p)return;
    p.innerHTML=`<div class="dcc-meal-setup"><div class="dcc-meal-setup-card"><h2>Elige ${chosenCount} ${chosenCount===1?'comida':'comidas'}</h2><p>Selecciona exactamente ${chosenCount}. Estas comidas se crearán tanto para día de entrenamiento como para día de descanso.</p><div class="dcc-meal-options">${MEALS.map(name=>`<button type="button" class="dcc-meal-option ${selected.includes(name)?'selected':''}" onclick="dccMealSetupToggle('${name.replace(/'/g,"\\'")}')"><span class="tick">${selected.includes(name)?'✓':''}</span><span><b>${name}</b><small>${selected.includes(name)?'Seleccionada':'Toca para seleccionar'}</small></span><span>›</span></button>`).join('')}</div></div><button type="button" class="dcc-meal-next" ${selected.length===chosenCount?'':'disabled'} onclick="dccMealSetupCreate()">Crear estructura de dieta</button></div>`;
  }

  window.dccMealSetupCount=function(n){chosenCount=n;selected=[];renderStep2()};
  window.dccMealSetupToggle=function(name){
    if(selected.includes(name))selected=selected.filter(x=>x!==name);
    else if(selected.length<chosenCount)selected.push(name);
    renderStep2();
  };

  window.dccMealSetupCreate=async function(){
    if(!currentId||!baseBlank||selected.length!==chosenCount)return;
    const id=currentId,names=[...selected];
    await baseBlank(id);
    const make=()=>names.map(name=>({name,options:[{name:'Opción 1',foods:[]}]}));
    window.data=window.data||{};window.data.diets=window.data.diets||{};
    window.data.diets[id]={training:{calories:'',protein:'',meals:make()},rest:{calories:'',protein:'',meals:make()}};
    try{
      if(window.supabaseClient){
        const {data:ok,error}=await window.supabaseClient.rpc('dcc_save_diet_plan',{p_client_id:String(id),p_training:window.data.diets[id].training,p_rest:window.data.diets[id].rest});
        if(error||ok!==true)throw error||new Error('Guardado no confirmado');
      }
      if(typeof window.saveData==='function')window.saveData();
      if(typeof window.dccNutritionV2Edit==='function')window.dccNutritionV2Edit(id);
      if(typeof window.toast==='function')window.toast('Estructura de dieta creada');
    }catch(error){
      console.error('DCC meal setup:',error);
      alert('No se pudo guardar la estructura de la dieta.');
    }
  };

  function install(){
    const fn=window.dccNutritionV2Blank;
    if(typeof fn!=='function')return false;
    if(fn.__dccMealSetupV1)return true;
    baseBlank=fn;
    const wrapped=function(id){
      renderStep1(id);
      return Promise.resolve();
    };
    wrapped.__dccMealSetupV1=true;
    wrapped.__base=fn;
    window.dccNutritionV2Blank=wrapped;
    return true;
  }

  injectCss();
  if(!install()){
    let tries=0;const timer=setInterval(()=>{tries++;if(install()||tries>80)clearInterval(timer)},75);
  }
})();