/* DCC — Biblioteca de ejercicios · Fuente: RepDB */
var exerciseLibraryFull = [];
window.exerciseLibraryFull = exerciseLibraryFull;

const DCC_IMAGE_BASE = "https://exercise-dataset.com/";

function dccText(value){
  return String(value || "").toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g,"")
    .replace(/[_-]+/g," ");
}

function dccHas(muscles, words){
  const list = muscles.map(dccText);
  return words.some(word => list.some(m => m === word || m.includes(word)));
}

function dccGroups(ex){
  const primary = Array.isArray(ex.primary_muscles) ? ex.primary_muscles : [];
  const body = dccText(ex.body_part);
  const groups = [];
  const add = group => { if(!groups.includes(group)) groups.push(group); };

  if(body === "chest" || dccHas(primary,["chest","pectoralis","pec"])) add("Pectoral");
  if(body === "back" || dccHas(primary,["latissimus","rhomboid","teres major","teres minor"])) add("Dorsal");
  if(body === "shoulders" || dccHas(primary,["deltoid","shoulder"])) add("Hombros");
  if(dccHas(primary,["trapezius"])) add("Trapecio");

  if(body === "upper arms"){
    if(dccHas(primary,["triceps","tricep"])) add("Tríceps");
    else if(dccHas(primary,["biceps","bicep","brachialis"])) add("Bíceps");
  }else{
    if(dccHas(primary,["triceps","tricep"])) add("Tríceps");
    if(dccHas(primary,["biceps","bicep","brachialis"])) add("Bíceps");
  }

  if(body === "lower arms" || dccHas(primary,["forearm","wrist"])) add("Antebrazos");
  if(body === "core" || dccHas(primary,["abdom","rectus abdominis","transverse abdominis","oblique","serratus"])) add("Core");
  if(dccHas(primary,["erector","multifidus","quadratus lumborum"])) add("Lumbar");
  if(body === "upper legs" || dccHas(primary,["quadriceps","quad","vastus","rectus femoris"])) add("Cuádriceps");
  if(dccHas(primary,["hamstring","biceps femoris","semitendinosus","semimembranosus"])) add("Femoral");
  if(dccHas(primary,["gluteus","glute"])) add("Glúteos");
  if(body === "lower legs" || dccHas(primary,["gastrocnemius","soleus","calf","calves"])) add("Gemelos");

  const lower = groups.includes("Cuádriceps") || groups.includes("Femoral") || groups.includes("Glúteos");
  const multiLower = dccHas(primary,["quadriceps","hamstring","gluteus"]) || body === "full body";
  if(multiLower && lower) add("Pierna completa");

  if(!groups.length){
    if(body === "chest") add("Pectoral");
    else if(body === "back") add("Dorsal");
    else if(body === "shoulders") add("Hombros");
    else if(body === "core") add("Core");
    else if(body === "lower arms") add("Antebrazos");
    else if(body === "lower legs") add("Gemelos");
    else if(body === "upper legs") add("Pierna completa");
    else if(body === "upper arms") add("Bíceps");
    else add("Pierna completa");
  }

  return groups;
}

function dccEquipment(value){
  if(!value) return "Peso corporal";
  const labels = {
    barbell:"Barra", dumbbell:"Mancuernas", cable:"Polea", kettlebell:"Kettlebell",
    plates:"Disco", smith_machine:"Multipower", ez_bar:"Barra EZ", trap_bar:"Trap bar",
    resistance_band:"Banda", loop_band:"Banda", pull_up_bar:"Barra de dominadas",
    dip_station:"Paralelas", ab_wheel:"Rueda abdominal", flat_bench:"Banco",
    plyo_box:"Cajón", stability_ball:"Fitball", suspension_trainer:"TRX", rings:"Anillas",
    battle_rope:"Cuerda de batalla", slam_ball:"Slam ball", sled:"Trineo",
    wrist_roller:"Rodillo de muñeca"
  };
  return labels[value] || String(value).replaceAll("_"," ").replace(/\b\w/g,c=>c.toUpperCase());
}

function dccImage(path){
  if(!path) return "";
  if(/^https?:\/\//i.test(path)) return path;
  return DCC_IMAGE_BASE + String(path).replace(/^\/+/,"");
}

function dccMap(ex){
  const groups = dccGroups(ex);
  const flat = ex.images && ex.images.flat ? ex.images.flat : {};
  return {
    id:ex.id,
    name:ex.name_es || ex.name_en || ex.id,
    muscle:groups[0],
    secondaryMuscles:groups.slice(1),
    equipment:dccEquipment(ex.equipment),
    image:dccImage(flat.peak || flat.main || flat.start || ""),
    imageStart:dccImage(flat.start || flat.main || flat.peak || ""),
    imagePeak:dccImage(flat.peak || flat.main || flat.start || ""),
    videoOptional:"",
    aliases:[ex.name_en,ex.name_de].filter(Boolean),
    description:ex.description_es || ex.description_en || "",
    instructions:ex.instructions_es || ex.instructions_en || [],
    tips:ex.tips_es || ex.tips_en || [],
    difficulty:ex.difficulty || "",
    category:ex.category || "",
    variationGroup:ex.variation_group || "",
    isUnilateral:!!ex.is_unilateral,
    isBodyweight:!!ex.is_bodyweight,
    source:"RepDB"
  };
}

window.exerciseLibraryReady = fetch("https://exercise-dataset.com/exercises.json",{cache:"no-store"})
.then(response=>{
  if(!response.ok) throw new Error("No se pudo cargar la biblioteca RepDB: HTTP "+response.status);
  return response.json();
})
.then(payload=>{
  const records = Array.isArray(payload?.exercises) ? payload.exercises : [];
  exerciseLibraryFull.length = 0;
  records.forEach(ex=>exerciseLibraryFull.push(dccMap(ex)));
  window.exerciseLibraryFull = exerciseLibraryFull;
  console.log("DCC — biblioteca cargada:",exerciseLibraryFull.length,"ejercicios");
  return exerciseLibraryFull;
})
.catch(error=>{
  console.error("DCC — error de biblioteca:",error);
  exerciseLibraryFull.length = 0;
  window.exerciseLibraryFull = exerciseLibraryFull;
  throw error;
});

/* Correcciones temporales hasta integrar estos cambios en index.html. */
window.addEventListener("load",()=>{
  if(typeof showClient === "function"){
    const originalShowClient = showClient;
    window.showClient = function(screen){
      const safeScreen = screen === "coach" ? "messages" : screen;
      if(safeScreen === "progress"){
        const checkin = data?.checkins?.[currentClientId];
        const currentClient = client(currentClientId);
        if(currentClient && checkin?.bodyFat !== undefined && checkin.bodyFat !== ""){
          currentClient.bodyFat = Number(checkin.bodyFat);
        }
      }
      return originalShowClient(safeScreen);
    };
  }

  if(typeof updateClientBodyFat === "function"){
    const originalUpdateClientBodyFat = updateClientBodyFat;
    window.updateClientBodyFat = function(){
      const result = originalUpdateClientBodyFat.apply(this,arguments);
      const checkin = data?.checkins?.[currentClientId];
      const currentClient = client(currentClientId);
      if(currentClient && checkin?.bodyFat !== undefined && checkin.bodyFat !== ""){
        currentClient.bodyFat = Number(checkin.bodyFat);
        saveData();
      }
      return result;
    };
  }

  window.sendClientCheckin = async function(){
    try{
      const c = client(currentClientId);
      if(!c){ toast("No se encontró el cliente"); return; }

      if(!data.checkins) data.checkins = {};
      if(!data.checkins[currentClientId]){
        data.checkins[currentClientId] = {
          weight:money(c.weight)+" kg", bodyFat:"", diet:"", training:"",
          comment:"", reviewed:false
        };
      }

      const checkin = data.checkins[currentClientId];
      const commentBox = document.getElementById("checkin-comment");
      if(commentBox) checkin.comment = commentBox.value.trim();

      checkin.weight = money(c.weight)+" kg";
      checkin.reviewed = false;
      checkin.status = "Nuevo check-in";
      checkin.sentAt = new Date().toISOString();
      checkin.weekKey = getCurrentWeekKey();
      c.status = "Pendiente";

      const bodyFat = checkin.bodyFat === "" || checkin.bodyFat == null
        ? null
        : Number(checkin.bodyFat);

      const {error} = await supabaseClient.from("client_checkins").upsert({
        client_id:currentClientId,
        weight:checkin.weight,
        body_fat:Number.isFinite(bodyFat) ? bodyFat : null,
        diet:checkin.diet || "Pendiente",
        training:checkin.training || "Pendiente",
        comment:checkin.comment || "",
        reviewed:false,
        updated_at:new Date().toISOString()
      },{onConflict:"client_id"});

      if(error){
        console.error("ERROR ENVIANDO CHECK-IN:",error);
        toast("No se pudo enviar el check-in: "+(error.message || "Error desconocido"));
        return;
      }

      if(Number.isFinite(bodyFat)) c.bodyFat = bodyFat;
      saveData();
      toast("Check-in enviado a Daniel");
      showClient("checkin");
    }catch(error){
      console.error("ERROR GENERAL CHECK-IN:",error);
      toast("No se pudo enviar el check-in: "+(error.message || "Error desconocido"));
    }
  };
});