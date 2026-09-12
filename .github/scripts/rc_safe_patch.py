from pathlib import Path


def replace_once(path, old, new):
    p=Path(path)
    text=p.read_text(encoding='utf-8')
    count=text.count(old)
    if count!=1:
        raise SystemExit(f'{path}: expected 1 match, found {count}')
    p.write_text(text.replace(old,new,1),encoding='utf-8')


path='client-metrics-sync-v10.js'
replace_once(
    path,
    """  async function persistBodyFat(value){
    const id=activeId(),db=database();
    if(!id||!db)throw new Error('No hay conexión con el servidor');
    const now=new Date().toISOString();

    const latest=await db.from('client_body_fat_history')
      .select('body_fat,recorded_at')
      .eq('client_id',id)
      .order('recorded_at',{ascending:false})
      .limit(1);
    if(latest.error)throw latest.error;

    const currentSave=await db.from('client_checkins').upsert({
      client_id:id,
      body_fat:value,
      updated_at:now
    },{onConflict:'client_id'});
    if(currentSave.error)throw currentSave.error;

    const previous=num(latest.data?.[0]?.body_fat);
    if(previous==null||Math.abs(previous-value)>=.001){
      const historySave=await db.from('client_body_fat_history').insert({
        client_id:id,
        body_fat:value,
        recorded_at:now
      });
      if(historySave.error)throw historySave.error;
    }
  }
""",
    """  async function persistBodyFat(value){
    const id=activeId(),db=database();
    if(!id||!db)throw new Error('No hay conexión con el servidor');
    const {data:ok,error}=await db.rpc('dcc_record_body_fat',{p_client_id:String(id),p_body_fat:Number(value)});
    if(error)throw error;
    if(ok!==true)throw new Error('El servidor no confirmó el registro del % de grasa');
    return true;
  }
"""
)
replace_once(
    path,
    """  injectStyles();
  /* Esperar a que el editor premium definitivo se instale, sin sobrescribirlo después. */
  setTimeout(installBodyFatUpdate,450);
  setTimeout(installBodyFatUpdate,1300);
  setTimeout(installBodyFatUpdate,2600);
  const boot=()=>syncBodyFatHistory(activeId()).then(()=>setTimeout(()=>patchProgress(activeId()),30));
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
""",
    """  injectStyles();
  const boot=()=>{
    installBodyFatUpdate();
    return syncBodyFatHistory(activeId()).then(()=>requestAnimationFrame(()=>patchProgress(activeId())));
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  window.addEventListener('load',installBodyFatUpdate,{once:true});
  window.addEventListener('pageshow',installBodyFatUpdate);
})();
"""
)
print('body-fat persistence patched')
