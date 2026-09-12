/* DCC — Clientes Light Premium aislado v2 */
(function(){
  'use strict';
  const STYLE_ID='dcc-coach-clients-light-fix-v2';

  function inject(){
    document.getElementById('dcc-coach-clients-light-fix-v1')?.remove();
    document.getElementById(STYLE_ID)?.remove();
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-final-clients{
        background:radial-gradient(circle at 90% 0,rgba(214,163,61,.075),transparent 25%),linear-gradient(180deg,#fffaf2 0%,#f7f0e5 58%,#f3eadc 100%)!important;
        color:#17191d!important;
        padding:16px 18px 112px!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-final-clients .dcc-fcl{max-width:980px!important;margin:0 auto!important}

      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-head{
        margin:2px 2px 18px!important;align-items:center!important;gap:14px!important
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-head h1{
        color:#17191d!important;font-size:31px!important;line-height:1!important;letter-spacing:-1px!important;text-shadow:none!important
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-head p{
        margin-top:7px!important;color:#747b86!important;font-size:13px!important;line-height:1.35!important;max-width:250px!important
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-new{
        min-height:44px!important;padding:0 16px!important;border-radius:15px!important;border:1px solid #dfa92f!important;
        background:linear-gradient(135deg,#f8db7e 0%,#e9b63f 100%)!important;color:#17120a!important;
        box-shadow:0 8px 18px rgba(176,119,18,.14),inset 0 1px 0 rgba(255,255,255,.62)!important;
        font-size:12px!important;font-weight:850!important
      }

      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-tools{grid-template-columns:1fr 46px!important;gap:9px!important}
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-search,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-final-clients .dcc-fcl-search{
        height:52px!important;min-height:52px!important;border:1px solid rgba(176,119,18,.24)!important;border-radius:17px!important;
        background:rgba(255,254,250,.94)!important;color:#a16b0e!important;box-shadow:0 5px 16px rgba(72,55,29,.045)!important
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-search input,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-final-clients #dccClientSearch{
        color:#1b1d21!important;-webkit-text-fill-color:#1b1d21!important;caret-color:#a96f0d!important;background:transparent!important;font-weight:650!important
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-search input::placeholder,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-final-clients #dccClientSearch::placeholder{
        color:#7f8691!important;-webkit-text-fill-color:#7f8691!important;opacity:1!important
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-filter,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-sort{
        background:#fffefa!important;color:#25282d!important;border:1px solid rgba(176,119,18,.24)!important;border-radius:15px!important;box-shadow:none!important
      }

      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-subtools{margin:10px 0 14px!important}
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-tabs{
        background:#fffefa!important;border:1px solid rgba(176,119,18,.22)!important;border-radius:22px!important;box-shadow:none!important;overflow:hidden!important
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-tab{
        min-height:38px!important;padding:0 16px!important;color:#7a818c!important;background:transparent!important;border:0!important;font-size:11px!important
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-tab.active{
        background:linear-gradient(135deg,#f7dc82 0%,#edbf54 100%)!important;color:#20180c!important;border:0!important;border-radius:20px!important;
        box-shadow:inset 0 1px 0 rgba(255,255,255,.62)!important;text-shadow:none!important;font-weight:800!important
      }

      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-list{gap:10px!important}
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-card{
        min-height:118px!important;padding:16px 16px!important;
        background:linear-gradient(145deg,#fffefa 0%,#fbf6ee 100%)!important;border:1px solid rgba(190,132,28,.27)!important;border-radius:18px!important;
        color:#17191d!important;box-shadow:0 5px 15px rgba(70,52,27,.035),inset 0 1px 0 rgba(255,255,255,.9)!important
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-name{
        color:#17191d!important;font-size:18px!important;line-height:1.05!important;letter-spacing:-.35px!important;text-shadow:none!important
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-goal{margin-top:7px!important;color:#9a6710!important;font-size:12px!important}
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-weight{margin-top:6px!important;color:#747b86!important;font-size:12px!important}
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-side{
        border-left:1px solid rgba(35,39,45,.34)!important;padding-left:14px!important;margin-left:8px!important
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-training,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-progress-label{
        color:#616873!important;font-size:11px!important;font-weight:650!important
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-training svg,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-training i{color:#d4a13a!important}
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-progress,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-bar{
        height:7px!important;margin-top:11px!important;border-radius:999px!important;background:#ddd6ca!important;overflow:hidden!important
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-progress > span,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-bar > span{
        border-radius:999px!important;background:linear-gradient(90deg,#d9aa4a,#f0c96b)!important
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-percent{
        margin-left:8px!important;padding:0!important;background:transparent!important;border:0!important;color:#4b5057!important;font-size:11px!important;line-height:1!important
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-manage{
        min-width:108px!important;min-height:54px!important;padding:0 12px!important;border-radius:15px!important;
        background:rgba(255,252,245,.78)!important;color:#8c5b09!important;border:1px solid rgba(176,119,18,.32)!important;
        box-shadow:none!important;font-size:11px!important;line-height:1.15!important;font-weight:850!important
      }

      @media(max-width:430px){
        html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients,
        html.dcc-theme-light-premium body #coach #coach-main.dcc-final-clients{padding:14px 18px 108px!important}
        html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-head h1{font-size:30px!important}
        html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-head p{font-size:12.5px!important;max-width:220px!important}
        html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-new{padding:0 14px!important;font-size:11.5px!important}
        html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-card{min-height:112px!important;padding:14px!important}
        html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-name{font-size:17px!important}
        html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-manage{min-width:102px!important;min-height:50px!important}
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
