/* DCC — Inicio cliente premium v4: diseño aprobado */
(function(){
  if(document.getElementById('dcc-client-home-premium-v4-css')) return;

  const style=document.createElement('style');
  style.id='dcc-client-home-premium-v4-css';
  style.textContent=`
    /* ===============================
       AMBIENTE Y REFLEJO SUPERIOR
    =============================== */
    #client-main .dch-wrap{
      position:relative!important;
      isolation:isolate!important;
    }

    #client-main .dch-wrap::before{
      content:'';
      position:absolute;
      z-index:0;
      pointer-events:none;
      top:-30px;
      right:-18px;
      width:380px;
      height:190px;
      background-image:url("data:image/svg+xml,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%20460%20210'%3E%3Cdefs%3E%3ClinearGradient%20id%3D'g'%20x1%3D'0'%20y1%3D'1'%20x2%3D'1'%20y2%3D'0'%3E%3Cstop%20offset%3D'0'%20stop-color%3D'%23d9aa4a'%20stop-opacity%3D'0'%2F%3E%3Cstop%20offset%3D'.48'%20stop-color%3D'%23d9aa4a'%20stop-opacity%3D'.10'%2F%3E%3Cstop%20offset%3D'.76'%20stop-color%3D'%23f0c96b'%20stop-opacity%3D'.55'%2F%3E%3Cstop%20offset%3D'1'%20stop-color%3D'%23ffe19a'%20stop-opacity%3D'.95'%2F%3E%3C%2FlinearGradient%3E%3C%2Fdefs%3E%3Cg%20fill%3D'none'%20stroke%3D'url(%23g)'%20stroke-linecap%3D'round'%3E%3Cpath%20d%3D'M-10%20190%20C110%20162%20220%20123%20316%2078%20C374%2051%20418%2027%20470%20-4'%20stroke-width%3D'1.6'%2F%3E%3Cpath%20d%3D'M-4%20182%20C115%20155%20220%20118%20314%2074%20C378%2045%20422%2021%20472%20-10'%20stroke-width%3D'.7'%20opacity%3D'.5'%2F%3E%3Cpath%20d%3D'M2%20173%20C120%20148%20224%20112%20312%2070%20C382%2039%20427%2015%20475%20-16'%20stroke-width%3D'.55'%20opacity%3D'.25'%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E");
      background-repeat:no-repeat;
      background-position:right top;
      background-size:100% 100%;
      opacity:.92;
      filter:drop-shadow(0 0 9px rgba(240,201,107,.20));
      mix-blend-mode:screen;
    }

    #client-main .dch-wrap::after{
      content:'';
      position:absolute;
      z-index:0;
      pointer-events:none;
      top:-8px;
      right:-52px;
      width:320px;
      height:180px;
      background:
        radial-gradient(circle at 76% 12%,rgba(255,224,142,.30) 0 1px,rgba(240,201,107,.13) 3px,transparent 17px),
        radial-gradient(ellipse at 79% 14%,rgba(240,201,107,.11),rgba(217,170,74,.035) 34%,transparent 67%);
      filter:blur(.4px);
      opacity:.9;
    }

    #client-main .dch-wrap > *{
      position:relative!important;
      z-index:1;
    }

    /* ===============================
       ENCABEZADO CLIENTE
    =============================== */
    #client-main .dch-welcome{
      position:relative!important;
      min-height:64px!important;
      margin:0 0 12px!important;
      padding:4px 2px 8px!important;
      overflow:visible!important;
      background:transparent!important;
    }

    #client-main .dch-eyebrow{
      margin:0 0 8px!important;
      color:#e9b94f!important;
      font-size:10px!important;
      line-height:1!important;
      font-weight:800!important;
      letter-spacing:3.2px!important;
      text-transform:uppercase!important;
    }

    #client-main .dch-name{
      margin:0!important;
      max-width:68%!important;
      color:#f4f2ed!important;
      font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Helvetica Neue",Arial,sans-serif!important;
      font-size:24px!important;
      line-height:1.08!important;
      font-weight:400!important;
      letter-spacing:-.20px!important;
      white-space:normal!important;
      text-wrap:balance!important;
      text-shadow:0 2px 14px rgba(0,0,0,.18);
    }

    #client-main .dch-welcome::before{
      content:'';
      position:absolute;
      left:2px;
      bottom:0;
      width:24px;
      height:1.5px;
      border-radius:999px;
      background:linear-gradient(90deg,#f3ca69,#d9aa4a);
      box-shadow:0 0 9px rgba(240,201,107,.22);
    }

    #client-main .dch-welcome::after{
      content:'DISCIPLINA\\A HOY, RESULTADOS\\A SIEMPRE';
      white-space:pre;
      position:absolute;
      right:4px;
      top:10px;
      width:108px;
      color:#8c9096;
      font-size:6.5px;
      line-height:1.78;
      font-weight:500;
      letter-spacing:2.1px;
      text-align:left;
      opacity:.80;
      pointer-events:none;
    }

    /* ===============================
       TARJETA TAREAS PENDIENTES
    =============================== */
    #client-main .dch-task-card{
      position:relative!important;
      min-height:0!important;
      padding:0!important;
      border-radius:20px!important;
      border-color:rgba(236,185,78,.78)!important;
      background:
        radial-gradient(circle at 79% 77%,rgba(255,222,133,.22) 0 1px,rgba(240,201,107,.10) 4px,transparent 22px),
        radial-gradient(ellipse at 98% 8%,rgba(240,201,107,.08),transparent 30%),
        linear-gradient(145deg,#151a20 0%,#0c1116 60%,#070a0d 100%)!important;
      box-shadow:
        0 14px 32px rgba(0,0,0,.28),
        inset 0 1px 0 rgba(255,255,255,.04),
        0 0 22px rgba(217,170,74,.05)!important;
      overflow:hidden!important;
      transform:translateZ(0);
    }

    #client-main .dch-task-card::before{
      content:'';
      position:absolute;
      pointer-events:none;
      z-index:0;
      left:-44px;
      top:-46px;
      width:170px;
      height:130px;
      border-radius:50%;
      background:radial-gradient(ellipse,rgba(248,210,119,.12) 0%,rgba(217,170,74,.035) 42%,transparent 72%);
      filter:blur(9px);
    }

    #client-main .dch-task-card::after{
      content:'';
      position:absolute;
      pointer-events:none;
      z-index:1;
      right:-8px;
      bottom:-2px;
      width:58%;
      height:72%;
      background-image:url("data:image/svg+xml,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%20440%20165'%3E%3Cdefs%3E%3ClinearGradient%20id%3D'g'%20x1%3D'0'%20y1%3D'1'%20x2%3D'1'%20y2%3D'0'%3E%3Cstop%20offset%3D'0'%20stop-color%3D'%23d9aa4a'%20stop-opacity%3D'0'%2F%3E%3Cstop%20offset%3D'.46'%20stop-color%3D'%23d9aa4a'%20stop-opacity%3D'.12'%2F%3E%3Cstop%20offset%3D'.73'%20stop-color%3D'%23e9b94f'%20stop-opacity%3D'.38'%2F%3E%3Cstop%20offset%3D'1'%20stop-color%3D'%23ffe097'%20stop-opacity%3D'.95'%2F%3E%3C%2FlinearGradient%3E%3C%2Fdefs%3E%3Cg%20fill%3D'none'%20stroke%3D'url(%23g)'%20stroke-linecap%3D'round'%3E%3Cpath%20d%3D'M-10%20160%20C120%20154%20216%20135%20292%20102%20C350%2077%20394%2048%20454%2010'%20stroke-width%3D'1.5'%2F%3E%3Cpath%20d%3D'M-10%20153%20C118%20147%20212%20128%20290%2096%20C351%2070%20398%2041%20456%204'%20stroke-width%3D'.8'%20opacity%3D'.62'%2F%3E%3Cpath%20d%3D'M-8%20146%20C116%20140%20210%20122%20288%2090%20C352%2064%20400%2034%20459%20-3'%20stroke-width%3D'.62'%20opacity%3D'.42'%2F%3E%3Cpath%20d%3D'M-4%20139%20C116%20134%20208%20116%20287%2084%20C353%2058%20403%2027%20462%20-10'%20stroke-width%3D'.5'%20opacity%3D'.28'%2F%3E%3Cpath%20d%3D'M0%20132%20C115%20128%20206%20110%20286%2078%20C354%2051%20406%2020%20465%20-17'%20stroke-width%3D'.45'%20opacity%3D'.18'%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E");
      background-repeat:no-repeat;
      background-position:right bottom;
      background-size:100% 100%;
      opacity:.92;
      filter:drop-shadow(0 0 8px rgba(240,201,107,.20));
      mix-blend-mode:screen;
    }

    #client-main .dch-task-head{
      position:relative!important;
      z-index:2!important;
      min-height:43px!important;
      height:43px!important;
      padding:0 15px!important;
      border-bottom:1px solid rgba(255,255,255,.07)!important;
      color:#efbd54!important;
      font-size:9px!important;
      font-weight:800!important;
      letter-spacing:2.5px!important;
      text-transform:uppercase!important;
    }

    #client-main .dch-task-head::after{
      content:'';
      position:absolute;
      left:15px;
      bottom:-1px;
      width:28px;
      height:1px;
      background:linear-gradient(90deg,#efbd54,rgba(239,189,84,.15),transparent);
      box-shadow:0 0 7px rgba(233,184,77,.22);
    }

    #client-main .dch-task-count{
      min-width:29px!important;
      width:29px!important;
      height:29px!important;
      padding:0!important;
      border-color:rgba(240,201,107,.44)!important;
      background:linear-gradient(145deg,rgba(217,170,74,.14),rgba(217,170,74,.045))!important;
      color:#f4cb69!important;
      font-size:11px!important;
      font-weight:760!important;
      box-shadow:inset 0 1px 0 rgba(255,255,255,.04),0 0 11px rgba(217,170,74,.05)!important;
    }

    #client-main .dch-task-empty{
      position:relative!important;
      z-index:2!important;
      min-height:70px!important;
      height:auto!important;
      display:grid!important;
      grid-template-columns:39px minmax(0,1fr)!important;
      align-items:center!important;
      gap:11px!important;
      padding:9px 15px!important;
      color:#f7f5f0!important;
    }

    #client-main .dch-task-empty .dch-iconbox{
      width:39px!important;
      height:39px!important;
      border:1px solid rgba(240,201,107,.80)!important;
      border-radius:13px!important;
      background:
        radial-gradient(circle at 50% 8%,rgba(255,226,146,.28),transparent 57%),
        linear-gradient(145deg,#2a210f,#11100c)!important;
      color:#f4cb69!important;
      box-shadow:inset 0 0 0 1px rgba(255,224,141,.055),0 0 17px rgba(217,170,74,.13)!important;
    }

    #client-main .dch-task-empty .dch-iconbox svg{
      width:19px!important;
      height:19px!important;
      stroke-width:1.9!important;
    }

    #client-main .dch-task-empty > span:last-child{
      display:block!important;
      color:#f8f7f3!important;
      font-size:15px!important;
      line-height:1.12!important;
      font-weight:650!important;
      letter-spacing:-.12px!important;
    }

    #client-main .dch-task-empty > span:last-child::after{
      content:'No hay tareas pendientes por ahora.';
      display:block;
      margin-top:4px;
      color:#959da8;
      font-size:9.7px;
      line-height:1.3;
      font-weight:480;
      letter-spacing:0;
    }

    #client-main .dch-task-row{
      position:relative!important;
      z-index:2!important;
      min-height:64px!important;
      grid-template-columns:38px minmax(0,1fr) 16px!important;
      gap:10px!important;
      padding:8px 15px!important;
    }

    #client-main .dch-task-row .dch-iconbox{
      width:38px!important;
      height:38px!important;
      border-color:rgba(240,201,107,.54)!important;
      background:linear-gradient(145deg,rgba(217,170,74,.11),rgba(10,13,16,.94))!important;
      box-shadow:0 0 13px rgba(217,170,74,.055)!important;
    }

    #client-main .dch-task-title{
      font-size:14px!important;
      font-weight:650!important;
    }

    #client-main .dch-task-meta{
      margin-top:3px!important;
      color:#929aa5!important;
      font-size:9.7px!important;
      line-height:1.3!important;
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
        right:-42px;
        top:-24px;
        width:335px;
        height:170px;
      }
      #client-main .dch-wrap::after{
        right:-58px;
        top:-5px;
        width:285px;
        height:160px;
      }
      #client-main .dch-welcome{
        min-height:61px!important;
        margin-bottom:11px!important;
      }
      #client-main .dch-name{
        max-width:68%!important;
        font-size:22.5px!important;
        font-weight:400!important;
        letter-spacing:-.12px!important;
      }
      #client-main .dch-welcome::after{
        right:0;
        top:9px;
        width:98px;
        font-size:5.9px;
        letter-spacing:1.75px;
      }
      #client-main .dch-task-head{
        min-height:41px!important;
        height:41px!important;
        padding:0 13px!important;
        font-size:8.5px!important;
      }
      #client-main .dch-task-head::after{left:13px!important}
      #client-main .dch-task-empty{
        min-height:66px!important;
        grid-template-columns:37px minmax(0,1fr)!important;
        gap:10px!important;
        padding:8px 13px!important;
      }
      #client-main .dch-task-empty .dch-iconbox{
        width:37px!important;
        height:37px!important;
      }
      #client-main .dch-task-empty > span:last-child{
        font-size:14.2px!important;
      }
      #client-main .dch-task-empty > span:last-child::after{
        font-size:9.2px!important;
      }
      #client-main .dch-task-card::after{
        right:-7px;
        bottom:-1px;
        width:61%;
        height:70%;
      }
    }

    @media(prefers-reduced-motion:reduce){
      #client-main .dch-wrap::before,
      #client-main .dch-wrap::after,
      #client-main .dch-task-card::before,
      #client-main .dch-task-card::after{
        filter:none!important;
      }
    }
  `;
  document.head.appendChild(style);
})();
