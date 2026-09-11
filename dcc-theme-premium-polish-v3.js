/* DCC — Light Premium V4: barra final + disco definido. Solo presentación. */
(function(){
  'use strict';
  if(window.__dccThemePremiumPolishV4)return;
  window.__dccThemePremiumPolishV4=true;

  const STYLE_ID='dcc-theme-premium-polish-v4-css';

  function installStyles(){
    document.getElementById('dcc-theme-premium-polish-v3-css')?.remove();
    if(document.getElementById(STYLE_ID))return;
    const style=document.createElement('style');
    style.id=STYLE_ID;
    style.textContent=`
      @keyframes dcc-nav-selected-pulse{
        0%,100%{box-shadow:0 0 0 1px rgba(255,224,139,.88),0 0 10px rgba(244,187,58,.38),inset 0 1px 0 rgba(255,255,255,.78),inset 0 0 14px rgba(255,224,139,.22)}
        50%{box-shadow:0 0 0 1px rgba(255,234,166,1),0 0 18px rgba(255,196,62,.70),inset 0 1px 0 rgba(255,255,255,.9),inset 0 0 20px rgba(255,224,139,.32)}
      }

      /* Fondo claro real alrededor del menú. */
      html.dcc-theme-light-premium body,
      html.dcc-theme-light-premium .app,
      html.dcc-theme-light-premium #client-main,
      html.dcc-theme-light-premium #coach-main{
        background-color:#f5efe4!important;
      }

      /* BARRA PREMIUM APROBADA */
      html.dcc-theme-light-premium body #client-nav,
      html.dcc-theme-light-premium body #coach-nav{
        box-sizing:border-box!important;
        background:linear-gradient(180deg,#242119 0%,#11120f 54%,#1a1813 100%)!important;
        border:1.5px solid #d5a33a!important;
        border-radius:24px!important;
        box-shadow:0 10px 27px rgba(67,45,10,.26),0 0 0 1px rgba(255,221,126,.10),inset 0 1px 0 rgba(255,236,181,.13)!important;
        overflow:hidden!important;
        isolation:isolate!important;
      }
      html.dcc-theme-light-premium body #client-nav::before,
      html.dcc-theme-light-premium body #client-nav::after,
      html.dcc-theme-light-premium body #coach-nav::before,
      html.dcc-theme-light-premium body #coach-nav::after{
        display:none!important;
        content:none!important;
      }
      html.dcc-theme-light-premium body #client-nav button,
      html.dcc-theme-light-premium body #coach-nav button{
        box-sizing:border-box!important;
        background:transparent!important;
        color:#efbf55!important;
        border:1px solid transparent!important;
        border-radius:18px!important;
        box-shadow:none!important;
        transform:none!important;
        text-shadow:none!important;
        transition:background .22s ease,border-color .22s ease,box-shadow .22s ease,color .22s ease!important;
      }
      html.dcc-theme-light-premium body #client-nav button svg,
      html.dcc-theme-light-premium body #coach-nav button svg{
        color:#efbf55!important;
        stroke:currentColor!important;
        filter:drop-shadow(0 0 4px rgba(239,191,85,.16))!important;
      }
      html.dcc-theme-light-premium body #client-nav button span,
      html.dcc-theme-light-premium body #coach-nav button span{
        color:#efd488!important;
      }
      html.dcc-theme-light-premium body #client-nav button.active,
      html.dcc-theme-light-premium body #coach-nav button.active{
        background:linear-gradient(145deg,#ffe9a8 0%,#f2c45d 48%,#d89d2d 100%)!important;
        color:#181207!important;
        border:1px solid #ffe39a!important;
        transform:none!important;
        animation:dcc-nav-selected-pulse 1.8s ease-in-out infinite!important;
      }
      html.dcc-theme-light-premium body #client-nav button.active svg,
      html.dcc-theme-light-premium body #coach-nav button.active svg{
        color:#181207!important;
        stroke:currentColor!important;
        filter:none!important;
      }
      html.dcc-theme-light-premium body #client-nav button.active span,
      html.dcc-theme-light-premium body #coach-nav button.active span{
        color:#181207!important;
        font-weight:700!important;
      }

      /* PRÓXIMO ENTRENAMIENTO: conserva el layout original y fija el disco a la derecha. */
      html.dcc-theme-light-premium #client-main .dch-next{
        position:relative!important;
        overflow:hidden!important;
        isolation:isolate!important;
        background:
          linear-gradient(90deg,#fffdf8 0%,#f9f0df 31%,rgba(249,240,223,.94) 39%,rgba(249,240,223,.56) 51%,rgba(249,240,223,.15) 61%,rgba(0,0,0,0) 70%),
          url('./assets/next-workout-plate.jpg') right 46% center / auto 146% no-repeat!important;
        border:1px solid rgba(193,132,28,.68)!important;
        box-shadow:0 14px 34px rgba(66,47,20,.14)!important;
      }
      /* El disco gana contraste sin tocar la posición de ningún hijo. */
      html.dcc-theme-light-premium #client-main .dch-next::before{
        content:''!important;
        position:absolute!important;
        z-index:0!important;
        inset:0 0 0 auto!important;
        width:48%!important;
        pointer-events:none!important;
        background:linear-gradient(90deg,transparent 0%,rgba(0,0,0,.02) 34%,rgba(0,0,0,.10) 100%)!important;
      }
      html.dcc-theme-light-premium #client-main .dch-next .dch-iconbox,
      html.dcc-theme-light-premium #client-main .dch-next .dch-next-label,
      html.dcc-theme-light-premium #client-main .dch-next .dch-next-name,
      html.dcc-theme-light-premium #client-main .dch-next .dch-next-day,
      html.dcc-theme-light-premium #client-main .dch-next .dch-routine-btn{
        z-index:2!important;
      }
      html.dcc-theme-light-premium #client-main .dch-next-name{color:#17191d!important;font-weight:400!important}
      html.dcc-theme-light-premium #client-main .dch-next-day{color:#657080!important}
      html.dcc-theme-light-premium #client-main .dch-routine-btn{
        background:linear-gradient(135deg,#f7d77d,#e3ac39)!important;
        border:1px solid #e8b64a!important;
        color:#171109!important;
        box-shadow:0 7px 20px rgba(183,124,18,.24)!important;
      }
    `;
    document.head.appendChild(style);
  }

  function clearOldInlineNav(){
    if(!document.documentElement.classList.contains('dcc-theme-light-premium'))return;
    ['client-nav','coach-nav'].forEach(id=>{
      const nav=document.getElementById(id);
      if(!nav)return;
      ['background','border','box-shadow','overflow'].forEach(p=>nav.style.removeProperty(p));
      nav.querySelectorAll('button').forEach(btn=>{
        ['background','border','box-shadow','color','transform','animation'].forEach(p=>btn.style.removeProperty(p));
      });
    });
  }

  let queued=false;
  function schedule(){
    if(queued)return;
    queued=true;
    requestAnimationFrame(()=>{
      queued=false;
      installStyles();
      clearOldInlineNav();
    });
  }

  installStyles();
  document.addEventListener('DOMContentLoaded',schedule);
  window.addEventListener('dcc:themechange',schedule);
  document.addEventListener('click',e=>{
    if(e.target.closest('#client-nav button,#coach-nav button'))setTimeout(schedule,0);
  },true);
  const observer=new MutationObserver(schedule);
  observer.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
  schedule();
})();