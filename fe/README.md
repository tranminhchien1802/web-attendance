# Frontend (Next.js)

## Run nhanh

```bash
cd fe
npm ci
cp .env.example .env.local
npm run dev
```

Mở trình duyệt:
- http://localhost:3000

## Build production

```bash
cd fe-next
npm run build
npm run start
```

`NEXT_PUBLIC_API_URL` trong `.env.local` là địa chỉ host của Laravel, không gồm `/api`.

## Tích hợp hiện có
- Đăng nhập, lấy phiên hiện tại và đăng xuất dùng Laravel Sanctum.
- Admin xem, thêm, sửa và xóa tài khoản sinh viên/giảng viên qua `/api/users`.
- Hồ sơ tài khoản đồng bộ các trường mã, họ tên, email, vai trò, điện thoại, giới tính, trạng thái, khoa, bộ môn và ngành/chuyên môn.
- Lịch học, điểm danh, nhật ký giảng dạy và điểm hiện vẫn là dữ liệu giao diện mẫu; BE chưa có API cho các module này.
