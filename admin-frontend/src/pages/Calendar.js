import React, { useEffect, useState } from 'react';
import { Card, Form, Button, Table, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const CalendarPage = () => {
    const [barbers, setBarbers] = useState([]);
    const [services, setServices] = useState([]);
    const [slots, setSlots] = useState([]);
    const [form, setForm] = useState({ barberId: '', serviceId: '', date: new Date().toISOString().slice(0, 10) });
    const [availabilityText, setAvailabilityText] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const token = localStorage.getItem('token');

    useEffect(() => {
        axios.get(`${API_URL}/barbers`).then(r => setBarbers(r.data || [])).catch(() => { });
        axios.get(`${API_URL}/services`).then(r => setServices(r.data || [])).catch(() => { });
    }, []);

    const loadSlots = () => {
        if (!form.barberId || !form.serviceId || !form.date) return;
        setError('');
        axios.get(`${API_URL}/calendar/availability`, { params: form })
            .then(r => setSlots(r.data.slots || []))
            .catch(err => setError(err.response?.data?.error || 'Slotlar yuklanmadi'));
    };

    const handleSave = () => {
        if (!token) return setError('Admin sifatida tizimga kiring');
        try {
            const availability = JSON.parse(availabilityText);
            axios.post(`${API_URL}/calendar/set`, { barberId: form.barberId, availability }, { headers: { Authorization: `Bearer ${token}` } })
                .then(() => { setSuccess('Availability saved'); setTimeout(() => setSuccess(''), 3000); })
                .catch(err => setError(err.response?.data?.error || 'Saqlashda xato'));
        } catch (err) {
            setError('JSON formati xato');
        }
    };

    return (
        <div>
            <h2 className="fw-bold mb-4">📅 Sartarosh kalendar</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: 16 }}>
                <Card.Body>
                    <Row className="g-3">
                        <Col md={4}><Form.Group><Form.Label>Sartarosh</Form.Label><Form.Select value={form.barberId} onChange={e => setForm({ ...form, barberId: e.target.value })}><option value="">-- Tanlang --</option>{barbers.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}</Form.Select></Form.Group></Col>
                        <Col md={4}><Form.Group><Form.Label>Xizmat</Form.Label><Form.Select value={form.serviceId} onChange={e => setForm({ ...form, serviceId: e.target.value })}><option value="">-- Tanlang --</option>{services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</Form.Select></Form.Group></Col>
                        <Col md={4}><Form.Group><Form.Label>Sana</Form.Label><Form.Control type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></Form.Group></Col>
                    </Row>
                    <div className="mt-3"><Button onClick={loadSlots} style={{ background: 'linear-gradient(135deg,#667EEA,#764BA2)', border: 'none' }}>Slotlarni ko‘rsatish</Button></div>
                </Card.Body>
            </Card>
            <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: 16 }}>
                <Card.Header className="bg-white fw-bold py-3">Bo'sh slotlar</Card.Header>
                <Card.Body>
                    <Table hover responsive>
                        <thead><tr><th>Vaqt</th></tr></thead>
                        <tbody>{slots.map((slot, idx) => <tr key={idx}><td>{slot}</td></tr>)}{slots.length === 0 && <tr><td className="text-center text-muted py-4">Slotlar mavjud emas</td></tr>}</tbody>
                    </Table>
                </Card.Body>
            </Card>
            <Card className="border-0 shadow-sm" style={{ borderRadius: 16 }}>
                <Card.Header className="bg-white fw-bold py-3">Haftalik availability sozlash (JSON)</Card.Header>
                <Card.Body>
                    <p className="text-muted">Masalan: {`{ "monday": [{"from":"09:00","to":"17:00"}], "tuesday": [{"from":"10:00","to":"18:00"}] }`}</p>
                    <Form.Group><Form.Control as="textarea" rows={6} value={availabilityText} onChange={e => setAvailabilityText(e.target.value)} /></Form.Group>
                    <div className="mt-3"><Button onClick={handleSave} style={{ background: 'linear-gradient(135deg,#667EEA,#764BA2)', border: 'none' }}>Saqlash</Button></div>
                </Card.Body>
            </Card>
        </div>
    );
};

export default CalendarPage;
