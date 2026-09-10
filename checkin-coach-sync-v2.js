/* DCC — entrenador: energía visible + revisión y recepción sincronizadas */
(function(){
  'use strict';

  /* =====================================================
     TIPOGRAFÍA GLOBAL PREMIUM
     Una sola familia para cliente + entrenador, con
     jerarquía controlada y fallback seguro en iOS.
  ====================================================== */
  function installPremiumTypography(){
    if(!document.getElementById('dcc-manrope-font')){
      const preconnect=document.createElement('link');
      preconnect.rel='preconnect';
      preconnect.href='https://fonts.googleapis.com';
      document.head.appendChild(preconnect);

      const preconnectStatic=document.createElement('link');
      preconnectStatic.rel='preconnect';
      preconnectStatic.href='https://fonts.gstatic.com';
      preconnectStatic.crossOrigin='anonymous';
      document.head.appendChild(preconnectStatic);

      const font=document.createElement('link');
      font.id='dcc-manrope-font';
      font.rel='stylesheet';
      font.href='https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap';
      document.head.appendChild(font);
    }

    if(document.getElementById('dcc-global-premium-typography')) return;

    const style=document.createElement('style');
    style.id='dcc-global-premium-typography';
    style.textContent=`
      :root{
        --dcc-font-ui:"Manrope","Avenir Next","SF Pro Display","SF Pro Text","Helvetica Neue",-apple-system,BlinkMacSystemFont,Arial,sans-serif;
      }

      html body,
      html body button,
      html body input,
      html body textarea,
      html body select,
      html body option,
      html body h1,
      html body h2,
      html body h3,
      html body h4,
      html body h5,
      html body h6,
      html body p,
      html body div,
      html body span,
      html body label,
      html body b,
      html body strong,
      html body small,
      html body a{
        font-family:var(--dcc-font-ui)!important;
        font-synthesis:none!important;
      }

      html body{
        -webkit-font-smoothing:antialiased!important;
        text-rendering:optimizeLegibility!important;
      }

      /* Títulos: sólidos, limpios y menos pesados que antes */
      html body h1,
      html body h2,
      html body h3{
        font-weight:600!important;
        letter-spacing:-.025em!important;
      }

      /* Textos de tarjeta y acciones */
      html body button,
      html body .btn,
      html body .ghost{
        font-weight:600!important;
      }

      /* Encabezados editoriales dorados mantienen la identidad */
      html body .section-eyebrow,
      html body .dch-eyebrow,
      html body .dcc-pd-brand-name,
      html body .dcc-pd-section-kicker,
      html body .dct-kicker,
      html body .workout-eyebrow{
        font-weight:700!important;
      }

      /* Inicio cliente: nombre elegante y métricas con presencia */
      html body #client-main .dch-name,
      html body #client-main .dch-welcome .dch-name{
        font-weight:300!important;
        letter-spacing:-.01em!important;
      }

      html body #client-main .dch-stat strong,
      html body #client-main .dch-stat b{
        font-weight:700!important;
      }

      /* Alimentación: nombres más refinados, como el diseño aprobado */
      html body #client-main .meal-card summary b{
        font-size:15.5px!important;
        font-weight:500!important;
        line-height:1.14!important;
        letter-spacing:-.16px!important;
      }

      html body #client-main .diet-pdf-text strong{
        font-weight:600!important;
      }

      html body #client-main .diet-switch button{
        font-weight:600!important;
      }

      /* Panel entrenador: elimina la mezcla con Georgia/Arial */
      html body #coach-main .dcc-pd-title,
      html body #coach-main .dcc-pd-title span,
      html body #coach-main .dcc-pd-banner strong{
        font-family:var(--dcc-font-ui)!important;
      }

      html body #coach-main .dcc-pd-title{
        font-weight:400!important;
        letter-spacing:-.035em!important;
      }

      html body #coach-main .dcc-pd-title span{
        font-weight:700!important;
      }

      html body #coach-main .dcc-cl-name{
        font-weight:600!important;
      }

      /* Números y métricas importantes conservan fuerza */
      html body .metric b,
      html body .dcc-pd-stat strong{
        font-weight:700!important;
        font-variant-numeric:tabular-nums!important;
      }
    `;
    document.head.appendChild(style);
  }

  installPremiumTypography();

  function appData(){
    try{return data||{}}catch(e){return window.data||{}}
  }
  function database(){
    try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient}catch(e){}
    return window.supabaseClient||null;
  }
  function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}

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
