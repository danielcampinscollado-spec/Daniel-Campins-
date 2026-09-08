/* DCC — Check-ins premium compactos */
(function(){
  const GOLD='#d9aa4a', GOLD2='#f0c96b';
  const esc=v=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const getData=()=>{try{return data||{}}catch(e){return window.data||{}}};

  function injectCss(){
    if(document.getElementById('dcc-checkin-premium-css'))return;
    const s=document.createElement('style');
    s.id='dcc-checkin-premium-css';
    s.textContent=`
      #coach-main.dcc-premium-checkins{background:radial-gradient(circle at 82% 0,rgba(224,173,76,.065),transparent 24%),#05080a!important;color:#f7f5f0!important;padding:18px 14px 96px!important}
      .dcc-ci{max-width:900px;margin:auto}.dcc-ci *{box-sizing:border-box}
      .dcc-ci-kicker{margin:0 2px 9px;color:${GOLD2};font-size:10px;font-weight:850;letter-spacing:3px}
      .dcc-ci-head{margin:0 2px 18px}.dcc-ci-head h1{margin:0;font-size:31px;line-height:1.05;letter-spacing:-1px}.dcc-ci-head p{margin:8px 0 0;color:#949ca7;font-size:13px;line-height:1.4}
      .dcc-ci-tabs{display:grid;grid-template-columns:1fr 1fr;gap:4px;margin-bottom:16px;padding:4px;border:1px solid #303840;border-radius:18px;background:#090d10}
      .dcc-ci-tab{min-height:44px;display:flex;align-items:center;justify-content:center;gap:9px;border:1px solid transparent;border-radius:14px;background:transparent;color:#9ca4ae;font-size:12px;font-weight:850}
      .dcc-ci-tab.active{border-color:rgba(240,201,107,.65);background:radial-gradient(circle at 55% 50%,rgba(217,170,74,.22),rgba(20,16,10,.82));color:${GOLD2};box-shadow:inset 0 1px 0 rgba(255,255,255,.025)}
      .dcc-ci-count{min-width:29px;height:29px;display:grid;place-items:center;border-radius:50%;background:#1d2227;color:#aeb5bf;font-size:11px}.dcc-ci-tab.active .dcc-ci-count{background:rgba(217,170,74,.20);color:${GOLD2}}
      .dcc-ci-list{display:grid;gap:9px}.dcc-ci-card{display:grid;grid-template-columns:54px minmax(0,1fr) auto;align-items:center;gap:12px;min-height:88px;padding:12px 14px;border:1px solid #2a333b;border-radius:18px;background:radial-gradient(circle at 92% 15%,rgba(217,170,74,.045),transparent 28%),linear-gradient(145deg,#10161b,#080c0f);box-shadow:inset 0 1px 0 rgba(255,255,255,.02)}
      .dcc-ci-avatar{width:54px;height:54px;display:grid;place-items:center;border:1px solid rgba(217,170,74,.58);border-radius:50%;background:#0a0e11;color:${GOLD2};font-size:18px;font-weight:850;letter-spacing:.4px}
      .dcc-ci-copy{min-width:0}.dcc-ci-name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#f4f2ed;font-size:16px;font-weight:800;letter-spacing:-.15px}
      .dcc-ci-status{display:inline-flex;align-items:center;gap:5px;margin-top:7px;padding:5px 8px;border-radius:999px;font-size:9px;font-weight:800}
      .dcc-ci-status.pending{border:1px solid rgba(217,170,74,.18);background:rgba(217,170,74,.10);color:${GOLD2}}
      .dcc-ci-status.reviewed{border:1px solid rgba(72,190,119,.18);background:rgba(72,190,119,.09);color:#62d98d}
      .dcc-ci-dot{width:6px;height:6px;border-radius:50%;background:currentColor}
      .dcc-ci-open{min-height:42px;padding:0 13px;border:1px solid ${GOLD2};border-radius:13px;background:linear-gradient(145deg,#18140c,#0a0b0c);color:${GOLD2};font-size:10px;font-weight:850;white-space:nowrap}.dcc-ci-open span{margin-left:7px;font-size:15px;vertical-align:-1px}
      .dcc-ci-empty{padding:28px 16px;border:1px solid #29323a;border-radius:18px;background:linear-gradient(145deg,#0f1419,#080b0e);color:#8f98a3;text-align:center;font-size:11px}
      @media(max-width:600px){
        #coach-main.dcc-premium-checkins{padding:14px 12px 92px!important}
        .dcc-ci-kicker{font-size:9px;letter-spacing:2.7px}.dcc-ci-head{margin-bottom:15px}.dcc-ci-head h1{font-size:28px}.dcc-ci-head p{font-size:11.5px}
        .dcc-ci-tabs{margin-bottom:13px}.dcc-ci-tab{min-height:42px;font-size:10.5px}.dcc-ci-count{min-width:27px;height:27px;font-size:10px}
        .dcc-ci-card{grid-template-columns:46px minmax(0,1fr) auto;gap:9px;min-height:78px;padding:10px 11px;border-radius:16px}
        .dcc-ci-avatar{width:46px;height:46px;font-size:15px}.dcc-ci-name{font-size:14px}.dcc-ci-status{margin-top:5px;padding:4px 7px;font-size:8px}.dcc-ci-open{min-height:38px;padding:0 10px;font-size:9px;border-radius:12px}.dcc-ci-open span{margin-left:5px;font-size:13px}
      }
      @media(max-width:385px){.dcc-ci-card{grid-template-columns:43px minmax(0,1fr) auto}.dcc-ci-avatar{width:43px;height:43px}.dcc-ci-open{padding:0 8px}.dcc-ci-open span{display:none}}
    `;
    document.head.appendChild(s);
  }

  function initials(name){
    return String(name||'?').trim().split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]?.toUpperCase()||'').join('')||'?';
  }

  function stateFor(client){
    const x=getData()?.checkins?.[client.id];
    if(!x || typeof x!=='object')return null;
    if(x.reviewed)return 'reviewed';
    if(x.sentAt || x.sent_at || x.created_at || x.createdAt)return 'pending';
    return null;
  }

  function records(){
    return (getData()?.clients||[]).map(client=>({client,state:stateFor(client)})).filter(x=>x.state);
  }

  function card(item){
    const c=item.client, reviewed=item.state==='reviewed';
    return `<article class="dcc-ci-card"><div class="dcc-ci-avatar">${esc(initials(c.name))}</div><div class="dcc-ci-copy"><div class="dcc-ci-name">${esc(c.name||'Cliente')}</div><div class="dcc-ci-status ${reviewed?'reviewed':'pending'}"><span class="dcc-ci-dot"></span>${reviewed?'Revisado':'Pendiente'}</div></div><button class="dcc-ci-open" onclick="reviewCheckin('${esc(c.id)}')">Ver check-in <span>›</span></button></article>`;
  }

  function renderList(mode){
    const list=document.getElementById('dccCheckinList');if(!list)return;
    const items=records().filter(x=>x.state===mode);
    list.innerHTML=items.length?items.map(card).join(''):`<div class="dcc-ci-empty">${mode==='pending'?'No hay check-ins pendientes.':'Todavía no hay check-ins revisados.'}</div>`;
  }

  window.dccCheckinTab=function(mode,btn){
    window.__dccCheckinMode=mode;
    document.querySelectorAll('.dcc-ci-tab').forEach(x=>x.classList.remove('active'));
    btn?.classList.add('active');
    renderList(mode);
  };

  function setNavActive(){
    const nav=document.getElementById('coach-nav');if(!nav)return;
    nav.querySelectorAll('button').forEach((b,i)=>b.classList.toggle('active',i===3));
  }

  function renderCheckins(){
    injectCss();
    const main=document.getElementById('coach-main');if(!main)return;
    main.className='dcc-premium-checkins';
    const all=records(), pending=all.filter(x=>x.state==='pending').length, reviewed=all.filter(x=>x.state==='reviewed').length;
    const mode=(window.__dccCheckinMode==='pending'||window.__dccCheckinMode==='reviewed')?window.__dccCheckinMode:(pending?'pending':'reviewed');
    window.__dccCheckinMode=mode;
    main.innerHTML=`<div class="dcc-ci"><div class="dcc-ci-kicker">CHECK-INS</div><header class="dcc-ci-head"><h1>Seguimiento de clientes</h1><p>Revisa el progreso y las respuestas de tus clientes.</p></header><div class="dcc-ci-tabs"><button class="dcc-ci-tab ${mode==='pending'?'active':''}" onclick="dccCheckinTab('pending',this)">Pendientes <span class="dcc-ci-count">${pending}</span></button><button class="dcc-ci-tab ${mode==='reviewed'?'active':''}" onclick="dccCheckinTab('reviewed',this)">Revisados <span class="dcc-ci-count">${reviewed}</span></button></div><div class="dcc-ci-list" id="dccCheckinList"></div></div>`;
    renderList(mode);setNavActive();
  }

  function install(){
    const current=window.showCoach;
    if(typeof current!=='function')return setTimeout(install,60);
    if(current.__dccCheckinPremium)return;
    const wrapped=function(screen){
      if(screen==='checkins'){
        window.currentScreen='checkins';
        renderCheckins();
        return;
      }
      return current.apply(this,arguments);
    };
    wrapped.__dccCheckinPremium=true;wrapped.__base=current;
    window.showCoach=wrapped;
  }

  injectCss();
  install();
  setTimeout(install,300);
  setTimeout(install,900);
})();
