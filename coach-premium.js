/* DCC — Panel + Clientes premium + navegación global fija */
(function(){
  const GOLD="#d9aa4a", GOLD2="#f0c96b";
  const esc=v=>String(v??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  const norm=v=>String(v??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLocaleLowerCase("es").trim();

  function injectCss(){
    document.getElementById("dcc-premium-v5")?.remove();
    document.getElementById("dcc-premium-v6")?.remove();
    document.getElementById("dcc-premium-v7")?.remove();
    const s=document.createElement("style");
    s.id="dcc-premium-v7";
    s.textContent=`
      #coach-main.dcc-premium-dashboard,#coach-main.dcc-premium-clients{background:#07090c!important;padding:6px 12px 88px!important;color:#f6f3ed}
      .dcc-pd,.dcc-cl{max-width:980px;margin:auto}.dcc-pd *,.dcc-cl *{box-sizing:border-box}
      .dcc-pd-hero{min-height:194px;padding:14px;position:relative;overflow:hidden;background:radial-gradient(ellipse at 79% 37%,rgba(225,173,68,.19),transparent 29%),linear-gradient(108deg,#030405,#080a0c 58%,#020303)}
      .dcc-pd-brand{display:flex;align-items:center;gap:10px}.dcc-pd-brand img{width:50px}.dcc-pd-brand-name{font-size:10px;letter-spacing:3.4px;color:${GOLD2};font-weight:750}.dcc-pd-brand-sub{margin-top:4px;font-size:7px;letter-spacing:2.8px;color:#7e858f}
      .dcc-pd-title{max-width:62%;margin:35px 0 0;font-family:Georgia,serif;font-size:33px;line-height:1;font-weight:500}.dcc-pd-title span{display:block;margin-top:3px;color:${GOLD2};font-family:Arial,sans-serif;font-weight:800}.dcc-pd-title:after{content:"";display:block;width:44px;height:2px;margin-top:13px;background:${GOLD2}}
      .dcc-pd-strip{display:grid;grid-template-columns:repeat(4,1fr);margin:5px 0 10px;border:1px solid rgba(217,170,74,.43);border-radius:16px;overflow:hidden;background:linear-gradient(145deg,#10151a,#080b0e)}
      .dcc-pd-stat{min-height:68px;padding:9px 7px;border-right:1px solid #ffffff1f}.dcc-pd-stat:last-child{border:0}.dcc-pd-stat strong{display:block;font-size:20px}.dcc-pd-stat span{display:block;margin-top:7px;font-size:6.8px;letter-spacing:.55px;color:#d0d3d8}
      .dcc-pd-section{margin-top:10px;padding:12px 14px;border:1px solid rgba(217,170,74,.43);border-radius:17px;background:linear-gradient(145deg,#11151a,#090c0f)}.dcc-pd-section-kicker{color:${GOLD2};font-size:10px;font-weight:800;letter-spacing:2.8px}.dcc-pd-section-sub{margin-top:3px;color:#aeb4bc;font-size:10.5px}
      .dcc-pd-row{width:100%;display:flex;align-items:center;gap:10px;padding:10px 0;border:0;border-top:1px solid #ffffff13;background:none;color:#f5f2ec;text-align:left}.dcc-pd-icon{width:38px;height:38px;display:grid;place-items:center;border:1px solid #d9aa4a33;border-radius:11px;color:${GOLD2}}.dcc-pd-copy{flex:1}.dcc-pd-copy b{display:block;font-size:12.5px}.dcc-pd-copy span{font-size:10px;color:#9097a1}.dcc-pd-badge{padding:6px 8px;border-radius:9px;font-size:8px;color:${GOLD2};border:1px solid #d9aa4a29}.dcc-pd-arrow{color:${GOLD2};font-size:19px}
      .dcc-pd-empty-ok{text-align:center;padding:7px}.dcc-ok-icon{width:30px;height:30px;margin:auto;border:1px solid ${GOLD};border-radius:50%;display:grid;place-items:center;color:${GOLD2}}
      .dcc-pd-banner{display:flex;align-items:center;gap:12px;min-height:70px;margin-top:10px;padding:10px 14px;border:1px solid rgba(240,201,107,.76);border-radius:17px;background:radial-gradient(ellipse at 90% 45%,rgba(232,178,66,.34),transparent 17%),radial-gradient(ellipse at 70% 70%,rgba(180,122,28,.18),transparent 25%),linear-gradient(100deg,#171006,#090a0b 38%,#171006)}.dcc-pd-trophy{color:${GOLD2};font-size:22px}.dcc-pd-banner small{display:block;color:${GOLD2};font-size:7.3px;letter-spacing:2.3px}.dcc-pd-banner strong{display:block;margin-top:4px;font-family:Georgia,serif;font-size:15px}

      .dcc-cl{padding-top:14px}.dcc-cl-head{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;margin:6px 2px 20px}.dcc-cl-head h1{margin:0;font-size:34px;letter-spacing:-1.3px}.dcc-cl-head p{margin:6px 0 0;color:#939aa5;font-size:14px}.dcc-cl-new{border:1px solid #f0c96b;border-radius:15px;padding:12px 16px;background:linear-gradient(135deg,#f0c96b,#d9aa4a);color:#090909;font-weight:800;font-size:12px;white-space:nowrap}
      .dcc-cl-tools{display:block;width:100%}.dcc-cl-search{height:58px;width:100%;display:flex;align-items:center;gap:12px;padding:0 17px;border:1px solid rgba(217,170,74,.5);border-radius:18px;background:radial-gradient(circle at 88% 45%,rgba(217,170,74,.08),transparent 28%),linear-gradient(145deg,#0e1318,#080b0e);color:#dce1e8;box-shadow:inset 0 1px 0 rgba(255,255,255,.025),0 10px 28px rgba(0,0,0,.2)}.dcc-cl-search:focus-within{border-color:${GOLD2};box-shadow:0 0 0 3px rgba(217,170,74,.09),0 10px 30px rgba(0,0,0,.25)}.dcc-cl-search-icon{width:21px;height:21px;flex:none;color:#cfd5dc}
      #coach-main.dcc-premium-clients .dcc-cl-search input{width:100%!important;height:56px!important;min-height:0!important;margin:0!important;padding:0!important;border:0!important;border-radius:0!important;outline:0!important;background:transparent!important;box-shadow:none!important;color:#f7f7f5!important;font-size:16px!important;font-weight:650!important;line-height:56px!important;-webkit-appearance:none!important;appearance:none!important}
      #coach-main.dcc-premium-clients .dcc-cl-search input::placeholder{color:#89919c!important;opacity:1!important;font-size:16px!important;font-weight:650!important}
      .dcc-cl-subtools{display:flex;justify-content:space-between;align-items:center;gap:10px;margin:12px 0 14px}.dcc-cl-tabs{display:flex;min-width:0;border:1px solid #292f36;border-radius:22px;overflow:hidden;background:#090c0f}.dcc-cl-tab{padding:9px 17px;border:0;background:none;color:#9aa1ac;font-size:11px;white-space:nowrap}.dcc-cl-tab.active{border:1px solid ${GOLD2};border-radius:21px;background:radial-gradient(circle at 50% 50%,#d9aa4a35,#15100a);color:${GOLD2};box-shadow:0 0 18px #d9aa4a28}
      .dcc-cl-pending{padding:9px 17px;border:0;background:none;color:#9aa1ac;font-size:11px;white-space:nowrap}.dcc-cl-pending:active{color:${GOLD2}}
      .dcc-cl-order{height:44px;min-width:104px;padding:0 13px;border:1px solid rgba(240,201,107,.58);border-radius:15px;background:radial-gradient(circle at 78% 22%,rgba(217,170,74,.18),transparent 46%),linear-gradient(145deg,#171910,#090c0e);color:#f6f2e9;display:flex;align-items:center;justify-content:center;gap:8px;font-size:11px;font-weight:800;letter-spacing:.25px;box-shadow:inset 0 1px 0 rgba(255,255,255,.04),0 8px 22px rgba(0,0,0,.25)}.dcc-cl-order:active{transform:scale(.97)}.dcc-cl-order svg{width:16px;height:16px;flex:none;color:${GOLD2}}.dcc-cl-order-state{display:inline-flex;align-items:center;justify-content:center;min-width:42px;padding:5px 7px;border:1px solid rgba(240,201,107,.25);border-radius:9px;background:rgba(217,170,74,.08);color:${GOLD2};font-size:10px}
      .dcc-cl-list{display:grid;gap:9px}.dcc-cl-card{display:grid;grid-template-columns:minmax(0,1fr) minmax(135px,.85fr) 112px;align-items:center;gap:13px;min-height:104px;padding:14px 15px;border:1px solid rgba(217,170,74,.68);border-radius:17px;background:radial-gradient(ellipse at 86% 35%,rgba(217,170,74,.10),transparent 23%),linear-gradient(120deg,#0c1014,#080b0e);box-shadow:0 10px 26px #0005}.dcc-cl-card.dcc-hidden{display:none!important}.dcc-cl-info{min-width:0}.dcc-cl-name{font-size:17px;font-weight:800;color:#f5f3ef}.dcc-cl-goal{margin-top:6px;color:${GOLD2};font-size:12px}.dcc-cl-weight{margin-top:4px;color:#a4abb5;font-size:12px}.dcc-cl-training{padding-left:14px;border-left:1px solid #343a42}.dcc-cl-tr-title{display:flex;align-items:center;gap:7px;color:#f1f1ef;font-size:10px}.dcc-cl-dumbbell{color:${GOLD2};font-size:18px}.dcc-cl-progress{display:flex;align-items:center;gap:8px;margin-top:8px}.dcc-cl-track{height:6px;flex:1;border-radius:8px;background:#2a3037;overflow:hidden}.dcc-cl-fill{height:100%;border-radius:8px;background:linear-gradient(90deg,#d9aa4a,#f0c96b)}.dcc-cl-pct{font-size:11px}.dcc-cl-manage{min-height:48px;border:1px solid ${GOLD2};border-radius:13px;background:linear-gradient(145deg,#18140c,#0a0b0c);color:${GOLD2};font-size:11px;font-weight:800;line-height:1.25}.dcc-cl-empty-filter{display:none;padding:30px 18px;border:1px solid rgba(217,170,74,.28);border-radius:17px;background:linear-gradient(145deg,#101419,#090c0f);text-align:center;color:#9ba2ad;font-size:13px}.dcc-cl-empty-filter.show{display:block}.dcc-cl-empty-filter strong{display:block;margin-bottom:5px;color:${GOLD2};font-size:14px}
      #coach .side{height:62px!important;left:14px!important;right:14px!important;bottom:10px!important;border-radius:21px!important;padding:0 7px!important}#coach-nav{display:grid!important;grid-template-columns:repeat(5,minmax(0,1fr))!important;gap:0!important;height:100%!important}#coach-nav button{height:100%!important;padding:5px 2px!important;font-size:8px!important}#coach-nav button svg{width:21px!important;height:21px!important}#coach-nav button span{font-size:7.3px!important;margin-top:2px!important}
      @media(max-width:600px){.dcc-cl-head h1{font-size:31px}.dcc-cl-head p{font-size:12px}.dcc-cl-new{padding:11px 13px}.dcc-cl-search{height:56px}.dcc-cl-subtools{gap:8px}.dcc-cl-tabs{flex:1}.dcc-cl-tab,.dcc-cl-pending{flex:1;padding:8px 10px;font-size:10px}.dcc-cl-order{min-width:95px;height:42px;padding:0 10px}.dcc-cl-card{grid-template-columns:minmax(0,1fr) minmax(108px,.8fr) 88px;gap:9px;padding:12px 11px;min-height:94px}.dcc-cl-name{font-size:15px}.dcc-cl-goal,.dcc-cl-weight{font-size:10.5px}.dcc-cl-training{padding-left:9px}.dcc-cl-manage{font-size:9.5px;padding:5px}}
    `;
    document.head.appendChild(s);
  }

  function daysSince(v){if(!v)return null;const d=new Date(v);return Number.isFinite(d.getTime())?Math.floor((Date.now()-d.getTime())/86400000):null}
  function latestWorkout(id){const h=data?.workoutHistory?.[id]||[];return h.slice().sort((a,b)=>new Date(b.date)-new Date(a.date))[0]||null}
  function hasRoutine(id){return Array.isArray(data?.routines?.[id])&&data.routines[id].length>0}
  function pendingCheck(c){const x=data?.checkins?.[c.id];if(!x)return c?.status==="Pendiente";if(x.reviewed===true)return false;return !!(x.sentAt||x.updatedAt||x.diet||x.training||x.comment||c?.status==="Pendiente")}
  function trainingProgress(c){const r=data?.routines?.[c.id];if(!Array.isArray(r)||!r.length)return 0;const h=data?.workoutHistory?.[c.id]||[];if(!h.length)return 0;const recent=h.filter(x=>{const d=daysSince(x.date);return d!==null&&d<=30}).length;return Math.min(100,Math.round(recent/Math.max(1,r.length*4)*100))}
  function taskRow(i){return `<button class="dcc-pd-row" onclick="${i.action}"><span class="dcc-pd-icon">${i.icon}</span><span class="dcc-pd-copy"><b>${esc(i.title)}</b><span>${esc(i.text)}</span></span><span class="dcc-pd-badge">${esc(i.badge)}</span><span class="dcc-pd-arrow">›</span></button>`}

  function renderDashboard(){
    injectCss();const main=document.getElementById("coach-main");if(!main)return;main.className="dcc-premium-dashboard";const cs=data?.clients||[],tasks=[],attention=[];
    cs.forEach(c=>{if(pendingCheck(c))tasks.push({icon:"✓",title:"REVISAR CHECK-IN",text:c.name,badge:"HOY",action:`reviewCheckin('${c.id}')`});if(!hasRoutine(c.id))tasks.push({icon:"⌁",title:"ASIGNAR RUTINA",text:c.name,badge:"PENDIENTE",action:`openClient('${c.id}')`});const g=daysSince(latestWorkout(c.id)?.date);if(g!==null&&g>=7)attention.push({icon:"!",title:c.name,text:`${g} DÍAS SIN REGISTRAR ENTRENAMIENTO`,badge:"SEGUIMIENTO",action:`openClient('${c.id}')`})});
    const hr=new Date().getHours(),g=hr<13?"BUENOS DÍAS":hr<20?"BUENAS TARDES":"BUENAS NOCHES";
    main.innerHTML=`<div class="dcc-pd"><section class="dcc-pd-hero"><div class="dcc-pd-brand"><img src="./dc-stride-logo.svg.svg"><div><div class="dcc-pd-brand-name">DANIEL CAMPINS</div><div class="dcc-pd-brand-sub">TRAINING PLATFORM</div></div></div><h1 class="dcc-pd-title">${g},<span>DANIEL</span></h1></section><div class="dcc-pd-strip"><div class="dcc-pd-stat"><strong>${cs.length}</strong><span>CLIENTES</span></div><div class="dcc-pd-stat"><strong>${cs.filter(pendingCheck).length}</strong><span>CHECK-IN PENDIENTES</span></div><div class="dcc-pd-stat"><strong>0</strong><span>RUTINAS POR RENOVAR</span></div><div class="dcc-pd-stat"><strong>0</strong><span>DIETAS POR RENOVAR</span></div></div><section class="dcc-pd-section"><div class="dcc-pd-section-kicker">TAREAS PENDIENTES</div><div class="dcc-pd-section-sub">ACCIONES QUE REQUIEREN TU ATENCIÓN</div>${tasks.length?tasks.slice(0,6).map(taskRow).join(""):`<div class="dcc-pd-empty-ok"><div class="dcc-ok-icon">✓</div><b>TODO AL DÍA</b></div>`}</section><section class="dcc-pd-section"><div class="dcc-pd-section-kicker">REQUIEREN ATENCIÓN</div><div class="dcc-pd-section-sub">SEÑALES DE SEGUIMIENTO DETECTADAS AUTOMÁTICAMENTE</div>${attention.length?attention.slice(0,6).map(taskRow).join(""):'<div class="dcc-pd-empty-ok">SIN ALERTAS DE SEGUIMIENTO</div>'}</section><section class="dcc-pd-banner"><span class="dcc-pd-trophy">♛</span><div><small>CADA CLIENTE ES UN PROCESO.</small><strong>TÚ MARCAS LA DIFERENCIA.</strong></div></section></div>`;
  }

  function clientCard(c){const p=trainingProgress(c),goal=c.goal||c.objective||c.objetivo||"Objetivo por definir",weight=c.weight||c.peso||"";return `<article class="dcc-cl-card" data-name="${esc(c.name)}"><div class="dcc-cl-info"><div class="dcc-cl-name">${esc(c.name)}</div><div class="dcc-cl-goal">${esc(goal)}</div>${weight?`<div class="dcc-cl-weight">${esc(weight)} kg</div>`:""}</div><div class="dcc-cl-training"><div class="dcc-cl-tr-title"><span class="dcc-cl-dumbbell">⌁</span> Entrenamiento</div><div class="dcc-cl-progress"><div class="dcc-cl-track"><div class="dcc-cl-fill" style="width:${p}%"></div></div><span class="dcc-cl-pct">${p}%</span></div></div><button class="dcc-cl-manage" onclick="openClient('${c.id}')">Gestionar<br>cliente</button></article>`}
  function sortClientsArray(cs,mode){return cs.slice().sort((a,b)=>mode==="za"?String(b?.name||"").localeCompare(String(a?.name||""),"es",{sensitivity:"base"}):String(a?.name||"").localeCompare(String(b?.name||""),"es",{sensitivity:"base"}))}

  function renderClients(){
    injectCss();const main=document.getElementById("coach-main");if(!main)return;main.className="dcc-premium-clients";window.__dccClientSort=window.__dccClientSort||"az";const cs=sortClientsArray(data?.clients||[],window.__dccClientSort);const state=window.__dccClientSort==="az"?"A → Z":"Z → A";
    main.innerHTML=`<div class="dcc-cl"><header class="dcc-cl-head"><div><h1>Clientes</h1><p>Gestiona el proceso de cada persona.</p></div><button class="dcc-cl-new" onclick="newClient()">＋ Nuevo cliente</button></header><div class="dcc-cl-tools"><label class="dcc-cl-search"><svg class="dcc-cl-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4 4"/></svg><input id="dccClientSearch" type="search" autocomplete="off" placeholder="Buscar cliente..." aria-label="Buscar cliente"></label></div><div class="dcc-cl-subtools"><div class="dcc-cl-tabs"><button class="dcc-cl-tab active" type="button">Todos</button><button class="dcc-cl-pending" type="button" onclick="showCoach('checkins')">Pendientes por revisar</button></div><button class="dcc-cl-order" type="button" onclick="window.dccSortClients()" aria-label="Ordenar clientes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 7h10M5 12h7M5 17h4"/><path d="M18 6v12M15.5 15.5 18 18l2.5-2.5"/></svg><span>Orden</span><span class="dcc-cl-order-state">${state}</span></button></div><div class="dcc-cl-list" id="dccClientList">${cs.map(clientCard).join("")||'<div class="dcc-cl-empty">Todavía no hay clientes.</div>'}</div><div class="dcc-cl-empty-filter" id="dccClientEmptyFilter"><strong>Sin resultados</strong><span>No hay clientes con ese nombre.</span></div></div>`;
    const search=document.getElementById("dccClientSearch");if(search)search.addEventListener("input",window.dccFilterClients,{passive:true});window.dccFilterClients();
  }

  window.dccFilterClients=function(){const q=norm(document.getElementById("dccClientSearch")?.value||"");let visible=0;document.querySelectorAll("#dccClientList .dcc-cl-card").forEach(card=>{const show=!q||norm(card.dataset.name).includes(q);card.classList.toggle("dcc-hidden",!show);if(show)visible++});const empty=document.getElementById("dccClientEmptyFilter");if(empty)empty.classList.toggle("show",visible===0&&document.querySelectorAll("#dccClientList .dcc-cl-card").length>0)};
  window.dccSortClients=function(){const list=document.getElementById("dccClientList");if(!list)return;window.__dccClientSort=window.__dccClientSort==="az"?"za":"az";[...list.querySelectorAll(".dcc-cl-card")].sort((a,b)=>window.__dccClientSort==="az"?norm(a.dataset.name).localeCompare(norm(b.dataset.name),"es"):norm(b.dataset.name).localeCompare(norm(a.dataset.name),"es")).forEach(card=>list.appendChild(card));const state=document.querySelector(".dcc-cl-order-state");if(state)state.textContent=window.__dccClientSort==="az"?"A → Z":"Z → A";window.dccFilterClients()};

  function svg(i){return {panel:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/></svg>',clients:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3.5 20c.5-4 2.3-6 5.5-6s5 2 5.5 6"/></svg>',calendar:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16"/></svg>',check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="5" y="4" width="14" height="17" rx="2"/><path d="M8 11l2 2 5-5M8 17h7"/></svg>',msg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.7 8.7 0 0 1-4-.9L4 20l1.4-3.4A7.3 7.3 0 0 1 4 11.5 7.5 7.5 0 0 1 12 4a7.5 7.5 0 0 1 8 7.5Z"/></svg>'}[i]||""}
  function navHtml(){return `<button onclick="showCoach('dashboard')">${svg("panel")}<span>Panel</span></button><button onclick="showCoach('clients')">${svg("clients")}<span>Clientes</span></button><button onclick="toast('Calendario próximamente')">${svg("calendar")}<span>Calendario</span></button><button onclick="showCoach('checkins')">${svg("check")}<span>Check-in</span></button><button onclick="showCoach('messages')">${svg("msg")}<span>Mensajes</span></button>`}
  function enforceNav(){const n=document.getElementById("coach-nav");if(!n)return;const wanted=["Panel","Clientes","Calendario","Check-in","Mensajes"],labels=[...n.querySelectorAll("button span")].map(x=>x.textContent.trim());if(labels.length!==5||wanted.some((x,i)=>labels[i]!==x))n.innerHTML=navHtml();n.style.setProperty("grid-template-columns","repeat(5,minmax(0,1fr))","important")}
  function active(screen){const n=document.getElementById("coach-nav");if(!n)return;const map={dashboard:0,clients:1,checkins:3,messages:4};n.querySelectorAll("button").forEach(x=>x.classList.remove("active"));const i=map[screen];if(i!==undefined)n.querySelectorAll("button")[i]?.classList.add("active")}
  function lockNav(){enforceNav();const n=document.getElementById("coach-nav");if(n&&!n.__dccLocked){n.__dccLocked=true;new MutationObserver(()=>enforceNav()).observe(n,{childList:true,subtree:true})}if(typeof window.buildCoachNav==="function"&&!window.buildCoachNav.__dccLocked){const old=window.buildCoachNav,wrapped=function(){const r=old.apply(this,arguments);enforceNav();return r};wrapped.__dccLocked=true;window.buildCoachNav=wrapped}}
  function install(){injectCss();lockNav();let original=window.showCoach;if(typeof original!=="function")return;if(original.__dccPremiumV7)return;if(original.__original)original=original.__original;const wrapped=function(screen){if(screen==="dashboard"){window.currentScreen=screen;renderDashboard();enforceNav();active(screen);return}if(screen==="clients"){window.currentScreen=screen;renderClients();enforceNav();active(screen);return}const main=document.getElementById("coach-main");if(main)main.classList.remove("dcc-premium-dashboard","dcc-premium-clients");const r=original.apply(this,arguments);setTimeout(()=>{enforceNav();active(screen)},0);return r};wrapped.__dccPremiumV7=true;wrapped.__original=original;window.showCoach=wrapped;setInterval(enforceNav,500)}
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",()=>setTimeout(install,0));else setTimeout(install,0);window.addEventListener("load",()=>setTimeout(install,50));
})();

/* DCC CLIENT CONTROLS HOTFIX V8 */
(function(){
  const STYLE_ID='dcc-client-controls-hotfix-v8';
  const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('es').trim();
  let order='az';

  function css(){
    document.getElementById(STYLE_ID)?.remove();
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      #coach-main.dcc-premium-clients .dcc-cl-search{height:58px!important;padding:0 17px!important;border:1px solid rgba(217,170,74,.58)!important;border-radius:18px!important}
      #coach-main.dcc-premium-clients #dccClientSearch{display:block!important;flex:1 1 auto!important;width:100%!important;height:56px!important;min-height:56px!important;margin:0!important;padding:0!important;border:0!important;outline:0!important;background:transparent!important;box-shadow:none!important;color:#f7f7f5!important;font-size:16px!important;font-weight:650!important;line-height:56px!important;pointer-events:auto!important;-webkit-appearance:none!important;appearance:none!important}
      #coach-main.dcc-premium-clients #dccClientSearch::placeholder{color:#929aa5!important;opacity:1!important;font-size:16px!important;font-weight:650!important}
      #coach-main.dcc-premium-clients .dcc-cl-subtools{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:8px!important;margin:12px 0 14px!important}
      .dcc-client-hotfix-left{display:flex;align-items:center;gap:6px;min-width:0;flex:1}
      .dcc-client-all-v8,.dcc-client-pending-v8{height:43px;border-radius:999px;white-space:nowrap;font-size:10.5px}
      .dcc-client-all-v8{padding:0 16px;border:1px solid #f0c96b;background:radial-gradient(circle,#d9aa4a32,#15100a);color:#f0c96b;box-shadow:0 0 16px #d9aa4a22}
      .dcc-client-pending-v8{display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:0 14px;border:1px solid rgba(217,170,74,.52);background:linear-gradient(145deg,#11151a,#090c0f);color:#d9dde2;font-weight:750;box-shadow:inset 0 1px 0 rgba(255,255,255,.03)}
      .dcc-client-pending-v8 .go{font-size:18px;color:#f0c96b;line-height:1;transform:translateY(-1px)}
      .dcc-client-pending-v8:active{transform:scale(.97);border-color:#f0c96b;color:#f0c96b;background:#17130b}
      .dcc-client-sort-v8{height:48px;min-width:74px;flex:none;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;padding:0 10px;border:1px solid rgba(240,201,107,.78);border-radius:16px;background:linear-gradient(145deg,#1a160e,#0a0c0e);box-shadow:inset 0 1px 0 rgba(255,255,255,.04),0 8px 22px rgba(0,0,0,.25);color:#f0c96b}
      .dcc-client-sort-v8 small{font-size:6.8px;letter-spacing:1.2px;color:#8e96a0;font-weight:850}
      .dcc-client-sort-v8 strong{font-size:12px;letter-spacing:.45px;color:#f0c96b;font-weight:900}
      .dcc-client-sort-v8:active{transform:scale(.95);background:#20180c}
      @media(max-width:600px){.dcc-client-all-v8{padding:0 12px}.dcc-client-pending-v8{padding:0 11px;font-size:9.7px}.dcc-client-sort-v8{min-width:70px;padding:0 8px}}
    `;
    document.head.appendChild(s);
  }

  function cards(){return [...document.querySelectorAll('#dccClientList .dcc-cl-card')]}
  function filter(){
    const input=document.getElementById('dccClientSearch');
    const q=norm(input?.value||'');
    let visible=0;
    const list=cards();
    list.forEach(card=>{
      const name=norm(card.dataset.name||card.querySelector('.dcc-cl-name')?.textContent||'');
      const show=!q||name.includes(q);
      card.classList.toggle('dcc-hidden',!show);
      if(show)visible++;
    });
    const empty=document.getElementById('dccClientEmptyFilter');
    if(empty){
      empty.classList.toggle('show',list.length>0&&visible===0);
      const span=empty.querySelector('span');
      if(span)span.textContent='No hay clientes con ese nombre.';
    }
  }

  function sortNow(){
    const list=document.getElementById('dccClientList');
    if(!list)return;
    const arr=cards();
    arr.sort((a,b)=>{
      const an=norm(a.dataset.name||a.querySelector('.dcc-cl-name')?.textContent||'');
      const bn=norm(b.dataset.name||b.querySelector('.dcc-cl-name')?.textContent||'');
      return order==='az'?an.localeCompare(bn,'es'):bn.localeCompare(an,'es');
    }).forEach(card=>list.appendChild(card));
    const value=document.querySelector('#dccClientSortV8 strong');
    if(value)value.textContent=order==='az'?'A—Z':'Z—A';
    filter();
  }

  function enhance(baseShowCoach){
    if(!document.getElementById('dccClientList'))return;
    css();

    const search=document.getElementById('dccClientSearch');
    if(search){
      const fresh=search.cloneNode(true);
      search.replaceWith(fresh);
      ['input','keyup','search','change'].forEach(type=>fresh.addEventListener(type,filter));
    }

    const tools=document.querySelector('#coach-main.dcc-premium-clients .dcc-cl-subtools');
    if(tools){
      tools.innerHTML=`<div class="dcc-client-hotfix-left"><button class="dcc-client-all-v8" type="button">Todos</button><button class="dcc-client-pending-v8" id="dccPendingV8" type="button"><span>Pendientes por revisar</span><span class="go">›</span></button></div><button class="dcc-client-sort-v8" id="dccClientSortV8" type="button"><small>ORDEN</small><strong>A—Z</strong></button>`;
      document.getElementById('dccPendingV8')?.addEventListener('click',e=>{
        e.preventDefault();
        e.stopPropagation();
        baseShowCoach('checkins');
      });
      document.getElementById('dccClientSortV8')?.addEventListener('click',e=>{
        e.preventDefault();
        e.stopPropagation();
        order=order==='az'?'za':'az';
        sortNow();
      });
    }
    order='az';
    sortNow();
    filter();
  }

  function install(){
    const base=window.showCoach;
    if(typeof base!=='function'||base.__dccClientHotfixV8)return;
    const wrapped=function(screen){
      const r=base.apply(this,arguments);
      if(screen==='clients')setTimeout(()=>enhance(base),20);
      return r;
    };
    wrapped.__dccClientHotfixV8=true;
    wrapped.__original=base.__original||base;
    window.showCoach=wrapped;
    if(window.currentScreen==='clients')setTimeout(()=>enhance(base),40);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(install,80));
  else setTimeout(install,80);
  window.addEventListener('load',()=>setTimeout(install,120));
})();

