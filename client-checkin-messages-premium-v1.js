/* DCC — mensajería cliente premium. El check-in vive en client-checkin-final-v3.js. */
(function(){
  'use strict';
  const BUILD='20260913-client-messages-v2';
  if(window.__dccClientMessagesPremium===BUILD)return;
  window.__dccClientMessagesPremium=BUILD;

  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const appData=()=>{try{return data||window.data||{}}catch(_){return window.data||{}}};
  const activeId=()=>{try{return currentClientId||null}catch(_){return window.currentClientId||null}};
  const database=()=>{try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient}catch(_){}return window.supabaseClient||null};
  const save=()=>{try{if(typeof saveData==='function')return saveData();if(typeof window.saveData==='function')return window.saveData()}catch(error){console.warn('DCC message cache:',error)}};
  const notify=text=>{try{if(typeof toast==='function')return toast(text)}catch(_){}try{return window.toast?.(text)}catch(_){} };

  function injectCss(){
    if(document.getElementById('dcc-client-messages-v2-css'))return;
    const s=document.createElement('style');s.id='dcc-client-messages-v2-css';s.textContent=`
      #client-main.dcc-client-messages-v1{background:radial-gradient(circle at 88% 0,rgba(224,173,76,.07),transparent 25%),#06090c!important;color:#f7f5f0!important;padding:13px 14px 178px!important;min-height:100dvh}
      .dcc-cm{max-width:820px;margin:0 auto}.dcc-cm *{box-sizing:border-box}.dcc-cm-kicker{margin:4px 1px 8px;color:#f0c96b;font-size:11px;font-weight:850;letter-spacing:2.7px;text-transform:uppercase}.dcc-cm-person{display:flex;align-items:center;gap:11px;margin:0 1px 13px;padding:8px 0 13px;border-bottom:1px solid #242d35}.dcc-cm-avatar{width:47px;height:47px;display:grid;place-items:center;border:1px solid rgba(224,173,76,.67);border-radius:50%;background:#0a0e11;color:#f0c96b;font-size:15px;font-weight:850}.dcc-cm-person h1{margin:0;color:#f7f5f0;font-size:22px;letter-spacing:-.55px}.dcc-cm-role{display:flex;align-items:center;gap:6px;margin-top:5px;color:#8f98a3;font-size:9px}.dcc-cm-dot{width:6px;height:6px;border-radius:50%;background:#5bd879;box-shadow:0 0 9px rgba(91,216,121,.36)}
      .dcc-cm-stream{display:flex;flex-direction:column;gap:8px;padding:3px 0 12px}.dcc-cm-day{display:flex;align-items:center;gap:8px;margin:5px 0;color:#747e89;font-size:8.5px}.dcc-cm-day:before,.dcc-cm-day:after{content:'';height:1px;flex:1;background:#242d35}.dcc-cm-row{display:flex;align-items:flex-end;gap:7px}.dcc-cm-row.mine{justify-content:flex-end}.dcc-cm-mini{width:28px;height:28px;display:grid;place-items:center;flex:none;border:1px solid rgba(224,173,76,.55);border-radius:50%;background:#090d10;color:#f0c96b;font-size:8px;font-weight:850}.dcc-cm-bubble{max-width:min(78%,560px);padding:10px 11px;border:1px solid #2a333b;border-radius:15px;background:linear-gradient(145deg,#11171c,#0b1014);color:#f3f1ed;font-size:12px;line-height:1.42}.dcc-cm-row.mine .dcc-cm-bubble{border-color:#b6862e;background:radial-gradient(circle at 100% 0,rgba(217,170,74,.12),transparent 42%),linear-gradient(145deg,#211a0f,#100e0a)}.dcc-cm-time{display:flex;justify-content:flex-end;gap:4px;margin-top:5px;color:#818b96;font-size:7.5px}.dcc-cm-row.mine .dcc-cm-time{color:#b99a57}.dcc-cm-check{color:#f0c96b}.dcc-cm-empty{padding:28px 15px;border:1px solid rgba(224,173,76,.32);border-radius:17px;background:linear-gradient(145deg,#10151a,#080c0f);color:#8f98a3;text-align:center;font-size:10px}
      .dcc-cm-composer{position:fixed;left:50%;bottom:calc(80px + env(safe-area-inset-bottom));z-index:90;width:min(790px,calc(100vw - 26px));transform:translateX(-50%);display:grid;grid-template-columns:minmax(0,1fr) 45px;gap:8px;padding:9px;border:1px solid rgba(224,173,76,.42);border-radius:18px;background:rgba(10,14,18,.97);box-shadow:0 -10px 30px rgba(0,0,0,.42);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px)}.dcc-cm-input{min-height:44px;max-height:105px;resize:none;border:1px solid #303a43;border-radius:13px;background:#0b1014;color:#f5f3ee;padding:11px 12px;outline:0;font-size:16px!important;line-height:1.35;-webkit-text-size-adjust:100%;touch-action:manipulation}.dcc-cm-input::placeholder{color:#6f7984}.dcc-cm-input:focus{border-color:rgba(224,173,76,.72);box-shadow:none}.dcc-cm-send{width:45px;height:45px;display:grid;place-items:center;border:1px solid #f0c96b;border-radius:50%;background:linear-gradient(135deg,#f3cf69,#d9a73e);color:#0b0905;font-size:19px}.dcc-cm-send:disabled{opacity:.45}
      html.dcc-theme-light-premium #client-main.dcc-client-messages-v1{background:linear-gradient(180deg,#fffaf1 0%,#f5efe4 100%)!important;color:#17191d!important}.dcc-theme-light-premium .dcc-cm-person{border-color:rgba(185,122,17,.20)!important}.dcc-theme-light-premium .dcc-cm-person h1{color:#17191d!important}.dcc-theme-light-premium .dcc-cm-avatar,.dcc-theme-light-premium .dcc-cm-mini{background:#fff7e4!important;color:#a46b0b!important;border-color:rgba(185,122,17,.38)!important}.dcc-theme-light-premium .dcc-cm-bubble{background:#fffefa!important;color:#17191d!important;border-color:rgba(185,122,17,.24)!important}.dcc-theme-light-premium .dcc-cm-row.mine .dcc-cm-bubble{background:#fff1c9!important;color:#17191d!important;border-color:rgba(185,122,17,.42)!important}.dcc-theme-light-premium .dcc-cm-composer{background:rgba(255,250,241,.98)!important;border-color:rgba(185,122,17,.38)!important}.dcc-theme-light-premium .dcc-cm-input{background:#fffefa!important;color:#17191d!important;-webkit-text-fill-color:#17191d!important;border-color:rgba(185,122,17,.28)!important}
      @media(max-width:430px){#client-main.dcc-client-messages-v1{padding-left:12px!important;padding-right:12px!important}.dcc-cm-bubble{max-width:82%;font-size:11.5px}.dcc-cm-composer{width:calc(100vw - 24px)}}
      @media(min-width:850px){.dcc-cm-composer{left:calc(50% + 120px);width:min(760px,calc(100vw - 300px))}}
    `;document.head.appendChild(s);
  }

  function msgText(m){return String(Array.isArray(m)?(m[1]??''):(m?.text??m?.message??m?.body??m?.content??'')).trim()}
  function msgSender(m){return String(Array.isArray(m)?(m[0]??''):(m?.sender??m?.from??m?.role??m?.author??''))}
  function msgDate(m){const v=Array.isArray(m)?m[2]:(m?.created_at??m?.createdAt??m?.date??m?.time??m?.timestamp);const d=v?new Date(v):null;return d&&Number.isFinite(d.getTime())?d:null}
  function isCoach(m){return /daniel|coach|trainer|entrenador|admin/i.test(msgSender(m))}
  function thread(id){const rows=appData().messages?.[id];return Array.isArray(rows)?rows.filter(m=>msgText(m)).slice().sort((a,b)=>(msgDate(a)?.getTime()||0)-(msgDate(b)?.getTime()||0)):[]}
  function timeFmt(d){return d?d.toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'}):''}
  function dayFmt(d){if(!d)return'';const now=new Date(),a=new Date(now.getFullYear(),now.getMonth(),now.getDate()).getTime(),b=new Date(d.getFullYear(),d.getMonth(),d.getDate()).getTime(),diff=Math.round((a-b)/86400000);if(diff===0)return'Hoy';if(diff===1)return'Ayer';return d.toLocaleDateString('es-ES',{day:'numeric',month:'short'})}
  function bubble(m){const coach=isCoach(m),d=msgDate(m);return `<div class="dcc-cm-row ${coach?'':'mine'}">${coach?'<div class="dcc-cm-mini">DC</div>':''}<div class="dcc-cm-bubble">${esc(msgText(m)).replace(/\n/g,'<br>')}<div class="dcc-cm-time">${esc(timeFmt(d))}${coach?'':'<span class="dcc-cm-check">✓✓</span>'}</div></div></div>`}
  function messagesHtml(id){const rows=thread(id);if(!rows.length)return'<div class="dcc-cm-empty">Todavía no hay mensajes. Puedes escribirle a tu entrenador abajo.</div>';let last='';return rows.map(m=>{const label=dayFmt(msgDate(m)),sep=label&&label!==last?`<div class="dcc-cm-day"><span>${esc(label)}</span></div>`:'';if(label)last=label;return sep+bubble(m)}).join('')}

  async function syncMessages(id=activeId()){
    const db=database(),d=appData();if(!db||!id)return false;
    try{
      const {data:rows,error}=await db.from('client_messages').select('client_id,sender,message,created_at').eq('client_id',String(id)).order('created_at',{ascending:true});
      if(error)throw error;
      d.messages=d.messages||{};d.messages[id]=(rows||[]).map(r=>[r.sender||'',r.message||'',r.created_at||null]);save();return true;
    }catch(error){console.error('DCC sync mensajes cliente:',error);return false}
  }

  function refresh(id){const stream=document.getElementById('dccClientMessageStream');if(stream)stream.innerHTML=messagesHtml(id)}
  function render(){
    injectCss();const main=document.getElementById('client-main'),id=activeId();if(!main||!id)return;
    window.__dccClientPremiumScreen='messages';
    main.className='dcc-client-messages-v1';
    main.innerHTML=`<div class="dcc-cm"><div class="dcc-cm-kicker">MENSAJES</div><header class="dcc-cm-person"><div class="dcc-cm-avatar">DC</div><div><h1>Daniel</h1><div class="dcc-cm-role"><span class="dcc-cm-dot"></span>Tu entrenador</div></div></header><div class="dcc-cm-stream" id="dccClientMessageStream">${messagesHtml(id)}</div></div><div class="dcc-cm-composer"><textarea id="dccClientMessageInput" class="dcc-cm-input" rows="1" placeholder="Escribe un mensaje..." onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();dccClientSendPremium()}"></textarea><button id="dccClientMessageSend" type="button" class="dcc-cm-send" onclick="dccClientSendPremium()" aria-label="Enviar">➤</button></div>`;
    syncMessages(id).then(ok=>{if(ok&&window.__dccClientPremiumScreen==='messages'&&String(activeId())===String(id))refresh(id)});
    startPolling();
  }

  window.dccClientSendPremium=async function(){
    const id=activeId(),input=document.getElementById('dccClientMessageInput'),text=input?.value.trim(),db=database();if(!id||!text)return;if(!db){notify('No hay conexión con el servidor');return}
    const button=document.getElementById('dccClientMessageSend');if(button)button.disabled=true;
    try{const {error}=await db.from('client_messages').insert({client_id:String(id),sender:appData().clients?.find(c=>String(c.id)===String(id))?.name||'Cliente',message:text});if(error)throw error;if(input)input.value='';await syncMessages(id);refresh(id)}catch(error){console.error('DCC mensaje cliente:',error);notify('No se pudo enviar el mensaje')}finally{if(button)button.disabled=false}
  };

  let pollTimer=null;
  function stopPolling(){if(pollTimer){clearInterval(pollTimer);pollTimer=null}}
  function startPolling(){stopPolling();if(document.hidden)return;pollTimer=setInterval(async()=>{if(document.hidden||window.__dccClientPremiumScreen!=='messages'){stopPolling();return}const id=activeId();if(!id)return;const before=JSON.stringify(appData().messages?.[id]||[]),ok=await syncMessages(id),after=JSON.stringify(appData().messages?.[id]||[]);if(ok&&before!==after)refresh(id)},4500)}
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stopPolling();else if(window.__dccClientPremiumScreen==='messages')startPolling()});

  function install(){
    const base=window.showClient;if(typeof base!=='function'||base.__dccClientMessagesPremium===BUILD)return false;
    const wrapped=function(screen){window.__dccClientPremiumScreen=screen;if(screen!=='messages')stopPolling();const result=base.apply(this,arguments);if(screen==='messages')requestAnimationFrame(render);return result};
    wrapped.__dccClientMessagesPremium=BUILD;wrapped.__base=base;window.showClient=wrapped;return true;
  }

  injectCss();install();
  document.addEventListener('DOMContentLoaded',install,{once:true});
  window.addEventListener('load',install,{once:true});
  window.addEventListener('pageshow',install);
})();