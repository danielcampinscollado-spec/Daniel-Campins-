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
  }

  async function createClientAtomic(){
    const name=document.getElementById('new-name')?.value.trim()||'';
    const accessEmail=document.getElementById('new-access-email')?.value.trim().toLowerCase()||'';
    if(!name){notify('Introduce el nombre y apellidos');return}
    if(!validEmail(accessEmail)){notify('Introduce un email de acceso válido');return}
    const database=db();if(!database){notify('No se pudo conectar con la base de datos');return}
    const button=document.getElementById('dcc-create-client-btn');
    if(button?.dataset.dccCreating==='1')return;
    if(button){button.dataset.dccCreating='1';button.disabled=true;button.innerHTML='Creando cliente…'}
    const id='client_'+Date.now();
    try{
      const {data:ok,error}=await database.rpc('dcc_create_client_access',{p_id:id,p_name:name,p_access_email:accessEmail});
      if(error||ok!==true)throw error||new Error('Alta no confirmada');
      const redirectTo=location.origin+location.pathname;
      const {error:mailError}=await database.auth.signInWithOtp({email:accessEmail,options:{emailRedirectTo:redirectTo,shouldCreateUser:true}});
      if(mailError)throw Object.assign(new Error('Cliente creado, pero no se pudo enviar el enlace de acceso'),{cause:mailError,dccMail:true});
      if(typeof window.dccSyncClientsFromServer==='function')await window.dccSyncClientsFromServer({render:false});
      else if(typeof window.loadClientsFromSupabase==='function')await window.loadClientsFromSupabase();
      try{if(typeof closeModal==='function')closeModal();else window.closeModal?.()}catch(_){}
      window.selectedClient='';window.__dccClientAdminId='';
      if(typeof window.showCoach==='function')window.showCoach('clients');
      notify('Acceso creado · enlace enviado al correo');
    }catch(error){
      console.error('DCC alta mínima de cliente:',error);
      const message=String(error?.message||'').toLowerCase();
      notify(error?.dccMail?'Cliente creado, pero falló el envío del enlace':message.includes('duplicate')||String(error?.code||'')==='23505'?'Ese email de acceso ya está asignado a otro cliente':message.includes('forbidden')?'Tu sesión de entrenador ha caducado. Vuelve a iniciar sesión.':'No se pudo guardar el cliente');
      if(button){button.dataset.dccCreating='0';button.disabled=false;button.innerHTML='Crear cliente <span>→</span>'}
    }
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

  function install(){installCreate();installNewClient();installCreateButtonAuthority();observeNewClientModal();injectAccessEmailField()}
  install();
  document.addEventListener('DOMContentLoaded',install,{once:true});
  window.addEventListener('load',install,{once:true});
  window.addEventListener('pageshow',install);
  setTimeout(install,250);
  setTimeout(install,1000);
  setTimeout(install,2200);
})();
