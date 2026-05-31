const router  = require('express').Router();
const jwt     = require('jsonwebtoken');
const bcrypt  = require('bcryptjs');
const { readDB, writeDB } = require('../db');
const { v4: uuidv4 } = require('uuid');

const SECRET = process.env.JWT_SECRET || 'sartaroshxona_secret_2024';

router.post('/register', async (req, res) => {
  try {
    const { fullName, email, phone, password, role } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ error: "Barcha maydonlarni to'ldiring" });
    }
    const db = readDB();
    if (!db.users) db.users = [];
    if (db.users.find(u => u.email === email)) {
      return res.status(400).json({ error: 'Bu email allaqachon ro\'yxatdan o\'tgan' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      _id: uuidv4(), fullName, email,
      phone: phone || '', password: hashedPassword,
      role: role || 'client',
      createdAt: new Date().toISOString()
    };
    db.users.push(user);
    writeDB(db);
    const token = jwt.sign({ id: user._id, role: user.role }, SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, fullName, email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const db = readDB();
    if (!db.users) db.users = [];

    // Admin parol: admin@sartaroshxona.uz / admin123
    if (email === 'admin@sartaroshxona.uz' && password === 'admin123') {
      // Admin mavjud emasligini tekshir, kerak bo'lsa yarat
      let admin = db.users.find(u => u.email === email);
      if (!admin) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        admin = {
          _id: uuidv4(), fullName: 'Admin',
          email, phone: '', password: hashedPassword,
          role: 'admin', createdAt: new Date().toISOString()
        };
        db.users.push(admin);
        writeDB(db);
      }
      const token = jwt.sign({ id: admin._id, role: 'admin' }, SECRET, { expiresIn: '7d' });
      return res.json({ token, user: { id: admin._id, fullName: 'Admin', email, role: 'admin' } });
    }

    const user = db.users.find(u => u.email === email);
    if (!user) return res.status(400).json({ error: 'Foydalanuvchi topilmadi' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Parol noto\'g\'ri' });

    const token = jwt.sign({ id: user._id, role: user.role }, SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, fullName: user.fullName, email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// AI Logs
router.get('/ai-logs', (req, res) => {
  const db = readDB();
  res.json(db.aiLogs || []);
});

module.exports = router;
