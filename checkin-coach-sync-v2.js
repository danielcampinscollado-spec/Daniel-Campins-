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

/* Carga del formulario premium de alta de cliente. */
(function(){
  if(window.__dccNewClientLoaderV1)return;
  window.__dccNewClientLoaderV1=true;
  const existing=[...document.scripts].find(s=>/new-client-premium-v1\.js(?:\?|$)/.test(s.src||''));
  if(existing)return;
  const script=document.createElement('script');
  script.src='./new-client-premium-v1.js?v=20260910-2045';
  script.async=false;
  script.onerror=()=>console.error('DCC: no se pudo cargar new-client-premium-v1.js');
  (document.head||document.documentElement).appendChild(script);
})();

/* Carga del calendario funcional con sesiones reales. */
(function(){
  if(window.__dccCalendarLoaderV12)return;
  window.__dccCalendarLoaderV12=true;
  const existing=[...document.scripts].find(s=>/coach-calendar-v12\.js(?:\?|$)/.test(s.src||''));
  if(existing)return;
  const script=document.createElement('script');
  script.src='./coach-calendar-v12.js?v=20260910-2115';
  script.async=false;
  script.onerror=()=>console.error('DCC: no se pudo cargar coach-calendar-v12.js');
  (document.head||document.documentElement).appendChild(script);
})();

/* Corrige la alineación semanal del calendario en móvil. */
(function(){
  if(window.__dccCalendarAlignmentLoaderV13)return;
  window.__dccCalendarAlignmentLoaderV13=true;
  const existing=[...document.scripts].find(s=>/coach-calendar-alignment-v13\.js(?:\?|$)/.test(s.src||''));
  if(existing)return;
  const script=document.createElement('script');
  script.src='./coach-calendar-alignment-v13.js?v=20260910-2128';
  script.async=false;
  script.onerror=()=>console.error('DCC: no se pudo cargar coach-calendar-alignment-v13.js');
  (document.head||document.documentElement).appendChild(script);
})();
