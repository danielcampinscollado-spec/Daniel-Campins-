/* DCC — Mensajes premium: lista compacta + chat real dentro de la app */
(function(){
  const GOLD='#d9aa4a', GOLD2='#f0c96b';
  const esc=v=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const getData=()=>{try{return data||{}}catch(e){return window.data||{}}};

  function css(){
    if(document.getElementById('dcc-messages-premium-css'))return;
    const s=document.createElement('style');
    s.id='dcc-messages-premium-css';
    s.textContent=`
      #coach-main.dcc-premium-messages,#coach-main.dcc-premium-chat{background:radial-gradient(circle at 82% 0,rgba(224,173,76,.065),transparent 24%),#05080a!important;color:#f7f5f0!important;padding:15px 12px 96px!important}
      .dcc-msg,.dcc-chat{max-width:900px;margin:auto}.dcc-msg *,.dcc-chat *{box-sizing:border-box}
      .dcc-msg-kicker{margin:0 2px 8px;color:${GOLD2};font-size:9px;font-weight:850;letter-spacing:2.8px}
      .dcc-msg-head{margin:0 2px 15px}.dcc-msg-head h1{margin:0;font-size:29px;line-height:1.05;letter-spacing:-1px}.dcc-msg-head p{margin:7px 0 0;color:#949ca7;font-size:11.5px}
      .dcc-msg-search{height:43px;display:flex;align-items:center;gap:9px;margin-bottom:13px;padding:0 13px;border:1px solid #303840;border-radius:14px;background:linear-gradient(145deg,#0f151a,#090d10);color:#8f98a3}.dcc-msg-search svg{width:17px;height:17px;flex:none}.dcc-msg-search input{min-width:0;width:100%;border:0;outline:0;background:transparent;color:#f4f2ed;font-size:12px}.dcc-msg-search input::placeholder{color:#737c87}
      .dcc-msg-list{display:grid;gap:8px}.dcc-msg-card{display:grid;grid-template-columns:46px minmax(0,1fr) auto;align-items:center;gap:10px;min-height:78px;padding:10px 11px;border:1px solid #2a333b;border-radius:16px;background:radial-gradient(circle at 91% 10%,rgba(217,170,74,.045),transparent 29%),linear-gradient(145deg,#10161b,#080c0f);box-shadow:inset 0 1px 0 rgba(255,255,255,.02)}
      .dcc-msg-avatar{width:46px;height:46px;display:grid;place-items:center;border:1px solid rgba(217,170,74,.6);border-radius:50%;background:#0a0e11;color:${GOLD2};font-size:15px;font-weight:850}.dcc-msg-copy{min-width:0}.dcc-msg-name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#f5f3ef;font-size:14px;font-weight:820}.dcc-msg-preview{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-top:5px;color:#9099a4;font-size:10px}.dcc-msg-meta{display:flex;align-items:center;gap:8px}.dcc-msg-time{color:#7f8994;font-size:8px;white-space:nowrap}.dcc-msg-open{min-height:37px;padding:0 12px;border:1px solid rgba(183,123,19,.36);border-radius:12px;background:linear-gradient(145deg,#fffdf8 0%,#f7ead3 100%);color:#8d5b08;font-size:9px;font-weight:850;white-space:nowrap;box-shadow:0 5px 14px rgba(78,58,28,.06)}.dcc-msg-open span{margin-left:5px;font-size:13px;color:#b77b13}
      .dcc-msg-empty{padding:28px 16px;border:1px solid #29323a;border-radius:16px;background:linear-gradient(145deg,#0f1419,#080b0e);color:#8f98a3;text-align:center;font-size:11px}

      .dcc-chat-back{display:inline-flex;align-items:center;gap:7px;min-height:38px;padding:0 13px;border:1px solid rgba(217,170,74,.52);border-radius:999px;background:#0a0e11;color:#d7dce2;font-size:10px;font-weight:800}.dcc-chat-back svg{width:15px;height:15px}
      .dcc-chat-person{display:flex;align-items:center;gap:11px;margin:14px 1px 12px;padding-bottom:12px;border-bottom:1px solid #242d35}.dcc-chat-person .dcc-msg-avatar{width:50px;height:50px;font-size:16px}.dcc-chat-person-copy{min-width:0}.dcc-chat-person h1{margin:0;font-size:21px;letter-spacing:-.55px}.dcc-chat-status{display:flex;align-items:center;gap:6px;margin-top:5px;color:#8f98a3;font-size:9px}.dcc-chat-online{width:7px;height:7px;border-radius:50%;background:#5bd879;box-shadow:0 0 10px rgba(91,216,121,.4)}
      .dcc-chat-stream{display:flex;flex-direction:column;gap:8px;padding:4px 0 78px}.dcc-chat-day{display:flex;align-items:center;gap:8px;margin:5px 0;color:#747e89;font-size:8.5px}.dcc-chat-day:before,.dcc-chat-day:after{content:'';height:1px;flex:1;background:#242d35}
      .dcc-chat-row{display:flex;align-items:flex-end;gap:7px}.dcc-chat-row.mine{justify-content:flex-end}.dcc-chat-mini-avatar{width:29px;height:29px;display:grid;place-items:center;flex:none;border:1px solid rgba(217,170,74,.55);border-radius:50%;color:${GOLD2};font-size:8px;font-weight:850;background:#090d10}
      .dcc-chat-bubble{max-width:min(76%,560px);padding:10px 11px;border:1px solid #2a333b;border-radius:15px;background:linear-gradient(145deg,#11171c,#0b1014);color:#f3f1ed;font-size:11.5px;line-height:1.4;box-shadow:inset 0 1px 0 rgba(255,255,255,.02)}.dcc-chat-row.mine .dcc-chat-bubble{border-color:#b6862e;background:radial-gradient(circle at 100% 0,rgba(217,170,74,.12),transparent 42%),linear-gradient(145deg,#211a0f,#100e0a)}
      .dcc-chat-time{display:flex;justify-content:flex-end;gap:4px;margin-top:5px;color:#818b96;font-size:7.5px}.dcc-chat-row.mine .dcc-chat-time{color:#b99a57}.dcc-chat-check{color:${GOLD2}}
      .dcc-chat-none{padding:28px 15px;border:1px solid #29323a;border-radius:16px;background:linear-gradient(145deg,#0f1419,#080b0e);color:#8f98a3;text-align:center;font-size:10px}
      .dcc-chat-composer{position:sticky;bottom:70px;z-index:8;display:grid;grid-template-columns:minmax(0,1fr) 43px;gap:8px;padding:9px;border:1px solid #2a333b;border-radius:18px;background:rgba(11,15,19,.96);box-shadow:0 -10px 28px rgba(0,0,0,.38);backdrop-filter:blur(14px)}.dcc-chat-input{min-height:42px;max-height:92px;resize:none;border:1px solid #303943;border-radius:13px;background:#0b1014;color:#f5f3ee;padding:11px 12px;outline:0;font:inherit;font-size:11px;line-height:1.35}.dcc-chat-input::placeholder{color:#6f7984}.dcc-chat-send{width:43px;height:43px;display:grid;place-items:center;border:1px solid #f0c96b;border-radius:50%;background:linear-gradient(135deg,#f3cf69,#d9a73e);color:#0b0905}.dcc-chat-send svg{width:20px;height:20px}
      @media(min-width:700px){.dcc-msg-card{grid-template-columns:54px minmax(0,1fr) auto;min-height:86px;padding:12px 14px}.dcc-msg-avatar{width:54px;height:54px;font-size:18px}.dcc-msg-name{font-size:16px}.dcc-msg-preview{font-size:11px}.dcc-msg-open{min-height:40px;font-size:10px}}
    `;
    document.head.appendChild(s);
  }

  function initials(name){return String(name||'?').trim().split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]?.toUpperCase()||'').join('')||'?'}
  function clients(){return Array.isArray(getData()?.clients)?getData().clients:[]}
  function clientById(id){return clients().find(c=>String(c.id)===String(id))}
  function textOf(m){return String(m?.text??m?.message??m?.body??m?.content??m?.mensaje??'').trim()}
  function dateOf(m){const v=m?.created_at??m?.createdAt??m?.date??m?.time??m?.timestamp??m?.sentAt;const d=v?new Date(v):null;return d&&Number.isFinite(d.getTime())?d:null}
  function isMine(m){if(m?.isCoach===true||m?.outgoing===true||m?.mine===true)return true;const x=String(m?.sender??m?.from??m?.role??m?.author??'').toLowerCase();return /coach|trainer|entrenador|admin|me|daniel/.test(x)}

  function rawThread(id){
    const d=getData();
    for(const key of ['messages','chats','conversations','chatMessages']){
      const box=d?.[key];
      if(Array.isArray(box)){
        const f=box.filter(m=>String(m?.client_id??m?.clientId??m?.client??m?.user_id??'')===String(id));
        if(f.length)return f;
      }else if(box&&Array.isArray(box[id]))return box[id];
    }
    return [];
  }
  function thread(id){return rawThread(id).filter(m=>textOf(m)).slice().sort((a,b)=>(dateOf(a)?.getTime()||0)-(dateOf(b)?.getTime()||0))}
  function lastFallback(c){const t=String(c?.lastMessage??c?.last_message??c?.messagePreview??c?.preview??'').trim();return t}
  function timeFmt(d){if(!d)return'';return d.toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'})}
  function dayLabel(d){if(!d)return'';const now=new Date(),a=new Date(now.getFullYear(),now.getMonth(),now.getDate()).getTime(),b=new Date(d.getFullYear(),d.getMonth(),d.getDate()).getTime(),dif=Math.round((a-b)/86400000);if(dif===0)return'Hoy';if(dif===1)return'Ayer';return d.toLocaleDateString('es-ES',{day:'numeric',month:'short'})}

  function navActive(){const n=document.getElementById('coach-nav');if(!n)return;n.querySelectorAll('button').forEach((b,i)=>b.classList.toggle('active',i===4))}

  function card(c){const t=thread(c.id),last=t.at(-1),preview=last?textOf(last):(lastFallback(c)||'Sin mensajes'),time=timeFmt(last?dateOf(last):(c?.lastMessageAt?new Date(c.lastMessageAt):null));return `<article class="dcc-msg-card" data-name="${esc(String(c.name||'').toLowerCase())}"><div class="dcc-msg-avatar">${esc(initials(c.name))}</div><div class="dcc-msg-copy"><div class="dcc-msg-name">${esc(c.name||'Cliente')}</div><div class="dcc-msg-preview">${esc(preview)}</div></div><div class="dcc-msg-meta">${time?`<span class="dcc-msg-time">${esc(time)}</span>`:''}<button class="dcc-msg-open" onclick="dccOpenChat('${esc(c.id)}')">Abrir <span>›</span></button></div></article>`}

  function renderMessages(){css();const main=document.getElementById('coach-main');if(!main)return;main.className='dcc-premium-messages';main.innerHTML=`<div class="dcc-msg"><div class="dcc-msg-kicker">MENSAJES</div><header class="dcc-msg-head"><h1>Conversaciones</h1><p>Comunícate con tus clientes de forma rápida.</p></header><label class="dcc-msg-search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="6"/><path d="m16 16 4 4"/></svg><input id="dccMsgSearch" placeholder="Buscar conversación..." oninput="dccFilterMessages()"></label><div class="dcc-msg-list" id="dccMsgList">${clients().map(card).join('')||'<div class="dcc-msg-empty">Todavía no hay conversaciones.</div>'}</div></div>`;navActive()}

  window.dccFilterMessages=function(){const q=(document.getElementById('dccMsgSearch')?.value||'').trim().toLowerCase();document.querySelectorAll('.dcc-msg-card').forEach(x=>x.style.display=x.dataset.name.includes(q)?'grid':'none')};

  function bubble(m,c){const mine=isMine(m),d=dateOf(m);return `<div class="dcc-chat-row ${mine?'mine':''}">${mine?'':`<div class="dcc-chat-mini-avatar">${esc(initials(c.name))}</div>`}<div class="dcc-chat-bubble">${esc(textOf(m)).replace(/\n/g,'<br>')}<div class="dcc-chat-time">${d?esc(timeFmt(d)):''}${mine?'<span class="dcc-chat-check">✓✓</span>':''}</div></div></div>`}

  function groupedMessages(id,c){const t=thread(id);if(!t.length)return'<div class="dcc-chat-none">Todavía no hay mensajes. Escribe el primero abajo.</div>';let last='';return t.map(m=>{const d=dateOf(m),lab=dayLabel(d),sep=lab&&lab!==last?`<div class="dcc-chat-day"><span>${esc(lab)}</span></div>`:'';if(lab)last=lab;return sep+bubble(m,c)}).join('')}

  window.dccOpenChat=function(id){css();const c=clientById(id);if(!c)return;window.__dccOpenChat=id;const main=document.getElementById('coach-main');if(!main)return;main.className='dcc-premium-chat';main.innerHTML=`<div class="dcc-chat"><button class="dcc-chat-back" onclick="dccCloseChat()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg>Mensajes</button><header class="dcc-chat-person"><div class="dcc-msg-avatar">${esc(initials(c.name))}</div><div class="dcc-chat-person-copy"><h1>${esc(c.name||'Cliente')}</h1><div class="dcc-chat-status"><span class="dcc-chat-online"></span>Conversación activa</div></div></header><div class="dcc-chat-stream" id="dccChatStream">${groupedMessages(id,c)}</div><div class="dcc-chat-composer"><textarea id="dccChatInput" class="dcc-chat-input" rows="1" placeholder="Escribe un mensaje..." onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();dccSendMessage('${esc(id)}')}"></textarea><button class="dcc-chat-send" onclick="dccSendMessage('${esc(id)}')" aria-label="Enviar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13"/><path d="m22 2-7 20-4-9-9-4Z"/></svg></button></div></div>`;navActive();requestAnimationFrame(()=>{const s=document.getElementById('dccChatStream');if(s)s.scrollTop=s.scrollHeight})};
  window.dccCloseChat=function(){window.__dccOpenChat=null;renderMessages()};

  function writableBox(id){const d=getData();for(const key of ['messages','chats','conversations','chatMessages']){const box=d?.[key];if(box&&!Array.isArray(box)&&Array.isArray(box[id]))return box[id]}if(!d.messages||Array.isArray(d.messages))d.messages={};if(!Array.isArray(d.messages[id]))d.messages[id]=[];return d.messages[id]}
  window.dccSendMessage=function(id){const input=document.getElementById('dccChatInput'),txt=input?.value.trim();if(!txt)return;writableBox(id).push({text:txt,sender:'coach',isCoach:true,created_at:new Date().toISOString()});try{if(typeof saveData==='function')saveData()}catch(e){console.error(e)}window.dccOpenChat(id)};

  function install(){const current=window.showCoach;if(typeof current!=='function')return setTimeout(install,60);if(current.__dccMessagesPremium)return;const wrapped=function(screen){if(screen==='messages'){window.currentScreen='messages';window.__dccOpenChat=null;renderMessages();return}return current.apply(this,arguments)};wrapped.__dccMessagesPremium=true;wrapped.__base=current;window.showCoach=wrapped}

  css();install();setTimeout(install,300);setTimeout(install,900);
})();