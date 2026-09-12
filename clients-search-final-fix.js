/* DCC — Clientes + Nuevo cliente · Light Premium aislado */
(function(){
  const STYLE_ID='dcc-clients-search-final-fix';

  function injectCss(){
    let old=document.getElementById(STYLE_ID);
    if(old) old.remove();
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      /* =====================================================
         CLIENTES — SOLO ESTA PANTALLA
      ====================================================== */
      html.dcc-theme-light-premium body #coach #coach-main.dcc-final-clients,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients{
        background:radial-gradient(circle at 88% 0,rgba(214,163,61,.10),transparent 26%),linear-gradient(180deg,#fffaf1 0%,#f5efe4 62%,#f1e9dc 100%)!important;
        background-color:#f5efe4!important;
        color:#17191d!important;
      }

      html.dcc-theme-light-premium body #coach #coach-main.dcc-final-clients h1,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients h1{
        color:#17191d!important;
        text-shadow:none!important;
      }

      html.dcc-theme-light-premium body #coach #coach-main.dcc-final-clients .dcc-fcl-head p,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-head p{
        color:#69717d!important;
      }

      html body #coach #coach-main.dcc-final-clients .dcc-fcl-search,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-u-search,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-search{
        width:100%!important;
        height:52px!important;
        min-height:52px!important;
        max-height:52px!important;
        display:flex!important;
        align-items:center!important;
        gap:11px!important;
        padding:0 16px!important;
        margin:0!important;
        box-sizing:border-box!important;
        overflow:hidden!important;
        border:1px solid rgba(185,122,17,.28)!important;
        border-radius:16px!important;
        background:#fffefa!important;
        box-shadow:0 8px 22px rgba(83,63,31,.06),inset 0 1px 0 rgba(255,255,255,.95)!important;
        color:#17191d!important;
      }

      html body #coach #coach-main.dcc-final-clients .dcc-fcl-search > svg,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-u-search>svg{
        width:18px!important;
        height:18px!important;
        min-width:18px!important;
        flex:0 0 18px!important;
        color:#98640b!important;
      }

      html body #coach #coach-main.dcc-final-clients .dcc-fcl-search > input#dccClientSearch,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients #dccClientSearch{
        all:unset!important;
        -webkit-appearance:none!important;
        appearance:none!important;
        display:block!important;
        flex:1 1 auto!important;
        width:auto!important;
        min-width:0!important;
        height:100%!important;
        box-sizing:border-box!important;
        color:#17191d!important;
        font-family:inherit!important;
        font-size:14px!important;
        font-weight:650!important;
        line-height:52px!important;
        caret-color:#b77b13!important;
        -webkit-text-fill-color:#17191d!important;
      }

      html body #coach #coach-main.dcc-final-clients .dcc-fcl-search > input#dccClientSearch::placeholder,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients #dccClientSearch::placeholder{
        color:#818895!important;
        -webkit-text-fill-color:#818895!important;
        opacity:1!important;
      }

      html.dcc-theme-light-premium body #coach #coach-main.dcc-final-clients .dcc-fcl-tabs,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-tabs{
        background:#fffefa!important;
        border:1px solid rgba(185,122,17,.26)!important;
        box-shadow:none!important;
      }

      html.dcc-theme-light-premium body #coach #coach-main.dcc-final-clients .dcc-fcl-tab,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-tab{
        color:#69717d!important;
        background:transparent!important;
      }

      html.dcc-theme-light-premium body #coach #coach-main.dcc-final-clients .dcc-fcl-tab.active,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-tab.active{
        background:linear-gradient(145deg,#fff0b7,#edc45d)!important;
        color:#1d1608!important;
        border-color:#d6a53d!important;
        box-shadow:0 5px 14px rgba(185,125,20,.14)!important;
      }

      html.dcc-theme-light-premium body #coach #coach-main.dcc-final-clients .dcc-fcl-sort,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-sort{
        background:#fffefa!important;
        color:#25282d!important;
        border-color:rgba(185,122,17,.28)!important;
      }

      html.dcc-theme-light-premium body #coach #coach-main.dcc-final-clients .dcc-fcl-card,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-card{
        background:linear-gradient(145deg,#fffefa 0%,#fbf6ec 100%)!important;
        background-color:#fffaf1!important;
        border:1px solid rgba(198,139,32,.34)!important;
        color:#17191d!important;
        box-shadow:0 10px 24px rgba(83,63,31,.06),inset 0 1px 0 rgba(255,255,255,.95)!important;
      }

      html.dcc-theme-light-premium body #coach #coach-main.dcc-final-clients .dcc-fcl-name,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-name{
        color:#17191d!important;
      }

      html.dcc-theme-light-premium body #coach #coach-main.dcc-final-clients .dcc-fcl-goal,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-goal{
        color:#9a6710!important;
      }

      html.dcc-theme-light-premium body #coach #coach-main.dcc-final-clients .dcc-fcl-weight,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-weight{
        color:#747c87!important;
      }

      html.dcc-theme-light-premium body #coach #coach-main.dcc-final-clients .dcc-fcl-card button,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-card button{
        background:#fffaf1!important;
        color:#8d5a08!important;
        border-color:rgba(185,122,17,.40)!important;
        box-shadow:none!important;
      }

      /* =====================================================
         NUEVO CLIENTE — SOLO ESTE MODAL
      ====================================================== */
      #modal.dcc-new-client-overlay{
        background:rgba(39,31,19,.24)!important;
        backdrop-filter:blur(9px)!important;
        -webkit-backdrop-filter:blur(9px)!important;
      }

      #modal.dcc-new-client-overlay .modal-box{
        background:radial-gradient(circle at 92% 1%,rgba(214,163,61,.12),transparent 28%),linear-gradient(145deg,#fffefa 0%,#fbf6ec 100%)!important;
        background-color:#fffaf1!important;
        color:#17191d!important;
        border:1px solid rgba(185,122,17,.45)!important;
        box-shadow:0 28px 80px rgba(64,48,25,.20),0 0 34px rgba(185,125,20,.08),inset 0 1px 0 rgba(255,255,255,.95)!important;
      }

      #modal.dcc-new-client-overlay #dcc-new-client-premium .dcc-nc-title{
        background:none!important;
        -webkit-background-clip:border-box!important;
        background-clip:border-box!important;
        color:#17191d!important;
        -webkit-text-fill-color:#17191d!important;
        text-shadow:none!important;
      }

      #modal.dcc-new-client-overlay #dcc-new-client-premium .dcc-nc-sub{
        color:#8a8176!important;
      }

      #modal.dcc-new-client-overlay #dcc-new-client-premium .dcc-nc-close{
        background:#fffaf1!important;
        color:#98640b!important;
        border-color:rgba(185,122,17,.45)!important;
        box-shadow:0 6px 16px rgba(83,63,31,.06)!important;
      }

      #modal.dcc-new-client-overlay #dcc-new-client-premium .dcc-nc-label{
        color:#25282d!important;
      }

      #modal.dcc-new-client-overlay #dcc-new-client-premium .dcc-nc-label svg{
        color:#b77b13!important;
      }

      #modal.dcc-new-client-overlay #dcc-new-client-premium .dcc-nc-input,
      #modal.dcc-new-client-overlay #dcc-new-client-premium .dcc-nc-select{
        background:#fffefa!important;
        color:#17191d!important;
        -webkit-text-fill-color:#17191d!important;
        border-color:rgba(185,122,17,.28)!important;
        box-shadow:inset 0 1px 0 rgba(255,255,255,.95),0 5px 14px rgba(83,63,31,.04)!important;
      }

      #modal.dcc-new-client-overlay #dcc-new-client-premium .dcc-nc-input::placeholder{
        color:#8a919b!important;
        -webkit-text-fill-color:#8a919b!important;
        opacity:1!important;
      }

      #modal.dcc-new-client-overlay #dcc-new-client-premium .dcc-nc-select-wrap:after{
        color:#98640b!important;
      }

      #modal.dcc-new-client-overlay #dcc-new-client-premium .dcc-nc-create{
        background:linear-gradient(135deg,#f5d581,#dca83e)!important;
        color:#18140c!important;
        border-color:#e9bd55!important;
        box-shadow:0 10px 24px rgba(185,125,20,.18)!important;
      }
    `;
    document.head.appendChild(s);
  }

  function injectNextWorkoutVisual(){
    const id='dcc-next-workout-weight-plate';
    let s=document.getElementById(id);
    if(!s){
      s=document.createElement('style');
      s.id=id;
      document.head.appendChild(s);
    }

    s.textContent=`
      html body #client-main .dc-home-next{
        position:relative!important;
        overflow:hidden!important;
        isolation:isolate!important;
        border-color:rgba(240,201,107,.60)!important;
        background:linear-gradient(120deg,#11151a 0%,#0b0f13 58%,#07090c 100%)!important;
        box-shadow:inset 0 1px 0 rgba(255,255,255,.035),0 14px 36px rgba(0,0,0,.28)!important;
      }

      html body #client-main .dc-home-next::after{
        content:"";
        position:absolute!important;
        z-index:0!important;
        top:-8%!important;
        right:-2%!important;
        bottom:-8%!important;
        width:64%!important;
        pointer-events:none!important;
        background-image:
          linear-gradient(90deg,#0b0f13 0%,rgba(11,15,19,.92) 15%,rgba(11,15,19,.58) 34%,rgba(11,15,19,.18) 58%,rgba(11,15,19,0) 82%),
          url("./assets/next-workout-plate.jpg?v=20260909-1")!important;
        background-size:cover!important;
        background-position:center right!important;
        background-repeat:no-repeat!important;
        opacity:.98!important;
      }

      html body #client-main .dc-home-next > *{
        position:relative!important;
        z-index:1!important;
      }
    `;
  }

  function forceInput(){
    const wrap=document.querySelector('#coach-main.dcc-final-clients .dcc-fcl-search');
    const input=document.getElementById('dccClientSearch');
    if(!wrap||!input)return;

    const set=(el,prop,val)=>el.style.setProperty(prop,val,'important');
    const light=document.documentElement.classList.contains('dcc-theme-light-premium');
    set(wrap,'height','52px');
    set(wrap,'min-height','52px');
    set(wrap,'max-height','52px');
    set(wrap,'display','flex');
    set(wrap,'align-items','center');
    set(wrap,'overflow','hidden');

    set(input,'all','unset');
    set(input,'-webkit-appearance','none');
    set(input,'appearance','none');
    set(input,'display','block');
    set(input,'flex','1 1 auto');
    set(input,'width','auto');
    set(input,'min-width','0');
    set(input,'height','100%');
    set(input,'box-sizing','border-box');
    set(input,'font-family','inherit');
    set(input,'font-size','14px');
    set(input,'font-weight','650');
    set(input,'line-height','52px');
    set(input,'color',light?'#17191d':'#f4f1ed');
    set(input,'-webkit-text-fill-color',light?'#17191d':'#f4f1ed');
    set(input,'background','transparent');
    set(input,'border','0');
    set(input,'border-radius','0');
    set(input,'outline','0');
    set(input,'box-shadow','none');
    set(input,'margin','0');
    set(input,'padding','0');
  }

  injectCss();
  injectNextWorkoutVisual();
  forceInput();

  document.addEventListener('DOMContentLoaded',()=>{
    injectCss();
    injectNextWorkoutVisual();
    forceInput();
  },{once:true});

  window.addEventListener('load',()=>setTimeout(()=>{
    injectNextWorkoutVisual();
    forceInput();
  },50));

  window.addEventListener('dcc:themechange',()=>{
    injectCss();
    forceInput();
  });

  const main=document.getElementById('coach-main');
  if(main){
    new MutationObserver(()=>forceInput()).observe(main,{childList:true,subtree:true});
  }else{
    setTimeout(()=>{
      const m=document.getElementById('coach-main');
      if(m)new MutationObserver(()=>forceInput()).observe(m,{childList:true,subtree:true});
      forceInput();
    },300);
  }

  if(!document.querySelector('script[data-dcc-client-home-task-seen]')){
    const taskSeen=document.createElement('script');
    taskSeen.src='./client-home-task-seen-fix.js?v=20260909-1';
    taskSeen.async=true;
    taskSeen.dataset.dccClientHomeTaskSeen='1';
    document.head.appendChild(taskSeen);
  }
})();
