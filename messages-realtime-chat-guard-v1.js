/* DCC — protege el chat premium del refresco legacy de Realtime */
(function(){
  'use strict';
  const BUILD='20260913-messages-realtime-chat-guard-v1';
  if(window.__dccMessagesRealtimeChatGuard===BUILD)return;
  window.__dccMessagesRealtimeChatGuard=BUILD;

  function install(){
    const base=window.showCoach;
    if(typeof base!=='function')return false;
    if(base.__dccMessagesRealtimeChatGuard===BUILD)return true;

    const wrapped=function(screen){
      const activeId=window.__dccCoachChatV2;
      const stream=document.getElementById('dccCoachChatStreamV2');

      if(screen==='messages'&&activeId&&stream&&typeof window.dccOpenCoachChatV2==='function'){
        const input=document.getElementById('dccCoachMessageV2');
        const draft=input?.value||'';
        const keepFocus=document.activeElement===input;

        Promise.resolve(window.dccOpenCoachChatV2(activeId)).then(()=>{
          const next=document.getElementById('dccCoachMessageV2');
          if(next&&draft&&!next.value)next.value=draft;
          if(next&&keepFocus){
            try{next.focus({preventScroll:true})}catch(_){next.focus()}
          }
        }).catch(error=>console.error('DCC chat realtime guard:',error));
        return;
      }

      return base.apply(this,arguments);
    };

    wrapped.__dccMessagesRealtimeChatGuard=BUILD;
    wrapped.__base=base;
    window.showCoach=wrapped;
    return true;
  }

  install();
  document.addEventListener('DOMContentLoaded',install,{once:true});
  window.addEventListener('load',install,{once:true});
})();
