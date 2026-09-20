/* DCC — Inicio cliente Light Premium: reparación visual aislada v1
   Corrige únicamente la pantalla Inicio del cliente.
   No modifica datos, navegación, autenticación ni otras pantallas. */
(function(){
  'use strict';
  if(window.__dccClientHomeLightFixV1)return;
  window.__dccClientHomeLightFixV1=true;

  const ID='dcc-client-home-light-fix-v1';

  function install(){
    if(document.getElementById(ID))return;
    const s=document.createElement('style');
    s.id=ID;
    s.textContent=`
      /* Evita que el selector global [class*="stat"] pinte
         fondos claros detrás de textos dentro de las métricas. */
      html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-stat-label,
      html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-stat-value,
      html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-stat-value span{
        background:transparent!important;
        background-color:transparent!important;
        background-image:none!important;
        box-shadow:none!important;
        border:0!important;
      }

      /* Las dos métricas mantienen su tarjeta oscura premium. */
      html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-stat-label{
        color:#a9afb8!important;
      }
      html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-stat-value{
        color:#f7f5f0!important;
      }
      html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-stat-value span{
        color:#aeb4bd!important;
      }

      /* Tareas pendientes: contraste correcto sobre superficie clara. */
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

      /* Próximo entrenamiento: elimina texto blanco heredado del tema oscuro. */
      html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-next-name{
        color:#17191d!important;
        text-shadow:none!important;
      }
      html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-next-day{
        color:#6f7782!important;
      }

      /* Mantiene coherencia de contraste en el bloque de progreso. */
      html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-progress-title{
        color:#17191d!important;
        text-shadow:none!important;
      }
      html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-progress-sub{
        color:#5f6874!important;
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
