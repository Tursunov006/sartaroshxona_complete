# Sartaroshxona.uz — To'liq Qo'llanma

## Loyiha tuzilishi

```
Sartaroshxona_complete/
├── backend/          Node.js server (port 5000)
├── admin-frontend/   React admin panel + mijoz veb sahifasi (port 3001)
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

## 2. ADMIN PANEL va Mijoz sayti

```bash
cd admin-frontend
npm install
npm start
```

Admin panel: http://localhost:3001
Mijoz sayti: http://localhost:3001/public

Admin email: admin@sartaroshxona.uz
Admin parol: admin123

---

## 3. FLUTTER

```bash
cd flutter
flutter pub get
flutter run -d chrome     # Web
flutter run               # Android emulator yoki qurilmada
```

Android emulator uchun backend manzili:
`http://10.0.2.2:5000/api`

---

## Public mijoz sahifasi

- http://localhost:3001/public
- http://localhost:3001/public/services
- http://localhost:3001/public/barbers
- http://localhost:3001/public/shops
- http://localhost:3001/public/reviews
- http://localhost:3001/public/booking
- http://localhost:3001/public/map
- http://localhost:3001/public/login
- http://localhost:3001/public/register

---

## API Endpoints

GET    /api/test
GET    /api/services
GET    /api/barbers
GET    /api/shops
GET    /api/shops/nearby?lat=&lng=&radius=
GET    /api/reviews
POST   /api/reviews
GET    /api/bookings
POST   /api/bookings
PATCH  /api/bookings/:id/status
DELETE /api/bookings/:id
POST   /api/auth/login
POST   /api/auth/register
GET    /api/auth/ai-logs
GET    /api/settings
GET    /api/users

---

## Tez-tez uchraydigan xatolar

- `EADDRINUSE`  -> Port band, serverni qayta ishga tushiring yoki portni o‘zgartiring.
- CORS xato   -> Backendda `cors()` ishlatilgan; frontend va backend portlari mosligini tekshiring.
- Android     -> Emulatorda `http://10.0.2.2:5000/api` ishlatish kerak.
- Flutter     -> `flutter pub get` bajarilganligiga ishonch hosil qiling.
