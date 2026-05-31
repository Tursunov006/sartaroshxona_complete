const router = require('express').Router();
const { readDB, writeDB } = require('../db');
const { v4: uuidv4 } = require('uuid');
const { requireAuth, requireRole } = require('../middleware/auth');

// Barcha bronlarni olish (admin)
router.get('/', requireAuth, requireRole('admin'), (req, res) => {
  try {
    const db = readDB();
    const bookings = [...db.bookings].sort((a, b) =>
      new Date(b.createdAt) - new Date(a.createdAt)
    );
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Yangi bron yaratish
router.post('/', (req, res) => {
  try {
    const { customerName, customerPhone, serviceId, barberId, date, time } = req.body;

    if (!customerName || !customerPhone || !serviceId || !barberId || !date || !time) {
      return res.status(400).json({ error: "Barcha maydonlarni to'ldiring" });
    }

    // Telefon validatsiya
    const phoneClean = customerPhone.replace(/[\s\-()]/g, '');
    if (!/^(\+998|998)[0-9]{9}$/.test(phoneClean)) {
      return res.status(400).json({ error: "Noto'g'ri telefon raqam formati" });
    }

    const db = readDB();

    // Xizmat va sartaroshni tekshir
    const service = db.services?.find(s => s.id === serviceId);
    if (!service) return res.status(400).json({ error: "Xizmat topilmadi" });
    const barber = db.barbers?.find(b => b.id === barberId);
    if (!barber) return res.status(400).json({ error: "Sartarosh topilmadi" });

    // Vaqt formatini tekshir HH:MM
    if (!/^[0-2][0-9]:[0-5][0-9]$/.test(time)) {
      return res.status(400).json({ error: 'Vaqt formati HH:MM bo\'lishi kerak' });
    }

    // Business soatlari (agar mavjud bo'lsa)
    const open = db.settings?.openTime || '09:00';
    const close = db.settings?.closeTime || '20:00';
    const t2m = (t) => {
      const [hh, mm] = t.split(':').map(Number);
      return hh * 60 + mm;
    };
    const requestedStart = t2m(time);
    const requestedEnd = requestedStart + Number(service.duration || 30);
    if (requestedStart < t2m(open) || requestedEnd > t2m(close)) {
      return res.status(400).json({ error: 'Tanlangan vaqt ish soatlaridan tashqarida' });
    }

    // Shu vaqtda yoki xizmat davomiyligi bilan kesishuvchi bronlar mavjudmi?
    const { hasConflict } = require('../utils/bookingUtils');
    const conflict = hasConflict(db.bookings, { barberId, date, time, serviceId }, db.services || []);
    if (conflict) {
      return res.status(409).json({ error: 'Bu vaqtda sartarosh band. Boshqa vaqt tanlang.' });
    }
    const booking = {
      _id: uuidv4(),
      customerName,
      customerPhone,
      serviceId,
      barberId,
      serviceName: service?.name || serviceId,
      barberName: barber?.name || barberId,
      servicePrice: service?.price || 0,
      date,
      time,
      status: 'pending',
      reminderSent: false,
      createdAt: new Date().toISOString()
    };

    db.bookings.push(booking);
    writeDB(db);

    console.log('📅 Yangi bron:', booking.customerName, booking.date, booking.time);

    res.status(201).json({
      message: 'Bron muvaffaqiyatli yaratildi!',
      booking,
      aiReminder: '🤖 AI bron vaqtidan 2 soat oldin eslatma yuboradi'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Bronni yangilash (status o'zgartirish)
router.patch('/:id/status', requireAuth, requireRole('admin'), (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({ error: "Noto'g'ri status" });
    }

    const db = readDB();
    const idx = db.bookings.findIndex(b => b._id === id);
    if (idx === -1) return res.status(404).json({ error: 'Bron topilmadi' });

    db.bookings[idx].status = status;
    db.bookings[idx].updatedAt = new Date().toISOString();
    writeDB(db);

    res.json({ message: 'Status yangilandi', booking: db.bookings[idx] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Bronni o'chirish
router.delete('/:id', requireAuth, requireRole('admin'), (req, res) => {
  try {
    const db = readDB();
    const before = db.bookings.length;
    db.bookings = db.bookings.filter(b => b._id !== req.params.id);
    if (db.bookings.length === before) {
      return res.status(404).json({ error: 'Bron topilmadi' });
    }
    writeDB(db);
    res.json({ message: "Bron o'chirildi" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
