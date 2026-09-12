/* DCC — Mensajería premium v2: chat fijo abajo + envío Supabase fiable */
(function(){
  'use strict';

  const GOLD='#e0ad4c';
  const GOLD2='#f0c96b';
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function appData(){
    try{return data||{}}catch(e){return window.data||{}}
  }
  function db(){
    try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient}catch(e){}
    return window.supabaseClient||null;
  }
  function saveLocal(){
    try{
      if(typeof saveData==='function')return saveData();
      if(typeof window.saveData==='function')return window.saveData();
    }catch(e){console.error('DCC mensajes saveData:',e)}
  }
  function toastSafe(text){
    try{
      if(typeof toast==='function')return toast(text);
      if(typeof window.toast==='function')return window.toast(text);
    }catch(e){}
    console.log(text);
  }
  function clientById(id){
    return (appData().clients||[]).find(c=>String(c.id)===String(id))||null;
  }
  function initials(name){
    return String(name||'?').trim().split(/\s+/).filter(Boolean).slice(0,2).map(x=>(x[0]||'').toUpperCase()).join('')||'?';
  }
  function messageText(m){
    return String(Array.isArray(m)?(m[1]??''):(m?.message??m?.text??m?.body??m?.content??'')).trim();
  }
  function messageSender(m){
    return String(Array.isArray(m)?(m[0]??''):(m?.sender??m?.from??m?.role??m?.author??''));
  }
  function messageDate(m){
    const v=Array.isArray(m)?m[2]:(m?.created_at??m?.createdAt??m?.date??m?.time??m?.timestamp);
    const d=v?new Date(v):null;
    return d&&Number.isFinite(d.getTime())?d:null;
  }
  function isCoach(m){
    return /daniel|coach|trainer|entrenador|admin/i.test(messageSender(m));
  }
  function thread(id){
    const a=appData().messages?.[id];
    return Array.isArray(a)?a.filter(m=>messageText(m)).slice().sort((x,y)=>(messageDate(x)?.getTime()||0)-(messageDate(y)?.getTime()||0)):[];
  }
  function timeFmt(d){
    return d?d.toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'}):'';
  }
  function dayFmt(d){
    if(!d)return'';
    const now=new Date();
    const today=new Date(now.getFullYear(),now.getMonth(),now.getDate()).getTime();
    const day=new Date(d.getFullYear(),d.getMonth(),d.getDate()).getTime();
    const dif=Math.round((today-day)/86400000);
    if(dif===0)return'Hoy';
    if(dif===1)return'Ayer';
    return d.toLocaleDateString('es-ES',{day:'numeric',month:'short'});
  }

  function injectCss(){
    let s=document.getElementById('dcc-messages-chat-premium-v2-css');
    if(s)s.remove();
    s=document.createElement('style');
    s.id='dcc-messages-chat-premium-v2-css';
    s.textContent=`
      #coach-main.dcc-message-chat-v2{
        min-height:100dvh!important;
        padding:12px 14px 180px!important;
        background:radial-gradient(circle at 88% 0,rgba(224,173,76,.075),transparent 25%),#06090c!important;
        color:#f7f5f0!important;
      }
      .dcc-mcv2{width:100%;max-width:820px;margin:0 auto}.dcc-mcv2 *{box-sizing:border-box}
      .dcc-mcv2-back{display:inline-flex;align-items:center;justify-content:center;gap:7px;min-height:38px;padding:0 13px;border:1px solid rgba(224,173,76,.52);border-radius:999px;background:#0a0e11;color:#d7dce2;font-size:10px;font-weight:800}
      .dcc-mcv2-person{display:flex;align-items:center;gap:11px;margin:14px 1px 13px;padding:0 0 13px;border-bottom:1px solid rgba(224,173,76,.20)}
      .dcc-mcv2-avatar{width:50px;height:50px;display:grid;place-items:center;flex:none;border:1px solid rgba(224,173,76,.68);border-radius:50%;background:radial-gradient(circle at 50% 30%,rgba(217,170,74,.13),#0a0e11 72%);color:${GOLD2};font-size:16px;font-weight:850}
      .dcc-mcv2-person h1{margin:0;color:#f7f5f0;font-size:22px;letter-spacing:-.55px}.dcc-mcv2-status{display:flex;align-items:center;gap:6px;margin-top:5px;color:#8f98a3;font-size:9px}.dcc-mcv2-dot{width:7px;height:7px;border-radius:50%;background:#5bd879;box-shadow:0 0 10px rgba(91,216,121,.4)}
      .dcc-mcv2-stream{display:flex;flex-direction:column;gap:8px;padding:3px 0 16px}.dcc-mcv2-day{display:flex;align-items:center;gap:8px;margin:6px 0;color:#747e89;font-size:8.5px}.dcc-mcv2-day:before,.dcc-mcv2-day:after{content:'';height:1px;flex:1;background:#242d35}
      .dcc-mcv2-row{display:flex;align-items:flex-end;gap:7px}.dcc-mcv2-row.mine{justify-content:flex-end}.dcc-mcv2-mini{width:29px;height:29px;display:grid;place-items:center;flex:none;border:1px solid rgba(224,173,76,.55);border-radius:50%;background:#090d10;color:${GOLD2};font-size:8px;font-weight:850}
      .dcc-mcv2-bubble{max-width:min(78%,560px);padding:10px 11px;border:1px solid #2a333b;border-radius:15px;background:linear-gradient(145deg,#11171c,#0b1014);color:#f3f1ed;font-size:12px;line-height:1.42;box-shadow:inset 0 1px 0 rgba(255,255,255,.02)}.dcc-mcv2-row.mine .dcc-mcv2-bubble{border-color:#b6862e;background:radial-gradient(circle at 100% 0,rgba(217,170,74,.13),transparent 42%),linear-gradient(145deg,#211a0f,#100e0a)}
      .dcc-mcv2-time{display:flex;justify-content:flex-end;gap:4px;margin-top:5px;color:#818b96;font-size:7.5px}.dcc-mcv2-row.mine .dcc-mcv2-time{color:#b99a57}.dcc-mcv2-check{color:${GOLD2}}
      .dcc-mcv2-empty{padding:28px 15px;border:1px solid rgba(224,173,76,.34);border-radius:17px;background:linear-gradient(145deg,#10151a,#080c0f);color:#8f98a3;text-align:center;font-size:10px}
      .dcc-mcv2-composer{position:fixed;left:50%;bottom:calc(80px + env(safe-area-inset-bottom));z-index:100;width:min(790px,calc(100vw - 26px));transform:translateX(-50%);display:grid;grid-template-columns:minmax(0,1fr) 45px;gap:8px;padding:9px;border:1px solid rgba(224,173,76,.48);border-radius:18px;background:rgba(10,14,18,.98);box-shadow:0 -10px 30px rgba(0,0,0,.46),inset 0 1px 0 rgba(255,255,255,.025);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px)}
      .dcc-mcv2-input{width:100%;min-height:44px;max-height:105px;resize:none;border:1px solid #303a43;border-radius:13px;background:#0b1014;color:#f5f3ee;padding:11px 12px;outline:0;font-size:16px!important;line-height:1.35;-webkit-text-size-adjust:100%;touch-action:manipulation}.dcc-mcv2-input::placeholder{color:#6f7984}.dcc-mcv2-input:focus{border-color:rgba(224,173,76,.72);box-shadow:none!important}
      .dcc-mcv2-send{width:45px;height:45px;display:grid;place-items:center;border:1px solid #f0c96b;border-radius:50%;background:linear-gradient(135deg,#f3cf69,#d9a73e);color:#0b0905;font-size:19px}.dcc-mcv2-send:disabled{opacity:.45}


      html.dcc-theme-light-premium #coach-main.dcc-message-chat-v2{background:radial-gradient(circle at 88% 0,rgba(214,163,61,.10),transparent 26%),linear-gradient(180deg,#fffaf1 0%,#f5efe4 62%,#f1e9dc 100%)!important;color:#17191d!important}
      html.dcc-theme-light-premium .dcc-mcv2-back{background:#fffaf1!important;color:#98640b!important;border-color:rgba(185,122,17,.42)!important}
      html.dcc-theme-light-premium .dcc-mcv2-person{border-color:rgba(185,122,17,.22)!important}
      html.dcc-theme-light-premium .dcc-mcv2-person h1{color:#17191d!important}
      html.dcc-theme-light-premium .dcc-mcv2-status{color:#68717e!important}
      html.dcc-theme-light-premium .dcc-mcv2-avatar,html.dcc-theme-light-premium .dcc-mcv2-mini{background:#fff7e4!important;color:#a46b0b!important;border-color:rgba(185,122,17,.38)!important}
      html.dcc-theme-light-premium .dcc-mcv2-empty{background:#fffefa!important;color:#68717e!important;border-color:rgba(185,122,17,.28)!important}
      html.dcc-theme-light-premium .dcc-mcv2-bubble{background:#fffefa!important;color:#17191d!important;border-color:rgba(185,122,17,.24)!important}
      html.dcc-theme-light-premium .dcc-mcv2-row.mine .dcc-mcv2-bubble{background:#fff1c9!important;color:#17191d!important;border-color:rgba(185,122,17,.42)!important}
      html.dcc-theme-light-premium .dcc-mcv2-time{color:#7a8390!important}
      html.dcc-theme-light-premium .dcc-mcv2-composer{background:rgba(255,250,241,.98)!important;border-color:rgba(185,122,17,.38)!important;box-shadow:0 -10px 30px rgba(83,63,31,.12)!important}
      html.dcc-theme-light-premium .dcc-mcv2-input{background:#fffefa!important;color:#17191d!important;-webkit-text-fill-color:#17191d!important;border-color:rgba(185,122,17,.28)!important}
      html.dcc-theme-light-premium .dcc-mcv2-input::placeholder{color:#7a8390!important}

      html.dcc-theme-light-premium #coach-main.dcc-message-chat-v2{background:radial-gradient(circle at 88% 0,rgba(214,163,61,.10),transparent 26%),linear-gradient(180deg,#fffaf1 0%,#f5efe4 62%,#f1e9dc 100%)!important;color:#17191d!important}
      html.dcc-theme-light-premium .dcc-mcv2-back{background:#fffaf1!important;color:#98640b!important;border-color:rgba(185,122,17,.42)!important}
      html.dcc-theme-light-premium .dcc-mcv2-person{border-color:rgba(185,122,17,.22)!important}
      html.dcc-theme-light-premium .dcc-mcv2-person h1{color:#17191d!important}
      html.dcc-theme-light-premium .dcc-mcv2-status{color:#68717e!important}
      html.dcc-theme-light-premium .dcc-mcv2-avatar,html.dcc-theme-light-premium .dcc-mcv2-mini{background:#fff7e4!important;color:#a46b0b!important;border-color:rgba(185,122,17,.38)!important}
      html.dcc-theme-light-premium .dcc-mcv2-empty{background:#fffefa!important;color:#68717e!important;border-color:rgba(185,122,17,.28)!important}
      html.dcc-theme-light-premium .dcc-mcv2-bubble{background:#fffefa!important;color:#17191d!important;border-color:rgba(185,122,17,.24)!important}
      html.dcc-theme-light-premium .dcc-mcv2-row.mine .dcc-mcv2-bubble{background:#fff1c9!important;color:#17191d!important;border-color:rgba(185,122,17,.42)!important}
      html.dcc-theme-light-premium .dcc-mcv2-time{color:#7a8390!important}
      html.dcc-theme-light-premium .dcc-mcv2-composer{background:rgba(255,250,241,.98)!important;border-color:rgba(185,122,17,.38)!important;box-shadow:0 -10px 30px rgba(83,63,31,.12)!important}
      html.dcc-theme-light-premium .dcc-mcv2-input{background:#fffefa!important;color:#17191d!important;-webkit-text-fill-color:#17191d!important;border-color:rgba(185,122,17,.28)!important}
      html.dcc-theme-light-premium .dcc-mcv2-input::placeholder{color:#7a8390!important}
      /* Cliente: barra siempre abajo + 16px para impedir el zoom automático de iOS. */
      html body #client-main.dcc-client-messages-v1{padding-bottom:180px!important}
      html body .dcc-cm-composer{position:fixed!important;bottom:calc(80px + env(safe-area-inset-bottom))!important;z-index:100!important}
      html body .dcc-cm-input{font-size:16px!important;-webkit-text-size-adjust:100%!important}

      @media(min-width:850px){
        .dcc-mcv2-composer{left:calc(50% + 120px);width:min(760px,calc(100vw - 300px))}
      }
      @media(max-width:430px){
        #coach-main.dcc-message-chat-v2{padding-left:12px!important;padding-right:12px!important}
        .dcc-mcv2-bubble{max-width:82%;font-size:11.5px}.dcc-mcv2-composer{width:calc(100vw - 24px)}
      }
    `;
    document.head.appendChild(s);
  }

  function bubble(m,c){
    const mine=isCoach(m),d=messageDate(m);
    return `<div class="dcc-mcv2-row ${mine?'mine':''}">${mine?'':`<div class="dcc-mcv2-mini">${esc(initials(c?.name||'C'))}</div>`}<div class="dcc-mcv2-bubble">${esc(messageText(m)).replace(/\n/g,'<br>')}<div class="dcc-mcv2-time">${esc(timeFmt(d))}${mine?'<span class="dcc-mcv2-check">✓✓</span>':''}</div></div></div>`;
  }
  function messagesHtml(id,c){
    const t=thread(id);
    if(!t.length)return'<div class="dcc-mcv2-empty">Todavía no hay mensajes. Escribe el primero abajo.</div>';
    let last='';
    return t.map(m=>{
      const label=dayFmt(messageDate(m));
      const sep=label&&label!==last?`<div class="dcc-mcv2-day"><span>${esc(label)}</span></div>`:'';
      if(label)last=label;
      return sep+bubble(m,c);
    }).join('');
  }

  async function syncMessages(){
    const client=db();if(!client)return false;
    try{
      const {data:rows,error}=await client.from('client_messages').select('client_id,sender,message,created_at').order('created_at',{ascending:true});
      if(error)throw error;
      const d=appData(),next={};
      (d.clients||[]).forEach(c=>next[c.id]=[]);
      (rows||[]).forEach(r=>{
        if(!next[r.client_id])next[r.client_id]=[];
        next[r.client_id].push([r.sender||'',r.message||'',r.created_at||null]);
      });
      d.messages=next;saveLocal();return true;
    }catch(e){
      console.error('DCC sync mensajes v2:',e);return false;
    }
  }

  function renderCoachChat(id){
    injectCss();
    const c=clientById(id),main=document.getElementById('coach-main');
    if(!c||!main)return;
    window.__dccCoachChatV2=id;
    try{if(typeof closeModal==='function')closeModal()}catch(e){}
    main.className='dcc-message-chat-v2';
    main.innerHTML=`<div class="dcc-mcv2"><button type="button" class="dcc-mcv2-back" onclick="dccCloseCoachChatV2()">← Mensajes</button><header class="dcc-mcv2-person"><div class="dcc-mcv2-avatar">${esc(initials(c.name))}</div><div><h1>${esc(c.name||'Cliente')}</h1><div class="dcc-mcv2-status"><span class="dcc-mcv2-dot"></span>Conversación activa</div></div></header><div class="dcc-mcv2-stream" id="dccCoachChatStreamV2">${messagesHtml(id,c)}</div></div><div class="dcc-mcv2-composer"><textarea id="dccCoachMessageV2" class="dcc-mcv2-input" rows="1" placeholder="Escribe un mensaje..." onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();dccCoachSendV2('${esc(id)}')}"></textarea><button id="dccCoachSendV2Button" type="button" class="dcc-mcv2-send" onclick="dccCoachSendV2('${esc(id)}')" aria-label="Enviar">➤</button></div>`;
    requestAnimationFrame(()=>window.scrollTo(0,document.documentElement.scrollHeight));
    startPolling();
  }

  function refreshCoachChat(id){
    if(String(window.__dccCoachChatV2??'')!==String(id))return;
    const c=clientById(id),stream=document.getElementById('dccCoachChatStreamV2');
    if(!c||!stream)return;
    stream.innerHTML=messagesHtml(id,c);
    requestAnimationFrame(()=>window.scrollTo(0,document.documentElement.scrollHeight));
  }

  window.dccOpenCoachChatV2=async function(id){
    await syncMessages();
    renderCoachChat(id);
  };
  window.dccCloseCoachChatV2=function(){
    stopPolling();window.__dccCoachChatV2=null;
    if(typeof showCoach==='function')showCoach('messages');
  };
  window.dccCoachSendV2=async function(id){
    const input=document.getElementById('dccCoachMessageV2')||document.getElementById('dccChatInput')||document.getElementById('coach-message');
    const text=input?.value.trim();if(!id||!text)return;
    const client=db();if(!client){toastSafe('No hay conexión con el servidor');return}
    const button=document.getElementById('dccCoachSendV2Button');if(button)button.disabled=true;if(input)input.disabled=true;
    try{
      const {error}=await client.from('client_messages').insert({client_id:id,sender:'Daniel',message:text});
      if(error)throw error;
      if(input)input.value='';
      await syncMessages();
      toastSafe('Mensaje enviado');
      if(String(window.__dccCoachChatV2??'')===String(id))refreshCoachChat(id);
      else if(typeof window.dccOpenChat==='function'&&String(window.__dccOpenChat??'')===String(id))window.dccOpenChat(id);
    }catch(e){
      console.error('DCC mensaje entrenador v2:',e);toastSafe('No se pudo enviar el mensaje');
    }finally{
      if(input)input.disabled=false;if(button)button.disabled=false;
    }
  };

  let timer=null;
  function stopPolling(){if(timer){clearInterval(timer);timer=null}}
  function startPolling(){
    stopPolling();
    timer=setInterval(async()=>{
      const id=window.__dccCoachChatV2;if(!id){stopPolling();return}
      const before=JSON.stringify(appData().messages?.[id]||[]);
      const ok=await syncMessages();
      const after=JSON.stringify(appData().messages?.[id]||[]);
      if(ok&&before!==after)refreshCoachChat(id);
    },4500);
  }

  function install(){
    injectCss();
    window.openMessages=function(id){window.dccOpenCoachChatV2(id)};
    window.sendCoachMessage=function(id){return window.dccCoachSendV2(id)};
    window.dccSendMessage=function(id){return window.dccCoachSendV2(id)};
  }

  install();
  setTimeout(install,300);
  setTimeout(install,1000);
  window.addEventListener('load',()=>setTimeout(install,120));
})();
