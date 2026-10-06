/* DCC — message media bridge v1 */
(function(){
'use strict';
const BUCKET='message-attachments';
function db(){try{return supabaseClient||window.supabaseClient}catch(_){return window.supabaseClient||null}}
function safeName(v){return String(v||'file').replace(/[^a-zA-Z0-9._-]/g,'_').slice(-80)}
function uid(){return Date.now()+'-'+Math.random().toString(36).slice(2,10)}
async function signed(path){const c=db();if(!c||!path)return null;const r=await c.storage.from(BUCKET).createSignedUrl(path,3600);if(r.error)throw r.error;return r.data?.signedUrl||null}
async function upload(clientId,file,type){const c=db();if(!c||!clientId||!file)throw new Error('Archivo no disponible');const path=String(clientId)+'/'+uid()+'-'+safeName(file.name||((type==='audio'?'audio':'image')+'.bin'));const r=await c.storage.from(BUCKET).upload(path,file,{contentType:file.type||undefined,upsert:false});if(r.error)throw r.error;return {type,path,name:file.name||'',mime:file.type||'',size:file.size||0}}
window.dccMessageMedia={bucket:BUCKET,signed,upload};
})();
