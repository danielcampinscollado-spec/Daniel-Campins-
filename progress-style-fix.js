/* DCC — Ajuste visual de Progreso para mantener el estilo premium de la app */
(function(){
  function install(){
    if(document.getElementById('dcc-progress-style-fix')) return;
    const s=document.createElement('style');
    s.id='dcc-progress-style-fix';
    s.textContent=`
      /* Métricas superiores */
      #coach-main.dcc-ca .dcc-ca-metrics{
        gap:10px!important;
      }
      #coach-main.dcc-ca .dcc-ca-metrics .dcc-ca-metric{
        position:relative!important;
        min-height:126px!important;
        padding:15px 14px 11px 58px!important;
        overflow:hidden!important;
        border:1px solid #2b343d!important;
        border-radius:20px!important;
        background:
          radial-gradient(circle at 82% 8%,rgba(242,200,95,.08),transparent 34%),
          linear-gradient(145deg,#11171d,#080c0f)!important;
        box-shadow:inset 0 1px 0 rgba(255,255,255,.025)!important;
      }
      #coach-main.dcc-ca .dcc-ca-metrics .dcc-ca-metric::before{
        position:absolute;
        left:12px;
        top:13px;
        width:34px;
        height:34px;
        display:grid;
        place-items:center;
        border-radius:11px;
        border:1px solid rgba(242,200,95,.28);
        background:linear-gradient(145deg,rgba(242,200,95,.18),rgba(242,200,95,.055));
        color:#f2c85f;
        font-size:18px;
        font-weight:900;
        line-height:1;
      }
      #coach-main.dcc-ca .dcc-ca-metrics .dcc-ca-metric:nth-child(1)::before{content:'◒'}
      #coach-main.dcc-ca .dcc-ca-metrics .dcc-ca-metric:nth-child(2)::before{content:'%'}
      #coach-main.dcc-ca .dcc-ca-metrics .dcc-ca-metric:nth-child(3)::before{content:'▥'}
      #coach-main.dcc-ca .dcc-ca-metrics .dcc-ca-metric small{
        color:#9ca5af!important;
        font-size:10px!important;
        letter-spacing:.1px!important;
      }
      #coach-main.dcc-ca .dcc-ca-metrics .dcc-ca-metric b{
        margin-top:4px!important;
        color:#f7f5f0!important;
        font-size:20px!important;
        line-height:1.05!important;
        letter-spacing:-.45px!important;
      }
      #coach-main.dcc-ca .dcc-ca-metrics .dcc-ca-trend{
        min-height:24px!important;
        margin-top:7px!important;
        color:#9aa4af!important;
        font-size:9px!important;
        line-height:1.35!important;
      }
      #coach-main.dcc-ca .dcc-ca-metrics .dcc-ca-trend.good{
        color:#55d9a0!important;
      }
      #coach-main.dcc-ca .dcc-p3-spark{
        height:30px!important;
        margin:4px -2px -2px -44px!important;
        opacity:.95!important;
      }
      #coach-main.dcc-ca .dcc-p3-spark svg path:first-child{
        stroke:#e8b94f!important;
        stroke-width:2.4!important;
      }

      /* Selector Peso / % Grasa / Fuerza */
      #coach-main.dcc-ca .dcc-p3-tabs{
        display:grid!important;
        grid-template-columns:repeat(3,1fr)!important;
        width:min(100%,360px)!important;
        gap:7px!important;
      }
      #coach-main.dcc-ca .dcc-p3-tabs button{
        min-height:38px!important;
        border:1px solid #323b44!important;
        border-radius:999px!important;
        background:#0a0f13!important;
        color:#aab2bc!important;
        padding:8px 12px!important;
        box-shadow:none!important;
        font-size:10px!important;
        font-weight:850!important;
        opacity:1!important;
      }
      #coach-main.dcc-ca .dcc-p3-tabs button.active{
        border-color:#f0c661!important;
        background:linear-gradient(135deg,#f4d16f,#dda940)!important;
        color:#151006!important;
        box-shadow:0 5px 18px rgba(224,173,76,.16)!important;
        opacity:1!important;
      }
      #coach-main.dcc-ca .dcc-p3-tabs button.active *{
        color:#151006!important;
      }

      /* Tarjetas de la pantalla */
      #coach-main.dcc-ca .dcc-p3-section{
        border-color:rgba(224,173,76,.46)!important;
        background:
          radial-gradient(circle at 100% 0%,rgba(224,173,76,.055),transparent 34%),
          linear-gradient(145deg,#10161b,#080c0f)!important;
        box-shadow:inset 0 1px 0 rgba(255,255,255,.025)!important;
      }
      #coach-main.dcc-ca .dcc-p3-head h2,
      #coach-main.dcc-ca .dcc-p3-forcehead h2{
        color:#f7f5f0!important;
        letter-spacing:-.55px!important;
      }
      #coach-main.dcc-ca .dcc-p3-card{
        background:linear-gradient(145deg,#0d1317,#090d10)!important;
        border-color:#29333b!important;
      }

      @media(max-width:650px){
        #coach-main.dcc-ca .dcc-ca-metrics{
          gap:7px!important;
        }
        #coach-main.dcc-ca .dcc-ca-metrics .dcc-ca-metric{
          min-height:118px!important;
          padding:12px 9px 9px 10px!important;
        }
        #coach-main.dcc-ca .dcc-ca-metrics .dcc-ca-metric::before{
          position:static!important;
          width:28px!important;
          height:28px!important;
          margin-bottom:7px!important;
          border-radius:9px!important;
          font-size:15px!important;
        }
        #coach-main.dcc-ca .dcc-ca-metrics .dcc-ca-metric b{
          font-size:16px!important;
        }
        #coach-main.dcc-ca .dcc-ca-metrics .dcc-ca-trend{
          font-size:8px!important;
          min-height:22px!important;
        }
        #coach-main.dcc-ca .dcc-p3-spark{
          height:24px!important;
          margin:3px 0 -1px!important;
        }
        #coach-main.dcc-ca .dcc-p3-tabs{
          width:100%!important;
        }
        #coach-main.dcc-ca .dcc-p3-tabs button{
          min-height:40px!important;
          font-size:10px!important;
        }
      }
    `;
    document.head.appendChild(s);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',install);
  else install();
})();