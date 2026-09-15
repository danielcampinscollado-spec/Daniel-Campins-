/* DCC — runtime estable del entrenador: una ruta, un render, cero observers */
(function(){
  'use strict';
  const BUILD='20260915-dcc-coach-runtime-stable-v2';
  if(window.__dccCoachRuntimeStable===BUILD)return;
  window.__dccCoachRuntimeStable=BUILD;

  const PRIMARY=['dashboard','clients','calendar','checkins','messages'];
  let installed=false;
  let routeChain=null;
  let clientAdminBase=null;

  const norm=v=>String(v||'').replace(/\s+/g,' ').trim().toLowerCase();

  function coachVisible(){
    const coach=document.getElementById('coach');
    if(!coach)return false;
    try{return getComputedStyle(coach).display!=='none'}catch(_){return true}
  }

  function syncState(screen){
    window.currentScreen=screen;
    window.__dccCoachRouteIntent=screen;
    try{window.eval('currentScreen='+JSON.stringify(screen)+';currentApp="coach"')}catch(_){}
  }

  function markNav(screen){
    const index=PRIMARY.indexOf(screen);
    if(index<0)return;
    const nav=document.getElementById('coach-nav');
    if(!nav)return;
    [...nav.querySelectorAll('button')].forEach((button,i)=>{
      const active=i===index;
      button.classList.toggle('active',active);
      if(active)button.setAttribute('aria-current','page');
      else button.removeAttribute('aria-current');
    });
  }

  function unwrap(fn){
    const seen=new Set();let current=fn;
    while(typeof current==='function'&&!seen.has(current)){
      seen.add(current);
      const next=current.__base||current.__original||null;
      if(typeof next!=='function'||next===current)break;
      current=next;
    }
    return current;
  }

  function stableRoute(screen){
    if(!screen||!coachVisible())return;
    syncState(screen);markNav(screen);
    try{
      if(screen==='checkins'&&typeof window.dccRenderCoachCheckins==='function'){
        window.dccRenderCoachCheckins();
      }else if(typeof routeChain==='function'){
        routeChain.call(window,screen);
      }
    }catch(error){console.error('DCC stable coach route:',screen,error)}
    syncState(screen);markNav(screen);
  }
  stableRoute.__dccStableCoachRouterV2=true;

  function openClientEditor(id){
    if(typeof window.dccCriticalOpenClientEditor==='function')return window.dccCriticalOpenClientEditor(id);
    if(typeof window.dccOpenClientProfileEditor==='function')return window.dccOpenClientProfileEditor(id);
  }

  function placeSummaryActions(id,tab){
    if(tab!=='summary')return;
    const root=document.querySelector('#coach-main.dcc-ca');if(!root)return;
    const heading=[...root.querySelectorAll('h2')].find(x=>norm(x.textContent)==='información general');
    const card=heading?.closest('.dcc-ca-card');if(!card)return;
    root.querySelectorAll('.dcc-summary-actions-bottom,.dcc-ca-profile-actions').forEach(x=>x.remove());
    const box=document.createElement('div');box.className='dcc-summary-actions-bottom';
    box.style.cssText='display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:14px;padding-top:13px;border-top:1px solid rgba(177,119,18,.16)';
    if(typeof window.dccCriticalOpenClientEditor==='function'||typeof window.dccOpenClientProfileEditor==='function'){
      const edit=document.createElement('button');edit.type='button';edit.className='dcc-ca-edit-client';edit.textContent='Editar cliente';edit.onclick=()=>openClientEditor(id);box.appendChild(edit);
    }
    const del=[...root.querySelectorAll('button')].find(x=>norm(x.textContent)==='eliminar cliente');
    if(del)box.appendChild(del);
    if(box.children.length)card.appendChild(box);
  }

  function stableClientAdmin(id,tab='summary'){
    if(!id||typeof clientAdminBase!=='function')return;
    syncState('clients');window.selectedClient=id;
    const out=clientAdminBase.call(window,id,tab);
    placeSummaryActions(id,tab);
    return out;
  }
  stableClientAdmin.__dccStableClientAdminV2=true;

  function directClient(id){
    if(!id)return;
    syncState('clients');window.selectedClient=id;window.scrollTo(0,0);
    return stableClientAdmin(id,'summary');
  }
  directClient.__dccClientAdminPremium=true;
  directClient.__dccSingleAuthority=true;

  function installFinal(){
    if(installed)return;
    const current=window.showCoach;
    const currentAdmin=window.dccClientAdmin;
    if(typeof current!=='function'||typeof currentAdmin!=='function')return;

    routeChain=current;
    clientAdminBase=unwrap(currentAdmin);

    /* Sustituimos las cadenas diferidas por autoridades finales síncronas. */
    window.showCoach=stableRoute;
    window.dccClientAdmin=stableClientAdmin;
    window.openClient=directClient;
    window.showClientAdmin=directClient;
    window.dccOpenCoachPrimary=index=>stableRoute(PRIMARY[index]);
    window.dccOpenCoachCalendar=()=>stableRoute('calendar');
    window.dccOpenCoachCheckins=()=>stableRoute('checkins');
    window.dccOpenCoachMessages=()=>stableRoute('messages');

    const nav=document.getElementById('coach-nav');
    if(nav&&!nav.__dccStableCoachNavV2){
      nav.__dccStableCoachNavV2=true;
      nav.addEventListener('click',event=>{
        const button=event.target?.closest?.('button');if(!button)return;
        const index=[...nav.querySelectorAll('button')].indexOf(button);
        if(index<0||index>=PRIMARY.length)return;
        event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();
        stableRoute(PRIMARY[index]);
      },true);
    }

    installed=true;
    document.documentElement.dataset.dccStableCoachRuntime='2';
  }

  /* El último instalador legacy termina a los 2,2 s. Después fijamos una sola
     autoridad y no volvemos a observar ni repintar automáticamente. */
  setTimeout(installFinal,2600);
  window.addEventListener('load',()=>setTimeout(installFinal,2600),{once:true});
})();
