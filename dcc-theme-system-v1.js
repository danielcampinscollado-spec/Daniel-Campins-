/* DCC — Sistema de temas cliente V1. Solo presentación; no toca lógica de negocio. */
(function(){
  'use strict';
  if(window.__dccThemeSystemV1)return;
  window.__dccThemeSystemV1=true;

  const STORAGE_BASE='dcc:theme:v1';
  const STYLE_ID='dcc-theme-system-v1-css';
  const THEMES={
    dark:{id:'dark',name:'DCC Original'},
    light:{id:'light-premium',name:'DCC Light Premium'}
  };

  function clientKey(){
    try{
      const id=window.currentClientId || window.selectedClient || '';
      return id ? STORAGE_BASE+':'+id : STORAGE_BASE;
    }catch(_){return STORAGE_BASE;}
  }

  function readTheme(){
    try{return localStorage.getItem(clientKey())||localStorage.getItem(STORAGE_BASE)||'dark';}
    catch(_){return 'dark';}
  }

  function saveTheme(id){
    try{
      localStorage.setItem(clientKey(),id);
      localStorage.setItem(STORAGE_BASE,id);
    }catch(_){ }
  }

  function installStyles(){
    if(document.getElementById(STYLE_ID))return;
    const style=document.createElement('style');
    style.id=STYLE_ID;
    style.textContent=`
      /* Selector de apariencia */
      .dcc-theme-trigger{position:fixed;right:14px;bottom:112px;z-index:9997;display:flex;align-items:center;gap:7px;height:36px;padding:0 12px;border-radius:999px;border:1px solid rgba(232,185,79,.45);background:rgba(10,12,16,.92);color:#e8b94f;box-shadow:0 9px 28px rgba(0,0,0,.24);font:600 11px/1 -apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif;letter-spacing:.2px;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}
      .dcc-theme-trigger svg{width:15px;height:15px;display:block}
      .dcc-theme-overlay{position:fixed;inset:0;z-index:10000;display:none;align-items:flex-end;justify-content:center;background:rgba(0,0,0,.48);padding:16px;backdrop-filter:blur(7px);-webkit-backdrop-filter:blur(7px)}
      .dcc-theme-overlay.on{display:flex}
      .dcc-theme-sheet{width:min(520px,100%);border-radius:24px;padding:18px;background:linear-gradient(160deg,#15181e,#0c0e12);border:1px solid rgba(232,185,79,.28);box-shadow:0 28px 90px rgba(0,0,0,.5);color:#f4f1e9}
      .dcc-theme-sheet-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:16px}
      .dcc-theme-sheet-title{font-size:18px;font-weight:500;letter-spacing:-.2px}
      .dcc-theme-close{width:34px;height:34px;border:0;border-radius:50%;background:rgba(255,255,255,.07);color:#fff;font-size:20px;line-height:1}
      .dcc-theme-options{display:grid;grid-template-columns:1fr 1fr;gap:11px}
      .dcc-theme-option{position:relative;min-height:128px;border-radius:18px;padding:13px;border:1px solid rgba(255,255,255,.11);background:#101217;color:#fff;text-align:left;overflow:hidden}
      .dcc-theme-option[data-theme="light-premium"]{background:linear-gradient(145deg,#fffdf8,#f4ecdd);color:#17191d;border-color:rgba(196,139,34,.32)}
      .dcc-theme-option.selected{border-color:#e8b94f;box-shadow:0 0 0 1px rgba(232,185,79,.55),0 10px 30px rgba(0,0,0,.18)}
      .dcc-theme-option b{display:block;margin-top:68px;font-size:12px;font-weight:650}
      .dcc-theme-option span{display:block;margin-top:3px;font-size:9px;opacity:.62}
      .dcc-theme-preview{position:absolute;left:12px;right:12px;top:12px;height:50px;border-radius:12px;border:1px solid rgba(232,185,79,.35);background:linear-gradient(145deg,#191c23,#0d0f13)}
      .dcc-theme-option[data-theme="light-premium"] .dcc-theme-preview{background:linear-gradient(145deg,#fff,#f7efe1);border-color:rgba(196,139,34,.36)}
      .dcc-theme-check{position:absolute;right:10px;top:10px;width:22px;height:22px;border-radius:50%;display:none;align-items:center;justify-content:center;background:#e8b94f;color:#16130c;font-size:12px;font-weight:800}
      .dcc-theme-option.selected .dcc-theme-check{display:flex}
      .dcc-theme-note{margin:13px 2px 0;color:#9fa5ae;font-size:10px;line-height:1.45}

      /* =====================================================
         LIGHT PREMIUM — FASE 1: INICIO + MENÚ INFERIOR
         ===================================================== */
      html.dcc-theme-light-premium body{background:#f5efe4!important;color:#17191d!important}
      html.dcc-theme-light-premium #client-main{background:
        radial-gradient(circle at 88% 0%,rgba(214,163,61,.10),transparent 26%),
        linear-gradient(180deg,#fffaf1 0%,#f5efe4 60%,#f1e9dc 100%)!important;color:#17191d!important}
      html.dcc-theme-light-premium #client-main .dch-wrap{--dcc-gold:#b77b13!important;--dcc-text:#17191d!important;--dcc-muted:#657080!important;color:#17191d!important}
      html.dcc-theme-light-premium #client-main .dch-welcome::after{color:#5d6672!important;opacity:.9!important}
      html.dcc-theme-light-premium #client-main .dch-name{color:#15171a!important}
      html.dcc-theme-light-premium #client-main .dch-eyebrow,
      html.dcc-theme-light-premium #client-main .dch-task-head,
      html.dcc-theme-light-premium #client-main .dch-progress-label,
      html.dcc-theme-light-premium #client-main .dch-next-label{color:#ad7412!important}

      html.dcc-theme-light-premium #client-main .dch-stat,
      html.dcc-theme-light-premium #client-main .dch-task-card,
      html.dcc-theme-light-premium #client-main .dch-progress{background:linear-gradient(145deg,rgba(255,255,255,.98),rgba(251,247,239,.98))!important;border-color:rgba(198,139,32,.38)!important;box-shadow:0 12px 32px rgba(83,63,31,.09),inset 0 1px 0 rgba(255,255,255,.95)!important;color:#17191d!important}
      html.dcc-theme-light-premium #client-main .dch-stat [class*="label"]{color:#4f5968!important}
      html.dcc-theme-light-premium #client-main .dch-stat [class*="value"],
      html.dcc-theme-light-premium #client-main .dch-stat strong,
      html.dcc-theme-light-premium #client-main .dch-stat b,
      html.dcc-theme-light-premium #client-main .dch-task-empty > span:last-child,
      html.dcc-theme-light-premium #client-main .dch-progress-title{color:#17191d!important}
      html.dcc-theme-light-premium #client-main .dch-task-empty > span:last-child::after,
      html.dcc-theme-light-premium #client-main .dch-progress-sub{color:#657080!important}
      html.dcc-theme-light-premium #client-main .dch-iconbox{background:linear-gradient(145deg,#fff9ed,#f4e5c8)!important;border-color:rgba(187,126,20,.34)!important;color:#a56d0e!important;box-shadow:none!important}
      html.dcc-theme-light-premium #client-main .dch-task-head{border-bottom-color:rgba(64,53,35,.10)!important}
      html.dcc-theme-light-premium #client-main .dch-task-count{background:#fbf0da!important;color:#9c660a!important;border-color:rgba(187,126,20,.35)!important}

      /* La tarjeta próxima rutina conserva contraste premium fotográfico. */
      html.dcc-theme-light-premium #client-main .dch-next{border-color:rgba(198,139,32,.58)!important;box-shadow:0 14px 32px rgba(66,47,20,.18)!important}
      html.dcc-theme-light-premium #client-main .dch-next-name{color:#f5f2eb!important;font-weight:400!important}
      html.dcc-theme-light-premium #client-main .dch-next-day{color:#b9bec6!important}
      html.dcc-theme-light-premium #client-main .dch-next .dch-iconbox{background:rgba(18,18,18,.72)!important;color:#e8b94f!important;border-color:rgba(232,185,79,.45)!important}
      html.dcc-theme-light-premium #client-main .dch-routine-btn{background:linear-gradient(135deg,#f5d581,#dca83e)!important;color:#18140c!important;border-color:#e9bd55!important;box-shadow:0 7px 22px rgba(185,125,20,.22)!important}
      html.dcc-theme-light-premium #client-main .dch-slogan{color:#a96f0c!important}

      /* Menú: grafito cálido, visible pero no negro puro. */
      html.dcc-theme-light-premium #client-nav{background:linear-gradient(145deg,#303239,#1d2025)!important;border-color:rgba(201,145,42,.55)!important;box-shadow:0 12px 32px rgba(54,43,28,.25),inset 0 1px 0 rgba(255,255,255,.08)!important}
      html.dcc-theme-light-premium #client-nav button{color:#c4c9d0!important}
      html.dcc-theme-light-premium #client-nav button.active{color:#211a0d!important;background:linear-gradient(145deg,#ffe7a5,#e9b94f)!important;border-color:rgba(255,220,126,.9)!important;box-shadow:0 0 0 2px rgba(177,119,18,.35),0 5px 18px rgba(0,0,0,.25)!important}
      html.dcc-theme-light-premium #client-nav button.active svg{color:#2b210d!important;stroke:currentColor!important}
      html.dcc-theme-light-premium .dcc-theme-trigger{background:rgba(255,250,241,.95);color:#9b650b;border-color:rgba(177,119,18,.38);box-shadow:0 9px 28px rgba(83,63,31,.14)}

      @media(min-width:701px){.dcc-theme-trigger{bottom:24px}}
    `;
    document.head.appendChild(style);
  }

  function isClientArea(){
    const main=document.getElementById('client-main');
    if(!main)return false;
    const cs=getComputedStyle(main);
    return cs.display!=='none' && cs.visibility!=='hidden';
  }

  function applyTheme(id,persist){
    const clean=id==='light-premium'?'light-premium':'dark';
    const root=document.documentElement;
    root.classList.toggle('dcc-theme-light-premium',clean==='light-premium');
    root.dataset.dccTheme=clean;
    if(persist!==false)saveTheme(clean);
    document.querySelectorAll('.dcc-theme-option').forEach(el=>el.classList.toggle('selected',el.dataset.theme===clean));
    window.dispatchEvent(new CustomEvent('dcc:themechange',{detail:{theme:clean}}));
    return clean;
  }

  function closePicker(){document.querySelector('.dcc-theme-overlay')?.classList.remove('on');}
  function openPicker(){
    ensureUi();
    document.querySelector('.dcc-theme-overlay')?.classList.add('on');
  }

  function ensureUi(){
    if(!document.body)return;
    if(!document.querySelector('.dcc-theme-trigger')){
      const btn=document.createElement('button');
      btn.type='button';btn.className='dcc-theme-trigger';btn.setAttribute('aria-label','Cambiar apariencia');
      btn.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3a9 9 0 1 0 9 9c0-1.1-.9-2-2-2h-2.2a2 2 0 0 1-2-2V5.1A2.1 2.1 0 0 0 12 3Z"/><circle cx="7.5" cy="10" r="1"/><circle cx="9" cy="15" r="1"/><circle cx="13" cy="17" r="1"/></svg><span>Apariencia</span>';
      btn.onclick=openPicker;
      document.body.appendChild(btn);
    }
    if(!document.querySelector('.dcc-theme-overlay')){
      const overlay=document.createElement('div');overlay.className='dcc-theme-overlay';
      overlay.innerHTML=`<div class="dcc-theme-sheet" role="dialog" aria-modal="true" aria-label="Apariencia">
        <div class="dcc-theme-sheet-head"><div class="dcc-theme-sheet-title">Apariencia</div><button type="button" class="dcc-theme-close" aria-label="Cerrar">×</button></div>
        <div class="dcc-theme-options">
          <button type="button" class="dcc-theme-option" data-theme="dark"><span class="dcc-theme-preview"></span><span class="dcc-theme-check">✓</span><b>DCC Original</b><span>Negro + dorado</span></button>
          <button type="button" class="dcc-theme-option" data-theme="light-premium"><span class="dcc-theme-preview"></span><span class="dcc-theme-check">✓</span><b>DCC Light Premium</b><span>Marfil + oro + grafito</span></button>
        </div>
        <div class="dcc-theme-note">Fase de prueba segura: el nuevo tema se aplica primero a Inicio y al menú inferior. El resto de pantallas conserva su diseño actual.</div>
      </div>`;
      overlay.addEventListener('click',e=>{if(e.target===overlay)closePicker();});
      overlay.querySelector('.dcc-theme-close').onclick=closePicker;
      overlay.querySelectorAll('.dcc-theme-option').forEach(btn=>btn.onclick=()=>{applyTheme(btn.dataset.theme,true);closePicker();});
      document.body.appendChild(overlay);
    }
    applyTheme(readTheme(),false);
    updateVisibility();
  }

  function updateVisibility(){
    const trigger=document.querySelector('.dcc-theme-trigger');
    if(trigger)trigger.style.display=isClientArea()?'flex':'none';
  }

  function boot(){
    installStyles();
    applyTheme(readTheme(),false);
    ensureUi();
    updateVisibility();
  }

  window.dccTheme={
    get:()=>document.documentElement.dataset.dccTheme||readTheme(),
    set:id=>applyTheme(id,true),
    open:openPicker,
    themes:THEMES
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);
  else boot();

  const observer=new MutationObserver(()=>{ensureUi();updateVisibility();});
  observer.observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['style','class']});
})();