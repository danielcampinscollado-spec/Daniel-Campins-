/* DCC — plan de cliente v4.1: integración resiliente sobre la UI activa */
(function(){
  'use strict';
  if(window.__dccCoachClientPlanStatusV41)return;
  window.__dccCoachClientPlanStatusV41=true;

  const GOLD='#f0c96b';
  const appData=()=>{try{return data||{}}catch(e){return window.data||{}}};
  const database=()=>{try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient}catch(e){}return window.supabaseClient||null};
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const clientById=id=>(appData().clients||[]).find(c=>String(c.id)===String(id))||null;

  function currentProfileClient(){
    const root=document.querySelector('#coach-main .dcc-ca-wrap');
    if(!root)return null;
    const shown=(root.querySelector('.dcc-ca-head h1')?.textContent||'').trim().toLowerCase();
    if(shown){const hit=(appData().clients||[]).find(c=>String(c.name||'').trim().toLowerCase()===shown);if(hit)return hit}
    for(const id of [window.__dccClientAdminId,window.selectedClient]){const hit=clientById(id);if(hit)return hit}
    return null;
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
  const pendingCheckin=id=>{const x=appData().checkins?.[id];return !!(x?.sentAt&&!x?.reviewed)};

  function addCss(){
    if(document.getElementById('dcc-plan-v41-css'))return;
    document.getElementById('dcc-plan-v4-css')?.remove();
    const s=document.createElement('style');s.id='dcc-plan-v41-css';s.textContent=`
      #coach-main .dcc-v4-plan{margin:11px 0 13px;padding:12px 13px;border:1px solid rgba(240,201,107,.68);border-radius:17px;background:radial-gradient(circle at 96% 0,rgba(240,201,107,.10),transparent 38%),linear-gradient(145deg,#12171b,#090d10)}
      #coach-main .dcc-v4-plan-title{display:flex;align-items:center;gap:8px;margin-bottom:8px;color:${GOLD};font-size:10px;font-weight:900;letter-spacing:1.6px;text-transform:uppercase}
      #coach-main .dcc-v4-plan-list{display:grid;gap:7px}
      #coach-main .dcc-v4-plan-item{width:100%;display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:8px;padding:10px 11px;border:1px solid #303943;border-radius:12px;background:#0a0f13;color:#f5f3ef;text-align:left}
      #coach-main .dcc-v4-plan-item b{display:block;font-size:12px}.dcc-v4-plan-item small{display:block;margin-top:3px;color:#929ba6;font-size:9px;line-height:1.3}.dcc-v4-plan-go{color:${GOLD};font-size:18px}
      #coach-main .dcc-v4-foods{margin-top:12px;padding:11px 12px;border:1px solid rgba(224,173,76,.44);border-radius:14px;background:linear-gradient(145deg,rgba(217,170,74,.075),rgba(8,12,15,.92))}
      #coach-main .dcc-v4-foods small{display:block;color:${GOLD};font-size:9px;font-weight:850;letter-spacing:1.2px;text-transform:uppercase}.dcc-v4-foods b{display:block;margin-top:5px;color:#f4f2ed;font-size:12px;line-height:1.4}
      #coach-main .dcc-v4-diet-warning{margin:0 0 11px;padding:11px 12px;border:1px solid rgba(240,201,107,.62);border-radius:15px;background:linear-gradient(145deg,#15140f,#0b0d0e)}
      #coach-main .dcc-v4-diet-warning b{display:block;color:${GOLD};font-size:11px}.dcc-v4-diet-warning p{margin:4px 0 0;color:#e8e5de;font-size:10px;line-height:1.4}
    `;document.head.appendChild(s);
  }

  function patchNewClientLabel(){
    const root=document.getElementById('dcc-new-client-premium');if(!root)return;
    const label=[...root.querySelectorAll('.dcc-nc-label')].find(x=>/%\s*de\s*grasa\s*inicial/i.test(x.textContent||''));
    const text=label?.querySelector('span:last-child');
    if(text&&text.textContent!=='Grasa corporal inicial')text.textContent='Grasa corporal inicial';
  }

  async function hydrateClient(id){
    const c=clientById(id),db=database();if(!c||!db)return c;
    try{
      const {data:row,error}=await db.from('clients').select('height_cm,foods_to_avoid').eq('id',id).maybeSingle();
      if(error||!row)return c;
      if(row.height_cm!=null){const h=Number(row.height_cm);c.height=h;c.height_cm=h;c.heightCm=h;c.altura=h}
      c.foods_to_avoid=String(row.foods_to_avoid||'');c.foodsToAvoid=String(row.foods_to_avoid||'');
      return c;
    }catch(e){console.warn('DCC v4.1 perfil:',e);return c}
  }

  function openPlan(id,kind){
    window.selectedClient=id;window.__dccClientAdminId=id;
    const tab=kind==='diet'?'food':'training';
    try{
      if(typeof window.dccClientAdmin==='function')window.dccClientAdmin(id,tab);
      else if(typeof window.openClient==='function'){
        window.openClient(id);
        setTimeout(()=>{const btn=[...document.querySelectorAll('#coach-main .dcc-ca-tab')].find(x=>(x.textContent||'').toLowerCase().includes(kind==='diet'?'alimenta':'entrena'));btn?.click()},60);
      }
    }catch(e){console.error('DCC v4.1 abrir tarea:',e)}
  }
  window.dccOpenPlanV4=openPlan;

  function decorateProfile(id,tab){
    addCss();
    const root=document.querySelector('#coach-main .dcc-ca-wrap');if(!root)return;
    const c=clientById(id)||currentProfileClient();if(!c)return;
    id=String(c.id);window.__dccClientAdminId=id;window.selectedClient=id;

    const pending=[];
    if(!dietReady(id))pending.push({kind:'diet',title:'Alimentación sin terminar',sub:'Completa la alimentación de entrenamiento y descanso.'});
    if(!routineReady(id))pending.push({kind:'routine',title:'Rutina sin terminar',sub:'Completa todos los días y ejercicios de entrenamiento.'});
    const active=String(tab||root.querySelector('.dcc-ca-tab.active')?.textContent||'summary').toLowerCase();
    const foods=foodsToAvoid(c);
    const wantFood=active==='summary'||active.includes('resumen');
    const wantDiet=(active==='food'||active.includes('alimenta'))&&!!foods;
    const sig=[id,active,pending.map(p=>p.kind).join(','),foods].join('|');
    const complete=(pending.length===0||!!root.querySelector('.dcc-v4-plan'))&&(!wantFood||!!root.querySelector('.dcc-v4-foods'))&&(!wantDiet||!!root.querySelector('.dcc-v4-diet-warning'));
    if(root.dataset.dccV41ProfileSig===sig&&complete)return;

    root.querySelectorAll('.dcc-v4-plan,.dcc-v4-foods,.dcc-v4-diet-warning').forEach(x=>x.remove());
    if(pending.length){
      const box=document.createElement('section');box.className='dcc-v4-plan';
      box.innerHTML=`<div class="dcc-v4-plan-title"><span>!</span><span>Plan pendiente de completar</span></div><div class="dcc-v4-plan-list">${pending.map(p=>`<button type="button" class="dcc-v4-plan-item" onclick="dccOpenPlanV4('${esc(id)}','${p.kind}')"><span><b>${p.title}</b><small>${p.sub}</small></span><span class="dcc-v4-plan-go">›</span></button>`).join('')}</div>`;
      root.querySelector('.dcc-ca-metrics')?.insertAdjacentElement('afterend',box);
    }
    if(wantFood){
      const general=[...root.querySelectorAll('.dcc-ca-card')].find(x=>/información general/i.test(x.querySelector('h2')?.textContent||''));
      if(general){const card=document.createElement('div');card.className='dcc-v4-foods';card.innerHTML=`<small>Alimentos a evitar</small><b>${foods?esc(foods):'Sin alimentos indicados'}</b>`;general.appendChild(card)}
    }
    if(wantDiet){
      const sw=root.querySelector('.dcc-diet-switch');
      if(sw){const w=document.createElement('div');w.className='dcc-v4-diet-warning';w.innerHTML=`<b>Aviso del cliente</b><p>No incluir: ${esc(foods)}.</p>`;sw.parentNode.insertBefore(w,sw)}
    }
    root.dataset.dccV41ProfileSig=sig;
  }

  function taskHtml(t){
    const action=t.kind==='checkin'?`reviewCheckin('${esc(t.id)}')`:`dccOpenPlanV4('${esc(t.id)}','${t.kind}')`;
    return `<button type="button" class="dcc-p9-row" onclick="${action}"><span class="dcc-p9-row-icon">${t.icon}</span><span class="dcc-p9-row-copy"><b>${esc(t.title)}</b><span>${esc(t.name)}</span></span><span class="dcc-p9-badge">PENDIENTE</span><span class="dcc-p9-arrow">›</span></button>`;
  }

  function patchDashboard(){
    const panel=document.getElementById('dccP9Tasks');if(!panel)return;
    const tasks=[];(appData().clients||[]).forEach(c=>{
      if(pendingCheckin(c.id))tasks.push({id:c.id,kind:'checkin',icon:'✓',title:'REVISAR CHECK-IN',name:c.name});
      if(!dietReady(c.id))tasks.push({id:c.id,kind:'diet',icon:'🍴',title:'CREAR ALIMENTACIÓN',name:c.name});
      if(!routineReady(c.id))tasks.push({id:c.id,kind:'routine',icon:'＋',title:'CREAR RUTINA',name:c.name});
    });
    const count=panel.querySelector('.dcc-p9-count');if(count&&count.textContent!==String(tasks.length))count.textContent=String(tasks.length);
    const body=panel.querySelector('.dcc-p9-body');if(!body)return;
    const sig=tasks.map(t=>`${t.id}:${t.kind}:${t.name}`).join('|');
    if(panel.dataset.dccV41TaskSig===sig)return;
    body.innerHTML=tasks.length?`<div class="dcc-p9-inner">${tasks.slice(0,12).map(taskHtml).join('')}</div>`:`<div class="dcc-p9-inner"><div class="dcc-p9-empty"><span class="dcc-p9-empty-i">✓</span><span>Todo al día. No hay tareas pendientes.</span></div></div>`;
    panel.dataset.dccV41TaskSig=sig;
  }

  function cleanLegacyUnits(root=document){
    root.querySelectorAll?.('.dcc-ci-rside,.dcc-ca-trend,.dcc-bfh-delta,.dcpr6-chip,.dcpr6-chart-badge').forEach(el=>{
      const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
      nodes.forEach(n=>{const next=String(n.nodeValue||'').replace(/(\d+(?:[.,]\d+)?)\s*(?:pts?\.?|ptas?\.?|puntos?)\b/gi,'$1 %');if(next!==n.nodeValue)n.nodeValue=next});
    });
  }

  function installWrappers(){
    const nc=window.newClient;
    if(typeof nc==='function'&&!nc.__dccPlanV41){
      const w=function(){const r=nc.apply(this,arguments);requestAnimationFrame(patchNewClientLabel);setTimeout(patchNewClientLabel,60);return r};
      w.__dccPlanV41=true;w.__base=nc;window.newClient=w;
    }

    const cc=window.createClient;
    if(typeof cc==='function'&&!cc.__dccPlanV41){
      const w=async function(){
        const before=new Set((appData().clients||[]).map(c=>String(c.id)));
        const r=await cc.apply(this,arguments);
        const created=(appData().clients||[]).find(c=>!before.has(String(c.id)));
        if(created){
          window.selectedClient=created.id;window.__dccClientAdminId=created.id;
          setTimeout(()=>{
            try{if(typeof window.dccClientAdmin==='function')window.dccClientAdmin(created.id,'summary');else window.openClient?.(created.id)}catch(e){console.error(e)}
          },120);
        }
        return r;
      };w.__dccPlanV41=true;w.__base=cc;window.createClient=w;
    }

    const admin=window.dccClientAdmin;
    if(typeof admin==='function'&&!admin.__dccPlanV41){
      const w=function(id,tab='summary'){
        const r=admin.apply(this,arguments);
        requestAnimationFrame(()=>decorateProfile(id,tab));setTimeout(()=>decorateProfile(id,tab),80);
        hydrateClient(id).then(()=>{const root=document.querySelector('#coach-main .dcc-ca-wrap');if(root)delete root.dataset.dccV41ProfileSig;decorateProfile(id,tab)});
        return r;
      };
      w.__dccPlanV41=true;w.__base=admin;window.dccClientAdmin=w;
    }

    const opener=window.openClient;
    if(typeof opener==='function'&&!opener.__dccPlanV41){
      const w=function(id){
        const r=opener.apply(this,arguments);window.selectedClient=id;window.__dccClientAdminId=id;
        requestAnimationFrame(()=>decorateProfile(id,'summary'));setTimeout(()=>decorateProfile(id,'summary'),80);
        hydrateClient(id).then(()=>{const root=document.querySelector('#coach-main .dcc-ca-wrap');if(root)delete root.dataset.dccV41ProfileSig;decorateProfile(id,'summary')});
        return r;
      };
      w.__dccPlanV41=true;w.__dccClientAdminPremium=!!opener.__dccClientAdminPremium;w.__base=opener;window.openClient=w;window.showClientAdmin=w;
    }

    const show=window.showCoach;
    if(typeof show==='function'&&!show.__dccPlanV41){
      const w=function(screen){const r=show.apply(this,arguments);if(screen==='dashboard'){requestAnimationFrame(patchDashboard);setTimeout(patchDashboard,90)}return r};
      w.__dccPlanV41=true;w.__dccPremiumV9=!!show.__dccPremiumV9;w.__dccPremiumV6=!!show.__dccPremiumV6;w.__base=show;window.showCoach=w;
    }
  }

  let queued=false;
  function patchCurrent(){
    queued=false;installWrappers();patchNewClientLabel();patchDashboard();cleanLegacyUnits();
    const c=currentProfileClient();if(c){const active=(document.querySelector('#coach-main .dcc-ca-tab.active')?.textContent||'summary').toLowerCase();decorateProfile(c.id,active)}
  }
  function schedule(){if(queued)return;queued=true;requestAnimationFrame(patchCurrent)}

  document.addEventListener('click',e=>{
    const add=e.target.closest?.('#coach-main .dcc-diet-add-food');
    if(add){const c=currentProfileClient(),foods=foodsToAvoid(c);if(foods)alert(`Aviso del cliente\nNo incluir: ${foods}.`)}
    setTimeout(schedule,0);setTimeout(schedule,120);
  },true);

  function boot(){
    addCss();installWrappers();schedule();
    new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true,characterData:true});
    setInterval(schedule,900);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();