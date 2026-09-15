from pathlib import Path


def replace_once(path, old, new):
    p = Path(path)
    s = p.read_text()
    if old not in s:
        raise SystemExit(f'pattern not found in {path}')
    if s.count(old) != 1:
        raise SystemExit(f'pattern not unique in {path}: {s.count(old)}')
    p.write_text(s.replace(old, new, 1))


# 1) Core: one and only coach router. No delayed navigation repaint.
p = Path('coach-premium-core-v9.js')
s = p.read_text()
start = s.index('  function navHtml()')
tail = r'''  function navHtml(){return `<button onclick="showCoach('dashboard')">${icon('panel')}<span>Panel</span></button><button onclick="showCoach('clients')">${icon('clients')}<span>Clientes</span></button><button onclick="showCoach('calendar')">${icon('calendar')}<span>Calendario</span></button><button onclick="showCoach('checkins')">${icon('check')}<span>Check-in</span></button><button onclick="showCoach('messages')">${icon('msg')}<span>Mensajes</span></button>`}
  function enforceNav(){const n=document.getElementById('coach-nav');if(!n)return;const wanted=['Panel','Clientes','Calendario','Check-in','Mensajes'],labels=[...n.querySelectorAll('button span')].map(x=>x.textContent.trim());if(labels.length!==5||wanted.some((x,i)=>labels[i]!==x))n.innerHTML=navHtml();n.style.setProperty('grid-template-columns','repeat(5,minmax(0,1fr))','important')}
  function active(screen){const n=document.getElementById('coach-nav');if(!n)return;const map={dashboard:0,clients:1,calendar:2,checkins:3,messages:4};n.querySelectorAll('button').forEach(x=>x.classList.remove('active'));const i=map[screen];if(i!==undefined)n.querySelectorAll('button')[i]?.classList.add('active')}
  function syncRoute(screen){window.currentApp='coach';window.currentScreen=screen;window.__dccCoachRouteIntent=screen;try{currentApp='coach';currentScreen=screen}catch(_){}}
  function beforeRoute(screen){return document.dispatchEvent(new CustomEvent('dcc:coach-before-screen',{detail:{screen},cancelable:true}))}
  function afterRoute(screen){document.dispatchEvent(new CustomEvent('dcc:coach-screen',{detail:{screen}}))}

  function install(){
    injectCss();enforceNav();
    if(window.__dccCoachRouterV40)return;
    const base=window.showCoach;
    if(typeof base!=='function')return;
    const router=function(screen){
      if(!beforeRoute(screen))return;
      syncRoute(screen);
      if(screen==='dashboard'){renderDashboard();enforceNav();active(screen);afterRoute(screen);return}
      if(screen==='clients'){renderClients();enforceNav();active(screen);afterRoute(screen);return}
      if(screen==='calendar'){
        if(typeof window.dccRenderCoachCalendarV12==='function')window.dccRenderCoachCalendarV12();
        else if(typeof window.dccRenderCoachCalendar==='function')window.dccRenderCoachCalendar();
        else base.call(this,screen);
        enforceNav();active(screen);afterRoute(screen);return;
      }
      if(screen==='checkins'&&typeof window.dccRenderCoachCheckins==='function'){window.dccRenderCoachCheckins();enforceNav();active(screen);afterRoute(screen);return}
      if(screen==='messages'&&typeof window.dccRenderCoachMessages==='function'){window.dccRenderCoachMessages();enforceNav();active(screen);afterRoute(screen);return}
      const main=document.getElementById('coach-main');if(main)main.classList.remove('dcc-p9-dashboard','dcc-premium-clients');
      const result=base.apply(this,arguments);enforceNav();active(screen);afterRoute(screen);return result;
    };
    router.__dccPremiumV9=true;router.__dccPremiumV6=true;router.__dccSingleRouterV40=true;router.__original=base;
    window.__dccCoachRouterV40=router;window.showCoach=router;
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
  window.addEventListener('pageshow',()=>{enforceNav();active(window.currentScreen||'dashboard')});
'''
p.write_text(s[:start] + tail + '})();\n')

# 2) UI v11: presentation hooks only; it never owns showCoach.
p = Path('coach-ui-v11.js')
s = p.read_text()
start = s.index('  function hasPremium(')
tail = r'''  window.dccRenderCoachCalendar=renderCalendar;
  function bootUi(){injectCss();afterScreen(window.currentScreen||'')}
  document.addEventListener('dcc:coach-screen',event=>afterScreen(event.detail?.screen||window.currentScreen||''));
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bootUi,{once:true});else bootUi();
  window.addEventListener('pageshow',()=>afterScreen(window.currentScreen||''));
'''
p.write_text(s[:start] + tail + '})();\n')

# 3) Calendar v12: renderer only; core routes to it.
p = Path('coach-calendar-v12.js')
s = p.read_text()
start = s.index('  function hasV11(')
tail = r'''  window.dccRenderCoachCalendarV12=function(){renderCalendar(true)};
  injectCss();
  if(window.currentScreen==='calendar')queueMicrotask(()=>renderCalendar(true));
  window.addEventListener('pageshow',()=>{if(window.currentScreen==='calendar')renderCalendar(true)});
'''
p.write_text(s[:start] + tail + '})();\n')

# 4) Calendar sync: keep data/action wrappers, remove navigation wrapper.
p = Path('coach-calendar-sync-v14.js')
s = p.read_text()
a = s.index('  function wrapShowCoach(){')
b = s.index('  function install(', a)
s = s[:a] + s[b:]
s = s.replace("    wrapMonthMove();\n    wrapShowCoach();", "    wrapMonthMove();")
marker = "  window.dccCalendarForceMonthSync=forceMonthSync;\n"
if marker not in s:
    raise SystemExit('calendar sync marker missing')
s = s.replace(marker, "  document.addEventListener('dcc:coach-screen',event=>{if(event.detail?.screen==='calendar')queueMicrotask(forceMonthSync)});\n\n" + marker, 1)
p.write_text(s)

# 5) Realtime chat guard: cancelable before-route hook, no showCoach wrapper.
Path('messages-realtime-chat-guard-v1.js').write_text(r'''/* DCC — protege el chat premium del refresco Realtime sin envolver la navegación */
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
''')

# 6) Client server source: data synchronization listens to route events; it never wraps showCoach.
p = Path('client-server-source-v1.js')
s = p.read_text()
if "  let lastRenderedSignature='';" in s and "let rerendering=false" not in s:
    s = s.replace("  let lastRenderedSignature='';", "  let lastRenderedSignature='';\n  let rerendering=false;", 1)
p.write_text(s)
old = r'''  function rerenderCoachScreen(rows,options){
    if(options.render===false||window.currentApp!=='coach'||typeof window.showCoach!=='function')return;
    const screen=window.currentScreen;
    if(screen!=='dashboard'&&screen!=='clients')return;
    const signature=screen+':'+rows.map(row=>String(row.id)).join('|');
    if(signature===lastRenderedSignature)return;
    lastRenderedSignature=signature;
    queueMicrotask(()=>{
      if(window.currentApp==='coach'&&window.currentScreen===screen&&typeof window.showCoach==='function'){
        window.showCoach(screen);
      }
    });
  }
'''
new = r'''  function rerenderCoachScreen(rows,options){
    if(options.render===false||window.currentApp!=='coach'||typeof window.showCoach!=='function')return;
    const screen=window.currentScreen;
    if(screen!=='dashboard'&&screen!=='clients')return;
    const signature=screen+':'+rows.map(row=>[row.id,row.name,row.status,row.weight,row.goal].join('~')).join('|');
    if(signature===lastRenderedSignature)return;
    lastRenderedSignature=signature;
    queueMicrotask(()=>{
      if(window.currentApp==='coach'&&window.currentScreen===screen&&typeof window.showCoach==='function'){
        rerendering=true;
        try{window.showCoach(screen)}finally{rerendering=false}
      }
    });
  }
'''
replace_once('client-server-source-v1.js', old, new)
p = Path('client-server-source-v1.js')
s = p.read_text()
start = s.index('  const installShowCoachWrapper=')
tail = r'''  function onCoachScreen(event){
    if(rerendering)return;
    const screen=event.detail?.screen||window.currentScreen;
    if(screen==='dashboard'||screen==='clients')queueMicrotask(()=>syncClients({render:true}));
  }

  function bootstrap(){syncCoachVisible()}
  document.addEventListener('dcc:coach-screen',onCoachScreen);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bootstrap,{once:true});
  else queueMicrotask(bootstrap);
  window.addEventListener('load',syncCoachVisible,{once:true});
  window.addEventListener('pageshow',syncCoachVisible);
'''
p.write_text(s[:start] + tail + '})();\n')

# 7) Auth: token refresh must not reconstruct an already-visible client app.
p = Path('auth-premium-v1.js')
s = p.read_text()
old = "if(clientRow?.id){setCurrentClient(clientRow.id);window.__dccSecureRole='client';sessionBadge('client');if(typeof window.openApp==='function')await window.openApp('client');return true}"
new = "if(clientRow?.id){setCurrentClient(clientRow.id);window.__dccSecureRole='client';sessionBadge('client');if(!(window.currentApp==='client'&&document.getElementById('client')?.style.display==='block')&&typeof window.openApp==='function')await window.openApp('client');return true}"
if old not in s:
    raise SystemExit('auth client route pattern missing')
p.write_text(s.replace(old, new, 1))
