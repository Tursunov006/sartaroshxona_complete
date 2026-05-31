import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const PublicLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      if (res.data.user.role === 'admin') {
        return setError('Admin uchun admin paneldan kirishingiz kerak.');
      }
      localStorage.setItem('publicToken', res.data.token);
      localStorage.setItem('publicUser', JSON.stringify(res.data.user));
      navigate('/public');
    } catch (err) {
      setError(err.response?.data?.error || 'Email yoki parol noto‘g‘ri.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100" style={{ background: '#F8FAFF' }}>
      <Container style={{ maxWidth: '420px' }}>
        <Card className="border-0 shadow-lg" style={{ borderRadius: 20 }}>
          <Card.Body className="p-4">
            <h3 className="mb-3">Mijoz kirishi</h3>
            <p className="text-muted">Elektron pochta va parol orqali kirish.</p>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="example@mail.com" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Parol</Form.Label>
                <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
              </Form.Group>
              <Button type="submit" className="w-100" disabled={loading}>
                {loading ? 'Kutilmoqda...' : 'Kirish'}
              </Button>
            </Form>
            <div className="mt-3 text-center text-muted">
              Yangi foydalanuvchi? <Link to="/public/register">Ro‘yxatdan o‘tish</Link>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default PublicLogin;
