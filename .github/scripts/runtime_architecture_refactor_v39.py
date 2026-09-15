from pathlib import Path
import re, subprocess, sys

changes=[]

def write(path,text,label):
    Path(path).write_text(text,encoding='utf-8'); changes.append(label); print('CHANGED',label)

# 1. Exercise runtime compatibility must ONLY provide the exercise library.
p=Path('entrenamientos/runtime-compat.js'); s=p.read_text(encoding='utf-8')
marker='window.addEventListener("load",()=>{'
if marker not in s: raise SystemExit('runtime-compat legacy load marker missing')
head=s.split(marker,1)[0].rstrip()+"\n\n/* Runtime de ejercicios únicamente. La lógica global de app vive en sus módulos propietarios. */\n"
write(p,head,'runtime-compat: remove global openApp/showCoach/data patches')

# 2. Exercise library must not bootstrap coach navigation, messages, check-ins or theme layers.
p=Path('ejercicio-biblioteca.js'); s=p.read_text(encoding='utf-8')
for var in ['checkins','messages','messageSync','messagePositionFix','finalShell','premiumNav','premiumCoachTheme']:
    pat=rf"\n\s*(?:/\*[\s\S]*?\*/\s*)?const {var}=document\.createElement\('script'\);[\s\S]*?document\.head\.appendChild\({var}\);"
    s2,n=re.subn(pat,'',s,count=1)
    if n:
        s=s2; changes.append('ejercicio-biblioteca remove '+var); print('CHANGED remove',var)
write(p,s,'exercise library no longer boots coach/message/checkin layers')

# 3. Check-in sync is data sync only; never wrap navigation and never retry-install navigation wrappers.
p=Path('checkin-coach-sync-v2.js'); s=p.read_text(encoding='utf-8')
s=s.replace('function install(){installReviewEnhancements();installReviewedSync();installNavigationSync();installClientAdminEnhancement()}','function install(){installReviewEnhancements();installReviewedSync();installClientAdminEnhancement()}')
s=s.replace('setTimeout(install,300);setTimeout(install,1000);setTimeout(install,2200);','')
write(p,s,'checkin sync: data/review only, no showCoach wrapper')

# 4. Premium renderers expose render functions but do not own global showCoach.
p=Path('checkin-premium.js'); s=p.read_text(encoding='utf-8')
s=s.replace("  injectCss();install();setTimeout(install,300);setTimeout(install,900);","  injectCss();")
write(p,s,'checkin premium renderer: no navigation wrapper')

p=Path('messages-premium.js'); s=p.read_text(encoding='utf-8')
needle='  function install(){'
if 'window.dccRenderCoachMessages=renderMessages;' not in s:
    if needle not in s: raise SystemExit('messages install marker missing')
    s=s.replace(needle,'  window.dccRenderCoachMessages=renderMessages;\n\n'+needle,1)
s=s.replace("  css();install();setTimeout(install,300);setTimeout(install,900);","  css();")
write(p,s,'messages premium renderer: export renderer, no navigation wrapper')

# 5. Premium core is the ONE coach router for premium screens.
p=Path('coach-premium-core-v9.js'); s=p.read_text(encoding='utf-8')
old="""      if(screen==='clients'){renderClients();return}\n      return base.apply(this,arguments)"""
new="""      if(screen==='clients'){renderClients();return}\n      if(screen==='checkins'&&typeof window.dccRenderCoachCheckins==='function'){window.currentScreen='checkins';window.__dccCoachRouteIntent='checkins';window.dccRenderCoachCheckins();return}\n      if(screen==='messages'&&typeof window.dccRenderCoachMessages==='function'){window.currentScreen='messages';window.__dccCoachRouteIntent='messages';window.dccRenderCoachMessages();return}\n      return base.apply(this,arguments)"""
if old not in s: raise SystemExit('premium core route marker missing')
s=s.replace(old,new,1)
write(p,s,'premium core: single authority for dashboard/clients/checkins/messages')

# 6. Bootstrap loads renderers but no extra navigation authority.
p=Path('coach-client-plan-status-v1.js'); s=p.read_text(encoding='utf-8')
s=s.replace("const BUILD='20260915-client-quality-bootstrap-v8-nav';","const BUILD='20260915-client-quality-bootstrap-v9-single-router';")
s=s.replace("load('dccNavFinal','./dcc-coach-nav-final-v1.js?v=20260915-nav1');","")
write(p,s,'bootstrap: remove final navigation wrapper')

# 7. Remove coach-premium-v8 showCoach guards; core owns routing. Keep client fast-entry section intact.
p=Path('coach-premium-v8.js'); s=p.read_text(encoding='utf-8')
start=s.find("/* DCC fast client entry v17")
if start<0: raise SystemExit('fast client marker missing')
client=s[start:]
loader="""/* DCC coach premium loader v39 — carga única; la navegación pertenece a coach-premium-core-v9. */\n(function(){\n  'use strict';\n  if(window.__dccCoachPremiumLoaderV39)return;\n  window.__dccCoachPremiumLoaderV39=true;\n  function add(src,key,done){\n    if(document.querySelector('script[data-dcc-loader="'+key+'"]')){done?.();return}\n    const s=document.createElement('script');s.src=src;s.async=false;s.dataset.dccLoader=key;if(done)s.onload=done;(document.head||document.documentElement).appendChild(s);\n  }\n  if(window.showCoach?.__dccPremiumV9){add('./coach-ui-v11.js?v=20260910-1932','coachUi');return}\n  add('./coach-premium-core-v9.js?v=20260915-router-v39','coachCore',()=>add('./coach-ui-v11.js?v=20260910-1932','coachUi'));\n})();\n\n"""
write(p,loader+client,'coach premium v8: loader only, no showCoach guard layers')

# Syntax checks
for f in Path('.').rglob('*.js'):
    if 'node_modules' in f.parts: continue
    r=subprocess.run(['node','--check',str(f)],capture_output=True,text=True)
    if r.returncode:
        print(r.stderr); raise SystemExit('Syntax failure: '+str(f))
print('SYNTAX OK; changes=',len(changes))
