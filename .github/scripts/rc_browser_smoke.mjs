// Runtime ownership + navigation trace v3
import { chromium } from 'playwright';
const url=process.env.RC_URL;if(!url)throw new Error('RC_URL missing');
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:390,height:844}});
await page.goto(url,{waitUntil:'domcontentloaded',timeout:30000});
await page.waitForTimeout(4000);
await page.evaluate(()=>{for(const id of ['login','client']){const el=document.getElementById(id);if(el)el.style.display='none'}const coach=document.getElementById('coach');if(coach)coach.style.display='block';window.currentApp='coach';try{currentApp='coach'}catch(_){};if(typeof window.showCoach!=='function')throw new Error('showCoach missing');window.showCoach('dashboard')});
await page.waitForTimeout(1200);
const wrappers=await page.evaluate(()=>{let fn=window.showCoach;const out=[],seen=new Set();for(let i=0;i<50&&typeof fn==='function'&&!seen.has(fn);i++){seen.add(fn);out.push({i,keys:Object.keys(fn).filter(k=>k.startsWith('__dcc')),src:String(fn).replace(/\s+/g,' ').slice(0,520)});fn=fn.__base||fn.__original}return out});
console.log('WRAPPER_OWNERS '+JSON.stringify(wrappers));
if(wrappers.length!==2||!wrappers[0].keys.includes('__dccSingleRouterV40')){console.error('FAIL single router invariant',JSON.stringify(wrappers));process.exitCode=1;}
for(const [label,expected] of [['Check-in','checkins'],['Mensajes','messages'],['Calendario','calendar'],['Clientes','clients'],['Panel','dashboard']]){
  await page.locator('#coach-nav button').filter({hasText:label}).first().click();
  const rows=[];
  for(let i=0;i<20;i++){await page.waitForTimeout(200);rows.push(await page.evaluate(()=>({screen:window.currentScreen,intent:window.__dccCoachRouteIntent,cls:document.getElementById('coach-main')?.className||''})));}
  console.log('ROUTE '+label+' '+JSON.stringify(rows));
  if(rows.some(x=>x.screen!==expected||x.intent!==expected)){console.error('FAIL route '+label);process.exitCode=1;}
}
// Stress the bottom bar: repeated cross-screen taps must settle on the last requested route.
for(const label of ['Mensajes','Check-in','Clientes','Mensajes','Panel','Check-in']){await page.locator('#coach-nav button').filter({hasText:label}).first().click();await page.waitForTimeout(120);}
await page.waitForTimeout(2500);
const stress=await page.evaluate(()=>({screen:window.currentScreen,intent:window.__dccCoachRouteIntent}));
console.log('STRESS '+JSON.stringify(stress));
if(stress.screen!=='checkins'||stress.intent!=='checkins')process.exitCode=1;
await browser.close();
