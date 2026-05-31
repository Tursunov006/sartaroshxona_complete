const router = require('express').Router();
const { readDB, writeDB } = require('../db');
const { v4: uuidv4 } = require('uuid');
const { requireAuth, requireRole } = require('../middleware/auth');

// Public: list shops
router.get('/', (req, res) => {
    try {
        const db = readDB();
        res.json(db.shops || []);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Public: find nearby shops by lat/lng within radius (km)
router.get('/nearby', (req, res) => {
    try {
        const { lat, lng, radius } = req.query;
        if (!lat || !lng) return res.status(400).json({ error: 'lat and lng required' });
        const rKm = Number(radius || 5);
        const db = readDB();
        const toRad = (v) => v * Math.PI / 180;
        const haversine = (lat1, lon1, lat2, lon2) => {
            const R = 6371; // km
            const dLat = toRad(lat2 - lat1);
            const dLon = toRad(lon2 - lon1);
            const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c;
        };

        const shops = (db.shops || []).map(s => {
            if (s.lat == null || s.lng == null) return { ...s, distance: null };
            const d = haversine(Number(lat), Number(lng), Number(s.lat), Number(s.lng));
            return { ...s, distance: Math.round(d * 100) / 100 };
        }).filter(s => s.distance === null ? false : s.distance <= rKm)
            .sort((a, b) => a.distance - b.distance);

        res.json(shops);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin: create shop
router.post('/', requireAuth, requireRole('admin'), (req, res) => {
    try {
        const { name, address, phone, lat, lng, instagram } = req.body;
        if (!name) return res.status(400).json({ error: 'Name required' });
        const db = readDB();
        const shop = { id: uuidv4(), name, address: address || '', phone: phone || '', lat: lat || null, lng: lng || null, instagram: instagram || '' };
        db.shops = db.shops || [];
        db.shops.push(shop);
        writeDB(db);
        res.status(201).json({ message: 'Shop created', shop });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin: update shop
router.patch('/:id', requireAuth, requireRole('admin'), (req, res) => {
    try {
        const { name, address, phone, lat, lng, instagram } = req.body;
        const db = readDB();
        const idx = db.shops.findIndex(s => s.id === req.params.id);
        if (idx === -1) return res.status(404).json({ error: 'Shop not found' });
        db.shops[idx] = {
            ...db.shops[idx],
            name: name ?? db.shops[idx].name,
            address: address ?? db.shops[idx].address,
            phone: phone ?? db.shops[idx].phone,
            lat: lat ?? db.shops[idx].lat,
            lng: lng ?? db.shops[idx].lng,
            instagram: instagram ?? db.shops[idx].instagram,
        };
        writeDB(db);
        res.json({ message: 'Shop updated', shop: db.shops[idx] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin: delete shop
router.delete('/:id', requireAuth, requireRole('admin'), (req, res) => {
    try {
        const db = readDB();
        const before = db.shops.length;
        db.shops = db.shops.filter(s => s.id !== req.params.id);
        if (db.shops.length === before) return res.status(404).json({ error: 'Shop not found' });
        writeDB(db);
        res.json({ message: 'Shop deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
