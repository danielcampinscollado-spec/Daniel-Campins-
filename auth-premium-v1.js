/* DCC — acceso seguro Supabase Auth v1 (fase de activación) */
(function(){
  'use strict';
  if(window.__dccSecureAuthV1)return;
  window.__dccSecureAuthV1=true;

  const ROOT_ID='dcc-secure-auth-v1';
  const STATUS_ID='dcc-secure-auth-status';

  function database(){
    try{
      if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient;
    }catch(_){}
    return window.supabaseClient||null;
  }

  function escapeHtml(value){
    return String(value??'').replace(/[&<>"']/g,c=>({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[c]));
  }

  function status(message,type){
    const el=document.getElementById(STATUS_ID);
    if(!el)return;
    el.textContent=message||'';
    el.dataset.type=type||'info';
  }

  function setCurrentClient(id){
    try{currentClientId=id}catch(_){}
    try{window.currentClientId=id}catch(_){}
  }

  function installStyles(){
    if(document.getElementById('dcc-secure-auth-css'))return;
    const style=document.createElement('style');
    style.id='dcc-secure-auth-css';
    style.textContent=`
      #${ROOT_ID}{margin:0 0 18px;padding:17px;border:1px solid rgba(240,201,107,.48);border-radius:20px;background:linear-gradient(145deg,rgba(240,201,107,.08),rgba(8,11,15,.74));box-shadow:inset 0 1px 0 rgba(255,255,255,.035)}
      #${ROOT_ID} .dcc-auth-kicker{color:#f0c96b;font-size:9px;font-weight:900;letter-spacing:1.5px;text-transform:uppercase}
      #${ROOT_ID} h3{margin:7px 0 5px;color:#f5f3ef;font-size:17px;letter-spacing:-.3px}
      #${ROOT_ID} p{margin:0 0 12px;color:#99a2ad;font-size:10px;line-height:1.5}
      #${ROOT_ID} .dcc-auth-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;align-items:center}
      #${ROOT_ID} input{height:46px;margin:0;padding:0 12px;border:1px solid #35404a;border-radius:13px;background:#090d11;color:#fff;-webkit-text-fill-color:#fff;font-size:13px;box-shadow:none}
      #${ROOT_ID} input:focus{border-color:#e0b654;box-shadow:0 0 0 3px rgba(217,170,74,.09)}
      #${ROOT_ID} button{height:46px;padding:0 15px;border:1px solid #efcc72;border-radius:13px;background:linear-gradient(135deg,#f1ce70,#d9a63d);color:#151109;font-weight:900;font-size:11px;white-space:nowrap}
      #${ROOT_ID} button:disabled{opacity:.55;cursor:default}
      #${STATUS_ID}{min-height:16px;margin-top:9px!important;color:#9aa3ad!important}
      #${STATUS_ID}[data-type="ok"]{color:#78d7aa!important}
      #${STATUS_ID}[data-type="error"]{color:#ff8b8b!important}
      #${ROOT_ID} .dcc-auth-pending{margin-top:10px;padding:10px;border:1px solid rgba(240,201,107,.25);border-radius:12px;background:rgba(0,0,0,.2);color:#d7d9dd;font-size:10px;line-height:1.45}
      .dcc-secure-session-badge{position:fixed;right:14px;top:14px;z-index:65000;padding:7px 10px;border:1px solid rgba(240,201,107,.4);border-radius:999px;background:rgba(8,11,14,.88);color:#f0c96b;font-size:9px;font-weight:850;letter-spacing:.7px;backdrop-filter:blur(9px);-webkit-backdrop-filter:blur(9px);pointer-events:none}
      @media(max-width:620px){#${ROOT_ID} .dcc-auth-row{grid-template-columns:1fr}#${ROOT_ID} button{width:100%}}
    `;
    document.head.appendChild(style);
  }

  function renderLogin(){
    installStyles();
    const login=document.getElementById('login');
    if(!login||document.getElementById(ROOT_ID))return;
    const box=login.querySelector('.login-box')||login.firstElementChild||login;
    const choices=box.querySelector('.choices');
    const section=document.createElement('section');
    section.id=ROOT_ID;
    section.innerHTML=`
      <div class="dcc-auth-kicker">Acceso seguro · fase de activación</div>
      <h3>Entrar con Supabase Auth</h3>
      <p>Introduce tu email y recibirás un enlace de acceso de un solo uso. El acceso actual sigue disponible temporalmente mientras terminamos la migración.</p>
      <div class="dcc-auth-row">
        <input id="dcc-secure-auth-email" type="email" inputmode="email" autocomplete="email" placeholder="tu@email.com" aria-label="Email de acceso seguro">
        <button id="dcc-secure-auth-send" type="button">Enviar enlace</button>
      </div>
      <p id="${STATUS_ID}" aria-live="polite"></p>
    `;
    if(choices)box.insertBefore(section,choices);
    else box.appendChild(section);

    section.querySelector('#dcc-secure-auth-send')?.addEventListener('click',requestMagicLink);
    section.querySelector('#dcc-secure-auth-email')?.addEventListener('keydown',event=>{
      if(event.key==='Enter')requestMagicLink();
    });
  }

  async function requestMagicLink(){
    const db=database();
    const input=document.getElementById('dcc-secure-auth-email');
    const button=document.getElementById('dcc-secure-auth-send');
    const email=String(input?.value||'').trim().toLowerCase();
    if(!db?.auth){status('Supabase Auth todavía no está disponible.','error');return}
    if(!email||!/^\S+@\S+\.\S+$/.test(email)){status('Introduce un email válido.','error');input?.focus();return}

    button.disabled=true;
    status('Enviando enlace seguro…','info');
    try{
      const redirectTo=window.location.origin+window.location.pathname;
      let result=await db.auth.signInWithOtp({
        email,
        options:{shouldCreateUser:true,emailRedirectTo:redirectTo}
      });
      if(result.error&&/redirect/i.test(String(result.error.message||''))){
        result=await db.auth.signInWithOtp({email,options:{shouldCreateUser:true}});
      }
      if(result.error)throw result.error;
      status('Enlace enviado. Abre el correo y pulsa el enlace para iniciar sesión.','ok');
    }catch(error){
      console.error('DCC Auth:',error);
      status(error?.message||'No se pudo enviar el enlace de acceso.','error');
    }finally{
      button.disabled=false;
    }
  }

  function sessionBadge(role){
    let badge=document.querySelector('.dcc-secure-session-badge');
    if(!badge){badge=document.createElement('div');badge.className='dcc-secure-session-badge';document.body.appendChild(badge)}
    badge.textContent=role==='coach'?'SESIÓN SEGURA · ENTRENADOR':'SESIÓN SEGURA · CLIENTE';
  }

  function showPending(user){
    renderLogin();
    const root=document.getElementById(ROOT_ID);
    if(!root)return;
    let pending=root.querySelector('.dcc-auth-pending');
    if(!pending){pending=document.createElement('div');pending.className='dcc-auth-pending';root.appendChild(pending)}
    pending.innerHTML=`Cuenta autenticada como <b>${escapeHtml(user?.email||'usuario')}</b>.<br>La cuenta existe correctamente, pero todavía falta asignarle el rol o vincularla a un cliente.`;
    status('Cuenta autenticada. Falta completar la vinculación.','ok');
  }

  async function routeSession(session){
    const db=database();
    const user=session?.user;
    if(!db||!user)return false;

    try{
      const {data:profile,error:profileError}=await db
        .from('app_profiles')
        .select('role')
        .eq('user_id',user.id)
        .maybeSingle();
      if(profileError)throw profileError;

      if(profile?.role==='coach'){
        window.__dccSecureRole='coach';
        sessionBadge('coach');
        if(typeof window.openApp==='function')await window.openApp('coach');
        return true;
      }

      const {data:clientRow,error:clientError}=await db
        .from('clients')
        .select('id')
        .eq('auth_user_id',user.id)
        .maybeSingle();
      if(clientError)throw clientError;

      if(clientRow?.id){
        setCurrentClient(clientRow.id);
        window.__dccSecureRole='client';
        sessionBadge('client');
        if(typeof window.openApp==='function')await window.openApp('client');
        return true;
      }

      showPending(user);
      return false;
    }catch(error){
      console.error('DCC Auth — resolviendo sesión:',error);
      status('La sesión existe, pero no se pudo resolver su acceso.','error');
      return false;
    }
  }

  function patchLogout(){
    if(window.__dccSecureLogoutV1)return;
    const base=window.logout;
    window.logout=async function(){
      try{await database()?.auth?.signOut()}catch(error){console.warn('DCC Auth — cierre de sesión:',error)}
      document.querySelector('.dcc-secure-session-badge')?.remove();
      window.__dccSecureRole=null;
      if(typeof base==='function')return base.apply(this,arguments);
      document.getElementById('login')?.style.setProperty('display','flex');
      document.getElementById('client')?.style.setProperty('display','none');
      document.getElementById('coach')?.style.setProperty('display','none');
    };
    window.__dccSecureLogoutV1=true;
  }

  async function init(){
    renderLogin();
    patchLogout();
    const db=database();
    if(!db?.auth)return;

    try{
      const {data,error}=await db.auth.getSession();
      if(error)throw error;
      if(data?.session)await routeSession(data.session);
    }catch(error){console.warn('DCC Auth — sesión inicial:',error)}

    db.auth.onAuthStateChange((event,session)=>{
      if(event==='SIGNED_OUT'){
        document.querySelector('.dcc-secure-session-badge')?.remove();
        return;
      }
      if(session)setTimeout(()=>routeSession(session),0);
    });
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
