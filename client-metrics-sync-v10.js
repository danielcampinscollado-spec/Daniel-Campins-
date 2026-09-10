/* DCC — Métricas cliente v11: historial real de % de grasa + progreso coherente */
(function(){
  'use strict';
  if(window.__dccClientMetricsSyncV11Loaded) return;
  window.__dccClientMetricsSyncV11Loaded=true;

  const appData=()=>{try{return data||{}}catch(e){return window.data||{}};
  const activeId=()=>{try{return currentClientId||null}catch(e){return window.currentClientId||null}};
  const activeClient=()=>{
    const id=activeId();
    return (appData().clients||[]).find(c=>String(c.id)===String(id))||null;
  };
  const database=()=>{try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient}catch(e){}return window.supabaseClient||null};
  const num=v=>{const n=parseFloat(String(v??'').replace(',','.'));return Number.isFinite(n)?n:null};
  const fmt=v=>{const n=Number(v);return Number.isFinite(n)?n.toLocaleString('es-ES',{minimumFractionDigits:1,maximumFractionDigits:1}):'—'};
  const changePct=(current,previous)=>{const c=num(current),p=num(previous);return c==null||p==null||Math.abs(p)<.0001?null:((c-p)/Math.abs(p))*100};
  const save=()=>{try{if(typeof saveData==='function')return saveData();if(typeof window.saveData==='function')return window.saveData()}catch(e){console.error(e)}};
  const notify=t=>{try{if(typeof toast==='function')return toast(t);if(typeof window.toast==='function')return window.toast(t)}catch(e){}console.log(t)};

  function injectStyles(){
    let style=document.getElementById('dcc-client-metrics-v11-style');
    if(style)return;
    style=document.createElement('style');
    style.id='dcc-client-metrics-v11-style';
    style.textContent=`
      #client-main .dch-percent,
      #client-main .dcpr6-percent,
      #client-main .dcpr6 [data-dcpr6-metric="fat"] > span:first-child,
      #client-main .dcc-cc-data-grid .dcc-cc-data:nth-child(2) .dcc-cc-data-icon{
        font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","SF Pro Text","Segoe UI",Arial,sans-serif!important;
        font-weight:400!important;
        letter-spacing:-.04em!important;
      }
      #client-main .dcpr6-chip.dcc-fat-good{border-color:rgba(70,218,154,.64)!important;background:rgba(20,111,75,.18)!important;color:#58e3a7!important}
      #client-main .dcpr6-chip.dcc-fat-bad{border-color:rgba(255,101,109,.58)!important;background:rgba(132,35,42,.18)!important;color:#ff757c!important}
      #client-main .dcc-bfh-chart{position:relative;padding-bottom:18px}
      #client-main .dcc-bfh-chart svg{height:calc(100% - 18px)!important}
      #client-main .dcc-bfh-chart-labels{position:absolute;left:0;right:0;bottom:0;display:flex;justify-content:space-between;gap:2px;color:#8995a2;font-size:7px;line-height:1;overflow:hidden}
      #client-main .dcc-bfh-chart-labels span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-align:center}
    `;
    document.head.appendChild(style);
  }

  function initialFat(c){
    const values=[c?.bodyFatInitial,c?.initialBodyFat,c?.initial_body_fat,c?.initialFat,c?.fatInitial];
    for(const value of values){const n=num(value);if(n!=null&&n>0&&n<70)return n}
    return null;
  }

  function historyRows(id){
    const rows=appData()?.bodyFatHistory?.[id];
    return Array.isArray(rows)?rows:[];
  }

  function bodyFatSeries(id=activeId()){
    if(!id)return[];
    const d=appData(),c=(d.clients||[]).find(x=>String(x.id)===String(id));
    const out=[];
    const push=(value,at,label)=>{
      const v=num(value);if(v==null||v<=0||v>=70)return;
      if(out.length&&Math.abs(out[out.length-1].v-v)<.001)return;
      out.push({v,at:at||null,label:label||''});
    };
    push(initialFat(c),null,'Inicio');
    historyRows(id).forEach((r,i)=>push(r?.bodyFat??r?.body_fat,r?.recorded_at??r?.recordedAt,`R${i+1}`));
    const current=num(d?.checkins?.[id]?.bodyFat??d?.checkins?.[id]?.body_fat??c?.bodyFat??c?.body_fat);
    push(current,d?.checkins?.[id]?.updatedAt??d?.checkins?.[id]?.updated_at,'Actual');
    return out;
  }

  async function persistBodyFat(value){
    const id=activeId(),db=database();
    if(!id||!db)throw new Error('No hay conexión con el servidor');
    const now=new Date().toISOString();

    const latest=await db.from('client_body_fat_history')
      .select('body_fat,recorded_at')
      .eq('client_id',id)
      .order('recorded_at',{ascending:false})
      .limit(1);
    if(latest.error)throw latest.error;

    const currentSave=await db.from('client_checkins').upsert({
      client_id:id,
      body_fat:value,
      updated_at:now
    },{onConflict:'client_id'});
    if(currentSave.error)throw currentSave.error;

    const previous=num(latest.data?.[0]?.body_fat);
    if(previous==null||Math.abs(previous-value)>=.001){
      const historySave=await db.from('client_body_fat_history').insert({
        client_id:id,
        body_fat:value,
        recorded_at:now
      });
      if(historySave.error)throw historySave.error;
    }
  }

  function setBodyFatLocal(value){
    const id=activeId(),c=activeClient(),d=appData();
    if(!id||!c)return;
    d.checkins=d.checkins||{};
    d.checkins[id]=d.checkins[id]||{};
    d.checkins[id].bodyFat=value;
    d.checkins[id].body_fat=value;
    c.bodyFat=value;
    c.body_fat=value;
    save();
  }

  async function syncBodyFatHistory(id=activeId()){
    const db=database(),d=appData();
    if(!id||!db)return false;
    try{
      const [currentRes,historyRes]=await Promise.all([
        db.from('client_checkins').select('body_fat,updated_at').eq('client_id',id).maybeSingle(),
        db.from('client_body_fat_history').select('body_fat,recorded_at').eq('client_id',id).order('recorded_at',{ascending:true})
      ]);
      if(currentRes.error)throw currentRes.error;
      if(historyRes.error)throw historyRes.error;

      d.bodyFatHistory=d.bodyFatHistory||{};
      d.bodyFatHistory[id]=(historyRes.data||[]).map(r=>({
        bodyFat:Number(r.body_fat),
        body_fat:Number(r.body_fat),
        recorded_at:r.recorded_at
      }));

      const c=(d.clients||[]).find(x=>String(x.id)===String(id));
      const value=num(currentRes.data?.body_fat);
      if(c&&value!=null){
        d.checkins=d.checkins||{};
        d.checkins[id]=d.checkins[id]||{};
        d.checkins[id].bodyFat=value;
        d.checkins[id].body_fat=value;
        d.checkins[id].updatedAt=currentRes.data?.updated_at||d.checkins[id].updatedAt;
        c.bodyFat=value;
        c.body_fat=value;
      }
      save();
      requestAnimationFrame(()=>patchProgress(id));
      return true;
    }catch(error){
      console.error('DCC v11 — error sincronizando historial de grasa:',error);
      return false;
    }
  }

  function fatChart(series){
    if(series.length<2)return '<div class="dcpr6-chart-empty">Necesitamos más registros para mostrar esta evolución.<br>En cuanto registres nuevos datos, aparecerá aquí automáticamente.</div>';
    const W=720,H=166,L=48,R=18,T=14,B=15;
    const vals=series.map(x=>x.v);
    let min=Math.min(...vals),max=Math.max(...vals),span=max-min;
    if(span<1){min-=.5;max+=.5;span=max-min}else{const pad=span*.18;min-=pad;max+=pad;span=max-min}
    const coords=series.map((p,i)=>({
      x:L+(series.length===1?0:(W-L-R)*(i/(series.length-1))),
      y:T+(H-T-B)*((max-p.v)/span),
      v:p.v
    }));
    const line=coords.map((p,i)=>`${i?'L':'M'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
    const area=`${line} L ${coords[coords.length-1].x.toFixed(1)} ${H-B} L ${coords[0].x.toFixed(1)} ${H-B} Z`;
    const horizontal=[0,.5,1].map(t=>{const y=T+(H-T-B)*t;return `<line x1="${L}" y1="${y}" x2="${W-R}" y2="${y}" stroke="rgba(145,159,174,.13)" stroke-width="1"/>`}).join('');
    const dots=coords.map(p=>`<circle cx="${p.x}" cy="${p.y}" r="4" fill="#f4c75c" stroke="#fff0bb" stroke-width="1.2"/>`).join('');
    const labels=series.map((p,i)=>`<span>${i===0&&p.label==='Inicio'?'Inicio':`R${i}`}</span>`).join('');
    return `<div class="dcpr6-chart dcc-bfh-chart"><svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><defs><linearGradient id="dccFatGradV11" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#efbb4c" stop-opacity=".28"/><stop offset="1" stop-color="#efbb4c" stop-opacity="0"/></linearGradient></defs>${horizontal}<path d="${area}" fill="url(#dccFatGradV11)"/><path d="${line}" fill="none" stroke="#efbb4c" stroke-width="3" vector-effect="non-scaling-stroke"/>${dots}</svg><div class="dcc-bfh-chart-labels">${labels}</div></div>`;
  }

  function patchProgress(id=activeId()){
    const root=document.querySelector('#client-main .dcpr6');
    if(!root||!id)return;
    const series=bodyFatSeries(id);if(!series.length)return;
    const initial=series[0]?.v,current=series[series.length-1]?.v;
    const card=root.querySelector('.dcpr6-metrics .dcpr6-metric:nth-child(2)');
    if(card){
      const start=card.querySelector('.dcpr6-metric-start'),value=card.querySelector('.dcpr6-value'),chip=card.querySelector('.dcpr6-chip');
      if(start)start.textContent=`Inicio ${fmt(initial)}%`;
      if(value)value.textContent=`${fmt(current)}%`;
      if(chip){
        const delta=current-initial,deltaPct=changePct(current,initial);
        chip.classList.remove('neutral','dcc-fat-good','dcc-fat-bad');
        if(Math.abs(delta)<.05){chip.textContent='Sin cambios';chip.classList.add('neutral')}
        else if(delta<0){chip.textContent=`↓ ${fmt(Math.abs(deltaPct))} % desde el inicio`;chip.classList.add('dcc-fat-good')}
        else{chip.textContent=`↑ ${fmt(Math.abs(deltaPct))} % desde el inicio`;chip.classList.add('dcc-fat-bad')}
      }
    }

    const fatActive=window.dccClientProgressMetric==='fat'||!!root.querySelector('[data-dcpr6-metric="fat"].active');
    if(!fatActive)return;
    const panel=root.querySelector('.dcpr6-switch + .dcpr6-panel');
    if(!panel)return;
    const sub=panel.querySelector('.dcpr6-sub'),badge=panel.querySelector('.dcpr6-chart-badge');
    if(sub)sub.textContent='Tu % de grasa registro a registro.';
    if(badge)badge.textContent=`${fmt(current)}%`;
    const oldChart=panel.querySelector('.dcpr6-chart,.dcpr6-chart-empty');
    if(oldChart)oldChart.outerHTML=fatChart(series);
  }

  function installBodyFatUpdate(){
    const current=window.updateClientBodyFat;
    if(typeof current!=='function'){setTimeout(installBodyFatUpdate,120);return}
    if(current.__dccMetricsV11)return;

    const replacement=async function(){
      const c=activeClient();
      if(!c){notify('No se encontró el cliente');return}
      const text=window.prompt('Introduce tu % de grasa actual:');
      if(text===null)return;
      const value=num(text.trim());
      if(value==null||value<=0||value>=70){notify('Introduce un % de grasa válido');return}
      try{
        await persistBodyFat(value);
        setBodyFatLocal(value);
        await syncBodyFatHistory(activeId());
        notify('% de grasa actualizado correctamente');
        if(typeof window.showClient==='function')window.showClient('checkin');
      }catch(error){
        console.error('DCC v11 — no se pudo guardar % de grasa:',error);
        notify('No se pudo guardar el % de grasa');
      }
    };
    replacement.__dccMetricsV10=true;
    replacement.__dccMetricsV11=true;
    replacement.__base=current;
    window.updateClientBodyFat=replacement;
  }

  document.addEventListener('click',event=>{
    const fatButton=event.target.closest('#client-main .dcpr6 [data-dcpr6-metric="fat"]');
    if(fatButton){
      setTimeout(()=>patchProgress(activeId()),0);
      setTimeout(()=>patchProgress(activeId()),60);
      return;
    }
    const nav=event.target.closest('#client-nav button');
    if(!nav)return;
    const text=(nav.textContent||'').toLowerCase();
    if(text.includes('inicio')||text.includes('progreso')||text.includes('check-in')){
      syncBodyFatHistory(activeId()).then(()=>{
        if(text.includes('progreso'))setTimeout(()=>patchProgress(activeId()),30);
      });
    }
  },true);

  window.dccSyncBodyFatHistory=syncBodyFatHistory;
  window.dccGetBodyFatSeries=id=>bodyFatSeries(id).map(x=>({...x}));

  injectStyles();
  installBodyFatUpdate();
  setTimeout(installBodyFatUpdate,450);
  setTimeout(installBodyFatUpdate,1300);
  setTimeout(installBodyFatUpdate,2600);
  const boot=()=>syncBodyFatHistory(activeId()).then(()=>setTimeout(()=>patchProgress(activeId()),30));
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
