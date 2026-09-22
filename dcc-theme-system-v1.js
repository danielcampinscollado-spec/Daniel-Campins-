/* DCC — Light Premium global theme state.
   Single global theme: Light Premium.
   Navigation ownership is intentionally split by area:
   - client navigation: this file
   - trainer navigation: coach-premium-core-v13.js
*/
(function(){
  'use strict';
  const THEME='light-premium';
  const KEY='dcc:theme:v1';
  const ROOT_CLASS='dcc-theme-light-premium';
  const STYLE_ID='dcc-light-premium-global-v1';

  function apply(){
    const root=document.documentElement;
    root.classList.add(ROOT_CLASS);
    root.dataset.dccTheme=THEME;
    try{localStorage.setItem(KEY,THEME)}catch(_){ }
    document.querySelectorAll('.dcc-theme-trigger,.dcc-theme-overlay').forEach(el=>el.remove());
  }

  function install(){
    document.getElementById(STYLE_ID)?.remove();
    const style=document.createElement('style');
    style.id=STYLE_ID;
    style.textContent=`
      html.dcc-theme-light-premium body,
      html.dcc-theme-light-premium body .app{
        background:#f5efe4!important;
        color:#17191d!important;
      }
      html.dcc-theme-light-premium #client-main,
      html.dcc-theme-light-premium #coach-main{
        background:radial-gradient(circle at 88% 0%,rgba(214,163,61,.10),transparent 26%),linear-gradient(180deg,#fffaf1 0%,#f5efe4 60%,#f1e9dc 100%)!important;
        color:#17191d!important;
      }
      html.dcc-theme-light-premium #client-main h1,
      html.dcc-theme-light-premium #client-main h2,
      html.dcc-theme-light-premium #client-main h3,
      html.dcc-theme-light-premium #coach-main h1,
      html.dcc-theme-light-premium #coach-main h2,
      html.dcc-theme-light-premium #coach-main h3{color:#17191d!important;text-shadow:none!important}
      html.dcc-theme-light-premium #client-main .muted,
      html.dcc-theme-light-premium #coach-main .muted{color:#657080!important}

      html.dcc-theme-light-premium #client-main .card,
      html.dcc-theme-light-premium #coach-main .card,
      html.dcc-theme-light-premium #client-main .meal-card,
      html.dcc-theme-light-premium #coach-main .meal-card,
      html.dcc-theme-light-premium #client-main .routine-client-row,
      html.dcc-theme-light-premium #coach-main .routine-client-row,
      html.dcc-theme-light-premium #client-main .exercise,
      html.dcc-theme-light-premium #coach-main .exercise,
      html.dcc-theme-light-premium #client-main .food,
      html.dcc-theme-light-premium #coach-main .food,
      html.dcc-theme-light-premium #client-main .client-row,
      html.dcc-theme-light-premium #coach-main .client-row{
        background:linear-gradient(145deg,#fffefa 0%,#fbf6ec 100%)!important;
        background-color:#fffaf1!important;
        color:#17191d!important;
        border-color:rgba(198,139,32,.34)!important;
        box-shadow:0 10px 28px rgba(83,63,31,.08),inset 0 1px 0 rgba(255,255,255,.95)!important;
      }
      html.dcc-theme-light-premium #client-main input,
      html.dcc-theme-light-premium #client-main textarea,
      html.dcc-theme-light-premium #client-main select,
      html.dcc-theme-light-premium #coach-main input,
      html.dcc-theme-light-premium #coach-main textarea,
      html.dcc-theme-light-premium #coach-main select{
        background:#fffefa!important;color:#17191d!important;-webkit-text-fill-color:#17191d!important;
        border-color:rgba(166,126,59,.28)!important;box-shadow:none!important;
      }
      html.dcc-theme-light-premium #client-main .ghost,
      html.dcc-theme-light-premium #coach-main .ghost{
        background:#fffaf1!important;color:#17191d!important;border-color:rgba(166,126,59,.25)!important;
      }

      /* CLIENTE: esta es la única autoridad Light de su barra inferior. */
      @media(max-width:700px){
        html.dcc-theme-light-premium body #client > .side{
          position:fixed!important;left:10px!important;right:10px!important;
          bottom:max(10px,env(safe-area-inset-bottom))!important;top:auto!important;
          width:auto!important;height:68px!important;min-height:68px!important;
          padding:0!important;margin:0!important;border:0!important;border-radius:22px!important;
          background:transparent!important;background-color:transparent!important;background-image:none!important;
          box-shadow:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;
          overflow:visible!important;z-index:99999!important;
        }
        html.dcc-theme-light-premium body #client > .side::before,
        html.dcc-theme-light-premium body #client > .side::after{display:none!important;content:none!important}
        html.dcc-theme-light-premium body #client > .side > h2,
        html.dcc-theme-light-premium body #client > .side > .out{display:none!important}
        html.dcc-theme-light-premium body #client-nav{
          display:grid!important;grid-template-columns:repeat(6,minmax(0,1fr))!important;align-items:stretch!important;
          width:100%!important;height:68px!important;gap:0!important;padding:4px!important;margin:0!important;
          box-sizing:border-box!important;overflow:hidden!important;border:1px solid rgba(166,126,59,.26)!important;
          border-radius:22px!important;background:#fffdf9!important;background-color:#fffdf9!important;background-image:none!important;
          box-shadow:0 10px 28px rgba(93,67,25,.12)!important;
        }
        html.dcc-theme-light-premium body #client-nav button{
          width:100%!important;min-width:0!important;height:60px!important;margin:0!important;padding:4px 1px!important;
          display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:3px!important;
          border:0!important;border-radius:16px!important;background:transparent!important;background-image:none!important;
          color:#707782!important;box-shadow:none!important;filter:none!important;transform:none!important;
        }
        html.dcc-theme-light-premium body #client-nav button::before,
        html.dcc-theme-light-premium body #client-nav button::after{display:none!important;content:none!important}
        html.dcc-theme-light-premium body #client-nav button svg{width:21px!important;height:21px!important;flex:0 0 21px!important;color:currentColor!important;stroke:currentColor!important}
        html.dcc-theme-light-premium body #client-nav button span{width:100%!important;margin:0!important;padding:0!important;color:currentColor!important;font-size:9px!important;line-height:1!important;font-weight:650!important;text-align:center!important;white-space:nowrap!important}
        html.dcc-theme-light-premium body #client-nav button.active{
          color:#17140d!important;background:linear-gradient(145deg,#ffe994 0%,#f6cf61 48%,#e2a72f 100%)!important;
          border:1px solid #d9a43a!important;box-shadow:0 5px 14px rgba(185,126,18,.16),inset 0 1px 0 rgba(255,255,255,.9)!important;
        }
        html.dcc-theme-light-premium body #client-nav button.active svg,
        html.dcc-theme-light-premium body #client-nav button.active span{color:#17140d!important;stroke:currentColor!important;font-weight:800!important}
      }

      /* Escritorio: Light. En móvil el entrenador lo controla exclusivamente coach-premium-core-v13.js. */
      @media(min-width:701px){
        html.dcc-theme-light-premium .side{
          background:linear-gradient(180deg,#fffaf1 0%,#f1e7d7 100%)!important;
          color:#17191d!important;border-right-color:rgba(186,126,20,.24)!important;
          box-shadow:12px 0 30px rgba(83,63,31,.05)!important;
        }
        html.dcc-theme-light-premium .side h2{color:#17191d!important;border-bottom-color:rgba(89,70,36,.12)!important}
      }
      .dcc-theme-trigger,.dcc-theme-overlay{display:none!important}
    `;
    (document.head||document.documentElement).appendChild(style);
  }

  function boot(){apply();install()}
  apply();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  window.addEventListener('pageshow',apply);
  window.dccTheme={get:()=>THEME,set:()=>{apply();return THEME},open:()=>{},themes:{light:{id:THEME,name:'DCC Light Premium'}}};
  window.dispatchEvent(new CustomEvent('dcc:themechange',{detail:{theme:THEME}}));
})();
