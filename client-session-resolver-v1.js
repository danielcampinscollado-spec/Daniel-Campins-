/* DCC — resolución estable de sesión cliente. */
(function(){
'use strict';if(window.__dccClientSessionResolverV1)return;window.__dccClientSessionResolverV1=true;
const db=()=>window.supabaseClient||null;
const setId=id=>{try{currentClientId=id}catch(_){}window.currentClientId=id};
async function resolve(session){
 const database=db(),user=session?.user;if(!database||!user||window.__dccSecureRole==='coach')return false;
 const {data:id,error}=await database.rpc('dcc_claim_client_access');
 if(error){console.error('DCC resolver cliente:',error);return false}
 if(!id)return false;
 setId(String(id));window.__dccSecureRole='client';
 return true;
}
window.dccResolveClientSession=resolve;
async function boot(){const database=db();if(!database?.auth)return;const {data}=await database.auth.getSession();if(data?.session)await resolve(data.session);database.auth.onAuthStateChange((event,session)=>{if(session&&event!=='SIGNED_OUT')setTimeout(()=>resolve(session),0)})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();