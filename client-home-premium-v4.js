/* DCC — Inicio cliente premium: sistema visual aprobado */
(function(){
  'use strict';
  if(window.__dccClientHomePremiumApprovedV1)return;
  window.__dccClientHomePremiumApprovedV1=true;

  const STYLE_ID='dcc-client-home-premium-approved-v1-css';

  function installStyles(){
    if(document.getElementById(STYLE_ID))return;
    document.getElementById('dcc-client-home-premium-v4-css')?.remove();

    const style=document.createElement('style');
    style.id=STYLE_ID;
    style.textContent=`
      #client-main .dch-wrap,
      #client-main .dch-wrap *{
        font-family:"Avenir Next","Helvetica Neue",-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif!important;
        font-synthesis:none!important;
        -webkit-font-smoothing:antialiased!important;
      }

      #client-main .dch-wrap{
        --dcc-gold:#e8b94f;
        --dcc-text:#f2f1ed;
        --dcc-muted:#949ba5;
      }

      #client-main .dch-welcome{
        min-height:78px!important;
        margin:0 0 14px!important;
        padding:4px 2px 10px!important;
      }

      #client-main .dch-eyebrow{
        margin:0 0 8px!important;
        color:var(--dcc-gold)!important;
        font-size:10px!important;
        line-height:1.1!important;
        font-weight:650!important;
        letter-spacing:3.2px!important;
        text-transform:uppercase!important;
      }

      #client-main .dch-name,
      #client-main .dch-welcome .dch-name{
        margin:0!important;
        color:var(--dcc-text)!important;
        font-size:25px!important;
        line-height:1.12!important;
        font-weight:400!important;
        letter-spacing:-.25px!important;
        text-shadow:none!important;
      }

      #client-main .dch-stat{
        grid-template-columns:44px minmax(0,1fr)!important;
        gap:14px!important;
        min-height:105px!important;
        padding:18px!important;
        align-items:center!important;
        cursor:default!important;
      }

      #client-main .dch-stat .dch-chevron{display:none!important}

      #client-main .dch-stat [class*="label"]{
        color:#a9afb8!important;
        font-size:9px!important;
        line-height:1.15!important;
        font-weight:600!important;
        letter-spacing:2.1px!important;
        text-transform:uppercase!important;
      }

      #client-main .dch-stat [class*="value"],
      #client-main .dch-stat strong,
      #client-main .dch-stat b{
        color:var(--dcc-text)!important;
        font-size:27px!important;
        line-height:1!important;
        font-weight:500!important;
        letter-spacing:-.5px!important;
      }

      #client-main .dch-task-head,
      #client-main .dch-progress [class*="label"],
      #client-main .dch-progress [class*="eyebrow"],
      #client-main .dch-next [class*="label"],
      #client-main .dch-next [class*="eyebrow"],
      #client-main .dch-next [class*="kicker"]{
        color:var(--dcc-gold)!important;
        font-size:10px!important;
        line-height:1.16!important;
        font-weight:650!important;
        letter-spacing:2.7px!important;
        text-transform:uppercase!important;
      }

      #client-main .dch-task-empty,
      #client-main .dch-progress,
      #client-main .dch-next{
        grid-template-columns:50px minmax(0,1fr)!important;
        column-gap:18px!important;
      }

      #client-main .dch-task-card{
        padding:0!important;
        overflow:hidden!important;
      }

      #client-main .dch-task-head{
        min-height:42px!important;
        height:42px!important;
        padding:0 16px!important;
      }

      #client-main .dch-task-empty{
        min-height:78px!important;
        padding:13px 16px!important;
        align-items:center!important;
        gap:18px!important;
      }

      #client-main .dch-task-empty .dch-iconbox{
        width:44px!important;
        height:44px!important;
        justify-self:start!important;
      }

      #client-main .dch-task-empty > span:last-child{
        margin:0!important;
        max-width:none!important;
        color:var(--dcc-text)!important;
        font-size:16px!important;
        line-height:1.18!important;
        font-weight:450!important;
        letter-spacing:-.08px!important;
      }

      #client-main .dch-task-empty > span:last-child::after{
        content:'No hay tareas pendientes por ahora.'!important;
        display:block!important;
        margin-top:5px!important;
        color:var(--dcc-muted)!important;
        font-size:10.5px!important;
        line-height:1.35!important;
        font-weight:400!important;
        letter-spacing:0!important;
      }

      #client-main .dch-progress{
        padding:20px 16px!important;
        gap:18px!important;
        align-items:center!important;
        cursor:default!important;
      }

      #client-main .dch-progress .dch-chevron{display:none!important}

      #client-main .dch-progress h1,
      #client-main .dch-progress h2,
      #client-main .dch-progress h3,
      #client-main .dch-progress [class*="title"]{
        margin-top:6px!important;
        color:var(--dcc-text)!important;
        font-size:18px!important;
        line-height:1.18!important;
        font-weight:450!important;
        letter-spacing:-.2px!important;
      }

      #client-main .dch-progress p,
      #client-main .dch-progress [class*="sub"]{
        margin-top:7px!important;
        color:var(--dcc-muted)!important;
        font-size:10.5px!important;
        line-height:1.38!important;
        font-weight:400!important;
        letter-spacing:0!important;
      }

      #client-main .dch-next{
        padding:20px 16px!important;
        gap:18px!important;
        align-items:center!important;
      }

      #client-main .dch-next h1,
      #client-main .dch-next h2,
      #client-main .dch-next h3,
      #client-main .dch-next [class*="title"]{
        margin-top:7px!important;
        color:var(--dcc-text)!important;
        font-size:18px!important;
        line-height:1.18!important;
        font-weight:450!important;
        letter-spacing:-.2px!important;
        white-space:nowrap!important;
        overflow:visible!important;
        text-overflow:clip!important;
      }

      #client-main .dch-next p,
      #client-main .dch-next [class*="sub"]{
        margin-top:7px!important;
        color:var(--dcc-muted)!important;
        font-size:11px!important;
        line-height:1.3!important;
        font-weight:400!important;
      }

      #client-main .dch-next button,
      #client-main .dch-next [class*="button"],
      #client-main .dch-next [class*="btn"]{
        min-height:42px!important;
        padding:0 15px!important;
        border-radius:14px!important;
        font-size:13px!important;
        line-height:1!important;
        font-weight:500!important;
        letter-spacing:0!important;
      }

      @media(max-width:390px){
        #client-main .dch-name,#client-main .dch-welcome .dch-name{font-size:23px!important}
        #client-main .dch-stat{grid-template-columns:42px minmax(0,1fr)!important;gap:12px!important;padding:16px!important}
        #client-main .dch-stat [class*="value"],#client-main .dch-stat strong,#client-main .dch-stat b{font-size:25px!important}
        #client-main .dch-task-empty,#client-main .dch-progress,#client-main .dch-next{grid-template-columns:46px minmax(0,1fr)!important;column-gap:16px!important}
        #client-main .dch-task-empty{padding:12px 14px!important}
        #client-main .dch-task-empty .dch-iconbox{width:42px!important;height:42px!important}
        #client-main .dch-task-empty > span:last-child{font-size:15.5px!important}
        #client-main .dch-progress,#client-main .dch-next{padding:18px 14px!important}
        #client-main .dch-progress h1,#client-main .dch-progress h2,#client-main .dch-progress h3,#client-main .dch-progress [class*="title"],#client-main .dch-next h1,#client-main .dch-next h2,#client-main .dch-next h3,#client-main .dch-next [class*="title"]{font-size:17px!important}
      }
    `;
    document.head.appendChild(style);
  }

  function refineContent(){
    const root=document.querySelector('#client-main .dch-wrap');
    if(!root)return;

    root.querySelectorAll('.dch-next *').forEach(el=>{
      if(el.children.length===0 && /\bPecho\b/i.test(el.textContent||'')){
        el.textContent=(el.textContent||'').replace(/\bPecho\b/gi,'Pectoral');
      }
    });

    root.querySelectorAll('.dch-stat,.dch-progress').forEach(el=>{
      el.removeAttribute('onclick');
      el.style.cursor='default';
    });
  }

  function apply(){
    installStyles();
    refineContent();
  }

  apply();
  document.addEventListener('DOMContentLoaded',apply);

  const main=document.getElementById('client-main');
  if(main&&!window.__dccClientHomePremiumApprovedObserver){
    let frame=0;
    const observer=new MutationObserver(()=>{
      cancelAnimationFrame(frame);
      frame=requestAnimationFrame(refineContent);
    });
    observer.observe(main,{childList:true,subtree:true});
    window.__dccClientHomePremiumApprovedObserver=observer;
  }
})();