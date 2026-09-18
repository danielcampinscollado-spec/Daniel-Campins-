/* DCC — selector de días y navegación paso a paso para rutinas */
(function(){
  'use strict';
  const BUILD='20260918-training-day-wizard-v11-anatomy-visual-fix';
  if(window.__dccTrainingDayWizardV2===BUILD)return;
  window.__dccTrainingDayWizardV2=BUILD;

  const state={active:0,raf:0,lastSig:'',forcing:false};
  function id(){return String(window.selectedClient??'')}
  function days(){const r=window.data?.routines?.[id()];return Array.isArray(r)?r:Array.isArray(r?.routine)?r.routine:[]}
  function setDays(next){const cid=id();if(!cid||!window.data)return;window.data.routines=window.data.routines||{};const r=window.data.routines[cid];if(Array.isArray(r))window.data.routines[cid]=next;else if(r&&typeof r==='object'&&Array.isArray(r.routine))r.routine=next;else window.data.routines[cid]=next}
  function blankDay(i){return{day:i+1,muscle:'Sin grupos musculares',muscles:[],exercises:[],restBetweenSetsGlobal:0,restBetweenExercisesGlobal:0}}
  function save(){try{window.saveData?.()}catch(e){console.error(e)}window.dccMarkTrainingDraftDirty?.()}
  function loadPremiumMuscles(){
    if(window.__dccMusclePremiumLight)return;
    if(document.querySelector('script[data-dcc-muscle-premium]'))return;
    const s=document.createElement('script');s.src='./training-muscle-premium-light-v1.js?v=20260918-6';s.async=true;s.dataset.dccMusclePremium='1';(document.head||document.documentElement).appendChild(s);
  }

  function css(){if(document.getElementById('dcc-training-day-wizard-css'))return;const s=document.createElement('style');s.id='dcc-training-day-wizard-css';s.textContent=`
    #coach-main .dcc-tdw{margin:0 0 16px!important;padding:16px!important;border:1px solid rgba(183,123,19,.25)!important;border-radius:20px!important;background:linear-gradient(160deg,#fffdf8,#f8f0e3)!important;color:#17191d!important;box-shadow:0 10px 28px rgba(78,58,28,.07)!important}
    #coach-main .dcc-tdw-step{display:flex!important;gap:11px!important;align-items:flex-start!important}#coach-main .dcc-tdw-num{width:32px!important;height:32px!important;min-width:32px!important;flex:none!important;border-radius:50%!important;display:grid!important;place-items:center!important;background:linear-gradient(135deg,#b57a12,#d5a238)!important;color:#fff!important;font-weight:900!important}
    #coach-main .dcc-tdw h3{margin:1px 0 3px!important;font-size:16px!important;color:#17191d!important}#coach-main .dcc-tdw p{margin:0!important;color:#747b86!important;font-size:11px!important;line-height:1.35!important}
    #coach-main .dcc-tdw-count{display:grid!important;grid-template-columns:repeat(7,minmax(0,1fr))!important;gap:6px!important;margin-top:13px!important}#coach-main .dcc-tdw-count button,#coach-main .dcc-tdw-tabs button{position:relative!important;z-index:2!important;pointer-events:auto!important;touch-action:manipulation!important;min-height:42px!important;border:1px solid rgba(183,123,19,.28)!important;border-radius:13px!important;background:#fffdf8!important;color:#17191d!important;font-weight:800!important;box-shadow:none!important}#coach-main .dcc-tdw-count button.on,#coach-main .dcc-tdw-tabs button.on{border-color:#d7a63e!important;background:linear-gradient(135deg,#f6d46f,#eab63e)!important;color:#17130a!important}
    #coach-main .dcc-tdw-config{display:flex!important;gap:10px!important;align-items:flex-start!important;margin-top:17px!important;padding-top:15px!important;border-top:1px solid rgba(183,123,19,.14)!important}
    #coach-main .dcc-tdw-tabs{display:grid!important;grid-template-columns:repeat(var(--dcc-day-count,1),minmax(0,1fr))!important;gap:6px!important;width:100%!important;overflow:visible!important;margin-top:12px!important;padding:0!important}
    #coach-main .dcc-tdw-tabs button{min-width:0!important;width:100%!important;padding:0 4px!important;white-space:nowrap!important}
    #coach-main .dcc-tr-days{padding-bottom:110px!important}
    @media(max-width:430px){#coach-main .dcc-tdw{padding:14px!important}#coach-main .dcc-tdw-count{gap:4px!important}#coach-main .dcc-tdw-count button{min-height:38px!important;border-radius:11px!important;font-size:12px!important}#coach-main .dcc-tdw-tabs{gap:4px!important}#coach-main .dcc-tdw-tabs button{min-height:40px!important;border-radius:11px!important;padding:0 2px!important;font-size:12px!important;letter-spacing:-.15px!important}}
  `;(document.head||document.documentElement).appendChild(s)}

  function signature(ds){return `${ds.length}:${state.active}`}
  function html(ds){const n=ds.length||1;state.active=Math.max(0,Math.min(state.active,n-1));const sig=signature(ds);return `<section class="dcc-tdw" data-dcc-tdw="1" data-dcc-sig="${sig}"><div class="dcc-tdw-step"><span class="dcc-tdw-num">1</span><div><h3>¿Cuántos días entrenará?</h3><p>Selecciona el número de días de entrenamiento por semana.</p></div></div><div class="dcc-tdw-count">${[1,2,3,4,5,6,7].map(x=>`<button type="button" class="${x===n?'on':''}" onclick="dccSetTrainingDayCount(${x})">${x}</button>`).join('')}</div><div class="dcc-tdw-config"><span class="dcc-tdw-num">2</span><div><h3>Configura cada día</h3><p>Selecciona un día y se abrirá automáticamente para configurarlo.</p></div></div><div class="dcc-tdw-tabs" style="--dcc-day-count:${n}">${ds.map((_,i)=>`<button type="button" class="${i===state.active?'on':''}" onclick="dccTrainingWizardDay(${i})">Día ${i+1}</button>`).join('')}</div></section>`}

  function showSelectedDay(ds){
    const top=document.querySelector('[data-dcc-tdw="1"]');
    if(top){top.dataset.dccSig=signature(ds);[...top.querySelectorAll('.dcc-tdw-tabs button')].forEach((b,i)=>b.classList.toggle('on',i===state.active))}
    const cards=[...document.querySelectorAll('#coach-main .dcc-tr-days>.dcc-tr-day')];
    cards.forEach((card,i)=>{const show=i===state.active;if(show){card.style.removeProperty('display');card.removeAttribute('aria-hidden')}else{card.style.setProperty('display','none','important');card.setAttribute('aria-hidden','true')}});
    const selected=cards[state.active];
    if(window.__dccTrainingEdit&&selected&&!selected.classList.contains('open')&&!state.forcing){
      window.__dccTrainingOpen=state.active;
      if(typeof window.dccClientAdmin==='function'){
        state.forcing=true;
        requestAnimationFrame(()=>{
          try{window.dccClientAdmin(id(),'training')}catch(e){console.error('DCC training auto-open:',e)}
          finally{state.forcing=false;schedule()}
        });
      }
    }
  }

  function apply(){
    css();loadPremiumMuscles();if(!window.__dccTrainingEdit){document.querySelector('[data-dcc-tdw="1"]')?.remove();state.lastSig='';return}
    const ds=days(),wrap=document.querySelector('#coach-main .dcc-tr-days');if(!wrap||!ds.length)return;
    state.active=Math.max(0,Math.min(state.active,ds.length-1));
    const sig=signature(ds);let top=document.querySelector('[data-dcc-tdw="1"]');
    if(!top){wrap.insertAdjacentHTML('beforebegin',html(ds));top=document.querySelector('[data-dcc-tdw="1"]');state.lastSig=sig}
    else if(top.dataset.dccSig!==sig){top.outerHTML=html(ds);state.lastSig=sig}
    showSelectedDay(ds);
    document.querySelector('[data-dcc-tdw-nav="1"]')?.remove();
  }

  window.dccSetTrainingDayCount=n=>{const y=window.scrollY||0;n=Math.max(1,Math.min(7,Number(n)||1));const cur=days();if(n<cur.length){const removed=cur.slice(n);const hasWork=removed.some(d=>(d?.exercises||[]).length||((d?.muscles||[]).length));if(hasWork&&!confirm(`Reducir a ${n} días eliminará la configuración de los últimos ${cur.length-n} día(s). ¿Continuar?`))return}const next=cur.slice(0,n);while(next.length<n)next.push(blankDay(next.length));next.forEach((d,i)=>d.day=i+1);setDays(next);state.active=Math.min(state.active,n-1);window.__dccTrainingOpen=state.active;save();try{window.dccClientAdmin(id(),'training')}catch(_){schedule()}requestAnimationFrame(()=>window.scrollTo({top:y,left:0,behavior:'auto'}))};
  window.dccTrainingWizardDay=i=>{const ds=days();i=Math.max(0,Math.min(Number(i)||0,ds.length-1));const y=window.scrollY||0;state.active=i;window.__dccTrainingOpen=i;try{window.dccClientAdmin(id(),'training')}catch(_){showSelectedDay(ds)}requestAnimationFrame(()=>window.scrollTo({top:y,left:0,behavior:'auto'}))};

  function schedule(){if(state.raf)return;state.raf=requestAnimationFrame(()=>{state.raf=0;apply()})}
  function start(){loadPremiumMuscles();const root=document.getElementById('coach-main');if(root)new MutationObserver(schedule).observe(root,{childList:true,subtree:true});schedule()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();