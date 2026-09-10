/* DCC — preferencias del cliente + perfil persistente v1 */
(function(){
  'use strict';
  if(window.__dccClientProfilePreferencesV1Loaded)return;
  window.__dccClientProfilePreferencesV1Loaded=true;

  const GOLD='#f0c96b';
  const cache=new Map();

  const appData=()=>{try{return data||{}}catch(e){return window.data||{}};
  const database=()=>{try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient}catch(e){}return window.supabaseClient||null};
  const notify=t=>{try{if(typeof toast==='function')return toast(t);if(typeof window.toast==='function')return window.toast(t)}catch(e){}console.log(t)};
  const save=()=>{try{if(typeof saveData==='function')return saveData();if(typeof window.saveData==='function')return window.saveData()}catch(e){console.error(e)}};
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const num=v=>{const n=parseFloat(String(v??'').replace(',','.'));return Number.isFinite(n)?n:null};
  const currentId=()=>String(window.selectedClient||window.currentClientId||'');
  const clientFor=id=>(appData().clients||[]).find(c=>String(c.id)===String(id))||null;
  const avoidText=c=>String(c?.foods_to_avoid??c?.foodsToAvoid??c?.foodsAvoid??'').trim();
  const heightValue=c=>num(c?.height_cm??c?.heightCm??c?.height??c?.altura);

  function injectCss(){
    if(document.getElementById('dcc-client-profile-preferences-v1-css'))return;
    const s=document.createElement('style');
    s.id='dcc-client-profile-preferences-v1-css';
    s.textContent=`
      #dcc-new-client-premium .dcc-nc-textarea{width:100%;min-height:90px;margin:0!important;padding:13px 14px!important;border:1px solid rgba(163,174,186,.42)!important;border-radius:14px!important;outline:0!important;background:linear-gradient(145deg,#11171d,#0b1015)!important;color:#f5f2ec!important;-webkit-text-fill-color:#f5f2ec!important;font:600 14px/1.45 inherit!important;resize:vertical;box-shadow:inset 0 1px 0 rgba(255,255,255,.025)!important}
      #dcc-new-client-premium .dcc-nc-textarea::placeholder{color:#6f7782!important;-webkit-text-fill-color:#6f7782!important;opacity:1}
      #dcc-new-client-premium .dcc-nc-textarea:focus{border-color:${GOLD}!important;box-shadow:0 0 0 3px rgba(217,170,74,.10)!important}
      #coach-main .dcc-ca-avoid-card{display:grid;grid-template-columns:34px minmax(0,1fr) auto;align-items:center;gap:10px;margin-top:12px;padding:11px 12px;border:1px solid rgba(224,173,76,.44);border-radius:14px;background:linear-gradient(145deg,rgba(217,170,74,.075),rgba(8,12,15,.92));color:#f3f1ec}
      #coach-main .dcc-ca-avoid-icon{width:34px;height:34px;display:grid;place-items:center;border:1px solid rgba(240,201,107,.42);border-radius:10px;color:${GOLD};background:rgba(217,170,74,.07)}
      #coach-main .dcc-ca-avoid-icon svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}
      #coach-main .dcc-ca-avoid-copy{min-width:0}.dcc-ca-avoid-copy small{display:block;color:#9099a4;font-size:9px}.dcc-ca-avoid-copy b{display:block;margin-top:3px;color:#f4f2ed;font-size:11px;line-height:1.35;font-weight:760;overflow-wrap:anywhere}.dcc-ca-avoid-arrow{color:${GOLD};font-size:18px}
      #coach-main .dcc-diet-avoid-warning{display:grid;grid-template-columns:38px minmax(0,1fr);align-items:center;gap:11px;margin:0 0 11px;padding:11px 12px;border:1px solid rgba(240,201,107,.62);border-radius:15px;background:radial-gradient(circle at 94% 10%,rgba(240,201,107,.12),transparent 30%),linear-gradient(145deg,#15140f,#0b0d0e);box-shadow:inset 0 1px 0 rgba(255,255,255,.025)}
      #coach-main .dcc-diet-avoid-warning .ico{width:38px;height:38px;display:grid;place-items:center;border:1px solid rgba(240,201,107,.38);border-radius:11px;color:${GOLD};background:rgba(217,170,74,.08)}
      #coach-main .dcc-diet-avoid-warning svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
      #coach-main .dcc-diet-avoid-warning b{display:block;color:${GOLD};font-size:11px}.dcc-diet-avoid-warning p{margin:4px 0 0;color:#e8e5de;font-size:10px;line-height:1.4}
      @media(max-width:420px){#coach-main .dcc-ca-avoid-card{grid-template-columns:31px minmax(0,1fr) auto;padding:10px}.dcc-ca-avoid-icon{width:31px!important;height:31px!important}}
    `;
    document.head.appendChild(s);
  }

  const avoidIcon=()=>'<svg viewBox="0 0 24 24"><path d="M6 3v7M3.8 3v5a2.2 2.2 0 0 0 4.4 0V3M6 10v11M15 3v18M15 8c3 0 4-2 4-5v18"/><path d="M4 20 20 4"/></svg>';

  function injectNewClientPreference(){
    injectCss();
    const form=document.getElementById('dcc-new-client-premium');
    if(!form||document.getElementById('new-foods-avoid'))return;
    const goal=document.getElementById('new-goal')?.closest('.dcc-nc-field');
    const button=document.getElementById('dcc-create-client-btn');
    if(!goal||!button)return;
    const field=document.createElement('label');
    field.className='dcc-nc-field';
    field.innerHTML=`<span class="dcc-nc-label">${avoidIcon()}<span>Alimentos a evitar</span></span><textarea class="dcc-nc-textarea" id="new-foods-avoid" placeholder="Ej. cebolla, aceitunas, marisco"></textarea>`;
    button.parentNode.insertBefore(field,button);
  }

  function installNewClient(){
    const current=window.newClient;
    if(typeof current==='function'&&!current.__dccFoodPrefsV1){
      const wrapped=function(){
        const result=current.apply(this,arguments);
        requestAnimationFrame(injectNewClientPreference);
        setTimeout(injectNewClientPreference,40);
        return result;
      };
      wrapped.__dccFoodPrefsV1=true;
      wrapped.__base=current;
      window.newClient=wrapped;
    }

    const creator=window.createClient;
    if(typeof creator==='function'&&!creator.__dccFoodPrefsV1){
      const wrappedCreate=async function(){
        const d=appData();
        const before=new Set((d.clients||[]).map(c=>String(c.id)));
        const foods=String(document.getElementById('new-foods-avoid')?.value||'').trim();
        const h=num(document.getElementById('new-height')?.value||'');
        const result=await creator.apply(this,arguments);
        const created=(appData().clients||[]).find(c=>!before.has(String(c.id)))||null;
        if(created){
          if(h!=null){created.height=h;created.height_cm=h;created.heightCm=h;created.altura=h}
          created.foods_to_avoid=foods;created.foodsToAvoid=foods;
          cache.set(String(created.id),{height_cm:h,foods_to_avoid:foods});
          save();
          const db=database();
          if(db){
            try{
              const payload={foods_to_avoid:foods};
              if(h!=null)payload.height_cm=h;
              const {error}=await db.from('clients').update(payload).eq('id',created.id);
              if(error)throw error;
            }catch(error){
              console.error('DCC preferencias nuevo cliente:',error);
              notify('Cliente creado, pero no se pudieron guardar todas sus preferencias.');
            }
          }
        }
        return result;
      };
      wrappedCreate.__dccFoodPrefsV1=true;
      wrappedCreate.__base=creator;
      window.createClient=wrappedCreate;
    }
  }

  async function syncProfile(id){
    if(!id)return null;
    const key=String(id),db=database();
    if(!db)return cache.get(key)||null;
    try{
      const {data:row,error}=await db.from('clients').select('height_cm,foods_to_avoid').eq('id',key).maybeSingle();
      if(error)throw error;
      if(!row)return null;
      const cl=clientFor(key);
      if(cl){
        const h=num(row.height_cm);
        if(h!=null){cl.height=h;cl.height_cm=h;cl.heightCm=h;cl.altura=h}
        cl.foods_to_avoid=String(row.foods_to_avoid||'');
        cl.foodsToAvoid=String(row.foods_to_avoid||'');
        save();
      }
      cache.set(key,row);
      return row;
    }catch(error){
      console.error('DCC perfil cliente:',error);
      return cache.get(key)||null;
    }
  }

  function applyProfileDom(){
    const root=document.querySelector('#coach-main .dcc-ca-wrap');
    const id=currentId();
    if(!root||!id)return;
    const cl=clientFor(id);
    if(!cl)return;

    const h=heightValue(cl);
    [...root.querySelectorAll('.dcc-ca-info')].forEach(row=>{
      const label=(row.querySelector('span')?.textContent||'').trim().toLowerCase();
      if(label==='altura'){
        const value=row.querySelector('b');
        if(value)value.textContent=h!=null?`${String(h).replace('.',',')} cm`:'—';
      }
    });

    const general=[...root.querySelectorAll('.dcc-ca-card')].find(card=>/información general/i.test(card.querySelector('h2')?.textContent||''));
    if(general){
      let pref=general.querySelector('.dcc-ca-avoid-card');
      if(!pref){pref=document.createElement('div');pref.className='dcc-ca-avoid-card';general.appendChild(pref)}
      const foods=avoidText(cl);
      pref.innerHTML=`<span class="dcc-ca-avoid-icon">${avoidIcon()}</span><span class="dcc-ca-avoid-copy"><small>Alimentos a evitar</small><b>${foods?esc(foods):'Sin alimentos indicados'}</b></span><span class="dcc-ca-avoid-arrow">›</span>`;
    }

    const dietSwitch=root.querySelector('.dcc-diet-switch');
    root.querySelectorAll('.dcc-diet-avoid-warning').forEach(el=>el.remove());
    const foods=avoidText(cl);
    if(dietSwitch&&foods){
      const warning=document.createElement('div');
      warning.className='dcc-diet-avoid-warning';
      warning.innerHTML=`<span class="ico">${avoidIcon()}</span><div><b>Aviso del cliente</b><p>No incluir: ${esc(foods)}.</p></div>`;
      dietSwitch.parentNode.insertBefore(warning,dietSwitch);
    }
  }

  let patchTimer=0;
  function refreshProfile(){
    clearTimeout(patchTimer);
    patchTimer=setTimeout(async()=>{
      const id=currentId();
      if(!id)return;
      await syncProfile(id);
      applyProfileDom();
    },15);
  }

  function removeLocalClient(id){
    const d=appData();
    d.clients=(d.clients||[]).filter(c=>String(c.id)!==String(id));
    ['checkins','diets','routines','weights','workoutHistory','bodyFatHistory','messages','notificationState'].forEach(key=>{if(d[key]&&typeof d[key]==='object')delete d[key][id]});
    ['calendarSessions','sessions','coachCalendarSessions'].forEach(key=>{if(Array.isArray(d[key]))d[key]=d[key].filter(row=>String(row?.client_id??row?.clientId??row?.client)!==String(id))});
    cache.delete(String(id));
    save();
  }

  document.addEventListener('click',event=>{
    const del=event.target.closest?.('#coach-main .dcc-ca-delete');
    if(del){
      event.preventDefault();
      event.stopImmediatePropagation();
      const code=del.getAttribute('onclick')||'';
      const id=(code.match(/dccLegacyDelete\(\s*['\"]([^'\"]+)['\"]\s*\)/i)||[])[1]||currentId();
      if(!id)return;
      const cl=clientFor(id),name=cl?.name||'este cliente';
      if(!window.confirm(`¿Eliminar definitivamente a ${name}? Esta acción borrará también sus datos asociados.`))return;
      (async()=>{
        const db=database();
        if(!db){notify('No hay conexión con el servidor. El cliente no se ha eliminado.');return}
        try{
          const result=await db.from('clients').delete().eq('id',id).select('id');
          if(result.error)throw result.error;
          if(!Array.isArray(result.data)||result.data.length===0)throw new Error('El servidor no confirmó la eliminación');
          removeLocalClient(id);
          notify('Cliente eliminado definitivamente');
          if(typeof window.showCoach==='function')window.showCoach('clients');
        }catch(error){
          console.error('DCC eliminación definitiva:',error);
          notify('No se pudo eliminar el cliente. No se ha borrado localmente.');
        }
      })();
      return;
    }

    const addFood=event.target.closest?.('#coach-main .dcc-diet-add-food');
    if(addFood){
      const cl=clientFor(currentId()),foods=avoidText(cl);
      if(foods)window.alert(`Aviso del cliente\nNo incluir: ${foods}.`);
      return;
    }

    if(event.target.closest?.('#coach-main .dcc-ca-tab,#coach-main .dcc-cl-manage'))setTimeout(refreshProfile,25);
  },true);

  const observer=new MutationObserver(()=>{
    if(document.querySelector('#coach-main .dcc-ca-wrap'))refreshProfile();
  });
  function startObserver(){
    const main=document.getElementById('coach-main');
    if(main)observer.observe(main,{childList:true,subtree:true});else setTimeout(startObserver,120);
  }

  injectCss();
  installNewClient();
  startObserver();
  setTimeout(installNewClient,150);
  setTimeout(installNewClient,600);
  setTimeout(installNewClient,1800);
  window.addEventListener('load',()=>{setTimeout(installNewClient,80);setTimeout(refreshProfile,160)});
})();
