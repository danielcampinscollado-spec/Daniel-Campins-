/* DCC — lectura de % de grasa actual para área cliente; no reescribe check-ins */
(function(){
  'use strict';
  const BUILD='20260913-body-fat-authority-v2';
  if(window.__dccBodyFatAuthority===BUILD)return;
  window.__dccBodyFatAuthority=BUILD;

  function db(){try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient}catch(_){}return window.supabaseClient||null}
  function appData(){try{return data||window.data||{}}catch(_){return window.data||{}}}

  async function loadLatestBodyFat(){
    const database=db(),d=appData();if(!database||!d)return false;
    const {data:rows,error}=await database.from('client_body_fat_history').select('client_id,body_fat,recorded_at').order('recorded_at',{ascending:false});if(error)throw error;
    const latest=new Map(),history={};
    (rows||[]).forEach(row=>{const id=String(row.client_id),value=Number(row.body_fat);if(!Number.isFinite(value))return;history[id]=history[id]||[];history[id].push({bodyFat:value,body_fat:value,recordedAt:row.recorded_at,recorded_at:row.recorded_at});if(!latest.has(id))latest.set(id,value)});
    d.bodyFatHistory=history;
    (d.clients||[]).forEach(client=>{const id=String(client.id);if(!latest.has(id))return;const value=latest.get(id);client.bodyFat=value;client.body_fat=value;client.currentBodyFat=value;client.latestBodyFat=value});
    return true;
  }

  window.dccLoadLatestBodyFat=loadLatestBodyFat;

  function install(){
    const base=window.openApp;if(typeof base!=='function')return false;if(base.__dccBodyFatAuthority===BUILD)return true;
    const wrapped=async function(app){
      const result=await base.apply(this,arguments);if(result===false)return result;
      if(app!=='client')return result;
      try{await loadLatestBodyFat();const screen=typeof currentScreen==='string'?currentScreen:window.currentScreen;if(typeof window.showClient==='function'&&['home','progress','checkin'].includes(screen))window.showClient(screen)}catch(error){console.error('DCC body fat client read:',error)}
      return result;
    };
    wrapped.__dccBodyFatAuthority=BUILD;wrapped.__base=base;window.openApp=wrapped;return true;
  }

  install();document.addEventListener('DOMContentLoaded',install,{once:true});window.addEventListener('pageshow',install);
})();
