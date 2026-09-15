from pathlib import Path

changes=[]

def patch(path, old, new, label):
    p=Path(path)
    s=p.read_text(encoding='utf-8')
    if new in s:
        print('OK already:', label); return
    if old not in s:
        raise SystemExit(f'MISSING PATTERN: {label}')
    p.write_text(s.replace(old,new,1),encoding='utf-8')
    changes.append(label)
    print('PATCHED:',label)

# 1) Root router: once the user has explicitly left Panel, no delayed legacy callback may repaint Panel.
patch('index.html',
'''function showCoach(screen){\ncurrentScreen=screen;\nconst main=document.getElementById("coach-main");''',
'''function showCoach(screen){\n/* Route lock: stale async callbacks must never kick the coach back to Panel. */\nif(screen==="dashboard" && window.__dccCoachRouteIntent && window.__dccCoachRouteIntent!=="dashboard"){\n  return;\n}\ncurrentScreen=screen;\nwindow.currentScreen=screen;\nwindow.__dccCoachRouteIntent=screen;\nconst main=document.getElementById("coach-main");''',
'root showCoach route lock')

# 2) Re-entering the same authenticated app is idempotent. Auth/token events must not reset navigation.
patch('index.html',
'''  if(app !== "client" && app !== "coach"){\n    console.error("Aplicación no válida:", app);\n    return;\n  }\n\n  currentApp = app;''',
'''  if(app !== "client" && app !== "coach"){\n    console.error("Aplicación no válida:", app);\n    return;\n  }\n\n  const alreadyOpen = currentApp===app && document.getElementById(app)?.style.display==="block";\n  if(alreadyOpen){\n    return true;\n  }\n\n  currentApp = app;\n  window.currentApp = app;''',
'idempotent openApp')

# 3) Check-in synchronization updates data only. It must never render a second captured route.
patch('checkin-coach-sync-v2.js',
'''      if(screen==='checkins')syncCheckinsFromDatabase().then(ok=>{if(ok&&window.currentScreen==='checkins')current('checkins')});''',
'''      if(screen==='checkins')syncCheckinsFromDatabase();''',
'checkin single render')

# 4) Premium route wrappers install once; no delayed re-wrapping after the final navigation authority.
patch('checkin-premium.js',
'''  injectCss();install();setTimeout(install,300);setTimeout(install,900);''',
'''  injectCss();install();''',
'checkin wrapper install once')
patch('messages-premium.js',
'''  css();install();setTimeout(install,300);setTimeout(install,900);''',
'''  css();install();''',
'messages wrapper install once')

# 5) Auth state changes only route when the app is not already open in that role.
patch('auth-premium-v1.js',
'''if(profile?.role==='coach'){window.__dccSecureRole='coach';sessionBadge('coach');if(typeof window.openApp==='function')await window.openApp('coach');return true}''',
'''if(profile?.role==='coach'){window.__dccSecureRole='coach';sessionBadge('coach');if(!(window.currentApp==='coach'&&document.getElementById('coach')?.style.display==='block')&&typeof window.openApp==='function')await window.openApp('coach');return true}''',
'auth coach route idempotence')

print('TOTAL PATCHES:',len(changes))
