/* DCC — Cliente Check-in v4: Light Premium, calendario y check-in completo mensual */
(function(){
  'use strict';

  const STYLE_ID='dcc-client-checkin-v4-css';
  const drafts=window.__dccCheckinV4Drafts=window.__dccCheckinV4Drafts||{};
  const stateCache=window.__dccCheckinV4State=window.__dccCheckinV4State||{};
  const success=window.__dccCheckinV4Success=window.__dccCheckinV4Success||{};

  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function appData(){try{return data||{}}catch(e){return window.data||{}}}
  function activeId(){try{return currentClientId||null}catch(e){return window.currentClientId||null}}
  function clientById(id){return (appData().clients||[]).find(c=>String(c.id)===String(id))||null}
  function database(){try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient}catch(e){}return window.supabaseClient||null}
  function saveLocal(){try{if(typeof saveData==='function')return saveData();if(typeof window.saveData==='function')return window.saveData()}catch(e){}}
  function toastSafe(t){try{if(typeof toast==='function')return toast(t);if(typeof window.toast==='function')return window.toast(t)}catch(e){}console.log(t)}
  function num(v){const n=parseFloat(String(v??'').replace(',','.'));return Number.isFinite(n)?n:null}
  function fmt(v){const n=Number(v);return Number.isFinite(n)?n.toLocaleString('es-ES',{minimumFractionDigits:1,maximumFractionDigits:1}):'—'}
  function dateObj(v){if(!v)return null;const d=new Date(String(v).slice(0,10)+'T12:00:00');return Number.isFinite(d.getTime())?d:null}
  function dateLong(v){const d=dateObj(v);return d?d.toLocaleDateString('es-ES',{weekday:'long',day:'numeric',month:'short'}).replace(/^./,m=>m.toUpperCase()):'Sin programar'}
  function dateShort(v){const d=dateObj(v);return d?d.toLocaleDateString('es-ES',{day:'numeric',month:'short'}):'Sin programar'}
  function dayDiff(from,to){const a=dateObj(from),b=dateObj(to);if(!a||!b)return null;return Math.round((b-a)/86400000)}

  function draft(id){
    if(!drafts[id])drafts[id]={weight:'',bodyFat:'',diet:'',training:'',energy:'',comment:'',files:{front:null,side:null,back:null},previews:{front:'',side:'',back:''}};
    return drafts[id];
  }
  function clearDraft(id){
    const d=drafts[id];
    if(d?.previews)Object.values(d.previews).forEach(u=>{try{if(u)URL.revokeObjectURL(u)}catch(_){}});
    drafts[id]={weight:'',bodyFat:'',diet:'',training:'',energy:'',comment:'',files:{front:null,side:null,back:null},previews:{front:'',side:'',back:''}};
  }

  function latestBodyFat(id,c){
    const x=appData().checkins?.[id]||{};
    return num(x.bodyFat??x.body_fat??c?.bodyFat??c?.body_fat);
  }

  function injectCss(){
    document.getElementById(STYLE_ID)?.remove();
    const s=document.createElement('style');s.id=STYLE_ID;s.textContent=`
      html.dcc-theme-light-premium #client-main.dcc-checkin-v4,
      #client-main.dcc-checkin-v4{
        min-height:100dvh!important;padding:0 14px 112px!important;
        background:radial-gradient(circle at 88% 0%,rgba(208,153,48,.11),transparent 25%),linear-gradient(180deg,#fffaf1 0%,#f7f0e4 58%,#f2e9db 100%)!important;
        color:#17191d!important;
      }
      .dcc-ci4{max-width:820px;margin:0 auto}.dcc-ci4 *{box-sizing:border-box}
      .dcc-ci4-head{margin:0 0 12px}.dcc-ci4-kicker{display:block;margin:0 0 8px;color:#a66d0d;font-size:11px;line-height:1;font-weight:850;letter-spacing:3.2px;text-transform:uppercase}
      .dcc-ci4-head h1{margin:0 0 7px!important;color:#17191d!important;font-family:inherit!important;font-size:30px!important;line-height:1.02!important;font-weight:850!important;letter-spacing:-1px!important}
      .dcc-ci4-sub{margin:0;color:#707782;font-size:13px;line-height:1.35;font-weight:500}
      .dcc-ci4-status{display:grid;gap:9px;margin-bottom:13px}
      .dcc-ci4-status-card{display:grid;grid-template-columns:46px minmax(0,1fr) auto;align-items:center;gap:12px;padding:13px 14px;border:1px solid rgba(190,132,28,.25);border-radius:21px;background:linear-gradient(145deg,#fffefa 0%,#fbf5eb 100%);box-shadow:0 10px 26px rgba(78,58,28,.07)}
      .dcc-ci4-status-card.primary{border-color:rgba(200,140,28,.38);background:linear-gradient(145deg,#fffdf9,#fff6e7)}
      .dcc-ci4-cal{width:46px;height:46px;display:grid;place-items:center;border-radius:50%;background:#fff0d4;color:#a86f0b}
      .dcc-ci4-cal svg{width:24px;height:24px;fill:none;stroke:currentColor;stroke-width:1.8}
      .dcc-ci4-status-label{color:#9b6814;font-size:9.5px;font-weight:900;letter-spacing:1.7px;text-transform:uppercase}
      .dcc-ci4-status-card:not(.primary) .dcc-ci4-status-label{color:#737d8e}
      .dcc-ci4-status-main{margin-top:2px;color:#101828;font-size:19px;font-weight:900;letter-spacing:-.5px}
      .dcc-ci4-status-copy{margin-top:2px;color:#697386;font-size:10.5px;line-height:1.35}
      .dcc-ci4-badge{align-self:start;display:inline-flex;align-items:center;gap:6px;padding:7px 10px;border-radius:999px;background:#fff0d4;color:#9d680e;font-size:9.5px;font-weight:850;white-space:nowrap}
      .dcc-ci4-badge.available{background:#fff1c9;color:#916000}
      .dcc-ci4-info{display:flex;align-items:flex-start;gap:8px;margin:1px 1px 13px;padding:0 2px;color:#727c8e;font-size:10.5px;line-height:1.45}
      .dcc-ci4-info svg{width:17px;height:17px;flex:none;margin-top:1px;fill:none;stroke:#8b95a5;stroke-width:1.8}
      .dcc-ci4-card{margin:0 0 10px;padding:14px;border:1px solid rgba(183,123,19,.24);border-radius:21px;background:linear-gradient(145deg,#fffefa 0%,#fbf5eb 100%);box-shadow:0 10px 26px rgba(78,58,28,.07),inset 0 1px 0 rgba(255,255,255,.95)}
      .dcc-ci4-card-title{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:11px;color:#a66d0d;font-size:10px;font-weight:850;letter-spacing:2.4px;text-transform:uppercase}
      .dcc-ci4-card-title small{color:#80899a;font-size:8px;font-weight:650;letter-spacing:0;text-transform:none}
      .dcc-ci4-metric-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:0}
      .dcc-ci4-metric{padding:2px 12px;min-width:0;border-right:1px solid #e6e1d8}.dcc-ci4-metric:last-child{border-right:0}
      .dcc-ci4-metric:first-child{padding-left:0}.dcc-ci4-metric:last-child{padding-right:0}
      .dcc-ci4-metric label{display:block;margin:0 0 5px!important;color:#697386!important;font-size:10px!important;font-weight:650!important}
      .dcc-ci4-value{color:#1b2230;font-size:20px;font-weight:850;letter-spacing:-.5px}
      .dcc-ci4-date{margin-top:2px;color:#98a0ad;font-size:8.5px}
      html.dcc-theme-light-premium #client-main.dcc-checkin-v4 .dcc-ci4-input,
      #client-main.dcc-checkin-v4 .dcc-ci4-input{
        min-height:42px!important;padding:9px 11px!important;border:1px solid #d8d6d0!important;border-radius:12px!important;background:#fffdfa!important;color:#17191d!important;font-size:16px!important;box-shadow:none!important
      }
      #client-main.dcc-checkin-v4 .dcc-ci4-input:disabled{background:#f1f2f4!important;color:#a3a9b3!important;-webkit-text-fill-color:#a3a9b3!important}
      .dcc-ci4-change{display:flex;align-items:center;justify-content:center;height:42px;color:#697386;font-size:19px;font-weight:800}
      .dcc-ci4-week{display:grid;gap:8px}.dcc-ci4-row{display:grid;grid-template-columns:125px minmax(0,1fr);align-items:center;gap:10px;padding:2px 0}
      .dcc-ci4-row-name{color:#485162;font-size:11px;font-weight:760}
      .dcc-ci4-options{display:grid;grid-template-columns:repeat(3,1fr);gap:4px;padding:3px;border:1px solid #ddd9d1;border-radius:999px;background:#faf8f4}
      .dcc-ci4-option{min-height:35px;border:1px solid transparent;border-radius:999px;background:transparent;color:#7a8392;font-size:10px;font-weight:650}
      .dcc-ci4-option.active{border-color:#d5a03b;background:linear-gradient(145deg,#fff2bf,#f2c65b);color:#2a200e;font-weight:900;box-shadow:0 4px 12px rgba(184,123,19,.12)}
      .dcc-ci4-option:disabled{opacity:.45;cursor:default}.dcc-ci4-options.locked{background:#f1f2f4;border-color:#e1e3e7}
      html.dcc-theme-light-premium #client-main.dcc-checkin-v4 .dcc-ci4-note,
      #client-main.dcc-checkin-v4 .dcc-ci4-note{
        width:100%;min-height:94px!important;resize:vertical;padding:11px 12px!important;border:1px solid #d8d6d0!important;border-radius:13px!important;background:#fffdfa!important;color:#17191d!important;font-size:16px!important;box-shadow:none!important
      }
      #client-main.dcc-checkin-v4 .dcc-ci4-note:disabled{background:#f1f2f4!important;color:#a3a9b3!important;-webkit-text-fill-color:#a3a9b3!important}
      .dcc-ci4-photo-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.dcc-ci4-photo{position:relative;overflow:hidden;aspect-ratio:4/5;border:1px solid #ddd8cd;border-radius:14px;background:linear-gradient(145deg,#faf7ef,#f0ece4)}
      .dcc-ci4-photo button{position:absolute;inset:0;width:100%;height:100%;border:0;background:transparent;padding:0;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;color:#586173}
      .dcc-ci4-photo-figure{position:absolute;inset:11px 12px 31px;display:grid;place-items:center;color:#b8b5ae}
      .dcc-ci4-photo-figure svg{width:65%;height:88%;fill:currentColor}
      .dcc-ci4-photo.side .dcc-ci4-photo-figure svg{width:38%}
      .dcc-ci4-photo img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
      .dcc-ci4-plus{position:absolute;right:8px;top:8px;width:32px;height:32px;display:grid;place-items:center;border-radius:50%;background:linear-gradient(145deg,#dda52f,#bb7d13);color:#fff;font-size:22px;line-height:1;box-shadow:0 5px 14px rgba(159,104,13,.22)}
      .dcc-ci4-photo-label{position:relative;z-index:2;width:100%;padding:7px 4px;background:linear-gradient(180deg,transparent,rgba(255,253,248,.94) 35%);color:#303744;font-size:10px;font-weight:800;text-align:center}
      .dcc-ci4-photo-help{margin-top:9px;color:#788293;font-size:9px;line-height:1.4}
      .dcc-ci4-submit{width:100%;min-height:52px;margin-top:2px;border:1px solid #c88b1f;border-radius:17px;background:linear-gradient(135deg,#f1ca62,#d39a2e 72%,#c18013);color:#17120a;font-size:14px;font-weight:900;box-shadow:0 10px 22px rgba(169,109,18,.16)}
      .dcc-ci4-submit:disabled{border-color:#d8d9dc;background:#e3e4e7;color:#858c99;box-shadow:none}
      .dcc-ci4-success{margin:0 0 10px;padding:10px 12px;border:1px solid rgba(42,151,99,.25);border-radius:13px;background:#edf8f1;color:#24774f;font-size:10px;font-weight:850;text-align:center}
      .dcc-ci4-loading{padding:40px 18px;text-align:center;color:#747e8d;font-size:12px}
      .dcc-ci4-lock-note{display:flex;align-items:center;justify-content:center;gap:7px;margin-top:2px;padding:14px;border:1px solid #d8d9dd;border-radius:16px;background:#e8e9ec;color:#858d9b;font-size:12px;font-weight:850}
      @media(max-width:430px){
        #client-main.dcc-checkin-v4{padding-left:12px!important;padding-right:12px!important}
        .dcc-ci4-head h1{font-size:30px!important}.dcc-ci4-sub{font-size:13px}
        .dcc-ci4-status-card{grid-template-columns:42px minmax(0,1fr) auto;padding:12px 11px;gap:9px}.dcc-ci4-cal{width:42px;height:42px}
        .dcc-ci4-status-main{font-size:17px}.dcc-ci4-badge{padding:6px 8px;font-size:8.5px}
        .dcc-ci4-card{padding:12px}.dcc-ci4-metric{padding:2px 8px}.dcc-ci4-value{font-size:18px}
        .dcc-ci4-row{grid-template-columns:103px minmax(0,1fr);gap:7px}.dcc-ci4-row-name{font-size:9.5px}.dcc-ci4-option{min-height:33px;font-size:8.5px}
        .dcc-ci4-photo-grid{gap:6px}.dcc-ci4-photo{border-radius:12px}.dcc-ci4-plus{width:29px;height:29px;font-size:20px}
      }
      @media(max-width:360px){
        .dcc-ci4-status-card{grid-template-columns:38px minmax(0,1fr);}.dcc-ci4-badge{grid-column:2;justify-self:start}.dcc-ci4-cal{width:38px;height:38px}
        .dcc-ci4-row{grid-template-columns:1fr}.dcc-ci4-options{width:100%}
      }
    `;document.head.appendChild(s);
  }

  const calendarSvg='<svg viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 9h16"/></svg>';
  const infoSvg='<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 10v6M12 7h.01"/></svg>';
  const personSvg='<svg viewBox="0 0 70 160" aria-hidden="true"><circle cx="35" cy="15" r="12"/><path d="M24 32c5-5 17-5 22 0l7 34-9 31 6 52H38l-3-48-3 48H20l6-52-9-31 7-34Z"/></svg>';

  function statusCards(st){
    const locked=!st||st.locked;
    if(!st)return '<div class="dcc-ci4-loading">Cargando tu próxima revisión…</div>';
    if(locked){
      const normal=st.next_checkin_date||null,photo=st.next_photo_checkin_date||null;
      const nd=dateObj(normal),pd=dateObj(photo),photoFirst=!!photo&&(!normal||(pd&&nd&&pd<=nd));
      if(photoFirst){
        const sameDay=normal&&photo&&String(normal).slice(0,10)===String(photo).slice(0,10);
        return `<div class="dcc-ci4-status">
          <section class="dcc-ci4-status-card primary"><div class="dcc-ci4-cal">${calendarSvg}</div><div><div class="dcc-ci4-status-label">Próximo check-in completo</div><div class="dcc-ci4-status-main">${esc(dateLong(photo))}</div><div class="dcc-ci4-status-copy">Ese día se habilitarán preguntas, peso y las 3 fotos de progreso.</div></div><span class="dcc-ci4-badge">▣ Bloqueado</span></section>
          <section class="dcc-ci4-status-card"><div class="dcc-ci4-cal">${calendarSvg}</div><div><div class="dcc-ci4-status-label">Siguiente revisión</div><div class="dcc-ci4-status-main">${sameDay?'Incluida ese día':esc(dateShort(normal))}</div><div class="dcc-ci4-status-copy">${sameDay?'El check-in completo sustituirá a la revisión normal.':normal?'Tu check-in normal se abrirá en esa fecha.':'Pendiente de programación por tu entrenador.'}</div></div></section>
        </div>`;
      }
      return `<div class="dcc-ci4-status">
        <section class="dcc-ci4-status-card primary"><div class="dcc-ci4-cal">${calendarSvg}</div><div><div class="dcc-ci4-status-label">Próxima revisión</div><div class="dcc-ci4-status-main">${esc(dateLong(normal))}</div><div class="dcc-ci4-status-copy">${normal?'Tu check-in de seguimiento se habilitará ese día.':'Tu entrenador todavía no ha programado la próxima revisión.'}</div></div><span class="dcc-ci4-badge">▣ Bloqueado</span></section>
        <section class="dcc-ci4-status-card"><div class="dcc-ci4-cal">${calendarSvg}</div><div><div class="dcc-ci4-status-label">Próximo check-in completo</div><div class="dcc-ci4-status-main">${esc(dateShort(photo))}</div><div class="dcc-ci4-status-copy">${photo?'Incluirá peso, preguntas y 3 fotos de progreso.':'Pendiente de programación por tu entrenador.'}</div></div></section>
      </div>`;
    }
    const complete=st.due_type==='complete';
    let secondary='';
    if(complete&&st.normal_due){
      secondary=`<section class="dcc-ci4-status-card"><div class="dcc-ci4-cal">${calendarSvg}</div><div><div class="dcc-ci4-status-label">Revisión de seguimiento</div><div class="dcc-ci4-status-main">Incluida hoy</div><div class="dcc-ci4-status-copy">El check-in completo sustituye a la revisión habitual.</div></div></section>`;
    }else{
      secondary=`<section class="dcc-ci4-status-card"><div class="dcc-ci4-cal">${calendarSvg}</div><div><div class="dcc-ci4-status-label">${complete?'Siguiente revisión':'Próximo check-in completo'}</div><div class="dcc-ci4-status-main">${esc(dateShort(complete?st.next_checkin_date:st.next_photo_checkin_date))}</div><div class="dcc-ci4-status-copy">${complete?'Tu próximo check-in normal se abrirá en esa fecha.':'Ese día se solicitarán también las 3 fotos.'}</div></div></section>`;
    }
    return `<div class="dcc-ci4-status">
      <section class="dcc-ci4-status-card primary"><div class="dcc-ci4-cal">${calendarSvg}</div><div><div class="dcc-ci4-status-label">${complete?'Check-in completo':'Check-in de seguimiento'}</div><div class="dcc-ci4-status-main">Disponible hoy</div><div class="dcc-ci4-status-copy">${complete?'Incluye peso, preguntas y 3 fotos de progreso.':'Completa tu revisión habitual y envíala a tu entrenador.'}</div></div><span class="dcc-ci4-badge available">✓ Disponible</span></section>
      ${secondary}
    </div>`;
  }

  function option(id,type,value,label,current,locked){
    const active=String(current||'')===value;
    return `<button type="button" class="dcc-ci4-option ${active?'active':''}" ${locked?'disabled':''} onclick="dccCheckinV4Pick('${type}','${esc(value)}')">${esc(label)}</button>`;
  }

  function photoBox(key,label,side,d,locked){
    const p=d.previews[key];
    return `<div class="dcc-ci4-photo ${side?'side':''}">
      <input id="dccCi4File-${key}" type="file" accept="image/*" hidden ${locked?'disabled':''} onchange="dccCheckinV4Photo('${key}',this.files&&this.files[0])">
      <button type="button" ${locked?'disabled':''} onclick="document.getElementById('dccCi4File-${key}').click()">
        ${p?`<img src="${esc(p)}" alt="${esc(label)}">`:`<div class="dcc-ci4-photo-figure">${personSvg}</div>`}
        <span class="dcc-ci4-plus">+</span><span class="dcc-ci4-photo-label">${esc(label)}</span>
      </button>
    </div>`;
  }

  function render(preserve=false){
    injectCss();
    const main=document.getElementById('client-main'),id=activeId(),c=clientById(id);if(!main||!id||!c)return;
    const y=window.scrollY,st=stateCache[id]||null,d=draft(id),locked=!st||!!st.locked,complete=st?.due_type==='complete';
    const prevWeight=num(c.weight),prevFat=latestBodyFat(id,c);
    const nextDueDate=st?.next_photo_checkin_date&&(!st?.next_checkin_date||dateObj(st.next_photo_checkin_date)<=dateObj(st.next_checkin_date))?st.next_photo_checkin_date:st?.next_checkin_date;
    const days=st?.today&&nextDueDate?dayDiff(st.today,nextDueDate):null;
    main.className='dcc-checkin-v4';
    main.innerHTML=`<div class="dcc-ci4">
      <header class="dcc-ci4-head"><div class="dcc-ci4-kicker">CHECK-IN</div><p class="dcc-ci4-sub">${locked?'Consulta tu próxima revisión y complétala cuando se active.':complete?'Tu revisión completa ya está disponible.':'Tu revisión de seguimiento ya está disponible.'}</p></header>
      ${success[id]?'<div class="dcc-ci4-success">✓ Check-in enviado correctamente. Ya puedes ver tu próxima fecha.</div>':''}
      ${statusCards(st)}
      <div class="dcc-ci4-info">${infoSvg}<span>${locked?(st?.next_checkin_date&&days!=null&&days>0?`Puedes consultar esta pantalla cuando quieras. El formulario se desbloqueará en ${days} día${days===1?'':'s'}.`:'Puedes consultar esta pantalla cuando quieras, pero solo podrás enviarla cuando llegue la fecha programada por tu entrenador.'):'Completa todos los apartados antes de enviar. Una vez enviado, quedará cerrado hasta la siguiente revisión.'}</span></div>

      <section class="dcc-ci4-card">
        <div class="dcc-ci4-card-title"><span>Tu peso</span><small>${locked?'Bloqueado hasta la revisión':'Registro actual'}</small></div>
        <div class="dcc-ci4-metric-grid">
          <div class="dcc-ci4-metric"><label>Peso anterior</label><div class="dcc-ci4-value">${prevWeight!=null?fmt(prevWeight)+' kg':'—'}</div></div>
          <div class="dcc-ci4-metric"><label>Peso actual</label><input class="dcc-ci4-input" inputmode="decimal" placeholder="${locked?'Bloqueado':'kg'}" value="${esc(d.weight)}" ${locked?'disabled':''} oninput="dccCheckinV4Field('weight',this.value)"></div>
          <div class="dcc-ci4-metric"><label>Cambio total</label><div class="dcc-ci4-change">— — —</div></div>
        </div>
      </section>

      <section class="dcc-ci4-card">
        <div class="dcc-ci4-card-title"><span>Tu % de grasa</span><small>Opcional</small></div>
        <div class="dcc-ci4-metric-grid">
          <div class="dcc-ci4-metric"><label>% anterior</label><div class="dcc-ci4-value">${prevFat!=null?fmt(prevFat)+' %':'—'}</div></div>
          <div class="dcc-ci4-metric"><label>% actual</label><input class="dcc-ci4-input" inputmode="decimal" placeholder="${locked?'Bloqueado':'%'}" value="${esc(d.bodyFat)}" ${locked?'disabled':''} oninput="dccCheckinV4Field('bodyFat',this.value)"></div>
          <div class="dcc-ci4-metric"><label>Cambio total</label><div class="dcc-ci4-change">— — —</div></div>
        </div>
      </section>

      <section class="dcc-ci4-card">
        <div class="dcc-ci4-card-title"><span>Preguntas de la semana</span><small>${locked?'Se activarán en la fecha':'Selecciona una opción'}</small></div>
        <div class="dcc-ci4-week">
          <div class="dcc-ci4-row"><div class="dcc-ci4-row-name">Alimentación</div><div class="dcc-ci4-options ${locked?'locked':''}">${option(id,'diet','Mal','Mal',d.diet,locked)}${option(id,'diet','Normal','Normal',d.diet,locked)}${option(id,'diet','Bien','Bien',d.diet,locked)}</div></div>
          <div class="dcc-ci4-row"><div class="dcc-ci4-row-name">Entrenamiento</div><div class="dcc-ci4-options ${locked?'locked':''}">${option(id,'training','Mal','Mal',d.training,locked)}${option(id,'training','Normal','Normal',d.training,locked)}${option(id,'training','Bien','Bien',d.training,locked)}</div></div>
          <div class="dcc-ci4-row"><div class="dcc-ci4-row-name">Energía</div><div class="dcc-ci4-options ${locked?'locked':''}">${option(id,'energy','Baja','Baja',d.energy,locked)}${option(id,'energy','Normal','Normal',d.energy,locked)}${option(id,'energy','Alta','Alta',d.energy,locked)}</div></div>
        </div>
      </section>

      ${complete?`<section class="dcc-ci4-card">
        <div class="dcc-ci4-card-title"><span>Tus fotos de progreso</span><small>Solo en el check-in completo mensual</small></div>
        <div class="dcc-ci4-photo-grid">${photoBox('front','Frontal',false,d,locked)}${photoBox('side','Lateral',true,d,locked)}${photoBox('back','Espalda',false,d,locked)}</div>
        <div class="dcc-ci4-photo-help">Sube las 3 fotos con una luz, postura y ropa similares para comparar mejor tu evolución. Las fotos se guardan de forma privada.</div>
      </section>`:''}

      <section class="dcc-ci4-card">
        <div class="dcc-ci4-card-title"><span>Notas (opcional)</span><small>Máx. 300 caracteres</small></div>
        <textarea class="dcc-ci4-note" maxlength="300" placeholder="${locked?'Se activará en la fecha de revisión':'¿Cómo te has sentido esta semana?'}" ${locked?'disabled':''} oninput="dccCheckinV4Field('comment',this.value)">${esc(d.comment)}</textarea>
      </section>

      ${locked?'<div class="dcc-ci4-lock-note">▣ Check-in no disponible</div>':`<button id="dccCi4Submit" class="dcc-ci4-submit" type="button" onclick="dccSubmitCheckinV4()">Enviar check-in →</button>`}
    </div>`;
    if(preserve)requestAnimationFrame(()=>window.scrollTo(0,y));
  }

  async function fetchState(id){
    const db=database();if(!db)throw new Error('Sin conexión');
    const {data:st,error}=await db.rpc('dcc_get_checkin_state',{p_client_id:String(id)});
    if(error)throw error;
    stateCache[id]=st||{locked:true,due_type:null,next_checkin_date:null,next_photo_checkin_date:null};
    return stateCache[id];
  }

  async function open(preserve=false){
    const id=activeId();if(!id)return;
    // Avoid the visible two-stage render on entry: when state is not cached,
    // resolve it first and paint the screen once. Cached entries remain instant.
    if(stateCache[id]){render(preserve);return}
    try{await fetchState(id)}catch(e){console.error('DCC check-in state:',e);stateCache[id]=stateCache[id]||{locked:true}}
    if(activeId()===id)render(preserve);
  }

  window.dccCheckinV4Field=function(key,value){
    const id=activeId();if(!id||!['weight','bodyFat','comment'].includes(key))return;draft(id)[key]=String(value??'');
  };
  window.dccCheckinV4Pick=function(type,value){
    const id=activeId();if(!id||!['diet','training','energy'].includes(type))return;draft(id)[type]=value;render(true);
  };
  window.dccCheckinV4Photo=function(key,file){
    const id=activeId();if(!id||!['front','side','back'].includes(key)||!file)return;
    if(file.size>10*1024*1024){toastSafe('Cada foto debe pesar menos de 10 MB');return}
    const d=draft(id);if(d.previews[key]){try{URL.revokeObjectURL(d.previews[key])}catch(_){}}
    d.files[key]=file;d.previews[key]=URL.createObjectURL(file);render(true);
  };

  function extFor(file){
    const name=String(file?.name||'').toLowerCase(),m=name.match(/\.([a-z0-9]{2,5})$/);let ext=m?.[1]||'jpg';
    if(!['jpg','jpeg','png','webp','heic','heif'].includes(ext)){
      const t=String(file?.type||'');ext=t.includes('png')?'png':t.includes('webp')?'webp':t.includes('heic')?'heic':t.includes('heif')?'heif':'jpg';
    }
    return ext;
  }

  async function uploadPhotos(id,d,st){
    const db=database(),paths={};if(!db)throw new Error('Sin conexión');
    for(const key of ['front','side','back']){
      const file=d.files[key];if(!file)throw new Error('Faltan fotos');
      const suffix=Math.random().toString(36).slice(2,8),path=`${id}/${st.today||new Date().toISOString().slice(0,10)}/${key}-${Date.now()}-${suffix}.${extFor(file)}`;
      const {error}=await db.storage.from('checkin-photos').upload(path,file,{upsert:false,contentType:file.type||undefined});
      if(error)throw error;paths[key]=path;
    }
    return paths;
  }

  window.dccSubmitCheckinV4=async function(){
    const id=activeId(),c=clientById(id),st=stateCache[id],d=draft(id),db=database();if(!id||!c||!st||!db)return;
    if(st.locked||!st.due_type){toastSafe('Este check-in todavía está bloqueado');return}
    const weight=num(d.weight),fat=d.bodyFat.trim()===''?null:num(d.bodyFat);
    if(weight==null||weight<=0||weight>500){toastSafe('Introduce un peso válido');return}
    if(d.bodyFat.trim()!==''&&(fat==null||fat<=0||fat>=70)){toastSafe('Introduce un % de grasa válido');return}
    const missing=[];if(!d.diet)missing.push('alimentación');if(!d.training)missing.push('entrenamiento');if(!d.energy)missing.push('energía');
    if(missing.length){toastSafe('Completa '+missing.join(', '));return}
    const complete=st.due_type==='complete';
    if(complete&&['front','side','back'].some(k=>!d.files[k])){toastSafe('Añade las 3 fotos: frontal, lateral y espalda');return}
    const btn=document.getElementById('dccCi4Submit');if(btn){btn.disabled=true;btn.textContent=complete?'Subiendo fotos…':'Enviando…'}
    let paths={};
    try{
      if(complete){paths=await uploadPhotos(id,d,st);if(btn)btn.textContent='Enviando check-in…'}
      const now=new Date().toISOString();
      const {data:ok,error}=await db.rpc('dcc_submit_checkin_v2',{
        p_client_id:String(id),p_weight:weight,p_diet:d.diet,p_training:d.training,p_energy:d.energy,p_comment:d.comment.trim(),
        p_body_fat:fat,p_sent_at:now,p_checkin_type:complete?'complete':'normal',p_photos:paths
      });
      if(error)throw error;if(ok!==true)throw new Error('El servidor no confirmó el check-in');
      c.weight=weight;
      const ad=appData();ad.checkins=ad.checkins||{};ad.checkins[id]={...(ad.checkins[id]||{}),weight:fmt(weight)+' kg',bodyFat:fat??ad.checkins[id]?.bodyFat,diet:d.diet,training:d.training,energy:d.energy,comment:d.comment.trim(),sentAt:now,reviewed:false,checkinType:complete?'complete':'normal',photos:paths};
      saveLocal();clearDraft(id);success[id]=true;
      await fetchState(id);
      toastSafe('Check-in enviado correctamente');render(false);
      if(typeof window.loadWeightsFromSupabase==='function')Promise.resolve(window.loadWeightsFromSupabase()).catch(()=>{});
      if(typeof window.loadCheckinsFromSupabase==='function')Promise.resolve(window.loadCheckinsFromSupabase()).catch(()=>{});
      setTimeout(()=>{if(success[id]){delete success[id];if(activeId()===id&&document.querySelector('#client-main.dcc-checkin-v4'))render(true)}},4500);
    }catch(e){
      console.error('DCC submit check-in v4:',e);
      if(Object.keys(paths).length){try{await db.storage.from('checkin-photos').remove(Object.values(paths))}catch(_){}}
      const msg=String(e?.message||'');
      if(/not available|bloqueado|available yet/i.test(msg))toastSafe('La fecha de este check-in todavía no está disponible');
      else toastSafe('No se pudo enviar el check-in');
      try{await fetchState(id)}catch(_){}
      render(true);
    }
  };

  // Autoridad directa de Check-in. showClient delega aquí antes de pintar
  // el render legacy, evitando el flash/cambio visual al entrar.
  window.dccOpenCheckinV4=function(preserve=false){return open(!!preserve)};

  injectCss();
})();
