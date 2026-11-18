# HCMUTE Portal API

Backend Laravel 13 + MySQL cho HCMUTE Student Portal (frontend Next.js tại `../fe`).

## Yêu cầu
- PHP 8.3+ (đã cài PHP 8.4.27)
- Composer 2.x
- MySQL 9.4 (service `MySQL94`)

## Cài đặt

```bash
composer install
copy .env.example .env
php artisan key:generate
```

Cập nhật `DB_PASSWORD` trong `.env`, sau đó tạo database và chạy migration:

```sql
CREATE DATABASE attendance_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

```bash
php artisan migrate --seed
php artisan serve --host=0.0.0.0 --port=8000
```

API chạy ở `http://127.0.0.1:8000/api`. Frontend có thể đổi host qua `NEXT_PUBLIC_API_URL`.

## Tài khoản mẫu

| Vai trò | Email | Mật khẩu |
| --- | --- | --- |
| Sinh viên | `student@hcmute.edu.vn` | `123456` |
| Giảng viên | `teacher@hcmute.edu.vn` | `123456` |
| Admin | `admin@hcmute.edu.vn` | `123456` |

## API

| Method | Endpoint | Mô tả |
| --- | --- | --- |
| POST | `/api/login` | Đăng nhập bằng email hoặc mã định danh, trả về Sanctum token |
| GET | `/api/me` | Thông tin người dùng hiện tại |
| POST | `/api/logout` | Đăng xuất, thu hồi token |
| GET | `/api/users` | Danh sách người dùng (admin) |
| POST | `/api/users` | Tạo tài khoản sinh viên/giảng viên (admin) |
| PATCH | `/api/users/{id}` | Cập nhật hồ sơ tài khoản (admin) |
| DELETE | `/api/users/{id}` | Xóa tài khoản sinh viên/giảng viên (admin) |
| PATCH | `/api/users/{id}/role` | Đổi vai trò tài khoản (admin) |

Tài khoản sinh viên/giảng viên cần `userCode`, `fullName`, `email`, `password` và `role` (`student` hoặc `teacher`). `phone`, `gender`, `avatar`, `isActive`, `department`, `faculty`, `major` là trường bổ sung; giới tính mặc định là `male`, tài khoản mặc định hoạt động. Mật khẩu tạo mới tối thiểu 8 ký tự. API trả `userCode` và vai trò `teacher`; DB lưu mã trong `user_code` và vai trò giảng viên là `lecturer`.

Các endpoint cần xác thực dùng header:

```
Authorization: Bearer <token>
```

## Kiểm thử

```bash
php artisan test
php vendor/bin/pint --test
```
