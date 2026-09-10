/* DCC — Inicio cliente premium v4: tipografía elegante + efectos premium dorados */
(function(){
  if(document.getElementById('dcc-client-home-premium-v4-css')) return;

  const style=document.createElement('style');
  style.id='dcc-client-home-premium-v4-css';
  style.textContent=`
    /* ===============================
       AMBIENTE GENERAL
    =============================== */
    #client-main .dch-wrap{
      position:relative!important;
      isolation:isolate!important;
    }

    #client-main .dch-wrap::before{
      content:'';
      position:absolute;
      z-index:-1;
      pointer-events:none;
      top:-34px;
      right:-74px;
      width:340px;
      height:220px;
      background:
        radial-gradient(ellipse at 77% 18%,rgba(240,201,107,.085) 0%,rgba(217,170,74,.035) 34%,transparent 66%);
      filter:blur(5px);
      opacity:.82;
    }

    /* ===============================
       ENCABEZADO CLIENTE
    =============================== */
    #client-main .dch-welcome{
      position:relative!important;
      min-height:70px!important;
      margin:0 0 13px!important;
      padding:4px 2px 8px!important;
      overflow:visible!important;
      background:
        linear-gradient(154deg,transparent 57%,rgba(240,201,107,.028) 69%,transparent 79%),
        radial-gradient(ellipse at 96% 10%,rgba(240,201,107,.065),transparent 48%)!important;
    }

    #client-main .dch-eyebrow{
      margin:0 0 8px!important;
      color:#e7b64d!important;
      font-size:10px!important;
      line-height:1!important;
      font-weight:820!important;
      letter-spacing:3.2px!important;
      text-transform:uppercase!important;
      text-shadow:0 0 12px rgba(231,182,77,.08);
    }

    #client-main .dch-name{
      margin:0!important;
      max-width:68%!important;
      color:#f6f4ef!important;
      font-size:27px!important;
      line-height:1.04!important;
      font-weight:520!important;
      letter-spacing:-.42px!important;
      white-space:normal!important;
      text-wrap:balance!important;
      text-shadow:0 2px 16px rgba(0,0,0,.22);
    }

    #client-main .dch-welcome::before{
      content:'';
      position:absolute;
      left:2px;
      bottom:0;
      width:24px;
      height:1.5px;
      border-radius:999px;
      background:linear-gradient(90deg,#f0c96b,#d9aa4a);
      box-shadow:0 0 10px rgba(240,201,107,.22);
    }

    #client-main .dch-welcome::after{
      content:'DISCIPLINA\\A HOY, RESULTADOS\\A SIEMPRE';
      white-space:pre;
      position:absolute;
      right:4px;
      top:10px;
      width:108px;
      color:#8b8f96;
      font-size:6.6px;
      line-height:1.78;
      font-weight:560;
      letter-spacing:2.15px;
      text-align:left;
      opacity:.76;
      pointer-events:none;
      text-shadow:0 0 14px rgba(240,201,107,.055);
    }

    /* ===============================
       TARJETA TAREAS PENDIENTES
       Ondas fluidas doradas, sin círculos ni haces rectos
    =============================== */
    #client-main .dch-task-card{
      position:relative!important;
      border-color:rgba(236,185,78,.74)!important;
      background:
        radial-gradient(ellipse at 0% 0%,rgba(240,201,107,.095),transparent 26%),
        radial-gradient(ellipse at 98% 12%,rgba(240,201,107,.075),transparent 28%),
        linear-gradient(145deg,#171b21 0%,#0d1116 58%,#080b0e 100%)!important;
      box-shadow:
        0 16px 36px rgba(0,0,0,.30),
        inset 0 1px 0 rgba(255,255,255,.038),
        inset 0 0 28px rgba(217,170,74,.018),
        0 0 24px rgba(217,170,74,.045)!important;
      overflow:hidden!important;
      transform:translateZ(0);
    }

    #client-main .dch-task-card::before{
      content:'';
      position:absolute;
      pointer-events:none;
      z-index:0;
      left:-28px;
      top:-34px;
      width:180px;
      height:120px;
      border-radius:50%;
      background:radial-gradient(ellipse,rgba(247,208,116,.105) 0%,rgba(217,170,74,.032) 42%,transparent 72%);
      filter:blur(10px);
      opacity:.9;
    }

    #client-main .dch-task-card::after{
      content:'';
      position:absolute;
      pointer-events:none;
      z-index:1;
      right:-16px;
      bottom:-18px;
      width:62%;
      height:78%;
      background-image:url("data:image/svg+xml,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%20420%20170'%3E%0A%3Cdefs%3E%0A%20%20%3ClinearGradient%20id%3D'g'%20x1%3D'0'%20y1%3D'1'%20x2%3D'1'%20y2%3D'0'%3E%0A%20%20%20%20%3Cstop%20offset%3D'0'%20stop-color%3D'%23d9aa4a'%20stop-opacity%3D'0'%2F%3E%0A%20%20%20%20%3Cstop%20offset%3D'.58'%20stop-color%3D'%23d9aa4a'%20stop-opacity%3D'.18'%2F%3E%0A%20%20%20%20%3Cstop%20offset%3D'1'%20stop-color%3D'%23f0c96b'%20stop-opacity%3D'.82'%2F%3E%0A%20%20%3C%2FlinearGradient%3E%0A%3C%2Fdefs%3E%0A%3Cg%20fill%3D'none'%20stroke%3D'url(%23g)'%20stroke-width%3D'1.15'%20stroke-linecap%3D'round'%3E%0A%20%20%3Cpath%20d%3D'M25%20164%20C125%20148%20208%20117%20278%2082%20C337%2053%20376%2032%20423%207'%2F%3E%0A%20%20%3Cpath%20d%3D'M22%20156%20C122%20141%20204%20111%20275%2077%20C337%2048%20379%2027%20425%203'%20opacity%3D'.72'%2F%3E%0A%20%20%3Cpath%20d%3D'M18%20148%20C118%20134%20200%20105%20272%2072%20C338%2042%20380%2021%20428%20-2'%20opacity%3D'.50'%2F%3E%0A%20%20%3Cpath%20d%3D'M15%20140%20C113%20127%20196%2099%20270%2066%20C338%2036%20383%2014%20431%20-8'%20opacity%3D'.32'%2F%3E%0A%20%20%3Cpath%20d%3D'M11%20132%20C108%20120%20190%2093%20267%2060%20C338%2029%20385%208%20434%20-14'%20opacity%3D'.20'%2F%3E%0A%3C%2Fg%3E%0A%3C%2Fsvg%3E");
      background-repeat:no-repeat;
      background-position:right bottom;
      background-size:100% 100%;
      opacity:.72;
      filter:drop-shadow(0 0 7px rgba(240,201,107,.12));
      mix-blend-mode:screen;
    }

    #client-main .dch-task-head{
      position:relative!important;
      z-index:2!important;
      min-height:54px!important;
      padding:0 17px!important;
      border-bottom:1px solid rgba(255,255,255,.07)!important;
      color:#efbd54!important;
      font-size:9.5px!important;
      font-weight:830!important;
      letter-spacing:2.65px!important;
      text-shadow:0 0 11px rgba(239,189,84,.09);
    }

    #client-main .dch-task-head::after{
      content:'';
      position:absolute;
      left:17px;
      bottom:-1px;
      width:34px;
      height:1px;
      background:linear-gradient(90deg,#efbd54,rgba(239,189,84,.15),transparent);
      box-shadow:0 0 8px rgba(233,184,77,.24);
    }

    #client-main .dch-task-count{
      min-width:31px!important;
      height:31px!important;
      padding:0 9px!important;
      border-color:rgba(240,201,107,.42)!important;
      background:linear-gradient(145deg,rgba(217,170,74,.14),rgba(217,170,74,.045))!important;
      color:#f4cb69!important;
      font-size:11.5px!important;
      font-weight:780!important;
      box-shadow:inset 0 1px 0 rgba(255,255,255,.04),0 0 12px rgba(217,170,74,.05)!important;
    }

    #client-main .dch-task-empty{
      position:relative!important;
      z-index:2!important;
      min-height:92px!important;
      display:grid!important;
      grid-template-columns:48px minmax(0,1fr)!important;
      align-items:center!important;
      gap:14px!important;
      padding:14px 17px!important;
      color:#f7f5f0!important;
    }

    #client-main .dch-task-empty .dch-iconbox{
      width:48px!important;
      height:48px!important;
      border:1px solid rgba(240,201,107,.78)!important;
      border-radius:15px!important;
      background:radial-gradient(circle at 50% 8%,rgba(255,226,146,.27),transparent 57%),linear-gradient(145deg,#2a210f,#11100c)!important;
      color:#f4cb69!important;
      box-shadow:inset 0 0 0 1px rgba(255,224,141,.055),0 0 20px rgba(217,170,74,.14)!important;
    }

    #client-main .dch-task-empty .dch-iconbox svg{
      width:22px!important;
      height:22px!important;
      stroke-width:1.9!important;
      filter:drop-shadow(0 0 4px rgba(240,201,107,.12));
    }

    #client-main .dch-task-empty > span:last-child{
      display:block!important;
      color:#f8f7f3!important;
      font-size:17px!important;
      line-height:1.15!important;
      font-weight:680!important;
      letter-spacing:-.18px!important;
    }

    #client-main .dch-task-empty > span:last-child::after{
      content:'No hay tareas pendientes por ahora.';
      display:block;
      margin-top:6px;
      color:#959da8;
      font-size:10.8px;
      line-height:1.35;
      font-weight:490;
      letter-spacing:0;
    }

    #client-main .dch-task-row{
      position:relative!important;
      z-index:2!important;
      min-height:76px!important;
      grid-template-columns:44px minmax(0,1fr) 18px!important;
      gap:12px!important;
      padding:11px 17px!important;
    }

    #client-main .dch-task-row .dch-iconbox{
      width:44px!important;
      height:44px!important;
      border-color:rgba(240,201,107,.52)!important;
      background:linear-gradient(145deg,rgba(217,170,74,.11),rgba(10,13,16,.94))!important;
      box-shadow:0 0 14px rgba(217,170,74,.055)!important;
    }

    #client-main .dch-task-title{
      font-size:15px!important;
      font-weight:690!important;
    }

    #client-main .dch-task-meta{
      margin-top:4px!important;
      color:#929aa5!important;
      font-size:10.3px!important;
      line-height:1.35!important;
    }

    /* ===============================
       RESTO DE TARJETAS
    =============================== */
    #client-main .dch-progress{
      position:relative!important;
      overflow:hidden!important;
      background:radial-gradient(circle at 98% 0%,rgba(217,170,74,.065),transparent 34%),linear-gradient(145deg,#171b21 0%,#0e1217 58%,#090c10 100%)!important;
      box-shadow:0 14px 30px rgba(0,0,0,.25),inset 0 1px 0 rgba(255,255,255,.032),0 0 18px rgba(217,170,74,.028)!important;
    }

    #client-main .dch-progress::before{
      content:'';
      position:absolute;
      pointer-events:none;
      right:-48px;
      top:-62px;
      width:180px;
      height:140px;
      border-radius:50%;
      background:radial-gradient(circle,rgba(240,201,107,.055),transparent 68%);
      filter:blur(5px);
    }

    #client-main .dch-next{
      position:relative!important;
      box-shadow:0 16px 34px rgba(0,0,0,.28),inset 0 1px 0 rgba(255,255,255,.032),0 0 20px rgba(217,170,74,.035)!important;
    }

    #client-main .dch-stat{
      box-shadow:0 11px 25px rgba(0,0,0,.23),inset 0 1px 0 rgba(255,255,255,.028),0 0 14px rgba(217,170,74,.022)!important;
    }

    @media(max-width:390px){
      #client-main .dch-wrap::before{
        right:-96px;
        top:-28px;
        width:300px;
        height:205px;
        opacity:.70;
      }
      #client-main .dch-welcome{
        min-height:66px!important;
        margin-bottom:12px!important;
      }
      #client-main .dch-name{
        max-width:69%!important;
        font-size:25px!important;
        font-weight:510!important;
        letter-spacing:-.30px!important;
      }
      #client-main .dch-welcome::after{
        right:0;
        top:9px;
        width:99px;
        font-size:6px;
        letter-spacing:1.8px;
      }
      #client-main .dch-task-head{
        min-height:51px!important;
        padding:0 14px!important;
        font-size:8.8px!important;
      }
      #client-main .dch-task-head::after{left:14px!important}
      #client-main .dch-task-empty{
        min-height:86px!important;
        grid-template-columns:43px minmax(0,1fr)!important;
        gap:12px!important;
        padding:12px 14px!important;
      }
      #client-main .dch-task-empty .dch-iconbox{
        width:43px!important;
        height:43px!important;
      }
      #client-main .dch-task-empty > span:last-child{
        font-size:15.5px!important;
      }
      #client-main .dch-task-empty > span:last-child::after{
        font-size:9.8px!important;
      }
      #client-main .dch-task-card::after{
        right:-24px;
        bottom:-20px;
        width:66%;
        height:76%;
        opacity:.66;
      }
    }

    @media(prefers-reduced-motion:reduce){
      #client-main .dch-wrap::before,
      #client-main .dch-task-card::before,
      #client-main .dch-task-card::after{
        filter:none!important;
      }
    }
  `;
  document.head.appendChild(style);
})();
