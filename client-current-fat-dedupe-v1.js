/* DCC — current body-fat authority + client edit action dedupe */
(function(){
  'use strict';
  const BUILD='20260913-current-fat-edit-dedupe-v1';
  if(window.__dccCurrentFatEditDedupe===BUILD)return;
  window.__dccCurrentFatEditDedupe=BUILD;

  const appData=()=>{try{return data||window.data||{}}catch(_){return window.data||{}}};
  const db=()=>{try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient}catch(_){}return window.supabaseClient||null};
  let latestByClient=new Map();
  let syncing=false;
  let queued=false;

  function persist(){try{if(typeof window.saveData==='function')window.saveData();else if(typeof saveData==='function')saveData()}catch(_){} }

  function dedupeEditButtons(){
    const root=document.querySelector('#coach-main.dcc-ca');
    if(!root)return;
    const buttons=[...root.querySelectorAll('button')].filter(b=>String(b.textContent||'').replace(/\s+/g,' ').trim().toLowerCase()==='editar cliente');
    if(buttons.length<=1)return;
    const keep=buttons.find(b=>b.classList.contains('dcc-client-edit-authority-btn'))||buttons[0];
    buttons.forEach(b=>{if(b!==keep)b.remove()});
  }

  function patchVisibleFat(){
    const root=document.querySelector('#coach-main.dcc-ca');
    const id=String(window.selectedClient||window.__dccClientAdminId||'');
    const latest=latestByClient.get(id);
    if(!root||latest==null)return;
    const metric=[...root.querySelectorAll('.dcc-ca-metric')].find(el=>String(el.querySelector('small')?.textContent||'').toLowerCase().includes('% de grasa'));
    const value=metric?.querySelector('b');
    if(value)value.textContent=Number(latest).toFixed(1).replace('.',',')+' %';
  }

  function applyLocal(rows){
    latestByClient=new Map();
    const historyByClient=new Map();
    for(const row of rows||[]){
      const id=String(row.client_id||'');
      if(!id)continue;
      const n=Number(row.body_fat);
      if(!Number.isFinite(n))continue;
      if(!historyByClient.has(id))historyByClient.set(id,[]);
      historyByClient.get(id).push({bodyFat:n,body_fat:n,recorded_at:row.recorded_at});
      latestByClient.set(id,n);
    }
    const d=appData();
    d.bodyFatHistory=d.bodyFatHistory||{};
    historyByClient.forEach((arr,id)=>{d.bodyFatHistory[id]=arr});
    if(Array.isArray(d.clients))d.clients.forEach(c=>{
      const id=String(c?.id||'');
      if(!latestByClient.has(id))return;
      const n=latestByClient.get(id);
      c.bodyFat=n;c.body_fat=n;c.currentBodyFat=n;c.latestBodyFat=n;
    });
    persist();
  }

  async function syncCurrentFat(){
    if(syncing)return;
    const database=db();
    if(!database||window.__dccSecureRole!=='coach')return;
    syncing=true;
    try{
      const r=await database.from('client_body_fat_history').select('client_id,body_fat,recorded_at').order('recorded_at',{ascending:true});
      if(r.error)throw r.error;
      applyLocal(Array.isArray(r.data)?r.data:[]);
      patchVisibleFat();
    }catch(e){console.warn('DCC current body fat sync:',e)}finally{syncing=false}
  }

  function refresh(){
    if(queued)return;queued=true;
    requestAnimationFrame(()=>{queued=false;dedupeEditButtons();patchVisibleFat()});
  }

  function bindObserver(){
    const root=document.getElementById('coach-main');
    if(!root||root.__dccCurrentFatEditDedupeBound)return;
    root.__dccCurrentFatEditDedupeBound=true;
    new MutationObserver(refresh).observe(root,{childList:true,subtree:true});
  }

  async function bootstrap(){
    bindObserver();
    await syncCurrentFat();
    refresh();
  }

  document.addEventListener('DOMContentLoaded',()=>queueMicrotask(bootstrap),{once:true});
  window.addEventListener('load',()=>queueMicrotask(bootstrap),{once:true});
  window.addEventListener('pageshow',()=>queueMicrotask(bootstrap));
  document.addEventListener('click',e=>{
    const b=e.target.closest?.('button');
    const text=String(b?.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();
    if(text==='editar cliente'||text==='resumen'||text==='clientes')setTimeout(()=>{syncCurrentFat();refresh()},0);
  },true);
  setTimeout(bootstrap,300);
  setTimeout(bootstrap,1200);
})();
