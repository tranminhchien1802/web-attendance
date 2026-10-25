# HCMUTE Student Portal Starter

Dự án gồm 2 phần:
- Frontend: Next.js
- Backend: Express + PostgreSQL starter

## Yêu cầu
- Node.js 18+
- npm

## Chạy backend

```bash
cd be
npm install
copy .env.example .env
npm run dev
```

API chạy ở:
- http://localhost:3001/api/health

## Chạy frontend

```bash
cd fe-next
npm install
npm run dev:clean
```

Nếu máy đang có tiến trình cũ chiếm port 3000, lệnh `dev:clean` sẽ tự dọn cache `.next` và port cũ trước khi khởi chạy lại.

Frontend chạy ở:
- http://localhost:3000/login

## Kiểm tra nhanh
- Backend: http://localhost:3001/api/health
- Frontend: http://localhost:3000

## Ghi chú
- Đây là bản mockup giao diện và backend starter, chưa cần làm đầy đủ chức năng.
- Sau này bạn có thể chuyển backend sang Laravel và giữ FE Next.js.
