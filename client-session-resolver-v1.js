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
// Expose the resolver for explicit recovery only. auth-premium-v1.js owns
// automatic session routing, so this module must not register a competing
// getSession/onAuthStateChange bootstrap.
window.dccResolveClientSession=resolve;
})();