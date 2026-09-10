/* DCC — entrenador v4: check-in sincronizado + historial real de grasa + iconografía DCC */
(function(){
  'use strict';

  function appData(){try{return data||{}}catch(e){return window.data||{}}}
  function database(){try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient}catch(e){}return window.supabaseClient||null}
  function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
  function num(v){const n=parseFloat(String(v??'').replace(',','.'));return Number.isFinite(n)?n:null}
  function fmt(v){const n=Number(v);return Number.isFinite(n)?n.toLocaleString('es-ES',{minimumFractionDigits:1,maximumFractionDigits:1}):'—'}

  function injectStyles(){
    if(document.getElementById('dcc-checkin-history-v4-css'))return;
    const s=document.createElement('style');
    s.id='dcc-checkin-history-v4-css';
    s.textContent=`
      #dcc-ci-modal .dcc-ci-rico .dcc-ci-percent{font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","SF Pro Text","Segoe UI",Arial,sans-serif;font-size:23px;font-weight:400;line-height:1;letter-spacing:-.05em;color:#f0c35d}
      #dcc-ci-modal .dcc-ci-rico svg{fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}
      #dcc-ci-modal .dcc-ci-rside.good{color:#58e3a7!important}
      #dcc-ci-modal .dcc-ci-rside.bad{color:#ff757c!important}
      #dcc-ci-modal .dcc-ci-rside.neutral{color:#8f9aa7!important}
      #dcc-ci-modal .dcc-ci-rside span{display:block;margin-top:1px;color:#8f9aa7;font-size:8px;line-height:1.1}
      #coach-main .dcc-ca-trend.bad{color:#ff757c!important}
      #coach-main .dcc-bfh-history{margin-top:16px;padding-top:14px;border-top:1px solid rgba(224,173,76,.24)}
      #coach-main .dcc-bfh-head{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:8px}
      #coach-main .dcc-bfh-head b{font-size:12px;color:#f3f1ec}
      #coach-main .dcc-bfh-head span{font-size:8px;color:#8f99a4;text-transform:uppercase;letter-spacing:1px}
      #coach-main .dcc-bfh-list{display:grid;gap:6px;max-height:250px;overflow:auto}
      #coach-main .dcc-bfh-row{display:grid;grid-template-columns:minmax(0,1fr) auto auto;align-items:center;gap:8px;padding:9px 10px;border:1px solid #25303a;border-radius:12px;background:#091015}
      #coach-main .dcc-bfh-row small{display:block;color:#84909c;font-size:8px}
      #coach-main .dcc-bfh-row b{font-size:11px;color:#f2f1ed;white-space:nowrap}
      #coach-main .dcc-bfh-delta{font-size:9px;font-weight:850;white-space:nowrap;color:#9ca6b1}
      #coach-main .dcc-bfh-delta.good{color:#58e3a7}
      #coach-main .dcc-bfh-delta.bad{color:#ff757c}
    `;
    document.head.appendChild(s);
  }

  function clientFor(id){return(appData().clients||[]).find(x=>String(x.id)===String(id))||null}
  function initialFat(c){
    for(const value of [c?.bodyFatInitial,c?.initialBodyFat,c?.initial_body_fat,c?.initialFat,c?.fatInitial]){
      const n=num(value);if(n!=null&&n>0&&n<70)return n;
    }
    return null;
  }

  function fatSeries(id){
    const d=appData(),c=clientFor(id),out=[];
    const push=(value,at,label)=>{
      const v=num(value);if(v==null||v<=0||v>=70)return;
      if(out.length&&Math.abs(out[out.length-1].v-v)<.001)return;
      out.push({v,at:at||null,label:label||''});
    };
    push(initialFat(c),null,'Inicio');
    const rows=Array.isArray(d.bodyFatHistory?.[id])?d.bodyFatHistory[id]:[];
    rows.forEach((r,i)=>push(r?.bodyFat??r?.body_fat,r?.recorded_at??r?.recordedAt,`Registro ${i+1}`));
    const x=d.checkins?.[id]||{};
    push(x.bodyFat??x.body_fat,x.updatedAt??x.updated_at,'Actual');
    return out;
  }

  async function syncBodyFatClient(id){
    const db=database();if(!db||!id)return false;
    try{
      const [currentRes,historyRes]=await Promise.all([
        db.from('client_checkins').select('body_fat,updated_at').eq('client_id',id).maybeSingle(),
        db.from('client_body_fat_history').select('body_fat,recorded_at').eq('client_id',id).order('recorded_at',{ascending:true})
      ]);
      if(currentRes.error)throw currentRes.error;
      if(historyRes.error)throw historyRes.error;
      const d=appData();d.checkins=d.checkins||{};d.bodyFatHistory=d.bodyFatHistory||{};
      d.bodyFatHistory[id]=(historyRes.data||[]).map(r=>({bodyFat:Number(r.body_fat),body_fat:Number(r.body_fat),recorded_at:r.recorded_at}));
      const value=num(currentRes.data?.body_fat),c=clientFor(id);
      if(value!=null){
        d.checkins[id]=d.checkins[id]||{};
        d.checkins[id].bodyFat=value;d.checkins[id].body_fat=value;d.checkins[id].updatedAt=currentRes.data?.updated_at||d.checkins[id].updatedAt;
        if(c){c.bodyFat=value;c.body_fat=value}
      }
      try{if(typeof saveData==='function')saveData();else if(typeof window.saveData==='function')window.saveData()}catch(e){}
      return true;
    }catch(e){console.error('DCC historial de grasa entrenador:',e);return false}
  }

  async function syncCheckinsFromDatabase(){
    const db=database();if(!db)return false;
    try{
      const [checkinsRes,historyRes]=await Promise.all([
        db.from('client_checkins').select('client_id,weight,diet,training,energy,comment,reviewed,body_fat,sent_at,updated_at'),
        db.from('client_body_fat_history').select('client_id,body_fat,recorded_at').order('recorded_at',{ascending:true})
      ]);
      if(checkinsRes.error)throw checkinsRes.error;
      if(historyRes.error)throw historyRes.error;
      const d=appData();d.checkins=d.checkins||{};
      (checkinsRes.data||[]).forEach(r=>{
        const prev=d.checkins[r.client_id]||{};
        d.checkins[r.client_id]={...prev,weight:r.weight??prev.weight??'',diet:r.diet??prev.diet??'',training:r.training??prev.training??'',energy:r.energy??prev.energy??'',comment:r.comment??prev.comment??'',reviewed:!!r.reviewed,bodyFat:r.body_fat!=null?Number(r.body_fat):(prev.bodyFat??''),body_fat:r.body_fat!=null?Number(r.body_fat):(prev.body_fat??''),sentAt:r.sent_at??prev.sentAt??null,updatedAt:r.updated_at??prev.updatedAt??null};
        const c=clientFor(r.client_id);if(c){c.status=r.reviewed?'Revisado':'Pendiente';if(r.body_fat!=null){c.bodyFat=Number(r.body_fat);c.body_fat=Number(r.body_fat)}}
      });
      const grouped={};(d.clients||[]).forEach(c=>{grouped[c.id]=[]});
      (historyRes.data||[]).forEach(r=>{grouped[r.client_id]=grouped[r.client_id]||[];grouped[r.client_id].push({bodyFat:Number(r.body_fat),body_fat:Number(r.body_fat),recorded_at:r.recorded_at})});
      d.bodyFatHistory=grouped;
      try{if(typeof saveData==='function')saveData();else if(typeof window.saveData==='function')window.saveData()}catch(e){console.warn(e)}
      return true;
    }catch(e){console.error('DCC recepción check-ins entrenador:',e);return false}
  }

  const icons={
    weight:'<svg viewBox="0 0 24 24"><rect x="5" y="6" width="14" height="13" rx="3"/><path d="M9 9.5c1.9-1.5 4.1-1.5 6 0"/><path d="M12 9.5v3"/></svg>',
    fat:'<span class="dcc-ci-percent">%</span>',
    food:'<svg viewBox="0 0 24 24"><path d="M7 3v7M4.5 3v4.5A2.5 2.5 0 0 0 7 10v11M9.5 3v4.5A2.5 2.5 0 0 1 7 10"/><path d="M16 3v18M16 3c3 2.7 3.5 7.2 0 10"/></svg>',
    train:'<svg viewBox="0 0 24 24"><path d="M3 10v4M6 8v8M18 8v8M21 10v4M6 12h12"/></svg>',
    energy:'<svg viewBox="0 0 24 24"><path d="M13 2 5 13h6l-1 9 9-13h-6V2Z"/></svg>',
    comment:'<svg viewBox="0 0 24 24"><path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.5 8.5 0 0 1-3.5-.8L4 20l1.5-4A7.5 7.5 0 1 1 20 11.5Z"/></svg>'
  };

  function reviewRowByLabel(list,label){return[...list.querySelectorAll('.dcc-ci-review-row')].find(row=>(row.querySelector('.dcc-ci-rlabel')?.textContent||'').trim().toLowerCase()===label.toLowerCase())||null}

  function patchReview(id){
    injectStyles();
    const d=appData(),x=d.checkins?.[id]||{},list=document.querySelector('#dcc-ci-modal .dcc-ci-review-list');
    if(!list)return;

    let energy=reviewRowByLabel(list,'Energía');
    if(!energy){
      energy=document.createElement('div');energy.id='dcc-ci-energy-row';energy.className='dcc-ci-review-row';
      energy.innerHTML=`<div class="dcc-ci-rico">${icons.energy}</div><div><div class="dcc-ci-rlabel">Energía</div><div class="dcc-ci-rvalue">${esc(String(x.energy||'Pendiente'))}</div></div><div class="dcc-ci-rside">${/pendiente/i.test(String(x.energy||''))?'◷ Pendiente':''}</div>`;
      const comment=reviewRowByLabel(list,'Comentario');if(comment)list.insertBefore(energy,comment);else list.appendChild(energy);
    }

    [['Peso','weight'],['% de grasa','fat'],['Alimentación','food'],['Entrenamiento','train'],['Energía','energy'],['Comentario','comment']].forEach(([label,key])=>{
      const row=reviewRowByLabel(list,label);const box=row?.querySelector('.dcc-ci-rico');if(box)box.innerHTML=icons[key];
    });

    const fatRow=reviewRowByLabel(list,'% de grasa');
    if(fatRow){
      const series=fatSeries(id),side=fatRow.querySelector('.dcc-ci-rside');
      const current=num(x.bodyFat??x.body_fat??series.at(-1)?.v);
      if(current!=null){const value=fatRow.querySelector('.dcc-ci-rvalue');if(value)value.textContent=`${fmt(current)} %`}
      if(side){
        side.classList.remove('good','bad','neutral');
        if(series.length>=2){
          const previous=series[series.length-2].v,latest=series[series.length-1].v,delta=latest-previous;
          if(Math.abs(delta)<.05){side.classList.add('neutral');side.innerHTML='Sin cambios<span>desde el anterior</span>'}
          else if(delta<0){side.classList.add('good');side.innerHTML=`↓ ${fmt(Math.abs(delta))} %<span>desde el anterior</span>`}
          else{side.classList.add('bad');side.innerHTML=`↑ ${fmt(Math.abs(delta))} %<span>desde el anterior</span>`}
        }else{side.classList.add('neutral');side.textContent='Sin histórico'}
      }
    }
  }

  function installReviewEnhancements(){
    const current=window.reviewCheckin;
    if(typeof current!=='function'||current.__dccReviewHistoryV4)return false;
    const wrapped=function(id){
      const result=current.apply(this,arguments);
      requestAnimationFrame(()=>patchReview(id));
      setTimeout(()=>patchReview(id),80);
      syncBodyFatClient(id).then(()=>patchReview(id));
      return result;
    };
    wrapped.__dccEnergyReviewV2=true;
    wrapped.__dccReviewHistoryV4=true;
    wrapped.__base=current;
    window.reviewCheckin=wrapped;
    return true;
  }

  function historyDate(at){
    if(!at)return'Valor inicial';
    const d=new Date(at);if(!Number.isFinite(d.getTime()))return'—';
    return d.toLocaleDateString('es-ES',{day:'2-digit',month:'short',year:'2-digit'});
  }

  function patchClientAdmin(id,tab){
    injectStyles();
    const root=document.querySelector('#coach-main .dcc-ca-wrap');if(!root)return;
    const series=fatSeries(id);if(!series.length)return;
    const initial=series[0].v,current=series[series.length-1].v,delta=current-initial;
    const metric=[...root.querySelectorAll('.dcc-ca-metric')].find(el=>/% de grasa/i.test(el.querySelector('small')?.textContent||''));
    if(metric){
      const value=metric.querySelector('b'),trend=metric.querySelector('.dcc-ca-trend');if(value)value.textContent=`${fmt(current)} %`;
      if(trend){
        trend.classList.remove('good','bad');
        if(Math.abs(delta)<.05)trend.textContent='Sin cambios desde el inicio';
        else if(delta<0){trend.textContent=`↓ ${fmt(Math.abs(delta))} % desde el inicio`;trend.classList.add('good')}
        else{trend.textContent=`↑ ${fmt(Math.abs(delta))} % desde el inicio`;trend.classList.add('bad')}
      }
    }

    const activeTab=(tab||root.querySelector('.dcc-ca-tab.active')?.textContent||'').toString().toLowerCase();
    if(!activeTab.includes('progress')&&!activeTab.includes('progreso'))return;
    const infos=[...root.querySelectorAll('.dcc-ca-info')];
    infos.forEach(el=>{
      const label=(el.querySelector('span')?.textContent||'').toLowerCase();
      const b=el.querySelector('b');if(!b)return;
      if(label.includes('% grasa inicial'))b.textContent=`${fmt(initial)} %`;
      if(label.includes('% grasa actual'))b.textContent=`${fmt(current)} %`;
    });
    const card=root.querySelector('.dcc-ca-card');if(!card)return;
    card.querySelector('.dcc-bfh-history')?.remove();
    const history=document.createElement('div');history.className='dcc-bfh-history';
    const rows=series.map((item,i)=>{
      let deltaHtml='<span class="dcc-bfh-delta">Inicio</span>';
      if(i>0){const change=item.v-series[i-1].v;if(Math.abs(change)<.05)deltaHtml='<span class="dcc-bfh-delta">Sin cambios</span>';else if(change<0)deltaHtml=`<span class="dcc-bfh-delta good">↓ ${fmt(Math.abs(change))} %</span>`;else deltaHtml=`<span class="dcc-bfh-delta bad">↑ ${fmt(Math.abs(change))} %</span>`}
      return `<div class="dcc-bfh-row"><div><small>${i===0?'Inicio':historyDate(item.at)}</small><b>${fmt(item.v)} %</b></div>${deltaHtml}</div>`;
    }).join('');
    history.innerHTML=`<div class="dcc-bfh-head"><b>Historial de % de grasa</b><span>${series.length} registros</span></div><div class="dcc-bfh-list">${rows}</div>`;
    card.appendChild(history);
  }

  function installClientAdminEnhancement(){
    const admin=window.dccClientAdmin;
    if(typeof admin==='function'&&!admin.__dccBodyFatHistoryV4){
      const wrapped=function(id,tab='summary'){
        const result=admin.apply(this,arguments);
        requestAnimationFrame(()=>patchClientAdmin(id,tab));
        syncBodyFatClient(id).then(()=>patchClientAdmin(id,tab));
        return result;
      };
      wrapped.__dccBodyFatHistoryV4=true;wrapped.__base=admin;window.dccClientAdmin=wrapped;
    }
    const opener=window.openClient;
    if(typeof opener==='function'&&!opener.__dccBodyFatHistoryV4){
      const wrappedOpen=function(id){
        const result=opener.apply(this,arguments);
        requestAnimationFrame(()=>patchClientAdmin(id,'summary'));
        syncBodyFatClient(id).then(()=>patchClientAdmin(id,'summary'));
        return result;
      };
      wrappedOpen.__dccBodyFatHistoryV4=true;wrappedOpen.__dccAdmin=!!opener.__dccClientAdminPremium;wrappedOpen.__dccClientAdminPremium=!!opener.__dccClientAdminPremium;wrappedOpen.__base=opener;window.openClient=wrappedOpen;window.showClientAdmin=wrappedOpen;
    }
  }

  function installReviewedSync(){
    const current=window.dccMarkCheckinReviewed;
    if(typeof current!=='function'||current.__dccReviewedSyncV2)return false;
    const wrapped=async function(id){
      const db=database(),now=new Date().toISOString();
      try{
        if(db){
          const {error}=await db.from('client_checkins').update({reviewed:true,updated_at:now}).eq('client_id',id);if(error)throw error;
          const {error:clientError}=await db.from('clients').update({status:'Revisado'}).eq('id',id);if(clientError)console.warn('DCC estado cliente revisado:',clientError);
        }
      }catch(e){console.error('DCC sincronización revisión check-in:',e)}
      const x=appData()?.checkins?.[id];if(x){x.reviewed=true;x.reviewedAt=now}
      return current.apply(this,arguments);
    };
    wrapped.__dccReviewedSyncV2=true;wrapped.__base=current;window.dccMarkCheckinReviewed=wrapped;return true;
  }

  function installNavigationSync(){
    const current=window.showCoach;
    if(typeof current!=='function'||current.__dccCheckinRemoteSyncV4)return false;
    const wrapped=function(screen){
      const result=current.apply(this,arguments);
      if(screen==='checkins')syncCheckinsFromDatabase().then(ok=>{if(ok&&window.currentScreen==='checkins')current('checkins')});
      return result;
    };
    wrapped.__dccCheckinRemoteSyncV3=true;wrapped.__dccCheckinRemoteSyncV4=true;wrapped.__base=current;window.showCoach=wrapped;return true;
  }

  function install(){installReviewEnhancements();installReviewedSync();installNavigationSync();installClientAdminEnhancement()}
  injectStyles();install();syncCheckinsFromDatabase();
  setTimeout(install,300);setTimeout(install,1000);setTimeout(install,2200);
  window.addEventListener('load',()=>setTimeout(()=>{install();syncCheckinsFromDatabase()},120));
})();

/* Carga del formulario premium de alta de cliente. */
(function(){
  if(window.__dccNewClientLoaderV1)return;
  window.__dccNewClientLoaderV1=true;
  const existing=[...document.scripts].find(s=>/new-client-premium-v1\.js(?:\?|$)/.test(s.src||''));
  if(existing)return;
  const script=document.createElement('script');
  script.src='./new-client-premium-v1.js?v=20260910-2045';
  script.async=false;
  script.onerror=()=>console.error('DCC: no se pudo cargar new-client-premium-v1.js');
  (document.head||document.documentElement).appendChild(script);
})();

/* Carga del calendario funcional con sesiones reales. */
(function(){
  if(window.__dccCalendarLoaderV12)return;
  window.__dccCalendarLoaderV12=true;
  const existing=[...document.scripts].find(s=>/coach-calendar-v12\.js(?:\?|$)/.test(s.src||''));
  if(existing)return;
  const script=document.createElement('script');
  script.src='./coach-calendar-v12.js?v=20260910-2115';
  script.async=false;
  script.onerror=()=>console.error('DCC: no se pudo cargar coach-calendar-v12.js');
  (document.head||document.documentElement).appendChild(script);
})();

/* Corrige la alineación semanal del calendario en móvil. */
(function(){
  if(window.__dccCalendarAlignmentLoaderV13)return;
  window.__dccCalendarAlignmentLoaderV13=true;
  const existing=[...document.scripts].find(s=>/coach-calendar-alignment-v13\.js(?:\?|$)/.test(s.src||''));
  if(existing)return;
  const script=document.createElement('script');
  script.src='./coach-calendar-alignment-v13.js?v=20260910-2128';
  script.async=false;
  script.onerror=()=>console.error('DCC: no se pudo cargar coach-calendar-alignment-v13.js');
  (document.head||document.documentElement).appendChild(script);
})();

/* Fuerza la agenda a refrescar las sesiones guardadas desde Supabase. */
(function(){
  if(window.__dccCalendarSyncLoaderV14)return;
  window.__dccCalendarSyncLoaderV14=true;
  const existing=[...document.scripts].find(s=>/coach-calendar-sync-v14\.js(?:\?|$)/.test(s.src||''));
  if(existing)return;
  const script=document.createElement('script');
  script.src='./coach-calendar-sync-v14.js?v=20260910-2145';
  script.async=false;
  script.onerror=()=>console.error('DCC: no se pudo cargar coach-calendar-sync-v14.js');
  (document.head||document.documentElement).appendChild(script);
})();

/* Corrige Fecha/Hora del formulario de sesión en Safari móvil. */
(function(){
  if(window.__dccCalendarFormFixLoaderV15)return;
  window.__dccCalendarFormFixLoaderV15=true;
  const existing=[...document.scripts].find(s=>/coach-calendar-form-fix-v15\.js(?:\?|$)/.test(s.src||''));
  if(existing)return;
  const script=document.createElement('script');
  script.src='./coach-calendar-form-fix-v15.js?v=20260910-2130';
  script.async=false;
  script.onerror=()=>console.error('DCC: no se pudo cargar coach-calendar-form-fix-v15.js');
  (document.head||document.documentElement).appendChild(script);
})();
