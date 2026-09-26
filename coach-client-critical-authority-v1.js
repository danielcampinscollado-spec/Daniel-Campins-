/* DCC — autoridad final para clientes del entrenador: sync, editar y eliminar */
(function(){
  'use strict';
  const BUILD='20260913-coach-client-critical-v1';
  if(window.__dccCoachClientCriticalAuthority===BUILD)return;
  window.__dccCoachClientCriticalAuthority=BUILD;

  const STYLE_ID='dcc-coach-client-critical-authority-css';
  const appData=()=>{try{return data||window.data||{}}catch(_){return window.data||{}}};
  const db=()=>{try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient}catch(_){}return window.supabaseClient||null};
  const num=v=>{const s=String(v??'').trim().replace(',','.');if(!s)return null;const n=Number(s);return Number.isFinite(n)?n:null};
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const shown=v=>{if(v===null||v===undefined||String(v).trim()==='')return'';const n=Number(v);return Number.isFinite(n)&&n===0?'':String(v)};
  const sameText=(a,b)=>String(a??'').trim()===String(b??'').trim();
  const sameNum=(a,b)=>{const x=num(a),y=num(b);return (x===null&&y===null)||(x!==null&&y!==null&&Math.abs(x-y)<0.001)};
  const notify=msg=>{try{if(typeof window.toast==='function')return window.toast(msg);if(typeof toast==='function')return toast(msg)}catch(_){}alert(msg)};

  function style(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');s.id=STYLE_ID;s.textContent=`
      .dcc-cca-overlay{position:fixed;inset:0;z-index:200000;display:flex;align-items:flex-end;justify-content:center;padding:18px;background:rgba(27,24,18,.38);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}
      .dcc-cca-card{width:min(680px,100%);max-height:90dvh;overflow:auto;padding:20px;border:1px solid #e3c782;border-radius:26px;background:#fffaf2;color:#17191d;box-shadow:0 24px 70px rgba(64,46,16,.26)}
      .dcc-cca-head{display:grid;grid-template-columns:1fr 42px;gap:10px;align-items:start;margin-bottom:16px}.dcc-cca-head h2{margin:0;font-size:23px}.dcc-cca-head p{margin:5px 0 0;color:#817869;font-size:11px}.dcc-cca-close{width:42px;height:42px;border:1px solid #ddbf74;border-radius:50%;background:#fffaf2;color:#8b641c;font-size:24px}
      .dcc-cca-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.dcc-cca-field{display:grid;gap:7px}.dcc-cca-field.full{grid-column:1/-1}.dcc-cca-field label{font-size:12px;font-weight:800;color:#746b5d}.dcc-cca-field input,.dcc-cca-field textarea,.dcc-cca-field select{width:100%;margin:0!important;padding:13px 14px!important;border:1px solid #dfca98!important;border-radius:14px!important;background:#fff!important;color:#17191d!important;-webkit-text-fill-color:#17191d!important;font-size:16px!important;outline:none!important;box-shadow:none!important}.dcc-cca-field textarea{min-height:88px;resize:vertical}.dcc-cca-field select{height:50px}
      .dcc-cca-actions{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:18px}.dcc-cca-actions button{min-height:49px;border-radius:14px;font-weight:900}.dcc-cca-cancel{border:1px solid #d8c9aa;background:#fff;color:#312f2b}.dcc-cca-save{border:1px solid #e3b74c;background:linear-gradient(135deg,#f9d76d,#e9b93e);color:#18140a}.dcc-cca-save:disabled{opacity:.6}
      .dcc-cca-loading{padding:28px 6px;text-align:center;color:#817869;font-size:13px}
      @media(max-width:560px){.dcc-cca-grid{grid-template-columns:1fr}.dcc-cca-field.full{grid-column:auto}.dcc-cca-card{padding:18px;border-radius:24px}}
    `;(document.head||document.documentElement).appendChild(s);
  }

  async function coachSession(){
    const database=db();if(!database?.auth)throw new Error('Supabase Auth no está disponible');
    const sr=await database.auth.getSession();if(sr.error)throw sr.error;
    const session=sr.data?.session;if(!session)throw new Error('Necesitas la sesión segura de entrenador');
    const pr=await database.from('app_profiles').select('role').eq('user_id',session.user.id).maybeSingle();
    if(pr.error)throw pr.error;if(pr.data?.role!=='coach')throw new Error('La sesión activa no es de entrenador');
    return session;
  }

  function normalize(row,previous={}){
    return {...previous,...row,
      id:String(row.id),name:String(row.name||''),goal:String(row.goal||''),
      weight:row.weight==null?null:Number(row.weight),initial:row.initial_weight==null?(row.weight==null?null:Number(row.weight)):Number(row.initial_weight),
      bodyFatInitial:row.initial_body_fat==null?null:Number(row.initial_body_fat),
      age:row.age==null?null:Number(row.age),height_cm:row.height_cm==null?null:Number(row.height_cm),heightCm:row.height_cm==null?null:Number(row.height_cm),height:row.height_cm==null?null:Number(row.height_cm),
      foods_to_avoid:String(row.foods_to_avoid||''),foodsToAvoid:String(row.foods_to_avoid||''),status:row.status||'Pendiente'
    };
  }

  function prune(valid){
    const d=appData();
    ['checkins','diets','routines','previousRoutines','routineUpdatedAt','weights','workoutHistory','bodyFatHistory','messages','notificationState','completedTrainingDays','dietHistory'].forEach(k=>{
      const obj=d[k];if(!obj||typeof obj!=='object'||Array.isArray(obj))return;
      Object.keys(obj).forEach(id=>{if(!valid.has(String(id)))delete obj[id]});
    });
    ['calendarSessions','sessions','coachCalendarSessions'].forEach(k=>{if(Array.isArray(d[k]))d[k]=d[k].filter(x=>valid.has(String(x?.client_id??x?.clientId??x?.client??'')))});
  }

  async function syncClients(render=true){
    await coachSession();
    const database=db();
    const res=await database.from('clients').select('*').order('created_at',{ascending:true});
    if(res.error)throw res.error;
    const d=appData(),previous=new Map((d.clients||[]).map(x=>[String(x.id),x]));
    d.clients=(res.data||[]).map(r=>normalize(r,previous.get(String(r.id))||{}));
    const valid=new Set(d.clients.map(x=>String(x.id)));prune(valid);
    try{if(typeof window.saveData==='function')window.saveData();else if(typeof saveData==='function')saveData()}catch(_){}
    if(render&&window.currentApp==='coach'&&typeof window.showCoach==='function'&&(window.currentScreen==='dashboard'||window.currentScreen==='clients'))window.showCoach(window.currentScreen);
    return d.clients;
  }
  window.dccCriticalSyncClients=syncClients;

  async function fetchProfile(id){
    await coachSession();const database=db();
    const [cr,fr]=await Promise.all([
      database.from('clients').select('id,name,goal,weight,age,height_cm,foods_to_avoid').eq('id',String(id)).maybeSingle(),
      database.from('client_body_fat_history').select('body_fat,recorded_at').eq('client_id',String(id)).order('recorded_at',{ascending:false}).limit(1)
    ]);
    if(cr.error)throw cr.error;if(!cr.data)throw new Error('El cliente ya no existe en Supabase');if(fr.error)throw fr.error;
    return {...cr.data,body_fat:Array.isArray(fr.data)&&fr.data.length?fr.data[0].body_fat:null};
  }

  function goalOptions(current){
    const opts=['Pérdida de grasa','Recomposición','Recomposición corporal','Ganancia muscular','Mantenimiento','Mejorar rendimiento'];const v=String(current||'');if(v&&!opts.includes(v))opts.unshift(v);
    return opts.map(x=>`<option value="${esc(x)}"${x===v?' selected':''}>${esc(x)}</option>`).join('');
  }

  function closeEditor(){document.querySelector('.dcc-cca-overlay')?.remove()}
  function renderEditor(overlay,p){
    overlay.innerHTML=`<div class="dcc-cca-card" role="dialog" aria-modal="true"><div class="dcc-cca-head"><div><h2>Editar cliente</h2><p>Datos actuales verificados en Supabase. Si un dato no existe, queda vacío.</p></div><button type="button" class="dcc-cca-close">×</button></div><div class="dcc-cca-grid">
      <div class="dcc-cca-field full"><label>Nombre y apellidos</label><input id="dcc-cca-name" value="${esc(p.name)}"></div>
      <div class="dcc-cca-field"><label>Edad</label><input id="dcc-cca-age" type="number" inputmode="numeric" min="10" max="100" value="${esc(shown(p.age))}"></div>
      <div class="dcc-cca-field"><label>Altura (cm)</label><input id="dcc-cca-height" type="number" inputmode="decimal" min="100" max="250" step="0.1" value="${esc(shown(p.height_cm))}"></div>
      <div class="dcc-cca-field"><label>Peso actual (kg)</label><input id="dcc-cca-weight" type="number" inputmode="decimal" min="20" max="500" step="0.1" value="${esc(shown(p.weight))}"></div>
      <div class="dcc-cca-field"><label>% de grasa actual</label><input id="dcc-cca-fat" type="number" inputmode="decimal" min="1" max="69" step="0.1" value="${esc(shown(p.body_fat))}"></div>
      <div class="dcc-cca-field full"><label>Objetivo</label><select id="dcc-cca-goal"><option value="">Sin definir</option>${goalOptions(p.goal)}</select></div>
      <div class="dcc-cca-field full"><label>Alimentos que no quiere / debe evitar</label><textarea id="dcc-cca-foods">${esc(p.foods_to_avoid||'')}</textarea></div>
    </div><div class="dcc-cca-actions"><button type="button" class="dcc-cca-cancel">Cancelar</button><button type="button" class="dcc-cca-save">Guardar cambios</button></div></div>`;
    overlay.querySelector('.dcc-cca-close').onclick=closeEditor;overlay.querySelector('.dcc-cca-cancel').onclick=closeEditor;overlay.querySelector('.dcc-cca-save').onclick=()=>saveProfile(String(p.id),overlay);
  }

  async function openEditor(id){
    style();id=String(id||window.selectedClient||'');if(!id)return notify('No se encontró el cliente seleccionado');
    closeEditor();const o=document.createElement('div');o.className='dcc-cca-overlay';o.innerHTML='<div class="dcc-cca-card"><div class="dcc-cca-loading">Cargando datos actuales…</div></div>';document.body.appendChild(o);o.addEventListener('click',e=>{if(e.target===o)closeEditor()});
    try{renderEditor(o,await fetchProfile(id))}catch(e){console.error('DCC critical editor open:',e);closeEditor();notify(e.message||'No se pudo cargar el cliente')}
  }
  window.dccCriticalOpenClientEditor=openEditor;

  async function saveProfile(id,overlay){
    const name=overlay.querySelector('#dcc-cca-name')?.value.trim()||'',age=num(overlay.querySelector('#dcc-cca-age')?.value),height=num(overlay.querySelector('#dcc-cca-height')?.value),weight=num(overlay.querySelector('#dcc-cca-weight')?.value),fat=num(overlay.querySelector('#dcc-cca-fat')?.value),goal=overlay.querySelector('#dcc-cca-goal')?.value.trim()||'',foods=overlay.querySelector('#dcc-cca-foods')?.value.trim()||'';
    if(!name)return notify('El nombre no puede quedar vacío');if(age!==null&&(age<10||age>100))return notify('Revisa la edad');if(height!==null&&(height<100||height>250))return notify('Revisa la altura');if(weight!==null&&(weight<=0||weight>500))return notify('Revisa el peso');if(fat!==null&&(fat<=0||fat>=70))return notify('Revisa el porcentaje de grasa');
    const b=overlay.querySelector('.dcc-cca-save');b.disabled=true;b.textContent='Guardando…';
    try{
      await coachSession();const database=db();const r=await database.rpc('dcc_update_client_profile',{p_client_id:id,p_name:name,p_goal:goal,p_age:age===null?null:Math.round(age),p_height_cm:height,p_foods_to_avoid:foods,p_weight:weight,p_body_fat:fat});if(r.error)throw r.error;if(r.data!==true)throw new Error('El servidor no confirmó el guardado');
      const v=await fetchProfile(id);const ok=sameText(v.name,name)&&sameText(v.goal,goal)&&sameNum(v.age,age===null?null:Math.round(age))&&sameNum(v.height_cm,height)&&sameNum(v.weight,weight)&&sameNum(v.body_fat,fat)&&sameText(v.foods_to_avoid,foods);if(!ok)throw new Error('La verificación posterior no coincide con los datos guardados');
      if(typeof window.dccSyncClientsFromServer==='function')await window.dccSyncClientsFromServer({render:false});else await syncClients(false);closeEditor();if(typeof window.dccClientAdmin==='function')window.dccClientAdmin(id,'summary');notify('Cliente actualizado correctamente');
    }catch(e){console.error('DCC critical editor save:',e);notify(e.message||'No se pudieron guardar los cambios');b.disabled=false;b.textContent='Guardar cambios';}
  }

  document.addEventListener('click',e=>{
    const b=e.target.closest?.('button');if(!b)return;
    const text=String(b.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();
    if(text==='editar cliente'){
      if(!document.querySelector('#coach-main.dcc-ca'))return;e.preventDefault();e.stopImmediatePropagation();openEditor(window.selectedClient);return;
    }
  },true);


})();
