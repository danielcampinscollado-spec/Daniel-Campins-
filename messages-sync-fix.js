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
    if(input)input.disabled=true;

    try{
      if(window.supabaseClient){
        const {error}=await window.supabaseClient
          .from('client_messages')
          .insert({client_id:id,sender:'Daniel',message:text});
        if(error)throw error;

        /* Recargamos la tabla para conservar fecha/orden canónicos y evitar duplicados. */
        await refreshFromSupabase();
      }else{
        appendLegacyLocal(id,text);
      }
    }catch(e){
      console.error('DCC — no se pudo enviar por Supabase, guardado local:',e);
      appendLegacyLocal(id,text);
    }

    if(window.__dccOpenChat===id&&typeof window.dccOpenChat==='function'){
      window.dccOpenChat(id);
    }
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

  async function install(){
    annotateMessages();
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
})();
