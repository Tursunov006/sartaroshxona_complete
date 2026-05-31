const cron = require('node-cron');
const { readDB, writeDB } = require('./db');
const { sendReminder } = require('./notifications');

function startReminderScheduler() {
  // Har 5 daqiqada tekshiradi
  cron.schedule('*/5 * * * *', () => {
    const now = new Date();
    const db = readDB();
    let changed = false;

    for (const booking of db.bookings) {
      if (booking.reminderSent || booking.status !== 'pending') continue;

      const bookingTime = new Date(`${booking.date}T${booking.time}`);
      const hoursDiff = (bookingTime - now) / (1000 * 60 * 60);

      if (hoursDiff <= 2 && hoursDiff > 0) {
        const sent = sendReminder(booking);
        if (sent) {
          console.log(`🤖 AI eslatma yuborildi: ${booking.customerName} (${booking.customerPhone}) — ${booking.date} ${booking.time}`);
          booking.reminderSent = true;
          changed = true;
        }
      }
    }

    if (changed) writeDB(db);
  });

  console.log('✅ AI eslatma scheduler ishga tushdi (har 5 daqiqada tekshiradi)');
}

module.exports = { startReminderScheduler };
