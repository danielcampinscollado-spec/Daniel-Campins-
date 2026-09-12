from pathlib import Path


def replace_once(path, old, new):
    p = Path(path)
    text = p.read_text(encoding='utf-8')
    count = text.count(old)
    if count != 1:
        raise SystemExit(f'{path}: expected 1 match, found {count}')
    p.write_text(text.replace(old, new, 1), encoding='utf-8')


path='nutrition-plan-premium-v2.js'

replace_once(
    path,
    """function key(id){return 'dcc:diet-history:v2:'+id}
function history(id){try{const x=JSON.parse(localStorage.getItem(key(id))||'[]');return Array.isArray(x)?x:[]}catch(e){return[]}}
function saveHistory(id,a){try{localStorage.setItem(key(id),JSON.stringify(a.slice(0,30)))}catch(e){};window.data.dietHistory=window.data.dietHistory||{};window.data.dietHistory[id]=a.slice(0,30);if(typeof window.saveData==='function')window.saveData()}
function archive(id,label){if(!hasPlan(id))return;const a=history(id);a.unshift({id:'diet-'+Date.now(),label:label||'Plan anterior',archivedAt:new Date().toISOString(),plan:clone(plan(id))});saveHistory(id,a)}
async function persistType(id,t){try{const d=window.data?.diets?.[id]?.[t];if(!d||!window.supabaseClient)return;const {error}=await window.supabaseClient.from('client_diets').upsert({client_id:id,diet_type:t,calories:d.calories||'',protein:d.protein||'',meals:d.meals||[],updated_at:new Date().toISOString()},{onConflict:'client_id,diet_type'});if(error)throw error}catch(e){console.error('DCC nutrition persist:',e)}}
async function persist(id){if(typeof window.saveData==='function')window.saveData();await Promise.all(['training','rest'].map(t=>persistType(id,t)))}
""",
    """function key(id){return 'dcc:diet-history:v2:'+id}
const historyLoaded={};
function history(id){const cached=window.data?.dietHistory?.[id];if(Array.isArray(cached))return cached;try{const x=JSON.parse(localStorage.getItem(key(id))||'[]');return Array.isArray(x)?x:[]}catch(e){return[]}}
function cacheHistory(id,a){const rows=Array.isArray(a)?a.slice(0,30):[];window.data.dietHistory=window.data.dietHistory||{};window.data.dietHistory[id]=rows;try{localStorage.setItem(key(id),JSON.stringify(rows))}catch(e){};if(typeof window.saveData==='function')window.saveData()}
async function loadHistory(id){if(!window.supabaseClient)return history(id);const {data:rows,error}=await window.supabaseClient.from('client_diet_history').select('id,label,archived_at,plan').eq('client_id',String(id)).order('archived_at',{ascending:false}).limit(30);if(error)throw error;const a=(rows||[]).map(x=>({id:x.id,label:x.label,archivedAt:x.archived_at,plan:x.plan}));cacheHistory(id,a);historyLoaded[id]=true;return a}
async function persist(id){const p=clone(plan(id))||{training:{calories:'',protein:'',meals:[]},rest:{calories:'',protein:'',meals:[]}};if(!window.supabaseClient)throw new Error('No hay conexión con Supabase');const {data:ok,error}=await window.supabaseClient.rpc('dcc_save_diet_plan',{p_client_id:String(id),p_training:p.training||{},p_rest:p.rest||{}});if(error)throw error;if(ok!==true)throw new Error('El servidor no confirmó el guardado de la dieta');if(typeof window.saveData==='function')window.saveData();return true}
async function transition(id,newPlan,label){if(!window.supabaseClient)throw new Error('No hay conexión con Supabase');const historyId='diet-'+Date.now()+'-'+Math.random().toString(36).slice(2,9);const {data:ok,error}=await window.supabaseClient.rpc('dcc_transition_diet_plan',{p_client_id:String(id),p_new_plan:newPlan,p_archive_label:label||null,p_history_id:label?historyId:null});if(error)throw error;if(ok!==true)throw new Error('El servidor no confirmó el cambio de dieta');window.data.diets=window.data.diets||{};window.data.diets[id]=clone(newPlan);if(typeof window.saveData==='function')window.saveData();await loadHistory(id);return true}
function nutritionError(error){console.error('DCC nutrition server-first:',error);alert('No se pudo guardar el cambio de alimentación. No se ha aplicado ningún cambio.\\n\\n'+(error?.message||'Error del servidor'))}
"""
)

replace_once(
    path,
    "function overview(id){const p=shell(id);if(!p)return;const ex=hasPlan(id),c=counts(id),h=history(id),a=avoid(id);",
    "function overview(id){const p=shell(id);if(!p)return;if(!historyLoaded[id]&&window.supabaseClient){historyLoaded[id]=true;loadHistory(id).then(()=>overview(id)).catch(e=>console.error('DCC nutrition history:',e))}const ex=hasPlan(id),c=counts(id),h=history(id),a=avoid(id);"
)

replace_once(
    path,
    """window.dccNutritionV2Blank=async id=>{if(hasPlan(id))archive(id,'Plan anterior · antes de crear desde cero');window.data.diets=window.data.diets||{};window.data.diets[id]={training:{calories:'',protein:'',meals:[]},rest:{calories:'',protein:'',meals:[]}};await persist(id);editor(id)};
window.dccNutritionV2Renew=async id=>{archive(id,'Plan anterior · renovación');window.data.diets[id]=clone(plan(id));await persist(id);editor(id)};
window.dccNutritionV2Duplicate=async id=>{archive(id,'Plan anterior · antes de duplicar');window.data.diets[id]=clone(plan(id));await persist(id);editor(id)};
window.dccNutritionV2Restore=async(id,i)=>{const x=history(id)[i];if(!x)return;if(hasPlan(id))archive(id,'Plan anterior · antes de restaurar');window.data.diets[id]=clone(x.plan);await persist(id);if(typeof window.toast==='function')window.toast('Plan restaurado');overview(id)};
""",
    """window.dccNutritionV2Blank=async id=>{const next={training:{calories:'',protein:'',meals:[]},rest:{calories:'',protein:'',meals:[]}};try{await transition(id,next,hasPlan(id)?'Plan anterior · antes de crear desde cero':null);editor(id)}catch(e){nutritionError(e)}};
window.dccNutritionV2Renew=async id=>{const next=clone(plan(id));if(!next)return;try{await transition(id,next,'Plan anterior · renovación');editor(id)}catch(e){nutritionError(e)}};
window.dccNutritionV2Duplicate=async id=>{const next=clone(plan(id));if(!next)return;try{await transition(id,next,'Plan anterior · antes de duplicar');editor(id)}catch(e){nutritionError(e)}};
window.dccNutritionV2Restore=async(id,i)=>{const x=history(id)[i];if(!x)return;try{await transition(id,clone(x.plan),hasPlan(id)?'Plan anterior · antes de restaurar':null);if(typeof window.toast==='function')window.toast('Plan restaurado');overview(id)}catch(e){nutritionError(e)}};
"""
)

print('premium nutrition lifecycle patched')
