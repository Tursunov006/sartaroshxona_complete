# Sartaroshxona.uz — To'liq Qo'llanma

## Loyiha tuzilishi

```
Sartaroshxona.uz/
├── backend/          Node.js server (port 5000)
├── admin-frontend/   React admin panel (port 3001)
├── frontend/         React mijozlar sayti (port 3000)
└── flutter/          Flutter mobile ilova
```

---

## 1. BACKEND ishga tushirish

```bash
cd backend
npm install
npm start
```

Test: http://localhost:5000/api/test

---

## 2. ADMIN PANEL

```bash
cd admin-frontend
npm install
npm start
```

URL: http://localhost:3001
Email: admin@sartaroshxona.uz
Parol: admin123

---

## 3. FLUTTER

```bash
flutter pub get
flutter run -d chrome     # Web
flutter run               # Android (USB bilan ulangan)
```

Real telefon uchun api_service.dart da:
http://10.0.2.2:5000/api   ->  http://192.168.1.XXX:5000/api

---

## API Endpoints

GET    /api/test
GET    /api/services
GET    /api/barbers
GET    /api/bookings
POST   /api/bookings
PATCH  /api/bookings/:id/status
DELETE /api/bookings/:id
POST   /api/auth/login
GET    /api/auth/ai-logs

---

## Tez-tez uchraydigan xatolar

EADDRINUSE  -> Port 5000 band, serverni qayta ishga tushiring
CORS xato   -> Backend index.js da cors() bor, server ishlasinmi tekshiring
Android     -> IP manzilni o'zgartiring (emulator: 10.0.2.2)
Flutter     -> flutter pub get bajaring
