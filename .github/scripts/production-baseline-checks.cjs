const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const path=require('path');
const root=path.resolve(__dirname,'../..')+'/';
const html=fs.readFileSync(root+'index.html','utf8');
const loader=html.slice(html.indexOf('async function loadClientsFromSupabase(){'),html.indexOf('async function loadWorkoutHistoryFromSupabase(){'));
(async()=>{
let checked=0;
function scan(dir){for(const ent of fs.readdirSync(dir,{withFileTypes:true})){if(ent.name==='.git')continue;const p=path.join(dir,ent.name);if(ent.isDirectory())scan(p);else if(p.endsWith('.js')){new vm.Script(fs.readFileSync(p,'utf8'),{filename:p});checked++}}}
scan(root);
for(const match of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g))if(match[1].trim())new vm.Script(match[1],{filename:'index.html:inline'});
console.log('PASS syntax:',checked,'JavaScript files + inline script');
for(const ok of [true,false]){
 let calls=[],alerts=[];const cl={id:'fixture',requested_plan:'training'};
 const ctx={window:{data:{clients:[cl]},showClientAdmin(){},supabaseClient:{rpc:async(name,args)=>{calls.push({name,args});return {data:ok,error:null}}}},document:{readyState:'loading',addEventListener(){},getElementById(id){return id==='dccV2Plan'?{value:'complete'}:null}},alert:s=>alerts.push(s),console:{error(){}}};
 vm.createContext(ctx);vm.runInContext(fs.readFileSync(root+'coach-client-profile-v2.js','utf8'),ctx);
 assert.equal(typeof ctx.window.dccActivateClientPlan,'function');await ctx.window.dccActivateClientPlan('fixture');
 assert.equal(cl.active_plan,ok?'complete':undefined);assert.equal(cl.requested_plan,'training');assert.equal(calls[0].name,'dcc_set_client_plan');assert.equal(calls[0].args.p_client_id,'fixture');assert.equal(alerts.length,ok?0:1);
 console.log('PASS activation mocked RPC:',ok?'confirmed':'rejected');
}

for(const plan of ['nutrition','training','complete',null]){
 let selected='',routes=[],events={};
 const row={id:'audit-fixture',name:'Fixture',status:'Activo',password_setup_completed:true,active_plan:plan,requested_plan:plan,sex:'female'};
 const main={innerHTML:''};
 const ctx={data:{clients:[]},saveData(){},console,supabaseClient:{from(){return {select(cols){selected=cols;return {order:async()=>({data:[Object.fromEntries(Object.entries(row).filter(([k])=>cols.split(',').includes(k)))],error:null})}}}}},window:{currentClientId:row.id,showClient(screen){routes.push(screen)}},document:{addEventListener(n,f){events[n]=f},getElementById(){return main}},setTimeout(){}};
 vm.createContext(ctx);vm.runInContext(loader,ctx);await ctx.loadClientsFromSupabase();
 assert.equal(ctx.data.clients[0].active_plan,plan,'cold-load must hydrate '+plan);
 assert.equal(ctx.data.clients[0].requested_plan,plan);
 assert.equal(ctx.data.clients[0].sex,'female');
 vm.runInContext(fs.readFileSync(root+'client-plan-access-v1.js','utf8'),ctx);events['dcc:support-ready']();
 for(const screen of ['food','training','home','progress','checkin','messages']){
  routes=[];ctx.window.showClient(screen);
  const expected=!['food','training'].includes(screen)||plan==='complete'||plan==='nutrition'&&screen==='food'||plan==='training'&&screen==='training';
  assert.equal(routes.length,expected?1:0,plan+' '+screen);
 }
 console.log('PASS cold hydration + module permissions:',plan);
}
})();
