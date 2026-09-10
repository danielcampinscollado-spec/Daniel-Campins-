/* DCC — Inicio cliente premium v4: editorial luxury */
(function(){
  if(document.getElementById('dcc-client-home-premium-v4-css')) return;

  const style=document.createElement('style');
  style.id='dcc-client-home-premium-v4-css';
  style.textContent=`
    html body #client-main .dch-wrap{
      position:relative!important;
      isolation:isolate!important;
    }

    /* Reflejo superior: curva fina y luminosa */
    html body #client-main .dch-wrap::before{
      content:'';
      position:absolute;
      z-index:0;
      pointer-events:none;
      top:-42px;
      right:-8px;
      width:355px;
      height:172px;
      background-image:url("data:image/svg+xml,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%20480%20200'%3E%3Cdefs%3E%3ClinearGradient%20id%3D'g'%20x1%3D'0'%20y1%3D'1'%20x2%3D'1'%20y2%3D'0'%3E%3Cstop%20offset%3D'0'%20stop-color%3D'%23d9aa4a'%20stop-opacity%3D'0'%2F%3E%3Cstop%20offset%3D'.48'%20stop-color%3D'%23d9aa4a'%20stop-opacity%3D'.06'%2F%3E%3Cstop%20offset%3D'.78'%20stop-color%3D'%23efbd54'%20stop-opacity%3D'.42'%2F%3E%3Cstop%20offset%3D'1'%20stop-color%3D'%23ffe09a'%20stop-opacity%3D'.92'%2F%3E%3C%2FlinearGradient%3E%3C%2Fdefs%3E%3Cg%20fill%3D'none'%20stroke%3D'url(%23g)'%20stroke-linecap%3D'round'%3E%3Cpath%20d%3D'M28%20192%20C126%20184%20198%20166%20262%20134%20C327%20102%20353%2069%20488%2011'%20stroke-width%3D'1.45'%2F%3E%3Cpath%20d%3D'M22%20184%20C124%20177%20196%20158%20259%20127%20C324%2095%20357%2062%20490%205'%20stroke-width%3D'.62'%20opacity%3D'.55'%2F%3E%3Cpath%20d%3D'M16%20176%20C119%20170%20193%20152%20256%20121%20C322%2089%20360%2055%20493%20-2'%20stroke-width%3D'.48'%20opacity%3D'.30'%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E");
      background-repeat:no-repeat;
      background-position:right top;
      background-size:100% 100%;
      opacity:.90;
      filter:drop-shadow(0 0 8px rgba(240,201,107,.16));
      mix-blend-mode:screen;
    }

    html body #client-main .dch-wrap::after{
      content:'';
      position:absolute;
      z-index:0;
      pointer-events:none;
      top:3px;
      right:-20px;
      width:235px;
      height:112px;
      background:
        radial-gradient(circle at 77% 18%,rgba(255,231,165,.42) 0 1px,rgba(240,201,107,.15) 3px,transparent 15px),
        radial-gradient(ellipse at 80% 19%,rgba(240,201,107,.085),transparent 60%);
      opacity:.86;
    }

    html body #client-main .dch-wrap > *{
      position:relative!important;
      z-index:1;
    }

    /* Encabezado editorial */
    html body #client-main .dch-welcome{
      position:relative!important;
      min-height:56px!important;
      margin:0 0 11px!important;
      padding:3px 2px 7px!important;
      overflow:visible!important;
      background:transparent!important;
    }

    /* BIENVENIDO: mismo tratamiento que ALIMENTACIÓN */
    html body #client-main .dch-eyebrow{
      margin:0 0 7px!important;
      color:#e9b74d!important;
      font-size:11px!important;
      line-height:1.2!important;
      font-weight:850!important;
      letter-spacing:3px!important;
      text-transform:uppercase!important;
    }

    html body #client-main .dch-name,
    html body #client-main .dch-welcome .dch-name{
      margin:0!important;
      max-width:66%!important;
      color:#f3f1ec!important;
      font-family:"Avenir Next","Helvetica Neue",-apple-system,BlinkMacSystemFont,Arial,sans-serif!important;
      font-size:20px!important;
      line-height:1.14!important;
      font-weight:300!important;
      letter-spacing:.08px!important;
      white-space:normal!important;
      text-wrap:balance!important;
      text-shadow:none!important;
      -webkit-font-smoothing:antialiased!important;
      font-synthesis:none!important;
    }

    html body #client-main .dch-welcome::before{
      content:'';
      position:absolute;
      left:2px;
      bottom:0;
      width:22px;
      height:1.4px;
      border-radius:999px;
      background:linear-gradient(90deg,#f3ca69,#d9aa4a);
      box-shadow:0 0 8px rgba(240,201,107,.18);
    }

    html body #client-main .dch-welcome::after{
      content:'DISCIPLINA\\A HOY, RESULTADOS\\A SIEMPRE';
      white-space:pre;
      position:absolute;
      right:3px;
      top:8px;
      width:105px;
      color:#878b92;
      font-size:6.1px;
      line-height:1.78;
      font-weight:500;
      letter-spacing:2px;
      text-align:left;
      opacity:.76;
      pointer-events:none;
    }

    /* Peso y grasa: tarjetas puramente informativas */
    html body #client-main .dch-stat{
      grid-template-columns:38px minmax(0,1fr)!important;
      cursor:default!important;
      box-shadow:0 11px 25px rgba(0,0,0,.23),inset 0 1px 0 rgba(255,255,255,.027),0 0 14px rgba(217,170,74,.02)!important;
    }

    html body #client-main .dch-stat .dch-chevron{
      display:none!important;
    }

    /* Tareas pendientes: menos altura y más lujo visual */
    html body #client-main .dch-task-card{
      position:relative!important;
      min-height:0!important;
      padding:0!important;
      border-radius:18px!important;
      border-color:rgba(236,185,78,.78)!important;
      background:
        radial-gradient(circle at 83% 70%,rgba(255,224,142,.30) 0 1px,rgba(240,201,107,.09) 4px,transparent 18px),
        linear-gradient(145deg,#151a20 0%,#0d1116 62%,#080b0e 100%)!important;
      box-shadow:
        0 12px 28px rgba(0,0,0,.27),
        inset 0 1px 0 rgba(255,255,255,.035),
        0 0 18px rgba(217,170,74,.045)!important;
      overflow:hidden!important;
      transform:translateZ(0);
    }

    html body #client-main .dch-task-card::before{
      content:'';
      position:absolute;
      pointer-events:none;
      z-index:0;
      left:-38px;
      top:-42px;
      width:150px;
      height:110px;
      border-radius:50%;
      background:radial-gradient(ellipse,rgba(248,210,119,.14) 0%,rgba(217,170,74,.035) 43%,transparent 72%);
      filter:blur(8px);
    }

    html body #client-main .dch-task-card::after{
      content:'';
      position:absolute;
      pointer-events:none;
      z-index:1;
      right:-4px;
      bottom:-3px;
      width:55%;
      height:68%;
      background-image:url("data:image/svg+xml,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%20460%20155'%3E%3Cdefs%3E%3ClinearGradient%20id%3D'g'%20x1%3D'0'%20y1%3D'1'%20x2%3D'1'%20y2%3D'0'%3E%3Cstop%20offset%3D'0'%20stop-color%3D'%23d9aa4a'%20stop-opacity%3D'0'%2F%3E%3Cstop%20offset%3D'.46'%20stop-color%3D'%23d9aa4a'%20stop-opacity%3D'.07'%2F%3E%3Cstop%20offset%3D'.76'%20stop-color%3D'%23efbd54'%20stop-opacity%3D'.42'%2F%3E%3Cstop%20offset%3D'1'%20stop-color%3D'%23ffe09a'%20stop-opacity%3D'.92'%2F%3E%3C%2FlinearGradient%3E%3C%2Fdefs%3E%3Cg%20fill%3D'none'%20stroke%3D'url(%23g)'%20stroke-linecap%3D'round'%3E%3Cpath%20d%3D'M0%20148%20C104%20147%20183%20134%20248%20110%20C314%2086%20356%2053%20468%2015'%20stroke-width%3D'1.25'%2F%3E%3Cpath%20d%3D'M0%20140%20C103%20140%20182%20127%20247%20104%20C313%2080%20360%2047%20470%209'%20stroke-width%3D'.60'%20opacity%3D'.62'%2F%3E%3Cpath%20d%3D'M0%20132%20C101%20133%20180%20120%20245%2098%20C312%2074%20363%2041%20473%203'%20stroke-width%3D'.48'%20opacity%3D'.38'%2F%3E%3Cpath%20d%3D'M0%20124%20C100%20126%20178%20114%20244%2092%20C311%2068%20366%2035%20476%20-4'%20stroke-width%3D'.42'%20opacity%3D'.22'%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E");
      background-repeat:no-repeat;
      background-position:right bottom;
      background-size:100% 100%;
      opacity:.90;
      filter:drop-shadow(0 0 7px rgba(240,201,107,.15));
      mix-blend-mode:screen;
    }

    html body #client-main .dch-task-head{
      position:relative!important;
      z-index:2!important;
      min-height:36px!important;
      height:36px!important;
      padding:0 14px!important;
      border-bottom:1px solid rgba(255,255,255,.065)!important;
      color:#efbd54!important;
      font-size:8.4px!important;
      font-weight:780!important;
      letter-spacing:2.35px!important;
      text-transform:uppercase!important;
    }

    html body #client-main .dch-task-head::after{
      content:'';
      position:absolute;
      left:14px;
      bottom:-1px;
      width:25px;
      height:1px;
      background:linear-gradient(90deg,#efbd54,rgba(239,189,84,.13),transparent);
    }

    html body #client-main .dch-task-count{
      min-width:25px!important;
      width:25px!important;
      height:25px!important;
      padding:0!important;
      border-color:rgba(240,201,107,.42)!important;
      background:linear-gradient(145deg,rgba(217,170,74,.13),rgba(217,170,74,.035))!important;
      color:#f4cb69!important;
      font-size:10px!important;
      font-weight:720!important;
      box-shadow:0 0 9px rgba(217,170,74,.04)!important;
    }

    html body #client-main .dch-task-empty{
      position:relative!important;
      z-index:2!important;
      min-height:56px!important;
      height:auto!important;
      display:grid!important;
      grid-template-columns:34px minmax(0,1fr)!important;
      align-items:center!important;
      gap:10px!important;
      padding:7px 14px!important;
      color:#f7f5f0!important;
    }

    html body #client-main .dch-task-empty .dch-iconbox{
      width:34px!important;
      height:34px!important;
      border:1px solid rgba(240,201,107,.78)!important;
      border-radius:11px!important;
      background:radial-gradient(circle at 50% 8%,rgba(255,226,146,.24),transparent 57%),linear-gradient(145deg,#29200e,#11100c)!important;
      color:#f4cb69!important;
      box-shadow:0 0 14px rgba(217,170,74,.11)!important;
    }

    html body #client-main .dch-task-empty .dch-iconbox svg{
      width:16px!important;
      height:16px!important;
      stroke-width:1.8!important;
    }

    html body #client-main .dch-task-empty > span:last-child{
      display:block!important;
      color:#f8f7f3!important;
      font-size:13.5px!important;
      line-height:1.1!important;
      font-weight:600!important;
      letter-spacing:-.08px!important;
    }

    html body #client-main .dch-task-empty > span:last-child::after{
      content:'No hay tareas pendientes por ahora.';
      display:block;
      margin-top:3px;
      color:#959da8;
      font-size:8.9px;
      line-height:1.28;
      font-weight:450;
      letter-spacing:0;
    }

    html body #client-main .dch-task-row{
      position:relative!important;
      z-index:2!important;
      min-height:56px!important;
      grid-template-columns:34px minmax(0,1fr) 15px!important;
      gap:9px!important;
      padding:7px 14px!important;
    }

    html body #client-main .dch-task-row .dch-iconbox{
      width:34px!important;
      height:34px!important;
      border-color:rgba(240,201,107,.50)!important;
      background:linear-gradient(145deg,rgba(217,170,74,.10),rgba(10,13,16,.94))!important;
      box-shadow:0 0 11px rgba(217,170,74,.045)!important;
    }

    html body #client-main .dch-task-title{font-size:13px!important;font-weight:620!important}
    html body #client-main .dch-task-meta{margin-top:3px!important;color:#929aa5!important;font-size:9.2px!important;line-height:1.3!important}

    /* Progreso de fuerza: tarjeta puramente informativa */
    html body #client-main .dch-progress{
      position:relative!important;
      overflow:hidden!important;
      grid-template-columns:50px minmax(0,1fr)!important;
      cursor:default!important;
      background:radial-gradient(circle at 98% 0%,rgba(217,170,74,.06),transparent 34%),linear-gradient(145deg,#171b21 0%,#0e1217 58%,#090c10 100%)!important;
      box-shadow:0 14px 30px rgba(0,0,0,.24),inset 0 1px 0 rgba(255,255,255,.03),0 0 18px rgba(217,170,74,.025)!important;
    }
    html body #client-main .dch-progress .dch-chevron{
      display:none!important;
    }
    html body #client-main .dch-progress::before{
      content:'';position:absolute;pointer-events:none;right:-48px;top:-62px;width:180px;height:140px;border-radius:50%;background:radial-gradient(circle,rgba(240,201,107,.05),transparent 68%);filter:blur(5px)
    }
    html body #client-main .dch-next{position:relative!important;box-shadow:0 16px 34px rgba(0,0,0,.28),inset 0 1px 0 rgba(255,255,255,.03),0 0 20px rgba(217,170,74,.03)!important}

    @media(max-width:390px){
      html body #client-main .dch-wrap::before{right:-22px;top:-38px;width:330px;height:160px;opacity:.88}
      html body #client-main .dch-welcome{min-height:53px!important;margin-bottom:10px!important}
      html body #client-main .dch-name,
      html body #client-main .dch-welcome .dch-name{font-size:19px!important;font-weight:300!important;letter-spacing:.08px!important}
      html body #client-main .dch-welcome::after{right:0;top:7px;width:98px;font-size:5.8px;letter-spacing:1.8px}
      html body #client-main .dch-stat{grid-template-columns:34px minmax(0,1fr)!important}
      html body #client-main .dch-progress{grid-template-columns:50px minmax(0,1fr)!important}
      html body #client-main .dch-task-head{height:34px!important;min-height:34px!important;padding:0 12px!important;font-size:8px!important}
      html body #client-main .dch-task-head::after{left:12px!important}
      html body #client-main .dch-task-empty{min-height:53px!important;grid-template-columns:32px minmax(0,1fr)!important;gap:9px!important;padding:6px 12px!important}
      html body #client-main .dch-task-empty .dch-iconbox{width:32px!important;height:32px!important;border-radius:10px!important}
      html body #client-main .dch-task-empty > span:last-child{font-size:13px!important}
      html body #client-main .dch-task-empty > span:last-child::after{font-size:8.5px!important}
      html body #client-main .dch-task-card::after{width:58%;height:66%;right:-9px;bottom:-5px}
    }
  `;
  document.head.appendChild(style);

  /* El renderer del Inicio sustituye nodos: reafirmar estilos y comportamiento tras cada render. */
  const enforceHomePresentation=()=>{
    const name=document.querySelector('#client-main .dch-name');
    if(name){
      name.style.setProperty('font-family','"Avenir Next","Helvetica Neue",-apple-system,BlinkMacSystemFont,Arial,sans-serif','important');
      name.style.setProperty('font-size',window.matchMedia('(max-width:390px)').matches?'19px':'20px','important');
      name.style.setProperty('font-weight','300','important');
      name.style.setProperty('line-height','1.14','important');
      name.style.setProperty('letter-spacing','.08px','important');
      name.style.setProperty('text-shadow','none','important');
    }

    /* Peso, grasa y progreso de fuerza son información, no accesos directos. */
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