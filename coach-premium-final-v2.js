/* DCC — acabado final premium de Panel + Clientes + navegación */
(function(){
  const GOLD='#d9aa4a', GOLD2='#f0c96b';
  const esc=v=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const getData=()=>{try{return data||{}}catch(e){return window.data||{}}};

  function injectCss(){
    if(document.getElementById('dcc-coach-final-v2-css'))return;
    const s=document.createElement('style');
    s.id='dcc-coach-final-v2-css';
    s.textContent=`
      html body #coach-main{
        background:
          radial-gradient(ellipse at 88% 4%,rgba(218,164,58,.095),transparent 24%),
          radial-gradient(ellipse at 9% 88%,rgba(217,170,74,.045),transparent 30%),
          linear-gradient(145deg,#080b0e 0%,#050709 46%,#020405 100%)!important;
      }
      html body #coach-main.dcc-final-dashboard,
      html body #coach-main.dcc-final-clients{
        min-height:100dvh!important;
        padding:12px 12px 92px!important;
        color:#f6f3ed!important;
      }
      .dcc-fd,.dcc-fcl{max-width:920px;margin:0 auto}.dcc-fd *,.dcc-fcl *{box-sizing:border-box}

      .dcc-fd-hero{position:relative;overflow:hidden;min-height:132px;padding:15px 16px;border:1px solid rgba(217,170,74,.68);border-radius:20px;background:linear-gradient(118deg,rgba(15,20,25,.98),rgba(8,11,14,.98) 62%,rgba(38,27,9,.88));box-shadow:inset 0 1px 0 rgba(255,255,255,.025),0 14px 32px rgba(0,0,0,.2)}
      .dcc-fd-hero:after{content:'';position:absolute;right:-34px;top:-64px;width:190px;height:190px;transform:rotate(35deg);background:linear-gradient(90deg,transparent,rgba(240,201,107,.13),transparent);pointer-events:none}
      .dcc-fd-brand{display:flex;align-items:center;gap:9px;position:relative;z-index:1}.dcc-fd-brand img{width:48px;height:auto}.dcc-fd-brand-name{color:${GOLD2};font-size:9px;font-weight:850;letter-spacing:3px}.dcc-fd-brand-sub{margin-top:3px;color:#7f8791;font-size:6.5px;letter-spacing:2.5px}
      .dcc-fd-greet{position:relative;z-index:1;margin-top:19px;font-size:24px;line-height:.98;font-weight:850;letter-spacing:-.7px}.dcc-fd-greet span{display:block;margin-top:4px;color:${GOLD2}}.dcc-fd-greet:after{content:'';display:block;width:42px;height:2px;margin-top:11px;border-radius:99px;background:linear-gradient(90deg,${GOLD2},#a87a28)}

      .dcc-fd-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));margin-top:9px;border:1px solid rgba(217,170,74,.6);border-radius:18px;overflow:hidden;background:linear-gradient(145deg,rgba(14,19,23,.98),rgba(7,10,12,.98))}
      .dcc-fd-stat{min-height:76px;padding:11px 8px;border-right:1px solid rgba(255,255,255,.11)}.dcc-fd-stat:last-child{border-right:0}.dcc-fd-stat b{display:block;font-size:24px;line-height:1;color:#f6f3ed}.dcc-fd-stat span{display:block;margin-top:10px;color:#b2b8c1;font-size:7px;line-height:1.25;letter-spacing:.75px;text-transform:uppercase}

      .dcc-fd-card{margin-top:9px;padding:14px 15px;border:1px solid rgba(217,170,74,.62);border-radius:18px;background:radial-gradient(circle at 94% 0,rgba(217,170,74,.08),transparent 30%),linear-gradient(145deg,#11161b,#080b0e);box-shadow:inset 0 1px 0 rgba(255,255,255,.025)}
      .dcc-fd-title{color:${GOLD2};font-size:10px;font-weight:900;letter-spacing:2.7px}.dcc-fd-sub{margin-top:5px;color:#939ba6;font-size:9px;letter-spacing:.35px}
      .dcc-fd-empty{text-align:center;padding:15px 8px 7px}.dcc-fd-check{width:39px;height:39px;margin:0 auto 8px;display:grid;place-items:center;border:1px solid ${GOLD2};border-radius:50%;color:${GOLD2};font-size:20px;box-shadow:0 0 18px rgba(217,170,74,.12)}.dcc-fd-empty b{font-size:15px;letter-spacing:.3px}
      .dcc-fd-row{width:100%;display:grid;grid-template-columns:42px minmax(0,1fr) auto 17px;align-items:center;gap:10px;padding:11px 0;border:0;border-top:1px solid rgba(255,255,255,.09);background:transparent;color:#f4f1ec;text-align:left}.dcc-fd-row:first-of-type{margin-top:8px}.dcc-fd-row-icon{width:38px;height:38px;display:grid;place-items:center;border:1px solid rgba(217,170,74,.34);border-radius:11px;color:${GOLD2};font-size:16px}.dcc-fd-row-copy b{display:block;font-size:12px}.dcc-fd-row-copy span{display:block;margin-top:4px;color:#8f98a3;font-size:8px}.dcc-fd-badge{padding:7px 9px;border:1px solid rgba(217,170,74,.34);border-radius:10px;color:${GOLD2};font-size:7px;font-weight:850}.dcc-fd-arrow{color:${GOLD2};font-size:19px}
      .dcc-fd-banner{position:relative;overflow:hidden;display:flex;align-items:center;min-height:75px;margin-top:9px;padding:13px 15px;border:1px solid rgba(217,170,74,.68);border-radius:18px;background:linear-gradient(115deg,#0d1114,#090b0c 58%,#291c08)}.dcc-fd-banner:after{content:'';position:absolute;right:-15px;top:-44px;width:120px;height:150px;transform:rotate(30deg);background:rgba(240,201,107,.08)}.dcc-fd-banner small{display:block;color:${GOLD2};font-size:7px;letter-spacing:2.4px}.dcc-fd-banner strong{display:block;margin-top:5px;font-family:Georgia,serif;font-size:15px;letter-spacing:.2px}

      .dcc-fcl-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin:3px 2px 18px}.dcc-fcl-head h1{margin:0;font-size:30px;line-height:1;letter-spacing:-1px}.dcc-fcl-head p{margin:7px 0 0;color:#929aa5;font-size:11.5px}.dcc-fcl-new{min-height:43px;padding:0 15px;border:1px solid ${GOLD2};border-radius:14px;background:linear-gradient(135deg,#f3d16e,#dba941);color:#0b0905;font-size:10px;font-weight:900;white-space:nowrap;box-shadow:0 8px 24px rgba(217,170,74,.12)}
      .dcc-fcl-search{height:44px;display:flex;align-items:center;gap:9px;padding:0 14px;border:1px solid #303840;border-radius:14px;background:linear-gradient(145deg,#11161c,#090d10);color:#8f98a3}.dcc-fcl-search svg{width:16px;height:16px;flex:none}.dcc-fcl-search input{width:100%;border:0!important;outline:0!important;background:transparent!important;box-shadow:none!important;color:#f3f1ed!important;padding:0!important;font-size:11px!important}.dcc-fcl-search input::placeholder{color:#77808a}
      .dcc-fcl-tools{display:flex;align-items:center;justify-content:space-between;gap:9px;margin:10px 0 13px}.dcc-fcl-tabs{display:flex;min-width:0;border:1px solid #2d343c;border-radius:999px;background:#090d10;overflow:hidden}.dcc-fcl-tab{min-height:35px;padding:0 13px;border:1px solid transparent;border-radius:999px;background:transparent;color:#99a1ab;font-size:9px;white-space:nowrap}.dcc-fcl-tab.active{border-color:${GOLD2};background:radial-gradient(circle at 50% 50%,rgba(217,170,74,.24),rgba(19,15,9,.9));color:${GOLD2};box-shadow:0 0 16px rgba(217,170,74,.13)}.dcc-fcl-sort{min-height:35px;padding:0 12px;border:1px solid #303840;border-radius:999px;background:#0a0e11;color:#cbd0d6;font-size:9px}
      .dcc-fcl-list{display:grid;gap:8px}.dcc-fcl-card{display:grid;grid-template-columns:minmax(0,1fr) 102px;align-items:center;gap:10px;min-height:86px;padding:12px 13px;border:1px solid rgba(217,170,74,.7);border-radius:17px;background:radial-gradient(circle at 91% 13%,rgba(217,170,74,.07),transparent 29%),linear-gradient(145deg,#10161b,#080c0f);box-shadow:inset 0 1px 0 rgba(255,255,255,.02)}.dcc-fcl-name{font-size:15px;font-weight:850;color:#f4f2ed}.dcc-fcl-goal{margin-top:5px;color:${GOLD2};font-size:10px}.dcc-fcl-weight{margin-top:4px;color:#949da7;font-size:9.5px}.dcc-fcl-manage{min-height:48px;border:1px solid ${GOLD2};border-radius:13px;background:linear-gradient(145deg,#17130c,#0b0c0d);color:${GOLD2};font-size:9px;font-weight:900;line-height:1.2}
      .dcc-fcl-empty{padding:25px 14px;border:1px solid #29323a;border-radius:17px;color:#929aa5;text-align:center;font-size:10px;background:#0b1014}

      html body #coach .side{height:58px!important;left:16px!important;right:16px!important;bottom:10px!important;padding:4px!important;border:1px solid #29323a!important;border-radius:20px!important;background:linear-gradient(145deg,rgba(17,22,28,.98),rgba(9,13,17,.98))!important;box-shadow:0 14px 38px rgba(0,0,0,.42),inset 0 1px 0 rgba(255,255,255,.025)!important;backdrop-filter:blur(16px)!important;-webkit-backdrop-filter:blur(16px)!important}
      html body #coach-nav{display:grid!important;grid-template-columns:repeat(5,minmax(0,1fr))!important;gap:3px!important;height:100%!important}
      html body #coach-nav button{position:relative!important;height:100%!important;margin:0!important;padding:3px 2px!important;border:1px solid transparent!important;border-radius:14px!important;background:transparent!important;color:#848d98!important;box-shadow:none!important;transform:none!important}
      html body #coach-nav button::before{display:none!important}
      html body #coach-nav button svg{width:22px!important;height:22px!important;margin:0 auto!important}
      html body #coach-nav button span{display:block!important;margin-top:1px!important;font-size:7px!important;line-height:1!important}
      html body #coach-nav button.active{border-color:rgba(217,170,74,.54)!important;background:radial-gradient(circle at 50% 40%,rgba(217,170,74,.20),rgba(16,13,8,.88))!important;color:${GOLD2}!important;box-shadow:0 0 18px rgba(217,170,74,.13),inset 0 1px 0 rgba(255,255,255,.025)!important}

      @media(max-width:420px){
        .dcc-fd-hero{min-height:124px;padding:13px 14px}.dcc-fd-brand img{width:44px}.dcc-fd-greet{font-size:22px;margin-top:16px}.dcc-fd-stat{min-height:72px;padding:10px 7px}.dcc-fd-stat b{font-size:21px}.dcc-fd-stat span{font-size:6.4px}.dcc-fd-card{padding:13px}.dcc-fd-banner{min-height:70px}.dcc-fcl-head h1{font-size:28px}.dcc-fcl-new{padding:0 12px}.dcc-fcl-card{grid-template-columns:minmax(0,1fr) 94px;padding:11px}.dcc-fcl-manage{font-size:8.5px}
      }
    `;
    document.head.appendChild(s);
  }

  function daysSince(v){if(!v)return null;const d=new Date(v);return Number.isFinite(d.getTime())?Math.floor((Date.now()-d.getTime())/86400000):null}
  function latestWorkout(id){const d=getData(),h=d?.workoutHistory?.[id]||[];return h.slice().sort((a,b)=>new Date(b.date)-new Date(a.date))[0]||null}
  function pendingCheck(c){const x=getData()?.checkins?.[c.id];return !!(x?.sentAt&&!x?.reviewed)}
  function hasRoutine(id){const r=getData()?.routines?.[id];return Array.isArray(r)&&r.length>0}

  function row(i){return `<button class="dcc-fd-row" onclick="${i.action}"><span class="dcc-fd-row-icon">${i.icon}</span><span class="dcc-fd-row-copy"><b>${esc(i.title)}</b><span>${esc(i.text)}</span></span><span class="dcc-fd-badge">${esc(i.badge)}</span><span class="dcc-fd-arrow">›</span></button>`}

  function setActive(screen){const nav=document.getElementById('coach-nav');if(!nav)return;const map={dashboard:0,clients:1,checkins:3,messages:4};const idx=map[screen];nav.querySelectorAll('button').forEach((b,i)=>b.classList.toggle('active',i===idx))}

  function renderDashboard(){
    injectCss();const main=document.getElementById('coach-main');if(!main)return;main.className='dcc-final-dashboard';
    const d=getData(),cs=Array.isArray(d.clients)?d.clients:[],tasks=[],attention=[];
    cs.forEach(c=>{
      if(pendingCheck(c))tasks.push({icon:'✓',title:'REVISAR CHECK-IN',text:c.name,badge:'HOY',action:`reviewCheckin('${esc(c.id)}')`});
      if(!hasRoutine(c.id))tasks.push({icon:'＋',title:'ASIGNAR RUTINA',text:c.name,badge:'PENDIENTE',action:`openClient('${esc(c.id)}')`});
      const gap=daysSince(latestWorkout(c.id)?.date);if(gap!==null&&gap>=7)attention.push({icon:'!',title:c.name,text:`${gap} DÍAS SIN REGISTRAR ENTRENAMIENTO`,badge:'SEGUIMIENTO',action:`openClient('${esc(c.id)}')`});
    });
    const hr=new Date().getHours(),g=hr<13?'BUENOS DÍAS':hr<20?'BUENAS TARDES':'BUENAS NOCHES';
    main.innerHTML=`<div class="dcc-fd"><section class="dcc-fd-hero"><div class="dcc-fd-brand"><img src="./dc-stride-logo.svg.svg" alt="Daniel Campins"><div><div class="dcc-fd-brand-name">DANIEL CAMPINS</div><div class="dcc-fd-brand-sub">TRAINING PLATFORM</div></div></div><div class="dcc-fd-greet">${g},<span>DANIEL</span></div></section><div class="dcc-fd-stats"><div class="dcc-fd-stat"><b>${cs.length}</b><span>Clientes</span></div><div class="dcc-fd-stat"><b>${cs.filter(pendingCheck).length}</b><span>Check-in pendientes</span></div><div class="dcc-fd-stat"><b>0</b><span>Rutinas por renovar</span></div><div class="dcc-fd-stat"><b>0</b><span>Dietas por renovar</span></div></div><section class="dcc-fd-card"><div class="dcc-fd-title">TAREAS PENDIENTES</div>${tasks.length?tasks.slice(0,6).map(row).join(''):`<div class="dcc-fd-empty"><div class="dcc-fd-check">✓</div><b>TODO AL DÍA</b></div>`}</section><section class="dcc-fd-card"><div class="dcc-fd-title">REQUIEREN ATENCIÓN</div><div class="dcc-fd-sub">SEÑALES DE SEGUIMIENTO DETECTADAS AUTOMÁTICAMENTE</div>${attention.length?attention.slice(0,6).map(row).join(''):'<div class="dcc-fd-empty">SIN ALERTAS DE SEGUIMIENTO</div>'}</section><section class="dcc-fd-banner"><div><small>CADA CLIENTE ES UN PROCESO.</small><strong>TÚ MARCAS LA DIFERENCIA.</strong></div></section></div>`;
    setActive('dashboard');
  }

  function clientCard(c){const goal=c.goal||c.objective||c.objetivo||'Objetivo por definir',weight=c.weight||c.peso||'';return `<article class="dcc-fcl-card" data-name="${esc(String(c.name||'').toLowerCase())}" data-pending="${pendingCheck(c)?'1':'0'}"><div><div class="dcc-fcl-name">${esc(c.name||'Cliente')}</div><div class="dcc-fcl-goal">${esc(goal)}</div>${weight?`<div class="dcc-fcl-weight">${esc(weight)} kg</div>`:''}</div><button class="dcc-fcl-manage" onclick="openClient('${esc(c.id)}')">Gestionar<br>cliente</button></article>`}

  function renderClients(){
    injectCss();const main=document.getElementById('coach-main');if(!main)return;main.className='dcc-final-clients';const cs=getData()?.clients||[];
    main.innerHTML=`<div class="dcc-fcl"><header class="dcc-fcl-head"><div><h1>Clientes</h1><p>Gestiona el proceso de cada persona.</p></div><button class="dcc-fcl-new" onclick="newClient()">＋ Nuevo cliente</button></header><label class="dcc-fcl-search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="6"/><path d="m16 16 4 4"/></svg><input id="dccClientSearch" placeholder="Buscar cliente..." oninput="window.dccFilterClients()"></label><div class="dcc-fcl-tools"><div class="dcc-fcl-tabs"><button class="dcc-fcl-tab active" onclick="window.dccClientTab('all',this)">Todos</button><button class="dcc-fcl-tab" onclick="window.dccClientTab('pending',this)">Pendientes por revisar</button></div><button class="dcc-fcl-sort" onclick="window.dccSortClients()">↕ &nbsp; A-Z⌄</button></div><div class="dcc-fcl-list" id="dccClientList">${cs.map(clientCard).join('')||'<div class="dcc-fcl-empty">Todavía no hay clientes.</div>'}</div></div>`;
    window.__dccClientMode='all';window.__dccClientSort='az';setActive('clients');
  }

  function install(){
    injectCss();const current=window.showCoach;if(typeof current!=='function')return setTimeout(install,70);if(current.__dccFinalV2)return;
    const wrapped=function(screen){
      if(screen==='dashboard'){window.currentScreen='dashboard';renderDashboard();return}
      if(screen==='clients'){window.currentScreen='clients';renderClients();return}
      return current.apply(this,arguments);
    };
    wrapped.__dccFinalV2=true;wrapped.__base=current;window.showCoach=wrapped;
    if(window.currentScreen==='dashboard')renderDashboard();else if(window.currentScreen==='clients')renderClients();
  }

  injectCss();install();setTimeout(install,300);setTimeout(install,1000);
})();
