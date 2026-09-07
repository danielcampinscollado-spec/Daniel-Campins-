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

  /* Ilustraciones individuales premium ya presentes físicamente en GitHub. */
  const illustrated=new Set([
    "press-banca-barra",
    "jalon-pecho-ancho",
    "remo-sentado-polea-neutro",
    "extension-triceps-cuerda"
  ]);

  /* Mientras completamos las 130 ilustraciones, ningún ejercicio queda visualmente vacío:
     se usa la lámina muscular dorada del grupo como fallback premium. */
  const muscleFallback={
    "Pectoral":"./assets/muscles/pecho.png",
    "Espalda":"./assets/muscles/espalda.png",
    "Hombros":"./assets/muscles/hombros.png",
    "Bíceps":"./assets/muscles/biceps.png",
    "Tríceps":"./assets/muscles/triceps.png",
    "Cuádriceps":"./assets/muscles/cuadriceps.png",
    "Femoral":"./assets/muscles/isquios.png",
    "Glúteos":"./assets/muscles/gluteos.png",
    "Gemelos":"./assets/muscles/gemelos.png",
    "Core":"./assets/muscles/core.png",
    "Lumbar":"./assets/muscles/lumbar-cuello.png"
  };

  const mapMuscle=group=>group==="Espalda"?"Dorsal":group;

  const mapExercise=ex=>{
    const ownImage=illustrated.has(ex.id)&&ex.ilustracion
      ? `./entrenamientos/${ex.ilustracion}`
      : "";
    const fallback=muscleFallback[ex.grupo]||"";
    const image=ownImage||fallback;

    return{
      id:ex.id,
      name:ex.nombre||ex.id,
      muscle:mapMuscle(ex.grupo||""),
      secondaryMuscles:[],
      equipment:ex.equipo||"",
      image,
      imageStart:image,
      imagePeak:image,
      videoOptional:"",
      aliases:[],
      description:"",
      instructions:[],
      tips:[],
      difficulty:"",
      category:ex.patron||"",
      variationGroup:"",
      isUnilateral:/unilateral/i.test(ex.id+" "+(ex.nombre||"")),
      isBodyweight:ex.equipo==="Peso corporal",
      source:"DCC"
    };
  };

  window.exerciseLibraryReady=Promise.resolve(legacyReady)
    .catch(()=>[])
    .then(()=>realFetch("./entrenamientos/ejercicios.json",{cache:"no-store"}))
    .then(response=>{
      if(!response.ok)throw new Error("No se pudo cargar la biblioteca DCC: HTTP "+response.status);
      return response.json();
    })
    .then(payload=>{
      const records=Array.isArray(payload?.ejercicios)?payload.ejercicios:[];
      if(!Array.isArray(window.exerciseLibraryFull))window.exerciseLibraryFull=[];
      window.exerciseLibraryFull.length=0;
      records.forEach(ex=>window.exerciseLibraryFull.push(mapExercise(ex)));
      window.dispatchEvent(new CustomEvent("dcc:exercise-library-ready",{detail:{count:window.exerciseLibraryFull.length}}));
      return window.exerciseLibraryFull;
    })
    .catch(error=>{
      console.error("DCC — error cargando biblioteca propia:",error);
      if(Array.isArray(window.exerciseLibraryFull))window.exerciseLibraryFull.length=0;
      return [];
    });
})();
