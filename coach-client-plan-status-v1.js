/* DCC app quality v5 — flujo de clientes, avisos, sincronización y métricas robustas */
(function(){
  'use strict';
  if(window.__dccAppQualityV5)return;
  window.__dccAppQualityV5=true;

  const GOLD='#f0c96b';
  const METRIC_OVERLAY='dcc-quality-metric-overlay';
  const appData=()=>{try{return data||{}}catch(e){return window.data||{}}};
  const database=()=>{try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient}catch(e){}return window.supabaseClient||null};
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const num=v=>{const n=parseFloat(String(v??'').replace(',','.'));return Number.isFinite(n)?n:null};
  const saveLocal=()=>{try{if(typeof saveData==='function')return saveData();if(typeof window.saveData==='function')return window.saveData()}catch(e){console.warn('DCC guardado local:',e)}};
  const notify=t=>{try{if(typeof toast==='function')return toast(t);if(typeof window.toast==='function')return window.toast(t)}catch(e){}console.log(t)};
  const clientById=id=>(appData().clients||[]).find(c=>String(c.id)===String(id))||null;

  function activeClientId(){try{return currentClientId||null}catch(e){return window.currentClientId||null}}
  function setActiveClientId(id){
    try{currentClientId=id}catch(e){}
    try{window.currentClientId=id}catch(e){}
  }
  function ensureActiveClient(){
    const d=appData(),clients=Array.isArray(d.clients)?d.clients:[];
    let c=clientById(activeClientId());
    if(!c)c=clients.find(x=>String(x.id)==='carlos')||clients[0]||null;
    if(c)setActiveClientId(c.id);
    return c;
  }
  function localDateKey(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
  function localWeekKey(){
    const d=new Date();d.setHours(12,0,0,0);d.setDate(d.getDate()-((d.getDay()+6)%7));return localDateKey(d);
  }

  function mealReady(meal){
    if(Array.isArray(meal?.options)&&meal.options.length)return meal.options.some(o=>Array.isArray(o?.foods)&&o.foods.length>0);
    return Array.isArray(meal?.foods)&&meal.foods.length>0;
  }
  function dietReady(id){
    const x=appData().diets?.[id];
    return !!x&&['training','rest'].every(type=>{const meals=x?.[type]?.meals;return Array.isArray(meals)&&meals.length>0&&meals.every(mealReady)});
  }
  function routineReady(id){
    const r=appData().routines?.[id],days=Array.isArray(r)?r:Array.isArray(r?.routine)?r.routine:[];
    return days.length>0&&days.every(day=>Array.isArray(day?.exercises)&&day.exercises.length>0);
  }
  const foodsToAvoid=c=>String(c?.foods_to_avoid??c?.foodsToAvoid??'').trim();
  const pendingCheckin=id=>{const x=appData().checkins?.[id];return !!((x?.sentAt??x?.sent_at)&&!x?.reviewed)};

  function addCss(){
    if(document.getElementById('dcc-quality-v5-css'))return;
    document.getElementById('dcc-plan-v41-css')?.remove();
    const s=document.createElement('style');s.id='dcc-quality-v5-css';s.textContent=`
      #coach-main .dcc-v5-plan{margin:11px 0 13px;padding:12px 13px;border:1px solid rgba(240,201,107,.68);border-radius:17px;background:radial-gradient(circle at 96% 0,rgba(240,201,107,.10),transparent 38%),linear-gradient(145deg,#12171b,#090d10)}
      #coach-main .dcc-v5-plan-title{display:flex;align-items:center;gap:8px;margin-bottom:8px;color:${GOLD};font-size:10px;font-weight:900;letter-spacing:1.6px;text-transform:uppercase}
      #coach-main .dcc-v5-plan-list{display:grid;gap:7px}
      #coach-main .dcc-v5-plan-item{width:100%;display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:8px;padding:11px;border:1px solid #303943;border-radius:12px;background:#0a0f13;color:#f5f3ef;text-align:left;min-height:54px}
      #coach-main .dcc-v5-plan-item b{display:block;font-size:12px}.dcc-v5-plan-item small{display:block;margin-top:3px;color:#929ba6;font-size:9px;line-height:1.3}.dcc-v5-plan-go{color:${GOLD};font-size:18px}
      #coach-main .dcc-v5-foods{margin-top:12px;padding:11px 12px;border:1px solid rgba(224,173,76,.44);border-radius:14px;background:linear-gradient(145deg,rgba(217,170,74,.075),rgba(8,12,15,.92))}
      #coach-main .dcc-v5-foods small{display:block;color:${GOLD};font-size:9px;font-weight:850;letter-spacing:1.2px;text-transform:uppercase}.dcc-v5-foods b{display:block;margin-top:5px;color:#f4f2ed;font-size:12px;line-height:1.4}
      #coach-main .dcc-v5-diet-warning{margin:0 0 11px;padding:11px 12px;border:1px solid rgba(240,201,107,.62);border-radius:15px;background:linear-gradient(145deg,#15140f,#0b0d0e)}
      #coach-main .dcc-v5-diet-warning b{display:block;color:${GOLD};font-size:11px}.dcc-v5-diet-warning p{margin:4px 0 0;color:#e8e5de;font-size:10px;line-height:1.4}
      #coach-main .dcc-p9-row-icon svg{width:19px;height:19px;display:block;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
      #coach-main .dcc-cl-filter.dcc-quality-pending{border-color:${GOLD}!important;color:${GOLD}!important;background:rgba(217,170,74,.08)!important}
      button:focus-visible,[role="button"]:focus-visible{outline:2px solid ${GOLD};outline-offset:2px}
      #${METRIC_OVERLAY}{position:fixed;inset:0;z-index:60000;display:flex;align-items:center;justify-content:center;padding:18px;background:rgba(0,0,0,.82);backdrop-filter:blur(9px);-webkit-backdrop-filter:blur(9px)}
      #${METRIC_OVERLAY} *{box-sizing:border-box}#${METRIC_OVERLAY} .dcc-q-card{width:min(100%,430px);padding:20px;border:1px solid rgba(240,201,107,.72);border-radius:24px;background:radial-gradient(circle at 95% 0,rgba(240,201,107,.10),transparent 30%),linear-gradient(145deg,#11171d,#080b0f);color:#f5f3ef;box-shadow:0 25px 70px rgba(0,0,0,.55)}
      #${METRIC_OVERLAY} .dcc-q-head{display:grid;grid-template-columns:minmax(0,1fr) 44px;align-items:start;gap:12px;margin-bottom:16px}#${METRIC_OVERLAY} h2{margin:0;font-size:24px;letter-spacing:-.5px}#${METRIC_OVERLAY} p{margin:6px 0 0;color:#929ba6;font-size:10px;line-height:1.4}#${METRIC_OVERLAY} .dcc-q-close{width:42px;height:42px;border:1px solid rgba(217,170,74,.45);border-radius:13px;background:#0a0e12;color:#f3f1ec;font-size:22px}
      #${METRIC_OVERLAY} label{display:block;color:#e9e7e2;font-size:11px;font-weight:800}#${METRIC_OVERLAY} input{width:100%;height:52px;margin-top:8px;padding:0 14px;border:1px solid #39434c;border-radius:14px;background:#0b1014;color:#fff;-webkit-text-fill-color:#fff;outline:0;font-size:16px}#${METRIC_OVERLAY} input:focus{border-color:${GOLD};box-shadow:0 0 0 3px rgba(217,170,74,.09)}
      #${METRIC_OVERLAY} .dcc-q-save{width:100%;height:52px;margin-top:14px;border:1px solid #f1cd68;border-radius:15px;background:linear-gradient(135deg,#f2cd67,#dba63b);color:#111009;font-weight:900}#${METRIC_OVERLAY} .dcc-q-save:disabled{opacity:.55}
      body.dcc-quality-modal-open{overflow:hidden}
    `;document.head.appendChild(s);
  }

  function patchNewClientLabel(){
    const root=document.getElementById('dcc-new-client-premium');if(!root)return;
    const label=[...root.querySelectorAll('.dcc-nc-label')].find(x=>/%\s*de\s*grasa\s*inicial/i.test(x.textContent||''));
    const text=label?.querySelector('span:last-child');if(text)text.textContent='Grasa corporal inicial';
    const foods=document.getElementById('new-foods-avoid');if(foods&&!foods.getAttribute('aria-label'))foods.setAttribute('aria-label','Alimentos a evitar');
  }

  async function hydrateClient(id){
    const c=clientById(id),db=database();if(!c||!db)return c;
    try{
      const {data:row,error}=await db.from('clients').select('age,height_cm,foods_to_avoid,created_at,initial_weight,initial_body_fat').eq('id',id).maybeSingle();
      if(error||!row)return c;
      if(row.age!=null)c.age=Number(row.age);
      if(row.height_cm!=null){const h=Number(row.height_cm);c.height=h;c.height_cm=h;c.heightCm=h;c.altura=h}
      if(row.initial_weight!=null){c.initial=Number(row.initial_weight);c.initial_weight=Number(row.initial_weight)}
      if(row.initial_body_fat!=null){c.bodyFatInitial=Number(row.initial_body_fat);c.initial_body_fat=Number(row.initial_body_fat)}
      if(row.created_at)c.created_at=row.created_at;
      c.foods_to_avoid=String(row.foods_to_avoid||'');c.foodsToAvoid=String(row.foods_to_avoid||'');
      return c;
    }catch(e){console.warn('DCC perfil cliente:',e);return c}
  }

  function openPlan(id,kind){
    window.selectedClient=id;window.__dccClientAdminId=id;
    const tab=kind==='diet'?'food':'training';
    try{
      if(typeof window.dccClientAdmin==='function')window.dccClientAdmin(id,tab);
      else if(typeof window.openClient==='function')window.openClient(id);
    }catch(e){console.error('DCC abriendo plan:',e)}
  }
  window.dccOpenPlanV5=openPlan;

  function checkinLabel(id){
    const x=appData().checkins?.[id]||{},raw=x.sentAt??x.sent_at??null;
    if(!raw)return'Sin check-in';
    const d=new Date(raw);if(!Number.isFinite(d.getTime()))return x.reviewed?'Revisado':'Pendiente';
    const date=d.toLocaleDateString('es-ES',{day:'2-digit',month:'short'});
    return `${x.reviewed?'Revisado':'Pendiente'} · ${date}`;
  }

  function decorateProfile(id,tab){
    addCss();const root=document.querySelector('#coach-main .dcc-ca-wrap');if(!root)return;
    const c=clientById(id)||currentProfileClient();if(!c)return;
    id=String(c.id);window.__dccClientAdminId=id;window.selectedClient=id;
    const pending=[];
    if(!dietReady(id))pending.push({kind:'diet',title:'Alimentación sin terminar',sub:'Completa la alimentación de entrenamiento y descanso.'});
    if(!routineReady(id))pending.push({kind:'routine',title:'Rutina sin terminar',sub:'Completa todos los días y ejercicios de entrenamiento.'});
    const active=String(tab||root.querySelector('.dcc-ca-tab.active')?.textContent||'summary').toLowerCase();
    const foods=foodsToAvoid(c),nativeFoods=[...root.querySelectorAll('.dcc-ca-info span')].some(x=>(x.textContent||'').trim().toLowerCase()==='alimentos a evitar'),nativeDiet=!!root.querySelector('.dcc-native-avoid-warning'),wantFood=(active==='summary'||active.includes('resumen'))&&!nativeFoods,wantDiet=(active==='food'||active.includes('alimenta'))&&!!foods&&!nativeDiet;
    const sig=[id,active,pending.map(p=>p.kind).join(','),foods,checkinLabel(id)].join('|');
    const complete=(pending.length===0||!!root.querySelector('.dcc-v5-plan'))&&(!wantFood||!!root.querySelector('.dcc-v5-foods'))&&(!wantDiet||!!root.querySelector('.dcc-v5-diet-warning'));
    if(root.dataset.dccV5ProfileSig===sig&&complete)return;
    root.querySelectorAll('.dcc-v5-plan,.dcc-v5-foods,.dcc-v5-diet-warning').forEach(x=>x.remove());
    if(pending.length){
      const box=document.createElement('section');box.className='dcc-v5-plan';
      box.innerHTML=`<div class="dcc-v5-plan-title"><span>!</span><span>Plan pendiente de completar</span></div><div class="dcc-v5-plan-list">${pending.map(p=>`<button type="button" class="dcc-v5-plan-item" onclick="dccOpenPlanV5('${esc(id)}','${p.kind}')"><span><b>${p.title}</b><small>${p.sub}</small></span><span class="dcc-v5-plan-go">›</span></button>`).join('')}</div>`;
      root.querySelector('.dcc-ca-metrics')?.insertAdjacentElement('afterend',box);
    }
    if(wantFood){
      const general=[...root.querySelectorAll('.dcc-ca-card')].find(x=>/información general/i.test(x.querySelector('h2')?.textContent||''));
      if(general){
        const last=[...general.querySelectorAll('.dcc-ca-info')].find(x=>/último check-in/i.test(x.querySelector('span')?.textContent||''));const b=last?.querySelector('b');if(b)b.textContent=checkinLabel(id);
        const card=document.createElement('div');card.className='dcc-v5-foods';card.innerHTML=`<small>Alimentos a evitar</small><b>${foods?esc(foods):'Sin alimentos indicados'}</b>`;general.appendChild(card);
      }
    }
    if(wantDiet){const sw=root.querySelector('.dcc-diet-switch');if(sw){const w=document.createElement('div');w.className='dcc-v5-diet-warning';w.innerHTML=`<b>Aviso del cliente</b><p>No incluir en la dieta: ${esc(foods)}.</p>`;sw.parentNode.insertBefore(w,sw)}}
    root.dataset.dccV5ProfileSig=sig;
  }

  function currentProfileClient(){
    const root=document.querySelector('#coach-main .dcc-ca-wrap');if(!root)return null;
    const shown=(root.querySelector('.dcc-ca-head h1')?.textContent||'').trim().toLowerCase();
    if(shown){const hit=(appData().clients||[]).find(c=>String(c.name||'').trim().toLowerCase()===shown);if(hit)return hit}
    for(const id of [window.__dccClientAdminId,window.selectedClient]){const hit=clientById(id);if(hit)return hit}
    return null;
  }

  function taskIcon(kind){
    if(kind==='diet')return '<svg viewBox="0 0 24 24"><path d="M7 3v7M4.5 3v4.5A2.5 2.5 0 0 0 7 10v11M9.5 3v4.5A2.5 2.5 0 0 1 7 10"/><path d="M16 3v18M16 3c3 2.7 3.5 7.2 0 10"/></svg>';
    if(kind==='routine')return '<svg viewBox="0 0 24 24"><path d="M3 10v4M6 8v8M18 8v8M21 10v4M6 12h12"/></svg>';
    return '<svg viewBox="0 0 24 24"><path d="M5 12.5 9.3 17 19 7"/></svg>';
  }
  function taskHtml(t){
    const action=t.kind==='checkin'?`reviewCheckin('${esc(t.id)}')`:`dccOpenPlanV5('${esc(t.id)}','${t.kind}')`;
    return `<button type="button" class="dcc-p9-row" onclick="${action}"><span class="dcc-p9-row-icon">${taskIcon(t.kind)}</span><span class="dcc-p9-row-copy"><b>${esc(t.title)}</b><span>${esc(t.name)}</span></span><span class="dcc-p9-badge">PENDIENTE</span><span class="dcc-p9-arrow">›</span></button>`;
  }
  function daysSince(v){if(!v)return null;const d=new Date(v);return Number.isFinite(d.getTime())?Math.floor((Date.now()-d.getTime())/86400000):null}
  function latestWorkout(id){const h=appData().workoutHistory?.[id]||[];return h.slice().sort((a,b)=>new Date(b?.date??b?.workout_date??0)-new Date(a?.date??a?.workout_date??0))[0]||null}

  function patchDashboard(){
    const panel=document.getElementById('dccP9Tasks');if(!panel)return;
    const tasks=[];(appData().clients||[]).forEach(c=>{
      if(pendingCheckin(c.id))tasks.push({id:c.id,kind:'checkin',title:'REVISAR CHECK-IN',name:c.name});
      if(!dietReady(c.id))tasks.push({id:c.id,kind:'diet',title:'CREAR ALIMENTACIÓN',name:c.name});
      if(!routineReady(c.id))tasks.push({id:c.id,kind:'routine',title:'CREAR RUTINA',name:c.name});
    });
    const count=panel.querySelector('.dcc-p9-count');if(count&&count.textContent!==String(tasks.length))count.textContent=String(tasks.length);
    const taskStat=[...document.querySelectorAll('#coach-main .dcc-p9-stat')].find(x=>/tareas pendientes/i.test(x.textContent||''));
    const taskStrong=taskStat?.querySelector('strong');if(taskStrong&&taskStrong.textContent!==String(tasks.length))taskStrong.textContent=String(tasks.length);
    const body=panel.querySelector('.dcc-p9-body');
    if(body){const sig=tasks.map(t=>`${t.id}:${t.kind}:${t.name}`).join('|');if(panel.dataset.dccV5TaskSig!==sig){body.innerHTML=tasks.length?`<div class="dcc-p9-inner">${tasks.slice(0,16).map(taskHtml).join('')}</div>`:`<div class="dcc-p9-inner"><div class="dcc-p9-empty"><span class="dcc-p9-empty-i">✓</span><span>Todo al día. No hay tareas pendientes.</span></div></div>`;panel.dataset.dccV5TaskSig=sig}}

    const attention=document.getElementById('dccP9Attention');
    if(attention){
      const n=(appData().clients||[]).filter(c=>{const gap=daysSince(latestWorkout(c.id)?.date??latestWorkout(c.id)?.workout_date);return gap!=null&&gap>=7}).length;
      const attentionStat=[...document.querySelectorAll('#coach-main .dcc-p9-stat')].find(x=>/requieren atención/i.test(x.textContent||''));
      const attentionStrong=attentionStat?.querySelector('strong');if(attentionStrong&&attentionStrong.textContent!==String(n))attentionStrong.textContent=String(n);
      const title=attention.querySelector('.dcc-p9-head-title');if(title){let badge=title.querySelector('.dcc-p9-count');if(!badge){badge=document.createElement('span');badge.className='dcc-p9-count';title.appendChild(badge)}if(badge.textContent!==String(n))badge.textContent=String(n)}
    }
  }

  function cleanLegacyUnits(root=document){
    root.querySelectorAll?.('.dcc-ci-rside,.dcc-ca-trend,.dcc-bfh-delta,.dcpr6-chip,.dcpr6-chart-badge').forEach(el=>{
      const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT),nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
      nodes.forEach(n=>{const next=String(n.nodeValue||'').replace(/(\d+(?:[.,]\d+)?)\s*(?:pts?\.?|ptas?\.?|puntos?)\b/gi,'$1 %');if(next!==n.nodeValue)n.nodeValue=next});
    });
  }

  function normalizeMeal(m){
    if(!m||typeof m!=='object')return m;
    const out={...m};
    if(!Array.isArray(out.options)||!out.options.length){const foods=Array.isArray(out.foods)?out.foods:[];out.options=[{name:'Opción 1',foods}];delete out.foods}
    return out;
  }

  function installAuthoritativeLoaders(){
    const diets=window.loadDietsFromSupabase;
    if(typeof diets==='function'&&!diets.__dccQualityV5){
      const fn=async function(){
        const db=database();if(!db)return false;
        try{
          const {data:rows,error}=await db.from('client_diets').select('client_id,diet_type,calories,protein,meals,updated_at');if(error)throw error;
          const d=appData(),next={};(d.clients||[]).forEach(c=>next[c.id]={training:{calories:'',protein:'',meals:[]},rest:{calories:'',protein:'',meals:[]}});
          (rows||[]).forEach(r=>{if(!next[r.client_id])return;const t=r.diet_type==='rest'?'rest':'training';next[r.client_id][t]={calories:r.calories||'',protein:r.protein||'',meals:(Array.isArray(r.meals)?r.meals:[]).map(normalizeMeal),updated_at:r.updated_at||null}});
          d.diets=next;saveLocal();return true;
        }catch(e){console.error('DCC sincronizando alimentación:',e);return false}
      };fn.__dccQualityV5=true;fn.__base=diets;window.loadDietsFromSupabase=fn;
    }

    const routines=window.loadRoutinesFromSupabase;
    if(typeof routines==='function'&&!routines.__dccQualityV5){
      const fn=async function(){
        const db=database();if(!db)return false;
        try{
          const {data:rows,error}=await db.from('client_routines').select('client_id,routine,updated_at');if(error)throw error;
          const d=appData(),next={};(d.clients||[]).forEach(c=>next[c.id]=[]);(rows||[]).forEach(r=>{if(Object.prototype.hasOwnProperty.call(next,r.client_id))next[r.client_id]=Array.isArray(r.routine)?r.routine:[]});d.routines=next;saveLocal();return true;
        }catch(e){console.error('DCC sincronizando rutinas:',e);return false}
      };fn.__dccQualityV5=true;fn.__base=routines;window.loadRoutinesFromSupabase=fn;
    }

    const clients=window.loadClientsFromSupabase;
    if(typeof clients==='function'&&!clients.__dccQualityV5){
      const fn=async function(){
        const result=await clients.apply(this,arguments);
        const d=appData(),valid=new Set((d.clients||[]).map(c=>String(c.id)));
        ['checkins','diets','routines','weights','workoutHistory','bodyFatHistory','messages','notificationState'].forEach(k=>{const map=d[k];if(!map||typeof map!=='object'||Array.isArray(map))return;Object.keys(map).forEach(id=>{if(!valid.has(String(id)))delete map[id]})});
        ensureActiveClient();saveLocal();return result;
      };fn.__dccQualityV5=true;fn.__base=clients;window.loadClientsFromSupabase=fn;
    }
  }

  function closeMetric(){document.getElementById(METRIC_OVERLAY)?.remove();document.body.classList.remove('dcc-quality-modal-open')}
  function openMetric(id,type){
    addCss();const c=clientById(id);if(!c)return;
    closeMetric();const isWeight=type==='weight';
    const current=isWeight?num(c.weight):num(appData().checkins?.[id]?.bodyFat??appData().checkins?.[id]?.body_fat??c.bodyFat??c.body_fat);
    const overlay=document.createElement('div');overlay.id=METRIC_OVERLAY;overlay.dataset.clientId=id;overlay.dataset.metric=type;
    overlay.innerHTML=`<div class="dcc-q-card" role="dialog" aria-modal="true" aria-labelledby="dcc-q-title"><div class="dcc-q-head"><div><h2 id="dcc-q-title">${isWeight?'Actualizar peso':'Actualizar grasa corporal'}</h2><p>${isWeight?'Registra el peso actual. El historial se conservará automáticamente.':'Registra el porcentaje actual. Las subidas y bajadas quedarán en el historial.'}</p></div><button type="button" class="dcc-q-close" aria-label="Cerrar">×</button></div><label>${isWeight?'Peso actual (kg)':'Grasa corporal (%)'}<input id="dcc-q-value" inputmode="decimal" autocomplete="off" placeholder="${isWeight?'Ej. 75,5':'Ej. 18,5'}" value="${current!=null?String(current).replace('.',','):''}"></label><button type="button" class="dcc-q-save">Guardar cambio</button></div>`;
    document.body.appendChild(overlay);document.body.classList.add('dcc-quality-modal-open');
    overlay.querySelector('.dcc-q-close')?.addEventListener('click',closeMetric);overlay.addEventListener('click',e=>{if(e.target===overlay)closeMetric()});overlay.querySelector('.dcc-q-save')?.addEventListener('click',saveMetric);
    const input=overlay.querySelector('#dcc-q-value');input?.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();saveMetric()}});requestAnimationFrame(()=>input?.focus({preventScroll:true}));
  }

  async function saveMetric(){
    const overlay=document.getElementById(METRIC_OVERLAY);if(!overlay)return;
    const id=overlay.dataset.clientId,type=overlay.dataset.metric,c=clientById(id),db=database();if(!c||!db){notify('No se pudo conectar con el servidor');return}
    const value=num(document.getElementById('dcc-q-value')?.value),isWeight=type==='weight';
    if(value==null||(isWeight&&(value<20||value>500))||(!isWeight&&(value<=0||value>=70))){notify(isWeight?'Introduce un peso válido':'Introduce un porcentaje válido');return}
    const old=isWeight?num(c.weight):num(appData().checkins?.[id]?.bodyFat??appData().checkins?.[id]?.body_fat??c.bodyFat??c.body_fat);
    if(old!=null&&Math.abs(old-value)<.001){notify('No hay cambios que guardar');closeMetric();return}
    const button=overlay.querySelector('.dcc-q-save');if(button){button.disabled=true;button.textContent='Guardando…'}
    try{
      if(isWeight){
        const initial=num(c.initial_weight??c.initial??c.weight);
        const {data:existing,error:existingError}=await db.from('client_weights').select('id').eq('client_id',id).limit(1);if(existingError)throw existingError;
        const createdIds=[];
        if(!(existing||[]).length&&initial!=null){const base=await db.from('client_weights').insert({client_id:id,weight:initial,recorded_at:c.created_at||new Date().toISOString()}).select('id').single();if(base.error)throw base.error;if(base.data?.id)createdIds.push(base.data.id)}
        const row=await db.from('client_weights').insert({client_id:id,weight:value}).select('id').single();if(row.error)throw row.error;if(row.data?.id)createdIds.push(row.data.id);
        const upd=await db.from('clients').update({weight:value}).eq('id',id);if(upd.error){if(createdIds.length)await db.from('client_weights').delete().in('id',createdIds);throw upd.error}
        c.weight=value;const d=appData();d.weights=d.weights||{};const arr=Array.isArray(d.weights[id])?d.weights[id]:[];if(!arr.length&&initial!=null)arr.push(initial);arr.push(value);d.weights[id]=arr;
      }else{
        const hist=await db.from('client_body_fat_history').insert({client_id:id,body_fat:value}).select('id').single();if(hist.error)throw hist.error;
        const now=new Date().toISOString();const current=await db.from('client_checkins').upsert({client_id:id,body_fat:value,updated_at:now},{onConflict:'client_id'});if(current.error){if(hist.data?.id)await db.from('client_body_fat_history').delete().eq('id',hist.data.id);throw current.error}
        const d=appData();d.checkins=d.checkins||{};d.checkins[id]=d.checkins[id]||{};d.checkins[id].bodyFat=value;d.checkins[id].body_fat=value;d.checkins[id].updatedAt=now;c.bodyFat=value;c.body_fat=value;d.bodyFatHistory=d.bodyFatHistory||{};d.bodyFatHistory[id]=Array.isArray(d.bodyFatHistory[id])?d.bodyFatHistory[id]:[];d.bodyFatHistory[id].push({bodyFat:value,body_fat:value,recorded_at:now});
      }
      saveLocal();closeMetric();notify(isWeight?'Peso actualizado':'Grasa corporal actualizada');
      if(document.querySelector('#client-main .dcc-cc')&&typeof window.showClient==='function')window.showClient('checkin');
      const profile=currentProfileClient();if(profile&&String(profile.id)===String(id)&&typeof window.dccClientAdmin==='function'){const active=(document.querySelector('#coach-main .dcc-ca-tab.active')?.textContent||'Resumen').toLowerCase();const tab=active.includes('alimenta')?'food':active.includes('entrena')?'training':active.includes('progreso')?'progress':'summary';window.dccClientAdmin(id,tab)}
    }catch(e){console.error('DCC guardando métrica:',e);notify('No se pudo guardar el cambio');if(button){button.disabled=false;button.textContent='Guardar cambio'}}
  }

  function installMetricEditors(){
    const weight=function(){const c=ensureActiveClient();if(c)openMetric(c.id,'weight')};weight.__dccQualityV5=true;window.updateClientWeight=weight;
    const fat=function(){const c=ensureActiveClient();if(c)openMetric(c.id,'bodyFat')};fat.__dccQualityV5=true;window.updateClientBodyFat=fat;
    const coachWeight=function(id){if(clientById(id))openMetric(id,'weight')};coachWeight.__dccQualityV5=true;window.addWeight=coachWeight;
  }

  function installWeekFix(){
    try{getCurrentWeekKey=localWeekKey}catch(e){}
    try{window.getCurrentWeekKey=localWeekKey}catch(e){}
  }

  function installWrappers(){
    installWeekFix();installAuthoritativeLoaders();installMetricEditors();

    const nc=window.newClient;
    if(typeof nc==='function'&&!nc.__dccQualityV5){const w=function(){const r=nc.apply(this,arguments);requestAnimationFrame(patchNewClientLabel);setTimeout(patchNewClientLabel,60);return r};w.__dccQualityV5=true;w.__base=nc;window.newClient=w}

    const cc=window.createClient;
    if(typeof cc==='function'&&!cc.__dccQualityV5){
      const w=async function(){const before=new Set((appData().clients||[]).map(c=>String(c.id)));const r=await cc.apply(this,arguments);const created=(appData().clients||[]).find(c=>!before.has(String(c.id)));if(created){window.selectedClient=created.id;window.__dccClientAdminId=created.id;setTimeout(()=>{try{if(typeof window.dccClientAdmin==='function')window.dccClientAdmin(created.id,'summary');else window.openClient?.(created.id)}catch(e){console.error(e)}},120)}return r};
      w.__dccQualityV5=true;w.__base=cc;window.createClient=w;
    }

    const admin=window.dccClientAdmin;
    if(typeof admin==='function'&&!admin.__dccQualityV5){
      const w=function(id,tab='summary'){const r=admin.apply(this,arguments);requestAnimationFrame(()=>decorateProfile(id,tab));setTimeout(()=>decorateProfile(id,tab),80);hydrateClient(id).then(()=>{const root=document.querySelector('#coach-main .dcc-ca-wrap');if(root)delete root.dataset.dccV5ProfileSig;decorateProfile(id,tab)});return r};
      w.__dccQualityV5=true;w.__base=admin;window.dccClientAdmin=w;
    }

    const opener=window.openClient;
    if(typeof opener==='function'&&!opener.__dccQualityV5){
      const w=function(id){const r=opener.apply(this,arguments);window.selectedClient=id;window.__dccClientAdminId=id;requestAnimationFrame(()=>decorateProfile(id,'summary'));setTimeout(()=>decorateProfile(id,'summary'),80);hydrateClient(id).then(()=>{const root=document.querySelector('#coach-main .dcc-ca-wrap');if(root)delete root.dataset.dccV5ProfileSig;decorateProfile(id,'summary')});return r};
      w.__dccQualityV5=true;w.__dccClientAdminPremium=!!opener.__dccClientAdminPremium;w.__base=opener;window.openClient=w;window.showClientAdmin=w;
    }

    const showCoachNow=window.showCoach;
    if(typeof showCoachNow==='function'&&!showCoachNow.__dccQualityV5){
      const w=function(screen){const r=showCoachNow.apply(this,arguments);if(screen==='dashboard'){requestAnimationFrame(patchDashboard);setTimeout(patchDashboard,90)}return r};
      w.__dccQualityV5=true;w.__dccPremiumV9=!!showCoachNow.__dccPremiumV9;w.__dccPremiumV6=!!showCoachNow.__dccPremiumV6;w.__base=showCoachNow;window.showCoach=w;
    }

    const showClientNow=window.showClient;
    if(typeof showClientNow==='function'&&!showClientNow.__dccQualityV5){
      const w=function(screen){
        const c=ensureActiveClient();
        if(!c){const main=document.getElementById('client-main');if(main)main.innerHTML='<div style="margin:24px;padding:18px;border:1px solid rgba(240,201,107,.45);border-radius:18px;background:#0c1115;color:#f5f3ef"><b>No hay un cliente disponible.</b><p style="color:#929ba6">Vuelve al panel de entrenador y crea o restaura un cliente.</p></div>';return}
        return showClientNow.apply(this,arguments);
      };
      w.__dccQualityV5=true;w.__dccCheckinFinalV3=!!showClientNow.__dccCheckinFinalV3;w.__dccClientCheckinMessagesV1=!!showClientNow.__dccClientCheckinMessagesV1;w.__base=showClientNow;window.showClient=w;
    }
  }

  function patchFilterButton(){
    const btn=document.querySelector('#coach-main .dcc-cl-filter');if(!btn)return;
    btn.setAttribute('aria-label','Alternar clientes pendientes');btn.title='Mostrar clientes pendientes';btn.classList.toggle('dcc-quality-pending',window.__dccClientMode==='pending');
  }

  let queued=false;
  function patchCurrent(){
    queued=false;installWrappers();patchNewClientLabel();patchDashboard();patchFilterButton();cleanLegacyUnits();
    const c=currentProfileClient();if(c){const active=(document.querySelector('#coach-main .dcc-ca-tab.active')?.textContent||'summary').toLowerCase();decorateProfile(c.id,active)}
  }
  function schedule(){if(queued)return;queued=true;requestAnimationFrame(patchCurrent)}

  document.addEventListener('click',e=>{
    const filter=e.target.closest?.('#coach-main .dcc-cl-filter');
    if(filter){
      e.preventDefault();e.stopPropagation();e.stopImmediatePropagation?.();
      const pending=window.__dccClientMode!=='pending';window.__dccClientMode=pending?'pending':'all';
      document.querySelectorAll('#coach-main .dcc-cl-tab').forEach((b,i)=>b.classList.toggle('active',pending?i===1:i===0));
      window.dccFilterClients?.();patchFilterButton();return;
    }
    const add=e.target.closest?.('#coach-main .dcc-diet-add-food');
    if(add){const c=currentProfileClient(),foods=foodsToAvoid(c);if(foods)notify(`Aviso: no incluir ${foods}`)}
    setTimeout(schedule,0);setTimeout(schedule,120);
  },true);
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.getElementById(METRIC_OVERLAY))closeMetric()});

  function boot(){
    addCss();installWrappers();
    const observe=()=>{const main=document.getElementById('coach-main');if(!main){setTimeout(observe,100);return}new MutationObserver(schedule).observe(main,{childList:true,subtree:true});schedule()};
    observe();
    window.addEventListener('pageshow',schedule);
    window.dccPlanStatusRefresh=schedule;
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
