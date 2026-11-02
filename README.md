# HCMUTE Student Portal Starter

Dự án gồm 2 phần:
- Frontend: Next.js (`fe`)
- Backend: Laravel 13 + MySQL (`be`)

## Môi trường
- PHP 8.4.27 (NTS x64) + Composer 2.11.1
- Laravel Installer 5.32.0
- MySQL 9.4 (service `MySQL94`, port 3306)

## Chạy backend

```bash
cd be
composer install
php artisan migrate --seed
php artisan serve --host=0.0.0.0 --port=3001
```

Cấu hình database trong `be/.env` (`DB_DATABASE=attendance_db`, điền `DB_PASSWORD`).
Xem chi tiết API tại [be/README.md](be/README.md).

Backend chạy ở:
- http://localhost:3001/api/health

## Chạy frontend

```bash
cd fe
npm install
npm run dev
```

Frontend chạy ở:
- http://localhost:3000

## Ghi chú
- Backend Express + PostgreSQL cũ đã được dọn bỏ.
