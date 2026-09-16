/* DCC — núcleo de arranque de la aplicación. Tema inicial sin cargar parches secundarios. */
(function(){
'use strict';
const BUILD='20260916-app-core-v1';
if(window.__dccAppCore===BUILD)return;
window.__dccAppCore=BUILD;
const THEME_KEY='dcc:theme:v1';
const html=document.documentElement;
function syncTheme(){
  try{
    const stored=localStorage.getItem(THEME_KEY)||'light-premium';
    if(!localStorage.getItem(THEME_KEY))localStorage.setItem(THEME_KEY,stored);
    html.classList.toggle('dcc-theme-light-premium',stored==='light-premium');
  }catch(_){html.classList.add('dcc-theme-light-premium')}
}
function installBase(){
  if(document.getElementById('dcc-app-core-v1-css'))return;
  const s=document.createElement('style');s.id='dcc-app-core-v1-css';
  s.textContent=`
    html.dcc-theme-light-premium,html.dcc-theme-light-premium body,html.dcc-theme-light-premium .app{background:#f5efe4!important;color:#17191d!important}
    html.dcc-theme-light-premium #coach,html.dcc-theme-light-premium #coach-main,html.dcc-theme-light-premium #client-main{background-color:#f5efe4!important}
    @media(max-width:900px){html.dcc-theme-light-premium body{min-height:100dvh!important;background:#f5efe4!important}}
  `;
  (document.head||document.documentElement).appendChild(s);
}
syncTheme();installBase();
document.addEventListener('dcc:themechange',()=>{syncTheme();installBase()});
window.addEventListener('pageshow',syncTheme);
})();