const assert = require('node:assert/strict');
const { chromium } = require('C:/speego/Quanlycuahangxe/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const api = 'http://127.0.0.1:3001/api';
  const results = [];
  const stamp = Date.now();
  const code = `QA${stamp}`;
  const email = `qa${stamp}@example.test`;
  let adminToken, createdId;
  try {
    for (const [role, route] of [['admin','/dashboard'],['student','/student/Index'],['teacher','/teacher/Index']]) {
      const context = await browser.newContext();
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto('http://localhost:3101/login');
      assert.match(await page.title(), /PLT SOLUTIONS/);
      await page.getByLabel('Tên đăng nhập', {exact: true}).fill(`${role}@hcmute.edu.vn`);
      if (role === 'admin') {
        await page.getByLabel('Mật khẩu', {exact: true}).fill('invalid-password');
        const responsePromise = page.waitForResponse(r => r.url() === `${api}/login`);
        await page.getByRole('button', {name:'Đăng nhập',exact:true}).click();
        assert.equal((await responsePromise).status(),401);
        await page.getByRole('alert').waitFor();
        results.push('Invalid password: rejected with 401 in browser');
      }
      await page.getByLabel('Mật khẩu', {exact:true}).fill('123456');
      await page.getByRole('button', {name:'Đăng nhập',exact:true}).click();
      await page.waitForURL(`**${route}`);
      await page.getByRole('button', {name:'Đăng xuất',exact:true}).first().waitFor();
      const token = await page.evaluate(() => localStorage.getItem('access_token'));
      assert.ok(token);
      const headers = {Authorization:`Bearer ${token}`, Accept:'application/json'};
      if (role === 'admin') {
        adminToken = token;
        const response = await context.request.get(`${api}/users`, {headers});
        assert.equal(response.status(),200);
        const users = await response.json();
        assert.ok(Array.isArray(users));
        await page.waitForFunction(n => document.querySelectorAll('#accounts tbody tr').length === n, users.length);
        results.push(`Admin list: ${users.length} database users rendered`);
        await page.getByRole('button',{name:'Thêm tài khoản',exact:true}).click();
        const form = page.locator('#accounts form');
        await form.getByLabel('Mã sinh viên',{exact:true}).fill(code);
        await form.getByLabel('Họ và tên',{exact:true}).fill('PLT QA Temporary');
        await form.getByLabel('Email',{exact:true}).fill(email);
        await form.getByLabel('Mật khẩu',{exact:true}).fill('QaOnly123456!');
        const createPromise = page.waitForResponse(r => r.url() === `${api}/users` && r.request().method() === 'POST');
        await form.getByRole('button',{name:'Lưu tài khoản',exact:true}).click();
        const created = await createPromise;
        assert.equal(created.status(),201);
        createdId = (await created.json()).id;
        assert.ok(createdId);
        await page.locator('#accounts tbody tr').filter({hasText:email}).waitFor();
        await page.reload();
        let row = page.locator('#accounts tbody tr').filter({hasText:email});
        await row.waitFor();
        assert.match(await row.textContent(),/PLT QA Temporary/);
        results.push('Create from UI: persisted after reload');
        await row.getByRole('button',{name:'Sửa',exact:true}).click();
        await form.getByLabel('Họ và tên',{exact:true}).fill('PLT QA Updated');
        const editPromise = page.waitForResponse(r => r.url() === `${api}/users/${createdId}` && r.request().method() === 'PATCH');
        await form.getByRole('button',{name:'Lưu tài khoản',exact:true}).click();
        assert.equal((await editPromise).status(),200);
        await form.waitFor({state:'hidden'});
        await page.reload();
        row = page.locator('#accounts tbody tr').filter({hasText:email});
        await row.waitFor();
        assert.match(await row.textContent(),/PLT QA Updated/);
        results.push('Edit from UI: persisted after reload');
        page.once('dialog',dialog=>dialog.accept());
        const deletePromise = page.waitForResponse(r => r.url() === `${api}/users/${createdId}` && r.request().method() === 'DELETE');
        await row.getByRole('button',{name:'Xóa',exact:true}).click();
        assert.equal((await deletePromise).status(),204);
        await row.waitFor({state:'detached'});
        await page.reload();
        await page.getByRole('heading',{name:'Danh sách tài khoản',exact:true}).waitFor();
        await page.waitForFunction(n => document.querySelectorAll('#accounts tbody tr').length === n, users.length);
        assert.equal(await page.locator('#accounts tbody tr').filter({hasText:email}).count(),0);
        createdId = undefined;
        results.push('Delete from UI: absent after reload');
      } else {
        const response = await context.request.get(`${api}/users`, {headers});
        assert.equal(response.status(),403);
        results.push(`${role}: account administration forbidden (403)`);
      }
      await page.reload();
      await page.getByRole('button',{name:'Đăng xuất',exact:true}).first().waitFor();
      const logoutPromise = page.waitForResponse(r => r.url() === `${api}/logout`);
      await page.getByRole('button',{name:'Đăng xuất',exact:true}).first().click();
      assert.equal((await logoutPromise).status(),200);
      await page.waitForURL('**/login');
      const oldSession = await context.request.get(`${api}/me`, {headers});
      assert.equal(oldSession.status(),401);
      assert.deepEqual(errors,[]);
      results.push(`${role}: login, correct role landing, reload, logout/token revocation passed`);
      await context.close();
    }
    console.log(JSON.stringify({passed:true,results},null,2));
  } finally {
    if (createdId && adminToken) {
      const request = await browser.newContext();
      await request.request.delete(`${api}/users/${createdId}`,{headers:{Authorization:`Bearer ${adminToken}`}});
      await request.close();
    }
    await browser.close();
  }
})().catch(error => {console.error(error);process.exitCode=1;});
