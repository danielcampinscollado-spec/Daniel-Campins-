/* DCC coach calendar v12 — sesiones reales con Supabase */
(function(){
  'use strict';
  if(window.__dccCoachCalendarV12)return;
  window.__dccCoachCalendarV12=true;

  const GOLD='#d9aa4a', GOLD2='#f0c96b', STYLE_ID='dcc-coach-calendar-v12-css';
  const months=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  const weekdays=['L','M','X','J','V','S','D'];
  const cache=window.__dccCalendarSessionsByMonth=window.__dccCalendarSessionsByMonth||{};
  const loading=new Set();

  function appData(){try{return data||{}}catch(e){return window.data||{}}}
  function db(){try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient}catch(e){}return window.supabaseClient||null}
  function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
  function notify(t){try{if(typeof toast==='function')return toast(t)}catch(e){};try{window.toast?.(t)}catch(e){}}
  function dateKey(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
  function monthKey(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`}
  function prettyDate(d){return d.toLocaleDateString('es-ES',{weekday:'long',day:'numeric',month:'long'})}
  function clientName(id){return (appData().clients||[]).find(c=>String(c.id)===String(id))?.name||'Cliente'}
  function timeLabel(v){return String(v||'').slice(0,5)||'—'}

  function selectedDate(){
    if(window.__dccCalendarSelected){const d=new Date(window.__dccCalendarSelected+'T12:00:00');if(Number.isFinite(d.getTime()))return d}
    return new Date();
  }
  function monthDate(){
    if(Number.isFinite(window.__dccCalendarMonthTs))return new Date(window.__dccCalendarMonthTs);
    const d=new Date();d.setDate(1);d.setHours(12,0,0,0);window.__dccCalendarMonthTs=d.getTime();return d;
  }

  function injectCss(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');s.id=STYLE_ID;s.textContent=`
      .dcc-cal-day.has-session:before{content:'';position:absolute;left:50%;top:4px;width:5px;height:5px;border-radius:50%;transform:translateX(-50%);background:${GOLD2};box-shadow:0 0 8px rgba(240,201,107,.55)}
      .dcc-cal-session-list{display:flex;flex-direction:column;gap:9px}
      .dcc-cal-session{display:grid;grid-template-columns:54px minmax(0,1fr) 34px;align-items:start;gap:11px;padding:13px;border:1px solid rgba(217,170,74,.42);border-radius:17px;background:radial-gradient(circle at 96% 4%,rgba(217,170,74,.07),transparent 34%),linear-gradient(145deg,#10151a,#080b0e);box-shadow:inset 0 1px 0 rgba(255,255,255,.025)}
      .dcc-cal-session-time{display:grid;place-items:center;min-height:43px;border:1px solid rgba(240,201,107,.48);border-radius:13px;color:${GOLD2};font-size:12px;font-weight:850;background:rgba(217,170,74,.045)}
      .dcc-cal-session-copy{min-width:0}.dcc-cal-session-copy strong{display:block;color:#f5f3ef;font-size:14px;line-height:1.2}.dcc-cal-session-type{display:block;margin-top:4px;color:${GOLD2};font-size:9px;font-weight:800;letter-spacing:1.3px;text-transform:uppercase}.dcc-cal-session-notes{margin:5px 0 0;color:#8f98a3;font-size:10px;line-height:1.35}
      .dcc-cal-session-delete{width:32px;height:32px;display:grid;place-items:center;border:1px solid rgba(255,255,255,.12);border-radius:10px;background:#0b0f13;color:#8d96a1;font-size:18px}
      #modal.dcc-cal-session-overlay{z-index:9999!important;background:rgba(0,0,0,.78)!important;backdrop-filter:blur(9px);-webkit-backdrop-filter:blur(9px);padding:15px!important}
      #modal.dcc-cal-session-overlay .modal-box{width:min(100%,560px)!important;max-width:560px!important;max-height:calc(100dvh - 120px)!important;overflow:auto!important;padding:21px!important;border:1px solid rgba(240,201,107,.78)!important;border-radius:25px!important;background:radial-gradient(circle at 95% 0,rgba(240,201,107,.10),transparent 28%),linear-gradient(145deg,#11171d,#080b0f)!important;color:#f5f3ef!important;box-shadow:0 28px 80px rgba(0,0,0,.55),0 0 30px rgba(217,170,74,.08)!important}
      #dcc-cal-session-form *{box-sizing:border-box}#dcc-cal-session-form .head{display:grid;grid-template-columns:1fr 44px;gap:12px;align-items:start;margin-bottom:19px}#dcc-cal-session-form h2{margin:0;color:#f7f4ee;font-size:26px;line-height:1.05;letter-spacing:-.6px}#dcc-cal-session-form .sub{margin:7px 0 0;color:#8d96a1;font-size:9px;letter-spacing:1.8px;text-transform:uppercase}#dcc-cal-session-form .close{width:42px;height:42px;border:1px solid rgba(217,170,74,.48);border-radius:13px;background:#0b0f13;color:#f4f2ee;font-size:22px}
      #dcc-cal-session-form label{display:block;margin:0 0 13px;color:#f0efec;font-size:12px;font-weight:750}#dcc-cal-session-form input,#dcc-cal-session-form select,#dcc-cal-session-form textarea{width:100%;margin-top:7px!important;padding:0 13px!important;border:1px solid rgba(159,170,182,.40)!important;border-radius:14px!important;background:#0c1116!important;color:#f6f3ed!important;-webkit-text-fill-color:#f6f3ed!important;outline:0!important;font:600 14px/1.2 inherit!important}#dcc-cal-session-form input,#dcc-cal-session-form select{height:49px}#dcc-cal-session-form textarea{min-height:86px;padding-top:12px!important;resize:vertical}#dcc-cal-session-form input:focus,#dcc-cal-session-form select:focus,#dcc-cal-session-form textarea:focus{border-color:${GOLD2}!important;box-shadow:0 0 0 3px rgba(217,170,74,.09)!important}
      #dcc-cal-session-form .row{display:grid;grid-template-columns:1fr 1fr;gap:10px}#dcc-cal-session-form .save{width:100%;height:54px;margin-top:3px;border:1px solid #f3ce6a;border-radius:16px;background:linear-gradient(135deg,#d9a83d,#f4d679 52%,#dfad42);color:#15110a;font-size:15px;font-weight:900;box-shadow:0 10px 28px rgba(217,170,74,.16)}#dcc-cal-session-form .save:disabled{opacity:.6}

      html.dcc-theme-light-premium #modal.dcc-cal-session-overlay{background:rgba(37,31,20,.28)!important}
      html.dcc-theme-light-premium #modal.dcc-cal-session-overlay .modal-box{background:linear-gradient(145deg,#fffefa,#f8f1e5)!important;color:#17191d!important;border-color:rgba(185,122,17,.42)!important;box-shadow:0 28px 80px rgba(72,52,19,.20)!important}
      html.dcc-theme-light-premium #dcc-cal-session-form h2,html.dcc-theme-light-premium #dcc-cal-session-form label{color:#17191d!important}
      html.dcc-theme-light-premium #dcc-cal-session-form .sub{color:#7a8390!important}
      html.dcc-theme-light-premium #dcc-cal-session-form .close{background:#fffaf1!important;color:#98640b!important;border-color:rgba(185,122,17,.42)!important}
      html.dcc-theme-light-premium #dcc-cal-session-form input,html.dcc-theme-light-premium #dcc-cal-session-form select,html.dcc-theme-light-premium #dcc-cal-session-form textarea{background:#fffefa!important;color:#17191d!important;-webkit-text-fill-color:#17191d!important;border-color:rgba(185,122,17,.30)!important}
      html.dcc-theme-light-premium .dcc-cal-session{background:#fffaf1!important;color:#17191d!important;border-color:rgba(185,122,17,.28)!important}
      html.dcc-theme-light-premium .dcc-cal-session-copy strong{color:#17191d!important}
      html.dcc-theme-light-premium .dcc-cal-session-notes{color:#68717e!important}
      html.dcc-theme-light-premium .dcc-cal-session-delete{background:#fffaf1!important;color:#98640b!important;border-color:rgba(185,122,17,.28)!important}

      html.dcc-theme-light-premium #modal.dcc-cal-session-overlay{background:rgba(37,31,20,.28)!important}
      html.dcc-theme-light-premium #modal.dcc-cal-session-overlay .modal-box{background:linear-gradient(145deg,#fffefa,#f8f1e5)!important;color:#17191d!important;border-color:rgba(185,122,17,.42)!important;box-shadow:0 28px 80px rgba(72,52,19,.20)!important}
      html.dcc-theme-light-premium #dcc-cal-session-form h2,html.dcc-theme-light-premium #dcc-cal-session-form label{color:#17191d!important}
      html.dcc-theme-light-premium #dcc-cal-session-form .sub{color:#7a8390!important}
      html.dcc-theme-light-premium #dcc-cal-session-form .close{background:#fffaf1!important;color:#98640b!important;border-color:rgba(185,122,17,.42)!important}
      html.dcc-theme-light-premium #dcc-cal-session-form input,html.dcc-theme-light-premium #dcc-cal-session-form select,html.dcc-theme-light-premium #dcc-cal-session-form textarea{background:#fffefa!important;color:#17191d!important;-webkit-text-fill-color:#17191d!important;border-color:rgba(185,122,17,.30)!important}
      html.dcc-theme-light-premium .dcc-cal-session{background:#fffaf1!important;color:#17191d!important;border-color:rgba(185,122,17,.28)!important}
      html.dcc-theme-light-premium .dcc-cal-session-copy strong{color:#17191d!important}
      html.dcc-theme-light-premium .dcc-cal-session-notes{color:#68717e!important}
      html.dcc-theme-light-premium .dcc-cal-session-delete{background:#fffaf1!important;color:#98640b!important;border-color:rgba(185,122,17,.28)!important}
      @media(max-width:390px){#modal.dcc-cal-session-overlay{padding:10px!important}#modal.dcc-cal-session-overlay .modal-box{padding:17px!important;max-height:calc(100dvh - 95px)!important}#dcc-cal-session-form h2{font-size:24px}.dcc-cal-session{grid-template-columns:50px minmax(0,1fr) 32px;padding:11px}}
    `;document.head.appendChild(s);
  }

  function sessionsForDate(key){
    const mkey=key.slice(0,7);return (cache[mkey]||[]).filter(x=>x.session_date===key).sort((a,b)=>String(a.session_time).localeCompare(String(b.session_time)));
  }
  function hasSession(key){return sessionsForDate(key).length>0}

  async function loadMonth(month,force){
    const key=monthKey(month);if(!force&&cache[key])return cache[key];if(loading.has(key))return cache[key]||[];
    const database=db();if(!database)return [];
    loading.add(key);
    const first=`${key}-01`;const next=new Date(month.getFullYear(),month.getMonth()+1,1,12);const nextKey=`${next.getFullYear()}-${String(next.getMonth()+1).padStart(2,'0')}-01`;
    try{
      const {data:rows,error}=await database.from('coach_calendar_sessions').select('id,client_id,session_date,session_time,session_type,notes,created_at').gte('session_date',first).lt('session_date',nextKey).order('session_date',{ascending:true}).order('session_time',{ascending:true});
      if(error)throw error;cache[key]=rows||[];
      if(window.currentScreen==='calendar'&&monthKey(monthDate())===key)renderCalendar(false);
      return cache[key];
    }catch(e){console.error('DCC calendario cargando sesiones:',e);notify('No se pudo cargar la agenda');return []}finally{loading.delete(key)}
  }

  function calendarCells(month){
    const y=month.getFullYear(),m=month.getMonth(),first=new Date(y,m,1,12),offset=(first.getDay()+6)%7,start=new Date(y,m,1-offset,12),today=new Date(),sel=selectedDate();let html='';
    for(let i=0;i<42;i++){
      const d=new Date(start);d.setDate(start.getDate()+i);const key=dateKey(d),out=d.getMonth()!==m,isToday=key===dateKey(today),selected=key===dateKey(sel),session=hasSession(key);
      html+=`<button type="button" class="dcc-cal-day${out?' out':''}${isToday?' today':''}${selected?' selected':''}${session?' has-session':''}" onclick="dccCalendarSelect(${d.getFullYear()},${d.getMonth()},${d.getDate()})">${d.getDate()}</button>`;
    }
    return html;
  }

  function agendaHtml(sel){
    const key=dateKey(sel),mkey=key.slice(0,7);if(!cache[mkey])return `<div class="dcc-cal-empty"><span class="dcc-cal-empty-icon">⌛</span><span>Cargando agenda…</span></div>`;
    const rows=sessionsForDate(key);if(!rows.length)return `<div class="dcc-cal-empty"><span class="dcc-cal-empty-icon">▣</span><span>No hay sesiones programadas para este día todavía.</span></div>`;
    return `<div class="dcc-cal-session-list">${rows.map(r=>`<article class="dcc-cal-session"><div class="dcc-cal-session-time">${esc(timeLabel(r.session_time))}</div><div class="dcc-cal-session-copy"><strong>${esc(clientName(r.client_id))}</strong><span class="dcc-cal-session-type">${esc(r.session_type||'Entrenamiento')}</span>${r.notes?`<p class="dcc-cal-session-notes">${esc(r.notes)}</p>`:''}</div><button type="button" class="dcc-cal-session-delete" onclick="dccCalendarDeleteSession('${esc(r.id)}')" aria-label="Eliminar sesión">×</button></article>`).join('')}</div>`;
  }

  function patchNav(){const nav=document.getElementById('coach-nav');if(!nav)return;const buttons=[...nav.querySelectorAll('button')];if(buttons[2]){buttons.forEach(b=>b.classList.remove('active'));buttons[2].classList.add('active');buttons[2].setAttribute('onclick',"showCoach('calendar')")}}

  function renderCalendar(fetch=true){
    injectCss();const main=document.getElementById('coach-main');if(!main)return;main.className='dcc-cal-v11';window.currentScreen='calendar';
    const m=monthDate(),sel=selectedDate(),view=window.__dccCalendarView==='agenda'?'agenda':'month';
    main.innerHTML=`<div class="dcc-cal ${view==='agenda'?'view-agenda':''}"><header class="dcc-cal-head"><div><h1>Calendario</h1><p>Organiza entrenamientos, seguimientos y citas.</p></div><button type="button" class="dcc-cal-new" onclick="dccCalendarNewSession()">＋ Nueva sesión</button></header><div class="dcc-cal-tabs"><button type="button" class="dcc-cal-tab ${view==='month'?'active':''}" onclick="dccCalendarSetView('month')">Mes</button><button type="button" class="dcc-cal-tab ${view==='agenda'?'active':''}" onclick="dccCalendarSetView('agenda')">Agenda</button></div><section class="dcc-cal-card"><div class="dcc-cal-month-head"><button class="dcc-cal-move" onclick="dccCalendarMove(-1)">‹</button><strong>${months[m.getMonth()]} ${m.getFullYear()}</strong><button class="dcc-cal-move" onclick="dccCalendarMove(1)">›</button></div><div class="dcc-cal-week">${weekdays.map(x=>`<span>${x}</span>`).join('')}</div><div class="dcc-cal-grid">${calendarCells(m)}</div></section><section class="dcc-cal-agenda"><div class="dcc-cal-agenda-only">Sesiones programadas para la fecha seleccionada.</div><div class="dcc-cal-agenda-head"><h2>Agenda</h2><div class="dcc-cal-date-label">${prettyDate(sel)}</div></div>${agendaHtml(sel)}</section></div>`;
    patchNav();if(fetch)loadMonth(m,false);
  }

  function closeSessionModal(){document.getElementById('modal')?.classList.remove('dcc-cal-session-overlay');try{if(typeof closeModal==='function')closeModal();else window.closeModal?.()}catch(e){}}

  window.dccCalendarNewSession=function(){
    injectCss();const clients=appData().clients||[];if(!clients.length){notify('Primero necesitas crear un cliente');return}
    const sel=selectedDate(),date=dateKey(sel);const show=typeof openModal==='function'?openModal:window.openModal;if(typeof show!=='function')return;
    show(`<div id="dcc-cal-session-form"><div class="head"><div><h2>Nueva sesión</h2><p class="sub">Programa una sesión para un cliente</p></div><button type="button" class="close" onclick="dccCalendarCloseModal()">×</button></div><label>Cliente<select id="dcc-cal-client"><option value="" disabled selected>Selecciona un cliente</option>${clients.map(c=>`<option value="${esc(c.id)}">${esc(c.name)}</option>`).join('')}</select></label><div class="row"><label>Fecha<input id="dcc-cal-date" type="date" value="${date}"></label><label>Hora<input id="dcc-cal-time" type="time" value="09:00"></label></div><label>Tipo de sesión<select id="dcc-cal-type"><option>Entrenamiento</option><option>Check-in</option><option>Revisión</option><option>Consulta</option></select></label><label>Notas<textarea id="dcc-cal-notes" placeholder="Ej. Pierna · revisar técnica de sentadilla"></textarea></label><button id="dcc-cal-save" type="button" class="save" onclick="dccCalendarSaveSession()">Guardar sesión →</button></div>`);
    document.getElementById('modal')?.classList.add('dcc-cal-session-overlay');
  };
  window.dccCalendarCloseModal=closeSessionModal;

  window.dccCalendarSaveSession=async function(){
    const clientId=document.getElementById('dcc-cal-client')?.value||'',sessionDate=document.getElementById('dcc-cal-date')?.value||'',sessionTime=document.getElementById('dcc-cal-time')?.value||'',sessionType=document.getElementById('dcc-cal-type')?.value||'Entrenamiento',notes=document.getElementById('dcc-cal-notes')?.value.trim()||'';
    if(!clientId||!sessionDate||!sessionTime){notify('Selecciona cliente, fecha y hora');return}
    const database=db();if(!database){notify('No se pudo conectar con la agenda');return}
    const button=document.getElementById('dcc-cal-save');if(button){button.disabled=true;button.textContent='Guardando…'}
    try{
      const {error}=await database.from('coach_calendar_sessions').insert({client_id:clientId,session_date:sessionDate,session_time:sessionTime,session_type:sessionType,notes});if(error)throw error;
      const d=new Date(sessionDate+'T12:00:00');window.__dccCalendarSelected=sessionDate;window.__dccCalendarMonthTs=new Date(d.getFullYear(),d.getMonth(),1,12).getTime();delete cache[monthKey(d)];closeSessionModal();renderCalendar(true);notify('Sesión guardada');
    }catch(e){console.error('DCC guardando sesión:',e);notify('No se pudo guardar la sesión');if(button){button.disabled=false;button.textContent='Guardar sesión →'}}
  };

  window.dccCalendarDeleteSession=async function(id){
    if(!confirm('¿Eliminar esta sesión del calendario?'))return;const database=db();if(!database)return;
    try{const {error}=await database.from('coach_calendar_sessions').delete().eq('id',id);if(error)throw error;const m=monthDate();delete cache[monthKey(m)];renderCalendar(true);notify('Sesión eliminada')}catch(e){console.error('DCC eliminando sesión:',e);notify('No se pudo eliminar la sesión')}
  };

  window.dccCalendarMove=function(delta){const d=monthDate();d.setMonth(d.getMonth()+delta);d.setDate(1);window.__dccCalendarMonthTs=d.getTime();renderCalendar(true)};
  window.dccCalendarSelect=function(y,m,d){const x=new Date(y,m,d,12);window.__dccCalendarSelected=dateKey(x);window.__dccCalendarMonthTs=new Date(y,m,1,12).getTime();renderCalendar(true)};
  window.dccCalendarSetView=function(v){window.__dccCalendarView=v==='agenda'?'agenda':'month';renderCalendar(true)};

  function hasV11(fn,depth){if(!fn||typeof fn!=='function'||depth>12)return false;if(fn.__dccUIV11)return true;return hasV11(fn.__base,depth+1)||hasV11(fn.__original,depth+1)}
  function install(attempt){
    injectCss();const current=window.showCoach;if(typeof current!=='function'||!hasV11(current,0)){if((attempt||0)<50)setTimeout(()=>install((attempt||0)+1),80);return}
    if(current.__dccCalendarV12){if(window.currentScreen==='calendar')renderCalendar(true);return}
    const wrapped=function(screen){if(screen==='calendar'){renderCalendar(true);return}return current.apply(this,arguments)};wrapped.__dccCalendarV12=true;wrapped.__base=current;window.showCoach=wrapped;
    if(window.currentScreen==='calendar')renderCalendar(true);
  }

  install(0);window.addEventListener('pageshow',()=>setTimeout(()=>install(0),90));
})();
