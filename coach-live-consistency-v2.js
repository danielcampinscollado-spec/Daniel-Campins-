/* DCC live coach consistency v6 — solo sincroniza el contador de clientes; no modifica detalle de cliente */
(function(){
  'use strict';
  const BUILD='20260914-coach-live-consistency-v6';
  const COUNT_CACHE='dcc_coach_client_count_v1';
  if(window.__dccCoachLiveConsistency===BUILD)return;
  window.__dccCoachLiveConsistency=BUILD;

  let countRunning=false,lastCountAt=0,queued=false;
  function db(){try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient}catch(_){}return window.supabaseClient||null}
  function coachVisible(){const el=document.getElementById('coach');if(!el)return false;try{return getComputedStyle(el).display!=='none'}catch(_){return true}}
  function norm(v){return String(v||'').replace(/\s+/g,' ').trim().toLowerCase()}
  function readCachedCount(){try{const n=Number(localStorage.getItem(COUNT_CACHE));return Number.isFinite(n)&&n>=0?n:null}catch(_){return null}}
  function saveCachedCount(count){try{localStorage.setItem(COUNT_CACHE,String(count))}catch(_){}}

  function patchClientCount(count){
    if(window.currentScreen!=='dashboard')return;
    const main=document.getElementById('coach-main');if(!main||!Number.isFinite(count))return;
    const stats=[...main.querySelectorAll('.dcc-p9-stat')];
    const clientCard=stats.find(card=>norm(card.textContent).includes('clientes'));
    if(clientCard){
      const strong=clientCard.querySelector('strong');if(strong&&strong.textContent!==String(count))strong.textContent=String(count);
      clientCard.classList.toggle('dcc-p9-positive',count>0);clientCard.classList.toggle('dcc-p9-zero',count<=0);
    }
  }
  function patchCachedCount(){const cached=readCachedCount();if(cached!==null)patchClientCount(cached)}

  async function syncServerCount(force){
    if(countRunning||!coachVisible()||window.currentScreen!=='dashboard')return;
    const now=Date.now();if(!force&&now-lastCountAt<1200)return;
    const database=db();if(!database?.from)return;
    countRunning=true;
    try{
      const sessionResult=await database.auth?.getSession?.();if(!sessionResult?.data?.session)return;
      const result=await database.from('clients').select('id',{count:'exact',head:true});if(result?.error)throw result.error;
      const count=Number(result?.count);if(Number.isFinite(count)){lastCountAt=Date.now();saveCachedCount(count);patchClientCount(count)}
    }catch(error){console.warn('DCC coach client count sync:',error)}finally{countRunning=false}
  }

  function refresh(){
    if(queued||window.currentScreen!=='dashboard')return;
    queued=true;requestAnimationFrame(()=>{queued=false;patchCachedCount();syncServerCount(false)});
  }
  function bootstrap(){if(window.currentScreen!=='dashboard')return;patchCachedCount();syncServerCount(true)}

  function observe(){
    const main=document.getElementById('coach-main');if(!main||main.__dccLiveCountObserverV6)return;
    main.__dccLiveCountObserverV6=true;
    new MutationObserver(refresh).observe(main,{childList:true,subtree:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',observe,{once:true});else observe();
  document.addEventListener('click',e=>{if(norm(e.target?.textContent)==='panel')setTimeout(bootstrap,0)},true);
  window.addEventListener('pageshow',bootstrap);
})();
