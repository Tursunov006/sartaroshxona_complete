const router = require('express').Router();
const { readDB, writeDB } = require('../db');
const { v4: uuidv4 } = require('uuid');
const { requireAuth, requireRole } = require('../middleware/auth');

router.get('/', (req, res) => {
  const db = readDB();
  res.json(db.barbers || []);
});

router.post('/', requireAuth, requireRole('admin'), (req, res) => {
  try {
    const { name, instagram } = req.body;
    if (!name) return res.status(400).json({ error: 'Ism kiritilishi shart' });
    const db = readDB();
    const barber = { id: uuidv4(), name, instagram: instagram || '' };
    if (!db.barbers) db.barbers = [];
    db.barbers.push(barber);
    writeDB(db);
    res.status(201).json(barber);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id', requireAuth, requireRole('admin'), (req, res) => {
  try {
    const { name, instagram } = req.body;
    const db = readDB();
    const idx = db.barbers.findIndex(b => b.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Sartarosh topilmadi' });
    db.barbers[idx] = {
      ...db.barbers[idx],
      name: name ?? db.barbers[idx].name,
      instagram: instagram ?? db.barbers[idx].instagram,
    };
    writeDB(db);
    res.json(db.barbers[idx]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', requireAuth, requireRole('admin'), (req, res) => {
  try {
    const db = readDB();
    db.barbers = (db.barbers || []).filter(b => b.id !== req.params.id);
    writeDB(db);
    res.json({ message: "Sartarosh o'chirildi" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
