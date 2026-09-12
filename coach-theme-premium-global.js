/* DCC — tema final entrenador Light Premium v4. Solo entrenador; sin observers globales. */
(function(){
  'use strict';
  if(window.__dccCoachThemePremiumGlobalV4)return;
  window.__dccCoachThemePremiumGlobalV4=true;
  const ID='dcc-coach-theme-premium-global-v4';

  function install(){
    ['dcc-coach-theme-premium-global-v3','dcc-coach-theme-premium-global-v2','dcc-coach-theme-premium-global'].forEach(id=>document.getElementById(id)?.remove());
    if(document.getElementById(ID))return;
    const s=document.createElement('style');
    s.id=ID;
    s.textContent=`
/* =========================================================
   ENTRENADOR · LIGHT PREMIUM
   ========================================================= */
html.dcc-theme-light-premium body #coach,
html.dcc-theme-light-premium body #coach #coach-main,
html.dcc-theme-light-premium body #coach #coach-main[class]{
  --dcc-coach-gold:#b77b13;
  --dcc-coach-gold2:#d8a53c;
  --dcc-coach-text:#17191d;
  --dcc-coach-muted:#68717d;
  --dcc-coach-line:rgba(185,122,17,.28);
  background:radial-gradient(circle at 88% 0,rgba(214,163,61,.10),transparent 27%),linear-gradient(180deg,#fffaf1 0%,#f5efe4 62%,#f1e9dc 100%)!important;
  background-color:#f5efe4!important;
  color:#17191d!important;
}
html.dcc-theme-light-premium body #coach #coach-main{
  min-height:100dvh!important;
  padding-top:max(22px,env(safe-area-inset-top))!important;
  padding-bottom:118px!important;
}
html.dcc-theme-light-premium body #coach #coach-main h1,
html.dcc-theme-light-premium body #coach #coach-main h2,
html.dcc-theme-light-premium body #coach #coach-main h3,
html.dcc-theme-light-premium body #coach #coach-main h4,
html.dcc-theme-light-premium body #coach #coach-main strong,
html.dcc-theme-light-premium body #coach #coach-main b{color:#17191d!important;text-shadow:none!important}
html.dcc-theme-light-premium body #coach #coach-main p,
html.dcc-theme-light-premium body #coach #coach-main .muted,
html.dcc-theme-light-premium body #coach #coach-main [class*="sub"],
html.dcc-theme-light-premium body #coach #coach-main [class*="meta"]{color:#68717d!important}

/* Apariencia: nunca flota encima de pantallas del entrenador. */
html.dcc-theme-light-premium body:has(#coach-main.dcc-p9-dashboard) .dcc-theme-trigger,
html.dcc-theme-light-premium body:has(#coach-main.dcc-premium-clients) .dcc-theme-trigger,
html.dcc-theme-light-premium body:has(#coach-main.dcc-final-clients) .dcc-theme-trigger,
html.dcc-theme-light-premium body:has(#coach-main.dcc-cal-v11) .dcc-theme-trigger,
html.dcc-theme-light-premium body:has(#coach-main.dcc-premium-checkins) .dcc-theme-trigger,
html.dcc-theme-light-premium body:has(#coach-main.dcc-premium-messages) .dcc-theme-trigger,
html.dcc-theme-light-premium body:has(#coach-main.dcc-message-chat-v2) .dcc-theme-trigger,
html.dcc-theme-light-premium body:has(#coach-main.dcc-premium-chat) .dcc-theme-trigger,
html.dcc-theme-light-premium body:has(#coach-main.dcc-ca) .dcc-theme-trigger{display:none!important}

/* Navegación entrenador: grafito + dorado, igual que el cliente. */
html.dcc-theme-light-premium body #coach #coach-nav{
  background:linear-gradient(145deg,#171b22,#0b0f14 62%,#10151b)!important;
  border:1px solid rgba(224,173,76,.62)!important;
  box-shadow:0 12px 34px rgba(34,27,16,.24),inset 0 1px 0 rgba(255,231,166,.08)!important;
}
html.dcc-theme-light-premium body #coach #coach-nav button{color:#d7a53f!important;background:transparent!important;border-color:transparent!important;box-shadow:none!important}
html.dcc-theme-light-premium body #coach #coach-nav button svg,
html.dcc-theme-light-premium body #coach #coach-nav button span{color:#d7a53f!important;stroke:currentColor!important;filter:none!important}
html.dcc-theme-light-premium body #coach #coach-nav button.active{
  color:#17130a!important;
  background:linear-gradient(145deg,#ffe69a,#edbd4d 72%,#d29a2c)!important;
  border-color:#f2cf72!important;
  box-shadow:0 0 0 2px rgba(177,119,18,.26),0 0 17px rgba(224,173,76,.24)!important;
}
html.dcc-theme-light-premium body #coach #coach-nav button.active svg,
html.dcc-theme-light-premium body #coach #coach-nav button.active span{color:#17130a!important;stroke:currentColor!important}

/* =========================================================
   PANEL
   ========================================================= */
html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-hero,
html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-stat,
html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-accordion,
html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-inner,
html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-row{
  background:linear-gradient(145deg,#fffefa,#fbf6ec)!important;
  color:#17191d!important;
  border-color:rgba(198,139,32,.36)!important;
  box-shadow:0 10px 26px rgba(83,63,31,.07),inset 0 1px 0 rgba(255,255,255,.95)!important;
}
html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-hero{background:radial-gradient(circle at 88% 8%,rgba(216,165,60,.10),transparent 30%),linear-gradient(120deg,#fffdf8,#f7ecd8 72%,#efe0c4)!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-kicker,
html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-head-title,
html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-stat-arrow,
html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-caret{color:#a86d0d!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-title{color:#17191d!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-title span{color:#c88a1e!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-caption,
html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-motto,
html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-head-sub,
html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-row-copy span{color:#707985!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-row-copy b{color:#17191d!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-mark,
html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-row-icon,
html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-head-ico{background:#fff5dc!important;color:#a86d0d!important;border-color:rgba(185,122,17,.30)!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-badge{background:#fff5dc!important;color:#98640b!important;border-color:rgba(185,122,17,.30)!important}

/* =========================================================
   CLIENTES — ambas variantes activas
   ========================================================= */
html.dcc-theme-light-premium body #coach #coach-main .dcc-cl-card,
html.dcc-theme-light-premium body #coach #coach-main .dcc-fcl-card{
  background:linear-gradient(145deg,#fffefa,#fbf6ec)!important;
  color:#17191d!important;
  border-color:rgba(198,139,32,.38)!important;
  box-shadow:0 10px 24px rgba(83,63,31,.07)!important;
}
html.dcc-theme-light-premium body #coach #coach-main .dcc-cl-name,
html.dcc-theme-light-premium body #coach #coach-main .dcc-fcl-name{color:#17191d!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-cl-goal,
html.dcc-theme-light-premium body #coach #coach-main .dcc-fcl-goal{color:#a46b0b!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-cl-weight,
html.dcc-theme-light-premium body #coach #coach-main .dcc-cl-pct{color:#68717d!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-cl-training{border-left-color:rgba(80,86,94,.24)!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-cl-tr-title{color:#4d5661!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-cl-dumbbell{color:#d8a53c!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-cl-track{background:#293039!important}

/* Buscador: elimina los extremos negros que quedaban del CSS antiguo. */
html.dcc-theme-light-premium body #coach #coach-main .dcc-cl-search,
html.dcc-theme-light-premium body #coach #coach-main .dcc-fcl-search,
html.dcc-theme-light-premium body #coach #coach-main .dcc-u-search{
  background:#fffefa!important;
  background-color:#fffefa!important;
  color:#59636f!important;
  border-color:rgba(185,122,17,.30)!important;
  box-shadow:none!important;
}
html.dcc-theme-light-premium body #coach #coach-main .dcc-cl-search>*,
html.dcc-theme-light-premium body #coach #coach-main .dcc-fcl-search>*,
html.dcc-theme-light-premium body #coach #coach-main .dcc-u-search>*{background-color:transparent!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-cl-search input,
html.dcc-theme-light-premium body #coach #coach-main .dcc-fcl-search input,
html.dcc-theme-light-premium body #coach #coach-main .dcc-u-search input,
html.dcc-theme-light-premium body #coach #coach-main #dccClientSearch{
  background:transparent!important;
  color:#17191d!important;
  -webkit-text-fill-color:#17191d!important;
  caret-color:#a86d0d!important;
}
html.dcc-theme-light-premium body #coach #coach-main .dcc-cl-search input::placeholder,
html.dcc-theme-light-premium body #coach #coach-main .dcc-fcl-search input::placeholder,
html.dcc-theme-light-premium body #coach #coach-main .dcc-u-search input::placeholder{color:#7a8390!important;-webkit-text-fill-color:#7a8390!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-cl-filter,
html.dcc-theme-light-premium body #coach #coach-main .dcc-cl-tabs,
html.dcc-theme-light-premium body #coach #coach-main .dcc-cl-sort,
html.dcc-theme-light-premium body #coach #coach-main .dcc-fcl-tabs,
html.dcc-theme-light-premium body #coach #coach-main .dcc-fcl-sort{background:#fffefa!important;color:#59636f!important;border-color:rgba(185,122,17,.28)!important;box-shadow:none!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-cl-tab,
html.dcc-theme-light-premium body #coach #coach-main .dcc-fcl-tab{color:#68717d!important;background:transparent!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-cl-tab.active,
html.dcc-theme-light-premium body #coach #coach-main .dcc-fcl-tab.active{background:linear-gradient(145deg,#fff1c5,#edc15a)!important;color:#1d1608!important;border-color:#d7a43a!important;box-shadow:none!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-cl-manage,
html.dcc-theme-light-premium body #coach #coach-main .dcc-fcl-card button{background:#fffaf1!important;color:#8f5d0a!important;border-color:rgba(185,122,17,.50)!important;box-shadow:none!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-cl-new,
html.dcc-theme-light-premium body #coach #coach-main .dcc-fcl-new{background:linear-gradient(135deg,#f5d581,#dca83e)!important;color:#18140c!important;border-color:#e9bd55!important}

/* =========================================================
   CHECK-IN
   ========================================================= */
html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-checkins .dcc-ci-card,
html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-checkins .dcc-ci-empty{background:linear-gradient(145deg,#fffefa,#fbf6ec)!important;color:#17191d!important;border-color:rgba(198,139,32,.36)!important;box-shadow:0 9px 22px rgba(83,63,31,.06)!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-checkins .dcc-ci-head h1,
html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-checkins .dcc-ci-name{color:#17191d!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-checkins .dcc-ci-head p{color:#68717d!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-checkins .dcc-ci-tabs{background:#fffefa!important;border-color:rgba(185,122,17,.28)!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-checkins .dcc-ci-tab{color:#68717d!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-checkins .dcc-ci-tab.active{background:linear-gradient(145deg,#fff1c5,#edc15a)!important;color:#1d1608!important;border-color:#d7a43a!important;box-shadow:none!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-checkins .dcc-ci-count{background:#eef0f2!important;color:#343a42!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-checkins .dcc-ci-tab.active .dcc-ci-count{background:rgba(185,122,17,.12)!important;color:#8d5a08!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-checkins .dcc-ci-avatar{background:#10151b!important;color:#f0c96b!important;border-color:rgba(217,170,74,.60)!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-checkins .dcc-ci-open{background:#fffaf1!important;color:#8f5d0a!important;border-color:rgba(185,122,17,.48)!important}

/* =========================================================
   MENSAJES — lista y detalle real
   ========================================================= */
html.dcc-theme-light-premium body #coach #coach-main .dcc-msg-card{background:linear-gradient(145deg,#fffefa,#fbf6ec)!important;color:#17191d!important;border-color:rgba(198,139,32,.36)!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-msg-name{color:#17191d!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-msg-search{background:#fffefa!important;color:#17191d!important;border-color:rgba(185,122,17,.28)!important}

html.dcc-theme-light-premium body #coach #coach-main.dcc-message-chat-v2{background:radial-gradient(circle at 88% 0,rgba(214,163,61,.08),transparent 28%),linear-gradient(180deg,#fffaf1,#f5efe4)!important;color:#17191d!important}
html.dcc-theme-light-premium body .dcc-mcv2-back{background:#171b21!important;color:#f4f2ec!important;border-color:rgba(185,122,17,.48)!important}
html.dcc-theme-light-premium body .dcc-mcv2-person{border-bottom-color:rgba(58,63,69,.24)!important}
html.dcc-theme-light-premium body .dcc-mcv2-person h1{color:#17191d!important}
html.dcc-theme-light-premium body .dcc-mcv2-status{color:#68717d!important}
html.dcc-theme-light-premium body .dcc-mcv2-avatar,
html.dcc-theme-light-premium body .dcc-mcv2-mini{background:#10151b!important;color:#f0c96b!important;border-color:rgba(217,170,74,.60)!important}
html.dcc-theme-light-premium body .dcc-mcv2-day{color:#7a8390!important}
html.dcc-theme-light-premium body .dcc-mcv2-day:before,
html.dcc-theme-light-premium body .dcc-mcv2-day:after{background:rgba(58,63,69,.22)!important}
html.dcc-theme-light-premium body .dcc-mcv2-empty{
  background:linear-gradient(145deg,#fffefa,#fbf6ec)!important;
  background-color:#fffaf1!important;
  color:#68717d!important;
  border-color:rgba(185,122,17,.30)!important;
  box-shadow:0 8px 20px rgba(83,63,31,.06)!important;
}
html.dcc-theme-light-premium body .dcc-mcv2-bubble{background:#fffefa!important;color:#17191d!important;border-color:rgba(185,122,17,.24)!important;box-shadow:0 5px 14px rgba(83,63,31,.05)!important}
html.dcc-theme-light-premium body .dcc-mcv2-row.mine .dcc-mcv2-bubble{background:#fff1c9!important;color:#17191d!important;border-color:rgba(185,122,17,.40)!important}
html.dcc-theme-light-premium body .dcc-mcv2-time{color:#7a8390!important}
html.dcc-theme-light-premium body .dcc-mcv2-composer{
  background:#fffaf1!important;
  background-color:#fffaf1!important;
  border-color:rgba(185,122,17,.44)!important;
  box-shadow:0 -8px 28px rgba(83,63,31,.10)!important;
}
html.dcc-theme-light-premium body .dcc-mcv2-input{
  background:#fffefa!important;
  color:#17191d!important;
  -webkit-text-fill-color:#17191d!important;
  border-color:rgba(128,117,99,.28)!important;
}
html.dcc-theme-light-premium body .dcc-mcv2-input::placeholder{color:#7a8390!important;-webkit-text-fill-color:#7a8390!important}

/* =========================================================
   CALENDARIO
   ========================================================= */
html.dcc-theme-light-premium body #coach #coach-main.dcc-cal-v11 .dcc-cal-card,
html.dcc-theme-light-premium body #coach #coach-main.dcc-cal-v11 .dcc-cal-agenda,
html.dcc-theme-light-premium body #coach #coach-main.dcc-cal-v11 .dcc-cal-empty,
html.dcc-theme-light-premium body #coach #coach-main.dcc-cal-v11 .dcc-cal-session{background:linear-gradient(145deg,#fffefa,#fbf6ec)!important;color:#17191d!important;border-color:rgba(198,139,32,.34)!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-cal-v11 .dcc-cal-tabs{background:#fffefa!important;border-color:rgba(185,122,17,.28)!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-cal-v11 .dcc-cal-tab{color:#68717d!important;background:transparent!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-cal-v11 .dcc-cal-tab.active{background:linear-gradient(145deg,#fff1c5,#edc15a)!important;color:#1d1608!important;border-color:#d7a43a!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-cal-v11 .dcc-cal-day{color:#25292e!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-cal-v11 .dcc-cal-day.out{color:#a1a7af!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-cal-v11 .dcc-cal-day.selected{background:#fff5d8!important;color:#8d5a08!important;border-color:#d8a63d!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-cal-v11 .dcc-cal-day.today{background:#17191d!important;color:#fff8e9!important}

/* =========================================================
   FICHA CLIENTE / ADMIN
   ========================================================= */
html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-ca-card,
html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-ca-metric,
html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-ca-activity-item,
html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-p5-section,
html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-p5-card{background:linear-gradient(145deg,#fffefa,#fbf6ec)!important;color:#17191d!important;border-color:rgba(198,139,32,.34)!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-ca-head h1{color:#17191d!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-ca-tabs{background:#fffefa!important;border-color:rgba(185,122,17,.28)!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-ca-tab{color:#68717d!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-ca-tab.active{background:linear-gradient(145deg,#fff1c5,#edc15a)!important;color:#1d1608!important;border-color:#d7a43a!important}

/* Plan pendiente: era el bloque negro grande de la captura. */
html.dcc-theme-light-premium body #coach #coach-main .dcc-v5-plan{
  background:linear-gradient(145deg,#fff9ec,#f4ead8)!important;
  border-color:rgba(185,122,17,.38)!important;
  box-shadow:0 9px 24px rgba(83,63,31,.07)!important;
}
html.dcc-theme-light-premium body #coach #coach-main .dcc-v5-plan-title{color:#9a6915!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-v5-plan-item{
  background:#fffefa!important;
  color:#17191d!important;
  border-color:rgba(122,111,91,.24)!important;
  box-shadow:none!important;
}
html.dcc-theme-light-premium body #coach #coach-main .dcc-v5-plan-item b{color:#17191d!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-v5-plan-item small{color:#68717d!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-v5-plan-go{color:#b77b13!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-v5-foods,
html.dcc-theme-light-premium body #coach #coach-main .dcc-v5-diet-warning{background:#fff7e6!important;color:#17191d!important;border-color:rgba(185,122,17,.32)!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-v5-foods b,
html.dcc-theme-light-premium body #coach #coach-main .dcc-v5-diet-warning p{color:#343a42!important}

/* =========================================================
   MODALES GLOBALES DEL ENTRENADOR
   ========================================================= */
html.dcc-theme-light-premium body #modal.dcc-new-client-overlay,
html.dcc-theme-light-premium body .dcc-ci-modal,
html.dcc-theme-light-premium body #dcc-session-standalone-overlay{background:rgba(28,24,18,.46)!important}
html.dcc-theme-light-premium body #modal.dcc-new-client-overlay .modal-box,
html.dcc-theme-light-premium body .dcc-ci-modal .dcc-ci-review,
html.dcc-theme-light-premium body #dcc-session-standalone-overlay .dcc-session-card{
  background:radial-gradient(circle at 94% 0,rgba(214,163,61,.08),transparent 28%),linear-gradient(145deg,#fffefa,#f8f0e2)!important;
  background-color:#fffaf1!important;
  color:#17191d!important;
  border-color:rgba(198,139,32,.55)!important;
  box-shadow:0 26px 70px rgba(47,36,18,.26)!important;
}
html.dcc-theme-light-premium body #modal.dcc-new-client-overlay .dcc-nc-title,
html.dcc-theme-light-premium body .dcc-ci-modal h2,
html.dcc-theme-light-premium body #dcc-session-standalone-overlay h2,
html.dcc-theme-light-premium body #dcc-session-standalone-overlay label{color:#17191d!important;-webkit-text-fill-color:#17191d!important}
html.dcc-theme-light-premium body #modal.dcc-new-client-overlay .dcc-nc-sub,
html.dcc-theme-light-premium body #dcc-session-standalone-overlay .sub{color:#9a6915!important}
html.dcc-theme-light-premium body #modal.dcc-new-client-overlay .dcc-nc-label,
html.dcc-theme-light-premium body .dcc-ci-modal .dcc-ci-rvalue{color:#24272c!important}
html.dcc-theme-light-premium body #modal.dcc-new-client-overlay .dcc-nc-input,
html.dcc-theme-light-premium body #modal.dcc-new-client-overlay .dcc-nc-select,
html.dcc-theme-light-premium body #dcc-session-standalone-overlay input,
html.dcc-theme-light-premium body #dcc-session-standalone-overlay select,
html.dcc-theme-light-premium body #dcc-session-standalone-overlay textarea{
  background:#fffefa!important;color:#17191d!important;-webkit-text-fill-color:#17191d!important;border-color:rgba(139,127,107,.30)!important;box-shadow:none!important;
}
html.dcc-theme-light-premium body .dcc-ci-modal .dcc-ci-review-row{background:#fffaf1!important;color:#17191d!important;border-color:rgba(185,122,17,.24)!important}
html.dcc-theme-light-premium body .dcc-ci-modal .dcc-ci-rlabel,
html.dcc-theme-light-premium body .dcc-ci-modal .dcc-ci-rside{color:#68717d!important}
html.dcc-theme-light-premium body .dcc-ci-modal .dcc-ci-rico{background:#fff4d8!important;color:#a86d0d!important;border-color:rgba(185,122,17,.28)!important}
html.dcc-theme-light-premium body .dcc-ci-modal .dcc-ci-reviewed{background:#eaf7ef!important;color:#218653!important;border-color:rgba(52,153,96,.28)!important}
html.dcc-theme-light-premium body .dcc-ci-modal .dcc-ci-rside.good{color:#218653!important}
html.dcc-theme-light-premium body .dcc-ci-modal .dcc-ci-rside.bad{color:#c64e56!important}
html.dcc-theme-light-premium body .dcc-ci-modal .dcc-ci-rside.neutral{color:#68717d!important}
html.dcc-theme-light-premium body #dcc-session-standalone-overlay .save{background:linear-gradient(135deg,#f5d581,#dca83e)!important;color:#18140c!important;border-color:#e9bd55!important}

@media(max-width:520px){
  html.dcc-theme-light-premium body #coach #coach-main{padding-top:max(22px,env(safe-area-inset-top))!important}
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
  document.addEventListener('click',function(e){
    if(e.target.closest('#coach-nav button'))resetCoachScroll();
  },true);
})();
