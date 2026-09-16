/* DCC client session alert v1 — aviso derivado de Agenda, sin modalidad */
(function(){
  'use strict';
  const BUILD='20260916-client-session-alert-v1';
  if(window.__dccClientSessionAlertBuild===BUILD)return;
  window.__dccClientSessionAlertBuild=BUILD;

  const ROW_ID='dcc-client-session-alert';
  let requestToken=0;
  let realtimeChannel=null;

  function db(){
    try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient}catch(e){}
    return window.supabaseClient||null;
  }
  function clientId(){
    try{if(typeof currentClientId!=='undefined'&&currentClientId)return currentClientId}catch(e){}
    return window.currentClientId||null;
  }
  function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
  function todayKey(){
    const d=new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }
  function sessionMoment(row){
    const t=String(row?.session_time||'00:00').slice(0,5);
    const d=new Date(`${row?.session_date||''}T${t}:00`);
    return Number.isFinite(d.getTime())?d:null;
  }
  function sessionLabel(row){
    const d=sessionMoment(row);
    if(!d)return '';
    const date=d.toLocaleDateString('es-ES',{weekday:'long',day:'numeric',month:'long'});
    const time=String(row.session_time||'').slice(0,5);
    return `${date.charAt(0).toUpperCase()+date.slice(1)} · ${time}`;
  }
  function icon(){
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="5" width="16" height="15" rx="2.5"/><path d="M8 3v4M16 3v4M4 9h16"/><path d="M8 13h3M8 16h6"/></svg>`;
  }
  function restoreCount(card){
    const count=card?.querySelector('.dch-task-count');
    if(!count)return;
    const normalRows=[...card.querySelectorAll('.dch-task-row')].filter(el=>el.id!==ROW_ID);
    count.textContent=String(normalRows.length);
  }
  function clearAlert(){
    const row=document.getElementById(ROW_ID);
    const card=row?.closest('.dch-task-card');
    row?.remove();
    if(card)restoreCount(card);
  }
  function paint(row){
    const card=document.querySelector('#client-main .dch-task-card');
    if(!card)return;
    document.getElementById(ROW_ID)?.remove();
    if(!row){restoreCount(card);return}

    const empty=card.querySelector('.dch-task-empty');
    if(empty)empty.remove();

    const alert=document.createElement('div');
    alert.id=ROW_ID;
    alert.className='dch-task-row';
    alert.setAttribute('role','status');
    alert.style.cursor='default';
    alert.innerHTML=`<span class="dch-iconbox">${icon()}</span><span class="dch-task-copy"><span class="dch-task-title">Entrenamiento programado</span><span class="dch-task-meta">${esc(sessionLabel(row))}</span></span><span></span>`;
    const head=card.querySelector('.dch-task-head');
    if(head)head.insertAdjacentElement('afterend',alert);else card.prepend(alert);

    const count=card.querySelector('.dch-task-count');
    if(count){
      const normalRows=[...card.querySelectorAll('.dch-task-row')].filter(el=>el.id!==ROW_ID);
      count.textContent=String(normalRows.length+1);
    }
  }

  async function refresh(){
    if(window.currentApp!=='client'||window.currentScreen!=='home')return;
    const id=clientId(),database=db();
    if(!id||!database){clearAlert();return}
    const token=++requestToken;
    try{
      const res=await database
        .from('coach_calendar_sessions')
        .select('id,client_id,session_date,session_time')
        .eq('client_id',id)
        .gte('session_date',todayKey())
        .order('session_date',{ascending:true})
        .order('session_time',{ascending:true})
        .limit(8);
      if(res.error)throw res.error;
      if(token!==requestToken||window.currentApp!=='client'||window.currentScreen!=='home')return;
      const now=Date.now();
      const next=(res.data||[]).find(item=>{
        const d=sessionMoment(item);
        return d&&d.getTime()>=now-60000;
      })||null;
      paint(next);
    }catch(e){
      console.error('DCC aviso de entrenamiento:',e);
      if(token===requestToken)clearAlert();
    }
  }

  function hookClientHome(){
    if(typeof window.showClient!=='function'||window.showClient.__dccSessionAlertWrapped)return false;
    const base=window.showClient;
    function wrapped(screen){
      const result=base.apply(this,arguments);
      if(screen==='home')queueMicrotask(refresh);
      else clearAlert();
      return result;
    }
    wrapped.__dccSessionAlertWrapped=true;
    wrapped.__dccSessionAlertBase=base;
    window.showClient=wrapped;
    return true;
  }

  function setupRealtime(){
    const database=db();
    if(!database?.channel||realtimeChannel)return;
    try{
      realtimeChannel=database
        .channel('dcc-client-session-alert-v1')
        .on('postgres_changes',{event:'*',schema:'public',table:'coach_calendar_sessions'},payload=>{
          const id=clientId();
          const changed=payload?.new?.client_id||payload?.old?.client_id;
          if(id&&String(changed)===String(id))refresh();
        })
        .subscribe();
      window.__dccClientSessionAlertChannel=realtimeChannel;
    }catch(e){console.error('DCC realtime aviso de entrenamiento:',e)}
  }

  hookClientHome();
  setupRealtime();
  document.addEventListener('dcc:support-ready',()=>{hookClientHome();setupRealtime();refresh()},{once:true});
  window.addEventListener('pageshow',refresh);
  window.dccRefreshClientSessionAlert=refresh;
})();