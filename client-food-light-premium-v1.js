/* DCC — Cliente Alimentación Light Premium v1
   Ajuste visual aislado de la pantalla Alimentación.
   No modifica datos, lógica de dietas ni panel entrenador. */
(function(){
  'use strict';
  if(window.__dccClientFoodLightPremiumV1)return;
  window.__dccClientFoodLightPremiumV1=true;

  const ID='dcc-client-food-light-premium-v1';

  function install(){
    document.getElementById(ID)?.remove();
    const s=document.createElement('style');
    s.id=ID;
    s.textContent=`
      /* =====================================================
         ALIMENTACIÓN CLIENTE — LIGHT PREMIUM
         ===================================================== */

      html.dcc-theme-light-premium body #client #client-main .client-header{
        margin:0 0 12px!important;
        align-items:flex-start!important;
      }

      html.dcc-theme-light-premium body #client #client-main .client-header .section-eyebrow{
        margin:0 0 8px!important;
        color:#a66d0d!important;
        font-size:11px!important;
        line-height:1!important;
        font-weight:850!important;
        letter-spacing:3.2px!important;
        text-transform:uppercase!important;
      }

      html.dcc-theme-light-premium body #client #client-main .client-header .muted{
        margin:0!important;
        color:#707782!important;
        font-size:13px!important;
        line-height:1.35!important;
        font-weight:500!important;
      }

      /* Selector Entrenamiento / Descanso */
      html.dcc-theme-light-premium body #client #client-main .diet-switch{
        display:grid!important;
        grid-template-columns:1fr 1fr!important;
        gap:4px!important;
        min-height:50px!important;
        margin:0 0 14px!important;
        padding:4px!important;
        border:1px solid rgba(177,119,18,.23)!important;
        border-radius:18px!important;
        background:linear-gradient(145deg,#f3ecdf 0%,#ece3d4 100%)!important;
        box-shadow:inset 0 1px 0 rgba(255,255,255,.90),0 7px 18px rgba(78,58,28,.05)!important;
      }

      html.dcc-theme-light-premium body #client #client-main .diet-switch button{
        min-height:42px!important;
        margin:0!important;
        padding:8px 10px!important;
        border:1px solid transparent!important;
        border-radius:14px!important;
        background:transparent!important;
        color:#7a818a!important;
        box-shadow:none!important;
        font-size:13px!important;
        line-height:1!important;
        font-weight:700!important;
      }

      html.dcc-theme-light-premium body #client #client-main .diet-switch button.active{
        border-color:#d6a33c!important;
        background:linear-gradient(145deg,#ffe995 0%,#f5ce63 50%,#e3aa31 100%)!important;
        color:#17140d!important;
        box-shadow:0 5px 13px rgba(185,126,18,.15),inset 0 1px 0 rgba(255,255,255,.86)!important;
      }

      html.dcc-theme-light-premium body #client #client-main .diet-dual-notice{
        display:grid!important;
        grid-template-columns:24px minmax(0,1fr)!important;
        align-items:center!important;
        gap:9px!important;
        margin:-3px 0 12px!important;
        padding:9px 11px!important;
        border:1px solid rgba(183,123,19,.24)!important;
        border-radius:14px!important;
        background:linear-gradient(145deg,#fff9eb 0%,#f8ecd3 100%)!important;
        color:#646b74!important;
        box-shadow:0 7px 18px rgba(78,58,28,.05)!important;
        font-size:10.5px!important;
        line-height:1.35!important;
        font-weight:500!important;
      }
      html.dcc-theme-light-premium body #client #client-main .diet-dual-notice b{
        color:#8d5c08!important;
        font-weight:800!important;
      }
      html.dcc-theme-light-premium body #client #client-main .diet-dual-notice-icon{
        width:24px!important;
        height:24px!important;
        display:grid!important;
        place-items:center!important;
        border:1px solid rgba(183,123,19,.35)!important;
        border-radius:50%!important;
        background:#fff4d7!important;
        color:#a66d0d!important;
        font-size:11px!important;
        font-weight:900!important;
      }

      /* Tarjeta PDF: deja de ser un bloque negro desconectado del Light */
      html.dcc-theme-light-premium body #client #client-main .diet-pdf-card{
        display:grid!important;
        grid-template-columns:38px minmax(0,1fr) auto!important;
        align-items:center!important;
        gap:11px!important;
        width:100%!important;
        min-height:70px!important;
        margin:0 0 14px!important;
        padding:10px 12px!important;
        border:1px solid rgba(177,119,18,.24)!important;
        border-radius:21px!important;
        background:
          radial-gradient(circle at 100% 0,rgba(214,163,61,.06),transparent 36%),
          linear-gradient(145deg,#fffefa 0%,#fbf5eb 100%)!important;
        color:#17191d!important;
        box-shadow:0 10px 26px rgba(78,58,28,.07),inset 0 1px 0 rgba(255,255,255,.96)!important;
      }

      html.dcc-theme-light-premium body #client #client-main .diet-pdf-icon{
        width:36px!important;
        height:42px!important;
        max-width:36px!important;
        max-height:42px!important;
        display:grid!important;
        place-items:center!important;
        color:#b77b13!important;
      }

      html.dcc-theme-light-premium body #client #client-main .diet-pdf-icon svg{
        width:27px!important;
        height:32px!important;
        max-width:27px!important;
        max-height:32px!important;
        color:#b77b13!important;
        stroke:currentColor!important;
      }

      html.dcc-theme-light-premium body #client #client-main .diet-pdf-text{
        min-width:0!important;
      }

      html.dcc-theme-light-premium body #client #client-main .diet-pdf-text strong{
        display:block!important;
        color:#17191d!important;
        font-size:13.5px!important;
        line-height:1.15!important;
        font-weight:700!important;
      }

      html.dcc-theme-light-premium body #client #client-main .diet-pdf-text span{
        display:block!important;
        margin-top:3px!important;
        color:#777f89!important;
        font-size:9.5px!important;
        line-height:1.25!important;
      }

      html.dcc-theme-light-premium body #client #client-main .diet-pdf-button{
        min-height:38px!important;
        padding:8px 12px!important;
        display:flex!important;
        align-items:center!important;
        justify-content:center!important;
        gap:6px!important;
        border:1px solid #d6a33c!important;
        border-radius:13px!important;
        background:linear-gradient(145deg,#fff8e6 0%,#f8e7bd 100%)!important;
        color:#8d5b08!important;
        box-shadow:none!important;
      }

      html.dcc-theme-light-premium body #client #client-main .diet-pdf-button svg{
        width:15px!important;
        height:15px!important;
        color:#a66e0d!important;
        stroke:currentColor!important;
      }

      html.dcc-theme-light-premium body #client #client-main .diet-pdf-button span{
        color:#8d5b08!important;
        font-size:8.8px!important;
        font-weight:800!important;
        letter-spacing:.75px!important;
      }

      /* Lista de comidas */
      html.dcc-theme-light-premium body #client #client-main .diet-list{
        display:grid!important;
        gap:10px!important;
        margin:0!important;
      }

      html.dcc-theme-light-premium body #client #client-main .meal-card{
        overflow:hidden!important;
        border:1px solid rgba(177,119,18,.23)!important;
        border-radius:21px!important;
        background:linear-gradient(145deg,#fffefa 0%,#fbf5eb 100%)!important;
        color:#17191d!important;
        box-shadow:0 10px 26px rgba(78,58,28,.07),inset 0 1px 0 rgba(255,255,255,.96)!important;
      }

      html.dcc-theme-light-premium body #client #client-main .meal-card[open]{
        border-color:rgba(177,119,18,.34)!important;
        box-shadow:0 10px 24px rgba(78,58,28,.075),inset 0 1px 0 rgba(255,255,255,.96)!important;
      }

      html.dcc-theme-light-premium body #client #client-main .meal-card summary{
        min-height:66px!important;
        padding:8px 16px!important;
        gap:12px!important;
        color:#17191d!important;
        background:transparent!important;
      }

      html.dcc-theme-light-premium body #client #client-main .meal-card summary > div{
        gap:11px!important;
      }

      html.dcc-theme-light-premium body #client #client-main .meal-card summary b{
        color:#17191d!important;
        font-family:inherit!important;
        font-size:15px!important;
        line-height:1.15!important;
        font-weight:800!important;
      }

      html.dcc-theme-light-premium body #client #client-main .meal-card summary b::before{
        width:27px!important;
        height:27px!important;
        flex:0 0 27px!important;
        background-size:25px 25px!important;
      }

      html.dcc-theme-light-premium body #client #client-main .meal-arrow{
        color:#b77b13!important;
        font-size:22px!important;
        line-height:1!important;
        font-weight:400!important;
      }

      /* Contenido de una comida abierta */
      html.dcc-theme-light-premium body #client #client-main .meal-content{
        padding:0 16px 12px!important;
        border-top:1px solid rgba(177,119,18,.13)!important;
        background:rgba(255,253,248,.54)!important;
      }

      html.dcc-theme-light-premium body #client #client-main .diet-options{
        gap:7px!important;
        margin:0 0 8px!important;
        padding-top:10px!important;
      }

      html.dcc-theme-light-premium body #client #client-main .diet-option{
        min-width:78px!important;
        height:34px!important;
        padding:0 12px!important;
        border:1px solid rgba(177,119,18,.22)!important;
        border-radius:11px!important;
        background:#fffaf1!important;
        color:#7a818a!important;
        font-size:10.5px!important;
        font-weight:700!important;
        box-shadow:none!important;
      }

      html.dcc-theme-light-premium body #client #client-main .diet-option.active{
        border-color:#d6a33c!important;
        background:linear-gradient(145deg,#ffe995,#e6ae37)!important;
        color:#17140d!important;
      }

      html.dcc-theme-light-premium body #client #client-main .food-row{
        display:flex!important;
        align-items:center!important;
        justify-content:space-between!important;
        gap:14px!important;
        min-height:42px!important;
        padding:9px 1px!important;
        border-bottom:1px solid rgba(177,119,18,.15)!important;
        color:#4f5660!important;
        font-size:12px!important;
        line-height:1.25!important;
      }

      html.dcc-theme-light-premium body #client #client-main .food-row:last-child{
        border-bottom:0!important;
      }

      html.dcc-theme-light-premium body #client #client-main .food-row > span{
        color:#4f5660!important;
        font-weight:500!important;
      }

      html.dcc-theme-light-premium body #client #client-main .food-row > b{
        flex:0 0 auto!important;
        color:#17191d!important;
        font-size:11.5px!important;
        font-weight:700!important;
        white-space:nowrap!important;
      }

      html.dcc-theme-light-premium body #client #client-main .meal-content .empty{
        padding:14px 2px 4px!important;
        color:#777f89!important;
      }

      @media(max-width:390px){
        html.dcc-theme-light-premium body #client #client-main .client-header .muted{
          font-size:14.5px!important;
        }
        html.dcc-theme-light-premium body #client #client-main .diet-switch{
          min-height:48px!important;
          margin-bottom:12px!important;
        }
        html.dcc-theme-light-premium body #client #client-main .diet-switch button{
          min-height:40px!important;
          font-size:12.3px!important;
        }
        html.dcc-theme-light-premium body #client #client-main .diet-pdf-card{
          grid-template-columns:32px minmax(0,1fr) auto!important;
          min-height:66px!important;
          padding:9px 10px!important;
          gap:8px!important;
        }
        html.dcc-theme-light-premium body #client #client-main .diet-pdf-icon{
          width:31px!important;
          height:36px!important;
        }
        html.dcc-theme-light-premium body #client #client-main .diet-pdf-icon svg{
          width:24px!important;
          height:29px!important;
        }
        html.dcc-theme-light-premium body #client #client-main .diet-pdf-text strong{
          font-size:12.5px!important;
        }
        html.dcc-theme-light-premium body #client #client-main .diet-pdf-text span{
          font-size:8.8px!important;
        }
        html.dcc-theme-light-premium body #client #client-main .diet-pdf-button{
          min-height:36px!important;
          padding:7px 9px!important;
        }
        html.dcc-theme-light-premium body #client #client-main .diet-pdf-button span{
          font-size:8.2px!important;
        }
        html.dcc-theme-light-premium body #client #client-main .meal-card summary{
          min-height:62px!important;
          padding:7px 14px!important;
        }
        html.dcc-theme-light-premium body #client #client-main .meal-card summary b{
          font-size:16px!important;
        }
        html.dcc-theme-light-premium body #client #client-main .meal-card summary b::before{
          width:25px!important;
          height:25px!important;
          flex-basis:25px!important;
          background-size:23px 23px!important;
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
