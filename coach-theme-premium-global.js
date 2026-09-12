/* DCC — tema entrenador: bootstrap único y estable
   Este archivo sí está cargado directamente por index.html.
   No contiene lógica de negocio; sólo activa la capa visual única. */
(function(){
  'use strict';
  if(window.__dccCoachThemeBootstrapStableV1)return;
  window.__dccCoachThemeBootstrapStableV1=true;

  const POLISH_ID='dcc-coach-light-polish-v1';
  let polishQueued=false;

  function installPolish(){
    document.getElementById(POLISH_ID)?.remove();
    const style=document.createElement('style');
    style.id=POLISH_ID;
    style.textContent=`
      /* Panel: iconos de tareas en Light Premium */
      html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-row-icon,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-empty-i{
        background:linear-gradient(145deg,#fffdf8 0%,#f8eedc 100%)!important;
        color:#b77b13!important;border:1px solid rgba(177,119,18,.28)!important;
        box-shadow:inset 0 1px 0 rgba(255,255,255,.92)!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-row-icon svg,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard .dcc-p9-empty-i svg{color:#b77b13!important;stroke:currentColor!important}

      /* Barra inferior */
      html.dcc-theme-light-premium body #coach .side{
        background:linear-gradient(145deg,#fffdf8 0%,#f5ecdd 100%)!important;
        border:1px solid rgba(177,119,18,.30)!important;
        box-shadow:0 10px 26px rgba(78,58,28,.10),inset 0 1px 0 rgba(255,255,255,.96)!important;
        padding:4px!important;box-sizing:border-box!important;
      }
      html.dcc-theme-light-premium body #coach #coach-nav{
        width:100%!important;height:100%!important;border-radius:18px!important;
        background:linear-gradient(145deg,#27241e 0%,#151512 58%,#211f19 100%)!important;
        border:1px solid rgba(224,171,62,.72)!important;
        box-shadow:inset 0 1px 0 rgba(255,226,151,.08)!important;overflow:hidden!important;
      }

      /* Clientes */
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-card{
        grid-template-columns:minmax(0,1fr) 132px!important;gap:16px!important;min-height:96px!important;padding:16px 18px!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-training{display:none!important}
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-manage{
        min-height:50px!important;padding:9px 14px!important;border:1px solid rgba(183,123,19,.40)!important;border-radius:15px!important;
        background:linear-gradient(145deg,#fffdf8 0%,#f8efdf 100%)!important;color:#8d5b08!important;
        box-shadow:0 5px 14px rgba(78,58,28,.06)!important;font-weight:800!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-search input{
        border:0!important;outline:0!important;background:transparent!important;box-shadow:none!important;border-radius:0!important;padding:0!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-search{overflow:hidden!important}

      /* Gestión de cliente: resumen */
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-v5-plan,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-ca-card,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-ca-activity-item{
        background:linear-gradient(145deg,#fffefa 0%,#f8f1e5 100%)!important;color:#17191d!important;
        border:1px solid rgba(177,119,18,.26)!important;
        box-shadow:0 8px 22px rgba(78,58,28,.06),inset 0 1px 0 rgba(255,255,255,.96)!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-v5-plan-title{color:#a86f0f!important}
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-v5-plan-item{
        background:#fffdf8!important;color:#17191d!important;border:1px solid rgba(177,119,18,.20)!important;box-shadow:none!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-v5-plan-item b,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-ca-card h2,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-ca-activity-item b{color:#17191d!important}
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-v5-plan-item small,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-ca-activity-item small{color:#7d858f!important}
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-v5-plan-go{color:#b77b13!important}
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-ca-tabs{
        background:#fffdf8!important;border:1px solid rgba(177,119,18,.24)!important;
        box-shadow:0 7px 18px rgba(78,58,28,.05)!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-ca-tab{
        background:transparent!important;color:#6f7782!important;border-color:transparent!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-ca-tab.active{
        background:linear-gradient(135deg,#f6d77e 0%,#e5b341 100%)!important;color:#17130a!important;
        border-color:#e5b64d!important;box-shadow:none!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-ca-detail{
        background:linear-gradient(145deg,#fffdf8,#f5ead7)!important;color:#9a6408!important;
        border:1px solid rgba(177,119,18,.34)!important;box-shadow:none!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-ca-info{border-bottom:1px solid rgba(177,119,18,.10)!important}
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-ca-info span{color:#858c96!important}
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-ca-info b{color:#17191d!important}
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-ca-delete{
        background:#fff4f3!important;color:#b23a43!important;border:1px solid rgba(178,58,67,.28)!important;
      }

      /* Alimentación */
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-n2,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-n2-head,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-n2-backrow{color:#17191d!important}
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-n2-head h2,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-n2-backrow h2,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-n2-plan b,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-n2-meta b,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-n2-choice b,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-n2-h b{color:#17191d!important}
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-n2-status,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-n2-status.off{
        background:#fff8e8!important;color:#93620d!important;border-color:rgba(183,123,19,.30)!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-n2-card,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-n2-choice,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-n2-h,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-n2-note,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-n2-warning,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-n2-editorbar{
        background:linear-gradient(145deg,#fffefa 0%,#f8f0e3 100%)!important;color:#17191d!important;
        border-color:rgba(183,123,19,.25)!important;
        box-shadow:0 10px 24px rgba(78,58,28,.06),inset 0 1px 0 rgba(255,255,255,.96)!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-n2-meta div{
        background:#fffaf1!important;color:#17191d!important;border-color:rgba(183,123,19,.18)!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-n2-plan span,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-n2-meta small,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-n2-choice small,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-n2-h small,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-n2-backrow p,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-n2-empty{color:#747c87!important}
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-n2-ico,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-n2-choice .big{
        background:#fff4d7!important;color:#a66d0b!important;border-color:rgba(183,123,19,.28)!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-n2-title{color:#4b5058!important}
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-n2-empty{
        background:#fffdf8!important;border-color:rgba(91,96,104,.42)!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-n2-btn.secondary,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-n2-back{
        background:#fffaf1!important;color:#3d4248!important;border-color:rgba(183,123,19,.25)!important;box-shadow:none!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-n2-btn.secondary .i{
        background:#fff3d1!important;color:#9b670e!important;border-color:rgba(183,123,19,.22)!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-diet-switch,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-diet-meal,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-diet-food,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-diet-option,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-diet-add-option{
        background:#fffdf8!important;color:#17191d!important;border-color:rgba(183,123,19,.22)!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-diet-meal-head,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-diet-name,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-diet-food b,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-diet-amount{color:#17191d!important}
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-diet-body{border-top-color:rgba(183,123,19,.14)!important}
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-diet-icon-btn{
        background:#fff7e4!important;color:#9b670e!important;border-color:rgba(183,123,19,.24)!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-diet-option.active{
        background:#fff1c7!important;color:#8d5b08!important;border-color:#d9aa4a!important;
      }

      /* Entrenamiento */
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-tr-head h2,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-tr-day-head,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-tr-ex-name b,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-tr-history b{color:#17191d!important}
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-tr-head p,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-tr-day-head small,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-tr-ex-name small,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-tr-history small,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-diet-empty{color:#737b86!important}
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-tr-edit,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-tr-history,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-tr-day,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-tr-ex,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-tr-cancel,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-tr-add{
        background:linear-gradient(145deg,#fffefa 0%,#f8f0e3 100%)!important;color:#17191d!important;
        border-color:rgba(183,123,19,.25)!important;box-shadow:0 7px 18px rgba(78,58,28,.05)!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-tr-arrow{background:#fff2cc!important;color:#98640b!important}
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-tr-spec b{color:#98640b!important}
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-tr-spec span{color:#626a75!important}
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-tr-field input{
        background:#fffefa!important;color:#17191d!important;-webkit-text-fill-color:#17191d!important;border-color:rgba(183,123,19,.25)!important;
      }

      /* Progreso */
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-p5-metric,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-p5-section,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-p5-card{
        background:linear-gradient(145deg,#fffefa 0%,#f8f0e3 100%)!important;color:#17191d!important;
        border-color:rgba(183,123,19,.25)!important;
        box-shadow:0 10px 24px rgba(78,58,28,.06),inset 0 1px 0 rgba(255,255,255,.96)!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-p5-head h2,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-p5-forcehead h2,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-p5-copy b,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-p5-card b{color:#17191d!important}
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-p5-head p,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-p5-forcehead p,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-p5-copy small,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-p5-empty,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-p5-note,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-p5-detail{color:#737b86!important}
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-p5-icon{
        background:#fff3d2!important;border-color:rgba(183,123,19,.28)!important;box-shadow:none!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-p5-tabs button,
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-p5-all{
        background:#fffdf8!important;color:#626a75!important;border-color:rgba(183,123,19,.24)!important;box-shadow:none!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-p5-tabs button.active{
        background:linear-gradient(135deg,#f7d97f,#e8b23f)!important;color:#1b160d!important;border-color:#d9aa4a!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-p5-chart svg line{stroke:rgba(91,96,104,.22)!important}
      html.dcc-theme-light-premium body #coach #coach-main.dcc-ca .dcc-p5-chart svg text{fill:#68717c!important}

      /* Nuevo cliente */
      html.dcc-theme-light-premium body #modal.dcc-new-client-overlay{
        background:rgba(55,45,30,.20)!important;backdrop-filter:blur(10px)!important;-webkit-backdrop-filter:blur(10px)!important;
      }
      html.dcc-theme-light-premium body #modal.dcc-new-client-overlay .modal-box{
        background:radial-gradient(circle at 92% 1%,rgba(217,170,74,.08),transparent 28%),linear-gradient(145deg,#fffdf8 0%,#f8f0e2 100%)!important;
        color:#17191d!important;border:1px solid rgba(183,123,19,.34)!important;
        box-shadow:0 24px 70px rgba(78,58,28,.18),inset 0 1px 0 rgba(255,255,255,.96)!important;
      }
      html.dcc-theme-light-premium body #dcc-new-client-premium .dcc-nc-title{background:none!important;color:#17191d!important;-webkit-text-fill-color:#17191d!important;text-shadow:none!important}
      html.dcc-theme-light-premium body #dcc-new-client-premium .dcc-nc-sub{color:#727b87!important;-webkit-text-fill-color:#727b87!important}
      html.dcc-theme-light-premium body #dcc-new-client-premium .dcc-nc-label,
      html.dcc-theme-light-premium body #dcc-new-client-premium .dcc-nc-label span{color:#25282d!important;-webkit-text-fill-color:#25282d!important;opacity:1!important;text-shadow:none!important}
      html.dcc-theme-light-premium body #dcc-new-client-premium .dcc-nc-label svg{color:#b77b13!important;stroke:currentColor!important;-webkit-text-fill-color:initial!important}
      html.dcc-theme-light-premium body #dcc-new-client-premium .dcc-nc-input,
      html.dcc-theme-light-premium body #dcc-new-client-premium .dcc-nc-select{
        background:#fffefa!important;color:#17191d!important;-webkit-text-fill-color:#17191d!important;border:1px solid rgba(183,123,19,.30)!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.96)!important;
      }
      html.dcc-theme-light-premium body #dcc-new-client-premium .dcc-nc-input::placeholder{color:#737c88!important;-webkit-text-fill-color:#737c88!important;opacity:1!important}
      html.dcc-theme-light-premium body #dcc-new-client-premium .dcc-nc-input:focus,
      html.dcc-theme-light-premium body #dcc-new-client-premium .dcc-nc-select:focus{border-color:#d9aa4a!important;box-shadow:0 0 0 3px rgba(217,170,74,.12)!important}
      html.dcc-theme-light-premium body #dcc-new-client-premium .dcc-nc-select-wrap:after{color:#8d5b08!important}
      html.dcc-theme-light-premium body #dcc-new-client-premium .dcc-nc-close{
        background:linear-gradient(145deg,#fffdf8,#f5ead7)!important;color:#8d5b08!important;-webkit-text-fill-color:#8d5b08!important;
        border:1px solid rgba(183,123,19,.38)!important;box-shadow:0 4px 12px rgba(78,58,28,.06)!important;
      }
      html.dcc-theme-light-premium body #dcc-new-client-premium .dcc-nc-create{
        background:linear-gradient(135deg,#f5d581 0%,#dca83e 100%)!important;color:#18140c!important;-webkit-text-fill-color:#18140c!important;
        border:1px solid #e5b64d!important;box-shadow:0 8px 20px rgba(185,125,20,.14)!important;
      }

      @media(max-width:700px){
        html.dcc-theme-light-premium body #coach .side{padding:4px!important;border-radius:23px!important}
        html.dcc-theme-light-premium body #coach #coach-nav{border-radius:18px!important}
        html.dcc-theme-light-premium body #modal.dcc-new-client-overlay .modal-box{border-radius:24px!important}
      }
      @media(max-width:600px){
        html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-card{grid-template-columns:minmax(0,1fr) 118px!important;gap:12px!important;min-height:90px!important;padding:14px!important}
        html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-manage{min-height:48px!important;font-size:10px!important;padding:7px 10px!important}
      }
    `;
    (document.head||document.documentElement).appendChild(style);
  }

  function schedulePolish(){
    if(polishQueued)return;
    polishQueued=true;
    requestAnimationFrame(()=>{polishQueued=false;installPolish()});
  }

  function loadStableTheme(){
    const name='coach-light-stable-v1.js';
    const existing=[...document.scripts].find(s=>(s.src||'').includes(name));
    if(existing){installPolish();return}
    const script=document.createElement('script');
    script.src='./coach-light-stable-v1.js?v=20260912-2';
    script.async=false;script.dataset.dccCoachStable='1';
    script.onload=installPolish;
    script.onerror=()=>console.error('DCC: no se pudo cargar el tema estable del entrenador');
    (document.head||document.documentElement).appendChild(script);
  }

  function watchNewClientModal(){
    const bind=()=>{
      const modal=document.getElementById('modal');
      if(!modal||modal.__dccLightModalWatch)return;
      modal.__dccLightModalWatch=true;
      const observer=new MutationObserver(()=>{if(modal.classList.contains('dcc-new-client-overlay'))schedulePolish()});
      observer.observe(modal,{attributes:true,attributeFilter:['class'],childList:true,subtree:false});
    };
    bind();
    if(!document.getElementById('modal')){
      const rootObserver=new MutationObserver(()=>{if(document.getElementById('modal')){bind();rootObserver.disconnect()}});
      rootObserver.observe(document.documentElement,{childList:true,subtree:true});
    }
  }

  function watchCoachMain(){
    const bind=()=>{
      const main=document.getElementById('coach-main');
      if(!main||main.__dccLightStableWatch)return;
      main.__dccLightStableWatch=true;
      const observer=new MutationObserver(schedulePolish);
      observer.observe(main,{attributes:true,attributeFilter:['class'],childList:true,subtree:true});
    };
    bind();
    if(!document.getElementById('coach-main')){
      const rootObserver=new MutationObserver(()=>{if(document.getElementById('coach-main')){bind();rootObserver.disconnect()}});
      rootObserver.observe(document.documentElement,{childList:true,subtree:true});
    }
  }

  loadStableTheme();
  watchNewClientModal();
  watchCoachMain();
  document.addEventListener('DOMContentLoaded',()=>{loadStableTheme();installPolish();watchNewClientModal();watchCoachMain()},{once:true});
  window.addEventListener('pageshow',()=>{loadStableTheme();installPolish();watchNewClientModal();watchCoachMain()});
})();
