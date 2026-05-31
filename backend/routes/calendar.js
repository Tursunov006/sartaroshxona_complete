const router = require('express').Router();
const { readDB, writeDB } = require('../db');
const { v4: uuidv4 } = require('uuid');

// Get availability for a barber on a date (generates free slots)
router.get('/availability', (req, res) => {
    try {
        const { barberId, date, serviceId } = req.query;
        if (!barberId || !date || !serviceId) return res.status(400).json({ error: 'barberId, date and serviceId required' });
        const db = readDB();
        const service = db.services.find(s => s.id === serviceId);
        if (!service) return res.status(400).json({ error: 'Service not found' });

        const duration = Number(service.duration || 30);
        // business hours or barber weekly availability
        let open = db.settings?.openTime || '09:00';
        let close = db.settings?.closeTime || '20:00';
        const weekday = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][new Date(date).getDay()];
        const barberAvailability = db.availability?.[barberId];
        if (barberAvailability?.weekly?.[weekday]?.length) {
            open = barberAvailability.weekly[weekday][0].from;
            close = barberAvailability.weekly[weekday][0].to;
        }

        const t2m = (t) => {
            const [hh, mm] = t.split(':').map(Number);
            return hh * 60 + mm;
        };
        const m2t = (m) => {
            const hh = Math.floor(m / 60).toString().padStart(2, '0');
            const mm = (m % 60).toString().padStart(2, '0');
            return `${hh}:${mm}`;
        };

        // collect existing bookings for barber on date
        const bookings = (db.bookings || []).filter(b => b.barberId === barberId && b.date === date && b.status !== 'cancelled');

        const slots = [];
        const start = t2m(open);
        const end = t2m(close);
        for (let s = start; s + duration <= end; s += 15) { // step every 15 minutes
            const slotStart = s;
            const slotEnd = s + duration;
            const conflict = bookings.find(b => {
                const existStart = t2m(b.time);
                const existEnd = existStart + Number(db.services.find(x => x.id === b.serviceId)?.duration || 30);
                return (slotStart < existEnd && existStart < slotEnd);
            });
            if (!conflict) slots.push(m2t(slotStart));
        }

        res.json({ slots });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Admin: set weekly availability for barber
router.post('/set', (req, res) => {
    try {
        const { barberId, availability } = req.body; // availability: { monday: [{from,to}], ... }
        if (!barberId || !availability) return res.status(400).json({ error: 'barberId and availability required' });
        const db = readDB();
        db.availability = db.availability || {};
        db.availability[barberId] = db.availability[barberId] || {};
        db.availability[barberId].weekly = availability;
        writeDB(db);
        res.json({ message: 'Availability saved' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
