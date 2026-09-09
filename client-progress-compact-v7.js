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
    }
  `;
  document.head.appendChild(style);
})();
