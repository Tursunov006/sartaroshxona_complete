const router = require('express').Router();
const { readDB, writeDB } = require('../db');
const { v4: uuidv4 } = require('uuid');
const { requireAuth, requireRole } = require('../middleware/auth');

// Placeholder: create payment record (simulate intent)
router.post('/create', (req, res) => {
    try {
        const { bookingId, amount, method } = req.body;
        if (!bookingId || !amount) return res.status(400).json({ error: 'bookingId and amount required' });
        const db = readDB();
        const payment = { id: uuidv4(), bookingId, amount: Number(amount), method: method || 'manual', status: 'pending', createdAt: new Date().toISOString() };
        db.payments = db.payments || [];
        db.payments.push(payment);
        writeDB(db);
        res.status(201).json({ message: 'Payment created (placeholder)', payment });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Get payments (admin)
router.get('/', requireAuth, requireRole('admin'), (req, res) => {
    try {
        const db = readDB();
        res.json(db.payments || []);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
