/* DCC — editor de cliente estable: acciones solo en Resumen, sin MutationObserver global */
(function(){
  'use strict';
  const BUILD='20260914-client-profile-editor-v2';
  if(window.__dccClientProfileEditorV2===BUILD)return;
  window.__dccClientProfileEditorV2=BUILD;
  window.__dccClientProfileEditorV1=true;

  const getData=()=>{try{return data||{}}catch(e){return window.data||{}}};
  const getDb=()=>{try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient}catch(e){}return window.supabaseClient||null};
  const notify=t=>{try{if(typeof toast==='function')return toast(t);if(typeof window.toast==='function')return window.toast(t)}catch(e){}alert(t)};
  const num=v=>{const n=parseFloat(String(v??'').replace(',','.'));return Number.isFinite(n)?n:null};
  const norm=v=>String(v||'').replace(/\s+/g,' ').trim().toLowerCase();

  function currentClient(){
    const id=window.selectedClient??window.__dccClientAdminId;if(id==null)return null;
    return (getData().clients||[]).find(c=>String(c.id)===String(id))||null;
  }
  function currentWeight(id,client){
    const arr=getData().weights?.[id];
    if(Array.isArray(arr)&&arr.length){const last=arr[arr.length-1];const n=num(typeof last==='object'?(last.weight??last.value):last);if(n!=null)return n}
    return num(client?.weight??client?.initial_weight)??'';
  }
  function currentFat(client){return num(client?.bodyFat??client?.body_fat??client?.fat??client?.fatPct??client?.fat_pct??client?.grasa??client?.porcentajeGrasa??client?.initial_body_fat)??''}

  function ensureCss(){
    if(document.getElementById('dcc-client-profile-editor-css'))return;
    const s=document.createElement('style');s.id='dcc-client-profile-editor-css';s.textContent=`
      .dcc-summary-actions-bottom{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:18px 0 2px;padding-top:15px;border-top:1px solid rgba(177,119,18,.16)}
      .dcc-summary-actions-bottom .dcc-ca-edit-client,.dcc-summary-actions-bottom .dcc-ca-delete{width:100%!important;height:44px!important;margin:0!important;padding:8px 12px!important;border-radius:14px!important;font-size:11px!important;font-weight:850!important;box-shadow:none!important}
      .dcc-summary-actions-bottom .dcc-ca-edit-client{border:1px solid #d7ae55!important;background:linear-gradient(135deg,#fffaf0,#f4e6bf)!important;color:#7a5415!important}
      .dcc-summary-actions-bottom .dcc-ca-delete{border:1px solid #e3b8ba!important;background:#fff5f5!important;color:#b0444a!important}
      .dcc-cpe-overlay{position:fixed;inset:0;z-index:100000;background:rgba(27,24,18,.28);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);display:flex;align-items:flex-end;justify-content:center;padding:18px}
      .dcc-cpe-card{width:min(680px,100%);max-height:88vh;overflow:auto;background:#fffaf2;border:1px solid #e3c782;border-radius:28px;padding:22px;box-shadow:0 24px 70px rgba(64,46,16,.24)}
      .dcc-cpe-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:18px}.dcc-cpe-head h2{margin:0;color:#17191d;font-size:25px}.dcc-cpe-close{width:42px;height:42px;border-radius:50%;border:1px solid #ddbf74;background:#fffaf2;color:#8b641c;font-size:24px}
      .dcc-cpe-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.dcc-cpe-field{display:grid;gap:7px}.dcc-cpe-field.full{grid-column:1/-1}.dcc-cpe-field label{font-size:12px;font-weight:800;color:#746b5d}.dcc-cpe-field input,.dcc-cpe-field textarea{width:100%;border:1px solid #dfca98;border-radius:14px;background:#fff;color:#17191d;padding:13px 14px;font-size:16px;outline:none}.dcc-cpe-field textarea{min-height:92px;resize:vertical}
      .dcc-cpe-actions{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:18px}.dcc-cpe-cancel,.dcc-cpe-save{padding:13px;border-radius:14px;font-weight:900}.dcc-cpe-cancel{border:1px solid #d8c9aa;background:#fff;color:#312f2b}.dcc-cpe-save{border:1px solid #e3b74c;background:linear-gradient(135deg,#f9d76d,#e9b93e);color:#18140a}
      html:not(.dcc-theme-light-premium) .dcc-summary-actions-bottom .dcc-ca-edit-client{background:#151109!important;color:#f0c96b!important;border-color:#8c692b!important}
      html:not(.dcc-theme-light-premium) .dcc-summary-actions-bottom .dcc-ca-delete{background:#12090b!important;color:#ff6870!important;border-color:#6f272b!important}
      @media(max-width:560px){.dcc-cpe-grid{grid-template-columns:1fr}.dcc-cpe-field.full{grid-column:auto}.dcc-cpe-card{padding:18px;border-radius:24px}.dcc-cpe-head h2{font-size:22px}.dcc-summary-actions-bottom .dcc-ca-edit-client,.dcc-summary-actions-bottom .dcc-ca-delete{height:42px!important;font-size:10px!important}}
    `;(document.head||document.documentElement).appendChild(s);
  }

  function close(){document.querySelector('.dcc-cpe-overlay')?.remove()}
  function open(){
    ensureCss();const client=currentClient();if(!client)return;const id=String(client.id);close();
    const overlay=document.createElement('div');overlay.className='dcc-cpe-overlay';overlay.innerHTML=`<div class="dcc-cpe-card" role="dialog" aria-modal="true"><div class="dcc-cpe-head"><h2>Editar cliente</h2><button class="dcc-cpe-close" type="button">×</button></div><div class="dcc-cpe-grid"><div class="dcc-cpe-field full"><label>Nombre</label><input id="dcc-cpe-name" value="${String(client.name??'').replace(/"/g,'&quot;')}"></div><div class="dcc-cpe-field"><label>Edad</label><input id="dcc-cpe-age" type="number" min="10" max="100" value="${client.age??''}"></div><div class="dcc-cpe-field"><label>Altura (cm)</label><input id="dcc-cpe-height" type="number" min="100" max="250" step="0.1" value="${client.height_cm??client.height??''}"></div><div class="dcc-cpe-field"><label>Peso actual (kg)</label><input id="dcc-cpe-weight" type="number" min="20" max="400" step="0.1" value="${currentWeight(id,client)}"></div><div class="dcc-cpe-field"><label>% de grasa actual</label><input id="dcc-cpe-fat" type="number" min="2" max="69" step="0.1" value="${currentFat(client)}"></div><div class="dcc-cpe-field full"><label>Alimentos que no quiere / debe evitar</label><textarea id="dcc-cpe-foods">${String(client.foods_to_avoid??client.foodsToAvoid??'').replace(/</g,'&lt;')}</textarea></div></div><div class="dcc-cpe-actions"><button class="dcc-cpe-cancel" type="button">Cancelar</button><button class="dcc-cpe-save" type="button">Guardar cambios</button></div></div>`;
    document.body.appendChild(overlay);overlay.querySelector('.dcc-cpe-close').onclick=close;overlay.querySelector('.dcc-cpe-cancel').onclick=close;overlay.addEventListener('click',e=>{if(e.target===overlay)close()});overlay.querySelector('.dcc-cpe-save').onclick=()=>saveProfile(id,client,overlay);
  }
  async function saveProfile(id,client,overlay){
    const database=getDb();if(!database){notify('No hay conexión con el servidor');return}
    const name=overlay.querySelector('#dcc-cpe-name').value.trim(),age=num(overlay.querySelector('#dcc-cpe-age').value),height=num(overlay.querySelector('#dcc-cpe-height').value),weight=num(overlay.querySelector('#dcc-cpe-weight').value),fat=num(overlay.querySelector('#dcc-cpe-fat').value),foods=overlay.querySelector('#dcc-cpe-foods').value.trim();
    if(!name){notify('El nombre no puede quedar vacío');return}if(age!=null&&(age<10||age>100)){notify('Revisa la edad');return}if(height!=null&&(height<100||height>250)){notify('Revisa la altura');return}if(fat!=null&&(fat<=0||fat>=70)){notify('Revisa el porcentaje de grasa');return}
    const saveBtn=overlay.querySelector('.dcc-cpe-save');saveBtn.disabled=true;saveBtn.textContent='Guardando…';
    try{
      const oldWeight=currentWeight(id,client),oldFat=currentFat(client),patch={name,age:age==null?null:Math.round(age),height_cm:height,foods_to_avoid:foods};if(weight!=null)patch.weight=weight;
      const updated=await database.from('clients').update(patch).eq('id',id).select('id');if(updated.error)throw updated.error;if(!updated.data?.length)throw new Error('No se confirmó la actualización del cliente');
      if(weight!=null&&Number(oldWeight)!==Number(weight)){const w=await database.from('client_weights').insert({client_id:id,weight});if(w.error)throw w.error}
      if(fat!=null&&Number(oldFat)!==Number(fat)){const f=await database.from('client_body_fat_history').insert({client_id:id,body_fat:fat});if(f.error)throw f.error}
      client.name=name;client.age=age==null?null:Math.round(age);client.height_cm=height;client.foods_to_avoid=foods;if(weight!=null)client.weight=weight;if(fat!=null)client.bodyFat=fat;
      try{if(typeof saveData==='function')saveData()}catch(_){}close();if(typeof window.dccClientAdmin==='function')window.dccClientAdmin(id,'summary');notify('Cliente actualizado');
    }catch(error){console.error('DCC editar cliente:',error);notify('No se pudieron guardar los cambios');saveBtn.disabled=false;saveBtn.textContent='Guardar cambios'}
  }

  function isSummary(main){return norm(main?.querySelector('.dcc-ca-tab.active')?.textContent)==='resumen'}
  function infoCard(main){const h=[...main.querySelectorAll('h1,h2,h3,h4')].find(x=>norm(x.textContent)==='información general');return h?.closest('.dcc-ca-card,.dcc-card,.card,section')||null}
  function placeActions(){
    ensureCss();const main=document.querySelector('#coach-main.dcc-ca');if(!main)return;
    if(!isSummary(main)){main.querySelectorAll('.dcc-ca-profile-actions,.dcc-summary-actions-bottom').forEach(x=>x.remove());return}
    const del=[...main.querySelectorAll('button')].find(b=>norm(b.textContent).includes('eliminar cliente'));const card=infoCard(main);if(!del||!card)return;
    let actions=main.querySelector('.dcc-summary-actions-bottom');if(!actions){actions=document.createElement('div');actions.className='dcc-summary-actions-bottom'}
    if(actions.parentElement!==card)card.appendChild(actions);
    let edit=main.querySelector('.dcc-ca-edit-client');if(!edit){edit=document.createElement('button');edit.type='button';edit.className='dcc-ca-edit-client';edit.textContent='Editar cliente';edit.onclick=open}
    if(edit.parentElement!==actions)actions.appendChild(edit);if(del.parentElement!==actions)actions.appendChild(del);
    main.querySelectorAll('.dcc-ca-profile-actions').forEach(x=>x.remove());
  }

  function wrapClientAdmin(){
    const base=window.dccClientAdmin;if(typeof base!=='function'||base.__dccStableProfileActionsV2)return false;
    const wrapped=function(){const out=base.apply(this,arguments);requestAnimationFrame(placeActions);return out};wrapped.__dccStableProfileActionsV2=true;wrapped.__base=base;window.dccClientAdmin=wrapped;return true;
  }
  function install(){ensureCss();wrapClientAdmin();requestAnimationFrame(placeActions)}
  window.dccOpenClientProfileEditor=open;
  install();let tries=0;const timer=setInterval(()=>{tries++;if(wrapClientAdmin()||tries>80)clearInterval(timer)},100);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});window.addEventListener('pageshow',install);
})();
