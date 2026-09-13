/* DCC — gestión segura del email de acceso desde la ficha del entrenador */
(function(){
  'use strict';
  if(window.__dccClientAccessCoachV1)return;
  window.__dccClientAccessCoachV1=true;

  const db=()=>{try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient}catch(_){ }return window.supabaseClient||null};
  const appData=()=>{try{return data||{}}catch(_){return window.data||{}}};
  const client=id=>(appData().clients||[]).find(c=>String(c.id)===String(id))||null;
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const notify=text=>{try{if(typeof toast==='function')return toast(text)}catch(_){ }try{return window.toast?.(text)}catch(_){ }};
  const validEmail=value=>/^\S+@\S+\.\S+$/.test(String(value||'').trim().toLowerCase());

  function injectCss(){
    if(document.getElementById('dcc-client-access-coach-v1-css'))return;
    const s=document.createElement('style');s.id='dcc-client-access-coach-v1-css';s.textContent=`
      #coach-main .dcc-access-card{margin-top:10px;padding:15px;border:1px solid rgba(224,173,76,.45);border-radius:20px;background:linear-gradient(145deg,#10161b,#080b0e)}
      #coach-main .dcc-access-card h2{margin:0;color:#f4f1eb;font-size:18px}
      #coach-main .dcc-access-card p{margin:6px 0 12px;color:#8f98a3;font-size:10px;line-height:1.45}
      #coach-main .dcc-access-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px}
      #coach-main .dcc-access-row input{min-width:0;height:44px;padding:0 12px;border:1px solid #35404a;border-radius:13px;background:#090d11;color:#fff;-webkit-text-fill-color:#fff;outline:0;font-size:13px}
      #coach-main .dcc-access-row button{height:44px;padding:0 14px;border:1px solid #efcc72;border-radius:13px;background:linear-gradient(135deg,#f1ce70,#d9a63d);color:#151109;font-size:10px;font-weight:900}
      #coach-main .dcc-access-state{display:inline-flex;margin-top:10px;padding:6px 9px;border:1px solid rgba(224,173,76,.28);border-radius:999px;color:#d9aa4a;font-size:8px;font-weight:800;letter-spacing:.5px}
      #coach-main .dcc-access-state.ok{border-color:rgba(72,201,142,.34);color:#65d9a0}
      html.dcc-theme-light-premium body #coach-main .dcc-access-card{background:linear-gradient(145deg,#fffefa,#f8f0e3)!important;color:#17191d!important;border-color:rgba(183,123,19,.27)!important}
      html.dcc-theme-light-premium body #coach-main .dcc-access-card h2{color:#17191d!important}
      html.dcc-theme-light-premium body #coach-main .dcc-access-card p{color:#707987!important}
      html.dcc-theme-light-premium body #coach-main .dcc-access-row input{background:#fffefa!important;color:#17191d!important;-webkit-text-fill-color:#17191d!important;border-color:rgba(183,123,19,.28)!important}
      @media(max-width:520px){#coach-main .dcc-access-row{grid-template-columns:1fr}#coach-main .dcc-access-row button{width:100%}}
    `;document.head.appendChild(s);
  }

  function patch(id){
    injectCss();
    const c=client(id),root=document.querySelector('#coach-main .dcc-ca-wrap');
    if(!c||!root)return;
    root.querySelector('.dcc-access-card')?.remove();
    const card=document.createElement('section');card.className='dcc-access-card';
    const linked=!!c.auth_user_id;
    card.innerHTML=`<h2>Acceso del cliente</h2><p>Asigna el email que este cliente utilizará para entrar con su enlace seguro. Si cambias el email de una cuenta ya vinculada, la vinculación anterior se revocará.</p><div class="dcc-access-row"><input id="dccClientAccessEmailV1" type="email" inputmode="email" autocomplete="email" value="${esc(c.access_email||'')}" placeholder="cliente@email.com"><button type="button" onclick="dccSaveClientAccessEmailV1('${esc(id)}')">Guardar acceso</button></div><span class="dcc-access-state ${linked?'ok':''}">${linked?'CUENTA VINCULADA':'PENDIENTE DE VINCULACIÓN'}</span>`;
    const firstCard=root.querySelector('.dcc-ca-card');
    if(firstCard)firstCard.insertAdjacentElement('afterend',card);else root.appendChild(card);
  }

  window.dccSaveClientAccessEmailV1=async function(id){
    const c=client(id),input=document.getElementById('dccClientAccessEmailV1'),email=String(input?.value||'').trim().toLowerCase(),database=db();
    if(!c||!database){notify('No se pudo preparar el acceso');return}
    if(!validEmail(email)){notify('Introduce un email válido');input?.focus();return}
    try{
      const {data:ok,error}=await database.rpc('dcc_set_client_access_email',{p_client_id:id,p_access_email:email});
      if(error||ok!==true)throw error||new Error('Cambio no confirmado');
      const changed=String(c.access_email||'').trim().toLowerCase()!==email;
      c.access_email=email;
      if(changed)c.auth_user_id=null;
      notify('Email de acceso guardado');
      patch(id);
    }catch(error){
      console.error('DCC guardando email de acceso:',error);
      const duplicate=String(error?.message||'').toLowerCase().includes('duplicate')||String(error?.code||'')==='23505';
      notify(duplicate?'Ese email ya está asignado a otro cliente':'No se pudo guardar el email de acceso');
    }
  };

  function install(){
    const current=window.dccClientAdmin;
    if(typeof current!=='function'||current.__dccClientAccessCoachV1)return false;
    const wrapped=function(id,tab){
      const out=current.apply(this,arguments);
      requestAnimationFrame(()=>patch(id));
      return out;
    };
    wrapped.__dccClientAccessCoachV1=true;
    wrapped.__base=current;
    window.dccClientAdmin=wrapped;
    return true;
  }

  injectCss();install();
  document.addEventListener('DOMContentLoaded',install,{once:true});
  window.addEventListener('load',install,{once:true});
  window.addEventListener('pageshow',install);
  setTimeout(install,300);setTimeout(install,1200);setTimeout(install,2400);
})();
