const router = require('express').Router();
const { readDB, writeDB } = require('../db');
const { requireAuth, requireRole } = require('../middleware/auth');

// Get settings (admin)
router.get('/', requireAuth, requireRole('admin'), (req, res) => {
    const db = readDB();
    res.json(db.settings || {});
});

// Update settings (admin)
router.post('/', requireAuth, requireRole('admin'), (req, res) => {
    try {
        const db = readDB();
        db.settings = req.body;
        writeDB(db);
        res.json({ message: 'Sozlamalar saqlandi', settings: db.settings });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
