/* DCC — Disco premium en tarjeta de ejercicios */
(function(){
  'use strict';

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
    }

    #client-main .dct-routine-card::after{
      content:"";
      position:absolute;
      top:0;
      right:0;
      width:64%;
      height:156px;
      z-index:1;
      pointer-events:none;
      background:linear-gradient(90deg,
        rgba(12,16,21,1) 0%,
        rgba(12,16,21,.91) 21%,
        rgba(12,16,21,.66) 48%,
        rgba(12,16,21,.22) 76%,
        rgba(12,16,21,.05) 100%);
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

    @media(max-width:390px){
      #client-main .dct-routine-card::before{
        width:48%;
        height:142px;
        opacity:.40;
      }
      #client-main .dct-routine-card::after{
        width:67%;
        height:142px;
      }
    }
  `;
  document.head.appendChild(style);
})();