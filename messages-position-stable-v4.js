/* DCC — Mensajes: navegación estable v6, sin parpadeos ni saltos */
(function(){
  'use strict';

  if(window.__dccMessagesStableV6)return;
  window.__dccMessagesStableV6=true;

  const nativeScrollTo=(window.__dccNativeScrollTo||window.scrollTo).bind(window);
  window.__dccNativeScrollTo=nativeScrollTo;

  const coachMain=()=>document.getElementById('coach-main');
  const clientMain=()=>document.getElementById('client-main');

  function inCoachMessageChat(){
    const main=coachMain();
    return !!(
      window.__dccCoachChatV2 ||
      window.__dccOpenChat ||
      document.getElementById('dccCoachChatStreamV2') ||
      document.getElementById('dccChatStream') ||
      main?.classList.contains('dcc-message-chat-v2') ||
      main?.classList.contains('dcc-premium-chat')
    );
  }

  function inClientMessageChat(){
    const main=clientMain();
    return !!(
      document.getElementById('dccClientChatStream') ||
      document.getElementById('dccClientMessage') ||
      main?.classList.contains('dcc-client-messages-v1')
    );
  }

  function withInstantScroll(fn){
    const root=document.documentElement;
    const body=document.body;
    const oldRoot=root.style.scrollBehavior;
    const oldBody=body.style.scrollBehavior;
    root.style.scrollBehavior='auto';
    body.style.scrollBehavior='auto';
    try{fn();}
    finally{
      root.style.scrollBehavior=oldRoot;
      body.style.scrollBehavior=oldBody;
    }
  }

  function forceTop(){
    withInstantScroll(()=>{
      try{nativeScrollTo({top:0,left:0,behavior:'auto'});}
      catch(_){nativeScrollTo(0,0);}
      document.documentElement.scrollTop=0;
      document.body.scrollTop=0;
    });
  }

  /*
    Los chats antiguos fuerzan window.scrollTo(...scrollHeight) al renderizar y
    al refrescar mensajes. En iPhone eso mueve toda la página, provoca el
    parpadeo y termina dejando la vista abajo. Bloqueamos únicamente esos
    saltos programáticos hacia el final mientras un chat está abierto.
  */
  window.scrollTo=function(a,b){
    let top=null;
    if(a && typeof a==='object') top=Number(a.top);
    else if(arguments.length>1) top=Number(b);

    if((inCoachMessageChat()||inClientMessageChat()) && Number.isFinite(top) && top>0){
      const docHeight=Math.max(
        document.documentElement.scrollHeight||0,
        document.body?.scrollHeight||0
      );
      const maxScroll=Math.max(0,docHeight-window.innerHeight);
      if(top>=Math.max(1,maxScroll-2)) return;
    }

    return nativeScrollTo.apply(window,arguments);
  };

  function injectStabilityCss(){
    if(document.getElementById('dcc-messages-stability-v6'))return;
    const style=document.createElement('style');
    style.id='dcc-messages-stability-v6';
    style.textContent=`
      #coach-main.dcc-message-chat-v2,
      #coach-main.dcc-premium-chat,
      #client-main.dcc-client-messages-v1{
        overflow-anchor:none!important;
      }
      #coach-main.dcc-message-chat-v2,
      #coach-main.dcc-premium-chat{
        background-color:#06090c!important;
      }
      #coach-main.dcc-message-chat-v2 .dcc-mcv2,
      #coach-main.dcc-message-chat-v2 .dcc-mcv2-stream,
      #coach-main.dcc-premium-chat .dcc-chat,
      #coach-main.dcc-premium-chat .dcc-chat-stream{
        overflow-anchor:none!important;
      }
    `;
    document.head.appendChild(style);
  }

  function wrapShow(name){
    const current=window[name];
    if(typeof current!=='function'||current.__dccMessagesStableV6)return;

    const wrapped=function(screen){
      const result=current.apply(this,arguments);
      if(screen==='messages'){
        forceTop();
        requestAnimationFrame(forceTop);
      }
      return result;
    };

    wrapped.__dccMessagesStableV6=true;
    wrapped.__base=current;
    window[name]=wrapped;
  }

  function wrapOpenChat(name){
    const current=window[name];
    if(typeof current!=='function'||current.__dccMessagesStableV6)return;

    const wrapped=function(){
      forceTop();
      const result=current.apply(this,arguments);

      if(result && typeof result.then==='function'){
        return result.then(value=>{
          forceTop();
          requestAnimationFrame(forceTop);
          return value;
        });
      }

      forceTop();
      requestAnimationFrame(forceTop);
      return result;
    };

    wrapped.__dccMessagesStableV6=true;
    wrapped.__base=current;
    window[name]=wrapped;
  }

  function install(){
    injectStabilityCss();
    wrapShow('showClient');
    wrapShow('showCoach');
    wrapOpenChat('dccOpenChat');
    wrapOpenChat('dccOpenCoachChatV2');
    wrapOpenChat('openMessages');
  }

  install();
  setTimeout(install,120);
  setTimeout(install,400);
  setTimeout(install,1000);
})();
