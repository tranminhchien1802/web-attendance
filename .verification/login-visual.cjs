const {chromium}=require('C:/speego/Quanlycuahangxe/node_modules/playwright');
const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'chrome'});
 try {
  const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://localhost:3101/login',{waitUntil:'networkidle'});
  await page.locator('.auth-brand-panel img').first().evaluate(img=>img.decode());
  await page.screenshot({path:path.join(__dirname,'login-photo-desktop.png')});
  const desktop=await page.evaluate(()=>({font:getComputedStyle(document.body).fontFamily,fontVariable:getComputedStyle(document.body).getPropertyValue('--font-roboto'),overflow:document.documentElement.scrollWidth>innerWidth,heroLoaded:document.querySelector('.auth-brand-panel img').naturalWidth>0}));
  await page.setViewportSize({width:390,height:844});
  await page.waitForLoadState('networkidle');
  await page.screenshot({path:path.join(__dirname,'login-photo-mobile.png')});
  const mobile=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,photos:[...document.querySelectorAll('img')].filter(img=>img.currentSrc.includes('plt-login-learning-hub')).map(img=>({loaded:img.naturalWidth>0}))}));
  console.log(JSON.stringify({desktop,mobile,errors}));
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
