# Chordify v1.1

Platform web komunitas chord gitar — Tubes PBO.
**Frontend:** React + Vite + Tailwind CSS · **Backend:** Java Spring Boot · **DB:** MySQL · **API:** REST + JWT

## Menjalankan

```bash
# 1. Database (atau pakai MySQL sendiri)
docker compose up -d          # user root / password root

# 2. Backend  (butuh JDK 17 + Maven)
cd backend
# sesuaikan DB_PASSWORD jika perlu: export DB_PASSWORD=root
mvn spring-boot:run           # http://localhost:8080

# 3. Frontend (butuh Node 18+)
cd frontend
cp .env.example .env
npm install
npm run dev                   # http://localhost:5173
```

Akun admin awal (dibuat otomatis): `admin@chordify.local` / `Admin12345!`  — ganti lewat env `ADMIN_*`.

## Status halaman (Figma: Desktop UI)

| Node | Halaman | Status |
|---|---|---|
| Desktop / 00 | Welcome Landing | ✅ dibuat |
| Desktop / 12 | Login | ✅ dibuat (terhubung ke `/api/auth/login`) |
| Desktop / 13 | Register | 🔲 placeholder (endpoint backend sudah ada) |
| Desktop / 01–11, 14–18 | Lainnya | 🔲 placeholder |

## Struktur

```
chordify/
├── frontend/   React app (pages, components, routes, services, context)
├── backend/    Spring Boot (controller → service → repository → model)
└── docker-compose.yml
```
