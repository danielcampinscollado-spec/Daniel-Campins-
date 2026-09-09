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
      html body #client-main .dc-next{
        position:relative!important;
        overflow:hidden!important;
        background:
          linear-gradient(90deg,rgba(7,10,14,.99) 0%,rgba(7,10,14,.97) 39%,rgba(7,10,14,.78) 57%,rgba(7,10,14,.32) 79%,rgba(7,10,14,.12) 100%),
          url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20640%20240%22%3E%0A%3Cdefs%3E%0A%20%20%3CradialGradient%20id%3D%22bg%22%20cx%3D%2280%25%22%20cy%3D%2240%25%22%20r%3D%2285%25%22%3E%0A%20%20%20%20%3Cstop%20offset%3D%220%22%20stop-color%3D%22%231a1d20%22%2F%3E%0A%20%20%20%20%3Cstop%20offset%3D%22.52%22%20stop-color%3D%22%230b0e11%22%2F%3E%0A%20%20%20%20%3Cstop%20offset%3D%221%22%20stop-color%3D%22%2305070a%22%2F%3E%0A%20%20%3C%2FradialGradient%3E%0A%20%20%3ClinearGradient%20id%3D%22shine%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%0A%20%20%20%20%3Cstop%20offset%3D%220%22%20stop-color%3D%22%2355585a%22%20stop-opacity%3D%22.22%22%2F%3E%0A%20%20%20%20%3Cstop%20offset%3D%22.5%22%20stop-color%3D%22%230b0c0d%22%20stop-opacity%3D%22.05%22%2F%3E%0A%20%20%20%20%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23c0943a%22%20stop-opacity%3D%22.16%22%2F%3E%0A%20%20%3C%2FlinearGradient%3E%0A%20%20%3Cfilter%20id%3D%22soft%22%3E%3CfeGaussianBlur%20stdDeviation%3D%221.2%22%2F%3E%3C%2Ffilter%3E%0A%3C%2Fdefs%3E%0A%3Crect%20width%3D%22640%22%20height%3D%22240%22%20fill%3D%22url%28%23bg%29%22%2F%3E%0A%3Cellipse%20cx%3D%22540%22%20cy%3D%22120%22%20rx%3D%22235%22%20ry%3D%22220%22%20fill%3D%22%23121518%22%20stroke%3D%22%2334383c%22%20stroke-width%3D%2222%22%2F%3E%0A%3Cellipse%20cx%3D%22540%22%20cy%3D%22120%22%20rx%3D%22185%22%20ry%3D%22174%22%20fill%3D%22%23090b0d%22%20stroke%3D%22%23202429%22%20stroke-width%3D%2230%22%2F%3E%0A%3Cellipse%20cx%3D%22540%22%20cy%3D%22120%22%20rx%3D%22126%22%20ry%3D%22118%22%20fill%3D%22%23181b1e%22%20stroke%3D%22%230d0f11%22%20stroke-width%3D%2224%22%2F%3E%0A%3Cpath%20d%3D%22M375%208%20C460%2062%20535%20142%20625%20235%22%20stroke%3D%22url%28%23shine%29%22%20stroke-width%3D%2238%22%20fill%3D%22none%22%20opacity%3D%22.7%22%20filter%3D%22url%28%23soft%29%22%2F%3E%0A%3Ctext%20x%3D%22470%22%20y%3D%22112%22%20font-family%3D%22Arial%2CHelvetica%2Csans-serif%22%20font-size%3D%2264%22%20font-weight%3D%22800%22%20fill%3D%22%23272a2d%22%20stroke%3D%22%23050607%22%20stroke-width%3D%223%22%3E20%3C%2Ftext%3E%0A%3Ctext%20x%3D%22477%22%20y%3D%22158%22%20font-family%3D%22Arial%2CHelvetica%2Csans-serif%22%20font-size%3D%2232%22%20font-weight%3D%22700%22%20fill%3D%22%23222528%22%3EKG%3C%2Ftext%3E%0A%3Ccircle%20cx%3D%22540%22%20cy%3D%22120%22%20r%3D%2234%22%20fill%3D%22%23050608%22%20stroke%3D%22%23272a2e%22%20stroke-width%3D%2210%22%2F%3E%0A%3Cpath%20d%3D%22M630%208L640%200V240L625%20232%22%20fill%3D%22%23d8aa4a%22%20opacity%3D%22.12%22%2F%3E%0A%3C%2Fsvg%3E") right center/58% 100% no-repeat!important;
        border-color:rgba(240,201,107,.58)!important;
        box-shadow:inset 0 1px 0 rgba(255,255,255,.035),0 12px 34px rgba(0,0,0,.24)!important;
      }
      html body #client-main .dc-next > *{
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
