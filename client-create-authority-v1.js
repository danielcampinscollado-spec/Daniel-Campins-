/* DCC — autoridad atómica para alta de clientes + email de acceso seguro */
(function(){
  'use strict';
  if(window.__dccClientCreateAuthorityV2)return;
  window.__dccClientCreateAuthorityV2=true;

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
    const weight=num(document.getElementById('new-weight')?.value);
    const age=parseInt(document.getElementById('new-age')?.value||'',10);
    const height=num(document.getElementById('new-height')?.value);
    const bodyFat=num(document.getElementById('new-body-fat')?.value);
    const goal=document.getElementById('new-goal')?.value.trim()||'';
    const foodsToAvoid=document.getElementById('new-foods-avoid')?.value.trim()||'';

    if(!name||!accessEmail||weight===null||!Number.isInteger(age)||height===null||bodyFat===null||!goal){notify('Completa todos los campos');return}
    if(!validEmail(accessEmail)){notify('Introduce un email de acceso válido');return}
    if(weight<=0||weight>=500){notify('Introduce un peso válido');return}
    if(age<10||age>100){notify('Introduce una edad válida');return}
    if(height<100||height>250){notify('Introduce una altura válida');return}
    if(bodyFat<=0||bodyFat>=70){notify('Introduce un porcentaje de grasa válido');return}

    const database=db();
    if(!database){notify('No se pudo conectar con la base de datos');return}
    const button=document.getElementById('dcc-create-client-btn');
    if(button){button.disabled=true;button.innerHTML='Creando cliente…'}

    const id='client_'+Date.now();
    try{
      const {data:ok,error}=await database.rpc('dcc_create_client',{
        p_id:id,
        p_name:name,
        p_goal:goal,
        p_weight:weight,
        p_initial_body_fat:bodyFat,
        p_age:age,
        p_height_cm:height,
        p_foods_to_avoid:foodsToAvoid,
        p_access_email:accessEmail
      });
      if(error||ok!==true)throw error||new Error('Alta no confirmada');

      if(typeof window.dccSyncClientsFromServer==='function')await window.dccSyncClientsFromServer({render:false});
      else if(typeof window.loadClientsFromSupabase==='function')await window.loadClientsFromSupabase();

      const d=appData();
      d.weights=d.weights||{};d.weights[id]=[weight];
      d.bodyFatHistory=d.bodyFatHistory||{};d.bodyFatHistory[id]=[{bodyFat,body_fat:bodyFat,recorded_at:new Date().toISOString()}];
      d.checkins=d.checkins||{};d.checkins[id]={weight:String(weight).replace('.',',')+' kg',bodyFat,body_fat:bodyFat,diet:'Pendiente',training:'Pendiente',energy:'Pendiente',comment:'Pendiente de revisión.',reviewed:false};
      d.diets=d.diets||{};d.diets[id]={training:{calories:'',protein:'',meals:[]},rest:{calories:'',protein:'',meals:[]}};
      d.routines=d.routines||{};d.routines[id]=[];
      d.messages=d.messages||{};d.messages[id]=[];

      try{if(typeof closeModal==='function')closeModal();else window.closeModal?.()}catch(_){ }
      window.selectedClient=id;
      window.__dccClientAdminId=id;
      if(typeof window.dccClientAdmin==='function')window.dccClientAdmin(id,'summary');
      else if(typeof window.openClient==='function')window.openClient(id);
      else if(typeof window.showCoach==='function')window.showCoach('clients');
      notify('Cliente creado correctamente');
    }catch(error){
      console.error('DCC alta atómica de cliente:',error);
      const duplicate=String(error?.message||'').toLowerCase().includes('duplicate')||String(error?.code||'')==='23505';
      notify(duplicate?'Ese email de acceso ya está asignado a otro cliente':'No se pudo guardar el cliente');
      if(button){button.disabled=false;button.innerHTML='Crear cliente <span>→</span>'}
    }
  }

  function installCreate(){
    window.createClient=createClientAtomic;
    window.createClient.__dccAtomicCreateV2=true;
  }

  function installNewClient(){
    const current=window.newClient;
    if(typeof current!=='function'||current.__dccAccessEmailV2)return false;
    const wrapped=function(){
      const out=current.apply(this,arguments);
      queueMicrotask(injectAccessEmailField);
      requestAnimationFrame(injectAccessEmailField);
      return out;
    };
    wrapped.__dccAccessEmailV2=true;
    wrapped.__base=current;
    window.newClient=wrapped;
    return true;
  }

  function install(){installCreate();installNewClient();injectAccessEmailField()}
  install();
  document.addEventListener('DOMContentLoaded',install,{once:true});
  window.addEventListener('load',install,{once:true});
  window.addEventListener('pageshow',install);
  setTimeout(install,250);
  setTimeout(install,1000);
  setTimeout(install,2200);
})();
