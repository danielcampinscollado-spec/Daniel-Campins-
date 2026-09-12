from pathlib import Path


def replace_once(path, old, new):
    p=Path(path)
    text=p.read_text(encoding='utf-8')
    count=text.count(old)
    if count!=1:
        raise SystemExit(f'{path}: expected 1 match, found {count}')
    p.write_text(text.replace(old,new,1),encoding='utf-8')


path='client-checkin-final-v3.js'
replace_once(
    path,
    """      const payload={client_id:id,weight:weightText,diet:d.diet,training:d.training,energy:d.energy,comment:d.comment||'',body_fat:bodyFat!==''&&bodyFat!==null&&bodyFat!==undefined?Number(bodyFat):null,sent_at:now,reviewed:false,updated_at:now};
      const {error}=await database.from('client_checkins').upsert(payload,{onConflict:'client_id'});if(error)throw error;
      const {error:clientError}=await database.from('clients').update({status:'Pendiente'}).eq('id',id);if(clientError)console.warn('DCC estado cliente pendiente:',clientError);
      x.weight=weightText;x.diet=d.diet;x.training=d.training;x.energy=d.energy;x.comment=d.comment||'';x.bodyFat=payload.body_fat;x.sentAt=now;x.updatedAt=now;x.reviewed=false;x.status='Nuevo check-in';c.status='Pendiente';save();
""",
    """      const payload={client_id:id,weight:weightText,diet:d.diet,training:d.training,energy:d.energy,comment:d.comment||'',body_fat:bodyFat!==''&&bodyFat!==null&&bodyFat!==undefined?Number(bodyFat):null,sent_at:now,reviewed:false,updated_at:now};
      const {data:ok,error}=await database.rpc('dcc_submit_checkin',{p_client_id:String(id),p_weight:payload.weight,p_diet:payload.diet,p_training:payload.training,p_energy:payload.energy,p_comment:payload.comment,p_body_fat:payload.body_fat,p_sent_at:payload.sent_at});if(error)throw error;if(ok!==true)throw new Error('El servidor no confirmó el check-in');
      x.weight=weightText;x.diet=d.diet;x.training=d.training;x.energy=d.energy;x.comment=d.comment||'';x.bodyFat=payload.body_fat;x.sentAt=now;x.updatedAt=now;x.reviewed=false;x.status='Nuevo check-in';c.status='Pendiente';save();
"""
)
print('check-in atomic submission patched')
