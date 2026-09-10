/* DCC — Entrenamiento: ilustraciones precargadas + disco premium */
(function(){
  'use strict';

  /*
    Las ilustraciones musculares se crean al entrar en Entrenamiento. Si el
    navegador empieza a descargarlas en ese momento, Safari las pinta con un
    pequeño retraso. Las calentamos al cargar la app para que estén en caché
    antes de abrir la pestaña.
  */
  const illustrationAssets=[
    './pecho.png',
    './triceps.png',
    './espalda.png',
    './hombros.png',
    './biceps.png',
    './cuadriceps.png',
    './isquios-femoral.png',
    './gluteos.png',
    './gemelos.png',
    './core-abdomen.png',
    './lumbar-cuello.png',
    './assets/next-workout-plate.jpg'
  ];

  if(!window.__dccTrainingIllustrationPreload){
    window.__dccTrainingIllustrationPreload=[];

    illustrationAssets.forEach((src,index)=>{
      if(!document.querySelector(`link[data-dcc-training-preload="${src}"]`)){
        const link=document.createElement('link');
        link.rel='preload';
        link.as='image';
        link.href=src;
        link.dataset.dccTrainingPreload=src;
        if(index<2 || src.includes('next-workout-plate')) link.fetchPriority='high';
        document.head.appendChild(link);
      }

      const img=new Image();
      img.decoding='async';
      if(index<2 || src.includes('next-workout-plate')) img.fetchPriority='high';
      img.src=src;
      window.__dccTrainingIllustrationPreload.push(img);
    });
  }

  if(document.getElementById('dcc-training-routine-plate-v1')) return;

  const style=document.createElement('style');
  style.id='dcc-training-routine-plate-v1';
  style.textContent=`
    #client-main .dct-routine-card{
      position:relative!important;
      isolation:isolate!important;
      overflow:hidden!important;
      background:
        radial-gradient(circle at 100% 0,rgba(217,170,74,.08),transparent 40%),
        linear-gradient(145deg,#15191f,#0a0e13 74%)!important;
    }

    #client-main .dct-routine-card::before{
      content:"";
      position:absolute;
      top:0;
      right:0;
      width:46%;
      height:156px;
      z-index:0;
      pointer-events:none;
      background-image:url("./assets/next-workout-plate.jpg");
      background-repeat:no-repeat;
      background-position:right center;
      background-size:cover;
      opacity:.42;
      filter:brightness(.67) contrast(1.08) saturate(.82);
      -webkit-mask-image:linear-gradient(90deg,transparent 0%,rgba(0,0,0,.42) 24%,#000 58%,#000 100%);
      mask-image:linear-gradient(90deg,transparent 0%,rgba(0,0,0,.42) 24%,#000 58%,#000 100%);
    }

    #client-main .dct-routine-card::after{
      content:"";
      position:absolute;
      top:0;
      right:0;
      width:100%;
      height:156px;
      z-index:1;
      pointer-events:none;
      background:linear-gradient(90deg,
        rgba(12,16,21,.52) 0%,
        rgba(12,16,21,.48) 28%,
        rgba(12,16,21,.40) 48%,
        rgba(12,16,21,.20) 72%,
        rgba(12,16,21,.04) 100%);
    }

    #client-main .dct-routine-card > *{
      position:relative;
      z-index:2;
    }

    #client-main .dct-routine-card .dct-routine-icon{
      background:rgba(10,13,17,.70)!important;
      backdrop-filter:blur(2px);
      -webkit-backdrop-filter:blur(2px);
    }

    #client-main .dct-routine-card .dct-view-exercises{
      background:rgba(8,11,15,.82)!important;
      backdrop-filter:blur(3px);
      -webkit-backdrop-filter:blur(3px);
    }

    /* Sesión activa: versión compacta aprobada del botón "Ver técnica". */
    @media(max-width:520px){
      #client-main .dwa3-actions{
        grid-template-columns:max-content 116px!important;
        justify-content:space-between!important;
        align-items:center!important;
        gap:12px!important;
      }

      #client-main .dwa3-tech{
        width:auto!important;
        min-width:0!important;
        min-height:40px!important;
        padding:0 17px!important;
        gap:8px!important;
        border-radius:13px!important;
        font-size:11px!important;
        white-space:nowrap!important;
      }

      #client-main .dwa3-tech svg{
        width:17px!important;
        height:17px!important;
      }

      #client-main .dwa3-elapsed{
        width:116px!important;
        min-height:40px!important;
        grid-template-columns:27px minmax(0,1fr)!important;
        padding:6px 9px!important;
        border-radius:13px!important;
      }
    }

    /* =====================================================
       SESIÓN ACTIVA — HERO PREMIUM
       Mantiene el chip PECTORAL tal cual, sin icono extra.
       No añade texto "Técnica en vídeo": la acción ya está abajo.
    ====================================================== */
    html body #client-main .dwa3 .dwa3-top{
      position:relative!important;
      isolation:isolate!important;
      overflow:hidden!important;
      padding:14px!important;
      margin:0 0 12px!important;
      border:1px solid rgba(230,177,70,.74)!important;
      border-radius:21px!important;
      background:
        radial-gradient(circle at 79% 3%,rgba(255,225,143,.16) 0%,rgba(225,175,71,.055) 20%,transparent 42%),
        radial-gradient(circle at 8% 104%,rgba(217,170,74,.075),transparent 36%),
        linear-gradient(145deg,#171b21 0%,#0f1319 54%,#090c11 100%)!important;
      box-shadow:
        0 18px 40px rgba(0,0,0,.32),
        0 0 22px rgba(217,170,74,.075),
        inset 0 1px 0 rgba(255,255,255,.045),
        inset 0 0 0 1px rgba(217,170,74,.035)!important;
    }

    html body #client-main .dwa3 .dwa3-top::before{
      content:"";
      position:absolute;
      inset:-1px;
      z-index:0;
      pointer-events:none;
      background:
        linear-gradient(151deg,
          transparent 0%,
          transparent 57%,
          rgba(240,194,86,.025) 60%,
          rgba(255,218,126,.20) 60.5%,
          rgba(217,170,74,.045) 61.2%,
          transparent 64%,
          transparent 100%),
        linear-gradient(180deg,rgba(255,255,255,.025),transparent 28%);
      opacity:.95;
    }

    html body #client-main .dwa3 .dwa3-top::after{
      content:"";
      position:absolute;
      z-index:0;
      pointer-events:none;
      width:220px;
      height:160px;
      right:-76px;
      top:-88px;
      border-radius:50%;
      background:radial-gradient(circle,rgba(255,226,143,.18) 0%,rgba(217,170,74,.055) 34%,transparent 70%);
      filter:blur(5px);
    }

    html body #client-main .dwa3 .dwa3-top > *{
      position:relative!important;
      z-index:2!important;
    }

    html body #client-main .dwa3 .dwa3-back{
      border-color:rgba(255,255,255,.16)!important;
      background:linear-gradient(145deg,rgba(29,34,41,.98),rgba(9,12,16,.98))!important;
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,.05),
        0 0 0 1px rgba(217,170,74,.035),
        0 8px 18px rgba(0,0,0,.22)!important;
    }

    html body #client-main .dwa3 .dwa3-media{
      position:relative!important;
      overflow:hidden!important;
      border-color:rgba(232,181,76,.78)!important;
      background:
        radial-gradient(circle at 72% 18%,rgba(255,225,140,.12),transparent 34%),
        linear-gradient(145deg,#171b20 0%,#0b0f14 68%,#080a0d 100%)!important;
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,.045),
        inset 0 0 26px rgba(217,170,74,.035),
        0 10px 24px rgba(0,0,0,.25),
        0 0 17px rgba(217,170,74,.08)!important;
    }

    html body #client-main .dwa3 .dwa3-media::after{
      content:"";
      position:absolute;
      left:10%;
      right:10%;
      top:0;
      height:1px;
      pointer-events:none;
      background:linear-gradient(90deg,transparent,rgba(255,222,133,.65),transparent);
      opacity:.8;
    }

    html body #client-main .dwa3 .dwa3-media img{
      position:relative!important;
      z-index:1!important;
      filter:contrast(1.04) saturate(.88) brightness(.90)!important;
    }

    html body #client-main .dwa3 .dwa3-badge.gold{
      border-color:rgba(235,183,75,.78)!important;
      background:linear-gradient(145deg,rgba(217,170,74,.12),rgba(217,170,74,.035))!important;
      box-shadow:inset 0 1px 0 rgba(255,255,255,.035),0 0 12px rgba(217,170,74,.055)!important;
    }

    html body #client-main .dwa3 .dwa3-tech,
    html body #client-main .dwa3 .dwa3-elapsed{
      border-color:rgba(232,181,76,.78)!important;
      background:
        radial-gradient(circle at 50% 0%,rgba(236,188,83,.10),transparent 72%),
        linear-gradient(145deg,#15191e,#0a0e13)!important;
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,.035),
        0 8px 18px rgba(0,0,0,.20),
        0 0 12px rgba(217,170,74,.055)!important;
    }

    html body #client-main .dwa3 .dwa3-tech{
      color:#f6f3eb!important;
      font-weight:720!important;
    }

    html body #client-main .dwa3 .dwa3-tech::after{
      content:"›";
      margin-left:1px;
      color:#efbd54;
      font-size:18px;
      line-height:1;
      font-weight:500;
      transform:translateY(-1px);
    }

    html body #client-main .dwa3 .dwa3-elapsed-icon{
      border:1px solid rgba(217,170,74,.10)!important;
      background:linear-gradient(145deg,rgba(217,170,74,.12),rgba(217,170,74,.035))!important;
      box-shadow:inset 0 1px 0 rgba(255,255,255,.025)!important;
    }

    @media(max-width:390px){
      #client-main .dct-routine-card::before{
        width:48%;
        height:142px;
        opacity:.40;
      }
      #client-main .dct-routine-card::after{
        width:100%;
        height:142px;
      }

      #client-main .dwa3-actions{
        grid-template-columns:max-content 112px!important;
        gap:10px!important;
      }

      #client-main .dwa3-tech{
        min-height:39px!important;
        padding:0 15px!important;
      }

      #client-main .dwa3-elapsed{
        width:112px!important;
        min-height:39px!important;
      }

      html body #client-main .dwa3 .dwa3-top{
        padding:12px!important;
        border-radius:19px!important;
      }

      html body #client-main .dwa3 .dwa3-media{
        border-radius:15px!important;
      }
    }
  `;
  document.head.appendChild(style);
})();