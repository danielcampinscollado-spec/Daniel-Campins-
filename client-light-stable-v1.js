/* DCC — Client Light Premium estable v1
   Capa visual autoritativa del perfil cliente.
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
   DCC CLIENT — LIGHT PREMIUM / AUTORIDAD GLOBAL ÚNICA
   Esta capa solo define lenguaje compartido. Cada pantalla conserva
   únicamente sus reglas estructurales específicas.
   ========================================================= */
html.dcc-theme-light-premium body #client{
  --dcc-client-bg:#f5efe4;
  --dcc-client-surface:#fffdf8;
  --dcc-client-surface-2:#fbf5eb;
  --dcc-client-text:#17191d;
  --dcc-client-muted:#707782;
  --dcc-client-gold:#a66d0d;
  --dcc-client-gold-2:#d9aa4a;
  --dcc-client-line:rgba(183,123,19,.22);
  --dcc-client-radius:21px;
  --dcc-client-shadow:0 8px 22px rgba(78,58,28,.055),inset 0 1px 0 rgba(255,255,255,.96);
  background:linear-gradient(180deg,#fffaf1 0%,#f5efe4 64%,#f0e8dc 100%);
  color:var(--dcc-client-text);
}
html.dcc-theme-light-premium body #client #client-main{
  min-height:100dvh;
  background:linear-gradient(180deg,#fffaf1 0%,#f5efe4 64%,#f0e8dc 100%);
  color:var(--dcc-client-text);
  padding-bottom:100px;
}
html.dcc-theme-light-premium body #client #client-main h1,
html.dcc-theme-light-premium body #client #client-main h2,
html.dcc-theme-light-premium body #client #client-main h3,
html.dcc-theme-light-premium body #client #client-main h4,
html.dcc-theme-light-premium body #client #client-main b,
html.dcc-theme-light-premium body #client #client-main strong{
  color:var(--dcc-client-text);
  text-shadow:none;
}
html.dcc-theme-light-premium body #client #client-main p,
html.dcc-theme-light-premium body #client #client-main .muted,
html.dcc-theme-light-premium body #client #client-main small{
  color:var(--dcc-client-muted);
}
html.dcc-theme-light-premium body #client #client-main input,
html.dcc-theme-light-premium body #client #client-main textarea,
html.dcc-theme-light-premium body #client #client-main select{
  background:#fffefa;
  color:var(--dcc-client-text);
  -webkit-text-fill-color:var(--dcc-client-text);
  border-color:var(--dcc-client-line);
}
html.dcc-theme-light-premium body #client #client-main input::placeholder,
html.dcc-theme-light-premium body #client #client-main textarea::placeholder{
  color:#858c96;
  -webkit-text-fill-color:#858c96;
  opacity:1;
}
html.dcc-theme-light-premium body #client #client-main hr{border-color:rgba(183,123,19,.14)}

/* Superficies Light explícitas: evita que reglas legacy oscuras ganen por especificidad. */
html.dcc-theme-light-premium body #client #client-main .dcc-progress-card,
html.dcc-theme-light-premium body #client #client-main .dcc-progress-metric,
html.dcc-theme-light-premium body #client #client-main .dcc-performance-card,
html.dcc-theme-light-premium body #client #client-main .dcc-ci4-status-card,
html.dcc-theme-light-premium body #client #client-main .dcc-ci4-card{
  background:linear-gradient(145deg,#fffefa 0%,#fbf5eb 100%)!important;
  background-color:var(--dcc-client-surface)!important;
  color:var(--dcc-client-text)!important;
  border-color:var(--dcc-client-line)!important;
  box-shadow:var(--dcc-client-shadow)!important;
}
html.dcc-theme-light-premium body #client #client-main .dcc-ci4-status-card.primary{
  background:linear-gradient(145deg,#fffdf9 0%,#fff6e7 100%)!important;
}
html.dcc-theme-light-premium body #client #client-main .dcc-progress-card h2,
html.dcc-theme-light-premium body #client #client-main .dcc-progress-card b,
html.dcc-theme-light-premium body #client #client-main .dcc-ci4-card .dcc-ci4-value,
html.dcc-theme-light-premium body #client #client-main .dcc-ci4-status-main{
  color:var(--dcc-client-text)!important;
}
html.dcc-theme-light-premium body #client #client-main .dcc-progress-card p,
html.dcc-theme-light-premium body #client #client-main .dcc-ci4-status-copy,
html.dcc-theme-light-premium body #client #client-main .dcc-ci4-metric label{
  color:var(--dcc-client-muted)!important;
}

@media(max-width:700px){
  html.dcc-theme-light-premium body #client #client-main{
    padding-left:20px;
    padding-right:20px;
  }
}

/* CLIENTE NAV: la única autoridad de navegación permanece en index.html. */

/* Modal compartido cuando está visible el perfil cliente *//* Modal compartido cuando está visible el perfil cliente */
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
    // App mode changes are explicit through openApp/logout; a permanent
    // document-wide observer caused syncMode to run for unrelated DOM changes.
    window.addEventListener('pageshow',syncMode);
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',boot,{once:true});
  }else{
    boot();
  }
})();