/* DCC coach panel v11 — state + audited interaction fixes */
(function(){
  'use strict';
  if(window.__dccCoachPanelStateV11)return;
  window.__dccCoachPanelStateV11=true;

  const STYLE_ID='dcc-coach-panel-state-v11-css';
  const seenAccordions=new WeakSet();
  let raf=0;

  const appData=()=>{try{return data||{}}catch(e){return window.data||{}};
  const database=()=>{try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient}catch(e){}return window.supabaseClient||null};
  const num=v=>{const n=parseFloat(String(v??'').replace(',','.'));return Number.isFinite(n)?n:null};
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[c]||c));

  function injectCss(){
    if(document.getElementById(STYLE_ID))return;
    document.getElementById('dcc-coach-panel-state-v10-css')?.remove();
    const style=document.createElement('style');
    style.id=STYLE_ID;
    style.textContent=`
      #coach-main.dcc-p9-dashboard .dcc-p9-stat.dcc-p9-positive strong{color:#f0c96b!important;text-shadow:0 0 14px rgba(240,201,107,.16)!important}
      #coach-main.dcc-p9-dashboard .dcc-p9-stat.dcc-p9-zero strong{color:#f8f6f1!important;text-shadow:none!important}
      #coach-main.dcc-p9-dashboard .dcc-p9-count.dcc-audit-attention{margin-left:7px}
    `;
    document.head.appendChild(style);
  }

  function colorCounters(main){
    main.querySelectorAll('.dcc-p9-stat').forEach(card=>{
      const strong=card.querySelector('strong');if(!strong)return;
      const value=Number.parseFloat(String(strong.textContent||'').trim().replace(',','.'));
      const positive=Number.isFinite(value)&&value>0;
      card.classList.toggle('dcc-p9-positive',positive);
      card.classList.toggle('dcc-p9-zero',!positive);
    });
  }

  function closeNewAccordions(main){
    main.querySelectorAll('.dcc-p9-accordion').forEach(section=>{
      if(seenAccordions.has(section))return;
      seenAccordions.add(section);
      section.classList.add('closed');
      if(section.id==='dccP9Tasks')window.__dccCoachTasksOpen=false;
      if(section.id==='dccP9Attention')window.__dccCoachAttentionOpen=false;
    });
  }

  function routineDays(id){
    const r=appData()?.routines?.[id];
    return Array.isArray(r)?r:(Array.isArray(r?.routine)?r.routine:[]);
  }
  function hasRoutine(id){
    const days=routineDays(id);
    return days.length>0&&days.every(day=>Array.isArray(day?.exercises)&&day.exercises.length>0);
  }
  function mealReady(meal){
    if(Array.isArray(meal?.options)&&meal.options.length)return meal.options.some(o=>Array.isArray(o?.foods)&&o.foods.length>0);
    return Array.isArray(meal?.foods)&&meal.foods.length>0;
  }
  function hasDiet(id){
    const diet=appData()?.diets?.[id];
    return !!diet&&['training','rest'].every(type=>Array.isArray(diet?.[type]?.meals)&&diet[type].meals.length>0&&diet[type].meals.every(mealReady));
  }
  function pendingCheck(client){
    const x=appData()?.checkins?.[client?.id];
    return !!((x?.sentAt??x?.sent_at)&&!x?.reviewed);
  }
  function workoutDate(x){return x?.workout_date??x?.date??x?.created_at??null}
  function daysSince(v){
    if(!v)return null;const d=new Date(v);const t=d.getTime();
    return Number.isFinite(t)?Math.max(0,Math.floor((Date.now()-t)/86400000)):null;
  }
  function latestWorkout(id){
    const h=appData()?.workoutHistory?.[id]||[];
    return h.slice().sort((a,b)=>new Date(workoutDate(b)||0)-new Date(workoutDate(a)||0))[0]||null;
  }

  function taskRow(client,title,badge,action){
    const row=document.createElement('button');
    row.type='button';row.className='dcc-p9-row dcc-audit-row';
    row.innerHTML=`<span class="dcc-p9-row-icon">＋</span><span class="dcc-p9-row-copy"><b>${esc(title)}</b><span>${esc(client.name||'Cliente')}</span></span><span class="dcc-p9-badge">${esc(badge)}</span><span class="dcc-p9-arrow">›</span>`;
    row.addEventListener('click',action);
    return row;
  }

  function patchTasks(main){
    const clients=Array.isArray(appData()?.clients)?appData().clients:[];
    const pending=clients.filter(pendingCheck).length;
    const missingRoutine=clients.filter(c=>!hasRoutine(c.id)).length;
    const missingDietClients=clients.filter(c=>!hasDiet(c.id));
    const total=pending+missingRoutine+missingDietClients.length;
    const tasks=main.querySelector('#dccP9Tasks');
    const badge=tasks?.querySelector('.dcc-p9-count');
    if(badge&&badge.textContent!==String(total))badge.textContent=String(total);

    const inner=tasks?.querySelector('.dcc-p9-inner');
    if(inner){
      const visible=missingDietClients.slice(0,6);
      const signature=visible.map(c=>String(c.id)).join('|');
      if(tasks?.dataset.dccAuditDietSignature!==signature){
        inner.querySelectorAll('.dcc-audit-diet-row').forEach(x=>x.remove());
        const empt=inner.querySelector('.dcc-p9-empty');
        if(empt&&total>0)empt.remove();
        visible.forEach(c=>{
          const row=taskRow(c,'CREAR ALIMENTACIÓN','PENDIENTE',()=>{
            window.selectedClient=c.id;
            window.__dccClientAdminId=c.id;
            if(typeof window.dccClientAdmin==='function')window.dccClientAdmin(c.id,'food');
            else window.openClient?.(c.id);
          });
          row.classList.add('dcc-audit-diet-row');
          inner.appendChild(row);
        });
        if(tasks)tasks.dataset.dccAuditDietSignature=signature;
      }
    }

    const attention=clients.filter(c=>{
      const gap=daysSince(workoutDate(latestWorkout(c.id)));
      return gap!==null&&gap>=7;
    });
    const att=main.querySelector('#dccP9Attention');
    const title=att?.querySelector('.dcc-p9-head-title');
    if(title){
      let count=title.querySelector('.dcc-audit-attention');
      if(!count){
        count=document.createElement('span');
        count.className='dcc-p9-count dcc-audit-attention';
        title.appendChild(count);
      }
      if(count.textContent!==String(attention.length))count.textContent=String(attention.length);
    }
  }

  function latestWeight(id,client){
    const a=appData()?.weights?.[id];
    if(Array.isArray(a)&&a.length){
      for(let i=a.length-1;i>=0;i--){const n=num(typeof a[i]==='object'?(a[i].weight??a[i].value):a[i]);if(n!=null)return n}
    }
    return num(client?.weight??client?.peso??client?.initial??client?.initial_weight);
  }

  function patchClientCards(main){
    const clients=Array.isArray(appData()?.clients)?appData().clients:[];
    main.querySelectorAll('.dcc-cl-card').forEach(card=>{
      const name=(card.querySelector('.dcc-cl-name')?.textContent||'').trim().toLowerCase();
      const client=clients.find(c=>String(c.name||'').trim().toLowerCase()===name);if(!client)return;
      const weight=latestWeight(client.id,client),el=card.querySelector('.dcc-cl-weight');
      if(weight!=null){
        const value=`${weight.toLocaleString('es-ES',{minimumFractionDigits:1,maximumFractionDigits:1})} kg`;
        if(el){if(el.textContent!==value)el.textContent=value;}
        else{const div=document.createElement('div');div.className='dcc-cl-weight';div.textContent=value;card.querySelector('.dcc-cl-info')?.appendChild(div)}
      }
    });
  }

  function checkinLabel(id){
    const x=appData()?.checkins?.[id];if(!x)return'Sin check-in';
    const raw=x.updatedAt??x.updated_at??x.sentAt??x.sent_at??x.created_at;
    if(!raw)return'Registrado';
    const d=new Date(raw);if(!Number.isFinite(d.getTime()))return'Registrado';
    return d.toLocaleDateString('es-ES',{day:'numeric',month:'short',year:'numeric'});
  }

  function patchClientAdmin(main){
    if(!main.classList.contains('dcc-ca'))return;
    const id=String(window.__dccClientAdminId||window.selectedClient||'');if(!id)return;
    main.querySelectorAll('.dcc-ca-info').forEach(row=>{
      const label=(row.querySelector('span')?.textContent||'').trim().toLowerCase();
      if(label==='último check-in'){const b=row.querySelector('b'),value=checkinLabel(id);if(b&&b.textContent!==value)b.textContent=value}
    });
  }

  function patchNewClientForm(){
    const root=document.getElementById('dcc-new-client-premium');if(!root)return;
    const fat=[...root.querySelectorAll('.dcc-nc-label span:last-child')].find(x=>/%\s*de\s*grasa\s*inicial/i.test(x.textContent||''));
    if(fat)fat.textContent='Grasa corporal inicial';
  }

  function chainHas(fn,marker,depth=0){
    if(typeof fn!=='function'||depth>8)return false;
    if(fn[marker])return true;
    return chainHas(fn.__base,marker,depth+1)||chainHas(fn.__original,marker,depth+1)||chainHas(fn.__legacy,marker,depth+1);
  }

  function installCreateFlow(){
    const base=window.createClient;
    if(typeof base!=='function'||chainHas(base,'__dccAuditCreateFlowV11'))return;
    const wrapped=async function(){
      const before=new Set((appData().clients||[]).map(c=>String(c.id)));
      const result=await base.apply(this,arguments);
      const created=(appData().clients||[]).find(c=>!before.has(String(c.id)));
      if(!created)return result;

      const id=String(created.id),weight=num(created.weight??created.initial??created.initial_weight),fat=num(created.bodyFatInitial??created.initial_body_fat??created.bodyFat??created.body_fat),createdAt=created.created_at||new Date().toISOString();
      created.created_at=createdAt;
      if(weight!=null){created.initial=created.initial??weight;created.initial_weight=created.initial_weight??weight}
      if(fat!=null){created.bodyFatInitial=created.bodyFatInitial??fat;created.initial_body_fat=created.initial_body_fat??fat}
      const d=appData();d.bodyFatHistory=d.bodyFatHistory||{};
      if(fat!=null&&!Array.isArray(d.bodyFatHistory[id]))d.bodyFatHistory[id]=[{bodyFat:fat,body_fat:fat,recorded_at:createdAt}];
      if(d.checkins?.[id]){d.checkins[id].updatedAt=d.checkins[id].updatedAt||createdAt;d.checkins[id].updated_at=d.checkins[id].updated_at||createdAt;d.checkins[id].body_fat=d.checkins[id].body_fat??fat}
      try{if(typeof saveData==='function')saveData();else window.saveData?.()}catch(e){}

      const db=database();
      if(db){
        try{
          const writes=[];
          if(weight!=null)writes.push(db.from('client_weights').insert({client_id:id,weight,recorded_at:createdAt}));
          if(fat!=null)writes.push(db.from('client_body_fat_history').insert({client_id:id,body_fat:fat,recorded_at:createdAt}));
          writes.push(db.from('client_checkins').upsert({client_id:id,weight:weight!=null?String(weight).replace('.',',')+' kg':'',body_fat:fat,updated_at:createdAt},{onConflict:'client_id'}));
          const settled=await Promise.all(writes);const failed=settled.find(x=>x?.error);if(failed)console.error('DCC inicialización de cliente:',failed.error);
        }catch(e){console.error('DCC inicialización de cliente:',e)}
      }

      window.selectedClient=id;window.__dccClientAdminId=id;
      setTimeout(()=>{
        try{if(typeof window.dccClientAdmin==='function')window.dccClientAdmin(id,'summary');else window.openClient?.(id)}catch(e){console.error(e)}
      },80);
      return result;
    };
    wrapped.__dccAuditCreateFlowV11=true;wrapped.__base=base;window.createClient=wrapped;
  }

  function enhance(){
    injectCss();installCreateFlow();patchNewClientForm();
    const main=document.getElementById('coach-main');if(!main)return;
    if(main.classList.contains('dcc-p9-dashboard')){colorCounters(main);closeNewAccordions(main);patchTasks(main)}
    if(main.classList.contains('dcc-premium-clients'))patchClientCards(main);
    patchClientAdmin(main);
  }

  function schedule(){cancelAnimationFrame(raf);raf=requestAnimationFrame(enhance)}

  function installManageGuard(){
    if(window.__dccManageGuardV11)return;window.__dccManageGuardV11=true;
    document.addEventListener('click',event=>{
      const button=event.target.closest?.('#coach-main .dcc-cl-manage');if(!button)return;
      const raw=button.getAttribute('onclick')||'';
      const match=raw.match(/openClient\(['\"]([^'\"]+)['\"]\)/);const id=match?.[1];
      if(!id||typeof window.dccClientAdmin!=='function')return;
      event.preventDefault();event.stopImmediatePropagation();
      window.selectedClient=id;window.__dccClientAdminId=id;window.dccClientAdmin(id,'summary');
    },true);
  }

  function watch(){
    const main=document.getElementById('coach-main');
    if(!main){setTimeout(watch,80);return}
    new MutationObserver(schedule).observe(main,{childList:true,subtree:true});
    schedule();
  }

  injectCss();installManageGuard();installCreateFlow();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',watch,{once:true});else watch();
  window.addEventListener('load',schedule,{once:true});
  window.addEventListener('pageshow',schedule);
  window.dccQualityRefresh=schedule;
})();