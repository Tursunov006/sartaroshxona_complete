import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
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
    <div className="auth-page d-flex align-items-center min-vh-100">
      <Container>
        <Row className="justify-content-center gx-4">
          <Col lg={9}>
            <Row className="g-4 align-items-stretch">
              <Col md={5}>
                <div className="auth-side h-100 d-flex flex-column justify-content-center">
                  <h3 className="mb-3">Xush kelibsiz</h3>
                  <p className="mb-4">Hisobingizga kirib, bronlaringizni boshqaring va tezkor xizmatlardan foydalaning.</p>
                  <div className="rating-pill">⭐ 4.8 mijozlar bahosi</div>
                </div>
              </Col>
              <Col md={7}>
                <Card className="auth-card h-100 p-4">
                  <Card.Body>
                    <h3 className="mb-3">Mijoz kirishi</h3>
                    <p className="text-muted">Elektron pochta va parol orqali kirish.</p>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                      <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control className="form-control-modern" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="example@mail.com" />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Parol</Form.Label>
                        <Form.Control className="form-control-modern" type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
                      </Form.Group>
                      <Button type="submit" className="btn-modern btn-primary w-100" disabled={loading}>
                        {loading ? 'Kutilmoqda...' : 'Kirish'}
                      </Button>
                    </Form>
                    <div className="mt-3 text-center text-muted">
                      Yangi foydalanuvchi? <Link to="/public/register">Ro‘yxatdan o‘tish</Link>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PublicLogin;
