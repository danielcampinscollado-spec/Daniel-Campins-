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
        border-color:rgba(240,201,107,.58)!important;
        background:linear-gradient(120deg,#11151a 0%,#0b0f13 61%,#080a0d 100%)!important;
      }
      html body #client-main .dc-home-next::after{
        content:"";
        position:absolute!important;
        z-index:0!important;
        top:0!important;
        right:0!important;
        bottom:0!important;
        width:47%!important;
        pointer-events:none!important;
        background-image:
          linear-gradient(90deg,#0b0f13 0%,rgba(11,15,19,.88) 14%,rgba(11,15,19,.42) 40%,rgba(11,15,19,.06) 76%,rgba(11,15,19,0) 100%),
          url("data:image/jpeg;base64,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");
        background-size:cover!important;
        background-position:center right!important;
        background-repeat:no-repeat!important;
        opacity:.96!important;
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
