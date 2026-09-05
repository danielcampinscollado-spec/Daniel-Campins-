/*
 * DCC — Biblioteca completa de ejercicios
 * Fuente de ejercicios e ilustraciones: RepDB Free Exercise Dataset.
 * Uso en app permitido con atribución visible:
 * "Exercise data by RepDB (repdb.co)"
 *
 * El catálogo se carga desde el JSON público y se adapta al modelo
 * que usa index.html 11.
 */

var exerciseLibraryFull = [];
window.exerciseLibraryFull = exerciseLibraryFull;

const DCC_EXERCISE_GROUPS = [
  "Pectoral","Dorsal","Hombros","Trapecio","Bíceps","Tríceps",
  "Antebrazos","Core","Lumbar","Cuádriceps","Femoral","Glúteos",
  "Gemelos","Pierna completa"
];

function dccExerciseGroups(primary, secondary, bodyPart){
  const muscles = [...new Set([...(primary || []), ...(secondary || [])].map(String))];
  const groups = [];
  const add = g => { if(!groups.includes(g)) groups.push(g); };
  const has = (...names) => names.some(n => muscles.includes(n));

  if(has("pectoralis_major","pectoralis_minor","serratus_anterior")) add("Pectoral");
  if(has("latissimus_dorsi","rhomboids","teres_major","teres_minor")) add("Dorsal");
  if(has("anterior_deltoid","lateral_deltoid","posterior_deltoid")) add("Hombros");
  if(has("trapezius","upper_trapezius","middle_trapezius","lower_trapezius")) add("Trapecio");
  if(has("biceps_brachii","brachialis")) add("Bíceps");
  if(has("triceps_brachii")) add("Tríceps");
  if(has("forearm_flexors","forearm_extensors","wrist_flexors","wrist_extensors","brachioradialis")) add("Antebrazos");
  if(has("rectus_abdominis","transverse_abdominis","obliques","internal_oblique","external_oblique")) add("Core");
  if(has("erector_spinae","multifidus","quadratus_lumborum")) add("Lumbar");
  if(has("quadriceps","rectus_femoris","vastus_lateralis","vastus_medialis","vastus_intermedius")) add("Cuádriceps");
  if(has("hamstrings","biceps_femoris","semitendinosus","semimembranosus")) add("Femoral");
  if(has("gluteus_maximus","gluteus_medius","gluteus_minimus")) add("Glúteos");
  if(has("gastrocnemius","soleus","plantaris","tibialis_posterior")) add("Gemelos");

  const lowerLeg = bodyPart === "lower_legs";
  const upperLeg = bodyPart === "upper_legs";
  const fullBody = bodyPart === "full_body";
  const lowerMuscles = has(
    "quadriceps","rectus_femoris","vastus_lateralis","vastus_medialis",
    "hamstrings","biceps_femoris","semitendinosus","semitendinosus",
    "gluteus_maximus","gluteus_medius","gluteus_minimus",
    "adductors","adductor_longus","adductor_magnus","adductor_brevis",
    "abductors","tensor_fasciae_latae"
  );

  if(lowerLeg) add("Gemelos");
  if(upperLeg || lowerMuscles) add("Pierna completa");

  // Full-body movements are shown under every relevant muscle group
  // discovered above; if none is specific enough, use Pierna completa.
  if(fullBody && groups.length === 0) add("Pierna completa");

  if(groups.length === 0){
    const fallback = {
      chest:"Pectoral",
      back:"Dorsal",
      shoulders:"Hombros",
      core:"Core",
      lower_arms:"Antebrazos",
      lower_legs:"Gemelos",
      upper_arms:"Bíceps",
      upper_legs:"Pierna completa",
      full_body:"Pierna completa"
    };
    add(fallback[bodyPart] || "Pierna completa");
  }

  return groups;
}

function dccEquipmentLabel(value){
  if(!value) return "Peso corporal";
  const map = {
    barbell:"Barra", dumbbell:"Mancuernas", cable:"Polea",
    kettlebell:"Kettlebell", plates:"Disco", smith_machine:"Multipower",
    chest_press_machine:"Máquina", chest_fly_machine:"Máquina",
    pec_deck:"Máquina", lat_pulldown_machine:"Máquina",
    leg_press:"Máquina", leg_extension:"Máquina", leg_curl:"Máquina",
    hack_squat:"Máquina", shoulder_press_machine:"Máquina",
    bicep_curl_machine:"Máquina", preacher_curl_machine:"Máquina",
    tricep_extension_machine:"Máquina", hip_thrust_machine:"Máquina",
    hip_abduction_machine:"Máquina", hip_adduction_machine:"Máquina",
    standing_calf_raise_machine:"Máquina", seated_calf_raise_machine:"Máquina",
    donkey_calf_raise_machine:"Máquina", back_extension_machine:"Máquina",
    dip_machine:"Máquina", assisted_pullup_machine:"Máquina",
    resistance_band:"Banda", loop_band:"Banda", trap_bar:"Trap bar",
    flat_bench:"Banco", pull_up_bar:"Barra dominadas", dip_station:"Paralelas",
    ab_wheel:"Rueda abdominal", stability_ball:"Fitball", suspension_trainer:"TRX",
    battle_rope:"Cuerda de batalla", slam_ball:"Slam ball", sled:"Trineo",
    plyo_box:"Cajón", rings:"Anillas", wrist_roller:"Rodillo de muñeca"
  };
  return map[value] || String(value).replaceAll("_"," ");
}

function dccImageUrl(path){
  if(!path) return "";
  return path.startsWith("http")
    ? path
    : "https://exercise-dataset.com/" + path.replace(/^\/+/,"");
}

function dccMapExercise(ex){
  const groups = dccExerciseGroups(
    ex.primary_muscles,
    ex.secondary_muscles,
    ex.body_part
  );

  return {
    id: ex.id,
    name: ex.name_es || ex.name_en || ex.id,
    muscle: groups[0],
    secondaryMuscles: groups.slice(1),
    equipment: dccEquipmentLabel(ex.equipment),
    image: dccImageUrl(
      ex.images?.flat?.peak ||
      ex.images?.flat?.start ||
      ex.images?.flat?.main ||
      ""
    ),
    imageStart: dccImageUrl(ex.images?.flat?.start || ex.images?.flat?.main || ""),
    imagePeak: dccImageUrl(ex.images?.flat?.peak || ex.images?.flat?.main || ""),
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

window.exerciseLibraryReady = fetch("https://exercise-dataset.com/exercises.json", {
  cache: "force-cache"
})
.then(r => {
  if(!r.ok) throw new Error("No se pudo cargar la biblioteca de ejercicios");
  return r.json();
})
.then(payload => {
  const source = Array.isArray(payload?.exercises) ? payload.exercises : [];
  exerciseLibraryFull.length = 0;
  source.forEach(ex => exerciseLibraryFull.push(dccMapExercise(ex)));
  window.exerciseLibraryFull = exerciseLibraryFull;

  console.log("DCC: biblioteca de ejercicios cargada:", exerciseLibraryFull.length);
  return exerciseLibraryFull;
})
.catch(err => {
  console.error("DCC: error cargando biblioteca", err);
  return exerciseLibraryFull;
});
