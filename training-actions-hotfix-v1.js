/* DCC — Light Premium final polish: visual only. */
(function(){
  'use strict';
  if(window.__dccLightPremiumFinalPolishV1)return;
  window.__dccLightPremiumFinalPolishV1=true;

  const STYLE_ID='dcc-light-premium-final-polish-v1-css';

  function install(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      /* ENCABEZADOS PRINCIPALES — misma tipografía, tamaño y color */
      html.dcc-theme-light-premium #client-main .dch-eyebrow,
      html.dcc-theme-light-premium #client-main .client-header .section-eyebrow,
      html.dcc-theme-light-premium #client-main .dct3-eyebrow,
      html.dcc-theme-light-premium #client-main .dcpr6-kicker,
      html.dcc-theme-light-premium #client-main .dcc-cc-kicker,
      html.dcc-theme-light-premium #client-main .dcc-cm-kicker{
        color:#b77b13!important;
        font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text","Segoe UI",Arial,sans-serif!important;
        font-size:11px!important;
        font-weight:800!important;
        line-height:1.15!important;
        letter-spacing:3.15px!important;
        text-transform:uppercase!important;
        text-shadow:none!important;
      }

      /* ALIMENTACIÓN — nombres de comidas con la tipografía normal de la app */
      html.dcc-theme-light-premium #client-main.dcc-nutrition-premium .meal-card summary b,
      html.dcc-theme-light-premium #client-main.dcc-nutrition-premium .food-row,
      html.dcc-theme-light-premium #client-main.dcc-nutrition-premium .food-row b{
        font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text","Segoe UI",Arial,sans-serif!important;
        letter-spacing:0!important;
      }
      html.dcc-theme-light-premium #client-main.dcc-nutrition-premium .meal-card summary b{
        font-size:15px!important;
        font-weight:650!important;
        line-height:1.2!important;
      }

      /* PORTADA ENTRENAMIENTO — bloque de ejercicios protagonista con discos */
      html.dcc-theme-light-premium body #client-main .dcc-training-stable-v3 .dct3-routine{
        position:relative!important;
        overflow:hidden!important;
        isolation:isolate!important;
        min-height:170px!important;
        padding:18px!important;
        border:1px solid rgba(193,132,28,.62)!important;
        border-radius:22px!important;
        background-image:
          linear-gradient(90deg,#fffdf8 0%,#f9f0df 31%,rgba(249,240,223,.94) 42%,rgba(249,240,223,.62) 52%,rgba(249,240,223,.18) 64%,rgba(0,0,0,0) 74%),
          url('./assets/next-workout-plate.jpg')!important;
        background-size:100% 100%,auto 165%!important;
        background-position:center,right center!important;
        background-repeat:no-repeat,no-repeat!important;
        box-shadow:0 16px 36px rgba(73,52,20,.14),inset 0 1px 0 rgba(255,255,255,.88)!important;
      }
      html.dcc-theme-light-premium body #client-main .dcc-training-stable-v3 .dct3-routine::after{
        content:''!important;position:absolute!important;inset:0!important;z-index:0!important;pointer-events:none!important;
        background:linear-gradient(90deg,transparent 0%,transparent 58%,rgba(0,0,0,.06) 100%)!important;
      }
      html.dcc-theme-light-premium body #client-main .dcc-training-stable-v3 .dct3-routine>*{position:relative!important;z-index:2!important}
      html.dcc-theme-light-premium body #client-main .dcc-training-stable-v3 .dct3-routine .dct3-label{color:#aa7010!important}
      html.dcc-theme-light-premium body #client-main .dcc-training-stable-v3 .dct3-routine h3{color:#17191d!important;font-size:20px!important;font-weight:650!important;max-width:58%!important}
      html.dcc-theme-light-premium body #client-main .dcc-training-stable-v3 .dct3-routine .dct3-meta{color:#66707c!important;max-width:58%!important}
      html.dcc-theme-light-premium body #client-main .dcc-training-stable-v3 .dct3-actions{margin-top:18px!important;gap:9px!important}
      html.dcc-theme-light-premium body #client-main .dcc-training-stable-v3 .dct3-start{
        background:linear-gradient(135deg,#f8d97f,#e3ac39 64%,#f2c75e)!important;color:#171109!important;border-color:#e2ad3e!important;
        box-shadow:0 9px 22px rgba(186,127,21,.20),inset 0 1px 0 rgba(255,255,255,.52)!important
      }
      html.dcc-theme-light-premium body #client-main .dcc-training-stable-v3 .dct3-view{
        background:rgba(255,251,242,.94)!important;color:#6e4910!important;border-color:rgba(173,117,19,.35)!important;box-shadow:0 5px 14px rgba(83,63,31,.07)!important
      }
      html.dcc-theme-light-premium body:has(#client-main .dcc-training-stable-v3) .dcc-theme-trigger{display:none!important}

      /* ENTRENAMIENTO ACTIVO — cabecera Light Premium limpia y legible */
      html.dcc-theme-light-premium body.dcc-workout-mode #client-main .dwa3-top{
        position:relative!important;
        padding:15px!important;
        border:1px solid rgba(193,132,28,.54)!important;
        border-radius:22px!important;
        background:
          radial-gradient(circle at 92% 0,rgba(221,168,59,.10),transparent 34%),
          linear-gradient(145deg,#fffefa 0%,#fbf5e9 100%)!important;
        box-shadow:0 15px 34px rgba(73,52,20,.12),inset 0 1px 0 #fff!important;
      }
      html.dcc-theme-light-premium body.dcc-workout-mode #client-main .dwa3-title{color:#17191d!important;text-shadow:none!important}
      html.dcc-theme-light-premium body.dcc-workout-mode #client-main .dwa3-kicker span{color:#a86f0d!important}
      html.dcc-theme-light-premium body.dcc-workout-mode #client-main .dwa3-kicker small{color:#68717d!important}
      html.dcc-theme-light-premium body.dcc-workout-mode #client-main .dwa3-back{
        background:#fffaf0!important;color:#24211c!important;border-color:rgba(166,126,59,.28)!important;box-shadow:0 5px 14px rgba(83,63,31,.06)!important
      }
      html.dcc-theme-light-premium body.dcc-workout-mode #client-main .dwa3-media{
        background:linear-gradient(145deg,#f8efe0,#eee3d3)!important;border-color:rgba(187,126,20,.42)!important;box-shadow:0 6px 16px rgba(83,63,31,.08)!important
      }
      html.dcc-theme-light-premium body.dcc-workout-mode #client-main .dwa3-badge{
        background:#fffaf0!important;color:#5f6875!important;border-color:rgba(166,126,59,.24)!important
      }
      html.dcc-theme-light-premium body.dcc-workout-mode #client-main .dwa3-badge.gold{
        background:#fff0c6!important;color:#8e5d0a!important;border-color:rgba(187,126,20,.46)!important
      }
      html.dcc-theme-light-premium body.dcc-workout-mode #client-main .dwa3-tech,
      html.dcc-theme-light-premium body.dcc-workout-mode #client-main .dwa3-elapsed{
        background:#fff9ed!important;border-color:rgba(187,126,20,.40)!important;box-shadow:none!important
      }
      html.dcc-theme-light-premium body.dcc-workout-mode #client-main .dwa3-tech{color:#17191d!important}
      html.dcc-theme-light-premium body.dcc-workout-mode #client-main .dwa3-tech svg,
      html.dcc-theme-light-premium body.dcc-workout-mode #client-main .dwa3-elapsed{color:#a66d0b!important}
      html.dcc-theme-light-premium body.dcc-workout-mode #client-main .dwa3-elapsed-icon{background:#fbf0da!important}
      html.dcc-theme-light-premium body.dcc-workout-mode #client-main .dwa3-elapsed strong{color:#17191d!important}
      html.dcc-theme-light-premium body.dcc-workout-mode .dcc-theme-trigger{display:none!important}

      @media(max-width:430px){
        html.dcc-theme-light-premium body #client-main .dcc-training-stable-v3 .dct3-routine{min-height:160px!important;padding:16px!important;background-size:100% 100%,auto 155%!important}
        html.dcc-theme-light-premium body #client-main .dcc-training-stable-v3 .dct3-routine h3,
        html.dcc-theme-light-premium body #client-main .dcc-training-stable-v3 .dct3-routine .dct3-meta{max-width:56%!important}
        html.dcc-theme-light-premium body.dcc-workout-mode #client-main .dwa3-top{padding:12px!important;border-radius:19px!important}
      }
    `;
    document.head.appendChild(s);
  }

  function keepOnTop(){
    install();
    const s=document.getElementById(STYLE_ID);
    if(s&&s.parentNode&&s!==document.head.lastElementChild)document.head.appendChild(s);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',keepOnTop);else keepOnTop();
  window.addEventListener('dcc:themechange',keepOnTop);
  const observer=new MutationObserver(()=>requestAnimationFrame(keepOnTop));
  observer.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
})();
