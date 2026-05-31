const router = require('express').Router();
const { readDB, writeDB } = require('../db');
const { v4: uuidv4 } = require('uuid');
const { requireAuth, requireRole } = require('../middleware/auth');

router.get('/', (req, res) => {
  const db = readDB();
  res.json(db.services || []);
});

router.post('/', requireAuth, requireRole('admin'), (req, res) => {
  try {
    const { name, price, duration } = req.body;
    if (!name || !price || !duration) {
      return res.status(400).json({ error: "Barcha maydonlarni to'ldiring" });
    }
    const db = readDB();
    const service = { id: uuidv4(), name, price: Number(price), duration: Number(duration) };
    if (!db.services) db.services = [];
    db.services.push(service);
    writeDB(db);
    res.status(201).json(service);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', requireAuth, requireRole('admin'), (req, res) => {
  try {
    const db = readDB();
    db.services = (db.services || []).filter(s => s.id !== req.params.id);
    writeDB(db);
    res.json({ message: "Xizmat o'chirildi" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
