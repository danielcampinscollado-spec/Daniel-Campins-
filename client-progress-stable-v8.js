/* DCC — Progreso cliente estable v8: etiquetas, selector por defecto y acordeón robusto */
(function(){
  'use strict';

  if(window.__dccClientProgressStableV8Loaded) return;
  window.__dccClientProgressStableV8Loaded=true;

  function injectStyles(){
    if(document.getElementById('dcc-client-progress-stable-v8-style')) return;
    const style=document.createElement('style');
    style.id='dcc-client-progress-stable-v8-style';
    style.textContent=`
      #client-main .dcpr6 .dcc-force-panel{padding:0!important;overflow:hidden!important}
      #client-main .dcpr6 .dcc-force-toggle{position:relative!important;display:flex!important;align-items:center!important;min-height:70px!important;margin:0!important;padding:14px 48px 14px 16px!important;cursor:pointer!important;user-select:none!important;-webkit-tap-highlight-color:transparent!important}
      #client-main .dcpr6 .dcc-force-toggle::after{content:'';position:absolute;right:19px;top:50%;width:9px;height:9px;border-right:2px solid #e7b64e;border-bottom:2px solid #e7b64e;transform:translateY(-65%) rotate(45deg);transition:transform .2s ease}
      #client-main .dcpr6 .dcc-force-panel.dcc-open .dcc-force-toggle::after{transform:translateY(-35%) rotate(225deg)}
      #client-main .dcpr6 .dcc-force-toggle .dcpr6-sub{margin-top:3px!important;color:#8f9aa7!important;font-size:9px!important}
      #client-main .dcpr6 .dcc-force-panel:not(.dcc-open) .dcpr6-force-list,
      #client-main .dcpr6 .dcc-force-panel:not(.dcc-open) .dcpr6-best{display:none!important}
      #client-main .dcpr6 .dcc-force-panel.dcc-open .dcpr6-force-list{display:block!important;margin:0 14px 0!important}
      #client-main .dcpr6 .dcc-force-panel.dcc-open .dcpr6-best{display:flex!important;margin:8px 14px 14px!important}
      @media(max-width:430px){
        #client-main .dcpr6 .dcc-force-toggle{min-height:64px!important;padding:12px 42px 12px 13px!important}
        #client-main .dcpr6 .dcc-force-toggle::after{right:16px!important}
      }
    `;
    document.head.appendChild(style);
  }

  function applyHomeEmptyText(){
    const root=document.querySelector('#client-main .dch-wrap');
    if(!root) return;
    const taskCard=[...root.querySelectorAll('.dch-task-card,.dch-card')]
      .find(card=>/TAREAS PENDIENTES/i.test(card.textContent||''));
    if(!taskCard) return;
    const candidates=[...taskCard.querySelectorAll('*')];
    candidates.forEach(el=>{
      if(el.children.length===0 && (el.textContent||'').trim()==='Todo al día'){
        el.textContent='Todo al día, sin tareas pendientes';
      }
    });
  }

  function applyProgressFixes(){
    injectStyles();
    const root=document.querySelector('#client-main .dcpr6');
    if(!root) return;

    /* El icono ya contiene %, por eso el texto debe ser únicamente Grasa. */
    const fatTitle=root.querySelector('.dcpr6-metrics .dcpr6-metric:nth-child(2) .dcpr6-metric-title');
    if(fatTitle) fatTitle.textContent='Grasa';

    const fatButton=root.querySelector('[data-dcpr6-metric="fat"]');
    if(fatButton){
      const spans=fatButton.querySelectorAll('span');
      if(spans.length){
        const textSpan=spans[spans.length-1];
        textSpan.textContent='Grasa';
      }
    }

    const forceHead=root.querySelector('.dcpr6-force-head');
    if(!forceHead) return;
    const panel=forceHead.closest('.dcpr6-panel');
    if(!panel) return;

    panel.classList.add('dcc-force-panel');
    forceHead.classList.add('dcc-force-toggle');
    forceHead.setAttribute('role','button');
    forceHead.setAttribute('tabindex','0');

    const open=!!window.dccForceProgressOpen;
    panel.classList.toggle('dcc-open',open);
    forceHead.setAttribute('aria-expanded',String(open));

    const sub=forceHead.querySelector('.dcpr6-sub');
    if(sub) sub.textContent=open?'Variación desde el inicio.':'Pulsa para ver el detalle';
  }

  function scheduleProgressFix(){
    requestAnimationFrame(()=>requestAnimationFrame(applyProgressFixes));
    setTimeout(applyProgressFixes,60);
  }

  function scheduleHomeFix(){
    requestAnimationFrame(()=>requestAnimationFrame(applyHomeEmptyText));
    setTimeout(applyHomeEmptyText,60);
  }

  /* Delegación en captura: evita el doble toggle del ajuste antiguo y hace
     que abrir/cerrar funcione siempre, aunque el renderer sustituya el DOM. */
  document.addEventListener('click',event=>{
    const forceHead=event.target.closest('#client-main .dcpr6 .dcpr6-force-head');
    if(forceHead){
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      window.dccForceProgressOpen=!window.dccForceProgressOpen;
      applyProgressFixes();
      return;
    }

    const metricButton=event.target.closest('#client-main .dcpr6 [data-dcpr6-metric]');
    if(metricButton){
      window.dccForceProgressOpen=false;
      scheduleProgressFix();
    }
  },true);

  document.addEventListener('keydown',event=>{
    const forceHead=event.target.closest?.('#client-main .dcpr6 .dcpr6-force-head');
    if(!forceHead || (event.key!=='Enter' && event.key!==' ')) return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    window.dccForceProgressOpen=!window.dccForceProgressOpen;
    applyProgressFixes();
  },true);

  function installShowClientWrapper(){
    if(typeof window.showClient!=='function' || !window.__dccClientProgressV6Installed || typeof window.dccRenderClientProgressV6!=='function'){
      setTimeout(installShowClientWrapper,80);
      return;
    }

    const current=window.showClient;
    if(current.__dccProgressStableV8Wrapped) return;

    const wrapped=function(screen){
      if(screen==='progress'){
        /* Cada entrada nueva a Progreso empieza siempre en PESO y con Fuerza cerrada. */
        window.dccClientProgressMetric='weight';
        window.dccForceProgressOpen=false;
      }

      const result=current.apply(this,arguments);

      if(screen==='progress') scheduleProgressFix();
      if(screen==='home') scheduleHomeFix();
      return result;
    };

    wrapped.__dccProgressStableV8Wrapped=true;
    wrapped.__dccProgressStableV8Base=current;
    window.showClient=wrapped;
  }

  injectStyles();
  installShowClientWrapper();
  setTimeout(installShowClientWrapper,250);
  setTimeout(installShowClientWrapper,700);
  setTimeout(installShowClientWrapper,1400);
  setTimeout(installShowClientWrapper,2600);

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',()=>{
      installShowClientWrapper();
      scheduleProgressFix();
      scheduleHomeFix();
    },{once:true});
  }else{
    scheduleProgressFix();
    scheduleHomeFix();
  }
})();
