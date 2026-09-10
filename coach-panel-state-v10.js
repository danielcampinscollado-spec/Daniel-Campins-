/* DCC coach panel v10 — dynamic counter colors + accordions closed by default */
(function(){
  'use strict';

  const STYLE_ID='dcc-coach-panel-state-v10-css';
  const seenAccordions=new WeakSet();
  let raf=0;

  function injectCss(){
    let style=document.getElementById(STYLE_ID);
    if(style) return;
    style=document.createElement('style');
    style.id=STYLE_ID;
    style.textContent=`
      #coach-main.dcc-p9-dashboard .dcc-p9-stat.dcc-p9-positive strong{
        color:#f0c96b!important;
        text-shadow:0 0 14px rgba(240,201,107,.16)!important;
      }
      #coach-main.dcc-p9-dashboard .dcc-p9-stat.dcc-p9-zero strong{
        color:#f8f6f1!important;
        text-shadow:none!important;
      }
    `;
    document.head.appendChild(style);
  }

  function colorCounters(main){
    main.querySelectorAll('.dcc-p9-stat').forEach(card=>{
      const strong=card.querySelector('strong');
      if(!strong) return;
      const raw=String(strong.textContent||'').trim().replace(',','.');
      const value=Number.parseFloat(raw);
      const positive=Number.isFinite(value)&&value>0;
      card.classList.toggle('dcc-p9-positive',positive);
      card.classList.toggle('dcc-p9-zero',!positive);
    });
  }

  function closeNewAccordions(main){
    main.querySelectorAll('.dcc-p9-accordion').forEach(section=>{
      if(seenAccordions.has(section)) return;
      seenAccordions.add(section);
      section.classList.add('closed');
    });
  }

  function enhance(){
    injectCss();
    const main=document.getElementById('coach-main');
    if(!main||!main.classList.contains('dcc-p9-dashboard')) return;
    colorCounters(main);
    closeNewAccordions(main);
  }

  function schedule(){
    cancelAnimationFrame(raf);
    raf=requestAnimationFrame(enhance);
  }

  function watch(){
    const main=document.getElementById('coach-main');
    if(!main){setTimeout(watch,80);return;}
    const observer=new MutationObserver(schedule);
    observer.observe(main,{childList:true,subtree:true});
    schedule();
  }

  injectCss();
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',watch,{once:true});
  }else{
    watch();
  }
  window.addEventListener('load',schedule,{once:true});
  window.addEventListener('pageshow',schedule);
})();
