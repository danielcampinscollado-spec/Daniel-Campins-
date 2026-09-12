/* DCC — tema global estable para panel entrenador + navegación · v2.1 */
(function(){
  'use strict';
  try{document.documentElement.classList.add('dcc-theme-light-premium');localStorage.setItem('dcc:theme:v1','light-premium')}catch(e){}
  try{document.documentElement.classList.add('dcc-theme-light-premium');localStorage.setItem('dcc:theme:v1','light-premium')}catch(e){}
  if(window.__dccCoachThemePremiumGlobalV2)return;
  window.__dccCoachThemePremiumGlobalV2=true;
  const ID='dcc-coach-theme-premium-global-v2';

  function install(){
    document.getElementById('dcc-coach-theme-premium-global')?.remove();
    if(document.getElementById(ID))return;
    const s=document.createElement('style');
    s.id=ID;
    s.textContent=`
/* BASE NAV: evita parpadeo negro/sin estilo al crear la barra inferior. */
#client-nav,#coach-nav{background:linear-gradient(145deg,#28251f,#151513 58%,#222019)!important;border:1px solid rgba(231,181,73,.78)!important;box-shadow:0 12px 34px rgba(68,49,18,.26),0 0 0 1px rgba(255,211,108,.10),inset 0 1px 0 rgba(255,230,157,.10)!important}
#client-nav button,#coach-nav button{color:#e8b94f!important;background:transparent!important;border-color:transparent!important}
#client-nav button svg,#coach-nav button svg{color:#e8b94f!important;stroke:currentColor!important}
#client-nav button span,#coach-nav button span{color:#e5c778!important}
#client-nav button.active,#coach-nav button.active{color:#1d1608!important;background:linear-gradient(145deg,#ffe8a4 0%,#e6af3d 72%,#c88920 100%)!important;border-color:#ffe39a!important;box-shadow:0 0 0 2px rgba(177,119,18,.42),0 0 18px rgba(237,187,72,.52),0 8px 20px rgba(0,0,0,.24)!important}
#client-nav button.active *,#coach-nav button.active *{color:#1d1608!important}
body.dcc-coach-surface .dcc-theme-trigger{display:none!important}

/* DCC ORIGINAL · entrenador */
html:not(.dcc-theme-light-premium) body #coach{--dcc-gold:#d9aa4a;--dcc-gold2:#f0c96b;--dcc-border:rgba(240,201,107,.66);--dcc-border-soft:rgba(217,170,74,.30);--dcc-bg:radial-gradient(ellipse at 88% 3%,rgba(217,170,74,.11),transparent 25%),radial-gradient(ellipse at 7% 84%,rgba(217,170,74,.045),transparent 30%),linear-gradient(150deg,#080b0e 0%,#050709 50%,#020405 100%);--dcc-card:radial-gradient(circle at 92% 5%,rgba(240,201,107,.11),transparent 32%),linear-gradient(145deg,#12181d 0%,#0a0e11 60%,#070a0c 100%);background:var(--dcc-bg)!important;color:#f6f3ed!important}
html:not(.dcc-theme-light-premium) body #coach #coach-main{min-height:100dvh!important;background:var(--dcc-bg)!important;color:#f6f3ed!important}

/* LIGHT PREMIUM · entrenador */
html.dcc-theme-light-premium body #coach,
html.dcc-theme-light-premium body #coach #coach-main,
html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard,
html.dcc-theme-light-premium body #coach #coach-main.dcc-final-dashboard,
html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients,
html.dcc-theme-light-premium body #coach #coach-main.dcc-final-clients,
html.dcc-theme-light-premium body #coach #coach-main.dcc-cal-v11,
html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-checkins,
html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-messages,
html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-chat,
html.dcc-theme-light-premium body #coach #coach-main.dcc-ca{--dcc-gold:#b77b13!important;--dcc-gold2:#d7a53f!important;--dcc-border:rgba(190,132,31,.42)!important;--dcc-border-soft:rgba(190,132,31,.26)!important;--dcc-bg-light:radial-gradient(circle at 88% 0,rgba(214,163,61,.10),transparent 26%),linear-gradient(180deg,#fffaf1 0%,#f5efe4 62%,#f1e9dc 100%)!important;background:var(--dcc-bg-light)!important;background-color:#f5efe4!important;color:#17191d!important}
html.dcc-theme-light-premium body #coach #coach-main{min-height:100dvh!important;color:#17191d!important;padding-top:max(24px,env(safe-area-inset-top))!important;padding-bottom:118px!important}
html.dcc-theme-light-premium body #coach #coach-main h1,html.dcc-theme-light-premium body #coach #coach-main h2,html.dcc-theme-light-premium body #coach #coach-main h3,html.dcc-theme-light-premium body #coach #coach-main strong,html.dcc-theme-light-premium body #coach #coach-main b{color:#17191d!important;text-shadow:none!important}
html.dcc-theme-light-premium body #coach #coach-main p,html.dcc-theme-light-premium body #coach #coach-main .muted,html.dcc-theme-light-premium body #coach #coach-main [class*="sub"],html.dcc-theme-light-premium body #coach #coach-main [class*="meta"],html.dcc-theme-light-premium body #coach #coach-main [class*="weight"]{color:#657080!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-p9-hero,html.dcc-theme-light-premium body #coach #coach-main .dcc-p9-stat,html.dcc-theme-light-premium body #coach #coach-main .dcc-p9-accordion,html.dcc-theme-light-premium body #coach #coach-main .dcc-fd-hero,html.dcc-theme-light-premium body #coach #coach-main .dcc-fd-stats,html.dcc-theme-light-premium body #coach #coach-main .dcc-fd-card,html.dcc-theme-light-premium body #coach #coach-main .dcc-fd-banner,html.dcc-theme-light-premium body #coach #coach-main .dcc-cl-card,html.dcc-theme-light-premium body #coach #coach-main .dcc-fcl-card,html.dcc-theme-light-premium body #coach #coach-main .dcc-ci-card,html.dcc-theme-light-premium body #coach #coach-main .dcc-msg-card,html.dcc-theme-light-premium body #coach #coach-main .dcc-cal-card,html.dcc-theme-light-premium body #coach #coach-main .dcc-cal-agenda,html.dcc-theme-light-premium body #coach #coach-main .dcc-ca-card,html.dcc-theme-light-premium body #coach #coach-main .dcc-ca-metric,html.dcc-theme-light-premium body #coach #coach-main .dcc-p5-section,html.dcc-theme-light-premium body #coach #coach-main .dcc-p5-metric,html.dcc-theme-light-premium body #coach #coach-main .card,html.dcc-theme-light-premium body #coach #coach-main .metrics{background:linear-gradient(145deg,#fffefa 0%,#fbf6ec 100%)!important;background-color:#fffaf1!important;border:1px solid rgba(198,139,32,.38)!important;color:#17191d!important;box-shadow:0 12px 30px rgba(83,63,31,.08),inset 0 1px 0 rgba(255,255,255,.95)!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-ca-activity-item,html.dcc-theme-light-premium body #coach #coach-main .dcc-p5-card,html.dcc-theme-light-premium body #coach #coach-main .dcc-ci-review-row,html.dcc-theme-light-premium body #coach #coach-main .dcc-chat-bubble,html.dcc-theme-light-premium body #coach #coach-main .item,html.dcc-theme-light-premium body #coach #coach-main .client-row{background:#fffaf1!important;color:#17191d!important;border-color:rgba(185,122,17,.24)!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-p9-kicker,html.dcc-theme-light-premium body #coach #coach-main .dcc-cl-kicker,html.dcc-theme-light-premium body #coach #coach-main .dcc-fcl-kicker,html.dcc-theme-light-premium body #coach #coach-main .dcc-ci-kicker,html.dcc-theme-light-premium body #coach #coach-main .dcc-msg-kicker,html.dcc-theme-light-premium body #coach #coach-main .dcc-ca-kicker,html.dcc-theme-light-premium body #coach #coach-main [class*="eyebrow"]{color:#b77b13!important;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text","Segoe UI",Arial,sans-serif!important;font-size:11px!important;font-weight:800!important;letter-spacing:3px!important;text-transform:uppercase!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-u-search,html.dcc-theme-light-premium body #coach #coach-main .dcc-fcl-search,html.dcc-theme-light-premium body #coach #coach-main .dcc-fcl-tabs,html.dcc-theme-light-premium body #coach #coach-main .dcc-fcl-sort,html.dcc-theme-light-premium body #coach #coach-main .dcc-cl-tabs,html.dcc-theme-light-premium body #coach #coach-main .dcc-cl-sort,html.dcc-theme-light-premium body #coach #coach-main .dcc-ci-tabs,html.dcc-theme-light-premium body #coach #coach-main .dcc-msg-search,html.dcc-theme-light-premium body #coach #coach-main .dcc-cal-tabs,html.dcc-theme-light-premium body #coach #coach-main .dcc-ca-tabs,html.dcc-theme-light-premium body #coach #coach-main .dcc-chat-composer{background:#fffefa!important;color:#17191d!important;border-color:rgba(185,122,17,.30)!important;box-shadow:0 8px 22px rgba(83,63,31,.06)!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-u-search>svg{color:#98640b!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-u-search>input,html.dcc-theme-light-premium body #coach #coach-main input,html.dcc-theme-light-premium body #coach #coach-main textarea,html.dcc-theme-light-premium body #coach #coach-main select{background:#fffefa!important;color:#17191d!important;-webkit-text-fill-color:#17191d!important;border-color:rgba(185,122,17,.28)!important;box-shadow:none!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-u-search>input::placeholder,html.dcc-theme-light-premium body #coach #coach-main input::placeholder,html.dcc-theme-light-premium body #coach #coach-main textarea::placeholder{color:#7a8390!important;-webkit-text-fill-color:#7a8390!important;opacity:1!important}
html.dcc-theme-light-premium body #coach #coach-main .btn,html.dcc-theme-light-premium body #coach #coach-main .dcc-fcl-new,html.dcc-theme-light-premium body #coach #coach-main .dcc-cl-new,html.dcc-theme-light-premium body #coach #coach-main .dcc-cal-new,html.dcc-theme-light-premium body #coach #coach-main .dcc-ci-mark,html.dcc-theme-light-premium body #coach #coach-main .dcc-chat-send{background:linear-gradient(135deg,#f5d581,#dca83e)!important;color:#18140c!important;border-color:#e9bd55!important;box-shadow:0 8px 22px rgba(185,125,20,.18)!important}
html.dcc-theme-light-premium body #coach #coach-main .ghost,html.dcc-theme-light-premium body #coach #coach-main .dcc-ca-back,html.dcc-theme-light-premium body #coach #coach-main .dcc-chat-back,html.dcc-theme-light-premium body #coach #coach-main .dcc-cal-move,html.dcc-theme-light-premium body #coach #coach-main .dcc-fcl-card button,html.dcc-theme-light-premium body #coach #coach-main .dcc-cl-card button,html.dcc-theme-light-premium body #coach #coach-main .dcc-ci-card button,html.dcc-theme-light-premium body #coach #coach-main .dcc-msg-card button{background:#fffaf1!important;color:#98640b!important;border-color:rgba(185,122,17,.42)!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-p9-hero{background:linear-gradient(120deg,#fffdf8 0%,#f8eedc 60%,#f2e3c6 100%)!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-p9-name,html.dcc-theme-light-premium body #coach #coach-main .dcc-p9-stat strong{color:#17191d!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-p9-stat.dcc-p9-positive strong{color:#a86d0d!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-cl-name,html.dcc-theme-light-premium body #coach #coach-main .dcc-fcl-name,html.dcc-theme-light-premium body #coach #coach-main .dcc-msg-name{color:#17191d!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-cl-goal,html.dcc-theme-light-premium body #coach #coach-main .dcc-fcl-goal{color:#a46b0b!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-cal-v11{background:var(--dcc-bg-light)!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-cal-head h1,html.dcc-theme-light-premium body #coach #coach-main .dcc-cal-month-head strong{color:#17191d!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-cal-tab{color:#68717e!important;background:transparent!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-cal-tab.active{background:linear-gradient(145deg,#fff2c5,#edc45d)!important;color:#1d1608!important;border-color:#d6a53d!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-cal-week span{color:#7a8390!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-cal-day{color:#22262c!important;background:transparent!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-cal-day.out{color:#a1a7af!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-cal-day.selected{border-color:#d8a63d!important;background:#fff5d8!important;color:#8d5a08!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-cal-day.today{background:#17191d!important;color:#fff8e9!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-cal-empty,html.dcc-theme-light-premium body #coach #coach-main .dcc-cal-session{background:#fffaf1!important;color:#17191d!important;border-color:rgba(185,122,17,.28)!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-ci-tab{color:#68717e!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-ci-tab.active{background:linear-gradient(145deg,#fff2c5,#edc45d)!important;color:#1d1608!important;border-color:#d6a53d!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-msg-avatar{background:#fff7e4!important;color:#a46b0b!important;border-color:rgba(185,122,17,.38)!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-chat{background:var(--dcc-bg-light)!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-chat-head,html.dcc-theme-light-premium body #coach #coach-main .dcc-chat-empty{background:#fffaf1!important;color:#17191d!important;border-color:rgba(185,122,17,.28)!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-chat-row.mine .dcc-chat-bubble{background:#fff1c9!important;color:#17191d!important;border-color:rgba(185,122,17,.42)!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-chat-row:not(.mine) .dcc-chat-bubble{background:#fffefa!important;color:#17191d!important;border-color:rgba(185,122,17,.24)!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-ca-head h1{color:#17191d!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-ca-tab{color:#68717e!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-ca-tab.active{background:linear-gradient(145deg,#fff2c5,#edc45d)!important;color:#1d1608!important;border-color:#d6a53d!important;box-shadow:0 7px 18px rgba(185,125,20,.14)!important;text-shadow:none!important}
html.dcc-theme-light-premium body .dcc-ci-review{background:linear-gradient(145deg,#fffefa,#f8f0e2)!important;color:#17191d!important;border:1px solid rgba(190,132,31,.56)!important;box-shadow:0 28px 80px rgba(83,63,31,.20)!important}
html.dcc-theme-light-premium body .dcc-ci-review h1,html.dcc-theme-light-premium body .dcc-ci-review h2,html.dcc-theme-light-premium body .dcc-ci-review strong,html.dcc-theme-light-premium body .dcc-ci-review b{color:#17191d!important}
html.dcc-theme-light-premium body .dcc-ci-review [class*="row"],html.dcc-theme-light-premium body .dcc-ci-review [class*="metric"]{background:#fffaf1!important;color:#17191d!important;border-color:rgba(185,122,17,.24)!important}
html.dcc-theme-light-premium body .dcc-ci-review [class*="label"],html.dcc-theme-light-premium body .dcc-ci-review p{color:#657080!important}
`;
    document.head.appendChild(s);
  }
  function coachVisible(){const coach=document.getElementById('coach');if(!coach)return false;const st=getComputedStyle(coach);return st.display!=='none'&&st.visibility!=='hidden'}
  function syncSurface(){document.body?.classList.toggle('dcc-coach-surface',coachVisible())}
  function resetCoachScroll(){if(!coachVisible())return;try{window.scrollTo({top:0,left:0,behavior:'auto'})}catch(_){window.scrollTo(0,0)}const main=document.getElementById('coach-main');if(main)main.scrollTop=0}
  function fixClientSearch(){const input=document.getElementById('dccClientSearch');if(!input)return;const light=document.documentElement.classList.contains('dcc-theme-light-premium');input.style.setProperty('color',light?'#17191d':'#f4f1ed','important');input.style.setProperty('-webkit-text-fill-color',light?'#17191d':'#f4f1ed','important');input.style.setProperty('background','transparent','important');input.style.setProperty('box-shadow','none','important')}
  install();syncSurface();fixClientSearch();
  document.addEventListener('click',e=>{if(e.target.closest('#coach-nav button'))setTimeout(()=>{syncSurface();resetCoachScroll();fixClientSearch()},0);if(e.target.closest('#client-nav button'))setTimeout(syncSurface,0)},true);
  window.addEventListener('dcc:themechange',()=>{fixClientSearch();syncSurface()});
  const roots=[document.getElementById('coach'),document.getElementById('client')].filter(Boolean);if(roots.length){const o=new MutationObserver(()=>syncSurface());roots.forEach(r=>o.observe(r,{attributes:true,attributeFilter:['style','class']}))}
})();
