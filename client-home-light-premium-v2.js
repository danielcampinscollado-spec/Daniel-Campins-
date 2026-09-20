/* DCC — Cliente Inicio Light Premium refinado v2
   Reparación visual aislada sobre la capa Light estable.
   No modifica datos, autenticación ni lógica de negocio. */
(function(){
  'use strict';
  if(window.__dccClientHomeLightPremiumV2)return;
  window.__dccClientHomeLightPremiumV2=true;

  const STYLE_ID='dcc-client-home-light-premium-v2';

  function installStyles(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
/* =========================================================
   INICIO CLIENTE — LIGHT PREMIUM
   ========================================================= */
html.dcc-theme-light-premium body #client #client-main .dch-wrap{
  --home-gold:#b77b13;
  --home-gold-2:#d9aa4a;
  --home-text:#17191d;
  --home-muted:#6f7782;
  width:100%!important;
  max-width:820px!important;
  margin:0 auto!important;
  padding-bottom:8px!important;
  color:var(--home-text)!important;
}

/* Cabecera del cliente: más contenida y premium */
html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-welcome{
  min-height:auto!important;
  margin:0 0 16px!important;
  padding:2px 2px 0!important;
}
html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-welcome::before,
html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-welcome::after{
  display:none!important;
  content:none!important;
}
html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-eyebrow{
  margin:0 0 8px!important;
  color:var(--home-gold)!important;
  font-size:10.5px!important;
  line-height:1.1!important;
  font-weight:750!important;
  letter-spacing:3px!important;
  text-transform:uppercase!important;
}
html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-name{
  margin:0!important;
  max-width:100%!important;
  color:var(--home-text)!important;
  font-size:26px!important;
  line-height:1.08!important;
  font-weight:700!important;
  letter-spacing:-.6px!important;
  white-space:normal!important;
  text-shadow:none!important;
}

/* Métricas: se conserva el contraste oscuro premium */
html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-stats{
  gap:10px!important;
  margin-bottom:14px!important;
}
html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-stat{
  min-height:88px!important;
  height:88px!important;
  grid-template-columns:40px minmax(0,1fr) 12px!important;
  gap:10px!important;
  padding:13px 12px!important;
  border-radius:21px!important;
  background:
    radial-gradient(circle at 100% 0,rgba(231,185,79,.08),transparent 40%),
    linear-gradient(145deg,#15191f 0%,#0d1116 62%,#090c10 100%)!important;
  background-color:#0d1116!important;
  border:1px solid rgba(217,170,74,.34)!important;
  box-shadow:0 12px 26px rgba(64,48,25,.16),inset 0 1px 0 rgba(255,255,255,.035)!important;
  overflow:hidden!important;
}
html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-stat .dch-iconbox{
  width:40px!important;
  height:40px!important;
  border-radius:12px!important;
  background:#fffaf1!important;
  border-color:rgba(217,170,74,.34)!important;
  color:#17191d!important;
}
html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-stat:nth-child(2) .dch-iconbox{
  color:#e2ae3f!important;
}
html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-stat-label,
html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-stat-value,
html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-stat-value span{
  background:transparent!important;
  background-color:transparent!important;
  background-image:none!important;
  border:0!important;
  box-shadow:none!important;
}
html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-stat-label{
  margin-bottom:5px!important;
  color:#aeb4bd!important;
  font-size:8px!important;
  line-height:1.1!important;
  font-weight:650!important;
  letter-spacing:1.6px!important;
  white-space:nowrap!important;
}
html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-stat-value{
  color:#f7f5f0!important;
  font-size:24px!important;
  line-height:1!important;
  font-weight:650!important;
  letter-spacing:-.45px!important;
  white-space:nowrap!important;
}
html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-stat-value span{
  color:#aeb4bd!important;
  font-size:11px!important;
  font-weight:500!important;
}
html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-stat .dch-chevron{
  display:block!important;
  color:#707984!important;
  font-size:22px!important;
  line-height:1!important;
}

/* Tarjetas claras: densidad más premium */
html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-card{
  margin-bottom:14px!important;
  border-radius:22px!important;
  border-color:rgba(177,119,18,.22)!important;
  box-shadow:0 10px 24px rgba(78,58,28,.07),inset 0 1px 0 rgba(255,255,255,.96)!important;
}

/* Tareas */
html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-task-card{
  padding:0!important;
  overflow:hidden!important;
}
html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-task-head{
  min-height:39px!important;
  height:39px!important;
  padding:0 15px!important;
  color:var(--home-gold)!important;
  font-size:9px!important;
  font-weight:750!important;
  letter-spacing:2.5px!important;
}
html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-task-row{
  min-height:66px!important;
  padding:9px 15px!important;
  color:var(--home-text)!important;
}
html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-task-title{
  color:var(--home-text)!important;
  font-size:15.5px!important;
  font-weight:700!important;
  line-height:1.18!important;
  text-shadow:none!important;
}
html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-task-meta{
  margin-top:4px!important;
  color:var(--home-muted)!important;
  font-size:10px!important;
  line-height:1.3!important;
}

/* Progreso */
html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-progress{
  min-height:96px!important;
  grid-template-columns:40px minmax(0,1fr) 16px!important;
  gap:16px!important;
  padding:14px 15px!important;
  align-items:center!important;
}
html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-progress .dch-iconbox{
  width:40px!important;
  height:40px!important;
}
html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-progress-label{
  color:#17191d!important;
  font-size:9px!important;
  font-weight:750!important;
  letter-spacing:2.5px!important;
}
html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-progress-title{
  margin-top:5px!important;
  color:var(--home-text)!important;
  font-size:16px!important;
  line-height:1.16!important;
  font-weight:700!important;
  letter-spacing:-.2px!important;
  text-shadow:none!important;
}
html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-progress-sub{
  margin-top:6px!important;
  color:#5f6874!important;
  font-size:10px!important;
  line-height:1.35!important;
}
html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-progress .dch-chevron{
  display:block!important;
  color:#858c96!important;
  font-size:23px!important;
}

/* Próximo entrenamiento: se recupera el fondo degradado con el disco */
html.dcc-theme-light-premium body #client #client-main .dch-wrap section.dch-next{
  position:relative!important;
  min-height:126px!important;
  padding:16px!important;
  overflow:hidden!important;
  background-image:
    linear-gradient(90deg,
      rgba(255,253,248,1) 0%,
      rgba(255,253,248,.98) 33%,
      rgba(255,253,248,.88) 50%,
      rgba(255,253,248,.46) 67%,
      rgba(255,253,248,.08) 100%),
    url('./assets/next-workout-plate.jpg')!important;
  background-color:#fffdf8!important;
  background-size:cover!important;
  background-position:center right!important;
  background-repeat:no-repeat!important;
  border-color:rgba(177,119,18,.25)!important;
}
html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-next::after{
  content:''!important;
  position:absolute!important;
  inset:0!important;
  pointer-events:none!important;
  background:linear-gradient(90deg,transparent 58%,rgba(205,153,45,.04) 100%)!important;
}
html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-next-content{
  position:relative!important;
  z-index:2!important;
  min-height:92px!important;
  display:grid!important;
  grid-template-columns:40px minmax(0,1fr)!important;
  gap:16px!important;
  align-items:center!important;
  padding-right:146px!important;
}
html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-next .dch-iconbox{
  width:40px!important;
  height:40px!important;
  background:rgba(255,253,248,.84)!important;
  border-color:rgba(177,119,18,.24)!important;
  backdrop-filter:blur(2px)!important;
  -webkit-backdrop-filter:blur(2px)!important;
}
html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-next-label{
  margin-bottom:6px!important;
  color:var(--home-gold)!important;
  font-size:8.8px!important;
  line-height:1.05!important;
  font-weight:750!important;
  letter-spacing:2px!important;
  white-space:normal!important;
}
html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-next-name{
  max-width:100%!important;
  margin:0!important;
  color:var(--home-text)!important;
  font-size:17px!important;
  line-height:1.12!important;
  font-weight:700!important;
  letter-spacing:-.28px!important;
  white-space:nowrap!important;
  overflow:hidden!important;
  text-overflow:ellipsis!important;
  text-shadow:none!important;
}
html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-next-day{
  margin-top:7px!important;
  color:var(--home-muted)!important;
  font-size:10.5px!important;
}
html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-routine-btn{
  position:absolute!important;
  right:16px!important;
  bottom:16px!important;
  z-index:3!important;
  min-width:138px!important;
  height:44px!important;
  min-height:44px!important;
  padding:0 17px!important;
  border-radius:16px!important;
  border:1.5px solid #c8942d!important;
  background:#55555a!important;
  color:#f2c65f!important;
  box-shadow:0 7px 18px rgba(45,38,27,.15)!important;
  font-size:12px!important;
  line-height:1!important;
  font-weight:750!important;
}

/* El lema inferior no debe quedar atrapado detrás de la barra en móvil */
@media(max-width:700px){
  html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-slogan{
    display:none!important;
  }
}

/* Barra inferior: mantiene el contenedor, pero compacta iconos y etiquetas */
@media(max-width:700px){
  html.dcc-theme-light-premium body #client > .side{
    left:50%!important;
    right:auto!important;
    width:min(calc(100% - 18px),430px)!important;
    transform:translateX(-50%)!important;
  }
  html.dcc-theme-light-premium body #client-nav{
    display:grid!important;
    grid-template-columns:repeat(6,minmax(0,54px))!important;
    justify-content:center!important;
    align-items:stretch!important;
    column-gap:0!important;
    padding:4px 5px!important;
  }
  html.dcc-theme-light-premium body #client-nav button{
    width:54px!important;
    min-width:0!important;
    height:60px!important;
    padding:3px 0!important;
    gap:2px!important;
    border-radius:15px!important;
  }
  html.dcc-theme-light-premium body #client-nav button svg{
    width:20px!important;
    height:20px!important;
    flex:0 0 20px!important;
  }
  html.dcc-theme-light-premium body #client-nav button span{
    width:100%!important;
    margin:0!important;
    padding:0!important;
    font-size:7.8px!important;
    line-height:1!important;
    font-weight:650!important;
    letter-spacing:-.15px!important;
    text-align:center!important;
    white-space:nowrap!important;
  }
  html.dcc-theme-light-premium body #client-nav button.active{
    box-shadow:0 5px 13px rgba(185,126,18,.14),inset 0 1px 0 rgba(255,255,255,.9)!important;
  }
}

/* Ajuste iPhone estrecho */
@media(max-width:390px){
  html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-name{
    font-size:24px!important;
  }
  html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-stat{
    min-height:84px!important;
    height:84px!important;
    grid-template-columns:38px minmax(0,1fr) 10px!important;
    gap:8px!important;
    padding:11px 10px!important;
  }
  html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-stat .dch-iconbox{
    width:38px!important;
    height:38px!important;
  }
  html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-stat-label{
    font-size:7.2px!important;
    letter-spacing:1.2px!important;
  }
  html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-stat-value{
    font-size:22px!important;
  }
  html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-next{
    min-height:120px!important;
    padding:14px!important;
  }
  html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-next-content{
    padding-right:128px!important;
    gap:13px!important;
  }
  html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-next-name{
    font-size:15.5px!important;
  }
  html.dcc-theme-light-premium body #client #client-main .dch-wrap .dch-routine-btn{
    right:14px!important;
    bottom:14px!important;
    min-width:124px!important;
    height:42px!important;
    min-height:42px!important;
    padding:0 13px!important;
    font-size:11.3px!important;
  }
  html.dcc-theme-light-premium body #client-nav{
    grid-template-columns:repeat(6,minmax(0,50px))!important;
  }
  html.dcc-theme-light-premium body #client-nav button{
    width:50px!important;
  }
  html.dcc-theme-light-premium body #client-nav button span{
    font-size:7.2px!important;
  }
}
    `;
    (document.head||document.documentElement).appendChild(s);
  }

  function refineHome(){
    const root=document.querySelector('#client-main .dch-wrap');
    if(!root)return;

    const nextName=root.querySelector('.dch-next-name');
    if(nextName){
      const text=(nextName.textContent||'').trim();
      if(!text || /^sin\s+grupos?\s+musc/i.test(text) || /^sin\s+grupo/i.test(text)){
        nextName.textContent='Rutina disponible';
      }
    }
  }

  function boot(){
    installStyles();
    refineHome();
    const main=document.getElementById('client-main');
    if(main&&!window.__dccClientHomeLightPremiumV2Observer){
      let raf=0;
      const observer=new MutationObserver(()=>{
        cancelAnimationFrame(raf);
        raf=requestAnimationFrame(refineHome);
      });
      observer.observe(main,{childList:true,subtree:true,characterData:true});
      window.__dccClientHomeLightPremiumV2Observer=observer;
    }
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',boot,{once:true});
  }else{
    boot();
  }
})();
