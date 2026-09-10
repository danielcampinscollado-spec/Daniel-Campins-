/* DCC definitive dashboard loader v9 visual — compact premium coach panel */
(function(){
  'use strict';

  const GOLD='#d9aa4a';
  const GOLD2='#f0c96b';
  const esc=v=>String(v??'').replace(/[&<>"']/g,ch=>({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[ch]));
  const getData=()=>{try{return data||{}}catch(e){return window.data||{}}};

  function icon(name){
    const icons={
      panel:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/></svg>',
      clients:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3.5 20c.5-4 2.3-6 5.5-6s5 2 5.5 6"/></svg>',
      calendar:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16"/></svg>',
      check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="5" y="4" width="14" height="17" rx="2"/><path d="M8 11l2 2 5-5M8 17h7"/></svg>',
      msg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.7 8.7 0 0 1-4-.9L4 20l1.4-3.4A7.3 7.3 0 0 1 4 11.5 7.5 7.5 0 0 1 12 4a7.5 7.5 0 0 1 8 7.5Z"/></svg>',
      dumbbell:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 8v8M3.5 9.5v5M18 8v8M20.5 9.5v5M6 12h12"/></svg>',
      renew:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M19 7v5h-5"/><path d="M5 17v-5h5"/><path d="M18.2 11A7 7 0 0 0 6.4 7.1L5 9M5.8 13A7 7 0 0 0 17.6 16.9L19 15"/></svg>',
      diet:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M7 3h7l4 4v14H7z"/><path d="M14 3v5h5M10 12h5M10 16h5"/></svg>',
      clipboard:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="5" y="5" width="14" height="16" rx="2"/><path d="M9 5V3h6v2M9 10h6M9 14h6M9 18h4"/></svg>',
      alert:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v6M12 17h.01"/></svg>'
    };
    return icons[name]||'';
  }

  function injectCss(){
    document.getElementById('dcc-premium-v6')?.remove();
    let s=document.getElementById('dcc-coach-panel-v9-css');
    if(s) s.remove();
    s=document.createElement('style');
    s.id='dcc-coach-panel-v9-css';
    s.textContent=`
      #coach-main.dcc-p9-dashboard,#coach-main.dcc-premium-clients{
        background:
          radial-gradient(ellipse at 88% 2%,rgba(217,170,74,.075),transparent 25%),
          linear-gradient(180deg,#07090c 0%,#040608 100%)!important;
        color:#f6f3ed!important;
        padding:10px 12px 90px!important;
      }
      .dcc-p9,.dcc-cl{width:100%;max-width:980px;margin:0 auto}.dcc-p9 *,.dcc-cl *{box-sizing:border-box}

      .dcc-p9-hero{
        position:relative;overflow:hidden;min-height:146px;padding:18px 20px 17px;
        border:1px solid rgba(240,201,107,.60);border-radius:22px;
        background:
          radial-gradient(circle at 89% 12%,rgba(240,201,107,.14),transparent 27%),
          linear-gradient(132deg,#11161b 0%,#090d11 63%,#151007 100%);
        box-shadow:inset 0 1px 0 rgba(255,255,255,.04),0 15px 34px rgba(0,0,0,.28)
      }
      .dcc-p9-hero:before{content:'';position:absolute;right:-48px;top:-100px;width:270px;height:270px;border:1px solid rgba(240,201,107,.20);border-radius:50%;pointer-events:none}
      .dcc-p9-hero:after{content:'';position:absolute;right:-45px;top:44px;width:270px;height:1px;transform:rotate(-29deg);background:linear-gradient(90deg,transparent,rgba(240,201,107,.52),transparent);pointer-events:none}
      .dcc-p9-hero-top{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;position:relative;z-index:2}
      .dcc-p9-kicker{color:${GOLD2};font-size:9.5px;font-weight:900;letter-spacing:3px;text-transform:uppercase}
      .dcc-p9-mark{width:43px;height:43px;display:grid;place-items:center;flex:none;border:1px solid rgba(240,201,107,.52);border-radius:50%;background:radial-gradient(circle at 50% 30%,rgba(240,201,107,.13),rgba(9,12,15,.94));color:${GOLD2};box-shadow:0 0 20px rgba(217,170,74,.10)}
      .dcc-p9-mark svg{width:23px;height:23px}
      .dcc-p9-title{position:relative;z-index:2;margin:23px 0 0;max-width:76%;font-size:29px;line-height:.98;font-weight:840;letter-spacing:-.85px;color:#f8f6f1}
      .dcc-p9-title span{display:block;margin-top:5px;color:${GOLD2}}
      .dcc-p9-title:after{content:'';display:block;width:45px;height:2px;margin-top:12px;border-radius:99px;background:linear-gradient(90deg,${GOLD2},rgba(217,170,74,.22))}
      .dcc-p9-caption{position:relative;z-index:2;margin-top:10px;color:#9ba3ad;font-size:10.5px;line-height:1.35}
      .dcc-p9-motto{position:absolute;right:20px;bottom:17px;z-index:2;text-align:right;color:#8d929a;font-size:6.3px;line-height:1.55;letter-spacing:2.05px;text-transform:uppercase}

      .dcc-p9-stats{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:9px}
      .dcc-p9-stat{min-height:72px;display:grid;grid-template-columns:36px minmax(0,1fr) 16px;align-items:center;gap:9px;padding:10px 11px;border:1px solid rgba(217,170,74,.38);border-radius:17px;background:radial-gradient(circle at 94% 0,rgba(217,170,74,.055),transparent 36%),linear-gradient(145deg,#10151a,#080c0f);color:#f6f4ef;text-align:left;box-shadow:inset 0 1px 0 rgba(255,255,255,.025);-webkit-tap-highlight-color:transparent}
      .dcc-p9-stat-ico{width:34px;height:34px;display:grid;place-items:center;color:${GOLD2}}
      .dcc-p9-stat-ico svg{width:27px;height:27px}.dcc-p9-stat-copy{min-width:0}.dcc-p9-stat strong{display:block;font-size:23px;line-height:1;font-weight:810;letter-spacing:-.4px}.dcc-p9-stat span{display:block;margin-top:6px;color:#9ca4af;font-size:7px;line-height:1.2;letter-spacing:1px;text-transform:uppercase}.dcc-p9-stat-arrow{color:${GOLD2};font-size:19px;line-height:1}

      .dcc-p9-accordion{margin-top:9px;border:1px solid rgba(240,201,107,.52);border-radius:20px;background:radial-gradient(circle at 96% 0,rgba(240,201,107,.075),transparent 31%),linear-gradient(145deg,#10151a,#080b0e);box-shadow:inset 0 1px 0 rgba(255,255,255,.025),0 12px 28px rgba(0,0,0,.18);overflow:hidden}
      .dcc-p9-accordion-head{width:100%;display:grid;grid-template-columns:38px minmax(0,1fr) auto 24px;align-items:center;gap:10px;padding:12px 13px;border:0;background:transparent;color:#f5f2ec;text-align:left;-webkit-tap-highlight-color:transparent}
      .dcc-p9-head-ico{width:36px;height:36px;display:grid;place-items:center;color:${GOLD2};border:1px solid rgba(217,170,74,.32);border-radius:11px;background:rgba(217,170,74,.025)}.dcc-p9-head-ico svg{width:21px;height:21px}
      .dcc-p9-head-copy{min-width:0}.dcc-p9-head-title{display:flex;align-items:center;gap:8px;color:${GOLD2};font-size:9.5px;font-weight:900;letter-spacing:2.5px;text-transform:uppercase}.dcc-p9-count{min-width:22px;height:22px;padding:0 7px;display:inline-flex;align-items:center;justify-content:center;border:1px solid rgba(240,201,107,.55);border-radius:999px;background:linear-gradient(135deg,#f1ca68,#d9a43a);color:#17120a;font-size:9px;font-weight:900;letter-spacing:0}
      .dcc-p9-head-sub{margin-top:4px;color:#858e99;font-size:8.4px;line-height:1.25;letter-spacing:.55px;text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.dcc-p9-caret{color:${GOLD2};font-size:24px;line-height:1;transform:rotate(0deg);transition:transform .18s ease}.dcc-p9-accordion.closed .dcc-p9-caret{transform:rotate(180deg)}
      .dcc-p9-body{padding:0 12px 10px;display:grid;gap:0}.dcc-p9-accordion.closed .dcc-p9-body{display:none}
      .dcc-p9-inner{border:1px solid rgba(255,255,255,.07);border-radius:14px;overflow:hidden;background:rgba(6,9,12,.26)}
      .dcc-p9-row{width:100%;display:grid;grid-template-columns:38px minmax(0,1fr) auto 16px;align-items:center;gap:10px;padding:10px 11px;border:0;border-bottom:1px solid rgba(255,255,255,.075);background:transparent;color:#f5f2ec;text-align:left;-webkit-tap-highlight-color:transparent}.dcc-p9-row:last-child{border-bottom:0}.dcc-p9-row-icon{width:35px;height:35px;display:grid;place-items:center;border:1px solid rgba(217,170,74,.34);border-radius:50%;background:radial-gradient(circle at 50% 30%,rgba(217,170,74,.09),rgba(10,12,14,.95));color:${GOLD2};font-size:18px}.dcc-p9-row-copy{min-width:0}.dcc-p9-row-copy b{display:block;font-size:12px;line-height:1.15;color:#f6f3ee}.dcc-p9-row-copy span{display:block;margin-top:4px;color:#929ba6;font-size:9px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.dcc-p9-badge{padding:6px 9px;border:1px solid rgba(217,170,74,.36);border-radius:999px;background:rgba(217,170,74,.025);color:${GOLD2};font-size:7px;font-weight:850;white-space:nowrap}.dcc-p9-arrow{color:${GOLD2};font-size:18px}.dcc-p9-empty{display:flex;align-items:center;gap:9px;padding:10px 11px;color:#9ba3ad;font-size:10px}.dcc-p9-empty-i{width:32px;height:32px;display:grid;place-items:center;border:1px solid rgba(217,170,74,.32);border-radius:50%;color:${GOLD2}}

      .dcc-cl{padding-top:14px}.dcc-cl-head{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;margin:6px 2px 20px}.dcc-cl-head h1{margin:0;font-size:34px;letter-spacing:-1.3px}.dcc-cl-head p{margin:6px 0 0;color:#939aa5;font-size:14px}.dcc-cl-new{border:1px solid #f0c96b;border-radius:15px;padding:12px 16px;background:linear-gradient(135deg,#f0c96b,#d9aa4a);color:#090909;font-weight:800;font-size:12px;white-space:nowrap}
      .dcc-cl-tools{display:grid;grid-template-columns:1fr 48px;gap:9px}.dcc-cl-search{height:48px;display:flex;align-items:center;gap:10px;padding:0 15px;border:1px solid #333942;border-radius:15px;background:linear-gradient(145deg,#0e1318,#080b0e);color:#8f97a3}.dcc-cl-search input{width:100%;border:0;outline:0;background:none;color:#f5f5f5;font:inherit}.dcc-cl-filter{border:1px solid #333942;border-radius:15px;background:#0d1115;color:#a9b0ba;font-size:19px}
      .dcc-cl-subtools{display:flex;justify-content:space-between;align-items:center;margin:11px 0 14px}.dcc-cl-tabs{display:flex;border:1px solid #292f36;border-radius:22px;overflow:hidden;background:#090c0f}.dcc-cl-tab{padding:9px 18px;border:0;background:none;color:#9aa1ac;font-size:11px}.dcc-cl-tab.active{border:1px solid ${GOLD2};border-radius:21px;background:radial-gradient(circle at 50% 50%,#d9aa4a35,#15100a);color:${GOLD2};box-shadow:0 0 18px #d9aa4a28}.dcc-cl-sort{padding:9px 13px;border:1px solid #343941;border-radius:15px;background:#0a0d10;color:#e8e8e8;font-size:11px}
      .dcc-cl-list{display:grid;gap:9px}.dcc-cl-card{display:grid;grid-template-columns:minmax(0,1fr) minmax(135px,.85fr) 112px;align-items:center;gap:13px;min-height:104px;padding:14px 15px;border:1px solid rgba(217,170,74,.58);border-radius:17px;background:radial-gradient(ellipse at 86% 35%,rgba(217,170,74,.08),transparent 23%),linear-gradient(120deg,#0c1014,#080b0e);box-shadow:0 10px 26px #0005}.dcc-cl-info{min-width:0}.dcc-cl-name{font-size:17px;font-weight:800;color:#f5f3ef}.dcc-cl-goal{margin-top:6px;color:${GOLD2};font-size:12px}.dcc-cl-weight{margin-top:4px;color:#a4abb5;font-size:12px}.dcc-cl-training{padding-left:14px;border-left:1px solid #343a42}.dcc-cl-tr-title{display:flex;align-items:center;gap:7px;color:#f1f1ef;font-size:10px}.dcc-cl-dumbbell{color:${GOLD2};font-size:18px}.dcc-cl-progress{display:flex;align-items:center;gap:8px;margin-top:8px}.dcc-cl-track{height:6px;flex:1;border-radius:8px;background:#2a3037;overflow:hidden}.dcc-cl-fill{height:100%;border-radius:8px;background:linear-gradient(90deg,#d9aa4a,#f0c96b)}.dcc-cl-pct{font-size:11px}.dcc-cl-manage{min-height:48px;border:1px solid ${GOLD2};border-radius:13px;background:linear-gradient(145deg,#18140c,#0a0b0c);color:${GOLD2};font-size:11px;font-weight:800;line-height:1.25}

      #coach .side{height:62px!important;left:14px!important;right:14px!important;bottom:10px!important;border-radius:21px!important;padding:0 7px!important}
      #coach-nav{display:grid!important;grid-template-columns:repeat(5,minmax(0,1fr))!important;gap:0!important;height:100%!important}
      #coach-nav button{height:100%!important;padding:5px 2px!important;font-size:8px!important;transition:none!important;transform:none!important}#coach-nav button svg{width:21px!important;height:21px!important}#coach-nav button span{font-size:7.3px!important;margin-top:2px!important}

      @media(max-width:600px){
        .dcc-p9-title{font-size:27px}.dcc-p9-hero{min-height:142px;padding:16px}.dcc-p9-motto{right:16px;bottom:15px;font-size:5.8px}.dcc-p9-stat{min-height:67px;padding:9px 10px;grid-template-columns:32px minmax(0,1fr) 14px}.dcc-p9-stat-ico{width:31px;height:31px}.dcc-p9-stat-ico svg{width:24px;height:24px}.dcc-p9-stat strong{font-size:21px}.dcc-p9-stat span{font-size:6.4px}.dcc-p9-accordion-head{grid-template-columns:35px minmax(0,1fr) auto 20px;padding:11px 12px}.dcc-p9-head-ico{width:34px;height:34px}.dcc-p9-row{grid-template-columns:35px minmax(0,1fr) auto 14px;padding:9px 10px}.dcc-p9-row-icon{width:33px;height:33px}.dcc-p9-row-copy b{font-size:11.5px}.dcc-p9-row-copy span{font-size:8.5px}
        .dcc-cl-head h1{font-size:31px}.dcc-cl-head p{font-size:12px}.dcc-cl-new{padding:11px 13px}.dcc-cl-card{grid-template-columns:minmax(0,1fr) minmax(108px,.8fr) 88px;gap:9px;padding:12px 11px;min-height:94px}.dcc-cl-name{font-size:15px}.dcc-cl-goal,.dcc-cl-weight{font-size:10.5px}.dcc-cl-training{padding-left:9px}.dcc-cl-manage{font-size:9.5px;padding:5px}.dcc-cl-tab{padding:8px 13px}
      }
      @media(max-width:390px){
        .dcc-p9-hero{min-height:136px}.dcc-p9-title{font-size:25px;margin-top:20px}.dcc-p9-caption{font-size:9.7px}.dcc-p9-motto{display:none}.dcc-p9-stat{grid-template-columns:29px minmax(0,1fr) 12px;gap:7px}.dcc-p9-stat-ico svg{width:22px;height:22px}.dcc-p9-stat strong{font-size:20px}.dcc-p9-head-sub{font-size:7.6px}
      }
    `;
    document.head.appendChild(s);
  }

  function daysSince(v){if(!v)return null;const d=new Date(v);return Number.isFinite(d.getTime())?Math.floor((Date.now()-d.getTime())/86400000):null}
  function latestWorkout(id){const d=getData(),h=d?.workoutHistory?.[id]||[];return h.slice().sort((a,b)=>new Date(b.date)-new Date(a.date))[0]||null}
  function hasRoutine(id){const r=getData()?.routines?.[id];return Array.isArray(r)&&r.length>0}
  function pendingCheck(c){const x=getData()?.checkins?.[c.id];return !!(x?.sentAt&&!x?.reviewed)}
  function trainingProgress(c){const d=getData(),r=d?.routines?.[c.id];if(!Array.isArray(r)||!r.length)return 0;const h=d?.workoutHistory?.[c.id]||[];if(!h.length)return 0;const recent=h.filter(x=>{const gap=daysSince(x.date);return gap!==null&&gap<=30}).length;return Math.min(100,Math.round(recent/Math.max(1,r.length*4)*100))}

  function statCard(iconName,value,label,action){
    return `<button type="button" class="dcc-p9-stat" ${action?`onclick="${action}"`:''}><span class="dcc-p9-stat-ico">${icon(iconName)}</span><span class="dcc-p9-stat-copy"><strong>${esc(value)}</strong><span>${esc(label)}</span></span><span class="dcc-p9-stat-arrow">›</span></button>`;
  }
  function taskRow(i){return `<button type="button" class="dcc-p9-row" onclick="${i.action}"><span class="dcc-p9-row-icon">${i.icon}</span><span class="dcc-p9-row-copy"><b>${esc(i.title)}</b><span>${esc(i.text)}</span></span><span class="dcc-p9-badge">${esc(i.badge)}</span><span class="dcc-p9-arrow">›</span></button>`}

  window.dccCoachTogglePanel=function(which){
    const el=document.getElementById(which==='attention'?'dccP9Attention':'dccP9Tasks');
    if(!el)return;
    const closed=el.classList.toggle('closed');
    if(which==='attention')window.__dccCoachAttentionOpen=!closed;else window.__dccCoachTasksOpen=!closed;
  };

  function renderDashboard(){
    injectCss();
    const main=document.getElementById('coach-main');if(!main)return;
    main.className='dcc-p9-dashboard';
    const d=getData(),cs=Array.isArray(d.clients)?d.clients:[],tasks=[],attention=[];
    cs.forEach(c=>{
      if(pendingCheck(c))tasks.push({icon:'✓',title:'REVISAR CHECK-IN',text:c.name,badge:'HOY',action:`reviewCheckin('${esc(c.id)}')`});
      if(!hasRoutine(c.id))tasks.push({icon:'＋',title:'ASIGNAR RUTINA',text:c.name,badge:'PENDIENTE',action:`openClient('${esc(c.id)}')`});
      const gap=daysSince(latestWorkout(c.id)?.date);
      if(gap!==null&&gap>=7)attention.push({icon:'!',title:c.name,text:`${gap} DÍAS SIN REGISTRAR ENTRENAMIENTO`,badge:'SEGUIMIENTO',action:`openClient('${esc(c.id)}')`});
    });
    const hr=new Date().getHours(),g=hr<13?'BUENOS DÍAS':hr<20?'BUENAS TARDES':'BUENAS NOCHES';
    const tasksOpen=window.__dccCoachTasksOpen!==false;
    const attentionOpen=window.__dccCoachAttentionOpen!==false;
    main.innerHTML=`<div class="dcc-p9">
      <section class="dcc-p9-hero">
        <div class="dcc-p9-hero-top"><div class="dcc-p9-kicker">PANEL DE ENTRENADOR</div><div class="dcc-p9-mark">${icon('dumbbell')}</div></div>
        <h1 class="dcc-p9-title">${g},<span>DANIEL</span></h1>
        <div class="dcc-p9-caption">Clientes, seguimiento y próximas acciones.</div>
        <div class="dcc-p9-motto">DISCIPLINA<br>TRANSFORMA<br>VIDAS</div>
      </section>
      <div class="dcc-p9-stats">
        ${statCard('clients',cs.length,'CLIENTES',"showCoach('clients')")}
        ${statCard('check',cs.filter(pendingCheck).length,'CHECK-IN PENDIENTES',"showCoach('checkins')")}
        ${statCard('renew',0,'RUTINAS POR RENOVAR',"toast('Sin rutinas por renovar')")}
        ${statCard('diet',0,'DIETAS POR RENOVAR',"toast('Sin dietas por renovar')")}
      </div>
      <section id="dccP9Tasks" class="dcc-p9-accordion ${tasksOpen?'':'closed'}">
        <button type="button" class="dcc-p9-accordion-head" onclick="dccCoachTogglePanel('tasks')">
          <span class="dcc-p9-head-ico">${icon('clipboard')}</span>
          <span class="dcc-p9-head-copy"><span class="dcc-p9-head-title">TAREAS PENDIENTES <span class="dcc-p9-count">${tasks.length}</span></span><span class="dcc-p9-head-sub">ACCIONES QUE REQUIEREN TU ATENCIÓN</span></span>
          <span></span><span class="dcc-p9-caret">⌃</span>
        </button>
        <div class="dcc-p9-body"><div class="dcc-p9-inner">${tasks.length?tasks.slice(0,6).map(taskRow).join(''):`<div class="dcc-p9-empty"><span class="dcc-p9-empty-i">✓</span><span>Todo al día. No hay tareas pendientes.</span></div>`}</div></div>
      </section>
      <section id="dccP9Attention" class="dcc-p9-accordion ${attentionOpen?'':'closed'}">
        <button type="button" class="dcc-p9-accordion-head" onclick="dccCoachTogglePanel('attention')">
          <span class="dcc-p9-head-ico">${icon('alert')}</span>
          <span class="dcc-p9-head-copy"><span class="dcc-p9-head-title">REQUIEREN ATENCIÓN</span><span class="dcc-p9-head-sub">SEÑALES DE SEGUIMIENTO DETECTADAS AUTOMÁTICAMENTE</span></span>
          <span></span><span class="dcc-p9-caret">⌃</span>
        </button>
        <div class="dcc-p9-body"><div class="dcc-p9-inner">${attention.length?attention.slice(0,6).map(taskRow).join(''):`<div class="dcc-p9-empty"><span class="dcc-p9-empty-i">✓</span><span>Sin alertas de seguimiento.</span></div>`}</div></div>
      </section>
    </div>`;
  }

  function clientCard(c){
    const p=trainingProgress(c),goal=c.goal||c.objective||c.objetivo||'Objetivo por definir',weight=c.weight||c.peso||'';
    return `<article class="dcc-cl-card" data-name="${esc(c.name).toLowerCase()}" data-pending="${pendingCheck(c)?'1':'0'}"><div class="dcc-cl-info"><div class="dcc-cl-name">${esc(c.name)}</div><div class="dcc-cl-goal">${esc(goal)}</div>${weight?`<div class="dcc-cl-weight">${esc(weight)} kg</div>`:''}</div><div class="dcc-cl-training"><div class="dcc-cl-tr-title"><span class="dcc-cl-dumbbell">⌁</span> Entrenamiento</div><div class="dcc-cl-progress"><div class="dcc-cl-track"><div class="dcc-cl-fill" style="width:${p}%"></div></div><span class="dcc-cl-pct">${p}%</span></div></div><button class="dcc-cl-manage" onclick="openClient('${esc(c.id)}')">Gestionar<br>cliente</button></article>`;
  }
  function renderClients(){
    injectCss();const main=document.getElementById('coach-main');if(!main)return;main.className='dcc-premium-clients';const cs=getData()?.clients||[];
    main.innerHTML=`<div class="dcc-cl"><header class="dcc-cl-head"><div><h1>Clientes</h1><p>Gestiona el proceso de cada persona.</p></div><button class="dcc-cl-new" onclick="newClient()">＋ Nuevo cliente</button></header><div class="dcc-cl-tools"><label class="dcc-cl-search">⌕<input id="dccClientSearch" placeholder="Buscar cliente..." oninput="window.dccFilterClients()"></label><button class="dcc-cl-filter" onclick="toast('Filtros próximamente')">▽</button></div><div class="dcc-cl-subtools"><div class="dcc-cl-tabs"><button class="dcc-cl-tab active" onclick="window.dccClientTab('all',this)">Todos</button><button class="dcc-cl-tab" onclick="window.dccClientTab('pending',this)">Pendientes por revisar</button></div><button class="dcc-cl-sort" onclick="window.dccSortClients()">↕ &nbsp; A-Z⌄</button></div><div class="dcc-cl-list" id="dccClientList">${cs.map(clientCard).join('')||'<div class="dcc-cl-empty">Todavía no hay clientes.</div>'}</div></div>`;
    window.__dccClientMode='all';window.__dccClientSort='az';
  }

  window.dccFilterClients=function(){const q=(document.getElementById('dccClientSearch')?.value||'').toLowerCase();document.querySelectorAll('.dcc-cl-card').forEach(x=>x.style.display=(x.dataset.name.includes(q)&&(window.__dccClientMode!=='pending'||x.dataset.pending==='1'))?'grid':'none')};
  window.dccClientTab=function(m,b){window.__dccClientMode=m;document.querySelectorAll('.dcc-cl-tab').forEach(x=>x.classList.remove('active'));b.classList.add('active');window.dccFilterClients()};
  window.dccSortClients=function(){const l=document.getElementById('dccClientList');if(!l)return;window.__dccClientSort=window.__dccClientSort==='az'?'za':'az';[...l.querySelectorAll('.dcc-cl-card')].sort((a,b)=>window.__dccClientSort==='az'?a.dataset.name.localeCompare(b.dataset.name):b.dataset.name.localeCompare(a.dataset.name)).forEach(x=>l.appendChild(x))};

  function navHtml(){return `<button onclick="showCoach('dashboard')">${icon('panel')}<span>Panel</span></button><button onclick="showCoach('clients')">${icon('clients')}<span>Clientes</span></button><button onclick="toast('Calendario próximamente')">${icon('calendar')}<span>Calendario</span></button><button onclick="showCoach('checkins')">${icon('check')}<span>Check-in</span></button><button onclick="showCoach('messages')">${icon('msg')}<span>Mensajes</span></button>`}
  function enforceNav(){const n=document.getElementById('coach-nav');if(!n)return;const wanted=['Panel','Clientes','Calendario','Check-in','Mensajes'],labels=[...n.querySelectorAll('button span')].map(x=>x.textContent.trim());if(labels.length!==5||wanted.some((x,i)=>labels[i]!==x))n.innerHTML=navHtml();n.style.setProperty('grid-template-columns','repeat(5,minmax(0,1fr))','important')}
  function active(screen){const n=document.getElementById('coach-nav');if(!n)return;const map={dashboard:0,clients:1,checkins:3,messages:4};n.querySelectorAll('button').forEach(x=>x.classList.remove('active'));const i=map[screen];if(i!==undefined)n.querySelectorAll('button')[i]?.classList.add('active')}
  function lockNav(){enforceNav();if(typeof window.buildCoachNav==='function'&&!window.buildCoachNav.__dccLocked){const old=window.buildCoachNav;const wrapped=function(){const r=old.apply(this,arguments);requestAnimationFrame(enforceNav);return r};wrapped.__dccLocked=true;window.buildCoachNav=wrapped}}

  function install(){
    injectCss();lockNav();
    const original=window.showCoach;
    if(typeof original!=='function'||original.__dccPremiumV9)return;
    const base=original.__original||original.__base||original;
    const wrapped=function(screen){
      if(screen==='dashboard'){window.currentScreen='dashboard';renderDashboard();enforceNav();active('dashboard');return}
      if(screen==='clients'){window.currentScreen='clients';renderClients();enforceNav();active('clients');return}
      const main=document.getElementById('coach-main');if(main)main.classList.remove('dcc-p9-dashboard','dcc-premium-clients');
      const r=base.apply(this,arguments);requestAnimationFrame(()=>{enforceNav();active(screen)});return r;
    };
    wrapped.__dccPremiumV9=true;wrapped.__dccPremiumV6=true;wrapped.__original=base;window.showCoach=wrapped;
  }

  function repaintCurrentDashboard(){
    const main=document.getElementById('coach-main');if(!main||typeof window.showCoach!=='function')return;
    const t=(main.textContent||'').toUpperCase();
    const isDashboard=window.currentScreen==='dashboard'||t.includes('PANEL DE ENTRENADOR')||t.includes('CADA CLIENTE ES UN PROCESO')||t.includes('BUENOS DÍAS')||t.includes('BUENAS TARDES')||t.includes('BUENAS NOCHES');
    if(isDashboard)window.showCoach('dashboard');
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{install();setTimeout(repaintCurrentDashboard,40)},{once:true});else{install();setTimeout(repaintCurrentDashboard,40)}
  window.addEventListener('load',()=>{install();setTimeout(repaintCurrentDashboard,60)},{once:true});
  window.addEventListener('pageshow',()=>setTimeout(repaintCurrentDashboard,40));
})();