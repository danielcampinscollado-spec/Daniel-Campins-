/* DCC — Cliente: mensajería premium */
(function(){
  'use strict';

  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function appData(){
    try{return data||{}}catch(e){return window.data||{}}
  }
  function activeClientId(){
    try{return currentClientId||null}catch(e){return window.currentClientId||null}
  }
  function clientById(id){
    return (appData().clients||[]).find(c=>String(c.id)===String(id))||null;
  }
  function database(){
    try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient}catch(e){}
    return window.supabaseClient||null;
  }
  function persistLocal(){
    try{
      if(typeof saveData==='function')return saveData();
      if(typeof window.saveData==='function')return window.saveData();
    }catch(e){console.error('DCC saveData:',e)}
  }
  function toastSafe(text){
    try{
      if(typeof toast==='function')return toast(text);
      if(typeof window.toast==='function')return window.toast(text);
    }catch(e){}
    console.log(text);
  }
  function injectCss(){
    let old=document.getElementById('dcc-client-checkin-messages-v1-css');
    if(old)old.remove();
    const s=document.createElement('style');
    s.id='dcc-client-checkin-messages-v1-css';
    s.textContent=`
      /* ================= MENSAJES CLIENTE ================= */
      #client-main.dcc-client-messages-v1{
        background:radial-gradient(circle at 88% 0%,rgba(208,153,48,.10),transparent 25%),linear-gradient(180deg,#fffaf1 0%,#f7f0e4 58%,#f2e9db 100%)!important;
        color:#17191d!important;padding:0 14px!important;height:calc(100dvh - 86px)!important;min-height:0!important;overflow:hidden!important
      }
      .dcc-cm{max-width:820px;height:100%;margin:0 auto;display:flex;flex-direction:column;overflow:hidden}.dcc-cm *{box-sizing:border-box}
      .dcc-cm-kicker{margin:0 0 8px;color:#a66d0d;font-size:11px;line-height:1;font-weight:850;letter-spacing:3.2px;text-transform:uppercase}
      .dcc-cm-person{display:flex;align-items:center;gap:11px;margin:0 0 10px;padding:0 0 11px;border-bottom:1px solid rgba(183,123,19,.18)}
      .dcc-cm-avatar{width:45px;height:45px;display:grid;place-items:center;border:1px solid rgba(183,123,19,.42);border-radius:50%;background:linear-gradient(145deg,#fff8e9,#f8e8c6);color:#a66d0d;font-size:14px;font-weight:850;box-shadow:0 6px 16px rgba(78,58,28,.06)}
      .dcc-cm-person h1{margin:0!important;color:#17191d!important;font-family:inherit!important;font-size:20px!important;line-height:1.05!important;font-weight:800!important;letter-spacing:-.45px!important}
      .dcc-cm-role{display:flex;align-items:center;gap:6px;margin-top:4px;color:#707782;font-size:10px}.dcc-cm-dot{width:6px;height:6px;border-radius:50%;background:#49b977;box-shadow:0 0 8px rgba(73,185,119,.25)}
      .dcc-cm-stream{display:flex;flex:1 1 auto;min-height:0;flex-direction:column;gap:8px;padding:3px 0 88px;overflow-y:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;scrollbar-width:none}.dcc-cm-stream::-webkit-scrollbar{display:none}
      .dcc-cm-day{display:flex;align-items:center;gap:8px;margin:5px 0;color:#8a919b;font-size:8.5px}.dcc-cm-day:before,.dcc-cm-day:after{content:'';height:1px;flex:1;background:rgba(183,123,19,.16)}
      .dcc-cm-row{display:flex;align-items:flex-end;gap:7px}.dcc-cm-row.mine{justify-content:flex-end}
      .dcc-cm-mini{width:28px;height:28px;display:grid;place-items:center;flex:none;border:1px solid rgba(183,123,19,.35);border-radius:50%;background:#fff8e9;color:#a66d0d;font-size:8px;font-weight:850}
      .dcc-cm-bubble{max-width:min(78%,560px);padding:10px 11px;border:1px solid rgba(183,123,19,.18);border-radius:16px;background:linear-gradient(145deg,#fffefa,#fbf5eb);color:#30343a;font-size:12px;line-height:1.42;box-shadow:0 6px 18px rgba(78,58,28,.05)}
      .dcc-cm-row.mine .dcc-cm-bubble{border-color:rgba(183,123,19,.34);background:linear-gradient(145deg,#fff4d8,#f6dfaa);color:#211b11}
      .dcc-cm-time{display:flex;justify-content:flex-end;gap:4px;margin-top:5px;color:#8a919b;font-size:7.5px}.dcc-cm-row.mine .dcc-cm-time{color:#8c691f}.dcc-cm-check{color:#a66d0d}
      .dcc-cm-empty{padding:28px 15px;border:1px solid rgba(183,123,19,.24);border-radius:21px;background:linear-gradient(145deg,#fffefa,#fbf5eb);color:#707782;text-align:center;font-size:11px;box-shadow:0 10px 26px rgba(78,58,28,.07)}
      .dcc-cm-composer{position:fixed;left:50%;bottom:calc(88px + env(safe-area-inset-bottom));z-index:90;width:min(790px,calc(100vw - 26px));transform:translateX(-50%);display:grid;grid-template-columns:minmax(0,1fr) 45px;gap:8px;padding:9px;border:1px solid rgba(183,123,19,.34);border-radius:19px;background:rgba(255,253,248,.97);box-shadow:0 -8px 26px rgba(78,58,28,.10);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px)}
      .dcc-cm-input{min-height:44px;max-height:105px;resize:none;border:1px solid rgba(183,123,19,.18);border-radius:13px;background:#fffdfa;color:#17191d;padding:11px 12px;outline:0;font-size:16px!important;line-height:1.35;-webkit-text-size-adjust:100%;touch-action:manipulation}.dcc-cm-input::placeholder{color:#9298a1}.dcc-cm-input:focus{border-color:rgba(183,123,19,.55);box-shadow:none}
      .dcc-cm-send{width:45px;height:45px;display:grid;place-items:center;border:1px solid #c58a20;border-radius:50%;background:linear-gradient(135deg,#f3cf69,#d9a73e);color:#17120a;font-size:19px}.dcc-cm-send:disabled{opacity:.45}

      /* El chat premium del entrenador también mantiene el compositor abajo y evita zoom en iPhone. */
      html body #coach #coach-main.dcc-premium-chat .dcc-chat{padding-bottom:110px!important}
      html body #coach #coach-main.dcc-premium-chat .dcc-chat-composer{position:fixed!important;left:50%!important;right:auto!important;bottom:calc(80px + env(safe-area-inset-bottom))!important;z-index:95!important;width:min(790px,calc(100vw - 26px))!important;transform:translateX(-50%)!important}
      html body #coach #coach-main.dcc-premium-chat .dcc-chat-input{font-size:16px!important;-webkit-text-size-adjust:100%!important}

      @media(max-width:430px){
        #client-main.dcc-client-messages-v1{padding-left:12px!important;padding-right:12px!important}
        .dcc-cc-head{margin-bottom:14px}.dcc-cc-sub{font-size:11.5px}.dcc-cc-card{padding:11px;border-radius:18px}.dcc-cc-card-head{margin-bottom:9px}.dcc-cc-data-grid{gap:7px}.dcc-cc-data{padding:9px 7px}.dcc-cc-data-icon{width:32px;height:32px;min-width:32px;font-size:16px}.dcc-cc-data-label{font-size:7.6px}.dcc-cc-data-value{font-size:18px}.dcc-cc-update{min-height:34px;margin-top:9px;padding:0 8px;font-size:8.8px}.dcc-cc-row{grid-template-columns:105px minmax(0,1fr);gap:7px}.dcc-cc-row-name{font-size:10px}.dcc-cc-row-ico{width:21px;font-size:16px}.dcc-cc-option{min-height:33px;font-size:8.8px}.dcc-cc-comment{min-height:92px}.dcc-cc-send{min-height:50px;font-size:14px}
        .dcc-cm-bubble{max-width:82%;font-size:11.5px}.dcc-cm-composer{width:calc(100vw - 24px)}
      }
      @media(min-width:850px){
        .dcc-cm-composer{left:calc(50% + 120px);width:min(760px,calc(100vw - 300px))}
        html body #coach #coach-main.dcc-premium-chat .dcc-chat-composer{left:calc(50% + 120px)!important;width:min(760px,calc(100vw - 300px))!important}
      }
    `;
    document.head.appendChild(s);
  }

  // Check-in V1 retired; V4 owns rendering.

  function msgText(m){return String(Array.isArray(m)?(m[1]??''):(m?.text??m?.message??m?.body??m?.content??'')).trim()}
  function msgSender(m){return String(Array.isArray(m)?(m[0]??''):(m?.sender??m?.from??m?.role??m?.author??''))}
  function msgDate(m){const v=Array.isArray(m)?m[2]:(m?.created_at??m?.createdAt??m?.date??m?.time??m?.timestamp);const d=v?new Date(v):null;return d&&Number.isFinite(d.getTime())?d:null}
  function msgIsCoach(m){return /daniel|coach|trainer|entrenador|admin/i.test(msgSender(m))||(m&&!Array.isArray(m)&&(m.isCoach===true||m.mine===false&&/coach/i.test(String(m.role||''))))}
  function thread(id){const a=appData().messages?.[id];return Array.isArray(a)?a.filter(m=>msgText(m)).slice().sort((x,y)=>(msgDate(x)?.getTime()||0)-(msgDate(y)?.getTime()||0)):[]}
  function timeFmt(d){return d?d.toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'}):''}
  function dayFmt(d){if(!d)return'';const now=new Date();const today=new Date(now.getFullYear(),now.getMonth(),now.getDate()).getTime();const day=new Date(d.getFullYear(),d.getMonth(),d.getDate()).getTime();const dif=Math.round((today-day)/86400000);if(dif===0)return'Hoy';if(dif===1)return'Ayer';return d.toLocaleDateString('es-ES',{day:'numeric',month:'short'})}

  function messageBubble(m){
    const coach=msgIsCoach(m);const d=msgDate(m);
    return `<div class="dcc-cm-row ${coach?'':'mine'}">${coach?'<div class="dcc-cm-mini">DC</div>':''}<div class="dcc-cm-bubble">${esc(msgText(m)).replace(/\n/g,'<br>')}<div class="dcc-cm-time">${esc(timeFmt(d))}${coach?'':'<span class="dcc-cm-check">✓✓</span>'}</div></div></div>`;
  }
  function scrollClientChatToBottom(smooth=false){
    const stream=document.getElementById('dccClientMessageStream');if(!stream)return;
    requestAnimationFrame(()=>{stream.scrollTo({top:stream.scrollHeight,behavior:smooth?'smooth':'auto'});});
  }

  function messagesHtml(id){
    const t=thread(id);if(!t.length)return'<div class="dcc-cm-empty">Todavía no hay mensajes. Puedes escribirle a tu entrenador abajo.</div>';
    let last='';return t.map(m=>{const label=dayFmt(msgDate(m));const sep=label&&label!==last?`<div class="dcc-cm-day"><span>${esc(label)}</span></div>`:'';if(label)last=label;return sep+messageBubble(m)}).join('');
  }
  function refreshClientThread(id){
    const stream=document.getElementById('dccClientMessageStream');if(!stream)return;
    const follow=stream.scrollHeight-stream.scrollTop-stream.clientHeight<90;
    stream.innerHTML=messagesHtml(id);
    if(follow)scrollClientChatToBottom(false);
  }

  async function syncMessages(){
    const db=database();if(!db)return false;
    try{
      const {data:rows,error}=await db.from('client_messages').select('client_id,sender,message,created_at').order('created_at',{ascending:true});
      if(error)throw error;
      const d=appData(),next={};(d.clients||[]).forEach(c=>next[c.id]=[]);
      (rows||[]).forEach(r=>{if(!next[r.client_id])next[r.client_id]=[];next[r.client_id].push([r.sender||'',r.message||'',r.created_at||null])});
      d.messages=next;persistLocal();return true;
    }catch(e){console.error('DCC sync mensajes:',e);return false}
  }

  function renderClientMessages(){
    injectCss();const main=document.getElementById('client-main');const id=activeClientId();if(!main||!id)return;
    main.className='dcc-client-messages-v1';
    main.innerHTML=`<div class="dcc-cm"><div class="dcc-cm-kicker">MENSAJES</div><header class="dcc-cm-person"><div class="dcc-cm-avatar">DC</div><div><h1>Daniel</h1><div class="dcc-cm-role"><span class="dcc-cm-dot"></span>Tu entrenador</div></div></header><div class="dcc-cm-stream" id="dccClientMessageStream">${messagesHtml(id)}</div></div><div class="dcc-cm-composer"><textarea id="dccClientMessageInput" class="dcc-cm-input" rows="1" placeholder="Escribe un mensaje..." onfocus="setTimeout(()=>scrollClientChatToBottom(false),120)" onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();dccClientSendPremium()}"></textarea><button id="dccClientMessageSend" type="button" class="dcc-cm-send" onclick="dccClientSendPremium()" aria-label="Enviar">➤</button></div>`;
    window.scrollTo(0,0);
    scrollClientChatToBottom(false);
    setTimeout(()=>{if(window.__dccClientPremiumScreen==='messages')scrollClientChatToBottom(false)},80);
    syncMessages().then(ok=>{
      if(ok&&window.__dccClientPremiumScreen==='messages'&&String(activeClientId())===String(id)){
        refreshClientThread(id);scrollClientChatToBottom(false);
      }
    });
    startMessagePolling();
    try{if(typeof markClientNotificationSeen==='function')markClientNotificationSeen('message',id)}catch(e){}
  }

  window.scrollClientChatToBottom=scrollClientChatToBottom;

  window.dccClientSendPremium=async function(){
    const id=activeClientId();const c=clientById(id);const input=document.getElementById('dccClientMessageInput');const text=input?.value.trim();if(!id||!c||!text)return;
    const db=database();if(!db){toastSafe('No hay conexión con el servidor');return}
    const send=document.getElementById('dccClientMessageSend');if(send)send.disabled=true;
    try{
      const {error}=await db.from('client_messages').insert({client_id:id,sender:c.name||'Cliente',message:text});
      if(error)throw error;
      if(input)input.value='';await syncMessages();refreshClientThread(id);scrollClientChatToBottom(true);toastSafe('Mensaje enviado');
    }catch(e){console.error('DCC mensaje cliente:',e);toastSafe('No se pudo enviar el mensaje')}
    finally{if(send)send.disabled=false}
  };

  // Coach-side messaging is owned by messages-chat-premium-v2.js.
  // This module only owns the client conversation surface.

  let pollTimer=null;
  function stopMessagePolling(){if(pollTimer){clearInterval(pollTimer);pollTimer=null}}
  function startMessagePolling(){
    stopMessagePolling();
    if(document.hidden)return;
    pollTimer=setInterval(async()=>{
      if(document.hidden){stopMessagePolling();return}
      if(window.__dccClientPremiumScreen!=='messages'){stopMessagePolling();return}
      const id=activeClientId();if(!id)return;
      const before=JSON.stringify(appData().messages?.[id]||[]);const ok=await syncMessages();const after=JSON.stringify(appData().messages?.[id]||[]);if(ok&&before!==after)refreshClientThread(id);
    },4500);
  }
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden)stopMessagePolling();
    else if(window.__dccClientPremiumScreen==='messages')startMessagePolling();
  });

  function installShowClient(){
    const base=window.showClient;if(typeof base!=='function'||base.__dccClientMessagesV1)return;
    const wrapped=function(screen){
      window.__dccClientPremiumScreen=screen;
      if(screen!=='messages')stopMessagePolling();
      const r=base.apply(this,arguments);
      if(screen==='messages')requestAnimationFrame(()=>renderClientMessages());
      return r;
    };
    wrapped.__dccClientMessagesV1=true;wrapped.__base=base;window.showClient=wrapped;
  }

  // Install once after dependencies are loaded. Reinstall loops were legacy race-condition patches.
  injectCss();installShowClient();
})();
