/* DCC — autoridad única de métricas: peso y grasa, server-first + verificación */
(function(){
  'use strict';
  const BUILD='20260913-client-metrics-v4';
  if(window.__dccClientMetricsModalV1===BUILD)return;
  window.__dccClientMetricsModalV1=BUILD;

  const OVERLAY_ID='dcc-client-metric-overlay-v1';
  const STYLE_ID='dcc-client-metric-overlay-v1-css';
  const appData=()=>{try{return data||window.data||{}}catch(_){return window.data||{}}};
  const database=()=>{try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient}catch(_){}return window.supabaseClient||null};
  const getClient=id=>(appData().clients||[]).find(c=>String(c.id)===String(id))||null;
  const toastSafe=text=>{try{if(typeof toast==='function')return toast(text);if(typeof window.toast==='function')return window.toast(text)}catch(_){}console.log(text)};
  const saveLocal=()=>{try{if(typeof saveData==='function')return saveData();if(typeof window.saveData==='function')return window.saveData()}catch(e){console.error('DCC metrics local cache:',e)}};
  const parseNumber=v=>{const n=parseFloat(String(v??'').trim().replace(',','.'));return Number.isFinite(n)?n:null};
  const money1=v=>Number(v).toFixed(1).replace('.',',');
  let forcedClientId=null;

  function currentAppName(){try{return typeof currentApp==='string'?currentApp:(window.currentApp||'')}catch(_){return window.currentApp||''}}
  function activeId(){
    if(forcedClientId)return forcedClientId;
    if(currentAppName()==='coach'||document.querySelector('#coach-main.dcc-ca'))return window.selectedClient??window.__dccClientAdminId??null;
    try{return currentClientId??window.currentClientId??null}catch(_){return window.currentClientId??null}
  }

  function ensureCss(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');s.id=STYLE_ID;s.textContent=`
      #${OVERLAY_ID}{position:fixed;inset:0;z-index:60000;display:flex;align-items:center;justify-content:center;padding:18px;background:rgba(6,9,12,.76);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}
      #${OVERLAY_ID} *{box-sizing:border-box}#${OVERLAY_ID} .dcc-metric-card{width:min(100%,430px);padding:20px;border:1px solid rgba(224,173,76,.48);border-radius:24px;background:radial-gradient(circle at 95% 0,rgba(240,201,107,.09),transparent 30%),linear-gradient(145deg,#11171c,#080c10 76%);box-shadow:0 26px 70px rgba(0,0,0,.48);color:#f7f5f0}
      #${OVERLAY_ID} .dcc-metric-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:16px}#${OVERLAY_ID} .dcc-metric-kicker{color:#f0c96b;font-size:10px;font-weight:850;letter-spacing:2.2px;text-transform:uppercase}#${OVERLAY_ID} h2{margin:5px 0 0;font-size:24px;letter-spacing:-.5px;color:#f7f5f0}
      #${OVERLAY_ID} .dcc-metric-close{width:42px;height:42px;flex:none;border:1px solid rgba(224,173,76,.38);border-radius:13px;background:#0c1116;color:#f0c96b;font-size:22px}#${OVERLAY_ID} label{display:block;color:#a5adb7;font-size:11px;font-weight:750;letter-spacing:.4px}
      #${OVERLAY_ID} input{width:100%;height:54px;margin-top:8px;padding:0 14px;border:1px solid rgba(224,173,76,.34);border-radius:15px;background:#0b1014;color:#f7f5f0!important;-webkit-text-fill-color:#f7f5f0!important;outline:0;font-size:16px!important;touch-action:manipulation}#${OVERLAY_ID} input:focus{border-color:#e4b44a;box-shadow:0 0 0 3px rgba(217,170,74,.10)}
      #${OVERLAY_ID} .dcc-metric-hint{margin:8px 1px 0;color:#7f8994;font-size:10px;line-height:1.4}#${OVERLAY_ID} .dcc-metric-save{width:100%;height:52px;margin-top:17px;border:1px solid #f0c96b;border-radius:15px;background:linear-gradient(135deg,#f3cf69,#d9a73e);color:#11100b;font-size:14px;font-weight:900}#${OVERLAY_ID} .dcc-metric-save:disabled{opacity:.55}body.dcc-client-metric-open{overflow:hidden}
      @media(max-width:430px){#${OVERLAY_ID}{align-items:flex-end;padding:12px}#${OVERLAY_ID} .dcc-metric-card{border-radius:22px;padding:18px;margin-bottom:calc(72px + env(safe-area-inset-bottom))}}
      html.dcc-theme-light-premium #${OVERLAY_ID}{background:rgba(55,45,30,.20)}html.dcc-theme-light-premium #${OVERLAY_ID} .dcc-metric-card{background:linear-gradient(145deg,#fffefa,#f8f1e5);color:#17191d;border-color:rgba(183,123,19,.34);box-shadow:0 24px 70px rgba(78,58,28,.18)}html.dcc-theme-light-premium #${OVERLAY_ID} h2{color:#17191d}html.dcc-theme-light-premium #${OVERLAY_ID} .dcc-metric-close{background:#fffaf1;color:#98640b;border-color:rgba(183,123,19,.34)}html.dcc-theme-light-premium #${OVERLAY_ID} label{color:#5f6874}html.dcc-theme-light-premium #${OVERLAY_ID} input{background:#fffefa;color:#17191d!important;-webkit-text-fill-color:#17191d!important;border-color:rgba(183,123,19,.30)}
    `;document.head.appendChild(s);
  }

  function closeMetricModal(){document.getElementById(OVERLAY_ID)?.remove();document.body.classList.remove('dcc-client-metric-open');forcedClientId=null}

  function refreshAfterSave(id,y){
    const coach=document.querySelector('#coach-main.dcc-ca')||currentAppName()==='coach';
    if(coach&&typeof window.dccClientAdmin==='function')window.dccClientAdmin(id,'summary');
    else if(typeof window.showClient==='function')window.showClient('checkin');
    requestAnimationFrame(()=>window.scrollTo(0,y));
  }

  async function verifyWeight(db,id,value){
    const r=await db.from('clients').select('weight').eq('id',String(id)).maybeSingle();
    if(r.error)throw r.error;
    const saved=parseNumber(r.data?.weight);
    if(saved===null||Math.abs(saved-value)>=0.001)throw new Error('El peso guardado no coincide con el servidor');
  }

  async function verifyBodyFat(db,id,value){
    const r=await db.from('client_body_fat_history').select('body_fat').eq('client_id',String(id)).order('recorded_at',{ascending:false}).limit(1);
    if(r.error)throw r.error;
    const saved=parseNumber(r.data?.[0]?.body_fat);
    if(saved===null||Math.abs(saved-value)>=0.001)throw new Error('El porcentaje guardado no coincide con el servidor');
  }

  async function saveWeight(value,y){
    const id=activeId(),c=getClient(id),db=database();if(!id||!c||!db)throw new Error('No hay cliente activo o conexión con el servidor');
    const {data:ok,error}=await db.rpc('dcc_add_weight',{p_client_id:String(id),p_weight:value});if(error)throw error;if(ok!==true)throw new Error('El servidor no confirmó el peso');await verifyWeight(db,id,value);
    c.weight=value;c.status='Pendiente';const d=appData();d.weights=d.weights||{};d.weights[id]=Array.isArray(d.weights[id])?d.weights[id]:[];const last=parseNumber(typeof d.weights[id].at?.(-1)==='object'?d.weights[id].at(-1)?.weight:d.weights[id].at?.(-1));if(last===null||Math.abs(last-value)>=0.001)d.weights[id].push(value);
    d.checkins=d.checkins||{};d.checkins[id]=d.checkins[id]||{};d.checkins[id].weight=money1(value)+' kg';d.checkins[id].reviewed=false;saveLocal();closeMetricModal();toastSafe('Peso actualizado correctamente');refreshAfterSave(id,y);
  }

  async function saveBodyFat(value,y){
    const id=activeId(),c=getClient(id),db=database();if(!id||!c||!db)throw new Error('No hay cliente activo o conexión con el servidor');
    const {data:ok,error}=await db.rpc('dcc_record_body_fat',{p_client_id:String(id),p_body_fat:value});if(error)throw error;if(ok!==true)throw new Error('El servidor no confirmó el porcentaje de grasa');await verifyBodyFat(db,id,value);
    const d=appData();d.bodyFatHistory=d.bodyFatHistory||{};d.bodyFatHistory[id]=Array.isArray(d.bodyFatHistory[id])?d.bodyFatHistory[id]:[];const last=d.bodyFatHistory[id].at?.(-1);const lastValue=parseNumber(typeof last==='object'?(last.body_fat??last.bodyFat??last.value):last);if(lastValue===null||Math.abs(lastValue-value)>=0.001)d.bodyFatHistory[id].push({bodyFat:value,body_fat:value,recorded_at:new Date().toISOString()});
    d.checkins=d.checkins||{};d.checkins[id]=d.checkins[id]||{};d.checkins[id].bodyFat=value;d.checkins[id].body_fat=value;d.checkins[id].reviewed=false;c.bodyFat=value;c.body_fat=value;c.currentBodyFat=value;c.latestBodyFat=value;c.status='Pendiente';saveLocal();closeMetricModal();toastSafe('% de grasa actualizado correctamente');refreshAfterSave(id,y);
  }

  function openMetricModal(type,idOverride=null){
    ensureCss();closeMetricModal();forcedClientId=idOverride==null?null:String(idOverride);const id=activeId();if(!id||!getClient(id)){forcedClientId=null;toastSafe('No se encontró el cliente activo');return}
    const y=window.scrollY,isWeight=type==='weight';const overlay=document.createElement('div');overlay.id=OVERLAY_ID;overlay.innerHTML=`<div class="dcc-metric-card" role="dialog" aria-modal="true" aria-labelledby="dcc-metric-title"><div class="dcc-metric-head"><div><div class="dcc-metric-kicker">ACTUALIZAR DATO</div><h2 id="dcc-metric-title">${isWeight?'Peso actual':'% de grasa actual'}</h2></div><button type="button" class="dcc-metric-close" aria-label="Cerrar">×</button></div><label>${isWeight?'Introduce el peso en kg':'Introduce el porcentaje de grasa'}<input id="dccMetricInputV1" type="text" inputmode="decimal" autocomplete="off" placeholder="${isWeight?'Ej. 78,4':'Ej. 14,5'}" value=""></label><div class="dcc-metric-hint">El campo se abre vacío para evitar reutilizar por error la medición anterior.</div><button type="button" class="dcc-metric-save" id="dccMetricSaveV1">Guardar</button></div>`;
    document.body.appendChild(overlay);document.body.classList.add('dcc-client-metric-open');const input=overlay.querySelector('#dccMetricInputV1'),save=overlay.querySelector('#dccMetricSaveV1');const close=()=>{closeMetricModal();requestAnimationFrame(()=>window.scrollTo(0,y))};overlay.querySelector('.dcc-metric-close')?.addEventListener('click',close);overlay.addEventListener('click',e=>{if(e.target===overlay)close()});input?.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();save?.click()}else if(e.key==='Escape')close()});save?.addEventListener('click',async()=>{const value=parseNumber(input?.value);const valid=isWeight?(value!==null&&value>0&&value<=500):(value!==null&&value>0&&value<70);if(!valid){toastSafe(isWeight?'Introduce un peso válido':'Introduce un % de grasa válido');input?.focus({preventScroll:true});return}save.disabled=true;save.textContent='Guardando…';try{if(isWeight)await saveWeight(value,y);else await saveBodyFat(value,y)}catch(e){console.error('DCC guardando métrica:',e);toastSafe(e.message||'No se pudo guardar el dato');save.disabled=false;save.textContent='Guardar'}});requestAnimationFrame(()=>input?.focus({preventScroll:true}));
  }

  window.dccOpenClientMetricModal=openMetricModal;
  window.updateClientWeight=function(){openMetricModal('weight')};
  window.updateClientBodyFat=function(){openMetricModal('bodyFat')};
  window.addWeight=function(id){openMetricModal('weight',id)};
  window.dccCloseClientMetricModalV1=closeMetricModal;
})();
