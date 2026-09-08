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

  /* Estilo estable de las métricas: se instala antes de renderizar la ficha para evitar parpadeos. */
  if(!document.getElementById('dcc-stable-metrics-css')){
    const style=document.createElement('style');
    style.id='dcc-stable-metrics-css';
    style.textContent=`
      #coach-main.dcc-ca .dcc-ca-metrics{gap:10px!important}
      #coach-main.dcc-ca .dcc-ca-metrics .dcc-ca-metric{position:relative!important;min-height:126px!important;padding:15px 14px 11px 58px!important;overflow:hidden!important;border:1px solid #2b343d!important;border-radius:20px!important;background:radial-gradient(circle at 82% 8%,rgba(242,200,95,.08),transparent 34%),linear-gradient(145deg,#11171d,#080c0f)!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.025)!important}
      #coach-main.dcc-ca .dcc-ca-metrics .dcc-ca-metric::before{content:'';position:absolute;left:12px;top:13px;width:34px;height:34px;border-radius:11px;border:1px solid rgba(242,200,95,.32);background-color:rgba(242,200,95,.10);background-repeat:no-repeat;background-position:center;background-size:19px 19px;box-shadow:none!important}
      #coach-main.dcc-ca .dcc-ca-metrics .dcc-ca-metric:nth-child(1)::before,#coach-main.dcc-ca .dcc-ca-metrics .dcc-metric-weight::before{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23f2c85f' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M8 8.5V6a4 4 0 0 1 8 0v2.5'/%3E%3Cpath d='M7 8.5h10l2.3 11.5H4.7L7 8.5Z'/%3E%3C/svg%3E")}
      #coach-main.dcc-ca .dcc-ca-metrics .dcc-ca-metric:nth-child(2)::before,#coach-main.dcc-ca .dcc-ca-metrics .dcc-metric-fat::before{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23f2c85f' stroke-width='1.8' stroke-linecap='round'%3E%3Ccircle cx='7.5' cy='7.5' r='2.5'/%3E%3Ccircle cx='16.5' cy='16.5' r='2.5'/%3E%3Cpath d='M18 5 6 19'/%3E%3C/svg%3E")}
      #coach-main.dcc-ca .dcc-ca-metrics .dcc-ca-metric:nth-child(3)::before{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23f2c85f' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3.5' y='5.5' width='17' height='15' rx='2.5'/%3E%3Cpath d='M8 3.5v4M16 3.5v4M3.5 10h17'/%3E%3C/svg%3E")}
      #coach-main.dcc-ca .dcc-ca-metrics .dcc-metric-force::before{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23f2c85f' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='4' y='14' width='3' height='6' rx='.8'/%3E%3Crect x='10.5' y='9.5' width='3' height='10.5' rx='.8'/%3E%3Crect x='17' y='5' width='3' height='15' rx='.8'/%3E%3C/svg%3E")}
      #coach-main.dcc-ca .dcc-ca-metrics .dcc-ca-metric small{color:#9ca5af!important;font-size:10px!important;letter-spacing:.1px!important}
      #coach-main.dcc-ca .dcc-ca-metrics .dcc-ca-metric b{margin-top:4px!important;color:#f7f5f0!important;font-size:20px!important;line-height:1.05!important;letter-spacing:-.45px!important}
      #coach-main.dcc-ca .dcc-ca-metrics .dcc-ca-trend{min-height:24px!important;margin-top:7px!important;color:#9aa4af!important;font-size:9px!important;line-height:1.35!important}
      #coach-main.dcc-ca .dcc-ca-metrics .dcc-ca-trend.good{color:#55d9a0!important}
      #coach-main.dcc-ca .dcc-ca-metrics .dcc-ca-trend.bad{color:#ff656d!important}
      #coach-main.dcc-ca .dcc-stable-spark{height:30px!important;margin:4px -2px -2px -44px!important;opacity:.95!important}.dcc-stable-spark svg{width:100%;height:100%;display:block}
      @media(max-width:650px){#coach-main.dcc-ca .dcc-ca-metrics{gap:7px!important}#coach-main.dcc-ca .dcc-ca-metrics .dcc-ca-metric{min-height:118px!important;padding:12px 9px 9px 10px!important}#coach-main.dcc-ca .dcc-ca-metrics .dcc-ca-metric::before{position:static!important;display:block!important;width:28px!important;height:28px!important;margin-bottom:7px!important;border-radius:9px!important;background-size:16px 16px!important}#coach-main.dcc-ca .dcc-ca-metrics .dcc-ca-metric b{font-size:16px!important}#coach-main.dcc-ca .dcc-ca-metrics .dcc-ca-trend{font-size:8px!important;min-height:22px!important}#coach-main.dcc-ca .dcc-stable-spark{height:24px!important;margin:3px 0 -1px!important}}
    `;
    document.head.appendChild(style);
  }

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
  progress.src='./progress-premium-v4.js?v=20260908-5';
  progress.async=true;
  document.head.appendChild(progress);
})();