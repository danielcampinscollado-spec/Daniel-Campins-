/* DCC — autoridad única de clientes del entrenador */
(function(){
  'use strict';
  const BUILD='20260913-coach-client-authority-v2';
  if(window.__dccCoachClientAuthority===BUILD)return;
  window.__dccCoachClientAuthority=BUILD;

  const STYLE_ID='dcc-coach-client-authority-v2-css';
  const appData=()=>{try{return data||window.data||{}}catch(_){return window.data||{}}};
  const db=()=>{try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient}catch(_){}return window.supabaseClient||null};
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const num=v=>{const s=String(v??'').trim().replace(',','.');if(!s)return null;const n=Number(s);return Number.isFinite(n)?n:null};
  const shown=v=>{if(v===null||v===undefined||String(v).trim()==='')return'';const n=Number(v);return Number.isFinite(n)&&n===0?'':String(v)};
  const sameText=(a,b)=>String(a??'').trim()===String(b??'').trim();
  const sameNum=(a,b)=>{const x=num(a),y=num(b);return (x===null&&y===null)||(x!==null&&y!==null&&Math.abs(x-y)<.001)};
  const notify=m=>{try{if(typeof window.toast==='function')return window.toast(m);if(typeof toast==='function')return toast(m)}catch(_){}alert(m)};

  let syncPromise=null;
  let renderGuard=false;
  let patchedOpenApp=false;
  let patchedShowCoach=false;
  let latestFat=new Map();

  function style(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');s.id=STYLE_ID;s.textContent=`
      .dcc-client-editor-overlay{position:fixed;inset:0;z-index:220000;display:flex;align-items:flex-end;justify-content:center;padding:18px;background:rgba(27,24,18,.38);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}
      .dcc-client-editor-card{width:min(680px,100%);max-height:90dvh;overflow:auto;padding:20px;border:1px solid #e3c782;border-radius:26px;background:#fffaf2;color:#17191d;box-shadow:0 24px 70px rgba(64,46,16,.26)}
      .dcc-client-editor-head{display:grid;grid-template-columns:1fr 42px;gap:10px;align-items:start;margin-bottom:16px}.dcc-client-editor-head h2{margin:0;font-size:23px}.dcc-client-editor-head p{margin:5px 0 0;color:#817869;font-size:11px}.dcc-client-editor-close{width:42px;height:42px;border:1px solid #ddbf74;border-radius:50%;background:#fffaf2;color:#8b641c;font-size:24px}
      .dcc-client-editor-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.dcc-client-editor-field{display:grid;gap:7px}.dcc-client-editor-field.full{grid-column:1/-1}.dcc-client-editor-field label{font-size:12px;font-weight:800;color:#746b5d}.dcc-client-editor-field input,.dcc-client-editor-field textarea,.dcc-client-editor-field select{width:100%;margin:0!important;padding:13px 14px!important;border:1px solid #dfca98!important;border-radius:14px!important;background:#fff!important;color:#17191d!important;-webkit-text-fill-color:#17191d!important;font-size:16px!important;outline:none!important;box-shadow:none!important}.dcc-client-editor-field textarea{min-height:88px;resize:vertical}.dcc-client-editor-field select{height:50px}
      .dcc-client-editor-actions{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:18px}.dcc-client-editor-actions button{min-height:49px;border-radius:14px;font-weight:900}.dcc-client-editor-cancel{border:1px solid #d8c9aa;background:#fff;color:#312f2b}.dcc-client-editor-save{border:1px solid #e3b74c;background:linear-gradient(135deg,#f9d76d,#e9b93e);color:#18140a}.dcc-client-editor-save:disabled{opacity:.6}.dcc-client-editor-loading{padding:28px 6px;text-align:center;color:#817869;font-size:13px}
      @media(max-width:560px){.dcc-client-editor-grid{grid-template-columns:1fr}.dcc-client-editor-field.full{grid-column:auto}.dcc-client-editor-card{padding:18px;border-radius:24px}}
    `;(document.head||document.documentElement).appendChild(s);
  }

  async function coachSession(){
    const database=db();if(!database?.auth)throw new Error('Supabase Auth no está disponible');
    const sr=await database.auth.getSession();if(sr.error)throw sr.error;
    const session=sr.data?.session;if(!session)throw new Error('Necesitas una sesión segura de entrenador');
    const pr=await database.from('app_profiles').select('role').eq('user_id',session.user.id).maybeSingle();
    if(pr.error)throw pr.error;if(pr.data?.role!=='coach')throw new Error('La sesión activa no es de entrenador');
    return session;
  }

  function normalize(row,previous={}){
    const fat=latestFat.get(String(row.id));
    return {...previous,...row,id:String(row.id),name:String(row.name||''),goal:String(row.goal||''),
      weight:row.weight==null?null:Number(row.weight),initial:row.initial_weight==null?(row.weight==null?null:Number(row.weight)):Number(row.initial_weight),
      bodyFatInitial:row.initial_body_fat==null?null:Number(row.initial_body_fat),bodyFat:fat??previous.bodyFat??null,body_fat:fat??previous.body_fat??null,currentBodyFat:fat??previous.currentBodyFat??null,latestBodyFat:fat??previous.latestBodyFat??null,
      age:row.age==null?null:Number(row.age),height_cm:row.height_cm==null?null:Number(row.height_cm),heightCm:row.height_cm==null?null:Number(row.height_cm),height:row.height_cm==null?null:Number(row.height_cm),
      foods_to_avoid:String(row.foods_to_avoid||''),foodsToAvoid:String(row.foods_to_avoid||''),status:row.status||'Pendiente'};
  }

  function prune(valid){
    const d=appData();
    ['checkins','diets','routines','previousRoutines','routineUpdatedAt','weights','workoutHistory','bodyFatHistory','messages','notificationState','completedTrainingDays','dietHistory'].forEach(k=>{
      const obj=d[k];if(!obj||typeof obj!=='object'||Array.isArray(obj))return;Object.keys(obj).forEach(id=>{if(!valid.has(String(id)))delete obj[id]});
    });
  }

  function persist(){try{if(typeof window.saveData==='function')window.saveData();else if(typeof saveData==='function')saveData()}catch(_){} }

  async function syncClients(render=false){
    if(syncPromise)return syncPromise;
    syncPromise=(async()=>{
      await coachSession();const database=db();
      const [cr,fr]=await Promise.all([
        database.from('clients').select('*').order('created_at',{ascending:true}),
        database.from('client_body_fat_history').select('client_id,body_fat,recorded_at').order('recorded_at',{ascending:true})
      ]);
      if(cr.error)throw cr.error;if(fr.error)throw fr.error;
      latestFat=new Map();const history={};
      for(const row of fr.data||[]){const id=String(row.client_id||'');const n=Number(row.body_fat);if(!id||!Number.isFinite(n))continue;latestFat.set(id,n);(history[id]||(history[id]=[])).push({bodyFat:n,body_fat:n,recorded_at:row.recorded_at});}
      const d=appData(),previous=new Map((d.clients||[]).map(x=>[String(x.id),x]));
      d.clients=(cr.data||[]).map(r=>normalize(r,previous.get(String(r.id))||{}));d.bodyFatHistory=d.bodyFatHistory||{};Object.assign(d.bodyFatHistory,history);
      const valid=new Set(d.clients.map(x=>String(x.id)));prune(valid);persist();
      if(render)rerenderCurrent();
      return d.clients;
    })().finally(()=>{syncPromise=null});
    return syncPromise;
  }
  window.dccCoachClientSync=syncClients;

  function patchFatMetric(){
    const id=String(window.selectedClient||'');const fat=latestFat.get(id);if(fat==null)return;
    const root=document.querySelector('#coach-main.dcc-ca');if(!root)return;
    const metric=[...root.querySelectorAll('.dcc-ca-metric')].find(el=>String(el.querySelector('small')?.textContent||'').toLowerCase().includes('% de grasa'));
    const b=metric?.querySelector('b');if(b)b.textContent=Number(fat).toFixed(1).replace('.',',')+' %';
  }

  function rerenderCurrent(){
    if(renderGuard)return;renderGuard=true;
    try{
      if(document.querySelector('#coach-main.dcc-ca')&&window.selectedClient&&typeof window.dccClientAdmin==='function')window.dccClientAdmin(window.selectedClient,'summary');
      else if(typeof window.showCoach==='function')window.showCoach(window.currentScreen==='clients'?'clients':'dashboard');
      queueMicrotask(patchFatMetric);
    }finally{setTimeout(()=>{renderGuard=false},0)}
  }

  function patchNavigation(){
    if(!patchedOpenApp&&typeof window.openApp==='function'){
      const base=window.openApp;window.openApp=async function(app){if(app==='coach'){try{await syncClients(false)}catch(e){console.warn('DCC client authority openApp sync:',e)}}return base.apply(this,arguments)};patchedOpenApp=true;
    }
    if(!patchedShowCoach&&typeof window.showCoach==='function'){
      const base=window.showCoach;window.showCoach=function(screen){const out=base.apply(this,arguments);if((screen==='dashboard'||screen==='clients')&&!renderGuard){queueMicrotask(async()=>{try{await syncClients(false);if(window.currentScreen===screen){renderGuard=true;try{base.call(window,screen)}finally{renderGuard=false}}}catch(e){console.warn('DCC client authority showCoach sync:',e)}})}return out};patchedShowCoach=true;
    }
  }

  async function fetchProfile(id){
    await coachSession();const database=db();const [cr,fr]=await Promise.all([
      database.from('clients').select('id,name,goal,weight,age,height_cm,foods_to_avoid').eq('id',String(id)).maybeSingle(),
      database.from('client_body_fat_history').select('body_fat,recorded_at').eq('client_id',String(id)).order('recorded_at',{ascending:false}).limit(1)
    ]);if(cr.error)throw cr.error;if(!cr.data)throw new Error('El cliente ya no existe en Supabase');if(fr.error)throw fr.error;
    return {...cr.data,body_fat:Array.isArray(fr.data)&&fr.data.length?fr.data[0].body_fat:null};
  }

  function closeEditor(){document.querySelector('.dcc-client-editor-overlay')?.remove()}
  function goalOptions(current){const opts=['Pérdida de grasa','Recomposición','Recomposición corporal','Ganancia muscular','Mantenimiento','Mejorar rendimiento'];const v=String(current||'');if(v&&!opts.includes(v))opts.unshift(v);return opts.map(x=>`<option value="${esc(x)}"${x===v?' selected':''}>${esc(x)}</option>`).join('')}

  async function openEditor(id){
    style();id=String(id||window.selectedClient||'');if(!id)return notify('No se encontró el cliente seleccionado');closeEditor();
    const o=document.createElement('div');o.className='dcc-client-editor-overlay';o.innerHTML='<div class="dcc-client-editor-card"><div class="dcc-client-editor-loading">Cargando datos actuales…</div></div>';document.body.appendChild(o);o.addEventListener('click',e=>{if(e.target===o)closeEditor()});
    try{const p=await fetchProfile(id);o.innerHTML=`<div class="dcc-client-editor-card" role="dialog" aria-modal="true"><div class="dcc-client-editor-head"><div><h2>Editar cliente</h2><p>Datos actuales verificados en Supabase. Si un dato no existe, queda vacío.</p></div><button type="button" class="dcc-client-editor-close">×</button></div><div class="dcc-client-editor-grid">
      <div class="dcc-client-editor-field full"><label>Nombre y apellidos</label><input id="dcc-client-name" value="${esc(p.name)}"></div>
      <div class="dcc-client-editor-field"><label>Edad</label><input id="dcc-client-age" type="number" inputmode="numeric" min="10" max="100" value="${esc(shown(p.age))}"></div>
      <div class="dcc-client-editor-field"><label>Altura (cm)</label><input id="dcc-client-height" type="number" inputmode="decimal" min="100" max="250" step="0.1" value="${esc(shown(p.height_cm))}"></div>
      <div class="dcc-client-editor-field"><label>Peso actual (kg)</label><input id="dcc-client-weight" type="number" inputmode="decimal" min="20" max="500" step="0.1" value="${esc(shown(p.weight))}"></div>
      <div class="dcc-client-editor-field"><label>% de grasa actual</label><input id="dcc-client-fat" type="number" inputmode="decimal" min="1" max="69" step="0.1" value="${esc(shown(p.body_fat))}"></div>
      <div class="dcc-client-editor-field full"><label>Objetivo</label><select id="dcc-client-goal"><option value="">Sin definir</option>${goalOptions(p.goal)}</select></div>
      <div class="dcc-client-editor-field full"><label>Alimentos que no quiere / debe evitar</label><textarea id="dcc-client-foods">${esc(p.foods_to_avoid||'')}</textarea></div>
    </div><div class="dcc-client-editor-actions"><button type="button" class="dcc-client-editor-cancel">Cancelar</button><button type="button" class="dcc-client-editor-save">Guardar cambios</button></div></div>`;
      o.querySelector('.dcc-client-editor-close').onclick=closeEditor;o.querySelector('.dcc-client-editor-cancel').onclick=closeEditor;o.querySelector('.dcc-client-editor-save').onclick=()=>saveProfile(id,o);
    }catch(e){console.error('DCC client editor:',e);closeEditor();notify(e.message||'No se pudo cargar el cliente')}
  }

  async function saveProfile(id,o){
    const name=o.querySelector('#dcc-client-name')?.value.trim()||'',age=num(o.querySelector('#dcc-client-age')?.value),height=num(o.querySelector('#dcc-client-height')?.value),weight=num(o.querySelector('#dcc-client-weight')?.value),fat=num(o.querySelector('#dcc-client-fat')?.value),goal=o.querySelector('#dcc-client-goal')?.value.trim()||'',foods=o.querySelector('#dcc-client-foods')?.value.trim()||'';
    if(!name)return notify('El nombre no puede quedar vacío');if(age!==null&&(age<10||age>100))return notify('Revisa la edad');if(height!==null&&(height<100||height>250))return notify('Revisa la altura');if(weight!==null&&(weight<=0||weight>500))return notify('Revisa el peso');if(fat!==null&&(fat<=0||fat>=70))return notify('Revisa el porcentaje de grasa');
    const b=o.querySelector('.dcc-client-editor-save');b.disabled=true;b.textContent='Guardando…';
    try{await coachSession();const database=db();const r=await database.rpc('dcc_update_client_profile',{p_client_id:id,p_name:name,p_goal:goal,p_age:age===null?null:Math.round(age),p_height_cm:height,p_foods_to_avoid:foods,p_weight:weight,p_body_fat:fat});if(r.error)throw r.error;if(r.data!==true)throw new Error('El servidor no confirmó el guardado');
      const v=await fetchProfile(id);if(!(sameText(v.name,name)&&sameText(v.goal,goal)&&sameNum(v.age,age===null?null:Math.round(age))&&sameNum(v.height_cm,height)&&sameNum(v.weight,weight)&&sameNum(v.body_fat,fat)&&sameText(v.foods_to_avoid,foods)))throw new Error('La verificación posterior no coincide con los datos guardados');
      await syncClients(false);closeEditor();if(typeof window.dccClientAdmin==='function')window.dccClientAdmin(id,'summary');queueMicrotask(patchFatMetric);notify('Cliente actualizado correctamente');
    }catch(e){console.error('DCC client save:',e);notify(e.message||'No se pudieron guardar los cambios');b.disabled=false;b.textContent='Guardar cambios'}
  }

  async function deleteClient(id,button){
    id=String(id||window.selectedClient||'');if(!id)return notify('No se encontró el cliente seleccionado');const d=appData(),cl=(d.clients||[]).find(x=>String(x.id)===id);if(!confirm(`¿Eliminar definitivamente a ${cl?.name||'este cliente'}? Esta acción borrará también sus datos asociados.`))return;
    const old=button?.textContent;if(button){button.disabled=true;button.textContent='Eliminando…'}
    try{await coachSession();const database=db();const r=await database.rpc('dcc_delete_client',{p_client_id:id});if(r.error)throw r.error;if(r.data!==true)throw new Error('El servidor no confirmó la eliminación');const check=await database.from('clients').select('id').eq('id',id).maybeSingle();if(check.error)throw check.error;if(check.data)throw new Error('El cliente sigue existiendo en Supabase');await syncClients(false);window.selectedClient=null;if(typeof window.showCoach==='function')window.showCoach('clients');notify('Cliente eliminado definitivamente')}
    catch(e){console.error('DCC client delete:',e);alert('No se pudo eliminar el cliente.\n\n'+(e.message||'Error del servidor'));if(button){button.disabled=false;button.textContent=old||'Eliminar cliente'}}
  }

  document.addEventListener('click',e=>{
    const b=e.target.closest?.('button,a,[role="button"]');if(!b)return;const text=String(b.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();
    if(text==='editar cliente'&&document.querySelector('#coach-main.dcc-ca')){e.preventDefault();e.stopImmediatePropagation();openEditor(window.selectedClient);return}
    if((text==='eliminar cliente'||b.classList.contains('dcc-ca-delete'))&&document.querySelector('#coach-main.dcc-ca')){e.preventDefault();e.stopImmediatePropagation();deleteClient(window.selectedClient,b);return}
  },true);

  async function bootstrap(){patchNavigation();try{if(window.__dccSecureRole==='coach'||document.querySelector('.dcc-secure-session-badge')){await syncClients(false);if(document.getElementById('coach')&&getComputedStyle(document.getElementById('coach')).display!=='none')rerenderCurrent()}}catch(e){console.warn('DCC client authority bootstrap:',e)} }
  document.addEventListener('DOMContentLoaded',()=>queueMicrotask(bootstrap),{once:true});window.addEventListener('load',()=>queueMicrotask(bootstrap),{once:true});window.addEventListener('pageshow',()=>queueMicrotask(bootstrap));
  [0,100,300,700,1400,2500].forEach(ms=>setTimeout(()=>{patchNavigation();if(window.__dccSecureRole==='coach')bootstrap()},ms));
})();
