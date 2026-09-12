/* DCC — Panel entrenador Light Premium · fix aislado */
(function(){
  'use strict';
  if(window.__dccDashboardLightFixV1)return;
  window.__dccDashboardLightFixV1=true;

  const STYLE_ID='dcc-dashboard-light-fix-v1';

  function injectCss(){
    document.getElementById(STYLE_ID)?.remove();
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard{
        background:
          radial-gradient(circle at 88% 0,rgba(214,163,61,.10),transparent 27%),
          linear-gradient(180deg,#fffaf1 0%,#f6f0e5 62%,#f1e9dc 100%)!important;
        background-color:#f5efe4!important;
        color:#17191d!important;
        padding:18px 14px 104px!important;
      }

      html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9{
        width:100%!important;
        max-width:980px!important;
        margin:0 auto!important;
      }

      html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-hero{
        border:1px solid rgba(190,132,25,.34)!important;
        background:
          radial-gradient(circle at 88% 8%,rgba(214,163,61,.13),transparent 30%),
          linear-gradient(145deg,#fffefa 0%,#faf4e9 100%)!important;
        box-shadow:0 10px 26px rgba(83,63,31,.06),inset 0 1px 0 rgba(255,255,255,.96)!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-kicker,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-title span,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-mark{
        color:#b77b13!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-title{
        color:#17191d!important;
        text-shadow:none!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-caption,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-motto{
        color:#737b87!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-mark{
        background:#fff7e6!important;
        border-color:rgba(185,122,17,.32)!important;
        box-shadow:none!important;
      }

      html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-stat{
        background:linear-gradient(145deg,#fffefa 0%,#fbf6ec 100%)!important;
        color:#17191d!important;
        border-color:rgba(190,132,25,.30)!important;
        box-shadow:0 8px 20px rgba(83,63,31,.05),inset 0 1px 0 rgba(255,255,255,.96)!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-stat-ico,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-stat-arrow{
        color:#b77b13!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-stat strong,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-stat.dcc-p9-zero strong{
        color:#17191d!important;
        text-shadow:none!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-stat.dcc-p9-positive strong{
        color:#a96f0d!important;
        text-shadow:none!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-stat span span{
        color:#858d98!important;
      }

      html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-accordion{
        background:linear-gradient(145deg,#fffefa 0%,#faf4e9 100%)!important;
        border-color:rgba(190,132,25,.32)!important;
        box-shadow:0 10px 24px rgba(83,63,31,.055),inset 0 1px 0 rgba(255,255,255,.96)!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-accordion-head{
        color:#17191d!important;
        background:transparent!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-head-ico{
        color:#b77b13!important;
        background:#fff7e6!important;
        border-color:rgba(185,122,17,.28)!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-head-title{
        color:#b77b13!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-head-sub{
        color:#68717e!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-count{
        background:linear-gradient(145deg,#f4cf69,#e3ae3c)!important;
        color:#19130a!important;
        border:0!important;
        box-shadow:none!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-caret{
        color:#d3a53c!important;
      }

      html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-body{
        background:transparent!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-inner{
        background:#fffdf8!important;
        border:1px solid rgba(185,122,17,.16)!important;
        border-radius:18px!important;
        overflow:hidden!important;
        box-shadow:none!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-row{
        background:#fffdf8!important;
        color:#17191d!important;
        border-bottom:1px solid rgba(185,122,17,.12)!important;
        box-shadow:none!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-row:last-child{
        border-bottom:0!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-row-copy b{
        color:#17191d!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-row-copy span{
        color:#7c8490!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-row-icon{
        background:#fff6df!important;
        color:#b77b13!important;
        border-color:rgba(185,122,17,.28)!important;
        box-shadow:none!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-badge{
        background:#fff8e8!important;
        color:#9a6710!important;
        border-color:rgba(185,122,17,.30)!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-arrow{
        color:#d3a53c!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-empty{
        background:#fffdf8!important;
        color:#7c8490!important;
        border-radius:16px!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-empty-i{
        color:#b77b13!important;
        border-color:rgba(185,122,17,.28)!important;
        background:#fff7e6!important;
      }

      @media(max-width:700px){
        html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard{
          padding:16px 12px 100px!important;
        }
        html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-row{
          min-height:72px!important;
          padding:10px 11px!important;
        }
      }
    `;
    document.head.appendChild(s);
  }

  function resetDashboardScroll(){
    const main=document.getElementById('coach-main');
    if(!main?.classList.contains('dcc-p9-dashboard'))return;
    try{main.scrollTop=0}catch(e){}
    try{window.scrollTo({top:0,left:0,behavior:'auto'})}catch(e){window.scrollTo(0,0)}
  }

  document.addEventListener('click',event=>{
    const btn=event.target.closest?.('#coach-nav button');
    if(!btn)return;
    const label=(btn.textContent||'').trim().toLowerCase();
    if(label!=='panel')return;
    setTimeout(resetDashboardScroll,0);
    setTimeout(resetDashboardScroll,80);
  },true);

  injectCss();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',injectCss,{once:true});
  window.addEventListener('pageshow',injectCss);
})();
