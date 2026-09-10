/* DCC — Mensajes: entrada estable sin saltar al final del chat */
(function(){
  'use strict';

  const topNow=()=>{
    try{window.scrollTo({top:0,left:0,behavior:'auto'});}catch(_){window.scrollTo(0,0);}
    document.documentElement.scrollTop=0;
    document.body.scrollTop=0;
  };

  const isMessagesAction=button=>{
    if(!button)return false;
    const action=button.getAttribute('onclick')||'';
    const text=(button.textContent||'').trim();
    return /show(?:Client|Coach)\s*\(\s*['"]messages['"]\s*\)/i.test(action)||/mensajes/i.test(text);
  };

  function stabilizeInitialEntry(){
    topNow();
    requestAnimationFrame(()=>{
      topNow();
      requestAnimationFrame(topNow);
    });
    /* La sincronización con Supabase puede volver a pintar la pantalla unos ms después. */
    setTimeout(topNow,90);
    setTimeout(topNow,260);
  }

  /* Al entrar desde la navegación inferior, la pantalla empieza siempre arriba. */
  document.addEventListener('click',event=>{
    const button=event.target.closest('#client-nav button,#coach-nav button');
    if(!isMessagesAction(button))return;
    stabilizeInitialEntry();
  },true);

  function wrapClient(){
    const current=window.showClient;
    if(typeof current!=='function'||current.__dccMessagesPositionStable)return;

    const wrapped=function(screen){
      const entering=screen==='messages'&&window.currentScreen!=='messages';
      if(entering)topNow();
      const result=current.apply(this,arguments);
      if(entering)stabilizeInitialEntry();
      return result;
    };
    wrapped.__dccMessagesPositionStable=true;
    wrapped.__base=current;
    window.showClient=wrapped;
  }

  function wrapCoach(){
    const current=window.showCoach;
    if(typeof current!=='function'||current.__dccMessagesPositionStable)return;

    const wrapped=function(screen){
      const entering=screen==='messages'&&window.currentScreen!=='messages';
      if(entering)topNow();
      const result=current.apply(this,arguments);
      if(entering)stabilizeInitialEntry();
      return result;
    };
    wrapped.__dccMessagesPositionStable=true;
    wrapped.__base=current;
    window.showCoach=wrapped;
  }

  function wrapOpenChat(){
    const current=window.dccOpenChat;
    if(typeof current!=='function'||current.__dccMessagesPositionStable)return;

    const wrapped=function(id){
      const alreadyOpen=String(window.__dccOpenChat??'')===String(id)&&!!document.getElementById('dccChatInput');
      if(!alreadyOpen)topNow();
      const result=current.apply(this,arguments);
      if(!alreadyOpen){
        requestAnimationFrame(()=>{
          topNow();
          const stream=document.getElementById('dccChatStream');
          if(stream)stream.scrollTop=0;
        });
        setTimeout(()=>{
          if(String(window.__dccOpenChat??'')!==String(id))return;
          topNow();
          const stream=document.getElementById('dccChatStream');
          if(stream)stream.scrollTop=0;
        },180);
      }
      return result;
    };
    wrapped.__dccMessagesPositionStable=true;
    wrapped.__base=current;
    window.dccOpenChat=wrapped;
  }

  function install(){
    wrapClient();
    wrapCoach();
    wrapOpenChat();
  }

  install();
  [120,350,800,1500].forEach(ms=>setTimeout(install,ms));
})();
