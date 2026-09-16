/* DCC coach calendar v12.3 — autoridad única de calendario y agenda */
(function(){
  'use strict';
  const BUILD='20260916-coach-calendar-v123-self-contained';
  if(window.__dccCoachCalendarBuild===BUILD)return;
  window.__dccCoachCalendarBuild=BUILD;
  window.__dccCoachCalendarV12=true;

  const GOLD='#d9aa4a', GOLD2='#f0c96b', STYLE_ID='dcc-coach-calendar-v123-css';
  const months=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  const weekdays=['L','M','X','J','V','S','D'];
  const cache=window.__dccCalendarSessionsByMonth=window.__dccCalendarSessionsByMonth||{};
  const loading=new Set();

  function appData(){try{return data||{}}catch(e){return window.data||{}}}
  function db(){try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient}catch(e){}return window.supabaseClient||null}
  function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
  function notify(t){try{if(typeof toast==='function')return toast(t)}catch(e){}try{window.toast?.(t)}catch(e){}}
  function dateKey(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
  function monthKey(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`}
  function prettyDate(d){return d.toLocaleDateString('es-ES',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}
  function clientName(id){return (appData().clients||[]).find(c=>String(c.id)===String(id))?.name||'Cliente'}
  function timeLabel(v){return String(v||'').slice(0,5)||'—'}
  function typeLabel(v){return String(v||'').toLowerCase()==='a domicilio'?'A domicilio':'En gimnasio'}

  function selectedDate(){
    if(window.__dccCalendarSelected){const d=new Date(window.__dccCalendarSelected+'T12:00:00');if(Number.isFinite(d.getTime()))return d}
    return new Date();
  }
  function monthDate(){
    if(Number.isFinite(window.__dccCalendarMonthTs))return new Date(window.__dccCalendarMonthTs);
    const d=new Date();d.setDate(1);d.setHours(12,0,0,0);window.__dccCalendarMonthTs=d.getTime();return d;
  }

  function injectCss(){
    ['dcc-coach-calendar-v121-css','dcc-coach-calendar-v122-css'].forEach(id=>document.getElementById(id)?.remove());
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');s.id=STYLE_ID;s.textContent=`
      #coach-main.dcc-cal-v11{background:radial-gradient(circle at 92% 0,rgba(217,170,74,.075),transparent 26%),linear-gradient(180deg,#07090c,#040608)!important;padding:16px 14px 110px!important;color:#f6f3ed!important}
      #coach-main.dcc-cal-v11 .dcc-cal{width:100%;max-width:980px;margin:0 auto}
      #coach-main.dcc-cal-v11 .dcc-cal,#coach-main.dcc-cal-v11 .dcc-cal *{box-sizing:border-box}
      #coach-main.dcc-cal-v11 .dcc-cal-head{display:flex;justify-content:space-between;align-items:flex-start;gap:14px;margin:4px 0 18px}
      #coach-main.dcc-cal-v11 .dcc-cal-head h1{margin:0;color:#f7f5f1;font-size:31px;line-height:1;letter-spacing:-1px;font-weight:800}
      #coach-main.dcc-cal-v11 .dcc-cal-head p{margin:8px 0 0;color:#9099a4;font-size:12px;line-height:1.35}
      #coach-main.dcc-cal-v11 .dcc-cal-new{position:relative;z-index:5;flex:none;min-height:44px;padding:0 16px;border:1px solid rgba(255,224,132,.76);border-radius:15px;background:linear-gradient(135deg,#f5cf68,#dca83c);color:#15110a;font-size:11px;font-weight:850;box-shadow:0 8px 24px rgba(217,170,74,.15);pointer-events:auto;touch-action:manipulation}
      #coach-main.dcc-cal-v11 .dcc-cal-tabs{display:grid;grid-template-columns:1fr 1fr;height:46px;margin-bottom:10px;padding:3px;border:1px solid #2e353e;border-radius:18px;background:#090d11;overflow:hidden}
      #coach-main.dcc-cal-v11 .dcc-cal-tab{border:0;border-radius:15px;background:transparent;color:#9099a5;font-size:12px;font-weight:750}
      #coach-main.dcc-cal-v11 .dcc-cal-tab.active{border:1px solid rgba(240,201,107,.66);background:radial-gradient(circle at 50% 50%,rgba(217,170,74,.18),rgba(20,15,8,.50));color:${GOLD2};box-shadow:0 0 18px rgba(217,170,74,.10)}
      #coach-main.dcc-cal-v11 .dcc-cal-card{overflow:hidden;border:1px solid rgba(240,201,107,.54);border-radius:20px;background:radial-gradient(circle at 92% 2%,rgba(217,170,74,.055),transparent 34%),linear-gradient(145deg,#10151a,#080b0e);box-shadow:inset 0 1px 0 rgba(255,255,255,.025)}
      #coach-main.dcc-cal-v11 .dcc-cal-month-head{display:grid;grid-template-columns:42px 1fr 42px;align-items:center;gap:10px;padding:12px 13px 8px}
      #coach-main.dcc-cal-v11 .dcc-cal-month-head strong{text-align:center;font-size:16px;color:#f5f3ef}
      #coach-main.dcc-cal-v11 .dcc-cal-move{width:38px;height:38px;display:grid;place-items:center;border:1px solid #39414b;border-radius:13px;background:#0b0f13;color:#f4f4f2;font-size:28px;font-weight:700;line-height:1}
      #coach-main.dcc-cal-v11 .dcc-cal-week{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));padding:5px 10px 2px;color:#8d96a1;font-size:9px;text-align:center}
      #coach-main.dcc-cal-v11 .dcc-cal-grid{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:3px;padding:4px 9px 12px}
      #coach-main.dcc-cal-v11 .dcc-cal-day-blank{display:block;aspect-ratio:1/1}
      #coach-main.dcc-cal-v11 .dcc-cal-day{position:relative;display:grid;place-items:center;width:100%;aspect-ratio:1/1;min-width:0;margin:0;padding:0;border:1px solid transparent;border-radius:50%;background:transparent;color:#f0efec;font-size:11px;line-height:1}
      #coach-main.dcc-cal-v11 .dcc-cal-day.today:after{content:'';position:absolute;left:50%;bottom:4px;width:4px;height:4px;border-radius:50%;transform:translateX(-50%);background:${GOLD2}}
      #coach-main.dcc-cal-v11 .dcc-cal-day.has-session:before{content:'';position:absolute;left:50%;top:5px;width:5px;height:5px;border-radius:50%;transform:translateX(-50%);background:${GOLD2};box-shadow:0 0 8px rgba(240,201,107,.55)}
      #coach-main.dcc-cal-v11 .dcc-cal-day.selected{border-color:${GOLD2};background:linear-gradient(135deg,#f7da82 0%,#e7b640 100%);color:#17130a;box-shadow:0 5px 14px rgba(183,123,19,.16)}
      #coach-main.dcc-cal-v11 .dcc-cal-day.selected:before{background:#9a650a;box-shadow:none}
      #coach-main.dcc-cal-v11 .dcc-cal-agenda{margin:0}
      #coach-main.dcc-cal-v11 .dcc-cal-agenda-top{display:flex;align-items:center;gap:10px;margin:2px 0 15px}
      #coach-main.dcc-cal-v11 .dcc-cal-agenda-back{width:42px;height:42px;display:grid;place-items:center;flex:none;border:1px solid rgba(217,170,74,.42);border-radius:14px;background:#0b0f13;color:${GOLD2};font-size:24px}
      #coach-main.dcc-cal-v11 .dcc-cal-agenda-title{min-width:0;flex:1}
      #coach-main.dcc-cal-v11 .dcc-cal-agenda-title h2{margin:0;color:#f7f5f1;font-size:24px;line-height:1.05;letter-spacing:-.55px}
      #coach-main.dcc-cal-v11 .dcc-cal-agenda-title p{margin:5px 0 0;color:#8d96a1;font-size:11px;text-transform:capitalize}
      #coach-main.dcc-cal-v11 .dcc-cal-count{min-width:34px;height:34px;padding:0 10px;display:grid;place-items:center;border:1px solid rgba(217,170,74,.42);border-radius:999px;color:${GOLD2};font-size:11px;font-weight:850}
      #coach-main.dcc-cal-v11 .dcc-cal-session-list{display:flex;flex-direction:column;gap:9px}
      #coach-main.dcc-cal-v11 .dcc-cal-session{display:grid;grid-template-columns:58px minmax(0,1fr) auto;align-items:center;gap:12px;padding:14px;border:1px solid rgba(217,170,74,.42);border-radius:18px;background:radial-gradient(circle at 96% 4%,rgba(217,170,74,.07),transparent 34%),linear-gradient(145deg,#10151a,#080b0e);box-shadow:inset 0 1px 0 rgba(255,255,255,.025)}
      #coach-main.dcc-cal-v11 .dcc-cal-session-time{display:grid;place-items:center;min-height:46px;border:1px solid rgba(240,201,107,.48);border-radius:14px;color:${GOLD2};font-size:13px;font-weight:900;background:rgba(217,170,74,.045)}
      #coach-main.dcc-cal-v11 .dcc-cal-session-copy{min-width:0}
      #coach-main.dcc-cal-v11 .dcc-cal-session-copy strong{display:block;color:#f5f3ef;font-size:15px;line-height:1.2}
      #coach-main.dcc-cal-v11 .dcc-cal-session-type{display:block;margin-top:5px;color:${GOLD2};font-size:10px;font-weight:800}
      #coach-main.dcc-cal-v11 .dcc-cal-session-notes{margin:5px 0 0;color:#8f98a3;font-size:10px;line-height:1.35}
      #coach-main.dcc-cal-v11 .dcc-cal-session-actions{display:flex;gap:6px}
      #coach-main.dcc-cal-v11 .dcc-cal-session-edit,#coach-main.dcc-cal-v11 .dcc-cal-session-delete{width:35px;height:35px;display:grid;place-items:center;border:1px solid rgba(255,255,255,.12);border-radius:11px;background:#0b0f13;color:#a7adb5;font-size:15px}
      #coach-main.dcc-cal-v11 .dcc-cal-session-edit{color:${GOLD2}}
      #coach-main.dcc-cal-v11 .dcc-cal-empty-clean{min-height:118px;display:flex;align-items:center;justify-content:center;text-align:center;flex-direction:column;gap:7px;padding:22px;border:1px solid rgba(217,170,74,.38);border-radius:18px;background:linear-gradient(145deg,#10151a,#080b0e);color:#9aa3ad}
      #coach-main.dcc-cal-v11 .dcc-cal-empty-clean strong{color:#f5f3ef;font-size:14px}
      #coach-main.dcc-cal-v11 .dcc-cal-empty-clean span{max-width:300px;font-size:11px;line-height:1.45}

      html.dcc-theme-light-premium #coach-main.dcc-cal-v11{background:radial-gradient(circle at 88% 0,rgba(214,163,61,.10),transparent 26%),linear-gradient(180deg,#fffaf1 0%,#f5efe4 60%,#f1e9dc 100%)!important;color:#17191d!important}
      html.dcc-theme-light-premium #coach-main.dcc-cal-v11 .dcc-cal-head h1,html.dcc-theme-light-premium #coach-main.dcc-cal-v11 .dcc-cal-month-head strong,html.dcc-theme-light-premium #coach-main.dcc-cal-v11 .dcc-cal-agenda-title h2{color:#17191d!important}
      html.dcc-theme-light-premium #coach-main.dcc-cal-v11 .dcc-cal-head p,html.dcc-theme-light-premium #coach-main.dcc-cal-v11 .dcc-cal-agenda-title p{color:#68717e!important}
      html.dcc-theme-light-premium #coach-main.dcc-cal-v11 .dcc-cal-tabs{background:#fffdf9!important;border-color:rgba(185,122,17,.25)!important}
      html.dcc-theme-light-premium #coach-main.dcc-cal-v11 .dcc-cal-tab{color:#747c88!important}
      html.dcc-theme-light-premium #coach-main.dcc-cal-v11 .dcc-cal-tab.active{background:linear-gradient(135deg,#f7d77d,#e4ad3d)!important;color:#17130a!important;border-color:#d8a13a!important;box-shadow:none!important}
      html.dcc-theme-light-premium #coach-main.dcc-cal-v11 .dcc-cal-card{background:#fffdf9!important;border-color:rgba(185,122,17,.28)!important;box-shadow:0 10px 28px rgba(83,63,31,.07),inset 0 1px 0 rgba(255,255,255,.96)!important}
      html.dcc-theme-light-premium #coach-main.dcc-cal-v11 .dcc-cal-move{color:#9a650a!important;background:linear-gradient(145deg,#fffdf8,#f8eedc)!important;border-color:rgba(183,123,19,.42)!important;box-shadow:0 4px 12px rgba(78,58,28,.06)!important}
      html.dcc-theme-light-premium #coach-main.dcc-cal-v11 .dcc-cal-week{color:#8a919c!important}
      html.dcc-theme-light-premium #coach-main.dcc-cal-v11 .dcc-cal-day{color:#25282d!important}
      html.dcc-theme-light-premium #coach-main.dcc-cal-v11 .dcc-cal-day.selected{color:#17130a!important}
      html.dcc-theme-light-premium #coach-main.dcc-cal-v11 .dcc-cal-agenda-back{background:#fffaf1!important;color:#98640b!important;border-color:rgba(185,122,17,.30)!important}
      html.dcc-theme-light-premium #coach-main.dcc-cal-v11 .dcc-cal-count{color:#98640b!important;border-color:rgba(185,122,17,.30)!important;background:#fffaf1!important}
      html.dcc-theme-light-premium #coach-main.dcc-cal-v11 .dcc-cal-session{background:#fffaf1!important;color:#17191d!important;border-color:rgba(185,122,17,.28)!important}
      html.dcc-theme-light-premium #coach-main.dcc-cal-v11 .dcc-cal-session-copy strong{color:#17191d!important}
      html.dcc-theme-light-premium #coach-main.dcc-cal-v11 .dcc-cal-session-notes{color:#68717e!important}
      html.dcc-theme-light-premium #coach-main.dcc-cal-v11 .dcc-cal-session-edit,html.dcc-theme-light-premium #coach-main.dcc-cal-v11 .dcc-cal-session-delete{background:#fffaf1!important;border-color:rgba(185,122,17,.28)!important}
      html.dcc-theme-light-premium #coach-main.dcc-cal-v11 .dcc-cal-session-edit{color:#98640b!important}
      html.dcc-theme-light-premium #coach-main.dcc-cal-v11 .dcc-cal-session-delete{color:#68717e!important}
      html.dcc-theme-light-premium #coach-main.dcc-cal-v11 .dcc-cal-empty-clean{background:#fffdf9!important;color:#68717e!important;border-color:rgba(185,122,17,.28)!important}
      html.dcc-theme-light-premium #coach-main.dcc-cal-v11 .dcc-cal-empty-clean strong{color:#17191d!important}
      @media(max-width:390px){#coach-main.dcc-cal-v11{padding-left:12px!important;padding-right:12px!important}#coach-main.dcc-cal-v11 .dcc-cal-head h1{font-size:28px}#coach-main.dcc-cal-v11 .dcc-cal-head p{font-size:11px}#coach-main.dcc-cal-v11 .dcc-cal-new{padding:0 12px;font-size:10px}#coach-main.dcc-cal-v11 .dcc-cal-day{font-size:10px}#coach-main.dcc-cal-v11 .dcc-cal-session{grid-template-columns:52px minmax(0,1fr) auto;padding:12px}#coach-main.dcc-cal-v11 .dcc-cal-session-actions{flex-direction:column}#coach-main.dcc-cal-v11 .dcc-cal-agenda-title h2{font-size:22px}}
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
    const y=month.getFullYear(),m=month.getMonth(),first=new Date(y,m,1,12),offset=(first.getDay()+6)%7,lastDay=new Date(y,m+1,0,12).getDate(),today=new Date(),sel=selectedDate();let html='';
    for(let i=0;i<offset;i++)html+='<span class="dcc-cal-day-blank" aria-hidden="true"></span>';
    for(let day=1;day<=lastDay;day++){
      const d=new Date(y,m,day,12),key=dateKey(d),isToday=key===dateKey(today),selected=key===dateKey(sel),session=hasSession(key);
      html+=`<button type="button" class="dcc-cal-day${isToday?' today':''}${selected?' selected':''}${session?' has-session':''}" onclick="dccCalendarSelect(${y},${m},${day})">${day}</button>`;
    }
    const total=offset+lastDay,tail=(7-(total%7))%7;for(let i=0;i<tail;i++)html+='<span class="dcc-cal-day-blank" aria-hidden="true"></span>';
    return html;
  }

  function agendaHtml(sel){
    const key=dateKey(sel),mkey=key.slice(0,7);if(!cache[mkey])return '<div class="dcc-cal-empty-clean"><strong>Cargando agenda…</strong></div>';
    const rows=sessionsForDate(key);if(!rows.length)return `<div class="dcc-cal-empty-clean"><strong>Sin entrenamientos</strong><span>No hay ningún entrenamiento personal programado para este día.</span></div>`;
    return `<div class="dcc-cal-session-list">${rows.map(r=>`<article class="dcc-cal-session"><div class="dcc-cal-session-time">${esc(timeLabel(r.session_time))}</div><div class="dcc-cal-session-copy"><strong>${esc(clientName(r.client_id))}</strong><span class="dcc-cal-session-type">${esc(typeLabel(r.session_type))}</span>${r.notes?`<p class="dcc-cal-session-notes">${esc(r.notes)}</p>`:''}</div><div class="dcc-cal-session-actions"><button type="button" class="dcc-cal-session-edit" onclick="dccCalendarEditSession('${esc(r.id)}')" aria-label="Editar entrenamiento">✎</button><button type="button" class="dcc-cal-session-delete" onclick="dccCalendarDeleteSession('${esc(r.id)}')" aria-label="Eliminar entrenamiento">×</button></div></article>`).join('')}</div>`;
  }

  function patchNav(){const nav=document.getElementById('coach-nav');if(!nav)return;const buttons=[...nav.querySelectorAll('button')];if(buttons[2]){buttons.forEach(b=>b.classList.remove('active'));buttons[2].classList.add('active')}}

  function renderCalendar(fetch=true){
    injectCss();const main=document.getElementById('coach-main');if(!main)return;main.className='dcc-cal-v11';window.currentScreen='calendar';
    const m=monthDate(),sel=selectedDate(),view=window.__dccCalendarView==='agenda'?'agenda':'month',rows=sessionsForDate(dateKey(sel));
    const monthMarkup=`<section class="dcc-cal-card"><div class="dcc-cal-month-head"><button type="button" class="dcc-cal-move" onclick="dccCalendarMove(-1)">‹</button><strong>${months[m.getMonth()]} ${m.getFullYear()}</strong><button type="button" class="dcc-cal-move" onclick="dccCalendarMove(1)">›</button></div><div class="dcc-cal-week">${weekdays.map(x=>`<span>${x}</span>`).join('')}</div><div class="dcc-cal-grid">${calendarCells(m)}</div></section>`;
    const agendaMarkup=`<section class="dcc-cal-agenda"><div class="dcc-cal-agenda-top"><button type="button" class="dcc-cal-agenda-back" onclick="dccCalendarSetView('month')">‹</button><div class="dcc-cal-agenda-title"><h2>Agenda del día</h2><p>${prettyDate(sel)}</p></div><span class="dcc-cal-count">${rows.length}</span></div>${agendaHtml(sel)}</section>`;
    main.innerHTML=`<div class="dcc-cal"><header class="dcc-cal-head"><div><h1>Calendario</h1><p>Gestiona tus entrenamientos personales.</p></div><button type="button" class="dcc-cal-new" onclick="dccCalendarNewSession()">＋ Nuevo entreno</button></header><div class="dcc-cal-tabs"><button type="button" class="dcc-cal-tab ${view==='month'?'active':''}" onclick="dccCalendarSetView('month')">Mes</button><button type="button" class="dcc-cal-tab ${view==='agenda'?'active':''}" onclick="dccCalendarSetView('agenda')">Agenda</button></div>${view==='month'?monthMarkup:agendaMarkup}</div>`;
    patchNav();if(fetch)loadMonth(m,false);
  }

  window.dccCalendarNewSession=function(){if(typeof window.dccCalendarOpenSessionEditor==='function')return window.dccCalendarOpenSessionEditor(null);notify('Cargando editor de entrenamientos…')};
  window.dccCalendarEditSession=function(id){const row=findSession(id);if(!row){notify('No se encontró el entrenamiento');return}if(typeof window.dccCalendarOpenSessionEditor==='function')window.dccCalendarOpenSessionEditor(row)};
  window.dccCalendarDeleteSession=async function(id){
    if(!confirm('¿Eliminar este entrenamiento personal?'))return;const database=db();if(!database)return;
    try{const {error}=await database.from('coach_calendar_sessions').delete().eq('id',id);if(error)throw error;delete cache[monthKey(monthDate())];renderCalendar(true);notify('Entrenamiento eliminado')}catch(e){console.error('DCC eliminando entreno:',e);notify('No se pudo eliminar el entrenamiento')}
  };
  window.dccCalendarMove=function(delta){const d=monthDate();d.setMonth(d.getMonth()+delta);d.setDate(1);window.__dccCalendarMonthTs=d.getTime();window.__dccCalendarSelected=dateKey(new Date(d.getFullYear(),d.getMonth(),1,12));window.__dccCalendarView='month';renderCalendar(true)};
  window.dccCalendarSelect=function(y,m,d){const x=new Date(y,m,d,12);window.__dccCalendarSelected=dateKey(x);window.__dccCalendarMonthTs=new Date(y,m,1,12).getTime();window.__dccCalendarView='agenda';renderCalendar(true)};
  window.dccCalendarSetView=function(v){window.__dccCalendarView=v==='agenda'?'agenda':'month';renderCalendar(true)};
  window.dccRenderCoachCalendarV12=function(){renderCalendar(true)};
  window.dccCalendarRefresh=function(){delete cache[monthKey(monthDate())];renderCalendar(true)};

  injectCss();
  if(window.currentScreen==='calendar')queueMicrotask(()=>renderCalendar(true));
})();