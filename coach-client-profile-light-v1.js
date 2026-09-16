/* DCC — Perfil entrenador · Light Premium */
(function(){
'use strict';
const BUILD='20260916-coach-client-profile-light-v2-compact';
if(window.__dccCoachClientProfileLight===BUILD)return;
window.__dccCoachClientProfileLight=BUILD;
const ID='dcc-coach-client-profile-light-v1-css';
function install(){
  let s=document.getElementById(ID);
  if(!s){s=document.createElement('style');s.id=ID;document.head.appendChild(s)}
  s.textContent=`
html.dcc-theme-light-premium body #coach #coach-main.dcc-ca{
  padding-top:8px!important;
}
html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-ca-wrap{
  padding-top:0!important;
}
html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-ca-back{
  margin:0 0 5px!important;
  padding:8px 13px!important;
  min-height:38px!important;
}
html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-ca-profilebar{
  margin:4px 2px 8px!important;
  min-height:0!important;
  align-items:center!important;
}
html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-ca-profilecopy h1{
  font-size:30px!important;
  line-height:1.02!important;
}
html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-ca-profilegoal{
  margin-top:4px!important;
}
html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-ca-tabs{
  margin:8px 0 10px!important;
}
html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-v2-card{
  background:linear-gradient(145deg,#fffefa 0%,#fbf6ec 100%)!important;
  background-color:#fffaf1!important;
  color:#17191d!important;
  border:1px solid rgba(198,139,32,.34)!important;
  box-shadow:0 10px 28px rgba(83,63,31,.075),inset 0 1px 0 rgba(255,255,255,.96)!important;
}
html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-v2-card h2,
html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-v2-card b,
html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-v2-card strong,
html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-v2-card p{color:#17191d!important;text-shadow:none!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-v2-sub,
html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-v2-stat small,
html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-v2-stat em,
html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-v2-row span,
html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-v2-checkfoot,
html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-v2-note small{color:#68717e!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-v2-stat,
html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-v2-muscle{
  background:linear-gradient(145deg,#fffdf8,#f7efdf)!important;
  color:#17191d!important;
  border:1px solid rgba(185,122,17,.20)!important;
  box-shadow:none!important;
}
html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-v2-muscle i,
html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-v2-arrow,
html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-v2-link,
html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-v2-action span{color:#a96f0c!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-v2-muscle strong.empty{color:#7b8490!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-v2-muscle strong:not(.empty){color:#23825f!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-v2-photo{
  background:linear-gradient(145deg,#fffdf8,#f5ead7)!important;
  color:#737c88!important;
  border:1px solid rgba(185,122,17,.28)!important;
}
html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-v2-row,
html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-v2-action,
html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-v2-note{border-color:rgba(100,75,30,.11)!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-v2-field label{color:#68717e!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-v2-field select,
html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-v2-field input,
html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-v2-field textarea{
  background:#fffefa!important;
  color:#17191d!important;
  -webkit-text-fill-color:#17191d!important;
  border:1px solid rgba(177,119,18,.28)!important;
  box-shadow:none!important;
}
html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-v2-field input::placeholder,
html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-v2-field textarea::placeholder{color:#858c96!important;-webkit-text-fill-color:#858c96!important;opacity:1!important}
html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-v2-save{
  background:linear-gradient(135deg,#f5d581,#dca83e)!important;
  color:#18140c!important;
  border-color:#e9bd55!important;
  box-shadow:0 8px 20px rgba(185,125,20,.15)!important;
}
html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-v2-note button{color:#b54444!important}
@media(max-width:390px){
  html.dcc-theme-light-premium body #coach #coach-main.dcc-ca{padding-top:6px!important}
  html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-ca-profilecopy h1{font-size:28px!important}
}
`;
}
install();
window.addEventListener('dcc:themechange',install);
})();
