/* DCC — tema único Light Premium. Sin selector ni autoridad Dark. */
(function(){
'use strict';
const BUILD='20260917-light-only-v1';
if(window.__dccThemeSystem===BUILD)return;
window.__dccThemeSystem=BUILD;
const STYLE_ID='dcc-theme-system-v2-css';

function forceLight(){
 const r=document.documentElement;
 r.classList.add('dcc-theme-light-premium');
 r.dataset.dccTheme='light-premium';
 try{localStorage.setItem('dcc:theme:v1','light-premium')}catch(_){}
 document.querySelectorAll('.dcc-theme-trigger,.dcc-theme-overlay').forEach(el=>el.remove());
 return 'light-premium';
}

function installStyles(){
 let s=document.getElementById(STYLE_ID);
 if(!s){s=document.createElement('style');s.id=STYLE_ID;(document.head||document.documentElement).appendChild(s)}
 s.textContent=`
/* DCC LIGHT PREMIUM — única apariencia activa */
html.dcc-theme-light-premium,html.dcc-theme-light-premium body,html.dcc-theme-light-premium .app{background:#f5efe4!important;color:#17191d!important}
html.dcc-theme-light-premium #client-main,html.dcc-theme-light-premium #coach-main{background:radial-gradient(circle at 88% 0%,rgba(214,163,61,.10),transparent 26%),linear-gradient(180deg,#fffaf1 0%,#f5efe4 60%,#f1e9dc 100%)!important;color:#17191d!important}
html.dcc-theme-light-premium #client-main h1,html.dcc-theme-light-premium #client-main h2,html.dcc-theme-light-premium #client-main h3,html.dcc-theme-light-premium #coach-main h1,html.dcc-theme-light-premium #coach-main h2,html.dcc-theme-light-premium #coach-main h3{color:#17191d!important;text-shadow:none!important}
html.dcc-theme-light-premium #client-main .muted,html.dcc-theme-light-premium #coach-main .muted{color:#657080!important}

html.dcc-theme-light-premium #client-main .card,html.dcc-theme-light-premium #coach-main .card,
html.dcc-theme-light-premium #client-main .meal-card,html.dcc-theme-light-premium #coach-main .meal-card,
html.dcc-theme-light-premium #client-main .routine-client-row,html.dcc-theme-light-premium #coach-main .routine-client-row,
html.dcc-theme-light-premium #client-main .exercise,html.dcc-theme-light-premium #coach-main .exercise,
html.dcc-theme-light-premium #client-main .food,html.dcc-theme-light-premium #coach-main .food,
html.dcc-theme-light-premium #client-main .client-row,html.dcc-theme-light-premium #coach-main .client-row{background:linear-gradient(145deg,#fffefa 0%,#fbf6ec 100%)!important;background-color:#fffaf1!important;color:#17191d!important;border-color:rgba(198,139,32,.34)!important;box-shadow:0 10px 28px rgba(83,63,31,.08),inset 0 1px 0 rgba(255,255,255,.95)!important}
html.dcc-theme-light-premium #client-main .item,html.dcc-theme-light-premium #coach-main .item{border-bottom-color:rgba(89,70,36,.12)!important}
html.dcc-theme-light-premium #client-main .pill,html.dcc-theme-light-premium #coach-main .pill{background:#f8ecd2!important;color:#98640b!important;border-color:rgba(185,122,17,.24)!important}
html.dcc-theme-light-premium #client-main input,html.dcc-theme-light-premium #client-main textarea,html.dcc-theme-light-premium #client-main select,html.dcc-theme-light-premium #coach-main input,html.dcc-theme-light-premium #coach-main textarea,html.dcc-theme-light-premium #coach-main select{background:#fffefa!important;color:#17191d!important;-webkit-text-fill-color:#17191d!important;border-color:rgba(166,126,59,.28)!important;box-shadow:none!important}
html.dcc-theme-light-premium #client-main input::placeholder,html.dcc-theme-light-premium #coach-main input::placeholder{color:#858c96!important;-webkit-text-fill-color:#858c96!important;opacity:1!important}
html.dcc-theme-light-premium #client-main input:focus,html.dcc-theme-light-premium #client-main textarea:focus,html.dcc-theme-light-premium #client-main select:focus,html.dcc-theme-light-premium #coach-main input:focus,html.dcc-theme-light-premium #coach-main textarea:focus,html.dcc-theme-light-premium #coach-main select:focus{border-color:#c98a22!important;box-shadow:0 0 0 3px rgba(201,138,34,.12)!important}
html.dcc-theme-light-premium #client-main .ghost,html.dcc-theme-light-premium #coach-main .ghost{background:#fffaf1!important;color:#17191d!important;border-color:rgba(166,126,59,.25)!important}

/* Inicio cliente */
html.dcc-theme-light-premium #client-main .dch-wrap{--dcc-gold:#b77b13!important;--dcc-text:#17191d!important;--dcc-muted:#657080!important;color:#17191d!important}
html.dcc-theme-light-premium #client-main .dch-name{color:#15171a!important}
html.dcc-theme-light-premium #client-main .dch-welcome::after{color:#5d6672!important;opacity:.9!important}
html.dcc-theme-light-premium #client-main .dch-eyebrow,html.dcc-theme-light-premium #client-main .dch-task-head,html.dcc-theme-light-premium #client-main .dch-progress-label,html.dcc-theme-light-premium #client-main .dch-next-label{color:#ad7412!important}
html.dcc-theme-light-premium #client-main .dch-stat,html.dcc-theme-light-premium #client-main .dch-task-card,html.dcc-theme-light-premium #client-main .dch-progress{background:linear-gradient(145deg,#fffefa 0%,#fbf6ec 100%)!important;background-color:#fffaf1!important;border:1px solid rgba(198,139,32,.38)!important;box-shadow:0 12px 32px rgba(83,63,31,.09),inset 0 1px 0 rgba(255,255,255,.95)!important;color:#17191d!important}
html.dcc-theme-light-premium #client-main .dch-stat [class*="label"]{color:#4f5968!important}
html.dcc-theme-light-premium #client-main .dch-stat [class*="value"],html.dcc-theme-light-premium #client-main .dch-stat strong,html.dcc-theme-light-premium #client-main .dch-stat b,html.dcc-theme-light-premium #client-main .dch-task-empty>span:last-child,html.dcc-theme-light-premium #client-main .dch-progress-title{color:#17191d!important}
html.dcc-theme-light-premium #client-main .dch-task-empty>span:last-child::after,html.dcc-theme-light-premium #client-main .dch-progress-sub{color:#657080!important}
html.dcc-theme-light-premium #client-main .dch-iconbox{background:linear-gradient(145deg,#fff9ed,#f4e5c8)!important;border-color:rgba(187,126,20,.34)!important;color:#a56d0e!important;box-shadow:none!important}
html.dcc-theme-light-premium #client-main .dch-task-count{background:#fbf0da!important;color:#9c660a!important;border-color:rgba(187,126,20,.35)!important}
html.dcc-theme-light-premium #client-main .dch-routine-btn{background:linear-gradient(135deg,#f5d581,#dca83e)!important;color:#18140c!important;border-color:#e9bd55!important;box-shadow:0 7px 22px rgba(185,125,20,.22)!important}
html.dcc-theme-light-premium #client-main .dch-slogan{color:#a96f0c!important}

/* Entrenamiento cliente */
html.dcc-theme-light-premium #client-main .dct3-day,html.dcc-theme-light-premium #client-main .dct3-exercise,html.dcc-theme-light-premium #client-main .dwa3-card,html.dcc-theme-light-premium #client-main .dwa3-tip{background:linear-gradient(145deg,#fffefa,#f8f1e5)!important;color:#17191d!important;border-color:rgba(190,132,31,.30)!important;box-shadow:0 8px 24px rgba(83,63,31,.07)!important}
html.dcc-theme-light-premium #client-main .dct3-day.active{background:linear-gradient(145deg,#f7d77d,#dfaa3f)!important;color:#21190c!important;border-color:#d5a13b!important;box-shadow:0 7px 20px rgba(186,127,21,.22)!important}
html.dcc-theme-light-premium #client-main .dct3-start{background:linear-gradient(135deg,#f5d581,#dca83e)!important;color:#18140c!important;border-color:#e9bd55!important}
html.dcc-theme-light-premium #client-main .dct3-view{background:#fffaf1!important;color:#6e4b0e!important;border-color:rgba(185,122,17,.30)!important}

/* Navegación cliente: también Light, sin superficie negra heredada */
html.dcc-theme-light-premium #client-nav{background:#fffdf9!important;background-color:#fffdf9!important;background-image:none!important;border:1.5px solid #d6a33c!important;box-shadow:0 10px 28px rgba(93,67,25,.12)!important}
html.dcc-theme-light-premium #client-nav button{color:#666b73!important;-webkit-text-fill-color:#666b73!important;background:transparent!important;background-image:none!important;border-color:transparent!important;text-shadow:none!important;box-shadow:none!important}
html.dcc-theme-light-premium #client-nav button svg{color:currentColor!important;stroke:currentColor!important;filter:none!important}
html.dcc-theme-light-premium #client-nav button span{color:currentColor!important;-webkit-text-fill-color:currentColor!important}
html.dcc-theme-light-premium #client-nav button.active{color:#17140d!important;-webkit-text-fill-color:#17140d!important;background:linear-gradient(145deg,#ffe994 0%,#f6cf61 48%,#e2a72f 100%)!important;border-color:#d9a43a!important;box-shadow:0 5px 14px rgba(185,126,18,.18),inset 0 1px 0 rgba(255,255,255,.92)!important}
html.dcc-theme-light-premium #client-nav button.active svg,html.dcc-theme-light-premium #client-nav button.active span{color:#17140d!important;-webkit-text-fill-color:#17140d!important;stroke:currentColor!important}
html.dcc-theme-light-premium #client-nav::before,html.dcc-theme-light-premium #client-nav::after{background:transparent!important}
html.dcc-theme-light-premium body :has(>#client-nav){background:transparent!important;background-color:transparent!important;box-shadow:none!important}

/* Escritorio entrenador */
html.dcc-theme-light-premium .side{background:linear-gradient(180deg,#fffaf1 0%,#f1e7d7 100%)!important;color:#17191d!important;border-right-color:rgba(186,126,20,.24)!important;box-shadow:12px 0 30px rgba(83,63,31,.05)!important}
html.dcc-theme-light-premium .side h2{color:#17191d!important;border-bottom-color:rgba(89,70,36,.12)!important}
html.dcc-theme-light-premium .side .nav button{color:#765315!important}
html.dcc-theme-light-premium .side .nav button.active{background:linear-gradient(135deg,#f6d77f,#dfa83e)!important;color:#17120a!important;box-shadow:0 8px 20px rgba(185,125,20,.18)!important}
html.dcc-theme-light-premium .out{color:#765315!important;border-color:rgba(166,116,25,.24)!important;background:#fff9ee!important}

/* El selector de apariencia deja de existir en la versión Light-only. */
.dcc-theme-trigger,.dcc-theme-overlay{display:none!important}
`;
}

function applyLight(){forceLight();installStyles();return 'light-premium'}
function boot(){applyLight()}
window.dccTheme={get:()=> 'light-premium',set:()=>applyLight(),open:()=>{},themes:{light:{id:'light-premium',name:'DCC Light Premium'}}};
forceLight();
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.addEventListener('pageshow',applyLight);
})();