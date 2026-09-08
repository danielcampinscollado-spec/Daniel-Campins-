/* DCC — Biblioteca premium local */
var exerciseLibraryFull=[];
window.exerciseLibraryFull=exerciseLibraryFull;
const DCC_LOCAL_LIBRARY="entrenamientos/ejercicios.json";
const DCC_PREMIUM_IMAGES=new Set([
  "press-banca-barra",
  "jalon-pecho-ancho",
  "remo-sentado-polea-neutro",
  "extension-triceps-cuerda",
  "press-hombro-maquina",
  "prensa-45",
  "extension-cuadriceps",
  "hip-thrust-maquina",
  "press-banca-mancuernas",
  "press-inclinado-barra",
  "press-inclinado-mancuernas",
  "press-pecho-maquina",
  "press-inclinado-maquina",
  "press-convergente-maquina",
  "aperturas-pec-deck",
  "cruces-polea-media",
  "cruces-polea-alta",
  "cruces-polea-baja",
  "flexiones",
  "press-declinado-maquina",
  "press-pecho-iso-lateral",
  "press-inclinado-iso-lateral",
  "press-banca-multipower",
  "press-inclinado-multipower",
  "aperturas-polea-banco",
  "extension-triceps-barra",
  "extension-triceps-unilateral",
  "extension-triceps-sobre-cabeza",
  "fondos-maquina-asistida",
  "press-triceps-maquina",
  "press-cerrado-barra",
  "extension-triceps-tumbado-ez",
  "fondos-maquina",
  "extension-triceps-maquina",
  "extension-triceps-polea-agarre-inverso",
  "extension-triceps-sobre-cabeza-unilateral"
]);
function dccLocalImage(ex){
  if(!ex||!DCC_PREMIUM_IMAGES.has(ex.id)||!ex.ilustracion)return "";
  return "entrenamientos/"+String(ex.ilustracion).replace(/^\/+/,"");
}
function dccMapLocal(ex){
  const image=dccLocalImage(ex);
  const muscle=ex.grupo==="Espalda"?"Dorsal":(ex.grupo||"");
  return {
    id:ex.id,name:ex.nombre||ex.id,muscle,secondaryMuscles:[],
    equipment:ex.equipo||"",image,imageStart:image,imagePeak:image,
    videoOptional:"",aliases:[],description:"",instructions:[],tips:[],
    difficulty:"",category:ex.patron||"",variationGroup:"",
    isUnilateral:/unilateral/i.test(ex.nombre||"")||/unilateral/i.test(ex.id||""),
    isBodyweight:/peso corporal/i.test(ex.equipo||""),source:"DCC"
  };
}
window.exerciseLibraryReady=fetch(DCC_LOCAL_LIBRARY,{cache:"no-store"})
  .then(response=>{if(!response.ok)throw new Error("No se pudo cargar la biblioteca DCC: HTTP "+response.status);return response.json();})
  .then(payload=>{
    const records=Array.isArray(payload?.ejercicios)?payload.ejercicios:[];
    exerciseLibraryFull.length=0;
    records.forEach(ex=>exerciseLibraryFull.push(dccMapLocal(ex)));
    window.exerciseLibraryFull=exerciseLibraryFull;
    return exerciseLibraryFull;
  })
  .catch(error=>{
    console.error("DCC — error de biblioteca local:",error);
    exerciseLibraryFull.length=0;
    window.exerciseLibraryFull=exerciseLibraryFull;
    throw error;
  });

window.addEventListener("load",()=>{
  async function loadMessagesFromSupabase(){try{const {data:rows,error}=await supabaseClient.from("client_messages").select("client_id,sender,message,created_at").order("created_at",{ascending:true});if(error)throw error;const grouped={};(rows||[]).forEach(row=>{if(!grouped[row.client_id])grouped[row.client_id]=[];grouped[row.client_id].push([row.sender||"",row.message||"",row.created_at||""]);});data.messages=grouped;saveData();}catch(error){console.error("Error cargando mensajes:",error);}}
  async function loadCheckinsFromSupabase(){try{const {data:rows,error}=await supabaseClient.from("client_checkins").select("client_id,weight,body_fat,diet,training,comment,reviewed,sent_at,updated_at");if(error)throw error;if(!data.checkins)data.checkins={};const serverIds=new Set((rows||[]).map(row=>String(row.client_id)));Object.entries(data.checkins).forEach(([id,checkin])=>{if(!serverIds.has(String(id))&&checkin){delete checkin.sentAt;delete checkin.weekKey;checkin.reviewed=false;}});const currentWeekStart=typeof getWeekStart==="function"?getWeekStart().getTime():null;(rows||[]).forEach(row=>{const previous=data.checkins[row.client_id]||{};const sentAt=row.sent_at||null;let weekKey=null;if(sentAt&&currentWeekStart!==null&&typeof getWeekStart==="function"){const sentDate=new Date(sentAt);if(Number.isFinite(sentDate.getTime())&&getWeekStart(sentDate).getTime()===currentWeekStart)weekKey=getCurrentWeekKey();}data.checkins[row.client_id]={...previous,weight:row.weight||previous.weight||"",bodyFat:row.body_fat!=null?Number(row.body_fat):(previous.bodyFat??""),diet:row.diet||"",training:row.training||"",comment:row.comment||"",reviewed:!!row.reviewed,sentAt:sentAt,updatedAt:row.updated_at||previous.updatedAt||null,weekKey:weekKey};});saveData();}catch(error){console.error("Error cargando check-ins:",error);}}
  const originalOpenApp=window.openApp||openApp;
  window.openApp=async function(app){await originalOpenApp(app);await Promise.all([loadMessagesFromSupabase(),loadCheckinsFromSupabase()]);if(app==="client")showClient("home");else showCoach("dashboard");};

  if(typeof showClient==="function"){const originalShowClient=showClient;window.showClient=function(screen){const safeScreen=screen==="coach"?"messages":screen;if(safeScreen==="progress"){const checkin=data?.checkins?.[currentClientId];const currentClient=client(currentClientId);if(currentClient&&checkin?.bodyFat!==undefined&&checkin.bodyFat!=="")currentClient.bodyFat=Number(checkin.bodyFat);}return originalShowClient(safeScreen);};}
  if(typeof updateClientBodyFat==="function"){const originalUpdateClientBodyFat=updateClientBodyFat;window.updateClientBodyFat=function(){const result=originalUpdateClientBodyFat.apply(this,arguments);const checkin=data?.checkins?.[currentClientId];const currentClient=client(currentClientId);if(currentClient&&checkin?.bodyFat!==undefined&&checkin.bodyFat!==""){currentClient.bodyFat=Number(checkin.bodyFat);saveData();}return result;};}
  function setCheckinStatus(message,ok){let status=document.getElementById("dcc-checkin-status");const button=document.querySelector('#client-main button[onclick="sendClientCheckin()"]');if(!button)return;if(!status){status=document.createElement("div");status.id="dcc-checkin-status";status.style.cssText="margin-top:12px;text-align:center;font-size:14px;font-weight:700;line-height:1.4;";button.insertAdjacentElement("afterend",status);}status.textContent=message;status.style.color=ok?"#39b982":"#e05a5a";}
  window.sendClientCheckin=async function(){const button=document.querySelector('#client-main button[onclick="sendClientCheckin()"]');const originalLabel=button?button.innerHTML:"";const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),12000);try{const c=client(currentClientId);if(!c)throw new Error("No se encontró el cliente");if(button){button.disabled=true;button.innerHTML="Enviando check-in…";}setCheckinStatus("Enviando…",true);if(!data.checkins)data.checkins={};if(!data.checkins[currentClientId])data.checkins[currentClientId]={weight:money(c.weight)+" kg",bodyFat:"",diet:"",training:"",comment:"",reviewed:false};const checkin=data.checkins[currentClientId];const commentBox=document.getElementById("checkin-comment");if(commentBox)checkin.comment=commentBox.value.trim();if(!checkin.diet||!checkin.training)throw new Error("Selecciona Alimentación y Entrenamiento antes de enviar");checkin.weight=money(c.weight)+" kg";checkin.reviewed=false;checkin.status="Nuevo check-in";checkin.weekKey=getCurrentWeekKey();c.status="Pendiente";const bodyFat=checkin.bodyFat===""||checkin.bodyFat==null?null:Number(checkin.bodyFat);const sentAt=new Date().toISOString();const payload={client_id:currentClientId,weight:checkin.weight,diet:checkin.diet,training:checkin.training,comment:checkin.comment||"",reviewed:false,sent_at:sentAt,updated_at:sentAt};if(Number.isFinite(bodyFat))payload.body_fat=bodyFat;const response=await fetch(SUPABASE_URL+"/rest/v1/client_checkins?on_conflict=client_id",{method:"POST",signal:controller.signal,headers:{"apikey":SUPABASE_KEY,"Authorization":"Bearer "+SUPABASE_KEY,"Content-Type":"application/json","Prefer":"resolution=merge-duplicates,return=minimal"},body:JSON.stringify(payload)});if(!response.ok){let detail="HTTP "+response.status;try{const err=await response.json();detail=err.message||err.details||err.hint||detail;}catch(_){ }throw new Error(detail);}checkin.sentAt=sentAt;if(Number.isFinite(bodyFat))c.bodyFat=bodyFat;saveData();setCheckinStatus("✓ Check-in enviado a Daniel",true);if(button){button.innerHTML="✓ Check-in enviado";button.disabled=true;}toast("✓ Check-in enviado a Daniel");}catch(error){const message=error?.name==="AbortError"?"La conexión ha tardado demasiado. Inténtalo de nuevo.":(error?.message||"No se pudo enviar el check-in");console.error("ERROR ENVIANDO CHECK-IN:",error);setCheckinStatus("ERROR: "+message,false);toast("ERROR: "+message);if(button){button.disabled=false;button.innerHTML=originalLabel;}}finally{clearTimeout(timeout);}};
  document.addEventListener("click",event=>{const button=event.target.closest('#client-main button[onclick="sendClientCheckin()"]');if(!button)return;event.preventDefault();event.stopImmediatePropagation();window.sendClientCheckin();},true);

  function withDietFoodCompatibility(render){const changed=[];Object.values(data?.diets||{}).forEach(clientDiet=>{["training","rest"].forEach(type=>{const meals=clientDiet?.[type]?.meals;if(!Array.isArray(meals))return;meals.forEach(meal=>{if(!Array.isArray(meal?.options))return;const foods=meal.options.flatMap(option=>Array.isArray(option?.foods)?option.foods:[]);changed.push({meal,had:Object.prototype.hasOwnProperty.call(meal,"foods"),value:meal.foods});meal.foods=foods;});});});try{return render();}finally{changed.forEach(item=>{if(item.had)item.meal.foods=item.value;else delete item.meal.foods;});}}
  function withCoachCheckinStatusCompatibility(render){const changed=[];(data.clients||[]).forEach(c=>{const checkin=data.checkins?.[c.id];changed.push([c,c.status]);c.status=checkin?.sentAt&&!checkin.reviewed?"Pendiente":"Revisado";});try{return render();}finally{changed.forEach(([c,status])=>{c.status=status;});}}
  if(typeof window.showClient==="function"){const previousShowClient=window.showClient;window.showClient=function(screen){if(screen==="home")return withDietFoodCompatibility(()=>previousShowClient(screen));return previousShowClient(screen);};}
  if(typeof showCoach==="function"){const previousShowCoach=showCoach;window.showCoach=function(screen){if(screen==="dashboard")return withDietFoodCompatibility(()=>withCoachCheckinStatusCompatibility(()=>previousShowCoach(screen)));if(screen==="checkins"){const allClients=data.clients;data.clients=(allClients||[]).filter(c=>!!data.checkins?.[c.id]?.sentAt);try{return previousShowCoach(screen);}finally{data.clients=allClients;}}return previousShowCoach(screen);};}

  window.reviewCheckin=function(id){const c=client(id);const x=data.checkins?.[id];if(!c||!x?.sentAt){toast("Este cliente todavía no ha enviado un check-in");return;}openModal(`<div class="modal-head"><h2>Check-in · ${esc(c.name)}</h2><button class="ghost" onclick="closeModal()">✕</button></div><div class="item"><b>Peso</b><br>${esc(x.weight||"—")}</div><div class="item"><b>% de grasa</b><br>${x.bodyFat!==""&&x.bodyFat!=null?esc(String(x.bodyFat))+" %":"—"}</div><div class="item"><b>Alimentación</b><br>${esc(x.diet||"—")}</div><div class="item"><b>Entrenamiento</b><br>${esc(x.training||"—")}</div><div class="item"><b>Comentario</b><br>${esc(x.comment||"—")}</div>${x.reviewed?`<div style="margin-top:14px;color:#69b66d;font-weight:700">✓ Check-in revisado</div>`:`<button class="btn" onclick="markReviewed('${id}')">✓ Marcar como revisado</button>`}`);};
  window.markReviewed=async function(id){const c=client(id);const x=data.checkins?.[id];if(!c||!x?.sentAt){toast("No hay un check-in enviado para revisar");return;}try{const {error:checkinError}=await supabaseClient.from("client_checkins").update({reviewed:true}).eq("client_id",id);if(checkinError)throw checkinError;x.reviewed=true;x.status="Revisado";c.status="Revisado";saveData();closeModal();showCoach("checkins");const {error:clientError}=await supabaseClient.from("clients").update({status:"Revisado"}).eq("id",id);if(clientError){console.error("Check-in revisado, pero no se pudo sincronizar clients.status:",clientError);toast("Check-in revisado; el estado secundario no pudo sincronizarse");return;}toast("Check-in marcado como revisado");}catch(error){console.error("Error guardando revisión:",error);toast("No se pudo guardar la revisión");}};

  async function loadCoachMessageSeenState(){try{const {data:rows,error}=await supabaseClient.from("client_notification_state").select("client_id,coach_message_seen_at");if(error)throw error;if(!data.notificationState)data.notificationState={};(rows||[]).forEach(row=>{if(!data.notificationState[row.client_id])data.notificationState[row.client_id]={};data.notificationState[row.client_id].coachMessageSeenAt=row.coach_message_seen_at||null;});saveData();}catch(error){console.error("Error cargando lectura de mensajes del entrenador:",error);}}
  function getLastClientMessage(id){const messages=data.messages?.[id]||[];for(let i=messages.length-1;i>=0;i--){const message=messages[i];if(Array.isArray(message)&&message[0]&&message[0]!=="Daniel")return message;}return null;}
  function coachHasUnreadMessage(id){const last=getLastClientMessage(id);if(!last)return false;const seenAt=data.notificationState?.[id]?.coachMessageSeenAt||null;if(!seenAt)return true;const messageDate=last[2]?new Date(last[2]):null;const seenDate=new Date(seenAt);if(!messageDate||!Number.isFinite(messageDate.getTime())||!Number.isFinite(seenDate.getTime()))return true;return messageDate>seenDate;}
  function withCoachMessageReadCompatibility(render){const changed=[];(data.clients||[]).forEach(c=>{const messages=data.messages?.[c.id];if(!Array.isArray(messages)||!messages.length||coachHasUnreadMessage(c.id))return;const last=messages[messages.length-1];if(Array.isArray(last)&&last[0]!=="Daniel"){changed.push([last,last[0]]);last[0]="Daniel";}});try{return render();}finally{changed.forEach(([message,sender])=>{message[0]=sender;});}}
  async function markCoachConversationSeen(id){const last=getLastClientMessage(id);if(!last)return;const previous=data.notificationState?.[id]?.coachMessageSeenAt||null;const messageDate=last[2]?new Date(last[2]):null;const seenAt=messageDate&&Number.isFinite(messageDate.getTime())?messageDate.toISOString():new Date().toISOString();if(!data.notificationState)data.notificationState={};if(!data.notificationState[id])data.notificationState[id]={};data.notificationState[id].coachMessageSeenAt=seenAt;saveData();try{const {error}=await supabaseClient.from("client_notification_state").upsert({client_id:id,coach_message_seen_at:seenAt,updated_at:new Date().toISOString()},{onConflict:"client_id"});if(error)throw error;}catch(error){console.error("Error guardando lectura de conversación:",error);data.notificationState[id].coachMessageSeenAt=previous;saveData();}if(currentApp==="coach"&&(currentScreen==="dashboard"||currentScreen==="messages"))window.showCoach(currentScreen);}
  const openAppBeforeCoachRead=window.openApp;window.openApp=async function(app){await openAppBeforeCoachRead(app);if(app==="coach"){await loadCoachMessageSeenState();window.showCoach("dashboard");}};
  const showCoachBeforeReadState=window.showCoach;window.showCoach=function(screen){if(screen==="dashboard"||screen==="messages")return withCoachMessageReadCompatibility(()=>showCoachBeforeReadState(screen));return showCoachBeforeReadState(screen);};
  const openMessagesBeforeReadState=window.openMessages||openMessages;window.openMessages=function(id){const result=openMessagesBeforeReadState(id);markCoachConversationSeen(id);return result;};

  window.addWeight=async function(id){const c=client(id);if(!c){toast("No se encontró el cliente");return;}const text=prompt("Nuevo peso (kg):");if(text===null)return;const value=parseFloat(text.trim().replace(",","."));if(!Number.isFinite(value)||value<=0||value>=500){toast("Introduce un peso válido");return;}try{const {error:clientError}=await supabaseClient.from("clients").update({weight:value}).eq("id",id);if(clientError)throw clientError;c.weight=value;const {error:historyError}=await supabaseClient.from("client_weights").insert({client_id:id,weight:value});if(!historyError){if(!data.weights[id])data.weights[id]=[];data.weights[id].push(value);}saveData();if(currentApp==="coach")showClientAdmin(id);else if(currentApp==="client")showClient("progress");if(historyError){console.error("Error guardando histórico del peso:",historyError);toast("Peso actualizado, pero no se pudo guardar el histórico");return;}toast("Peso actualizado");}catch(error){console.error("Error actualizando peso:",error);toast("No se pudo actualizar el peso");}};
});