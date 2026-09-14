/* DCC — acceso seguro Supabase Auth v1 (fase de activación) */
(function(){
  'use strict';
  const BUILD='20260914-auth-premium-v5';
  if(window.__dccSecureAuth===BUILD)return;
  window.__dccSecureAuth=BUILD;

  const ROOT_ID='dcc-secure-auth-v1';
  const STATUS_ID='dcc-secure-auth-status';

  function database(){
    try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient}catch(_){}
    return window.supabaseClient||null;
  }

  function escapeHtml(value){
    return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  function status(message,type){
    const el=document.getElementById(STATUS_ID);if(!el)return;
    el.textContent=message||'';el.dataset.type=type||'info';
  }

  function setCurrentClient(id){try{currentClientId=id}catch(_){}try{window.currentClientId=id}catch(_){} }

  function isPreview(){
    const host=String(window.location.hostname||'').toLowerCase();
    return host.endsWith('.vercel.app')&&host!=='daniel-campins.vercel.app';
  }

  function authRedirectUrl(){
    const url=new URL(window.location.href);
    const share=url.searchParams.get('_vercel_share');
    url.search='';
    if(share)url.searchParams.set('_vercel_share',share);
    url.hash='';
    return url.toString();
  }

  function installStyles(){
    if(document.getElementById('dcc-secure-auth-css'))return;
    const style=document.createElement('style');style.id='dcc-secure-auth-css';style.textContent=`
      #${ROOT_ID}{margin:0 0 18px;padding:17px;border:1px solid rgba(240,201,107,.48);border-radius:20px;background:linear-gradient(145deg,rgba(240,201,107,.08),rgba(8,11,15,.74));box-shadow:inset 0 1px 0 rgba(255,255,255,.035)}
      #${ROOT_ID} .dcc-auth-kicker{color:#f0c96b;font-size:9px;font-weight:900;letter-spacing:1.5px;text-transform:uppercase}
      #${ROOT_ID} h3{margin:7px 0 5px;color:#f5f3ef;font-size:17px;letter-spacing:-.3px}
      #${ROOT_ID} p{margin:0 0 12px;color:#99a2ad;font-size:10px;line-height:1.5}
      #${ROOT_ID} .dcc-auth-stack{display:grid;gap:8px}
      #${ROOT_ID} .dcc-auth-divider{display:flex;align-items:center;gap:8px;margin:4px 0;color:#68717c;font-size:9px;font-weight:800;letter-spacing:.7px;text-transform:uppercase}
      #${ROOT_ID} .dcc-auth-divider:before,#${ROOT_ID} .dcc-auth-divider:after{content:"";height:1px;flex:1;background:#27303a}
      #${ROOT_ID} input{height:46px;margin:0;padding:0 12px;border:1px solid #35404a;border-radius:13px;background:#090d11;color:#fff;-webkit-text-fill-color:#fff;font-size:13px;box-shadow:none}
      #${ROOT_ID} input:focus{border-color:#e0b654;box-shadow:0 0 0 3px rgba(217,170,74,.09)}
      #${ROOT_ID} button{height:46px;padding:0 15px;border:1px solid #efcc72;border-radius:13px;background:linear-gradient(135deg,#f1ce70,#d9a63d);color:#151109;font-weight:900;font-size:11px;white-space:nowrap}
      #${ROOT_ID} button.dcc-auth-google{display:flex;align-items:center;justify-content:center;gap:9px;border-color:#d8dde3;background:#fff;color:#1f2328;font-size:12px}
      #${ROOT_ID} button.dcc-auth-google span{display:grid;place-items:center;width:21px;height:21px;border-radius:50%;border:1px solid #d9dde2;color:#4285f4;font-size:13px;font-weight:900;background:#fff}
      #${ROOT_ID} button.dcc-auth-secondary{height:40px;border-color:#37414b;background:#0b0f13;color:#b8c0c9;font-weight:800}
      #${ROOT_ID} button:disabled{opacity:.55;cursor:default}
      #${STATUS_ID}{min-height:16px;margin-top:9px!important;color:#9aa3ad!important}
      #${STATUS_ID}[data-type="ok"]{color:#78d7aa!important}#${STATUS_ID}[data-type="error"]{color:#ff8b8b!important}
      #${ROOT_ID} .dcc-auth-pending{margin-top:10px;padding:10px;border:1px solid rgba(240,201,107,.25);border-radius:12px;background:rgba(0,0,0,.2);color:#d7d9dd;font-size:10px;line-height:1.45}
      .dcc-secure-session-badge{position:fixed;right:14px;top:14px;z-index:65000;padding:7px 10px;border:1px solid rgba(240,201,107,.4);border-radius:999px;background:rgba(8,11,14,.88);color:#f0c96b;font-size:9px;font-weight:850;letter-spacing:.7px;backdrop-filter:blur(9px);-webkit-backdrop-filter:blur(9px);pointer-events:none}
      @media(max-width:620px){#${ROOT_ID} button{width:100%}}
    `;document.head.appendChild(style);
  }

  function renderLogin(){
    installStyles();
    const login=document.getElementById('login');if(!login||document.getElementById(ROOT_ID))return;
    const box=login.querySelector('.login-box')||login.firstElementChild||login;
    const choices=box.querySelector('.choices');
    const section=document.createElement('section');section.id=ROOT_ID;
    section.innerHTML=`<div class="dcc-auth-kicker">Acceso seguro</div><h3>Entrar</h3><p>Usa Google como acceso principal. La sesión quedará guardada en este dominio.</p><div class="dcc-auth-stack"><button id="dcc-secure-auth-google" class="dcc-auth-google" type="button"><span>G</span>Entrar con Google</button><div class="dcc-auth-divider">alternativa</div><input id="dcc-secure-auth-email" type="email" inputmode="email" autocomplete="username" placeholder="Email" aria-label="Email de acceso seguro"><input id="dcc-secure-auth-password" type="password" autocomplete="current-password" placeholder="Contraseña" aria-label="Contraseña"><button id="dcc-secure-auth-login" class="dcc-auth-secondary" type="button">Entrar con contraseña</button><button id="dcc-secure-auth-send" class="dcc-auth-secondary" type="button">Enviar enlace por correo</button></div><p id="${STATUS_ID}" aria-live="polite"></p>`;
    if(choices)box.insertBefore(section,choices);else box.appendChild(section);
    section.querySelector('#dcc-secure-auth-google')?.addEventListener('click',signInGoogle);
    section.querySelector('#dcc-secure-auth-login')?.addEventListener('click',signInPassword);
    section.querySelector('#dcc-secure-auth-send')?.addEventListener('click',requestMagicLink);
    section.querySelector('#dcc-secure-auth-email')?.addEventListener('keydown',e=>{if(e.key==='Enter')section.querySelector('#dcc-secure-auth-password')?.focus()});
    section.querySelector('#dcc-secure-auth-password')?.addEventListener('keydown',e=>{if(e.key==='Enter')signInPassword()});
  }

  async function signInGoogle(){
    const db=database();const button=document.getElementById('dcc-secure-auth-google');
    if(!db?.auth){status('Supabase Auth todavía no está disponible.','error');return}
    button.disabled=true;status('Abriendo Google…','info');
    try{
      const result=await db.auth.signInWithOAuth({provider:'google',options:{redirectTo:authRedirectUrl()}});
      if(result.error)throw result.error;
    }catch(error){
      console.error('DCC Auth — Google:',error);
      const raw=String(error?.message||'No se pudo iniciar sesión con Google.');
      status(raw,'error');
      button.disabled=false;
    }
  }

  async function signInPassword(){
    const db=database();const emailInput=document.getElementById('dcc-secure-auth-email');const passwordInput=document.getElementById('dcc-secure-auth-password');const button=document.getElementById('dcc-secure-auth-login');
    const email=String(emailInput?.value||'').trim().toLowerCase(),password=String(passwordInput?.value||'');
    if(!db?.auth){status('Supabase Auth todavía no está disponible.','error');return}
    if(!email||!/^\S+@\S+\.\S+$/.test(email)){status('Introduce un email válido.','error');emailInput?.focus();return}
    if(!password){status('Introduce tu contraseña.','error');passwordInput?.focus();return}
    button.disabled=true;status('Comprobando acceso…','info');
    try{
      const result=await db.auth.signInWithPassword({email,password});
      if(result.error)throw result.error;
      if(!result.data?.session)throw new Error('No se creó una sesión válida');
      await routeSession(result.data.session);
      status('Sesión iniciada correctamente.','ok');
    }catch(error){
      console.error('DCC Auth — contraseña:',error);
      const raw=String(error?.message||'No se pudo iniciar sesión.');
      const msg=/invalid login credentials/i.test(raw)?'Email o contraseña incorrectos.':raw;
      status(msg,'error');
      button.disabled=false;
    }
  }

  async function requestMagicLink(){
    const db=database();const input=document.getElementById('dcc-secure-auth-email');const button=document.getElementById('dcc-secure-auth-send');const email=String(input?.value||'').trim().toLowerCase();
    if(!db?.auth){status('Supabase Auth todavía no está disponible.','error');return}
    if(!email||!/^\S+@\S+\.\S+$/.test(email)){status('Introduce un email válido.','error');input?.focus();return}
    button.disabled=true;status('Enviando enlace seguro…','info');
    try{
      const redirectTo=authRedirectUrl();
      const result=await db.auth.signInWithOtp({email,options:{shouldCreateUser:false,emailRedirectTo:redirectTo}});
      if(result.error)throw result.error;
      status(isPreview()?'Enlace enviado. Debe volver a este mismo Preview.':'Enlace enviado. Abre el correo y pulsa el enlace.','ok');
    }catch(error){
      console.error('DCC Auth:',error);
      const msg=String(error?.message||'No se pudo enviar el enlace de acceso.');
      status(isPreview()?`No se envió el enlace RC: ${msg}`:msg,'error');
    }finally{button.disabled=false}
  }

  function sessionBadge(role){let badge=document.querySelector('.dcc-secure-session-badge');if(!badge){badge=document.createElement('div');badge.className='dcc-secure-session-badge';document.body.appendChild(badge)}badge.textContent=role==='coach'?'SESIÓN SEGURA · ENTRENADOR':'SESIÓN SEGURA · CLIENTE'}
  function showPending(user){renderLogin();const root=document.getElementById(ROOT_ID);if(!root)return;let pending=root.querySelector('.dcc-auth-pending');if(!pending){pending=document.createElement('div');pending.className='dcc-auth-pending';root.appendChild(pending)}pending.innerHTML=`Cuenta autenticada como <b>${escapeHtml(user?.email||'usuario')}</b>.<br>La cuenta existe correctamente, pero todavía falta asignarle el rol o vincularla a un cliente.`;status('Cuenta autenticada. Falta completar la vinculación.','ok')}

  async function routeSession(session){
    const db=database(),user=session?.user;if(!db||!user)return false;
    try{
      const {data:profile,error:profileError}=await db.from('app_profiles').select('role').eq('user_id',user.id).maybeSingle();if(profileError)throw profileError;
      if(profile?.role==='coach'){window.__dccSecureRole='coach';sessionBadge('coach');if(typeof window.openApp==='function')await window.openApp('coach');return true}
      const {data:clientRow,error:clientError}=await db.from('clients').select('id').eq('auth_user_id',user.id).maybeSingle();if(clientError)throw clientError;
      if(clientRow?.id){setCurrentClient(clientRow.id);window.__dccSecureRole='client';sessionBadge('client');if(typeof window.openApp==='function')await window.openApp('client');return true}
      showPending(user);return false;
    }catch(error){console.error('DCC Auth — resolviendo sesión:',error);status('La sesión existe, pero no se pudo resolver su acceso.','error');return false}
  }

  function patchLogout(){
    if(window.__dccSecureLogoutV1)return;const base=window.logout;
    window.logout=async function(){try{await database()?.auth?.signOut()}catch(error){console.warn('DCC Auth — cierre de sesión:',error)}document.querySelector('.dcc-secure-session-badge')?.remove();window.__dccSecureRole=null;if(typeof base==='function')return base.apply(this,arguments);document.getElementById('login')?.style.setProperty('display','flex');document.getElementById('client')?.style.setProperty('display','none');document.getElementById('coach')?.style.setProperty('display','none')};
    window.__dccSecureLogoutV1=true;
  }

  async function init(){
    renderLogin();patchLogout();const db=database();if(!db?.auth)return;
    try{const {data,error}=await db.auth.getSession();if(error)throw error;if(data?.session)await routeSession(data.session)}catch(error){console.warn('DCC Auth — sesión inicial:',error)}
    db.auth.onAuthStateChange((event,session)=>{if(event==='SIGNED_OUT'){document.querySelector('.dcc-secure-session-badge')?.remove();return}if(session)setTimeout(()=>routeSession(session),0)});
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
