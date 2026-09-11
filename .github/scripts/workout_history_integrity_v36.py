from pathlib import Path

p=Path('index.html')
s=p.read_text(encoding='utf-8')

def rep(old,new,label):
    global s
    n=s.count(old)
    if n!=1:
        raise SystemExit(f'{label}: expected one match, found {n}')
    s=s.replace(old,new,1)

# Keep workout history in chronological order. Several active views use the last
# element as "latest", so descending server order made the oldest workout appear
# as the previous session.
rep('.order("workout_date",{ascending:false});',
    '.order("workout_date",{ascending:true});',
    'chronological workout history')

# Avoid UTC conversion moving Monday to the previous calendar date in positive
# timezones. Weekly check-in keys must be based on the user's local date.
rep('return monday.toISOString().slice(0,10);',
    'return monday.getFullYear()+"-"+String(monday.getMonth()+1).padStart(2,"0")+"-"+String(monday.getDate()).padStart(2,"0");',
    'local weekly key')

old='''  /* Guardar definitivamente en Supabase */

  const {error}=await supabaseClient
    .from("workout_history")
    .insert(workoutData);

  if(error){

    console.error(
      "Error guardando entrenamiento en Supabase:",
      error
    );

    toast("No se pudo guardar el entrenamiento");

    return;

  }
'''
new='''  /* Guardar definitivamente en Supabase antes de confirmar la sesión local. */

  try{
    if(!supabaseClient) throw new Error("Sin conexión con Supabase");
    const {error}=await supabaseClient
      .from("workout_history")
      .insert(workoutData);
    if(error) throw error;
  }catch(error){
    console.error(
      "Error guardando entrenamiento en Supabase:",
      error
    );
    toast("No se pudo guardar el entrenamiento. Inténtalo de nuevo.");
    return;
  }
'''
rep(old,new,'server-first workout save')

p.write_text(s,encoding='utf-8')
print('workout history integrity v36 applied')
