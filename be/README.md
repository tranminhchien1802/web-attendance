# Backend starter (Express + PostgreSQL)

## Run nhanh

```bash
cd be
npm install
copy .env.example .env
npm run dev
```

## Kiểm tra

```bash
curl http://localhost:3001/api/health
```

## API mẫu
- GET /api/health
- POST /api/auth/login
- GET /api/auth/me

## Env mẫu

```env
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=attendance_db
DB_USER=postgres
DB_PASSWORD=postgres
```
