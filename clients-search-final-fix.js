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

  document.addEventListener('DOMContentLoaded',()=>{
    injectCss();
    injectNextWorkoutVisual();
    forceInput();
  },{once:true});

  window.addEventListener('load',()=>setTimeout(()=>{
    injectNextWorkoutVisual();
    forceInput();
  },50));

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
