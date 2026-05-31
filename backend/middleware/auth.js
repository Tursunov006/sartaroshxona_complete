const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'sartaroshxona_secret_2024';

function requireAuth(req, res, next) {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : auth;
    if (!token) return res.status(401).json({ error: 'Token talab qilinadi' });
    try {
        const decoded = jwt.verify(token, SECRET);
        req.user = decoded;
        return next();
    } catch (err) {
        return res.status(401).json({ error: 'Token yaroqsiz' });
    }
}

function requireRole(role) {
    return (req, res, next) => {
        if (!req.user) return res.status(401).json({ error: 'Avtorizatsiya kerak' });
        if (req.user.role !== role) return res.status(403).json({ error: 'Ruxsat yo\'q' });
        next();
    };
}

module.exports = { requireAuth, requireRole };
