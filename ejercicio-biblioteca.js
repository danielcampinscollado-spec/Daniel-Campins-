/* DCC — Biblioteca propia de ejercicios */
(function(){
  const realFetch=window.fetch.bind(window);
  window.fetch=function(input,init){
    const url=String(input||"");
    if(url.includes("exercise-dataset.com/exercises.json")){
      return Promise.resolve(new Response(JSON.stringify({exercises:[]}),{status:200,headers:{"Content-Type":"application/json"}}));
    }
    return realFetch(input,init);
  };

  document.write('<script src="./entrenamientos/runtime-compat.js"><\/script>');
  window.fetch=realFetch;

  const legacyReady=window.exerciseLibraryReady;
  const illustrated=new Set(["press-banca-barra","jalon-pecho-ancho","extension-triceps-cuerda"]);
  const mapMuscle=group=>group==="Espalda"?"Dorsal":group;
  const mapExercise=ex=>{
    const image=illustrated.has(ex.id)&&ex.ilustracion?`./entrenamientos/${ex.ilustracion}`:"";
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
      isUnilateral:false,
      isBodyweight:ex.equipo==="Peso corporal",
      source:"DCC"
    };
  };

  window.exerciseLibraryReady=Promise.resolve(legacyReady)
    .catch(()=>[])
    .then(()=>realFetch("./entrenamientos/ejercicios-base.json",{cache:"no-store"}))
    .then(response=>{if(!response.ok)throw new Error("No se pudo cargar la biblioteca DCC: HTTP "+response.status);return response.json();})
    .then(payload=>{
      const records=Array.isArray(payload?.ejercicios)?payload.ejercicios:[];
      if(!Array.isArray(window.exerciseLibraryFull))window.exerciseLibraryFull=[];
      window.exerciseLibraryFull.length=0;
      records.forEach(ex=>window.exerciseLibraryFull.push(mapExercise(ex)));
      return window.exerciseLibraryFull;
    })
    .catch(error=>{
      console.error("DCC — error cargando biblioteca propia:",error);
      if(Array.isArray(window.exerciseLibraryFull))window.exerciseLibraryFull.length=0;
      return [];
    });
})();
