/* DCC calendar sync v14 — fuerza la agenda a reflejar Supabase sin cache obsoleta */
(function(){
  'use strict';
  if(window.__dccCalendarSyncV14)return;
  window.__dccCalendarSyncV14=true;

  const cache=window.__dccCalendarSessionsByMonth=window.__dccCalendarSessionsByMonth||{};
  let syncing=false;

  function database(){
    try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient}catch(e){}
    return window.supabaseClient||null;
  }
  function monthDate(){
    if(Number.isFinite(window.__dccCalendarMonthTs))return new Date(window.__dccCalendarMonthTs);
    const d=new Date();d.setDate(1);d.setHours(12,0,0,0);return d;
  }
  function selectedDate(){
    if(window.__dccCalendarSelected){const d=new Date(window.__dccCalendarSelected+'T12:00:00');if(Number.isFinite(d.getTime()))return d}
    return new Date();
  }
  function monthKey(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`}

  async function forceMonthSync(){
    if(syncing||window.currentScreen!=='calendar')return;
    const db=database();if(!db)return;
    syncing=true;
    const m=monthDate(),key=monthKey(m);
    const first=`${key}-01`;
    const next=new Date(m.getFullYear(),m.getMonth()+1,1,12);
    const nextKey=`${next.getFullYear()}-${String(next.getMonth()+1).padStart(2,'0')}-01`;
    try{
      const {data:rows,error}=await db.from('coach_calendar_sessions')
        .select('id,client_id,session_date,session_time,session_type,notes,created_at')
        .gte('session_date',first)
        .lt('session_date',nextKey)
        .order('session_date',{ascending:true})
        .order('session_time',{ascending:true});
      if(error)throw error;
      cache[key]=rows||[];

      const sel=selectedDate();
      const redraw=window.dccCalendarSelect?.__dccCalendarSyncBase||window.dccCalendarSelect;
      if(typeof redraw==='function'&&window.currentScreen==='calendar'){
        redraw(sel.getFullYear(),sel.getMonth(),sel.getDate());
      }
    }catch(e){
      console.error('DCC sincronización agenda v14:',e);
    }finally{
      syncing=false;
    }
  }

  function wrapAsync(name){
    const current=window[name];
    if(typeof current!=='function'||current.__dccCalendarSyncV14)return;
    const wrapped=async function(){
      const result=await current.apply(this,arguments);
      if(window.currentScreen==='calendar')await forceMonthSync();
      return result;
    };
    wrapped.__dccCalendarSyncV14=true;
    wrapped.__dccCalendarSyncBase=current;
    window[name]=wrapped;
  }

  function wrapImmediate(name){
    const current=window[name];
    if(typeof current!=='function'||current.__dccCalendarSyncV14)return;
    const wrapped=function(){
      const result=current.apply(this,arguments);
      if(window.currentScreen==='calendar')setTimeout(forceMonthSync,0);
      return result;
    };
    wrapped.__dccCalendarSyncV14=true;
    wrapped.__dccCalendarSyncBase=current;
    window[name]=wrapped;
  }

  function install(attempt){
    if(!window.__dccCoachCalendarV12||typeof window.dccCalendarSelect!=='function'){
      if((attempt||0)<50)setTimeout(()=>install((attempt||0)+1),80);
      return;
    }
    wrapAsync('dccCalendarSaveSession');
    wrapAsync('dccCalendarDeleteSession');
    wrapImmediate('dccCalendarSelect');
    wrapImmediate('dccCalendarMove');
    wrapImmediate('dccCalendarSetView');

    const show=window.showCoach;
    if(typeof show==='function'&&!show.__dccCalendarSyncV14){
      const wrapped=function(screen){
        const result=show.apply(this,arguments);
        if(screen==='calendar')setTimeout(forceMonthSync,0);
        return result;
      };
      wrapped.__dccCalendarSyncV14=true;
      wrapped.__base=show;
      window.showCoach=wrapped;
    }

    if(window.currentScreen==='calendar')setTimeout(forceMonthSync,0);
  }

  install(0);
  window.addEventListener('pageshow',()=>setTimeout(()=>{install(0);forceMonthSync()},100));
})();
