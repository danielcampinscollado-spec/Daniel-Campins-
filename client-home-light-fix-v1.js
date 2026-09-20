/* DCC — Inicio cliente Light Premium: reparación visual estable v2
   Solo corrige la pantalla Inicio y compacta la navegación móvil.
   No modifica autenticación, datos ni lógica de negocio. */
(function(){
  'use strict';
  if(window.__dccClientHomeLightFixV2)return;
  window.__dccClientHomeLightFixV2=true;

  const ID='dcc-client-home-light-fix-v2';

  function install(){
    if(document.getElementById(ID))return;
    const s=document.createElement('style');
    s.id=ID;
    s.textContent=`
      /* ===== INICIO: cabecera del cliente ===== */
      html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-welcome{
        min-height:auto!important;
        margin:0 0 14px!important;
        padding:2px 2px 0!important;
      }
      html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-welcome::before,
      html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-welcome::after{
        display:none!important;
        content:none!important;
      }
      html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-name{
        margin:0!important;
        max-width:100%!important;
        color:#17191d!important;
        font-size:26px!important;
        line-height:1.08!important;
        font-weight:700!important;
        letter-spacing:-.55px!important;
        white-space:normal!important;
        text-shadow:none!important;
      }

      /* ===== Métricas: conserva las tarjetas oscuras sin rectángulos internos ===== */
      html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-stat{
        background:
          radial-gradient(circle at 100% 0,rgba(231,185,79,.08),transparent 40%),
          linear-gradient(145deg,#15191f 0%,#0d1116 62%,#090c10 100%)!important;
        background-color:#0d1116!important;
        border-color:rgba(217,170,74,.34)!important;
        border-radius:20px!important;
      }
      html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-stat-label,
      html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-stat-value,
      html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-stat-value span{
        background:transparent!important;
        background-color:transparent!important;
        background-image:none!important;
        box-shadow:none!important;
        border:0!important;
      }
      html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-stat-label{
        color:#a9afb8!important;
      }
      html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-stat-value{
        color:#f7f5f0!important;
      }
      html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-stat-value span{
        color:#aeb4bd!important;
      }

      /* ===== Tareas ===== */
      html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-task-row{
        color:#17191d!important;
      }
      html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-task-title{
        color:#17191d!important;
        text-shadow:none!important;
      }
      html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-task-meta{
        color:#6f7782!important;
      }

      /* ===== Progreso ===== */
      html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-progress-title{
        color:#17191d!important;
        text-shadow:none!important;
      }
      html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-progress-sub{
        color:#5f6874!important;
      }

      /* ===== Próximo entrenamiento: recupera el disco y el degradado ===== */
      html.dcc-theme-light-premium body #client #client-main .dch-wrap section.dch-next{
        position:relative!important;
        min-height:124px!important;
        overflow:hidden!important;
        background-image:
          linear-gradient(90deg,
            rgba(255,253,248,1) 0%,
            rgba(255,253,248,.98) 32%,
            rgba(255,253,248,.88) 49%,
            rgba(255,253,248,.46) 68%,
            rgba(255,253,248,.05) 100%),
          url('./assets/next-workout-plate.jpg')!important;
        background-color:#fffdf8!important;
        background-size:cover!important;
        background-position:center right!important;
        background-repeat:no-repeat!important;
      }
      html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-next-content{
        position:relative!important;
        z-index:2!important;
        padding-right:138px!important;
      }
      html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-next-name{
        color:#17191d!important;
        font-size:17px!important;
        line-height:1.12!important;
        font-weight:700!important;
        letter-spacing:-.25px!important;
        white-space:normal!important;
        overflow:hidden!important;
        display:-webkit-box!important;
        -webkit-box-orient:vertical!important;
        -webkit-line-clamp:2!important;
        text-shadow:none!important;
      }
      html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-next-day{
        color:#6f7782!important;
      }
      html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-routine-btn{
        z-index:3!important;
      }

      /* ===== Barra inferior: compacta sin mover el contenedor ===== */
      @media(max-width:700px){
        html.dcc-theme-light-premium body #client-nav{
          grid-template-columns:repeat(6,minmax(0,50px))!important;
          justify-content:center!important;
          align-items:stretch!important;
          gap:0!important;
          padding:4px 6px!important;
        }
        html.dcc-theme-light-premium body #client-nav button{
          width:50px!important;
          min-width:0!important;
          height:60px!important;
          padding:3px 0!important;
          gap:2px!important;
          border-radius:15px!important;
        }
        html.dcc-theme-light-premium body #client-nav button svg{
          width:20px!important;
          height:20px!important;
          flex:0 0 20px!important;
        }
        html.dcc-theme-light-premium body #client-nav button span{
          width:100%!important;
          margin:0!important;
          padding:0!important;
          font-size:7.5px!important;
          line-height:1!important;
          font-weight:650!important;
          letter-spacing:-.15px!important;
          text-align:center!important;
          white-space:nowrap!important;
        }
        html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-slogan{
          display:none!important;
        }
      }

      @media(max-width:390px){
        html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-name{
          font-size:24px!important;
        }
        html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-next-content{
          padding-right:122px!important;
        }
        html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-next-name{
          font-size:15.5px!important;
        }
        html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-routine-btn{
          min-width:118px!important;
          padding-left:12px!important;
          padding-right:12px!important;
        }
        html.dcc-theme-light-premium body #client-nav{
          grid-template-columns:repeat(6,minmax(0,48px))!important;
        }
        html.dcc-theme-light-premium body #client-nav button{
          width:48px!important;
        }
        html.dcc-theme-light-premium body #client-nav button span{
          font-size:7px!important;
        }
      }
    `;
    (document.head||document.documentElement).appendChild(s);
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',install,{once:true});
  }else{
    install();
  }
})();
