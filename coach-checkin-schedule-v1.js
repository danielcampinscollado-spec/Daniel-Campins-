/* DCC — Entrenador: programación de check-ins + fotos mensuales privadas */
(function(){
  'use strict';
  const STYLE_ID='dcc-coach-checkin-schedule-v1-css';
  const stateCache=window.__dccCoachCheckinState=window.__dccCoachCheckinState||{};
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function db(){try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient}catch(e){}return window.supabaseClient||null}
  function appData(){try{return data||{}}catch(e){return window.data||{}}}
  function client(id){return (appData().clients||[]).find(c=>String(c.id)===String(id))||null}
  function toastSafe(t){try{if(typeof toast==='function')return toast(t);if(typeof window.toast==='function')return window.toast(t)}catch(e){}}
  function saveLocal(){try{if(typeof saveData==='function')return saveData();if(typeof window.saveData==='function')return window.saveData()}catch(e){}}
  function dateText(v){if(!v)return'Sin programar';const d=new Date(String(v).slice(0,10)+'T12:00:00');return Number.isFinite(d.getTime())?d.toLocaleDateString('es-ES',{day:'numeric',month:'short',year:'numeric'}):'Sin programar'}

  function css(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');s.id=STYLE_ID;s.textContent=`
      #coach-main .dcc-cs-card{border-color:rgba(185,126,22,.28)!important}
      #coach-main .dcc-cs-intro{margin:4px 0 13px;color:#6e7786;font-size:10px;line-height:1.45}
      #coach-main .dcc-cs-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
      #coach-main .dcc-cs-box{padding:12px;border:1px solid rgba(185,126,22,.22);border-radius:14px;background:rgba(255,253,248,.72)}
      #coach-main .dcc-cs-box h3{margin:0 0 4px!important;color:#17191d!important;font-size:12px!important}
      #coach-main .dcc-cs-box p{margin:0 0 10px;color:#747d8b;font-size:9px;line-height:1.4}
      #coach-main .dcc-cs-field{display:grid;gap:5px;margin-top:8px}
      #coach-main .dcc-cs-field label{margin:0!important;color:#626b78;font-size:9px;font-weight:800}
      #coach-main .dcc-cs-field input,#coach-main .dcc-cs-field select{min-height:40px!important;padding:8px 10px!important;border-radius:11px!important;font-size:13px!important}
      #coach-main .dcc-cs-save{width:100%;min-height:44px;margin-top:11px;border:1px solid #cf9326;border-radius:13px;background:linear-gradient(135deg,#f2cb64,#d7a13a);color:#17120a;font-size:11px;font-weight:900}
      #coach-main .dcc-cs-state{display:flex;justify-content:space-between;gap:8px;margin-top:8px;padding-top:8px;border-top:1px solid rgba(100,80,45,.10);color:#7a8391;font-size:8.5px}
      #coach-main .dcc-cs-state b{color:#a66f12}
      #coach-main .dcc-cs-photo-date{margin-top:8px;color:#8b6a30;font-size:9px;font-weight:800}
      #coach-main .dcc-ca-photo-box.has-photo{overflow:hidden;padding:0!important;background:#eee!important}
      #coach-main .dcc-ca-photo-box.has-photo img{width:100%;height:100%;object-fit:cover;display:block}
      @media(max-width:520px){#coach-main .dcc-cs-grid{grid-template-columns:1fr}}
    `;document.head.appendChild(s);
  }

  async function getState(id){
    const d=db();if(!d)return null;
    const {data:st,error}=await d.rpc('dcc_get_checkin_state',{p_client_id:String(id)});if(error)throw error;
    stateCache[id]=st;return st;
  }

  function scheduleHtml(id,st){
    const freq=st?.checkin_frequency||'off',normal=st?.next_checkin_date||'',photo=st?.next_photo_checkin_date||'';
    return `<section id="dccCheckinScheduleCard" class="dcc-ca-card dcc-cs-card">
      <div class="dcc-ca-title"><h2>Programación de check-ins</h2><span style="font-size:9px;color:#8f98a3">Controlada por el entrenador</span></div>
      <p class="dcc-cs-intro">El cliente puede abrir Check-in cuando quiera, pero no podrá rellenar ni enviar nada hasta la fecha programada.</p>
      <div class="dcc-cs-grid">
        <div class="dcc-cs-box">
          <h3>Check-in normal</h3><p>Preguntas, peso, % de grasa y notas. Puede repetirse automáticamente o fijarse manualmente.</p>
          <div class="dcc-cs-field"><label>Frecuencia</label><select id="dccCsFreq">
            <option value="weekly" ${freq==='weekly'?'selected':''}>Semanal · cada 7 días</option>
            <option value="biweekly" ${freq==='biweekly'?'selected':''}>Cada 14 días</option>
            <option value="monthly" ${freq==='monthly'?'selected':''}>Mensual</option>
            <option value="custom" ${freq==='custom'?'selected':''}>Solo esta fecha</option>
            <option value="off" ${freq==='off'?'selected':''}>Desactivado</option>
          </select></div>
          <div class="dcc-cs-field"><label>Próxima revisión</label><input id="dccCsNext" type="date" value="${esc(normal)}"></div>
          <div class="dcc-cs-state"><span>Ahora</span><b>${esc(dateText(normal))}</b></div>
        </div>
        <div class="dcc-cs-box">
          <h3>Check-in completo</h3><p>Incluye todo el check-in normal + 3 fotos: frontal, lateral y espalda. Se repite una vez al mes.</p>
          <div class="dcc-cs-field"><label>Próximo control fotográfico</label><input id="dccCsPhotoNext" type="date" value="${esc(photo)}"></div>
          <div class="dcc-cs-photo-date">Frecuencia fija · 1 vez al mes</div>
          <div class="dcc-cs-state"><span>Ahora</span><b>${esc(dateText(photo))}</b></div>
        </div>
      </div>
      <button class="dcc-cs-save" type="button" onclick="dccSaveCheckinSchedule('${esc(id)}')">Guardar programación</button>
    </section>`;
  }

  async function patchFollowup(id){
    css();
    const root=document.querySelector('#coach-main .dcc-ca-wrap');if(!root)return;
    const firstCard=root.querySelector('.dcc-ca-card');if(!firstCard)return;
    root.querySelector('#dccCheckinScheduleCard')?.remove();
    let st=stateCache[id]||null;
    const holder=document.createElement('div');holder.innerHTML=scheduleHtml(id,st);
    firstCard.parentNode.insertBefore(holder.firstElementChild,firstCard);
    try{
      st=await getState(id);
      const current=document.getElementById('dccCheckinScheduleCard');if(!current)return;
      const replacement=document.createElement('div');replacement.innerHTML=scheduleHtml(id,st);
      current.replaceWith(replacement.firstElementChild);
    }catch(e){console.error('DCC coach check-in state:',e)}
  }

  window.dccSaveCheckinSchedule=async function(id){
    const d=db();if(!d){toastSafe('Sin conexión con el servidor');return}
    const freq=document.getElementById('dccCsFreq')?.value||'off';
    let normal=document.getElementById('dccCsNext')?.value||null;
    const photo=document.getElementById('dccCsPhotoNext')?.value||null;
    if(freq==='off')normal=null;
    if(freq!=='off'&&!normal){toastSafe('Selecciona la fecha de la próxima revisión');return}
    try{
      const {data:ok,error}=await d.rpc('dcc_set_checkin_schedule',{
        p_client_id:String(id),p_checkin_frequency:freq,p_next_checkin_date:normal,p_next_photo_checkin_date:photo
      });
      if(error)throw error;if(ok!==true)throw new Error('No confirmado');
      const c=client(id);if(c){c.checkin_frequency=freq;c.photo_frequency=photo?'monthly':'off';c.next_checkin_date=normal;c.next_photo_checkin_date=photo;c.followup_configured_at=new Date().toISOString();saveLocal()}
      stateCache[id]=null;toastSafe('Programación guardada');await patchFollowup(id);
    }catch(e){console.error('DCC save check-in schedule:',e);toastSafe('No se pudo guardar la programación')}
  };

  async function latestPhotoCheckin(id){
    const d=db();if(!d)return null;
    const {data:row,error}=await d.from('client_checkin_history').select('photos,sent_at,checkin_type').eq('client_id',String(id)).eq('checkin_type','complete').order('sent_at',{ascending:false}).limit(1).maybeSingle();
    if(error)throw error;return row;
  }

  async function signed(path){
    if(!path)return'';
    const d=db();if(!d)return'';
    const {data,error}=await d.storage.from('checkin-photos').createSignedUrl(path,1800);if(error)return'';return data?.signedUrl||'';
  }

  async function patchSummaryPhotos(id){
    css();
    const card=document.querySelector('#coach-main .dcc-ca-evolution');if(!card)return;
    try{
      const row=await latestPhotoCheckin(id),p=row?.photos||{};
      if(!p.front||!p.side||!p.back)return;
      const [front,side,back]=await Promise.all([signed(p.front),signed(p.side),signed(p.back)]);
      if(!front||!side||!back)return;
      card.innerHTML=`<div class="dcc-ca-section-head"><h2>Evolución física</h2></div>
        <div class="dcc-ca-photo-grid">
          <div class="dcc-ca-photo"><div class="dcc-ca-photo-box has-photo"><img src="${esc(front)}" alt="Frontal"></div><b>Frontal</b></div>
          <div class="dcc-ca-photo"><div class="dcc-ca-photo-box has-photo"><img src="${esc(side)}" alt="Lateral"></div><b>Lateral</b></div>
          <div class="dcc-ca-photo"><div class="dcc-ca-photo-box has-photo"><img src="${esc(back)}" alt="Espalda"></div><b>Espalda</b></div>
        </div>
        <div class="dcc-ca-next-photo"><span>▣</span><span><b>Último check-in completo</b><br>${esc(dateText(row.sent_at))} · fotos privadas</span></div>`;
    }catch(e){console.error('DCC coach photos:',e)}
  }

  function after(id,tab){
    if(tab==='followup')requestAnimationFrame(()=>patchFollowup(id));
    if(tab==='summary'||!tab)requestAnimationFrame(()=>patchSummaryPhotos(id));
  }

  function wrap(name,defaultTab){
    const base=window[name];if(typeof base!=='function'||base.__dccCoachCheckinScheduleV1)return false;
    const fn=function(id,tab){
      const r=base.apply(this,arguments);
      after(String(id),tab||defaultTab);
      return r;
    };
    Object.keys(base).forEach(k=>{try{fn[k]=base[k]}catch(_){}});
    fn.__dccCoachCheckinScheduleV1=true;fn.__base=base;window[name]=fn;return true;
  }

  function install(){
    wrap('dccOpenClientTab',null);
    wrap('dccClientAdmin','summary');
    wrap('openClient','summary');
    wrap('showClientAdmin','summary');
  }

  css();install();
})();
