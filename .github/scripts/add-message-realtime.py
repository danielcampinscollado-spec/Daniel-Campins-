from pathlib import Path

path=Path("index.html")
text=path.read_text(encoding="utf-8")
original=text

realtime=r'''function setupMessageRealtime(){

  if(window.clientMessagesRealtimeChannel){
    return;
  }

  const channel = supabaseClient
    .channel("client-messages-sync")
    .on(
      "postgres_changes",
      {
        event:"INSERT",
        schema:"public",
        table:"client_messages"
      },
      payload=>{

        const row=payload?.new;

        if(!row?.client_id) return;

        if(!data.messages){
          data.messages={};
        }

        if(!data.messages[row.client_id]){
          data.messages[row.client_id]=[];
        }

        const exists=data.messages[row.client_id].some(m=>
          m?.[0]===row.sender &&
          m?.[1]===row.message &&
          m?.[2]===row.created_at
        );

        if(!exists){
          data.messages[row.client_id].push([
            row.sender || "",
            row.message || "",
            row.created_at || null
          ]);

          saveData();
        }

        if(
          currentApp==="client" &&
          row.client_id===currentClientId
        ){

          if(currentScreen==="messages"){

            const draft=
              document.getElementById("client-message")?.value || "";

            showClient("messages");

            requestAnimationFrame(()=>{
              const box=document.getElementById("client-message");
              if(box) box.value=draft;
            });

          }else if(currentScreen==="home"){

            showClient("home");

          }

        }

        if(currentApp==="coach"){

          if(
            window.openCoachMessageClientId===row.client_id &&
            document.getElementById("modal")?.style.display==="grid"
          ){

            const draft=
              document.getElementById("coach-message")?.value || "";

            openMessages(row.client_id);

            requestAnimationFrame(()=>{
              const box=document.getElementById("coach-message");
              if(box) box.value=draft;
            });

          }else if(currentScreen==="messages"){

            showCoach("messages");

          }else if(currentScreen==="dashboard"){

            showCoach("dashboard");

          }

        }

      }
    )
    .subscribe(status=>{
      if(status==="CHANNEL_ERROR"){
        console.error("No se pudo activar la mensajería en tiempo real");
      }
    });

  window.clientMessagesRealtimeChannel=channel;
}
'''

anchor='async function openApp(app){'
if 'function setupMessageRealtime(){' not in text:
    if text.count(anchor)!=1:
        raise RuntimeError(f"Realtime insertion anchor count: {text.count(anchor)}")
    text=text.replace(anchor,realtime+'\n'+anchor,1)

call_old='''  currentApp = app;

  const login ='''
call_new='''  currentApp = app;

  setupMessageRealtime();

  const login ='''
if call_new not in text:
    if text.count(call_old)!=1:
        raise RuntimeError(f"Realtime startup anchor count: {text.count(call_old)}")
    text=text.replace(call_old,call_new,1)

open_old='''function openMessages(id){
const c=client(id);'''
open_new='''function openMessages(id){
window.openCoachMessageClientId=id;
const c=client(id);'''
if open_new not in text:
    if text.count(open_old)!=1:
        raise RuntimeError(f"Coach conversation anchor count: {text.count(open_old)}")
    text=text.replace(open_old,open_new,1)

close_old='''function closeModal(){
document.getElementById("modal").style.display="none";
}'''
close_new='''function closeModal(){
window.openCoachMessageClientId=null;
document.getElementById("modal").style.display="none";
}'''
if close_new not in text:
    if text.count(close_old)!=1:
        raise RuntimeError(f"closeModal anchor count: {text.count(close_old)}")
    text=text.replace(close_old,close_new,1)

if text==original:
    raise RuntimeError("No changes made")

path.write_text(text,encoding="utf-8")
print("Realtime messaging added")
