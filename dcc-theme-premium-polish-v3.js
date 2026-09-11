/* DCC — Light Premium V3: navegación premium + disco nítido. Solo presentación. */
(function(){
  'use strict';
  if(window.__dccThemePremiumPolishV3)return;
  window.__dccThemePremiumPolishV3=true;

  const STYLE_ID='dcc-theme-premium-polish-v3-css';

  function installStyles(){
    if(document.getElementById(STYLE_ID))return;
    const style=document.createElement('style');
    style.id=STYLE_ID;
    style.textContent=`
      @keyframes dcc-premium-nav-glow{
        0%{box-shadow:0 0 0 1px rgba(255,216,116,.72),0 0 12px rgba(244,187,58,.45),0 7px 18px rgba(0,0,0,.28),inset 0 1px 0 rgba(255,255,255,.72)}
        48%{box-shadow:0 0 0 2px rgba(255,222,132,.96),0 0 27px rgba(255,194,57,.84),0 9px 24px rgba(0,0,0,.34),inset 0 1px 0 rgba(255,255,255,.88)}
        100%{box-shadow:0 0 0 1px rgba(255,216,116,.72),0 0 14px rgba(244,187,58,.50),0 7px 18px rgba(0,0,0,.28),inset 0 1px 0 rgba(255,255,255,.72)}
      }

      html.dcc-theme-light-premium body{
        background:#f5efe4!important;
      }

      /* BARRA PREMIUM FINAL — CLIENTE Y ENTRENADOR */
      html.dcc-theme-light-premium body #client-nav,
      html.dcc-theme-light-premium body #coach-nav{
        background:linear-gradient(180deg,#24221c 0%,#111210 55%,#1d1b16 100%)!important;
        border:1.5px solid #d9a83d!important;
        box-shadow:0 0 0 1px rgba(255,220,125,.20),0 10px 26px rgba(65,43,8,.28),0 0 18px rgba(217,168,61,.12),inset 0 1px 0 rgba(255,233,171,.16)!important;
        backdrop-filter:blur(18px)!important;
        -webkit-backdrop-filter:blur(18px)!important;
        overflow:visible!important;
      }
      html.dcc-theme-light-premium body #client-nav::before,
      html.dcc-theme-light-premium body #client-nav::after,
      html.dcc-theme-light-premium body #coach-nav::before,
      html.dcc-theme-light-premium body #coach-nav::after{
        background:transparent!important;
        box-shadow:none!important;
      }
      html.dcc-theme-light-premium body #client-nav button,
      html.dcc-theme-light-premium body #coach-nav button{
        background:transparent!important;
        color:#efbf55!important;
        border:1px solid transparent!important;
        box-shadow:none!important;
        text-shadow:0 0 8px rgba(239,191,85,.16)!important;
        transition:transform .18s ease,box-shadow .22s ease,background .22s ease,border-color .22s ease!important;
      }
      html.dcc-theme-light-premium body #client-nav button svg,
      html.dcc-theme-light-premium body #coach-nav button svg{
        color:#efbf55!important;
        stroke:currentColor!important;
        filter:drop-shadow(0 0 5px rgba(239,191,85,.22))!important;
      }
      html.dcc-theme-light-premium body #client-nav button span,
      html.dcc-theme-light-premium body #coach-nav button span{
        color:#efd488!important;
      }
      html.dcc-theme-light-premium body #client-nav button.active,
      html.dcc-theme-light-premium body #coach-nav button.active{
        background:linear-gradient(145deg,#ffe9a5 0%,#f2c55f 42%,#d79d2f 100%)!important;
        color:#181207!important;
        border:1.5px solid #ffe49a!important;
        transform:translateY(-2px) scale(1.015)!important;
        animation:dcc-premium-nav-glow 1.8s ease-in-out infinite!important;
      }
      html.dcc-theme-light-premium body #client-nav button.active svg,
      html.dcc-theme-light-premium body #coach-nav button.active svg{
        color:#181207!important;
        stroke:currentColor!important;
        filter:drop-shadow(0 1px 0 rgba(255,255,255,.22))!important;
      }
      html.dcc-theme-light-premium body #client-nav button.active span,
      html.dcc-theme-light-premium body #coach-nav button.active span{
        color:#181207!important;
        font-weight:750!important;
      }

      /* Evita cualquier banda negra exterior detrás de la barra */
      html.dcc-theme-light-premium body,
      html.dcc-theme-light-premium .app,
      html.dcc-theme-light-premium #client-main,
      html.dcc-theme-light-premium #coach-main{
        background-color:#f5efe4!important;
      }

      /* TARJETA PRÓXIMO ENTRENAMIENTO — disco más grande, definido y con menos velo */
      html.dcc-theme-light-premium #client-main .dch-next{
        position:relative!important;
        overflow:hidden!important;
        isolation:isolate!important;
        background:
          linear-gradient(90deg,#fffdf8 0%,#f8eedc 34%,rgba(248,238,220,.93) 43%,rgba(248,238,220,.48) 55%,rgba(12,14,16,.04) 67%,rgba(8,10,13,.10) 100%),
          url('./assets/next-workout-plate.jpg') right center / auto 128% no-repeat!important;
        border:1px solid rgba(193,132,28,.68)!important;
        box-shadow:0 14px 34px rgba(66,47,20,.14)!important;
      }
      html.dcc-theme-light-premium #client-main .dch-next::after{
        content:''!important;
        position:absolute!important;
        inset:0 0 0 auto!important;
        width:51%!important;
        pointer-events:none!important;
        background:linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,0) 62%,rgba(255,190,58,.05))!important;
        mix-blend-mode:screen!important;
        z-index:0!important;
      }
      html.dcc-theme-light-premium #client-main .dch-next>*{
        position:relative!important;
        z-index:1!important;
      }
      html.dcc-theme-light-premium #client-main .dch-next-name{
        color:#17191d!important;
        font-weight:400!important;
      }
      html.dcc-theme-light-premium #client-main .dch-next-day{color:#657080!important}
    `;
    document.head.appendChild(style);
  }

  function forcePremiumNav(){
    if(!document.documentElement.classList.contains('dcc-theme-light-premium'))return;
    ['client-nav','coach-nav'].forEach(id=>{
      const nav=document.getElementById(id);
      if(!nav)return;
      nav.style.setProperty('background','linear-gradient(180deg,#24221c 0%,#111210 55%,#1d1b16 100%)','important');
      nav.style.setProperty('border','1.5px solid #d9a83d','important');
      nav.style.setProperty('box-shadow','0 0 0 1px rgba(255,220,125,.20),0 10px 26px rgba(65,43,8,.28),0 0 18px rgba(217,168,61,.12),inset 0 1px 0 rgba(255,233,171,.16)','important');
      nav.querySelectorAll('button').forEach(btn=>{
        btn.style.setProperty('color','#efbf55','important');
        const active=btn.classList.contains('active');
        if(active){
          btn.style.setProperty('background','linear-gradient(145deg,#ffe9a5 0%,#f2c55f 42%,#d79d2f 100%)','important');
          btn.style.setProperty('border','1.5px solid #ffe49a','important');
          btn.style.setProperty('box-shadow','0 0 0 2px rgba(255,220,125,.80),0 0 25px rgba(244,187,58,.80),0 8px 22px rgba(0,0,0,.30),inset 0 1px 0 rgba(255,255,255,.78)','important');
        }else{
          btn.style.setProperty('background','transparent','important');
          btn.style.setProperty('border','1px solid transparent','important');
          btn.style.setProperty('box-shadow','none','important');
        }
      });
    });
  }

  let queued=false;
  function schedule(){
    if(queued)return;
    queued=true;
    requestAnimationFrame(()=>{
      queued=false;
      installStyles();
      forcePremiumNav();
    });
  }

  installStyles();
  document.addEventListener('DOMContentLoaded',schedule);
  window.addEventListener('dcc:themechange',schedule);
  document.addEventListener('click',e=>{
    if(e.target.closest('#client-nav button,#coach-nav button'))setTimeout(schedule,0);
  },true);
  const observer=new MutationObserver(schedule);
  observer.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class','style']});
  schedule();
})();