/* DCC — estilos estáticos del buscador + visual próximo entrenamiento */
(function(){
  'use strict';
  const BUILD='20260913-client-search-visual-v2';
  if(window.__dccClientSearchVisual===BUILD)return;
  window.__dccClientSearchVisual=BUILD;

  const id='dcc-client-search-visual-v2';
  if(!document.getElementById(id)){
    const style=document.createElement('style');
    style.id=id;
    style.textContent=`
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-u-search{
        background:#fffefa!important;color:#17191d!important;border:1px solid rgba(177,119,18,.25)!important;
        box-shadow:0 7px 18px rgba(78,58,28,.045)!important;overflow:hidden!important
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-u-search>svg{color:#b77b13!important}
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-u-search>input#dccClientSearch{
        color:#17191d!important;-webkit-text-fill-color:#17191d!important;caret-color:#b77b13!important
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-u-search>input#dccClientSearch::placeholder{
        color:#858c96!important;-webkit-text-fill-color:#858c96!important;opacity:1!important
      }
      html body #client-main .dc-home-next{
        position:relative!important;overflow:hidden!important;isolation:isolate!important;border-color:rgba(240,201,107,.60)!important;
        background:linear-gradient(120deg,#11151a 0%,#0b0f13 58%,#07090c 100%)!important;
        box-shadow:inset 0 1px 0 rgba(255,255,255,.035),0 14px 36px rgba(0,0,0,.28)!important
      }
      html body #client-main .dc-home-next::after{
        content:"";position:absolute!important;z-index:0!important;top:-8%!important;right:-2%!important;bottom:-8%!important;width:64%!important;pointer-events:none!important;
        background-image:linear-gradient(90deg,#0b0f13 0%,rgba(11,15,19,.92) 15%,rgba(11,15,19,.58) 34%,rgba(11,15,19,.18) 58%,rgba(11,15,19,0) 82%),url("./assets/next-workout-plate.jpg?v=20260909-1")!important;
        background-size:cover!important;background-position:center right!important;background-repeat:no-repeat!important;opacity:.98!important
      }
      html body #client-main .dc-home-next>*{position:relative!important;z-index:1!important}
    `;
    document.head.appendChild(style);
  }

  if(![...document.scripts].some(s=>(s.src||'').includes('client-home-task-seen-fix.js'))){
    const script=document.createElement('script');
    script.src='./client-home-task-seen-fix.js?v=20260913-2335';
    script.async=false;
    script.dataset.dccClientHomeTaskSeen='1';
    document.head.appendChild(script);
  }
})();