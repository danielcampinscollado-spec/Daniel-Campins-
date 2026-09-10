/* DCC — Inicio cliente premium v4: approved luxury home */
(function(){
  'use strict';

  const STYLE_ID='dcc-client-home-premium-v4-css';
  const old=document.getElementById(STYLE_ID);
  if(old) old.remove();

  const style=document.createElement('style');
  style.id=STYLE_ID;
  style.textContent=`
    html body #client-main .dch-wrap{
      position:relative!important;
      isolation:isolate!important;
    }

    /* Curvas de luz del encabezado */
    html body #client-main .dch-wrap::before{
      content:'';
      position:absolute;
      z-index:0;
      pointer-events:none;
      top:-42px;
      right:-10px;
      width:360px;
      height:174px;
      background-image:url("data:image/svg+xml,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%20480%20200'%3E%3Cdefs%3E%3ClinearGradient%20id%3D'g'%20x1%3D'0'%20y1%3D'1'%20x2%3D'1'%20y2%3D'0'%3E%3Cstop%20offset%3D'0'%20stop-color%3D'%23d9aa4a'%20stop-opacity%3D'0'%2F%3E%3Cstop%20offset%3D'.44'%20stop-color%3D'%23d9aa4a'%20stop-opacity%3D'.05'%2F%3E%3Cstop%20offset%3D'.77'%20stop-color%3D'%23efbd54'%20stop-opacity%3D'.46'%2F%3E%3Cstop%20offset%3D'1'%20stop-color%3D'%23ffe09a'%20stop-opacity%3D'.94'%2F%3E%3C%2FlinearGradient%3E%3C%2Fdefs%3E%3Cg%20fill%3D'none'%20stroke%3D'url(%23g)'%20stroke-linecap%3D'round'%3E%3Cpath%20d%3D'M28%20192%20C126%20184%20198%20166%20262%20134%20C327%20102%20353%2069%20488%2011'%20stroke-width%3D'1.45'%2F%3E%3Cpath%20d%3D'M22%20184%20C124%20177%20196%20158%20259%20127%20C324%2095%20357%2062%20490%205'%20stroke-width%3D'.62'%20opacity%3D'.55'%2F%3E%3Cpath%20d%3D'M16%20176%20C119%20170%20193%20152%20256%20121%20C322%2089%20360%2055%20493%20-2'%20stroke-width%3D'.48'%20opacity%3D'.30'%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E");
      background-repeat:no-repeat;
      background-position:right top;
      background-size:100% 100%;
      opacity:.92;
      filter:drop-shadow(0 0 8px rgba(240,201,107,.15));
      mix-blend-mode:screen;
    }
    html body #client-main .dch-wrap::after{
      content:'';
      position:absolute;
      z-index:0;
      pointer-events:none;
      top:0;
      right:-18px;
      width:235px;
      height:118px;
      background:radial-gradient(circle at 77% 18%,rgba(255,231,165,.38) 0 1px,rgba(240,201,107,.13) 3px,transparent 15px),radial-gradient(ellipse at 80% 19%,rgba(240,201,107,.075),transparent 60%);
      opacity:.86;
    }
    html body #client-main .dch-wrap>*{position:relative!important;z-index:1}

    /* Encabezado */
    html body #client-main .dch-welcome{
      position:relative!important;
      min-height:63px!important;
      margin:0 0 15px!important;
      padding:4px 2px 9px!important;
      overflow:visible!important;
      background:transparent!important;
    }
    html body #client-main .dch-eyebrow{
      margin:0 0 8px!important;
      color:#efbd54!important;
      font-size:11px!important;
      line-height:1.2!important;
      font-weight:850!important;
      letter-spacing:3.5px!important;
      text-transform:uppercase!important;
    }
    html body #client-main .dch-name,
    html body #client-main .dch-welcome .dch-name{
      margin:0!important;
      max-width:66%!important;
      color:#d9d8d5!important;
      font-family:"Avenir Next","Helvetica Neue",-apple-system,BlinkMacSystemFont,Arial,sans-serif!important;
      font-size:21px!important;
      line-height:1.1!important;
      font-weight:300!important;
      letter-spacing:.05px!important;
      white-space:normal!important;
      text-shadow:none!important;
      -webkit-font-smoothing:antialiased!important;
      font-synthesis:none!important;
    }
    html body #client-main .dch-welcome::before{
      content:'';
      position:absolute;
      left:2px;
      bottom:0;
      width:30px;
      height:1.5px;
      border-radius:999px;
      background:linear-gradient(90deg,#f4ca68,#d6a343);
      box-shadow:0 0 8px rgba(240,201,107,.15);
    }
    html body #client-main .dch-welcome::after{
      content:'DISCIPLINA\\A HOY, RESULTADOS\\A SIEMPRE';
      white-space:pre;
      position:absolute;
      right:4px;
      top:10px;
      width:108px;
      color:#777d86;
      font-size:6px;
      line-height:1.78;
      font-weight:520;
      letter-spacing:2.15px;
      text-align:left;
      opacity:.78;
      pointer-events:none;
    }

    /* Métricas */
    html body #client-main .dch-stats{gap:11px!important;margin-bottom:14px!important}
    html body #client-main .dch-stat{
      position:relative!important;
      min-height:112px!important;
      padding:17px 15px!important;
      grid-template-columns:46px minmax(0,1fr)!important;
      gap:12px!important;
      border:1px solid rgba(221,171,70,.62)!important;
      border-radius:21px!important;
      background:radial-gradient(circle at 100% 0,rgba(232,184,82,.10),transparent 38%),linear-gradient(145deg,#151a20 0%,#0c1116 60%,#080c10 100%)!important;
      box-shadow:0 13px 30px rgba(0,0,0,.25),inset 0 1px 0 rgba(255,255,255,.035),0 0 18px rgba(217,170,74,.025)!important;
      cursor:default!important;
      overflow:hidden!important;
    }
    html body #client-main .dch-stat::after{
      content:'';
      position:absolute;
      pointer-events:none;
      right:-42px;
      top:-52px;
      width:145px;
      height:125px;
      border-radius:50%;
      background:radial-gradient(circle,rgba(240,201,107,.055),transparent 68%);
    }
    html body #client-main .dch-stat .dch-iconbox{
      width:46px!important;
      height:46px!important;
      border:1px solid rgba(232,178,68,.48)!important;
      border-radius:14px!important;
      background:radial-gradient(circle at 50% 8%,rgba(255,222,135,.13),transparent 62%),linear-gradient(145deg,rgba(217,170,74,.11),rgba(10,13,17,.92))!important;
      color:#f1c55d!important;
      box-shadow:inset 0 1px 0 rgba(255,255,255,.025),0 0 12px rgba(217,170,74,.045)!important;
    }
    html body #client-main .dch-stat .dch-iconbox svg{width:21px!important;height:21px!important;stroke-width:1.65!important}
    html body #client-main .dch-stat .dch-chevron{display:none!important}
    html body #client-main .dch-stat span,
    html body #client-main .dch-stat small{
      color:#a3abb5!important;
      letter-spacing:1.7px!important;
    }
    html body #client-main .dch-stat strong,
    html body #client-main .dch-stat b{
      color:#f8f6f1!important;
      letter-spacing:-.4px!important;
    }

    /* Tareas */
    html body #client-main .dch-task-card{
      position:relative!important;
      min-height:0!important;
      padding:0!important;
      overflow:hidden!important;
      border:1px solid rgba(236,185,78,.82)!important;
      border-radius:21px!important;
      background:radial-gradient(circle at 82% 69%,rgba(255,224,142,.25) 0 1px,rgba(240,201,107,.075) 4px,transparent 18px),linear-gradient(145deg,#151a20 0%,#0d1116 62%,#080b0e 100%)!important;
      box-shadow:0 14px 31px rgba(0,0,0,.28),inset 0 1px 0 rgba(255,255,255,.035),0 0 18px rgba(217,170,74,.04)!important;
      transform:translateZ(0);
    }
    html body #client-main .dch-task-card::before{
      content:'';
      position:absolute;
      pointer-events:none;
      z-index:0;
      left:-35px;
      top:-40px;
      width:145px;
      height:105px;
      border-radius:50%;
      background:radial-gradient(ellipse,rgba(248,210,119,.12) 0%,rgba(217,170,74,.03) 44%,transparent 73%);
      filter:blur(8px);
    }
    html body #client-main .dch-task-card::after{
      content:'';
      position:absolute;
      pointer-events:none;
      z-index:1;
      right:-4px;
      bottom:-2px;
      width:58%;
      height:70%;
      background-image:url("data:image/svg+xml,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%20460%20155'%3E%3Cdefs%3E%3ClinearGradient%20id%3D'g'%20x1%3D'0'%20y1%3D'1'%20x2%3D'1'%20y2%3D'0'%3E%3Cstop%20offset%3D'0'%20stop-color%3D'%23d9aa4a'%20stop-opacity%3D'0'%2F%3E%3Cstop%20offset%3D'.46'%20stop-color%3D'%23d9aa4a'%20stop-opacity%3D'.07'%2F%3E%3Cstop%20offset%3D'.76'%20stop-color%3D'%23efbd54'%20stop-opacity%3D'.42'%2F%3E%3Cstop%20offset%3D'1'%20stop-color%3D'%23ffe09a'%20stop-opacity%3D'.92'%2F%3E%3C%2FlinearGradient%3E%3C%2Fdefs%3E%3Cg%20fill%3D'none'%20stroke%3D'url(%23g)'%20stroke-linecap%3D'round'%3E%3Cpath%20d%3D'M0%20148%20C104%20147%20183%20134%20248%20110%20C314%2086%20356%2053%20468%2015'%20stroke-width%3D'1.25'%2F%3E%3Cpath%20d%3D'M0%20140%20C103%20140%20182%20127%20247%20104%20C313%2080%20360%2047%20470%209'%20stroke-width%3D'.60'%20opacity%3D'.62'%2F%3E%3Cpath%20d%3D'M0%20132%20C101%20133%20180%20120%20245%2098%20C312%2074%20363%2041%20473%203'%20stroke-width%3D'.48'%20opacity%3D'.38'%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E");
      background-repeat:no-repeat;
      background-position:right bottom;
      background-size:100% 100%;
      opacity:.92;
      filter:drop-shadow(0 0 7px rgba(240,201,107,.14));
      mix-blend-mode:screen;
    }
    html body #client-main .dch-task-head{
      position:relative!important;
      z-index:2!important;
      min-height:42px!important;
      height:42px!important;
      padding:0 16px!important;
      border-bottom:1px solid rgba(255,255,255,.07)!important;
      color:#efbd54!important;
      font-size:8.7px!important;
      font-weight:820!important;
      letter-spacing:2.6px!important;
      text-transform:uppercase!important;
    }
    html body #client-main .dch-task-head::after{
      content:'';
      position:absolute;
      left:16px;
      bottom:-1px;
      width:27px;
      height:1px;
      background:linear-gradient(90deg,#efbd54,rgba(239,189,84,.14),transparent);
    }
    html body #client-main .dch-task-count{
      min-width:28px!important;
      width:28px!important;
      height:28px!important;
      padding:0!important;
      border:1px solid rgba(240,201,107,.58)!important;
      background:linear-gradient(145deg,rgba(217,170,74,.15),rgba(217,170,74,.035))!important;
      color:#f4cb69!important;
      font-size:10px!important;
      font-weight:760!important;
      box-shadow:0 0 10px rgba(217,170,74,.05)!important;
    }
    html body #client-main .dch-task-empty{
      position:relative!important;
      z-index:2!important;
      min-height:72px!important;
      height:auto!important;
      display:grid!important;
      grid-template-columns:44px minmax(0,1fr)!important;
      align-items:center!important;
      gap:12px!important;
      padding:11px 16px!important;
      color:#f7f5f0!important;
    }
    html body #client-main .dch-task-empty .dch-iconbox,
    html body #client-main .dch-task-row .dch-iconbox{
      width:44px!important;
      height:44px!important;
      border:1px solid rgba(240,201,107,.72)!important;
      border-radius:13px!important;
      background:radial-gradient(circle at 50% 8%,rgba(255,226,146,.20),transparent 58%),linear-gradient(145deg,#27200f,#11100c)!important;
      color:#f4cb69!important;
      box-shadow:0 0 14px rgba(217,170,74,.08)!important;
    }
    html body #client-main .dch-task-empty .dch-iconbox svg,
    html body #client-main .dch-task-row .dch-iconbox svg{width:18px!important;height:18px!important;stroke-width:1.8!important}
    html body #client-main .dch-task-empty>span:last-child{
      display:block!important;
      color:#f8f7f3!important;
      font-size:14px!important;
      line-height:1.12!important;
      font-weight:630!important;
      letter-spacing:-.08px!important;
    }
    html body #client-main .dch-task-empty>span:last-child::after{
      content:'No hay tareas pendientes por ahora.';
      display:block;
      margin-top:4px;
      color:#989fa9;
      font-size:9.5px;
      line-height:1.3;
      font-weight:450;
      letter-spacing:0;
    }
    html body #client-main .dch-task-row{
      position:relative!important;
      z-index:2!important;
      min-height:72px!important;
      grid-template-columns:44px minmax(0,1fr) 15px!important;
      gap:11px!important;
      padding:11px 16px!important;
    }
    html body #client-main .dch-task-title{font-size:14px!important;font-weight:630!important}
    html body #client-main .dch-task-meta{margin-top:4px!important;color:#989fa9!important;font-size:9.5px!important;line-height:1.3!important}

    /* Progreso de fuerza: informativo, más silencioso que el CTA de rutina */
    html body #client-main .dch-progress{
      position:relative!important;
      min-height:128px!important;
      padding:20px 20px!important;
      overflow:hidden!important;
      grid-template-columns:52px minmax(0,1fr)!important;
      gap:16px!important;
      border:1px solid rgba(221,171,70,.58)!important;
      border-radius:21px!important;
      cursor:default!important;
      background:radial-gradient(circle at 100% 0,rgba(217,170,74,.065),transparent 35%),linear-gradient(145deg,#151a20 0%,#0d1217 60%,#090c10 100%)!important;
      box-shadow:0 14px 31px rgba(0,0,0,.25),inset 0 1px 0 rgba(255,255,255,.03),0 0 18px rgba(217,170,74,.025)!important;
    }
    html body #client-main .dch-progress::before{
      content:'';
      position:absolute;
      pointer-events:none;
      right:-45px;
      top:-60px;
      width:185px;
      height:145px;
      border-radius:50%;
      background:radial-gradient(circle,rgba(240,201,107,.055),transparent 68%);
      filter:blur(5px);
    }
    html body #client-main .dch-progress .dch-chevron{display:none!important}
    html body #client-main .dch-progress .dch-iconbox,
    html body #client-main .dch-progress-icon{
      width:52px!important;
      height:52px!important;
      border:1px solid rgba(221,171,70,.44)!important;
      border-radius:15px!important;
      background:linear-gradient(145deg,rgba(217,170,74,.09),rgba(10,13,17,.92))!important;
      color:#efbd54!important;
      box-shadow:inset 0 1px 0 rgba(255,255,255,.025)!important;
    }
    html body #client-main .dch-progress-copy>span,
    html body #client-main .dch-progress-label{
      color:#a7aeb8!important;
      font-size:9px!important;
      font-weight:820!important;
      letter-spacing:2.55px!important;
      text-transform:uppercase!important;
    }
    html body #client-main .dch-progress strong{
      display:block!important;
      margin-top:7px!important;
      color:#f7f5f0!important;
      font-size:18px!important;
      line-height:1.08!important;
      font-weight:730!important;
      letter-spacing:-.3px!important;
    }
    html body #client-main .dch-progress p,
    html body #client-main .dch-progress-sub{
      margin:7px 0 0!important;
      color:#9ba3ad!important;
      font-size:11px!important;
      line-height:1.42!important;
      font-weight:430!important;
    }

    /* Próximo entrenamiento: bloque protagonista */
    html body #client-main .dch-next{
      position:relative!important;
      min-height:150px!important;
      overflow:hidden!important;
      border:1px solid rgba(232,181,74,.73)!important;
      border-radius:21px!important;
      background:linear-gradient(145deg,#11161b 0%,#090d11 72%)!important;
      box-shadow:0 17px 36px rgba(0,0,0,.29),inset 0 1px 0 rgba(255,255,255,.03),0 0 21px rgba(217,170,74,.03)!important;
    }
    html body #client-main .dch-next .dch-next-media{
      opacity:.58!important;
      filter:brightness(.72) contrast(1.08) saturate(.84)!important;
      -webkit-mask-image:linear-gradient(90deg,transparent 0%,rgba(0,0,0,.35) 22%,#000 54%,#000 100%)!important;
      mask-image:linear-gradient(90deg,transparent 0%,rgba(0,0,0,.35) 22%,#000 54%,#000 100%)!important;
    }
    html body #client-main .dch-next-kicker{
      color:#efbd54!important;
      font-size:8.4px!important;
      font-weight:850!important;
      letter-spacing:2.45px!important;
      line-height:1.18!important;
    }
    html body #client-main .dch-next h3{
      color:#f8f6f1!important;
      font-size:19px!important;
      line-height:1.08!important;
      font-weight:740!important;
      letter-spacing:-.35px!important;
    }
    html body #client-main .dch-next button{
      min-height:47px!important;
      padding:0 18px!important;
      border:1px solid rgba(239,189,84,.88)!important;
      border-radius:15px!important;
      background:radial-gradient(circle at 50% 0,rgba(240,201,107,.08),transparent 70%),rgba(8,11,14,.76)!important;
      color:#f2c65d!important;
      font-weight:780!important;
      box-shadow:inset 0 1px 0 rgba(255,255,255,.025),0 0 14px rgba(217,170,74,.04)!important;
      backdrop-filter:blur(3px)!important;
      -webkit-backdrop-filter:blur(3px)!important;
    }

    html body #client-main .dch-motto{
      margin-top:19px!important;
      color:#e6b351!important;
      font-size:8.2px!important;
      font-weight:820!important;
      letter-spacing:2.8px!important;
    }

    @media(max-width:430px){
      html body #client-main .dch-wrap::before{right:-22px;top:-38px;width:334px;height:162px;opacity:.90}
      html body #client-main .dch-welcome{min-height:58px!important;margin-bottom:13px!important}
      html body #client-main .dch-name,
      html body #client-main .dch-welcome .dch-name{font-size:20px!important}
      html body #client-main .dch-welcome::after{right:0;top:8px;width:99px;font-size:5.8px;letter-spacing:1.9px}
      html body #client-main .dch-stats{gap:9px!important}
      html body #client-main .dch-stat{min-height:104px!important;padding:14px 12px!important;grid-template-columns:40px minmax(0,1fr)!important;gap:10px!important;border-radius:19px!important}
      html body #client-main .dch-stat .dch-iconbox{width:40px!important;height:40px!important;border-radius:12px!important}
      html body #client-main .dch-task-head{height:38px!important;min-height:38px!important;padding:0 14px!important;font-size:8.2px!important}
      html body #client-main .dch-task-head::after{left:14px!important}
      html body #client-main .dch-task-empty{min-height:64px!important;grid-template-columns:38px minmax(0,1fr)!important;gap:10px!important;padding:9px 14px!important}
      html body #client-main .dch-task-empty .dch-iconbox,
      html body #client-main .dch-task-row .dch-iconbox{width:38px!important;height:38px!important;border-radius:12px!important}
      html body #client-main .dch-task-empty>span:last-child{font-size:13.5px!important}
      html body #client-main .dch-task-empty>span:last-child::after{font-size:9px!important}
      html body #client-main .dch-task-row{min-height:64px!important;grid-template-columns:38px minmax(0,1fr) 15px!important;padding:9px 14px!important}
      html body #client-main .dch-progress{min-height:116px!important;padding:17px 16px!important;grid-template-columns:46px minmax(0,1fr)!important;gap:13px!important;border-radius:19px!important}
      html body #client-main .dch-progress .dch-iconbox,
      html body #client-main .dch-progress-icon{width:46px!important;height:46px!important;border-radius:14px!important}
      html body #client-main .dch-progress strong{font-size:17px!important}
      html body #client-main .dch-progress p,
      html body #client-main .dch-progress-sub{font-size:10.5px!important}
      html body #client-main .dch-next{min-height:142px!important;border-radius:19px!important}
      html body #client-main .dch-next h3{font-size:18px!important}
      html body #client-main .dch-next button{min-height:44px!important;padding:0 15px!important;border-radius:14px!important}
    }

    @media(max-width:390px){
      html body #client-main .dch-name,
      html body #client-main .dch-welcome .dch-name{font-size:19px!important}
      html body #client-main .dch-stat{min-height:100px!important;padding:13px 11px!important;grid-template-columns:36px minmax(0,1fr)!important;gap:9px!important}
      html body #client-main .dch-stat .dch-iconbox{width:36px!important;height:36px!important}
      html body #client-main .dch-task-card::after{width:60%;right:-8px;bottom:-4px}
      html body #client-main .dch-progress{grid-template-columns:44px minmax(0,1fr)!important;padding:16px 14px!important}
      html body #client-main .dch-progress .dch-iconbox,
      html body #client-main .dch-progress-icon{width:44px!important;height:44px!important}
    }
  `;
  document.head.appendChild(style);

  const enforceHomePresentation=()=>{
    const name=document.querySelector('#client-main .dch-name');
    if(name){
      name.style.setProperty('font-family','"Avenir Next","Helvetica Neue",-apple-system,BlinkMacSystemFont,Arial,sans-serif','important');
      name.style.setProperty('font-size',window.matchMedia('(max-width:390px)').matches?'19px':window.matchMedia('(max-width:430px)').matches?'20px':'21px','important');
      name.style.setProperty('font-weight','300','important');
      name.style.setProperty('line-height','1.1','important');
      name.style.setProperty('letter-spacing','.05px','important');
      name.style.setProperty('text-shadow','none','important');
    }

    document.querySelectorAll('#client-main .dch-stat').forEach(card=>{
      card.removeAttribute('onclick');
      card.style.cursor='default';
    });

    const progress=document.querySelector('#client-main .dch-progress');
    if(progress){
      progress.removeAttribute('onclick');
      progress.style.cursor='default';
      const sub=progress.querySelector('.dch-progress-sub');
      if(sub && sub.textContent.includes('Consulta el detalle en Progreso.')){
        sub.textContent='Tu rendimiento está avanzando. Sigue manteniendo esta progresión.';
      }
    }
  };

  enforceHomePresentation();
  const root=document.getElementById('client-main');
  if(root && !window.__dccLuxuryHomeObserver){
    let raf=0;
    const observer=new MutationObserver(()=>{
      cancelAnimationFrame(raf);
      raf=requestAnimationFrame(enforceHomePresentation);
    });
    observer.observe(root,{childList:true,subtree:true});
    window.__dccLuxuryHomeObserver=observer;
  }
})();