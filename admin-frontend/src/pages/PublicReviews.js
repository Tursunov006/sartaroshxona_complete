import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Form, Button, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const PublicReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [shops, setShops] = useState([]);
    const [barbers, setBarbers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [form, setForm] = useState({ userName: '', rating: 5, comment: '', shopId: '', barberId: '' });

    useEffect(() => {
        let mounted = true;
        const load = async () => {
            try {
                const [reviewRes, shopRes, barberRes] = await Promise.all([
                    axios.get(`${API_URL}/reviews`),
                    axios.get(`${API_URL}/shops`),
                    axios.get(`${API_URL}/barbers`)
                ]);
                if (!mounted) return;
                setReviews(reviewRes.data || []);
                setShops(shopRes.data || []);
                setBarbers(barberRes.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                mounted && setLoading(false);
            }
        };
        load();
        return () => { mounted = false; };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (!form.rating || (!form.shopId && !form.barberId)) {
            return setError('Iltimos qiymat va salon yoki sartaroshni tanlang.');
        }
        setSaving(true);
        try {
            const payload = {
                userName: form.userName || 'Mehmon',
                rating: form.rating,
                comment: form.comment,
                shopId: form.shopId || null,
                barberId: form.barberId || null
            };
            const res = await axios.post(`${API_URL}/reviews`, payload);
            setSuccess(res.data.message || 'Sharh yuborildi');
            setReviews(prev => [res.data.review, ...prev]);
            setForm({ userName: '', rating: 5, comment: '', shopId: '', barberId: '' });
        } catch (err) {
            setError(err.response?.data?.error || 'Sharh yuborishda xatolik yuz berdi');
        } finally {
            setSaving(false);
        }
    };

    const getTargetName = (review) => {
        if (review.shopId) {
            const shop = shops.find(item => item.id === review.shopId || item._id === review.shopId);
            return shop ? `Salon: ${shop.name}` : `Salon: ${review.shopId}`;
        }
        if (review.barberId) {
            const barber = barbers.find(item => item.id === review.barberId || item._id === review.barberId);
            return barber ? `Sartarosh: ${barber.name}` : `Sartarosh: ${review.barberId}`;
        }
        return '';
    };

    return (
        <div>
            <h2 className="mb-4">Sharhlar</h2>
            <Row className="g-4">
                <Col lg={6}>
                    <Card className="shadow-sm">
                        <Card.Body>
                            {error && <Alert variant="danger">{error}</Alert>}
                            {success && <Alert variant="success">{success}</Alert>}
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Ism</Form.Label>
                                    <Form.Control value={form.userName} onChange={e => setForm({ ...form, userName: e.target.value })} placeholder="Ismingiz" />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Baholash</Form.Label>
                                    <Form.Select value={form.rating} onChange={e => setForm({ ...form, rating: Number(e.target.value) })}>
                                        {[5, 4, 3, 2, 1].map(value => <option key={value} value={value}>{value} yulduz</option>)}
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Sharh</Form.Label>
                                    <Form.Control as="textarea" rows={4} value={form.comment} onChange={e => setForm({ ...form, comment: e.target.value })} placeholder="O‘z fikringizni yozing" />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Salon</Form.Label>
                                    <Form.Select value={form.shopId} onChange={e => setForm({ ...form, shopId: e.target.value, barberId: '' })}>
                                        <option value="">— Salon tanlang —</option>
                                        {shops.map(shop => <option key={shop.id || shop._id} value={shop.id || shop._id}>{shop.name}</option>)}
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>yoki Sartarosh</Form.Label>
                                    <Form.Select value={form.barberId} onChange={e => setForm({ ...form, barberId: e.target.value, shopId: '' })}>
                                        <option value="">— Sartarosh tanlang —</option>
                                        {barbers.map(barber => <option key={barber.id || barber._id} value={barber.id || barber._id}>{barber.name}</option>)}
                                    </Form.Select>
                                </Form.Group>
                                <Button type="submit" disabled={saving} variant="primary">{saving ? 'Yuborilmoqda...' : 'Sharh yuborish'}</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={6}>
                    {loading ? (
                        <div className="text-center py-5"><Spinner animation="border" /></div>
                    ) : (
                        <div className="d-grid gap-3">
                            {reviews.length === 0 && <p className="text-muted">Hozircha hech qanday sharh yo'q.</p>}
                            {reviews.map(review => (
                                <Card key={review.id || review._id} className="shadow-sm">
                                    <Card.Body>
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <strong>{review.userName || 'Mehmon'}</strong>
                                            <span className="text-warning">{review.rating}⭐</span>
                                        </div>
                                        <p>{review.comment || 'Sharh mavjud emas'}</p>
                                        <div className="text-muted small">{getTargetName(review)}</div>
                                    </Card.Body>
                                </Card>
                            ))}
                        </div>
                    )}
                </Col>
            </Row>
        </div>
    );
};

export default PublicReviews;
