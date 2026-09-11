/* DCC — Light Premium V5: barra premium estable + disco completo. Solo presentación. */
(function(){
  'use strict';
  if(window.__dccThemePremiumPolishV5)return;
  window.__dccThemePremiumPolishV5=true;

  const STYLE_ID='dcc-theme-premium-polish-v5-css';

  function installStyles(){
    ['dcc-theme-premium-polish-v3-css','dcc-theme-premium-polish-v4-css'].forEach(id=>document.getElementById(id)?.remove());
    if(document.getElementById(STYLE_ID))return;
    const style=document.createElement('style');
    style.id=STYLE_ID;
    style.textContent=`
      @keyframes dcc-nav-selected-pulse-v5{
        0%,100%{box-shadow:0 0 0 1px rgba(255,224,139,.95),0 0 13px rgba(244,187,58,.48),inset 0 1px 0 rgba(255,255,255,.82),inset 0 0 16px rgba(255,224,139,.24)}
        50%{box-shadow:0 0 0 1px rgba(255,238,176,1),0 0 24px rgba(255,196,62,.82),inset 0 1px 0 rgba(255,255,255,.95),inset 0 0 24px rgba(255,224,139,.38)}
      }

      html.dcc-theme-light-premium body,
      html.dcc-theme-light-premium .app,
      html.dcc-theme-light-premium #client-main,
      html.dcc-theme-light-premium #coach-main{
        background-color:#f5efe4!important;
      }

      /* Barra inferior exactamente en negro/grafito + oro. */
      html.dcc-theme-light-premium body #client-nav,
      html.dcc-theme-light-premium body #coach-nav{
        box-sizing:border-box!important;
        background:linear-gradient(180deg,#24221c 0%,#12130f 52%,#1d1a14 100%)!important;
        background-color:#161713!important;
        border:1.5px solid #d8a63d!important;
        border-radius:24px!important;
        box-shadow:0 12px 30px rgba(69,47,10,.26),0 0 0 1px rgba(255,221,126,.12),inset 0 1px 0 rgba(255,236,181,.13)!important;
        overflow:hidden!important;
        isolation:isolate!important;
      }
      html.dcc-theme-light-premium body #client-nav::before,
      html.dcc-theme-light-premium body #client-nav::after,
      html.dcc-theme-light-premium body #coach-nav::before,
      html.dcc-theme-light-premium body #coach-nav::after{
        display:none!important;
        content:none!important;
      }
      html.dcc-theme-light-premium body #client-nav button,
      html.dcc-theme-light-premium body #coach-nav button{
        box-sizing:border-box!important;
        background:transparent!important;
        color:#efbf55!important;
        border:1px solid transparent!important;
        border-radius:18px!important;
        box-shadow:none!important;
        transform:none!important;
        text-shadow:none!important;
      }
      html.dcc-theme-light-premium body #client-nav button svg,
      html.dcc-theme-light-premium body #coach-nav button svg{
        color:#efbf55!important;
        stroke:currentColor!important;
        filter:drop-shadow(0 0 4px rgba(239,191,85,.20))!important;
      }
      html.dcc-theme-light-premium body #client-nav button span,
      html.dcc-theme-light-premium body #coach-nav button span{
        color:#efd488!important;
      }
      html.dcc-theme-light-premium body #client-nav button.active,
      html.dcc-theme-light-premium body #coach-nav button.active{
        background:linear-gradient(145deg,#ffeca9 0%,#f3c75f 48%,#daa030 100%)!important;
        background-color:#efbd52!important;
        color:#181207!important;
        border:1px solid #ffe6a0!important;
        animation:dcc-nav-selected-pulse-v5 1.8s ease-in-out infinite!important;
      }
      html.dcc-theme-light-premium body #client-nav button.active svg,
      html.dcc-theme-light-premium body #coach-nav button.active svg,
      html.dcc-theme-light-premium body #client-nav button.active span,
      html.dcc-theme-light-premium body #coach-nav button.active span{
        color:#181207!important;
        stroke:currentColor!important;
        filter:none!important;
      }

      /* Próximo entrenamiento: el disco termina en el borde derecho, sin hueco. */
      html.dcc-theme-light-premium #client-main .dch-next{
        position:relative!important;
        overflow:hidden!important;
        isolation:isolate!important;
        background-image:
          linear-gradient(90deg,#fffdf8 0%,#f9f0df 30%,rgba(249,240,223,.94) 39%,rgba(249,240,223,.62) 49%,rgba(249,240,223,.20) 60%,rgba(0,0,0,0) 70%),
          url('./assets/next-workout-plate.jpg')!important;
        background-size:100% 100%,auto 150%!important;
        background-position:center,right center!important;
        background-repeat:no-repeat,no-repeat!important;
        border:1px solid rgba(193,132,28,.68)!important;
        box-shadow:0 14px 34px rgba(66,47,20,.14)!important;
      }
      html.dcc-theme-light-premium #client-main .dch-next::before{
        content:''!important;
        position:absolute!important;
        z-index:0!important;
        inset:0 0 0 auto!important;
        width:46%!important;
        pointer-events:none!important;
        background:linear-gradient(90deg,transparent 0%,rgba(0,0,0,.015) 35%,rgba(0,0,0,.07) 100%)!important;
      }
      html.dcc-theme-light-premium #client-main .dch-next .dch-iconbox,
      html.dcc-theme-light-premium #client-main .dch-next .dch-next-label,
      html.dcc-theme-light-premium #client-main .dch-next .dch-next-name,
      html.dcc-theme-light-premium #client-main .dch-next .dch-next-day,
      html.dcc-theme-light-premium #client-main .dch-next .dch-routine-btn{
        z-index:2!important;
      }
    `;
    document.head.appendChild(style);
  }

  function forcePremiumNav(){
    const light=document.documentElement.classList.contains('dcc-theme-light-premium');
    ['client-nav','coach-nav'].forEach(id=>{
      const nav=document.getElementById(id);
      if(!nav)return;

      if(!light){
        ['background','background-color','border','border-radius','box-shadow','overflow','isolation'].forEach(p=>nav.style.removeProperty(p));
        nav.querySelectorAll('button').forEach(btn=>{
          ['background','background-color','border','box-shadow','color','animation','transform'].forEach(p=>btn.style.removeProperty(p));
          btn.querySelectorAll('svg,span').forEach(el=>{
            ['color','stroke','filter','font-weight'].forEach(p=>el.style.removeProperty(p));
          });
        });
        return;
      }

      nav.style.setProperty('background','linear-gradient(180deg,#24221c 0%,#12130f 52%,#1d1a14 100%)','important');
      nav.style.setProperty('background-color','#161713','important');
      nav.style.setProperty('border','1.5px solid #d8a63d','important');
      nav.style.setProperty('border-radius','24px','important');
      nav.style.setProperty('box-shadow','0 12px 30px rgba(69,47,10,.26),0 0 0 1px rgba(255,221,126,.12),inset 0 1px 0 rgba(255,236,181,.13)','important');
      nav.style.setProperty('overflow','hidden','important');
      nav.style.setProperty('isolation','isolate','important');

      nav.querySelectorAll('button').forEach(btn=>{
        const active=btn.classList.contains('active');
        btn.style.setProperty('color',active?'#181207':'#efbf55','important');
        btn.style.setProperty('border',active?'1px solid #ffe6a0':'1px solid transparent','important');
        btn.style.setProperty('background',active?'linear-gradient(145deg,#ffeca9 0%,#f3c75f 48%,#daa030 100%)':'transparent','important');
        btn.style.setProperty('background-color',active?'#efbd52':'transparent','important');
        btn.style.setProperty('box-shadow',active?'0 0 0 1px rgba(255,224,139,.95),0 0 18px rgba(244,187,58,.68),inset 0 1px 0 rgba(255,255,255,.86)':'none','important');
        btn.style.setProperty('transform','none','important');
        btn.style.setProperty('animation',active?'dcc-nav-selected-pulse-v5 1.8s ease-in-out infinite':'none','important');
        btn.querySelectorAll('svg').forEach(el=>{
          el.style.setProperty('color',active?'#181207':'#efbf55','important');
          el.style.setProperty('stroke','currentColor','important');
          el.style.setProperty('filter',active?'none':'drop-shadow(0 0 4px rgba(239,191,85,.20))','important');
        });
        btn.querySelectorAll('span').forEach(el=>{
          el.style.setProperty('color',active?'#181207':'#efd488','important');
          if(active)el.style.setProperty('font-weight','700','important');
          else el.style.removeProperty('font-weight');
        });
      });
    });
  }

  function forceNextWorkout(){
    const card=document.querySelector('#client-main .dch-next');
    if(!card)return;
    if(!document.documentElement.classList.contains('dcc-theme-light-premium')){
      ['background-image','background-size','background-position','background-repeat'].forEach(p=>card.style.removeProperty(p));
      return;
    }
    card.style.setProperty('background-image',"linear-gradient(90deg,#fffdf8 0%,#f9f0df 30%,rgba(249,240,223,.94) 39%,rgba(249,240,223,.62) 49%,rgba(249,240,223,.20) 60%,rgba(0,0,0,0) 70%),url('./assets/next-workout-plate.jpg')",'important');
    card.style.setProperty('background-size','100% 100%,auto 150%','important');
    card.style.setProperty('background-position','center,right center','important');
    card.style.setProperty('background-repeat','no-repeat,no-repeat','important');
  }

  let queued=false;
  function schedule(){
    if(queued)return;
    queued=true;
    requestAnimationFrame(()=>{
      queued=false;
      installStyles();
      forcePremiumNav();
      forceNextWorkout();
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