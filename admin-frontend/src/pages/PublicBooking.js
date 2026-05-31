import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const PublicBooking = () => {
    const [services, setServices] = useState([]);
    const [barbers, setBarbers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const [form, setForm] = useState({
        customerName: '', customerPhone: '', serviceId: '', barberId: '', date: '', time: ''
    });

    useEffect(() => {
        let mounted = true;
        Promise.all([
            axios.get(`${API_URL}/services`),
            axios.get(`${API_URL}/barbers`)
        ]).then(([s, b]) => {
            if (!mounted) return;
            setServices(s.data || []);
            setBarbers(b.data || []);
        }).catch(() => { }).finally(() => mounted && setLoading(false));
        return () => { mounted = false; };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); setMessage('');
        if (!form.customerName || !form.customerPhone || !form.serviceId || !form.barberId || !form.date || !form.time) {
            return setError('Iltimos barcha maydonlarni to‘ldiring');
        }
        setSaving(true);
        try {
            const res = await axios.post(`${API_URL}/bookings`, form);
            if (res.status === 201) {
                setMessage(res.data.message || 'Bron yaratildi');
                setForm({ customerName: '', customerPhone: '', serviceId: '', barberId: '', date: '', time: '' });
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Xatolik yuz berdi');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-center py-5"><Spinner animation="border" /></div>;

    return (
        <div>
            <h2 className="fw-bold mb-4">✂️ Online bron</h2>
            <Card className="border-0 shadow-sm" style={{ borderRadius: 16 }}>
                <Card.Body>
                    {message && <Alert variant="success">{message}</Alert>}
                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Mijoz ismi</Form.Label>
                            <Form.Control value={form.customerName} onChange={e => setForm({ ...form, customerName: e.target.value })} />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Telefon (+998...)</Form.Label>
                            <Form.Control value={form.customerPhone} onChange={e => setForm({ ...form, customerPhone: e.target.value })} placeholder="+998901234567" />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Xizmat</Form.Label>
                            <Form.Select value={form.serviceId} onChange={e => setForm({ ...form, serviceId: e.target.value })}>
                                <option value="">— Tanlang —</option>
                                {services.map(s => <option key={s.id || s._id} value={s.id || s._id}>{s.name} — {Number(s.price).toLocaleString('uz-UZ')} so'm</option>)}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Sartarosh</Form.Label>
                            <Form.Select value={form.barberId} onChange={e => setForm({ ...form, barberId: e.target.value })}>
                                <option value="">— Tanlang —</option>
                                {barbers.map(b => <option key={b.id || b._id} value={b.id || b._id}>{b.name}</option>)}
                            </Form.Select>
                        </Form.Group>

                        <div className="d-flex gap-2">
                            <Form.Group className="mb-3" style={{ flex: 1 }}>
                                <Form.Label>Sana</Form.Label>
                                <Form.Control type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                            </Form.Group>
                            <Form.Group className="mb-3" style={{ flex: 1 }}>
                                <Form.Label>Vaqt</Form.Label>
                                <Form.Control type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} />
                            </Form.Group>
                        </div>

                        <div className="mt-3">
                            <Button type="submit" disabled={saving} style={{ background: 'linear-gradient(135deg,#667EEA,#764BA2)', border: 'none' }}>
                                {saving ? 'Saqlanmoqda...' : '🟢 Bron qilish'}
                            </Button>
                        </div>
                    </Form>

                    <hr />
                    <div className="text-muted small">Agar backend lokal bo'lsa, `http://localhost:5000/api` ishlatiladi.</div>
                </Card.Body>
            </Card>
        </div>
    );
};

export default PublicBooking;
