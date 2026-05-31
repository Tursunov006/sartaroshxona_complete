import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Alert, Spinner, Row, Col, ListGroup } from 'react-bootstrap';
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
        <div className="public-page">
            <div className="section-title mb-4">
                <h2>Online bron</h2>
                <span>Sizga eng yaqin sartaroshni hoziroq band qiling</span>
            </div>
            <Row className="g-4">
                <Col lg={7}>
                    <Card className="card-modern p-4">
                        <Card.Body>
                            {message && <Alert variant="success">{message}</Alert>}
                            {error && <Alert variant="danger">{error}</Alert>}

                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Mijoz ismi</Form.Label>
                                    <Form.Control className="form-control-modern" value={form.customerName} onChange={e => setForm({ ...form, customerName: e.target.value })} />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Telefon (+998...)</Form.Label>
                                    <Form.Control className="form-control-modern" value={form.customerPhone} onChange={e => setForm({ ...form, customerPhone: e.target.value })} placeholder="+998901234567" />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Xizmat</Form.Label>
                                    <Form.Select className="form-select-modern" value={form.serviceId} onChange={e => setForm({ ...form, serviceId: e.target.value })}>
                                        <option value="">— Tanlang —</option>
                                        {services.map(s => <option key={s.id || s._id} value={s.id || s._id}>{s.name} — {Number(s.price).toLocaleString('uz-UZ')} so'm</option>)}
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Sartarosh</Form.Label>
                                    <Form.Select className="form-select-modern" value={form.barberId} onChange={e => setForm({ ...form, barberId: e.target.value })}>
                                        <option value="">— Tanlang —</option>
                                        {barbers.map(b => <option key={b.id || b._id} value={b.id || b._id}>{b.name}</option>)}
                                    </Form.Select>
                                </Form.Group>

                                <Row className="g-3">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Sana</Form.Label>
                                            <Form.Control className="form-control-modern" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Vaqt</Form.Label>
                                            <Form.Control className="form-control-modern" type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <div className="mt-4">
                                    <Button type="submit" className="btn-modern btn-primary w-100" disabled={saving}>
                                        {saving ? 'Saqlanmoqda...' : 'Bron qilish'}
                                    </Button>
                                </div>
                            </Form>

                            <div className="mt-4 text-muted small">Agar backend lokal bo'lsa, `http://localhost:5000/api` ishlatiladi.</div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={5}>
                    <Card className="glass-card p-4 h-100">
                        <h4 className="mb-3">Nima uchun biz?</h4>
                        <p className="text-muted">Sartaroshlarni tanlash, xizmatlarni ko‘rish va bronni tasdiqlash endi bir joyda.</p>
                        <ListGroup variant="flush" className="mt-4 gap-3">
                            <ListGroup.Item className="border-0 bg-transparent p-0">
                                <strong>⏱ Tez bron</strong>
                                <div className="text-muted small">Bir necha daqiqada joy band qiling.</div>
                            </ListGroup.Item>
                            <ListGroup.Item className="border-0 bg-transparent p-0">
                                <strong>⭐ Haqiqiy sharhlar</strong>
                                <div className="text-muted small">Foydalanuvchilarning baholari bilan tanlang.</div>
                            </ListGroup.Item>
                            <ListGroup.Item className="border-0 bg-transparent p-0">
                                <strong>📍 Yaqqol manzillar</strong>
                                <div className="text-muted small">Har bir salon manzili aniq ko‘rsatiladi.</div>
                            </ListGroup.Item>
                        </ListGroup>
                        <div className="mt-5 p-3 rounded-4 bg-light">
                            <div className="fw-bold mb-2">Tanlangan imkoniyatlar</div>
                            <div className="text-muted small">Online bron, sharhlar va xarita qidiruvini bitta platformada oling.</div>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default PublicBooking;
