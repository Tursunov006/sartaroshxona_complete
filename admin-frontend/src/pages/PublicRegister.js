import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const PublicRegister = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/auth/register`, {
        fullName,
        email,
        phone,
        password,
        role: 'client'
      });
      localStorage.setItem('publicToken', res.data.token);
      localStorage.setItem('publicUser', JSON.stringify(res.data.user));
      navigate('/public');
    } catch (err) {
      setError(err.response?.data?.error || 'Ro‘yxatdan o‘tishda xatolik yuz berdi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100" style={{ background: '#F8FAFF' }}>
      <Container style={{ maxWidth: '460px' }}>
        <Card className="border-0 shadow-lg" style={{ borderRadius: 20 }}>
          <Card.Body className="p-4">
            <h3 className="mb-3">Ro‘yxatdan o‘tish</h3>
            <p className="text-muted">Hisob yarating va bronlaringizni boshqaring.</p>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>To‘liq ism</Form.Label>
                <Form.Control value={fullName} onChange={e => setFullName(e.target.value)} required placeholder="Ismingiz" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="example@mail.com" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Telefon</Form.Label>
                <Form.Control value={phone} onChange={e => setPhone(e.target.value)} placeholder="+998901234567" />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>Parol</Form.Label>
                <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
              </Form.Group>
              <Button type="submit" className="w-100" disabled={loading}>
                {loading ? 'Yuborilmoqda...' : 'Ro‘yxatdan o‘tish'}
              </Button>
            </Form>
            <div className="mt-3 text-center text-muted">
              Hisobingiz bormi? <Link to="/public/login">Kirish</Link>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default PublicRegister;
