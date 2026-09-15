from pathlib import Path
import subprocess

def save(path,text,label):
    Path(path).write_text(text,encoding='utf-8'); print('OK',label)

# runtime-compat: exercise library only. Remove the legacy load callback if still present.
p=Path('entrenamientos/runtime-compat.js'); s=p.read_text(encoding='utf-8'); marker='window.addEventListener("load",()=>{'
if marker in s:s=s.split(marker,1)[0].rstrip()+"\n\n/* Runtime de ejercicios únicamente. Sin navegación ni openApp global. */\n"
save(p,s,'runtime-compat library-only')

# exercise library: no coach/messages/checkins/nav/theme bootstrap.
p=Path('ejercicio-biblioteca.js'); s=p.read_text(encoding='utf-8')
for var in ['checkins','messages','messageSync','messagePositionFix','finalShell','premiumNav','premiumCoachTheme']:
    start=s.find('const '+var+"=document.createElement('script');")
    if start>=0:
        line_start=s.rfind('\n',0,start)+1
        end_token='document.head.appendChild('+var+');'; end=s.find(end_token,start)
        if end>=0:s=s[:line_start]+s[end+len(end_token):]
save(p,s,'exercise library clean bootstrap')

# checkin sync: no showCoach ownership / delayed reinstallation.
p=Path('checkin-coach-sync-v2.js'); s=p.read_text(encoding='utf-8')
s=s.replace('function install(){installReviewEnhancements();installReviewedSync();installNavigationSync();installClientAdminEnhancement()}','function install(){installReviewEnhancements();installReviewedSync();installClientAdminEnhancement()}')
s=s.replace('setTimeout(install,300);setTimeout(install,1000);setTimeout(install,2200);','')
save(p,s,'checkin sync data-only')

# premium checkin renderer: exported renderer, no global showCoach wrapper.
p=Path('checkin-premium.js'); s=p.read_text(encoding='utf-8')
s=s.replace('  injectCss();install();setTimeout(install,300);setTimeout(install,900);','  injectCss();')
save(p,s,'checkin renderer only')

# premium messages renderer: exported renderer, no global showCoach wrapper.
p=Path('messages-premium.js'); s=p.read_text(encoding='utf-8')
if 'window.dccRenderCoachMessages=renderMessages;' not in s:
    s=s.replace('  function install(){','  window.dccRenderCoachMessages=renderMessages;\n\n  function install(){',1)
s=s.replace('  css();install();setTimeout(install,300);setTimeout(install,900);','  css();')
save(p,s,'messages renderer only')

# ONE coach router: premium core owns dashboard, clients, checkins and messages.
p=Path('coach-premium-core-v9.js'); s=p.read_text(encoding='utf-8')
old="""      if(screen==='clients'){window.currentScreen='clients';renderClients();enforceNav();active('clients');return}\n      const main=document.getElementById('coach-main');if(main)main.classList.remove('dcc-p9-dashboard','dcc-premium-clients');"""
new="""      if(screen==='clients'){window.currentScreen='clients';window.__dccCoachRouteIntent='clients';renderClients();enforceNav();active('clients');return}\n      if(screen==='checkins'&&typeof window.dccRenderCoachCheckins==='function'){window.currentScreen='checkins';window.__dccCoachRouteIntent='checkins';window.dccRenderCoachCheckins();enforceNav();active('checkins');return}\n      if(screen==='messages'&&typeof window.dccRenderCoachMessages==='function'){window.currentScreen='messages';window.__dccCoachRouteIntent='messages';window.dccRenderCoachMessages();enforceNav();active('messages');return}\n      const main=document.getElementById('coach-main');if(main)main.classList.remove('dcc-p9-dashboard','dcc-premium-clients');"""
if old in s:s=s.replace(old,new,1)
elif 'window.dccRenderCoachMessages' not in s:raise SystemExit('premium core route marker missing')
save(p,s,'premium core single router')

# bootstrap: renderers yes, final navigation wrapper no.
p=Path('coach-client-plan-status-v1.js'); s=p.read_text(encoding='utf-8')
s=s.replace("const BUILD='20260915-client-quality-bootstrap-v8-nav';","const BUILD='20260915-client-quality-bootstrap-v9-single-router';")
s=s.replace("load('dccNavFinal','./dcc-coach-nav-final-v1.js?v=20260915-nav1');",'')
save(p,s,'bootstrap no nav wrapper')

# coach-premium-v8: loader only for coach side; preserve client fast entry.
p=Path('coach-premium-v8.js'); s=p.read_text(encoding='utf-8')
if not s.startswith('/* DCC coach premium loader v39'):
    start=s.find('/* DCC fast client entry v17')
    if start<0:raise SystemExit('fast client marker missing')
    client=s[start:]
    loader="""/* DCC coach premium loader v39 — carga única; navegación en coach-premium-core-v9. */\n(function(){\n'use strict';\nif(window.__dccCoachPremiumLoaderV39)return;window.__dccCoachPremiumLoaderV39=true;\nfunction add(src,key,done){if(document.querySelector('script[data-dcc-loader="'+key+'"]')){done?.();return}const x=document.createElement('script');x.src=src;x.async=false;x.dataset.dccLoader=key;if(done)x.onload=done;(document.head||document.documentElement).appendChild(x)}\nif(window.showCoach?.__dccPremiumV9){add('./coach-ui-v11.js?v=20260910-1932','coachUi')}else add('./coach-premium-core-v9.js?v=20260915-router-v39','coachCore',()=>add('./coach-ui-v11.js?v=20260910-1932','coachUi'));\n})();\n\n"""
    s=loader+client
save(p,s,'coach premium loader only')

# Syntax every JS file.
for f in Path('.').rglob('*.js'):
    if 'node_modules' in f.parts:continue
    r=subprocess.run(['node','--check',str(f)],capture_output=True,text=True)
    if r.returncode:print(r.stderr);raise SystemExit('Syntax failure: '+str(f))
print('SYNTAX OK')
