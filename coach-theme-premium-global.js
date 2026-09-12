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
      @media(max-width:700px){
        html.dcc-theme-light-premium body #coach .side{
          padding:4px!important;
          border-radius:23px!important;
        }
        html.dcc-theme-light-premium body #coach #coach-nav{
          border-radius:18px!important;
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
