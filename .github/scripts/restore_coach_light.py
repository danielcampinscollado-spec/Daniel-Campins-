from pathlib import Path

# Coach sessions enter in Light Premium; Appearance remains changeable afterwards.
p = Path('auth-premium-v1.js')
s = p.read_text()
old = "if(profile?.role==='coach'){window.__dccSecureRole='coach';sessionBadge('coach');if(!(window.currentApp==='coach'&&document.getElementById('coach')?.style.display==='block')&&typeof window.openApp==='function')await window.openApp('coach');return true}"
new = "if(profile?.role==='coach'){window.__dccSecureRole='coach';sessionBadge('coach');if(!(window.currentApp==='coach'&&document.getElementById('coach')?.style.display==='block')&&typeof window.openApp==='function'){try{window.dccTheme?.set('light-premium')}catch(_){}await window.openApp('coach')}return true}"
if old not in s:
    raise SystemExit('coach auth route not found')
p.write_text(s.replace(old, new, 1))

p = Path('coach-light-stable-v1.js')
s = p.read_text()
marker = """@media(max-width:700px){
  html.dcc-theme-light-premium body #coach #coach-main{padding:18px 14px 112px!important}
  html.dcc-theme-light-premium body #coach .side{left:10px!important;right:10px!important;bottom:10px!important;width:auto!important;height:68px!important;border-radius:22px!important}
}
"""
replacement = """/* Correcciones de superficies que seguían heredando el tema oscuro */
html.dcc-theme-light-premium body #coach #coach-main.dcc-message-chat-v2{background:radial-gradient(circle at 88% 0,rgba(214,163,61,.08),transparent 25%),linear-gradient(180deg,#fffaf1 0%,#f5efe4 62%,#f0e8dc 100%)!important;color:#17191d!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-cl-search,
html.dcc-theme-light-premium body #coach #coach-main .dcc-cl-filter,
html.dcc-theme-light-premium body #coach #coach-main .dcc-bfh-row,
html.dcc-theme-light-premium body #coach #coach-main .dcc-mcv2-empty,
html.dcc-theme-light-premium body #coach #coach-main .dcc-mcv2-composer{background:#fffefa!important;color:#17191d!important;border-color:rgba(177,119,18,.28)!important;box-shadow:none!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-cl-search input,
html.dcc-theme-light-premium body #coach #coach-main .dcc-mcv2-input{background:#fffefa!important;color:#17191d!important;-webkit-text-fill-color:#17191d!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-bfh-head b,
html.dcc-theme-light-premium body #coach #coach-main .dcc-bfh-row b{color:#17191d!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-bfh-head span,
html.dcc-theme-light-premium body #coach #coach-main .dcc-bfh-row small{color:#747d88!important}

/* Barra inferior: geometría fija; el activo nunca sale del marco. */
html.dcc-theme-light-premium body #coach .side{box-sizing:border-box!important;height:68px!important;padding:4px 5px!important;overflow:hidden!important;border-radius:22px!important}
html.dcc-theme-light-premium body #coach #coach-nav{width:100%!important;height:100%!important;display:grid!important;grid-template-columns:repeat(5,minmax(0,1fr))!important;gap:2px!important;padding:0!important;overflow:hidden!important;border-radius:18px!important}
html.dcc-theme-light-premium body #coach #coach-nav button{box-sizing:border-box!important;width:100%!important;min-width:0!important;height:100%!important;min-height:0!important;margin:0!important;padding:5px 2px!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:2px!important;border-radius:17px!important;transform:none!important;overflow:hidden!important}
html.dcc-theme-light-premium body #coach #coach-nav button.active{width:100%!important;height:100%!important;margin:0!important;transform:none!important;border-radius:17px!important}
html.dcc-theme-light-premium body #coach #coach-nav button svg{display:block!important;width:22px!important;height:22px!important;flex:0 0 22px!important}
html.dcc-theme-light-premium body #coach #coach-nav button span{display:block!important;visibility:visible!important;opacity:1!important;margin:0!important;font-size:9px!important;line-height:1.05!important;white-space:nowrap!important}

@media(max-width:700px){
  html.dcc-theme-light-premium body #coach #coach-main{padding:18px 14px 112px!important}
  html.dcc-theme-light-premium body #coach .side{left:10px!important;right:10px!important;bottom:10px!important;width:auto!important;height:68px!important;border-radius:22px!important}
}
"""
if marker not in s:
    raise SystemExit('coach light mobile marker not found')
p.write_text(s.replace(marker, replacement, 1))
