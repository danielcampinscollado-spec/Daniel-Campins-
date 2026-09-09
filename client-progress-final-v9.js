/* DCC — Progreso cliente final v9: estable, sin parpadeos y métricas sincronizadas */
(function(){
  'use strict';
  if(window.__dccClientProgressFinalV9Loaded) return;
  window.__dccClientProgressFinalV9Loaded=true;

  const appData=()=>{try{return data||{}}catch(e){return window.data||{}}};
  const activeId=()=>{try{return currentClientId||null}catch(e){return window.currentClientId||null}};
  const activeClient=()=>{
    const id=activeId();
    return (appData().clients||[]).find(c=>String(c.id)===String(id))||null;
  };
  const db=()=>{try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient}catch(e){}return window.supabaseClient||null};
  const num=v=>{const n=parseFloat(String(v??'').replace(',','.'));return Number.isFinite(n)?n:null};
  const save=()=>{try{if(typeof saveData==='function')return saveData();if(typeof window.saveData==='function')return window.saveData()}catch(e){console.error(e)}};

  const WEIGHT_SVG='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="6" width="14" height="13" rx="3"/><path d="M9 9.5c1.9-1.5 4.1-1.5 6 0"/><path d="M12 9.5v3"/></svg>';

  function injectStyles(){
    if(document.getElementById('dcc-client-progress-final-v9-style')) return;
    const style=document.createElement('style');
    style.id='dcc-client-progress-final-v9-style';
    style.textContent=`
      /* Mantener el diseño compacto actual sin depender de los parches antiguos. */
      #client-main .dcpr6 .dcpr6-metric{min-height:122px!important;padding:12px 12px 10px!important}
      #client-main .dcpr6 .dcpr6-metric .dcpr6-spark{display:none!important}
      #client-main .dcpr6 .dcpr6-value{margin-top:10px!important;font-size:27px!important;letter-spacing:-.8px!important}
      #client-main .dcpr6 .dcpr6-chip{min-height:24px!important;margin-top:8px!important;padding:4px 8px!important;font-size:9px!important}
      #client-main .dcpr6 .dcpr6-metric-top{gap:8px!important}
      #client-main .dcpr6 .dcpr6-metric-start{margin-top:2px!important}
      #client-main .dcpr6 .dcpr6-switch{margin-bottom:8px!important}
      #client-main .dcpr6 .dcpr6-switch + .dcpr6-panel{padding:13px 14px 11px!important;margin-bottom:10px!important;border-radius:19px!important}
      #client-main .dcpr6 .dcpr6-switch + .dcpr6-panel .dcpr6-panel-head{align-items:center!important}
      #client-main .dcpr6 .dcpr6-switch + .dcpr6-panel .dcpr6-panel-title{align-items:center!important;gap:6px!important}
      #client-main .dcpr6 .dcpr6-switch + .dcpr6-panel .dcpr6-panel-title .dcpr6-icon{width:28px!important;height:28px!important}
      #client-main .dcpr6 .dcpr6-switch + .dcpr6-panel h2{font-size:18px!important;margin:0!important}
      #client-main .dcpr6 .dcpr6-switch + .dcpr6-panel .dcpr6-sub{margin-top:2px!important;font-size:9px!important}
      #client-main .dcpr6 .dcpr6-switch + .dcpr6-panel .dcpr6-chart-badge{padding:6px 9px!important;border-radius:12px!important;font-size:10px!important}
      #client-main .dcpr6 .dcpr6-chart{height:170px!important;margin-top:4px!important}
      #client-main .dcpr6 .dcpr6-chart-empty{height:145px!important;padding:14px!important}

      /* Un solo acordeón de Fuerza, sin listeners duplicados ni renders extra. */
      #client-main .dcpr6 .dcc-v9-force-panel{padding:0!important;overflow:hidden!important}
      #client-main .dcpr6 .dcc-v9-force-toggle{position:relative!important;display:flex!important;align-items:center!important;min-height:70px!important;margin:0!important;padding:14px 48px 14px 16px!important;cursor:pointer!important;user-select:none!important;-webkit-tap-highlight-color:transparent!important}
      #client-main .dcpr6 .dcc-v9-force-toggle::after{content:'';position:absolute;right:19px;top:50%;width:9px;height:9px;border-right:2px solid #e7b64e;border-bottom:2px solid #e7b64e;transform:translateY(-65%) rotate(45deg);transition:transform .18s ease}
      #client-main .dcpr6 .dcc-v9-force-panel.dcc-v9-open .dcc-v9-force-toggle::after{transform:translateY(-35%) rotate(225deg)}
      #client-main .dcpr6 .dcc-v9-force-toggle .dcpr6-sub{margin-top:3px!important;color:#8f9aa7!important;font-size:9px!important}
      #client-main .dcpr6 .dcc-v9-force-panel:not(.dcc-v9-open) .dcpr6-force-list,
      #client-main .dcpr6 .dcc-v9-force-panel:not(.dcc-v9-open) .dcpr6-best{display:none!important}
      #client-main .dcpr6 .dcc-v9-force-panel.dcc-v9-open .dcpr6-force-list{display:block!important;margin:0 14px!important}
      #client-main .dcpr6 .dcc-v9-force-panel.dcc-v9-open .dcpr6-best{display:flex!important;margin:8px 14px 14px!important}

      /* El porcentaje usa siempre el mismo trazo visual fino que en Check-in. */
      #client-main .dcpr6 .dcpr6-percent,
      #client-main .dcpr6 [data-dcpr6-metric="fat"] .dcc-v9-percent,
      #client-main .dcc-cc-data-icon.dcc-v9-percent,
      #client-main .dcc-v9-percent{font-weight:400!important;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","SF Pro Text","Segoe UI",Arial,sans-serif!important;letter-spacing:-.04em!important}

      @media(max-width:430px){
        #client-main .dcpr6 .dcpr6-metrics{gap:6px!important}
        #client-main .dcpr6 .dcpr6-metric{min-height:110px!important;padding:9px 8px 8px!important;border-radius:17px!important}
        #client-main .dcpr6 .dcpr6-value{margin-top:8px!important;font-size:20px!important;letter-spacing:-.45px!important}
        #client-main .dcpr6 .dcpr6-chip{min-height:22px!important;margin-top:6px!important;padding:3px 6px!important;font-size:7.8px!important}
        #client-main .dcpr6 .dcpr6-icon{width:29px!important;height:29px!important}
        #client-main .dcpr6 .dcpr6-metric-title{font-size:10.5px!important}
        #client-main .dcpr6 .dcpr6-metric-start{font-size:7.6px!important}
        #client-main .dcpr6 .dcpr6-switch + .dcpr6-panel{padding:11px 11px 9px!important}
        #client-main .dcpr6 .dcpr6-switch + .dcpr6-panel h2{font-size:16px!important}
        #client-main .dcpr6 .dcpr6-switch + .dcpr6-panel .dcpr6-chart-badge{padding:5px 8px!important;font-size:9px!important}
        #client-main .dcpr6 .dcpr6-chart{height:148px!important;margin-top:2px!important}
        #client-main .dcpr6 .dcpr6-chart-empty{height:125px!important}
        #client-main .dcpr6 .dcc-v9-force-toggle{min-height:64px!important;padding:12px 42px 12px 13px!important}
        #client-main .dcpr6 .dcc-v9-force-toggle::after{right:16px!important}
      }
    `;
    document.head.appendChild(style);
  }

  function leafPercentNodes(root){
    if(!root) return [];
    return [...root.querySelectorAll('span,div')].filter(el=>el.children.length===0 && (el.textContent||'').trim()==='%');
  }

  function normalizeIcons(){
    const main=document.getElementById('client-main');
    if(!main) return;

    /* Cualquier icono % del área cliente usa el mismo peso visual fino. */
    leafPercentNodes(main).forEach(el=>el.classList.add('dcc-v9-percent'));

    const checkinFatIcon=main.querySelector('.dcc-cc-data-grid .dcc-cc-data:nth-child(2) .dcc-cc-data-icon');
    if(checkinFatIcon) checkinFatIcon.classList.add('dcc-v9-percent');

    const root=main.querySelector('.dcpr6');
    if(!root) return;

    const fatTitle=root.querySelector('.dcpr6-metrics .dcpr6-metric:nth-child(2) .dcpr6-metric-title');
    if(fatTitle) fatTitle.textContent='Grasa';

    const fatTop=root.querySelector('.dcpr6-metrics .dcpr6-metric:nth-child(2) .dcpr6-percent');
    if(fatTop) fatTop.classList.add('dcc-v9-percent');

    const fatButton=root.querySelector('[data-dcpr6-metric="fat"]');
    if(fatButton){
      const spans=fatButton.querySelectorAll('span');
      if(spans.length){
        const icon=spans[0];
        icon.textContent='%';
        icon.classList.add('dcc-v9-percent');
        const label=spans[spans.length-1];
        if(label!==icon) label.textContent='Grasa';
      }
    }

    /* El icono de Peso se unifica con el usado en Check-in. */
    const weightTop=root.querySelector('.dcpr6-metrics .dcpr6-metric:nth-child(1) .dcpr6-icon');
    if(weightTop && !weightTop.dataset.dccV9Weight){
      weightTop.innerHTML=WEIGHT_SVG;
      weightTop.dataset.dccV9Weight='1';
    }
    const weightButton=root.querySelector('[data-dcpr6-metric="weight"]');
    if(weightButton){
      const svg=weightButton.querySelector('svg');
      if(svg && !svg.dataset.dccV9Weight){
        svg.outerHTML=WEIGHT_SVG.replace('<svg ','<svg data-dcc-v9-weight="1" ');
      }
    }
  }

  function applyHomeEmptyText(){
    const root=document.querySelector('#client-main .dch-wrap');
    if(!root) return;
    const taskCard=[...root.querySelectorAll('.dch-task-card,.dch-card')].find(card=>/TAREAS PENDIENTES/i.test(card.textContent||''));
    if(taskCard){
      [...taskCard.querySelectorAll('*')].forEach(el=>{
        if(el.children.length===0 && (el.textContent||'').trim()==='Todo al día') el.textContent='Todo al día, sin tareas pendientes';
      });
    }
    leafPercentNodes(root).forEach(el=>el.classList.add('dcc-v9-percent'));
  }

  function applyForceAccordion(){
    const root=document.querySelector('#client-main .dcpr6');
    if(!root) return;
    const head=root.querySelector('.dcpr6-force-head');
    if(!head) return;
    const panel=head.closest('.dcpr6-panel');
    if(!panel) return;

    panel.classList.add('dcc-v9-force-panel');
    head.classList.add('dcc-v9-force-toggle');
    head.setAttribute('role','button');
    head.setAttribute('tabindex','0');

    const open=!!window.dccForceProgressOpen;
    panel.classList.toggle('dcc-v9-open',open);
    head.setAttribute('aria-expanded',String(open));
    const sub=head.querySelector('.dcpr6-sub');
    if(sub) sub.textContent=open?'Variación desde el inicio.':'Pulsa para ver el detalle';
  }

  function applyProgressUI(){
    injectStyles();
    normalizeIcons();
    applyForceAccordion();
  }

  function postRender(){
    applyHomeEmptyText();
    normalizeIcons();
    applyForceAccordion();
  }

  async function syncBodyFatFromServer(){
    const id=activeId(),database=db(),d=appData(),c=activeClient();
    if(!id||!database||!c) return false;
    try{
      const [{data:check,error:checkError},{data:clientRow,error:clientError}]=await Promise.all([
        database.from('client_checkins').select('body_fat,updated_at').eq('client_id',id).maybeSingle(),
        database.from('clients').select('initial_body_fat').eq('id',id).maybeSingle()
      ]);
      if(checkError) throw checkError;
      if(clientError) throw clientError;

      let changed=false;
      const fat=num(check?.body_fat);
      if(fat!=null){
        d.checkins=d.checkins||{};
        d.checkins[id]=d.checkins[id]||{};
        if(num(d.checkins[id].bodyFat)!==fat){d.checkins[id].bodyFat=fat;changed=true;}
        d.checkins[id].body_fat=fat;
        c.bodyFat=fat;
        c.body_fat=fat;
      }

      let initial=num(clientRow?.initial_body_fat);
      if(initial==null && fat!=null){
        const {error}=await database.from('clients').update({initial_body_fat:fat}).eq('id',id);
        if(!error) initial=fat;
      }
      if(initial!=null){
        if(num(c.initial_body_fat)!==initial && num(c.initialBodyFat)!==initial && num(c.bodyFatInitial)!==initial) changed=true;
        c.initial_body_fat=initial;
        c.initialBodyFat=initial;
        c.bodyFatInitial=initial;
      }
      if(changed) save();
      return changed;
    }catch(error){
      console.error('DCC v9 — no se pudo sincronizar grasa corporal:',error);
      return false;
    }
  }

  async function refreshProgressIfNeeded(){
    const changed=await syncBodyFatFromServer();
    if(!changed) return;
    if(document.querySelector('#client-main .dcpr6') && typeof window.dccRenderClientProgressV6==='function'){
      const y=window.scrollY;
      window.dccRenderClientProgressV6();
      applyProgressUI();
      requestAnimationFrame(()=>window.scrollTo({top:y,left:0,behavior:'auto'}));
    }
  }

  function schedulePostRender(){
    requestAnimationFrame(postRender);
  }

  /* Antes de abrir Progreso fijamos el estado. No envolvemos showClient: así evitamos los renders repetidos que provocaban el efecto de vibración. */
  document.addEventListener('click',event=>{
    const nav=event.target.closest('#client-nav button');
    if(!nav) return;
    const action=nav.getAttribute('onclick')||'';
    const label=(nav.textContent||'').trim();
    if(/showClient\s*\(\s*["']progress["']\s*\)/i.test(action)||/progreso/i.test(label)){
      window.dccClientProgressMetric='weight';
      window.dccForceProgressOpen=false;
      refreshProgressIfNeeded();
    }
    schedulePostRender();
  },true);

  /* El renderer base recrea Progreso al cambiar Peso/Grasa/Fuerza. Este listener corre después del suyo, corrige el DOM en el mismo ciclo y evita que se vean textos antiguos entre medias. */
  document.addEventListener('click',event=>{
    const metric=event.target.closest('#client-main .dcpr6 [data-dcpr6-metric]');
    if(metric){
      window.dccForceProgressOpen=false;
      applyProgressUI();
      return;
    }
  },false);

  /* Acordeón robusto y único. */
  document.addEventListener('click',event=>{
    const head=event.target.closest('#client-main .dcpr6 .dcpr6-force-head');
    if(!head) return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    window.dccForceProgressOpen=!window.dccForceProgressOpen;
    applyForceAccordion();
  },true);

  document.addEventListener('keydown',event=>{
    const head=event.target.closest?.('#client-main .dcpr6 .dcpr6-force-head');
    if(!head||(event.key!=='Enter'&&event.key!==' ')) return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    window.dccForceProgressOpen=!window.dccForceProgressOpen;
    applyForceAccordion();
  },true);

  /* Tras actualizar el % de grasa, confirmamos el valor de Supabase y lo dejamos disponible para Inicio, Check-in y Progreso. */
  function installBodyFatHook(){
    const original=window.updateClientBodyFat;
    if(typeof original!=='function'){
      setTimeout(installBodyFatHook,120);
      return;
    }
    if(original.__dccV9BodyFatHook) return;
    const wrapped=function(){
      const result=original.apply(this,arguments);
      const settle=()=>{
        setTimeout(()=>{syncBodyFatFromServer().then(()=>{postRender();});},220);
        setTimeout(()=>{syncBodyFatFromServer().then(()=>{postRender();});},850);
      };
      Promise.resolve(result).then(settle,settle);
      return result;
    };
    Object.assign(wrapped,original);
    wrapped.__dccV9BodyFatHook=true;
    window.updateClientBodyFat=wrapped;
  }

  injectStyles();
  installBodyFatHook();
  setTimeout(installBodyFatHook,600);
  setTimeout(installBodyFatHook,1600);

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',()=>{
      postRender();
      syncBodyFatFromServer();
    },{once:true});
  }else{
    postRender();
    syncBodyFatFromServer();
  }
})();
