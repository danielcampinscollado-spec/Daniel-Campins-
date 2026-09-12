/* DCC — Check-in cliente final v3: envío fiable, borrador limpio y consistencia visual */
(function(){
  'use strict';

  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const appData=()=>{try{return data||{}}catch(e){return window.data||{}}};
  const activeId=()=>{try{return currentClientId||null}catch(e){return window.currentClientId||null}};
  const client=id=>(appData().clients||[]).find(c=>String(c.id)===String(id))||null;
  const db=()=>{try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient}catch(e){}return window.supabaseClient||null};
  const toastSafe=t=>{try{if(typeof toast==='function')return toast(t);if(typeof window.toast==='function')return window.toast(t)}catch(e){}console.log(t)};
  const save=()=>{try{if(typeof saveData==='function')return saveData();if(typeof window.saveData==='function')return window.saveData()}catch(e){console.error(e)}};
  const num=v=>{const n=parseFloat(String(v??'').replace(',','.'));return Number.isFinite(n)?n:null};
  const money1=v=>{const n=Number(v);return Number.isFinite(n)?n.toFixed(1).replace('.',','):'—'};

  const drafts=window.__dccCheckinDraftsV3=window.__dccCheckinDraftsV3||{};
  const success=window.__dccCheckinSuccessV3=window.__dccCheckinSuccessV3||{};

  function latest(id){
    const d=appData();d.checkins=d.checkins||{};d.checkins[id]=d.checkins[id]||{};return d.checkins[id];
  }
  function draft(id){
    if(!drafts[id])drafts[id]={diet:'',training:'',energy:'',comment:''};
    return drafts[id];
  }
  function setDraft(id,next){drafts[id]={...draft(id),...next}}
  function weightIcon(){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="5" y="6" width="14" height="13" rx="3"/><path d="M9 9.5c1.9-1.5 4.1-1.5 6 0"/><path d="M12 9.5v3"/></svg>'}
  function option(type,value,label,current){
    const active=String(current||'').toLowerCase()===String(value).toLowerCase();
    return `<button type="button" class="dcc-cc-option ${active?'active':''}" onclick="dccCheckinPickV3('${type}','${esc(value)}')">${esc(label)}</button>`;
  }
  function sentLabel(value){
    if(!value)return'';
    const d=new Date(value);if(!Number.isFinite(d.getTime()))return'';
    const now=new Date();
    const same=d.getFullYear()===now.getFullYear()&&d.getMonth()===now.getMonth()&&d.getDate()===now.getDate();
    const date=d.toLocaleDateString('es-ES',{day:'numeric',month:'short'});
    return same?`hoy · ${date}`:date;
  }

  function ensureCss(){
    let s=document.getElementById('dcc-client-checkin-final-v3-css');
    if(s)s.remove();
    s=document.createElement('style');s.id='dcc-client-checkin-final-v3-css';s.textContent=`
      #client-main .dcc-cc-data-icon svg{width:20px;height:20px;display:block}
      #client-main .dcc-cc-data-top{align-items:center}
      #client-main .dcc-cc-update{display:flex!important;margin-left:auto!important;margin-right:auto!important}
      #client-main .dcc-cc-send{display:flex;align-items:center;justify-content:center;gap:8px}
      #client-main .dcc-cc-send-icon{font-size:16px;line-height:1}
      #client-main .dcc-cc-success{margin:10px 0 0;padding:10px 12px;border:1px solid rgba(72,201,142,.45);border-radius:13px;background:rgba(72,201,142,.09);color:#83e7b3;font-size:11px;font-weight:800;text-align:center;letter-spacing:.15px}
      #client-main .dcc-cc-sent{margin-top:8px!important}
      #client-main .dcc-cc-row-name{gap:0!important}
    `;document.head.appendChild(s);
  }

  function render(preserve=false){
    ensureCss();
    const main=document.getElementById('client-main'),id=activeId(),c=client(id);if(!main||!id||!c)return;
    const y=window.scrollY,x=latest(id),d=draft(id),weight=num(c.weight),fat=num(x.bodyFat??x.body_fat??c.bodyFat??c.body_fat),sent=x.sentAt??x.sent_at??null;
    main.className='dcc-client-checkin-v1';
    main.innerHTML=`<div class="dcc-cc">
      <header class="dcc-cc-head"><div class="dcc-cc-kicker">CHECK-IN SEMANAL</div><p class="dcc-cc-sub">Cuéntale a tu entrenador cómo ha ido tu semana.</p></header>
      <section class="dcc-cc-card">
        <div class="dcc-cc-card-head"><div class="dcc-cc-card-title"><span class="dcc-cc-card-icon">▥</span> DATOS ACTUALES</div><span class="dcc-cc-hint">Mantén tus datos al día</span></div>
        <div class="dcc-cc-data-grid">
          <article class="dcc-cc-data"><div class="dcc-cc-data-top"><span class="dcc-cc-data-icon">${weightIcon()}</span><div><div class="dcc-cc-data-label">Peso actual</div><div class="dcc-cc-data-value">${weight!=null?money1(weight)+' kg':'—'}</div></div></div><button type="button" class="dcc-cc-update" onclick="updateClientWeight()"><span>✎</span> Actualizar peso</button></article>
          <article class="dcc-cc-data"><div class="dcc-cc-data-top"><span class="dcc-cc-data-icon">%</span><div><div class="dcc-cc-data-label">% de grasa actual</div><div class="dcc-cc-data-value">${fat!=null?money1(fat)+' %':'—'}</div></div></div><button type="button" class="dcc-cc-update" onclick="updateClientBodyFat()"><span>✎</span> Actualizar grasa</button></article>
        </div>
      </section>
      <section class="dcc-cc-card">
        <div class="dcc-cc-card-head"><div class="dcc-cc-card-title"><span class="dcc-cc-card-icon">♥</span> TU SEMANA</div><span class="dcc-cc-hint">Valora cómo ha ido tu semana</span></div>
        <div class="dcc-cc-week">
          <div class="dcc-cc-row"><div class="dcc-cc-row-name">Alimentación</div><div class="dcc-cc-options">${option('diet','Mal','Mal',d.diet)}${option('diet','Normal','Normal',d.diet)}${option('diet','Bien','Bien',d.diet)}</div></div>
          <div class="dcc-cc-row"><div class="dcc-cc-row-name">Entrenamiento</div><div class="dcc-cc-options">${option('training','Mal','Mal',d.training)}${option('training','Normal','Normal',d.training)}${option('training','Bien','Bien',d.training)}</div></div>
          <div class="dcc-cc-row"><div class="dcc-cc-row-name">Energía</div><div class="dcc-cc-options">${option('energy','Baja','Baja',d.energy)}${option('energy','Normal','Normal',d.energy)}${option('energy','Alta','Alta',d.energy)}</div></div>
        </div>
      </section>
      <section class="dcc-cc-card"><div class="dcc-cc-comment-head"><div class="dcc-cc-comment-title"><span>💬</span> ¿CÓMO TE HAS ENCONTRADO?</div><span class="dcc-cc-comment-hint">Comparte lo que quieras</span></div><textarea id="dccCheckinComment" class="dcc-cc-comment" maxlength="500" placeholder="Escribe aquí tus sensaciones de la semana..." oninput="dccCheckinDraftV3(this.value)">${esc(d.comment||'')}</textarea></section>
      <button id="dccSendCheckinButton" type="button" class="dcc-cc-send" onclick="dccSendCheckinPremiumV3()"><span class="dcc-cc-send-icon">➤</span> Enviar check-in</button>
      ${success[id]?'<div class="dcc-cc-success">✓ Check-in enviado correctamente</div>':''}
      ${sent?`<div class="dcc-cc-sent">Último envío: ${esc(sentLabel(sent))}</div>`:''}
    </div>`;
    if(preserve)requestAnimationFrame(()=>window.scrollTo(0,y));
  }

  window.dccCheckinDraftV3=function(value){const id=activeId();if(id)setDraft(id,{comment:String(value||'')})};
  window.dccCheckinPickV3=function(type,value){
    if(!['diet','training','energy'].includes(type))return;const id=activeId();if(!id)return;const box=document.getElementById('dccCheckinComment');setDraft(id,{[type]:value,comment:box?box.value:draft(id).comment});render(true);
  };

  window.dccSendCheckinPremiumV3=async function(){
    const id=activeId(),c=client(id);if(!id||!c)return;
    const x=latest(id),d=draft(id),box=document.getElementById('dccCheckinComment');if(box)d.comment=box.value.trim();
    const missing=[];if(!d.diet)missing.push('alimentación');if(!d.training)missing.push('entrenamiento');if(!d.energy)missing.push('energía');
    if(missing.length){toastSafe('Completa '+missing.join(', '));return}
    const database=db();if(!database){toastSafe('No hay conexión con el servidor');return}
    const btn=document.getElementById('dccSendCheckinButton');if(btn)btn.disabled=true;
    const now=new Date().toISOString(),weight=num(c.weight),weightText=(weight!=null?money1(weight):String(c.weight||''))+' kg',bodyFat=x.bodyFat??x.body_fat??c.bodyFat??c.body_fat??null;
    try{
      const payload={client_id:id,weight:weightText,diet:d.diet,training:d.training,energy:d.energy,comment:d.comment||'',body_fat:bodyFat!==''&&bodyFat!==null&&bodyFat!==undefined?Number(bodyFat):null,sent_at:now,reviewed:false,updated_at:now};
      const {data:ok,error}=await database.rpc('dcc_submit_checkin',{p_client_id:String(id),p_weight:payload.weight,p_diet:payload.diet,p_training:payload.training,p_energy:payload.energy,p_comment:payload.comment,p_body_fat:payload.body_fat,p_sent_at:payload.sent_at});if(error)throw error;if(ok!==true)throw new Error('El servidor no confirmó el check-in');
      x.weight=weightText;x.diet=d.diet;x.training=d.training;x.energy=d.energy;x.comment=d.comment||'';x.bodyFat=payload.body_fat;x.sentAt=now;x.updatedAt=now;x.reviewed=false;x.status='Nuevo check-in';c.status='Pendiente';save();
      drafts[id]={diet:'',training:'',energy:'',comment:''};
      success[id]=true;
      toastSafe('Check-in enviado correctamente');render(false);
      setTimeout(()=>{if(success[id]){delete success[id];if(document.querySelector('#client-main .dcc-cc'))render(true)}},4500);
    }catch(e){console.error('DCC check-in v3:',e);toastSafe('No se pudo enviar el check-in');if(btn)btn.disabled=false}
  };

  function install(){
    const base=window.showClient;if(typeof base!=='function'||base.__dccCheckinFinalV3)return false;
    const wrapped=function(screen){const r=base.apply(this,arguments);if(screen==='checkin')requestAnimationFrame(()=>render(false));return r};
    wrapped.__dccCheckinFinalV3=true;
    wrapped.__dccClientCheckinMessagesV1=true;
    wrapped.__base=base;
    window.showClient=wrapped;
    return true;
  }

  ensureCss();install();setTimeout(install,350);setTimeout(install,1100);window.addEventListener('load',()=>setTimeout(install,150));
})();
