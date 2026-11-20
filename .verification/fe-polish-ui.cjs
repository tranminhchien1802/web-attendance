const assert = require('node:assert/strict');
const path = require('node:path');
const {chromium} = require('C:/speego/Quanlycuahangxe/node_modules/playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'chrome'});
 const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 const page=await context.newPage(); page.setDefaultTimeout(18000);
 const api='http://127.0.0.1:3001/api', base='http://localhost:3101', results=[], errors=[];
 let createdId, adminToken;
 page.on('pageerror',error=>errors.push(error.message));
 async function login(role){await page.goto(base+'/login');await page.getByLabel('Tên đăng nhập',{exact:true}).fill(role+'@hcmute.edu.vn');await page.getByLabel('Mật khẩu',{exact:true}).fill('123456');await page.getByRole('button',{name:'Đăng nhập',exact:true}).click();await page.getByRole('button',{name:'Đăng xuất',exact:true}).first().waitFor();}
 async function logout(){const response=page.waitForResponse(r=>r.url()===api+'/logout');await page.getByRole('button',{name:'Đăng xuất',exact:true}).first().click();assert.equal((await response).status(),200);await page.waitForURL('**/login');}
 async function mobileCheck(route){await page.goto(base+route);await page.setViewportSize({width:390,height:844});await page.locator('.plt-main').waitFor();await page.waitForLoadState('networkidle');await page.locator('[aria-label="Đang tải tài khoản"]').waitFor({state:'hidden'});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,route+' mobile overflow');await page.screenshot({path:path.join(__dirname,'polish-'+route.replace(/\W/g,'-')+'-mobile.png')});await page.setViewportSize({width:1440,height:1000});}
 try{
  await login('admin');adminToken=await page.evaluate(()=>localStorage.getItem('access_token'));
  await page.waitForFunction(()=>document.querySelectorAll('#accounts tbody tr').length>=5);
  await page.getByLabel('Lọc vai trò',{exact:true}).selectOption('teacher');assert.equal(await page.locator('#accounts tbody tr').count(),2);
  await page.getByLabel('Lọc vai trò',{exact:true}).selectOption('all');
  await page.getByRole('button',{name:'Thêm tài khoản',exact:true}).click();
  let dialog=page.getByRole('dialog');const stamp=Date.now(), email='polish'+stamp+'@example.test';
  await dialog.getByLabel('Mã sinh viên',{exact:true}).fill('QA'+stamp);await dialog.getByLabel('Họ và tên',{exact:true}).fill('PLT UI Check');await dialog.getByLabel('Email',{exact:true}).fill(email);await dialog.getByLabel('Mật khẩu',{exact:true}).fill('UiCheck123456!');
  console.log('Admin form validity:',await dialog.locator('form').evaluate(form=>({valid:form.checkValidity(),invalid:[...form.querySelectorAll(':invalid')].map(input=>({type:input.type,message:input.validationMessage}))})));
  const [made]=await Promise.all([page.waitForResponse(r=>r.url()===api+'/users'&&r.request().method()==='POST'),dialog.getByRole('button',{name:'Lưu tài khoản',exact:true}).click()]);assert.equal(made.status(),201);createdId=(await made.json()).id;await dialog.waitFor({state:'hidden'});
  await page.reload();let row=page.locator('#accounts tbody tr').filter({hasText:email});await row.waitFor();
  await row.getByRole('button',{name:/Sửa/}).click();dialog=page.getByRole('dialog');await dialog.getByLabel('Họ và tên',{exact:true}).fill('PLT UI Updated');await dialog.getByRole('button',{name:'Lưu tài khoản',exact:true}).click();await dialog.waitFor({state:'hidden'});await page.reload();row=page.locator('#accounts tbody tr').filter({hasText:email});await row.waitFor();assert.match(await row.textContent(),/PLT UI Updated/);
  await row.getByRole('button',{name:/Xóa/}).click();await page.getByRole('dialog').getByRole('button',{name:'Xóa tài khoản',exact:true}).click();await row.waitFor({state:'detached'});createdId=undefined;results.push('Admin: filters, drawer, create/edit/delete persisted in MySQL');
  await mobileCheck('/dashboard');assert.equal(await page.locator('.plt-account-mobile article').count(),5);await logout();
  await login('teacher');await page.goto(base+'/teacher/classes');await page.locator('.plt-course-card').first().waitFor();assert.equal(await page.locator('.plt-course-card').count(),4);await mobileCheck('/teacher/schedule');
  await page.goto(base+'/teacher/tools');await page.getByRole('button',{name:'Ghi nhật ký',exact:true}).first().click();dialog=page.getByRole('dialog');const topic='UI log '+stamp;
  await dialog.getByLabel('Chủ đề buổi học',{exact:true}).fill(topic);await dialog.getByLabel('Nội dung đã giảng',{exact:true}).fill('Nội dung kiểm tra giao diện.');await dialog.getByLabel('Ghi chú',{exact:true}).fill('Ghi chú kiểm thử');await dialog.getByLabel('Số tiết thực hiện',{exact:true}).fill('3');await dialog.getByRole('button',{name:'Lưu nhật ký',exact:true}).click();await dialog.waitFor({state:'hidden'});await page.reload();await page.getByRole('heading',{name:topic,exact:true}).waitFor();
  const log=page.locator('details').filter({hasText:topic});await log.locator('summary').click();await log.getByRole('button',{name:'Sửa nhật ký',exact:true}).click();dialog=page.getByRole('dialog');await dialog.getByLabel('Ghi chú',{exact:true}).fill('Đã chỉnh sửa');await dialog.getByRole('button',{name:'Lưu nhật ký',exact:true}).click();await dialog.waitFor({state:'hidden'});
  const downloadPromise=page.waitForEvent('download');await page.getByRole('button',{name:'Xuất Excel',exact:true}).click();const download=await downloadPromise;await download.saveAs(path.join(__dirname,'polish-log.xlsx'));
  await page.screenshot({path:path.join(__dirname,'polish-journal.png')});results.push('Teacher: assigned classes, diary create/edit/reload, XLSX download');
  await page.goto(base+'/teacher/classes/WEB-01/attendance');await page.getByRole('button',{name:'Tạo mã QR',exact:true}).click();const oldToken=(await page.locator('.plt-qr-token').textContent()).trim();await page.getByRole('button',{name:'Tạo lại mã',exact:true}).click();const token=(await page.locator('.plt-qr-token').textContent()).trim();assert.notEqual(token,oldToken);
  const first=page.locator('.plt-desktop-roster tbody tr').filter({hasText:'20124001'});await first.getByRole('button',{name:'Vắng',exact:true}).click();await page.getByRole('button',{name:'Lưu điểm danh',exact:true}).click();await page.screenshot({path:path.join(__dirname,'polish-qr.png')});await mobileCheck('/teacher/classes/WEB-01/attendance');await logout();
  await login('student');await page.goto(base+'/student/attendance');await page.getByLabel('Mã QR',{exact:true}).fill(oldToken);await page.getByRole('button',{name:'Xác nhận',exact:true}).click();await page.getByRole('alert').filter({hasText:/Mã QR không hợp lệ/}).waitFor();
  await page.getByLabel('Mã QR',{exact:true}).fill(token);await page.getByRole('button',{name:'Xác nhận',exact:true}).click();assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('phg_attendance_records_v1'))['WEB-01|'+new Date().getFullYear()+'-'+String(new Date().getMonth()+1).padStart(2,'0')+'-'+String(new Date().getDate()).padStart(2,'0')]['20124001']),'present');
  await page.getByRole('button',{name:'Xác nhận',exact:true}).click();await page.getByText(/Không cần gửi lại/).first().waitFor();results.push('QR: regeneration invalidates old code, student check-in and duplicate guard');
  await mobileCheck('/student/attendance');await mobileCheck('/student/schedule');await page.goto(base+'/teacher/tools');await page.waitForURL('**/student/Index');await logout();
  assert.deepEqual(errors,[]);console.log(JSON.stringify({passed:true,results},null,2));
 }catch(error){await page.screenshot({path:path.join(__dirname,'polish-failure.png'),fullPage:true});throw error;}
 finally{if(createdId&&adminToken)await context.request.delete(api+'/users/'+createdId,{headers:{Authorization:'Bearer '+adminToken,Accept:'application/json'}});await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
