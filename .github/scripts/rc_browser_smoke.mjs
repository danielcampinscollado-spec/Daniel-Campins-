// Runtime ownership + trainer/client navigation trace v6
import { chromium } from 'playwright';
const url=process.env.RC_URL;if(!url)throw new Error('RC_URL missing');
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:390,height:844}});
await page.goto(url,{waitUntil:'domcontentloaded',timeout:30000});
await page.waitForTimeout(4000);

await page.evaluate(()=>{for(const id of ['login','client']){const el=document.getElementById(id);if(el)el.style.display='none'}const coach=document.getElementById('coach');if(coach)coach.style.display='block';window.currentApp='coach';try{currentApp='coach'}catch(_){};if(typeof window.showCoach!=='function')throw new Error('showCoach missing');window.showCoach('dashboard')});
await page.waitForTimeout(800);
const wrappers=await page.evaluate(()=>{let fn=window.showCoach;const out=[],seen=new Set();for(let i=0;i<50&&typeof fn==='function'&&!seen.has(fn);i++){seen.add(fn);out.push({i,keys:Object.keys(fn).filter(k=>k.startsWith('__dcc')),src:String(fn).replace(/\s+/g,' ').slice(0,420)});fn=fn.__base||fn.__original}return out});
console.log('WRAPPER_OWNERS '+JSON.stringify(wrappers));
if(wrappers.length!==2||!wrappers[0].keys.includes('__dccSingleRouterV40'))throw new Error('Single coach router invariant failed');
for(const [label,expected] of [['Check-in','checkins'],['Mensajes','messages'],['Calendario','calendar'],['Clientes','clients'],['Panel','dashboard']]){
  await page.locator('#coach-nav button').filter({hasText:label}).first().click();
  const rows=[];for(let i=0;i<12;i++){await page.waitForTimeout(150);rows.push(await page.evaluate(()=>({screen:window.currentScreen,intent:window.__dccCoachRouteIntent})));}
  console.log('COACH '+label+' '+JSON.stringify(rows));
  if(rows.some(x=>x.screen!==expected||x.intent!==expected))throw new Error('Coach route failed: '+label);
}
for(const label of ['Mensajes','Check-in','Clientes','Mensajes','Panel','Check-in']){await page.locator('#coach-nav button').filter({hasText:label}).first().click();await page.waitForTimeout(100);}
await page.waitForTimeout(1800);
const stress=await page.evaluate(()=>({screen:window.currentScreen,intent:window.__dccCoachRouteIntent}));
console.log('COACH_STRESS '+JSON.stringify(stress));if(stress.screen!=='checkins'||stress.intent!=='checkins')throw new Error('Coach stress route failed');

// Client navigation is tested with a deterministic in-memory fixture because the Preview has no authenticated browser session in CI.
await page.evaluate(()=>{const fixture={id:'carlos',name:'Dani',status:'Activo',weight:80,goal:'',height:180,age:30,sex:'Hombre',messages:[],checkins:[]};try{if(typeof data!=='undefined'){if(!Array.isArray(data.clients)||!data.clients.length)data.clients=[fixture];data.routines=data.routines||{};data.routines.carlos=data.routines.carlos||[];data.diets=data.diets||{}}}catch(_){};window.currentClientId='carlos';try{currentClientId='carlos'}catch(_){};const coach=document.getElementById('coach');if(coach)coach.style.display='none';const login=document.getElementById('login');if(login)login.style.display='none';const client=document.getElementById('client');if(client)client.style.display='block';window.currentApp='client';try{currentApp='client'}catch(_){};if(typeof window.buildClientNav==='function')window.buildClientNav();if(typeof window.showClient!=='function')throw new Error('showClient missing');window.showClient('home')});
await page.waitForTimeout(500);
for(const [label,expected] of [['Inicio','home'],['Alimentación','food'],['Entrenamiento','training'],['Progreso','progress'],['Check-in','checkin'],['Mensajes','messages']]){
  await page.locator('#client-nav button').filter({hasText:label}).first().click();
  const rows=[];for(let i=0;i<8;i++){await page.waitForTimeout(150);rows.push(await page.evaluate(()=>({screen:window.currentScreen,app:window.currentApp,visible:document.getElementById('client')?.style.display})));}
  console.log('CLIENT '+label+' '+JSON.stringify(rows));
  if(rows.some(x=>x.screen!==expected||x.app!=='client'||x.visible==='none'))throw new Error('Client route failed: '+label);
}
await browser.close();
