/* DCC — editor Light Premium de datos del cliente */
(function(){
  'use strict';
  if(window.__dccClientProfileEditorV1)return;
  window.__dccClientProfileEditorV1=true;

  const getData=()=>{try{return data||{}}catch(e){return window.data||{}}};
  const getDb=()=>{try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient}catch(e){}return window.supabaseClient||null};
  const notify=t=>{try{if(typeof toast==='function')return toast(t);if(typeof window.toast==='function')return window.toast(t)}catch(e){}alert(t)};
  const num=v=>{const n=parseFloat(String(v??'').replace(',','.'));return Number.isFinite(n)?n:null};

  function currentClient(){
    const id=window.selectedClient;
    if(id==null)return null;
    const d=getData();
    return (d.clients||[]).find(c=>String(c.id)===String(id))||null;
  }

  function currentWeight(id,client){
    const d=getData();
    const arr=d.weights?.[id];
    if(Array.isArray(arr)&&arr.length){
      const last=arr[arr.length-1];
      const n=num(typeof last==='object'?(last.weight??last.value):last);
      if(n!=null)return n;
    }
    return num(client?.weight??client?.initial_weight)??'';
  }

  function currentFat(client){
    return num(client?.bodyFat??client?.body_fat??client?.fat??client?.fatPct??client?.fat_pct??client?.grasa??client?.porcentajeGrasa??client?.initial_body_fat)??'';
  }

  function ensureCss(){
    if(document.getElementById('dcc-client-profile-editor-css'))return;
    const s=document.createElement('style');
    s.id='dcc-client-profile-editor-css';
    s.textContent=`
      .dcc-ca-profile-actions{display:flex;justify-content:flex-end;align-items:center;gap:8px;margin:8px 2px 12px}
      .dcc-ca-profile-actions .dcc-ca-edit-client,.dcc-ca-profile-actions .dcc-ca-delete{width:auto!important;margin:0!important;min-height:38px;padding:8px 13px!important;border-radius:999px!important;font-size:12px!important;font-weight:850!important;line-height:1!important;box-shadow:none!important}
      .dcc-ca-profile-actions .dcc-ca-edit-client{border:1px solid #d7ae55!important;background:linear-gradient(135deg,#fffaf0,#f4e6bf)!important;color:#7a5415!important}
      .dcc-ca-profile-actions .dcc-ca-delete{border:1px solid #e3b8ba!important;background:#fff5f5!important;color:#b0444a!important}
      .dcc-cpe-overlay{position:fixed;inset:0;z-index:100000;background:rgba(27,24,18,.28);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);display:flex;align-items:flex-end;justify-content:center;padding:18px}
      .dcc-cpe-card{width:min(680px,100%);max-height:88vh;overflow:auto;background:#fffaf2;border:1px solid #e3c782;border-radius:28px;padding:22px;box-shadow:0 24px 70px rgba(64,46,16,.24)}
      .dcc-cpe-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:18px}.dcc-cpe-head h2{margin:0;color:#17191d;font-size:25px}.dcc-cpe-close{width:42px;height:42px;border-radius:50%;border:1px solid #ddbf74;background:#fffaf2;color:#8b641c;font-size:24px}
      .dcc-cpe-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.dcc-cpe-field{display:grid;gap:7px}.dcc-cpe-field.full{grid-column:1/-1}.dcc-cpe-field label{font-size:12px;font-weight:800;color:#746b5d}.dcc-cpe-field input,.dcc-cpe-field textarea{width:100%;border:1px solid #dfca98;border-radius:14px;background:#fff;color:#17191d;padding:13px 14px;font-size:16px;outline:none}.dcc-cpe-field textarea{min-height:92px;resize:vertical}
      .dcc-cpe-actions{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:18px}.dcc-cpe-cancel,.dcc-cpe-save{padding:13px;border-radius:14px;font-weight:900}.dcc-cpe-cancel{border:1px solid #d8c9aa;background:#fff;color:#312f2b}.dcc-cpe-save{border:1px solid #e3b74c;background:linear-gradient(135deg,#f9d76d,#e9b93e);color:#18140a}
      @media(max-width:560px){.dcc-ca-profile-actions{justify-content:flex-start;margin-top:4px}.dcc-ca-profile-actions .dcc-ca-edit-client,.dcc-ca-profile-actions .dcc-ca-delete{font-size:11px!important;padding:8px 11px!important}.dcc-cpe-grid{grid-template-columns:1fr}.dcc-cpe-field.full{grid-column:auto}.dcc-cpe-card{padding:18px;border-radius:24px}.dcc-cpe-head h2{font-size:22px}}
    `;
    document.head.appendChild(s);
  }

  function close(){document.querySelector('.dcc-cpe-overlay')?.remove()}

  function open(){
    ensureCss();
    const client=currentClient();
    if(!client)return;
    const id=String(client.id);
    close();
    const overlay=document.createElement('div');
    overlay.className='dcc-cpe-overlay';
    overlay.innerHTML=`<div class="dcc-cpe-card" role="dialog" aria-modal="true">
      <div class="dcc-cpe-head"><h2>Editar cliente</h2><button class="dcc-cpe-close" type="button">×</button></div>
      <div class="dcc-cpe-grid">
        <div class="dcc-cpe-field full"><label>Nombre</label><input id="dcc-cpe-name" value="${String(client.name??'').replace(/"/g,'&quot;')}"></div>
        <div class="dcc-cpe-field"><label>Edad</label><input id="dcc-cpe-age" type="number" min="10" max="100" value="${client.age??''}"></div>
        <div class="dcc-cpe-field"><label>Altura (cm)</label><input id="dcc-cpe-height" type="number" min="100" max="250" step="0.1" value="${client.height_cm??client.height??''}"></div>
        <div class="dcc-cpe-field"><label>Peso actual (kg)</label><input id="dcc-cpe-weight" type="number" min="20" max="400" step="0.1" value="${currentWeight(id,client)}"></div>
        <div class="dcc-cpe-field"><label>% de grasa actual</label><input id="dcc-cpe-fat" type="number" min="2" max="69" step="0.1" value="${currentFat(client)}"></div>
        <div class="dcc-cpe-field full"><label>Alimentos que no quiere / debe evitar</label><textarea id="dcc-cpe-foods">${String(client.foods_to_avoid??client.foodsToAvoid??'').replace(/</g,'&lt;')}</textarea></div>
      </div>
      <div class="dcc-cpe-actions"><button class="dcc-cpe-cancel" type="button">Cancelar</button><button class="dcc-cpe-save" type="button">Guardar cambios</button></div>
    </div>`;
    document.body.appendChild(overlay);
    overlay.querySelector('.dcc-cpe-close').onclick=close;
    overlay.querySelector('.dcc-cpe-cancel').onclick=close;
    overlay.addEventListener('click',e=>{if(e.target===overlay)close()});
    overlay.querySelector('.dcc-cpe-save').onclick=()=>saveProfile(id,client,overlay);
  }

  async function saveProfile(id,client,overlay){
    const database=getDb();
    if(!database){notify('No hay conexión con el servidor');return}
    const name=overlay.querySelector('#dcc-cpe-name').value.trim();
    const age=num(overlay.querySelector('#dcc-cpe-age').value);
    const height=num(overlay.querySelector('#dcc-cpe-height').value);
    const weight=num(overlay.querySelector('#dcc-cpe-weight').value);
    const fat=num(overlay.querySelector('#dcc-cpe-fat').value);
    const foods=overlay.querySelector('#dcc-cpe-foods').value.trim();
    if(!name){notify('El nombre no puede quedar vacío');return}
    if(age!=null&&(age<10||age>100)){notify('Revisa la edad');return}
    if(height!=null&&(height<100||height>250)){notify('Revisa la altura');return}
    if(fat!=null&&(fat<=0||fat>=70)){notify('Revisa el porcentaje de grasa');return}

    const saveBtn=overlay.querySelector('.dcc-cpe-save');
    saveBtn.disabled=true;
    saveBtn.textContent='Guardando…';
    try{
      const oldWeight=currentWeight(id,client);
      const oldFat=currentFat(client);
      const patch={name,age:age==null?null:Math.round(age),height_cm:height,foods_to_avoid:foods};
      if(weight!=null)patch.weight=weight;
      const updated=await database.from('clients').update(patch).eq('id',id).select('id');
      if(updated.error)throw updated.error;
      if(!updated.data?.length)throw new Error('No se confirmó la actualización del cliente');

      if(weight!=null&&Number(oldWeight)!==Number(weight)){
        const w=await database.from('client_weights').insert({client_id:id,weight});
        if(w.error)throw w.error;
      }
      if(fat!=null&&Number(oldFat)!==Number(fat)){
        const f=await database.from('client_body_fat_history').insert({client_id:id,body_fat:fat});
        if(f.error)throw f.error;
      }

      client.name=name;
      client.age=age==null?null:Math.round(age);
      client.height_cm=height;
      client.foods_to_avoid=foods;
      if(weight!=null){
        client.weight=weight;
        const d=getData();
        d.weights=d.weights||{};
        d.weights[id]=Array.isArray(d.weights[id])?d.weights[id]:[];
        if(Number(oldWeight)!==Number(weight))d.weights[id].push({weight,recorded_at:new Date().toISOString()});
      }
      if(fat!=null){
        client.bodyFat=fat;
        const d=getData();
        d.bodyFatHistory=d.bodyFatHistory||{};
        d.bodyFatHistory[id]=Array.isArray(d.bodyFatHistory[id])?d.bodyFatHistory[id]:[];
        if(Number(oldFat)!==Number(fat))d.bodyFatHistory[id].push({body_fat:fat,recorded_at:new Date().toISOString()});
      }
      try{if(typeof saveData==='function')saveData()}catch(_){ }
      close();
      if(typeof window.dccClientAdmin==='function')window.dccClientAdmin(id,'summary');
      notify('Cliente actualizado');
    }catch(error){
      console.error('DCC editar cliente:',error);
      notify('No se pudieron guardar los cambios');
      saveBtn.disabled=false;
      saveBtn.textContent='Guardar cambios';
    }
  }

  function inject(){
    ensureCss();
    const main=document.querySelector('#coach-main.dcc-ca');
    const deleteBtn=main?.querySelector('.dcc-ca-delete');
    const head=main?.querySelector('.dcc-ca-head');
    if(!main||!deleteBtn||!head)return;

    let actions=main.querySelector('.dcc-ca-profile-actions');
    if(!actions){
      actions=document.createElement('div');
      actions.className='dcc-ca-profile-actions';
      head.insertAdjacentElement('afterend',actions);
    }

    let editBtn=main.querySelector('.dcc-ca-edit-client');
    if(!editBtn){
      editBtn=document.createElement('button');
      editBtn.type='button';
      editBtn.className='dcc-ca-edit-client';
      editBtn.textContent='Editar cliente';
      editBtn.onclick=open;
    }

    if(editBtn.parentNode!==actions)actions.appendChild(editBtn);
    if(deleteBtn.parentNode!==actions)actions.appendChild(deleteBtn);
  }

  const observer=new MutationObserver(()=>requestAnimationFrame(inject));
  observer.observe(document.documentElement,{childList:true,subtree:true});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',inject,{once:true});else inject();
  window.dccOpenClientProfileEditor=open;
})();
