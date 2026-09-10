/* DCC coach premium loader v15 — panel visible inmediatamente mientras carga el bundle completo */
(function(){
  'use strict';
  if(window.__dccCoachPremiumLoaderV15)return;
  window.__dccCoachPremiumLoaderV15=true;

  const GOLD='#d9aa4a',GOLD2='#f0c96b';
  const getData=()=>{try{return data||{}}catch(e){return window.data||{}}};
  const esc=v=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const main=()=>document.getElementById('coach-main');

  function hasPremium(fn,depth){
    if(!fn||typeof fn!=='function'||depth>10)return false;
    if(fn.__dccPremiumV9||fn.__dccPremiumV6)return true;
    return hasPremium(fn.__base,depth+1)||hasPremium(fn.__original,depth+1);
  }

  function icon(name){
    const x={
      dumbbell:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 8v8M3.5 9.5v5M18 8v8M20.5 9.5v5M6 12h12"/></svg>',
      clients:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3.5 20c.5-4 2.3-6 5.5-6s5 2 5.5 6"/></svg>',
      check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="5" y="4" width="14" height="17" rx="2"/><path d="M8 11l2 2 5-5M8 17h7"/></svg>',
      renew:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M19 7v5h-5"/><path d="M5 17v-5h5"/><path d="M18.2 11A7 7 0 0 0 6.4 7.1L5 9M5.8 13A7 7 0 0 0 17.6 16.9L19 15"/></svg>',
      diet:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M7 3h7l4 4v14H7z"/><path d="M14 3v5h5M10 12h5M10 16h5"/></svg>',
      clipboard:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="5" y="5" width="14" height="16" rx="2"/><path d="M9 5V3h6v2M9 10h6M9 14h6M9 18h4"/></svg>',
      alert:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v6M12 17h.01"/></svg>'
    };
    return x[name]||'';
  }

  function injectInstantCss(){
    if(document.getElementById('dcc-coach-instant-v15'))return;
    const s=document.createElement('style');s.id='dcc-coach-instant-v15';
    s.textContent=`
      #coach-main.dcc-p9-dashboard{background:radial-gradient(ellipse at 88% 2%,rgba(217,170,74,.075),transparent 25%),linear-gradient(180deg,#07090c,#040608)!important;color:#f6f3ed!important;padding:10px 12px 90px!important}
      #coach-main.dcc-p9-dashboard .dcc-p9{width:100%;max-width:980px;margin:0 auto}
      #coach-main.dcc-p9-dashboard .dcc-p9 *{box-sizing:border-box}
      #coach-main.dcc-p9-dashboard .dcc-p9-hero{position:relative;overflow:hidden;min-height:142px;padding:16px;border:1px solid rgba(240,201,107,.60);border-radius:22px;background:radial-gradient(circle at 89% 12%,rgba(240,201,107,.14),transparent 27%),linear-gradient(132deg,#11161b 0%,#090d11 63%,#151007 100%);box-shadow:inset 0 1px 0 rgba(255,255,255,.04),0 15px 34px rgba(0,0,0,.28)}
      #coach-main.dcc-p9-dashboard .dcc-p9-hero-top{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
      #coach-main.dcc-p9-dashboard .dcc-p9-kicker{color:${GOLD2};font-size:9.5px;font-weight:900;letter-spacing:3px;text-transform:uppercase}
      #coach-main.dcc-p9-dashboard .dcc-p9-mark{width:43px;height:43px;display:grid;place-items:center;border:1px solid rgba(240,201,107,.52);border-radius:50%;color:${GOLD2}}
      #coach-main.dcc-p9-dashboard .dcc-p9-mark svg{width:23px;height:23px}
      #coach-main.dcc-p9-dashboard .dcc-p9-title{margin:23px 0 0;max-width:76%;font-size:27px;line-height:.98;font-weight:840;letter-spacing:-.85px;color:#f8f6f1}
      #coach-main.dcc-p9-dashboard .dcc-p9-title span{display:block;margin-top:5px;color:${GOLD2}}
      #coach-main.dcc-p9-dashboard .dcc-p9-caption{margin-top:10px;color:#9ba3ad;font-size:10.5px}
      #coach-main.dcc-p9-dashboard .dcc-p9-motto{position:absolute;right:16px;bottom:15px;text-align:right;color:#8d929a;font-size:5.8px;line-height:1.55;letter-spacing:2px;text-transform:uppercase}
      #coach-main.dcc-p9-dashboard .dcc-p9-stats{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:9px}
      #coach-main.dcc-p9-dashboard .dcc-p9-stat{min-height:67px;display:grid;grid-template-columns:32px minmax(0,1fr) 14px;align-items:center;gap:9px;padding:9px 10px;border:1px solid rgba(217,170,74,.38);border-radius:17px;background:linear-gradient(145deg,#10151a,#080c0f);color:#f6f4ef;text-align:left}
      #coach-main.dcc-p9-dashboard .dcc-p9-stat-ico{width:31px;height:31px;display:grid;place-items:center;color:${GOLD2}}
      #coach-main.dcc-p9-dashboard .dcc-p9-stat-ico svg{width:24px;height:24px}
      #coach-main.dcc-p9-dashboard .dcc-p9-stat strong{display:block;font-size:21px;line-height:1;font-weight:810}
      #coach-main.dcc-p9-dashboard .dcc-p9-stat.dcc-p9-positive strong{color:${GOLD2}}
      #coach-main.dcc-p9-dashboard .dcc-p9-stat span span{display:block;margin-top:6px;color:#9ca4af;font-size:6.4px;letter-spacing:1px;text-transform:uppercase}
      #coach-main.dcc-p9-dashboard .dcc-p9-stat-arrow{color:${GOLD2};font-size:19px}
      #coach-main.dcc-p9-dashboard .dcc-p9-accordion{margin-top:9px;border:1px solid rgba(240,201,107,.52);border-radius:20px;background:linear-gradient(145deg,#10151a,#080b0e);overflow:hidden}
      #coach-main.dcc-p9-dashboard .dcc-p9-accordion-head{width:100%;display:grid;grid-template-columns:35px minmax(0,1fr) auto 20px;align-items:center;gap:10px;padding:11px 12px;border:0;background:transparent;color:#f5f2ec;text-align:left}
      #coach-main.dcc-p9-dashboard .dcc-p9-head-ico{width:34px;height:34px;display:grid;place-items:center;color:${GOLD2};border:1px solid rgba(217,170,74,.32);border-radius:11px}
      #coach-main.dcc-p9-dashboard .dcc-p9-head-ico svg{width:21px;height:21px}
      #coach-main.dcc-p9-dashboard .dcc-p9-head-title{display:flex;align-items:center;gap:8px;color:${GOLD2};font-size:9.5px;font-weight:900;letter-spacing:2.5px;text-transform:uppercase}
      #coach-main.dcc-p9-dashboard .dcc-p9-count{min-width:22px;height:22px;padding:0 7px;display:inline-flex;align-items:center;justify-content:center;border-radius:999px;background:linear-gradient(135deg,#f1ca68,#d9a43a);color:#17120a;font-size:9px;font-weight:900;letter-spacing:0}
      #coach-main.dcc-p9-dashboard .dcc-p9-head-sub{margin-top:4px;color:#858e99;font-size:8px;text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      #coach-main.dcc-p9-dashboard .dcc-p9-caret{color:${GOLD2};font-size:24px;transform:rotate(180deg)}
      #coach-main.dcc-p9-dashboard .dcc-p9-body{display:none!important}
      @media(max-width:390px){#coach-main.dcc-p9-dashboard .dcc-p9-motto{display:none}}
    `;
    document.head.appendChild(s);
  }

  function daysSince(v){if(!v)return null;const d=new Date(v);return Number.isFinite(d.getTime())?Math.floor((Date.now()-d.getTime())/86400000):null}
  function latestWorkout(id){const h=getData()?.workoutHistory?.[id]||[];return h.slice().sort((a,b)=>new Date(b.date)-new Date(a.date))[0]||null}
  function hasRoutine(id){const r=getData()?.routines?.[id];return Array.isArray(r)&&r.length>0}
  function pendingCheck(c){const x=getData()?.checkins?.[c.id];return !!(x?.sentAt&&!x?.reviewed)}
  function stat(iconName,value,label,action){const cls=Number(value)>0?'dcc-p9-positive':'dcc-p9-zero';return `<button type="button" class="dcc-p9-stat ${cls}" ${action?`onclick="${action}"`:''}><span class="dcc-p9-stat-ico">${icon(iconName)}</span><span><strong>${esc(value)}</strong><span>${esc(label)}</span></span><span class="dcc-p9-stat-arrow">›</span></button>`}

  function renderInstantDashboard(){
    injectInstantCss();
    const m=main();if(!m)return;
    const d=getData(),cs=Array.isArray(d.clients)?d.clients:[];
    let tasks=0,attention=0;
    cs.forEach(c=>{if(pendingCheck(c))tasks++;if(!hasRoutine(c.id))tasks++;const gap=daysSince(latestWorkout(c.id)?.date);if(gap!==null&&gap>=7)attention++});
    const h=new Date().getHours(),g=h<13?'BUENOS DÍAS':h<20?'BUENAS TARDES':'BUENAS NOCHES';
    m.className='dcc-p9-dashboard';window.currentScreen='dashboard';m.dataset.dccInstant='1';
    m.innerHTML=`<div class="dcc-p9"><section class="dcc-p9-hero"><div class="dcc-p9-hero-top"><div class="dcc-p9-kicker">PANEL DE ENTRENADOR</div><div class="dcc-p9-mark">${icon('dumbbell')}</div></div><h1 class="dcc-p9-title">${g},<span>DANIEL</span></h1><div class="dcc-p9-caption">Clientes, seguimiento y próximas acciones.</div><div class="dcc-p9-motto">DISCIPLINA<br>TRANSFORMA<br>VIDAS</div></section><div class="dcc-p9-stats">${stat('clients',cs.length,'CLIENTES',"showCoach('clients')")}${stat('check',cs.filter(pendingCheck).length,'CHECK-IN PENDIENTES',"showCoach('checkins')")}${stat('renew',0,'RUTINAS POR RENOVAR',"toast('Sin rutinas por renovar')")}${stat('diet',0,'DIETAS POR RENOVAR',"toast('Sin dietas por renovar')")}</div><section id="dccP9Tasks" class="dcc-p9-accordion closed"><button type="button" class="dcc-p9-accordion-head"><span class="dcc-p9-head-ico">${icon('clipboard')}</span><span><span class="dcc-p9-head-title">TAREAS PENDIENTES <span class="dcc-p9-count">${tasks}</span></span><span class="dcc-p9-head-sub">ACCIONES QUE REQUIEREN TU ATENCIÓN</span></span><span></span><span class="dcc-p9-caret">⌃</span></button><div class="dcc-p9-body"></div></section><section id="dccP9Attention" class="dcc-p9-accordion closed"><button type="button" class="dcc-p9-accordion-head"><span class="dcc-p9-head-ico">${icon('alert')}</span><span><span class="dcc-p9-head-title">REQUIEREN ATENCIÓN <span class="dcc-p9-count">${attention}</span></span><span class="dcc-p9-head-sub">SEÑALES DE SEGUIMIENTO DETECTADAS AUTOMÁTICAMENTE</span></span><span></span><span class="dcc-p9-caret">⌃</span></button><div class="dcc-p9-body"></div></section></div>`;
  }

  function add(src,key,onload){
    const existing=document.querySelector(`script[data-dcc-${key}]`);
    if(existing){if(onload){if(existing.dataset.dccLoaded==='1')onload();else existing.addEventListener('load',onload,{once:true})}return existing}
    const s=document.createElement('script');s.src=src;s.async=false;s.dataset['dcc'+key.charAt(0).toUpperCase()+key.slice(1)]='1';
    s.onload=()=>{s.dataset.dccLoaded='1';onload&&onload()};s.onerror=()=>console.error('DCC: no se pudo cargar '+src);(document.head||document.documentElement).appendChild(s);return s;
  }

  function installInstantGuard(){
    const current=window.showCoach;if(typeof current!=='function'||hasPremium(current,0)||current.__dccInstantV15)return;
    const wrapped=function(screen){if(screen==='dashboard'){renderInstantDashboard();return}return current.apply(this,arguments)};
    wrapped.__dccInstantV15=true;wrapped.__base=current;window.showCoach=wrapped;
  }

  function enforceClosedAndColors(){
    const m=main();if(!m||!m.classList.contains('dcc-p9-dashboard'))return;
    m.querySelectorAll('.dcc-p9-stat').forEach(card=>{const n=Number.parseFloat(card.querySelector('strong')?.textContent||'0');card.classList.toggle('dcc-p9-positive',Number.isFinite(n)&&n>0);card.classList.toggle('dcc-p9-zero',!(Number.isFinite(n)&&n>0))});
    m.querySelectorAll('.dcc-p9-accordion').forEach(x=>x.classList.add('closed'));
  }

  function installFinalGuard(){
    const current=window.showCoach;if(typeof current!=='function'||!hasPremium(current,0)||current.__dccFastFinalV15)return;
    const wrapped=function(screen){const m=main();if(screen==='dashboard'&&window.currentScreen==='dashboard'&&m?.classList.contains('dcc-p9-dashboard')&&!m.dataset.dccInstant)return;const r=current.apply(this,arguments);if(screen==='dashboard'){delete main()?.dataset.dccInstant;requestAnimationFrame(enforceClosedAndColors)}return r};
    wrapped.__dccFastFinalV15=true;wrapped.__dccPremiumV9=!!current.__dccPremiumV9;wrapped.__dccPremiumV6=!!current.__dccPremiumV6;wrapped.__base=current;window.showCoach=wrapped;
  }

  function afterCore(){
    const m=main();const wasInstant=m?.dataset.dccInstant==='1';
    if(wasInstant&&typeof window.showCoach==='function'){
      try{delete m.dataset.dccInstant;window.showCoach('dashboard')}catch(e){}
    }
    installFinalGuard();enforceClosedAndColors();
    add('./coach-ui-v11.js?v=20260910-1932','coachUi',()=>{installFinalGuard();enforceClosedAndColors()});
  }

  installInstantGuard();
  if(hasPremium(window.showCoach,0)){
    installFinalGuard();enforceClosedAndColors();add('./coach-ui-v11.js?v=20260910-1932','coachUi',()=>{installFinalGuard();enforceClosedAndColors()});
  }else{
    add('./coach-premium-core-v9.js?v=20260910-2015','coachCore',afterCore);
  }

  window.addEventListener('pageshow',()=>{installInstantGuard();installFinalGuard();enforceClosedAndColors()});
})();
