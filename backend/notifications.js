// Placeholder notification adapters: SMS and Email
// Replace with real providers (Twilio, SendGrid, etc.) when ready.
const { writeDB, readDB } = require('./db');

function sendSMS(phone, text) {
    // Placeholder: log to console and store in aiLogs
    console.log(`📨 [SMS] To ${phone}: ${text}`);
    const db = readDB();
    if (!db.aiLogs) db.aiLogs = [];
    db.aiLogs.unshift({ id: Date.now().toString(), channel: 'sms', to: phone, text, sentAt: new Date().toISOString() });
    writeDB(db);
    return true;
}

function sendEmail(email, subject, text) {
    console.log(`📧 [Email] To ${email}: ${subject} — ${text}`);
    const db = readDB();
    if (!db.aiLogs) db.aiLogs = [];
    db.aiLogs.unshift({ id: Date.now().toString(), channel: 'email', to: email, subject, text, sentAt: new Date().toISOString() });
    writeDB(db);
    return true;
}

function sendReminder(booking) {
    const text = `Eslatma: sizning broningiz ${booking.date} ${booking.time} — ${booking.serviceName || ''}`;
    // Prefer SMS to phone if available
    if (booking.customerPhone) return sendSMS(booking.customerPhone, text);
    if (booking.customerEmail) return sendEmail(booking.customerEmail, 'Eslatma: Bron', text);
    console.log('⚠️ No contact to send reminder for booking', booking._id);
    return false;
}

module.exports = { sendSMS, sendEmail, sendReminder };
