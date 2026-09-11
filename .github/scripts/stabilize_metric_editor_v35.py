from pathlib import Path

p=Path('client-metrics-sync-v10.js')
s=p.read_text(encoding='utf-8')
old="""  function installBodyFatUpdate(){
    const current=window.updateClientBodyFat;
    if(typeof current!=='function'){setTimeout(installBodyFatUpdate,120);return}
    if(current.__dccMetricsV11)return;

    const replacement=async function(){
      const c=activeClient();
      if(!c){notify('No se encontró el cliente');return}
      const text=window.prompt('Introduce tu % de grasa actual:');
      if(text===null)return;
      const value=num(text.trim());
      if(value==null||value<=0||value>=70){notify('Introduce un % de grasa válido');return}
      try{
        await persistBodyFat(value);
        setBodyFatLocal(value);
        await syncBodyFatHistory(activeId());
        notify('% de grasa actualizado correctamente');
        if(typeof window.showClient==='function')window.showClient('checkin');
      }catch(error){
        console.error('DCC v11 — no se pudo guardar % de grasa:',error);
        notify('No se pudo guardar el % de grasa');
      }
    };
    replacement.__dccMetricsV10=true;
    replacement.__dccMetricsV11=true;
    replacement.__base=current;
    window.updateClientBodyFat=replacement;
  }"""
new="""  function installBodyFatUpdate(){
    const current=window.updateClientBodyFat;
    if(typeof current!=='function')return false;
    /* La edición la posee app-quality v5: no volver a sustituir su modal por el prompt antiguo. */
    if(current.__dccQualityV5||current.__dccMetricsV11)return true;
    return false;
  }"""
if s.count(old)!=1:
    raise SystemExit(f'expected one editor block, found {s.count(old)}')
s=s.replace(old,new,1)
old_calls="""  injectStyles();
  installBodyFatUpdate();
  setTimeout(installBodyFatUpdate,450);
  setTimeout(installBodyFatUpdate,1300);
  setTimeout(installBodyFatUpdate,2600);
  const boot=()=>syncBodyFatHistory(activeId()).then(()=>setTimeout(()=>patchProgress(activeId()),30));"""
new_calls="""  injectStyles();
  /* Esperar a que el editor premium definitivo se instale, sin sobrescribirlo después. */
  setTimeout(installBodyFatUpdate,450);
  setTimeout(installBodyFatUpdate,1300);
  setTimeout(installBodyFatUpdate,2600);
  const boot=()=>syncBodyFatHistory(activeId()).then(()=>setTimeout(()=>patchProgress(activeId()),30));"""
if s.count(old_calls)!=1:
    raise SystemExit(f'expected one editor call block, found {s.count(old_calls)}')
s=s.replace(old_calls,new_calls,1)
p.write_text(s,encoding='utf-8')
print('metric editor ownership stabilized')
