from pathlib import Path


def replace_once(path, old, new):
    p = Path(path)
    text = p.read_text(encoding='utf-8')
    count = text.count(old)
    if count != 1:
        raise SystemExit(f'{path}: expected 1 match, found {count}')
    p.write_text(text.replace(old, new, 1), encoding='utf-8')


replace_once(
    'training-actions-hotfix-v1.js',
    """  function schedule(){cancelAnimationFrame(frame);frame=requestAnimationFrame(refine)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
  window.addEventListener('dcc:themechange',schedule);
  window.addEventListener('hashchange',schedule);
  const observer=new MutationObserver(schedule);
  observer.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class','style','open']});
})();""",
    """  function schedule(){cancelAnimationFrame(frame);frame=requestAnimationFrame(refine)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
  window.addEventListener('dcc:themechange',schedule);
  window.addEventListener('hashchange',schedule);

  let observedMain=null;
  let observer=null;
  function bindObserver(){
    const main=document.getElementById('client-main');
    if(main===observedMain)return;
    observer?.disconnect();
    observedMain=main||null;
    if(!main)return;
    observer=new MutationObserver(schedule);
    observer.observe(main,{subtree:true,childList:true,attributes:true,attributeFilter:['open']});
  }
  bindObserver();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bindObserver,{once:true});
  window.addEventListener('pageshow',()=>{bindObserver();schedule()});
})();"""
)

replace_once(
    'messages-chat-premium-v2.js',
    """  function startPolling(){
    stopPolling();
    timer=setInterval(async()=>{
      const id=window.__dccCoachChatV2;if(!id){stopPolling();return}
      const before=JSON.stringify(appData().messages?.[id]||[]);
      const ok=await syncMessages();
      const after=JSON.stringify(appData().messages?.[id]||[]);
      if(ok&&before!==after)refreshCoachChat(id);
    },4500);
  }
""",
    """  function startPolling(){
    stopPolling();
    if(document.hidden)return;
    timer=setInterval(async()=>{
      if(document.hidden){stopPolling();return}
      const id=window.__dccCoachChatV2;if(!id){stopPolling();return}
      const before=JSON.stringify(appData().messages?.[id]||[]);
      const ok=await syncMessages();
      const after=JSON.stringify(appData().messages?.[id]||[]);
      if(ok&&before!==after)refreshCoachChat(id);
    },4500);
  }
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden)stopPolling();
    else if(window.__dccCoachChatV2)startPolling();
  });
"""
)

replace_once(
    'client-checkin-messages-premium-v1.js',
    """  function startMessagePolling(){
    stopMessagePolling();
    pollTimer=setInterval(async()=>{
      if(window.__dccClientPremiumScreen!=='messages'){stopMessagePolling();return}
      const id=activeClientId();if(!id)return;
      const before=JSON.stringify(appData().messages?.[id]||[]);const ok=await syncMessages();const after=JSON.stringify(appData().messages?.[id]||[]);if(ok&&before!==after)refreshClientThread(id);
    },4500);
  }
""",
    """  function startMessagePolling(){
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
"""
)

print('rc safe runtime patches applied')
