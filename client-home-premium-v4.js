/* DCC — Inicio cliente premium v4: encabezado elegante + efectos premium dorados */
(function(){
  if(document.getElementById('dcc-client-home-premium-v4-css')) return;

  const style=document.createElement('style');
  style.id='dcc-client-home-premium-v4-css';
  style.textContent=`
    /* ===============================
       CONTENEDOR / AMBIENTE
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
      top:-36px;
      right:-78px;
      width:360px;
      height:250px;
      background:
        radial-gradient(ellipse at 70% 20%,rgba(240,201,107,.11) 0%,rgba(217,170,74,.055) 26%,transparent 62%),
        linear-gradient(152deg,transparent 18%,rgba(240,201,107,.045) 39%,rgba(240,201,107,.012) 54%,transparent 70%);
      filter:blur(2px);
      opacity:.92;
      transform:translateZ(0);
    }

    /* ===============================
       ENCABEZADO CLIENTE
    =============================== */
    #client-main .dch-welcome{
      position:relative!important;
      min-height:76px!important;
      margin:0 0 14px!important;
      padding:5px 2px 8px!important;
      overflow:visible!important;
      background:
        linear-gradient(152deg,transparent 53%,rgba(240,201,107,.055) 65%,transparent 78%),
        radial-gradient(ellipse at 94% 17%,rgba(240,201,107,.10),transparent 48%)!important;
    }

    #client-main .dch-eyebrow{
      margin:0 0 8px!important;
      color:#e7b64d!important;
      font-size:10px!important;
      line-height:1!important;
      font-weight:850!important;
      letter-spacing:3.1px!important;
      text-transform:uppercase!important;
      text-shadow:0 0 14px rgba(231,182,77,.10);
    }

    #client-main .dch-name{
      margin:0!important;
      max-width:72%!important;
      color:#f7f5f0!important;
      font-size:31px!important;
      line-height:1.03!important;
      font-weight:650!important;
      letter-spacing:-.85px!important;
      white-space:normal!important;
      text-wrap:balance!important;
      text-shadow:0 2px 18px rgba(0,0,0,.28);
    }

    #client-main .dch-welcome::before{
      content:'';
      position:absolute;
      left:2px;
      bottom:0;
      width:27px;
      height:2px;
      border-radius:999px;
      background:linear-gradient(90deg,#f0c96b,#d9aa4a);
      box-shadow:0 0 12px rgba(240,201,107,.28);
    }

    #client-main .dch-welcome::after{
      content:'DISCIPLINA\\A HOY, RESULTADOS\\A SIEMPRE';
      white-space:pre;
      position:absolute;
      right:3px;
      top:11px;
      width:112px;
      color:#8f9298;
      font-size:7px;
      line-height:1.75;
      font-weight:600;
      letter-spacing:2.2px;
      text-align:left;
      opacity:.82;
      pointer-events:none;
      text-shadow:0 0 16px rgba(240,201,107,.08);
    }

    /* ===============================
       TARJETA TAREAS PENDIENTES
    =============================== */
    #client-main .dch-task-card{
      position:relative!important;
      border-color:rgba(236,185,78,.78)!important;
      background:
        radial-gradient(circle at 92% 12%,rgba(240,201,107,.17),transparent 30%),
        radial-gradient(circle at 9% 95%,rgba(217,170,74,.075),transparent 31%),
        linear-gradient(145deg,#171b21 0%,#0c1116 58%,#070a0d 100%)!important;
      box-shadow:
        0 16px 38px rgba(0,0,0,.31),
        inset 0 1px 0 rgba(255,255,255,.045),
        inset 0 0 28px rgba(217,170,74,.025),
        0 0 28px rgba(217,170,74,.07)!important;
      overflow:hidden!important;
      transform:translateZ(0);
    }

    #client-main .dch-task-card::before{
      content:'';
      position:absolute;
      pointer-events:none;
      z-index:0;
      left:-88px;
      top:-78px;
      width:255px;
      height:210px;
      border-radius:50%;
      background:radial-gradient(circle,rgba(240,201,107,.115) 0%,rgba(217,170,74,.045) 31%,transparent 67%);
      filter:blur(7px);
      opacity:.9;
    }

    #client-main .dch-task-card::after{
      content:'';
      position:absolute;
      pointer-events:none;
      z-index:0;
      right:-56px;
      bottom:-55px;
      width:285px;
      height:175px;
      border-radius:50%;
      background:
        repeating-radial-gradient(
          ellipse at 83% 86%,
          rgba(240,201,107,.22) 0 1px,
          transparent 1.3px 10px
        );
      transform:rotate(-13deg) scaleX(1.08);
      opacity:.27;
      filter:drop-shadow(0 0 5px rgba(240,201,107,.13));
    }

    #client-main .dch-task-head{
      position:relative!important;
      z-index:2!important;
      min-height:56px!important;
      padding:0 17px!important;
      border-bottom:1px solid rgba(255,255,255,.075)!important;
      color:#efbd54!important;
      font-size:10px!important;
      font-weight:850!important;
      letter-spacing:2.7px!important;
      text-shadow:0 0 13px rgba(239,189,84,.11);
    }

    #client-main .dch-task-head::after{
      content:'';
      position:absolute;
      left:17px;
      bottom:-1px;
      width:38px;
      height:1px;
      background:linear-gradient(90deg,#efbd54,rgba(239,189,84,.2),transparent);
      box-shadow:0 0 9px rgba(233,184,77,.32);
    }

    #client-main .dch-task-count{
      min-width:31px!important;
      height:31px!important;
      padding:0 9px!important;
      border-color:rgba(240,201,107,.48)!important;
      background:
        radial-gradient(circle at 50% 12%,rgba(240,201,107,.17),transparent 65%),
        linear-gradient(145deg,rgba(217,170,74,.17),rgba(217,170,74,.055))!important;
      color:#f4cb69!important;
      font-size:12px!important;
      font-weight:800!important;
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,.045),
        0 0 14px rgba(217,170,74,.07)!important;
    }

    #client-main .dch-task-empty{
      position:relative!important;
      z-index:2!important;
      min-height:94px!important;
      display:grid!important;
      grid-template-columns:48px minmax(0,1fr)!important;
      align-items:center!important;
      gap:14px!important;
      padding:15px 17px!important;
      color:#f7f5f0!important;
    }

    #client-main .dch-task-empty .dch-iconbox{
      width:48px!important;
      height:48px!important;
      border:1px solid rgba(240,201,107,.82)!important;
      border-radius:15px!important;
      background:
        radial-gradient(circle at 50% 10%,rgba(255,226,146,.30),transparent 57%),
        linear-gradient(145deg,#2b220f,#11100c)!important;
      color:#f4cb69!important;
      box-shadow:
        inset 0 0 0 1px rgba(255,224,141,.07),
        inset 0 0 18px rgba(240,201,107,.045),
        0 0 22px rgba(217,170,74,.16)!important;
    }

    #client-main .dch-task-empty .dch-iconbox svg{
      width:23px!important;
      height:23px!important;
      stroke-width:2!important;
      filter:drop-shadow(0 0 5px rgba(240,201,107,.15));
    }

    #client-main .dch-task-empty > span:last-child{
      display:block!important;
      color:#f8f7f3!important;
      font-size:18px!important;
      line-height:1.15!important;
      font-weight:720!important;
      letter-spacing:-.25px!important;
      text-shadow:0 2px 12px rgba(0,0,0,.24);
    }

    #client-main .dch-task-empty > span:last-child::after{
      content:'No hay tareas pendientes por ahora.';
      display:block;
      margin-top:6px;
      color:#959da8;
      font-size:11px;
      line-height:1.35;
      font-weight:500;
      letter-spacing:0;
    }

    #client-main .dch-task-row{
      position:relative!important;
      z-index:2!important;
      min-height:78px!important;
      grid-template-columns:44px minmax(0,1fr) 18px!important;
      gap:12px!important;
      padding:12px 17px!important;
    }

    #client-main .dch-task-row .dch-iconbox{
      width:44px!important;
      height:44px!important;
      border-color:rgba(240,201,107,.58)!important;
      background:
        radial-gradient(circle at 50% 10%,rgba(240,201,107,.16),transparent 65%),
        linear-gradient(145deg,rgba(217,170,74,.13),rgba(10,13,16,.94))!important;
      box-shadow:0 0 16px rgba(217,170,74,.07)!important;
    }

    #client-main .dch-task-title{
      font-size:15.5px!important;
      font-weight:740!important;
    }

    #client-main .dch-task-meta{
      margin-top:5px!important;
      color:#929aa5!important;
      font-size:10.5px!important;
      line-height:1.35!important;
    }

    /* ===============================
       RESTO DE TARJETAS: EFECTO SUTIL
    =============================== */
    #client-main .dch-progress{
      position:relative!important;
      overflow:hidden!important;
      background:
        radial-gradient(circle at 11% 50%,rgba(240,201,107,.055),transparent 31%),
        radial-gradient(circle at 98% 0%,rgba(217,170,74,.085),transparent 35%),
        linear-gradient(145deg,#171b21 0%,#0e1217 58%,#090c10 100%)!important;
      box-shadow:
        0 14px 30px rgba(0,0,0,.25),
        inset 0 1px 0 rgba(255,255,255,.035),
        0 0 20px rgba(217,170,74,.035)!important;
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
      background:radial-gradient(circle,rgba(240,201,107,.075),transparent 68%);
      filter:blur(5px);
    }

    #client-main .dch-next{
      position:relative!important;
      box-shadow:
        0 16px 34px rgba(0,0,0,.28),
        inset 0 1px 0 rgba(255,255,255,.035),
        0 0 22px rgba(217,170,74,.045)!important;
    }

    #client-main .dch-stat{
      box-shadow:
        0 11px 25px rgba(0,0,0,.23),
        inset 0 1px 0 rgba(255,255,255,.032),
        0 0 16px rgba(217,170,74,.026)!important;
    }

    @media(max-width:390px){
      #client-main .dch-wrap::before{
        right:-104px;
        top:-32px;
        width:320px;
        height:220px;
        opacity:.78;
      }
      #client-main .dch-welcome{
        min-height:69px!important;
        margin-bottom:12px!important;
      }
      #client-main .dch-name{
        max-width:70%!important;
        font-size:27px!important;
        letter-spacing:-.65px!important;
      }
      #client-main .dch-welcome::after{
        right:0;
        top:10px;
        width:102px;
        font-size:6.2px;
        letter-spacing:1.8px;
      }
      #client-main .dch-task-head{
        min-height:52px!important;
        padding:0 14px!important;
        font-size:9px!important;
      }
      #client-main .dch-task-head::after{left:14px!important}
      #client-main .dch-task-empty{
        min-height:88px!important;
        grid-template-columns:44px minmax(0,1fr)!important;
        gap:12px!important;
        padding:13px 14px!important;
      }
      #client-main .dch-task-empty .dch-iconbox{
        width:44px!important;
        height:44px!important;
      }
      #client-main .dch-task-empty > span:last-child{
        font-size:16px!important;
      }
      #client-main .dch-task-empty > span:last-child::after{
        font-size:10px!important;
      }
      #client-main .dch-task-card::after{
        right:-72px;
        bottom:-52px;
        opacity:.22;
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
