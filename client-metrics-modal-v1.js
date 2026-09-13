/* DCC — Métricas cliente v1: edición estable de peso y % de grasa sin prompt nativo */
(function(){
  'use strict';
  if(window.__dccClientMetricsModalV1)return;
  window.__dccClientMetricsModalV1=true;

  const OVERLAY_ID='dcc-client-metric-overlay-v1';
  const STYLE_ID='dcc-client-metric-overlay-v1-css';

  const appData=()=>{try{return data||{}}catch(e){return window.data||{}}};
  const activeId=()=>{try{return currentClientId||null}catch(e){return window.currentClientId||null}};
  const getClient=id=>(appData().clients||[]).find(c=>String(c.id)===String(id))||null;
  const database=()=>{try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient}catch(e){}return window.supabaseClient||null};
  const toastSafe=text=>{try{if(typeof toast==='function')return toast(text);if(typeof window.toast==='function')return window.toast(text)}catch(e){}console.log(text)};
  const saveLocal=()=>{try{if(typeof saveData==='function')return saveData();if(typeof window.saveData==='function')return window.saveData()}catch(e){console.error('DCC metrics save:',e)}};
  const parseNumber=v=>{const n=parseFloat(String(v??'').trim().replace(',','.'));return Number.isFinite(n)?n:null};
  const money1=v=>Number(v).toFixed(1).replace('.',',');

  function ensureCss(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      #${OVERLAY_ID}{position:fixed;inset:0;z-index:60000;display:flex;align-items:center;justify-content:center;padding:18px;background:rgba(6,9,12,.76);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}
      #${OVERLAY_ID} *{box-sizing:border-box}
      #${OVERLAY_ID} .dcc-metric-card{width:min(100%,430px);padding:20px;border:1px solid rgba(224,173,76,.48);border-radius:24px;background:radial-gradient(circle at 95% 0,rgba(240,201,107,.09),transparent 30%),linear-gradient(145deg,#11171c,#080c10 76%);box-shadow:0 26px 70px rgba(0,0,0,.48);color:#f7f5f0}
      #${OVERLAY_ID} .dcc-metric-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:16px}
      #${OVERLAY_ID} .dcc-metric-kicker{color:#f0c96b;font-size:10px;font-weight:850;letter-spacing:2.2px;text-transform:uppercase}
      #${OVERLAY_ID} h2{margin:5px 0 0;font-size:24px;letter-spacing:-.5px;color:#f7f5f0}
      #${OVERLAY_ID} .dcc-metric-close{width:42px;height:42px;flex:none;border:1px solid rgba(224,173,76,.38);border-radius:13px;background:#0c1116;color:#f0c96b;font-size:22px}
      #${OVERLAY_ID} label{display:block;color:#a5adb7;font-size:11px;font-weight:750;letter-spacing:.4px}
      #${OVERLAY_ID} input{width:100%;height:54px;margin-top:8px;padding:0 14px;border:1px solid rgba(224,173,76,.34);border-radius:15px;background:#0b1014;color:#f7f5f0!important;-webkit-text-fill-color:#f7f5f0!important;outline:0;font-size:16px!important;touch-action:manipulation}
      #${OVERLAY_ID} input:focus{border-color:#e4b44a;box-shadow:0 0 0 3px rgba(217,170,74,.10)}
      #${OVERLAY_ID} .dcc-metric-hint{margin:8px 1px 0;color:#7f8994;font-size:10px;line-height:1.4}
      #${OVERLAY_ID} .dcc-metric-save{width:100%;height:52px;margin-top:17px;border:1px solid #f0c96b;border-radius:15px;background:linear-gradient(135deg,#f3cf69,#d9a73e);color:#11100b;font-size:14px;font-weight:900}
      #${OVERLAY_ID} .dcc-metric-save:disabled{opacity:.55}
      body.dcc-client-metric-open{overflow:hidden}
      @media(max-width:430px){#${OVERLAY_ID}{align-items:flex-end;padding:12px}#${OVERLAY_ID} .dcc-metric-card{border-radius:22px;padding:18px;margin-bottom:calc(72px + env(safe-area-inset-bottom))}}
      html.dcc-theme-light-premium #${OVERLAY_ID}{background:rgba(55,45,30,.20)}
      html.dcc-theme-light-premium #${OVERLAY_ID} .dcc-metric-card{background:linear-gradient(145deg,#fffefa,#f8f1e5);color:#17191d;border-color:rgba(183,123,19,.34);box-shadow:0 24px 70px rgba(78,58,28,.18)}
      html.dcc-theme-light-premium #${OVERLAY_ID} h2{color:#17191d}
      html.dcc-theme-light-premium #${OVERLAY_ID} .dcc-metric-close{background:#fffaf1;color:#98640b;border-color:rgba(183,123,19,.34)}
      html.dcc-theme-light-premium #${OVERLAY_ID} label{color:#5f6874}
      html.dcc-theme-light-premium #${OVERLAY_ID} input{background:#fffefa;color:#17191d!important;-webkit-text-fill-color:#17191d!important;border-color:rgba(183,123,19,.30)}
    `;
    document.head.appendChild(s);
  }

  function closeMetricModal(){
    document.getElementById(OVERLAY_ID)?.remove();
    document.body.classList.remove('dcc-client-metric-open');
  }

  function refreshCheckinPreservingScroll(y){
    if(typeof window.showClient==='function')window.showClient('checkin');
    requestAnimationFrame(()=>window.scrollTo(0,y));
  }

  async function saveWeight(value,y,button){
    const id=activeId(),c=getClient(id),db=database();
    if(!id||!c||!db)throw new Error('No hay conexión con el servidor');

    const {error:clientError}=await db.from('clients').update({weight:value}).eq('id',id);
    if(clientError)throw clientError;

    const {error:historyError}=await db.from('client_weights').insert({client_id:id,weight:value});
    if(historyError)throw historyError;

    c.weight=value;
    const d=appData();d.weights=d.weights||{};d.weights[id]=Array.isArray(d.weights[id])?d.weights[id]:[];d.weights[id].push(value);
    d.checkins=d.checkins||{};d.checkins[id]=d.checkins[id]||{};d.checkins[id].weight=money1(value)+' kg';d.checkins[id].reviewed=false;c.status='Pendiente';
    saveLocal();
    closeMetricModal();
    toastSafe('Peso actualizado correctamente');
    refreshCheckinPreservingScroll(y);
  }

  async function saveBodyFat(value,y,button){
    const id=activeId(),c=getClient(id),db=database();
    if(!id||!c||!db)throw new Error('No hay conexión con el servidor');

    const {error:historyError}=await db.from('client_body_fat_history').insert({client_id:id,body_fat:value});
    if(historyError)throw historyError;

    const d=appData();d.bodyFatHistory=d.bodyFatHistory||{};d.bodyFatHistory[id]=Array.isArray(d.bodyFatHistory[id])?d.bodyFatHistory[id]:[];d.bodyFatHistory[id].push(value);
    d.checkins=d.checkins||{};d.checkins[id]=d.checkins[id]||{};d.checkins[id].bodyFat=value;d.checkins[id].body_fat=value;d.checkins[id].reviewed=false;c.bodyFat=value;c.body_fat=value;c.status='Pendiente';
    saveLocal();
    closeMetricModal();
    toastSafe('% de grasa actualizado correctamente');
    refreshCheckinPreservingScroll(y);
  }

  function openMetricModal(type){
    ensureCss();
    closeMetricModal();
    const y=window.scrollY;
    const isWeight=type==='weight';
    const overlay=document.createElement('div');
    overlay.id=OVERLAY_ID;
    overlay.innerHTML=`<div class="dcc-metric-card" role="dialog" aria-modal="true" aria-labelledby="dcc-metric-title"><div class="dcc-metric-head"><div><div class="dcc-metric-kicker">ACTUALIZAR DATO</div><h2 id="dcc-metric-title">${isWeight?'Peso actual':'% de grasa actual'}</h2></div><button type="button" class="dcc-metric-close" aria-label="Cerrar">×</button></div><label>${isWeight?'Introduce tu peso en kg':'Introduce tu porcentaje de grasa'}<input id="dccMetricInputV1" type="text" inputmode="decimal" autocomplete="off" placeholder="${isWeight?'Ej. 78,4':'Ej. 14,5'}" value=""></label><div class="dcc-metric-hint">El campo se abre vacío para evitar reutilizar por error la medición anterior.</div><button type="button" class="dcc-metric-save" id="dccMetricSaveV1">Guardar</button></div>`;
    document.body.appendChild(overlay);
    document.body.classList.add('dcc-client-metric-open');
    const input=overlay.querySelector('#dccMetricInputV1');
    const save=overlay.querySelector('#dccMetricSaveV1');
    const close=()=>{closeMetricModal();requestAnimationFrame(()=>window.scrollTo(0,y))};
    overlay.querySelector('.dcc-metric-close')?.addEventListener('click',close);
    overlay.addEventListener('click',e=>{if(e.target===overlay)close()});
    input?.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();save?.click()}else if(e.key==='Escape')close()});
    save?.addEventListener('click',async()=>{
      const value=parseNumber(input?.value);
      const valid=isWeight ? (value!==null&&value>0&&value<=500) : (value!==null&&value>0&&value<70);
      if(!valid){toastSafe(isWeight?'Introduce un peso válido':'Introduce un % de grasa válido');input?.focus({preventScroll:true});return}
      save.disabled=true;save.textContent='Guardando…';
      try{
        if(isWeight)await saveWeight(value,y,save);else await saveBodyFat(value,y,save);
      }catch(e){console.error('DCC guardando métrica:',e);toastSafe('No se pudo guardar el dato');save.disabled=false;save.textContent='Guardar'}
    });
    requestAnimationFrame(()=>input?.focus({preventScroll:true}));
  }

  window.updateClientWeight=function(){openMetricModal('weight')};
  window.updateClientBodyFat=function(){openMetricModal('bodyFat')};
  window.dccCloseClientMetricModalV1=closeMetricModal;
})();
