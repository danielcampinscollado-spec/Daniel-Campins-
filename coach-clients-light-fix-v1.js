/* DCC — Clientes Light Premium aislado v1 */
(function(){
  'use strict';
  if(window.__dccCoachClientsLightFixV1)return;
  window.__dccCoachClientsLightFixV1=true;

  const STYLE_ID='dcc-coach-clients-light-fix-v1';

  function inject(){
    document.getElementById(STYLE_ID)?.remove();
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-final-clients{
        background:radial-gradient(circle at 88% 0,rgba(214,163,61,.10),transparent 28%),linear-gradient(180deg,#fffaf1 0%,#f6efe3 60%,#f1e8da 100%)!important;
        background-color:#f5eee2!important;
        color:#17191d!important;
        padding:14px 20px 112px!important;
      }

      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-final-clients .dcc-fcl{
        max-width:980px!important;
        margin:0 auto!important;
      }

      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-head{
        margin:8px 2px 22px!important;
        align-items:center!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-head h1{
        color:#17191d!important;
        font-size:34px!important;
        letter-spacing:-1.2px!important;
        text-shadow:none!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-head p{
        color:#707784!important;
        font-size:14px!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-new{
        background:linear-gradient(135deg,#f5d778 0%,#e4ad35 100%)!important;
        color:#17120a!important;
        border:1px solid #e3b445!important;
        box-shadow:0 9px 22px rgba(178,120,18,.18),inset 0 1px 0 rgba(255,255,255,.55)!important;
        border-radius:16px!important;
        min-height:48px!important;
        padding:0 18px!important;
        font-weight:850!important;
      }

      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-tools{
        grid-template-columns:1fr 48px!important;
        gap:10px!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-search,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-final-clients .dcc-fcl-search{
        height:58px!important;
        min-height:58px!important;
        border:1px solid rgba(185,122,17,.26)!important;
        border-radius:18px!important;
        background:#fffefa!important;
        color:#9a6710!important;
        box-shadow:0 8px 24px rgba(83,63,31,.06),inset 0 1px 0 rgba(255,255,255,.95)!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-search input,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-final-clients #dccClientSearch{
        color:#17191d!important;
        -webkit-text-fill-color:#17191d!important;
        caret-color:#b77b13!important;
        background:transparent!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-search input::placeholder,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-final-clients #dccClientSearch::placeholder{
        color:#7e8590!important;
        -webkit-text-fill-color:#7e8590!important;
        opacity:1!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-filter{
        background:#fffefa!important;
        color:#25282d!important;
        border:1px solid rgba(185,122,17,.26)!important;
        box-shadow:0 6px 18px rgba(83,63,31,.05)!important;
      }

      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-subtools{
        margin:12px 0 16px!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-tabs{
        background:#fffefa!important;
        border:1px solid rgba(185,122,17,.25)!important;
        border-radius:24px!important;
        box-shadow:0 5px 16px rgba(83,63,31,.04)!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-tab{
        color:#777f8a!important;
        background:transparent!important;
        border:0!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-tab.active{
        background:linear-gradient(145deg,#fff1b9 0%,#ebc158 100%)!important;
        color:#21180a!important;
        border:1px solid #d8a83f!important;
        box-shadow:0 5px 14px rgba(185,125,20,.16),inset 0 1px 0 rgba(255,255,255,.55)!important;
        text-shadow:none!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-sort{
        background:#fffefa!important;
        color:#25282d!important;
        border:1px solid rgba(185,122,17,.26)!important;
        border-radius:15px!important;
        box-shadow:0 5px 16px rgba(83,63,31,.04)!important;
      }

      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-list{
        gap:12px!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-card{
        background:linear-gradient(145deg,#fffefa 0%,#fbf6ed 100%)!important;
        background-color:#fffaf1!important;
        border:1px solid rgba(198,139,32,.32)!important;
        border-radius:18px!important;
        color:#17191d!important;
        box-shadow:0 9px 24px rgba(83,63,31,.055),inset 0 1px 0 rgba(255,255,255,.95)!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-name{
        color:#17191d!important;
        text-shadow:none!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-goal{
        color:#9a6710!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-weight{
        color:#747b86!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-side{
        border-left-color:rgba(41,45,51,.65)!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-training,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-progress-label{
        color:#555d68!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-progress,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-bar{
        background:#e7dfd2!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-progress > span,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-bar > span{
        background:linear-gradient(90deg,#d6a53d,#f0c96b)!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-percent{
        color:#25282d!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-manage{
        background:#fffaf1!important;
        color:#8e5d0b!important;
        border:1px solid rgba(185,122,17,.38)!important;
        border-radius:16px!important;
        box-shadow:none!important;
        font-weight:850!important;
      }

      @media(max-width:430px){
        html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients,
        html.dcc-theme-light-premium body #coach #coach-main.dcc-final-clients{padding:14px 20px 108px!important}
        html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-head h1{font-size:32px!important}
        html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-new{padding:0 15px!important;font-size:12px!important}
      }
    `;
    document.head.appendChild(s);
  }

  function refresh(){
    inject();
    const main=document.getElementById('coach-main');
    if(main&&(main.classList.contains('dcc-premium-clients')||main.classList.contains('dcc-final-clients'))){
      document.documentElement.classList.add('dcc-theme-light-premium');
    }
  }

  refresh();
  document.addEventListener('DOMContentLoaded',refresh,{once:true});
  window.addEventListener('load',()=>setTimeout(refresh,40),{once:true});
  window.addEventListener('pageshow',()=>setTimeout(refresh,30));
  const main=document.getElementById('coach-main');
  if(main)new MutationObserver(()=>requestAnimationFrame(refresh)).observe(main,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
})();
