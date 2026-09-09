/* DCC — corrección definitiva del buscador de Clientes */
(function(){
  const STYLE_ID='dcc-clients-search-final-fix';

  function injectCss(){
    let old=document.getElementById(STYLE_ID);
    if(old) old.remove();
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      html body #coach #coach-main.dcc-final-clients .dcc-fcl-search{
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
        border:1px solid rgba(240,201,107,.48)!important;
        border-radius:16px!important;
        background:radial-gradient(circle at 88% 0,rgba(240,201,107,.075),transparent 36%),linear-gradient(145deg,#11171c,#080c0f)!important;
        box-shadow:inset 0 1px 0 rgba(255,255,255,.025)!important;
      }
      html body #coach #coach-main.dcc-final-clients .dcc-fcl-search > svg{
        width:18px!important;
        height:18px!important;
        min-width:18px!important;
        flex:0 0 18px!important;
        color:#c1c7ce!important;
      }
      html body #coach #coach-main.dcc-final-clients .dcc-fcl-search > input#dccClientSearch{
        all:unset!important;
        -webkit-appearance:none!important;
        appearance:none!important;
        display:block!important;
        flex:1 1 auto!important;
        width:auto!important;
        min-width:0!important;
        height:100%!important;
        box-sizing:border-box!important;
        color:#f4f1ed!important;
        font-family:inherit!important;
        font-size:14px!important;
        font-weight:650!important;
        line-height:52px!important;
        caret-color:#f0c96b!important;
        -webkit-text-fill-color:#f4f1ed!important;
      }
      html body #coach #coach-main.dcc-final-clients .dcc-fcl-search > input#dccClientSearch::placeholder{
        color:#77808a!important;
        -webkit-text-fill-color:#77808a!important;
        opacity:1!important;
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
        border-color:rgba(240,201,107,.62)!important;
        background:linear-gradient(120deg,#11151a 0%,#0b0f13 58%,#07090c 100%)!important;
        box-shadow:inset 0 1px 0 rgba(255,255,255,.035),0 14px 36px rgba(0,0,0,.28)!important;
      }

      html body #client-main .dc-home-next::after{
        content:"";
        position:absolute!important;
        z-index:0!important;
        top:0!important;
        right:0!important;
        bottom:0!important;
        width:55%!important;
        pointer-events:none!important;
        background-image:
          linear-gradient(90deg,#0b0f13 0%,rgba(11,15,19,.92) 15%,rgba(11,15,19,.52) 42%,rgba(11,15,19,.10) 72%,rgba(11,15,19,0) 100%),
          url("data:image/jpeg;base64,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");
        background-size:cover!important;
        background-position:center right!important;
        background-repeat:no-repeat!important;
        opacity:.92!important;
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
    set(input,'color','#f4f1ed');
    set(input,'-webkit-text-fill-color','#f4f1ed');
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
  document.addEventListener('DOMContentLoaded',()=>{injectCss();injectNextWorkoutVisual();forceInput()},{once:true});
  window.addEventListener('load',()=>setTimeout(()=>{injectNextWorkoutVisual();forceInput()},50));

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
})();
