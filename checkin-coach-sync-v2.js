/* DCC — entrenador: energía visible + revisión y recepción sincronizadas */
(function(){
  'use strict';

  function appData(){
    try{return data||{}}catch(e){return window.data||{}}
  }
  function database(){
    try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient}catch(e){}
    return window.supabaseClient||null;
  }
  function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}

  /* =====================================================
     PANEL ENTRENADOR — acabado estable, limpio y premium
     - elimina el logo del hero
     - reduce altura y peso visual
     - evita reflow/parpadeos en Safari
  ====================================================== */
  function installCoachDashboardPolish(){
    if(document.getElementById('dcc-coach-dashboard-polish-v1'))return;

    const style=document.createElement('style');
    style.id='dcc-coach-dashboard-polish-v1';
    style.textContent=`
      #coach-main.dcc-premium-dashboard{
        overflow-anchor:none!important;
        background:#07090c!important;
        padding-top:8px!important;
      }

      #coach-main.dcc-premium-dashboard .dcc-pd{
        transform:translateZ(0);
        backface-visibility:hidden;
        -webkit-backface-visibility:hidden;
      }

      #coach-main.dcc-premium-dashboard .dcc-pd *,
      #coach-main.dcc-premium-dashboard .dcc-pd *::before,
      #coach-main.dcc-premium-dashboard .dcc-pd *::after{
        animation:none!important;
        transition:none!important;
      }

      /* Cabecera: sin logo, más parecida al lenguaje visual del cliente */
      #coach-main.dcc-premium-dashboard .dcc-pd-hero{
        min-height:142px!important;
        padding:18px 18px 16px!important;
        border:1px solid rgba(217,170,74,.58)!important;
        border-radius:21px!important;
        background:
          radial-gradient(circle at 88% 18%,rgba(240,201,107,.14),transparent 30%),
          linear-gradient(145deg,#15191f 0%,#0b0e13 62%,#080a0d 100%)!important;
        box-shadow:
          0 15px 34px rgba(0,0,0,.28),
          inset 0 1px 0 rgba(255,255,255,.035)!important;
        contain:layout paint;
      }

      #coach-main.dcc-premium-dashboard .dcc-pd-brand{
        display:none!important;
      }

      #coach-main.dcc-premium-dashboard .dcc-pd-hero::before{
        content:'PANEL DE CONTROL';
        display:block;
        color:#efbd54;
        font-family:"Avenir Next","Helvetica Neue",-apple-system,BlinkMacSystemFont,Arial,sans-serif;
        font-size:9px;
        line-height:1.2;
        font-weight:800;
        letter-spacing:2.8px;
      }

      #coach-main.dcc-premium-dashboard .dcc-pd-hero::after{
        content:'';
        position:absolute;
        pointer-events:none;
        right:-30px;
        top:-48px;
        width:220px;
        height:160px;
        border-radius:50%;
        background:radial-gradient(circle,rgba(240,201,107,.08),transparent 68%);
      }

      #coach-main.dcc-premium-dashboard .dcc-pd-title{
        position:relative!important;
        z-index:1!important;
        max-width:72%!important;
        margin:26px 0 0!important;
        color:#f4f2ed!important;
        font-family:"Avenir Next","Helvetica Neue",-apple-system,BlinkMacSystemFont,Arial,sans-serif!important;
        font-size:27px!important;
        line-height:1.02!important;
        font-weight:420!important;
        letter-spacing:-.7px!important;
      }

      #coach-main.dcc-premium-dashboard .dcc-pd-title span{
        display:block!important;
        margin-top:4px!important;
        color:#efbd54!important;
        font-family:inherit!important;
        font-size:27px!important;
        font-weight:720!important;
        letter-spacing:-.6px!important;
      }

      #coach-main.dcc-premium-dashboard .dcc-pd-title::after{
        width:34px!important;
        height:1.5px!important;
        margin-top:12px!important;
        background:linear-gradient(90deg,#f0c96b,#c99131)!important;
      }

      /* Métricas más compactas */
      #coach-main.dcc-premium-dashboard .dcc-pd-strip{
        margin:10px 0 11px!important;
        border-color:rgba(217,170,74,.36)!important;
        border-radius:18px!important;
        background:linear-gradient(145deg,#12171c,#090c10)!important;
        box-shadow:0 10px 24px rgba(0,0,0,.20)!important;
      }

      #coach-main.dcc-premium-dashboard .dcc-pd-stat{
        min-height:62px!important;
        padding:9px 8px!important;
      }

      #coach-main.dcc-premium-dashboard .dcc-pd-stat strong{
        font-size:19px!important;
        font-weight:650!important;
      }

      #coach-main.dcc-premium-dashboard .dcc-pd-stat span{
        margin-top:5px!important;
        color:#9ca3ad!important;
        font-size:6.5px!important;
        line-height:1.18!important;
        letter-spacing:.75px!important;
      }

      /* Tarjetas con menos amarillo y más profundidad */
      #coach-main.dcc-premium-dashboard .dcc-pd-section{
        margin-top:11px!important;
        padding:13px 14px!important;
        border-color:rgba(217,170,74,.34)!important;
        border-radius:19px!important;
        background:
          radial-gradient(circle at 100% 0,rgba(217,170,74,.045),transparent 34%),
          linear-gradient(145deg,#14191f,#0a0d11)!important;
        box-shadow:0 12px 27px rgba(0,0,0,.22)!important;
      }

      #coach-main.dcc-premium-dashboard .dcc-pd-section-kicker{
        font-size:9px!important;
        letter-spacing:2.5px!important;
        color:#e9b74d!important;
      }

      #coach-main.dcc-premium-dashboard .dcc-pd-section-sub{
        margin-top:4px!important;
        font-size:9px!important;
        color:#858d98!important;
      }

      #coach-main.dcc-premium-dashboard .dcc-pd-row{
        min-height:54px!important;
        padding:9px 0!important;
        gap:10px!important;
      }

      #coach-main.dcc-premium-dashboard .dcc-pd-icon{
        width:35px!important;
        height:35px!important;
        border-radius:11px!important;
      }

      #coach-main.dcc-premium-dashboard .dcc-pd-copy b{
        font-size:12px!important;
      }

      #coach-main.dcc-premium-dashboard .dcc-pd-copy span{
        font-size:9.3px!important;
      }

      #coach-main.dcc-premium-dashboard .dcc-pd-badge{
        padding:5px 8px!important;
        background:rgba(217,170,74,.035)!important;
        border-color:rgba(217,170,74,.26)!important;
      }

      #coach-main.dcc-premium-dashboard .dcc-pd-banner{
        min-height:62px!important;
        margin-top:11px!important;
        padding:11px 14px!important;
        border-color:rgba(217,170,74,.38)!important;
        border-radius:19px!important;
        background:
          radial-gradient(circle at 92% 30%,rgba(240,201,107,.10),transparent 28%),
          linear-gradient(145deg,#15191e,#0a0d11)!important;
        box-shadow:0 12px 26px rgba(0,0,0,.22)!important;
      }

      #coach-main.dcc-premium-dashboard .dcc-pd-trophy{
        display:none!important;
      }

      #coach-main.dcc-premium-dashboard .dcc-pd-banner small{
        color:#c99b42!important;
        font-size:7px!important;
      }

      #coach-main.dcc-premium-dashboard .dcc-pd-banner strong{
        margin-top:5px!important;
        color:#f2f0ea!important;
        font-family:"Avenir Next","Helvetica Neue",-apple-system,BlinkMacSystemFont,Arial,sans-serif!important;
        font-size:14px!important;
        font-weight:560!important;
      }

      @media(max-width:430px){
        #coach-main.dcc-premium-dashboard .dcc-pd-hero{
          min-height:132px!important;
          padding:16px 15px 14px!important;
          border-radius:19px!important;
        }
        #coach-main.dcc-premium-dashboard .dcc-pd-title,
        #coach-main.dcc-premium-dashboard .dcc-pd-title span{
          font-size:25px!important;
        }
        #coach-main.dcc-premium-dashboard .dcc-pd-title{
          margin-top:23px!important;
        }
        #coach-main.dcc-premium-dashboard .dcc-pd-stat{
          min-height:58px!important;
          padding:8px 6px!important;
        }
        #coach-main.dcc-premium-dashboard .dcc-pd-stat strong{
          font-size:18px!important;
        }
        #coach-main.dcc-premium-dashboard .dcc-pd-section{
          padding:12px 13px!important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  async function syncCheckinsFromDatabase(){
    const db=database();if(!db)return false;
    try{
      const {data:rows,error}=await db.from('client_checkins').select('client_id,weight,diet,training,energy,comment,reviewed,body_fat,sent_at,updated_at');
      if(error)throw error;
      const d=appData();d.checkins=d.checkins||{};
      (rows||[]).forEach(r=>{
        const prev=d.checkins[r.client_id]||{};
        d.checkins[r.client_id]={
          ...prev,
          weight:r.weight??prev.weight??'',
          diet:r.diet??prev.diet??'',
          training:r.training??prev.training??'',
          energy:r.energy??prev.energy??'',
          comment:r.comment??prev.comment??'',
          reviewed:!!r.reviewed,
          bodyFat:r.body_fat!=null?Number(r.body_fat):(prev.bodyFat??''),
          sentAt:r.sent_at??prev.sentAt??null,
          updatedAt:r.updated_at??prev.updatedAt??null
        };
        const c=(d.clients||[]).find(x=>String(x.id)===String(r.client_id));
        if(c)c.status=r.reviewed?'Revisado':'Pendiente';
      });
      try{if(typeof saveData==='function')saveData();else if(typeof window.saveData==='function')window.saveData()}catch(e){console.warn(e)}
      return true;
    }catch(e){
      console.error('DCC recepción check-ins entrenador:',e);
      return false;
    }
  }

  function installEnergyRow(){
    const current=window.reviewCheckin;
    if(typeof current!=='function'||current.__dccEnergyReviewV2)return false;
    const wrapped=function(id){
      const result=current.apply(this,arguments);
      requestAnimationFrame(()=>{
        const x=appData()?.checkins?.[id];
        const list=document.querySelector('#dcc-ci-modal .dcc-ci-review-list');
        if(!list||document.getElementById('dcc-ci-energy-row'))return;
        const value=String(x?.energy||'Pendiente');
        const row=document.createElement('div');
        row.id='dcc-ci-energy-row';
        row.className='dcc-ci-review-row';
        row.innerHTML=`<div class="dcc-ci-rico"><svg viewBox="0 0 24 24"><path d="M13 2 5 13h6l-1 9 9-13h-6l0-7Z"/></svg></div><div><div class="dcc-ci-rlabel">Energía</div><div class="dcc-ci-rvalue">${esc(value)}</div></div><div class="dcc-ci-rside">${/pendiente/i.test(value)?'◷ Pendiente':''}</div>`;
        const comment=[...list.children].find(el=>el.classList.contains('comment'));
        if(comment)list.insertBefore(row,comment);else list.appendChild(row);
      });
      return result;
    };
    wrapped.__dccEnergyReviewV2=true;
    wrapped.__base=current;
    window.reviewCheckin=wrapped;
    return true;
  }

  function installReviewedSync(){
    const current=window.dccMarkCheckinReviewed;
    if(typeof current!=='function'||current.__dccReviewedSyncV2)return false;
    const wrapped=async function(id){
      const db=database();
      const now=new Date().toISOString();
      try{
        if(db){
          const {error}=await db.from('client_checkins').update({reviewed:true,updated_at:now}).eq('client_id',id);
          if(error)throw error;
          const {error:clientError}=await db.from('clients').update({status:'Revisado'}).eq('id',id);
          if(clientError)console.warn('DCC estado cliente revisado:',clientError);
        }
      }catch(e){
        console.error('DCC sincronización revisión check-in:',e);
      }
      const x=appData()?.checkins?.[id];
      if(x){x.reviewed=true;x.reviewedAt=now}
      return current.apply(this,arguments);
    };
    wrapped.__dccReviewedSyncV2=true;
    wrapped.__base=current;
    window.dccMarkCheckinReviewed=wrapped;
    return true;
  }

  function installNavigationSync(){
    const current=window.showCoach;
    if(typeof current!=='function'||current.__dccCheckinRemoteSyncV3)return false;
    const wrapped=function(screen){
      const result=current.apply(this,arguments);
      if(screen==='checkins'){
        syncCheckinsFromDatabase().then(ok=>{
          if(ok&&window.currentScreen==='checkins')current('checkins');
        });
      }
      return result;
    };
    wrapped.__dccCheckinRemoteSyncV3=true;
    wrapped.__base=current;
    window.showCoach=wrapped;
    return true;
  }

  function install(){
    installCoachDashboardPolish();
    installEnergyRow();
    installReviewedSync();
    installNavigationSync();
  }

  install();
  syncCheckinsFromDatabase();
  setTimeout(install,300);
  setTimeout(install,1000);
  window.addEventListener('load',()=>setTimeout(()=>{install();syncCheckinsFromDatabase()},120));
})();
