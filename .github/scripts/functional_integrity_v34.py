from pathlib import Path


def replace_once(path, old, new):
    p=Path(path)
    s=p.read_text(encoding='utf-8')
    n=s.count(old)
    if n!=1:
        raise SystemExit(f'{path}: expected one match, found {n}')
    p.write_text(s.replace(old,new,1),encoding='utf-8')

# 1) A reviewed check-in must only become local/reviewed after Supabase confirms it.
replace_once(
    'checkin-coach-sync-v2.js',
    """    const wrapped=async function(id){
      const db=database(),now=new Date().toISOString();
      try{
        if(db){
          const {error}=await db.from('client_checkins').update({reviewed:true,updated_at:now}).eq('client_id',id);if(error)throw error;
          const {error:clientError}=await db.from('clients').update({status:'Revisado'}).eq('id',id);if(clientError)console.warn('DCC estado cliente revisado:',clientError);
        }
      }catch(e){console.error('DCC sincronización revisión check-in:',e)}
      const x=appData()?.checkins?.[id];if(x){x.reviewed=true;x.reviewedAt=now}
      return current.apply(this,arguments);
    };""",
    """    const wrapped=async function(id){
      const db=database(),now=new Date().toISOString();
      if(!db){
        try{if(typeof toast==='function')toast('No hay conexión con el servidor');else window.toast?.('No hay conexión con el servidor')}catch(_){}
        return false;
      }
      try{
        const {data:updated,error}=await db.from('client_checkins').update({reviewed:true,updated_at:now}).eq('client_id',id).select('client_id');
        if(error)throw error;
        if(!Array.isArray(updated)||!updated.length)throw new Error('El servidor no confirmó la revisión');
        const {error:clientError}=await db.from('clients').update({status:'Revisado'}).eq('id',id);if(clientError)console.warn('DCC estado cliente revisado:',clientError);
      }catch(e){
        console.error('DCC sincronización revisión check-in:',e);
        try{if(typeof toast==='function')toast('No se pudo marcar como revisado');else window.toast?.('No se pudo marcar como revisado')}catch(_){}
        return false;
      }
      const x=appData()?.checkins?.[id];if(x){x.reviewed=true;x.reviewedAt=now}
      return current.apply(this,arguments);
    };"""
)

# 2) Native diet warning already runs inside dccDietAddFood; do not show a second warning on click capture.
replace_once(
    'coach-client-plan-status-v1.js',
    """    const add=e.target.closest?.('#coach-main .dcc-diet-add-food');
    if(add){const c=currentProfileClient(),foods=foodsToAvoid(c);if(foods)notify(`Aviso: no incluir ${foods}`)}""",
    """    const add=e.target.closest?.('#coach-main .dcc-diet-add-food');
    if(add&&!window.dccDietAddFood?.__dccNativeAvoidWarning){const c=currentProfileClient(),foods=foodsToAvoid(c);if(foods)notify(`Aviso: no incluir ${foods}`)}"""
)

# 3) Never pretend a coach message was sent when the server write failed.
replace_once(
    'messages-sync-fix.js',
    """  async function sendSynced(id){
    const input=document.getElementById('dccChatInput');
    const text=input?.value?.trim();
    if(!text)return;
    if(input)input.disabled=true;

    try{
      if(window.supabaseClient){
        const {error}=await window.supabaseClient
          .from('client_messages')
          .insert({client_id:id,sender:'Daniel',message:text});
        if(error)throw error;

        /* Recargamos la tabla para conservar fecha/orden canónicos y evitar duplicados. */
        await refreshFromSupabase();
      }else{
        appendLegacyLocal(id,text);
      }
    }catch(e){
      console.error('DCC — no se pudo enviar por Supabase, guardado local:',e);
      appendLegacyLocal(id,text);
    }

    if(window.__dccOpenChat===id&&typeof window.dccOpenChat==='function'){
      window.dccOpenChat(id);
    }
  }""",
    """  async function sendSynced(id){
    const input=document.getElementById('dccChatInput');
    const text=input?.value?.trim();
    if(!text)return;
    const db=window.supabaseClient||null;
    if(!db){
      try{if(typeof toast==='function')toast('No hay conexión con el servidor');else window.toast?.('No hay conexión con el servidor')}catch(_){}
      return;
    }
    if(input)input.disabled=true;

    try{
      const {error}=await db.from('client_messages').insert({client_id:id,sender:'Daniel',message:text});
      if(error)throw error;
      if(input)input.value='';
      /* Recargamos la tabla para conservar fecha/orden canónicos y evitar duplicados. */
      await refreshFromSupabase();
      if(window.__dccOpenChat===id&&typeof window.dccOpenChat==='function')window.dccOpenChat(id);
    }catch(e){
      console.error('DCC — no se pudo enviar el mensaje:',e);
      try{if(typeof toast==='function')toast('No se pudo enviar el mensaje');else window.toast?.('No se pudo enviar el mensaje')}catch(_){}
      if(input){input.disabled=false;input.focus?.({preventScroll:true})}
      return;
    }
    if(input)input.disabled=false;
  }"""
)

# 4) Body-fat differences are direct percentage differences, never "points".
replace_once(
    'client-progress-premium-v6.js',
    "const fatChip=bodyFatChange!=null?`${bodyFatChange>0?'+':''}${fmt(bodyFatChange)} pts ${bodyFatChange<0?'↓':'↑'}`:'Sin datos';",
    "const fatChip=bodyFatChange!=null?`${bodyFatChange>0?'+':''}${fmt(bodyFatChange)} % ${bodyFatChange<0?'↓':'↑'}`:'Sin datos';"
)

# 5) Coach progress must use initial + full body-fat history + current value in deterministic order.
old_fats="""  function fats(id,cl){const d=getData(),out=[],seen=new Set(),push=(v,date)=>{v=num(v);if(v==null||v<2||v>70)return;const k=(date||'')+'|'+v;if(seen.has(k))return;seen.add(k);out.push({v,date:date||null})};['bodyFat','body_fat','fat','fatPct','fat_pct','grasa','porcentajeGrasa'].forEach(k=>push(cl?.[k],cl?.updated_at));const walk=(o,n=0)=>{if(!o||n>5)return;if(Array.isArray(o)){o.forEach(x=>walk(x,n+1));return}if(typeof o!=='object')return;const cid=o.client_id??o.clientId??o.client,ok=cid==null||String(cid)===String(id),date=o.date??o.created_at??o.createdAt??o.fecha;for(const[k,v]of Object.entries(o)){if(ok&&/fat|grasa/i.test(k)&&!/free/i.test(k))push(v,date);if(v&&typeof v==='object')walk(v,n+1)}};['checkins','checkIns','checkinHistory','progress','measurements'].forEach(k=>walk(d[k]));return out}"""
new_fats="""  function fats(id,cl){const d=getData(),out=[],push=(v,date)=>{v=num(v);if(v==null||v<2||v>70)return;if(out.length&&Math.abs(out[out.length-1].v-v)<.001)return;out.push({v,date:date||null})};push(cl?.bodyFatInitial??cl?.initialBodyFat??cl?.initial_body_fat,cl?.created_at??cl?.createdAt??null);const history=Array.isArray(d.bodyFatHistory?.[id])?d.bodyFatHistory[id]:[];history.forEach(r=>push(r?.bodyFat??r?.body_fat,r?.recorded_at??r?.recordedAt??null));const x=d.checkins?.[id]||{};push(x.bodyFat??x.body_fat,x.updatedAt??x.updated_at??x.sentAt??x.sent_at??null);if(!out.length)['bodyFat','body_fat','fat','fatPct','fat_pct','grasa','porcentajeGrasa'].forEach(k=>push(cl?.[k],cl?.updated_at));return out}"""
replace_once('progress-premium-v5.js',old_fats,new_fats)

# 6) The final client check-in flow also keeps the server-side client status coherent.
replace_once(
    'client-checkin-final-v3.js',
    """      const {error}=await database.from('client_checkins').upsert(payload,{onConflict:'client_id'});if(error)throw error;
      x.weight=weightText;x.diet=d.diet;x.training=d.training;x.energy=d.energy;x.comment=d.comment||'';x.bodyFat=payload.body_fat;x.sentAt=now;x.updatedAt=now;x.reviewed=false;x.status='Nuevo check-in';c.status='Pendiente';save();""",
    """      const {error}=await database.from('client_checkins').upsert(payload,{onConflict:'client_id'});if(error)throw error;
      const {error:clientError}=await database.from('clients').update({status:'Pendiente'}).eq('id',id);if(clientError)console.warn('DCC estado cliente pendiente:',clientError);
      x.weight=weightText;x.diet=d.diet;x.training=d.training;x.energy=d.energy;x.comment=d.comment||'';x.bodyFat=payload.body_fat;x.sentAt=now;x.updatedAt=now;x.reviewed=false;x.status='Nuevo check-in';c.status='Pendiente';save();"""
)

# 7) Base source also knows about energy and clears it when preparing a new weekly check-in.
replace_once(
    'index.html',
    """  checkin.diet="";
  checkin.training="";
  checkin.comment="";
  checkin.reviewed=false;""",
    """  checkin.diet="";
  checkin.training="";
  checkin.energy="";
  checkin.comment="";
  checkin.reviewed=false;"""
)
replace_once(
    'index.html',
    '.select("client_id,weight,diet,training,comment,reviewed,body_fat,sent_at,updated_at");',
    '.select("client_id,weight,diet,training,energy,comment,reviewed,body_fat,sent_at,updated_at");'
)
replace_once(
    'index.html',
    """        diet:row.diet || "",
        training:row.training || "",
        comment:row.comment || "", """.rstrip(),
    """        diet:row.diet || "",
        training:row.training || "",
        energy:row.energy || "",
        comment:row.comment || "", """.rstrip()
)

print('functional integrity v34 applied')
