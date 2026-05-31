const router = require('express').Router();
const { readDB, writeDB } = require('../db');
const { requireAuth, requireRole } = require('../middleware/auth');

// List users (admin)
router.get('/', requireAuth, requireRole('admin'), (req, res) => {
    const db = readDB();
    const users = (db.users || []).map(u => ({
        id: u._id,
        fullName: u.fullName,
        email: u.email,
        role: u.role,
        phone: u.phone,
        createdAt: u.createdAt
    }));
    res.json(users);
});

// Delete user (admin)
router.delete('/:id', requireAuth, requireRole('admin'), (req, res) => {
    try {
        const db = readDB();
        const before = db.users.length;
        db.users = (db.users || []).filter(u => u._id !== req.params.id);
        if (db.users.length === before) return res.status(404).json({ error: 'Foydalanuvchi topilmadi' });
        writeDB(db);
        res.json({ message: "Foydalanuvchi o'chirildi" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
