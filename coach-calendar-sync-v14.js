/* DCC calendar sync v14.4 — sincroniza datos sin cambiar la vista elegida */
(function(){
  'use strict';
  if(window.__dccCalendarSyncV144)return;
  window.__dccCalendarSyncV144=true;
  const cache=window.__dccCalendarSessionsByMonth=window.__dccCalendarSessionsByMonth||{};
  let syncing=false,pending=false;
  function database(){try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient}catch(_){}return window.supabaseClient||null}
  function monthDate(){if(Number.isFinite(window.__dccCalendarMonthTs))return new Date(window.__dccCalendarMonthTs);const d=new Date();d.setDate(1);d.setHours(12,0,0,0);return d}
  function monthKey(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`}
  async function forceMonthSync(){
    if(window.currentScreen!=='calendar')return false;
    if(syncing){pending=true;return false}
    const db=database();if(!db)return false;
    syncing=true;pending=false;
    const m=monthDate(),key=monthKey(m),first=`${key}-01`,next=new Date(m.getFullYear(),m.getMonth()+1,1,12),nextKey=`${next.getFullYear()}-${String(next.getMonth()+1).padStart(2,'0')}-01`;
    try{
      const {data:rows,error}=await db.from('coach_calendar_sessions').select('id,client_id,session_date,session_time,session_type,notes,created_at').gte('session_date',first).lt('session_date',nextKey).order('session_date',{ascending:true}).order('session_time',{ascending:true});
      if(error)throw error;
      cache[key]=rows||[];
      if(window.currentScreen==='calendar'&&monthKey(monthDate())===key&&typeof window.dccRenderCoachCalendarV12==='function')window.dccRenderCoachCalendarV12(false);
      return true;
    }catch(error){console.error('DCC sincronización agenda v14.4:',error);return false}
    finally{syncing=false;if(pending&&window.currentScreen==='calendar'){pending=false;queueMicrotask(forceMonthSync)}}
  }
  function wrapAsync(name){const current=window[name];if(typeof current!=='function'||current.__dccCalendarSyncV144)return;const wrapped=async function(){const result=await current.apply(this,arguments);if(window.currentScreen==='calendar')await forceMonthSync();return result};wrapped.__dccCalendarSyncV144=true;window[name]=wrapped}
  function wrapMonthMove(){const current=window.dccCalendarMove;if(typeof current!=='function'||current.__dccCalendarSyncV144)return;const wrapped=function(){const result=current.apply(this,arguments);if(window.currentScreen==='calendar')queueMicrotask(forceMonthSync);return result};wrapped.__dccCalendarSyncV144=true;window.dccCalendarMove=wrapped}
  function install(attempt=0){if(!window.__dccCoachCalendarV12||typeof window.dccRenderCoachCalendarV12!=='function'){if(attempt<20)setTimeout(()=>install(attempt+1),100);return false}wrapAsync('dccCalendarSaveSession');wrapAsync('dccCalendarDeleteSession');wrapMonthMove();if(window.currentScreen==='calendar')queueMicrotask(forceMonthSync);return true}
  document.addEventListener('dcc:coach-screen',e=>{if(e.detail?.screen==='calendar')queueMicrotask(forceMonthSync)});
  window.dccCalendarForceMonthSync=forceMonthSync;
  install();document.addEventListener('DOMContentLoaded',()=>install(),{once:true});window.addEventListener('load',()=>install(),{once:true});window.addEventListener('pageshow',()=>{install();if(window.currentScreen==='calendar')queueMicrotask(forceMonthSync)});
})();