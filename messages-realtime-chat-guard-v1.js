/* DCC — protege el chat premium del refresco Realtime sin envolver la navegación */
(function(){
  'use strict';
  const BUILD='20260915-messages-realtime-chat-guard-v2-event';
  if(window.__dccMessagesRealtimeChatGuard===BUILD)return;
  window.__dccMessagesRealtimeChatGuard=BUILD;

  function preserveActiveChat(event){
    if(event.detail?.screen!=='messages')return;
    const activeId=window.__dccCoachChatV2;
    const stream=document.getElementById('dccCoachChatStreamV2');
    if(!activeId||!stream||typeof window.dccOpenCoachChatV2!=='function')return;
    event.preventDefault();
    const input=document.getElementById('dccCoachMessageV2');
    const draft=input?.value||'';
    const keepFocus=document.activeElement===input;
    Promise.resolve(window.dccOpenCoachChatV2(activeId)).then(()=>{
      const next=document.getElementById('dccCoachMessageV2');
      if(next&&draft&&!next.value)next.value=draft;
      if(next&&keepFocus){try{next.focus({preventScroll:true})}catch(_){next.focus()}}
    }).catch(error=>console.error('DCC chat realtime guard:',error));
  }

  document.addEventListener('dcc:coach-before-screen',preserveActiveChat);
})();
