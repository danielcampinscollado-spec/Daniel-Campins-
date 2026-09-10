/* DCC coach premium loader v14 — carga rápida del panel sin pantalla negra */
(function(){
  'use strict';
  if(window.__dccCoachPremiumLoaderV14)return;
  window.__dccCoachPremiumLoaderV14=true;

  function hasPremium(fn,depth){
    if(!fn||typeof fn!=='function'||depth>10)return false;
    if(fn.__dccPremiumV9||fn.__dccPremiumV6)return true;
    return hasPremium(fn.__base,depth+1)||hasPremium(fn.__original,depth+1);
  }

  function main(){return document.getElementById('coach-main')}

  function add(src,key,onload){
    const selector=`script[data-dcc-${key}]`;
    const existing=document.querySelector(selector);
    if(existing){
      if(onload){
        if(existing.dataset.dccLoaded==='1')onload();
        else existing.addEventListener('load',onload,{once:true});
      }
      return existing;
    }

    const s=document.createElement('script');
    s.src=src;
    s.async=false;
    s.dataset['dcc'+key.charAt(0).toUpperCase()+key.slice(1)]='1';
    s.onload=()=>{
      s.dataset.dccLoaded='1';
      if(onload)onload();
    };
    s.onerror=()=>console.error('DCC: no se pudo cargar '+src);
    (document.head||document.documentElement).appendChild(s);
    return s;
  }

  /*
    Evita reconstruir el Panel si ya está pintado. Esto elimina el destello
    que producían loaders/pageshow consecutivos, sin ocultar nunca la pantalla.
  */
  function installDashboardDedupe(){
    const current=window.showCoach;
    if(typeof current!=='function'||!hasPremium(current,0)||current.__dccNoFlickerV14)return;

    const wrapped=function(screen){
      const m=main();
      if(
        screen==='dashboard' &&
        window.currentScreen==='dashboard' &&
        m?.classList.contains('dcc-p9-dashboard') &&
        m.querySelector('.dcc-p9-hero')
      ) return;

      return current.apply(this,arguments);
    };

    wrapped.__dccNoFlickerV14=true;
    wrapped.__dccPremiumV9=!!current.__dccPremiumV9;
    wrapped.__dccPremiumV6=!!current.__dccPremiumV6;
    wrapped.__base=current;
    window.showCoach=wrapped;
  }

  function repaintIfNeeded(){
    const m=main();
    if(!m||typeof window.showCoach!=='function'||!hasPremium(window.showCoach,0))return;
    const text=(m.textContent||'').toUpperCase();
    const dashboardVisible=window.currentScreen==='dashboard'||
      text.includes('PANEL DE ENTRENADOR')||
      text.includes('BUENOS DÍAS')||
      text.includes('BUENAS TARDES')||
      text.includes('BUENAS NOCHES');

    if(dashboardVisible&&!m.classList.contains('dcc-p9-dashboard')){
      window.showCoach('dashboard');
    }
  }

  function afterCore(){
    installDashboardDedupe();
    repaintIfNeeded();
  }

  /*
    Los tres recursos se solicitan a la vez. Antes se cargaban en cadena y en
    móvil podían añadir varios segundos. No usamos visibility:hidden ni ningún
    overlay: el usuario mantiene siempre una pantalla visible.
  */
  const premiumReady=hasPremium(window.showCoach,0);

  add('./coach-panel-state-v10.js?v=20260910-1918','panelState',()=>{
    installDashboardDedupe();
  });

  add('./coach-ui-v11.js?v=20260910-1932','coachUi',()=>{
    installDashboardDedupe();
    repaintIfNeeded();
  });

  if(premiumReady){
    afterCore();
  }else{
    add('./coach-premium-core-v9.js?v=20260910-1958','coachCore',afterCore);
  }

  window.addEventListener('pageshow',()=>{
    installDashboardDedupe();
    repaintIfNeeded();
  });
})();
