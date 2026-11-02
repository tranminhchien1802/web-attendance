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
php artisan serve --host=0.0.0.0 --port=3001
```

API chạy ở `http://localhost:3001`.

## Tài khoản mẫu

| Vai trò | Email | Mật khẩu |
| --- | --- | --- |
| Sinh viên | `student@hcmute.edu.vn` | `123456` |
| Giảng viên | `teacher@hcmute.edu.vn` | `123456` |
| Admin | `admin@hcmute.edu.vn` | `123456` |

## API

| Method | Endpoint | Mô tả |
| --- | --- | --- |
| GET | `/api/health` | Kiểm tra trạng thái |
| POST | `/api/auth/register` | Đăng ký sinh viên/giảng viên |
| POST | `/api/auth/login` | Đăng nhập, trả về token Sanctum |
| GET | `/api/auth/me` | Thông tin người dùng hiện tại |
| POST | `/api/auth/logout` | Đăng xuất, thu hồi token |
| GET | `/api/users` | Danh sách người dùng (admin) |
| PATCH | `/api/users/{id}/role` | Đổi vai trò (admin) |

Các endpoint cần xác thực dùng header:

```
Authorization: Bearer <token>
```

## Kiểm thử

```bash
php artisan test
php vendor/bin/pint --test
```
