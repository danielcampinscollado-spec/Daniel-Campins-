/* DCC — Progreso cliente final v9: estado determinista, sin parches visuales tardíos */
(function(){
  'use strict';
  if(window.__dccClientProgressFinalV9Loaded) return;
  window.__dccClientProgressFinalV9Loaded=true;

  const appData=()=>{try{return data||{}}catch(e){return window.data||{}};
  const activeId=()=>{try{return currentClientId||null}catch(e){return window.currentClientId||null}};
  const activeClient=()=>{
    const id=activeId();
    return (appData().clients||[]).find(c=>String(c.id)===String(id))||null;
  };
  const db=()=>{try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient}catch(e){}return window.supabaseClient||null};
  const num=v=>{const n=parseFloat(String(v??'').replace(',','.'));return Number.isFinite(n)?n:null};
  const save=()=>{try{if(typeof saveData==='function')return saveData();if(typeof window.saveData==='function')return window.saveData()}catch(e){console.error(e)}};

  function injectStyles(){
    const old=document.getElementById('dcc-client-progress-final-v9-style');
    if(old) old.remove();
    const style=document.createElement('style');
    style.id='dcc-client-progress-final-v9-style';
    style.textContent=`
      /* Tarjetas y gráfico compactos. */
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

      /* Grasa: un único símbolo % en TODAS las recreaciones del renderer. */
      #client-main .dcpr6 .dcpr6-metrics .dcpr6-metric:nth-child(2) .dcpr6-metric-title{
        font-size:0!important;
      }
      #client-main .dcpr6 .dcpr6-metrics .dcpr6-metric:nth-child(2) .dcpr6-metric-title::after{
        content:'Grasa';
        color:#f5f4ef;
        font-size:14px;
        font-weight:780;
        line-height:1.1;
      }
      #client-main .dcpr6 [data-dcpr6-metric="fat"] span:last-child{
        font-size:0!important;
      }
      #client-main .dcpr6 [data-dcpr6-metric="fat"] span:last-child::after{
        content:'Grasa';
        font-size:11px;
        font-weight:800;
      }
      #client-main .dcpr6 .dcpr6-percent,
      #client-main .dcpr6 [data-dcpr6-metric="fat"] span:first-child,
      #client-main .dch-percent,
      #client-main .dcc-cc-data-grid .dcc-cc-data:nth-child(2) .dcc-cc-data-icon{
        font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","SF Pro Text","Segoe UI",Arial,sans-serif!important;
        font-weight:400!important;
        letter-spacing:-.04em!important;
      }

      /* Fuerza: SIEMPRE cerrada tras cada render. Solo abre con la clase puesta por un toque real. */
      #client-main .dcpr6 .dcpr6-force-head{
        position:relative!important;
        display:flex!important;
        align-items:center!important;
        min-height:70px!important;
        margin:0!important;
        padding:14px 52px 14px 16px!important;
        cursor:pointer!important;
        user-select:none!important;
        -webkit-tap-highlight-color:transparent!important;
      }
      #client-main .dcpr6 .dcpr6-force-head::after{
        content:'';
        position:absolute;
        right:20px;
        top:50%;
        width:10px;
        height:10px;
        border-right:2px solid #e7b64e;
        border-bottom:2px solid #e7b64e;
        transform:translateY(-65%) rotate(45deg);
        transition:transform .18s ease;
      }
      #client-main .dcpr6 .dcpr6-panel:has(> .dcpr6-force-head),
      #client-main .dcpr6 .dcc-force-panel{padding:0!important;overflow:hidden!important}
      #client-main .dcpr6 .dcpr6-force-head ~ .dcpr6-force-list,
      #client-main .dcpr6 .dcpr6-force-head ~ .dcpr6-best{display:none!important}
      #client-main .dcpr6 .dcc-force-panel.dcc-force-open .dcpr6-force-list{display:block!important;margin:0 14px!important}
      #client-main .dcpr6 .dcc-force-panel.dcc-force-open .dcpr6-best{display:flex!important;margin:8px 14px 14px!important}
      #client-main .dcpr6 .dcc-force-panel.dcc-force-open .dcpr6-force-head::after{transform:translateY(-35%) rotate(225deg)}
      #client-main .dcpr6 .dcpr6-force-head .dcpr6-sub{margin-top:3px!important;color:#8f9aa7!important;font-size:9px!important}

      @media(max-width:430px){
        #client-main .dcpr6 .dcpr6-metrics{gap:6px!important}
        #client-main .dcpr6 .dcpr6-metric{min-height:110px!important;padding:9px 8px 8px!important;border-radius:17px!important}
        #client-main .dcpr6 .dcpr6-value{margin-top:8px!important;font-size:20px!important;letter-spacing:-.45px!important}
        #client-main .dcpr6 .dcpr6-chip{min-height:22px!important;margin-top:6px!important;padding:3px 6px!important;font-size:7.8px!important}
        #client-main .dcpr6 .dcpr6-icon{width:29px!important;height:29px!important}
        #client-main .dcpr6 .dcpr6-metric-title::after{font-size:10.5px!important}
        #client-main .dcpr6 .dcpr6-metric-start{font-size:7.6px!important}
        #client-main .dcpr6 [data-dcpr6-metric="fat"] span:last-child::after{font-size:9.5px!important}
        #client-main .dcpr6 .dcpr6-switch + .dcpr6-panel{padding:11px 11px 9px!important}
        #client-main .dcpr6 .dcpr6-switch + .dcpr6-panel h2{font-size:16px!important}
        #client-main .dcpr6 .dcpr6-switch + .dcpr6-panel .dcpr6-chart-badge{padding:5px 8px!important;font-size:9px!important}
        #client-main .dcpr6 .dcpr6-chart{height:148px!important;margin-top:2px!important}
        #client-main .dcpr6 .dcpr6-chart-empty{height:125px!important}
        #client-main .dcpr6 .dcpr6-force-head{min-height:64px!important;padding:12px 46px 12px 13px!important}
        #client-main .dcpr6 .dcpr6-force-head::after{right:17px!important}
      }
    `;
    document.head.appendChild(style);
  }

  function normalizeCurrentProgress(){
    const root=document.querySelector('#client-main .dcpr6');
    if(!root) return;

    const forceHead=root.querySelector('.dcpr6-force-head');
    if(forceHead){
      const panel=forceHead.closest('.dcpr6-panel');
      if(panel){
        panel.classList.add('dcc-force-panel');
        if(!panel.classList.contains('dcc-force-open')){
          const sub=forceHead.querySelector('.dcpr6-sub');
          if(sub) sub.textContent='Pulsa para ver el detalle';
          forceHead.setAttribute('aria-expanded','false');
        }
        forceHead.setAttribute('role','button');
        forceHead.setAttribute('tabindex','0');
      }
    }
  }

  function installShowClientDefault(){
    const current=window.showClient;
    if(typeof current!=='function'){
      setTimeout(installShowClientDefault,80);
      return;
    }
    if(current.__dccProgressDeterministic) return;

    const wrapped=function(screen){
      if(screen==='progress'){
        window.dccClientProgressMetric='weight';
        window.dccForceProgressOpen=false;
      }
      const result=current.apply(this,arguments);
      if(screen==='progress') requestAnimationFrame(normalizeCurrentProgress);
      return result;
    };
    wrapped.__dccProgressDeterministic=true;
    wrapped.__base=current;
    window.showClient=wrapped;
  }

  /* Delegación única: funciona incluso cuando el renderer sustituye todo el DOM. */
  document.addEventListener('click',event=>{
    const head=event.target.closest('#client-main .dcpr6 .dcpr6-force-head');
    if(head){
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      const panel=head.closest('.dcpr6-panel');
      if(!panel) return;
      panel.classList.add('dcc-force-panel');
      const open=!panel.classList.contains('dcc-force-open');
      panel.classList.toggle('dcc-force-open',open);
      head.setAttribute('aria-expanded',String(open));
      const sub=head.querySelector('.dcpr6-sub');
      if(sub) sub.textContent=open?'Variación desde el inicio.':'Pulsa para ver el detalle';
      return;
    }

    const metric=event.target.closest('#client-main .dcpr6 [data-dcpr6-metric]');
    if(metric){
      /* El renderer base recrea el panel: el nuevo DOM nace cerrado por CSS. */
      requestAnimationFrame(normalizeCurrentProgress);
    }
  },true);

  document.addEventListener('keydown',event=>{
    const head=event.target.closest?.('#client-main .dcpr6 .dcpr6-force-head');
    if(!head||(event.key!=='Enter'&&event.key!==' ')) return;
    event.preventDefault();
    head.click();
  },true);

  /* Si Progreso se recrea, solo añadimos la clase estructural; no lo abrimos nunca. */
  const observer=new MutationObserver(()=>{
    if(document.querySelector('#client-main .dcpr6')) normalizeCurrentProgress();
  });

  function startObserver(){
    const main=document.getElementById('client-main');
    if(main) observer.observe(main,{childList:true,subtree:true});
    else setTimeout(startObserver,100);
  }

  async function syncBodyFatFromServer(){
    const id=activeId(),database=db(),d=appData(),c=activeClient();
    if(!id||!database||!c) return;
    try{
      const {data:row,error}=await database.from('client_checkins').select('body_fat').eq('client_id',id).maybeSingle();
      if(error) throw error;
      const fat=num(row?.body_fat);
      if(fat==null) return;
      d.checkins=d.checkins||{};
      d.checkins[id]=d.checkins[id]||{};
      d.checkins[id].bodyFat=fat;
      d.checkins[id].body_fat=fat;
      c.bodyFat=fat;
      c.body_fat=fat;
      save();
    }catch(error){
      console.error('DCC progreso — no se pudo sincronizar grasa:',error);
    }
  }

  injectStyles();
  installShowClientDefault();
  startObserver();
  syncBodyFatFromServer();
  setTimeout(installShowClientDefault,300);
  setTimeout(installShowClientDefault,900);
})();
