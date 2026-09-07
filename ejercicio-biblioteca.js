/*
 * DCC — Biblioteca de ejercicios
 * Fuente: RepDB
 * Uso dentro de la app con atribución:
 * "Exercise data by RepDB (repdb.co)"
 *
 * Este archivo es compatible con index 11.
 */

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
  return words.some(word =>
    list.some(m => m === word || m.includes(word))
  );
}

function dccGroups(ex){
  const primary = Array.isArray(ex.primary_muscles) ? ex.primary_muscles : [];
  const secondary = Array.isArray(ex.secondary_muscles) ? ex.secondary_muscles : [];
  const muscles = [...new Set([...primary, ...secondary])];

  const body = dccText(ex.body_part);
  const groups = [];

  const add = group => {
    if(!groups.includes(group)) groups.push(group);
  };

  /*
   * PRIMERO usamos la anatomía real del registro.
   * Esto evita que ejercicios de core, hombro o pierna
   * terminen dentro de Pectoral por un fallback incorrecto.
   */

  if(body === "chest" || dccHas(primary,["chest","pectoralis","pec"])) add("Pectoral");
  if(body === "back" || dccHas(primary,["latissimus","rhomboid","teres major","teres minor"])) add("Dorsal");
  if(body === "shoulders" || dccHas(primary,["deltoid","shoulder"])) add("Hombros");
  if(dccHas(primary,["trapezius","trapezius"])) add("Trapecio");

  if(body === "upper arms"){
    if(dccHas(primary,["triceps","tricep"])) add("Tríceps");
    else if(dccHas(primary,["biceps","bicep","brachialis"])) add("Bíceps");
  } else {
    if(dccHas(primary,["triceps","tricep"])) add("Tríceps");
    if(dccHas(primary,["biceps","bicep","brachialis"])) add("Bíceps");
  }

  if(body === "lower arms" || dccHas(primary,["forearm","wrist"])) add("Antebrazos");

  if(
    body === "core" ||
    dccHas(primary,[
      "abdom",
      "rectus abdominis",
      "transverse abdominis",
      "oblique",
      "serratus"
    ])
  ) add("Core");

  if(dccHas(primary,["erector","multifidus","quadratus lumborum"])) add("Lumbar");

  if(
    body === "upper legs" ||
    dccHas(primary,["quadriceps","quad","vastus","rectus femoris"])
  ) add("Cuádriceps");

  if(dccHas(primary,["hamstring","biceps femoris","semitendinosus","semimembranosus"])) add("Femoral");

  if(dccHas(primary,["gluteus","glute"])) add("Glúteos");

  if(
    body === "lower legs" ||
    dccHas(primary,["gastrocnemius","soleus","calf","calves"])
  ) add("Gemelos");

  /*
   * Pierna completa solo como grupo adicional para movimientos
   * claramente multiarticulares de pierna.
   */
  const lower =
    groups.includes("Cuádriceps") ||
    groups.includes("Femoral") ||
    groups.includes("Glúteos");

  const multiLower =
    dccHas(primary,["quadriceps","hamstring","gluteus"]) ||
    body === "full body";

  if(multiLower && lower) add("Pierna completa");

  /*
   * Fallback seguro: SOLO si no hemos podido clasificar.
   */
  if(!groups.length){
    if(body === "chest") add("Pectoral");
    else if(body === "back") add("Dorsal");
    else if(body === "shoulders") add("Hombros");
    else if(body === "core") add("Core");
    else if(body === "lower arms") add("Antebrazos");
    else if(body === "lower legs") add("Gemelos");
    else if(body === "upper legs") add("Pierna completa");
    else if(body === "upper arms"){
      add("Bíceps");
    } else {
      add("Pierna completa");
    }
  }

  return groups;
}

function dccEquipment(value){
  if(!value) return "Peso corporal";

  const labels = {
    barbell:"Barra",
    dumbbell:"Mancuernas",
    cable:"Polea",
    kettlebell:"Kettlebell",
    plates:"Disco",
    smith_machine:"Multipower",
    ez_bar:"Barra EZ",
    trap_bar:"Trap bar",
    resistance_band:"Banda",
    loop_band:"Banda",
    pull_up_bar:"Barra de dominadas",
    dip_station:"Paralelas",
    ab_wheel:"Rueda abdominal",
    flat_bench:"Banco",
    plyo_box:"Cajón",
    stability_ball:"Fitball",
    suspension_trainer:"TRX",
    rings:"Anillas",
    battle_rope:"Cuerda de batalla",
    slam_ball:"Slam ball",
    sled:"Trineo",
    wrist_roller:"Rodillo de muñeca"
  };

  return labels[value] ||
    String(value).replaceAll("_"," ").replace(/\b\w/g,c=>c.toUpperCase());
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
    id: ex.id,
    name: ex.name_es || ex.name_en || ex.id,

    muscle: groups[0],
    secondaryMuscles: groups.slice(1),

    equipment: dccEquipment(ex.equipment),

    image: dccImage(flat.peak || flat.main || flat.start || ""),
    imageStart: dccImage(flat.start || flat.main || flat.peak || ""),
    imagePeak: dccImage(flat.peak || flat.main || flat.start || ""),

    videoOptional: "",

    aliases: [ex.name_en, ex.name_de].filter(Boolean),

    description: ex.description_es || ex.description_en || "",
    instructions: ex.instructions_es || ex.instructions_en || [],
    tips: ex.tips_es || ex.tips_en || [],

    difficulty: ex.difficulty || "",
    category: ex.category || "",
    variationGroup: ex.variation_group || "",

    isUnilateral: !!ex.is_unilateral,
    isBodyweight: !!ex.is_bodyweight,

    source: "RepDB"
  };
}

/*
 * Fuente oficial del catálogo.
 * No dependemos de un paquete npm ni de una versión inventada.
 */
window.exerciseLibraryReady = fetch(
  "https://exercise-dataset.com/exercises.json",
  { cache:"no-store" }
)
.then(response => {
  if(!response.ok){
    throw new Error("No se pudo cargar la biblioteca RepDB: HTTP " + response.status);
  }
  return response.json();
})
.then(data => {
  const records = Array.isArray(data && data.exercises)
    ? data.exercises
    : [];

  exerciseLibraryFull.length = 0;

  records.forEach(ex => {
    exerciseLibraryFull.push(dccMap(ex));
  });

  window.exerciseLibraryFull = exerciseLibraryFull;

  console.log(
    "DCC — biblioteca cargada:",
    exerciseLibraryFull.length,
    "ejercicios"
  );

  return exerciseLibraryFull;
})
.catch(error => {
  console.error("DCC — error de biblioteca:", error);
  exerciseLibraryFull.length = 0;
  window.exerciseLibraryFull = exerciseLibraryFull;
  throw error;
});

/*
 * DCC — Hotfixes conservadores para la versión actual de index.html.
 * Se aplican después de que el script principal haya definido sus funciones.
 * No alteran datos, rutinas ni dietas; solo corrigen rutas antiguas y
 * mantienen sincronizado el % de grasa en el estado local del cliente.
 */
window.addEventListener("load", () => {
  if(typeof window.showClient === "function"){
    const originalShowClient = window.showClient;

    window.showClient = function(screen){
      const safeScreen =
        screen === "coach"
          ? "messages"
          : screen === "profile"
            ? "progress"
            : screen;

      if(safeScreen === "progress"){
        try{
          const id = window.currentClientId;
          const checkin = window.data?.checkins?.[id];
          const currentClient =
            typeof window.client === "function"
              ? window.client(id)
              : null;

          if(
            currentClient &&
            checkin &&
            checkin.bodyFat !== undefined &&
            checkin.bodyFat !== null &&
            checkin.bodyFat !== ""
          ){
            currentClient.bodyFat = Number(checkin.bodyFat);
          }
        }catch(error){
          console.error("DCC — no se pudo sincronizar % de grasa:", error);
        }
      }

      return originalShowClient.call(this, safeScreen);
    };
  }

  if(typeof window.updateClientBodyFat === "function"){
    const originalUpdateClientBodyFat = window.updateClientBodyFat;

    window.updateClientBodyFat = function(){
      const result = originalUpdateClientBodyFat.apply(this, arguments);

      try{
        const id = window.currentClientId;
        const checkin = window.data?.checkins?.[id];
        const currentClient =
          typeof window.client === "function"
            ? window.client(id)
            : null;

        if(
          currentClient &&
          checkin &&
          checkin.bodyFat !== undefined &&
          checkin.bodyFat !== null &&
          checkin.bodyFat !== ""
        ){
          currentClient.bodyFat = Number(checkin.bodyFat);
          if(typeof window.saveData === "function"){
            window.saveData();
          }
        }
      }catch(error){
        console.error("DCC — no se pudo guardar % de grasa local:", error);
      }

      return result;
    };
  }
});
