const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS — Flutter web va React uchun
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5001'],
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/api/test', (req, res) => {
  res.json({
    message: '✅ Server ishlayapti!',
    time: new Date().toLocaleString('uz-UZ'),
    version: '2.0'
  });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/services', require('./routes/services'));
app.use('/api/barbers', require('./routes/barbers'));
app.use('/api/shops', require('./routes/shops'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/users', require('./routes/users'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/calendar', require('./routes/calendar'));

// 404 handler
app.use((req, res) => res.status(404).json({ error: 'Route topilmadi' }));

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Xatolik:', err.message);
  res.status(500).json({ error: 'Server xatoligi' });
});

const { startReminderScheduler } = require('./reminderScheduler');
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server port ${PORT} da ishlamoqda`);
  console.log(`🔗 Test: http://localhost:${PORT}/api/test`);
  startReminderScheduler();
});
