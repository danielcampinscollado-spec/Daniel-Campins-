/* DCC — entrenador Light Premium v5. Capa visual única, acotada al entrenador. */
(function(){
  'use strict';
  if(window.__dccCoachThemePremiumGlobalV5)return;
  window.__dccCoachThemePremiumGlobalV5=true;
  const ID='dcc-coach-theme-premium-global-v5';

  function install(){
    ['dcc-coach-theme-premium-global-v4','dcc-coach-theme-premium-global-v3','dcc-coach-theme-premium-global-v2','dcc-coach-theme-premium-global'].forEach(id=>document.getElementById(id)?.remove());
    if(document.getElementById(ID))return;
    const s=document.createElement('style');
    s.id=ID;
    s.textContent=`
/* ===== BASE ENTRENADOR LIGHT ===== */
html.dcc-theme-light-premium body #coach,
html.dcc-theme-light-premium body #coach #coach-main,
html.dcc-theme-light-premium body #coach #coach-main[class]{
  --cg:#b47a16;--cg2:#d7a13a;--ct:#17191d;--cm:#727985;--cline:rgba(183,122,20,.24);
  background:radial-gradient(circle at 88% 0,rgba(216,165,60,.08),transparent 26%),linear-gradient(180deg,#fffaf1 0%,#f6f0e5 56%,#f1e9dc 100%)!important;
  background-color:#f6f0e5!important;color:var(--ct)!important;
}
html.dcc-theme-light-premium body #coach #coach-main{min-height:100dvh!important;padding-top:max(22px,env(safe-area-inset-top))!important;padding-bottom:116px!important}
html.dcc-theme-light-premium body #coach #coach-main h1,
html.dcc-theme-light-premium body #coach #coach-main h2,
html.dcc-theme-light-premium body #coach #coach-main h3,
html.dcc-theme-light-premium body #coach #coach-main h4,
html.dcc-theme-light-premium body #coach #coach-main strong,
html.dcc-theme-light-premium body #coach #coach-main b{color:#17191d!important;text-shadow:none!important}
html.dcc-theme-light-premium body #coach #coach-main p,
html.dcc-theme-light-premium body #coach #coach-main .muted{color:#737b87!important}
html.dcc-theme-light-premium body:has(#coach:not([style*="display: none"])) .dcc-theme-trigger{display:none!important}

/* ===== NAVEGACIÓN ===== */
html.dcc-theme-light-premium body #coach #coach-nav{
  background:linear-gradient(145deg,#171b22,#0b0f14 62%,#10151b)!important;
  border:1px solid rgba(224,173,76,.66)!important;border-radius:24px!important;
  box-shadow:0 12px 34px rgba(34,27,16,.22),inset 0 1px 0 rgba(255,231,166,.08)!important;
}
html.dcc-theme-light-premium body #coach #coach-nav button{color:#d7a53f!important;background:transparent!important;border-color:transparent!important;box-shadow:none!important}
html.dcc-theme-light-premium body #coach #coach-nav button svg,
html.dcc-theme-light-premium body #coach #coach-nav button span{color:#d7a53f!important;stroke:currentColor!important;filter:none!important}
html.dcc-theme-light-premium body #coach #coach-nav button.active{
  color:#17130a!important;background:linear-gradient(145deg,#ffe59a,#edbd4d 72%,#d39a2b)!important;
  border-color:#f2cf72!important;border-radius:20px!important;
  box-shadow:0 0 0 2px rgba(177,119,18,.24),0 0 16px rgba(224,173,76,.24)!important;
}
html.dcc-theme-light-premium body #coach #coach-nav button.active svg,
html.dcc-theme-light-premium body #coach #coach-nav button.active span{color:#17130a!important;stroke:currentColor!important}

/* ===== CABECERAS COMUNES ===== */
html.dcc-theme-light-premium body #coach #coach-main [class$="-kicker"],
html.dcc-theme-light-premium body #coach #coach-main [class*="eyebrow"]{color:#b77b13!important;letter-spacing:3px!important;text-transform:uppercase!important;font-weight:850!important}

/* ===== PANEL ===== */
html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-hero,
html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-stat,
html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-accordion,
html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-inner,
html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-row{
  background:linear-gradient(145deg,#fffefa,#fbf6ed)!important;border-color:rgba(192,132,25,.31)!important;color:#17191d!important;
  box-shadow:0 9px 22px rgba(76,56,28,.055),inset 0 1px 0 rgba(255,255,255,.96)!important;
}
html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-hero{background:radial-gradient(circle at 88% 8%,rgba(216,165,60,.12),transparent 30%),linear-gradient(120deg,#fffdf8,#f7ecd8 72%,#efe0c4)!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-title{color:#17191d!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-title span{color:#c88a1e!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-caption,
html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-motto,
html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-head-sub,
html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-row-copy span{color:#727985!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-row-copy b{color:#17191d!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-mark,
html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-row-icon,
html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-head-ico{background:#fff3d5!important;color:#9d6810!important;border-color:rgba(183,122,20,.26)!important}

/* ===== CLIENTES ===== */
html.dcc-theme-light-premium body #coach #coach-main .dcc-cl-card,
html.dcc-theme-light-premium body #coach #coach-main .dcc-fcl-card{
  background:linear-gradient(145deg,#fffefa,#fbf6ec)!important;border:1px solid rgba(190,130,24,.30)!important;
  box-shadow:0 9px 22px rgba(77,58,31,.055)!important;color:#17191d!important;
}
html.dcc-theme-light-premium body #coach #coach-main .dcc-cl-name,
html.dcc-theme-light-premium body #coach #coach-main .dcc-fcl-name{color:#17191d!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-cl-goal,
html.dcc-theme-light-premium body #coach #coach-main .dcc-fcl-goal{color:#9a660d!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-cl-weight,
html.dcc-theme-light-premium body #coach #coach-main .dcc-cl-pct{color:#727985!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-cl-training{border-left-color:rgba(68,74,82,.20)!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-cl-tr-title{color:#555d68!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-cl-dumbbell{color:#d2a03c!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-cl-track{background:#2d333c!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-cl-search,
html.dcc-theme-light-premium body #coach #coach-main .dcc-fcl-search,
html.dcc-theme-light-premium body #coach #coach-main .dcc-u-search,
html.dcc-theme-light-premium body #coach #coach-main .dcc-cl-filter,
html.dcc-theme-light-premium body #coach #coach-main .dcc-cl-tabs,
html.dcc-theme-light-premium body #coach #coach-main .dcc-cl-sort,
html.dcc-theme-light-premium body #coach #coach-main .dcc-fcl-tabs,
html.dcc-theme-light-premium body #coach #coach-main .dcc-fcl-sort{
  background:#fffefa!important;background-color:#fffefa!important;color:#59636f!important;border-color:rgba(183,122,20,.25)!important;box-shadow:none!important;
}
html.dcc-theme-light-premium body #coach #coach-main .dcc-cl-search>*,
html.dcc-theme-light-premium body #coach #coach-main .dcc-fcl-search>*,
html.dcc-theme-light-premium body #coach #coach-main .dcc-u-search>*{background:transparent!important;background-color:transparent!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-cl-search input,
html.dcc-theme-light-premium body #coach #coach-main .dcc-fcl-search input,
html.dcc-theme-light-premium body #coach #coach-main .dcc-u-search input,
html.dcc-theme-light-premium body #coach #coach-main #dccClientSearch{background:transparent!important;color:#17191d!important;-webkit-text-fill-color:#17191d!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-cl-tab,
html.dcc-theme-light-premium body #coach #coach-main .dcc-fcl-tab{color:#727985!important;background:transparent!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-cl-tab.active,
html.dcc-theme-light-premium body #coach #coach-main .dcc-fcl-tab.active{background:linear-gradient(145deg,#fff0bd,#efc35d)!important;color:#20170a!important;border-color:#d6a23a!important;box-shadow:none!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-cl-manage,
html.dcc-theme-light-premium body #coach #coach-main .dcc-fcl-card button{background:#fffaf1!important;color:#875707!important;border-color:rgba(183,122,20,.43)!important;box-shadow:none!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-cl-new,
html.dcc-theme-light-premium body #coach #coach-main .dcc-fcl-new{background:linear-gradient(135deg,#f5d581,#dca83e)!important;color:#17130a!important;border-color:#e8bb52!important}

/* ===== CHECK-IN: más compacto y con jerarquía ===== */
html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-checkins .dcc-ci-tabs{
  min-height:58px!important;padding:5px!important;background:#fffefa!important;border:1px solid rgba(183,122,20,.24)!important;border-radius:24px!important;
  box-shadow:0 8px 20px rgba(77,58,31,.045)!important;
}
html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-checkins .dcc-ci-tab{min-height:46px!important;border-radius:19px!important;color:#69717d!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-checkins .dcc-ci-tab.active{background:linear-gradient(145deg,#fff0bd,#efc35d)!important;color:#1e1609!important;border:1px solid #d6a23a!important;box-shadow:0 6px 15px rgba(170,111,14,.10)!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-checkins .dcc-ci-count{background:#edf0f3!important;color:#343a42!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-checkins .dcc-ci-tab.active .dcc-ci-count{background:rgba(151,95,8,.11)!important;color:#805206!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-checkins .dcc-ci-card,
html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-checkins .dcc-ci-empty{
  min-height:96px!important;background:linear-gradient(145deg,#fffefa,#fbf6ec)!important;color:#17191d!important;
  border:1px solid rgba(190,130,24,.30)!important;border-radius:22px!important;box-shadow:0 9px 22px rgba(77,58,31,.055)!important;
}
html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-checkins .dcc-ci-name{color:#17191d!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-checkins .dcc-ci-avatar{background:#14191f!important;color:#f0c96b!important;border-color:rgba(217,170,74,.60)!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-checkins .dcc-ci-open{background:#fffaf1!important;color:#875707!important;border-color:rgba(183,122,20,.43)!important}

/* ===== MENSAJES: tarjetas más limpias ===== */
html.dcc-theme-light-premium body #coach #coach-main .dcc-msg-search{height:58px!important;background:#fffefa!important;color:#17191d!important;border:1px solid rgba(183,122,20,.25)!important;border-radius:20px!important;box-shadow:0 8px 20px rgba(77,58,31,.045)!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-msg-search input{background:transparent!important;color:#17191d!important;-webkit-text-fill-color:#17191d!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-msg-card{
  min-height:104px!important;background:linear-gradient(145deg,#fffefa,#fbf6ec)!important;color:#17191d!important;
  border:1px solid rgba(190,130,24,.30)!important;border-radius:22px!important;box-shadow:0 9px 22px rgba(77,58,31,.055)!important;
}
html.dcc-theme-light-premium body #coach #coach-main .dcc-msg-name{color:#17191d!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-msg-avatar{background:#14191f!important;color:#f0c96b!important;border-color:rgba(217,170,74,.60)!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-msg-open,
html.dcc-theme-light-premium body #coach #coach-main .dcc-msg-card button{background:#151a20!important;color:#efc55f!important;border-color:rgba(217,170,74,.62)!important;box-shadow:none!important}

/* Chat real */
html.dcc-theme-light-premium body #coach #coach-main.dcc-message-chat-v2{background:linear-gradient(180deg,#fffaf1,#f5efe4)!important;color:#17191d!important}
html.dcc-theme-light-premium body .dcc-mcv2-back{background:#151a20!important;color:#f3c960!important;border-color:rgba(217,170,74,.56)!important}
html.dcc-theme-light-premium body .dcc-mcv2-person{border-bottom-color:rgba(56,61,67,.22)!important}
html.dcc-theme-light-premium body .dcc-mcv2-person h1{color:#17191d!important}
html.dcc-theme-light-premium body .dcc-mcv2-status{color:#727985!important}
html.dcc-theme-light-premium body .dcc-mcv2-avatar,
html.dcc-theme-light-premium body .dcc-mcv2-mini{background:#14191f!important;color:#f0c96b!important;border-color:rgba(217,170,74,.60)!important}
html.dcc-theme-light-premium body .dcc-mcv2-empty{background:#fffefa!important;color:#727985!important;border:1px solid rgba(183,122,20,.25)!important;border-radius:20px!important;box-shadow:0 8px 20px rgba(77,58,31,.045)!important}
html.dcc-theme-light-premium body .dcc-mcv2-bubble{background:#fffefa!important;color:#17191d!important;border-color:rgba(183,122,20,.22)!important}
html.dcc-theme-light-premium body .dcc-mcv2-row.mine .dcc-mcv2-bubble{background:#fff0c8!important;color:#17191d!important;border-color:rgba(183,122,20,.38)!important}
html.dcc-theme-light-premium body .dcc-mcv2-composer{background:#fffaf1!important;border-color:rgba(183,122,20,.36)!important;box-shadow:0 -8px 24px rgba(77,58,31,.09)!important}
html.dcc-theme-light-premium body .dcc-mcv2-input{background:#fffefa!important;color:#17191d!important;-webkit-text-fill-color:#17191d!important;border-color:rgba(117,108,92,.23)!important}

/* ===== CALENDARIO: compacto, sin bloque gigante ===== */
html.dcc-theme-light-premium body #coach #coach-main.dcc-cal-v11 .dcc-cal-head{margin-bottom:18px!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-cal-v11 .dcc-cal-head h1{font-size:34px!important;color:#17191d!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-cal-v11 .dcc-cal-new{background:linear-gradient(135deg,#f5d581,#dca83e)!important;color:#17130a!important;border-color:#e8bb52!important;box-shadow:0 8px 20px rgba(174,115,16,.14)!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-cal-v11 .dcc-cal-tabs{height:58px!important;padding:5px!important;background:#fffefa!important;border:1px solid rgba(183,122,20,.24)!important;border-radius:24px!important;box-shadow:0 8px 20px rgba(77,58,31,.045)!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-cal-v11 .dcc-cal-tab{border-radius:19px!important;color:#69717d!important;background:transparent!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-cal-v11 .dcc-cal-tab.active{background:linear-gradient(145deg,#fff0bd,#efc35d)!important;color:#1e1609!important;border:1px solid #d6a23a!important;box-shadow:none!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-cal-v11 .dcc-cal-card{
  min-height:0!important;margin-top:16px!important;padding:16px!important;background:linear-gradient(145deg,#fffefa,#fbf6ec)!important;
  border:1px solid rgba(190,130,24,.30)!important;border-radius:24px!important;box-shadow:0 10px 24px rgba(77,58,31,.06)!important;
}
html.dcc-theme-light-premium body #coach #coach-main.dcc-cal-v11 .dcc-cal-month-head{min-height:52px!important;margin-bottom:10px!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-cal-v11 .dcc-cal-month-head strong{font-size:23px!important;color:#17191d!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-cal-v11 .dcc-cal-move{width:48px!important;height:48px!important;border-radius:15px!important;background:#fffaf1!important;color:#5f6670!important;border-color:rgba(86,93,101,.28)!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-cal-v11 .dcc-cal-week{margin:2px 0 6px!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-cal-v11 .dcc-cal-week span{color:#89909a!important;font-size:10px!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-cal-v11 .dcc-cal-grid{gap:5px!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-cal-v11 .dcc-cal-day{height:42px!important;min-height:42px!important;border-radius:50%!important;color:#25292e!important;background:transparent!important;font-size:13px!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-cal-v11 .dcc-cal-day.out{color:#b5bac0!important;opacity:.65!important;background:transparent!important;border-color:transparent!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-cal-v11 .dcc-cal-day.selected{background:#171b21!important;color:#fff6e3!important;border:1px solid #d7a53f!important;box-shadow:0 4px 10px rgba(39,30,15,.16)!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-cal-v11 .dcc-cal-day.today:not(.selected){background:#fff1c8!important;color:#8b5908!important;border:1px solid rgba(183,122,20,.40)!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-cal-v11 .dcc-cal-agenda{margin-top:14px!important;padding:15px!important;background:linear-gradient(145deg,#fffefa,#fbf6ec)!important;border:1px solid rgba(190,130,24,.27)!important;border-radius:22px!important;box-shadow:0 9px 22px rgba(77,58,31,.05)!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-cal-v11 .dcc-cal-agenda-head{margin-bottom:10px!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-cal-v11 .dcc-cal-agenda-head h2{font-size:22px!important;color:#17191d!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-cal-v11 .dcc-cal-date-label{color:#7a828d!important;font-size:11px!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-cal-v11 .dcc-cal-empty,
html.dcc-theme-light-premium body #coach #coach-main.dcc-cal-v11 .dcc-cal-session{background:#fffaf1!important;color:#17191d!important;border-color:rgba(183,122,20,.22)!important;border-radius:16px!important;box-shadow:none!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-cal-v11 .dcc-cal-agenda-only{display:none!important}

/* ===== FICHA CLIENTE / PLAN ===== */
html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-ca-card,
html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-ca-metric,
html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-ca-activity-item,
html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-p5-section,
html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-p5-card{background:linear-gradient(145deg,#fffefa,#fbf6ec)!important;color:#17191d!important;border-color:rgba(190,130,24,.29)!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-ca-back{background:#151a20!important;color:#f0c96b!important;border-color:rgba(217,170,74,.55)!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-v5-plan{background:linear-gradient(145deg,#fff8e9,#f4ead8)!important;border-color:rgba(183,122,20,.32)!important;box-shadow:0 8px 20px rgba(77,58,31,.05)!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-v5-plan-title{color:#93610d!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-v5-plan-item{background:#fffefa!important;color:#17191d!important;border-color:rgba(117,108,92,.20)!important;box-shadow:none!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-v5-plan-item b{color:#17191d!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-v5-plan-item small{color:#727985!important}

/* ===== MODALES ENTRENADOR ===== */
html.dcc-theme-light-premium body #modal.dcc-new-client-overlay,
html.dcc-theme-light-premium body .dcc-ci-modal,
html.dcc-theme-light-premium body #dcc-session-standalone-overlay{background:rgba(28,24,18,.44)!important}
html.dcc-theme-light-premium body #modal.dcc-new-client-overlay .modal-box,
html.dcc-theme-light-premium body .dcc-ci-modal .dcc-ci-review,
html.dcc-theme-light-premium body #dcc-session-standalone-overlay .dcc-session-card{background:linear-gradient(145deg,#fffefa,#f8f0e2)!important;background-color:#fffaf1!important;color:#17191d!important;border-color:rgba(190,130,24,.44)!important;box-shadow:0 24px 64px rgba(47,36,18,.22)!important}
html.dcc-theme-light-premium body #modal.dcc-new-client-overlay .dcc-nc-title,
html.dcc-theme-light-premium body .dcc-ci-modal h2,
html.dcc-theme-light-premium body #dcc-session-standalone-overlay h2,
html.dcc-theme-light-premium body #dcc-session-standalone-overlay label{color:#17191d!important;-webkit-text-fill-color:#17191d!important}
html.dcc-theme-light-premium body #modal.dcc-new-client-overlay .dcc-nc-input,
html.dcc-theme-light-premium body #modal.dcc-new-client-overlay .dcc-nc-select,
html.dcc-theme-light-premium body #dcc-session-standalone-overlay input,
html.dcc-theme-light-premium body #dcc-session-standalone-overlay select,
html.dcc-theme-light-premium body #dcc-session-standalone-overlay textarea{background:#fffefa!important;color:#17191d!important;-webkit-text-fill-color:#17191d!important;border-color:rgba(117,108,92,.24)!important;box-shadow:none!important}
html.dcc-theme-light-premium body .dcc-ci-modal .dcc-ci-review-row{background:#fffaf1!important;color:#17191d!important;border-color:rgba(183,122,20,.22)!important}
html.dcc-theme-light-premium body #dcc-session-standalone-overlay .save{background:linear-gradient(135deg,#f5d581,#dca83e)!important;color:#18140c!important;border-color:#e9bd55!important}

@media(max-width:520px){
  html.dcc-theme-light-premium body #coach #coach-main{padding-top:max(20px,env(safe-area-inset-top))!important}
  html.dcc-theme-light-premium body #coach #coach-main.dcc-cal-v11 .dcc-cal-card{padding:13px!important}
  html.dcc-theme-light-premium body #coach #coach-main.dcc-cal-v11 .dcc-cal-day{height:39px!important;min-height:39px!important}
  html.dcc-theme-light-premium body #coach #coach-main.dcc-cal-v11 .dcc-cal-month-head strong{font-size:21px!important}
}
`;
    document.head.appendChild(s);
  }

  function resetCoachScroll(){
    requestAnimationFrame(()=>window.scrollTo({top:0,left:0,behavior:'auto'}));
    setTimeout(()=>window.scrollTo({top:0,left:0,behavior:'auto'}),60);
  }

  install();
  document.addEventListener('DOMContentLoaded',install,{once:true});
  window.addEventListener('dcc:themechange',install);
  document.addEventListener('click',e=>{if(e.target.closest('#coach-nav button'))resetCoachScroll()},true);
})();
