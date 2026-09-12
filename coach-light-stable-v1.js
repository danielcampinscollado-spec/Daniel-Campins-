/* DCC — Coach Light Premium estable v1
   Una sola capa visual para todo el panel de entrenador.
   No modifica datos ni lógica funcional. */
(function(){
  'use strict';
  if(window.__dccCoachLightStableV1)return;
  window.__dccCoachLightStableV1=true;

  const ID='dcc-coach-light-stable-v1';

  function coachVisible(){
    const coach=document.getElementById('coach');
    if(!coach)return false;
    const cs=getComputedStyle(coach);
    return cs.display!=='none' && cs.visibility!=='hidden';
  }

  function syncMode(){
    document.documentElement.classList.add('dcc-theme-light-premium');
    document.body?.classList.toggle('dcc-coach-mode',coachVisible());
  }

  function install(){
    document.getElementById(ID)?.remove();
    const s=document.createElement('style');
    s.id=ID;
    s.textContent=`
/* =========================================================
   DCC COACH — LIGHT PREMIUM ESTABLE
   ========================================================= */
html.dcc-theme-light-premium body #coach{
  --dcc-coach-bg:#f5efe4;
  --dcc-coach-surface:#fffdf8;
  --dcc-coach-surface-2:#fbf5eb;
  --dcc-coach-text:#17191d;
  --dcc-coach-muted:#6f7782;
  --dcc-coach-gold:#b77b13;
  --dcc-coach-gold-2:#d9aa4a;
  --dcc-coach-line:rgba(177,119,18,.25);
  --dcc-coach-shadow:0 10px 26px rgba(78,58,28,.07);
  background:radial-gradient(circle at 88% 0,rgba(214,163,61,.09),transparent 25%),linear-gradient(180deg,#fffaf1 0%,#f5efe4 62%,#f0e8dc 100%)!important;
  color:var(--dcc-coach-text)!important;
}
html.dcc-theme-light-premium body #coach #coach-main,
html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard,
html.dcc-theme-light-premium body #coach #coach-main.dcc-final-dashboard,
html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients,
html.dcc-theme-light-premium body #coach #coach-main.dcc-final-clients,
html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-checkins,
html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-messages,
html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-chat,
html.dcc-theme-light-premium body #coach #coach-main.dcc-cal-v11,
html.dcc-theme-light-premium body #coach #coach-main.dcc-ca{
  min-height:100dvh!important;
  background:radial-gradient(circle at 88% 0,rgba(214,163,61,.08),transparent 25%),linear-gradient(180deg,#fffaf1 0%,#f5efe4 62%,#f0e8dc 100%)!important;
  background-color:#f5efe4!important;
  color:var(--dcc-coach-text)!important;
  padding-bottom:118px!important;
}

/* Tipografía */
html.dcc-theme-light-premium body #coach #coach-main h1,
html.dcc-theme-light-premium body #coach #coach-main h2,
html.dcc-theme-light-premium body #coach #coach-main h3,
html.dcc-theme-light-premium body #coach #coach-main b,
html.dcc-theme-light-premium body #coach #coach-main strong{
  color:var(--dcc-coach-text)!important;
  text-shadow:none!important;
}
html.dcc-theme-light-premium body #coach #coach-main .muted,
html.dcc-theme-light-premium body #coach #coach-main p,
html.dcc-theme-light-premium body #coach #coach-main [class*="sub"],
html.dcc-theme-light-premium body #coach #coach-main [class*="meta"]{
  color:var(--dcc-coach-muted)!important;
}
html.dcc-theme-light-premium body #coach #coach-main [class*="kicker"],
html.dcc-theme-light-premium body #coach #coach-main [class*="eyebrow"]{
  color:var(--dcc-coach-gold)!important;
}

/* Superficies comunes */
html.dcc-theme-light-premium body #coach #coach-main .card,
html.dcc-theme-light-premium body #coach #coach-main .dcc-p9-hero,
html.dcc-theme-light-premium body #coach #coach-main .dcc-p9-stat,
html.dcc-theme-light-premium body #coach #coach-main .dcc-p9-accordion,
html.dcc-theme-light-premium body #coach #coach-main .dcc-cl-card,
html.dcc-theme-light-premium body #coach #coach-main .dcc-fcl-card,
html.dcc-theme-light-premium body #coach #coach-main .dcc-ci-card,
html.dcc-theme-light-premium body #coach #coach-main .dcc-msg-card,
html.dcc-theme-light-premium body #coach #coach-main .dcc-cal-card,
html.dcc-theme-light-premium body #coach #coach-main .dcc-cal-agenda,
html.dcc-theme-light-premium body #coach #coach-main .dcc-ca-card,
html.dcc-theme-light-premium body #coach #coach-main .dcc-ca-metric{
  background:linear-gradient(145deg,#fffefa 0%,#fbf5eb 100%)!important;
  background-color:var(--dcc-coach-surface)!important;
  color:var(--dcc-coach-text)!important;
  border:1px solid var(--dcc-coach-line)!important;
  box-shadow:var(--dcc-coach-shadow),inset 0 1px 0 rgba(255,255,255,.96)!important;
}

/* Panel */
html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-hero{
  background:radial-gradient(circle at 88% 8%,rgba(214,163,61,.13),transparent 30%),linear-gradient(145deg,#fffefa 0%,#faf3e7 100%)!important;
}
html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-title,
html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-stat strong,
html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-accordion-head{
  color:var(--dcc-coach-text)!important;
}
html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-title span,
html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-kicker,
html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-stat-ico,
html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-stat-arrow,
html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-head-title,
html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-caret{
  color:var(--dcc-coach-gold)!important;
}
html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-mark,
html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-head-ico{
  background:#fff6df!important;
  color:var(--dcc-coach-gold)!important;
  border-color:var(--dcc-coach-line)!important;
  box-shadow:none!important;
}
html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-inner,
html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-row,
html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-empty{
  background:#fffdf8!important;
  color:var(--dcc-coach-text)!important;
  border-color:rgba(177,119,18,.15)!important;
}

/* Clientes */
html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl,
html.dcc-theme-light-premium body #coach #coach-main.dcc-final-clients .dcc-fcl{
  max-width:820px!important;
  margin-left:auto!important;
  margin-right:auto!important;
}
html.dcc-theme-light-premium body #coach #coach-main .dcc-cl-name,
html.dcc-theme-light-premium body #coach #coach-main .dcc-fcl-name,
html.dcc-theme-light-premium body #coach #coach-main .dcc-msg-name{
  color:var(--dcc-coach-text)!important;
}
html.dcc-theme-light-premium body #coach #coach-main .dcc-cl-goal,
html.dcc-theme-light-premium body #coach #coach-main .dcc-fcl-goal{
  color:#98640b!important;
}
html.dcc-theme-light-premium body #coach #coach-main .dcc-cl-tabs,
html.dcc-theme-light-premium body #coach #coach-main .dcc-fcl-tabs,
html.dcc-theme-light-premium body #coach #coach-main .dcc-cl-sort,
html.dcc-theme-light-premium body #coach #coach-main .dcc-fcl-sort,
html.dcc-theme-light-premium body #coach #coach-main .dcc-u-search,
html.dcc-theme-light-premium body #coach #coach-main .dcc-fcl-search,
html.dcc-theme-light-premium body #coach #coach-main .dcc-msg-search,
html.dcc-theme-light-premium body #coach #coach-main .dcc-ci-tabs,
html.dcc-theme-light-premium body #coach #coach-main .dcc-cal-tabs{
  background:#fffefa!important;
  color:var(--dcc-coach-text)!important;
  border:1px solid var(--dcc-coach-line)!important;
  box-shadow:0 7px 18px rgba(78,58,28,.045)!important;
}
html.dcc-theme-light-premium body #coach #coach-main .dcc-cl-tab.active,
html.dcc-theme-light-premium body #coach #coach-main .dcc-fcl-tab.active,
html.dcc-theme-light-premium body #coach #coach-main .dcc-ci-tab.active,
html.dcc-theme-light-premium body #coach #coach-main .dcc-cal-tab.active{
  background:linear-gradient(135deg,#f9df8d,#e8b844)!important;
  color:#1c160b!important;
  border-color:#e0ad41!important;
  box-shadow:none!important;
}

/* Formularios, dietas, rutinas y edición */
html.dcc-theme-light-premium body #coach #coach-main input,
html.dcc-theme-light-premium body #coach #coach-main textarea,
html.dcc-theme-light-premium body #coach #coach-main select{
  background:#fffefa!important;
  color:var(--dcc-coach-text)!important;
  -webkit-text-fill-color:var(--dcc-coach-text)!important;
  border:1px solid rgba(177,119,18,.28)!important;
  box-shadow:none!important;
}
html.dcc-theme-light-premium body #coach #coach-main input::placeholder,
html.dcc-theme-light-premium body #coach #coach-main textarea::placeholder{
  color:#858c96!important;
  -webkit-text-fill-color:#858c96!important;
  opacity:1!important;
}
html.dcc-theme-light-premium body #coach #coach-main .food,
html.dcc-theme-light-premium body #coach #coach-main .exercise,
html.dcc-theme-light-premium body #coach #coach-main .item,
html.dcc-theme-light-premium body #coach #coach-main .client-row{
  background:#fffdf8!important;
  color:var(--dcc-coach-text)!important;
  border-color:rgba(177,119,18,.20)!important;
}

/* Botones */
html.dcc-theme-light-premium body #coach #coach-main .btn,
html.dcc-theme-light-premium body #coach #coach-main .dcc-cl-new,
html.dcc-theme-light-premium body #coach #coach-main .dcc-fcl-new,
html.dcc-theme-light-premium body #coach #coach-main .dcc-ci-mark,
html.dcc-theme-light-premium body #coach #coach-main .dcc-chat-send{
  background:linear-gradient(135deg,#f5d581,#dca83e)!important;
  color:#18140c!important;
  border:1px solid #e5b64d!important;
  box-shadow:0 8px 20px rgba(185,125,20,.15)!important;
}
html.dcc-theme-light-premium body #coach #coach-main .ghost,
html.dcc-theme-light-premium body #coach #coach-main .dcc-ca-back,
html.dcc-theme-light-premium body #coach #coach-main .dcc-chat-back{
  background:#fffaf1!important;
  color:#8d5b08!important;
  border-color:rgba(177,119,18,.32)!important;
  box-shadow:none!important;
}

/* Check-in, mensajes, chat y calendario */
html.dcc-theme-light-premium body #coach #coach-main .dcc-ci-review-row,
html.dcc-theme-light-premium body #coach #coach-main .dcc-msg-card,
html.dcc-theme-light-premium body #coach #coach-main .dcc-chat-head,
html.dcc-theme-light-premium body #coach #coach-main .dcc-chat-empty,
html.dcc-theme-light-premium body #coach #coach-main .dcc-cal-empty,
html.dcc-theme-light-premium body #coach #coach-main .dcc-cal-session{
  background:#fffdf8!important;
  color:var(--dcc-coach-text)!important;
  border-color:rgba(177,119,18,.22)!important;
}
html.dcc-theme-light-premium body #coach #coach-main .dcc-msg-avatar{
  background:#fff5dc!important;
  color:#98640b!important;
  border-color:rgba(177,119,18,.30)!important;
}
html.dcc-theme-light-premium body #coach #coach-main .dcc-chat-bubble{
  color:var(--dcc-coach-text)!important;
  border-color:rgba(177,119,18,.22)!important;
  box-shadow:none!important;
}
html.dcc-theme-light-premium body #coach #coach-main .dcc-chat-row.mine .dcc-chat-bubble{background:#fff0c5!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-chat-row:not(.mine) .dcc-chat-bubble{background:#fffefa!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-cal-day{color:#24272d!important;background:transparent!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-cal-day.selected{background:#fff2ca!important;color:#895807!important;border-color:#d9aa4a!important}
html.dcc-theme-light-premium body #coach #coach-main .dcc-cal-day.today{background:#1b1b18!important;color:#fff8e8!important}

/* Modal del entrenador */
body.dcc-coach-mode #modal{background:rgba(31,25,17,.42)!important;backdrop-filter:blur(9px)!important;-webkit-backdrop-filter:blur(9px)!important}
body.dcc-coach-mode #modal .modal-box,
body.dcc-coach-mode .dcc-new-client-box{
  background:linear-gradient(145deg,#fffefa,#f8f1e5)!important;
  color:#17191d!important;
  border:1px solid rgba(177,119,18,.28)!important;
  box-shadow:0 24px 70px rgba(52,39,20,.24)!important;
}
body.dcc-coach-mode #modal h1,
body.dcc-coach-mode #modal h2,
body.dcc-coach-mode #modal h3,
body.dcc-coach-mode #modal b,
body.dcc-coach-mode #modal strong,
body.dcc-coach-mode .dcc-new-client-box h1,
body.dcc-coach-mode .dcc-new-client-box h2,
body.dcc-coach-mode .dcc-new-client-box h3{
  color:#17191d!important;
}
body.dcc-coach-mode #modal input,
body.dcc-coach-mode #modal textarea,
body.dcc-coach-mode #modal select,
body.dcc-coach-mode .dcc-new-client-box input,
body.dcc-coach-mode .dcc-new-client-box textarea,
body.dcc-coach-mode .dcc-new-client-box select{
  background:#fffefa!important;
  color:#17191d!important;
  -webkit-text-fill-color:#17191d!important;
  border:1px solid rgba(177,119,18,.30)!important;
}
body.dcc-coach-mode #modal .btn,
body.dcc-coach-mode .dcc-new-client-submit{
  background:linear-gradient(135deg,#f5d581,#dca83e)!important;
  color:#18140c!important;
  border-color:#e5b64d!important;
}
body.dcc-coach-mode #modal .ghost,
body.dcc-coach-mode .dcc-new-client-close{
  background:#fffaf1!important;
  color:#8d5b08!important;
  border-color:rgba(177,119,18,.30)!important;
}

/* Barra inferior: una sola apariencia estable */
html.dcc-theme-light-premium body #coach .side{
  background:linear-gradient(145deg,#27241e 0%,#151512 58%,#211f19 100%)!important;
  border:1px solid rgba(224,171,62,.80)!important;
  box-shadow:0 12px 30px rgba(47,36,18,.26),inset 0 1px 0 rgba(255,226,151,.10)!important;
}
html.dcc-theme-light-premium body #coach-nav{
  background:transparent!important;
  border:0!important;
  box-shadow:none!important;
}
html.dcc-theme-light-premium body #coach-nav button{
  background:transparent!important;
  color:#d9aa4a!important;
  border:0!important;
  outline:0!important;
  box-shadow:none!important;
}
html.dcc-theme-light-premium body #coach-nav button svg,
html.dcc-theme-light-premium body #coach-nav button span{color:#d9aa4a!important}
html.dcc-theme-light-premium body #coach-nav button.active{
  background:linear-gradient(145deg,#ffe6a0,#e7b340 72%,#cb8f27)!important;
  color:#1d1608!important;
  border:1px solid #f3d477!important;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.70),0 4px 12px rgba(181,121,20,.20)!important;
}
html.dcc-theme-light-premium body #coach-nav button.active svg,
html.dcc-theme-light-premium body #coach-nav button.active span{color:#1d1608!important}

@media(max-width:700px){
  html.dcc-theme-light-premium body #coach #coach-main{padding:18px 14px 112px!important}
  html.dcc-theme-light-premium body #coach .side{left:10px!important;right:10px!important;bottom:10px!important;width:auto!important;height:68px!important;border-radius:22px!important}
}
`;
    (document.head||document.documentElement).appendChild(s);
    syncMode();
  }

  install();
  document.addEventListener('DOMContentLoaded',()=>{install();syncMode()},{once:true});
  window.addEventListener('pageshow',syncMode);
  window.addEventListener('load',syncMode,{once:true});

  const observer=new MutationObserver(syncMode);
  document.addEventListener('DOMContentLoaded',()=>{
    const coach=document.getElementById('coach');
    if(coach)observer.observe(coach,{attributes:true,attributeFilter:['style','class']});
  },{once:true});
})();
