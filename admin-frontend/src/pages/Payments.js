import React, { useEffect, useState } from 'react';
import { Card, Form, Button, Table, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Payments = () => {
    const [payments, setPayments] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [form, setForm] = useState({ bookingId: '', amount: '', method: 'manual' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const token = localStorage.getItem('token');

    const load = () => {
        if (token) {
            axios.get(`${API_URL}/payments`, { headers: { Authorization: `Bearer ${token}` } })
                .then(r => setPayments(r.data || []))
                .catch(() => setError('To‘lovlar yuklanilmadi'));
            axios.get(`${API_URL}/bookings`, { headers: { Authorization: `Bearer ${token}` } })
                .then(r => setBookings(r.data || []))
                .catch(() => { });
        }
    };

    useEffect(() => { load(); }, [token]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        axios.post(`${API_URL}/payments/create`, form)
            .then(() => {
                setSuccess('To‘lov qabul qilindi (placeholder)');
                setTimeout(() => setSuccess(''), 3000);
                setForm({ bookingId: '', amount: '', method: 'manual' });
                load();
            })
            .catch(err => setError(err.response?.data?.error || 'Xatolik yuz berdi'));
    };

    return (
        <div>
            <h2 className="fw-bold mb-4">💳 To‘lovlar</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: 16 }}>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Row className="g-3">
                            <Col md={4}><Form.Group><Form.Label>Bron</Form.Label><Form.Select value={form.bookingId} onChange={e => setForm({ ...form, bookingId: e.target.value })}><option value="">-- Tanlang --</option>{bookings.map(b => <option key={b._id} value={b._id}>{b.customerName} | {b.date} {b.time}</option>)}</Form.Select></Form.Group></Col>
                            <Col md={4}><Form.Group><Form.Label>Summ</Form.Label><Form.Control value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} /></Form.Group></Col>
                            <Col md={4}><Form.Group><Form.Label>Usul</Form.Label><Form.Select value={form.method} onChange={e => setForm({ ...form, method: e.target.value })}><option value="manual">Naqd</option><option value="card">Karta</option><option value="online">Online</option></Form.Select></Form.Group></Col>
                        </Row>
                        <div className="mt-3"><Button type="submit" style={{ background: 'linear-gradient(135deg,#667EEA,#764BA2)', border: 'none' }}>To‘lov yaratish</Button></div>
                    </Form>
                </Card.Body>
            </Card>
            <Card className="border-0 shadow-sm" style={{ borderRadius: 16 }}>
                <Card.Header className="bg-white fw-bold py-3">To‘lovlar</Card.Header>
                <Card.Body>
                    <Table hover responsive>
                        <thead><tr><th>Bron</th><th>Summa</th><th>Usul</th><th>Holat</th><th>Sana</th></tr></thead>
                        <tbody>{payments.map(p => (
                            <tr key={p.id}><td>{p.bookingId}</td><td>{p.amount}</td><td>{p.method}</td><td>{p.status}</td><td>{new Date(p.createdAt).toLocaleString('uz-UZ')}</td></tr>
                        ))}{payments.length === 0 && <tr><td colSpan="5" className="text-center text-muted py-4">To‘lovlar yo‘q</td></tr>}</tbody>
                    </Table>
                </Card.Body>
            </Card>
        </div>
    );
};

export default Payments;
