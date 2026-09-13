/* DCC — métricas cliente: histórico canónico de % de grasa */
(function(){
  'use strict';
  const BUILD='20260913-client-fat-history-v12';
  if(window.__dccClientFatHistory===BUILD)return;
  window.__dccClientFatHistory=BUILD;

  const appData=()=>{try{return data||window.data||{}}catch(_){return window.data||{}}};
  const activeId=()=>{try{return currentClientId||null}catch(_){return window.currentClientId||null}};
  const db=()=>{try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient}catch(_){}return window.supabaseClient||null};
  const num=v=>{const n=parseFloat(String(v??'').replace(',','.'));return Number.isFinite(n)?n:null};
  const fmt=v=>{const n=Number(v);return Number.isFinite(n)?n.toLocaleString('es-ES',{minimumFractionDigits:1,maximumFractionDigits:1}):'—'};
  const save=()=>{try{if(typeof saveData==='function')return saveData();if(typeof window.saveData==='function')return window.saveData()}catch(error){console.warn('DCC fat history cache:',error)}};

  function initialFat(c){
    for(const value of [c?.bodyFatInitial,c?.initialBodyFat,c?.initial_body_fat,c?.initialFat,c?.fatInitial]){
      const n=num(value);if(n!=null&&n>0&&n<80)return n;
    }
    return null;
  }

  function rows(id){const value=appData().bodyFatHistory?.[id];return Array.isArray(value)?value:[]}

  function series(id=activeId()){
    if(!id)return[];
    const d=appData(),c=(d.clients||[]).find(x=>String(x.id)===String(id)),out=[];
    const push=(value,at,label)=>{
      const v=num(value);if(v==null||v<=0||v>=80)return;
      if(out.length&&Math.abs(out[out.length-1].v-v)<.001)return;
      out.push({v,at:at||null,label:label||''});
    };
    push(initialFat(c),null,'Inicio');
    rows(id).forEach((r,i)=>push(r?.bodyFat??r?.body_fat,r?.recorded_at??r?.recordedAt,`R${i+1}`));
    return out;
  }

  async function syncHistory(id=activeId()){
    const database=db(),d=appData();if(!id||!database)return false;
    try{
      const {data:history,error}=await database.from('client_body_fat_history').select('body_fat,recorded_at').eq('client_id',String(id)).order('recorded_at',{ascending:true});
      if(error)throw error;
      d.bodyFatHistory=d.bodyFatHistory||{};
      d.bodyFatHistory[id]=(history||[]).map(r=>({bodyFat:Number(r.body_fat),body_fat:Number(r.body_fat),recorded_at:r.recorded_at}));
      const current=d.bodyFatHistory[id].at(-1)?.bodyFat;
      const c=(d.clients||[]).find(x=>String(x.id)===String(id));
      if(c&&Number.isFinite(current)){c.bodyFat=current;c.body_fat=current}
      save();
      return true;
    }catch(error){console.error('DCC sincronizando histórico de grasa:',error);return false}
  }

  function chart(points){
    if(points.length<2)return '<div class="dcpr6-chart-empty">Necesitamos más registros para mostrar esta evolución.</div>';
    const W=720,H=166,L=48,R=18,T=14,B=15,vals=points.map(x=>x.v);
    let min=Math.min(...vals),max=Math.max(...vals),span=max-min;
    if(span<1){min-=.5;max+=.5;span=max-min}else{const pad=span*.18;min-=pad;max+=pad;span=max-min}
    const coords=points.map((p,i)=>({x:L+(W-L-R)*(i/(points.length-1)),y:T+(H-T-B)*((max-p.v)/span)}));
    const line=coords.map((p,i)=>`${i?'L':'M'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
    const area=`${line} L ${coords.at(-1).x.toFixed(1)} ${H-B} L ${coords[0].x.toFixed(1)} ${H-B} Z`;
    const dots=coords.map(p=>`<circle cx="${p.x}" cy="${p.y}" r="4" fill="#f4c75c" stroke="#fff0bb" stroke-width="1.2"/>`).join('');
    const labels=points.map((p,i)=>`<span>${i===0&&p.label==='Inicio'?'Inicio':`R${i}`}</span>`).join('');
    return `<div class="dcpr6-chart dcc-bfh-chart"><svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><defs><linearGradient id="dccFatGradV12" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#efbb4c" stop-opacity=".28"/><stop offset="1" stop-color="#efbb4c" stop-opacity="0"/></linearGradient></defs><path d="${area}" fill="url(#dccFatGradV12)"/><path d="${line}" fill="none" stroke="#efbb4c" stroke-width="3" vector-effect="non-scaling-stroke"/>${dots}</svg><div class="dcc-bfh-chart-labels">${labels}</div></div>`;
  }

  function ensureStyle(){
    if(document.getElementById('dcc-client-fat-history-v12-style'))return;
    const style=document.createElement('style');style.id='dcc-client-fat-history-v12-style';style.textContent=`
      #client-main .dcc-bfh-chart{position:relative;padding-bottom:18px}#client-main .dcc-bfh-chart svg{height:calc(100% - 18px)!important}
      #client-main .dcc-bfh-chart-labels{position:absolute;left:0;right:0;bottom:0;display:flex;justify-content:space-between;color:#8995a2;font-size:7px}
      #client-main .dcpr6-chip.dcc-fat-good{color:#58e3a7!important}#client-main .dcpr6-chip.dcc-fat-bad{color:#ff757c!important}
    `;document.head.appendChild(style);
  }

  function patchProgress(id=activeId()){
    const root=document.querySelector('#client-main .dcpr6');if(!root||!id)return;
    const points=series(id);if(!points.length)return;
    const initial=points[0].v,current=points.at(-1).v;
    const card=root.querySelector('.dcpr6-metrics .dcpr6-metric:nth-child(2)');
    if(card){
      const start=card.querySelector('.dcpr6-metric-start'),value=card.querySelector('.dcpr6-value'),chip=card.querySelector('.dcpr6-chip');
      if(start)start.textContent=`Inicio ${fmt(initial)}%`;if(value)value.textContent=`${fmt(current)}%`;
      if(chip){const delta=current-initial;chip.classList.remove('neutral','dcc-fat-good','dcc-fat-bad');if(Math.abs(delta)<.05){chip.textContent='Sin cambios';chip.classList.add('neutral')}else if(delta<0){chip.textContent=`↓ ${fmt(Math.abs(delta))} % desde el inicio`;chip.classList.add('dcc-fat-good')}else{chip.textContent=`↑ ${fmt(Math.abs(delta))} % desde el inicio`;chip.classList.add('dcc-fat-bad')}}
    }
    const fatActive=window.dccClientProgressMetric==='fat'||!!root.querySelector('[data-dcpr6-metric="fat"].active');if(!fatActive)return;
    const panel=root.querySelector('.dcpr6-switch + .dcpr6-panel');if(!panel)return;
    const badge=panel.querySelector('.dcpr6-chart-badge');if(badge)badge.textContent=`${fmt(current)}%`;
    const old=panel.querySelector('.dcpr6-chart,.dcpr6-chart-empty');if(old)old.outerHTML=chart(points);
  }

  window.dccSyncBodyFatHistory=syncHistory;
  window.dccGetBodyFatSeries=id=>series(id).map(x=>({...x}));

  ensureStyle();
  const refresh=()=>syncHistory(activeId()).then(ok=>{if(ok)requestAnimationFrame(()=>patchProgress(activeId()))});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',refresh,{once:true});else refresh();
  window.addEventListener('pageshow',refresh);
  document.addEventListener('click',event=>{
    if(event.target.closest('#client-main .dcpr6 [data-dcpr6-metric="fat"]'))requestAnimationFrame(()=>patchProgress(activeId()));
  },true);
})();