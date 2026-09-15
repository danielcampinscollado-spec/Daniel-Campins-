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

/* Runtime de ejercicios únicamente. La lógica global de app vive en sus módulos propietarios. */
