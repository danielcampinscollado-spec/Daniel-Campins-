/* DCC — Inicio cliente premium v4: encabezado más elegante + tareas premium */
(function(){
  if(document.getElementById('dcc-client-home-premium-v4-css')) return;

  const style=document.createElement('style');
  style.id='dcc-client-home-premium-v4-css';
  style.textContent=`
    /* ===============================
       ENCABEZADO CLIENTE
    =============================== */
    #client-main .dch-welcome{
      position:relative!important;
      min-height:76px!important;
      margin:0 0 14px!important;
      padding:5px 2px 8px!important;
    }

    #client-main .dch-eyebrow{
      margin:0 0 8px!important;
      color:#e7b64d!important;
      font-size:10px!important;
      line-height:1!important;
      font-weight:850!important;
      letter-spacing:3.1px!important;
      text-transform:uppercase!important;
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
      box-shadow:0 0 10px rgba(240,201,107,.18);
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
    }

    /* ===============================
       TARJETA TAREAS PENDIENTES
    =============================== */
    #client-main .dch-task-card{
      position:relative!important;
      border-color:rgba(236,185,78,.74)!important;
      background:
        radial-gradient(circle at 91% 18%,rgba(240,201,107,.14),transparent 30%),
        radial-gradient(circle at 6% 92%,rgba(217,170,74,.055),transparent 30%),
        linear-gradient(145deg,#151a20 0%,#0c1116 58%,#070a0d 100%)!important;
      box-shadow:
        0 15px 34px rgba(0,0,0,.28),
        inset 0 1px 0 rgba(255,255,255,.035),
        0 0 24px rgba(217,170,74,.055)!important;
      overflow:hidden!important;
    }

    #client-main .dch-task-card::after{
      content:'';
      position:absolute;
      right:-36px;
      bottom:-42px;
      width:210px;
      height:120px;
      border-radius:50%;
      border:1px solid rgba(240,201,107,.13);
      box-shadow:
        0 -8px 0 -7px rgba(240,201,107,.13),
        0 -16px 0 -15px rgba(240,201,107,.11),
        0 -24px 0 -23px rgba(240,201,107,.09),
        0 -32px 0 -31px rgba(240,201,107,.07);
      transform:rotate(-14deg);
      pointer-events:none;
      opacity:.75;
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
    }

    #client-main .dch-task-head::after{
      content:'';
      position:absolute;
      left:17px;
      bottom:-1px;
      width:31px;
      height:1px;
      background:linear-gradient(90deg,#e9b84d,transparent);
      box-shadow:0 0 8px rgba(233,184,77,.24);
    }

    #client-main .dch-task-count{
      min-width:31px!important;
      height:31px!important;
      padding:0 9px!important;
      border-color:rgba(240,201,107,.43)!important;
      background:linear-gradient(145deg,rgba(217,170,74,.16),rgba(217,170,74,.055))!important;
      color:#f4cb69!important;
      font-size:12px!important;
      font-weight:800!important;
      box-shadow:inset 0 1px 0 rgba(255,255,255,.035)!important;
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
      border:1px solid rgba(240,201,107,.73)!important;
      border-radius:15px!important;
      background:
        radial-gradient(circle at 50% 15%,rgba(240,201,107,.28),transparent 63%),
        linear-gradient(145deg,#2a210f,#12100b)!important;
      color:#f0c96b!important;
      box-shadow:
        inset 0 0 0 1px rgba(255,224,141,.06),
        0 0 18px rgba(217,170,74,.14)!important;
    }

    #client-main .dch-task-empty .dch-iconbox svg{
      width:23px!important;
      height:23px!important;
      stroke-width:2!important;
    }

    #client-main .dch-task-empty > span:last-child{
      display:block!important;
      color:#f8f7f3!important;
      font-size:18px!important;
      line-height:1.15!important;
      font-weight:720!important;
      letter-spacing:-.25px!important;
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
      border-color:rgba(240,201,107,.50)!important;
      background:linear-gradient(145deg,rgba(217,170,74,.13),rgba(10,13,16,.94))!important;
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

    @media(max-width:390px){
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
    }
  `;
  document.head.appendChild(style);
})();
