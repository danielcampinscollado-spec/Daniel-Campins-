import { chromium } from 'playwright';

const url=process.env.RC_URL;
if(!url)throw new Error('RC_URL missing');
const browser=await chromium.launch({headless:true});
const viewports=[{name:'mobile',width:390,height:844},{name:'desktop',width:1366,height:900}];
let failed=false;

async function state(page,label){
  const s=await page.evaluate(label=>({
    label,
    currentApp:window.currentApp,
    currentScreen:window.currentScreen,
    intent:window.__dccCoachRouteIntent,
    mainClass:document.getElementById('coach-main')?.className||'',
    mainText:(document.getElementById('coach-main')?.innerText||'').slice(0,180),
    nav:[...document.querySelectorAll('#coach-nav button')].map(b=>({text:(b.innerText||'').trim(),active:b.classList.contains('active')})),
    scripts:[...document.scripts].map(s=>s.src).filter(Boolean).map(x=>x.split('/').pop()),
    wrappers:(()=>{let fn=window.showCoach,out=[],seen=new Set();for(let i=0;i<20&&typeof fn==='function'&&!seen.has(fn);i++){seen.add(fn);out.push({i,premium9:!!fn.__dccPremiumV9,instant:!!fn.__dccInstantV15,fast:!!fn.__dccFastFinalV15,checkRemote:!!fn.__dccCheckinRemoteSyncV4,checkPremium:!!fn.__dccCheckinPremiumV2,msgPremium:!!fn.__dccMessagesPremium,navFinal:!!fn.__dccCoachNavFinal});fn=fn.__base||fn.__original}return out})()
  }),label);
  console.log('STATE '+JSON.stringify(s));
  return s;
}

async function sample(page,label,ms=1800){
  const rows=[];
  for(let t=0;t<=ms;t+=150){await page.waitForTimeout(t?150:0);rows.push(await page.evaluate(t=>({t,screen:window.currentScreen,intent:window.__dccCoachRouteIntent,cls:document.getElementById('coach-main')?.className||'',text:(document.getElementById('coach-main')?.innerText||'').slice(0,70)}),t))}
  console.log('TRACE '+label+' '+JSON.stringify(rows));
  return rows;
}

async function clickNav(page,label){
  const button=page.locator('#coach-nav button').filter({hasText:label}).first();
  if(!await button.count())throw new Error('Missing nav '+label);
  await button.click();
  return sample(page,'nav-'+label);
}

for(const viewport of viewports){
  const context=await browser.newContext({viewport:{width:viewport.width,height:viewport.height}});
  const page=await context.newPage();
  const errors=[];
  page.on('pageerror',e=>errors.push('pageerror: '+e.message));
  page.on('console',m=>{if(m.type()==='error')errors.push('console: '+m.text())});
  const response=await page.goto(url,{waitUntil:'networkidle',timeout:60000});
  if((response?.status()||0)>=400)throw new Error('HTTP '+response.status());
  await page.waitForTimeout(2600);
  await state(page,viewport.name+'-loaded');

  await page.evaluate(async()=>{if(typeof window.openApp!=='function')throw new Error('openApp missing');await window.openApp('coach')});
  await page.waitForTimeout(2600);
  await state(page,viewport.name+'-coach');

  const checks=await clickNav(page,'Check-in');
  if(checks.some((x,i)=>i>1&&x.screen==='dashboard')){errors.push('BOUNCE: Check-in -> dashboard');failed=true}
  const review=page.locator('#coach-main button').filter({hasText:/Revisar|Abrir/}).first();
  if(await review.count()){
    await review.click();
    const rows=await sample(page,'checkin-detail');
    if(rows.some((x,i)=>i>1&&x.screen==='dashboard')){errors.push('BOUNCE: checkin detail -> dashboard');failed=true}
  }

  const msgs=await clickNav(page,'Mensajes');
  if(msgs.some((x,i)=>i>1&&x.screen==='dashboard')){errors.push('BOUNCE: Messages -> dashboard');failed=true}
  const open=page.locator('#coach-main button').filter({hasText:'Abrir'}).first();
  if(await open.count()){
    await open.click();
    const rows=await sample(page,'message-detail');
    if(rows.some((x,i)=>i>1&&x.screen==='dashboard')){errors.push('BOUNCE: message detail -> dashboard');failed=true}
  }

  await clickNav(page,'Clientes');
  await state(page,viewport.name+'-clients');
  console.log('RESULT '+viewport.name+' '+JSON.stringify({errors}));
  if(errors.some(e=>e.startsWith('pageerror')))failed=true;
  await context.close();
}
await browser.close();
if(failed)process.exit(1);
