/* DCC — Sincroniza el chat premium con el historial real existente */
(function(){
  const getData=()=>{try{return data||{}}catch(e){return window.data||{}}};
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));

  /*
    El sistema original guarda cada mensaje como:
    [remitente, mensaje, fecha]
    El chat premium lee propiedades con nombre. Añadimos esas propiedades
    a los mismos arrays SIN cambiar el formato original ni romper cliente/realtime.
  */
  function annotateMessages(){
    const d=getData();
    const boxes=['messages','chats','conversations','chatMessages'];
    boxes.forEach(key=>{
      const box=d?.[key];
      if(!box)return;
      const lists=Array.isArray(box)?[box]:Object.values(box).filter(Array.isArray);
      lists.forEach(list=>list.forEach(m=>{
        if(!Array.isArray(m))return;
        m.sender=m[0]??'';
        m.text=m[1]??'';
        m.message=m[1]??'';
        m.created_at=m[2]??null;
        const who=String(m[0]??'').toLowerCase();
        m.isCoach=/daniel|coach|trainer|entrenador|admin/.test(who);
      }));
    });
  }

  async function refreshFromSupabase(){
    try{
      if(typeof window.loadMessagesFromSupabase==='function'){
        await window.loadMessagesFromSupabase();
        annotateMessages();
        return true;
      }
    }catch(e){
      console.error('DCC — error sincronizando mensajes:',e);
    }
    annotateMessages();
    return false;
  }

  function appendLegacyLocal(id,text){
    const d=getData();
    if(!d.messages||Array.isArray(d.messages))d.messages={};
    if(!Array.isArray(d.messages[id]))d.messages[id]=[];
    d.messages[id].push(['Daniel',text,new Date().toISOString()]);
    annotateMessages();
    try{if(typeof window.saveData==='function')window.saveData()}catch(e){console.error(e)}
  }

  async function sendSynced(id){
    const input=document.getElementById('dccChatInput');
    const text=input?.value?.trim();
    if(!text)return;
    const db=window.supabaseClient||null;
    if(!db){
      try{if(typeof toast==='function')toast('No hay conexión con el servidor');else window.toast?.('No hay conexión con el servidor')}catch(_){}
      return;
    }
    if(input)input.disabled=true;

    try{
      const {error}=await db.from('client_messages').insert({client_id:id,sender:'Daniel',message:text});
      if(error)throw error;
      if(input)input.value='';
      /* Recargamos la tabla para conservar fecha/orden canónicos y evitar duplicados. */
      await refreshFromSupabase();
      if(window.__dccOpenChat===id&&typeof window.dccOpenChat==='function')window.dccOpenChat(id);
    }catch(e){
      console.error('DCC — no se pudo enviar el mensaje:',e);
      try{if(typeof toast==='function')toast('No se pudo enviar el mensaje');else window.toast?.('No se pudo enviar el mensaje')}catch(_){}
      if(input){input.disabled=false;input.focus?.({preventScroll:true})}
      return;
    }
    if(input)input.disabled=false;
  }

  function installChatHooks(){
    if(typeof window.dccOpenChat!=='function')return false;

    if(!window.dccOpenChat.__dccSynced){
      const oldOpen=window.dccOpenChat;
      const wrappedOpen=function(id){
        annotateMessages();
        const r=oldOpen.apply(this,arguments);
        refreshFromSupabase().then(()=>{
          if(String(window.__dccOpenChat??'')===String(id)){
            annotateMessages();
            oldOpen(id);
          }
        });
        return r;
      };
      wrappedOpen.__dccSynced=true;
      wrappedOpen.__base=oldOpen;
      window.dccOpenChat=wrappedOpen;
    }

    window.dccSendMessage=sendSynced;
    return true;
  }

  function installNavigation(){
    const current=window.showCoach;
    if(typeof current!=='function')return false;
    if(current.__dccMessageSync)return true;

    const wrapped=function(screen){
      if(screen==='messages'){
        annotateMessages();
        const r=current.apply(this,arguments);
        refreshFromSupabase().then(()=>{
          if(window.currentScreen==='messages'&&!window.__dccOpenChat){
            annotateMessages();
            current('messages');
          }
        });
        return r;
      }
      return current.apply(this,arguments);
    };
    wrapped.__dccMessageSync=true;
    /* Conservamos esta marca para que messages-premium no vuelva a envolverlo. */
    wrapped.__dccMessagesPremium=current.__dccMessagesPremium||true;
    wrapped.__base=current;
    window.showCoach=wrapped;
    return true;
  }

  /* Recuadro premium claramente visible en el acceso activo, en entrenador y cliente. */
  function injectActiveNavStyle(){
    let s=document.getElementById('dcc-nav-active-premium-v3');
    if(s)s.remove();
    s=document.createElement('style');
    s.id='dcc-nav-active-premium-v3';
    s.textContent=`
      html body #coach .side,
      html body #client .side{
        overflow:visible!important;
      }

      html body #coach #coach-nav button,
      html body #client #client-nav button{
        position:relative!important;
        border:1px solid transparent!important;
        border-radius:15px!important;
        background:transparent!important;
        box-shadow:none!important;
      }

      html body #coach #coach-nav button.active,
      html body #client #client-nav button.active{
        border:1px solid rgba(240,201,107,.92)!important;
        background:
          radial-gradient(circle at 50% 30%,rgba(240,201,107,.23),transparent 64%),
          linear-gradient(145deg,rgba(42,32,14,.96),rgba(15,14,12,.98))!important;
        color:#f0c96b!important;
        box-shadow:
          0 0 0 1px rgba(217,170,74,.10) inset,
          0 0 18px rgba(217,170,74,.20),
          0 7px 18px rgba(0,0,0,.22)!important;
      }

      html body #coach #coach-nav button.active svg,
      html body #client #client-nav button.active svg{
        color:#f0c96b!important;
        stroke:#f0c96b!important;
        filter:drop-shadow(0 0 5px rgba(240,201,107,.28))!important;
      }

      html body #coach #coach-nav button.active span,
      html body #client #client-nav button.active span{
        color:#f0c96b!important;
        font-weight:700!important;
      }

      @media(max-width:700px){
        html body #coach #coach-nav button.active,
        html body #client #client-nav button.active{
          margin:1px!important;
          width:calc(100% - 2px)!important;
          height:calc(100% - 2px)!important;
          border-radius:14px!important;
        }
      }
    `;
    document.head.appendChild(s);
  }

  async function install(){
    annotateMessages();
    injectActiveNavStyle();
    for(let i=0;i<40;i++){
      const a=installChatHooks();
      const b=installNavigation();
      if(a&&b){
        refreshFromSupabase();
        return;
      }
      await sleep(100);
    }
  }

  install();
  /* El acabado del panel se carga de forma asíncrona: reinsertamos este CSS al final. */
  setTimeout(injectActiveNavStyle,700);
  setTimeout(injectActiveNavStyle,1600);
  window.addEventListener('load',()=>setTimeout(injectActiveNavStyle,250));
})();
