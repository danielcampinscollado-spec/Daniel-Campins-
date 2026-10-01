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
        muscles:{type:'array',minItems:1,maxItems:5,items:{type:'string'}},
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
            options:{type:'array',minItems:1,maxItems:3,items:{
              type:'object',additionalProperties:false,
              properties:{
                name:{type:'string'},
                foods:{type:'array',minItems:1,maxItems:8,items:{
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
            options:{type:'array',minItems:1,maxItems:3,items:{
              type:'object',additionalProperties:false,
              properties:{
                name:{type:'string'},
                foods:{type:'array',minItems:1,maxItems:8,items:{
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
function systemPrompt(kind){
  const common='Eres el asistente profesional de DCC Fitness para un entrenador humano. Generas únicamente BORRADORES que el entrenador revisará antes de enviar. No diagnostiques ni trates enfermedades. Prioriza seguridad y respeta lesiones, cirugías, alergias y alimentos a evitar aunque una instrucción del entrenador entre en conflicto. No prescribas medicamentos, hormonas ni suplementos. Devuelve solo el JSON exigido por el esquema.';
  if(kind==='routine')return common+' Para rutinas: usa nomenclatura en español, programación realista, descansos en segundos y ejercicios compatibles con el objetivo y experiencia. Usa superseries o rest-pause solo cuando aporten valor o el entrenador lo pida. Una superserie comparte method_group entre sus ejercicios. REST-pause en DCC Fitness usa SIEMPRE exactamente esta secuencia por serie: "12 → 10 → 8 → 6". Cada flecha representa un mini-descanso de EXACTAMENTE 7 segundos. Para cada ejercicio rest-pause, rest_pause_sequence debe ser EXACTAMENTE "12 → 10 → 8 → 6", rest_pause_seconds debe ser EXACTAMENTE 7 y el descanso final debe ser de 90 a 120 segundos. No inventes otras secuencias, no omitas ningún tramo y no escribas explicaciones dentro de rest_pause_sequence. Si hay catálogo de ejercicios, prioriza sus nombres exactos para que DCC pueda asociar imágenes y vídeos.';
  return common+' Para alimentación: crea un plan práctico en español con cantidades claras en g, ml o unidades. Respeta de forma estricta alergias y alimentos a evitar. No uses cantidades calóricas extremas ni promesas médicas. Puedes dejar el día de descanso sin comidas solo si el entrenador lo pide expresamente; en caso contrario genera ambos días. Las opciones de una misma comida deben ser alternativas comparables.';
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
      ?body.exerciseCatalog.slice(0,180).map(x=>({name:cleanText(x?.name,80),muscle:cleanText(x?.muscle,40)})).filter(x=>x.name)
      :[];
    const context=clientContext(client);
    const gatewayToken=process.env.AI_GATEWAY_API_KEY||process.env.VERCEL_OIDC_TOKEN||String(req.headers['x-vercel-oidc-token']||'');
    if(!gatewayToken)return json(res,503,{error:'La conexión segura con la IA no está configurada'});

    const userPayload={
      task:kind==='routine'?'Crear borrador de rutina':'Crear borrador de alimentación',
      trainer_instructions:instructions,
      client_context:context
    };
    if(catalog.length)userPayload.available_exercises=catalog;

    const aiRes=await fetch(AI_GATEWAY_URL,{
      method:'POST',
      headers:{Authorization:'Bearer '+gatewayToken,'Content-Type':'application/json'},
      body:JSON.stringify({
        model:AI_MODEL,
        messages:[
          {role:'system',content:systemPrompt(kind)},
          {role:'user',content:JSON.stringify(userPayload)}
        ],
        response_format:responseFormat(kind)
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
    return json(res,200,{kind,model:AI_MODEL,draft:result});
  }catch(error){
    console.error('DCC AI plan:',error);
    return json(res,error?.status||500,{error:error?.status?error.message:'No se pudo generar el borrador con IA'});
  }
};
