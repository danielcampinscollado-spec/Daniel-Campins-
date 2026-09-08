/* DCC — Biblioteca propia premium de ejercicios */
(function(){
  const realFetch=window.fetch.bind(window);

  /* Bloqueamos la carga externa antigua de RepDB mientras runtime-compat arranca. */
  window.fetch=function(input,init){
    const url=String(input||"");
    if(url.includes("exercise-dataset.com/exercises.json")){
      return Promise.resolve(new Response(JSON.stringify({exercises:[]}),{
        status:200,
        headers:{"Content-Type":"application/json"}
      }));
    }
    return realFetch(input,init);
  };

  document.write('<script src="./entrenamientos/runtime-compat.js"><\/script>');
  window.fetch=realFetch;

  const legacyReady=window.exerciseLibraryReady;

  /* Únicamente ilustraciones DCC nuevas ya aprobadas y presentes en GitHub. */
  const illustrated=new Set([
    "press-banca-barra","jalon-pecho-ancho","remo-sentado-polea-neutro","extension-triceps-cuerda","press-hombro-maquina","prensa-45","extension-cuadriceps","hip-thrust-maquina","press-banca-mancuernas","press-inclinado-barra","press-inclinado-mancuernas","press-pecho-maquina","press-inclinado-maquina","press-convergente-maquina","aperturas-pec-deck","cruces-polea-media","cruces-polea-alta","cruces-polea-baja","flexiones","press-declinado-maquina","press-pecho-iso-lateral","press-inclinado-iso-lateral","press-banca-multipower","press-inclinado-multipower","aperturas-polea-banco","extension-triceps-barra","extension-triceps-unilateral","extension-triceps-sobre-cabeza","fondos-maquina-asistida","press-triceps-maquina","press-cerrado-barra","extension-triceps-tumbado-ez","fondos-maquina","extension-triceps-maquina","extension-triceps-polea-agarre-inverso","extension-triceps-sobre-cabeza-unilateral"
  ]);

  const mapMuscle=group=>group==="Espalda"?"Dorsal":group;
  const mapExercise=ex=>{
    const image=illustrated.has(ex.id)&&ex.ilustracion?`./entrenamientos/${ex.ilustracion}`:"";
    return{id:ex.id,name:ex.nombre||ex.id,muscle:mapMuscle(ex.grupo||""),secondaryMuscles:[],equipment:ex.equipo||"",image,imageStart:image,imagePeak:image,videoOptional:"",aliases:[],description:"",instructions:[],tips:[],difficulty:"",category:ex.patron||"",variationGroup:"",isUnilateral:/unilateral/i.test(ex.id+" "+(ex.nombre||"")),isBodyweight:ex.equipo==="Peso corporal",source:"DCC"};
  };

  window.exerciseLibraryReady=Promise.resolve(legacyReady)
    .catch(()=>[])
    .then(()=>realFetch("./entrenamientos/ejercicios.json",{cache:"no-store"}))
    .then(response=>{if(!response.ok)throw new Error("No se pudo cargar la biblioteca DCC: HTTP "+response.status);return response.json()})
    .then(payload=>{const records=Array.isArray(payload?.ejercicios)?payload.ejercicios:[];if(!Array.isArray(window.exerciseLibraryFull))window.exerciseLibraryFull=[];window.exerciseLibraryFull.length=0;records.forEach(ex=>window.exerciseLibraryFull.push(mapExercise(ex)));window.dispatchEvent(new CustomEvent("dcc:exercise-library-ready",{detail:{count:window.exerciseLibraryFull.length}}));return window.exerciseLibraryFull})
    .catch(error=>{console.error("DCC — error cargando biblioteca propia:",error);if(Array.isArray(window.exerciseLibraryFull))window.exerciseLibraryFull.length=0;return[]});

  /* Editores premium cargados fuera del index para evitar regresiones. */
  const inlineEditor=document.createElement('script');
  inlineEditor.src='./training-inline-fix.js?v=20260908-3';
  inlineEditor.async=true;
  document.head.appendChild(inlineEditor);

  const progress=document.createElement('script');
  progress.src='./progress-premium-v2.js?v=20260908-2';
  progress.async=true;
  document.head.appendChild(progress);
})();