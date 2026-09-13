/* DCC — autoridad atómica para revisión de check-ins */
(function(){
  'use strict';
  if(window.__dccCheckinReviewAuthorityV1)return;
  window.__dccCheckinReviewAuthorityV1=true;

  const db=()=>{try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient}catch(_){ }return window.supabaseClient||null};
  const appData=()=>{try{return data||{}}catch(_){return window.data||{}}};
  const getClient=id=>(appData().clients||[]).find(c=>String(c.id)===String(id))||null;
  const notify=text=>{try{if(typeof toast==='function')return toast(text)}catch(_){ }try{return window.toast?.(text)}catch(_){ }};

  async function markReviewedAtomic(id){
    const client=getClient(id);
    const database=db();
    if(!client){notify('No se encontró el cliente');return false}
    if(!database){notify('No se pudo conectar con el servidor');return false}

    try{
      const {data:ok,error}=await database.rpc('dcc_review_checkin',{p_client_id:id});
      if(error||ok!==true)throw error||new Error('Revisión no confirmada');

      const d=appData();
      d.checkins=d.checkins||{};
      d.checkins[id]=d.checkins[id]||{};
      d.checkins[id].reviewed=true;
      d.checkins[id].status='Revisado';
      client.status='Revisado';

      try{if(typeof saveData==='function')saveData();else if(typeof window.saveData==='function')window.saveData()}catch(_){ }
      try{if(typeof closeModal==='function')closeModal();else window.closeModal?.()}catch(_){ }
      if(typeof window.showCoach==='function')window.showCoach('dashboard');
      notify('Check-in marcado como revisado');
      return true;
    }catch(error){
      console.error('DCC revisión atómica de check-in:',error);
      notify('No se pudo guardar la revisión');
      return false;
    }
  }

  function install(){
    if(window.markReviewed===markReviewedAtomic)return;
    window.markReviewed=markReviewedAtomic;
    window.markReviewed.__dccAtomicReviewV1=true;
  }

  install();
  document.addEventListener('DOMContentLoaded',install,{once:true});
  window.addEventListener('load',install,{once:true});
  setTimeout(install,250);
  setTimeout(install,1000);
})();
