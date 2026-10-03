/* DCC — autoridad atómica para alta de clientes + email de acceso seguro */
(function(){
  'use strict';
  if(window.__dccClientCreateAuthorityV3)return;
  window.__dccClientCreateAuthorityV3=true;

  const db=()=>{try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient}catch(_){ }return window.supabaseClient||null};
  const appData=()=>{try{return data||{}}catch(_){return window.data||{}}};
  const notify=text=>{try{if(typeof toast==='function')return toast(text)}catch(_){ }try{return window.toast?.(text)}catch(_){ }};
  const num=text=>{const n=parseFloat(String(text||'').trim().replace(',','.'));return Number.isFinite(n)?n:null};
  const validEmail=value=>/^\S+@\S+\.\S+$/.test(String(value||'').trim().toLowerCase());

  function injectAccessEmailField(){
    const root=document.getElementById('dcc-new-client-premium');
    if(!root||document.getElementById('new-access-email'))return;
    const nameField=document.getElementById('new-name')?.closest('.dcc-nc-field');
    if(!nameField)return;
    const label=document.createElement('label');
    label.className='dcc-nc-field';
    label.innerHTML='<span class="dcc-nc-label"><span>Email de acceso</span></span><input class="dcc-nc-input" id="new-access-email" type="email" inputmode="email" autocomplete="email" placeholder="cliente@email.com"><span style="display:block;margin-top:6px;color:#7f8994;font-size:9px;line-height:1.35">Este será el email que el cliente usará para entrar con su enlace seguro.</span>';
    nameField.insertAdjacentElement('afterend',label);
    if(!document.getElementById('new-trial-duration')){
      const trial=document.createElement('label');
      trial.className='dcc-nc-field';
      trial.innerHTML='<span class="dcc-nc-label"><span>Acceso inicial</span></span><div class="dcc-nc-select-wrap"><select class="dcc-nc-select" id="new-trial-duration"><option value="">Cliente normal</option><option value="7d">Prueba · 7 días</option><option value="15d">Prueba · 15 días</option><option value="1m">Prueba · 1 mes</option></select></div><span style="display:block;margin-top:6px;color:#7f8994;font-size:9px;line-height:1.35">Las pruebas reciben acceso Complete y el cuestionario completo.</span>';
      label.insertAdjacentElement('afterend',trial);
    }
  }

  async function createClientAtomic(){
    const name=document.getElementById('new-name')?.value.trim()||'';
    const accessEmail=document.getElementById('new-access-email')?.value.trim().toLowerCase()||'';
    const trialDuration=document.getElementById('new-trial-duration')?.value||'';
    if(!name){notify('Introduce el nombre y apellidos');return}
    if(!validEmail(accessEmail)){notify('Introduce un email de acceso válido');return}
    const database=db();if(!database){notify('No se pudo conectar con la base de datos');return}
    const button=document.getElementById('dcc-create-client-btn');
    if(button?.dataset.dccCreating==='1')return;
    if(button){button.dataset.dccCreating='1';button.disabled=true;button.innerHTML='Creando cliente…'}
    const id='client_'+Date.now();
    try{
      const rpc=trialDuration?'dcc_create_trial_client_access':'dcc_create_client_access';
      const args=trialDuration?{p_id:id,p_name:name,p_access_email:accessEmail,p_trial_duration:trialDuration}:{p_id:id,p_name:name,p_access_email:accessEmail};
      const {data:ok,error}=await database.rpc(rpc,args);
      if(error||ok!==true)throw error||new Error('Alta no confirmada');
      const redirectUrl=new URL('https://dccfitness.com/');redirectUrl.searchParams.set('dcc_activate','1');const redirectTo=redirectUrl.toString();
      const {error:mailError}=await database.auth.signInWithOtp({email:accessEmail,options:{emailRedirectTo:redirectTo,shouldCreateUser:true}});
      if(mailError)throw Object.assign(new Error('Cliente creado, pero no se pudo enviar el enlace de acceso'),{cause:mailError,dccMail:true});
      if(typeof window.dccSyncClientsFromServer==='function')await window.dccSyncClientsFromServer({render:false});
      else if(typeof window.loadClientsFromSupabase==='function')await window.loadClientsFromSupabase();
      try{if(typeof closeModal==='function')closeModal();else window.closeModal?.()}catch(_){}
      window.selectedClient='';window.__dccClientAdminId='';
      if(typeof window.showCoach==='function')window.showCoach('clients');
      notify(trialDuration?'Prueba creada · Complete activado · enlace enviado':'Acceso creado · enlace enviado al correo');
    }catch(error){
      console.error('DCC alta mínima de cliente:',error);
      const message=String(error?.message||'').toLowerCase();
      notify(error?.dccMail?'Cliente creado, pero falló el envío del enlace':message.includes('duplicate')||String(error?.code||'')==='23505'?'Ese email de acceso ya está asignado a otro cliente':message.includes('forbidden')?'Tu sesión de entrenador ha caducado. Vuelve a iniciar sesión.':'No se pudo guardar el cliente');
      if(button){button.dataset.dccCreating='0';button.disabled=false;button.innerHTML='Crear cliente <span>→</span>'}
    }
  }

  async function resendClientAccess(clientId){
    const id=String(clientId||window.selectedClient||window.__dccClientAdminId||'').trim();
    if(!id){notify('Selecciona un cliente');return false}
    const database=db();if(!database){notify('No se pudo conectar con la base de datos');return false}
    try{
      const {data:rows,error}=await database.from('clients').select('access_email,password_setup_completed').eq('id',id).limit(1);
      if(error)throw error;
      const row=Array.isArray(rows)?rows[0]:null,email=String(row?.access_email||'').trim().toLowerCase();
      if(!validEmail(email))throw new Error('El cliente no tiene un email de acceso válido');
      const redirectTo='https://dccfitness.com/?dcc_activate=1';
      const {error:mailError}=row?.password_setup_completed===true
        ? await database.auth.resetPasswordForEmail(email,{redirectTo})
        : await database.auth.signInWithOtp({email,options:{emailRedirectTo:redirectTo,shouldCreateUser:true}});
      if(mailError)throw mailError;
      notify('Nuevo enlace de acceso enviado');
      return true;
    }catch(error){console.error('DCC reenviar acceso:',error);notify('No se pudo enviar el nuevo enlace');return false}
  }
  window.dccResendClientAccess=resendClientAccess;

  function installResendButton(){
    if(window.__dccResendAccessButtonV1)return;
    window.__dccResendAccessButtonV1=true;
    document.addEventListener('click',function(event){
      const b=event.target?.closest?.('[data-dcc-resend-access]');
      if(!b)return;
      event.preventDefault();event.stopImmediatePropagation();
      window.dccResendClientAccess?.(b.dataset.dccResendAccess);
    },true);
    const inject=()=>{
      const id=String(window.selectedClient||window.__dccClientAdminId||'').trim();
      if(!id)return;
      const c=typeof window.client==='function'?window.client(id):null;
      if(!c||c.password_setup_completed===true)return;
      const host=document.querySelector('#coach-main .client-actions, #coach-main .client-header, #coach-main .section-actions, #coach-main');
      if(!host||host.querySelector('[data-dcc-resend-access]'))return;
      const b=document.createElement('button');b.type='button';b.className='btn secondary';b.dataset.dccResendAccess=id;b.textContent='Reenviar acceso';host.prepend(b);
    };
    new MutationObserver(()=>queueMicrotask(inject)).observe(document.body,{childList:true,subtree:true});
    setInterval(inject,1200);
  }

  function installCreate(){
    window.createClient=createClientAtomic;
    window.createClient.__dccAtomicCreateV3=true;
  }

  function installNewClient(){
    const current=window.newClient;
    if(typeof current!=='function'||current.__dccAccessEmailV3)return false;
    const wrapped=function(){
      const out=current.apply(this,arguments);
      queueMicrotask(injectAccessEmailField);
      requestAnimationFrame(injectAccessEmailField);
      setTimeout(injectAccessEmailField,0);
      setTimeout(injectAccessEmailField,80);
      return out;
    };
    wrapped.__dccAccessEmailV3=true;
    wrapped.__base=current;
    window.newClient=wrapped;
    return true;
  }

  function installCreateButtonAuthority(){
    if(window.__dccClientCreateClickAuthorityV3)return;
    window.__dccClientCreateClickAuthorityV3=true;
    document.addEventListener('click',function(event){
      const button=event.target?.closest?.('#dcc-create-client-btn');
      if(!button)return;
      event.preventDefault();
      event.stopImmediatePropagation();
      createClientAtomic();
    },true);
  }

  function observeNewClientModal(){
    if(window.__dccClientCreateModalObserverV3)return;
    window.__dccClientCreateModalObserverV3=true;
    const observer=new MutationObserver(()=>injectAccessEmailField());
    observer.observe(document.documentElement,{childList:true,subtree:true});
  }

  function install(){installCreate();installNewClient();installCreateButtonAuthority();installResendButton();observeNewClientModal();injectAccessEmailField()}
  install();
  document.addEventListener('DOMContentLoaded',install,{once:true});
  window.addEventListener('load',install,{once:true});
  window.addEventListener('pageshow',install);
  setTimeout(install,250);
  setTimeout(install,1000);
  setTimeout(install,2200);
})();
