/* DCC live coach consistency v3 — final authority for coach client count and single edit action */
(function(){
  'use strict';
  const BUILD='20260914-coach-live-consistency-v3';
  if(window.__dccCoachLiveConsistency===BUILD)return;
  window.__dccCoachLiveConsistency=BUILD;

  let countRunning=false;
  let lastCountAt=0;
  let queued=false;

  function db(){
    try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient}catch(_){}
    return window.supabaseClient||null;
  }

  function coachVisible(){
    const el=document.getElementById('coach');
    if(!el)return false;
    try{return getComputedStyle(el).display!=='none'}catch(_){return true}
  }

  function norm(v){
    return String(v||'').replace(/\s+/g,' ').trim().toLowerCase();
  }

  function patchClientCount(count){
    const main=document.getElementById('coach-main');
    if(!main||!Number.isFinite(count))return;

    const stats=[...main.querySelectorAll('.dcc-p9-stat')];
    const clientCard=stats.find(card=>norm(card.textContent).includes('clientes'));
    if(clientCard){
      const strong=clientCard.querySelector('strong');
      if(strong)strong.textContent=String(count);
      clientCard.classList.toggle('dcc-p9-positive',count>0);
      clientCard.classList.toggle('dcc-p9-zero',count<=0);
    }

    [...main.querySelectorAll('.metric,.dcc-stat,.card,[class*="stat"],[class*="metric"]')].forEach(box=>{
      const txt=norm(box.textContent);
      if(!/(^|\s)clientes(\s|$)/.test(txt))return;
      const value=box.querySelector('strong,b,[data-value],.value,[class*="value"]');
      if(value && /^\s*\d+\s*$/.test(String(value.textContent||''))) value.textContent=String(count);
    });
  }

  async function syncServerCount(force){
    if(countRunning||!coachVisible())return;
    const now=Date.now();
    if(!force&&now-lastCountAt<1200)return;
    const database=db();
    if(!database?.from)return;
    countRunning=true;
    try{
      const sessionResult=await database.auth?.getSession?.();
      if(!sessionResult?.data?.session)return;
      const result=await database.from('clients').select('id',{count:'exact',head:true});
      if(result?.error)throw result.error;
      const count=Number(result?.count);
      if(Number.isFinite(count)){
        lastCountAt=Date.now();
        patchClientCount(count);
      }
    }catch(error){
      console.warn('DCC coach client count sync:',error);
    }finally{
      countRunning=false;
    }
  }

  function dedupeEditClient(){
    const root=document.getElementById('coach-main');
    if(!root)return;

    const candidates=[...root.querySelectorAll('button,a,[role="button"],.dcc-client-edit-authority-btn')]
      .filter(el=>norm(el.textContent).includes('editar cliente'));

    if(candidates.length<=1)return;

    const keep=
      candidates.find(el=>el.classList.contains('dcc-client-edit-authority-btn')) ||
      candidates.find(el=>el.offsetParent!==null) ||
      candidates[0];

    candidates.forEach(el=>{
      if(el!==keep)el.remove();
    });
  }

  function refresh(){
    if(queued)return;
    queued=true;
    requestAnimationFrame(()=>{
      queued=false;
      dedupeEditClient();
      if(window.currentScreen==='dashboard')syncServerCount(false);
    });
  }

  function bootstrap(){
    dedupeEditClient();
    syncServerCount(true);
  }

  if(document.body){
    new MutationObserver(refresh).observe(document.body,{childList:true,subtree:true});
  }else{
    document.addEventListener('DOMContentLoaded',()=>new MutationObserver(refresh).observe(document.body,{childList:true,subtree:true}),{once:true});
  }

  document.addEventListener('click',e=>{
    const t=norm(e.target?.textContent);
    if(t==='panel'||t==='clientes'||t.includes('editar cliente'))setTimeout(bootstrap,0);
  },true);
  window.addEventListener('pageshow',bootstrap);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)bootstrap()});
  [0,100,250,500,900,1500,2500,4000].forEach(ms=>setTimeout(bootstrap,ms));
})();