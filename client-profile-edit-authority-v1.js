/* DCC — autoridad server-first para editar clientes */
(function(){
  'use strict';
  const BUILD='20260913-client-profile-edit-authority-v3';
  if(window.__dccClientProfileEditAuthority===BUILD)return;
  window.__dccClientProfileEditAuthority=BUILD;

  const STYLE_ID='dcc-client-profile-edit-authority-css';
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const num=v=>{const n=parseFloat(String(v??'').replace(',','.'));return Number.isFinite(n)?n:null};

  function db(){try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient}catch(_){}return window.supabaseClient||null}
  function appData(){try{return data||{}}catch(_){return window.data||{}}}
  function notify(msg){try{if(typeof toast==='function')return toast(msg);if(typeof window.toast==='function')return window.toast(msg)}catch(_){}alert(msg)}
  function currentId(){return window.__dccClientAdminId??window.selectedClient??null}
  function localClient(id){return (appData().clients||[]).find(c=>String(c.id)===String(id))||null}

  function css(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');s.id=STYLE_ID;s.textContent=`
      .dcc-client-edit-authority-btn{border:1px solid #d7ae55!important;border-radius:999px!important;background:linear-gradient(135deg,#fffaf0,#f4e6bf)!important;color:#7a5415!important;padding:9px 13px!important;font-size:11px!important;font-weight:850!important}
      .dcc-cea-overlay{position:fixed;inset:0;z-index:100000;display:flex;align-items:flex-end;justify-content:center;padding:18px;background:rgba(27,24,18,.34);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}
      .dcc-cea-card{width:min(680px,100%);max-height:88dvh;overflow:auto;padding:22px;border:1px solid #e3c782;border-radius:28px;background:#fffaf2;color:#17191d;box-shadow:0 24px 70px rgba(64,46,16,.24)}
      .dcc-cea-head{display:grid;grid-template-columns:minmax(0,1fr) 42px;gap:12px;align-items:start;margin-bottom:18px}.dcc-cea-head h2{margin:0;font-size:25px}.dcc-cea-head p{margin:5px 0 0;color:#817869;font-size:11px}.dcc-cea-close{width:42px;height:42px;border:1px solid #ddbf74;border-radius:50%;background:#fffaf2;color:#8b641c;font-size:24px}
      .dcc-cea-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.dcc-cea-field{display:grid;gap:7px}.dcc-cea-field.full{grid-column:1/-1}.dcc-cea-field label{font-size:12px;font-weight:800;color:#746b5d}.dcc-cea-field input,.dcc-cea-field textarea,.dcc-cea-field select{width:100%;margin:0!important;padding:13px 14px!important;border:1px solid #dfca98!important;border-radius:14px!important;background:#fff!important;color:#17191d!important;-webkit-text-fill-color:#17191d!important;font-size:16px!important;outline:none!important;box-shadow:none!important}.dcc-cea-field textarea{min-height:88px;resize:vertical}.dcc-cea-field select{height:50px}
      .dcc-cea-actions{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:18px}.dcc-cea-cancel,.dcc-cea-save{min-height:49px;border-radius:14px;font-weight:900}.dcc-cea-cancel{border:1px solid #d8c9aa;background:#fff;color:#312f2b}.dcc-cea-save{border:1px solid #e3b74c;background:linear-gradient(135deg,#f9d76d,#e9b93e);color:#18140a}.dcc-cea-save:disabled{opacity:.6}
      .dcc-cea-loading{padding:24px 4px;text-align:center;color:#817869;font-size:13px}
      @media(max-width:560px){.dcc-cea-grid{grid-template-columns:1fr}.dcc-cea-field.full{grid-column:auto}.dcc-cea-card{padding:18px;border-radius:24px}.dcc-cea-head h2{font-size:22px}}
    `;document.head.appendChild(s);
  }

  function close(){document.querySelector('.dcc-cea-overlay')?.remove()}

  async function fetchProfile(id){
    const database=db();if(!database)throw new Error('No hay conexión con Supabase');
    const [clientRes,fatRes]=await Promise.all([
      database.from('clients').select('id,name,goal,weight,age,height_cm,foods_to_avoid').eq('id',String(id)).maybeSingle(),
      database.from('client_body_fat_history').select('body_fat,recorded_at').eq('client_id',String(id)).order('recorded_at',{ascending:false}).limit(1)
    ]);
    if(clientRes.error)throw clientRes.error;
    if(!clientRes.data)throw new Error('No se encontró el cliente');
    if(fatRes.error)throw fatRes.error;
    return {...clientRes.data,body_fat:Array.isArray(fatRes.data)&&fatRes.data.length?fatRes.data[0].body_fat:null};
  }

  function goalOptions(current){
    const options=['Pérdida de grasa','Recomposición corporal','Ganancia muscular','Mantenimiento','Mejorar rendimiento'];
    const value=String(current||'');
    if(value&&!options.includes(value))options.unshift(value);
    return options.map(x=>`<option value="${esc(x)}"${x===value?' selected':''}>${esc(x)}</option>`).join('');
  }

  function renderForm(overlay,p){
    overlay.innerHTML=`<div class="dcc-cea-card" role="dialog" aria-modal="true">
      <div class="dcc-cea-head"><div><h2>Editar cliente</h2><p>Modifica solo lo que necesites. Los datos actuales ya están cargados.</p></div><button type="button" class="dcc-cea-close" aria-label="Cerrar">×</button></div>
      <div class="dcc-cea-grid">
        <div class="dcc-cea-field full"><label>Nombre y apellidos</label><input id="dcc-cea-name" value="${esc(p.name)}"></div>
        <div class="dcc-cea-field"><label>Edad</label><input id="dcc-cea-age" inputmode="numeric" type="number" min="10" max="100" value="${p.age??''}"></div>
        <div class="dcc-cea-field"><label>Altura (cm)</label><input id="dcc-cea-height" inputmode="decimal" type="number" min="100" max="250" step="0.1" value="${p.height_cm??''}"></div>
        <div class="dcc-cea-field"><label>Peso actual (kg)</label><input id="dcc-cea-weight" inputmode="decimal" type="number" min="20" max="500" step="0.1" value="${p.weight??''}"></div>
        <div class="dcc-cea-field"><label>% de grasa actual</label><input id="dcc-cea-fat" inputmode="decimal" type="number" min="1" max="69" step="0.1" value="${p.body_fat??''}"></div>
        <div class="dcc-cea-field full"><label>Objetivo</label><select id="dcc-cea-goal"><option value="">Sin definir</option>${goalOptions(p.goal)}</select></div>
        <div class="dcc-cea-field full"><label>Alimentos a evitar</label><textarea id="dcc-cea-foods">${esc(p.foods_to_avoid||'')}</textarea></div>
      </div>
      <div class="dcc-cea-actions"><button type="button" class="dcc-cea-cancel">Cancelar</button><button type="button" class="dcc-cea-save">Guardar cambios</button></div>
    </div>`;
    overlay.querySelector('.dcc-cea-close').onclick=close;
    overlay.querySelector('.dcc-cea-cancel').onclick=close;
    overlay.querySelector('.dcc-cea-save').onclick=()=>save(String(p.id),p,overlay);
  }

  async function open(idArg){
    css();
    const id=String(idArg??currentId()??'');
    if(!id)return;
    close();
    const overlay=document.createElement('div');overlay.className='dcc-cea-overlay';
    overlay.innerHTML='<div class="dcc-cea-card"><div class="dcc-cea-loading">Cargando datos actuales del cliente…</div></div>';
    document.body.appendChild(overlay);
    overlay.addEventListener('click',e=>{if(e.target===overlay)close()});
    try{renderForm(overlay,await fetchProfile(id))}
    catch(error){console.error('DCC editar cliente — cargar:',error);close();notify('No se pudieron cargar los datos actuales del cliente')}
  }

  async function save(id,original,overlay){
    const name=overlay.querySelector('#dcc-cea-name')?.value.trim()||'';
    const age=num(overlay.querySelector('#dcc-cea-age')?.value);
    const height=num(overlay.querySelector('#dcc-cea-height')?.value);
    const weight=num(overlay.querySelector('#dcc-cea-weight')?.value);
    const fat=num(overlay.querySelector('#dcc-cea-fat')?.value);
    const goal=overlay.querySelector('#dcc-cea-goal')?.value.trim()||'';
    const foods=overlay.querySelector('#dcc-cea-foods')?.value.trim()||'';
    if(!name){notify('El nombre no puede quedar vacío');return}
    if(age!=null&&(age<10||age>100)){notify('Revisa la edad');return}
    if(height!=null&&(height<100||height>250)){notify('Revisa la altura');return}
    if(weight!=null&&(weight<=0||weight>500)){notify('Revisa el peso');return}
    if(fat!=null&&(fat<=0||fat>=70)){notify('Revisa el porcentaje de grasa');return}
    const database=db();if(!database){notify('No hay conexión con Supabase');return}
    const button=overlay.querySelector('.dcc-cea-save');button.disabled=true;button.textContent='Guardando…';
    try{
      const {data:ok,error}=await database.rpc('dcc_update_client_profile',{
        p_client_id:id,p_name:name,p_goal:goal,p_age:age==null?null:Math.round(age),p_height_cm:height,p_foods_to_avoid:foods,p_weight:weight,p_body_fat:fat
      });
      if(error)throw error;if(ok!==true)throw new Error('El servidor no confirmó la actualización');

      const d=appData();
      const local=localClient(id);
      if(local){
        local.name=name;local.goal=goal;local.age=age==null?null:Math.round(age);local.height_cm=height;local.height=height;local.foods_to_avoid=foods;local.foodsToAvoid=foods;
        if(weight!=null)local.weight=weight;
        if(fat!=null)local.bodyFat=fat;
      }
      const now=new Date().toISOString();
      if(weight!=null&&Number(weight)!==Number(original.weight)){
        d.weights=d.weights||{};
        d.weights[id]=Array.isArray(d.weights[id])?d.weights[id]:[];
        d.weights[id].push({weight,recorded_at:now});
      }
      if(fat!=null&&Number(fat)!==Number(original.body_fat)){
        d.bodyFatHistory=d.bodyFatHistory||{};
        d.bodyFatHistory[id]=Array.isArray(d.bodyFatHistory[id])?d.bodyFatHistory[id]:[];
        d.bodyFatHistory[id].push({body_fat:fat,recorded_at:now});
      }
      try{if(typeof window.saveData==='function')window.saveData();else if(typeof saveData==='function')saveData()}catch(_){}
      close();
      if(typeof window.dccClientAdmin==='function')window.dccClientAdmin(id,'summary');
      notify('Cliente actualizado correctamente');
    }catch(error){
      console.error('DCC editar cliente — guardar:',error);
      notify('No se pudieron guardar los cambios');
      button.disabled=false;button.textContent='Guardar cambios';
    }
  }

  function inject(idArg){
    css();
    const main=document.querySelector('#coach-main.dcc-ca');
    const head=main?.querySelector('.dcc-ca-head');
    if(!main||!head)return;
    const id=String(idArg??currentId()??'');if(!id)return;
    let actions=main.querySelector('.dcc-ca-profile-actions');
    if(!actions){actions=document.createElement('div');actions.className='dcc-ca-profile-actions';actions.style.cssText='display:flex;gap:8px;align-items:center;margin:8px 2px 12px;flex-wrap:wrap';head.insertAdjacentElement('afterend',actions)}
    let button=actions.querySelector('.dcc-client-edit-authority-btn');
    if(!button){button=document.createElement('button');button.type='button';button.className='dcc-client-edit-authority-btn';button.textContent='Editar cliente';actions.prepend(button)}
    button.onclick=()=>open(id);
    actions.querySelectorAll('.dcc-ca-edit-client').forEach(old=>{if(old!==button)old.style.display='none'});
  }

  function install(){
    const base=window.dccClientAdmin;
    if(typeof base==='function'&&!base.__dccClientProfileEditAuthority){
      const wrapped=function(id,tab){const result=base.apply(this,arguments);requestAnimationFrame(()=>inject(id));return result};
      wrapped.__dccClientProfileEditAuthority=true;wrapped.__base=base;window.dccClientAdmin=wrapped;
    }
    if(document.querySelector('#coach-main.dcc-ca'))inject();
  }

  window.dccOpenClientProfileEditor=open;
  install();
  let tries=0;const timer=setInterval(()=>{tries++;install();if(window.dccClientAdmin?.__dccClientProfileEditAuthority||tries>80)clearInterval(timer)},100);
  document.addEventListener('DOMContentLoaded',install,{once:true});
  window.addEventListener('pageshow',install);
})();
