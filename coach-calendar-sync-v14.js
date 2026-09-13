/* DCC calendar sync v14.3 — sincronización mensual sin consultas redundantes */
(function(){
  'use strict';
  if(window.__dccCalendarSyncV143)return;
  window.__dccCalendarSyncV143=true;

  const cache=window.__dccCalendarSessionsByMonth=window.__dccCalendarSessionsByMonth||{};
  let syncing=false;
  let pending=false;

  function database(){
    try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient}catch(_){}
    return window.supabaseClient||null;
  }

  function monthDate(){
    if(Number.isFinite(window.__dccCalendarMonthTs))return new Date(window.__dccCalendarMonthTs);
    const d=new Date();
    d.setDate(1);
    d.setHours(12,0,0,0);
    return d;
  }

  function selectedDate(){
    if(window.__dccCalendarSelected){
      const d=new Date(window.__dccCalendarSelected+'T12:00:00');
      if(Number.isFinite(d.getTime()))return d;
    }
    return new Date();
  }

  function dateKey(d){
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }

  function monthKey(d){
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
  }

  async function forceMonthSync(){
    if(window.currentScreen!=='calendar')return false;
    if(syncing){pending=true;return false}

    const db=database();
    if(!db)return false;

    syncing=true;
    pending=false;

    const m=monthDate();
    const key=monthKey(m);
    const first=`${key}-01`;
    const next=new Date(m.getFullYear(),m.getMonth()+1,1,12);
    const nextKey=`${next.getFullYear()}-${String(next.getMonth()+1).padStart(2,'0')}-01`;

    try{
      const {data:rows,error}=await db
        .from('coach_calendar_sessions')
        .select('id,client_id,session_date,session_time,session_type,notes,created_at')
        .gte('session_date',first)
        .lt('session_date',nextKey)
        .order('session_date',{ascending:true})
        .order('session_time',{ascending:true});

      if(error)throw error;
      cache[key]=rows||[];

      if(window.currentScreen!=='calendar'||monthKey(monthDate())!==key)return true;

      let sel=selectedDate();
      if(sel.getFullYear()!==m.getFullYear()||sel.getMonth()!==m.getMonth()){
        sel=new Date(m.getFullYear(),m.getMonth(),1,12);
        window.__dccCalendarSelected=dateKey(sel);
      }

      const redraw=window.dccCalendarSelect?.__dccCalendarSyncBase||window.dccCalendarSelect;
      if(typeof redraw==='function')redraw(sel.getFullYear(),sel.getMonth(),sel.getDate());
      return true;
    }catch(error){
      console.error('DCC sincronización agenda v14.3:',error);
      return false;
    }finally{
      syncing=false;
      if(pending&&window.currentScreen==='calendar'){
        pending=false;
        queueMicrotask(forceMonthSync);
      }
    }
  }

  function wrapAsync(name){
    const current=window[name];
    if(typeof current!=='function'||current.__dccCalendarSyncV143)return;
    const wrapped=async function(){
      const result=await current.apply(this,arguments);
      if(window.currentScreen==='calendar')await forceMonthSync();
      return result;
    };
    wrapped.__dccCalendarSyncV143=true;
    wrapped.__dccCalendarSyncBase=current.__dccCalendarSyncBase||current;
    window[name]=wrapped;
  }

  function wrapMonthMove(){
    const current=window.dccCalendarMove;
    if(typeof current!=='function'||current.__dccCalendarSyncV143)return;
    const wrapped=function(){
      const result=current.apply(this,arguments);
      if(window.currentScreen==='calendar')queueMicrotask(forceMonthSync);
      return result;
    };
    wrapped.__dccCalendarSyncV143=true;
    wrapped.__dccCalendarSyncBase=current.__dccCalendarSyncBase||current;
    window.dccCalendarMove=wrapped;
  }

  function wrapShowCoach(){
    const current=window.showCoach;
    if(typeof current!=='function'||current.__dccCalendarSyncV143)return;
    const wrapped=function(screen){
      const result=current.apply(this,arguments);
      if(screen==='calendar')queueMicrotask(forceMonthSync);
      return result;
    };
    wrapped.__dccCalendarSyncV143=true;
    wrapped.__base=current;
    window.showCoach=wrapped;
  }

  function install(attempt=0){
    if(!window.__dccCoachCalendarV12||typeof window.dccCalendarSelect!=='function'){
      if(attempt<20)setTimeout(()=>install(attempt+1),100);
      return false;
    }

    wrapAsync('dccCalendarSaveSession');
    wrapAsync('dccCalendarDeleteSession');
    wrapMonthMove();
    wrapShowCoach();

    if(window.currentScreen==='calendar')queueMicrotask(forceMonthSync);
    return true;
  }

  window.dccCalendarForceMonthSync=forceMonthSync;
  install();
  document.addEventListener('DOMContentLoaded',()=>install(),{once:true});
  window.addEventListener('load',()=>install(),{once:true});
  window.addEventListener('pageshow',()=>{
    install();
    if(window.currentScreen==='calendar')queueMicrotask(forceMonthSync);
  });
})();
