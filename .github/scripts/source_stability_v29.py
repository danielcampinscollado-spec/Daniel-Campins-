from pathlib import Path
import re


def load(path):
    return Path(path).read_text(encoding="utf-8")


def save(path, text):
    Path(path).write_text(text, encoding="utf-8")


def replace_once(text, old, new, label):
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f"{label}: expected 1 occurrence, found {count}")
    return text.replace(old, new, 1)


# -----------------------------------------------------------------------------
# 1. Nuevo cliente: llevar el flujo crítico al archivo que realmente lo define.
# -----------------------------------------------------------------------------
p = "new-client-premium-v1.js"
s = load(p)

s = replace_once(
    s,
    "${icon('fat')}<span>% de grasa inicial</span>",
    "${icon('fat')}<span>Grasa corporal inicial</span>",
    "fat label",
)

s = replace_once(
    s,
    "if(!Number.isFinite(bodyFat)||bodyFat<=0||bodyFat>=70){notify('Introduce un % de grasa válido');return}",
    "if(!Number.isFinite(bodyFat)||bodyFat<=0||bodyFat>=70){notify('Introduce un porcentaje de grasa válido');return}",
    "fat validation text",
)

start = s.index("    const id='client_'+Date.now();")
end = s.index("    }catch(e){", start)
new_create = r'''    const id='client_'+Date.now();
    const createdAt=new Date().toISOString();
    try{
      const {error}=await db.from('clients').insert({
        id,
        name,
        goal,
        weight,
        initial_weight:weight,
        initial_body_fat:bodyFat,
        age,
        height_cm:height,
        foods_to_avoid:foodsToAvoid,
        plan:'',
        status:'Pendiente',
        created_at:createdAt
      });
      if(error)throw error;

      const initialWrites=await Promise.all([
        db.from('client_weights').insert({client_id:id,weight,recorded_at:createdAt}),
        db.from('client_body_fat_history').insert({client_id:id,body_fat:bodyFat,recorded_at:createdAt}),
        db.from('client_checkins').upsert({
          client_id:id,
          weight:String(weight).replace('.',',')+' kg',
          body_fat:bodyFat,
          updated_at:createdAt
        },{onConflict:'client_id'})
      ]);
      const failed=initialWrites.find(x=>x?.error);
      if(failed){
        await db.from('clients').delete().eq('id',id);
        throw failed.error;
      }

      const d=appData();
      d.clients=Array.isArray(d.clients)?d.clients:[];
      d.clients.push({
        id,name,goal,weight,
        initial:weight,initial_weight:weight,
        bodyFatInitial:bodyFat,initial_body_fat:bodyFat,
        age,height,heightCm:height,height_cm:height,
        foodsToAvoid,foods_to_avoid:foodsToAvoid,
        plan:'',status:'Pendiente',created_at:createdAt
      });
      d.weights=d.weights||{};d.weights[id]=[weight];
      d.bodyFatHistory=d.bodyFatHistory||{};
      d.bodyFatHistory[id]=[{bodyFat,body_fat:bodyFat,recorded_at:createdAt}];
      d.checkins=d.checkins||{};
      d.checkins[id]={
        weight:(typeof money==='function'?money(weight):String(weight))+' kg',
        bodyFat,body_fat:bodyFat,
        diet:'Pendiente',training:'Pendiente',energy:'Pendiente',
        comment:'Pendiente de revisión.',reviewed:false,
        updatedAt:createdAt,updated_at:createdAt
      };
      d.diets=d.diets||{};
      d.diets[id]={training:{calories:'',protein:'',meals:[]},rest:{calories:'',protein:'',meals:[]}};
      d.routines=d.routines||{};d.routines[id]=[];
      d.messages=d.messages||{};d.messages[id]=[];

      try{if(typeof saveData==='function')saveData();else if(typeof window.saveData==='function')window.saveData()}catch(e){}
      cleanupModal();
      try{if(typeof closeModal==='function')closeModal();else window.closeModal?.()}catch(e){}

      window.selectedClient=id;
      window.__dccClientAdminId=id;
      try{
        if(typeof window.dccClientAdmin==='function')window.dccClientAdmin(id,'summary');
        else if(typeof window.openClient==='function')window.openClient(id);
        else if(typeof showCoach==='function')showCoach('clients');
      }catch(e){
        console.error('DCC abriendo cliente recién creado:',e);
        window.showCoach?.('clients');
      }
      notify('Cliente creado correctamente');
'''
s = s[:start] + new_create + s[end:]

marker = "  };\n\n  /* Mantener edad y altura sincronizadas desde Supabase sin añadir espera. */"
s = replace_once(
    s,
    marker,
    "  };\n  window.createClient.__dccAuditCreateFlowV11=true;\n\n  /* Mantener edad y altura sincronizadas desde Supabase sin añadir espera. */",
    "native create marker",
)

save(p, s)


# -----------------------------------------------------------------------------
# 2. Panel entrenador: eliminar bucle de repintado y hacer parches idempotentes.
# -----------------------------------------------------------------------------
p = "coach-panel-state-v10.js"
s = load(p)

# Entidad HTML correcta.
s = s.replace("'\\\"':'&quot'", "'\\\"':'&quot;'", 1)

start = s.index("  function patchTasks(main){")
end = s.index("\n  function latestWeight", start)
new_tasks = r'''  function patchTasks(main){
    const clients=Array.isArray(appData()?.clients)?appData().clients:[];
    const pending=clients.filter(pendingCheck).length;
    const missingRoutine=clients.filter(c=>!hasRoutine(c.id)).length;
    const missingDietClients=clients.filter(c=>!hasDiet(c.id));
    const total=pending+missingRoutine+missingDietClients.length;
    const tasks=main.querySelector('#dccP9Tasks');
    const badge=tasks?.querySelector('.dcc-p9-count');
    if(badge&&badge.textContent!==String(total))badge.textContent=String(total);

    const inner=tasks?.querySelector('.dcc-p9-inner');
    if(inner){
      const visible=missingDietClients.slice(0,6);
      const signature=visible.map(c=>String(c.id)).join('|');
      if(tasks?.dataset.dccAuditDietSignature!==signature){
        inner.querySelectorAll('.dcc-audit-diet-row').forEach(x=>x.remove());
        const empt=inner.querySelector('.dcc-p9-empty');
        if(empt&&total>0)empt.remove();
        visible.forEach(c=>{
          const row=taskRow(c,'CREAR ALIMENTACIÓN','PENDIENTE',()=>{
            window.selectedClient=c.id;
            window.__dccClientAdminId=c.id;
            if(typeof window.dccClientAdmin==='function')window.dccClientAdmin(c.id,'food');
            else window.openClient?.(c.id);
          });
          row.classList.add('dcc-audit-diet-row');
          inner.appendChild(row);
        });
        if(tasks)tasks.dataset.dccAuditDietSignature=signature;
      }
    }

    const attention=clients.filter(c=>{
      const gap=daysSince(workoutDate(latestWorkout(c.id)));
      return gap!==null&&gap>=7;
    });
    const att=main.querySelector('#dccP9Attention');
    const title=att?.querySelector('.dcc-p9-head-title');
    if(title){
      let count=title.querySelector('.dcc-audit-attention');
      if(!count){
        count=document.createElement('span');
        count.className='dcc-p9-count dcc-audit-attention';
        title.appendChild(count);
      }
      if(count.textContent!==String(attention.length))count.textContent=String(attention.length);
    }
  }
'''
s = s[:start] + new_tasks + s[end:]

s = s.replace(
    "        if(el)el.textContent=value;",
    "        if(el){if(el.textContent!==value)el.textContent=value;}",
    1,
)
s = s.replace(
    "      if(label==='último check-in'){const b=row.querySelector('b');if(b)b.textContent=checkinLabel(id)}",
    "      if(label==='último check-in'){const b=row.querySelector('b'),value=checkinLabel(id);if(b&&b.textContent!==value)b.textContent=value}",
    1,
)
s = s.replace(
    "    new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true,characterData:true});",
    "    new MutationObserver(schedule).observe(main,{childList:true,subtree:true});",
    1,
)
s = s.replace(
    "  window.addEventListener('pageshow',schedule);\n  setInterval(schedule,1200);",
    "  window.addEventListener('pageshow',schedule);\n  window.dccQualityRefresh=schedule;",
    1,
)

save(p, s)

print('source stability v29 applied')
