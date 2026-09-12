/* DCC — tema entrenador: bootstrap único y estable
   Este archivo sí está cargado directamente por index.html.
   No contiene lógica de negocio; sólo activa la capa visual única. */
(function(){
  'use strict';
  if(window.__dccCoachThemeBootstrapStableV1)return;
  window.__dccCoachThemeBootstrapStableV1=true;

  const POLISH_ID='dcc-coach-light-polish-v1';

  function installPolish(){
    document.getElementById(POLISH_ID)?.remove();
    const style=document.createElement('style');
    style.id=POLISH_ID;
    style.textContent=`
      /* Panel: iconos de tareas en Light Premium */
      html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-row-icon,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-empty-i{
        background:linear-gradient(145deg,#fffdf8 0%,#f8eedc 100%)!important;
        color:#b77b13!important;
        border:1px solid rgba(177,119,18,.28)!important;
        box-shadow:inset 0 1px 0 rgba(255,255,255,.92)!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-row-icon svg,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-empty-i svg{
        color:#b77b13!important;
        stroke:currentColor!important;
      }

      /* Barra inferior: marco exterior Light Premium, navegación interior oscura */
      html.dcc-theme-light-premium body #coach .side{
        background:linear-gradient(145deg,#fffdf8 0%,#f5ecdd 100%)!important;
        border:1px solid rgba(177,119,18,.30)!important;
        box-shadow:0 10px 26px rgba(78,58,28,.10),inset 0 1px 0 rgba(255,255,255,.96)!important;
        padding:4px!important;
        box-sizing:border-box!important;
      }
      html.dcc-theme-light-premium body #coach #coach-nav{
        width:100%!important;
        height:100%!important;
        border-radius:18px!important;
        background:linear-gradient(145deg,#27241e 0%,#151512 58%,#211f19 100%)!important;
        border:1px solid rgba(224,171,62,.72)!important;
        box-shadow:inset 0 1px 0 rgba(255,226,151,.08)!important;
        overflow:hidden!important;
      }

      /* Clientes: sin bloque de entrenamiento y sin rectángulos negros */
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-card{
        grid-template-columns:minmax(0,1fr) 132px!important;
        gap:16px!important;
        min-height:96px!important;
        padding:16px 18px!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-training{
        display:none!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-manage{
        min-height:50px!important;
        padding:9px 14px!important;
        border:1px solid rgba(183,123,19,.40)!important;
        border-radius:15px!important;
        background:linear-gradient(145deg,#fffdf8 0%,#f8efdf 100%)!important;
        color:#8d5b08!important;
        box-shadow:0 5px 14px rgba(78,58,28,.06)!important;
        font-weight:800!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-search input{
        border:0!important;
        outline:0!important;
        background:transparent!important;
        box-shadow:none!important;
        border-radius:0!important;
        padding:0!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-search{
        overflow:hidden!important;
      }

      /* Nuevo cliente: Light Premium */
      html.dcc-theme-light-premium body .dcc-new-client-overlay{
        background:rgba(55,45,30,.18)!important;
        backdrop-filter:blur(10px)!important;
        -webkit-backdrop-filter:blur(10px)!important;
      }
      html.dcc-theme-light-premium body .dcc-new-client-box{
        background:linear-gradient(145deg,#fffdf8 0%,#f8f0e2 100%)!important;
        color:#17191d!important;
        border:1px solid rgba(183,123,19,.34)!important;
        box-shadow:0 24px 70px rgba(78,58,28,.18)!important;
      }
      html.dcc-theme-light-premium body .dcc-new-client-title,
      html.dcc-theme-light-premium body .dcc-new-client-label,
      html.dcc-theme-light-premium body .dcc-new-client-box h1,
      html.dcc-theme-light-premium body .dcc-new-client-box h2,
      html.dcc-theme-light-premium body .dcc-new-client-box h3,
      html.dcc-theme-light-premium body .dcc-new-client-box strong{
        color:#17191d!important;
        text-shadow:none!important;
      }
      html.dcc-theme-light-premium body .dcc-new-client-sub{
        color:#7a8390!important;
      }
      html.dcc-theme-light-premium body .dcc-new-client-icon{
        color:#b77b13!important;
      }
      html.dcc-theme-light-premium body .dcc-new-client-input,
      html.dcc-theme-light-premium body .dcc-new-client-select,
      html.dcc-theme-light-premium body .dcc-new-client-textarea,
      html.dcc-theme-light-premium body .dcc-new-client-box input,
      html.dcc-theme-light-premium body .dcc-new-client-box select,
      html.dcc-theme-light-premium body .dcc-new-client-box textarea{
        background:#fffefa!important;
        color:#17191d!important;
        -webkit-text-fill-color:#17191d!important;
        border:1px solid rgba(183,123,19,.30)!important;
        box-shadow:none!important;
      }
      html.dcc-theme-light-premium body .dcc-new-client-input::placeholder,
      html.dcc-theme-light-premium body .dcc-new-client-textarea::placeholder,
      html.dcc-theme-light-premium body .dcc-new-client-box input::placeholder,
      html.dcc-theme-light-premium body .dcc-new-client-box textarea::placeholder{
        color:#858c96!important;
        -webkit-text-fill-color:#858c96!important;
        opacity:1!important;
      }
      html.dcc-theme-light-premium body .dcc-new-client-close{
        background:#fffaf1!important;
        color:#8d5b08!important;
        border:1px solid rgba(183,123,19,.36)!important;
        box-shadow:none!important;
      }
      html.dcc-theme-light-premium body .dcc-new-client-submit{
        background:linear-gradient(135deg,#f5d581 0%,#dca83e 100%)!important;
        color:#18140c!important;
        border:1px solid #e5b64d!important;
        box-shadow:0 8px 20px rgba(185,125,20,.14)!important;
      }

      @media(max-width:700px){
        html.dcc-theme-light-premium body #coach .side{
          padding:4px!important;
          border-radius:23px!important;
        }
        html.dcc-theme-light-premium body #coach #coach-nav{
          border-radius:18px!important;
        }
        html.dcc-theme-light-premium body .dcc-new-client-box{
          border-radius:24px!important;
        }
      }
      @media(max-width:600px){
        html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-card{
          grid-template-columns:minmax(0,1fr) 118px!important;
          gap:12px!important;
          min-height:90px!important;
          padding:14px!important;
        }
        html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-manage{
          min-height:48px!important;
          font-size:10px!important;
          padding:7px 10px!important;
        }
      }
    `;
    (document.head||document.documentElement).appendChild(style);
  }

  function loadStableTheme(){
    const name='coach-light-stable-v1.js';
    const existing=[...document.scripts].find(s=>(s.src||'').includes(name));
    if(existing){
      installPolish();
      return;
    }

    const script=document.createElement('script');
    script.src='./coach-light-stable-v1.js?v=20260912-2';
    script.async=false;
    script.dataset.dccCoachStable='1';
    script.onload=installPolish;
    script.onerror=()=>console.error('DCC: no se pudo cargar el tema estable del entrenador');
    (document.head||document.documentElement).appendChild(script);
  }

  loadStableTheme();
  document.addEventListener('DOMContentLoaded',()=>{loadStableTheme();installPolish()},{once:true});
  window.addEventListener('pageshow',()=>{loadStableTheme();installPolish()});
})();
