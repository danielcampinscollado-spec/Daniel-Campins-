/* DCC — Cliente Entrenamiento: referencia final exacta v1
   Capa visual aislada cargada después de Client Light.
   No cambia datos, rutina, sesiones ni panel entrenador. */
(function(){
  'use strict';
  const BUILD='20260920-training-reference-final-v1';
  if(window.__dccTrainingReferenceFinal===BUILD)return;
  window.__dccTrainingReferenceFinal=BUILD;

  const STYLE_ID='dcc-training-reference-final-style';
  const PECTORAL='./assets/muscles/pectoral-reference-final.jpg?v=20260920-ref1';
  const TRICEPS='./assets/muscles/triceps-reference-final.jpg?v=20260920-ref1';
  const PLATE='./assets/training-premium-plate.jpg?v=20260920-final2';

  const norm=v=>String(v||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();

  function installStyle(){
    let s=document.getElementById(STYLE_ID);
    if(s)s.remove();
    s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      html.dcc-theme-light-premium body #client #client-main .dcc-training-stable-v3{
        max-width:820px!important;
        margin:0 auto!important;
        padding:3px 0 112px!important;
        color:#17191d!important;
      }

      html.dcc-theme-light-premium body #client #client-main .dcc-training-stable-v3 .dct3-eyebrow{
        margin:0 0 14px!important;
        color:#a66d0d!important;
        font-size:11px!important;
        line-height:1!important;
        font-weight:850!important;
        letter-spacing:3.4px!important;
      }

      html.dcc-theme-light-premium body #client #client-main .dcc-training-stable-v3 .dct3-days{
        display:flex!important;
        gap:7px!important;
        margin:0 0 14px!important;
        padding:1px 1px 3px!important;
      }

      html.dcc-theme-light-premium body #client #client-main .dcc-training-stable-v3 .dct3-day{
        flex:0 0 72px!important;
        width:72px!important;
        height:64px!important;
        border-radius:15px!important;
      }

      html.dcc-theme-light-premium body #client #client-main .dcc-training-stable-v3 section.dct3-muscles{
        min-height:148px!important;
        display:grid!important;
        grid-template-columns:minmax(0,1fr) 188px!important;
        gap:10px!important;
        align-items:center!important;
        margin-bottom:12px!important;
        padding:14px!important;
        border:1px solid rgba(183,123,19,.24)!important;
        border-radius:21px!important;
        background:linear-gradient(145deg,#fffefa 0%,#fbf5eb 100%)!important;
        box-shadow:0 10px 24px rgba(78,58,28,.065),inset 0 1px 0 rgba(255,255,255,.96)!important;
        overflow:hidden!important;
      }

      html.dcc-theme-light-premium body #client #client-main .dcc-training-stable-v3 .dct3-muscles .dct3-label{
        margin-bottom:8px!important;
        color:#b77b13!important;
        font-size:9.5px!important;
        line-height:1.1!important;
        font-weight:850!important;
        letter-spacing:2.6px!important;
      }

      html.dcc-theme-light-premium body #client #client-main .dcc-training-stable-v3 .dct3-muscles .dct3-title{
        margin:0!important;
        color:#17191d!important;
        font-size:20px!important;
        line-height:1.08!important;
        font-weight:760!important;
        letter-spacing:-.45px!important;
      }

      html.dcc-theme-light-premium body #client #client-main .dcc-training-stable-v3 .dct3-region{
        display:flex!important;
        align-items:center!important;
        gap:10px!important;
        margin-top:11px!important;
        color:#7d828a!important;
        font-size:7px!important;
        line-height:1!important;
        font-weight:750!important;
        letter-spacing:1.5px!important;
      }
      html.dcc-theme-light-premium body #client #client-main .dcc-training-stable-v3 .dct3-region::before{
        content:""!important;
        width:28px!important;
        height:2px!important;
        border-radius:999px!important;
        background:linear-gradient(90deg,#d7a73e,#b77b13)!important;
      }

      html.dcc-theme-light-premium body #client #client-main .dcc-training-stable-v3 .dct3-visuals{
        display:flex!important;
        justify-content:flex-end!important;
        align-items:flex-start!important;
        gap:8px!important;
        width:188px!important;
        overflow:visible!important;
      }

      html.dcc-theme-light-premium body #client #client-main .dcc-training-stable-v3 .dct3-muscle-wrap{
        flex:0 0 90px!important;
        width:90px!important;
        min-width:90px!important;
        text-align:center!important;
      }

      html.dcc-theme-light-premium body #client #client-main .dcc-training-stable-v3 .dct3-muscle{
        width:90px!important;
        height:104px!important;
        min-width:90px!important;
        min-height:104px!important;
        border:0!important;
        border-radius:14px!important;
        overflow:hidden!important;
        background:#161511!important;
        box-shadow:0 5px 15px rgba(73,47,7,.13)!important;
      }

      html.dcc-theme-light-premium body #client #client-main .dcc-training-stable-v3 .dct3-muscle img{
        display:block!important;
        width:100%!important;
        height:100%!important;
        max-width:none!important;
        object-fit:cover!important;
        object-position:center!important;
        border-radius:14px!important;
        filter:none!important;
      }

      html.dcc-theme-light-premium body #client #client-main .dcc-training-stable-v3 .dct3-muscle-wrap>span{
        display:block!important;
        visibility:visible!important;
        margin-top:6px!important;
        color:#a66d0d!important;
        font-size:7px!important;
        line-height:1!important;
        font-weight:850!important;
        letter-spacing:1px!important;
        text-transform:uppercase!important;
        white-space:nowrap!important;
        overflow:visible!important;
      }

      html.dcc-theme-light-premium body #client #client-main .dcc-training-stable-v3 section.dct3-tip{
        min-height:76px!important;
        display:grid!important;
        grid-template-columns:43px minmax(0,1fr) 18px!important;
        gap:11px!important;
        align-items:center!important;
        margin-bottom:12px!important;
        padding:12px 14px!important;
        border:1px solid rgba(183,123,19,.24)!important;
        border-radius:21px!important;
        background:linear-gradient(145deg,#fffefa 0%,#fbf5eb 100%)!important;
        box-shadow:0 10px 24px rgba(78,58,28,.065),inset 0 1px 0 rgba(255,255,255,.96)!important;
      }
      html.dcc-theme-light-premium body #client #client-main .dcc-training-stable-v3 .dct3-tip-icon{
        width:42px!important;
        height:42px!important;
        border:1px solid rgba(183,123,19,.31)!important;
        border-radius:14px!important;
        background:#fffaf0!important;
        color:#b77b13!important;
      }
      html.dcc-theme-light-premium body #client #client-main .dcc-training-stable-v3 .dct3-tip p{
        margin:0!important;
        color:#68707c!important;
        font-size:11px!important;
        line-height:1.42!important;
      }
      html.dcc-theme-light-premium body #client #client-main .dcc-training-stable-v3 .dct3-tip-arrow{
        display:block!important;
        color:#b7aa92!important;
        font-size:27px!important;
        line-height:1!important;
        text-align:right!important;
      }

      html.dcc-theme-light-premium body #client #client-main .dcc-training-stable-v3 section.dct3-routine{
        position:relative!important;
        isolation:isolate!important;
        overflow:hidden!important;
        min-height:150px!important;
        margin:0!important;
        padding:15px 14px!important;
        border:1px solid rgba(183,123,19,.28)!important;
        border-radius:21px!important;
        background:linear-gradient(145deg,#fffefa 0%,#fbf5eb 100%)!important;
        box-shadow:0 11px 26px rgba(78,58,28,.07),inset 0 1px 0 rgba(255,255,255,.96)!important;
      }

      html.dcc-theme-light-premium body #client #client-main .dcc-training-stable-v3 .dct-ref-plate{
        display:block!important;
        position:absolute!important;
        z-index:0!important;
        top:0!important;
        right:0!important;
        width:58%!important;
        height:100%!important;
        pointer-events:none!important;
        background-image:url("${PLATE}")!important;
        background-repeat:no-repeat!important;
        background-size:cover!important;
        background-position:center right!important;
        opacity:1!important;
      }
      html.dcc-theme-light-premium body #client #client-main .dcc-training-stable-v3 .dct-ref-fade{
        display:block!important;
        position:absolute!important;
        z-index:1!important;
        inset:0!important;
        pointer-events:none!important;
        background:
          radial-gradient(circle at 62% 10%,rgba(243,201,109,.17),transparent 27%),
          linear-gradient(90deg,
            rgba(255,253,248,1) 0%,
            rgba(255,253,248,.99) 37%,
            rgba(255,253,248,.88) 50%,
            rgba(255,253,248,.55) 62%,
            rgba(255,253,248,.12) 78%,
            rgba(255,253,248,.02) 100%)!important;
      }
      html.dcc-theme-light-premium body #client #client-main .dcc-training-stable-v3 section.dct3-routine > *:not(.dct-ref-plate):not(.dct-ref-fade){
        position:relative!important;
        z-index:2!important;
      }
      html.dcc-theme-light-premium body #client #client-main .dcc-training-stable-v3 .dct3-routine h3{
        max-width:58%!important;
        margin:0!important;
        color:#17191d!important;
        font-size:19px!important;
        line-height:1.08!important;
        font-weight:760!important;
      }
      html.dcc-theme-light-premium body #client #client-main .dcc-training-stable-v3 .dct3-meta{
        margin-top:6px!important;
        color:#707782!important;
        font-size:10.5px!important;
      }
      html.dcc-theme-light-premium body #client #client-main .dcc-training-stable-v3 .dct3-actions{
        display:grid!important;
        grid-template-columns:minmax(0,1.45fr) minmax(105px,.86fr)!important;
        gap:8px!important;
        width:100%!important;
        max-width:520px!important;
        margin-top:17px!important;
      }
      html.dcc-theme-light-premium body #client #client-main .dcc-training-stable-v3 .dct3-start,
      html.dcc-theme-light-premium body #client #client-main .dcc-training-stable-v3 .dct3-view{
        min-height:44px!important;
        padding:0 11px!important;
        border-radius:14px!important;
        font-size:10.8px!important;
        font-weight:850!important;
      }
      html.dcc-theme-light-premium body #client #client-main .dcc-training-stable-v3 .dct3-start{
        border:1px solid #d6a33c!important;
        background:linear-gradient(135deg,#ffe895 0%,#f2ca5b 50%,#dfa52f 100%)!important;
        color:#17140d!important;
      }
      html.dcc-theme-light-premium body #client #client-main .dcc-training-stable-v3 .dct3-view{
        border:1px solid rgba(255,255,255,.12)!important;
        background:linear-gradient(145deg,#191d24,#0e1116)!important;
        color:#f4f2ec!important;
      }

      @media(min-width:420px){
        html.dcc-theme-light-premium body #client #client-main .dcc-training-stable-v3 section.dct3-muscles{
          min-height:156px!important;
          grid-template-columns:minmax(0,1fr) 218px!important;
          padding:16px 18px!important;
        }
        html.dcc-theme-light-premium body #client #client-main .dcc-training-stable-v3 .dct3-visuals{width:218px!important}
        html.dcc-theme-light-premium body #client #client-main .dcc-training-stable-v3 .dct3-muscle-wrap{
          flex-basis:104px!important;width:104px!important;min-width:104px!important
        }
        html.dcc-theme-light-premium body #client #client-main .dcc-training-stable-v3 .dct3-muscle{
          width:104px!important;height:118px!important;min-width:104px!important;min-height:118px!important
        }
        html.dcc-theme-light-premium body #client #client-main .dcc-training-stable-v3 .dct3-muscles .dct3-title{font-size:23px!important}
      }
    `;
    (document.head||document.documentElement).appendChild(s);
  }

  function premiumAsset(label){
    const n=norm(label);
    if(n.includes('pectoral')||n.includes('pecho'))return PECTORAL;
    if(n.includes('triceps'))return TRICEPS;
    return '';
  }

  function apply(){
    const root=document.querySelector('#client-main .dcc-training-stable-v3');
    if(!root)return;

    installStyle();

    const visualWrap=root.querySelector('.dct3-visuals');
    if(visualWrap){
      visualWrap.querySelectorAll('.dct3-muscle-wrap').forEach(wrap=>{
        const label=wrap.querySelector('span')?.textContent||wrap.querySelector('img')?.alt||'';
        const src=premiumAsset(label);
        const img=wrap.querySelector('img');
        if(src&&img){
          img.src=src;
          img.removeAttribute('style');
        }
        if(wrap.querySelector('span'))wrap.querySelector('span').textContent=String(label).trim();
      });
    }

    const tip=root.querySelector('.dct3-tip');
    if(tip&&!tip.querySelector('.dct3-tip-arrow')){
      const arrow=document.createElement('div');
      arrow.className='dct3-tip-arrow';
      arrow.textContent='›';
      tip.appendChild(arrow);
    }

    const routine=root.querySelector('.dct3-routine');
    if(routine){
      if(!routine.querySelector(':scope > .dct-ref-plate')){
        const plate=document.createElement('div');
        plate.className='dct-ref-plate';
        plate.setAttribute('aria-hidden','true');
        routine.prepend(plate);
      }
      if(!routine.querySelector(':scope > .dct-ref-fade')){
        const fade=document.createElement('div');
        fade.className='dct-ref-fade';
        fade.setAttribute('aria-hidden','true');
        routine.insertBefore(fade,routine.children[1]||null);
      }
    }
  }

  installStyle();

  const previousShowClient=window.showClient;
  if(typeof previousShowClient==='function'&&!previousShowClient.__dccReferenceFinal){
    const wrapped=function(screen){
      const result=previousShowClient.apply(this,arguments);
      if(screen==='training'&&!window.activeWorkout){
        requestAnimationFrame(()=>requestAnimationFrame(apply));
      }
      return result;
    };
    wrapped.__dccReferenceFinal=true;
    wrapped.__base=previousShowClient;
    window.showClient=wrapped;
  }

  const observer=new MutationObserver(()=>{
    if(document.querySelector('#client-main .dcc-training-stable-v3')){
      requestAnimationFrame(apply);
    }
  });
  const main=document.getElementById('client-main');
  if(main)observer.observe(main,{childList:true,subtree:true});

  requestAnimationFrame(apply);
})();
