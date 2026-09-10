/* DCC — Selector de días compacto: preparado para rutinas de hasta 7 días */
(function(){
  'use strict';
  if(document.getElementById('dcc-training-days-compact-v3')) return;

  const style=document.createElement('style');
  style.id='dcc-training-days-compact-v3';
  style.textContent=`
    #client-main .dct-days{
      gap:5px!important;
      margin-bottom:12px!important;
    }

    #client-main .dct-day{
      height:48px!important;
      min-height:48px!important;
      padding:0 2px!important;
      border-radius:13px!important;
      gap:2px!important;
    }

    #client-main .dct-day span{
      font-size:6.6px!important;
      line-height:1!important;
      font-weight:850!important;
      letter-spacing:1.05px!important;
    }

    #client-main .dct-day strong{
      font-size:16px!important;
      line-height:1!important;
      font-weight:720!important;
      letter-spacing:-.2px!important;
    }

    @media(max-width:760px){
      #client-main .dct-days{
        gap:4px!important;
      }

      #client-main .dct-day{
        height:46px!important;
        min-height:46px!important;
        border-radius:12px!important;
      }

      #client-main .dct-day span{
        font-size:6.2px!important;
        letter-spacing:.9px!important;
      }

      #client-main .dct-day strong{
        font-size:15px!important;
        font-weight:700!important;
      }
    }

    @media(max-width:390px){
      #client-main .dct-days{
        gap:3px!important;
      }

      #client-main .dct-day{
        height:44px!important;
        min-height:44px!important;
        border-radius:11px!important;
      }

      #client-main .dct-day span{
        font-size:5.8px!important;
        letter-spacing:.75px!important;
      }

      #client-main .dct-day strong{
        font-size:14px!important;
      }
    }
  `;
  document.head.appendChild(style);
})();