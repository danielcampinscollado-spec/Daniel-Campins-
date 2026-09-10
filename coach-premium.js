/* DCC — Panel + Clientes premium + navegación global fija */
(function(){
  'use strict';

  const GOLD="#d9aa4a", GOLD2="#f0c96b";
  const esc=v=>String(v??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  const appData=()=>{try{return data||{}}catch(e){return window.data||{}}};

  function injectCss(){
    const old=document.getElementById("dcc-premium-v5");
    if(old) old.remove();

    const s=document.createElement("style");
    s.id="dcc-premium-v5";
    s.textContent=`
      #coach-main.dcc-premium-dashboard,
      #coach-main.dcc-premium-clients{
        background:
          radial-gradient(circle at 88% 0%,rgba(217,170,74,.05),transparent 25%),
          #07090c!important;
        padding:8px 12px 88px!important;
        color:#f6f3ed!important;
        overflow-anchor:none!important;
      }

      .dcc-pd,.dcc-cl{max-width:980px;margin:auto}
      .dcc-pd *,.dcc-cl *{box-sizing:border-box}

      /* =========================
         PANEL — HERO SIN LOGO
      ========================= */
      .dcc-pd-hero{
        position:relative;
        overflow:hidden;
        min-height:148px;
        padding:18px 18px 17px;
        border:1px solid rgba(217,170,74,.48);
        border-radius:22px;
        background:
          radial-gradient(circle at 86% 13%,rgba(240,201,107,.13),transparent 25%),
          radial-gradient(circle at 15% 100%,rgba(217,170,74,.035),transparent 30%),
          linear-gradient(145deg,#151a20 0%,#0c1015 58%,#080b0e 100%);
        box-shadow:
          0 15px 34px rgba(0,0,0,.28),
          inset 0 1px 0 rgba(255,255,255,.035);
      }
      .dcc-pd-hero::before{
        content:"";
        position:absolute;
        right:-52px;
        top:-82px;
        width:245px;
        height:220px;
        border-radius:50%;
        background:radial-gradient(circle,rgba(240,201,107,.10),transparent 67%);
        pointer-events:none;
      }
      .dcc-pd-hero::after{
        content:"";
        position:absolute;
        right:-6px;
        top:7px;
        width:205px;
        height:100px;
        opacity:.44;
        background-image:url("data:image/svg+xml,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%20320%20120'%3E%3Cg%20fill%3D'none'%20stroke%3D'%23efbd54'%20stroke-linecap%3D'round'%3E%3Cpath%20d%3D'M5%20114%20C86%20106%20143%2088%20193%2064%20C238%2042%20264%2023%20323%202'%20stroke-width%3D'1'%20opacity%3D'.65'%2F%3E%3Cpath%20d%3D'M0%20105%20C82%2098%20140%2081%20190%2058%20C236%2036%20265%2018%20324%20-2'%20stroke-width%3D'.55'%20opacity%3D'.34'%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E");
        background-repeat:no-repeat;
        background-position:right top;
        background-size:100% 100%;
        pointer-events:none;
      }
      .dcc-pd-eyebrow{
        position:relative;
        z-index:1;
        color:${GOLD2};
        font-size:9px;
        line-height:1.2;
        font-weight:850;
        letter-spacing:3px;
        text-transform:uppercase;
      }
      .dcc-pd-greeting{
        position:relative;
        z-index:1;
        margin-top:24px;
        color:#f5f3ee;
        font-size:28px;
        line-height:1.02;
        font-weight:480;
        letter-spacing:-.75px;
      }
      .dcc-pd-greeting strong{
        display:block;
        margin-top:5px;
        color:${GOLD2};
        font-size:30px;
        font-weight:760;
        letter-spacing:-.8px;
      }
      .dcc-pd-greeting::after{
        content:"";
        display:block;
        width:34px;
        height:1.5px;
        margin-top:13px;
        border-radius:999px;
        background:linear-gradient(90deg,${GOLD2},rgba(217,170,74,.18));
      }
      .dcc-pd-hero-note{
        position:absolute;
        z-index:1;
        right:18px;
        bottom:18px;
        max-width:120px;
        color:#7f8791;
        font-size:7px;
        line-height:1.65;
        font-weight:600;
        letter-spacing:1.7px;
        text-align:right;
        text-transform:uppercase;
      }

      /* =========================
         MÉTRICAS
      ========================= */
      .dcc-pd-strip{
        display:grid;
        grid-template-columns:repeat(4,minmax(0,1fr));
        gap:7px;
        margin:9px 0 11px;
        border:0;
        background:none;
        overflow:visible;
      }
      .dcc-pd-stat{
        min-height:78px;
        padding:12px 10px 10px;
        border:1px solid rgba(217,170,74,.30);
        border-radius:17px;
        background:
          radial-gradient(circle at 100% 0,rgba(217,170,74,.055),transparent 40%),
          linear-gradient(145deg,#12171c,#090d10);
        box-shadow:0 9px 23px rgba(0,0,0,.18),inset 0 1px 0 rgba(255,255,255,.025);
      }
      .dcc-pd-stat strong{
        display:block;
        color:#f8f6f1;
        font-size:23px;
        line-height:1;
        font-weight:690;
        letter-spacing:-.55px;
      }
      .dcc-pd-stat span{
        display:block;
        margin-top:10px;
        color:#9ca4ae;
        font-size:6.7px;
        line-height:1.24;
        font-weight:650;
        letter-spacing:.8px;
        text-transform:uppercase;
      }

      /* =========================
         SECCIONES DEL PANEL
      ========================= */
      .dcc-pd-section{
        margin-top:11px;
        padding:14px 15px;
        border:1px solid rgba(217,170,74,.38);
        border-radius:20px;
        background:
          radial-gradient(circle at 100% 0,rgba(217,170,74,.055),transparent 34%),
          linear-gradient(145deg,#13181d,#090d10);
        box-shadow:0 12px 28px rgba(0,0,0,.22),inset 0 1px 0 rgba(255,255,255,.025);
      }
      .dcc-pd-section-kicker{
        color:${GOLD2};
        font-size:9px;
        font-weight:850;
        letter-spacing:2.65px;
        text-transform:uppercase;
      }
      .dcc-pd-section-sub{
        margin-top:5px;
        color:#858e99;
        font-size:8.8px;
        line-height:1.35;
      }
      .dcc-pd-row{
        width:100%;
        min-height:58px;
        display:flex;
        align-items:center;
        gap:10px;
        padding:10px 0;
        border:0;
        border-top:1px solid rgba(255,255,255,.075);
        background:none;
        color:#f5f2ec;
        text-align:left;
        transition:none!important;
        transform:none!important;
      }
      .dcc-pd-row:first-of-type{margin-top:8px}
      .dcc-pd-icon{
        width:37px;
        height:37px;
        flex:0 0 37px;
        display:grid;
        place-items:center;
        border:1px solid rgba(217,170,74,.32);
        border-radius:11px;
        background:linear-gradient(145deg,rgba(217,170,74,.07),rgba(9,12,15,.88));
        color:${GOLD2};
        font-size:17px;
      }
      .dcc-pd-copy{flex:1;min-width:0}
      .dcc-pd-copy b{display:block;color:#f4f2ed;font-size:12px;font-weight:720}
      .dcc-pd-copy span{display:block;margin-top:4px;color:#8f98a3;font-size:9px}
      .dcc-pd-badge{
        padding:6px 8px;
        border:1px solid rgba(217,170,74,.27);
        border-radius:10px;
        background:rgba(217,170,74,.025);
        color:${GOLD2};
        font-size:7px;
        font-weight:850;
        white-space:nowrap;
      }
      .dcc-pd-arrow{color:${GOLD2};font-size:18px}
      .dcc-pd-empty-ok{padding:17px 8px 9px;text-align:center;color:#9aa2ad;font-size:10px}
      .dcc-ok-icon{
        width:34px;
        height:34px;
        margin:0 auto 8px;
        display:grid;
        place-items:center;
        border:1px solid rgba(240,201,107,.55);
        border-radius:50%;
        color:${GOLD2};
      }

      .dcc-pd-banner{
        position:relative;
        overflow:hidden;
        min-height:72px;
        margin-top:11px;
        padding:14px 15px;
        border:1px solid rgba(217,170,74,.34);
        border-radius:20px;
        background:
          radial-gradient(circle at 92% 20%,rgba(240,201,107,.10),transparent 28%),
          linear-gradient(145deg,#13171b,#090c0f);
        box-shadow:0 11px 25px rgba(0,0,0,.2);
      }
      .dcc-pd-banner::after{
        content:"";
        position:absolute;
        right:-28px;
        top:-42px;
        width:120px;
        height:145px;
        transform:rotate(28deg);
        background:linear-gradient(90deg,transparent,rgba(240,201,107,.065),transparent);
        pointer-events:none;
      }
      .dcc-pd-banner small{
        display:block;
        color:#c99a42;
        font-size:7px;
        font-weight:700;
        letter-spacing:2.2px;
        text-transform:uppercase;
      }
      .dcc-pd-banner strong{
        display:block;
        margin-top:7px;
        color:#f3f1ec;
        font-family:"Avenir Next","Helvetica Neue",-apple-system,BlinkMacSystemFont,Arial,sans-serif;
        font-size:15px;
        line-height:1.1;
        font-weight:560;
        letter-spacing:-.15px;
      }

      /* =========================
         CLIENTES — conservar funcionalidad
      ========================= */
      .dcc-cl{padding-top:14px}
      .dcc-cl-head{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;margin:6px 2px 20px}
      .dcc-cl-head h1{margin:0;font-size:34px;letter-spacing:-1.3px}
      .dcc-cl-head p{margin:6px 0 0;color:#939aa5;font-size:14px}
      .dcc-cl-new{border:1px solid #f0c96b;border-radius:15px;padding:12px 16px;background:linear-gradient(135deg,#f0c96b,#d9aa4a);color:#090909;font-weight:800;font-size:12px;white-space:nowrap}
      .dcc-cl-tools{display:grid;grid-template-columns:1fr 48px;gap:9px}
      .dcc-cl-search{height:48px;display:flex;align-items:center;gap:10px;padding:0 15px;border:1px solid #333942;border-radius:15px;background:linear-gradient(145deg,#0e1318,#080b0e);color:#8f97a3}
      .dcc-cl-search input{width:100%;border:0;outline:0;background:none;color:#f5f5f5;font:inherit}
      .dcc-cl-filter{border:1px solid #333942;border-radius:15px;background:#0d1115;color:#a9b0ba;font-size:19px}
      .dcc-cl-subtools{display:flex;justify-content:space-between;align-items:center;margin:11px 0 14px}
      .dcc-cl-tabs{display:flex;border:1px solid #292f36;border-radius:22px;overflow:hidden;background:#090c0f}
      .dcc-cl-tab{padding:9px 18px;border:0;background:none;color:#9aa1ac;font-size:11px}
      .dcc-cl-tab.active{border:1px solid ${GOLD2};border-radius:21px;background:radial-gradient(circle at 50% 50%,#d9aa4a35,#15100a);color:${GOLD2};box-shadow:0 0 18px #d9aa4a28}
      .dcc-cl-sort{padding:9px 13px;border:1px solid #343941;border-radius:15px;background:#0a0d10;color:#e8e8e8;font-size:11px}
      .dcc-cl-list{display:grid;gap:9px}
      .dcc-cl-card{display:grid;grid-template-columns:minmax(0,1fr) minmax(135px,.85fr) 112px;align-items:center;gap:13px;min-height:104px;padding:14px 15px;border:1px solid rgba(217,170,74,.68);border-radius:17px;background:radial-gradient(ellipse at 86% 35%,rgba(217,170,74,.10),transparent 23%),linear-gradient(120deg,#0c1014,#080b0e);box-shadow:0 10px 26px #0005}
      .dcc-cl-info{min-width:0}
      .dcc-cl-name{font-size:17px;font-weight:800;color:#f5f3ef}
      .dcc-cl-goal{margin-top:6px;color:${GOLD2};font-size:12px}
      .dcc-cl-weight{margin-top:4px;color:#a4abb5;font-size:12px}
      .dcc-cl-training{padding-left:14px;border-left:1px solid #343a42}
      .dcc-cl-tr-title{display:flex;align-items:center;gap:7px;color:#f1f1ef;font-size:10px}
      .dcc-cl-dumbbell{color:${GOLD2};font-size:18px}
      .dcc-cl-progress{display:flex;align-items:center;gap:8px;margin-top:8px}
      .dcc-cl-track{height:6px;flex:1;border-radius:8px;background:#2a3037;overflow:hidden}
      .dcc-cl-fill{height:100%;border-radius:8px;background:linear-gradient(90deg,#d9aa4a,#f0c96b)}
      .dcc-cl-pct{font-size:11px}
      .dcc-cl-manage{min-height:48px;border:1px solid ${GOLD2};border-radius:13px;background:linear-gradient(145deg,#18140c,#0a0b0c);color:${GOLD2};font-size:11px;font-weight:800;line-height:1.25}

      /* =========================
         NAVEGACIÓN ESTABLE
      ========================= */
      #coach .side{height:62px!important;left:14px!important;right:14px!important;bottom:10px!important;border-radius:21px!important;padding:0 7px!important}
      #coach-nav{display:grid!important;grid-template-columns:repeat(5,minmax(0,1fr))!important;gap:0!important;height:100%!important}
      #coach-nav button{height:100%!important;padding:5px 2px!important;font-size:8px!important;transform:none!important}
      #coach-nav button svg{width:21px!important;height:21px!important}
      #coach-nav button span{font-size:7.3px!important;margin-top:2px!important}

      @media(max-width:600px){
        .dcc-pd-hero{min-height:140px;padding:16px 15px}
        .dcc-pd-greeting{font-size:25px;margin-top:22px}
        .dcc-pd-greeting strong{font-size:27px}
        .dcc-pd-hero-note{right:15px;bottom:16px;font-size:6.4px}
        .dcc-pd-strip{gap:6px}
        .dcc-pd-stat{min-height:72px;padding:10px 7px 9px;border-radius:15px}
        .dcc-pd-stat strong{font-size:21px}
        .dcc-pd-stat span{font-size:6.2px;letter-spacing:.62px}
        .dcc-pd-section{padding:13px 14px;border-radius:18px}
        .dcc-pd-banner{border-radius:18px}

        .dcc-cl-head h1{font-size:31px}.dcc-cl-head p{font-size:12px}.dcc-cl-new{padding:11px 13px}
        .dcc-cl-card{grid-template-columns:minmax(0,1fr) minmax(108px,.8fr) 88px;gap:9px;padding:12px 11px;min-height:94px}
        .dcc-cl-name{font-size:15px}.dcc-cl-goal,.dcc-cl-weight{font-size:10.5px}.dcc-cl-training{padding-left:9px}.dcc-cl-manage{font-size:9.5px;padding:5px}.dcc-cl-tab{padding:8px 13px}
      }

      @media(max-width:360px){
        .dcc-pd-strip{grid-template-columns:repeat(2,minmax(0,1fr))}
        .dcc-pd-stat{min-height:64px}
      }
    `;
    document.head.appendChild(s);
  }

  function daysSince(v){
    if(!v)return null;
    const d=new Date(v);
    return Number.isFinite(d.getTime())?Math.floor((Date.now()-d.getTime())/86400000):null;
  }
  function latestWorkout(id){
    const h=appData()?.workoutHistory?.[id]||[];
    return h.slice().sort((a,b)=>new Date(b.date)-new Date(a.date))[0]||null;
  }
  function hasRoutine(id){return Array.isArray(appData()?.routines?.[id])&&appData().routines[id].length>0}
  function pendingCheck(c){const x=appData()?.checkins?.[c.id];return !!(x?.sentAt&&!x?.reviewed)}
  function trainingProgress(c){
    const d=appData();
    const r=d?.routines?.[c.id];
    if(!Array.isArray(r)||!r.length)return 0;
    const h=d?.workoutHistory?.[c.id]||[];
    if(!h.length)return 0;
    const recent=h.filter(x=>{const days=daysSince(x.date);return days!==null&&days<=30}).length;
    return Math.min(100,Math.round(recent/Math.max(1,r.length*4)*100));
  }

  function taskRow(i){
    return `<button class="dcc-pd-row" onclick="${i.action}"><span class="dcc-pd-icon">${i.icon}</span><span class="dcc-pd-copy"><b>${esc(i.title)}</b><span>${esc(i.text)}</span></span><span class="dcc-pd-badge">${esc(i.badge)}</span><span class="dcc-pd-arrow">›</span></button>`;
  }

  function renderDashboard(){
    injectCss();
    const main=document.getElementById("coach-main");
    if(!main)return;
    main.className="dcc-premium-dashboard";

    const cs=appData()?.clients||[],tasks=[],attention=[];
    cs.forEach(c=>{
      if(pendingCheck(c))tasks.push({icon:"✓",title:"REVISAR CHECK-IN",text:c.name,badge:"HOY",action:`reviewCheckin('${c.id}')`});
      if(!hasRoutine(c.id))tasks.push({icon:"＋",title:"ASIGNAR RUTINA",text:c.name,badge:"PENDIENTE",action:`openClient('${c.id}')`});
      const gap=daysSince(latestWorkout(c.id)?.date);
      if(gap!==null&&gap>=7)attention.push({icon:"!",title:c.name,text:`${gap} DÍAS SIN REGISTRAR ENTRENAMIENTO`,badge:"SEGUIMIENTO",action:`openClient('${c.id}')`});
    });

    const hr=new Date().getHours();
    const greeting=hr<13?"Buenos días":hr<20?"Buenas tardes":"Buenas noches";

    main.innerHTML=`
      <div class="dcc-pd">
        <section class="dcc-pd-hero">
          <div class="dcc-pd-eyebrow">PANEL DE CONTROL</div>
          <div class="dcc-pd-greeting">${greeting},<strong>Daniel</strong></div>
          <div class="dcc-pd-hero-note">CLIENTES · TAREAS<br>SEGUIMIENTO</div>
        </section>

        <div class="dcc-pd-strip">
          <div class="dcc-pd-stat"><strong>${cs.length}</strong><span>CLIENTES</span></div>
          <div class="dcc-pd-stat"><strong>${cs.filter(pendingCheck).length}</strong><span>CHECK-IN<br>PENDIENTES</span></div>
          <div class="dcc-pd-stat"><strong>0</strong><span>RUTINAS<br>POR RENOVAR</span></div>
          <div class="dcc-pd-stat"><strong>0</strong><span>DIETAS<br>POR RENOVAR</span></div>
        </div>

        <section class="dcc-pd-section">
          <div class="dcc-pd-section-kicker">TAREAS PENDIENTES</div>
          <div class="dcc-pd-section-sub">Acciones que requieren tu atención</div>
          ${tasks.length?tasks.slice(0,6).map(taskRow).join(""):`<div class="dcc-pd-empty-ok"><div class="dcc-ok-icon">✓</div><b>Todo al día</b></div>`}
        </section>

        <section class="dcc-pd-section">
          <div class="dcc-pd-section-kicker">REQUIEREN ATENCIÓN</div>
          <div class="dcc-pd-section-sub">Señales de seguimiento detectadas automáticamente</div>
          ${attention.length?attention.slice(0,6).map(taskRow).join(""):'<div class="dcc-pd-empty-ok">Sin alertas de seguimiento</div>'}
        </section>

        <section class="dcc-pd-banner">
          <small>CADA CLIENTE ES UN PROCESO.</small>
          <strong>Tú marcas la diferencia.</strong>
        </section>
      </div>`;
  }

  function clientCard(c){
    const p=trainingProgress(c),goal=c.goal||c.objective||c.objetivo||"Objetivo por definir",weight=c.weight||c.peso||"";
    return `<article class="dcc-cl-card" data-name="${esc(c.name).toLowerCase()}" data-pending="${pendingCheck(c)?"1":"0"}"><div class="dcc-cl-info"><div class="dcc-cl-name">${esc(c.name)}</div><div class="dcc-cl-goal">${esc(goal)}</div>${weight?`<div class="dcc-cl-weight">${esc(weight)} kg</div>`:""}</div><div class="dcc-cl-training"><div class="dcc-cl-tr-title"><span class="dcc-cl-dumbbell">⌁</span> Entrenamiento</div><div class="dcc-cl-progress"><div class="dcc-cl-track"><div class="dcc-cl-fill" style="width:${p}%"></div></div><span class="dcc-cl-pct">${p}%</span></div></div><button class="dcc-cl-manage" onclick="openClient('${c.id}')">Gestionar<br>cliente</button></article>`;
  }

  function renderClients(){
    injectCss();
    const main=document.getElementById("coach-main");
    if(!main)return;
    main.className="dcc-premium-clients";
    const cs=appData()?.clients||[];
    main.innerHTML=`<div class="dcc-cl"><header class="dcc-cl-head"><div><h1>Clientes</h1><p>Gestiona el proceso de cada persona.</p></div><button class="dcc-cl-new" onclick="newClient()">＋ Nuevo cliente</button></header><div class="dcc-cl-tools"><label class="dcc-cl-search">⌕<input id="dccClientSearch" placeholder="Buscar cliente..." oninput="window.dccFilterClients()"></label><button class="dcc-cl-filter" onclick="toast('Filtros próximamente')">▽</button></div><div class="dcc-cl-subtools"><div class="dcc-cl-tabs"><button class="dcc-cl-tab active" onclick="window.dccClientTab('all',this)">Todos</button><button class="dcc-cl-tab" onclick="window.dccClientTab('pending',this)">Pendientes por revisar</button></div><button class="dcc-cl-sort" onclick="window.dccSortClients()">↕ &nbsp; A-Z⌄</button></div><div class="dcc-cl-list" id="dccClientList">${cs.map(clientCard).join("")||'<div class="dcc-cl-empty">Todavía no hay clientes.</div>'}</div></div>`;
    window.__dccClientMode="all";
    window.__dccClientSort="az";
  }

  window.dccFilterClients=function(){
    const q=(document.getElementById("dccClientSearch")?.value||"").toLowerCase();
    document.querySelectorAll(".dcc-cl-card").forEach(x=>x.style.display=(x.dataset.name.includes(q)&&(window.__dccClientMode!=="pending"||x.dataset.pending==="1"))?"grid":"none");
  };
  window.dccClientTab=function(m,b){
    window.__dccClientMode=m;
    document.querySelectorAll(".dcc-cl-tab").forEach(x=>x.classList.remove("active"));
    b.classList.add("active");
    window.dccFilterClients();
  };
  window.dccSortClients=function(){
    const l=document.getElementById("dccClientList");if(!l)return;
    window.__dccClientSort=window.__dccClientSort==="az"?"za":"az";
    [...l.querySelectorAll(".dcc-cl-card")].sort((a,b)=>window.__dccClientSort==="az"?a.dataset.name.localeCompare(b.dataset.name):b.dataset.name.localeCompare(a.dataset.name)).forEach(x=>l.appendChild(x));
  };

  function svg(i){
    return {
      panel:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/></svg>',
      clients:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3.5 20c.5-4 2.3-6 5.5-6s5 2 5.5 6"/></svg>',
      calendar:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16"/></svg>',
      check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="5" y="4" width="14" height="17" rx="2"/><path d="M8 11l2 2 5-5M8 17h7"/></svg>',
      msg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.7 8.7 0 0 1-4-.9L4 20l1.4-3.4A7.3 7.3 0 0 1 4 11.5 7.5 7.5 0 0 1 12 4a7.5 7.5 0 0 1 8 7.5Z"/></svg>'
    }[i]||"";
  }

  function navHtml(){
    return `<button onclick="showCoach('dashboard')">${svg("panel")}<span>Panel</span></button><button onclick="showCoach('clients')">${svg("clients")}<span>Clientes</span></button><button onclick="toast('Calendario próximamente')">${svg("calendar")}<span>Calendario</span></button><button onclick="showCoach('checkins')">${svg("check")}<span>Check-in</span></button><button onclick="showCoach('messages')">${svg("msg")}<span>Mensajes</span></button>`;
  }

  function enforceNav(){
    const n=document.getElementById("coach-nav");
    if(!n)return;
    const wanted=["Panel","Clientes","Calendario","Check-in","Mensajes"];
    const labels=[...n.querySelectorAll("button span")].map(x=>x.textContent.trim());
    if(labels.length!==5||wanted.some((x,i)=>labels[i]!==x))n.innerHTML=navHtml();
    if(n.style.gridTemplateColumns!=="repeat(5, minmax(0px, 1fr))"){
      n.style.setProperty("grid-template-columns","repeat(5,minmax(0,1fr))","important");
    }
  }

  function active(screen){
    const n=document.getElementById("coach-nav");
    if(!n)return;
    const map={dashboard:0,clients:1,checkins:3,messages:4};
    const i=map[screen];
    n.querySelectorAll("button").forEach((x,idx)=>x.classList.toggle("active",idx===i));
  }

  function lockNav(){
    enforceNav();
    if(typeof window.buildCoachNav==="function"&&!window.buildCoachNav.__dccLocked){
      const old=window.buildCoachNav;
      const wrapped=function(){const r=old.apply(this,arguments);enforceNav();return r};
      wrapped.__dccLocked=true;
      window.buildCoachNav=wrapped;
    }
  }

  function stableRender(fn){
    const root=document.documentElement;
    const previous=root.style.scrollBehavior;
    root.style.scrollBehavior="auto";
    fn();
    requestAnimationFrame(()=>{root.style.scrollBehavior=previous});
  }

  function install(){
    injectCss();
    lockNav();

    const original=window.showCoach;
    if(typeof original!=="function"||original.__dccPremiumV6)return;

    const wrapped=function(screen){
      if(screen==="dashboard"){
        if(window.currentScreen!=="dashboard"||!document.querySelector("#coach-main .dcc-pd")){
          stableRender(renderDashboard);
        }
        window.currentScreen="dashboard";
        enforceNav();
        active("dashboard");
        return;
      }

      if(screen==="clients"){
        if(window.currentScreen!=="clients"||!document.querySelector("#coach-main .dcc-cl")){
          stableRender(renderClients);
        }
        window.currentScreen="clients";
        enforceNav();
        active("clients");
        return;
      }

      const main=document.getElementById("coach-main");
      if(main)main.classList.remove("dcc-premium-dashboard","dcc-premium-clients");
      const r=original.apply(this,arguments);
      requestAnimationFrame(()=>{enforceNav();active(screen)});
      return r;
    };

    wrapped.__dccPremiumV6=true;
    wrapped.__original=original;
    window.showCoach=wrapped;
  }

  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",install,{once:true});
  }else{
    install();
  }
})();
