from pathlib import Path

path = Path("index.html")
text = path.read_text(encoding="utf-8")
original = text


def insert_before(anchor: str, block: str, label: str) -> None:
    global text
    if block.strip() in text:
        print(f"{label}: already present")
        return
    count = text.count(anchor)
    if count != 1:
        raise RuntimeError(f"{label}: expected anchor once, found {count}")
    text = text.replace(anchor, block + "\n" + anchor, 1)
    print(f"{label}: inserted")


def replace_once(old: str, new: str, label: str) -> None:
    global text
    if new in text and old not in text:
        print(f"{label}: already applied")
        return
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f"{label}: expected old block once, found {count}")
    text = text.replace(old, new, 1)
    print(f"{label}: replaced")


sync_functions = r'''async function loadMessagesFromSupabase(){

  try{

    const { data:messages,error } = await supabaseClient
      .from("client_messages")
      .select("client_id,sender,message,created_at")
      .order("created_at",{ascending:true});

    if(error){
      console.error("Error cargando mensajes:",error);
      return;
    }

    const nextMessages={};

    (data.clients || []).forEach(c=>{
      nextMessages[c.id]=[];
    });

    (messages || []).forEach(row=>{

      if(!nextMessages[row.client_id]){
        nextMessages[row.client_id]=[];
      }

      nextMessages[row.client_id].push([
        row.sender || "",
        row.message || "",
        row.created_at || null
      ]);

    });

    data.messages=nextMessages;
    saveData();

  }catch(e){
    console.error("Error conectando con Supabase para mensajes:",e);
  }
}

async function loadCheckinsFromSupabase(){

  try{

    const { data:checkins,error } = await supabaseClient
      .from("client_checkins")
      .select("client_id,weight,diet,training,comment,reviewed,body_fat,updated_at");

    if(error){
      console.error("Error cargando check-ins:",error);
      return;
    }

    if(!data.checkins){
      data.checkins={};
    }

    (checkins || []).forEach(row=>{

      const previous=data.checkins[row.client_id] || {};

      data.checkins[row.client_id]={
        ...previous,
        weight:row.weight || previous.weight || "",
        diet:row.diet || "",
        training:row.training || "",
        comment:row.comment || "",
        reviewed:!!row.reviewed,
        bodyFat:
          row.body_fat !== null && row.body_fat !== undefined
            ? Number(row.body_fat)
            : (previous.bodyFat ?? ""),
        updatedAt:row.updated_at || previous.updatedAt || null
      };

      const c=data.clients.find(item=>item.id===row.client_id);

      if(c){
        c.status=row.reviewed ? "Revisado" : "Pendiente";
      }

    });

    saveData();

  }catch(e){
    console.error("Error conectando con Supabase para check-ins:",e);
  }
}
'''

insert_before(
    'async function loadNotificationStateFromSupabase(){',
    sync_functions,
    'Supabase message/check-in loaders'
)

replace_once(
'''  loadWeightsFromSupabase(),
  loadNotificationStateFromSupabase()
]);

showClient("home");''',
'''  loadWeightsFromSupabase(),
  loadNotificationStateFromSupabase(),
  loadMessagesFromSupabase()
]);

await loadCheckinsFromSupabase();

showClient("home");''',
    'Client app initial sync'
)

replace_once(
'''    await loadWorkoutHistoryFromSupabase();
    await loadWeightsFromSupabase();
    
    showCoach("dashboard");''',
'''    await loadWorkoutHistoryFromSupabase();
    await loadWeightsFromSupabase();
    await loadMessagesFromSupabase();
    await loadCheckinsFromSupabase();
    
    showCoach("dashboard");''',
    'Coach app initial sync'
)

replace_once(
'''function sendClientMessage(){
const box=document.getElementById("client-message");
const text=box.value.trim();
if(!text)return;
if(!data.messages[currentClientId]){
  data.messages[currentClientId]=[];
}

data.messages[currentClientId].push([
  client(currentClientId)?.name || "Cliente",
  text
]);
saveData();
showClient("messages");
toast("Mensaje enviado");
}''',
'''async function sendClientMessage(){

  const box=document.getElementById("client-message");
  const text=box?.value.trim();

  if(!text)return;

  const sender=client(currentClientId)?.name || "Cliente";

  const { error } = await supabaseClient
    .from("client_messages")
    .insert({
      client_id:currentClientId,
      sender:sender,
      message:text
    });

  if(error){
    console.error("Error enviando mensaje del cliente:",error);
    toast("No se pudo enviar el mensaje");
    return;
  }

  await loadMessagesFromSupabase();

  showClient("messages");
  toast("Mensaje enviado");
}''',
    'Client message persistence'
)

replace_once(
'''function sendCoachMessage(id){
const box=document.getElementById("coach-message");
const text=box.value.trim();
if(!text)return;

if(!data.messages[id])data.messages[id]=[];
data.messages[id].push(["Daniel",text]);
saveData();
closeModal();
toast("Mensaje enviado");
}''',
'''async function sendCoachMessage(id){

  const box=document.getElementById("coach-message");
  const text=box?.value.trim();

  if(!text)return;

  const { error } = await supabaseClient
    .from("client_messages")
    .insert({
      client_id:id,
      sender:"Daniel",
      message:text
    });

  if(error){
    console.error("Error enviando mensaje del entrenador:",error);
    toast("No se pudo enviar el mensaje");
    return;
  }

  await loadMessagesFromSupabase();

  closeModal();
  toast("Mensaje enviado");
}''',
    'Coach message persistence'
)

replace_once(
'''            const lastTime =
              last && last[2]
                ? last[2]
                : "";''',
'''            const lastTime =
              last && last[2]
                ? new Date(last[2]).toLocaleTimeString(
                    "es-ES",
                    {hour:"2-digit",minute:"2-digit"}
                  )
                : "";''',
    'Coach message timestamp formatting'
)

replace_once(
'''                comment: checkin.comment || "",
                reviewed: false,
                updated_at: new Date().toISOString()''',
'''                comment: checkin.comment || "",
                body_fat:
                  checkin.bodyFat !== undefined &&
                  checkin.bodyFat !== null &&
                  checkin.bodyFat !== ""
                    ? Number(checkin.bodyFat)
                    : null,
                reviewed: false,
                updated_at: new Date().toISOString()''',
    'Check-in body-fat persistence'
)

if text == original:
    raise RuntimeError("No changes were made")

path.write_text(text, encoding="utf-8")
print("Client/coach Supabase synchronization patch complete")
