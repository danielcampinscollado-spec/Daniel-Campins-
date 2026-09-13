/* DCC — autoridad de lectura de check-ins del entrenador.
   Responsabilidad única: sincronizar check-ins + histórico desde Supabase.
   Un check-in es histórico: nunca sobrescribe la métrica corporal actual del cliente. */
(function(){
  'use strict';
  const BUILD='20260913-checkin-coach-source-v5';
  if(window.__dccCoachCheckinSource===BUILD)return;
  window.__dccCoachCheckinSource=BUILD;

  const appData=()=>{try{return data||window.data||{}}catch(_){return window.data||{}}};
  const db=()=>{try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient}catch(_){}return window.supabaseClient||null};
  const num=v=>{const n=Number(v);return Number.isFinite(n)?n:null};
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const saveLocal=()=>{try{if(typeof saveData==='function')return saveData();if(typeof window.saveData==='function')return window.saveData()}catch(error){console.warn('DCC check-in cache:',error)}};

  async function syncCoachCheckins(){
    const database=db(),d=appData();
    if(!database||!d)return false;
    try{
      const [checkinsRes,historyRes]=await Promise.all([
        database.from('client_checkins').select('client_id,weight,diet,training,energy,comment,reviewed,body_fat,sent_at,updated_at'),
        database.from('client_body_fat_history').select('client_id,body_fat,recorded_at').order('recorded_at',{ascending:true})
      ]);
      if(checkinsRes.error)throw checkinsRes.error;
      if(historyRes.error)throw historyRes.error;

      const nextCheckins={};
      (checkinsRes.data||[]).forEach(row=>{
        nextCheckins[String(row.client_id)]={
          weight:row.weight??'',
          diet:row.diet??'',
          training:row.training??'',
          energy:row.energy??'',
          comment:row.comment??'',
          reviewed:!!row.reviewed,
          bodyFat:row.body_fat==null?'':Number(row.body_fat),
          body_fat:row.body_fat==null?'':Number(row.body_fat),
          sentAt:row.sent_at??null,
          sent_at:row.sent_at??null,
          updatedAt:row.updated_at??null,
          updated_at:row.updated_at??null
        };
      });

      const nextHistory={};
      (d.clients||[]).forEach(c=>{nextHistory[String(c.id)]=[]});
      (historyRes.data||[]).forEach(row=>{
        const id=String(row.client_id);
        nextHistory[id]=nextHistory[id]||[];
        nextHistory[id].push({bodyFat:Number(row.body_fat),body_fat:Number(row.body_fat),recorded_at:row.recorded_at});
      });

      d.checkins=nextCheckins;
      d.bodyFatHistory=nextHistory;

      /* El estado de revisión sí pertenece al check-in; peso/grasa actuales no. */
      (d.clients||[]).forEach(c=>{
        const x=nextCheckins[String(c.id)];
        if(x?.sentAt)c.status=x.reviewed?'Revisado':'Pendiente';
      });
      saveLocal();
      return true;
    }catch(error){
      console.error('DCC sincronizando check-ins del entrenador:',error);
      return false;
    }
  }

  window.dccSyncCoachCheckinsFromServer=syncCoachCheckins;

  function previousFatBefore(id,sentAt){
    const rows=appData().bodyFatHistory?.[id]||[];
    const limit=sentAt?new Date(sentAt).getTime():Infinity;
    let previous=null;
    for(const row of rows){
      const at=row?.recorded_at?new Date(row.recorded_at).getTime():NaN;
      const value=num(row?.bodyFat??row?.body_fat);
      if(value==null||!Number.isFinite(at)||at>=limit)continue;
      previous=value;
    }
    return previous;
  }

  function patchReview(id){
    const x=appData().checkins?.[id];
    const list=document.querySelector('#dcc-ci-modal .dcc-ci-review-list');
    if(!x||!list)return;

    const labels=[...list.querySelectorAll('.dcc-ci-rlabel')];
    const find=label=>labels.find(el=>String(el.textContent||'').trim().toLowerCase()===label.toLowerCase())?.closest('.dcc-ci-review-row')||null;

    if(!find('Energía')){
      const row=document.createElement('div');
      row.className='dcc-ci-review-row';
      row.innerHTML=`<div class="dcc-ci-rico">⚡</div><div><div class="dcc-ci-rlabel">Energía</div><div class="dcc-ci-rvalue">${esc(x.energy||'—')}</div></div><div class="dcc-ci-rside"></div>`;
      const comment=find('Comentario');
      if(comment)list.insertBefore(row,comment);else list.appendChild(row);
    }

    const fatRow=find('% de grasa');
    const fat=num(x.bodyFat??x.body_fat);
    if(fatRow&&fat!=null){
      const value=fatRow.querySelector('.dcc-ci-rvalue');
      if(value)value.textContent=`${fat.toLocaleString('es-ES',{minimumFractionDigits:1,maximumFractionDigits:1})} %`;
      const previous=previousFatBefore(id,x.sentAt??x.sent_at);
      const side=fatRow.querySelector('.dcc-ci-rside');
      if(side&&previous!=null){
        const delta=fat-previous;
        side.textContent=Math.abs(delta)<.05?'Sin cambios':`${delta<0?'↓':'↑'} ${Math.abs(delta).toLocaleString('es-ES',{minimumFractionDigits:1,maximumFractionDigits:1})} %`;
        side.classList.toggle('good',delta<-.05);
        side.classList.toggle('bad',delta>.05);
      }
    }
  }

  function installShowCoach(){
    const current=window.showCoach;
    if(typeof current!=='function'||current.__dccCoachCheckinSource===BUILD)return false;
    const wrapped=function(screen){
      if(screen!=='checkins')return current.apply(this,arguments);
      const args=arguments;
      const out=current.apply(this,args);
      syncCoachCheckins().then(ok=>{
        if(ok&&String(window.currentScreen||'')==='checkins')current.apply(this,args);
      });
      return out;
    };
    wrapped.__dccCoachCheckinSource=BUILD;
    wrapped.__base=current;
    window.showCoach=wrapped;
    return true;
  }

  function installReview(){
    const current=window.reviewCheckin;
    if(typeof current!=='function'||current.__dccCoachCheckinSource===BUILD)return false;
    const wrapped=function(id){
      const open=()=>{
        const result=current.apply(this,arguments);
        requestAnimationFrame(()=>patchReview(id));
        return result;
      };
      const d=appData();
      if(d.checkins?.[id])return open();
      syncCoachCheckins().then(open);
    };
    wrapped.__dccCoachCheckinSource=BUILD;
    wrapped.__base=current;
    window.reviewCheckin=wrapped;
    return true;
  }

  function install(){installShowCoach();installReview()}
  install();
  document.addEventListener('DOMContentLoaded',install,{once:true});
  window.addEventListener('load',install,{once:true});
  window.addEventListener('pageshow',install);
})();