import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const Settings = () => {
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  const [form, setForm] = useState({
    siteName: 'Sartaroshxona.uz',
    adminEmail: 'admin@sartaroshxona.uz',
    phone: '+998 94 769 07 76',
    address: "Toshkent sh., Markaziy ko'cha 15",
    openTime: '09:00',
    closeTime: '20:00',
    reminderHours: '2',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    axios.get(`${API_URL}/settings`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => setForm(r.data))
      .catch(() => { });
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    setError('');
    if (!token) return setError('Admin sifatida tizimga kiring');
    axios.post(`${API_URL}/settings`, form, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      })
      .catch(err => setError(err.response?.data?.error || 'Saqlashda xatolik'));
  };

  return (
    <div>
      <h2 className="fw-bold mb-4">⚙️ Sozlamalar</h2>

      {saved && <Alert variant="success">✅ Sozlamalar saqlandi!</Alert>}

      <Form onSubmit={handleSave}>
        <Row className="g-4">
          <Col md={6}>
            <Card className="border-0 shadow-sm" style={{ borderRadius: 16 }}>
              <Card.Header className="bg-white fw-bold py-3">🌐 Umumiy</Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Sayt nomi</Form.Label>
                  <Form.Control value={form.siteName} onChange={e => setForm({ ...form, siteName: e.target.value })} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Admin email</Form.Label>
                  <Form.Control type="email" value={form.adminEmail} onChange={e => setForm({ ...form, adminEmail: e.target.value })} />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Telefon</Form.Label>
                  <Form.Control value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="border-0 shadow-sm" style={{ borderRadius: 16 }}>
              <Card.Header className="bg-white fw-bold py-3">⏰ Ish vaqti</Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Manzil</Form.Label>
                  <Form.Control value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
                </Form.Group>
                <Row>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Ochilish</Form.Label>
                      <Form.Control type="time" value={form.openTime} onChange={e => setForm({ ...form, openTime: e.target.value })} />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Yopilish</Form.Label>
                      <Form.Control type="time" value={form.closeTime} onChange={e => setForm({ ...form, closeTime: e.target.value })} />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group>
                  <Form.Label>🤖 AI eslatma (soat oldin)</Form.Label>
                  <Form.Control type="number" value={form.reminderHours} min="1" max="24"
                    onChange={e => setForm({ ...form, reminderHours: e.target.value })} />
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <div className="mt-3">
          <Button type="submit" style={{ background: 'linear-gradient(135deg,#667EEA,#764BA2)', border: 'none', borderRadius: 10, padding: '10px 32px' }}>
            💾 Saqlash
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default Settings;
