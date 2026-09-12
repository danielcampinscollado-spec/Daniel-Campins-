/* DCC — Check-ins premium compactos + revisión coherente */
(function(){
  const GOLD='#d9aa4a', GOLD2='#f0c96b';
  const esc=v=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const getData=()=>{try{return data||{}}catch(e){return window.data||{}}};
  const num=v=>{const n=parseFloat(String(v??'').replace(',','.'));return Number.isFinite(n)?n:null};

  function injectCss(){
    if(document.getElementById('dcc-checkin-premium-css'))return;
    const s=document.createElement('style');
    s.id='dcc-checkin-premium-css';
    s.textContent=`
      #coach-main.dcc-premium-checkins{background:radial-gradient(circle at 82% 0,rgba(224,173,76,.075),transparent 26%),radial-gradient(circle at 12% 38%,rgba(224,173,76,.035),transparent 30%),#05080a!important;color:#f7f5f0!important;padding:18px 14px 96px!important}
      .dcc-ci{max-width:900px;margin:auto}.dcc-ci *{box-sizing:border-box}
      .dcc-ci-kicker{margin:0 2px 9px;color:${GOLD2};font-size:10px;font-weight:850;letter-spacing:3px}
      .dcc-ci-head{margin:0 2px 18px}.dcc-ci-head h1{margin:0;font-size:31px;line-height:1.05;letter-spacing:-1px}.dcc-ci-head p{margin:8px 0 0;color:#949ca7;font-size:13px;line-height:1.4}
      .dcc-ci-tabs{display:grid;grid-template-columns:1fr 1fr;gap:4px;margin-bottom:16px;padding:4px;border:1px solid #303840;border-radius:18px;background:#090d10}
      .dcc-ci-tab{min-height:44px;display:flex;align-items:center;justify-content:center;gap:9px;border:1px solid transparent;border-radius:14px;background:transparent;color:#9ca4ae;font-size:12px;font-weight:850}
      .dcc-ci-tab.active{border-color:rgba(240,201,107,.65);background:radial-gradient(circle at 55% 50%,rgba(217,170,74,.22),rgba(20,16,10,.82));color:${GOLD2};box-shadow:inset 0 1px 0 rgba(255,255,255,.025)}
      .dcc-ci-count{min-width:29px;height:29px;display:grid;place-items:center;border-radius:50%;background:#1d2227;color:#aeb5bf;font-size:11px}.dcc-ci-tab.active .dcc-ci-count{background:rgba(217,170,74,.20);color:${GOLD2}}
      .dcc-ci-list{display:grid;gap:9px}.dcc-ci-card{display:grid;grid-template-columns:54px minmax(0,1fr) auto;align-items:center;gap:12px;min-height:88px;padding:12px 14px;border:1px solid #2a333b;border-radius:18px;background:radial-gradient(circle at 92% 15%,rgba(217,170,74,.055),transparent 28%),linear-gradient(145deg,#10161b,#080c0f);box-shadow:inset 0 1px 0 rgba(255,255,255,.02)}
      .dcc-ci-avatar{width:54px;height:54px;display:grid;place-items:center;border:1px solid rgba(217,170,74,.58);border-radius:50%;background:#0a0e11;color:${GOLD2};font-size:18px;font-weight:850;letter-spacing:.4px}
      .dcc-ci-copy{min-width:0}.dcc-ci-name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#f4f2ed;font-size:16px;font-weight:800;letter-spacing:-.15px}
      .dcc-ci-status{display:inline-flex;align-items:center;gap:5px;margin-top:7px;padding:5px 8px;border-radius:999px;font-size:9px;font-weight:800}.dcc-ci-status.pending{border:1px solid rgba(217,170,74,.18);background:rgba(217,170,74,.10);color:${GOLD2}}.dcc-ci-status.reviewed{border:1px solid rgba(72,190,119,.18);background:rgba(72,190,119,.09);color:#62d98d}.dcc-ci-dot{width:6px;height:6px;border-radius:50%;background:currentColor}
      .dcc-ci-open{min-height:42px;padding:0 13px;border:1px solid ${GOLD2};border-radius:13px;background:linear-gradient(145deg,#18140c,#0a0b0c);color:${GOLD2};font-size:10px;font-weight:850;white-space:nowrap}.dcc-ci-open span{margin-left:7px;font-size:15px;vertical-align:-1px}.dcc-ci-empty{padding:28px 16px;border:1px solid #29323a;border-radius:18px;background:linear-gradient(145deg,#0f1419,#080b0e);color:#8f98a3;text-align:center;font-size:11px}

      .dcc-ci-modal{position:fixed;inset:0;z-index:99995;display:flex;align-items:center;justify-content:center;padding:22px 14px 100px;background:rgba(0,0,0,.72);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}
      .dcc-ci-review{width:min(680px,100%);max-height:min(720px,78vh);overflow:auto;padding:18px;border:1px solid rgba(240,201,107,.9);border-radius:24px;background:radial-gradient(circle at 95% 0,rgba(224,173,76,.12),transparent 30%),radial-gradient(circle at 0 25%,rgba(224,173,76,.05),transparent 28%),linear-gradient(155deg,#141a20,#080c0f 70%);box-shadow:0 28px 80px #000b,inset 0 1px 0 rgba(255,255,255,.035),0 0 28px rgba(224,173,76,.08)}
      .dcc-ci-review-head{display:grid;grid-template-columns:minmax(0,1fr) 42px;gap:10px;align-items:start}.dcc-ci-review-head h2{margin:0;color:#f6f3ed;font-size:24px;line-height:1.08;letter-spacing:-.6px}.dcc-ci-review-sub{display:flex;align-items:center;gap:7px;margin-top:7px;color:#98a1ac;font-size:11px}.dcc-ci-close{width:42px;height:42px;border:1px solid rgba(217,170,74,.55);border-radius:14px;background:#101216;color:${GOLD2};font-size:22px;line-height:1}
      .dcc-ci-review-list{display:grid;gap:8px;margin-top:16px}.dcc-ci-review-row{display:grid;grid-template-columns:42px minmax(0,1fr) auto;align-items:center;gap:11px;min-height:72px;padding:11px 12px;border:1px solid #29333b;border-radius:15px;background:linear-gradient(145deg,#0d1317,#090d10)}
      .dcc-ci-rico{width:42px;height:42px;display:grid;place-items:center;border:1px solid rgba(217,170,74,.27);border-radius:12px;background:linear-gradient(145deg,rgba(217,170,74,.13),rgba(217,170,74,.035));color:${GOLD2};font-size:20px}.dcc-ci-rico svg{width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
      .dcc-ci-rlabel{color:#929ba6;font-size:10px}.dcc-ci-rvalue{margin-top:3px;color:#f4f2ed;font-size:14px;font-weight:780;line-height:1.3}.dcc-ci-rside{max-width:150px;color:#9ca5af;font-size:9px;text-align:right;line-height:1.35}.dcc-ci-rside.good{color:#55d9a0}.dcc-ci-rside.bad{color:#ff656d}
      .dcc-ci-review-row.comment{grid-template-columns:42px minmax(0,1fr)}.dcc-ci-review-row.comment .dcc-ci-rside{display:none}
      .dcc-ci-reviewed{display:flex;align-items:center;gap:10px;margin-top:13px;padding:12px 14px;border:1px solid rgba(75,193,123,.36);border-radius:14px;background:linear-gradient(145deg,rgba(41,128,78,.18),rgba(10,28,18,.45));color:#65df98;font-size:13px;font-weight:800}.dcc-ci-reviewed i{width:28px;height:28px;display:grid;place-items:center;border:1px solid #51c986;border-radius:50%;font-style:normal}
      .dcc-ci-mark{width:100%;min-height:48px;margin-top:13px;border:1px solid #f3cf69;border-radius:14px;background:linear-gradient(135deg,#f3cf69,#d9a63d);color:#0b0a07;font-size:13px;font-weight:900}

      html.dcc-theme-light-premium #coach-main.dcc-premium-checkins{background:radial-gradient(circle at 88% 0,rgba(214,163,61,.10),transparent 26%),linear-gradient(180deg,#fffaf1 0%,#f5efe4 62%,#f1e9dc 100%)!important;color:#17191d!important}
      html.dcc-theme-light-premium .dcc-ci-head h1,html.dcc-theme-light-premium .dcc-ci-name{color:#17191d!important}
      html.dcc-theme-light-premium .dcc-ci-head p{color:#657080!important}
      html.dcc-theme-light-premium .dcc-ci-tabs,html.dcc-theme-light-premium .dcc-ci-card,html.dcc-theme-light-premium .dcc-ci-empty{background:#fffefa!important;color:#17191d!important;border-color:rgba(185,122,17,.30)!important}
      html.dcc-theme-light-premium .dcc-ci-tab{color:#68717e!important}
      html.dcc-theme-light-premium .dcc-ci-tab.active{background:linear-gradient(145deg,#fff2c5,#edc45d)!important;color:#1d1608!important;border-color:#d6a53d!important}
      html.dcc-theme-light-premium .dcc-ci-avatar{background:#fff7e4!important;color:#a46b0b!important;border-color:rgba(185,122,17,.38)!important}
      html.dcc-theme-light-premium .dcc-ci-open{background:#fffaf1!important;color:#98640b!important;border-color:rgba(185,122,17,.42)!important}
      html.dcc-theme-light-premium .dcc-ci-review{background:linear-gradient(145deg,#fffefa,#f8f1e5)!important;color:#17191d!important;border-color:rgba(185,122,17,.42)!important;box-shadow:0 28px 80px rgba(72,52,19,.20)!important}
      html.dcc-theme-light-premium .dcc-ci-review-head h2,html.dcc-theme-light-premium .dcc-ci-rvalue{color:#17191d!important}
      html.dcc-theme-light-premium .dcc-ci-review-sub,html.dcc-theme-light-premium .dcc-ci-rlabel,html.dcc-theme-light-premium .dcc-ci-rside{color:#68717e!important}
      html.dcc-theme-light-premium .dcc-ci-close{background:#fffaf1!important;color:#98640b!important;border-color:rgba(185,122,17,.42)!important}
      html.dcc-theme-light-premium .dcc-ci-review-row{background:#fffaf1!important;color:#17191d!important;border-color:rgba(185,122,17,.24)!important}
      html.dcc-theme-light-premium .dcc-ci-rico{background:#fff7e4!important;color:#b77b13!important;border-color:rgba(185,122,17,.24)!important}

      html.dcc-theme-light-premium #coach-main.dcc-premium-checkins{background:radial-gradient(circle at 88% 0,rgba(214,163,61,.10),transparent 26%),linear-gradient(180deg,#fffaf1 0%,#f5efe4 62%,#f1e9dc 100%)!important;color:#17191d!important}
      html.dcc-theme-light-premium .dcc-ci-head h1,html.dcc-theme-light-premium .dcc-ci-name{color:#17191d!important}
      html.dcc-theme-light-premium .dcc-ci-head p{color:#657080!important}
      html.dcc-theme-light-premium .dcc-ci-tabs,html.dcc-theme-light-premium .dcc-ci-card,html.dcc-theme-light-premium .dcc-ci-empty{background:#fffefa!important;color:#17191d!important;border-color:rgba(185,122,17,.30)!important}
      html.dcc-theme-light-premium .dcc-ci-tab{color:#68717e!important}
      html.dcc-theme-light-premium .dcc-ci-tab.active{background:linear-gradient(145deg,#fff2c5,#edc45d)!important;color:#1d1608!important;border-color:#d6a53d!important}
      html.dcc-theme-light-premium .dcc-ci-avatar{background:#fff7e4!important;color:#a46b0b!important;border-color:rgba(185,122,17,.38)!important}
      html.dcc-theme-light-premium .dcc-ci-open{background:#fffaf1!important;color:#98640b!important;border-color:rgba(185,122,17,.42)!important}
      html.dcc-theme-light-premium .dcc-ci-review{background:linear-gradient(145deg,#fffefa,#f8f1e5)!important;color:#17191d!important;border-color:rgba(185,122,17,.42)!important;box-shadow:0 28px 80px rgba(72,52,19,.20)!important}
      html.dcc-theme-light-premium .dcc-ci-review-head h2,html.dcc-theme-light-premium .dcc-ci-rvalue{color:#17191d!important}
      html.dcc-theme-light-premium .dcc-ci-review-sub,html.dcc-theme-light-premium .dcc-ci-rlabel,html.dcc-theme-light-premium .dcc-ci-rside{color:#68717e!important}
      html.dcc-theme-light-premium .dcc-ci-close{background:#fffaf1!important;color:#98640b!important;border-color:rgba(185,122,17,.42)!important}
      html.dcc-theme-light-premium .dcc-ci-review-row{background:#fffaf1!important;color:#17191d!important;border-color:rgba(185,122,17,.24)!important}
      html.dcc-theme-light-premium .dcc-ci-rico{background:#fff7e4!important;color:#b77b13!important;border-color:rgba(185,122,17,.24)!important}
      @media(max-width:600px){#coach-main.dcc-premium-checkins{padding:14px 12px 92px!important}.dcc-ci-kicker{font-size:9px;letter-spacing:2.7px}.dcc-ci-head{margin-bottom:15px}.dcc-ci-head h1{font-size:28px}.dcc-ci-head p{font-size:11.5px}.dcc-ci-tabs{margin-bottom:13px}.dcc-ci-tab{min-height:42px;font-size:10.5px}.dcc-ci-count{min-width:27px;height:27px;font-size:10px}.dcc-ci-card{grid-template-columns:46px minmax(0,1fr) auto;gap:9px;min-height:78px;padding:10px 11px;border-radius:16px}.dcc-ci-avatar{width:46px;height:46px;font-size:15px}.dcc-ci-name{font-size:14px}.dcc-ci-status{margin-top:5px;padding:4px 7px;font-size:8px}.dcc-ci-open{min-height:38px;padding:0 10px;font-size:9px;border-radius:12px}.dcc-ci-open span{margin-left:5px;font-size:13px}.dcc-ci-modal{padding:14px 12px 92px}.dcc-ci-review{padding:14px;border-radius:20px;max-height:78vh}.dcc-ci-review-head h2{font-size:20px}.dcc-ci-review-row{grid-template-columns:37px minmax(0,1fr) auto;min-height:66px;padding:9px 10px;gap:9px}.dcc-ci-rico{width:37px;height:37px}.dcc-ci-rico svg{width:19px;height:19px}.dcc-ci-rvalue{font-size:12px}.dcc-ci-rside{max-width:108px;font-size:8px}}
      @media(max-width:385px){.dcc-ci-card{grid-template-columns:43px minmax(0,1fr) auto}.dcc-ci-avatar{width:43px;height:43px}.dcc-ci-open{padding:0 8px}.dcc-ci-open span{display:none}.dcc-ci-review-row{grid-template-columns:35px minmax(0,1fr)}.dcc-ci-rside{grid-column:2;text-align:left;max-width:none}.dcc-ci-review-row.comment{grid-template-columns:35px minmax(0,1fr)}}
    `;
    document.head.appendChild(s);
  }

  const icons={
    weight:'<svg viewBox="0 0 24 24"><path d="M8 8.5V6a4 4 0 0 1 8 0v2.5"/><path d="M7 8.5h10l2.3 11.5H4.7L7 8.5Z"/></svg>',
    fat:'<svg viewBox="0 0 24 24"><circle cx="7.5" cy="7.5" r="2.5"/><circle cx="16.5" cy="16.5" r="2.5"/><path d="M18 5 6 19"/></svg>',
    food:'<svg viewBox="0 0 24 24"><path d="M6 3v7M3.8 3v5a2.2 2.2 0 0 0 4.4 0V3M6 10v11M15 3v18M15 8c3 0 4-2 4-5v18"/></svg>',
    train:'<svg viewBox="0 0 24 24"><path d="M3 9v6M6 7v10M9 10h6M15 7v10M18 9v6M1 10v4M23 10v4"/></svg>',
    comment:'<svg viewBox="0 0 24 24"><path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.7 8.7 0 0 1-4-.9L4 20l1.4-3.4A7.3 7.3 0 0 1 4 11.5 7.5 7.5 0 0 1 12 4a7.5 7.5 0 0 1 8 7.5Z"/></svg>'
  };
  function initials(name){return String(name||'?').trim().split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]?.toUpperCase()||'').join('')||'?'}
  function stateFor(client){const x=getData()?.checkins?.[client.id];if(!x||typeof x!=='object')return null;if(x.reviewed)return'reviewed';if(x.sentAt||x.sent_at||x.created_at||x.createdAt)return'pending';return null}
  function records(){return(getData()?.clients||[]).map(client=>({client,state:stateFor(client)})).filter(x=>x.state)}
  function card(item){const c=item.client,reviewed=item.state==='reviewed';return`<article class="dcc-ci-card"><div class="dcc-ci-avatar">${esc(initials(c.name))}</div><div class="dcc-ci-copy"><div class="dcc-ci-name">${esc(c.name||'Cliente')}</div><div class="dcc-ci-status ${reviewed?'reviewed':'pending'}"><span class="dcc-ci-dot"></span>${reviewed?'Revisado':'Pendiente'}</div></div><button class="dcc-ci-open" onclick="reviewCheckin('${esc(c.id)}')">Ver check-in <span>›</span></button></article>`}
  function renderList(mode){const list=document.getElementById('dccCheckinList');if(!list)return;const items=records().filter(x=>x.state===mode);list.innerHTML=items.length?items.map(card).join(''):`<div class="dcc-ci-empty">${mode==='pending'?'No hay check-ins pendientes.':'Todavía no hay check-ins revisados.'}</div>`}
  window.dccCheckinTab=function(mode,btn){window.__dccCheckinMode=mode;document.querySelectorAll('.dcc-ci-tab').forEach(x=>x.classList.remove('active'));btn?.classList.add('active');renderList(mode)};
  function setNavActive(){const nav=document.getElementById('coach-nav');if(!nav)return;nav.querySelectorAll('button').forEach((b,i)=>b.classList.toggle('active',i===3))}
  function renderCheckins(){injectCss();const main=document.getElementById('coach-main');if(!main)return;main.className='dcc-premium-checkins';const all=records(),pending=all.filter(x=>x.state==='pending').length,reviewed=all.filter(x=>x.state==='reviewed').length;const mode=(window.__dccCheckinMode==='pending'||window.__dccCheckinMode==='reviewed')?window.__dccCheckinMode:(pending?'pending':'reviewed');window.__dccCheckinMode=mode;main.innerHTML=`<div class="dcc-ci"><div class="dcc-ci-kicker">CHECK-INS</div><header class="dcc-ci-head"><h1>Seguimiento de clientes</h1><p>Revisa el progreso y las respuestas de tus clientes.</p></header><div class="dcc-ci-tabs"><button class="dcc-ci-tab ${mode==='pending'?'active':''}" onclick="dccCheckinTab('pending',this)">Pendientes <span class="dcc-ci-count">${pending}</span></button><button class="dcc-ci-tab ${mode==='reviewed'?'active':''}" onclick="dccCheckinTab('reviewed',this)">Revisados <span class="dcc-ci-count">${reviewed}</span></button></div><div class="dcc-ci-list" id="dccCheckinList"></div></div>`;renderList(mode);setNavActive()}

  function pick(o,keys,fallback=''){for(const k of keys){const v=o?.[k];if(v!==undefined&&v!==null&&String(v).trim()!=='')return v}return fallback}
  function previousWeight(id,current){const a=getData()?.weights?.[id];if(!Array.isArray(a)||!a.length)return null;const vals=a.map(x=>num(typeof x==='object'?(x.weight??x.value??x.peso):x)).filter(v=>v!=null);if(!vals.length)return null;for(let i=vals.length-1;i>=0;i--)if(current==null||Math.abs(vals[i]-current)>.01)return vals[i];return null}
  function reviewRow(icon,label,value,side='',sideClass='',comment=false){return`<div class="dcc-ci-review-row${comment?' comment':''}"><div class="dcc-ci-rico">${icons[icon]}</div><div><div class="dcc-ci-rlabel">${esc(label)}</div><div class="dcc-ci-rvalue">${esc(value||'—')}</div></div>${comment?'':`<div class="dcc-ci-rside ${sideClass}">${side}</div>`}</div>`}
  function closeReview(){document.getElementById('dcc-ci-modal')?.remove()}
  window.dccCloseCheckinReview=closeReview;
  window.dccMarkCheckinReviewed=function(id){const d=getData(),x=d?.checkins?.[id];if(!x)return;x.reviewed=true;x.reviewedAt=new Date().toISOString();try{if(typeof saveData==='function')saveData()}catch(e){console.error(e)}closeReview();window.__dccCheckinMode='reviewed';renderCheckins()};

  function openReview(id){
    injectCss();const d=getData(),client=(d.clients||[]).find(c=>String(c.id)===String(id)),x=d?.checkins?.[id];if(!client||!x)return;
    const w=num(pick(x,['weight','peso','currentWeight','current_weight'],pick(client,['weight','peso'],''))),fat=num(pick(x,['bodyFat','body_fat','fat','fatPct','fat_pct','grasa','porcentajeGrasa'],''));
    const food=pick(x,['nutrition','alimentacion','food','diet','dietFeedback','nutritionFeedback','foodStatus'],'Pendiente');
    const train=pick(x,['training','entrenamiento','trainingFeedback','workout','trainingStatus'],'Pendiente');
    const comment=pick(x,['comment','comentario','notes','note','feedback','message'],'Pendiente de revisión.');
    const prev=previousWeight(id,w),delta=w!=null&&prev!=null?w-prev:null;
    const wSide=delta==null?'':`${delta>0?'↗ +':'↘ '}${Math.abs(delta).toFixed(1).replace('.',',')} kg<br><span style="color:#8f98a3">desde el anterior</span>`;
    const modal=document.createElement('div');modal.id='dcc-ci-modal';modal.className='dcc-ci-modal';modal.innerHTML=`<section class="dcc-ci-review"><header class="dcc-ci-review-head"><div><h2>Check-in · ${esc(client.name||'Cliente')}</h2><div class="dcc-ci-review-sub">◌ &nbsp; Revisión de información</div></div><button class="dcc-ci-close" onclick="dccCloseCheckinReview()">×</button></header><div class="dcc-ci-review-list">${reviewRow('weight','Peso',w!=null?`${String(w).replace('.',',')} kg`:'—',wSide,delta==null?'':delta>0?'good':'bad')}${reviewRow('fat','% de grasa',fat!=null?`${String(fat).replace('.',',')} %`:'—',fat==null?'Sin registro':'','')}${reviewRow('food','Alimentación',food,String(food).toLowerCase()==='pendiente'?'◷  Pendiente':'','')}${reviewRow('train','Entrenamiento',train,String(train).toLowerCase()==='pendiente'?'◷  Pendiente':'','')}${reviewRow('comment','Comentario',comment,'','',true)}</div>${x.reviewed?'<div class="dcc-ci-reviewed"><i>✓</i> Check-in revisado</div>':`<button class="dcc-ci-mark" onclick="dccMarkCheckinReviewed('${esc(id)}')">✓ &nbsp; Marcar como revisado</button>`}</section>`;modal.addEventListener('click',e=>{if(e.target===modal)closeReview()});document.body.appendChild(modal)
  }

  function install(){
    const current=window.showCoach;if(typeof current!=='function')return setTimeout(install,60);if(!current.__dccCheckinPremium){const wrapped=function(screen){if(screen==='checkins'){window.currentScreen='checkins';renderCheckins();return}return current.apply(this,arguments)};wrapped.__dccCheckinPremium=true;wrapped.__base=current;window.showCoach=wrapped}
    if(!window.reviewCheckin?.__dccPremiumReview){const review=function(id){openReview(id)};review.__dccPremiumReview=true;window.reviewCheckin=review}
  }
  injectCss();install();setTimeout(install,300);setTimeout(install,900);
})();
