const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const ts = require('../fe/node_modules/typescript');
const { chromium } = require('C:/speego/Quanlycuahangxe/node_modules/playwright');
const src = fs.readFileSync(path.join(__dirname,'../fe/src/lib/portalData.ts'),'utf8');
const js = ts.transpileModule(src,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
function portal() {
  const storage = new Map();
  const context = vm.createContext({exports:{},TextEncoder,crypto:globalThis.crypto,window:{localStorage:{getItem:key=>storage.get(key)??null,setItem:(key,value)=>storage.set(key,value)}}});
  vm.runInContext(js,context);
  return context.exports;
}
(async()=>{
  const api = 'http://127.0.0.1:3001/api';
  const response = await fetch(`${api}/login`,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({account:'admin@hcmute.edu.vn',password:'123456'})});
  const session = await response.json();
  const headers = {Authorization:`Bearer ${session.access_token}`,Accept:'application/json'};
  const report = {};
  try {
    const users = await (await fetch(`${api}/users`,{headers})).json();
    const data = portal();
    report.teacher_mapping = users.filter(user=>user.role==='teacher').map(user=>({id:user.id,userCode:user.userCode,assignedClasses:data.getClassesForTeacher(user.id).length}));
    report.dataset = {databaseUsers:users.length,frontendClasses:data.portalClasses.length,frontendRosterStudents:new Set(data.portalClasses.flatMap(course=>course.studentIds)).size};
    const teacher = portal(), student = portal();
    const oldQr = teacher.createQrAttendanceSession('WEB-01','2026-11-18');
    report.qrOnSeparateBrowser = student.markPresentWithQr(oldQr.token,'20124001');
    teacher.createQrAttendanceSession('WEB-01','2026-11-18');
    report.oldQrAfterRegenerationAccepted = teacher.markPresentWithQr(oldQr.token,'20124001').ok;
    teacher.saveClassAttendance('WEB-01','2026-11-18',{'20124001':'absent'});
    teacher.markPresentWithQr(oldQr.token,'20124001');
    const before = teacher.getClassAttendance('WEB-01','2026-11-18')['20124001'];
    teacher.saveClassAttendance('WEB-01','2026-11-18',{'20124001':'absent'});
    report.staleTeacherSave = {afterQr:before,afterSavingOldSnapshot:teacher.getClassAttendance('WEB-01','2026-11-18')['20124001']};
  } finally { await fetch(`${api}/logout`,{method:'POST',headers}); }
  const browser = await chromium.launch({headless:true,channel:'chrome'});
  const context = await browser.newContext();
  let teacherToken;
  try {
    const page = await context.newPage();
    await page.goto('http://localhost:3101/login');
    await page.getByLabel('Tên đăng nhập',{exact:true}).fill('teacher@hcmute.edu.vn');
    await page.getByLabel('Mật khẩu',{exact:true}).fill('123456');
    await page.getByRole('button',{name:'Đăng nhập',exact:true}).click();
    await page.waitForURL('**/teacher/Index');
    await page.getByRole('button',{name:'Đăng xuất',exact:true}).first().waitFor();
    teacherToken = await page.evaluate(()=>localStorage.getItem('access_token'));
    await page.goto('http://localhost:3101/teacher/classes');
    await page.getByText('Chưa có lớp được phân công cho tài khoản này.',{exact:true}).waitFor();
    report.teacherEmptyClassesConfirmedInBrowser = true;
    await page.route('**/api/me',route=>route.fulfill({status:503,contentType:'application/json',headers:{'Access-Control-Allow-Origin':'http://localhost:3101'},body:'{"message":"Temporary unavailable"}'}));
    await page.goto('http://localhost:3101/teacher/Index');
    await page.waitForURL('**/login');
    report.temporary503ClearsLogin = !(await page.evaluate(()=>localStorage.getItem('access_token')));
  } finally {
    if(teacherToken) await context.request.post(`${api}/logout`,{headers:{Authorization:`Bearer ${teacherToken}`,Accept:'application/json'}});
    await browser.close();
  }
  console.log(JSON.stringify(report,null,2));
})().catch(error=>{console.error(error);process.exitCode=1;});
