/* DCC — Inicio cliente Light Premium: restauración visual basada en diseño aprobado
   Recupera la composición clara anterior y conserva la barra inferior Light.
   No modifica autenticación, datos ni lógica funcional. */
(function(){
  'use strict';
  const BUILD='20260920-client-home-compact-final-v2';
  if(window.__dccClientHomeOldLight===BUILD)return;
  window.__dccClientHomeOldLight=BUILD;

  const ID='dcc-client-home-compact-final-v2';

  function install(){
    document.getElementById(ID)?.remove();
    const s=document.createElement('style');
    s.id=ID;
    s.textContent=`
      /* Oculta el saludo dinámico únicamente en Inicio cliente:
         el diseño aprobado comienza directamente en BIENVENIDO. */
      html.dcc-theme-light-premium body #client #client-main > .dcc-time-greeting{
        display:none!important;
      }

      html.dcc-theme-light-premium body #client #client-main .dch-wrap{
        width:100%!important;
        max-width:820px!important;
        margin:0 auto!important;
        padding:0 0 18px!important;
        color:#17191d!important;
      }

      /* ===== Cabecera como la versión anterior ===== */
      html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-welcome{
        position:relative!important;
        min-height:68px!important;
        margin:0 0 10px!important;
        padding:5px 2px 10px!important;
        overflow:visible!important;
      }
      html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-welcome::before{
        content:''!important;
        display:block!important;
        position:absolute!important;
        left:2px!important;
        bottom:0!important;
        width:40px!important;
        height:2px!important;
        border-radius:999px!important;
        background:linear-gradient(90deg,#d3a64a,#f0c96b)!important;
      }
      html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-welcome::after{
        content:'DISCIPLINA\\A HOY, RESULTADOS\\A SIEMPRE'!important;
        display:block!important;
        white-space:pre!important;
        position:absolute!important;
        right:4px!important;
        top:10px!important;
        width:132px!important;
        color:#777d86!important;
        font-size:7px!important;
        line-height:1.55!important;
        font-weight:500!important;
        letter-spacing:2.1px!important;
        text-align:left!important;
        opacity:.90!important;
      }
      html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-eyebrow{
        margin:0 0 7px!important;
        color:#b77b13!important;
        font-size:10.5px!important;
        line-height:1.1!important;
        font-weight:750!important;
        letter-spacing:3px!important;
        text-transform:uppercase!important;
      }
      html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-name{
        margin:0!important;
        max-width:68%!important;
        color:#17191d!important;
        font-size:27px!important;
        line-height:1.08!important;
        font-weight:400!important;
        letter-spacing:-.45px!important;
        white-space:normal!important;
        text-shadow:none!important;
      }

      /* ===== Métricas claras ===== */
      html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-stats{
        display:grid!important;
        grid-template-columns:repeat(2,minmax(0,1fr))!important;
        gap:10px!important;
        margin:0 0 14px!important;
        background:none!important;
        border:0!important;
        box-shadow:none!important;
      }
      html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-stat{
        min-height:78px!important;
        height:78px!important;
        display:grid!important;
        grid-template-columns:38px minmax(0,1fr)!important;
        align-items:center!important;
        gap:9px!important;
        padding:9px 11px!important;
        border:1px solid rgba(183,123,19,.25)!important;
        border-radius:18px!important;
        background:
          radial-gradient(circle at 100% 0,rgba(214,163,61,.07),transparent 38%),
          linear-gradient(145deg,#fffefa 0%,#fbf5eb 100%)!important;
        color:#17191d!important;
        box-shadow:0 10px 25px rgba(78,58,28,.07),inset 0 1px 0 rgba(255,255,255,.96)!important;
        overflow:hidden!important;
      }
      html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-stat .dch-chevron{
        display:none!important;
      }
      html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-stat .dch-iconbox{
        width:38px!important;
        height:38px!important;
        border:1px solid rgba(183,123,19,.28)!important;
        border-radius:11px!important;
        background:linear-gradient(145deg,#fff9eb,#f7ecd6)!important;
        color:#9d701f!important;
        box-shadow:none!important;
      }
      html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-stat-label,
      html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-stat-value,
      html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-stat-value span{
        background:transparent!important;
        background-color:transparent!important;
        background-image:none!important;
        border:0!important;
        box-shadow:none!important;
      }
      html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-stat-label{
        margin:0 0 4px!important;
        color:#5f6874!important;
        font-size:7.5px!important;
        line-height:1.05!important;
        font-weight:700!important;
        letter-spacing:1.35px!important;
        text-transform:uppercase!important;
        white-space:nowrap!important;
      }
      html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-stat-value{
        color:#17191d!important;
        font-size:23px!important;
        line-height:1!important;
        font-weight:450!important;
        letter-spacing:-.5px!important;
        white-space:nowrap!important;
      }
      html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-stat-value span{
        color:#7c838d!important;
        font-size:10.5px!important;
        font-weight:450!important;
        letter-spacing:0!important;
      }
      html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-percent{
        color:#d8a63b!important;
        font-size:19px!important;
        font-weight:500!important;
      }

      /* ===== Tarjetas generales ===== */
      html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-card{
        margin:0 0 14px!important;
        border:1px solid rgba(183,123,19,.25)!important;
        border-radius:22px!important;
        background:linear-gradient(145deg,#fffefa 0%,#fbf5eb 100%)!important;
        color:#17191d!important;
        box-shadow:0 10px 25px rgba(78,58,28,.07),inset 0 1px 0 rgba(255,255,255,.96)!important;
      }

      /* ===== Tareas ===== */
      html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-task-card{
        padding:0!important;
        overflow:hidden!important;
      }
      html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-task-head{
        min-height:44px!important;
        height:44px!important;
        padding:0 15px!important;
        border-bottom:1px solid rgba(183,123,19,.14)!important;
        color:#b77b13!important;
        font-size:9.5px!important;
        font-weight:750!important;
        letter-spacing:2.5px!important;
      }
      html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-task-count{
        min-width:28px!important;
        height:28px!important;
        border-color:rgba(183,123,19,.26)!important;
        background:#fff6df!important;
        color:#9d701f!important;
      }
      html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-task-row{
        min-height:70px!important;
        grid-template-columns:44px minmax(0,1fr) 18px!important;
        gap:14px!important;
        padding:11px 15px!important;
        border-top:1px solid rgba(183,123,19,.12)!important;
        background:transparent!important;
        color:#17191d!important;
      }
      html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-task-row .dch-iconbox{
        width:44px!important;
        height:44px!important;
        border-color:rgba(183,123,19,.25)!important;
        background:#fffaf0!important;
        color:#17191d!important;
      }
      html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-task-title{
        color:#17191d!important;
        font-size:16px!important;
        font-weight:500!important;
        line-height:1.18!important;
        text-shadow:none!important;
      }
      html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-task-meta{
        margin-top:4px!important;
        color:#777d86!important;
        font-size:10.5px!important;
        line-height:1.3!important;
      }
      html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-arrow{
        color:#c99632!important;
      }
      html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-task-empty{
        min-height:78px!important;
        display:grid!important;
        grid-template-columns:44px minmax(0,1fr)!important;
        gap:16px!important;
        padding:12px 15px!important;
        align-items:center!important;
        color:#17191d!important;
      }
      html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-task-empty .dch-iconbox{
        width:44px!important;
        height:44px!important;
        background:#fff6df!important;
        border-color:rgba(183,123,19,.28)!important;
        color:#9d701f!important;
      }
      html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-task-empty > span:last-child{
        color:#17191d!important;
        font-size:16px!important;
        font-weight:450!important;
      }
      html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-task-empty > span:last-child::after{
        color:#777d86!important;
        font-size:10.5px!important;
      }

      /* ===== Progreso ===== */
      html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-progress{
        min-height:108px!important;
        grid-template-columns:44px minmax(0,1fr)!important;
        gap:16px!important;
        padding:16px 15px!important;
        align-items:center!important;
      }
      html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-progress .dch-chevron{
        display:none!important;
      }
      html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-progress .dch-iconbox{
        width:44px!important;
        height:44px!important;
        background:#fff6df!important;
        border-color:rgba(183,123,19,.28)!important;
        color:#9d701f!important;
      }
      html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-progress-label{
        color:#b77b13!important;
        font-size:9.5px!important;
        font-weight:750!important;
        letter-spacing:2.5px!important;
      }
      html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-progress-title{
        margin-top:5px!important;
        color:#17191d!important;
        font-size:17px!important;
        line-height:1.18!important;
        font-weight:450!important;
        letter-spacing:-.18px!important;
        text-shadow:none!important;
      }
      html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-progress-sub{
        margin-top:7px!important;
        color:#777d86!important;
        font-size:10.5px!important;
        line-height:1.38!important;
      }

      /* ===== Próximo entrenamiento: compacto, disco solo aquí ===== */
      html.dcc-theme-light-premium body #client #client-main .dch-wrap section.dch-next{
        position:relative!important;
        min-height:106px!important;
        padding:12px 13px!important;
        overflow:hidden!important;
        background-image:
          linear-gradient(90deg,
            rgba(255,253,248,1) 0%,
            rgba(255,253,248,.99) 32%,
            rgba(255,253,248,.90) 47%,
            rgba(255,253,248,.62) 58%,
            rgba(255,253,248,.22) 72%,
            rgba(255,253,248,.03) 100%),
          url('./assets/next-workout-plate.jpg')!important;
        background-color:#fffdf8!important;
        background-size:cover!important;
        background-position:center right!important;
        background-repeat:no-repeat!important;
        border-color:rgba(183,123,19,.34)!important;
        box-shadow:0 10px 25px rgba(78,58,28,.08),inset 0 1px 0 rgba(255,255,255,.95)!important;
      }
      html.dcc-theme-light-premium body #client #client-main .dch-wrap section.dch-next::after{
        content:''!important;
        position:absolute!important;
        inset:0!important;
        z-index:1!important;
        pointer-events:none!important;
        background:
          radial-gradient(circle at 76% 50%,rgba(245,215,154,.11),transparent 32%),
          linear-gradient(180deg,rgba(255,255,255,.03),rgba(75,58,33,.05))!important;
      }
      html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-next-content{
        position:relative!important;
        z-index:2!important;
        min-height:80px!important;
        display:grid!important;
        grid-template-columns:38px minmax(0,1fr)!important;
        gap:12px!important;
        align-items:center!important;
        padding-right:128px!important;
      }
      html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-next .dch-iconbox{
        width:38px!important;
        height:38px!important;
        background:rgba(255,250,240,.92)!important;
        border-color:rgba(183,123,19,.30)!important;
        color:#9d701f!important;
        box-shadow:none!important;
      }
      html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-next-label{
        margin:0 0 6px!important;
        color:#b77b13!important;
        font-size:8.1px!important;
        line-height:1.05!important;
        font-weight:750!important;
        letter-spacing:1.75px!important;
        white-space:nowrap!important;
      }
      html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-next-name{
        margin:0!important;
        max-width:100%!important;
        color:#17191d!important;
        font-size:15.8px!important;
        line-height:1.15!important;
        font-weight:450!important;
        letter-spacing:-.15px!important;
        white-space:nowrap!important;
        overflow:hidden!important;
        text-overflow:ellipsis!important;
        text-shadow:none!important;
      }
      html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-next-day{
        margin-top:5px!important;
        color:#777d86!important;
        font-size:10px!important;
      }
      html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-routine-btn{
        position:absolute!important;
        right:12px!important;
        bottom:12px!important;
        z-index:3!important;
        min-width:108px!important;
        min-height:40px!important;
        padding:8px 13px!important;
        border:1px solid #d4a23d!important;
        border-radius:14px!important;
        background:linear-gradient(135deg,#f4d36f,#dfa93d)!important;
        color:#17130a!important;
        font-size:11.5px!important;
        font-weight:650!important;
        box-shadow:0 7px 18px rgba(177,119,18,.18)!important;
      }

      /* ===== Lema inferior ===== */
      html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-slogan{
        display:flex!important;
        align-items:center!important;
        justify-content:center!important;
        gap:14px!important;
        min-height:42px!important;
        margin:0 0 8px!important;
        color:#b77b13!important;
        font-size:8px!important;
        font-weight:750!important;
        line-height:1.45!important;
        letter-spacing:2.5px!important;
        text-align:center!important;
        text-transform:uppercase!important;
      }
      html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-slogan::before,
      html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-slogan::after{
        content:''!important;
        width:42px!important;
        height:1px!important;
        background:linear-gradient(90deg,transparent,#c99632)!important;
      }
      html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-slogan::after{
        background:linear-gradient(90deg,#c99632,transparent)!important;
      }

      /* ===== Barra inferior: sigue LIGHT, compacta pero sin solapar textos ===== */
      @media(max-width:700px){
        html.dcc-theme-light-premium body #client-nav{
          display:grid!important;
          grid-template-columns:repeat(6,minmax(0,52px))!important;
          justify-content:center!important;
          align-items:stretch!important;
          gap:0!important;
          padding:4px 6px!important;
        }
        html.dcc-theme-light-premium body #client-nav button{
          width:52px!important;
          min-width:0!important;
          height:60px!important;
          padding:4px 1px!important;
          gap:3px!important;
          border-radius:15px!important;
        }
        html.dcc-theme-light-premium body #client-nav button svg{
          width:20px!important;
          height:20px!important;
          flex:0 0 20px!important;
        }
        html.dcc-theme-light-premium body #client-nav button span{
          width:100%!important;
          margin:0!important;
          padding:0!important;
          font-size:7.2px!important;
          line-height:1!important;
          font-weight:650!important;
          letter-spacing:-.10px!important;
          text-align:center!important;
          white-space:nowrap!important;
        }
        html.dcc-theme-light-premium body #client-nav button.active{
          background:linear-gradient(145deg,#ffe994 0%,#f6cf61 48%,#e2a72f 100%)!important;
          border:1px solid #d9a43a!important;
          color:#17140d!important;
          box-shadow:0 5px 14px rgba(185,126,18,.16),inset 0 1px 0 rgba(255,255,255,.9)!important;
        }
        html.dcc-theme-light-premium body #client-nav button.active svg,
        html.dcc-theme-light-premium body #client-nav button.active span{
          color:#17140d!important;
          stroke:currentColor!important;
        }
      }

      @media(max-width:390px){
        html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-welcome{
          min-height:64px!important;
        }
        html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-welcome::after{
          right:0!important;
          width:116px!important;
          font-size:6.4px!important;
          letter-spacing:1.8px!important;
        }
        html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-name{
          font-size:25px!important;
        }
        html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-stat{
          min-height:74px!important;
          height:74px!important;
          grid-template-columns:36px minmax(0,1fr)!important;
          gap:8px!important;
          padding:8px 9px!important;
        }
        html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-stat .dch-iconbox{
          width:36px!important;
          height:36px!important;
        }
        html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-stat-label{
          font-size:6.9px!important;
          letter-spacing:1.05px!important;
        }
        html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-stat-value{
          font-size:22px!important;
        }
        html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-next-content{
          padding-right:116px!important;
          gap:10px!important;
        }
        html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-next-name{
          font-size:14.5px!important;
        }
        html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-routine-btn{
          min-width:100px!important;
          min-height:38px!important;
          right:10px!important;
          bottom:10px!important;
          padding:7px 11px!important;
          font-size:10.8px!important;
        }
        html.dcc-theme-light-premium body #client-nav{
          grid-template-columns:repeat(6,minmax(0,50px))!important;
        }
        html.dcc-theme-light-premium body #client-nav button{
          width:50px!important;
        }
        html.dcc-theme-light-premium body #client-nav button span{
          font-size:6.9px!important;
        }
      }
    `;
    (document.head||document.documentElement).appendChild(s);
  }

  function refineHome(){
    const root=document.querySelector('#client-main .dch-wrap');
    if(!root)return;
    const nextName=root.querySelector('.dch-next-name');
    if(nextName){
      const text=(nextName.textContent||'').trim();
      if(!text || /^sin\s+grupo/i.test(text)){
        nextName.textContent='Rutina disponible';
      }
    }
  }

  function refineNav(){
    const nav=document.getElementById('client-nav');
    if(!nav)return;
    nav.querySelectorAll('button').forEach(btn=>{
      ['background','background-image','border','color','box-shadow'].forEach(prop=>btn.style.removeProperty(prop));
      if(btn.classList.contains('active')){
        btn.style.setProperty('background','linear-gradient(145deg,#ffe994 0%,#f6cf61 48%,#e2a72f 100%)','important');
        btn.style.setProperty('background-image','linear-gradient(145deg,#ffe994 0%,#f6cf61 48%,#e2a72f 100%)','important');
        btn.style.setProperty('border','1px solid #d9a43a','important');
        btn.style.setProperty('color','#17140d','important');
        btn.style.setProperty('box-shadow','0 5px 14px rgba(185,126,18,.16), inset 0 1px 0 rgba(255,255,255,.9)','important');
      }
    });
  }

  function ensureHomePaint(){
    const app=document.getElementById('client');
    const main=document.getElementById('client-main');
    if(!app||!main)return;
    let visible=false;
    try{visible=getComputedStyle(app).display!=='none'}catch(_){visible=app.style.display!=='none'}
    if(!visible)return;
    const screen=String(window.currentScreen||'').toLowerCase();
    if(screen && screen!=='home')return;
    if(!window.currentClientId)return;
    if(main.querySelector('.dch-wrap'))return;
    try{
      if(typeof window.showClient==='function'){
        window.currentScreen='home';
        try{currentScreen='home'}catch(_){}
        window.showClient('home');
      }
    }catch(error){
      console.warn('DCC client home repaint',error);
    }
  }

  function boot(){
    install();
    refineHome();
    refineNav();

    const main=document.getElementById('client-main');
    if(main&&!window.__dccClientHomeOldLightObserver){
      let raf=0;
      const observer=new MutationObserver(()=>{
        cancelAnimationFrame(raf);
        raf=requestAnimationFrame(()=>{
          refineHome();
          refineNav();
        });
      });
      observer.observe(main,{childList:true,subtree:true,characterData:true});
      window.__dccClientHomeOldLightObserver=observer;
    }

    const nav=document.getElementById('client-nav');
    if(nav&&!window.__dccClientNavActiveObserver){
      const navObserver=new MutationObserver(refineNav);
      navObserver.observe(nav,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
      window.__dccClientNavActiveObserver=navObserver;
    }

    [0,120,300,650,1200,2200,3500].forEach(ms=>setTimeout(()=>{
      refineNav();
      ensureHomePaint();
    },ms));

    window.addEventListener('pageshow',()=>{
      refineNav();
      setTimeout(ensureHomePaint,80);
      setTimeout(ensureHomePaint,450);
    });
    document.addEventListener('click',()=>requestAnimationFrame(refineNav),true);
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',boot,{once:true});
  }else{
    boot();
  }
})();
