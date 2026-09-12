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
    .dcc-tdw{margin:0 0 16px;padding:16px;border:1px solid rgba(183,123,19,.25);border-radius:20px;background:linear-gradient(160deg,#fffdf8,#f8f0e3);box-shadow:0 10px 28px rgba(78,58,28,.07)}
    .dcc-tdw-step{display:flex;gap:11px;align-items:flex-start}.dcc-tdw-num{width:32px;height:32px;flex:none;border-radius:50%;display:grid;place-items:center;background:linear-gradient(135deg,#b57a12,#d5a238);color:#fff;font-weight:900}.dcc-tdw h3{margin:1px 0 3px;font-size:16px;color:#17191d}.dcc-tdw p{margin:0;color:#747b86;font-size:11px;line-height:1.35}
    .dcc-tdw-count{display:grid;grid-template-columns:repeat(7,1fr);gap:6px;margin-top:13px}.dcc-tdw-count button,.dcc-tdw-tabs button{min-height:42px;border:1px solid rgba(183,123,19,.28);border-radius:13px;background:#fffdf8;color:#17191d;font-weight:800}.dcc-tdw-count button.on,.dcc-tdw-tabs button.on{border-color:#d7a63e;background:linear-gradient(135deg,#f6d46f,#eab63e);color:#17130a}
    .dcc-tdw-config{display:flex;gap:10px;align-items:flex-start;margin-top:17px;padding-top:15px;border-top:1px solid rgba(183,123,19,.14)}.dcc-tdw-tabs{display:flex;gap:7px;overflow-x:auto;margin-top:12px;padding-bottom:2px}.dcc-tdw-tabs button{min-width:82px;padding:0 14px;flex:none}
    .dcc-tdw-nav{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:12px 0 2px}.dcc-tdw-nav button{min-height:44px;border-radius:13px;font-weight:850}.dcc-tdw-prev{border:1px solid rgba(183,123,19,.22);background:#fffdf8;color:#656b75}.dcc-tdw-next{border:1px solid #d9aa4a;background:linear-gradient(135deg,#f5cf66,#e5ad36);color:#17130a}.dcc-tdw-nav button:disabled{opacity:.38}
    @media(max-width:430px){.dcc-tdw{padding:14px}.dcc-tdw-count{gap:4px}.dcc-tdw-count button{min-height:38px;border-radius:11px;font-size:12px}.dcc-tdw-tabs button{min-width:74px}}
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
