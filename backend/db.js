const fs = require('fs');
const fsp = fs.promises;
const path = require('path');

const dbPath = path.join(__dirname, 'data.json');

const defaultData = {
  bookings: [],
  users: [],
  services: [
    { id: '1', name: 'Soch olish', price: 50000, duration: 30 },
    { id: '2', name: 'Soqol olish', price: 30000, duration: 20 },
    { id: '3', name: 'Yuzni tozalash', price: 40000, duration: 25 },
    { id: '4', name: "To'liq paket", price: 100000, duration: 60 },
  ],
  barbers: [
    { id: '1', name: 'Jasurbek', instagram: 'jasurbek_barber' },
    { id: '2', name: 'Sarvar', instagram: 'sarvar_barber' },
    { id: '3', name: 'Alisher', instagram: 'alisher_barber' },
  ],
  shops: [
    {
      id: 'shop1',
      name: 'Sartaroshxona Markaz',
      address: "Toshkent sh., Markaziy ko'cha 15",
      phone: '+998947690776',
      lat: 41.2995,
      lng: 69.2401
    }
  ],
  // Reviews and payments placeholders
  reviews: [],
  payments: [],
  // Barber availability: { barberId: { weekday: [{from:'09:00',to:'17:00'}], exceptions: [{date:'2026-06-01', blocks:[{from:'12:00',to:'13:00'}]}] } }
  availability: {},
  settings: {
    siteName: 'Sartaroshxona.uz',
    adminEmail: 'admin@sartaroshxona.uz',
    phone: '+998 94 769 07 76',
    address: "Toshkent sh., Markaziy ko'cha 15",
    openTime: '09:00',
    closeTime: '20:00',
    reminderHours: '2'
  }
};

function readDB() {
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify(defaultData, null, 2));
  }
  const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  // Eski versiya bilan moslik
  if (!data.services) data.services = defaultData.services;
  if (!data.barbers) data.barbers = defaultData.barbers;
  if (!data.reviews) data.reviews = [];
  if (!data.payments) data.payments = [];
  if (!data.availability) data.availability = {};
  if (!data.users) data.users = [];
  return data;
}

function writeDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

// Async adapter functions for future DB migration
async function read() {
  try {
    if (!fs.existsSync(dbPath)) {
      await fsp.writeFile(dbPath, JSON.stringify(defaultData, null, 2));
    }
    const txt = await fsp.readFile(dbPath, 'utf8');
    const data = JSON.parse(txt);
    if (!data.services) data.services = defaultData.services;
    if (!data.barbers) data.barbers = defaultData.barbers;
    if (!data.reviews) data.reviews = [];
    if (!data.payments) data.payments = [];
    if (!data.availability) data.availability = {};
    if (!data.users) data.users = [];
    return data;
  } catch (err) {
    // fallback to default
    await fsp.writeFile(dbPath, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }
}

async function write(data) {
  await fsp.writeFile(dbPath, JSON.stringify(data, null, 2));
}

const dbClient = { read, write };

module.exports = { readDB, writeDB, read, write, dbClient };
