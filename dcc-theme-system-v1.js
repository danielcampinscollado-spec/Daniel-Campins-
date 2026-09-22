/* DCC — Light Premium global theme state.
   Single global theme: Light Premium.
   Navigation ownership is intentionally split by area:
   - client navigation: this file
   - trainer navigation: coach-premium-core-v13.js
*/
(function(){
  'use strict';
  const THEME='light-premium';
  const KEY='dcc:theme:v1';
  const ROOT_CLASS='dcc-theme-light-premium';
  const STYLE_ID='dcc-light-premium-global-v1';

  function apply(){
    const root=document.documentElement;
    root.classList.add(ROOT_CLASS);
    root.dataset.dccTheme=THEME;
    try{localStorage.setItem(KEY,THEME)}catch(_){ }
    document.querySelectorAll('.dcc-theme-trigger,.dcc-theme-overlay').forEach(el=>el.remove());
  }

  function install(){
    document.getElementById(STYLE_ID)?.remove();
    const style=document.createElement('style');
    style.id=STYLE_ID;
    style.textContent=`
      html.dcc-theme-light-premium body,
      html.dcc-theme-light-premium body .app{
        background:#f5efe4!important;
        color:#17191d!important;
      }
      html.dcc-theme-light-premium #client-main,
      html.dcc-theme-light-premium #coach-main{
        background:radial-gradient(circle at 88% 0%,rgba(214,163,61,.10),transparent 26%),linear-gradient(180deg,#fffaf1 0%,#f5efe4 60%,#f1e9dc 100%)!important;
        color:#17191d!important;
      }
      html.dcc-theme-light-premium #client-main h1,
      html.dcc-theme-light-premium #client-main h2,
      html.dcc-theme-light-premium #client-main h3,
      html.dcc-theme-light-premium #coach-main h1,
      html.dcc-theme-light-premium #coach-main h2,
      html.dcc-theme-light-premium #coach-main h3{color:#17191d!important;text-shadow:none!important}
      html.dcc-theme-light-premium #client-main .muted,
      html.dcc-theme-light-premium #coach-main .muted{color:#657080!important}

      html.dcc-theme-light-premium #client-main .card,
      html.dcc-theme-light-premium #coach-main .card,
      html.dcc-theme-light-premium #client-main .meal-card,
      html.dcc-theme-light-premium #coach-main .meal-card,
      html.dcc-theme-light-premium #client-main .routine-client-row,
      html.dcc-theme-light-premium #coach-main .routine-client-row,
      html.dcc-theme-light-premium #client-main .exercise,
      html.dcc-theme-light-premium #coach-main .exercise,
      html.dcc-theme-light-premium #client-main .food,
      html.dcc-theme-light-premium #coach-main .food,
      html.dcc-theme-light-premium #client-main .client-row,
      html.dcc-theme-light-premium #coach-main .client-row{
        background:linear-gradient(145deg,#fffefa 0%,#fbf6ec 100%)!important;
        background-color:#fffaf1!important;
        color:#17191d!important;
        border-color:rgba(198,139,32,.34)!important;
        box-shadow:0 10px 28px rgba(83,63,31,.08),inset 0 1px 0 rgba(255,255,255,.95)!important;
      }
      html.dcc-theme-light-premium #client-main input,
      html.dcc-theme-light-premium #client-main textarea,
      html.dcc-theme-light-premium #client-main select,
      html.dcc-theme-light-premium #coach-main input,
      html.dcc-theme-light-premium #coach-main textarea,
      html.dcc-theme-light-premium #coach-main select{
        background:#fffefa!important;color:#17191d!important;-webkit-text-fill-color:#17191d!important;
        border-color:rgba(166,126,59,.28)!important;box-shadow:none!important;
      }
      html.dcc-theme-light-premium #client-main .ghost,
      html.dcc-theme-light-premium #coach-main .ghost{
        background:#fffaf1!important;color:#17191d!important;border-color:rgba(166,126,59,.25)!important;
      }


      /* CLIENTE — restauración Light Premium aislada.
         Solo presentación dentro de #client-main; no toca entrenador ni lógica. */

      /* Inicio */
      html.dcc-theme-light-premium #client-main .dch-wrap{--dcc-gold:#b77b13!important;--dcc-text:#17191d!important;--dcc-muted:#657080!important;color:#17191d!important}
      html.dcc-theme-light-premium #client-main .dch-name{color:#15171a!important}
      html.dcc-theme-light-premium #client-main .dch-eyebrow,
      html.dcc-theme-light-premium #client-main .dch-task-head,
      html.dcc-theme-light-premium #client-main .dch-progress-label,
      html.dcc-theme-light-premium #client-main .dch-next-label{color:#ad7412!important}
      html.dcc-theme-light-premium #client-main .dch-stat,
      html.dcc-theme-light-premium #client-main .dch-task-card,
      html.dcc-theme-light-premium #client-main .dch-progress{
        background:linear-gradient(145deg,#fffefa 0%,#fbf6ec 100%)!important;background-color:#fffaf1!important;
        border:1px solid rgba(198,139,32,.38)!important;box-shadow:0 12px 32px rgba(83,63,31,.09),inset 0 1px 0 rgba(255,255,255,.95)!important;color:#17191d!important
      }
      html.dcc-theme-light-premium #client-main .dch-stat [class*="label"]{color:#4f5968!important}
      html.dcc-theme-light-premium #client-main .dch-stat [class*="value"],
      html.dcc-theme-light-premium #client-main .dch-stat strong,
      html.dcc-theme-light-premium #client-main .dch-stat b,
      html.dcc-theme-light-premium #client-main .dch-task-title,
      html.dcc-theme-light-premium #client-main .dch-task-empty>span:last-child,
      html.dcc-theme-light-premium #client-main .dch-progress-title{color:#17191d!important}
      html.dcc-theme-light-premium #client-main .dch-task-meta,
      html.dcc-theme-light-premium #client-main .dch-progress-sub{color:#657080!important}
      html.dcc-theme-light-premium #client-main .dch-iconbox{background:linear-gradient(145deg,#fff9ed,#f4e5c8)!important;border-color:rgba(187,126,20,.34)!important;color:#a56d0e!important;box-shadow:none!important}
      html.dcc-theme-light-premium #client-main .dch-task-head{border-bottom-color:rgba(64,53,35,.10)!important}
      html.dcc-theme-light-premium #client-main .dch-task-row{border-top-color:rgba(64,53,35,.10)!important;color:#17191d!important}
      html.dcc-theme-light-premium #client-main .dch-task-count{background:#fbf0da!important;color:#9c660a!important;border-color:rgba(187,126,20,.35)!important}
      html.dcc-theme-light-premium #client-main .dch-next{
        background-image:linear-gradient(90deg,#fffdf8 0%,#f8eedc 34%,rgba(248,238,220,.93) 45%,rgba(248,238,220,.58) 58%,rgba(10,12,15,.05) 72%,rgba(8,10,13,.28) 100%),url('./assets/next-workout-plate.jpg')!important;
        background-size:100% 100%,cover!important;background-position:center,right center!important;background-repeat:no-repeat!important;
        border:1px solid rgba(198,139,32,.58)!important;box-shadow:0 14px 32px rgba(66,47,20,.14)!important;color:#17191d!important
      }
      html.dcc-theme-light-premium #client-main .dch-next-name{color:#17191d!important;font-weight:400!important}
      html.dcc-theme-light-premium #client-main .dch-next-day{color:#657080!important}
      html.dcc-theme-light-premium #client-main .dch-routine-btn{background:linear-gradient(135deg,#f5d581,#dca83e)!important;color:#18140c!important;border-color:#e9bd55!important;box-shadow:0 7px 22px rgba(185,125,20,.22)!important}
      html.dcc-theme-light-premium #client-main .dch-slogan{color:#a96f0c!important}

      /* Alimentación */
      html.dcc-theme-light-premium #client-main[data-dcc-screen="food"] .diet-switch{background:#f0e7d8!important;border-color:rgba(166,126,59,.22)!important}
      html.dcc-theme-light-premium #client-main[data-dcc-screen="food"] .diet-switch button{background:transparent!important;color:#6b7280!important}
      html.dcc-theme-light-premium #client-main[data-dcc-screen="food"] .diet-switch button.active{background:linear-gradient(145deg,#ffe994,#e4ad39)!important;color:#17140d!important;border-color:#d9a43a!important}
      html.dcc-theme-light-premium #client-main[data-dcc-screen="food"] .diet-pdf-card,
      html.dcc-theme-light-premium #client-main[data-dcc-screen="food"] .meal-card{background:linear-gradient(145deg,#fffefa,#fbf6ec)!important;color:#17191d!important;border-color:rgba(198,139,32,.36)!important;box-shadow:0 10px 28px rgba(83,63,31,.08)!important}
      html.dcc-theme-light-premium #client-main[data-dcc-screen="food"] .diet-pdf-text strong,
      html.dcc-theme-light-premium #client-main[data-dcc-screen="food"] .meal-card summary b,
      html.dcc-theme-light-premium #client-main[data-dcc-screen="food"] .food-row span,
      html.dcc-theme-light-premium #client-main[data-dcc-screen="food"] .food-row b{color:#17191d!important}
      html.dcc-theme-light-premium #client-main[data-dcc-screen="food"] .diet-pdf-text span{color:#657080!important}
      html.dcc-theme-light-premium #client-main[data-dcc-screen="food"] .food-row{border-color:rgba(89,70,36,.12)!important}
      html.dcc-theme-light-premium #client-main[data-dcc-screen="food"] .diet-option{background:#fffaf1!important;color:#765315!important;border-color:rgba(166,126,59,.24)!important}
      html.dcc-theme-light-premium #client-main[data-dcc-screen="food"] .diet-option.active,
      html.dcc-theme-light-premium #client-main[data-dcc-screen="food"] .diet-pdf-button{background:linear-gradient(135deg,#f5d581,#dca83e)!important;color:#18140c!important;border-color:#e9bd55!important}

      /* Entrenamiento: conserva estructura e ilustraciones, cambia solo superficies. */
      html.dcc-theme-light-premium #client-main .dct3-day,
      html.dcc-theme-light-premium #client-main .dct3-card,
      html.dcc-theme-light-premium #client-main .dct3-routine,
      html.dcc-theme-light-premium #client-main .dct3-exercise,
      html.dcc-theme-light-premium #client-main .dwa3-card,
      html.dcc-theme-light-premium #client-main .dwa3-tip{background:linear-gradient(145deg,#fffefa,#f8f1e5)!important;color:#17191d!important;border-color:rgba(190,132,31,.30)!important;box-shadow:0 8px 24px rgba(83,63,31,.07)!important}
      html.dcc-theme-light-premium #client-main .dct3-day.active{background:linear-gradient(145deg,#f7d77d,#dfaa3f)!important;color:#21190c!important;border-color:#d5a13b!important;box-shadow:0 7px 20px rgba(186,127,21,.22)!important}
      html.dcc-theme-light-premium #client-main .dct3-start{background:linear-gradient(135deg,#f5d581,#dca83e)!important;color:#18140c!important;border-color:#e9bd55!important}
      html.dcc-theme-light-premium #client-main .dct3-view{background:#fffaf1!important;color:#6e4b0e!important;border-color:rgba(185,122,17,.30)!important}

      /* Progreso */
      html.dcc-theme-light-premium #client-main[data-dcc-screen="progress"] .card{background:linear-gradient(145deg,#fffefa,#fbf6ec)!important;color:#17191d!important;border-color:rgba(198,139,32,.34)!important;box-shadow:0 10px 28px rgba(83,63,31,.08)!important}
      html.dcc-theme-light-premium #client-main[data-dcc-screen="progress"] .card [style*="color:#fff"],
      html.dcc-theme-light-premium #client-main[data-dcc-screen="progress"] .card [style*="color: #fff"],
      html.dcc-theme-light-premium #client-main[data-dcc-screen="progress"] .card [style*="color:#f5f5f2"]{color:#17191d!important}
      html.dcc-theme-light-premium #client-main[data-dcc-screen="progress"] .card [style*="color:#9d"],
      html.dcc-theme-light-premium #client-main[data-dcc-screen="progress"] .card .muted{color:#657080!important}

      /* Check-in */
      html.dcc-theme-light-premium #client-main.dcc-client-checkin-v1{background:radial-gradient(circle at 88% 0,rgba(214,163,61,.10),transparent 26%),linear-gradient(180deg,#fffaf1,#f5efe4 62%,#f1e9dc)!important;color:#17191d!important}
      html.dcc-theme-light-premium #client-main .dcc-cc-kicker{color:#ad7412!important}
      html.dcc-theme-light-premium #client-main .dcc-cc-sub,
      html.dcc-theme-light-premium #client-main .dcc-cc-hint,
      html.dcc-theme-light-premium #client-main .dcc-cc-comment-hint,
      html.dcc-theme-light-premium #client-main .dcc-cc-data-label,
      html.dcc-theme-light-premium #client-main .dcc-cc-sent{color:#657080!important}
      html.dcc-theme-light-premium #client-main .dcc-cc-card,
      html.dcc-theme-light-premium #client-main .dcc-cc-data{background:linear-gradient(145deg,#fffefa,#fbf6ec)!important;color:#17191d!important;border-color:rgba(198,139,32,.34)!important;box-shadow:0 10px 28px rgba(83,63,31,.07)!important}
      html.dcc-theme-light-premium #client-main .dcc-cc-card-title,
      html.dcc-theme-light-premium #client-main .dcc-cc-data-value,
      html.dcc-theme-light-premium #client-main .dcc-cc-row-name,
      html.dcc-theme-light-premium #client-main .dcc-cc-comment-title{color:#17191d!important}
      html.dcc-theme-light-premium #client-main .dcc-cc-data-icon{background:#fff7e4!important;color:#a46b0b!important;border-color:rgba(185,122,17,.38)!important}
      html.dcc-theme-light-premium #client-main .dcc-cc-update{background:#fff7e4!important;color:#98640b!important;border-color:rgba(185,122,17,.42)!important;box-shadow:none!important}
      html.dcc-theme-light-premium #client-main .dcc-cc-options{background:#f2eadc!important;border-color:rgba(166,126,59,.22)!important}
      html.dcc-theme-light-premium #client-main .dcc-cc-option{color:#657080!important}
      html.dcc-theme-light-premium #client-main .dcc-cc-option.active{background:linear-gradient(145deg,#ffe994,#e4ad39)!important;color:#17140d!important;border-color:#d9a43a!important;box-shadow:none!important}
      html.dcc-theme-light-premium #client-main .dcc-cc-comment{background:#fffefa!important;color:#17191d!important;-webkit-text-fill-color:#17191d!important;border-color:rgba(166,126,59,.28)!important}
      html.dcc-theme-light-premium #client-main .dcc-cc-comment::placeholder{color:#7a8390!important}

      /* Mensajes cliente */
      html.dcc-theme-light-premium #client-main.dcc-client-messages-v1{background:radial-gradient(circle at 88% 0,rgba(214,163,61,.10),transparent 26%),linear-gradient(180deg,#fffaf1,#f5efe4 62%,#f1e9dc)!important;color:#17191d!important}
      html.dcc-theme-light-premium #client-main .dcc-cm-person{border-bottom-color:rgba(89,70,36,.12)!important}
      html.dcc-theme-light-premium #client-main .dcc-cm-person h1{color:#17191d!important}
      html.dcc-theme-light-premium #client-main .dcc-cm-role,
      html.dcc-theme-light-premium #client-main .dcc-cm-day,
      html.dcc-theme-light-premium #client-main .dcc-cm-time{color:#657080!important}
      html.dcc-theme-light-premium #client-main .dcc-cm-day:before,
      html.dcc-theme-light-premium #client-main .dcc-cm-day:after{background:rgba(89,70,36,.14)!important}
      html.dcc-theme-light-premium #client-main .dcc-cm-avatar,
      html.dcc-theme-light-premium #client-main .dcc-cm-mini{background:#fff7e4!important;color:#a46b0b!important;border-color:rgba(185,122,17,.38)!important}
      html.dcc-theme-light-premium #client-main .dcc-cm-empty,
      html.dcc-theme-light-premium #client-main .dcc-cm-bubble{background:#fffefa!important;color:#17191d!important;border-color:rgba(185,122,17,.24)!important;box-shadow:none!important}
      html.dcc-theme-light-premium #client-main .dcc-cm-row.mine .dcc-cm-bubble{background:#fff1c9!important;color:#17191d!important;border-color:rgba(185,122,17,.42)!important}
      html.dcc-theme-light-premium .dcc-cm-composer{background:rgba(255,250,241,.98)!important;border-color:rgba(185,122,17,.38)!important;box-shadow:0 -10px 30px rgba(83,63,31,.12)!important}
      html.dcc-theme-light-premium .dcc-cm-input{background:#fffefa!important;color:#17191d!important;-webkit-text-fill-color:#17191d!important;border-color:rgba(185,122,17,.28)!important}
      html.dcc-theme-light-premium .dcc-cm-input::placeholder{color:#7a8390!important}

/* CLIENTE NAV: estilos retirados. La única autoridad visual es index.html. */
      /* Escritorio: Light.      /* Escritorio: Light. En móvil el entrenador lo controla exclusivamente coach-premium-core-v13.js. */
      @media(min-width:701px){
        html.dcc-theme-light-premium .side{
          background:linear-gradient(180deg,#fffaf1 0%,#f1e7d7 100%)!important;
          color:#17191d!important;border-right-color:rgba(186,126,20,.24)!important;
          box-shadow:12px 0 30px rgba(83,63,31,.05)!important;
        }
        html.dcc-theme-light-premium .side h2{color:#17191d!important;border-bottom-color:rgba(89,70,36,.12)!important}
      }
      .dcc-theme-trigger,.dcc-theme-overlay{display:none!important}
    `;
    (document.head||document.documentElement).appendChild(style);
  }

  function boot(){apply();install()}
  apply();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  window.addEventListener('pageshow',apply);
  window.dccTheme={get:()=>THEME,set:()=>{apply();return THEME},open:()=>{},themes:{light:{id:THEME,name:'DCC Light Premium'}}};
  window.dispatchEvent(new CustomEvent('dcc:themechange',{detail:{theme:THEME}}));
})();
