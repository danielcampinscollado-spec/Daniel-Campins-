/* DCC — Client Light Premium estable v1
   Capa visual base del perfil cliente; las pantallas especializadas conservan su propia autoridad visual.
   No modifica datos, autenticación ni lógica funcional. */
(function(){
  'use strict';
  if(window.__dccClientLightStableV1)return;
  window.__dccClientLightStableV1=true;

  const ID='dcc-client-light-stable-v1';

  function clientVisible(){
    const client=document.getElementById('client');
    if(!client)return false;
    const cs=getComputedStyle(client);
    return cs.display!=='none' && cs.visibility!=='hidden';
  }

  function syncMode(){
    document.body?.classList.toggle('dcc-client-mode',clientVisible());
  }

  function install(){
    if(document.getElementById(ID))return;
    const s=document.createElement('style');
    s.id=ID;
    s.textContent=`
/* =========================================================
   DCC CLIENT — LIGHT PREMIUM ESTABLE
   ========================================================= */
html.dcc-theme-light-premium body #client{
  --dcc-client-bg:#f5efe4;
  --dcc-client-surface:#fffdf8;
  --dcc-client-surface-2:#fbf5eb;
  --dcc-client-text:#17191d;
  --dcc-client-muted:#6f7782;
  --dcc-client-gold:#b77b13;
  --dcc-client-gold-2:#d9aa4a;
  --dcc-client-line:rgba(177,119,18,.24);
  --dcc-client-shadow:0 10px 26px rgba(78,58,28,.07);
  background:radial-gradient(circle at 88% 0,rgba(214,163,61,.09),transparent 25%),linear-gradient(180deg,#fffaf1 0%,#f5efe4 62%,#f0e8dc 100%)!important;
  color:var(--dcc-client-text)!important;
}

html.dcc-theme-light-premium body #client #client-main{
  min-height:100dvh!important;
  background:radial-gradient(circle at 88% 0,rgba(214,163,61,.08),transparent 25%),linear-gradient(180deg,#fffaf1 0%,#f5efe4 62%,#f0e8dc 100%)!important;
  background-color:#f5efe4!important;
  color:var(--dcc-client-text)!important;
  padding-bottom:118px!important;
}

/* Tipografía: elimina herencias del antiguo tema oscuro */
html.dcc-theme-light-premium body #client #client-main h1,
html.dcc-theme-light-premium body #client #client-main h2,
html.dcc-theme-light-premium body #client #client-main h3,
html.dcc-theme-light-premium body #client #client-main h4,
html.dcc-theme-light-premium body #client #client-main b,
html.dcc-theme-light-premium body #client #client-main strong{
  color:var(--dcc-client-text)!important;
  text-shadow:none!important;
}
html.dcc-theme-light-premium body #client #client-main p,
html.dcc-theme-light-premium body #client #client-main .muted,
html.dcc-theme-light-premium body #client #client-main small,
html.dcc-theme-light-premium body #client #client-main [class*="sub"],
html.dcc-theme-light-premium body #client #client-main [class*="meta"]{
  color:var(--dcc-client-muted)!important;
}
html.dcc-theme-light-premium body #client #client-main [class*="kicker"],
html.dcc-theme-light-premium body #client #client-main [class*="eyebrow"],
html.dcc-theme-light-premium body #client #client-main [class*="accent"]{
  color:var(--dcc-client-gold)!important;
}

/* Superficies comunes */
html.dcc-theme-light-premium body #client #client-main .card,
html.dcc-theme-light-premium body #client #client-main section,
html.dcc-theme-light-premium body #client #client-main .meal-card,
html.dcc-theme-light-premium body #client #client-main .exercise,
html.dcc-theme-light-premium body #client #client-main .food,
html.dcc-theme-light-premium body #client #client-main .item,
html.dcc-theme-light-premium body #client #client-main .client-row,
html.dcc-theme-light-premium body #client #client-main .dc-premium-card-inner,
html.dcc-theme-light-premium body #client #client-main .dc-home-next{
  background:linear-gradient(145deg,#fffefa 0%,#fbf5eb 100%)!important;
  background-color:var(--dcc-client-surface)!important;
  color:var(--dcc-client-text)!important;
  border-color:var(--dcc-client-line)!important;
  box-shadow:var(--dcc-client-shadow),inset 0 1px 0 rgba(255,255,255,.96)!important;
}

/* Tarjetas internas que aún venían con negro inline */
html.dcc-theme-light-premium body #client #client-main .dc-home > section > div,
html.dcc-theme-light-premium body #client #client-main .dc-home > div,
html.dcc-theme-light-premium body #client #client-main [class*="stat"],
html.dcc-theme-light-premium body #client #client-main [class*="summary"],
html.dcc-theme-light-premium body #client #client-main [class*="panel"],
html.dcc-theme-light-premium body #client #client-main [class*="box"],
html.dcc-theme-light-premium body #client #client-main [class*="tile"]{
  background-color:#fffdf8!important;
  color:var(--dcc-client-text)!important;
  border-color:rgba(177,119,18,.20)!important;
}

/* Formularios */
html.dcc-theme-light-premium body #client #client-main input,
html.dcc-theme-light-premium body #client #client-main textarea,
html.dcc-theme-light-premium body #client #client-main select{
  background:#fffefa!important;
  color:var(--dcc-client-text)!important;
  -webkit-text-fill-color:var(--dcc-client-text)!important;
  border:1px solid rgba(177,119,18,.28)!important;
  box-shadow:none!important;
}
html.dcc-theme-light-premium body #client #client-main input::placeholder,
html.dcc-theme-light-premium body #client #client-main textarea::placeholder{
  color:#858c96!important;
  -webkit-text-fill-color:#858c96!important;
  opacity:1!important;
}

/* Botones */
html.dcc-theme-light-premium body #client #client-main .btn{
  background:linear-gradient(135deg,#f5d581,#dca83e)!important;
  color:#18140c!important;
  border:1px solid #e5b64d!important;
  box-shadow:0 8px 20px rgba(185,125,20,.14)!important;
}
html.dcc-theme-light-premium body #client #client-main .ghost{
  background:#fffaf1!important;
  color:#8d5b08!important;
  border:1px solid rgba(177,119,18,.32)!important;
  box-shadow:none!important;
}
html.dcc-theme-light-premium body #client #client-main .pill{
  background:#fff5dc!important;
  color:#98640b!important;
  border-color:rgba(177,119,18,.26)!important;
}

/* Separadores y filas */
html.dcc-theme-light-premium body #client #client-main .item,
html.dcc-theme-light-premium body #client #client-main table,
html.dcc-theme-light-premium body #client #client-main th,
html.dcc-theme-light-premium body #client #client-main td{
  border-color:rgba(177,119,18,.16)!important;
}
html.dcc-theme-light-premium body #client #client-main hr{
  border-color:rgba(177,119,18,.16)!important;
}

/* Progreso / check-in / mensajes: neutraliza fondos negros residuales */
html.dcc-theme-light-premium body #client #client-main [class*="progress"],
html.dcc-theme-light-premium body #client #client-main [class*="checkin"],
html.dcc-theme-light-premium body #client #client-main [class*="message"],
html.dcc-theme-light-premium body #client #client-main [class*="chat"],
html.dcc-theme-light-premium body #client #client-main [class*="training"],
html.dcc-theme-light-premium body #client #client-main [class*="nutrition"]{
  color:var(--dcc-client-text)!important;
}
/* La barra inferior del cliente pertenece exclusivamente a dcc-theme-system-v1.js. */

/* Modal compartido cuando está visible el perfil cliente */
body.dcc-client-mode #modal{
  background:rgba(31,25,17,.38)!important;
  backdrop-filter:blur(9px)!important;
  -webkit-backdrop-filter:blur(9px)!important;
}
body.dcc-client-mode #modal .modal-box{
  background:linear-gradient(145deg,#fffefa,#f8f1e5)!important;
  color:#17191d!important;
  border:1px solid rgba(177,119,18,.28)!important;
  box-shadow:0 24px 70px rgba(52,39,20,.24)!important;
}
body.dcc-client-mode #modal h1,
body.dcc-client-mode #modal h2,
body.dcc-client-mode #modal h3,
body.dcc-client-mode #modal b,
body.dcc-client-mode #modal strong{color:#17191d!important}
body.dcc-client-mode #modal input,
body.dcc-client-mode #modal textarea,
body.dcc-client-mode #modal select{
  background:#fffefa!important;color:#17191d!important;-webkit-text-fill-color:#17191d!important;
  border:1px solid rgba(177,119,18,.30)!important;
}
body.dcc-client-mode #modal .btn{
  background:linear-gradient(135deg,#f5d581,#dca83e)!important;color:#18140c!important;border-color:#e5b64d!important;
}
body.dcc-client-mode #modal .ghost{
  background:#fffaf1!important;color:#8d5b08!important;border-color:rgba(177,119,18,.30)!important;
}
`;
    (document.head||document.documentElement).appendChild(s);
  }

  function boot(){
    install();
    syncMode();
    const observer=new MutationObserver(syncMode);
    observer.observe(document.documentElement,{attributes:true,subtree:true,attributeFilter:['style','class']});
    window.addEventListener('pageshow',syncMode);
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',boot,{once:true});
  }else{
    boot();
  }
})();