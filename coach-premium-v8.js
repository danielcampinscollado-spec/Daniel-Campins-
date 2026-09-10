/* DCC coach premium loader v13 — entrada del panel sin parpadeos */
(function(){
  'use strict';
  if(window.__dccCoachPremiumLoaderV13)return;
  window.__dccCoachPremiumLoaderV13=true;

  const PENDING='dccCoachDashboardPending';

  function hasPremium(fn,depth){
    if(!fn||typeof fn!=='function'||depth>10)return false;
    if(fn.__dccPremiumV9||fn.__dccPremiumV6)return true;
    return hasPremium(fn.__base,depth+1)||hasPremium(fn.__original,depth+1);
  }

  function main(){return document.getElementById('coach-main')}

  function hidePendingDashboard(){
    const m=main();
    if(!m)return;
    m.dataset[PENDING]='1';
    m.style.setProperty('visibility','hidden','important');
  }

  function revealDashboard(){
    const m=main();
    if(!m)return;
    delete m.dataset[PENDING];
    m.style.removeProperty('visibility');
  }

  /*
    El showCoach original puede pintar durante unos milisegundos el panel
    antiguo mientras termina de cargar el renderer premium. Lo ocultamos sólo
    durante esa primera sustitución para que nunca llegue a verse en pantalla.
  */
  function installEarlyGuard(){
    const current=window.showCoach;
    if(typeof current!=='function'||hasPremium(current,0)||current.__dccEntryGuardV13)return;

    const guarded=function(screen){
      if(screen==='dashboard')hidePendingDashboard();
      return current.apply(this,arguments);
    };
    guarded.__dccEntryGuardV13=true;
    guarded.__base=current;
    window.showCoach=guarded;
  }

  /*
    Evita repintados consecutivos del mismo dashboard. Algunos loaders antiguos
    llaman showCoach('dashboard') varias veces al entrar/pageshow y cada
    innerHTML completo producía el destello visible en iPhone.
  */
  function installDashboardDedupe(){
    const current=window.showCoach;
    if(typeof current!=='function'||!hasPremium(current,0)||current.__dccNoFlickerV13)return;

    const wrapped=function(screen){
      const m=main();
      if(
        screen==='dashboard' &&
        window.currentScreen==='dashboard' &&
        m?.classList.contains('dcc-p9-dashboard')
      ){
        revealDashboard();
        return;
      }

      const result=current.apply(this,arguments);
      if(screen==='dashboard'){
        requestAnimationFrame(()=>requestAnimationFrame(revealDashboard));
      }
      return result;
    };

    wrapped.__dccNoFlickerV13=true;
    wrapped.__dccPremiumV9=!!current.__dccPremiumV9;
    wrapped.__dccPremiumV6=!!current.__dccPremiumV6;
    wrapped.__base=current;
    window.showCoach=wrapped;
  }

  function finishPendingDashboard(){
    const m=main();
    if(!m||m.dataset[PENDING]!=='1')return;
    if(typeof window.showCoach!=='function'||!hasPremium(window.showCoach,0))return;

    window.currentScreen='dashboard';
    window.showCoach('dashboard');
    requestAnimationFrame(()=>requestAnimationFrame(revealDashboard));
  }

  function add(src,key,onload){
    const existing=document.querySelector(`script[data-dcc-${key}]`);
    if(existing){
      if(onload){
        if(existing.dataset.dccLoaded==='1')onload();
        else existing.addEventListener('load',onload,{once:true});
      }
      return;
    }

    const s=document.createElement('script');
    s.src=src;
    s.async=false;
    s.dataset['dcc'+key.charAt(0).toUpperCase()+key.slice(1)]='1';
    s.onload=()=>{
      s.dataset.dccLoaded='1';
      if(onload)onload();
    };
    s.onerror=()=>{
      revealDashboard();
      console.error('DCC: no se pudo cargar '+src);
    };
    (document.head||document.documentElement).appendChild(s);
  }

  function loadEnhancers(){
    installDashboardDedupe();
    finishPendingDashboard();

    add('./coach-panel-state-v10.js?v=20260910-1918','panelState',()=>{
      add('./coach-ui-v11.js?v=20260910-1932','coachUi',()=>{
        installDashboardDedupe();
        finishPendingDashboard();
      });
    });
  }

  installEarlyGuard();

  if(hasPremium(window.showCoach,0)){
    loadEnhancers();
  }else{
    add('./coach-premium-core-v9.js?v=20260910-1946','coachCore',()=>{
      installDashboardDedupe();
      finishPendingDashboard();
      loadEnhancers();
    });
  }

  window.addEventListener('pageshow',()=>{
    setTimeout(()=>{
      installDashboardDedupe();
      finishPendingDashboard();
    },0);
  });
})();
