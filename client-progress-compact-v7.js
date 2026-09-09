/* DCC — Ajuste compacto premium de Progreso cliente */
(function(){
  'use strict';
  if(document.getElementById('dcc-client-progress-compact-v7-style')) return;

  const style=document.createElement('style');
  style.id='dcc-client-progress-compact-v7-style';
  style.textContent=`
    /* Las tarjetas superiores muestran solo el dato principal: sin mini-gráficas. */
    #client-main .dcpr6 .dcpr6-metric{min-height:122px!important;padding:12px 12px 10px!important}
    #client-main .dcpr6 .dcpr6-metric .dcpr6-spark{display:none!important}
    #client-main .dcpr6 .dcpr6-value{margin-top:10px!important;font-size:27px!important;letter-spacing:-.8px!important}
    #client-main .dcpr6 .dcpr6-chip{min-height:24px!important;margin-top:8px!important;padding:4px 8px!important;font-size:9px!important}
    #client-main .dcpr6 .dcpr6-metric-top{gap:8px!important}
    #client-main .dcpr6 .dcpr6-metric-start{margin-top:2px!important}

    /* Selector más pegado al gráfico para que se entienda que controla esa métrica. */
    #client-main .dcpr6 .dcpr6-switch{margin-bottom:8px!important}

    /* Gráfico principal: misma estética premium, bastante más compacto. */
    #client-main .dcpr6 .dcpr6-switch + .dcpr6-panel{padding:13px 14px 11px!important;margin-bottom:10px!important;border-radius:19px!important}
    #client-main .dcpr6 .dcpr6-switch + .dcpr6-panel .dcpr6-panel-head{align-items:center!important}
    #client-main .dcpr6 .dcpr6-switch + .dcpr6-panel .dcpr6-panel-title{align-items:center!important;gap:6px!important}
    #client-main .dcpr6 .dcpr6-switch + .dcpr6-panel .dcpr6-panel-title .dcpr6-icon{width:28px!important;height:28px!important}
    #client-main .dcpr6 .dcpr6-switch + .dcpr6-panel h2{font-size:18px!important;margin:0!important}
    #client-main .dcpr6 .dcpr6-switch + .dcpr6-panel .dcpr6-sub{margin-top:2px!important;font-size:9px!important}
    #client-main .dcpr6 .dcpr6-switch + .dcpr6-panel .dcpr6-chart-badge{padding:6px 9px!important;border-radius:12px!important;font-size:10px!important}
    #client-main .dcpr6 .dcpr6-chart{height:170px!important;margin-top:4px!important}
    #client-main .dcpr6 .dcpr6-chart-empty{height:145px!important;padding:14px!important}

    /* Progreso de fuerza: cerrado por defecto y desplegable al pulsar. */
    #client-main .dcpr6 .dcpr8-force-panel{padding:0!important;overflow:hidden!important}
    #client-main .dcpr6 .dcpr8-force-toggle{position:relative!important;display:flex!important;align-items:center!important;min-height:70px!important;margin:0!important;padding:14px 48px 14px 16px!important;cursor:pointer!important;user-select:none!important}
    #client-main .dcpr6 .dcpr8-force-toggle::after{content:'';position:absolute;right:19px;top:50%;width:9px;height:9px;border-right:2px solid #e7b64e;border-bottom:2px solid #e7b64e;transform:translateY(-65%) rotate(45deg);transition:transform .2s ease}
    #client-main .dcpr6 .dcpr8-force-panel.dcpr8-open .dcpr8-force-toggle::after{transform:translateY(-35%) rotate(225deg)}
    #client-main .dcpr6 .dcpr8-force-toggle .dcpr6-sub{margin-top:3px!important;color:#8f9aa7!important;font-size:9px!important}
    #client-main .dcpr6 .dcpr8-force-panel:not(.dcpr8-open) .dcpr6-force-list,
    #client-main .dcpr6 .dcpr8-force-panel:not(.dcpr8-open) .dcpr6-best{display:none!important}
    #client-main .dcpr6 .dcpr8-force-panel.dcpr8-open .dcpr6-force-list{margin:0 14px 0!important}
    #client-main .dcpr6 .dcpr8-force-panel.dcpr8-open .dcpr6-best{margin:8px 14px 14px!important}

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
      #client-main .dcpr6 .dcpr8-force-toggle{min-height:64px!important;padding:12px 42px 12px 13px!important}
      #client-main .dcpr6 .dcpr8-force-toggle::after{right:16px!important}
    }
  `;
  document.head.appendChild(style);

  function refineProgress(){
    const root=document.querySelector('#client-main .dcpr6');
    if(!root) return;

    /* Evita el texto duplicado "% % Grasa": dejamos icono % + palabra Grasa. */
    const fatButton=root.querySelector('[data-dcpr6-metric="fat"]');
    if(fatButton){
      const labels=fatButton.querySelectorAll('span');
      if(labels.length>1){
        const label=labels[labels.length-1];
        if(label.textContent.trim()!=='Grasa') label.textContent='Grasa';
      }
    }

    const forceHead=root.querySelector('.dcpr6-force-head');
    if(!forceHead) return;
    const panel=forceHead.closest('.dcpr6-panel');
    if(!panel) return;

    panel.classList.add('dcpr8-force-panel');
    forceHead.classList.add('dcpr8-force-toggle');
    forceHead.setAttribute('role','button');
    forceHead.setAttribute('tabindex','0');

    const applyState=()=>{
      const open=!!window.dccForceProgressOpen;
      panel.classList.toggle('dcpr8-open',open);
      forceHead.setAttribute('aria-expanded',String(open));
      const sub=forceHead.querySelector('.dcpr6-sub');
      if(sub) sub.textContent=open?'Variación desde el inicio.':'Pulsa para ver el detalle';
    };

    if(!forceHead.dataset.dcpr8Bound){
      forceHead.dataset.dcpr8Bound='1';
      const toggle=()=>{
        window.dccForceProgressOpen=!window.dccForceProgressOpen;
        applyState();
      };
      forceHead.addEventListener('click',toggle);
      forceHead.addEventListener('keydown',event=>{
        if(event.key==='Enter'||event.key===' '){
          event.preventDefault();
          toggle();
        }
      });
    }

    applyState();
  }

  const main=document.getElementById('client-main');
  if(main){
    new MutationObserver(()=>refineProgress()).observe(main,{childList:true,subtree:true});
    refineProgress();
  }else{
    document.addEventListener('DOMContentLoaded',()=>{
      const target=document.getElementById('client-main');
      if(!target) return;
      new MutationObserver(()=>refineProgress()).observe(target,{childList:true,subtree:true});
      refineProgress();
    },{once:true});
  }
})();
