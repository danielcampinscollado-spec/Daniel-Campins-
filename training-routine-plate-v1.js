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
    }
  `;
  document.head.appendChild(style);
})();