/* DCC — Métricas cliente v10: % grasa persistente + iconografía coherente */
(function(){
  'use strict';
  if(window.__dccClientMetricsSyncV10Loaded) return;
  window.__dccClientMetricsSyncV10Loaded=true;

  const appData=()=>{try{return data||{}}catch(e){return window.data||{}};
  const activeId=()=>{try{return currentClientId||null}catch(e){return window.currentClientId||null}};
  const activeClient=()=>{
    const id=activeId();
    return (appData().clients||[]).find(c=>String(c.id)===String(id))||null;
  };
  const database=()=>{try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient}catch(e){}return window.supabaseClient||null};
  const num=v=>{const n=parseFloat(String(v??'').replace(',','.'));return Number.isFinite(n)?n:null};
  const save=()=>{try{if(typeof saveData==='function')return saveData();if(typeof window.saveData==='function')return window.saveData()}catch(e){console.error(e)}};
  const notify=t=>{try{if(typeof toast==='function')return toast(t);if(typeof window.toast==='function')return window.toast(t)}catch(e){}console.log(t)};

  function injectStyles(){
    if(document.getElementById('dcc-client-metrics-v10-style')) return;
    const style=document.createElement('style');
    style.id='dcc-client-metrics-v10-style';
    style.textContent=`
      /* El símbolo de grasa usa el mismo trazo fino en Inicio, Progreso y Check-in. */
      #client-main .dch-percent,
      #client-main .dcpr6-percent,
      #client-main .dcpr6 [data-dcpr6-metric="fat"] > span:first-child,
      #client-main .dcc-cc-data-grid .dcc-cc-data:nth-child(2) .dcc-cc-data-icon{
        font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","SF Pro Text","Segoe UI",Arial,sans-serif!important;
        font-weight:400!important;
        letter-spacing:-.04em!important;
      }
    `;
    document.head.appendChild(style);
  }

  async function persistBodyFat(value){
    const id=activeId(),db=database();
    if(!id||!db) throw new Error('No hay conexión con el servidor');
    const now=new Date().toISOString();

    const {error}=await db.from('client_checkins').upsert({
      client_id:id,
      body_fat:value,
      updated_at:now
    },{onConflict:'client_id'});
    if(error) throw error;
  }

  function setBodyFatLocal(value){
    const id=activeId(),c=activeClient(),d=appData();
    if(!id||!c) return;
    d.checkins=d.checkins||{};
    d.checkins[id]=d.checkins[id]||{};
    d.checkins[id].bodyFat=value;
    d.checkins[id].body_fat=value;
    c.bodyFat=value;
    c.body_fat=value;
    save();
  }

  async function syncLatestBodyFat(){
    const id=activeId(),db=database(),c=activeClient(),d=appData();
    if(!id||!db||!c) return;
    try{
      const {data:row,error}=await db.from('client_checkins').select('body_fat').eq('client_id',id).maybeSingle();
      if(error) throw error;
      const value=num(row?.body_fat);
      if(value==null) return;
      d.checkins=d.checkins||{};
      d.checkins[id]=d.checkins[id]||{};
      d.checkins[id].bodyFat=value;
      d.checkins[id].body_fat=value;
      c.bodyFat=value;
      c.body_fat=value;
      save();
    }catch(error){
      console.error('DCC v10 — error sincronizando % de grasa:',error);
    }
  }

  function installBodyFatUpdate(){
    const current=window.updateClientBodyFat;
    if(typeof current!=='function'){
      setTimeout(installBodyFatUpdate,100);
      return;
    }
    if(current.__dccMetricsV10) return;

    const replacement=async function(){
      const c=activeClient();
      if(!c){notify('No se encontró el cliente');return;}

      const text=window.prompt('Introduce tu % de grasa actual:');
      if(text===null) return;
      const value=num(text.trim());
      if(value==null||value<=0||value>=70){notify('Introduce un % de grasa válido');return;}

      try{
        await persistBodyFat(value);
        setBodyFatLocal(value);
        notify('% de grasa actualizado correctamente');
        if(typeof window.showClient==='function') window.showClient('checkin');
      }catch(error){
        console.error('DCC v10 — no se pudo guardar % de grasa:',error);
        notify('No se pudo guardar el % de grasa');
      }
    };

    replacement.__dccMetricsV10=true;
    window.updateClientBodyFat=replacement;
  }

  /* Sincronizamos al cambiar entre las zonas donde aparece la métrica. */
  document.addEventListener('click',event=>{
    const nav=event.target.closest('#client-nav button');
    if(!nav) return;
    const text=(nav.textContent||'').toLowerCase();
    if(text.includes('inicio')||text.includes('progreso')||text.includes('check-in')) syncLatestBodyFat();
  },true);

  injectStyles();
  installBodyFatUpdate();
  setTimeout(installBodyFatUpdate,400);
  setTimeout(installBodyFatUpdate,1200);
  setTimeout(installBodyFatUpdate,2400);
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',syncLatestBodyFat,{once:true});
  else syncLatestBodyFat();
})();
