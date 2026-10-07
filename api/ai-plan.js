'use strict';

const SUPABASE_URL='https://khrhfurdlbqnlthlkhhp.supabase.co';
const SUPABASE_KEY='sb_publishable_Dhr67diGFP22g8PKdmUg9A_jbn2EyNZ';
const AI_GATEWAY_URL='https://ai-gateway.vercel.sh/v1/chat/completions';
const AI_MODEL='openai/gpt-5.6-terra';

const routineSchema={
  type:'object',additionalProperties:false,
  properties:{
    routine:{type:'array',minItems:1,maxItems:7,items:{
      type:'object',additionalProperties:false,
      properties:{
        day:{type:'integer',minimum:1,maximum:7},
        title:{type:'string'},
        muscles:{type:'array',minItems:1,maxItems:3,items:{type:'string'}},
        exercises:{type:'array',minItems:1,maxItems:10,items:{
          type:'object',additionalProperties:false,
          properties:{
            name:{type:'string'},
            muscle:{type:'string'},
            sets:{type:'integer',minimum:1,maximum:8},
            reps:{type:'string'},
            rest_between_sets:{type:'integer',minimum:0,maximum:600},
            rest_between_exercises:{type:'integer',minimum:0,maximum:900},
            method:{type:'string',enum:['normal','superset','rest_pause']},
            method_group:{type:'string'},
            rest_pause_seconds:{type:'integer',minimum:0,maximum:60},
            rest_pause_sequence:{type:'string'},
            video_url:{type:'string'}
          },
          required:['name','muscle','sets','reps','rest_between_sets','rest_between_exercises','method','method_group','rest_pause_seconds','rest_pause_sequence','video_url']
        }}
      },
      required:['day','title','muscles','exercises']
    }},
    notes:{type:'array',maxItems:8,items:{type:'string'}}
  },
  required:['routine','notes']
};

const dietSchema={
  type:'object',additionalProperties:false,
  properties:{
    diet:{type:'object',additionalProperties:false,properties:{
      training:{type:'object',additionalProperties:false,properties:{
        calories:{type:'string'},protein:{type:'string'},
        meals:{type:'array',maxItems:9,items:{
          type:'object',additionalProperties:false,
          properties:{
            name:{type:'string'},
            options:{type:'array',minItems:2,maxItems:3,items:{
              type:'object',additionalProperties:false,
              properties:{
                name:{type:'string'},
                foods:{type:'array',minItems:1,maxItems:5,items:{
                  type:'object',additionalProperties:false,
                  properties:{name:{type:'string'},quantity:{type:'string'}},
                  required:['name','quantity']
                }}
              },
              required:['name','foods']
            }}
          },
          required:['name','options']
        }}
      },required:['calories','protein','meals']},
      rest:{type:'object',additionalProperties:false,properties:{
        calories:{type:'string'},protein:{type:'string'},
        meals:{type:'array',maxItems:9,items:{
          type:'object',additionalProperties:false,
          properties:{
            name:{type:'string'},
            options:{type:'array',minItems:2,maxItems:3,items:{
              type:'object',additionalProperties:false,
              properties:{
                name:{type:'string'},
                foods:{type:'array',minItems:1,maxItems:5,items:{
                  type:'object',additionalProperties:false,
                  properties:{name:{type:'string'},quantity:{type:'string'}},
                  required:['name','quantity']
                }}
              },
              required:['name','foods']
            }}
          },
          required:['name','options']
        }}
      },required:['calories','protein','meals']}
    },required:['training','rest']},
    notes:{type:'array',maxItems:8,items:{type:'string'}}
  },
  required:['diet','notes']
};

function json(res,status,body){
  res.statusCode=status;
  res.setHeader('Content-Type','application/json; charset=utf-8');
  res.setHeader('Cache-Control','no-store');
  res.end(JSON.stringify(body));
}
function cleanText(v,max=1200){return String(v??'').replace(/[\u0000-\u001f]+/g,' ').trim().slice(0,max)}
async function supabase(path,token){
  return fetch(SUPABASE_URL+path,{headers:{apikey:SUPABASE_KEY,Authorization:'Bearer '+token,'Content-Type':'application/json'}});
}
async function verifyCoachAndClient(token,clientId){
  const userRes=await supabase('/auth/v1/user',token);
  if(!userRes.ok)throw Object.assign(new Error('Sesión no válida'),{status:401});
  const user=await userRes.json();
  const profileRes=await supabase('/rest/v1/app_profiles?user_id=eq.'+encodeURIComponent(user.id)+'&select=role&limit=1',token);
  if(!profileRes.ok)throw Object.assign(new Error('No se pudo verificar el rol'),{status:403});
  const profiles=await profileRes.json();
  if(profiles?.[0]?.role!=='coach')throw Object.assign(new Error('Solo el entrenador puede usar la IA'),{status:403});
  const fields='id,goal,weight,age,height_cm,foods_to_avoid,current_injury,injury_details,previous_surgery,surgery_details,food_allergy,food_allergy_details,trained_before,training_experience,preferred_training_days,sex,requested_plan,active_plan,training_enabled,nutrition_enabled';
  const clientRes=await supabase('/rest/v1/clients?id=eq.'+encodeURIComponent(clientId)+'&select='+fields+'&limit=1',token);
  if(!clientRes.ok)throw Object.assign(new Error('No se pudo verificar el cliente'),{status:403});
  const rows=await clientRes.json();
  if(!rows?.length)throw Object.assign(new Error('Cliente no disponible para esta sesión'),{status:404});
  return rows[0];
}
function clientContext(c){
  return {
    goal:c.goal||'',
    weight_kg:c.weight??null,
    age:c.age??null,
    height_cm:c.height_cm??null,
    sex:c.sex??null,
    foods_to_avoid:c.foods_to_avoid||'',
    current_injury:c.current_injury===true,
    injury_details:c.injury_details||'',
    previous_surgery:c.previous_surgery===true,
    surgery_details:c.surgery_details||'',
    food_allergy:c.food_allergy===true,
    food_allergy_details:c.food_allergy_details||'',
    trained_before:c.trained_before===true,
    training_experience:c.training_experience||'',
    preferred_training_days:c.preferred_training_days??null,
    requested_plan:c.requested_plan??null,
    active_plan:c.active_plan??null
  };
}
function nutritionTargets(c){
  const sex=String(c?.sex||'').trim().toLowerCase();
  const w=Number(c?.weight),h=Number(c?.height_cm),a=Number(c?.age);
  if(!(w>0&&h>0&&a>0))return null;
  const female=sex==='female'||sex==='mujer'||sex==='femenino'||sex==='f';
  const male=sex==='male'||sex==='hombre'||sex==='masculino'||sex==='m';
  const bmr=10*w+6.25*h-5*a+(female?-161:male?5:-78);
  const days=Math.max(0,Math.min(7,Number(c?.preferred_training_days)||0));
  const activity=days>=5?1.55:days>=3?1.45:days>=1?1.35:1.25;
  let kcal=Math.round((bmr*activity)/50)*50;
  const goal=String(c?.goal||'').toLowerCase();
  if(/p[eé]rdida|perder|defin|grasa/.test(goal))kcal=Math.round((kcal*0.85)/50)*50;
  else if(/ganar|masa|hipertrof|volumen/.test(goal))kcal=Math.round((kcal*1.08)/50)*50;
  kcal=Math.max(1200,Math.min(4200,kcal));
  const proteinFactor=/ganar|masa|hipertrof|defin|grasa/.test(goal)?1.7:1.5;
  const protein=Math.round(w*proteinFactor/5)*5;
  return {estimated_daily_kcal:kcal,daily_protein_g:protein,method:'Mifflin-St Jeor + actividad aproximada; referencia para borrador, no prescripción clínica'};
}
function safetyTokens(c){
 const text=[c.foods_to_avoid,c.food_allergy_details].filter(Boolean).join(',').toLowerCase();
 return text.split(/[,;\n/]+/).map(x=>x.trim()).filter(x=>x.length>2);
}
function upperBodyIntent(instructions){
 const s=String(instructions||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
 return /tren superior|parte superior|upper body/.test(s);
}
function muscleBucket(v){
 const s=normMuscle(v);
 if(/pect|pecho/.test(s))return'pecho'; if(/dors|espalda|remo/.test(s))return'espalda'; if(/homb|delto/.test(s))return'hombro';
 if(/biceps/.test(s))return'biceps'; if(/triceps/.test(s))return'triceps'; if(/abd|core/.test(s))return'core'; return s;
}
function validateAgainstClient(result,kind,c,instructions){
 const errors=[];
 if(kind==='diet'){
   const blocked=safetyTokens(c);
   for(const day of ['training','rest']) for(const meal of result?.diet?.[day]?.meals||[]) for(const option of meal?.options||[]) for(const food of option?.foods||[]){
     const n=String(food?.name||'').toLowerCase();
     if(blocked.some(x=>n.includes(x)||x.includes(n)))errors.push('La dieta contiene un alimento marcado como alergia, intolerancia o alimento a evitar: '+food.name);
   }
   for(const day of ['training','rest']) for(const meal of result?.diet?.[day]?.meals||[]) if((meal?.options||[]).length<2||(meal?.options||[]).length>3)errors.push('Cada comida debe tener 2 o 3 opciones según lo pedido por el entrenador');
 }else{
   const days=result?.routine||[];
   const sex=String(c?.sex||'').trim().toLowerCase();
   const female=sex==='female'||sex==='mujer'||sex==='femenino'||sex==='f';
   if(female){for(const d of days)for(const ex of d.exercises||[]){const name=String(ex?.name||'').toLowerCase(),muscle=muscleBucket(ex?.muscle);if(/mancuern/.test(name)&&!['hombro','biceps','triceps'].includes(muscle))errors.push('Cliente mujer: las mancuernas solo se permiten en hombro, bíceps o tríceps')}}
   const requested=Math.max(0,Math.min(7,Number(c?.preferred_training_days)||0));
   if(requested&&days.length!==requested)errors.push('La rutina no respeta los días semanales indicados por el cliente');
   const weekly={};
   for(const d of days){
     const groups={};
     for(const ex of d.exercises||[]){
       const m=muscleBucket(ex?.muscle);if(m){groups[m]=(groups[m]||0)+(Number(ex?.sets)||0);weekly[m]=(weekly[m]||0)+(Number(ex?.sets)||0)}
     }
     const supers={};
     for(const ex of d.exercises||[])if(ex?.method==='superset'){const g=String(ex?.method_group||'').trim();supers[g]=(supers[g]||0)+1}
     if(Object.values(supers).some(n=>n<2))errors.push('Una superserie no puede contener un solo ejercicio');
   }
   if(upperBodyIntent(instructions)){
     for(const m of ['pecho','espalda','hombro','biceps','triceps'])if(!(weekly[m]>0))errors.push('Rutina de tren superior incompleta: falta trabajo para '+m);
     if(days.length>=2){
       const signatures=days.map(d=>[...new Set((d.exercises||[]).map(x=>muscleBucket(x?.muscle)).filter(Boolean))].sort().join('|'));
       if(signatures.length>1&&new Set(signatures).size===1)errors.push('Los días de tren superior repiten exactamente la misma distribución muscular; redistribuye la semana');
     }
   }
 }
 return [...new Set(errors)];
}
function normMuscle(v){return String(v||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim()}
function systemPrompt(kind){
  const common='Eres el asistente profesional de DCC Fitness para un entrenador humano. Generas únicamente BORRADORES que el entrenador revisará antes de enviar. No diagnostiques ni trates enfermedades. Prioriza seguridad y respeta lesiones, cirugías, alergias y alimentos a evitar aunque una instrucción del entrenador entre en conflicto. No prescribas medicamentos, hormonas ni suplementos. Devuelve solo el JSON exigido por el esquema.';
  if(kind==='routine')return common+' Debes usar exclusivamente ejercicios presentes en available_exercises cuando se proporcione ese catálogo. Copia exactamente su name y no inventes variantes, agarres, máquinas ni ejercicios fuera del catálogo. El cuestionario del cliente es una restricción funcional del plan, no texto informativo: úsalo antes de programar y no ignores ninguna respuesta relevante. Si faltan datos, no inventes lesiones, alergias ni preferencias. Para rutinas: usa nomenclatura en español, programación realista, descansos en segundos y ejercicios compatibles con el objetivo y experiencia. Si el sexo del cliente es mujer/female, NO selecciones ejercicios con mancuernas salvo ejercicios de hombro, bíceps o tríceps; para pecho, espalda y tren inferior usa otras alternativas disponibles en el catálogo. Programa primero la semana completa y después cada sesión: usa los días disponibles, objetivo, experiencia y recuperación para repartir frecuencia y volumen. Evalúa el volumen semanal de cada grupo muscular antes de fijar las series de cada ejercicio. No decidas 2 series por defecto por ser un accesorio: 2 series solo son válidas cuando el trabajo directo e indirecto del resto de la semana hace suficiente el estímulo; si un músculo no volverá a recibir un estímulo relevante hasta la semana siguiente, dale un volumen directo razonable en esa sesión. Considera el trabajo indirecto de presses, remos y jalones, pero no lo cuentes igual que series directas. En ejercicios principales usa normalmente 3-4 series cuando sea coherente; en accesorios normalmente 2-4 según el volumen semanal acumulado. Evita dejar grupos del tren superior prácticamente sin estímulo en programas de 3 días. Si el entrenador pide tren superior, considera el conjunto completo: pectoral, dorsal/espalda, deltoides, bíceps y tríceps; incluye trabajo de core/abdomen cuando sea coherente con el objetivo y la distribución. No repitas mecánicamente los mismos 3 grupos todos los días: distribuye patrones y volumen con lógica semanal. Las lesiones, cirugías y limitaciones del cuestionario tienen prioridad sobre preferencias de ejercicios. El campo muscles es exclusivamente visual: incluye como máximo 3 grupos principales del día, elegidos por predominio del trabajo; no añadas músculos secundarios solo porque aparezcan en un ejercicio. Usa superseries o rest-pause solo cuando aporten valor o el entrenador lo pida. Una superserie comparte method_group entre sus ejercicios. REST-pause en DCC Fitness usa SIEMPRE exactamente esta secuencia por serie: "12 → 10 → 8 → 6". Cada flecha representa un mini-descanso de EXACTAMENTE 7 segundos. Para cada ejercicio rest-pause, rest_pause_sequence debe ser EXACTAMENTE "12 → 10 → 8 → 6", rest_pause_seconds debe ser EXACTAMENTE 7 y el descanso final debe ser de 90 a 120 segundos. No inventes otras secuencias, no omitas ningún tramo y no escribas explicaciones dentro de rest_pause_sequence. Si hay catálogo de ejercicios, prioriza sus nombres exactos para que DCC pueda asociar imágenes y vídeos.';
  return common+' El cuestionario del cliente es una restricción funcional del plan, no texto informativo: úsalo antes de crear las comidas. Alergias, intolerancias, alimentos que no le gustan o ha pedido evitar son exclusiones estrictas. Si faltan datos, no inventes restricciones. Para alimentación: crea un plan práctico, realista y fácil de seguir en español. REGLA DE MEDIDAS CASERAS: siempre que un alimento se pueda contar de forma natural, expresa la cantidad en unidades y NO en gramos. Ejemplos: huevos en unidades (2 huevos), pan en rebanadas (2 rebanadas), tortitas de arroz/maíz en unidades (3 tortitas), fruta en piezas o unidades (1 plátano, 1 manzana), yogur en unidades (1 yogur), queso en lonchas cuando proceda. Reserva gramos para alimentos que normalmente se pesan o cuya ración necesita precisión, como arroz, pasta, avena, carne, pescado, patata o frutos secos, y ml para líquidos cuando proceda. No pongas huevos ni claras en gramos en comidas normales. Si propones huevos como plato, escribe 'Huevos' o 'Tortilla francesa' y expresa la cantidad como '2 huevos', '3 huevos', etc. No uses 'tortilla' de forma ambigua. Las claras separadas solo deben aparecer cuando formen parte lógica de una receta, por ejemplo tortitas proteicas, y en ese caso puedes indicar claras + huevos según la receta. Prioriza que el cliente pueda ejecutar la dieta sin báscula cuando no sea necesaria. Usa nutrition_reference cuando esté disponible como presupuesto diario de referencia y distribúyelo entre TODAS las comidas del día antes de decidir raciones. Individualiza las necesidades energéticas usando sexo, edad, peso, altura, objetivo y contexto de entrenamiento disponibles; no reutilices por defecto las mismas cantidades entre personas. La proteína debe ser proporcional al peso, objetivo y entrenamiento, no una cantidad fija por sexo; evita excesos injustificados. Ajusta carbohidratos, grasas, calorías y tamaño de raciones al perfil y objetivo. Cada comida debe ser SIMPLE: normalmente 2 a 4 alimentos/componentes y NUNCA más de 5. Evita concentrar proteína o calorías desproporcionadamente en una sola comida: reparte la proteína diaria de forma razonablemente uniforme entre las comidas principales y ajusta las raciones para que la suma diaria se aproxime a nutrition_reference. No añadas ingredientes accesorios solo para cuadrar macros ni generes platos con listas interminables. Prioriza combinaciones normales (por ejemplo, una fuente principal de proteína, una de carbohidrato cuando corresponda, verdura/fruta y una grasa cuando haga falta) y raciones plausibles. No aumentes el volumen de comida innecesariamente: para pérdida de grasa, especialmente, busca saciedad con un volumen razonable y sostenible. Respeta de forma estricta alergias y alimentos a evitar. No uses cantidades calóricas extremas ni promesas médicas. Puedes dejar el día de descanso sin comidas solo si el entrenador lo pide expresamente; en caso contrario genera ambos días. Genera 2 opciones para cada comida por defecto. Si el entrenador pide explícitamente 3 opciones, genera EXACTAMENTE 3 opciones para CADA comida. Nunca generes una sola opción. Todas las opciones de una misma comida deben ser alternativas comparables en energía y macronutrientes y mantener cantidades realistas.';
}
function responseFormat(kind){
  return {type:'json_schema',json_schema:{name:kind==='routine'?'dcc_routine_draft':'dcc_diet_draft',strict:true,schema:kind==='routine'?routineSchema:dietSchema}};
}
function parseContent(payload){
  const c=payload?.choices?.[0]?.message?.content;
  if(typeof c==='string')return c;
  if(Array.isArray(c))return c.map(x=>x?.text||x?.content||'').join('');
  return '';
}
function validate(result,kind){
  if(!result||typeof result!=='object')return false;
  if(kind==='routine')return Array.isArray(result.routine)&&result.routine.length>0&&result.routine.every(d=>Array.isArray(d.exercises)&&d.exercises.length>0);
  const d=result.diet;return !!(d&&d.training&&d.rest&&Array.isArray(d.training.meals)&&Array.isArray(d.rest.meals));
}

module.exports=async function handler(req,res){
  if(req.method!=='POST')return json(res,405,{error:'Método no permitido'});
  const contentLength=Number(req.headers['content-length']||0);
  if(Number.isFinite(contentLength)&&contentLength>128*1024)return json(res,413,{error:'Solicitud demasiado grande'});
  try{
    const auth=String(req.headers.authorization||'');
    const token=auth.startsWith('Bearer ')?auth.slice(7).trim():'';
    if(!token)return json(res,401,{error:'Sesión requerida'});
    const body=typeof req.body==='string'?JSON.parse(req.body||'{}'):(req.body||{});
    const kind=body.kind==='diet'?'diet':body.kind==='routine'?'routine':'';
    const clientId=cleanText(body.clientId,120);
    const instructions=cleanText(body.instructions,1400);
    if(!kind||!clientId||instructions.length<3)return json(res,400,{error:'Faltan instrucciones para generar el borrador'});
    const client=await verifyCoachAndClient(token,clientId);
    if(kind==='routine'&&client.training_enabled===false)return json(res,409,{error:'El módulo de entrenamiento está desactivado para este cliente'});
    if(kind==='diet'&&client.nutrition_enabled===false)return json(res,409,{error:'El módulo de alimentación está desactivado para este cliente'});

    const catalog=kind==='routine'&&Array.isArray(body.exerciseCatalog)
      ?body.exerciseCatalog.slice(0,250).map(x=>({id:cleanText(x?.id,100),name:cleanText(x?.name,80),muscle:cleanText(x?.muscle,40),equipment:cleanText(x?.equipment,60)})).filter(x=>x.id&&x.name)
      :[];
    const context=clientContext(client);
    const nutrition_reference=kind==='diet'?nutritionTargets(client):null;
    const gatewayToken=process.env.AI_GATEWAY_API_KEY||process.env.VERCEL_OIDC_TOKEN||String(req.headers['x-vercel-oidc-token']||'');
    if(!gatewayToken)return json(res,503,{error:'La conexión segura con la IA no está configurada'});

    const userPayload={
      task:kind==='routine'?'Crear borrador de rutina':'Crear borrador de alimentación',
      trainer_instructions:instructions,
      client_context:context
    };
    if(nutrition_reference)userPayload.nutrition_reference=nutrition_reference;
    if(catalog.length)userPayload.available_exercises=catalog;

    const requestedDietOptions=kind==='diet'&&/\b3\s*(?:opciones?|alternativas?)\b/i.test(instructions)?3:2;
    const format=responseFormat(kind);
    if(kind==='diet'){for(const day of ['training','rest'])format.json_schema.schema.properties.diet.properties[day].properties.meals.items.properties.options.minItems=requestedDietOptions,format.json_schema.schema.properties.diet.properties[day].properties.meals.items.properties.options.maxItems=requestedDietOptions;}
    const aiRes=await fetch(AI_GATEWAY_URL,{
      method:'POST',
      headers:{Authorization:'Bearer '+gatewayToken,'Content-Type':'application/json'},
      body:JSON.stringify({
        model:AI_MODEL,
        messages:[
          {role:'system',content:systemPrompt(kind)},
          {role:'user',content:JSON.stringify(userPayload)}
        ],
        response_format:format
      })
    });
    const payload=await aiRes.json().catch(()=>({}));
    if(!aiRes.ok){
      const detail=payload?.error?.message||payload?.message||payload?.error||'error';console.error('DCC AI gateway:',aiRes.status,detail);
      return json(res,502,{error:'La IA no pudo generar el borrador.',detail:cleanText(detail,300)});
    }
    const text=parseContent(payload);
    let result;
    try{result=JSON.parse(text)}catch(_){return json(res,502,{error:'La IA devolvió un borrador no válido. Inténtalo de nuevo.'})}
    if(!validate(result,kind))return json(res,502,{error:'El borrador recibido no tiene el formato de DCC Fitness'});
    if(kind==='routine'&&catalog.length){
      const key=v=>String(v||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
      const allowed=new Map(catalog.map(x=>[key(x.name),x]));
      const outside=[];
      for(const d of result.routine||[])for(const ex of d.exercises||[]){
        const hit=allowed.get(key(ex?.name));
        if(!hit){outside.push(String(ex?.name||'').trim());continue}
        ex.name=hit.name;
        ex.library_id=hit.id;
      }
      if(outside.length)return json(res,422,{error:'La IA propuso ejercicios fuera de la biblioteca DCC. Vuelve a generarlo.',conflicts:[...new Set(outside)].slice(0,10)});
    }
    const conflicts=validateAgainstClient(result,kind,client,instructions);
    if(conflicts.length)return json(res,422,{error:'El borrador contradice datos del cuestionario. Vuelve a generarlo.',conflicts});
    return json(res,200,{kind,model:AI_MODEL,draft:result});
  }catch(error){
    console.error('DCC AI plan:',error);
    return json(res,error?.status||500,{error:error?.status?error.message:'No se pudo generar el borrador con IA'});
  }
};
