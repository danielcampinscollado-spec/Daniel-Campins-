/* DCC — entrenador: energía visible + revisión sincronizada */
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

  function install(){
    installEnergyRow();
    installReviewedSync();
  }

  install();
  setTimeout(install,300);
  setTimeout(install,1000);
  window.addEventListener('load',()=>setTimeout(install,120));
})();
