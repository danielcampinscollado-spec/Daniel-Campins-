/* DCC — Coach UI stable v12: single renderer, no polling, no patch chain */
(function(){
  'use strict';

  const GOLD='#d9aa4a';
  const GOLD2='#f0c96b';
  const STYLE_ID='dcc-coach-stable-v12';
  let clientSort='az';

  const esc=v=>String(v??'').replace(/[&<>"']/g,ch=>({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[ch]));
  const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('es').trim();
  const getData=()=>{try{return data||{}}catch(_){return window.data||{}}};

  function injectCss(){
    if(document.getElementById(STYLE_ID)) return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      #coach-main.dcc-premium-dashboard,#coach-main.dcc-premium-clients{
        min-height:100dvh!important;background:#07090c!important;padding:6px 12px 88px!important;color:#f6f3ed!important;
      }
      .dcc-pd,.dcc-cl{max-width:980px;margin:auto}.dcc-pd *,.dcc-cl *{box-sizing:border-box}

      .dcc-pd-hero{min-height:194px;padding:14px;position:relative;overflow:hidden;background:radial-gradient(ellipse at 79% 37%,rgba(225,173,68,.19),transparent 29%),linear-gradient(108deg,#030405,#080a0c 58%,#020303)}
      .dcc-pd-brand{display:flex;align-items:center;gap:10px}.dcc-pd-brand img{width:50px}.dcc-pd-brand-name{font-size:10px;letter-spacing:3.4px;color:${GOLD2};font-weight:750}.dcc-pd-brand-sub{margin-top:4px;font-size:7px;letter-spacing:2.8px;color:#7e858f}
      .dcc-pd-title{max-width:62%;margin:35px 0 0;font-family:Georgia,serif;font-size:33px;line-height:1;font-weight:500}.dcc-pd-title span{display:block;margin-top:3px;color:${GOLD2};font-family:Arial,sans-serif;font-weight:800}.dcc-pd-title:after{content:"";display:block;width:44px;height:2px;margin-top:13px;background:${GOLD2}}
      .dcc-pd-strip{display:grid;grid-template-columns:repeat(4,1fr);margin:5px 0 10px;border:1px solid rgba(217,170,74,.43);border-radius:16px;overflow:hidden;background:linear-gradient(145deg,#10151a,#080b0e)}
      .dcc-pd-stat{min-height:68px;padding:9px 7px;border-right:1px solid #ffffff1f}.dcc-pd-stat:last-child{border:0}.dcc-pd-stat strong{display:block;font-size:20px}.dcc-pd-stat span{display:block;margin-top:7px;font-size:6.8px;letter-spacing:.55px;color:#d0d3d8}
      .dcc-pd-section{margin-top:10px;padding:12px 14px;border:1px solid rgba(217,170,74,.43);border-radius:17px;background:linear-gradient(145deg,#11151a,#090c0f)}.dcc-pd-section-kicker{color:${GOLD2};font-size:10px;font-weight:800;letter-spacing:2.8px}.dcc-pd-section-sub{margin-top:3px;color:#aeb4bc;font-size:10.5px}
      .dcc-pd-row{width:100%;display:flex;align-items:center;gap:10px;padding:10px 0;border:0;border-top:1px solid #ffffff13;background:none;color:#f5f2ec;text-align:left}.dcc-pd-icon{width:38px;height:38px;display:grid;place-items:center;border:1px solid #d9aa4a33;border-radius:11px;color:${GOLD2}}.dcc-pd-copy{flex:1}.dcc-pd-copy b{display:block;font-size:12.5px}.dcc-pd-copy span{font-size:10px;color:#9097a1}.dcc-pd-badge{padding:6px 8px;border-radius:9px;font-size:8px;color:${GOLD2};border:1px solid #d9aa4a29}.dcc-pd-arrow{color:${GOLD2};font-size:19px}
      .dcc-pd-empty-ok{text-align:center;padding:9px}.dcc-ok-icon{width:30px;height:30px;margin:auto auto 5px;border:1px solid ${GOLD};border-radius:50%;display:grid;place-items:center;color:${GOLD2}}
      .dcc-pd-banner{display:flex;align-items:center;gap:12px;min-height:70px;margin-top:10px;padding:10px 14px;border:1px solid rgba(240,201,107,.76);border-radius:17px;background:radial-gradient(ellipse at 90% 45%,rgba(232,178,66,.34),transparent 17%),radial-gradient(ellipse at 70% 70%,rgba(180,122,28,.18),transparent 25%),linear-gradient(100deg,#171006,#090a0b 38%,#171006)}.dcc-pd-trophy{color:${GOLD2};font-size:22px}.dcc-pd-banner small{display:block;color:${GOLD2};font-size:7.3px;letter-spacing:2.3px}.dcc-pd-banner strong{display:block;margin-top:4px;font-family:Georgia,serif;font-size:15px}

      .dcc-cl{padding-top:14px}.dcc-cl-head{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;margin:6px 2px 20px}.dcc-cl-head h1{margin:0;font-size:34px;letter-spacing:-1.3px}.dcc-cl-head p{margin:6px 0 0;color:#939aa5;font-size:14px}.dcc-cl-new{border:1px solid #f0c96b;border-radius:15px;padding:12px 16px;background:linear-gradient(135deg,#f0c96b,#d9aa4a);color:#090909;font-weight:800;font-size:12px;white-space:nowrap}
      .dcc-cl-tools{display:block;width:100%}.dcc-cl-search{height:58px;width:100%;display:flex;align-items:center;gap:12px;padding:0 17px;border:1px solid rgba(217,170,74,.5);border-radius:18px;background:radial-gradient(circle at 88% 45%,rgba(217,170,74,.08),transparent 28%),linear-gradient(145deg,#0e1318,#080b0e);color:#dce1e8;box-shadow:inset 0 1px 0 rgba(255,255,255,.025),0 10px 28px rgba(0,0,0,.2)}.dcc-cl-search:focus-within{border-color:${GOLD2};box-shadow:0 0 0 3px rgba(217,170,74,.09),0 10px 30px rgba(0,0,0,.25)}.dcc-cl-search-icon{width:21px;height:21px;flex:none;color:#cfd5dc}
      #coach-main.dcc-premium-clients #dccClientSearch{display:block!important;flex:1 1 auto!important;width:100%!important;height:56px!important;min-height:56px!important;margin:0!important;padding:0!important;border:0!important;border-radius:0!important;outline:0!important;background:transparent!important;box-shadow:none!important;color:#f7f7f5!important;font-size:16px!important;font-weight:650!important;line-height:56px!important;pointer-events:auto!important;-webkit-appearance:none!important;appearance:none!important}
      #coach-main.dcc-premium-clients #dccClientSearch::placeholder{color:#929aa5!important;opacity:1!important;font-size:16px!important;font-weight:650!important}
      .dcc-cl-subtools{display:flex;justify-content:space-between;align-items:center;gap:8px;margin:12px 0 14px;position:relative;z-index:2}.dcc-cl-tabs{display:flex;min-width:0;flex:1;border:1px solid #292f36;border-radius:22px;overflow:hidden;background:#090c0f}.dcc-cl-tab,.dcc-cl-pending{min-height:42px;flex:1;padding:0 14px;border:0;background:none;color:#9aa1ac;font-size:10.5px;white-space:nowrap}.dcc-cl-tab.active{border:1px solid ${GOLD2};border-radius:21px;background:radial-gradient(circle at 50% 50%,#d9aa4a35,#15100a);color:${GOLD2};box-shadow:0 0 18px #d9aa4a28}.dcc-cl-pending{cursor:pointer}.dcc-cl-pending:active{color:${GOLD2};transform:scale(.98)}
      .dcc-cl-order{height:48px;min-width:88px;padding:0 12px;border:1px solid rgba(240,201,107,.72);border-radius:16px;background:linear-gradient(145deg,#17140e,#090c0e);color:${GOLD2};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;box-shadow:inset 0 1px 0 rgba(255,255,255,.04),0 8px 22px rgba(0,0,0,.25);touch-action:manipulation}.dcc-cl-order small{font-size:7px;line-height:1;letter-spacing:1.35px;color:#858d98;font-weight:900}.dcc-cl-order-state{font-size:13px;line-height:1.1;letter-spacing:.4px;color:${GOLD2};font-weight:900}.dcc-cl-order:active{transform:scale(.96)}
      .dcc-cl-list{display:grid;gap:9px}.dcc-cl-card{display:grid;grid-template-columns:minmax(0,1fr) minmax(135px,.85fr) 112px;align-items:center;gap:13px;min-height:104px;padding:14px 15px;border:1px solid rgba(217,170,74,.68);border-radius:17px;background:radial-gradient(ellipse at 86% 35%,rgba(217,170,74,.10),transparent 23%),linear-gradient(120deg,#0c1014,#080b0e);box-shadow:0 10px 26px #0005}.dcc-cl-card.dcc-hidden{display:none!important}.dcc-cl-info{min-width:0}.dcc-cl-name{font-size:17px;font-weight:800;color:#f5f3ef}.dcc-cl-goal{margin-top:6px;color:${GOLD2};font-size:12px}.dcc-cl-weight{margin-top:4px;color:#a4abb5;font-size:12px}.dcc-cl-training{padding-left:14px;border-left:1px solid #343a42}.dcc-cl-tr-title{display:flex;align-items:center;gap:7px;color:#f1f1ef;font-size:10px}.dcc-cl-dumbbell{color:${GOLD2};font-size:18px}.dcc-cl-progress{display:flex;align-items:center;gap:8px;margin-top:8px}.dcc-cl-track{height:6px;flex:1;border-radius:8px;background:#2a3037;overflow:hidden}.dcc-cl-fill{height:100%;border-radius:8px;background:linear-gradient(90deg,#d9aa4a,#f0c96b)}.dcc-cl-pct{font-size:11px}.dcc-cl-manage{min-height:48px;border:1px solid ${GOLD2};border-radius:13px;background:linear-gradient(145deg,#18140c,#0a0b0c);color:${GOLD2};font-size:11px;font-weight:800;line-height:1.25}.dcc-cl-empty-filter{display:none;padding:30px 18px;border:1px solid rgba(217,170,74,.28);border-radius:17px;background:linear-gradient(145deg,#101419,#090c0f);text-align:center;color:#9ba2ad;font-size:13px}.dcc-cl-empty-filter.show{display:block}.dcc-cl-empty-filter strong{display:block;margin-bottom:5px;color:${GOLD2};font-size:14px}.dcc-cl-empty{padding:28px 18px;border:1px solid rgba(217,170,74,.28);border-radius:17px;text-align:center;color:#9ba2ad}

      html body #coach .side{height:62px!important;left:14px!important;right:14px!important;bottom:10px!important;border-radius:21px!important;padding:0 7px!important}
      html body #coach-nav{display:grid!important;grid-template-columns:repeat(5,minmax(0,1fr))!important;gap:0!important;height:100%!important}
      html body #coach-nav button{height:100%!important;min-width:0!important;width:100%!important;padding:5px 2px!important;margin:0!important;border:1px solid transparent!important;border-radius:16px!important;background:transparent!important;color:#858d98!important;box-shadow:none!important;transform:none!important}
      html body #coach-nav button::before{display:none!important}
      html body #coach-nav button svg{width:21px!important;height:21px!important;margin:0 auto!important;stroke:currentColor!important}
      html body #coach-nav button span{display:block!important;width:100%!important;font-size:7.3px!important;line-height:1!important;margin-top:2px!important;white-space:nowrap!important;overflow:visible!important;text-overflow:clip!important}
      html body #coach-nav button.active{border-color:rgba(217,170,74,.34)!important;background:rgba(217,170,74,.07)!important;color:${GOLD2}!important}

      @media(max-width:600px){.dcc-cl-head h1{font-size:31px}.dcc-cl-head p{font-size:12px}.dcc-cl-new{padding:11px 13px}.dcc-cl-search{height:56px}.dcc-cl-subtools{gap:7px}.dcc-cl-tab,.dcc-cl-pending{padding:0 10px;font-size:9.8px}.dcc-cl-order{min-width:78px;padding:0 9px}.dcc-cl-card{grid-template-columns:minmax(0,1fr) minmax(108px,.8fr) 88px;gap:9px;padding:12px 11px;min-height:94px}.dcc-cl-name{font-size:15px}.dcc-cl-goal,.dcc-cl-weight{font-size:10.5px}.dcc-cl-training{padding-left:9px}.dcc-cl-manage{font-size:9.5px;padding:5px}}
      @media(prefers-reduced-motion:reduce){#coach *{scroll-behavior:auto!important;animation:none!important;transition-duration:.01ms!important}}
    `;
    document.head.appendChild(s);
  }

  function svg(kind){
    const m={
      panel:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/></svg>',
      clients:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3.5 20c.5-4 2.3-6 5.5-6s5 2 5.5 6"/></svg>',
      calendar:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16"/></svg>',
      check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="5" y="4" width="14" height="17" rx="2"/><path d="M8 11l2 2 5-5M8 17h7"/></svg>',
      msg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.7 8.7 0 0 1-4-.9L4 20l1.4-3.4A7.3 7.3 0 0 1 4 11.5 7.5 7.5 0 0 1 12 4a7.5 7.5 0 0 1 8 7.5Z"/></svg>'
    };
    return m[kind]||'';
  }

  function premiumNavHtml(){
    return `<button type="button" onclick="showCoach('dashboard')">${svg('panel')}<span>Panel</span></button>`+
      `<button type="button" onclick="showCoach('clients')">${svg('clients')}<span>Clientes</span></button>`+
      `<button type="button" onclick="toast('Calendario próximamente')">${svg('calendar')}<span>Calendario</span></button>`+
      `<button type="button" onclick="showCoach('checkins')">${svg('check')}<span>Check-in</span></button>`+
      `<button type="button" onclick="showCoach('messages')">${svg('msg')}<span>Mensajes</span></button>`;
  }

  function buildPremiumNav(){
    const nav=document.getElementById('coach-nav');
    if(!nav) return;
    nav.innerHTML=premiumNavHtml();
    setActiveNav(readCurrentScreen()||'dashboard');
  }

  function readCurrentScreen(){
    try{return currentScreen}catch(_){return window.currentScreen||''}
  }

  function writeCurrentScreen(screen){
    try{currentScreen=screen}catch(_){window.currentScreen=screen}
  }

  function setActiveNav(screen){
    const nav=document.getElementById('coach-nav');
    if(!nav) return;
    const map={dashboard:0,clients:1,checkins:3,messages:4};
    const idx=map[screen];
    nav.querySelectorAll('button').forEach((b,i)=>b.classList.toggle('active',idx!==undefined&&i===idx));
  }

  function daysSince(v){
    if(!v) return null;
    const d=new Date(v);
    return Number.isFinite(d.getTime())?Math.floor((Date.now()-d.getTime())/86400000):null;
  }
  function latestWorkout(id){
    const h=getData()?.workoutHistory?.[id]||[];
    return h.slice().sort((a,b)=>new Date(b?.date||0)-new Date(a?.date||0))[0]||null;
  }
  function hasRoutine(id){
    const r=getData()?.routines?.[id];
    return Array.isArray(r)&&r.length>0;
  }
  function pendingCheck(c){
    const x=getData()?.checkins?.[c.id];
    if(!x) return c?.status==='Pendiente';
    if(x.reviewed===true) return false;
    return !!(x.sentAt||x.updatedAt||x.diet||x.training||x.comment||c?.status==='Pendiente');
  }
  function trainingProgress(c){
    const d=getData();
    const r=d?.routines?.[c.id];
    if(!Array.isArray(r)||!r.length) return 0;
    const h=d?.workoutHistory?.[c.id]||[];
    if(!h.length) return 0;
    const recent=h.filter(x=>{const n=daysSince(x?.date);return n!==null&&n<=30}).length;
    return Math.min(100,Math.round(recent/Math.max(1,r.length*4)*100));
  }

  function taskRow(i){
    return `<button class="dcc-pd-row" type="button" onclick="${i.action}"><span class="dcc-pd-icon">${i.icon}</span><span class="dcc-pd-copy"><b>${esc(i.title)}</b><span>${esc(i.text)}</span></span><span class="dcc-pd-badge">${esc(i.badge)}</span><span class="dcc-pd-arrow">›</span></button>`;
  }

  function renderDashboard(){
    injectCss();
    const main=document.getElementById('coach-main');
    if(!main) return;
    main.className='dcc-premium-dashboard';
    const cs=Array.isArray(getData()?.clients)?getData().clients:[];
    const tasks=[];
    const attention=[];
    cs.forEach(c=>{
      if(pendingCheck(c)) tasks.push({icon:'✓',title:'REVISAR CHECK-IN',text:c.name,badge:'HOY',action:`reviewCheckin('${esc(c.id)}')`});
      if(!hasRoutine(c.id)) tasks.push({icon:'⌁',title:'ASIGNAR RUTINA',text:c.name,badge:'PENDIENTE',action:`openClient('${esc(c.id)}')`});
      const gap=daysSince(latestWorkout(c.id)?.date);
      if(gap!==null&&gap>=7) attention.push({icon:'!',title:c.name,text:`${gap} DÍAS SIN REGISTRAR ENTRENAMIENTO`,badge:'SEGUIMIENTO',action:`openClient('${esc(c.id)}')`});
    });
    const hr=new Date().getHours();
    const greeting=hr<13?'BUENOS DÍAS':hr<20?'BUENAS TARDES':'BUENAS NOCHES';
    main.innerHTML=`<div class="dcc-pd"><section class="dcc-pd-hero"><div class="dcc-pd-brand"><img src="./dc-stride-logo.svg.svg" alt=""><div><div class="dcc-pd-brand-name">DANIEL CAMPINS</div><div class="dcc-pd-brand-sub">TRAINING PLATFORM</div></div></div><h1 class="dcc-pd-title">${greeting},<span>DANIEL</span></h1></section><div class="dcc-pd-strip"><div class="dcc-pd-stat"><strong>${cs.length}</strong><span>CLIENTES</span></div><div class="dcc-pd-stat"><strong>${cs.filter(pendingCheck).length}</strong><span>CHECK-IN PENDIENTES</span></div><div class="dcc-pd-stat"><strong>0</strong><span>RUTINAS POR RENOVAR</span></div><div class="dcc-pd-stat"><strong>0</strong><span>DIETAS POR RENOVAR</span></div></div><section class="dcc-pd-section"><div class="dcc-pd-section-kicker">TAREAS PENDIENTES</div><div class="dcc-pd-section-sub">ACCIONES QUE REQUIEREN TU ATENCIÓN</div>${tasks.length?tasks.slice(0,6).map(taskRow).join(''):'<div class="dcc-pd-empty-ok"><div class="dcc-ok-icon">✓</div><b>TODO AL DÍA</b></div>'}</section><section class="dcc-pd-section"><div class="dcc-pd-section-kicker">REQUIEREN ATENCIÓN</div><div class="dcc-pd-section-sub">SEÑALES DE SEGUIMIENTO DETECTADAS AUTOMÁTICAMENTE</div>${attention.length?attention.slice(0,6).map(taskRow).join(''):'<div class="dcc-pd-empty-ok">SIN ALERTAS DE SEGUIMIENTO</div>'}</section><section class="dcc-pd-banner"><span class="dcc-pd-trophy">♛</span><div><small>CADA CLIENTE ES UN PROCESO.</small><strong>TÚ MARCAS LA DIFERENCIA.</strong></div></section></div>`;
  }

  function clientCard(c){
    const p=trainingProgress(c);
    const goal=c.goal||c.objective||c.objetivo||'Objetivo por definir';
    const weight=c.weight||c.peso||'';
    return `<article class="dcc-cl-card" data-name="${esc(c.name)}"><div class="dcc-cl-info"><div class="dcc-cl-name">${esc(c.name)}</div><div class="dcc-cl-goal">${esc(goal)}</div>${weight?`<div class="dcc-cl-weight">${esc(weight)} kg</div>`:''}</div><div class="dcc-cl-training"><div class="dcc-cl-tr-title"><span class="dcc-cl-dumbbell">⌁</span> Entrenamiento</div><div class="dcc-cl-progress"><div class="dcc-cl-track"><div class="dcc-cl-fill" style="width:${p}%"></div></div><span class="dcc-cl-pct">${p}%</span></div></div><button class="dcc-cl-manage" type="button" onclick="openClient('${esc(c.id)}')">Gestionar<br>cliente</button></article>`;
  }

  function sortedClients(){
    const cs=Array.isArray(getData()?.clients)?getData().clients.slice():[];
    return cs.sort((a,b)=>{
      const an=String(a?.name||'');
      const bn=String(b?.name||'');
      return clientSort==='za'?bn.localeCompare(an,'es',{sensitivity:'base'}):an.localeCompare(bn,'es',{sensitivity:'base'});
    });
  }

  function filterClients(){
    const input=document.getElementById('dccClientSearch');
    const q=norm(input?.value||'');
    const cards=[...document.querySelectorAll('#dccClientList .dcc-cl-card')];
    let visible=0;
    cards.forEach(card=>{
      const show=!q||norm(card.dataset.name||'').includes(q);
      card.classList.toggle('dcc-hidden',!show);
      if(show) visible++;
    });
    const empty=document.getElementById('dccClientEmptyFilter');
    if(empty) empty.classList.toggle('show',cards.length>0&&visible===0);
  }

  function sortCardsInPlace(){
    const list=document.getElementById('dccClientList');
    if(!list) return;
    const cards=[...list.querySelectorAll('.dcc-cl-card')];
    cards.sort((a,b)=>{
      const an=norm(a.dataset.name||'');
      const bn=norm(b.dataset.name||'');
      return clientSort==='za'?bn.localeCompare(an,'es'):an.localeCompare(bn,'es');
    }).forEach(card=>list.appendChild(card));
    const state=document.querySelector('.dcc-cl-order-state');
    if(state) state.textContent=clientSort==='az'?'A—Z':'Z—A';
    filterClients();
  }

  function bindClientControls(){
    const search=document.getElementById('dccClientSearch');
    const pending=document.getElementById('dccClientPending');
    const all=document.getElementById('dccClientAll');
    const order=document.getElementById('dccClientOrder');
    if(search) search.addEventListener('input',filterClients);
    if(all) all.addEventListener('click',()=>{
      if(search){search.value='';filterClients();search.focus({preventScroll:true});}
    });
    if(pending) pending.addEventListener('click',()=>window.showCoach('checkins'));
    if(order) order.addEventListener('click',()=>{
      clientSort=clientSort==='az'?'za':'az';
      sortCardsInPlace();
    });
  }

  function renderClients(){
    injectCss();
    const main=document.getElementById('coach-main');
    if(!main) return;
    main.className='dcc-premium-clients';
    const cs=sortedClients();
    const state=clientSort==='az'?'A—Z':'Z—A';
    main.innerHTML=`<div class="dcc-cl"><header class="dcc-cl-head"><div><h1>Clientes</h1><p>Gestiona el proceso de cada persona.</p></div><button class="dcc-cl-new" type="button" onclick="newClient()">＋ Nuevo cliente</button></header><div class="dcc-cl-tools"><label class="dcc-cl-search"><svg class="dcc-cl-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4 4"/></svg><input id="dccClientSearch" type="search" autocomplete="off" placeholder="Buscar cliente..." aria-label="Buscar cliente"></label></div><div class="dcc-cl-subtools"><div class="dcc-cl-tabs"><button id="dccClientAll" class="dcc-cl-tab active" type="button">Todos</button><button id="dccClientPending" class="dcc-cl-pending" type="button">Pendientes por revisar</button></div><button id="dccClientOrder" class="dcc-cl-order" type="button" aria-label="Cambiar orden alfabético"><small>ORDEN</small><span class="dcc-cl-order-state">${state}</span></button></div><div class="dcc-cl-list" id="dccClientList">${cs.length?cs.map(clientCard).join(''):'<div class="dcc-cl-empty">Todavía no hay clientes.</div>'}</div><div class="dcc-cl-empty-filter" id="dccClientEmptyFilter"><strong>Sin resultados</strong><span>No hay clientes con ese nombre.</span></div></div>`;
    bindClientControls();
    filterClients();
  }

  function install(){
    if(window.__dccCoachStableV12) return;
    window.__dccCoachStableV12=true;
    injectCss();

    const originalShowCoach=window.showCoach;
    if(typeof originalShowCoach!=='function') return;

    window.buildCoachNav=buildPremiumNav;
    buildPremiumNav();

    const stableShowCoach=function(screen){
      writeCurrentScreen(screen);
      if(screen==='dashboard'){
        renderDashboard();
        setActiveNav(screen);
        return;
      }
      if(screen==='clients'){
        renderClients();
        setActiveNav(screen);
        return;
      }
      const main=document.getElementById('coach-main');
      if(main) main.classList.remove('dcc-premium-dashboard','dcc-premium-clients');
      const result=originalShowCoach.apply(this,arguments);
      setActiveNav(screen);
      return result;
    };
    stableShowCoach.__dccStable=true;
    stableShowCoach.__original=originalShowCoach;
    window.showCoach=stableShowCoach;
  }

  install();
})();
