/* DCC — selector de días y navegación paso a paso para rutinas */
(function(){
  'use strict';
  if(window.__dccTrainingDayWizardV1)return;
  window.__dccTrainingDayWizardV1=true;

  const state={active:0,raf:0};
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function id(){return String(window.selectedClient??'')}
  function days(){const r=window.data?.routines?.[id()];return Array.isArray(r)?r:Array.isArray(r?.routine)?r.routine:[]}
  function setDays(next){const cid=id();if(!cid||!window.data)return;window.data.routines=window.data.routines||{};const r=window.data.routines[cid];if(Array.isArray(r))window.data.routines[cid]=next;else if(r&&typeof r==='object'&&Array.isArray(r.routine))r.routine=next;else window.data.routines[cid]=next}
  function blankDay(i){return{day:i+1,muscle:'Sin grupos musculares',muscles:[],exercises:[],restBetweenSetsGlobal:0,restBetweenExercisesGlobal:0}}
  function save(){try{window.saveData?.()}catch(e){console.error(e)}}

  function css(){if(document.getElementById('dcc-training-day-wizard-css'))return;const s=document.createElement('style');s.id='dcc-training-day-wizard-css';s.textContent=`
    #coach-main .dcc-tdw{margin:0 0 16px!important;padding:16px!important;border:1px solid rgba(183,123,19,.25)!important;border-radius:20px!important;background:linear-gradient(160deg,#fffdf8,#f8f0e3)!important;color:#17191d!important;box-shadow:0 10px 28px rgba(78,58,28,.07)!important}
    #coach-main .dcc-tdw-step{display:flex!important;gap:11px!important;align-items:flex-start!important}
    #coach-main .dcc-tdw-num{width:32px!important;height:32px!important;min-width:32px!important;flex:none!important;border-radius:50%!important;display:grid!important;place-items:center!important;background:linear-gradient(135deg,#b57a12,#d5a238)!important;color:#fff!important;font-weight:900!important}
    #coach-main .dcc-tdw h3{margin:1px 0 3px!important;font-size:16px!important;color:#17191d!important}
    #coach-main .dcc-tdw p{margin:0!important;color:#747b86!important;font-size:11px!important;line-height:1.35!important}
    #coach-main .dcc-tdw-count{display:grid!important;grid-template-columns:repeat(7,1fr)!important;gap:6px!important;margin-top:13px!important}
    #coach-main .dcc-tdw-count button,#coach-main .dcc-tdw-tabs button{min-height:42px!important;border:1px solid rgba(183,123,19,.28)!important;border-radius:13px!important;background:#fffdf8!important;color:#17191d!important;font-weight:800!important;box-shadow:none!important}
    #coach-main .dcc-tdw-count button.on,#coach-main .dcc-tdw-tabs button.on{border-color:#d7a63e!important;background:linear-gradient(135deg,#f6d46f,#eab63e)!important;color:#17130a!important}
    #coach-main .dcc-tdw-config{display:flex!important;gap:10px!important;align-items:flex-start!important;margin-top:17px!important;padding-top:15px!important;border-top:1px solid rgba(183,123,19,.14)!important}
    #coach-main .dcc-tdw-tabs{display:flex!important;gap:7px!important;overflow-x:auto!important;margin-top:12px!important;padding-bottom:2px!important}
    #coach-main .dcc-tdw-tabs button{min-width:82px!important;padding:0 14px!important;flex:none!important}
    #coach-main .dcc-tdw-nav{display:grid!important;grid-template-columns:1fr 1fr!important;gap:10px!important;margin:12px 0 2px!important}
    #coach-main .dcc-tdw-nav button{min-height:44px!important;border-radius:13px!important;font-weight:850!important}
    #coach-main .dcc-tdw-prev{border:1px solid rgba(183,123,19,.22)!important;background:#fffdf8!important;color:#656b75!important}
    #coach-main .dcc-tdw-next{border:1px solid #d9aa4a!important;background:linear-gradient(135deg,#f5cf66,#e5ad36)!important;color:#17130a!important}
    #coach-main .dcc-tdw-nav button:disabled{opacity:.38!important}
    @media(max-width:430px){#coach-main .dcc-tdw{padding:14px!important}#coach-main .dcc-tdw-count{gap:4px!important}#coach-main .dcc-tdw-count button{min-height:38px!important;border-radius:11px!important;font-size:12px!important}#coach-main .dcc-tdw-tabs button{min-width:74px!important}}
  `;(document.head||document.documentElement).appendChild(s)}

  function html(ds){const n=ds.length||1;state.active=Math.max(0,Math.min(state.active,n-1));return `<section class="dcc-tdw" data-dcc-tdw="1"><div class="dcc-tdw-step"><span class="dcc-tdw-num">1</span><div><h3>¿Cuántos días entrenará?</h3><p>Selecciona el número de días de entrenamiento por semana.</p></div></div><div class="dcc-tdw-count">${[1,2,3,4,5,6,7].map(x=>`<button class="${x===n?'on':''}" onclick="dccSetTrainingDayCount(${x})">${x}</button>`).join('')}</div><div class="dcc-tdw-config"><span class="dcc-tdw-num">2</span><div><h3>Configura cada día</h3><p>Añade los grupos musculares y ejercicios para cada día.</p></div></div><div class="dcc-tdw-tabs">${ds.map((_,i)=>`<button class="${i===state.active?'on':''}" onclick="dccTrainingWizardDay(${i})">Día ${i+1}</button>`).join('')}</div></section>`}

  function apply(){
    css();
    if(!window.__dccTrainingEdit){document.querySelector('[data-dcc-tdw="1"]')?.remove();return}
    const ds=days(),wrap=document.querySelector('#coach-main .dcc-tr-days');if(!wrap||!ds.length)return;
    let top=document.querySelector('[data-dcc-tdw="1"]');if(!top){wrap.insertAdjacentHTML('beforebegin',html(ds));top=document.querySelector('[data-dcc-tdw="1"]')}else top.outerHTML=html(ds);
    const cards=[...document.querySelectorAll('#coach-main .dcc-tr-days>.dcc-tr-day')];cards.forEach((card,i)=>{card.style.display=i===state.active?'':'none'});
    let nav=document.querySelector('[data-dcc-tdw-nav="1"]');if(nav)nav.remove();
    const active=cards[state.active];if(active){active.insertAdjacentHTML('beforeend',`<div class="dcc-tdw-nav" data-dcc-tdw-nav="1"><button class="dcc-tdw-prev" ${state.active===0?'disabled':''} onclick="dccTrainingWizardDay(${state.active-1})">← Anterior</button><button class="dcc-tdw-next" ${state.active>=ds.length-1?'disabled':''} onclick="dccTrainingWizardDay(${state.active+1})">Siguiente día →</button></div>`)}
  }

  window.dccSetTrainingDayCount=n=>{n=Math.max(1,Math.min(7,Number(n)||1));const cur=days();if(n<cur.length){const removed=cur.slice(n);const hasWork=removed.some(d=>(d?.exercises||[]).length||((d?.muscles||[]).length));if(hasWork&&!confirm(`Reducir a ${n} días eliminará la configuración de los últimos ${cur.length-n} día(s). ¿Continuar?`))return}const next=cur.slice(0,n);while(next.length<n)next.push(blankDay(next.length));next.forEach((d,i)=>d.day=i+1);setDays(next);state.active=Math.min(state.active,n-1);window.__dccTrainingOpen=state.active;save();try{window.dccClientAdmin(id(),'training')}catch(_){schedule()}};
  window.dccTrainingWizardDay=i=>{const ds=days();i=Math.max(0,Math.min(Number(i)||0,ds.length-1));state.active=i;window.__dccTrainingOpen=i;apply();document.querySelector('[data-dcc-tdw="1"]')?.scrollIntoView({behavior:'smooth',block:'start'})};

  function schedule(){if(state.raf)return;state.raf=requestAnimationFrame(()=>{state.raf=0;apply()})}
  const obs=new MutationObserver(schedule);
  function start(){const root=document.getElementById('coach-main');if(root)obs.observe(root,{childList:true,subtree:true});schedule()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
