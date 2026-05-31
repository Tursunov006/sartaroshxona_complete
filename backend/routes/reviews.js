const router = require('express').Router();
const { readDB, writeDB } = require('../db');
const { v4: uuidv4 } = require('uuid');
const { requireAuth, requireRole } = require('../middleware/auth');

// List reviews (optionally by shop or barber)
router.get('/', (req, res) => {
    try {
        const { shopId, barberId } = req.query;
        const db = readDB();
        let out = db.reviews || [];
        if (shopId) out = out.filter(r => r.shopId === shopId);
        if (barberId) out = out.filter(r => r.barberId === barberId);
        res.json(out);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Post a review (public)
router.post('/', (req, res) => {
    try {
        const { shopId, barberId, rating, comment, userName } = req.body;
        if (!rating || (!shopId && !barberId)) return res.status(400).json({ error: 'rating and shopId/barberId required' });
        const db = readDB();
        const review = { id: uuidv4(), shopId: shopId || null, barberId: barberId || null, rating: Number(rating), comment: comment || '', userName: userName || 'Guest', createdAt: new Date().toISOString() };
        db.reviews = db.reviews || [];
        db.reviews.unshift(review);
        writeDB(db);
        res.status(201).json({ message: 'Review posted', review });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Admin: delete review
router.delete('/:id', requireAuth, requireRole('admin'), (req, res) => {
    try {
        const db = readDB();
        const before = db.reviews.length;
        db.reviews = db.reviews.filter(r => r.id !== req.params.id);
        if (db.reviews.length === before) return res.status(404).json({ error: 'Not found' });
        writeDB(db);
        res.json({ message: 'Deleted' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
