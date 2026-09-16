/* DCC coach calendar v12.1 — gestión estable de entrenamientos personales */
(function(){
  'use strict';
  const BUILD='20260916-coach-calendar-v121-personal-training';
  if(window.__dccCoachCalendarBuild===BUILD)return;
  window.__dccCoachCalendarBuild=BUILD;
  window.__dccCoachCalendarV12=true;

  const GOLD='#d9aa4a', GOLD2='#f0c96b', STYLE_ID='dcc-coach-calendar-v121-css';
  const months=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  const weekdays=['L','M','X','J','V','S','D'];
  const cache=window.__dccCalendarSessionsByMonth=window.__dccCalendarSessionsByMonth||{};
  const loading=new Set();

  function appData(){try{return data||{}}catch(e){return window.data||{}}}
  function db(){try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient}catch(e){}return window.supabaseClient||null}
  function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[c]))}
  function notify(t){try{if(typeof toast==='function')return toast(t)}catch(e){}try{window.toast?.(t)}catch(e){}}
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
      .dcc-cal-session{display:grid;grid-template-columns:54px minmax(0,1fr) auto;align-items:center;gap:11px;padding:13px;border:1px solid rgba(217,170,74,.42);border-radius:17px;background:radial-gradient(circle at 96% 4%,rgba(217,170,74,.07),transparent 34%),linear-gradient(145deg,#10151a,#080b0e);box-shadow:inset 0 1px 0 rgba(255,255,255,.025)}
      .dcc-cal-session-time{display:grid;place-items:center;min-height:43px;border:1px solid rgba(240,201,107,.48);border-radius:13px;color:${GOLD2};font-size:12px;font-weight:850;background:rgba(217,170,74,.045)}
      .dcc-cal-session-copy{min-width:0}.dcc-cal-session-copy strong{display:block;color:#f5f3ef;font-size:14px;line-height:1.2}.dcc-cal-session-type{display:block;margin-top:4px;color:${GOLD2};font-size:9px;font-weight:800;letter-spacing:1.3px;text-transform:uppercase}.dcc-cal-session-notes{margin:5px 0 0;color:#8f98a3;font-size:10px;line-height:1.35}
      .dcc-cal-session-actions{display:flex;gap:6px}.dcc-cal-session-edit,.dcc-cal-session-delete{width:34px;height:34px;display:grid;place-items:center;border:1px solid rgba(255,255,255,.12);border-radius:10px;background:#0b0f13;color:#a7adb5;font-size:15px}.dcc-cal-session-edit{color:${GOLD2}}
      html.dcc-theme-light-premium .dcc-cal-session{background:#fffaf1!important;color:#17191d!important;border-color:rgba(185,122,17,.28)!important}
      html.dcc-theme-light-premium .dcc-cal-session-copy strong{color:#17191d!important}
      html.dcc-theme-light-premium .dcc-cal-session-notes{color:#68717e!important}
      html.dcc-theme-light-premium .dcc-cal-session-edit,html.dcc-theme-light-premium .dcc-cal-session-delete{background:#fffaf1!important;border-color:rgba(185,122,17,.28)!important}.dcc-cal-session-edit{color:#98640b!important}.dcc-cal-session-delete{color:#68717e!important}
      html.dcc-theme-light-premium #coach-main.dcc-cal-v11 .dcc-cal-day.selected{background:linear-gradient(135deg,#f7da82 0%,#e7b640 100%)!important;color:#17130a!important;border-color:#d9aa4a!important;box-shadow:0 4px 12px rgba(183,123,19,.14)!important}
      html.dcc-theme-light-premium #coach-main.dcc-cal-v11 .dcc-cal-day.selected:before{background:#9a650a!important;box-shadow:none!important}
      @media(max-width:390px){.dcc-cal-session{grid-template-columns:50px minmax(0,1fr) auto;padding:11px}.dcc-cal-session-actions{flex-direction:column}}
    `;document.head.appendChild(s);
  }

  function sessionsForDate(key){const mkey=key.slice(0,7);return (cache[mkey]||[]).filter(x=>x.session_date===key).sort((a,b)=>String(a.session_time).localeCompare(String(b.session_time)))}
  function hasSession(key){return sessionsForDate(key).length>0}
  function findSession(id){for(const rows of Object.values(cache)){const row=(rows||[]).find(x=>String(x.id)===String(id));if(row)return row}return null}

  async function loadMonth(month,force){
    const key=monthKey(month);if(!force&&cache[key])return cache[key];if(loading.has(key))return cache[key]||[];
    const database=db();if(!database){cache[key]=[];return []}
    loading.add(key);
    const first=`${key}-01`;const next=new Date(month.getFullYear(),month.getMonth()+1,1,12);const nextKey=`${next.getFullYear()}-${String(next.getMonth()+1).padStart(2,'0')}-01`;
    try{
      const {data:rows,error}=await database.from('coach_calendar_sessions').select('id,client_id,session_date,session_time,session_type,notes,created_at').gte('session_date',first).lt('session_date',nextKey).order('session_date',{ascending:true}).order('session_time',{ascending:true});
      if(error)throw error;cache[key]=rows||[];
      if(window.currentScreen==='calendar'&&monthKey(monthDate())===key)renderCalendar(false);
      return cache[key];
    }catch(e){console.error('DCC calendario cargando entrenos:',e);cache[key]=[];notify('No se pudo cargar la agenda');return []}finally{loading.delete(key)}
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
    const key=dateKey(sel),mkey=key.slice(0,7);if(!cache[mkey])return '';
    const rows=sessionsForDate(key);if(!rows.length)return `<div class="dcc-cal-empty"><span class="dcc-cal-empty-icon">▣</span><span>No hay entrenamientos personales programados para este día.</span></div>`;
    return `<div class="dcc-cal-session-list">${rows.map(r=>`<article class="dcc-cal-session"><div class="dcc-cal-session-time">${esc(timeLabel(r.session_time))}</div><div class="dcc-cal-session-copy"><strong>${esc(clientName(r.client_id))}</strong><span class="dcc-cal-session-type">${esc(r.session_type||'Presencial')}</span>${r.notes?`<p class="dcc-cal-session-notes">${esc(r.notes)}</p>`:''}</div><div class="dcc-cal-session-actions"><button type="button" class="dcc-cal-session-edit" onclick="dccCalendarEditSession('${esc(r.id)}')" aria-label="Editar entrenamiento">✎</button><button type="button" class="dcc-cal-session-delete" onclick="dccCalendarDeleteSession('${esc(r.id)}')" aria-label="Eliminar entrenamiento">×</button></div></article>`).join('')}</div>`;
  }

  function patchNav(){const nav=document.getElementById('coach-nav');if(!nav)return;const buttons=[...nav.querySelectorAll('button')];if(buttons[2]){buttons.forEach(b=>b.classList.remove('active'));buttons[2].classList.add('active')}}

  function renderCalendar(fetch=true){
    injectCss();const main=document.getElementById('coach-main');if(!main)return;main.className='dcc-cal-v11';window.currentScreen='calendar';
    const m=monthDate(),sel=selectedDate(),view=window.__dccCalendarView==='agenda'?'agenda':'month';
    main.innerHTML=`<div class="dcc-cal ${view==='agenda'?'view-agenda':''}"><header class="dcc-cal-head"><div><h1>Entrenamientos personales</h1><p>Gestiona tus sesiones 1 a 1 con cada cliente.</p></div><button type="button" class="dcc-cal-new" onclick="dccCalendarNewSession()">＋ Nuevo entreno</button></header><div class="dcc-cal-tabs"><button type="button" class="dcc-cal-tab ${view==='month'?'active':''}" onclick="dccCalendarSetView('month')">Mes</button><button type="button" class="dcc-cal-tab ${view==='agenda'?'active':''}" onclick="dccCalendarSetView('agenda')">Agenda</button></div><section class="dcc-cal-card"><div class="dcc-cal-month-head"><button class="dcc-cal-move" onclick="dccCalendarMove(-1)">‹</button><strong>${months[m.getMonth()]} ${m.getFullYear()}</strong><button class="dcc-cal-move" onclick="dccCalendarMove(1)">›</button></div><div class="dcc-cal-week">${weekdays.map(x=>`<span>${x}</span>`).join('')}</div><div class="dcc-cal-grid">${calendarCells(m)}</div></section><section class="dcc-cal-agenda"><div class="dcc-cal-agenda-only">Entrenamientos programados para la fecha seleccionada.</div><div class="dcc-cal-agenda-head"><h2>Entrenos del día</h2><div class="dcc-cal-date-label">${prettyDate(sel)}</div></div>${agendaHtml(sel)}</section></div>`;
    patchNav();if(fetch)loadMonth(m,false);
  }

  window.dccCalendarNewSession=function(){if(typeof window.dccCalendarOpenSessionEditor==='function')return window.dccCalendarOpenSessionEditor(null);notify('Cargando editor de entrenamientos…')};
  window.dccCalendarEditSession=function(id){const row=findSession(id);if(!row){notify('No se encontró el entrenamiento');return}if(typeof window.dccCalendarOpenSessionEditor==='function')window.dccCalendarOpenSessionEditor(row)};
  window.dccCalendarDeleteSession=async function(id){
    if(!confirm('¿Eliminar este entrenamiento personal?'))return;const database=db();if(!database)return;
    try{const {error}=await database.from('coach_calendar_sessions').delete().eq('id',id);if(error)throw error;delete cache[monthKey(monthDate())];renderCalendar(true);notify('Entrenamiento eliminado')}catch(e){console.error('DCC eliminando entreno:',e);notify('No se pudo eliminar el entrenamiento')}
  };
  window.dccCalendarMove=function(delta){const d=monthDate();d.setMonth(d.getMonth()+delta);d.setDate(1);window.__dccCalendarMonthTs=d.getTime();renderCalendar(true)};
  window.dccCalendarSelect=function(y,m,d){const x=new Date(y,m,d,12);window.__dccCalendarSelected=dateKey(x);window.__dccCalendarMonthTs=new Date(y,m,1,12).getTime();renderCalendar(true)};
  window.dccCalendarSetView=function(v){window.__dccCalendarView=v==='agenda'?'agenda':'month';renderCalendar(true)};
  window.dccRenderCoachCalendarV12=function(){renderCalendar(true)};
  window.dccCalendarRefresh=function(){delete cache[monthKey(monthDate())];renderCalendar(true)};

  injectCss();
  if(window.currentScreen==='calendar')queueMicrotask(()=>renderCalendar(true));
})();