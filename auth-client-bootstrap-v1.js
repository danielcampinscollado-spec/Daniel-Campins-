/* DCC — bootstrap independiente de Supabase Auth.
   Garantiza window.supabaseClient antes del flujo de acceso, sin depender
   del script principal de la aplicación. */
(function(){
  'use strict';
  const BUILD='20260922-auth-bootstrap2';
  if(window.__dccAuthClientBootstrap===BUILD)return;
  window.__dccAuthClientBootstrap=BUILD;

  const URL='https://khrhfurdlbqnlthlkhhp.supabase.co';
  const KEY='sb_publishable_Dhr67diGFP22g8PKdmUg9A_jbn2EyNZ';

  function create(){
    try{
      if(window.supabaseClient?.auth)return true;
      if(!window.supabase?.createClient)return false;
      window.supabaseClient=window.supabase.createClient(URL,KEY,{
        auth:{
          persistSession:true,
          autoRefreshToken:true,
          // DCC controla explícitamente el retorno OAuth/Magic Link en index.html.
          // Evita que supabase-js inicialice en paralelo y que Safari quede
          // esperando initializePromise antes de que la app pueda pintar.
          detectSessionInUrl:false,
          skipAutoInitialize:true
        }
      });
      window.__dccAuthBootstrapReady=true;
      return !!window.supabaseClient?.auth;
    }catch(error){
      window.__dccAuthBootstrapError=String(error?.message||error);
      console.error('DCC auth bootstrap:',error);
      return false;
    }
  }

  if(create())return;

  // Reintento corto por si Safari termina de evaluar el bundle justo después.
  let tries=0;
  const timer=setInterval(function(){
    tries++;
    if(create()||tries>=40){
      clearInterval(timer);
      if(!window.supabaseClient?.auth && !window.__dccAuthBootstrapError){
        window.__dccAuthBootstrapError='El SDK de autenticación no llegó a inicializarse.';
      }
    }
  },100);
})();
