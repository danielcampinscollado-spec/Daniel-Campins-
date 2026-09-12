import { chromium } from 'playwright';

const url=process.env.RC_URL;
if(!url)throw new Error('RC_URL missing');
const browser=await chromium.launch({headless:true});
const viewports=[
  {name:'mobile',width:390,height:844},
  {name:'desktop',width:1366,height:900}
];
let failed=false;

for(const viewport of viewports){
  const context=await browser.newContext({viewport:{width:viewport.width,height:viewport.height}});
  const page=await context.newPage();
  const errors=[];
  const failedRequests=[];
  page.on('pageerror',e=>errors.push('pageerror: '+e.message));
  page.on('console',m=>{if(m.type()==='error')errors.push('console: '+m.text())});
  page.on('requestfailed',r=>failedRequests.push(`${r.method()} ${r.url()} :: ${r.failure()?.errorText||'failed'}`));

  const response=await page.goto(url,{waitUntil:'networkidle',timeout:60000});
  const status=response?.status()||0;
  const result=await page.evaluate(()=>({
    title:document.title,
    hasLogin:!!document.getElementById('login'),
    hasCoach:!!document.getElementById('coach'),
    hasClient:!!document.getElementById('client'),
    width:document.documentElement.scrollWidth,
    clientWidth:document.documentElement.clientWidth,
    visibleText:(document.body?.innerText||'').slice(0,500),
    scriptCount:document.scripts.length,
    buttonCount:document.querySelectorAll('button').length,
    linkCount:document.querySelectorAll('a').length,
    readyState:document.readyState
  }));

  const overflow=result.width>result.clientWidth+2;
  console.log(JSON.stringify({viewport:viewport.name,status,...result,overflow,errors,failedRequests},null,2));
  if(status<200||status>=400||!result.hasLogin||!result.hasCoach||!result.hasClient||overflow||errors.length||failedRequests.length||result.readyState!=='complete')failed=true;
  await context.close();
}

await browser.close();
if(failed)process.exit(1);
