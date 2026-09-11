/* DCC — perfil persistente + flujo de alta + carga real de avisos v2 */
(function(){
  'use strict';
  if(window.__dccClientProfilePreferencesV2Loaded)return;
  window.__dccClientProfilePreferencesV2Loaded=true;

  const GOLD='#f0c96b';
  const appData=()=>{try{return data||{}}catch(e){return window.data||{}}};
  const database=()=>{try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient}catch(e){}return window.supabaseClient||null};
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const num=v=>{const n=parseFloat(String(v??'').replace(',','.'));return Number.isFinite(n)?n:null};
  const notify=t=>{try{if(typeof toast==='function')return toast(t);if(typeof window.toast==='function')return window.toast(t)}catch(e){}console.log(t)};
  const save=()=>{try{if(typeof saveData==='function')return saveData();if(typeof window.saveData==='function')return window.saveData()}catch(e){}};

  function loadPlanStatus(){
    if(window.__dccCoachClientPlanStatusV3)return;
    if([...document.scripts].some(s=>/coach-client-plan-status-v1\.js(?:\?|$)/.test(s.src||'')))return;
    const s=document.createElement('script');
    s.src='./coach-client-plan-status-v1.js?v=20260911-0438';
    s.async=false;
    s.onerror=()=>console.error('DCC: no se pudo cargar coach-client-plan-status-v1.js');
    (document.head||document.documentElement).appendChild(s);
  }

  function css(){
    if(document.getElementById('dcc-client-profile-preferences-v2-css'))return;
    const s=document.createElement('style');
    s.id='dcc-client-profile-preferences-v2-css';
    s.textContent=`
      #coach-main .dcc-ca-avoid-card{display:grid;grid-template-columns:34px minmax(0,1fr) auto;align-items:center;gap:10px;margin-top:12px;padding:11px 12px;border:1px solid rgba(224,173,76,.44);border-radius:14px;background:linear-gradient(145deg,rgba(217,170,74,.075),rgba(8,12,15,.92));color:#f3f1ec}
      #coach-main .dcc-ca-avoid-icon{width:34px;height:34px;display:grid;place-items:center;border:1px solid rgba(240,201,107,.42);border-radius:10px;color:${GOLD};background:rgba(217,170,74,.07)}
      #coach-main .dcc-ca-avoid-icon svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}
      #coach-main .dcc-ca-avoid-copy small{display:block;color:#9099a4;font-size:9px}.dcc-ca-avoid-copy b{display:block;margin-top:3px;color:#f4f2ed;font-size:11px;line-height:1.35;font-weight:760;overflow-wrap:anywhere}.dcc-ca-avoid-arrow{color:${GOLD};font-size:18px}
      #coach-main .dcc-diet-avoid-warning{display:grid;grid-template-columns:38px minmax(0,1fr);align-items:center;gap:11px;margin:0 0 11px;padding:11px 12px;border:1px solid rgba(240,201,107,.62);border-radius:15px;background:radial-gradient(circle at 94% 10%,rgba(240,201,107,.12),transparent 30%),linear-gradient(145deg,#15140f,#0b0d0e)}
      #coach-main .dcc-diet-avoid-warning .ico{width:38px;height:38px;display:grid;place-items:center;border:1px solid rgba(240,201,107,.38);border-radius:11px;color:${GOLD};background:rgba(217,170,74,.08)}
      #coach-main .dcc-diet-avoid-warning svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
      #coach-main .dcc-diet-avoid-warning b{display:block;color:${GOLD};font-size:11px}.dcc-diet-avoid-warning p{margin:4px 0 0;color:#e8e5de;font-size:10px;line-height:1.4}
    `;
    document.head.appendChild(s);
  }

  const avoidIcon=()=>'<svg viewBox="0 0 24 24"><path d="M6 3v7M3.8 3v5a2.2 2.2 0 0 0 4.4 0V3M6 10v11M15 3v18M15 8c3 0 4-2 4-5v18"/><path d="M4 20 20 4"/></svg>';

  function clientId(){
    const root=document.querySelector('#coach-main .dcc-ca-wrap');
    const name=(root?.querySelector('.dcc-ca-head h1')?.textContent||'').trim().toLowerCase();
    if(name){const hit=(appData().clients||[]).find(c=>String(c.name||'').trim().toLowerCase()===name);if(hit)return String(hit.id)}
    return String(window.__dccClientAdminId||window.selectedClient||window.currentClientId||'');
  }
  function clientFor(id){return(appData().clients||[]).find(c=>String(c.id)===String(id))||null}
  function foods(c){return String(c?.foods_to_avoid??c?.foodsToAvoid??'').trim()}

  function patchNewClientLabel(){
    const root=document.getElementById('dcc-new-client-premium');if(!root)return;
    const label=[...root.querySelectorAll('.dcc-nc-label')].find(x=>/%\s*de\s*grasa\s*inicial/i.test(x.textContent||''));
    const span=label?.querySelector('span:last-child');if(span)span.textContent='Grasa corporal inicial';
  }

  function installCreateFlow(){
    const base=window.createClient;
    if(typeof base!=='function'||base.__dccProfileFlowV2||base.__dccAuditCreateFlowV11)return;
    const wrapped=async function(){
      const before=new Set((appData().clients||[]).map(c=>String(c.id)));
      const result=await base.apply(this,arguments);
      const created=(appData().clients||[]).find(c=>!before.has(String(c.id)));
      if(created){
        window.selectedClient=created.id;
        window.__dccClientAdminId=created.id;
        setTimeout(()=>{
          try{if(typeof window.openClient==='function')window.openClient(created.id);else window.showClientAdmin?.(created.id)}catch(e){console.warn(e)}
        },120);
      }
      return result;
    };
    wrapped.__dccProfileFlowV2=true;
    wrapped.__base=base;
    window.createClient=wrapped;
  }

  async function syncProfile(id){
    const db=database();if(!db||!id)return;
    try{
      const {data:row,error}=await db.from('clients').select('height_cm,foods_to_avoid').eq('id',id).maybeSingle();
      if(error)throw error;if(!row)return;
      const c=clientFor(id);if(!c)return;
      const h=num(row.height_cm);if(h!=null){c.height=h;c.height_cm=h;c.heightCm=h;c.altura=h}
      c.foods_to_avoid=String(row.foods_to_avoid||'');c.foodsToAvoid=String(row.foods_to_avoid||'');save();
    }catch(e){console.error('DCC sync perfil:',e)}
  }

  function patchProfile(){
    css();
    const root=document.querySelector('#coach-main .dcc-ca-wrap');if(!root)return;
    const id=clientId(),c=clientFor(id);if(!c)return;
    window.__dccClientAdminId=id;

    const h=num(c.height_cm??c.heightCm??c.height??c.altura);
    [...root.querySelectorAll('.dcc-ca-info')].forEach(row=>{
      if((row.querySelector('span')?.textContent||'').trim().toLowerCase()==='altura'){
        const b=row.querySelector('b');if(b)b.textContent=h!=null?`${String(h).replace('.',',')} cm`:'—';
      }
    });

    const summary=(root.querySelector('.dcc-ca-tab.active')?.textContent||'').toLowerCase().includes('resumen');
    root.querySelectorAll('.dcc-ca-avoid-card').forEach(el=>el.remove());
    if(summary){
      const general=[...root.querySelectorAll('.dcc-ca-card')].find(card=>/información general/i.test(card.querySelector('h2')?.textContent||''));
      if(general){
        const f=foods(c),card=document.createElement('div');card.className='dcc-ca-avoid-card';
        card.innerHTML=`<span class="dcc-ca-avoid-icon">${avoidIcon()}</span><span class="dcc-ca-avoid-copy"><small>Alimentos a evitar</small><b>${f?esc(f):'Sin alimentos indicados'}</b></span><span class="dcc-ca-avoid-arrow">›</span>`;
        general.appendChild(card);
      }
    }

    root.querySelectorAll('.dcc-diet-avoid-warning').forEach(el=>el.remove());
    const sw=root.querySelector('.dcc-diet-switch'),f=foods(c);
    if(sw&&f){
      const w=document.createElement('div');w.className='dcc-diet-avoid-warning';
      w.innerHTML=`<span class="ico">${avoidIcon()}</span><div><b>Aviso del cliente</b><p>No incluir: ${esc(f)}.</p></div>`;
      sw.parentNode.insertBefore(w,sw);
    }
  }

  function installDeleteGuard(){
    if(window.__dccDeleteGuardV2)return;window.__dccDeleteGuardV2=true;
    document.addEventListener('click',event=>{
      const del=event.target.closest?.('#coach-main .dcc-ca-delete');
      if(del){
        event.preventDefault();event.stopImmediatePropagation();
        const id=clientId(),c=clientFor(id);if(!id||!c)return;
        if(!confirm(`¿Eliminar definitivamente a ${c.name}? Esta acción borrará también sus datos asociados.`))return;
        (async()=>{
          const db=database();if(!db){notify('No hay conexión con el servidor.');return}
          try{
            const {data:deleted,error}=await db.from('clients').delete().eq('id',id).select('id');
            if(error)throw error;if(!Array.isArray(deleted)||!deleted.length)throw new Error('El servidor no confirmó la eliminación');
            const d=appData();d.clients=(d.clients||[]).filter(x=>String(x.id)!==String(id));
            ['checkins','diets','routines','weights','workoutHistory','bodyFatHistory','messages','notificationState'].forEach(k=>{if(d[k]&&typeof d[k]==='object')delete d[k][id]});
            save();notify('Cliente eliminado definitivamente');window.showCoach?.('clients');
          }catch(e){console.error(e);notify('No se pudo eliminar el cliente');}
        })();
        return;
      }
      const add=event.target.closest?.('#coach-main .dcc-diet-add-food');
      if(add&&!window.dccDietAddFood?.__dccNativeAvoidWarning){const c=clientFor(clientId()),f=foods(c);if(f)alert(`Aviso del cliente\nNo incluir: ${f}.`)}
    },true);
  }

  let busy=false;
  function schedule(){
    if(busy)return;busy=true;
    requestAnimationFrame(()=>{
      busy=false;
      loadPlanStatus();
      if(!window.createClient?.__dccAuditCreateFlowV11)installCreateFlow();
      patchNewClientLabel();
    });
  }

  function boot(){
    css();loadPlanStatus();installDeleteGuard();schedule();
    window.addEventListener('pageshow',schedule);
    window.dccProfilePreferencesRefresh=schedule;
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
