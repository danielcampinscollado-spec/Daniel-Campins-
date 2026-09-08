/* DCC — Progreso: acabado visual fiel al mockup aprobado */
(function(){
  const ICONS=[
    `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M18 16c0-4 2.7-7 6-7s6 3 6 7"/><path d="M14 17h20l4 20a4 4 0 0 1-4 5H14a4 4 0 0 1-4-5l4-20Z"/></svg>`,
    `<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="15" cy="15" r="5"/><circle cx="33" cy="33" r="5"/><path d="M35 10 13 38"/></svg>`,
    `<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="8" y="29" width="7" height="11" rx="1"/><rect x="20.5" y="21" width="7" height="19" rx="1"/><rect x="33" y="12" width="7" height="28" rx="1"/></svg>`
  ];

  function decorateMetrics(){
    const metrics=document.querySelector('#coach-main.dcc-ca .dcc-ca-metrics');
    if(!metrics)return;
    [...metrics.children].forEach((card,i)=>{
      if(!card.querySelector('.dcc-metric-icon')){
        const el=document.createElement('span');
        el.className='dcc-metric-icon';
        el.innerHTML=ICONS[i]||ICONS[0];
        card.prepend(el);
      }
    });
  }

  function install(){
    let s=document.getElementById('dcc-progress-style-fix');
    if(s)s.remove();
    s=document.createElement('style');
    s.id='dcc-progress-style-fix';
    s.textContent=`
      /* ===== MÉTRICAS: mismo lenguaje del mockup aprobado ===== */
      #coach-main.dcc-ca .dcc-ca-metrics{
        display:grid!important;
        grid-template-columns:repeat(3,minmax(0,1fr))!important;
        gap:12px!important;
      }
      #coach-main.dcc-ca .dcc-ca-metrics .dcc-ca-metric{
        position:relative!important;
        min-height:142px!important;
        padding:16px 14px 12px 72px!important;
        overflow:hidden!important;
        border:1px solid #2b3640!important;
        border-radius:19px!important;
        background:
          radial-gradient(circle at 88% 5%,rgba(227,174,65,.08),transparent 31%),
          linear-gradient(145deg,#0d151b 0%,#071016 100%)!important;
        box-shadow:inset 0 1px 0 rgba(255,255,255,.025)!important;
      }
      #coach-main.dcc-ca .dcc-ca-metrics .dcc-ca-metric::before{content:none!important}
      #coach-main.dcc-ca .dcc-metric-icon{
        position:absolute!important;
        left:16px!important;
        top:16px!important;
        width:44px!important;
        height:44px!important;
        display:grid!important;
        place-items:center!important;
        border-radius:12px!important;
        border:1px solid rgba(224,173,76,.28)!important;
        background:linear-gradient(145deg,rgba(224,173,76,.20),rgba(224,173,76,.065))!important;
        box-shadow:inset 0 1px 0 rgba(255,255,255,.035)!important;
      }
      #coach-main.dcc-ca .dcc-metric-icon svg{
        width:27px!important;
        height:27px!important;
        fill:none!important;
        stroke:#efbd4f!important;
        stroke-width:2.6!important;
        stroke-linecap:round!important;
        stroke-linejoin:round!important;
      }
      #coach-main.dcc-ca .dcc-ca-metrics .dcc-ca-metric small{
        display:block!important;
        color:#a5afba!important;
        font-size:12px!important;
        line-height:1.2!important;
        letter-spacing:.1px!important;
      }
      #coach-main.dcc-ca .dcc-ca-metrics .dcc-ca-metric b{
        display:block!important;
        margin-top:5px!important;
        color:#f7f5f0!important;
        font-size:24px!important;
        line-height:1!important;
        letter-spacing:-.65px!important;
      }
      #coach-main.dcc-ca .dcc-ca-metrics .dcc-ca-trend{
        display:block!important;
        min-height:31px!important;
        margin-top:8px!important;
        color:#a0a9b3!important;
        font-size:10px!important;
        line-height:1.35!important;
      }
      #coach-main.dcc-ca .dcc-ca-metrics .dcc-ca-trend.good{color:#40d99a!important}
      #coach-main.dcc-ca .dcc-ca-metrics .dcc-ca-metric:nth-child(3) .dcc-ca-trend:not(.good){color:#ff5b63!important}
      #coach-main.dcc-ca .dcc-p3-spark{
        height:35px!important;
        margin:4px -2px -3px -56px!important;
        opacity:1!important;
      }
      #coach-main.dcc-ca .dcc-p3-spark svg path:first-child{
        stroke:#e9b94e!important;
        stroke-width:2.7!important;
        vector-effect:non-scaling-stroke!important;
      }
      #coach-main.dcc-ca .dcc-p3-spark svg path:last-child{fill:rgba(233,185,78,.10)!important}

      /* ===== SELECTOR EVOLUCIÓN ===== */
      #coach-main.dcc-ca .dcc-p3-tabs{
        display:grid!important;
        grid-template-columns:repeat(3,minmax(0,1fr))!important;
        width:min(100%,365px)!important;
        gap:8px!important;
      }
      #coach-main.dcc-ca .dcc-p3-tabs button{
        min-height:42px!important;
        border:1px solid #303c47!important;
        border-radius:999px!important;
        background:#091116!important;
        color:#c5ccd4!important;
        padding:9px 16px!important;
        box-shadow:none!important;
        font-size:11px!important;
        font-weight:850!important;
        opacity:1!important;
        -webkit-text-fill-color:#c5ccd4!important;
      }
      #coach-main.dcc-ca .dcc-p3-tabs button.active{
        border-color:#f0c55b!important;
        background:linear-gradient(135deg,#f4d36f 0%,#e1aa39 100%)!important;
        color:#130f06!important;
        -webkit-text-fill-color:#130f06!important;
        box-shadow:0 7px 18px rgba(224,173,76,.18),inset 0 1px 0 rgba(255,255,255,.25)!important;
      }

      /* ===== BLOQUES DE PROGRESO ===== */
      #coach-main.dcc-ca .dcc-p3-section{
        border-color:rgba(218,163,58,.56)!important;
        border-radius:20px!important;
        background:
          radial-gradient(circle at 96% 0%,rgba(224,173,76,.055),transparent 31%),
          linear-gradient(145deg,#0e151a,#080d11)!important;
        box-shadow:inset 0 1px 0 rgba(255,255,255,.025)!important;
      }
      #coach-main.dcc-ca .dcc-p3-head h2,
      #coach-main.dcc-ca .dcc-p3-forcehead h2{
        color:#f7f5f0!important;
        font-weight:800!important;
        letter-spacing:-.65px!important;
      }
      #coach-main.dcc-ca .dcc-p3-head p,
      #coach-main.dcc-ca .dcc-p3-forcehead p{color:#99a4af!important}
      #coach-main.dcc-ca .dcc-p3-card{
        background:linear-gradient(145deg,#0b1216,#080d10)!important;
        border-color:#2a3540!important;
        border-radius:14px!important;
      }
      #coach-main.dcc-ca .dcc-p3-all{
        border-color:#b8872c!important;
        background:#091015!important;
        color:#efbd4f!important;
      }

      @media(max-width:650px){
        #coach-main.dcc-ca .dcc-ca-metrics{gap:7px!important}
        #coach-main.dcc-ca .dcc-ca-metrics .dcc-ca-metric{
          min-height:126px!important;
          padding:11px 8px 8px 9px!important;
          border-radius:17px!important;
        }
        #coach-main.dcc-ca .dcc-metric-icon{
          position:static!important;
          width:31px!important;
          height:31px!important;
          margin-bottom:7px!important;
          border-radius:9px!important;
        }
        #coach-main.dcc-ca .dcc-metric-icon svg{width:20px!important;height:20px!important}
        #coach-main.dcc-ca .dcc-ca-metrics .dcc-ca-metric small{font-size:9px!important}
        #coach-main.dcc-ca .dcc-ca-metrics .dcc-ca-metric b{font-size:17px!important;margin-top:4px!important}
        #coach-main.dcc-ca .dcc-ca-metrics .dcc-ca-trend{font-size:8px!important;min-height:22px!important;margin-top:6px!important}
        #coach-main.dcc-ca .dcc-p3-spark{height:26px!important;margin:3px 0 -2px!important}
        #coach-main.dcc-ca .dcc-p3-tabs{width:100%!important}
        #coach-main.dcc-ca .dcc-p3-tabs button{min-height:41px!important;font-size:10px!important;padding:8px 5px!important}
      }
    `;
    document.head.appendChild(s);
    decorateMetrics();
  }

  let timer;
  const schedule=()=>{clearTimeout(timer);timer=setTimeout(decorateMetrics,30)};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
  new MutationObserver(schedule).observe(document.documentElement,{subtree:true,childList:true});
  document.addEventListener('click',schedule,true);
})();