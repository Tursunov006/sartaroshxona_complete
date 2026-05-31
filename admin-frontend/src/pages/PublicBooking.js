import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Alert, Spinner, Row, Col } from 'react-bootstrap';
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

        const load = async () => {
            try {
                const [s, b] = await Promise.all([
                    axios.get(`${API_URL}/services`),
                    axios.get(`${API_URL}/barbers`)
                ]);
                if (!mounted) return;
                setServices(s.data || []);
                setBarbers(b.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        load();
        return () => { mounted = false; };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

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
                <span>Sizga mos sartaroshni yangi uslubda band qiling</span>
            </div>

            <Row className="g-4 align-items-start">
                <Col lg={6}>
                    <Card className="card-modern p-4">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div>
                                <h3>Saqlangan bron</h3>
                                <p className="small-note mb-0">Bir necha qadamda buyurtma yuboring.</p>
                            </div>
                            <span className="step-pill">01</span>
                        </div>

                        {message && <Alert variant="success">{message}</Alert>}
                        {error && <Alert variant="danger">{error}</Alert>}

                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Mijoz ismi</Form.Label>
                                <Form.Control
                                    className="form-control-modern"
                                    value={form.customerName}
                                    onChange={e => setForm({ ...form, customerName: e.target.value })}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Telefon</Form.Label>
                                <Form.Control
                                    className="form-control-modern"
                                    value={form.customerPhone}
                                    onChange={e => setForm({ ...form, customerPhone: e.target.value })}
                                    placeholder="+998901234567"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Xizmat</Form.Label>
                                <Form.Select
                                    className="form-select-modern"
                                    value={form.serviceId}
                                    onChange={e => setForm({ ...form, serviceId: e.target.value })}
                                >
                                    <option value="">— Tanlang —</option>
                                    {services.map(s => (
                                        <option key={s.id || s._id} value={s.id || s._id}>{s.name} — {Number(s.price).toLocaleString('uz-UZ')} so'm</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Sartarosh</Form.Label>
                                <Form.Select
                                    className="form-select-modern"
                                    value={form.barberId}
                                    onChange={e => setForm({ ...form, barberId: e.target.value })}
                                >
                                    <option value="">— Tanlang —</option>
                                    {barbers.map(b => (
                                        <option key={b.id || b._id} value={b.id || b._id}>{b.name}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            <Row className="g-3">
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Sana</Form.Label>
                                        <Form.Control
                                            className="form-control-modern"
                                            type="date"
                                            value={form.date}
                                            onChange={e => setForm({ ...form, date: e.target.value })}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Vaqt</Form.Label>
                                        <Form.Control
                                            className="form-control-modern"
                                            type="time"
                                            value={form.time}
                                            onChange={e => setForm({ ...form, time: e.target.value })}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <div className="mt-4">
                                <Button type="submit" className="btn-modern btn-light w-100" disabled={saving}>
                                    {saving ? 'Saqlanmoqda...' : 'Bron qilish'}
                                </Button>
                            </div>
                        </Form>

                        <div className="mt-4 small-note">Ma'lumotlar `http://localhost:5000/api` orqali yuboriladi.</div>
                    </Card>
                </Col>

                <Col lg={6}>
                    <Card className="glass-card p-4 h-100">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div>
                                <h4>Bron jarayoni</h4>
                                <p className="small-note mb-0">Bosqichma-bosqich ko‘rsatma bilan tezkor natijaga erishasiz.</p>
                            </div>
                            <span className="step-pill">02</span>
                        </div>

                        <div className="list-panel">
                            <div className="mb-3">
                                <strong>1. Xizmat tanlang</strong>
                                <p className="small-note mb-0">Mijozga mos xizmatni belgilang.</p>
                            </div>
                            <div className="mb-3">
                                <strong>2. Sartaroshni tanlang</strong>
                                <p className="small-note mb-0">Eng tajribali ustani tanlang.</p>
                            </div>
                            <div>
                                <strong>3. Sana va vaqt</strong>
                                <p className="small-note mb-0">O‘z vaqtingizga mos keluvchi joyni band qiling.</p>
                            </div>
                        </div>

                        <div className="mt-5 bg-soft p-4 rounded-4">
                            <h5 className="mb-3">Nega aynan biz?</h5>
                            <p className="small-note mb-2">Ijodkorlik va qulaylik bir joyda.</p>
                            <p className="small-note mb-0">Shaxsiy profil, sharhlar va bron tarixini bir joyda boshqaring.</p>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default PublicBooking;
