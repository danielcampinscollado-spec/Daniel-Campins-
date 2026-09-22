/* DCC — acceso seguro Supabase Auth v1 (Google OAuth RC) */
(function(){
  'use strict';
  const BUILD='20260922-auth-light-premium1';
  if(window.__dccSecureAuth===BUILD)return;
  window.__dccSecureAuth=BUILD;

  const ROOT_ID='dcc-secure-auth-v1';
  const STATUS_ID='dcc-secure-auth-status';

  function database(){
    try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient}catch(_){}
    return window.supabaseClient||null;
  }
  function escapeHtml(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function status(message,type){const el=document.getElementById(STATUS_ID);if(!el)return;el.textContent=message||'';el.dataset.type=type||'info';}
  function setCurrentClient(id){try{currentClientId=id}catch(_){}try{window.currentClientId=id}catch(_){} }
  function isPreview(){const host=String(window.location.hostname||'').toLowerCase();return host.endsWith('.vercel.app')&&host!=='daniel-campins.vercel.app';}
  function authRedirectUrl(){const url=new URL(window.location.href);const share=url.searchParams.get('_vercel_share');url.search='';if(share)url.searchParams.set('_vercel_share',share);url.hash='';return url.toString();}

  function installStyles(){
    document.getElementById('dcc-secure-auth-css')?.remove();
    const style=document.createElement('style');style.id='dcc-secure-auth-css';style.textContent=`
      html.dcc-theme-light-premium body{background:#f6efe3!important;color:#17191d!important}
      #login.dcc-auth-light-ready{
        min-height:100dvh!important;width:100%!important;padding:18px 14px 30px!important;
        display:flex!important;align-items:flex-start!important;justify-content:center!important;
        background:
          radial-gradient(circle at 88% 4%,rgba(201,145,38,.14),transparent 24%),
          radial-gradient(circle at 6% 94%,rgba(201,145,38,.08),transparent 24%),
          linear-gradient(180deg,#fffaf1 0%,#f7f0e4 58%,#f2e9dc 100%)!important;
        box-sizing:border-box!important;
      }
      #login.dcc-auth-light-ready .login-box{
        width:100%!important;max-width:460px!important;margin:0 auto!important;padding:18px 14px 24px!important;
        background:transparent!important;border:0!important;border-radius:0!important;box-shadow:none!important;
      }
      #login.dcc-auth-light-ready .brand-logo{
        width:116px!important;height:auto!important;margin:8px auto 4px!important;display:flex!important;justify-content:center!important;align-items:center!important;
      }
      #login.dcc-auth-light-ready .brand-logo img{display:block!important;width:108px!important;height:auto!important;filter:none!important}
      #login.dcc-auth-light-ready .brand-line{
        width:52px!important;height:2px!important;margin:12px auto 20px!important;border-radius:999px!important;
        background:linear-gradient(90deg,#b77b16,#efc55c,#b77b16)!important;
      }
      #login.dcc-auth-light-ready .choices{display:none!important}

      #${ROOT_ID}{
        margin:0!important;padding:22px 18px 18px!important;border:1px solid rgba(184,124,22,.28)!important;border-radius:22px!important;
        background:rgba(255,254,250,.96)!important;
        box-shadow:0 14px 34px rgba(86,62,25,.08),inset 0 1px 0 rgba(255,255,255,.98)!important;
        color:#17191d!important;
      }
      #${ROOT_ID} .dcc-auth-kicker{
        color:#a96f0d!important;font-size:10px!important;font-weight:900!important;letter-spacing:2.4px!important;text-transform:uppercase!important;text-align:center!important;
      }
      #${ROOT_ID} h3{
        margin:9px 0 6px!important;color:#15171b!important;font-size:25px!important;line-height:1.12!important;letter-spacing:-.7px!important;text-align:center!important;
      }
      #${ROOT_ID} p{
        margin:0 0 16px!important;color:#737c8b!important;font-size:12px!important;line-height:1.5!important;text-align:center!important;
      }
      #${ROOT_ID} .dcc-google-auth{
        width:100%!important;height:50px!important;margin:4px 0 14px!important;border:1px solid #c9891c!important;border-radius:14px!important;
        background:linear-gradient(135deg,#f3d16e,#dca43a 72%,#c98617)!important;color:#17120a!important;
        font-weight:900!important;font-size:13px!important;box-shadow:0 8px 20px rgba(170,108,16,.16)!important;
      }
      #${ROOT_ID} .dcc-auth-divider{
        display:flex!important;align-items:center!important;gap:10px!important;margin:2px 0 13px!important;color:#8a92a0!important;
        font-size:9px!important;text-transform:uppercase!important;letter-spacing:1.3px!important;
      }
      #${ROOT_ID} .dcc-auth-divider:before,#${ROOT_ID} .dcc-auth-divider:after{content:"";height:1px;flex:1;background:#e4ded4}
      #${ROOT_ID} .dcc-auth-row{display:grid!important;grid-template-columns:minmax(0,1fr)!important;gap:8px!important;align-items:center!important}
      #${ROOT_ID} input{
        width:100%!important;height:48px!important;margin:0!important;padding:0 13px!important;border:1px solid #d6d4cf!important;border-radius:13px!important;
        background:#fffdfa!important;color:#17191d!important;-webkit-text-fill-color:#17191d!important;font-size:16px!important;box-shadow:none!important;outline:none!important;
      }
      #${ROOT_ID} input:focus{border-color:#d19a34!important;box-shadow:0 0 0 3px rgba(209,154,52,.11)!important}
      #${ROOT_ID} .dcc-email-send{
        width:100%!important;height:48px!important;padding:0 15px!important;border:1px solid rgba(189,129,23,.72)!important;border-radius:13px!important;
        background:#fff4dc!important;color:#8e5c08!important;font-weight:900!important;font-size:12px!important;white-space:nowrap!important;
      }
      #${ROOT_ID} button:disabled{opacity:.55!important;cursor:default!important}
      #${STATUS_ID}{min-height:18px!important;margin:10px 0 0!important;color:#7d8591!important;font-size:10px!important;text-align:center!important}
      #${STATUS_ID}[data-type="ok"]{color:#2e7a56!important}
      #${STATUS_ID}[data-type="error"]{color:#b43d3d!important}
      #${ROOT_ID} .dcc-auth-pending{
        margin-top:10px!important;padding:11px!important;border:1px solid rgba(184,124,22,.22)!important;border-radius:12px!important;
        background:#fff8e9!important;color:#5d6672!important;font-size:10px!important;line-height:1.45!important;text-align:left!important;
      }
      .dcc-secure-session-badge{
        position:fixed!important;right:12px!important;top:12px!important;z-index:65000!important;padding:7px 10px!important;
        border:1px solid rgba(185,126,22,.25)!important;border-radius:999px!important;background:rgba(255,253,248,.94)!important;color:#9e690d!important;
        font-size:8px!important;font-weight:850!important;letter-spacing:.7px!important;box-shadow:0 6px 18px rgba(75,53,20,.08)!important;
        backdrop-filter:blur(9px)!important;-webkit-backdrop-filter:blur(9px)!important;pointer-events:none!important;
      }
      @media(max-width:620px){
        #login.dcc-auth-light-ready{padding:8px 10px 24px!important}
        #login.dcc-auth-light-ready .login-box{max-width:100%!important;padding:12px 8px 20px!important}
        #login.dcc-auth-light-ready .brand-logo{margin-top:2px!important;width:104px!important}
        #login.dcc-auth-light-ready .brand-logo img{width:96px!important}
        #login.dcc-auth-light-ready .brand-line{margin:8px auto 14px!important}
        #${ROOT_ID}{padding:19px 15px 16px!important;border-radius:20px!important}
        #${ROOT_ID} h3{font-size:22px!important}
        #${ROOT_ID} p{font-size:11px!important}
      }
    `;document.head.appendChild(style);
  }

  function renderLogin(){
    installStyles();
    const login=document.getElementById('login');if(!login)return;
    login.classList.add('dcc-auth-light-ready');
    const box=login.querySelector('.login-box')||login.firstElementChild||login;
    const choices=box.querySelector('.choices');
    let section=document.getElementById(ROOT_ID);
    if(!section){
      section=document.createElement('section');section.id=ROOT_ID;
      section.innerHTML=`<div class="dcc-auth-kicker">Acceso seguro</div><h3>Entrar en DCC Fitness</h3><p>Accede con tu cuenta de Google o mediante un enlace seguro por email.</p><button id="dcc-google-auth" class="dcc-google-auth" type="button">Continuar con Google</button><div class="dcc-auth-divider">o por email</div><div class="dcc-auth-row"><input id="dcc-secure-auth-email" type="email" inputmode="email" autocomplete="email" placeholder="tu@email.com" aria-label="Email de acceso seguro"><button id="dcc-secure-auth-send" class="dcc-email-send" type="button">Enviar enlace</button></div><p id="${STATUS_ID}" aria-live="polite"></p>`;
      if(choices)box.insertBefore(section,choices);else box.appendChild(section);
      section.querySelector('#dcc-google-auth')?.addEventListener('click',requestGoogleLogin);
      section.querySelector('#dcc-secure-auth-send')?.addEventListener('click',requestMagicLink);
      section.querySelector('#dcc-secure-auth-email')?.addEventListener('keydown',e=>{if(e.key==='Enter')requestMagicLink()});
    }
  }

  async function requestGoogleLogin(){
    const db=database(),button=document.getElementById('dcc-google-auth');if(!db?.auth){status('Supabase Auth todavía no está disponible.','error');return}
    button.disabled=true;status('Abriendo acceso con Google…','info');
    try{const result=await db.auth.signInWithOAuth({provider:'google',options:{redirectTo:authRedirectUrl(),queryParams:{access_type:'offline',prompt:'select_account'}}});if(result.error)throw result.error;}
    catch(error){console.error('DCC Google Auth:',error);status(String(error?.message||'No se pudo iniciar el acceso con Google.'),'error');button.disabled=false;}
  }

  async function requestMagicLink(){
    const db=database(),input=document.getElementById('dcc-secure-auth-email'),button=document.getElementById('dcc-secure-auth-send'),email=String(input?.value||'').trim().toLowerCase();
    if(!db?.auth){status('Supabase Auth todavía no está disponible.','error');return}if(!email||!/^\S+@\S+\.\S+$/.test(email)){status('Introduce un email válido.','error');input?.focus();return}
    button.disabled=true;status('Enviando enlace seguro…','info');
    try{const result=await db.auth.signInWithOtp({email,options:{shouldCreateUser:true,emailRedirectTo:authRedirectUrl()}});if(result.error)throw result.error;status(isPreview()?'Enlace enviado para esta RC. El enlace debe volver a este mismo Preview.':'Enlace enviado. Abre el correo y pulsa el enlace para iniciar sesión.','ok');}
    catch(error){console.error('DCC Auth:',error);const msg=String(error?.message||'No se pudo enviar el enlace de acceso.');status(isPreview()?`No se envió el enlace RC: ${msg}`:msg,'error');}finally{button.disabled=false}
  }

  function sessionBadge(role){let badge=document.querySelector('.dcc-secure-session-badge');if(!badge){badge=document.createElement('div');badge.className='dcc-secure-session-badge';document.body.appendChild(badge)}badge.textContent=role==='coach'?'SESIÓN SEGURA · ENTRENADOR':'SESIÓN SEGURA · CLIENTE'}
  function showPending(user){renderLogin();const root=document.getElementById(ROOT_ID);if(!root)return;let pending=root.querySelector('.dcc-auth-pending');if(!pending){pending=document.createElement('div');pending.className='dcc-auth-pending';root.appendChild(pending)}pending.innerHTML=`Cuenta autenticada como <b>${escapeHtml(user?.email||'usuario')}</b>.<br>La cuenta existe correctamente, pero todavía falta asignarle el rol o vincularla a un cliente.`;status('Cuenta autenticada. Falta completar la vinculación.','ok')}
  async function routeSession(session){const db=database(),user=session?.user;if(!db||!user)return false;try{const {data:profile,error:profileError}=await db.from('app_profiles').select('role').eq('user_id',user.id).maybeSingle();if(profileError)throw profileError;if(profile?.role==='coach'){window.__dccSecureRole='coach';sessionBadge('coach');if(!(window.currentApp==='coach'&&document.getElementById('coach')?.style.display==='block')&&typeof window.openApp==='function'){try{window.dccTheme?.set('light-premium')}catch(_){}await window.openApp('coach')}return true}const {data:clientRow,error:clientError}=await db.from('clients').select('id').eq('auth_user_id',user.id).maybeSingle();if(clientError)throw clientError;let clientId=clientRow?.id||null;if(!clientId){const {data:claimedId,error:claimError}=await db.rpc('dcc_claim_client_access');if(claimError)throw claimError;clientId=claimedId||null}if(clientId){setCurrentClient(clientId);window.__dccSecureRole='client';sessionBadge('client');if(!(window.currentApp==='client'&&document.getElementById('client')?.style.display==='block')&&typeof window.openApp==='function')await window.openApp('client');return true}showPending(user);return false}catch(error){console.error('DCC Auth — resolviendo sesión:',error);status('La sesión existe, pero no se pudo resolver su acceso.','error');return false}}
  function patchLogout(){if(window.__dccSecureLogoutV1)return;const base=window.logout;window.logout=async function(){try{await database()?.auth?.signOut()}catch(error){console.warn('DCC Auth — cierre de sesión:',error)}document.querySelector('.dcc-secure-session-badge')?.remove();window.__dccSecureRole=null;if(typeof base==='function')return base.apply(this,arguments);document.getElementById('login')?.style.setProperty('display','flex');document.getElementById('client')?.style.setProperty('display','none');document.getElementById('coach')?.style.setProperty('display','none')};window.__dccSecureLogoutV1=true;}
  async function init(){renderLogin();patchLogout();const db=database();if(!db?.auth)return;try{const {data,error}=await db.auth.getSession();if(error)throw error;if(data?.session)await routeSession(data.session)}catch(error){console.warn('DCC Auth — sesión inicial:',error)}db.auth.onAuthStateChange((event,session)=>{if(event==='SIGNED_OUT'){document.querySelector('.dcc-secure-session-badge')?.remove();return}if(session)setTimeout(()=>routeSession(session),0)});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
