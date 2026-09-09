/* DCC — Cliente: check-in semanal premium + mensajería fiable */
(function(){
  'use strict';

  const GOLD='#e0ad4c';
  const GOLD2='#f0c96b';
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function appData(){
    try{return data||{}}catch(e){return window.data||{}}
  }
  function activeClientId(){
    try{return currentClientId||null}catch(e){return window.currentClientId||null}
  }
  function clientById(id){
    return (appData().clients||[]).find(c=>String(c.id)===String(id))||null;
  }
  function database(){
    try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient}catch(e){}
    return window.supabaseClient||null;
  }
  function persistLocal(){
    try{
      if(typeof saveData==='function')return saveData();
      if(typeof window.saveData==='function')return window.saveData();
    }catch(e){console.error('DCC saveData:',e)}
  }
  function toastSafe(text){
    try{
      if(typeof toast==='function')return toast(text);
      if(typeof window.toast==='function')return window.toast(text);
    }catch(e){}
    console.log(text);
  }
  function kg(v){
    const n=parseFloat(String(v??'').replace(',','.'));
    return Number.isFinite(n)?n:null;
  }
  function comma(v,d=1){
    const n=Number(v);
    return Number.isFinite(n)?n.toFixed(d).replace('.',','):'—';
  }

  function injectCss(){
    let old=document.getElementById('dcc-client-checkin-messages-v1-css');
    if(old)old.remove();
    const s=document.createElement('style');
    s.id='dcc-client-checkin-messages-v1-css';
    s.textContent=`
      /* ================= CHECK-IN CLIENTE ================= */
      #client-main.dcc-client-checkin-v1{background:radial-gradient(circle at 88% 0,rgba(224,173,76,.075),transparent 26%),radial-gradient(circle at 0 75%,rgba(217,170,74,.025),transparent 28%),#06090c!important;color:#f7f5f0!important;padding:13px 14px 118px!important}
      .dcc-cc{max-width:820px;margin:0 auto}.dcc-cc *{box-sizing:border-box}
      .dcc-cc-head{margin:4px 1px 17px}.dcc-cc-kicker{color:${GOLD2};font-size:11px;font-weight:850;letter-spacing:2.7px;text-transform:uppercase}.dcc-cc-sub{margin:9px 0 0;color:#969eaa;font-size:13px;line-height:1.4}
      .dcc-cc-card{margin:0 0 10px;padding:14px;border:1px solid rgba(224,173,76,.72);border-radius:20px;background:radial-gradient(circle at 96% 0,rgba(240,201,107,.09),transparent 32%),linear-gradient(145deg,#11171c,#080c10 72%);box-shadow:0 12px 30px rgba(0,0,0,.23),inset 0 1px 0 rgba(255,255,255,.03)}
      .dcc-cc-card-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:11px}.dcc-cc-card-title{display:flex;align-items:center;gap:9px;color:#e9e9e5;font-size:10px;font-weight:820;letter-spacing:2px;text-transform:uppercase}.dcc-cc-card-icon{color:${GOLD2};font-size:17px}.dcc-cc-hint{color:#7f8994;font-size:9px}
      .dcc-cc-data-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px}.dcc-cc-data{min-width:0;padding:12px;border:1px solid #2a333b;border-radius:16px;background:linear-gradient(145deg,#10151a,#0a0e12);text-align:center}.dcc-cc-data-top{display:flex;align-items:center;gap:9px;text-align:left}.dcc-cc-data-icon{width:38px;height:38px;min-width:38px;display:grid;place-items:center;border:1px solid rgba(224,173,76,.42);border-radius:12px;background:rgba(217,170,74,.055);color:${GOLD2};font-size:18px}.dcc-cc-data-label{color:#98a1ac;font-size:9px;text-transform:uppercase;letter-spacing:1.2px}.dcc-cc-data-value{margin-top:3px;color:#f8f6f1;font-size:22px;font-weight:820;letter-spacing:-.5px}.dcc-cc-update{display:inline-flex;align-items:center;justify-content:center;gap:7px;width:min(210px,100%);min-height:38px;margin:11px auto 0;padding:0 12px;border:1px solid #e4b44a;border-radius:999px;background:radial-gradient(circle at 50% 50%,rgba(217,170,74,.16),rgba(14,13,10,.92));color:${GOLD2};font-size:10px;font-weight:820;box-shadow:inset 0 1px 0 rgba(255,255,255,.025)}
      .dcc-cc-week{display:grid;gap:8px}.dcc-cc-row{display:grid;grid-template-columns:minmax(116px,.75fr) minmax(0,1.5fr);align-items:center;gap:10px}.dcc-cc-row-name{display:flex;align-items:center;gap:8px;color:#f5f3ee;font-size:12px;font-weight:760}.dcc-cc-row-ico{width:25px;color:${GOLD2};font-size:18px;text-align:center}.dcc-cc-options{display:grid;grid-template-columns:repeat(3,1fr);padding:3px;border:1px solid #343d46;border-radius:999px;background:#0b1014}.dcc-cc-option{min-height:35px;border:1px solid transparent;border-radius:999px;background:transparent;color:#a8afb8;font-size:10px}.dcc-cc-option.active{border-color:#e4b44a;background:radial-gradient(circle at 50% 50%,rgba(240,201,107,.26),rgba(44,34,15,.75));color:${GOLD2};font-weight:850;box-shadow:0 0 13px rgba(217,170,74,.13)}
      .dcc-cc-comment-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:9px}.dcc-cc-comment-title{display:flex;align-items:center;gap:8px;color:#e9e9e5;font-size:10px;font-weight:820;letter-spacing:1.8px;text-transform:uppercase}.dcc-cc-comment-hint{color:#7f8994;font-size:9px}.dcc-cc-comment{width:100%;min-height:105px;resize:vertical;border:1px solid #303a43;border-radius:15px;background:#0b1014;color:#f5f3ef;padding:12px;outline:0;font-size:16px;line-height:1.4;-webkit-text-size-adjust:100%}.dcc-cc-comment::placeholder{color:#6f7984}.dcc-cc-comment:focus{border-color:rgba(224,173,76,.75);box-shadow:0 0 0 2px rgba(217,170,74,.08)}
      .dcc-cc-send{width:100%;min-height:53px;margin-top:4px;border:1px solid #f2ce69;border-radius:17px;background:linear-gradient(135deg,#f2cd67,#dca73c 62%,#edc25b);color:#12100b;font-size:15px;font-weight:900;box-shadow:0 10px 25px rgba(217,170,74,.16),inset 0 1px 0 rgba(255,255,255,.28)}.dcc-cc-send:disabled{opacity:.55}.dcc-cc-sent{margin-top:8px;color:#7f8994;font-size:9px;text-align:center}

      /* ================= MENSAJES CLIENTE ================= */
      #client-main.dcc-client-messages-v1{background:radial-gradient(circle at 88% 0,rgba(224,173,76,.07),transparent 25%),#06090c!important;color:#f7f5f0!important;padding:13px 14px 178px!important;min-height:100dvh}
      .dcc-cm{max-width:820px;margin:0 auto}.dcc-cm *{box-sizing:border-box}.dcc-cm-kicker{margin:4px 1px 8px;color:${GOLD2};font-size:11px;font-weight:850;letter-spacing:2.7px;text-transform:uppercase}.dcc-cm-person{display:flex;align-items:center;gap:11px;margin:0 1px 13px;padding:8px 0 13px;border-bottom:1px solid #242d35}.dcc-cm-avatar{width:47px;height:47px;display:grid;place-items:center;border:1px solid rgba(224,173,76,.67);border-radius:50%;background:#0a0e11;color:${GOLD2};font-size:15px;font-weight:850}.dcc-cm-person h1{margin:0;color:#f7f5f0;font-size:22px;letter-spacing:-.55px}.dcc-cm-role{display:flex;align-items:center;gap:6px;margin-top:5px;color:#8f98a3;font-size:9px}.dcc-cm-dot{width:6px;height:6px;border-radius:50%;background:#5bd879;box-shadow:0 0 9px rgba(91,216,121,.36)}
      .dcc-cm-stream{display:flex;flex-direction:column;gap:8px;padding:3px 0 12px}.dcc-cm-day{display:flex;align-items:center;gap:8px;margin:5px 0;color:#747e89;font-size:8.5px}.dcc-cm-day:before,.dcc-cm-day:after{content:'';height:1px;flex:1;background:#242d35}.dcc-cm-row{display:flex;align-items:flex-end;gap:7px}.dcc-cm-row.mine{justify-content:flex-end}.dcc-cm-mini{width:28px;height:28px;display:grid;place-items:center;flex:none;border:1px solid rgba(224,173,76,.55);border-radius:50%;background:#090d10;color:${GOLD2};font-size:8px;font-weight:850}.dcc-cm-bubble{max-width:min(78%,560px);padding:10px 11px;border:1px solid #2a333b;border-radius:15px;background:linear-gradient(145deg,#11171c,#0b1014);color:#f3f1ed;font-size:12px;line-height:1.42;box-shadow:inset 0 1px 0 rgba(255,255,255,.02)}.dcc-cm-row.mine .dcc-cm-bubble{border-color:#b6862e;background:radial-gradient(circle at 100% 0,rgba(217,170,74,.12),transparent 42%),linear-gradient(145deg,#211a0f,#100e0a)}.dcc-cm-time{display:flex;justify-content:flex-end;gap:4px;margin-top:5px;color:#818b96;font-size:7.5px}.dcc-cm-row.mine .dcc-cm-time{color:#b99a57}.dcc-cm-check{color:${GOLD2}}.dcc-cm-empty{padding:28px 15px;border:1px solid rgba(224,173,76,.32);border-radius:17px;background:linear-gradient(145deg,#10151a,#080c0f);color:#8f98a3;text-align:center;font-size:10px}
      .dcc-cm-composer{position:fixed;left:50%;bottom:calc(80px + env(safe-area-inset-bottom));z-index:90;width:min(790px,calc(100vw - 26px));transform:translateX(-50%);display:grid;grid-template-columns:minmax(0,1fr) 45px;gap:8px;padding:9px;border:1px solid rgba(224,173,76,.42);border-radius:18px;background:rgba(10,14,18,.97);box-shadow:0 -10px 30px rgba(0,0,0,.42);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px)}.dcc-cm-input{min-height:44px;max-height:105px;resize:none;border:1px solid #303a43;border-radius:13px;background:#0b1014;color:#f5f3ee;padding:11px 12px;outline:0;font-size:16px!important;line-height:1.35;-webkit-text-size-adjust:100%;touch-action:manipulation}.dcc-cm-input::placeholder{color:#6f7984}.dcc-cm-input:focus{border-color:rgba(224,173,76,.72);box-shadow:none}.dcc-cm-send{width:45px;height:45px;display:grid;place-items:center;border:1px solid #f0c96b;border-radius:50%;background:linear-gradient(135deg,#f3cf69,#d9a73e);color:#0b0905;font-size:19px}.dcc-cm-send:disabled{opacity:.45}

      /* El chat premium del entrenador también mantiene el compositor abajo y evita zoom en iPhone. */
      html body #coach #coach-main.dcc-premium-chat .dcc-chat{padding-bottom:110px!important}
      html body #coach #coach-main.dcc-premium-chat .dcc-chat-composer{position:fixed!important;left:50%!important;right:auto!important;bottom:calc(80px + env(safe-area-inset-bottom))!important;z-index:95!important;width:min(790px,calc(100vw - 26px))!important;transform:translateX(-50%)!important}
      html body #coach #coach-main.dcc-premium-chat .dcc-chat-input{font-size:16px!important;-webkit-text-size-adjust:100%!important}

      @media(max-width:430px){
        #client-main.dcc-client-checkin-v1,#client-main.dcc-client-messages-v1{padding-left:12px!important;padding-right:12px!important}
        .dcc-cc-head{margin-bottom:14px}.dcc-cc-sub{font-size:11.5px}.dcc-cc-card{padding:11px;border-radius:18px}.dcc-cc-card-head{margin-bottom:9px}.dcc-cc-data-grid{gap:7px}.dcc-cc-data{padding:9px 7px}.dcc-cc-data-icon{width:32px;height:32px;min-width:32px;font-size:16px}.dcc-cc-data-label{font-size:7.6px}.dcc-cc-data-value{font-size:18px}.dcc-cc-update{min-height:34px;margin-top:9px;padding:0 8px;font-size:8.8px}.dcc-cc-row{grid-template-columns:105px minmax(0,1fr);gap:7px}.dcc-cc-row-name{font-size:10px}.dcc-cc-row-ico{width:21px;font-size:16px}.dcc-cc-option{min-height:33px;font-size:8.8px}.dcc-cc-comment{min-height:92px}.dcc-cc-send{min-height:50px;font-size:14px}
        .dcc-cm-bubble{max-width:82%;font-size:11.5px}.dcc-cm-composer{width:calc(100vw - 24px)}
      }
      @media(min-width:850px){
        .dcc-cm-composer{left:calc(50% + 120px);width:min(760px,calc(100vw - 300px))}
        html body #coach #coach-main.dcc-premium-chat .dcc-chat-composer{left:calc(50% + 120px)!important;width:min(760px,calc(100vw - 300px))!important}
      }
    `;
    document.head.appendChild(s);
  }

  function ensureCheckin(id){
    const d=appData();
    const c=clientById(id);
    d.checkins=d.checkins||{};
    if(!d.checkins[id]||typeof d.checkins[id]!=='object'){
      d.checkins[id]={weight:c?.weight!=null?comma(c.weight)+' kg':'',bodyFat:'',diet:'',training:'',energy:'',comment:'',reviewed:false};
    }
    const x=d.checkins[id];
    if(x.energy===undefined)x.energy='';
    if(x.comment===undefined)x.comment='';
    return x;
  }

  function option(type,value,label,current){
    return `<button type="button" class="dcc-cc-option ${String(current||'').toLowerCase()===String(value).toLowerCase()?'active':''}" onclick="dccCheckinPick('${type}','${esc(value)}')">${esc(label)}</button>`;
  }

  function renderClientCheckin(preserveScroll=false){
    injectCss();
    const main=document.getElementById('client-main');
    const id=activeClientId();
    const c=clientById(id);
    if(!main||!id||!c)return;
    const y=window.scrollY;
    const x=ensureCheckin(id);
    const weight=kg(c.weight);
    const fat=kg(x.bodyFat??x.body_fat??c.bodyFat??c.body_fat);
    main.className='dcc-client-checkin-v1';
    main.innerHTML=`
      <div class="dcc-cc">
        <header class="dcc-cc-head">
          <div class="dcc-cc-kicker">CHECK-IN SEMANAL</div>
          <p class="dcc-cc-sub">Cuéntale a tu entrenador cómo ha ido tu semana.</p>
        </header>

        <section class="dcc-cc-card">
          <div class="dcc-cc-card-head"><div class="dcc-cc-card-title"><span class="dcc-cc-card-icon">▥</span> DATOS ACTUALES</div><span class="dcc-cc-hint">Mantén tus datos al día</span></div>
          <div class="dcc-cc-data-grid">
            <article class="dcc-cc-data">
              <div class="dcc-cc-data-top"><span class="dcc-cc-data-icon">▣</span><div><div class="dcc-cc-data-label">Peso actual</div><div class="dcc-cc-data-value">${weight!=null?comma(weight)+' kg':'—'}</div></div></div>
              <button type="button" class="dcc-cc-update" onclick="updateClientWeight()"><span>✎</span> Actualizar peso</button>
            </article>
            <article class="dcc-cc-data">
              <div class="dcc-cc-data-top"><span class="dcc-cc-data-icon">%</span><div><div class="dcc-cc-data-label">% de grasa actual</div><div class="dcc-cc-data-value">${fat!=null?comma(fat)+' %':'—'}</div></div></div>
              <button type="button" class="dcc-cc-update" onclick="updateClientBodyFat()"><span>✎</span> Actualizar grasa</button>
            </article>
          </div>
        </section>

        <section class="dcc-cc-card">
          <div class="dcc-cc-card-head"><div class="dcc-cc-card-title"><span class="dcc-cc-card-icon">♥</span> TU SEMANA</div><span class="dcc-cc-hint">Valora cómo ha ido tu semana</span></div>
          <div class="dcc-cc-week">
            <div class="dcc-cc-row"><div class="dcc-cc-row-name"><span class="dcc-cc-row-ico">♨</span>Alimentación</div><div class="dcc-cc-options">${option('diet','Mal','Mal',x.diet)}${option('diet','Normal','Normal',x.diet)}${option('diet','Bien','Bien',x.diet)}</div></div>
            <div class="dcc-cc-row"><div class="dcc-cc-row-name"><span class="dcc-cc-row-ico">↔</span>Entrenamiento</div><div class="dcc-cc-options">${option('training','Mal','Mal',x.training)}${option('training','Normal','Normal',x.training)}${option('training','Bien','Bien',x.training)}</div></div>
            <div class="dcc-cc-row"><div class="dcc-cc-row-name"><span class="dcc-cc-row-ico">ϟ</span>Energía</div><div class="dcc-cc-options">${option('energy','Baja','Baja',x.energy)}${option('energy','Normal','Normal',x.energy)}${option('energy','Alta','Alta',x.energy)}</div></div>
          </div>
        </section>

        <section class="dcc-cc-card">
          <div class="dcc-cc-comment-head"><div class="dcc-cc-comment-title"><span>💬</span> ¿CÓMO TE HAS ENCONTRADO?</div><span class="dcc-cc-comment-hint">Comparte lo que quieras</span></div>
          <textarea id="dccCheckinComment" class="dcc-cc-comment" maxlength="500" placeholder="Escribe aquí tus sensaciones de la semana..." oninput="dccCheckinDraft(this.value)">${esc(x.comment||'')}</textarea>
        </section>

        <button id="dccSendCheckinButton" type="button" class="dcc-cc-send" onclick="dccSendCheckinPremium()">➤ &nbsp; Enviar check-in</button>
        ${x.sentAt?`<div class="dcc-cc-sent">Último envío: ${esc(new Date(x.sentAt).toLocaleDateString('es-ES',{day:'numeric',month:'short'}))}</div>`:''}
      </div>`;

    if(preserveScroll)requestAnimationFrame(()=>window.scrollTo(0,y));
  }

  window.dccCheckinDraft=function(value){
    const id=activeClientId();if(!id)return;ensureCheckin(id).comment=String(value||'');
  };

  window.dccCheckinPick=function(type,value){
    if(!['diet','training','energy'].includes(type))return;
    const id=activeClientId();if(!id)return;
    const x=ensureCheckin(id);
    const box=document.getElementById('dccCheckinComment');if(box)x.comment=box.value;
    x[type]=value;x.reviewed=false;persistLocal();renderClientCheckin(true);
  };

  async function syncCheckinsExtended(){
    const db=database();if(!db)return false;
    try{
      const {data:rows,error}=await db.from('client_checkins').select('client_id,weight,diet,training,energy,comment,reviewed,body_fat,sent_at,updated_at');
      if(error)throw error;
      const d=appData();d.checkins=d.checkins||{};
      (rows||[]).forEach(r=>{
        const prev=d.checkins[r.client_id]||{};
        d.checkins[r.client_id]={...prev,weight:r.weight??prev.weight??'',diet:r.diet??prev.diet??'',training:r.training??prev.training??'',energy:r.energy??prev.energy??'',comment:r.comment??prev.comment??'',reviewed:!!r.reviewed,bodyFat:r.body_fat!=null?Number(r.body_fat):(prev.bodyFat??''),sentAt:r.sent_at??prev.sentAt??null,updatedAt:r.updated_at??prev.updatedAt??null};
        const c=clientById(r.client_id);if(c)c.status=r.reviewed?'Revisado':'Pendiente';
      });
      persistLocal();return true;
    }catch(e){console.error('DCC sync check-ins:',e);return false}
  }

  window.dccSendCheckinPremium=async function(){
    const id=activeClientId();const c=clientById(id);if(!id||!c)return;
    const x=ensureCheckin(id);const box=document.getElementById('dccCheckinComment');if(box)x.comment=box.value.trim();
    const missing=[];
    if(!x.diet||x.diet==='Pendiente')missing.push('alimentación');
    if(!x.training||x.training==='Pendiente')missing.push('entrenamiento');
    if(!x.energy||x.energy==='Pendiente')missing.push('energía');
    if(missing.length){toastSafe('Completa '+missing.join(', '));return}
    const db=database();if(!db){toastSafe('No hay conexión con el servidor');return}
    const btn=document.getElementById('dccSendCheckinButton');if(btn)btn.disabled=true;
    const now=new Date().toISOString();
    x.weight=(kg(c.weight)!=null?comma(c.weight):String(c.weight||''))+' kg';x.reviewed=false;x.status='Nuevo check-in';x.sentAt=now;c.status='Pendiente';
    try{
      const {error}=await db.from('client_checkins').upsert({client_id:id,weight:x.weight,diet:x.diet,training:x.training,energy:x.energy,comment:x.comment||'',body_fat:x.bodyFat!==undefined&&x.bodyFat!==null&&x.bodyFat!==''?Number(x.bodyFat):null,sent_at:now,reviewed:false,updated_at:now},{onConflict:'client_id'});
      if(error)throw error;
      const {error:clientError}=await db.from('clients').update({status:'Pendiente'}).eq('id',id);
      if(clientError)console.warn('DCC estado cliente:',clientError);
      persistLocal();toastSafe('Check-in enviado a tu entrenador');renderClientCheckin(false);
    }catch(e){console.error('DCC envío check-in:',e);toastSafe('No se pudo enviar el check-in');if(btn)btn.disabled=false}
  };

  function msgText(m){return String(Array.isArray(m)?(m[1]??''):(m?.text??m?.message??m?.body??m?.content??'')).trim()}
  function msgSender(m){return String(Array.isArray(m)?(m[0]??''):(m?.sender??m?.from??m?.role??m?.author??''))}
  function msgDate(m){const v=Array.isArray(m)?m[2]:(m?.created_at??m?.createdAt??m?.date??m?.time??m?.timestamp);const d=v?new Date(v):null;return d&&Number.isFinite(d.getTime())?d:null}
  function msgIsCoach(m){return /daniel|coach|trainer|entrenador|admin/i.test(msgSender(m))||(m&&!Array.isArray(m)&&(m.isCoach===true||m.mine===false&&/coach/i.test(String(m.role||''))))}
  function thread(id){const a=appData().messages?.[id];return Array.isArray(a)?a.filter(m=>msgText(m)).slice().sort((x,y)=>(msgDate(x)?.getTime()||0)-(msgDate(y)?.getTime()||0)):[]}
  function timeFmt(d){return d?d.toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'}):''}
  function dayFmt(d){if(!d)return'';const now=new Date();const today=new Date(now.getFullYear(),now.getMonth(),now.getDate()).getTime();const day=new Date(d.getFullYear(),d.getMonth(),d.getDate()).getTime();const dif=Math.round((today-day)/86400000);if(dif===0)return'Hoy';if(dif===1)return'Ayer';return d.toLocaleDateString('es-ES',{day:'numeric',month:'short'})}

  function messageBubble(m){
    const coach=msgIsCoach(m);const d=msgDate(m);
    return `<div class="dcc-cm-row ${coach?'':'mine'}">${coach?'<div class="dcc-cm-mini">DC</div>':''}<div class="dcc-cm-bubble">${esc(msgText(m)).replace(/\n/g,'<br>')}<div class="dcc-cm-time">${esc(timeFmt(d))}${coach?'':'<span class="dcc-cm-check">✓✓</span>'}</div></div></div>`;
  }
  function messagesHtml(id){
    const t=thread(id);if(!t.length)return'<div class="dcc-cm-empty">Todavía no hay mensajes. Puedes escribirle a tu entrenador abajo.</div>';
    let last='';return t.map(m=>{const label=dayFmt(msgDate(m));const sep=label&&label!==last?`<div class="dcc-cm-day"><span>${esc(label)}</span></div>`:'';if(label)last=label;return sep+messageBubble(m)}).join('');
  }
  function refreshClientThread(id){
    const stream=document.getElementById('dccClientMessageStream');if(!stream)return;stream.innerHTML=messagesHtml(id);requestAnimationFrame(()=>window.scrollTo(0,document.documentElement.scrollHeight));
  }

  async function syncMessages(){
    const db=database();if(!db)return false;
    try{
      const {data:rows,error}=await db.from('client_messages').select('client_id,sender,message,created_at').order('created_at',{ascending:true});
      if(error)throw error;
      const d=appData(),next={};(d.clients||[]).forEach(c=>next[c.id]=[]);
      (rows||[]).forEach(r=>{if(!next[r.client_id])next[r.client_id]=[];next[r.client_id].push([r.sender||'',r.message||'',r.created_at||null])});
      d.messages=next;persistLocal();return true;
    }catch(e){console.error('DCC sync mensajes:',e);return false}
  }

  function renderClientMessages(){
    injectCss();const main=document.getElementById('client-main');const id=activeClientId();if(!main||!id)return;
    main.className='dcc-client-messages-v1';
    main.innerHTML=`<div class="dcc-cm"><div class="dcc-cm-kicker">MENSAJES</div><header class="dcc-cm-person"><div class="dcc-cm-avatar">DC</div><div><h1>Daniel</h1><div class="dcc-cm-role"><span class="dcc-cm-dot"></span>Tu entrenador</div></div></header><div class="dcc-cm-stream" id="dccClientMessageStream">${messagesHtml(id)}</div></div><div class="dcc-cm-composer"><textarea id="dccClientMessageInput" class="dcc-cm-input" rows="1" placeholder="Escribe un mensaje..." onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();dccClientSendPremium()}"></textarea><button id="dccClientMessageSend" type="button" class="dcc-cm-send" onclick="dccClientSendPremium()" aria-label="Enviar">➤</button></div>`;
    requestAnimationFrame(()=>window.scrollTo(0,document.documentElement.scrollHeight));
    syncMessages().then(ok=>{if(ok&&window.__dccClientPremiumScreen==='messages'&&String(activeClientId())===String(id))refreshClientThread(id)});
    startMessagePolling();
    try{if(typeof markClientNotificationSeen==='function')markClientNotificationSeen('message',id)}catch(e){}
  }

  window.dccClientSendPremium=async function(){
    const id=activeClientId();const c=clientById(id);const input=document.getElementById('dccClientMessageInput');const text=input?.value.trim();if(!id||!c||!text)return;
    const db=database();if(!db){toastSafe('No hay conexión con el servidor');return}
    const send=document.getElementById('dccClientMessageSend');if(send)send.disabled=true;
    try{
      const {error}=await db.from('client_messages').insert({client_id:id,sender:c.name||'Cliente',message:text});
      if(error)throw error;
      if(input)input.value='';await syncMessages();refreshClientThread(id);toastSafe('Mensaje enviado');
    }catch(e){console.error('DCC mensaje cliente:',e);toastSafe('No se pudo enviar el mensaje')}
    finally{if(send)send.disabled=false}
  };

  async function sendCoachRemote(id){
    const input=document.getElementById('dccChatInput')||document.getElementById('coach-message');const text=input?.value.trim();if(!id||!text)return;
    const db=database();if(!db){toastSafe('No hay conexión con el servidor');return}
    if(input)input.disabled=true;
    try{
      const {error}=await db.from('client_messages').insert({client_id:id,sender:'Daniel',message:text});
      if(error)throw error;
      if(input)input.value='';await syncMessages();toastSafe('Mensaje enviado');
      if(typeof window.dccOpenChat==='function'&&String(window.__dccOpenChat??'')===String(id))window.dccOpenChat(id);
      else if(typeof window.openMessages==='function'&&document.getElementById('modal')?.style.display!=='none')window.openMessages(id);
    }catch(e){console.error('DCC mensaje entrenador:',e);toastSafe('No se pudo enviar el mensaje')}
    finally{if(input)input.disabled=false}
  }

  function installReliableCoachSend(){
    window.dccSendMessage=sendCoachRemote;
    window.sendCoachMessage=sendCoachRemote;
  }

  let pollTimer=null;
  function stopMessagePolling(){if(pollTimer){clearInterval(pollTimer);pollTimer=null}}
  function startMessagePolling(){
    stopMessagePolling();
    pollTimer=setInterval(async()=>{
      if(window.__dccClientPremiumScreen!=='messages'){stopMessagePolling();return}
      const id=activeClientId();if(!id)return;
      const before=JSON.stringify(appData().messages?.[id]||[]);const ok=await syncMessages();const after=JSON.stringify(appData().messages?.[id]||[]);if(ok&&before!==after)refreshClientThread(id);
    },4500);
  }

  function installShowClient(){
    const base=window.showClient;if(typeof base!=='function'||base.__dccClientCheckinMessagesV1)return;
    const wrapped=function(screen){
      window.__dccClientPremiumScreen=screen;
      if(screen!=='messages')stopMessagePolling();
      const r=base.apply(this,arguments);
      if(screen==='checkin')requestAnimationFrame(()=>renderClientCheckin(false));
      if(screen==='messages')requestAnimationFrame(()=>renderClientMessages());
      return r;
    };
    wrapped.__dccClientCheckinMessagesV1=true;wrapped.__base=base;window.showClient=wrapped;
  }

  function installCheckinLoader(){
    try{
      const old=window.loadCheckinsFromSupabase;
      if(typeof old==='function'&&!old.__dccEnergyV1){
        const wrapped=async function(){const r=await old.apply(this,arguments);await syncCheckinsExtended();return r};wrapped.__dccEnergyV1=true;wrapped.__base=old;window.loadCheckinsFromSupabase=wrapped;
      }
    }catch(e){console.error(e)}
  }

  injectCss();installShowClient();installReliableCoachSend();installCheckinLoader();syncCheckinsExtended();
  setTimeout(()=>{installShowClient();installReliableCoachSend();installCheckinLoader()},300);
  setTimeout(()=>{installShowClient();installReliableCoachSend();installCheckinLoader()},1000);
  window.addEventListener('load',()=>setTimeout(()=>{installShowClient();installReliableCoachSend();installCheckinLoader()},120));
})();
