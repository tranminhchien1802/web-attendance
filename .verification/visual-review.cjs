const {chromium}=require('C:/speego/Quanlycuahangxe/node_modules/playwright');
const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'chrome'});
 const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 const page=await context.newPage();
 const folder=__dirname;
 await page.goto('http://localhost:3101/login',{waitUntil:'networkidle'});
 await page.screenshot({path:path.join(folder,'visual-login.png')});
 for(const role of ['student','teacher','admin']){
  await page.goto('http://localhost:3101/login');
  await page.getByLabel('Tên đăng nhập',{exact:true}).fill(`${role}@hcmute.edu.vn`);
  await page.getByLabel('Mật khẩu',{exact:true}).fill('123456');
  await page.getByRole('button',{name:'Đăng nhập',exact:true}).click();
  await page.getByRole('button',{name:'Đăng xuất',exact:true}).first().waitFor();
  await page.waitForLoadState('networkidle');
  await page.screenshot({path:path.join(folder,`visual-${role}.png`)});
  if(role==='student'){
   await page.setViewportSize({width:390,height:844});
   await page.screenshot({path:path.join(folder,'visual-mobile.png')});
   await page.setViewportSize({width:1440,height:1000});
  }
  const response=page.waitForResponse(r=>r.url().endsWith('/api/logout'));
  await page.getByRole('button',{name:'Đăng xuất',exact:true}).first().click();
  await response;
  await page.waitForURL('**/login');
 }
 await page.setViewportSize({width:390,height:844});
 await page.screenshot({path:path.join(folder,'visual-login-mobile.png')});
 await browser.close();
 console.log('Saved six visual review screenshots.');
})().catch(e=>{console.error(e);process.exitCode=1});
