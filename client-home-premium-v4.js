/* DCC — Inicio cliente premium: diseño aprobado compacto */
(function(){
  'use strict';
  if(window.__dccClientHomePremiumApprovedV2)return;
  window.__dccClientHomePremiumApprovedV2=true;

  const STYLE_ID='dcc-client-home-premium-approved-v2-css';

  function installStyles(){
    if(document.getElementById(STYLE_ID))return;
    ['dcc-client-home-premium-v4-css','dcc-client-home-premium-approved-v1-css'].forEach(id=>document.getElementById(id)?.remove());

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
        --dcc-muted:#969da7;
        position:relative!important;
        isolation:isolate!important;
      }

      #client-main .dch-welcome{
        position:relative!important;
        min-height:64px!important;
        margin:0 0 10px!important;
        padding:3px 2px 8px!important;
        overflow:visible!important;
      }
      #client-main .dch-welcome::before{
        content:'';position:absolute;left:2px;bottom:0;width:24px;height:1.5px;border-radius:99px;
        background:linear-gradient(90deg,#f2c65f,#d6a744);
      }
      #client-main .dch-welcome::after{
        content:'DISCIPLINA\\A HOY, RESULTADOS\\A SIEMPRE';white-space:pre;position:absolute;right:2px;top:7px;width:104px;
        color:#858b95;font-size:6px;line-height:1.72;font-weight:500;letter-spacing:1.9px;text-align:left;opacity:.76;
      }
      #client-main .dch-eyebrow{
        margin:0 0 7px!important;color:var(--dcc-gold)!important;font-size:10.5px!important;line-height:1.1!important;
        font-weight:650!important;letter-spacing:3px!important;text-transform:uppercase!important;
      }
      #client-main .dch-name,#client-main .dch-welcome .dch-name{
        margin:0!important;max-width:68%!important;color:var(--dcc-text)!important;font-size:22px!important;line-height:1.12!important;
        font-weight:400!important;letter-spacing:-.15px!important;text-shadow:none!important;
      }

      /* Estadísticas: compactas y con etiquetas siempre legibles. */
      #client-main .dch-stat{
        grid-template-columns:40px minmax(0,1fr)!important;gap:12px!important;min-height:88px!important;height:88px!important;
        padding:14px 13px!important;align-items:center!important;cursor:default!important;overflow:hidden!important;
      }
      #client-main .dch-stat .dch-chevron{display:none!important}
      #client-main .dch-stat .dch-iconbox{width:38px!important;height:38px!important}
      #client-main .dch-stat [class*="label"]{
        display:block!important;max-width:100%!important;color:#a9afb8!important;font-size:8.2px!important;line-height:1.15!important;
        font-weight:600!important;letter-spacing:1.55px!important;text-transform:uppercase!important;white-space:nowrap!important;
      }
      #client-main .dch-stat [class*="value"],#client-main .dch-stat strong,#client-main .dch-stat b{
        color:var(--dcc-text)!important;font-size:25px!important;line-height:1!important;font-weight:500!important;letter-spacing:-.45px!important;
      }

      /* Encabezados dorados: una única jerarquía. */
      #client-main .dch-task-head,
      #client-main .dch-progress [class*="label"],#client-main .dch-progress [class*="eyebrow"],
      #client-main .dch-next [class*="label"],#client-main .dch-next [class*="eyebrow"],#client-main .dch-next [class*="kicker"]{
        color:var(--dcc-gold)!important;font-size:9.5px!important;line-height:1.16!important;font-weight:650!important;
        letter-spacing:2.45px!important;text-transform:uppercase!important;
      }

      /* Tareas pendientes: misma proporción compacta del diseño aprobado. */
      #client-main .dch-task-card{padding:0!important;overflow:hidden!important}
      #client-main .dch-task-head{min-height:36px!important;height:36px!important;padding:0 14px!important}
      #client-main .dch-task-empty{
        min-height:64px!important;height:64px!important;display:grid!important;grid-template-columns:40px minmax(0,1fr)!important;
        gap:18px!important;padding:9px 14px!important;align-items:center!important;
      }
      #client-main .dch-task-empty .dch-iconbox{width:38px!important;height:38px!important;justify-self:start!important}
      #client-main .dch-task-empty > span:last-child{
        margin:0!important;max-width:none!important;color:var(--dcc-text)!important;font-size:15px!important;line-height:1.18!important;
        font-weight:450!important;letter-spacing:-.05px!important;
      }
      #client-main .dch-task-empty > span:last-child::after{
        content:'No hay tareas pendientes por ahora.'!important;display:block!important;margin-top:4px!important;color:var(--dcc-muted)!important;
        font-size:9.7px!important;line-height:1.3!important;font-weight:400!important;letter-spacing:0!important;
      }

      /* Progreso: alineación y altura idénticas a la propuesta. */
      #client-main .dch-progress{
        grid-template-columns:40px minmax(0,1fr)!important;column-gap:18px!important;min-height:92px!important;
        padding:14px!important;align-items:center!important;cursor:default!important;
      }
      #client-main .dch-progress .dch-chevron{display:none!important}
      #client-main .dch-progress .dch-iconbox{width:38px!important;height:38px!important}
      #client-main .dch-progress h1,#client-main .dch-progress h2,#client-main .dch-progress h3,#client-main .dch-progress [class*="title"]{
        margin-top:5px!important;color:var(--dcc-text)!important;font-size:16px!important;line-height:1.18!important;font-weight:450!important;letter-spacing:-.12px!important;
      }
      #client-main .dch-progress p,#client-main .dch-progress [class*="sub"]{
        margin-top:6px!important;color:var(--dcc-muted)!important;font-size:9.8px!important;line-height:1.34!important;font-weight:400!important;letter-spacing:0!important;
      }

      /* Próximo entrenamiento: texto completo, sin puntos suspensivos. */
      #client-main .dch-next{
        grid-template-columns:40px minmax(0,1fr)!important;column-gap:18px!important;min-height:104px!important;
        padding:15px 14px!important;align-items:center!important;
      }
      #client-main .dch-next .dch-iconbox{width:38px!important;height:38px!important}
      #client-main .dch-next h1,#client-main .dch-next h2,#client-main .dch-next h3,#client-main .dch-next [class*="title"]{
        margin-top:5px!important;color:var(--dcc-text)!important;font-size:16px!important;line-height:1.18!important;font-weight:450!important;
        letter-spacing:-.12px!important;white-space:nowrap!important;overflow:visible!important;text-overflow:clip!important;max-width:none!important;
      }
      #client-main .dch-next p,#client-main .dch-next [class*="sub"]{
        margin-top:6px!important;color:var(--dcc-muted)!important;font-size:10px!important;line-height:1.3!important;font-weight:400!important;
      }
      #client-main .dch-next button,#client-main .dch-next [class*="button"],#client-main .dch-next [class*="btn"]{
        min-height:40px!important;height:40px!important;padding:0 14px!important;border-radius:13px!important;font-size:12px!important;
        line-height:1!important;font-weight:500!important;letter-spacing:0!important;
      }

      @media(max-width:390px){
        #client-main .dch-name,#client-main .dch-welcome .dch-name{font-size:21px!important}
        #client-main .dch-welcome::after{right:0;width:96px;font-size:5.6px;letter-spacing:1.7px}
        #client-main .dch-stat{grid-template-columns:38px minmax(0,1fr)!important;gap:10px!important;height:84px!important;min-height:84px!important;padding:12px 11px!important}
        #client-main .dch-stat [class*="label"]{font-size:7.5px!important;letter-spacing:1.25px!important}
        #client-main .dch-stat [class*="value"],#client-main .dch-stat strong,#client-main .dch-stat b{font-size:23px!important}
        #client-main .dch-task-head{height:34px!important;min-height:34px!important;padding:0 12px!important}
        #client-main .dch-task-empty{height:60px!important;min-height:60px!important;grid-template-columns:38px minmax(0,1fr)!important;gap:16px!important;padding:8px 12px!important}
        #client-main .dch-task-empty .dch-iconbox{width:36px!important;height:36px!important}
        #client-main .dch-task-empty > span:last-child{font-size:14.5px!important}
        #client-main .dch-task-empty > span:last-child::after{font-size:9.2px!important}
        #client-main .dch-progress,#client-main .dch-next{grid-template-columns:38px minmax(0,1fr)!important;column-gap:16px!important;padding-left:12px!important;padding-right:12px!important}
        #client-main .dch-progress{min-height:88px!important}
        #client-main .dch-next{min-height:100px!important}
        #client-main .dch-progress h1,#client-main .dch-progress h2,#client-main .dch-progress h3,#client-main .dch-progress [class*="title"],#client-main .dch-next h1,#client-main .dch-next h2,#client-main .dch-next h3,#client-main .dch-next [class*="title"]{font-size:15.5px!important}
      }
    `;
    document.head.appendChild(style);
  }

  function refineContent(){
    const root=document.querySelector('#client-main .dch-wrap');
    if(!root)return;

    root.querySelectorAll('.dch-next *').forEach(el=>{
      if(el.children.length===0&&/\bPecho\b/i.test(el.textContent||'')){
        el.textContent=(el.textContent||'').replace(/\bPecho\b/gi,'Pectoral');
      }
    });

    root.querySelectorAll('.dch-stat,.dch-progress').forEach(el=>{
      el.removeAttribute('onclick');
      el.style.cursor='default';
    });
  }

  function apply(){installStyles();refineContent();}
  apply();
  document.addEventListener('DOMContentLoaded',apply);

  const main=document.getElementById('client-main');
  if(main&&!window.__dccClientHomePremiumApprovedObserverV2){
    let frame=0;
    const observer=new MutationObserver(()=>{
      cancelAnimationFrame(frame);
      frame=requestAnimationFrame(refineContent);
    });
    observer.observe(main,{childList:true,subtree:true});
    window.__dccClientHomePremiumApprovedObserverV2=observer;
  }
})();